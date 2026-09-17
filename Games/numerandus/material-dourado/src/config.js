/**
 * config.js — o "formulário" do Material Dourado.
 *
 * Baseado na conversa de design registrada com o humano (não no vídeo de
 * referência `numerandus/finalizados/1ano/JOGO_MATERIAL_DOURADO`, que é só uma
 * ANIMAÇÃO passiva de 37s, sem mecânica nenhuma — decompor em "1 placa + 3
 * barrinhas + 2 cubinhos" ali é mostrado pronto, nunca descoberto).
 *
 * A mecânica escolhida foi "contar e trocar": tocar soma cubinhos, e ao juntar
 * 10 eles se transformam SOZINHOS numa barrinha (e 10 barrinhas numa placa) —
 * ninguém decompõe um número de antemão, descobre contando e vendo a troca
 * acontecer na mesa. Os botões +10/+100 já ficam disponíveis desde o início
 * (não escondidos até a criança "descobrir" a troca nesta partida — isso
 * travava o começo de toda rodada em tocar +1 repetidamente até para um alvo
 * como 40): +10 vale para todo nível, +100 só no Médio, que é o único cujos
 * alvos (100–999) de fato precisam de centena (ver `GameScene`).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'material-dourado',
  titulo: 'Material Dourado',
  subtitulo: 'Toque, conte e descubra as trocas das peças de ouro',

  objetivo: 'Treinar valor posicional (unidade, dezena, centena) e as operações de adição e '
    + 'subtração, montando números com peças de ouro: tocar soma 1 cubinho por vez, e ao juntar '
    + '10 peças elas se transformam sozinhas numa peça maior — a criança descobre a base 10 '
    + 'contando, em vez de decorar a decomposição pronta.',
  faixaEtaria: '6 a 8 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',

  /**
   * Tema 'quarto' reaproveitado (sem sol nem colinas) — zero mudança em
   * engine/ui/Background.js, mesmo mecanismo de override que o Encaixe Certo
   * e o Jogo da Memória já usam.
   *
   * O creme claro original (`#FBF3DE`/`#F3E4C0`) ficava quase idêntico ao
   * branco das bandejas/cartões (`#FFFDF8`/`#FFFFFF`) — sem contraste
   * nenhum, as caixas quase somem no fundo, só a borda fina de 2px
   * denunciava onde uma terminava e o fundo começava. Passou por um tom
   * dourado-areia (ainda claro demais pra separar bem do texto claro do
   * painel de desafio) até chegar neste azul-marinho escuro — contraste
   * máximo tanto com as caixas brancas das bandejas quanto com o texto
   * claro/amarelo do painel de desafio, que agora fica direto no fundo
   * (pedido explícito do humano, com referência visual).
   */
  tema: 'quarto',
  corCeuTopo: '#1B3350',
  corCeuBase: '#0F2136',

  /** Sem os números de giz flutuantes do tema — competiriam com as peças
   *  douradas, que já são o conteúdo visual principal da tela. */
  mostrarDecoracoes: false,

  /** Sem a prateleira de madeira do tema na base da tela — pedido do
   *  humano; o creme vai até o fim da tela. Mesma decisão do Jogo da
   *  Memória (tema 'quadro'), pelo mesmo campo do Background. */
  mostrarChao: false,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * `id` decide a faixa de números sorteados em `GameScene._gerarRodadas`:
   *   1 (Fácil)   → números de 11 a 99 (só cubinho/barrinha — a placa nunca
   *                 é necessária, mas o botão "+100" também nunca aparece
   *                 porque o total nunca passa de 99).
   *   2 (Médio)   → números de 100 a 999 (as 3 peças).
   *   3 (Difícil) → uma conta de + ou − sorteada SEM reagrupamento (mesmo
   *                 espírito do vídeo de referência: nunca "vai um"/"empresta
   *                 um"), e a criança monta o RESULTADO com a mesma mecânica
   *                 de contar e trocar — não decompõe as parcelas.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Números até 99', amostra: 'Até 99', cor: '#16A34A', meta: 5,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Números até 999', amostra: 'Até 999', cor: '#F59E0B', meta: 5,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Somar e subtrair', amostra: '+ e −', cor: '#DC2626', meta: 5,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos: valem tanto para o "COMO JOGAR" do menu quanto para a AJUDA
   * dentro da partida (regra RE-05). Cada `desenho` recebe `loader` como 5º
   * argumento (ver `engine/screens/TutorialScreen.js`) — por isso usa as
   * MESMAS imagens da partida (`assets/img/*.png`), não uma ilustração à
   * parte que poderia divergir do jogo de verdade.
   */
  tutorial: [
    {
      titulo: 'Toque para juntar peças',
      texto: 'Toque em +1 para somar cubinhos. Se aparecer +10 ou +100, você também pode tocar '
        + 'direto neles.',
      fala: 'tutorialTela1',
      desenho: (ctx, l, a, t, loader) => desenharTutorialPasso1(ctx, l, a, t, loader),
    },
    {
      titulo: 'Dez juntos viram uma peça maior',
      texto: 'As duas trocas funcionam do mesmo jeito: 10 peças juntas sempre viram 1 peça maior, '
        + 'sozinhas — sem você escolher nada.',
      fala: 'tutorialTela2',
      desenho: (ctx, l, a, t, loader) => desenharTutorialPasso2(ctx, l, a, t, loader),
    },
    {
      titulo: 'Continue até bater o número pedido',
      texto: 'Vá tocando até "Você formou" ficar igual ao número pedido. Aí é só confirmar!',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a, t, loader) => desenharTutorialPasso3(ctx, l, a, t, loader),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * As 3 imagens das peças, mais um único efeito sonoro gravado até agora
   * (o resto do áudio ainda falta — ver "Pendências conhecidas" no README).
   * `centena` usa a versão "esquerda" (face lateral do bloco à esquerda): é
   * a que empilha certo quando peças mais novas ficam na FRENTE e à DIREITA
   * das mais antigas (ver `GameScene._pilhaLateral`) — a face mostra
   * profundidade de verdade na costura entre uma placa e a próxima.
   * `somProgresso` é uma CÓPIA do `carta-correta.mp3` do Jogo da Memória
   * (mesmo arquivo, sem fala, serve pra qualquer "avançou um passo") — cada
   * pasta de jogo precisa ser autossuficiente, então o arquivo físico foi
   * copiado, não referenciado entre pastas.
   */
  assets: [
    { id: 'imgUnidade', src: './assets/img/unidade-flat-v2.png' },
    { id: 'imgDezena', src: './assets/img/dezena-flat-v2.png' },
    { id: 'imgCentena', src: './assets/img/centena-flat-esquerda-v3.png' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
  ],

  /**
   * Sem mascote em nenhuma tela — pedido do humano: a coruja padrão cobria o
   * botão "COMO JOGAR" no menu (o mesmo comportamento intencional descrito em
   * `engine/screens/MenuScreen.js`, mas que aqui não combinava com o jogo).
   * `mascote: null` NÃO desliga a coruja (o motor cai no padrão vetorial);
   * `telas: []` é o jeito de tirá-la de toda tela, como o Jogo da Memória já
   * faz — ver `engine/ui/Mascot.js`, `mascoteVisivel()`.
   */
  mascote: { telas: [] },

  /**
   * `progresso` toca quando uma rodada avança e uma nova estrela acende no
   * HUD (ver `GameScene._avancarRodada`) — o resto ainda não foi gravado
   * (ver "Pendências conhecidas" no README).
   */
  audio: {
    musica: null,
    clique: null,
    acerto: null,
    erro: null,
    vitoria: null,
    derrota: null,
    abertura: null,
    tutorialTela1: null,
    tutorialTela2: null,
    tutorialTela3: null,
    progresso: 'somProgresso',
  },

  // -------------------------------------------------------------------- AVA
  /** Sem vidas e sem derrota: errar ao confirmar só demora mais, nunca perde
   *  a partida — a criança ajusta as peças e tenta de novo. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N NÚMEROS" (cada acerto é um número montado certo). */
  unidadePlacar: { singular: 'número', plural: 'números' },

  /** Linha extra na tela de resultado com o tempo da partida (mm:ss). */
  mostrarTempo: true,

  /** Cronômetro AO VIVO no HUD — só informativo, sem prazo, sem cor de alerta
   *  (mesma regra "ambiente não punitivo" dos demais jogos da coleção). */
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenhos do tutorial — usam as mesmas imagens da partida via `loader`, pra
// tutorial e jogo real nunca divergirem visualmente por trás de arte duplicada.
// ---------------------------------------------------------------------------

function faseCiclo(t, periodo) {
  return (((t % periodo) + periodo) % periodo) / periodo;
}

/** Passo 1: um cubinho pulsando, "aparecendo" em loop — o gesto central. */
function desenharTutorialPasso1(ctx, l, a, t, loader) {
  const img = loader?.imagem('imgUnidade');
  const cx = l / 2;
  const cy = a * 0.55;
  const base = 96;
  const f = faseCiclo(t, 1.6);
  const escala = f < 0.5 ? 0.7 + (f / 0.5) * 0.3 : 1;
  const alpha = f < 0.5 ? 0.4 + (f / 0.5) * 0.6 : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);
  if (img) {
    ctx.drawImage(img, -base / 2, -base / 2, base, base);
  } else {
    ctx.fillStyle = '#FED766';
    ctx.strokeStyle = '#734D10';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-base / 2, -base / 2, base, base, 10);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Uma "seta de troca": `qtd` peças pequenas (imagem `imgOrigem`, tamanho
 * `ow`×`oh`) entrando por uma seta e virando 1 peça grande (`imgDestino`,
 * `dw`×`dh`) do outro lado — tudo centralizado em `cx,cy`. Reaproveitada duas
 * vezes no passo 2 (unidade→dezena e dezena→centena) pra as duas trocas
 * ficarem visualmente iguais, e não só ditas em texto.
 */
function desenharSetaDeTroca(ctx, imgOrigem, ow, oh, qtd, imgDestino, dw, dh, cx, cy) {
  const gap = Math.max(2, ow * 0.16);
  const largFileira = qtd * ow + (qtd - 1) * gap;
  const larguraSeta = 30;
  const gapSeta = 14;
  const larguraTotal = largFileira + gapSeta + larguraSeta + gapSeta + dw;
  let x = cx - larguraTotal / 2;

  for (let i = 0; i < qtd; i++) {
    if (imgOrigem) ctx.drawImage(imgOrigem, x, cy - oh / 2, ow, oh);
    x += ow + gap;
  }

  x += gapSeta;
  ctx.save();
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x + larguraSeta, cy);
  ctx.moveTo(x + larguraSeta - 9, cy - 7);
  ctx.lineTo(x + larguraSeta, cy);
  ctx.lineTo(x + larguraSeta - 9, cy + 7);
  ctx.stroke();
  ctx.restore();
  x += larguraSeta + gapSeta;

  if (imgDestino) ctx.drawImage(imgDestino, x, cy - dh / 2, dw, dh);
}

/**
 * Passo 2: as DUAS trocas, lado a lado — 10 cubinhos → 1 barrinha à esquerda,
 * 10 barrinhas → 1 placa à direita. Antes só a primeira troca era desenhada,
 * mas o texto já falava das duas — a criança lia "e 10 barrinhas viram 1
 * placa" sem nunca ver isso acontecer. Uma legenda numérica embaixo de cada
 * lado reforça o par quantidade↔peça (RE fora do texto corrido, mais fácil
 * de fixar pra quem ainda não lê fluente).
 */
function desenharTutorialPasso2(ctx, l, a, t, loader) {
  const imgUnidade = loader?.imagem('imgUnidade');
  const imgDezena = loader?.imagem('imgDezena');
  const imgCentena = loader?.imagem('imgCentena');
  const cy = a * 0.36;

  desenharSetaDeTroca(ctx, imgUnidade, 20, 20, 10, imgDezena, 44, 66, l * 0.27, cy);
  desenharSetaDeTroca(ctx, imgDezena, 11, 16, 10, imgCentena, 64, 64, l * 0.73, cy);

  ctx.save();
  ctx.strokeStyle = '#EAD9A8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(l / 2, a * 0.08);
  ctx.lineTo(l / 2, a * 0.7);
  ctx.stroke();

  ctx.fillStyle = '#734D10';
  ctx.font = '700 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('10 CUBINHOS = 1 BARRINHA', l * 0.27, a * 0.62);
  ctx.fillText('10 BARRINHAS = 1 PLACA', l * 0.73, a * 0.62);
  ctx.restore();
}

/** Passo 3: número pedido = você formou, com confirmar já "aceso". */
function desenharTutorialPasso3(ctx, l, a) {
  const cy = a * 0.55;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '700 16px system-ui, sans-serif';
  ctx.fillStyle = '#734D10';
  ctx.fillText('PEDIDO', l * 0.30, cy - 46);
  ctx.fillText('VOCÊ FORMOU', l * 0.68, cy - 46);

  ctx.fillStyle = '#FED766';
  ctx.strokeStyle = '#734D10';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(l * 0.30 - 70, cy - 30, 140, 60, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#4A3311';
  ctx.font = '800 34px system-ui, sans-serif';
  ctx.fillText('47', l * 0.30, cy + 2);

  ctx.fillStyle = '#16A34A';
  ctx.font = '800 40px system-ui, sans-serif';
  ctx.fillText('47', l * 0.68, cy);

  ctx.restore();
}
