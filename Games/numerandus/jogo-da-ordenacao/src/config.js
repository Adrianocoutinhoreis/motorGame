/**
 * config.js — o "formulário" do Jogo da Ordenação.
 *
 * Baseado no vídeo de referência (`numerandus/finalizados/1ano/Jogo_da_ordenacao`)
 * e no projeto-fonte `Videos_Numerandus/jogo_ordenacao/src/PuzzleBoard.tsx`, que
 * documenta a mecânica original: um tabuleiro de células coloridas com fichas
 * numeradas que só se movem para uma célula VIZINHA vazia — o mesmo 15-puzzle
 * clássico, não um "solte onde quiser".
 *
 * O layout, a paleta e o comportamento de cada tela foram aprovados num plano
 * visual (ver a conversa de design) antes desta implementação começar — a
 * mecânica em `scenes/GameScene.js` segue esse plano à risca.
 *
 * Leia junto: docs/CRIAR-JOGO.md, docs/CONTRATO-AVA.md e docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'jogo-da-ordenacao',
  titulo: 'Jogo da Ordenação',
  subtitulo: 'Arraste os números e deixe o tabuleiro em ordem',

  objetivo: 'Ordenar os números de 0 a 9 (crescente ou decrescente), arrastando cada ficha '
    + 'só para uma célula vizinha vazia — a mesma regra de um quebra-cabeça deslizante.',
  faixaEtaria: '5 a 8 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',

  /**
   * Tema 'quarto': um quarto de leitura — parede lilás-acinzentada e uma
   * prateleira de madeira no rodapé (ver `engine/ui/Background.js`). O
   * tabuleiro e as fichas NÃO seguem o tema: são as mesmas cores fixas e o
   * mesmo círculo branco do vídeo de referência, para não "brigar" com o
   * cenário nem entre si (ver `GameScene.CORES_CELULA`).
   */
  tema: 'quarto',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * Mesma mecânica nos três — só muda o quanto o embaralhamento inicial
   * mistura as fichas e a direção (crescente ou decrescente). `meta` é sempre
   * 10 (as dez fichas, 0 a 9): vira `totalPerguntas` no contrato do AVA.
   *
   * `passosEmbaralho` é quantos movimentos LEGAIS (andando pra trás a partir
   * do resolvido — ver `GameScene.embaralharValido`) o jogo aplica antes de
   * começar. Não é a mesma coisa que "quantas fichas ficam fora do lugar":
   * cada passo pode ou não desfazer o passo anterior, então o número real de
   * fichas fora do lugar varia — mas mais passos tende a exigir mais jogadas
   * pra desfazer, que é a variável de dificuldade real deste tipo de jogo.
   */
  niveis: [
    {
      id: 1,
      nome: 'Fácil',
      // Curta de propósito: `NivelCard` (motor) não quebra nem corta linha —
      // uma descrição comprida vaza pro cartão vizinho (visto em captura).
      // Crescente/decrescente já aparece na `amostra`, abaixo.
      descricao: 'Poucas trocas',
      amostra: '0 1 2 … 9',
      cor: '#16A34A',
      meta: 10,
      direcao: 'crescente',
      passosEmbaralho: 4,
    },
    {
      id: 2,
      nome: 'Médio',
      descricao: 'Tudo embaralhado',
      amostra: '0 1 2 … 9',
      cor: '#F59E0B',
      meta: 10,
      direcao: 'crescente',
      passosEmbaralho: 60,
    },
    {
      id: 3,
      nome: 'Difícil',
      descricao: 'Decrescente',
      amostra: '9 8 7 … 0',
      cor: '#DC2626',
      meta: 10,
      direcao: 'decrescente',
      passosEmbaralho: 60,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05) — o `desenho` de cada um é uma versão em miniatura do
   * tabuleiro real (mesmas cores, mesmo círculo branco), nunca um ensaio à
   * parte que poderia divergir da partida de verdade.
   */
  tutorial: [
    {
      titulo: 'Os números estão fora de ordem',
      texto: 'O tabuleiro tem 12 casas coloridas: 10 com números embaralhados e 2 vazias.',
      fala: 'tutorialTela1',
      desenho: (ctx, l, a) => desenharTabuleiroExemplo(ctx, l, a, {
        valores: [4, 1, 7, 0, 5, 2, 8, 3, 9, 6, null, null],
      }),
    },
    {
      titulo: 'Arraste um número até uma casa vizinha vazia',
      texto: 'Só dá para mover um número para o lado, para cima ou para baixo — e só se '
        + 'aquela casa estiver vazia. Se estiver ocupada, espere ela esvaziar.',
      fala: 'tutorialTela2',
      // A vaga (índice 1) fica bem ao lado da ficha que anima (índice 0) —
      // uma seta estática de canto a canto (como era antes) apontava para uma
      // casa que não é vizinha de verdade e não fazia sentido nenhum; agora é
      // a PRÓPRIA ficha indo e voltando pra vaga vizinha, em loop.
      desenho: (ctx, l, a, t) => desenharTabuleiroExemplo(ctx, l, a, {
        valores: [3, null, 2, 0, 4, 9, 6, 1, 8, 5, 7, null],
        animar: { de: 0, para: 1 },
        t,
      }),
    },
    {
      titulo: 'Deixe em ordem para completar o tabuleiro',
      texto: 'Do menor para o maior (ou do maior para o menor, no nível difícil). Quando as '
        + '10 fichas estiverem certas, o tabuleiro inteiro comemora!',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a) => desenharTabuleiroExemplo(ctx, l, a, {
        valores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, null],
        resolvido: true,
      }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Sem som de clique: botões de HUD/pausa/ajuda e as telas de apoio (menu,
   * níveis, tutorial, pausa, resultado) ficam silenciosos ao tocar — pedido
   * do humano, para o som só existir onde é gameplay de verdade. `acertoSOS`
   * é o único som de fim de partida: este jogo nunca tem derrota, então
   * `erroSOS` não é usado.
   *
   * `soltarPeca` é o único efeito de interação que sobra, e é PRÓPRIO deste
   * jogo: toca só quando uma ficha arrastada cai numa célula vizinha vazia e
   * o movimento é aceito (`GameScene._tentarMover`) — o gesto central do jogo,
   * não um clique de botão.
   *
   * `tutorialTela1..3` são a narração dos 3 passos do tutorial (ver `fala` em
   * cada passo, acima) — tocam pela `TutorialScreen` do motor, tanto no "COMO
   * JOGAR" do menu quanto na AJUDA dentro da partida (regra RE-05).
   */
  assets: [
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'tutorialTela1', src: './assets/audio/tela1.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tela2.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tela3.wav' },
  ],

  /** Sem mascote nesta partida — decisão de projeto, o tabuleiro é a área de maior destaque. */
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
    // `null` é decisão consciente, não esquecimento: ainda não há locução
    // própria gravada pra este jogo além do tutorial. Sem `falaDerrota`
    // (nem `empate`/`falaEmpate`): este jogo nunca termina em derrota ou
    // empate, então a `ResultScreen` nunca lê esses campos aqui.
    falaVitoria: null, // "Muito bem! Você conseguiu!"
  },

  // -------------------------------------------------------------------- AVA
  /** Quebra-cabeça solo: nunca há derrota, só demora mais quando erra mais. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N ACERTOS", não "N pontos" nem uma fração. */
  unidadePlacar: { singular: 'acerto', plural: 'acertos' },

  /**
   * Linha extra na tela de resultado com o tempo da partida (mm:ss) — este
   * jogo não tem meta de tempo nem derrota, então o placar sozinho diz pouco
   * sobre o desempenho; o tempo dá esse contexto. Campo aditivo e opcional em
   * `ResultScreen` (ver `engine/screens/ResultScreen.js`) — sem ele, nenhum
   * outro jogo muda de comportamento.
   */
  mostrarTempo: true,
};

// ---------------------------------------------------------------------------
// Desenho auxiliar do tutorial. Fica aqui, junto do texto que explica.
// ---------------------------------------------------------------------------

/**
 * As MESMAS 12 cores fixas do tabuleiro real (ver `GameScene.CORES_CELULA`) —
 * duplicadas aqui de propósito: o tutorial e a partida real usam a mesma
 * lista, mas o tutorial não importa a cena de jogo (evita acoplamento por um
 * desenho de miniatura). Se uma mudar, a outra precisa mudar junto.
 */
const CORES_CELULA_TUTORIAL = [
  '#EF4444', '#F97316', '#FACC15', '#22C55E', '#14B8A6', '#3B82F6',
  '#A78BFA', '#F9A8D4', '#A16207', '#DBEAFE', '#DCFCE7', '#FEF3C7',
];

/**
 * Tabuleiro 3×4 em miniatura, para o tutorial — mesma grade, mesmas cores e o
 * mesmo círculo branco da partida real (nunca um ensaio visualmente diferente
 * do jogo de verdade).
 *
 * @param {Array<number|null>} opcoes.valores 12 posições (3 colunas × 4 linhas)
 * @param {{de: number, para: number}} [opcoes.animar] índices (vizinhos de
 *   verdade — `para` precisa ser `null` em `valores`) entre os quais a ficha
 *   de `de` desliza, em loop, para ilustrar o gesto de arrastar.
 * @param {number} [opcoes.t] tempo acumulado (segundos), para animar
 * @param {boolean} [opcoes.resolvido] anel verde em toda ficha (tabuleiro completo)
 */
function desenharTabuleiroExemplo(ctx, l, a, opcoes = {}) {
  const { valores = [], animar = null, resolvido = false, t = 0 } = opcoes;
  const colunas = 3;
  const linhas = 4;
  const lado = Math.min(l, a * 0.72) / 4.4;
  const tamanhoTabuleiro = { largura: lado * colunas, altura: lado * linhas };
  const x0 = l / 2 - tamanhoTabuleiro.largura / 2;
  const y0 = a / 2 - tamanhoTabuleiro.altura / 2;

  const centroDe = (i) => ({
    cx: x0 + (i % colunas) * lado + lado / 2,
    cy: y0 + Math.floor(i / colunas) * lado + lado / 2,
  });

  ctx.save();

  // Fundo branco do "cartão" do tabuleiro, como na partida real.
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(x0 - 10, y0 - 10, tamanhoTabuleiro.largura + 20, tamanhoTabuleiro.altura + 20, 16);
  ctx.fill();

  // Células coloridas.
  for (let i = 0; i < colunas * linhas; i++) {
    const { cx, cy } = centroDe(i);
    ctx.fillStyle = CORES_CELULA_TUTORIAL[i % CORES_CELULA_TUTORIAL.length];
    ctx.beginPath();
    ctx.roundRect(cx - lado / 2, cy - lado / 2, lado, lado, 4);
    ctx.fill();
  }

  // Fichas ESTÁTICAS — pula o índice de origem da animação (se houver): essa
  // é desenhada por cima, na posição interpolada, mais abaixo.
  for (let i = 0; i < valores.length; i++) {
    if (animar && i === animar.de) continue;
    const valor = valores[i];
    if (valor === null || valor === undefined) continue;
    const { cx, cy } = centroDe(i);
    const r = lado * 0.42;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    if (resolvido) {
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.fillStyle = '#111827';
    ctx.font = `800 ${Math.round(r * 1.1)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(valor), cx, cy + 1);
  }

  /**
   * Ficha ANIMADA: desliza de `animar.de` até `animar.para` (duas casas
   * VIZINHAS de verdade) e volta, em loop — literalmente o gesto de
   * arrastar, não uma seta estática de canto a canto. Ciclo com uma pausa
   * curta em cada ponta, pra criança acompanhar antes do próximo movimento.
   */
  if (animar && valores[animar.de] !== null && valores[animar.de] !== undefined) {
    const origem = centroDe(animar.de);
    const destino = centroDe(animar.para);
    const valor = valores[animar.de];
    const r = lado * 0.42;

    const ciclo = 2.4; // segundos: parado · indo · parado · voltando
    const suavizar = (x) => x * x * (3 - 2 * x);
    const f = ((t % ciclo) + ciclo) % ciclo / ciclo;
    let k;
    if (f < 0.15) k = 0;
    else if (f < 0.5) k = suavizar((f - 0.15) / 0.35);
    else if (f < 0.65) k = 1;
    else k = 1 - suavizar((f - 0.65) / 0.35);

    const emMovimento = k > 0.02 && k < 0.98;

    // Anel tracejado na casa-destino enquanto o movimento está em curso — a
    // mesma pista de "solte aqui" que a partida real usa.
    if (emMovimento) {
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.roundRect(destino.cx - lado / 2 + 4, destino.cy - lado / 2 + 4, lado - 8, lado - 8, 4);
      ctx.stroke();
      ctx.restore();
    }

    const cx = origem.cx + (destino.cx - origem.cx) * k;
    const cy = origem.cy + (destino.cy - origem.cy) * k;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#111827';
    ctx.font = `800 ${Math.round(r * 1.1)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(valor), cx, cy + 1);

    // Um "dedo" simples — só um círculo semitransparente por cima da ficha
    // enquanto ela se move — sugere o toque que a está arrastando.
    if (emMovimento) {
      ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
