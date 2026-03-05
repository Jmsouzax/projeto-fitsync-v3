import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('As variáveis de ambiente do Supabase estão ausentes. Verifique o arquivo .env.');
}

// Inicializa o cliente e exporta para ser usado em qualquer lugar do projeto
export const supabase = createClient(supabaseUrl, supabaseKey);
