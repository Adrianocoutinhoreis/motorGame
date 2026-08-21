/**
 * tokens.js — o design system do motor, em uma fonte só.
 *
 * O canvas (JS) e o HUD (CSS) precisam concordar sobre cor, espaço e tamanho.
 * Se cada um tivesse sua tabela, divergiriam na primeira alteração. Então:
 * estes valores são a verdade, e `tokens.css` é gerado a partir daqui em tempo
 * de execução por `aplicarTokensNoCSS()`.
 *
 * Perfil de público: EDUCAÇÃO INFANTIL / 1º ANO (4 a 7 anos).
 * As consequências disso estão codificadas aqui, não deixadas ao bom senso:
 *   - alvo de toque mínimo de 64px lógicos (dedo de criança, tablet em pé);
 *   - texto grande, peso alto e alto contraste;
 *   - cor NUNCA é o único portador de significado (sempre com ícone ou forma);
 *   - movimento curto e previsível, sem piscar.
 */

export const cores = {
  // --- Marca / interface
  primaria: '#2563EB',
  primariaEscura: '#1D4ED8',
  primariaClara: '#DBEAFE',
  secundaria: '#7C3AED',

  // --- Semânticas (sempre acompanhadas de ícone, nunca só a cor)
  acerto: '#16A34A',
  acertoClaro: '#DCFCE7',
  erro: '#DC2626',
  erroClaro: '#FEE2E2',
  atencao: '#F59E0B',
  atencaoClaro: '#FEF3C7',

  // --- Neutros
  tinta: '#111827',
  tintaSuave: '#4B5563',
  linha: '#E5E7EB',
  superficie: '#FFFFFF',
  superficieSuave: '#F9FAFB',
  fundo: '#EFF6FF',
  letterbox: '#0B1220',
  sombra: 'rgba(17, 24, 39, 0.18)',

  // --- Paleta lúdica: usada nas peças dos jogos. Contraste conferido contra
  //     o branco e contra `tinta`, e cada uma tem um par claro para estados.
  ludica: {
    vermelho: '#EF4444',
    laranja: '#F97316',
    amarelo: '#FACC15',
    verde: '#22C55E',
    turquesa: '#14B8A6',
    azul: '#3B82F6',
    roxo: '#8B5CF6',
    rosa: '#EC4899',
    marrom: '#A16207',
  },

  // --- Cenário (contexto natureza/madeira herdado das aulas originais)
  madeira: '#B45309',
  madeiraEscura: '#7C2D12',
  folha: '#4ADE80',
  ceu: '#BAE6FD',
  ceuProfundo: '#7DD3FC',
};

export const tipografia = {
  familia: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  // Escala em px lógicos (o Stage escala tudo junto).
  gigante: 64,
  titulo: 48,
  subtitulo: 34,
  corpo: 28,
  apoio: 22,
  pesoNormal: '600',
  pesoForte: '800',
};

export const espaco = {
  xs: 8,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  xxl: 72,
};

export const raio = {
  sm: 10,
  md: 16,
  lg: 24,
  pilula: 999,
};

export const sombras = {
  cartao: { cor: 'rgba(17, 24, 39, 0.18)', desfoque: 18, x: 0, y: 8 },
  botao: { cor: 'rgba(17, 24, 39, 0.22)', desfoque: 12, x: 0, y: 5 },
  suave: { cor: 'rgba(17, 24, 39, 0.12)', desfoque: 10, x: 0, y: 3 },
};

export const movimento = {
  rapido: 140,
  padrao: 240,
  lento: 420,
  entrada: 520,
};

export const acessibilidade = {
  /** Lado mínimo de qualquer alvo tocável, em px lógicos. */
  alvoMinimo: 64,
  /** Espaço mínimo entre dois alvos, para não errar o dedo. */
  espacoEntreAlvos: 16,
  /** Este perfil não pode exigir leitura: toda ação precisa de ícone + narração. */
  exigeLeitura: false,
};

export const tema = {
  cores, tipografia, espaco, raio, sombras, movimento, acessibilidade,
};

/**
 * Publica os tokens como variáveis CSS no `:root`, para o HUD em DOM usar
 * exatamente os mesmos valores do canvas.
 */
export function aplicarTokensNoCSS(alvo = document.documentElement) {
  const def = (nome, valor) => alvo.style.setProperty(nome, String(valor));

  for (const [chave, valor] of Object.entries(cores)) {
    if (typeof valor === 'string') def(`--cor-${chave}`, valor);
  }
  for (const [chave, valor] of Object.entries(cores.ludica)) {
    def(`--cor-ludica-${chave}`, valor);
  }
  for (const [chave, valor] of Object.entries(espaco)) def(`--espaco-${chave}`, `${valor}px`);
  for (const [chave, valor] of Object.entries(raio)) def(`--raio-${chave}`, `${valor}px`);
  for (const [chave, valor] of Object.entries(movimento)) def(`--tempo-${chave}`, `${valor}ms`);

  def('--fonte', tipografia.familia);
  def('--texto-gigante', `${tipografia.gigante}px`);
  def('--texto-titulo', `${tipografia.titulo}px`);
  def('--texto-subtitulo', `${tipografia.subtitulo}px`);
  def('--texto-corpo', `${tipografia.corpo}px`);
  def('--texto-apoio', `${tipografia.apoio}px`);
  def('--alvo-minimo', `${acessibilidade.alvoMinimo}px`);
}

/**
 * Garante o tamanho mínimo de alvo tocável.
 * Use ao dimensionar QUALQUER elemento clicável — é a regra de acessibilidade
 * mais fácil de violar sem perceber.
 */
export function alvoAcessivel(tamanho) {
  return Math.max(tamanho, acessibilidade.alvoMinimo);
}

export default tema;
