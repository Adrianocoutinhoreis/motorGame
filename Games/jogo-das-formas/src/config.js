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
  tema: 'construcao',

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

  /** Geometria da partida. 64 = acessibilidade.alvoMinimo, e não por acaso: a
   *  coluna é o alvo tocável do jogo. Ver PLANO-VISUAL, seção 4.2. */
  grade: {
    celula: 64,
    /** Lado do azulejo desenhado dentro da célula. 50 = tamanho NATIVO do PNG
     *  de 2013; não esticar, a ampliação já é 3x num notebook retina. */
    azulejo: 50,
    baseY: 664,
    trilhoY: 104,
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
      titulo: 'Toque numa coluna',
      texto: 'Toque numa coluna para a garra descer e pegar os blocos de cima.',
      fala: 'tutorial_pegar',
      desenho: (ctx, l, a, t) => {
        const ciclo = (t % 2.6) / 2.6;
        const x = l * (ciclo < 0.35 ? 0.32 + (ciclo / 0.35) * 0.18 : 0.50);
        const yTopo = a * 0.16;
        const yBaixo = a * 0.52;
        const y = ciclo < 0.35 ? yTopo
          : ciclo < 0.6 ? yTopo + (yBaixo - yTopo) * ((ciclo - 0.35) / 0.25)
            : ciclo < 0.8 ? yBaixo
              : yBaixo - (yBaixo - yTopo) * ((ciclo - 0.8) / 0.2);
        desenharTrilho(ctx, l, yTopo);
        desenharCorrente(ctx, x, yTopo, y);
        desenharGarra(ctx, x, y);
        if (ciclo > 0.6) desenharAzulejo(ctx, x, y + 46, 'triangulo');
        desenharPilha(ctx, l, a, ['circulo', 'quadrado', 'triangulo']);
      },
    },
    {
      titulo: 'Junte três formas iguais',
      texto: 'Três ou mais formas iguais que se toquem desaparecem. Não precisa ser em fila!',
      fala: 'tutorial_combo',
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
      fala: 'tutorial_pilha',
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
  ],

  /** Coruja vetorial: este jogo não tem arte de mascote própria. */
  mascote: null,

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

function desenharGarra(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = cores.tinta;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 18, y + 16);
  ctx.lineTo(x, y);
  ctx.lineTo(x + 18, y + 16);
  ctx.stroke();
  ctx.restore();
}

function desenharPilha(ctx, largura, altura, formas) {
  const passo = LADO_TUTO + 8;
  const chao = altura * 0.80;
  formas.forEach((tipo, i) => {
    desenharAzulejo(ctx, largura * 0.50, chao - i * passo, tipo);
  });
  desenharAzulejo(ctx, largura * 0.50 - passo, chao, 'quadrado');
  desenharAzulejo(ctx, largura * 0.50 + passo, chao, 'circulo');
}
