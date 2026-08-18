import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { registrarUsuario } from './controllers/authController.js';
import { criarPagamento, webhookMercadoPago } from './controllers/paymentController.js';

dotenv.config();

const app = express();

// CORS restrito: apenas as origens do frontend podem chamar a API.
// Configure FRONTEND_URL no .env (aceita várias origens separadas por vírgula).
const allowedOrigins = (process.env.FRONTEND_URL || 'https://projeto-fitsync-v3.vercel.app')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Sem origin = ferramentas server-to-server (curl, health checks, webhook do MP).
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pelo CORS'));
  },
}));

app.use(express.json()); // Permite receber JSON (fundamental para o Supabase e MP)

// Rota base (para verificar se a API está online pelo Navegador)
app.get('/', (req, res) => {
  res.json({ status: 'API do FitSync V3 Online e operante! 🚀' });
});

// Rotas de Autenticação
app.post('/api/auth/register', registrarUsuario);

// Rotas de Pagamento
app.post('/api/payments/create-preference', criarPagamento);

// Rota do Webhook do Mercado Pago
// Esta rota receberá os chamados automáticos do MP (payment.updated/created)
app.post('/api/webhook/mercadopago', webhookMercadoPago);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando porta ${PORT}`);
});
