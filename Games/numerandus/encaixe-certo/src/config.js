/**
 * config.js — o "formulário" do Encaixe Certo.
 *
 * Baseado no vídeo de referência (`numerandus/finalizados/1ano/encaixe_certo`)
 * e no projeto-fonte `Videos_Numerandus/encaixe_certo/src/EncaixeCerto.tsx`,
 * que documenta a mecânica original: peças de quebra-cabeça em dois pedaços —
 * um mostrando uma quantidade (ilustração), o outro o numeral — que só se
 * encaixam quando o número bate com a quantidade.
 *
 * O layout, a paleta, o elenco temático (emoji) e a curva do encaixe foram
 * aprovados num plano visual (ver a conversa de design) antes desta
 * implementação começar — a mecânica em `scenes/GameScene.js` segue esse
 * plano à risca.
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'encaixe-certo',
  titulo: 'Encaixe Certo',
  subtitulo: 'Arraste o número até a quantidade certa',

  objetivo: 'Contar quantos bichinhos ou frutinhas aparecem em cada peça e arrastar o número '
    + 'certo até ela — como um quebra-cabeça de verdade, o encaixe só fecha com o número certo.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#071322',
  corCeuTopo: '#0E243D',
  corCeuBase: '#18426B',

  /**
   * Tema 'quarto': lousa azul profunda e acolhedora com prateleira de madeira.
   */
  tema: 'quarto',
  mostrarDecoracoes: false,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * A dificuldade cresce em três eixos, não só um: quantos pares por rodada
   * (`meta`), até que número vai (`numeroMax`), e como os marcadores de
   * quantidade aparecem dentro da peça (`disposicao`) — organizados (fácil de
   * contar de relance) ou espalhados (Difícil: exige contar um a um, não só
   * reconhecer o padrão).
   */
  niveis: [
    {
      id: 1,
      nome: 'Fácil',
      descricao: 'Poucos pares',
      amostra: '1 a 5',
      cor: '#16A34A',
      meta: 3,
      numeroMax: 5,
      disposicao: 'fileira',
    },
    {
      id: 2,
      nome: 'Médio',
      descricao: 'Mais números',
      amostra: '1 a 9',
      cor: '#F59E0B',
      meta: 5,
      numeroMax: 9,
      disposicao: 'grade',
    },
    {
      id: 3,
      nome: 'Difícil',
      descricao: 'Contagem espalhada',
      amostra: '1 a 9',
      cor: '#DC2626',
      meta: 7,
      numeroMax: 9,
      disposicao: 'espalhada',
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05) — cada `desenho` é uma miniatura própria (não importa
   * `GameScene`, de propósito: evita que tutorial e partida real divirjam em
   * silêncio por trás de um código compartilhado).
   */
  tutorial: [
    {
      titulo: 'Cada peça mostra uma quantidade',
      texto: 'Conte os bichinhos ou frutinhas da peça fixa — nunca vem o número escrito ali.',
      fala: 'tutorialTela1',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 1 }),
    },
    {
      titulo: 'Arraste o número até encaixar',
      texto: 'Puxe o número certo para perto da peça — perto o bastante, ele é atraído e '
        + 'trava sozinho, como um quebra-cabeça de verdade.',
      fala: 'tutorialTela2',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Encaixe todos os pares para vencer',
      texto: 'Quando todo mundo estiver encaixado, o tabuleiro inteiro comemora com você!',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 3 }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Sem som de clique: botões de HUD/pausa/ajuda e as telas de apoio ficam
   * silenciosos ao tocar (mesma decisão do Jogo da Ordenação) — o som só
   * existe onde é gameplay de verdade.
   *
   * `soltar` (o som de encaixe) reaproveita `soltarPeca` do Jogo da Ordenação
   * (mesmo arquivo, mesmo SHA-256 — ali é o som de uma ficha assentando numa
   * célula vizinha vazia; aqui, o encaixe da peça no soquete certo — mesmo
   * gesto central de "encaixar", ambos os jogos). `acertoSOS` é reaproveitado
   * de outro jogo da coleção como som de vitória, o mesmo padrão já usado
   * pelo Jogo da Velha.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'tutorialTela1', src: './assets/audio/tela1.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tela2.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tela3.wav' },
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
  ],

  /** Sem mascote nesta partida — o tabuleiro de encaixe é a área de maior destaque. */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    soltar: 'soltarPeca', // reaproveitado do Jogo da Ordenação — ver comentário em `assets`
    acerto: null,
    erro: null,
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
    falaVitoria: null, // "Muito bem! Você conseguiu!"
    escolhaNivel: null, // "Escolha um nível" — narração da LevelSelectScreen
  },

  // -------------------------------------------------------------------- AVA
  /** Este jogo nunca tem derrota: só demora mais quando o aluno erra o encaixe. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N ACERTOS", não "N pontos" nem uma fração. */
  unidadePlacar: { singular: 'acerto', plural: 'acertos' },

  /** Linha extra na tela de resultado com o tempo da partida (mm:ss). */
  mostrarTempo: true,

  /**
   * Cronômetro AO VIVO no HUD durante a partida (o "0:19" no topo-centro).
   * Puramente informativo — sem prazo, sem cor de alerta — mas alguns
   * professores preferem tirá-lo de vista pra não incentivar pressa em quem
   * ainda está aprendendo a contar. `false` remove só o relógio; o "X/Y" de
   * progresso entre ondas (quando o nível tem mais de uma) some junto, já
   * que os dois vivem no mesmo indicador — ver `GameScene._relogioBadge`.
   * `mostrarTempo` (acima, tela de RESULTADO) é independente disto.
   */
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenho auxiliar do tutorial. Fica aqui, junto do texto que explica — uma
// cópia PEQUENA e independente da matemática do encaixe de `GameScene.js`
// (mesma curva, mesmo raciocínio, sem importar a cena real).
// ---------------------------------------------------------------------------

const EMOJI_TUTORIAL = ['🍓', '🍎', '🍊'];
const CORES_TUTORIAL = ['#EF4444', '#F97316', '#CA9A11'];
const FONTE_EMOJI_TUTORIAL = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";

function noParaBaixoTutorial(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy - nk, edgeX - r, cy - r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy + r * 0.72, edgeX - r * 0.72, cy + nk, edgeX, cy + nk);
}
function noParaCimaTutorial(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy + nk, edgeX - r, cy + r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy - r * 0.72, edgeX - r * 0.72, cy - nk, edgeX, cy - nk);
}

function tracarQuantidadeTutorial(ctx, w, h, r, nk) {
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

function tracarNumeroTutorial(ctx, w, h, r, nk) {
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

/**
 * Padrões canônicos (estilo dado/dominó) para 1-3 marcadores — só o que o
 * tutorial usa (`EMOJI_TUTORIAL` só tem 3 entradas). Mesmos números de
 * `GameScene.js`: `obterLayoutMarcadores`, já corrigido lá para nunca
 * sobrepor (o tutorial usava uma grade simples, mais compacta, que aqui
 * deixava os ícones quase colados/cortados nas bordas — visível no print com
 * 2 maçãs se tocando e 3 laranjas espremidas numa fileira só).
 */
function obterLayoutMarcadoresTutorial(n, safeW, safeH) {
  const posicoes = [];
  let tamanho = 32;

  if (n === 1) {
    posicoes.push({ cx: safeW * 0.50, cy: safeH * 0.50 });
    tamanho = Math.min(safeW, safeH) * 0.65;
  } else if (n === 2) {
    posicoes.push(
      { cx: safeW * 0.28, cy: safeH * 0.50 },
      { cx: safeW * 0.72, cy: safeH * 0.50 },
    );
    tamanho = Math.min(safeW * 0.40, safeH * 0.54);
  } else {
    // 3 — canônico: 1 no topo central, 2 na base.
    posicoes.push(
      { cx: safeW * 0.50, cy: safeH * 0.28 },
      { cx: safeW * 0.26, cy: safeH * 0.74 },
      { cx: safeW * 0.74, cy: safeH * 0.74 },
    );
    tamanho = Math.min(safeW * 0.42, safeH * 0.42);
  }

  return { posicoes, tamanho };
}

function desenharMarcadoresTutorial(ctx, n, w, h, indiceEmoji) {
  // ÁREA SEGURA: o entalhe do encaixe corta a borda direita em `r` pixels —
  // mesma reserva de `GameScene.js` (`margemEsquerda`/`margemDireita` fixos),
  // pra a área útil dos marcadores nunca invadir o entalhe.
  const r = w * 0.24;
  const margemEsquerda = 14;
  const margemDireita = r + 14;
  const safeW = w - margemEsquerda - margemDireita;
  const safeH = h * 0.80;
  const marginTop = (h - safeH) / 2;
  const emoji = EMOJI_TUTORIAL[indiceEmoji];

  const { posicoes, tamanho } = obterLayoutMarcadoresTutorial(n, safeW, safeH);

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${tamanho.toFixed(1)}px ${FONTE_EMOJI_TUTORIAL}`;
  for (let i = 0; i < n; i++) {
    const p = posicoes[i] ?? { cx: safeW / 2, cy: safeH / 2 };
    ctx.fillText(emoji, margemEsquerda + p.cx, marginTop + p.cy);
  }
  ctx.restore();
}

function desenharParTutorial(ctx, x, y, w, h, valor, indiceEmoji, junto) {
  const r = w * 0.24;
  const nk = r * 0.25;
  const cor = CORES_TUTORIAL[indiceEmoji];

  ctx.save();
  ctx.translate(x, y);

  tracarQuantidadeTutorial(ctx, w, h, r, nk);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#D4943A';
  ctx.stroke();
  desenharMarcadoresTutorial(ctx, valor, w, h, indiceEmoji);

  ctx.translate(junto ? w - r : w + 30, 0);
  tracarNumeroTutorial(ctx, w, h, r, nk);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = '#D4943A';
  ctx.stroke();
  ctx.fillStyle = cor;
  ctx.font = `800 ${Math.round(h * 0.6)}px Outfit, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(valor), r + w / 2, h / 2 + h * 0.02);

  ctx.restore();
}

/**
 * @param {number} opcoes.passo 1, 2 ou 3
 * @param {number} [opcoes.t] tempo acumulado (segundos), para o passo 2 animar
 */
function desenharCenaTutorial(ctx, l, a, opcoes = {}) {
  const { passo, t = 0 } = opcoes;
  ctx.save();

  if (passo === 1) {
    // Peça-quantidade sozinha, com o entalhe vazio esperando o número.
    const w = Math.min(l * 0.34, 210);
    const h = w * 0.72;
    // O GRUPO (peça-quantidade + soquete fantasma) tem largura total 2w — o
    // centro dele fica em `x + w`, então `x = l/2 - w` é o que centraliza o
    // PAR na caixa. Estava `l/2 - w*0.55`: o grupo ficava deslocado ~0.45w
    // pra DIREITA do centro, com uma sobra de espaço vazio bem maior à
    // esquerda que à direita (visível no print, com as duas folgas marcadas).
    const x = l / 2 - w;
    const y = a / 2 - h / 2;
    const r = w * 0.24;
    const nk = r * 0.25;

    ctx.translate(x, y);
    tracarQuantidadeTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    desenharMarcadoresTutorial(ctx, 3, w, h, 0);
    desenharFantasmaNumeroTutorial(ctx, w, h, r, nk);
  } else if (passo === 2) {
    // O número "3" desliza da bandeja até o encaixe e volta, em loop — SÓ na
    // horizontal (pela lateral): a peça-quantidade fica à esquerda, a peça
    // solta "mora" perto da borda direita da própria caixa da ilustração, na
    // MESMA altura o tempo todo (`yBase`, nunca muda). Antes o deslocamento
    // "solto" também empurrava a peça pra BAIXO (`h*1.15`) e ela vazava da
    // caixa da ilustração, sobrepondo o título/texto do passo logo abaixo
    // (visível no print: o "3" cobrindo "PUXE O NÚMERO..."). Uma animação só
    // lateral nunca sai da própria caixa, então nunca cobre informação vizinha.
    const w = Math.min(l * 0.3, 190);
    const h = w * 0.72;
    const r = w * 0.24;
    const nk = r * 0.25;

    const xQuantidade = l * 0.12;
    const yBase = a / 2 - h / 2;
    // Onde a peça-número mora "solta", perto da borda direita da caixa —
    // sempre dentro de `l`, nunca precisa descer nem subir pra caber.
    const margemDireita = Math.max(20, l * 0.05);
    const xSolta = l - margemDireita - (w + r);
    const xEncaixada = xQuantidade + w - r;

    const ciclo = 2.6;
    const suavizar = (x) => x * x * (3 - 2 * x);
    const f = ((t % ciclo) + ciclo) % ciclo / ciclo;
    let k;
    if (f < 0.18) k = 0;
    else if (f < 0.55) k = suavizar((f - 0.18) / 0.37);
    else if (f < 0.72) k = 1;
    else k = 1 - suavizar((f - 0.72) / 0.28);

    ctx.translate(xQuantidade, yBase);
    tracarQuantidadeTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    desenharMarcadoresTutorial(ctx, 3, w, h, 0);
    // Soquete fantasma tracejado por baixo — mostra pra onde a peça está indo,
    // mesmo padrão visual do soquete vazio da partida real.
    desenharFantasmaNumeroTutorial(ctx, w, h, r, nk);

    const xNumero = xEncaixada + (xSolta - xEncaixada) * (1 - k);
    ctx.translate(xNumero - xQuantidade, 0);
    tracarNumeroTutorial(ctx, w, h, r, nk);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    ctx.fillStyle = CORES_TUTORIAL[0];
    ctx.font = `800 ${Math.round(h * 0.6)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3', r + w / 2, h / 2 + h * 0.02);
  } else {
    // Três pares já encaixados, lado a lado — a comemoração.
    const w = Math.min(l * 0.2, 130);
    const h = w * 0.72;
    const totalLargura = 3 * (2 * w) + 2 * 24;
    const x0 = l / 2 - totalLargura / 2;
    const y = a / 2 - h / 2;
    for (let i = 0; i < 3; i++) {
      desenharParTutorial(ctx, x0 + i * (2 * w + 24), y, w, h, i + 1, i, true);
    }
  }

  ctx.restore();
}

/**
 * Soquete fantasma tracejado — mesmo visual do soquete vazio da partida real
 * (`GameScene.js`: `desenharFantasmaNumero`, estado não destacado): rebaixo
 * âmbar bem sutil, contorno tracejado e um "?" no meio. Estava só um contorno
 * vazio, sem preenchimento nem "?" — o tutorial mostrava um soquete diferente
 * do que a criança vê de verdade na partida.
 */
function desenharFantasmaNumeroTutorial(ctx, w, h, r, nk) {
  ctx.save();
  ctx.translate(w - r, 0);
  tracarNumeroTutorial(ctx, w, h, r, nk);
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
