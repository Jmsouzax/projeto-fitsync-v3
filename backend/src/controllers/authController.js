import { supabase } from '../config/supabase.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLANOS_VALIDOS = ['monthly', 'semester', 'annual', 'mensal'];

/**
 * Função responsável por criar o usuário e salvar os dados na tabela profiles.
 */
export async function registrarUsuario(req, res) {
    const { email, password, tipoPlano } = req.body;

    // Validação de entrada (evita chamadas inválidas ao Supabase e mensagens confusas)
    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (!password || String(password).length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }
    if (tipoPlano && !PLANOS_VALIDOS.includes(tipoPlano)) {
        return res.status(400).json({ error: 'Plano inválido.' });
    }

    let createdUserId = null;

    try {
        // 1. Cadastra o usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        // 2. Extrai o ID do usuário recém-criado
        const user = authData.user;
        if (!user) {
            return res.status(400).json({ error: 'Erro ao gerar cadastro de autenticação.' });
        }
        createdUserId = user.id;

        // 3. Salva informações adicionais (plano) na tabela `profiles`
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: user.id, // Vincula o perfil ao ID da Auth do Supabase
                    email: email, // Opcional salvar o email no perfil também
                    plano: tipoPlano,
                    status_pagamento: 'pendente' // Começa pendente até o Mercado Pago aprovar
                }
            ])
            .select()
            .single();

        if (profileError) throw profileError;

        return res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: user,
            profile: profileData
        });

    } catch (error) {
        console.error('Erro no cadastro:', error.message);

        // Rollback: se o usuário foi criado no Auth mas o perfil falhou, removemos
        // o usuário órfão para não deixar um cadastro "pela metade" (e permitir
        // que a pessoa tente de novo com o mesmo e-mail).
        if (createdUserId) {
            const { error: rollbackError } = await supabase.auth.admin.deleteUser(createdUserId);
            if (rollbackError) {
                console.error('Falha ao reverter usuário órfão:', rollbackError.message);
            }
        }

        // Não expomos a mensagem interna do Supabase ao cliente.
        return res.status(500).json({ error: 'Não foi possível concluir o cadastro. Tente novamente.' });
    }
}
