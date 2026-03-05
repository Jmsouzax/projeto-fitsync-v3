import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

// Inicializamos o cliente do MercadoPago com o Token
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

/**
 * Rota 1: Gera o Link (Preference) para o usuário pagar
 */
export async function criarPagamento(req, res) {
    try {
        const { userId, planTitle, price } = req.body; // Vem do Frontend quando o cliente clica em "Pagar"

        // Instancia a classe Preference com nossa configuração
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: 'item-plano-premium',
                        title: planTitle,
                        quantity: 1,
                        unit_price: price, // Ex: 49.90
                    }
                ],
                // O external_reference é CRUCIAL! 
                // É através dele que no Webhook saberemos qual usuário pagou.
                external_reference: userId,

                // URLs caso o fluxo seja via Checkout Pro (Site do mercadopago)
                back_urls: {
                    success: "https://seusite.com/sucesso",
                    failure: "https://seusite.com/falha",
                    pending: "https://seusite.com/pendente"
                },
                auto_return: "approved",

                // Configuração vital para a Rota 2 ser notificada quando o status mudar!
                // IMPORTANTE: Deve ser uma URL pública (utilize serviços como Ngrok para testes locais)
                notification_url: "https://seusite.com/api/webhook/mercadopago"
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
 * Rota 2: Webhook - Recebe a notificação (payment.updated) e Libera no Supabase
 */
export async function webhookMercadoPago(req, res) {
    try {
        // O Mercado Pago envia o campo type ou topic e o ID da transação (data.id)
        const topic = req.body?.type || req.query?.topic;
        const paymentId = req.body?.data?.id || req.query?.['data.id'];

        // É OBRIGATÓRIO responder com 200/201 imediatamente para o Mercado Pago não achar que a requisição caiu.
        res.status(200).send('OK');

        // Verificamos se foi um evento de pagamento (payment) e se veio um ID
        if (topic === 'payment' && paymentId) {

            // Buscamos os destalhes consolidados daquele pagamento pelo ID na API do MP
            const paymentInfo = new Payment(client);
            const paymentData = await paymentInfo.get({ id: paymentId });

            const status = paymentData.status; // 'approved', 'pending', 'rejected', etc..
            const userId = paymentData.external_reference; // Resgatamos o ID do Supabase que passamos na Preference

            // Se o Mercado pago der a ordem de "Aprovado" e tivermos o ID: Liberamos o perfil
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
        // Mesmo dando erro no processamento, já devolvemos status 200 lá em cima (boa prática)
    }
}
