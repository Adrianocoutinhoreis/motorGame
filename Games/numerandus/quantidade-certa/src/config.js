/**
 * config.js — o "formulário" do jogo Quantidade Certa.
 *
 * Baseado no vídeo de referência (`numerandus/finalizados/1ano/quantidade-certa`,
 * um brinquedo físico: cartelas com furos + continhas coloridas) e num
 * planejamento feito num artefato antes desta implementação começar — layout,
 * mecânica em duas etapas e decisões de design (tema visual, ordem das
 * etapas) aprovados ali antes de qualquer código.
 *
 * A mecânica reaproveita o SISTEMA de encaixe já testado do Encaixe Certo
 * (peça-quantidade com entalhe, peça-número com nó saliente, curvas de
 * `Path2D`) — mas com os dois papéis TROCADOS: aqui é o NÚMERO que fica fixo
 * no tabuleiro, e a peça de QUANTIDADE (com furos, não com ícone pronto) que
 * a criança arrasta até ele. Depois de combinar TODAS as peças da rodada,
 * uma "chuva" de continhas coloridas aparece para a criança contar e encher
 * os furos, uma bolinha de cada vez — a etapa nova que o Encaixe Certo não
 * tem, e o motivo deste ser um jogo à parte, não uma variação dele.
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'quantidade-certa',
  titulo: 'Quantidade Certa',
  subtitulo: 'Arraste a peça até o número certo e conte as continhas',

  objetivo: 'Reconhecer o numeral, arrastar a peça de quantidade correspondente até ele e, '
    + 'depois, contar e encaixar exatamente essa quantidade de continhas — uma por furo.',
  faixaEtaria: '6 a 7 anos (1º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B241D',

  /**
   * Fundo LISO de propósito — decisão explícita do humano, ao contrário do
   * resto da coleção (que usa céu em gradiente + decorações leves). Mesma
   * cor no topo e na base do céu já produz um preenchimento chapado (sem
   * gradiente nenhum), e `mostrarDecoracoes`/`mostrarChao` desligados tiram
   * qualquer elemento de cenário — só o tabuleiro e a trilha, sem nada
   * competindo por atenção atrás deles.
   */
  tema: 'quarto',
  corCeuTopo: '#0F2E24',
  corCeuBase: '#0F2E24',
  mostrarDecoracoes: false,
  mostrarChao: false,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * Mesma forma dos níveis do Encaixe Certo (`meta` = pares na rodada,
   * `numeroMax` = maior número sorteável, sempre a partir de 1) — só que
   * aqui números maiores também significam MAIS continhas para contar na
   * etapa 2, não só mais peças pra combinar.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Poucos pares', amostra: '1 a 5', cor: '#16A34A',
      meta: 3, numeroMax: 5,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Mais números', amostra: '1 a 8', cor: '#F59E0B',
      meta: 5, numeroMax: 8,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Números grandes', amostra: '1 a 10', cor: '#DC2626',
      meta: 7, numeroMax: 10,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). Miniatura própria em cada `desenho` (não importa
   * `GameScene`), mesmo padrão do Encaixe Certo.
   */
  tutorial: [
    {
      titulo: 'Cada número tem uma peça de quantidade',
      texto: 'O número fica fixo. Ao lado dele, um encaixe pontilhado espera a peça com aquela '
        + 'quantidade de furos.',
      fala: 'tutorialTela1',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 1 }),
    },
    {
      titulo: 'Arraste a peça até o número certo',
      texto: 'Puxe a peça de furos para perto do número — perto o bastante, ela é atraída e '
        + 'trava sozinha, como um quebra-cabeça de verdade.',
      fala: 'tutorialTela2',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Depois, conte e encha os furos',
      texto: 'Quando todas as peças encaixarem, as continhas chovem na trilha — arraste cada '
        + 'uma até um furo vazio, até a peça ficar cheia.',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 3 }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Reaproveita os mesmos arquivos já aprovados no Encaixe Certo/resto da
   * coleção (mesmo som de "encaixar" tanto para a peça de quantidade quanto
   * para cada continha — os dois são o mesmo gesto central, encaixar algo
   * num lugar vazio). Sem som de clique genérico (mesma decisão do Encaixe
   * Certo/Jogo da Ordenação): som só onde é gameplay de verdade.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
  ],

  /** Sem mascote — o tabuleiro é a área de maior destaque, mesma decisão do Encaixe Certo. */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    soltar: 'soltarPeca',
    acerto: null,
    erro: null,
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Sem derrota — errar o encaixe só demora mais, mesma decisão do Encaixe Certo. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N NÚMEROS", cada um representando uma peça combinada E cheia. */
  unidadePlacar: { singular: 'número', plural: 'números' },

  /** Linha extra na tela de resultado com o tempo da partida (mm:ss). */
  mostrarTempo: true,

  /** Cronômetro AO VIVO no HUD — só informativo, sem prazo, mesmo padrão do Encaixe Certo. */
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenho auxiliar do tutorial. Cópia pequena e independente da matemática do
// encaixe de `GameScene.js` (mesma curva, mesmo raciocínio, sem importar a
// cena real) — mesmo padrão do Encaixe Certo.
// ---------------------------------------------------------------------------

function noParaBaixoTutorial(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy - nk, edgeX - r, cy - r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy + r * 0.72, edgeX - r * 0.72, cy + nk, edgeX, cy + nk);
}
function noParaCimaTutorial(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy + nk, edgeX - r, cy + r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy - r * 0.72, edgeX - r * 0.72, cy - nk, edgeX, cy - nk);
}

/** Corpo com ENTALHE na borda direita — aqui é o NÚMERO (fixo), ao contrário do Encaixe Certo. */
function tracarNumeroTutorial(ctx, w, h, r, nk) {
  const cy = h / 2;
  const rc = Math.min(16, h / 6);
  ctx.beginPath();
  ctx.moveTo(rc, 0);
  ctx.quadraticCurveTo(0, 0, 0, rc);
  ctx.lineTo(0, h - rc);
  ctx.quadraticCurveTo(0, h, rc, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, cy + nk);
  noParaCimaTutorial(ctx, w, cy, r, nk);
  ctx.lineTo(w, 0);
  ctx.closePath();
}

/** Corpo com NÓ saliente na borda esquerda — aqui é a peça de QUANTIDADE (arrastável). */
function tracarQuantidadeTutorial(ctx, w, h, r, nk) {
  const cy = h / 2;
  const rc = Math.min(16, h / 6);
  const tw = w + r;
  ctx.beginPath();
  ctx.moveTo(r, cy - nk);
  noParaBaixoTutorial(ctx, r, cy, r, nk);
  ctx.lineTo(r, h - rc);
  ctx.quadraticCurveTo(r, h, r + rc, h);
  ctx.lineTo(tw - rc, h);
  ctx.quadraticCurveTo(tw, h, tw, h - rc);
  ctx.lineTo(tw, rc);
  ctx.quadraticCurveTo(tw, 0, tw - rc, 0);
  ctx.lineTo(r + rc, 0);
  ctx.quadraticCurveTo(r, 0, r, rc);
  ctx.closePath();
}

/** Mesmos layouts canônicos de `GameScene.js` (`obterLayoutFuros`) — só o subconjunto 1-3 usado aqui. */
function layoutFurosTutorial(n, safeW, safeH) {
  if (n === 1) return { pontos: [{ cx: safeW * 0.5, cy: safeH * 0.5 }], raio: Math.min(safeW, safeH) * 0.22 };
  if (n === 2) {
    return {
      pontos: [{ cx: safeW * 0.28, cy: safeH * 0.5 }, { cx: safeW * 0.72, cy: safeH * 0.5 }],
      raio: Math.min(safeW * 0.16, safeH * 0.24),
    };
  }
  return {
    pontos: [
      { cx: safeW * 0.5, cy: safeH * 0.28 },
      { cx: safeW * 0.26, cy: safeH * 0.74 },
      { cx: safeW * 0.74, cy: safeH * 0.74 },
    ],
    raio: Math.min(safeW * 0.15, safeH * 0.18),
  };
}

function desenharFurosTutorial(ctx, n, w, h, cores) {
  const r = w * 0.24;
  const margemEsquerda = 14;
  const margemDireita = r + 14;
  const safeW = w - margemEsquerda - margemDireita;
  const safeH = h * 0.8;
  const marginTop = (h - safeH) / 2;
  const { pontos, raio } = layoutFurosTutorial(n, safeW, safeH);

  for (let i = 0; i < n; i++) {
    const p = pontos[i] ?? { cx: safeW / 2, cy: safeH / 2 };
    const cx = margemEsquerda + p.cx;
    const cy = marginTop + p.cy;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    if (cores && cores[i]) {
      ctx.fillStyle = cores[i];
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(130, 85, 35, 0.14)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(150, 100, 45, 0.4)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  }
}

/** Soquete fantasma tracejado — mesmo visual do soquete vazio da partida real. */
function desenharFantasmaQuantidadeTutorial(ctx, w, h, r, nk) {
  ctx.save();
  ctx.translate(w - r, 0);
  tracarQuantidadeTutorial(ctx, w, h, r, nk);
  ctx.fillStyle = 'rgba(130, 85, 35, 0.09)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(150, 100, 45, 0.45)';
  ctx.lineWidth = 2.2;
  ctx.setLineDash([7, 5]);
  ctx.stroke();

  ctx.fillStyle = 'rgba(150, 100, 45, 0.40)';
  ctx.font = `700 ${Math.round(h * 0.38)}px Outfit, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', r + w / 2, h / 2);
  ctx.restore();
}

const CONTAS_TUTORIAL = ['#DC2626', '#2563EB', '#16A34A'];

/**
 * @param {number} opcoes.passo 1, 2 ou 3
 * @param {number} [opcoes.t] tempo acumulado (segundos), para o passo 2 animar
 */
function desenharCenaTutorial(ctx, l, a, opcoes = {}) {
  const { passo, t = 0 } = opcoes;
  ctx.save();

  if (passo === 1) {
    // Número fixo (com o entalhe) + fantasma pontilhado esperando a peça, e a
    // peça de quantidade (com furos vazios) "solta" ao lado, sem ainda arrastar.
    const w = Math.min(l * 0.3, 190);
    const h = w * 0.72;
    const r = w * 0.24;
    const nk = r * 0.25;

    const xNumero = l / 2 - w;
    const y = a / 2 - h / 2;
    ctx.translate(xNumero, y);
    tracarNumeroTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    ctx.fillStyle = '#2563EB';
    ctx.font = `800 ${Math.round(h * 0.6)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3', w / 2, h / 2 + h * 0.02);
    desenharFantasmaQuantidadeTutorial(ctx, w, h, r, nk);

    ctx.restore();
    ctx.save();
    // Começa exatamente onde o fantasma termina (xNumero + 2w - r) mais uma
    // folga fixa — calculado a partir do fim de verdade do fantasma, não de
    // uma fração solta de `l`, que deixava as duas peças quase coladas
    // (ou sobrepostas, dependendo da largura real da caixa do tutorial).
    // O fantasma é desenhado deslocado (w-r) e sua própria forma vai até
    // (w+r) DENTRO desse deslocamento — ponta mais à direita real: (w-r)+(w+r)
    // = 2w (não "2w-r", erro que deixava a peça solta encavalando o fantasma).
    const fimFantasma = xNumero + 2 * w;
    const xSolta = fimFantasma + 40;
    ctx.translate(xSolta, y);
    tracarQuantidadeTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    desenharFurosTutorial(ctx, 3, w, h, null);
  } else if (passo === 2) {
    // A peça de quantidade desliza da direita até encaixar no número, em loop.
    const w = Math.min(l * 0.3, 190);
    const h = w * 0.72;
    const r = w * 0.24;
    const nk = r * 0.25;

    const xNumero = l * 0.14;
    const yBase = a / 2 - h / 2;
    const margemDireita = Math.max(20, l * 0.05);
    const xSolta = l - margemDireita - w;
    const xEncaixada = xNumero + w - r;

    const ciclo = 2.6;
    const suavizar = (x) => x * x * (3 - 2 * x);
    const f = ((t % ciclo) + ciclo) % ciclo / ciclo;
    let k;
    if (f < 0.18) k = 0;
    else if (f < 0.55) k = suavizar((f - 0.18) / 0.37);
    else if (f < 0.72) k = 1;
    else k = 1 - suavizar((f - 0.72) / 0.28);

    ctx.translate(xNumero, yBase);
    tracarNumeroTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    ctx.fillStyle = '#2563EB';
    ctx.font = `800 ${Math.round(h * 0.6)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3', w / 2, h / 2 + h * 0.02);
    desenharFantasmaQuantidadeTutorial(ctx, w, h, r, nk);

    const xPeca = xEncaixada + (xSolta - xEncaixada) * (1 - k);
    ctx.translate(xPeca - xNumero, 0);
    tracarQuantidadeTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    desenharFurosTutorial(ctx, 3, w, h, null);
  } else {
    // Peça já encaixada, furos sendo preenchidos por continhas coloridas — a
    // etapa nova que o Encaixe Certo não tem.
    const w = Math.min(l * 0.34, 220);
    const h = w * 0.72;
    const r = w * 0.24;
    const nk = r * 0.25;

    const xNumero = l / 2 - w * 0.75;
    const y = a / 2 - h / 2;
    ctx.translate(xNumero, y);
    tracarNumeroTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    ctx.fillStyle = '#2563EB';
    ctx.font = `800 ${Math.round(h * 0.6)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3', w / 2, h / 2 + h * 0.02);

    ctx.translate(w - r, 0);
    tracarQuantidadeTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    // 2 furos já cheios, 1 esperando — mostra a contagem em progresso, nunca já pronta.
    desenharFurosTutorial(ctx, 3, w, h, [CONTAS_TUTORIAL[0], CONTAS_TUTORIAL[1], null]);
  }

  ctx.restore();
}
