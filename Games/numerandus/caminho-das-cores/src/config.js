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
 *   2. A ORDEM importa — mas não mais no INSTANTE do encaixe (ver próximo
 *      parágrafo): a comparação com a cartela, posição por posição, só
 *      acontece ao confirmar.
 *
 * **Mecânica revista (2ª versão, depois de jogar a 1ª com o humano):** a
 * versão original validava cada peça NO INSTANTE do encaixe (só a certa, na
 * ordem certa, entrava — errada ou fora de ordem tremia e voltava). O humano
 * pediu pra mudar pra "encaixe livre + Confirmar", igual ao Colmeia dos
 * Números/Material Dourado: QUALQUER peça entra em QUALQUER trilha livremente
 * (sem feedback de certo/errado na hora), e só ao tocar CONFIRMAR o jogo
 * compara o tabuleiro inteiro com a cartela. Bateu: uma ESTRELA acende e uma
 * cartela NOVA nasce (o jogo ganhou RODADAS, uma por estrela da meta —
 * `nivel.meta` — igual ao Material Dourado; `nivel.trilhas` continua sendo a
 * forma FIXA do tabuleiro, 5 colunas, não mais "quantas trilhas pra vencer").
 * Errou: só demora mais (RE-02, nunca desconta) — a partir do 3º erro
 * seguido NESTA cartela, o jogo mostra a composição certa se montando
 * sozinha no tabuleiro (holofote + cascata) e volta pro que a criança tinha,
 * pra ela mesma corrigir (ver `GameScene._mostrarDicaTabuleiro`). Ganhou
 * também um cronômetro CRESCENTE (sobe, nunca pune, sem limite) — antes não
 * tinha nenhum relógio.
 *
 * Mecânica de encaixe em si não reaproveita o sistema de encaixe geométrico
 * do Encaixe Certo/Quantidade Certa — aqui não há nó/entalhe: qualquer peça
 * cabe fisicamente em qualquer trilha, quem decide é a comparação visual com
 * a cartela. Reaproveita, sim, o padrão geral de arraste com ímã/tolerância e
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
  // RESPONSIVO por tipo de tela — decidido UMA VEZ, no carregamento (o motor
  // só lê `largura`/`altura` na hora de criar o `Stage`, não reage a um
  // redimensionamento depois; ver `engine/core/Game.js`). Em CELULAR (tela
  // em pé, mais alta que larga) o canvas é retrato — cartela e tabuleiro
  // EMPILHAM, igual ao brinquedo físico segurado em pé. Em COMPUTADOR (tela
  // deitada, mais larga que alta, com folga nas laterais) o canvas volta a
  // ser paisagem — cartela e tabuleiro ficam LADO A LADO, aproveitando a
  // largura — mas o TABULEIRO em si nunca muda de forma (continua vertical,
  // com as colunas descendo), só a posição da cartela em relação a ele muda.
  // `GameScene.js` lê `largura > altura` pra saber qual arranjo montar.
  ...(typeof window !== 'undefined' && window.innerWidth > window.innerHeight * 1.05
    ? { largura: 1280, altura: 800 }
    : { largura: 720, altura: 1280 }),
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
   * `trilhas` é sempre 5 — o brinquedo físico tem exatamente 5 colunas
   * fixas na prancha (foto de referência do humano, com "1 2 3 4 5" escrito
   * à mão do lado de cada uma); não é um parâmetro de dificuldade, é a forma
   * FIXA do tabuleiro, igual em toda cartela de toda rodada. O eixo de
   * dificuldade real é "sequência mais longa pra acertar": `profundidade` é
   * quantas peças tem cada coluna da cartela / cada trilha.
   * `meta` agora é quantas CARTELAS (rodadas) o nível pede — não mais
   * "trilhas de uma cartela só" (mecânica revista, ver o comentário no topo
   * do arquivo): cada cartela só conta quando o tabuleiro INTEIRO bate com
   * ela, ao confirmar. Continua valendo 5 nos três níveis por coincidência
   * numérica com a versão antiga, não por regra — pode mudar sem relação
   * nenhuma com `trilhas`.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Sequência de 2', amostra: '2 peças por trilha', cor: '#16A34A',
      meta: 5, trilhas: 5, profundidade: 2, distratoras: 1,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Sequência de 3', amostra: '3 peças por trilha', cor: '#F59E0B',
      meta: 5, trilhas: 5, profundidade: 3, distratoras: 2,
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
      titulo: 'Arraste as peças pras trilhas',
      texto: 'Pegue as peças da bandeja e arraste pras trilhas, na ordem que quiser — você pode '
        + 'trocar de ideia e tirar uma peça a qualquer momento, só tocar nela.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Toque CONFIRMAR quando terminar',
      texto: 'Preencheu as 5 trilhas do seu jeito? Toque em CONFIRMAR pra ver se ficou igual à '
        + 'cartela. Se não bateu, só demora mais — ajuste e confirme de novo.',
      desenho: (ctx, l, a) => desenharCenaTutorial(ctx, l, a, { passo: 3 }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Reaproveita os 3 sons já padronizados no resto da coleção: `acertoSOS`
   * (vitória do NÍVEL inteiro), `soltar_peca` (toca em QUALQUER encaixe —
   * certo ou errado, já que o encaixe agora é livre — e de novo em cada
   * peça-fantasma da dica se montando sozinha; mesmo som de "assentar" do
   * Encaixe Certo/Quantidade Certa/Material Dourado/Dino/Geométrico/Chave
   * Mágica) e `error.MP3` (toca só ao CONFIRMAR errado, não mais por peça —
   * mesmo arquivo do Colmeia dos Números/Jogo da Memória/Chave
   * Mágica/Quantidade Certa). Nenhum som novo precisou ser gravado.
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
  /** Sem vidas, sem derrota — errar ao confirmar só demora mais, mesma decisão do Encaixe Certo/Quantidade Certa. */
  registrarDerrota: false,

  /**
   * RE-03: o placar mostra "N CARTELAS" — cada cartela só conta quando o
   * tabuleiro INTEIRO bate com ela ao confirmar (mecânica revista; antes
   * era "N TRILHAS", uma por coluna de uma cartela só).
   */
  unidadePlacar: { singular: 'cartela', plural: 'cartelas' },

  mostrarTempo: true,
  /** Cronômetro CRESCENTE no HUD — pedido do humano na mecânica revista (antes não tinha nenhum relógio). Só informativo: nunca pune, sem limite. */
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
    // Trilha já CHEIA (as 3 peças da sequência, todas em cor sólida — nada
    // mais de fantasma, diferente da versão anterior deste desenho) mais um
    // botão CONFIRMAR embaixo — ilustra o passo novo: preencher tudo e só
    // depois tocar em Confirmar, não mais "a vez certa" peça por peça.
    const alturaColuna = SEQUENCIA_TUTORIAL.length * tam + (SEQUENCIA_TUTORIAL.length - 1) * gap;
    const yBase = a * 0.42 + alturaColuna / 2 - tam;
    const xTrilha = l / 2;

    SEQUENCIA_TUTORIAL.forEach((cel, i) => {
      const y = yBase - i * (tam + gap);
      desenharPecaTutorial(ctx, cel.forma, cel.cor, tam, xTrilha, y);
    });

    const larguraBotao = 150;
    const alturaBotao = 46;
    const xBotao = xTrilha - larguraBotao / 2;
    const yBotao = yBase + tam * 0.6 + gap * 2;
    ctx.save();
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.roundRect(xBotao, yBotao, larguraBotao, alturaBotao, alturaBotao / 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CONFIRMAR', xTrilha, yBotao + alturaBotao / 2 + 1);
    ctx.restore();
  }

  ctx.restore();
}
