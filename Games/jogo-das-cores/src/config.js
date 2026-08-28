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
      // É onde a textura da peça deixa de ser redundância e passa a ser o canal.
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
   * A tabela das peças.
   *
   * `imagem` é o id do SVG declarado em `assets`. `cor` é o token equivalente, e
   * serve para a linha do caminho e como reserva se o SVG não carregar.
   *
   * **A textura NÃO aparece aqui**, e isso é deliberado: ela está dentro do
   * arquivo SVG, que é o único lugar onde pode estar sem risco de duas cópias
   * divergirem. Ver PLANO-VISUAL, seção 3.3.
   *
   * `som` é a locução do nome da cor. **Todas null por enquanto** — as oito
   * gravações de 2013 existem e ainda não foram trazidas. O motor toca silêncio
   * e ANUNCIA A LACUNA no console, dizendo o que a voz deveria falar; é o
   * comportamento honesto, e é o que impede a pendência de virar esquecimento.
   */
  cores: {
    vermelho: { imagem: 'corVermelho', cor: cores.ludica.vermelho, som: null },
    azul: { imagem: 'corAzul', cor: cores.ludica.azul, som: null },
    verde: { imagem: 'corVerde', cor: cores.ludica.verde, som: null },
    amarelo: { imagem: 'corAmarelo', cor: cores.ludica.amarelo, som: null },
    laranja: { imagem: 'corLaranja', cor: cores.ludica.laranja, som: null },
    roxo: { imagem: 'corRoxo', cor: cores.ludica.roxo, som: null },
    rosa: { imagem: 'corRosa', cor: cores.ludica.rosa, som: null },
    marrom: { imagem: 'corMarrom', cor: cores.ludica.marrom, som: null },
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
   * As oito peças. Arte NOVA: este é o único dos três originais sem nenhum PNG
   * de bloco — as peças de 2013 eram vetor dentro de `JogoCores_visual.js`, com
   * 344 KB. Os oito SVG somam 17 KB.
   *
   * **O áudio ainda não está aqui.** As 16 gravações da aula original (os oito
   * nomes de cor, a instrução, dois de nível e o feedback) continuam em
   * `Aulas para Refazer/Jogo das Cores/sons/`. Decisão do humano: os sons das
   * cores vêm depois. Até lá o motor toca silêncio e diz no console qual arquivo
   * falta e o que ele deveria falar.
   */
  assets: [
    { id: 'corVermelho', src: './assets/img/cor-vermelho.svg' },
    { id: 'corAzul', src: './assets/img/cor-azul.svg' },
    { id: 'corVerde', src: './assets/img/cor-verde.svg' },
    { id: 'corAmarelo', src: './assets/img/cor-amarelo.svg' },
    { id: 'corLaranja', src: './assets/img/cor-laranja.svg' },
    { id: 'corRoxo', src: './assets/img/cor-roxo.svg' },
    { id: 'corRosa', src: './assets/img/cor-rosa.svg' },
    { id: 'corMarrom', src: './assets/img/cor-marrom.svg' },
  ],

  /**
   * Tudo null por enquanto, e o motor lida com isso: `AudioBus.falar(null)`
   * registra a lacuna com o texto que a voz deveria dizer, e a tela fica em
   * silêncio em vez de sintetizar uma pronúncia que ninguém revisou.
   */
  audio: {
    musica: null,
    clique: null,
    acerto: null,
    erro: null,
    vitoria: null,
    derrota: null,
    abertura: null,
    falaVitoria: null,
    falaDerrota: null,
  },

  // -------------------------------------------------------------------- AVA
  registrarDerrota: true,
};
