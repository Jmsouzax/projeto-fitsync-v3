/**
 * Catálogo de planos — FONTE DA VERDADE dos preços, definida NO SERVIDOR.
 *
 * SEGURANÇA: o preço NUNCA pode vir do cliente. Se o valor cobrado fosse
 * lido do corpo da requisição (como era antes), qualquer usuário poderia
 * abrir o DevTools e pagar R$ 0,01 por um plano premium. Aqui o backend
 * decide o preço a partir do `planId`, ignorando qualquer valor enviado
 * pelo frontend.
 */
export const PLANS = {
  monthly: { title: 'FitSync - Plano Mensal', price: 70 },
  semester: { title: 'FitSync - Plano Semestral', price: 360 },
  annual: { title: 'FitSync - Plano Anual', price: 600 },
};

/** Retorna o plano pelo id, ou null se o id não existir no catálogo. */
export function getPlan(planId) {
  return Object.prototype.hasOwnProperty.call(PLANS, planId) ? PLANS[planId] : null;
}
