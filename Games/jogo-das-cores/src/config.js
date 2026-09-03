import { cores } from '../engine/index.js';

/**
 * config.js — a FORMA do Jogo das Cores.
 *
 * Refação da aula **870296** de 2013. Especificação em
 * `docs/REGRAS-JOGO-DAS-CORES.md`; layout e arte em
 * `docs/PLANO-VISUAL-JOGO-DAS-CORES.md`. Onde este arquivo e aqueles
 * discordarem, um dos dois está errado — nunca "depende".
 *
 * O que a criança faz: **desenha um caminho** por peças vizinhas da mesma cor,
 * três ou mais, e ao soltar elas somem e o nome da cor é narrado.
 */
export default {
  slug: 'jogo-das-cores',
  titulo: 'Jogo das Cores',
  subtitulo: 'Ligue as cores iguais!',
  aulaOriginal: '870296',

  objetivo: 'Discriminar cores e nomeá-las: encontrar iguais entre diferentes, '
    + 'ouvir o nome da cor no momento em que ela é conquistada, e planejar um percurso.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',
  textoEmCaixaAlta: true,

  /**
   * **Tema visual emprestado do Jogo das Formas**, e de propósito por enquanto.
   *
   * Decisão do humano: começar com o visual que já existe e trocar depois. Sai
   * de graça — o `Background` já tem o tema `'formas'` (céu geométrico em
   * degradê indigo → ciano), então nenhuma linha de motor é escrita para este
   * jogo abrir com cara de coleção.
   *
   * Quando ganhar identidade própria, é aqui que muda, e mais nada.
   */
  tema: 'formas',

  /**
   * **Sem mascote.** `telas: []` é como se diz isso: `mascote: null` NÃO apaga o
   * mascote — faz o motor cair na coruja vetorial (ver `Mascot`). A lista vazia
   * é o "em nenhuma tela".
   *
   * Motivo: o Jogo das Formas tirou o mascote de tudo menos do menu, e o
   * operário de lá é arte do Jogo dos Blocos. Trazer o mesmo personagem para uma
   * terceira aula sem decidir nada sobre isso seria empurrar a dívida adiante.
   */
  mascote: { telas: [] },

  // ----------------------------------------------------------------- níveis
  /**
   * Três níveis, **acrescentando** cores em vez de substituir.
   *
   * O original tinha dois, e o nível 2 TROCAVA as quatro cores (verde/amarelo/
   * azul/vermelho por rosa/marrom/roxo/laranja). Trocar é outro jogo; acrescentar
   * é progressão. E as oito locuções de 2013 existem — o mesmo raciocínio que
   * rendeu três níveis ao Jogo dos Blocos.
   *
   * **Mais cores é mais difícil por duas razões**, uma perceptiva e uma
   * mecânica: discriminar oito matizes é mais duro que quatro; e num tabuleiro
   * de 35 peças, 4 cores dão cerca de 9 peças cada e caminhos longos aparecem
   * sozinhos, enquanto 8 dão cerca de 4 e é preciso procurar.
   *
   * Metas 30 e 45 são as do original (`maxPontos = 15 + 15 × (nivel + 1)`); 36 é
   * a do nível novo, entre as duas.
   */
  niveis: [
    {
      id: 1,
      nome: 'Conhecer',
      descricao: '4 cores · 30 pontos',
      amostra: '● ● ● ●',
      cor: cores.primaria,
      meta: 30,
      vidas: 0,
      duracao: 120,
      cores: ['vermelho', 'azul', 'verde', 'amarelo'],
    },
    {
      id: 2,
      nome: 'Ampliar',
      descricao: '6 cores · 36 pontos',
      amostra: '● ● ● ● ● ●',
      cor: cores.secundaria,
      meta: 36,
      vidas: 0,
      duracao: 120,
      cores: ['vermelho', 'azul', 'verde', 'amarelo', 'laranja', 'roxo'],
    },
    {
      id: 3,
      // As oito. Inclui rosa e marrom, que no original eram o nível "difícil"
      // inteiro — e são, com vermelho e roxo, o grupo de pior contraste entre si.
      // Desde 02/09/2026 a peça é chapada, sem textura redundante (decisão de
      // acessibilidade do humano) — é aqui que a falta desse canal mais pesa.
      nome: 'Desafio',
      descricao: '8 cores · 45 pontos',
      amostra: '● ● ● ● ● ● ● ●',
      cor: cores.acerto,
      meta: 45,
      vidas: 0,
      duracao: 120,
      cores: ['vermelho', 'azul', 'verde', 'amarelo', 'laranja', 'roxo', 'rosa', 'marrom'],
    },
  ],

  // ---------------------------------------------------------------- as cores
  /**
   * A tabela das peças. Não há mais `imagem`: até 02/09/2026 cada cor tinha um
   * SVG com uma TEXTURA própria assada dentro (xadrez, bolinhas, ondas…), o
   * canal redundante que fazia o jogo existir para quem não distingue cor.
   *
   * **Decisão de acessibilidade do humano, na mesma data:** cor chapada, sem
   * textura e sem símbolo — considerou-se um ícone de forma por cor e foi
   * recusado de propósito, porque fixaria "azul = círculo" contradizendo a
   * lição do Jogo das Formas de que forma e cor são atributos independentes.
   * A consequência é real e fica medida em `REGRAS-JOGO-DAS-CORES.md`, seção
   * 3.2: sem textura, vermelho/azul/roxo — a 5 unidades de luminância um do
   * outro — voltam a ser praticamente indistinguíveis para quem não vê cor.
   *
   * `cor` é o token usado por `Peca.desenhar()`, pela linha do caminho e pelo
   * painel lateral.
   *
   * `som` é a locução do nome da cor. As oito chegaram em 02/09/2026 — narração
   * NOVA (não os arquivos de 2013), ainda **não confirmada ouvindo** (ver as
   * fichas em `assets/audio-transcricao/`). Onde `som` continuar `null`
   * ANUNCIA A LACUNA no console em vez de tocar em silêncio sem explicação; é o
   * comportamento honesto, e é o que impede a pendência de virar esquecimento.
   */
  cores: {
    vermelho: { cor: cores.ludica.vermelho, som: 'vermelho' },
    azul: { cor: cores.ludica.azul, som: 'azul' },
    verde: { cor: cores.ludica.verde, som: 'verde' },
    amarelo: { cor: cores.ludica.amarelo, som: 'amarelo' },
    laranja: { cor: cores.ludica.laranja, som: 'laranja' },
    roxo: { cor: cores.ludica.roxo, som: 'roxo' },
    rosa: { cor: cores.ludica.rosa, som: 'rosa' },
    marrom: { cor: cores.ludica.marrom, som: 'marrom' },
  },

  // --------------------------------------------------------------- geometria
  /**
   * Medida, não escolhida. PLANO-VISUAL, seção 1.
   *
   * A célula é 128 porque **o que limita a célula é o número de LINHAS**, e este
   * jogo tem 5 onde o Jogo das Formas tem 7 (sete linhas de 128 seriam 896 px,
   * mais que os 720 lógicos de altura).
   *
   * O tamanho físico do alvo é `(célula ÷ 720) × altura do aparelho`:
   *
   *   Android 20:9 deitado (800×360)   ->  64,0 px
   *   iPhone 14 Pro                    ->  69,9 px
   *   iPad deitado                     -> 102,4 px
   *
   * 64 px no pior caso, 45% acima do piso de 44 px do WCAG 2.5.5 — o primeiro
   * jogo do motor a passar sem ressalva. A folga importa mais aqui: o gesto é
   * arrastar por células vizinhas, não tocar num alvo isolado.
   */
  grade: {
    celula: 128,
    /** Lado do SVG dentro da célula: 88%, deixando 16 px de vão. */
    peca: 112,
    /** Mínimo de peças para o caminho valer. Era 3 no original. */
    minimo: 3,
  },

  // --------------------------------------------------------------- tutorial
  tutorial: [
    {
      titulo: 'Ligue as cores iguais',
      texto: 'Aperte numa cor e arraste o dedo para as vizinhas iguais. '
        + 'Pode ir de lado, para cima, para baixo e na diagonal.',
      fala: 'tutorial_tela1',
      desenho: (ctx, l, a, t) => {
        const lado = 74;
        const passo = 92;
        const x0 = l / 2 - passo;
        const y0 = a / 2;
        // Três peças azuis em L; o dedo percorre as três em laço.
        const pos = [[x0, y0], [x0 + passo, y0], [x0 + passo, y0 - passo]];
        const ciclo = (t % 3) / 3;
        const quantas = ciclo < 0.25 ? 1 : ciclo < 0.5 ? 2 : 3;

        for (let i = 0; i < pos.length; i++) {
          const [x, y] = pos[i];
          const dentro = i < quantas;
          ctx.save();
          ctx.fillStyle = dentro ? '#3B82F6' : '#93C5FD';
          ctx.beginPath();
          ctx.roundRect(x - lado / 2, y - lado / 2, lado, lado, 14);
          ctx.fill();
          // bolinhas: a textura da peça azul
          ctx.fillStyle = 'rgba(255,255,255,0.62)';
          for (let bi = 0; bi < 3; bi++) {
            for (let bj = 0; bj < 3; bj++) {
              ctx.beginPath();
              ctx.arc(x - lado / 2 + lado * (bi + 0.5) / 3,
                y - lado / 2 + lado * (bj + 0.5) / 3, lado * 0.075, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }

        // A linha do caminho, por cima — como no jogo.
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        for (const [cor, larg] of [['rgba(17,24,39,0.55)', 16], ['#FFFFFF', 9]]) {
          ctx.strokeStyle = cor;
          ctx.lineWidth = larg;
          ctx.beginPath();
          for (let i = 0; i < quantas; i++) {
            const [x, y] = pos[i];
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          if (quantas === 1) { ctx.moveTo(pos[0][0], pos[0][1]); ctx.lineTo(pos[0][0], pos[0][1]); }
          ctx.stroke();
        }
        ctx.restore();

        // O dedo, na ponta.
        const [px, py] = pos[quantas - 1];
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      },
    },
    {
      titulo: 'Três ou mais',
      texto: 'O caminho vale a partir de três peças. O número na ponta conta '
        + 'quantas você já ligou.',
      fala: 'tutorial_tela2',
      desenho: (ctx, l, a, t) => {
        const cx = l / 2;
        const cy = a / 2;
        const n = 1 + Math.floor((t % 3) / 3 * 3);   // 1, 2, 3
        const valido = n >= 3;
        ctx.save();
        ctx.translate(cx, cy);
        const pulso = valido ? 1 + Math.sin(t * 7) * 0.07 : 1;
        ctx.scale(pulso, pulso);
        ctx.fillStyle = valido ? '#16A34A' : '#FFFFFF';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, 62, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = valido ? '#FFFFFF' : '#111827';
        ctx.font = '700 66px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(n), 0, 3);
        ctx.restore();
      },
    },
    {
      titulo: 'Para desfazer, volte',
      texto: 'Sem soltar o dedo, arraste de volta por onde veio. O caminho '
        + 'encurta e você tenta outro.',
      fala: 'tutorial_tela3',
      desenho: (ctx, l, a, t) => {
        const lado = 74;
        const passo = 92;
        const y = a / 2;
        const x0 = l / 2 - passo * 1.5;
        const pos = [0, 1, 2, 3].map((i) => [x0 + i * passo, y]);
        // Cresce até 4 e recua até 2, em laço.
        const c = (t % 4) / 4;
        const quantas = c < 0.5 ? 1 + Math.floor(c * 8) : Math.max(2, 4 - Math.floor((c - 0.5) * 8));

        for (let i = 0; i < pos.length; i++) {
          const [x] = pos[i];
          ctx.fillStyle = i < quantas ? '#F97316' : '#FDBA74';
          ctx.beginPath();
          ctx.roundRect(x - lado / 2, y - lado / 2, lado, lado, 14);
          ctx.fill();
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x - lado / 2, y - lado / 2, lado, lado, 14);
          ctx.clip();
          ctx.strokeStyle = 'rgba(0,0,0,0.26)';
          ctx.lineWidth = lado * 0.085;
          for (let d = -1; d <= 4; d++) {
            ctx.beginPath();
            ctx.moveTo(x - lado / 2 + lado * d / 4, y - lado / 2);
            ctx.lineTo(x - lado / 2 + lado * (d + 1) / 4, y + lado / 2);
            ctx.stroke();
          }
          ctx.restore();
        }

        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        for (const [cor, larg] of [['rgba(17,24,39,0.55)', 16], ['#FFFFFF', 9]]) {
          ctx.strokeStyle = cor;
          ctx.lineWidth = larg;
          ctx.beginPath();
          ctx.moveTo(pos[0][0], y);
          for (let i = 1; i < quantas; i++) ctx.lineTo(pos[i][0], y);
          ctx.stroke();
        }
        ctx.restore();

        const [px] = pos[quantas - 1];
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(px, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      },
    },
  ],

  // ----------------------------------------------------------------- assets
  /**
   * As oito peças não têm mais arquivo — a cor é chapada, desenhada em
   * `Peca.desenhar()` (`src/scenes/GameScene.js`). Até 02/09/2026 havia um SVG
   * por cor, 17 KB somados, com uma textura assada dentro; saíram numa decisão
   * de acessibilidade — ver o comentário de `cores`, acima.
   *
   * **Os OITO NOMES DE COR chegaram** em 02/09/2026 — narração NOVA, não os
   * arquivos de 2013 (formato e tamanho são outros; ver as fichas em
   * `assets/audio-transcricao/`). **O som de vitória chegou em 03/09/2026**
   * (ver `acertoSOS` abaixo). **Os três passos do tutorial também chegaram**,
   * no mesmo dia (`tutorial_tela1/2/3`, ligados em `config.tutorial[i].fala`).
   * Ainda faltam: os dois áudios de nível (que nem servem — são
   * "fácil"/"difícil" e este jogo tem três níveis com outros nomes), o
   * feedback de derrota e a fala nova "Misturei as cores!". Essas continuam em
   * `Aulas para Refazer/Jogo das Cores/sons/`, e até chegarem o motor toca
   * silêncio e diz no console qual arquivo falta e o que ele deveria falar.
   */
  assets: [
    // Os oito nomes de cor narrados — o `id` é o próprio nome, mesma convenção
    // do Jogo das Formas (`som: 'circulo'`, não `somCirculo`). Nenhuma
    // transcrição foi CONFIRMADA ouvindo ainda; ver as fichas.
    { id: 'vermelho', src: './assets/audio/vermelho.mp3' },
    { id: 'azul', src: './assets/audio/azul.mp3' },
    { id: 'verde', src: './assets/audio/verde.mp3' },
    { id: 'amarelo', src: './assets/audio/amarelo.mp3' },
    { id: 'laranja', src: './assets/audio/laranja.mp3' },
    { id: 'roxo', src: './assets/audio/roxo.mp3' },
    { id: 'rosa', src: './assets/audio/rosa.mp3' },
    { id: 'marrom', src: './assets/audio/marrom.mp3' },

    // A música de fundo da própria aula 870296. É o MESMO arquivo dos outros
    // dois jogos (SHA-256 idêntico nos três originais de 2013) — a coleção
    // tinha uma música só, e manter isso é o que faz as três aulas soarem como
    // a mesma coleção.
    { id: 'somFundo', src: './assets/audio/somFundo.mp3' },

    // O efeito de vitória padrão do motor — MESMO arquivo (SHA-256 idêntico)
    // do Jogo das Formas e do Jogo dos Blocos: é o componente `FeedbackSOS`
    // compartilhado das aulas originais, sem fala (ver a ficha). Até este
    // jogo ganhar um som próprio, reaproveitar o padrão da coleção é melhor
    // que a tela de vitória ficar muda.
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },

    // Os três passos do tutorial, um arquivo por tela — narração nova,
    // nenhuma transcrição CONFIRMADA ouvindo ainda; ver as fichas.
    { id: 'tutorial_tela1', src: './assets/audio/tutorial_tela1.mp3' },
    { id: 'tutorial_tela2', src: './assets/audio/tutorial_tela2.mp3' },
    { id: 'tutorial_tela3', src: './assets/audio/tutorial_tela3.mp3' },
  ],

  /**
   * A MÚSICA e os OITO NOMES DE COR estão ligados. O resto da VOZ ainda não: o
   * motor lida com a lacuna — `AudioBus.falar(null)` registra no console o
   * texto que a voz deveria dizer, e a tela fica em silêncio em vez de
   * sintetizar uma pronúncia que ninguém revisou.
   */
  audio: {
    musica: 'somFundo',
    clique: null,
    acerto: null,
    erro: null,
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
    falaVitoria: null,
    falaDerrota: null,
    /**
     * "Misturei as cores!" — quando o tabuleiro trava e as peças se
     * reorganizam. NÃO existe na aula de 2013, porque lá o travamento não era
     * tratado: o jogo simplesmente parava. Precisa ser gravado junto com os
     * outros; até então o motor avisa a lacuna no console.
     */
    misturar: null,
  },

  // -------------------------------------------------------------------- AVA
  registrarDerrota: true,
};
