/**
 * config.js — o "formulário" do jogo Chave Mágica.
 *
 * Planejado em artefato próprio antes desta implementação começar (layout,
 * mecânica e a decisão de ter vidas/tempo, ao contrário do resto da coleção
 * Numerandus). Baseado em dois materiais de referência:
 *   - `numerandus/finalizados/1ano/chave_magica/chave_magica.mp4` — o
 *     brinquedo físico: uma tábua com silhuetas de chave (sem cor) e
 *     fechaduras coloridas, cada uma com sua chave;
 *   - `Aulas para Refazer/Jogo_da_chave_magica/Game/script.js` — protótipo
 *     solto (fora do motor) que já resolveu o sistema de identidade por
 *     formato (cabeça + dentes) reaproveitado aqui.
 *
 * Leia junto: docs/CRIAR-JOGO.md, docs/CONTRATO-AVA.md e
 * docs/METODO-JOGOS-NUMERANDUS.md.
 */

/**
 * Path SVG (consumido via `Path2D` no `GameScene.js`) da CABEÇA da chave —
 * um "bow" com um furo no meio, preenchido com `fill-rule: evenodd`. Mesma
 * geometria do protótipo antigo (`gerarBowPath`), só que aqui vira string
 * pura (sem DOM) porque `Path2D` entende sintaxe SVG diretamente.
 */
function bowPathD(estilo) {
  switch (estilo) {
    case 'quadrado':
      return 'M 4 6 L 44 6 L 44 48 L 4 48 Z M 15 17 L 33 17 L 33 37 L 15 37 Z';
    case 'losango':
      return 'M 24 4 L 46 27 L 24 50 L 2 27 Z M 24 16 L 34 27 L 24 38 L 14 27 Z';
    case 'oval':
      return 'M 24 6 C 44 6 48 18 48 27 C 48 36 44 48 24 48 C 4 48 0 36 0 27 C 0 18 4 6 24 6 Z '
        + 'M 24 16 C 34 16 36 21 36 27 C 36 33 34 38 24 38 C 14 38 12 33 12 27 C 12 21 14 16 24 16 Z';
    case 'circulo':
    default:
      return 'M 24 4 A 23 23 0 1 1 24 50 A 23 23 0 1 1 24 4 Z M 24 15 A 12 12 0 1 1 24 39 A 12 12 0 1 1 24 15 Z';
  }
}

/** Path dos dentes — um retângulo por dente, descendo da haste. Mesmos números do protótipo. */
function dentesPathD(dentes) {
  const startX = 76;
  const gap = 24;
  const baseY = 32;
  const w = 12;
  let d = '';
  dentes.forEach((h, i) => {
    const x = startX + i * gap;
    d += `M${x} ${baseY} L${x + w} ${baseY} L${x + w} ${baseY + h} L${x} ${baseY + h} Z `;
  });
  return d;
}

/**
 * Desenha uma chave (cabeça + haste + dentes) num retângulo lógico de
 * 130×54 — a mesma "viewBox" do protótipo. `cor` controla o preenchimento
 * inteiro; usada tanto pela chave de verdade (colorida) quanto pela
 * silhueta vazia (cinza-escura, sem pista de cor) no tutorial.
 */
function desenharChaveTutorial(ctx, cx, cy, escala, cor, bow, dentes) {
  ctx.save();
  ctx.translate(cx - 65 * escala, cy - 27 * escala);
  ctx.scale(escala, escala);
  ctx.fillStyle = cor;
  ctx.fill(new Path2D(bowPathD(bow)), 'evenodd');
  ctx.fillRect(44, 22, 74, 10);
  ctx.fill(new Path2D(dentesPathD(dentes)));
  ctx.restore();
}

/** As 4 peças mostradas no tutorial — mesmos dados usados como amostra no plano. */
const CHAVES_TUTORIAL = [
  { cor: '#C1364B', bow: 'circulo', dentes: [15, 8] },
  { cor: '#1F7A6C', bow: 'quadrado', dentes: [8, 22] },
  { cor: '#B8842E', bow: 'losango', dentes: [22, 15] },
];

export default {
  // ------------------------------------------------------------- identidade
  slug: 'chave-magica',
  titulo: 'Chave Mágica',
  subtitulo: 'Ache a chave certa pelo formato dos dentes!',

  objetivo: 'Observar o formato da cabeça e dos dentes de cada chave para descobrir, por '
    + 'eliminação visual, qual fechadura ela abre — treina discriminação de forma, atenção a '
    + 'detalhe e correspondência um-a-um, habilidades de base antes da matemática com números.',
  faixaEtaria: '6 a 7 anos (1º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',
  textoEmCaixaAlta: true,

  // ---------------------------------------------------------------- tema
  tema: 'quarto',
  corCeuTopo: '#1B1330',
  corCeuBase: '#3A2350',
  mostrarDecoracoes: false,

  // ----------------------------------------------------------------- níveis
  /**
   * Igual ao protótipo original (`Aulas para Refazer/Jogo_da_chave_magica`),
   * achatado nos 3 níveis padrão da coleção. Decisão registrada no plano:
   * este É o primeiro jogo Numerandus com derrota de verdade — `vidas` por
   * nível, e `GameScene` conta um cronômetro regressivo próprio (nenhum
   * outro jogo da coleção tem um; `mostrarCronometro` de Encaixe Certo é só
   * informativo, nunca expira).
   *
   *   `pecas`      quantas chaves/fechaduras na rodada
   *   `dentesMax`  1 = só um dente (Fácil); 2 = dois dentes (Médio/Difícil)
   *   `cadeado`    Difícil: fechaduras viram cadeados COLORIDOS (a cor do
   *                cadeado bate com a chave certa — pista a mais, mas quem
   *                decide o encaixe continua sendo o formato)
   *   `tempoInicial` segundos no cronômetro regressivo
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: '4 chaves', amostra: '🔑', cor: '#22C55E',
      meta: 4, vidas: 3, pecas: 4, dentesMax: 1, cadeado: false, tempoInicial: 30,
    },
    {
      id: 2, nome: 'Médio', descricao: '6 chaves', amostra: '🔑🔑', cor: '#F59E0B',
      meta: 6, vidas: 3, pecas: 6, dentesMax: 2, cadeado: false, tempoInicial: 40,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Cadeados coloridos', amostra: '🔑🔑🔑', cor: '#DC2626',
      meta: 8, vidas: 3, pecas: 8, dentesMax: 2, cadeado: true, tempoInicial: 60,
    },
  ],

  // --------------------------------------------------------------- tutorial
  tutorial: [
    {
      titulo: 'Cada chave tem um formato só dela',
      texto: 'Olhe bem a cabeça e os dentinhos de cada chave — nunca tem duas iguais.',
      fala: 'tutorialTela1',
      desenho: (ctx, l, a) => {
        const y = a / 2;
        const passo = l / 4;
        CHAVES_TUTORIAL.forEach((c, i) => {
          desenharChaveTutorial(ctx, passo * (i + 1), y, 1.4, c.cor, c.bow, c.dentes);
        });
      },
    },
    {
      titulo: 'Arraste até a fechadura do mesmo formato',
      texto: 'A silhueta escura mostra o contorno certo. Puxe a chave que combina com aquele contorno.',
      fala: 'tutorialTela2',
      desenho: (ctx, l, a, t) => {
        const y = a / 2 - 10;
        const alvoX = l / 2 + 130;
        desenharChaveTutorial(ctx, alvoX, y, 1.5, '#241F38', 'circulo', [15, 8]);

        const ciclo = 3.2;
        const f = ((t % ciclo) + ciclo) % ciclo / ciclo;
        const anda = Math.max(0, Math.min(1, (f - 0.3) / 0.5));
        const x = (l / 2 - 190) + (alvoX - (l / 2 - 190)) * anda;
        desenharChaveTutorial(ctx, x, y, 1.5, '#C1364B', 'circulo', [15, 8]);
      },
    },
    {
      titulo: 'Cuidado: são só 3 vidas e o tempo corre',
      texto: 'Errar o formato custa uma vida. Encaixe todas as chaves antes do tempo (e das vidas) acabarem!',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a) => {
        ctx.save();
        ctx.fillStyle = '#DC2626';
        ctx.font = '800 40px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 3; i++) {
          ctx.fillText('❤', l / 2 - 80 + i * 60, a / 2 - 30);
        }
        ctx.fillStyle = '#F5EAD6';
        ctx.font = '800 30px system-ui, sans-serif';
        ctx.fillText('⏳', l / 2, a / 2 + 40);
        ctx.restore();
      },
    },
  ],

  // ------------------------------------------------------------------ áudio
  assets: [
    // Vitória — mesmo arquivo de toda a coleção Numerandus.
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    // Encaixe correto — mesmo som de "assentar" do Material Dourado/Dino/Geométrico.
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
    // Tentativa errada (formato não bate) — mesmo do Jogo da Memória/Geométrico.
    { id: 'somErro', src: './assets/audio/error.MP3' },
    // Derrota (vidas ou tempo zerados) — mesmo do Jogo dos Blocos, único outro
    // jogo do motor com derrota de verdade até agora.
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
  ],

  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: 'erroSOS',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Primeiro jogo Numerandus com derrota de verdade — decisão registrada no plano. */
  registrarDerrota: true,

  unidadePlacar: { singular: 'chave', plural: 'chaves' },
  mostrarTempo: true,
};
