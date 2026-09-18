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
   * 5 passos: valem tanto para o "COMO JOGAR" do menu quanto para a AJUDA
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
      // Antes: "Continue até BATER o número pedido" / "Vá TOCANDO até..." —
      // "bater" (podia soar como golpear, não "ficar igual") e "tocando"
      // sozinho (tocando em quê?) eram os dois pontos ambíguos. Agora nomeia
      // os botões de novo (retomando o passo 1) e usa só "igual", nunca
      // "bater", pros dois números — e nomeia os dois rótulos exatamente
      // como aparecem no painel de desafio de verdade ("Monte"/"Você
      // formou" — "Monte" é o rótulo real do `PainelDesafio` pros níveis
      // Fácil/Médio; só o Difícil usa "Resolva", que já mostra uma conta,
      // não um número pronto, então "Monte" é o caso certo pra ilustrar aqui).
      titulo: 'Continue até os dois números ficarem iguais',
      texto: 'Toque em +1, +10 ou +100 até "Você formou" ficar igual a "Monte". Quando ficarem '
        + 'iguais, toque em Confirmar.',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a, t, loader) => desenharTutorialPasso3(ctx, l, a, t, loader),
    },
    {
      titulo: 'Passou do número? Toque na peça pra tirar',
      texto: 'Tocar numa peça que já está na mesa desfaz ela — tira 1, 10 ou 100, dependendo '
        + 'da peça. É assim que você corrige um exagero, sem esperar a rodada acabar.',
      fala: 'tutorialTela4',
      desenho: (ctx, l, a, t, loader) => desenharTutorialPasso4(ctx, l, a, t, loader),
    },
    {
      // Faltava no tutorial: nada explicava o selo de tempo/estrelas do HUD
      // (`PainelRelogio`, em `GameScene.js`). Entrou no FINAL, como um 5º
      // passo, e não no meio dos outros 4 — os áudios de tela1-4.wav já
      // batiam 1:1 com os passos originais, inserir no meio desalinharia a
      // narração de tudo depois. `tela5.wav` (fornecido depois) fechou essa
      // pendência.
      titulo: 'Uma estrela pra cada rodada',
      texto: 'Toda vez que você confirma um número certo, uma estrela acende lá no relógio. '
        + 'Quando todas acenderem, você terminou o nível!',
      fala: 'tutorialTela5',
      desenho: (ctx, l, a, t) => desenharTutorialPasso5(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * As 3 imagens das peças, o efeito de progresso, a narração dos 5 passos
   * do tutorial (`tela1-5.wav`, fornecidos pelo humano) e o som de vitória —
   * o resto do áudio ainda falta (ver "Pendências conhecidas" no README).
   * `centena` usa a versão "esquerda" (face lateral do bloco à esquerda): é
   * a que empilha certo quando peças mais novas ficam na FRENTE e à DIREITA
   * das mais antigas (ver `GameScene._pilhaLateral`) — a face mostra
   * profundidade de verdade na costura entre uma placa e a próxima.
   * `somProgresso` é uma CÓPIA do `carta-correta.mp3` do Jogo da Memória
   * (mesmo arquivo, sem fala, serve pra qualquer "avançou um passo");
   * `acertoSOS` é o MESMO som de vitória já usado no resto da coleção
   * (Jogo da Memória, Encaixe Certo, Bingo, etc.); `somClique` é o
   * `soltar_peca.mp3` do Jogo da Ordenação — lá é o som de "peça encaixou",
   * aqui vira o clique universal (tocar +1/+10/+100, tocar numa peça da
   * mesa pra tirar, e os botões de pausa/ajuda/som via `somToque`); e
   * `somErro` é o `error.MP3` do Jogo da Memória — **atenção**: lá ele
   * mesmo está documentado como "ainda não ouvido, ficha NÃO verificada"
   * (risco de soar reprovador). Aqui o erro NUNCA pode humilhar ("errar só
   * demora mais, nunca perde nada" — ver README) — se ao ouvir este som ele
   * soar como um "errou!" áspero, precisa trocar antes de gravar oficial.
   * Nenhum dos quatro é referenciado entre pastas, cada jogo precisa ser
   * autossuficiente, então o arquivo físico foi copiado. Os `id` de
   * `tutorialTela1-5` batem com o `fala` de cada passo em `tutorial`
   * (acima) — é isso que o motor usa pra tocar a narração certa em cada
   * tela (`TutorialScreen` chama `audio.falar(passo.fala, ...)`, que busca
   * esse id nos assets).
   */
  assets: [
    { id: 'imgUnidade', src: './assets/img/unidade-flat-v2.png' },
    { id: 'imgDezena', src: './assets/img/dezena-flat-v2.png' },
    { id: 'imgCentena', src: './assets/img/centena-flat-esquerda-v3.png' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'somClique', src: './assets/audio/soltar_peca.mp3' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'tutorialTela1', src: './assets/audio/tela1.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tela2.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tela3.wav' },
    { id: 'tutorialTela4', src: './assets/audio/tela4.wav' },
    { id: 'tutorialTela5', src: './assets/audio/tela5.wav' },
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
   * `clique` toca ao tocar +1/+10/+100 (soma) e ao tocar uma peça da mesa
   * (tira) — `GameScene._adicionar`/`_removerPeca` — e também nos botões de
   * pausa/ajuda/som do HUD, via `somToque`. `progresso` toca quando uma
   * rodada avança e uma nova estrela acende no HUD (`_avancarRodada`).
   * `vitoria` toca na tela de resultado (`ResultScreen`, lido de
   * `config.audio?.vitoria`) — como este jogo nunca tem derrota
   * (`registrarDerrota: false`), é o único desfecho que existe. `erro` toca
   * ao confirmar errado (`_confirmar`) — som ainda NÃO VERIFICADO por
   * humano nenhum (ver o comentário em `assets`, acima); se soar reprovador
   * precisa trocar, esse jogo não pode punir quem erra. `acerto` (som
   * específico de confirmar certo, diferente do `progresso` que já toca
   * nesse instante) ainda não foi gravado. A narração do tutorial NÃO mora
   * aqui — `passo.fala` (em `tutorial`, acima) aponta direto pro `id` do
   * asset (`tutorialTela1-5`), mesmo padrão do Jogo da Memória.
   */
  audio: {
    musica: null,
    clique: 'somClique',
    acerto: null,
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
    progresso: 'somProgresso',
  },

  // -------------------------------------------------------------------- AVA
  /** Sem vidas e sem derrota: errar ao confirmar só demora mais, nunca perde
   *  a partida — a criança ajusta as peças e tenta de novo. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N ACERTOS" (cada acerto é um número montado certo). */
  unidadePlacar: { singular: 'acerto', plural: 'acertos' },

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
  // A área de ilustração é bem maior que isso (~980×270 lógicos) — um ícone
  // pequeno sobrava perdido no meio de muito branco. 170 usa o espaço de
  // verdade sem se aproximar da borda do cartão.
  const base = 170;
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
 *
 * As peças pequenas ficam em GRADE de `colunas` colunas (várias linhas), não
 * numa fileira só — numa fileira, o teto de largura antes de furar a linha
 * divisória do meio limitava o tamanho de cada peça a algo pequeno demais
 * (pedido repetido do humano pra aumentar mais). Em grade, pra caber os
 * mesmos 10, cada peça usa só ~metade da largura horizontal de antes — e
 * sobra altura de verdade na área de ilustração pra usar. `colunas = qtd`
 * (padrão) mantém uma fileira só, como a troca dezena→placa já usava.
 */
function desenharSetaDeTroca(ctx, imgOrigem, ow, oh, qtd, imgDestino, dw, dh, cx, cy, colunas = qtd) {
  const gap = Math.max(2, ow * 0.1);
  const linhas = Math.ceil(qtd / colunas);
  const largFileira = colunas * ow + (colunas - 1) * gap;
  const alturaFileira = linhas * oh + (linhas - 1) * gap;
  const larguraSeta = 22;
  const gapSeta = 9;
  const larguraTotal = largFileira + gapSeta + larguraSeta + gapSeta + dw;
  const xBase = cx - larguraTotal / 2;
  const yBase = cy - alturaFileira / 2;

  let i = 0;
  for (let lin = 0; lin < linhas && i < qtd; lin++) {
    for (let col = 0; col < colunas && i < qtd; col++, i++) {
      if (imgOrigem) {
        ctx.drawImage(imgOrigem, xBase + col * (ow + gap), yBase + lin * (oh + gap), ow, oh);
      }
    }
  }

  let x = xBase + largFileira + gapSeta;
  ctx.save();
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x + larguraSeta, cy);
  ctx.moveTo(x + larguraSeta - 10, cy - 8);
  ctx.lineTo(x + larguraSeta, cy);
  ctx.lineTo(x + larguraSeta - 10, cy + 8);
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

  // A fileira de 10 unidades tem um limite real de largura (não pode passar
  // da linha divisória no meio) — mas a peça DE CHEGADA (a que a criança
  // precisa reconhecer na mesa de verdade) não tem esse limite, então cresce
  // bem mais: 53×79→80×120 e 77×77→104×104.
  //
  // Os cubinhos (pedido repetido do humano pra aumentar mais) foram numa
  // fileira só até esbarrar no teto de largura da metade esquerda da tela —
  // não dava mais sem furar a linha divisória. Em vez de espremer mais uns
  // pixels, viraram uma GRADE 2×5: os mesmos 10 cubinhos, só que cada um
  // agora usa a largura de ~2,5 cubinhos de antes (a grade usa a ALTURA
  // livre da ilustração, que sobrava, em vez de só a largura, que não).
  desenharSetaDeTroca(ctx, imgUnidade, 50, 50, 10, imgDezena, 80, 120, l * 0.27, cy, 5);
  // Mesma ideia da grade dos cubinhos: as barrinhas também viraram 2×5 em
  // vez de 1×10 — essa metade tinha folga de sobra (a placa de chegada é
  // mais estreita que a barrinha de chegada do outro lado), então cresceram
  // ainda mais que os cubinhos (18×26 → 44×63).
  desenharSetaDeTroca(ctx, imgDezena, 44, 63, 10, imgCentena, 104, 104, l * 0.73, cy, 5);

  ctx.save();
  ctx.strokeStyle = '#EAD9A8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(l / 2, a * 0.05);
  ctx.lineTo(l / 2, a * 0.82);
  ctx.stroke();

  ctx.fillStyle = '#734D10';
  ctx.font = '700 19px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('10 CUBINHOS = 1 BARRINHA', l * 0.27, a * 0.78);
  ctx.fillText('10 BARRINHAS = 1 PLACA', l * 0.73, a * 0.78);
  ctx.restore();
}

/**
 * Passo 3: número monte = você formou, com confirmar já "aceso".
 *
 * Antes tinha uma placa dourada por baixo do "PEDIDO" — sobra de quando o
 * painel de desafio de verdade (`PainelDesafio`, em `GameScene.js`) também
 * tinha essa placa. O painel real mudou (fundo virou azul-marinho, a placa
 * saiu, os números foram direto pro fundo) e este desenho ficou pra trás.
 * Agora copia o estilo atual: sem caixa, números direto, com o "=" entre os
 * dois — só a cor do rótulo/"=" muda (aqui o fundo é branco, não marinho).
 * O rótulo também mudou de "PEDIDO" (que não existe no jogo de verdade) pra
 * "MONTE" — o rótulo real do `PainelDesafio` nos níveis Fácil/Médio (só o
 * Difícil usa "RESOLVA", pra uma conta, não um número pronto como este).
 */
function desenharTutorialPasso3(ctx, l, a) {
  const cy = a * 0.55;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '700 25px system-ui, sans-serif';
  ctx.fillStyle = '#734D10';
  ctx.fillText('MONTE', l * 0.30, cy - 48);
  ctx.fillText('VOCÊ FORMOU', l * 0.70, cy - 48);

  ctx.fillStyle = '#E0AB1B';
  ctx.font = '800 64px system-ui, sans-serif';
  ctx.fillText('47', l * 0.30, cy + 8);

  ctx.fillStyle = '#B49A78';
  ctx.font = '700 44px system-ui, sans-serif';
  ctx.fillText('=', l * 0.5, cy + 8);

  ctx.fillStyle = '#16A34A';
  ctx.font = '800 64px system-ui, sans-serif';
  ctx.fillText('47', l * 0.70, cy + 8);

  ctx.restore();
}

/**
 * Passo 4: tocar numa peça JÁ NA MESA desfaz ela — o único jeito de corrigir
 * um exagero (passou do número) sem esperar a rodada acabar. Faltava por
 * completo no tutorial: os 3 passos anteriores só ensinam a somar, nunca que
 * dá pra tirar. O "toque" na peça é um anel vermelho que pulsa e se apaga
 * por cima dela (mesmo gesto de tocar, mas em vermelho — "isso aqui tira",
 * não "isso aqui soma"); a seta vermelha (não verde, como as trocas) reforça
 * que essa ação é o oposto de somar; do outro lado, o contorno tracejado no
 * lugar da peça e o "-10" mostram o resultado.
 */
function desenharTutorialPasso4(ctx, l, a, t, loader) {
  const imgDezena = loader?.imagem('imgDezena');
  const cy = a * 0.42;
  // Sem fileira de 10 nem divisória disputando espaço (diferente do passo
  // 2) — só 3 elementos na tela toda, então a peça pode ficar bem grande:
  // quase o dobro do passo 2 (53×79 → 100×150).
  const w = 100;
  const h = 150;
  const cxA = l * 0.30;
  const cxSeta = l * 0.5;
  const cxB = l * 0.70;

  if (imgDezena) ctx.drawImage(imgDezena, cxA - w / 2, cy - h / 2, w, h);

  // Anel de "toque", pulsando e sumindo em loop — o mesmo tipo de pista
  // usada no passo 1 (algo mudando sozinho, sem texto explicando o gesto).
  const f = faseCiclo(t, 1.4);
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - f);
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cxA, cy, 56 + f * 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cxSeta - 24, cy);
  ctx.lineTo(cxSeta + 24, cy);
  ctx.moveTo(cxSeta + 10, cy - 13);
  ctx.lineTo(cxSeta + 24, cy);
  ctx.lineTo(cxSeta + 10, cy + 13);
  ctx.stroke();
  ctx.restore();

  // A peça "removida": só o contorno tracejado, no lugar dela — mostra que
  // sumiu, não que virou outra coisa (diferente da troca do passo 2).
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#734D10';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(cxB - w / 2, cy - h / 2, w, h);
  ctx.restore();

  ctx.fillStyle = '#DC2626';
  ctx.font = '800 40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('-10', cxB, cy);
}

/**
 * Desenha uma estrela de 5 pontas — cópia da mesma forma usada no HUD real
 * (`desenharEstrela`, em `GameScene.js`). Não dá pra importar dali: `config.js`
 * é dados/desenho de tutorial, `scenes/GameScene.js` é a partida, os dois não
 * se importam um ao outro — e um path de 15 linhas não justifica criar um
 * módulo `shared/` só pra isso. As cores aqui são as do fundo BRANCO do
 * tutorial, diferente das cores translúcidas que o HUD usa sobre o
 * azul-marinho.
 */
function desenharEstrelaTutorial(ctx, cx, cy, raioExterno, raioInterno, preenchida) {
  const pontos = 5;
  const passo = Math.PI / pontos;
  ctx.beginPath();
  for (let i = 0; i < pontos * 2; i++) {
    const r = i % 2 === 0 ? raioExterno : raioInterno;
    const ang = i * passo - Math.PI / 2;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = preenchida ? '#E0AB1B' : '#E5D9BE';
  ctx.strokeStyle = preenchida ? '#8C6B0E' : '#C9B98A';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();
}

/**
 * Passo 5: o selo de tempo/estrelas do HUD, com a estrela seguinte "acendendo"
 * em loop (pulsa de vazia pra dourada, no lugar exato onde ela mora no jogo
 * de verdade) — mostra o momento que o texto descreve ("uma estrela acende"),
 * não só uma foto parada de 3 de 5 já prontas.
 */
function desenharTutorialPasso5(ctx, l, a, t) {
  const cx = l / 2;
  const cy = a * 0.45;
  const meta = 5;
  const atual = 3;
  const raioExterno = 26;
  const raioInterno = raioExterno * 0.42;
  const passoEstrela = 62;
  const larguraPill = 460;
  const alturaPill = 90;

  ctx.save();
  ctx.fillStyle = '#F7F1E3';
  ctx.strokeStyle = '#EAD9A8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cx - larguraPill / 2, cy - alturaPill / 2, larguraPill, alturaPill, alturaPill / 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#734D10';
  ctx.font = '800 30px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('0:37', cx - larguraPill / 2 + 26, cy);

  const f = faseCiclo(t, 1.6);
  let sx = cx + larguraPill / 2 - 30 - (meta - 1) * passoEstrela;
  for (let i = 0; i < meta; i++) {
    if (i === atual) {
      const escala = f < 0.5 ? 0.6 + (f / 0.5) * 0.7 : 1.3 - ((f - 0.5) / 0.5) * 0.3;
      ctx.save();
      ctx.translate(sx, cy);
      ctx.scale(escala, escala);
      desenharEstrelaTutorial(ctx, 0, 0, raioExterno, raioInterno, f > 0.5);
      ctx.restore();
    } else {
      desenharEstrelaTutorial(ctx, sx, cy, raioExterno, raioInterno, i < atual);
    }
    sx += passoEstrela;
  }
  ctx.restore();
}
