/**
 * config.js — o "formulário" do Jogo das Formas.
 *
 * Refação da aula 870298 (`JogoFormas.js`, CreateJS/Flash, 2013).
 *
 * Especificação completa, com o porquê de cada número:
 *   docs/REGRAS-JOGO-DAS-FORMAS.md   — mecânica, níveis, pontuação, contrato
 *   docs/PLANO-VISUAL-JOGO-DAS-FORMAS.md — layout, tamanhos, movimento
 *
 * O que mudou em relação ao original, em uma linha cada:
 *
 *  - **Três níveis em vez de nenhum.** O original entregava o jogo inteiro de
 *    uma vez: 4 formas, grade cheia e linha nova a cada 15 s. O Nível 3 aqui É
 *    aquele jogo, número por número; os níveis 1 e 2 são degraus até ele.
 *  - **Registro no AVA**, que não existia.
 *  - **Toque, responsivo, pausa e tutorial navegável.**
 *  - **Quatro formas, não cinco.** Não existe `losango.mp3`, e a arte do losango
 *    do original é o retângulo repintado. Ver REGRAS, seção 9.
 */
import { cores } from '../engine/index.js';

export default {
  // ------------------------------------------------------------- identidade
  slug: 'jogo-das-formas',
  titulo: 'Jogo das Formas',
  subtitulo: 'Junte três formas iguais!',

  objetivo:
    'Reconhecer formas geométricas planas pelo contorno (círculo, quadrado, triângulo e '
    + 'retângulo), agrupar por categoria e planejar uma sequência de movimentos sob '
    + 'pressão de tempo.',
  faixaEtaria: '4 a 7 anos',
  aulaOriginal: '870298',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: cores.letterbox,
  /**
   * Cenário próprio: céu geométrico, e não o canteiro de obras.
   *
   * Estava 'construcao' porque este jogo nasceu do template do piloto, não por
   * escolha — o Jogo dos Blocos É um canteiro (o original dele tinha guindaste e
   * caixotes), e as duas aulas refeitas acabavam sendo a mesma tela. O tema
   * também escolhe a placa do título: 'formas' usa a placa limpa, sem enfeite de
   * forma geométrica, para a interface não competir com o conteúdo da lição.
   */
  tema: 'formas',

  /**
   * Regra RE-01: todo texto exibido vai em CAIXA ALTA.
   * Aos 4–7 anos a criança lê letra bastão maiúscula. Ver docs/REGRAS-EDUCACIONAIS.md.
   */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * `meta` vira `totalPerguntas` no contrato do AVA e `id` vira `nivel`.
   *
   * A progressão anda em quatro eixos que o próprio original já tinha — quantas
   * formas existem, a largura da grade, o ritmo da linha nova e a meta — e o
   * Nível 3 é o jogo de 2013 sem atenuação. NÃO é fácil/médio/difícil: é o mesmo
   * jogo com mais espaço para pensar. É por isso que as cores dos cartões são
   * primária/secundária/acerto e não verde-amarelo-vermelho de semáforo.
   *
   * `vidas: 0` de propósito — este jogo não tem vidas. A derrota vem da pilha
   * encostar no teto ou do tempo acabar sem a meta.
   */
  niveis: [
    {
      id: 1,
      nome: 'Conhecer',
      descricao: '3 formas · 12 pontos',
      amostra: '● ■ ▲',
      cor: cores.primaria,
      meta: 12,
      vidas: 0,
      duracao: 120,
      colunas: 5,
      linhas: 7,
      linhasIniciais: 3,
      segundosPorLinha: 20,
      formas: ['circulo', 'quadrado', 'triangulo'],
    },
    {
      id: 2,
      nome: 'Combinar',
      descricao: '4 formas · 16 pontos',
      amostra: '● ■ ▲ ▬',
      cor: cores.secundaria,
      meta: 16,
      vidas: 0,
      duracao: 120,
      colunas: 6,
      linhas: 7,
      linhasIniciais: 3,
      segundosPorLinha: 18,
      formas: ['circulo', 'quadrado', 'triangulo', 'retangulo'],
    },
    {
      // O jogo de 2013, número por número: 6 colunas, 7 linhas, 3 linhas
      // iniciais, linha nova a cada 15 s, 120 s de partida, meta de 20 pontos.
      id: 3,
      nome: 'Desafio',
      descricao: '4 formas · 20 pontos',
      amostra: '● ■ ▲ ▬',
      cor: cores.acerto,
      meta: 20,
      vidas: 0,
      duracao: 120,
      colunas: 6,
      linhas: 7,
      linhasIniciais: 3,
      segundosPorLinha: 15,
      formas: ['circulo', 'quadrado', 'triangulo', 'retangulo'],
    },
  ],

  // ------------------------------------------------------------------ formas
  /**
   * A tabela das peças. `imagem` é o id declarado em `assets` — os azulejos de
   * 2013, usados como ANDAIME (ver PLANO-VISUAL, seção 3.2): 50×50 px, sombra e
   * degradê assados no PNG, cores fora dos tokens.
   *
   * `cor` é a cor de token equivalente, para a versão vetorial da seção 3.1 e
   * para o painel lateral. Já está aqui para que a troca de andaime por arte
   * definitiva não precise mexer em mais nada.
   */
  formas: {
    circulo: { nome: 'Círculo', imagem: 'blocoCirculo', som: 'circulo', cor: cores.ludica.azul },
    quadrado: { nome: 'Quadrado', imagem: 'blocoQuadrado', som: 'quadrado', cor: cores.ludica.laranja },
    triangulo: { nome: 'Triângulo', imagem: 'blocoTriangulo', som: 'triangulo', cor: cores.ludica.verde },
    retangulo: { nome: 'Retângulo', imagem: 'blocoRetangulo', som: 'retangulo', cor: cores.ludica.roxo },
  },

  /**
   * Geometria da partida — dimensionada pelo CELULAR, medida, não estimada.
   *
   * A coluna é o alvo tocável do jogo, e `celula` é a largura dela. O problema:
   * em celular a altura é que limita a escala do `Stage` (`escala = altura_física
   * / 720`), então o tamanho físico do alvo é **(célula ÷ 720) × altura do
   * aparelho** — só a FRAÇÃO DA ALTURA importa, e alargar a tela não muda nada.
   *
   * Medido num Android 20:9 (800×360 deitado, escala 0,500):
   *
   *   célula 64  ->  32,0 px físicos   (era isto; abaixo do piso de 44 do WCAG 2.5.5)
   *   célula 80  ->  40,0 px físicos   (+25%)
   *   célula 88  ->  44,0 px físicos   (o piso — ver por que NÃO cabe, abaixo)
   *
   * **Por que 80 e não 88.** Com o painel "AS FORMAS" à direita do maquinário, a
   * largura dele é `544 − 3 × célula`. O painel precisa de 288 px (32 de recuo +
   * azulejo + 20 de folga + 174 do "RETÂNGULO" a 28 px, medido). Em 80 sobra 304;
   * em 88 sobram 280 e o nome da forma não cabe. Encolher o nome era pior: ele é
   * conteúdo pedagógico, não legenda.
   *
   * Passar de 44 exige o passo seguinte, que é decisão de JOGO e não de layout:
   * 6 linhas em vez de 7. Sete linhas de 88 são 616 px, 86% da altura lógica.
   *
   * O orçamento vertical, agora que o HUD virou coluna lateral:
   *
   *      0 –  40   margem e trilho
   *     40 – 140   curso da garra (repouso em trilhoY+30, pega a 6ª linha em 140)
   *    140 – 700   A GRADE — 7 linhas × 80
   *    700 – 720   plataforma (fica decorativa: 29 px)
   */
  grade: {
    celula: 80,
    /**
     * Lado do azulejo dentro da célula — 77,5% dela, a mesma proporção de antes
     * (50/64). Passa do tamanho NATIVO do PNG de 2013 (50 px), e isso é uma
     * troca consciente: no celular o azulejo é DESENHADO menor que a fonte
     * (62 × 0,5 = 31 px físicos), então lá não há ampliação nenhuma; a perda de
     * nitidez cai só onde a pendência 1 do README já a declara — tela grande e
     * retina. Ganhar 25% de alvo tocável no aparelho da criança vale isso.
     */
    azulejo: 62,
    baseY: 700,
    trilhoY: 40,
  },

  // --------------------------------------------------------------- tutorial
  /**
   * `fala` é o id de um áudio declarado em `assets`. NENHUM dos três existe
   * ainda: o motor não sintetiza voz, então o passo fica em silêncio e o console
   * nomeia o arquivo que falta. O `texto` ao lado é o que a locução deve dizer —
   * serve à legenda e ao aviso, nunca a uma voz sintética.
   *
   * O passo 3 é o que o original não ensinava em lugar nenhum, e é a regra que
   * decide a partida.
   */
  tutorial: [
    {
      titulo: 'Toque em uma coluna',
      texto: 'Toque numa coluna para a garra descer e pegar os blocos de cima.',
      fala: 'TOQUE_EM_UMA_COLUNA',
      /**
       * A garra desce até o topo da pilha, fecha, e SOBE COM A PEÇA.
       *
       * Três coisas aqui não são estilo: são o que torna o gesto legível, e cada
       * uma corrige um defeito que a ilustração tinha.
       *
       * 1. **A coluna do meio tem DOIS azulejos, não três.** A ilustração mede
       *    268 px de altura; com três azulejos o topo da pilha ficava a 26 px do
       *    trilho e a garra não cabia no vão — ela descia POR DENTRO da pilha.
       * 2. **A pilha é desenhada ANTES da garra e da carga.** Era o contrário: os
       *    azulejos pintavam por cima, e da metade do ciclo em diante não se via
       *    nem a garra nem o que ela levava — só um fiapo do triângulo entre dois
       *    azulejos.
       * 3. **A peça sai da pilha quando a garra a pega.** A pilha era sempre
       *    desenhada inteira, então o triângulo aparecia em dois lugares ao mesmo
       *    tempo e nada dizia qual peça havia sido pega.
       *
       * A troca de mão é em `ciclo 0.60`, com a garra PARADA e o azulejo no mesmo
       * ponto nos dois desenhos (`yPilhaTuto(a, 1)` === `y + OFFSET_CARGA_TUTO`).
       * Por isso a peça não dá salto ao mudar de dono: ela sai de onde estava,
       * pendurada na garra que a criança está olhando.
       */
      desenho: (ctx, l, a, t) => {
        const ciclo = (t % 2.6) / 2.6;

        const yTopo = a * 0.16;
        /** Onde a garra pega: o azulejo de cima da coluna do meio. */
        const yPega = yPilhaTuto(a, 1) - OFFSET_CARGA_TUTO;

        // desliza → desce → segura → sobe → espera no alto
        const x = l * (ciclo < 0.30 ? 0.32 + (ciclo / 0.30) * 0.18 : 0.50);
        const y = ciclo < 0.30 ? yTopo
          : ciclo < 0.55 ? yTopo + (yPega - yTopo) * ((ciclo - 0.30) / 0.25)
            : ciclo < 0.68 ? yPega
              : ciclo < 0.92 ? yPega - (yPega - yTopo) * ((ciclo - 0.68) / 0.24)
                : yTopo;

        const pegou = ciclo >= 0.60;
        // Chega aberta e fecha no instante em que pega — é o que dá causa visível
        // ao gesto, como a `Garra` da partida faz com `abertura`.
        const abertura = pegou ? 0 : 1;

        desenharTrilho(ctx, l, yTopo);
        desenharPilha(ctx, l, a, pegou ? ['circulo'] : ['circulo', 'triangulo']);
        desenharCorrente(ctx, x, yTopo, y);
        if (pegou) desenharAzulejo(ctx, x, y + OFFSET_CARGA_TUTO, 'triangulo');
        desenharGarra(ctx, x, y, abertura);
      },
    },
    {
      titulo: 'Junte três formas iguais',
      texto: 'Três ou mais formas iguais que se toquem desaparecem. Não precisa ser em fila!',
      fala: 'JUNTE_TRES_FORMAS_IGUAIS',
      desenho: (ctx, l, a, t) => {
        // Um L de três círculos: é o que ensina que combo não é fila.
        const ciclo = (t % 2.8) / 2.8;
        const brilho = ciclo > 0.6 ? 1 - (ciclo - 0.6) / 0.4 : 1;
        const escala = ciclo > 0.6 ? 1 + (1 - brilho) * 0.15 : 1;
        const cx = l / 2;
        const cy = a * 0.52;
        ctx.save();
        ctx.globalAlpha = brilho;
        for (const [dx, dy] of [[-56, 0], [0, 0], [0, -56]]) {
          ctx.save();
          ctx.translate(cx + dx, cy + dy);
          ctx.scale(escala, escala);
          desenharAzulejo(ctx, 0, 0, 'circulo');
          ctx.restore();
        }
        ctx.restore();
        desenharAzulejo(ctx, cx - 56, cy - 56, 'quadrado');
        desenharAzulejo(ctx, cx + 56, cy, 'triangulo');
      },
    },
    {
      titulo: 'Cuidado: a pilha sobe!',
      texto: 'De vez em quando nasce uma linha nova por baixo. Se a pilha chegar no teto, acabou.',
      fala: 'CUIDADO_A_PILHA_SOBE',
      desenho: (ctx, l, a, t) => {
        const ciclo = (t % 2.4) / 2.4;
        const subida = ciclo < 0.5 ? 0 : (ciclo - 0.5) / 0.5;
        const passo = 56;
        const chao = a * 0.78;
        desenharTrilho(ctx, l, a * 0.10);
        for (let lin = 0; lin < 4; lin++) {
          const y = chao - lin * passo - subida * passo;
          const formas = ['circulo', 'quadrado', 'triangulo', 'retangulo'];
          for (let col = 0; col < 3; col++) {
            desenharAzulejo(ctx, l / 2 + (col - 1) * passo, y, formas[(lin + col) % 4]);
          }
        }
        // A linha nova, nascendo por baixo do chão.
        if (subida > 0) {
          ctx.save();
          ctx.globalAlpha = subida;
          for (let col = 0; col < 3; col++) {
            desenharAzulejo(ctx, l / 2 + (col - 1) * passo, chao + passo - subida * passo, 'quadrado');
          }
          ctx.restore();
        }
      },
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Caminhos RELATIVOS a index.html. Um recurso que falhar não impede o jogo de
   * abrir — o motor avisa no console.
   *
   * As quatro narrações de forma e os três efeitos vêm da aula original. Cada um
   * tem ficha em `assets/audio-transcricao/<id>/transcricao.md`, conferida por
   * `node tools/audio-info.mjs jogo-das-formas`.
   */
  assets: [
    // Azulejos — ANDAIME de 2013, ver PLANO-VISUAL seção 3.2
    { id: 'blocoCirculo', src: './assets/img/bloco-circulo.png' },
    { id: 'blocoQuadrado', src: './assets/img/bloco-quadrado.png' },
    { id: 'blocoTriangulo', src: './assets/img/bloco-triangulo.png' },
    { id: 'blocoRetangulo', src: './assets/img/bloco-retangulo.png' },

    { id: 'mascote', src: './assets/img/bob.webp' },

    // Narração das formas — o conteúdo pedagógico do jogo
    { id: 'circulo', src: './assets/audio/circulo.mp3' },
    { id: 'quadrado', src: './assets/audio/quadrado.mp3' },
    { id: 'triangulo', src: './assets/audio/triangulo.mp3' },
    { id: 'retangulo', src: './assets/audio/retangulo.mp3' },

    // Música e efeitos
    { id: 'somFundo', src: './assets/audio/somFundo.mp3' },
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'nao', src: './assets/audio/nao.wav' },

    // Narração do tutorial
    { id: 'TOQUE_EM_UMA_COLUNA', src: './assets/audio/TOQUE_EM_UMA_COLUNA.mp3' },
    { id: 'JUNTE_TRES_FORMAS_IGUAIS', src: './assets/audio/JUNTE_TRES_FORMAS_IGUAIS.mp3' },
    { id: 'CUIDADO_A_PILHA_SOBE', src: './assets/audio/CUIDADO_A_PILHA_SOBE.mp3' },
  ],

  /**
   * O operário. Escalado pela ALTURA, com a largura saindo da proporção da arte.
   *
   * Limite honesto do modo imagem: uma figura estática não troca de rosto. As
   * expressões continuam funcionando como linguagem corporal — pular ao acertar,
   * inclinar ao comemorar, encolher ao lamentar — mas a feição não muda. Para
   * expressão facial de verdade seria preciso uma imagem por estado
   * (`imagensPorExpressao`).
   */
  mascote: {
    asset: 'mascote',
    /**
     * Onde o mascote aparece. Fora desta lista, a tela não o cria.
     *
     * **Só no MENU**, que é a tela de receber. As três saídas foram decididas
     * uma a uma, e por motivos diferentes:
     *
     *  - Na PARTIDA ele ocupava a tira à esquerda do pórtico e não tinha função:
     *    o retorno da jogada já vem pelo som, pelo placar e pelo próprio bloco
     *    desaparecendo. A grade é centrada na tela (`gradeX` sai de `L / 2`), então
     *    tirá-lo não move nada de lugar — só devolve o espaço, que virou a coluna
     *    do HUD e 16 px de célula a mais.
     *  - No TUTORIAL ele disputava a atenção com a ILUSTRAÇÃO, que é justamente o
     *    que ensina o gesto. Duas figuras animadas na mesma tela, e a criança
     *    olha a errada.
     *  - No RESULTADO ele ficava encostado na borda esquerda do painel, e o que
     *    a criança precisa ler ali é o bloco central: "MUITO BEM!", as cinco
     *    estrelas e os pontos. A comemoração já está nas estrelas acendendo uma
     *    a uma, que é a linguagem da tela — e o painel é centrado na tela, então
     *    tirá-lo não desequilibra nada.
     *
     * Sobra o menu, e ali ele trabalha: é a primeira figura que a criança vê e é
     * quem dá rosto à atividade antes de o jogo começar.
     */
    telas: ['menu'],
  },

  /**
   * `abertura` e as três falas do tutorial NÃO EXISTEM — não havia locução
   * equivalente na aula original. Ficam null de propósito: o motor deixa a tela
   * em silêncio e nomeia no console o arquivo que falta. Pendência registrada em
   * CHECKLIST-AUDIO.md.
   */
  audio: {
    musica: 'somFundo',
    clique: null,
    acerto: null,
    erro: 'nao',
    vitoria: 'acertoSOS',
    derrota: 'erroSOS',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Decisão do projeto: derrota também é uma tentativa e também é registrada. */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho das ilustrações do tutorial.
//
// Vetorial e sem depender do Loader de propósito: a TutorialScreen chama estas
// funções com um `ctx` cru, e um asset que falhasse deixaria o passo vazio. As
// formas aqui são aproximações reconhecíveis, não as peças da partida — o
// tutorial ensina o gesto, não a arte.
// ---------------------------------------------------------------------------

const LADO_TUTO = 48;

/** Passo vertical entre dois azulejos empilhados. */
const PASSO_TUTO = LADO_TUTO + 8;

/**
 * Distância do vértice da garra ao CENTRO do azulejo carregado.
 *
 * Vale 40 porque a garra tem 16 px de mandíbula (`desenharGarra`) e o azulejo
 * tem 24 px de meia-altura: com 40 as pontas param exatamente na aresta de cima
 * da peça, e a garra parece segurá-la em vez de atravessá-la. É o mesmo papel do
 * `OFFSET_CARGA` da partida (`src/scenes/GameScene.js`).
 */
const OFFSET_CARGA_TUTO = 40;

/**
 * Centro vertical do azulejo de índice `i` da pilha do tutorial — 0 é o de baixo.
 *
 * Existe para que a ilustração do passo 1 saiba PARAR a garra em cima da pilha em
 * vez de dentro dela. Repetir a conta nos dois lugares era o que deixava os dois
 * fora de sincronia sem nada acusar.
 */
const yPilhaTuto = (altura, i) => altura * 0.80 - i * PASSO_TUTO;

function desenharAzulejo(ctx, cx, cy, tipo) {
  const m = LADO_TUTO / 2;
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = cores.superficie;
  ctx.strokeStyle = cores.linha;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-m, -m, LADO_TUTO, LADO_TUTO, 8);
  ctx.fill();
  ctx.stroke();

  const paleta = {
    circulo: cores.ludica.azul,
    quadrado: cores.ludica.laranja,
    triangulo: cores.ludica.verde,
    retangulo: cores.ludica.roxo,
  };
  ctx.fillStyle = paleta[tipo] ?? cores.ludica.azul;
  ctx.beginPath();
  switch (tipo) {
    case 'circulo':
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      break;
    case 'triangulo':
      ctx.moveTo(0, -16);
      ctx.lineTo(15, 12);
      ctx.lineTo(-15, 12);
      ctx.closePath();
      break;
    case 'retangulo':
      ctx.roundRect(-17, -9, 34, 18, 4);
      break;
    default:
      ctx.roundRect(-14, -14, 28, 28, 5);
  }
  ctx.fill();
  ctx.restore();
}

function desenharTrilho(ctx, largura, y) {
  ctx.save();
  ctx.fillStyle = cores.tintaSuave;
  ctx.beginPath();
  ctx.roundRect(largura * 0.12, y - 9, largura * 0.76, 18, 9);
  ctx.fill();
  ctx.restore();
}

function desenharCorrente(ctx, x, deY, ateY) {
  ctx.save();
  ctx.strokeStyle = cores.tintaSuave;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x, deY);
  ctx.lineTo(x, ateY);
  ctx.stroke();
  ctx.restore();
}

/**
 * A garra. `abertura` vai de 0 (fechada, segurando) a 1 (aberta, chegando) e só
 * afasta as mandíbulas — o mesmo vocabulário da `Garra` da partida, para o gesto
 * do tutorial e o gesto do jogo serem o mesmo gesto.
 */
function desenharGarra(ctx, x, y, abertura = 1) {
  const braco = 13 + abertura * 7;
  ctx.save();
  ctx.strokeStyle = cores.tinta;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - braco, y + 16);
  ctx.lineTo(x, y);
  ctx.lineTo(x + braco, y + 16);
  ctx.stroke();
  ctx.restore();
}

/**
 * A pilha do tutorial: a coluna do meio vem de `formas` (de baixo para cima) e as
 * duas vizinhas são fixas, só para a coluna do meio ser visivelmente UMA coluna
 * entre outras.
 *
 * Passar a coluna do meio como parâmetro é o que permite ao passo 1 desenhar a
 * pilha JÁ SEM a peça que a garra pegou.
 */
function desenharPilha(ctx, largura, altura, formas) {
  const chao = yPilhaTuto(altura, 0);
  formas.forEach((tipo, i) => {
    desenharAzulejo(ctx, largura * 0.50, yPilhaTuto(altura, i), tipo);
  });
  desenharAzulejo(ctx, largura * 0.50 - PASSO_TUTO, chao, 'quadrado');
  desenharAzulejo(ctx, largura * 0.50 + PASSO_TUTO, chao, 'circulo');
}
