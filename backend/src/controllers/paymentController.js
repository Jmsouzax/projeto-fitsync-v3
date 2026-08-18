import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';
import { getPlan } from '../config/plans.js';

dotenv.config();

// Inicializamos o cliente do MercadoPago com o Token
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

/**
 * Rota 1: Gera o Link (Preference) para o usuário pagar.
 *
 * SEGURANÇA: o cliente envia apenas o `planId`. O título e o PREÇO são
 * resolvidos no servidor a partir do catálogo (config/plans.js). Qualquer
 * `price` enviado pelo frontend é ignorado — isso elimina a fraude de
 * "pagar R$ 0,01 por um plano premium".
 */
export async function criarPagamento(req, res) {
    try {
        const { userId, planId } = req.body; // Vem do Frontend quando o cliente clica em "Pagar"

        // Validação de entrada
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'userId é obrigatório.' });
        }

        const plan = getPlan(planId);
        if (!plan) {
            return res.status(400).json({ error: 'Plano inválido.' });
        }

        const preference = new Preference(client);
        const backendUrl = process.env.BACKEND_URL || 'https://projeto-fitsync-v3.onrender.com';
        const frontendUrl = process.env.FRONTEND_URL || 'https://projeto-fitsync-v3.vercel.app'; // Fallback genérico para evitar erro 500

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: planId,
                        title: plan.title,     // título vindo do servidor
                        quantity: 1,
                        unit_price: plan.price, // PREÇO vindo do servidor (nunca do cliente)
                    }
                ],
                // O external_reference é CRUCIAL!
                // É através dele que no Webhook saberemos qual usuário pagou.
                external_reference: userId,

                // URLs caso o fluxo seja via Checkout Pro (Site do mercadopago)
                back_urls: {
                    success: `${frontendUrl}/sucesso`,
                    failure: `${frontendUrl}/falha`,
                    pending: `${frontendUrl}/pendente`
                },
                auto_return: "approved",

                // Configuração vital para a Rota 2 ser notificada quando o status mudar!
                notification_url: `${backendUrl}/api/webhook/mercadopago`
            }
        });

        // Retornamos ao frontend os links para redirecionamento
        return res.status(200).json({
            id: response.id,
            init_point: response.init_point // Link de pagamento
        });

    } catch (error) {
        console.error('Erro ao gerar preferência de pagamento:', error);
        return res.status(500).json({ error: 'Erro ao conectar ao gateway de pagamentos.' });
    }
}

/**
 * Valida a assinatura (x-signature) enviada pelo Mercado Pago no webhook.
 *
 * Sem essa checagem, qualquer pessoa poderia chamar o webhook. A validação
 * segue o padrão do MP: monta um "manifest" com o id da notificação, o
 * x-request-id e o timestamp, calcula um HMAC-SHA256 com a chave secreta e
 * compara com o hash `v1` do header.
 *
 * Comportamento por ambiente:
 *  - Se MERCADOPAGO_WEBHOOK_SECRET estiver definido → assinatura é OBRIGATÓRIA.
 *  - Se não estiver definido → apenas registra um aviso (modo demo), para o
 *    projeto continuar rodando em avaliação sem a chave configurada.
 */
function assinaturaWebhookValida(req) {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret) {
        console.warn('[webhook] MERCADOPAGO_WEBHOOK_SECRET não definido — validação de assinatura DESATIVADA (não use assim em produção).');
        return true;
    }

    const signature = req.headers['x-signature'];
    const requestId = req.headers['x-request-id'];
    const dataId = req.query?.['data.id'] || req.body?.data?.id;

    if (!signature || !dataId) return false;

    // x-signature vem como "ts=<timestamp>,v1=<hash>"
    const parts = Object.fromEntries(
        String(signature).split(',').map((kv) => {
            const [k, v] = kv.split('=');
            return [k?.trim(), v?.trim()];
        })
    );
    const ts = parts.ts;
    const hash = parts.v1;
    if (!ts || !hash) return false;

    // O id alfanumérico deve ser comparado em minúsculas (recomendação do MP)
    const idNormalizado = String(dataId).toLowerCase();
    const manifest = `id:${idNormalizado};request-id:${requestId};ts:${ts};`;

    const esperado = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    try {
        return crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(hash));
    } catch {
        return false; // tamanhos diferentes → inválido
    }
}

/**
 * Rota 2: Webhook - Recebe a notificação (payment.updated) e Libera no Supabase.
 */
export async function webhookMercadoPago(req, res) {
    try {
        // 1. Valida a autenticidade da notificação ANTES de qualquer processamento.
        if (!assinaturaWebhookValida(req)) {
            console.warn('[webhook] Assinatura inválida — requisição rejeitada.');
            return res.status(401).send('Assinatura inválida');
        }

        // O Mercado Pago envia o campo type ou topic e o ID da transação (data.id)
        const topic = req.body?.type || req.query?.topic;
        const paymentId = req.body?.data?.id || req.query?.['data.id'];

        // É OBRIGATÓRIO responder com 200/201 imediatamente para o Mercado Pago não achar que a requisição caiu.
        res.status(200).send('OK');

        // Verificamos se foi um evento de pagamento (payment) e se veio um ID
        if (topic === 'payment' && paymentId) {

            // Buscamos os detalhes consolidados daquele pagamento pelo ID na API do MP
            const paymentInfo = new Payment(client);
            const paymentData = await paymentInfo.get({ id: paymentId });

            const status = paymentData.status; // 'approved', 'pending', 'rejected', etc..
            const userId = paymentData.external_reference; // Resgatamos o ID do Supabase que passamos na Preference

            // Se o Mercado Pago der a ordem de "Aprovado" e tivermos o ID: Liberamos o perfil
            if (status === 'approved' && userId) {
                const { error } = await supabase
                    .from('profiles')
                    .update({ status_pagamento: 'ativo' })
                    .eq('id', userId); // Verifica o ID da linha

                if (error) {
                    console.error(`Erro ao atualizar Supabase para usuário ${userId}:`, error.message);
                } else {
                    console.log(`Sucesso: O usuário ${userId} agora é ATIVO.`);
                }
            }
        }
    } catch (error) {
        console.error('Erro ao processar Webhook do Mercado Pago:', error);
        // Se a resposta ainda não foi enviada, garantimos um 200 para o MP não reenviar em loop.
        if (!res.headersSent) {
            res.status(200).send('OK');
        }
    }
}
