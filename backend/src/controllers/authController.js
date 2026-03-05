import { supabase } from '../config/supabase.js';

/**
 * Função responsável por criar o usuário e salvar os dados na tabela profiles.
 */
export async function registrarUsuario(req, res) {
    const { email, password, tipoPlano } = req.body;

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
        return res.status(500).json({ error: error.message });
    }
}
