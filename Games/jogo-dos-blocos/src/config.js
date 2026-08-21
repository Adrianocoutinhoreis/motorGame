/**
 * config.js — o "formulário" do Jogo dos Blocos.
 *
 * Refação da aula 870294 (`BlocosNumericos.js`, CreateJS/Flash, 2013).
 *
 * O que mudou em relação ao original, e por quê:
 *
 *  - **Três níveis em vez de dois.** O original tinha "fácil" (números 1–5) e
 *    "difícil" (vogais A–U) — duas habilidades diferentes rotuladas como graus
 *    de dificuldade, o que confunde o professor. Aqui são: contagem 1–5,
 *    contagem 6–10 e vogais. A locução de "seis" a "dez" JÁ EXISTIA nos assets
 *    originais (`seis.mp3`…`dez.mp3`); o jogo antigo nunca a carregava.
 *  - **Registro no AVA**, que não existia.
 *  - **Toque, responsivo, pausa e tutorial navegável.**
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'jogo-dos-blocos',
  titulo: 'Jogo dos Blocos',
  subtitulo: 'Empilhe os blocos na ordem certa!',

  objetivo:
    'Reconhecer e ordenar sequências (números de 1 a 5, de 6 a 10 e as vogais), '
    + 'associando cada símbolo ao seu nome falado, enquanto treina coordenação e ritmo.',
  faixaEtaria: '4 a 7 anos',
  aulaOriginal: '870294',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',

  /**
   * Regra RE-01: todo texto exibido vai em CAIXA ALTA.
   * Aos 4–7 anos a criança lê letra bastão maiúscula; minúscula não é mais
   * confortável para ela, é ilegível. Ver docs/REGRAS-EDUCACIONAIS.md.
   */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * `meta` vira `totalPerguntas` no contrato do AVA e `id` vira `nivel`.
   * `duracaoGuindaste` é o tempo de UMA travessia: quanto menor, mais difícil
   * acertar o momento de soltar.
   */
  niveis: [
    {
      id: 1,
      nome: 'Números 1 a 5',
      descricao: 'Contagem inicial',
      amostra: '1 2 3 4 5',
      cor: '#2563EB',
      meta: 5,
      vidas: 3,
      duracaoGuindaste: 2.8,
      simbolos: ['1', '2', '3', '4', '5'],
      sons: ['um', 'dois', 'tres', 'quatro', 'cinco'],
    },
    {
      id: 2,
      nome: 'Números 6 a 10',
      descricao: 'Continuando a contar',
      amostra: '6 7 8 9 10',
      cor: '#7C3AED',
      meta: 5,
      vidas: 3,
      duracaoGuindaste: 2.4,
      simbolos: ['6', '7', '8', '9', '10'],
      sons: ['seis', 'sete', 'oito', 'nove', 'dez'],
    },
    {
      id: 3,
      nome: 'Vogais',
      descricao: 'A, E, I, O, U',
      amostra: 'A E I O U',
      cor: '#16A34A',
      meta: 5,
      vidas: 3,
      duracaoGuindaste: 2.1,
      simbolos: ['A', 'E', 'I', 'O', 'U'],
      sons: ['a', 'e', 'i', 'o', 'u'],
    },
  ],

  // --------------------------------------------------------------- tutorial
  tutorial: [
    {
      titulo: 'O gancho vai e vem',
      texto: 'Um bloco fica pendurado no gancho, indo de um lado para o outro.',
      desenho: (ctx, l, a, t) => {
        const x = l / 2 + Math.sin(t * 1.6) * (l * 0.22);
        const y = a * 0.30;
        desenharTrilho(ctx, l, a * 0.16);
        desenharCorrente(ctx, x, a * 0.16, y);
        desenharBlocoSimples(ctx, x, y, '3');
      },
    },
    {
      titulo: 'Toque para soltar',
      texto: 'Toque na tela quando o bloco estiver bem em cima da torre.',
      desenho: (ctx, l, a, t) => {
        const ciclo = (t % 2.2) / 2.2;
        const x = l / 2;
        const yTopo = a * 0.28;
        const yBase = a * 0.72;
        const y = ciclo < 0.45 ? yTopo : yTopo + (yBase - yTopo) * ((ciclo - 0.45) / 0.55);

        desenharTrilho(ctx, l, a * 0.16);
        desenharBase(ctx, x, a * 0.86);
        if (ciclo < 0.45) desenharCorrente(ctx, x, a * 0.16, yTopo);
        desenharBlocoSimples(ctx, x, y, '3');

        // A mãozinha que toca: mostra o gesto, sem depender de texto.
        if (ciclo > 0.32 && ciclo < 0.55) desenharMao(ctx, x + 90, a * 0.55);
      },
    },
    {
      titulo: 'Cinco blocos e você venceu',
      texto: 'Se o bloco cair fora, você perde um coração. São três corações.',
      desenho: (ctx, l, a) => {
        const x = l / 2 - 30;
        desenharBase(ctx, x, a * 0.86);
        ['1', '2', '3'].forEach((s, i) => desenharBlocoSimples(ctx, x, a * 0.74 - i * 62, s));

        ctx.save();
        ctx.fillStyle = '#DC2626';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(l * 0.80, a * 0.30 + i * 62, 22, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      },
    },
  ],

  // ------------------------------------------------------------------ áudio
  /** Caminhos relativos ao index.html. Todos os arquivos vivem em ./assets/. */
  assets: [
    { id: 'bloco', src: './assets/img/bloco.svg' },
    { id: 'mascote', src: './assets/img/worker.webp' },
    { id: 'base', src: './assets/img/base.svg' },
    { id: 'gancho', src: './assets/img/gancho.svg' },

    // Narração dos símbolos — o conteúdo pedagógico do jogo.
    { id: 'um', src: './assets/audio/um.mp3' },
    { id: 'dois', src: './assets/audio/dois.mp3' },
    { id: 'tres', src: './assets/audio/tres.mp3' },
    { id: 'quatro', src: './assets/audio/quatro.mp3' },
    { id: 'cinco', src: './assets/audio/cinco.mp3' },
    { id: 'seis', src: './assets/audio/seis.mp3' },
    { id: 'sete', src: './assets/audio/sete.mp3' },
    { id: 'oito', src: './assets/audio/oito.mp3' },
    { id: 'nove', src: './assets/audio/nove.mp3' },
    { id: 'dez', src: './assets/audio/dez.mp3' },
    { id: 'a', src: './assets/audio/a.mp3' },
    { id: 'e', src: './assets/audio/e.mp3' },
    { id: 'i', src: './assets/audio/i.mp3' },
    { id: 'o', src: './assets/audio/o.mp3' },
    { id: 'u', src: './assets/audio/u.mp3' },

    // Ambiente e feedback
    { id: 'abertura', src: './assets/audio/abertura.mp3' },
    { id: 'somFundo', src: './assets/audio/somFundo.mp3' },
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'sim', src: './assets/audio/sim.wav' },
    { id: 'nao', src: './assets/audio/nao.wav' },
  ],

  /**
   * Mascote do jogo: o operário de obra, coerente com o guindaste e os blocos.
   * Aponta para um id declarado em `assets`. Se omitido, o motor desenha a
   * coruja vetorial padrão.
   */
  mascote: { asset: 'mascote' },

  audio: {
    musica: 'somFundo',
    clique: null,        // os originais não têm efeito de clique; o botão dá retorno visual
    acerto: null,        // o retorno de acerto É a narração do símbolo
    erro: 'nao',
    vitoria: 'acertoSOS',
    derrota: 'erroSOS',
    abertura: 'abertura',
    escolhaNivel: null,  // sem locução gravada — cai para síntese de voz (ver README)
  },

  // -------------------------------------------------------------------- AVA
  /**
   * Mapeamento semântico (ver CHECKLIST.md, seção 5):
   *   totalPerguntas = 5  (os blocos da torre)
   *   acertos        = blocos encaixados
   *   erros          = blocos derrubados
   *   nivel          = 1 | 2 | 3
   */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenhos auxiliares do tutorial. Ficam aqui, junto do texto que explicam.
// ---------------------------------------------------------------------------

function desenharTrilho(ctx, largura, y) {
  ctx.save();
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(largura * 0.12, y - 10, largura * 0.76, 16, 8);
  ctx.fill();
  ctx.restore();
}

function desenharCorrente(ctx, x, deY, ateY) {
  ctx.save();
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 6;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.moveTo(x, deY);
  ctx.lineTo(x, ateY - 34);
  ctx.stroke();
  ctx.restore();
}

function desenharBlocoSimples(ctx, cx, cy, simbolo) {
  const l = 104;
  const a = 62;
  ctx.save();
  ctx.translate(cx - l / 2, cy - a / 2);

  ctx.fillStyle = '#D97706';
  ctx.strokeStyle = '#7C2D12';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(0, 0, l, a, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.roundRect(16, 12, l - 32, a - 24, 8);
  ctx.fill();

  ctx.fillStyle = '#7C2D12';
  ctx.font = '800 30px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(simbolo, l / 2, a / 2 + 1);
  ctx.restore();
}

function desenharBase(ctx, cx, cy) {
  ctx.save();
  ctx.fillStyle = '#78350F';
  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(cx - 90, cy - 14, 180, 26, 8);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function desenharMao(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#FDE68A';
  ctx.strokeStyle = '#92400E';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y + 26, 26, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x - 9, y - 34, 18, 46, 9);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
