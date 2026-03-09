import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { registrarUsuario } from './controllers/authController.js';
import { criarPagamento, webhookMercadoPago } from './controllers/paymentController.js';

dotenv.config();

const app = express();

// Middlewares essenciais
app.use(cors());
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
