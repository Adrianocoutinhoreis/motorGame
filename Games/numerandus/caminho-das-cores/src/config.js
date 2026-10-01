/**
 * config.js — o "formulário" do jogo Caminho das Cores.
 *
 * Baseado no vídeo de referência (`numerandus/1 ano/caminho_da_cores`, um
 * brinquedo físico: uma cartela com várias colunas de peças geométricas
 * coloridas, uma prancha com trilhas verticais e uma bandeja de peças soltas)
 * e num planejamento feito num artefato antes desta implementação começar —
 * duas correções do humano registradas ali, depois da primeira leitura do
 * vídeo:
 *
 *   1. Não é "classificar por cor" — é COPIAR UM PADRÃO: cada trilha tem uma
 *      coluna correspondente na cartela, mostrando exatamente que formato E
 *      que cor vai em cada posição.
 *   2. A ORDEM importa — a trilha só aceita a próxima peça da sequência da
 *      coluna, de baixo pra cima (a peça "cai" pro espaço vazio mais baixo,
 *      igual à física do brinquedo), não qualquer peça certa em qualquer
 *      posição livre.
 *
 * Mecânica nova (não reaproveita o sistema de encaixe geométrico do Encaixe
 * Certo/Quantidade Certa — aqui não há nó/entalhe: qualquer peça cabe
 * fisicamente em qualquer trilha, quem decide é a comparação visual com a
 * cartela). Reaproveita, sim, o padrão geral de arraste com ímã/tolerância e
 * o algoritmo de várias fileiras (`porLinha`) que o Quantidade Certa usa pra
 * caber muitas peças soltas numa bandeja só.
 *
 * Sem mascote (decisão do humano para este jogo).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'caminho-das-cores',
  titulo: 'Caminho das Cores',
  subtitulo: 'Copie a cartela nas trilhas, na ordem certa',

  objetivo: 'Comparar formato e cor com uma cartela de referência e reproduzir a mesma '
    + 'sequência de peças em cada trilha, respeitando a ordem.',
  faixaEtaria: '6 a 7 anos (1º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#241A33',

  tema: 'quarto',
  corCeuTopo: '#2E2150',
  corCeuBase: '#2E2150',
  mostrarDecoracoes: false,
  mostrarChao: false,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * O eixo de dificuldade não é "mais cores" — é "sequência mais longa pra
   * acertar, na ordem certa" (ver planejamento, seção 3): `profundidade` é
   * quantas peças tem cada coluna da cartela / cada trilha.
   * `meta` = `trilhas` (uma pontuação por trilha completada por inteiro).
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Sequência de 2', amostra: '2 peças por trilha', cor: '#16A34A',
      meta: 3, trilhas: 3, profundidade: 2, distratoras: 1,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Sequência de 3', amostra: '3 peças por trilha', cor: '#F59E0B',
      meta: 4, trilhas: 4, profundidade: 3, distratoras: 2,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Sequência de 4', amostra: '4 peças por trilha', cor: '#DC2626',
      meta: 5, trilhas: 5, profundidade: 4, distratoras: 2,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). Miniatura própria em cada `desenho` (não importa
   * `GameScene`), mesmo padrão do Encaixe Certo/Quantidade Certa.
   */
  tutorial: [
    {
      titulo: 'A cartela mostra o que fazer',
      texto: 'Cada coluna da cartela é uma trilha. Ela mostra o formato e a cor de cada peça, '
        + 'de baixo pra cima.',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 1 }),
    },
    {
      titulo: 'Arraste a peça certa até a trilha',
      texto: 'Pegue na bandeja a peça com o MESMO formato e a MESMA cor da cartela, e arraste '
        + 'até a trilha dela.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Respeite a ordem da cartela',
      texto: 'A trilha só aceita a PRÓXIMA peça da sequência — se não for a vez dela, a peça '
        + 'treme e volta pra bandeja.',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 3 }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Reaproveita os 3 sons já padronizados no resto da coleção: `acertoSOS`
   * (vitória), `soltar_peca` (encaixe correto — mesmo som de "assentar" do
   * Encaixe Certo/Quantidade Certa/Material Dourado/Dino/Geométrico/Chave
   * Mágica) e `error.MP3` (peça errada ou fora de ordem — mesmo arquivo do
   * Colmeia dos Números/Jogo da Memória/Chave Mágica/Quantidade Certa).
   * Nenhum som novo precisou ser gravado.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
  ],

  /** Sem mascote — decisão do humano para este jogo; a cartela e o tabuleiro já disputam atenção. */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Sem vidas, sem derrota — errar a ordem só demora mais, mesma decisão do Encaixe Certo/Quantidade Certa. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N TRILHAS", cada uma representando uma coluna da cartela reproduzida por inteiro. */
  unidadePlacar: { singular: 'trilha', plural: 'trilhas' },

  mostrarTempo: true,
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenho auxiliar do tutorial. Cópia pequena e independente da lógica de
// `GameScene.js` (mesmas formas, mesmo raciocínio, sem importar a cena real)
// — mesmo padrão do Encaixe Certo/Quantidade Certa.
// ---------------------------------------------------------------------------

/** Traça uma forma geométrica dentro de uma caixa local de `tam`×`tam` (origem no canto superior esquerdo). */
function tracarFormaTutorial(ctx, forma, tam) {
  switch (forma) {
    case 'circulo':
      ctx.beginPath();
      ctx.arc(tam / 2, tam / 2, tam * 0.44, 0, Math.PI * 2);
      break;
    case 'quadrado':
      ctx.beginPath();
      ctx.roundRect(tam * 0.06, tam * 0.06, tam * 0.88, tam * 0.88, tam * 0.12);
      break;
    case 'triangulo':
      ctx.beginPath();
      ctx.moveTo(tam * 0.5, tam * 0.06);
      ctx.lineTo(tam * 0.94, tam * 0.9);
      ctx.lineTo(tam * 0.06, tam * 0.9);
      ctx.closePath();
      break;
    default: { // 'pentagono'
      const cx = tam * 0.5; const cy = tam * 0.52; const raio = tam * 0.46;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
        const x = cx + raio * Math.cos(ang);
        const y = cy + raio * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
  }
}

function desenharPecaTutorial(ctx, forma, cor, tam, x, y) {
  ctx.save();
  ctx.translate(x, y);
  tracarFormaTutorial(ctx, forma, tam);
  ctx.fillStyle = cor;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.stroke();
  ctx.restore();
}

/**
 * Fantasma pontilhado — DESENHADO NO CARTÃO BRANCO do tutorial (não no fundo
 * escuro da partida real), então usa traço/preenchimento ESCUROS. Usar as
 * mesmas cores claras da trilha de verdade aqui ficaria branco-no-branco,
 * invisível (bug visto no primeiro print: a trilha inteira sumia).
 */
function desenharFantasmaTutorial(ctx, forma, cor, tam, x, y, destacado) {
  ctx.save();
  ctx.translate(x, y);
  tracarFormaTutorial(ctx, forma, tam);
  ctx.fillStyle = destacado ? 'rgba(245, 158, 11, 0.22)' : 'rgba(100, 100, 130, 0.12)';
  ctx.fill();
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = destacado ? 3 : 2;
  ctx.strokeStyle = destacado ? '#F59E0B' : 'rgba(90, 90, 120, 0.55)';
  ctx.stroke();
  ctx.restore();
}

const SEQUENCIA_TUTORIAL = [
  { forma: 'triangulo', cor: '#EF4444' },
  { forma: 'quadrado', cor: '#3B82F6' },
  { forma: 'pentagono', cor: '#22C55E' },
];

/**
 * @param {number} opcoes.passo 1, 2 ou 3
 * @param {number} [opcoes.t] tempo acumulado (segundos), para o passo 2 animar
 */
function desenharCenaTutorial(ctx, l, a, opcoes = {}) {
  const { passo, t = 0 } = opcoes;
  ctx.save();

  const tam = 56;
  const gap = 14;

  if (passo === 1) {
    // A cartela (esquerda): uma coluna com a sequência completa, de baixo pra
    // cima. A trilha (direita): vazia, só com os fantasmas pontilhados.
    const alturaColuna = SEQUENCIA_TUTORIAL.length * tam + (SEQUENCIA_TUTORIAL.length - 1) * gap;
    const yBase = a / 2 + alturaColuna / 2 - tam;

    const xCartela = l * 0.30;
    ctx.save();
    ctx.fillStyle = '#F3F0FA';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xCartela - 14, yBase - alturaColuna + tam - 14, tam + 28, alturaColuna + 28, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    SEQUENCIA_TUTORIAL.forEach((cel, i) => {
      desenharPecaTutorial(ctx, cel.forma, cel.cor, tam, xCartela, yBase - i * (tam + gap));
    });

    const xTrilha = l * 0.58;
    SEQUENCIA_TUTORIAL.forEach((cel, i) => {
      desenharFantasmaTutorial(ctx, cel.forma, cel.cor, tam, xTrilha, yBase - i * (tam + gap), false);
    });

    ctx.strokeStyle = 'rgba(90, 90, 120, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(xCartela + tam + 30, a / 2);
    ctx.lineTo(xTrilha - 20, a / 2);
    ctx.stroke();
  } else if (passo === 2) {
    // Uma peça solta desliza da bandeja (em cima) até a trilha (embaixo),
    // em loop, pousando sobre o primeiro fantasma (índice 0 = fundo da trilha).
    const alvo = SEQUENCIA_TUTORIAL[0];
    const xTrilha = l * 0.56;
    const yTrilha = a * 0.62;
    const xBandeja = l * 0.56;
    const yBandeja = a * 0.22;

    const ciclo = 2.4;
    const suavizar = (x) => x * x * (3 - 2 * x);
    const f = (((t % ciclo) + ciclo) % ciclo) / ciclo;
    let k;
    if (f < 0.15) k = 0;
    else if (f < 0.55) k = suavizar((f - 0.15) / 0.4);
    else if (f < 0.75) k = 1;
    else k = 1 - suavizar((f - 0.75) / 0.25);

    desenharFantasmaTutorial(ctx, alvo.forma, alvo.cor, tam, xTrilha, yTrilha, k > 0.6);

    const xPeca = xBandeja + (xTrilha - xBandeja) * k;
    const yPeca = yBandeja + (yTrilha - yBandeja) * k;
    desenharPecaTutorial(ctx, alvo.forma, alvo.cor, tam, xPeca, yPeca);
  } else {
    // Trilha parcialmente preenchida: a peça de baixo já encaixou (cor
    // sólida), a próxima (destacada) é a vez — as de cima ainda são
    // fantasma — mostra a ordem em progresso, nunca já pronta.
    const alturaColuna = SEQUENCIA_TUTORIAL.length * tam + (SEQUENCIA_TUTORIAL.length - 1) * gap;
    const yBase = a / 2 + alturaColuna / 2 - tam;
    const xTrilha = l / 2;

    SEQUENCIA_TUTORIAL.forEach((cel, i) => {
      const y = yBase - i * (tam + gap);
      if (i === 0) desenharPecaTutorial(ctx, cel.forma, cel.cor, tam, xTrilha, y);
      else desenharFantasmaTutorial(ctx, cel.forma, cel.cor, tam, xTrilha, y, i === 1);
    });
  }

  ctx.restore();
}
