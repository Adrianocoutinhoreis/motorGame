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
  /**
   * `fala` é o id de um áudio declarado em `assets`; o `texto` ao lado é o que
   * a locução diz, e serve à legenda e ao aviso de console — nunca a voz
   * sintética. Os três passos já têm gravação; se um `fala` for removido, o
   * passo fica em silêncio e o motor denuncia no console.
   */
  tutorial: [
    {
      titulo: 'O gancho vai e vem',
      texto: 'Um bloco fica pendurado no gancho, indo de um lado para o outro.',
      fala: 'gancho_vai_vem',
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
      fala: 'toque_soltar',
      desenho: (ctx, l, a, t, loader) => {
        const ciclo = (t % 2.2) / 2.2;
        const x = l / 2;
        const yTopo = a * 0.28;
        const yBase = a * 0.72;
        const y = ciclo < 0.45 ? yTopo : yTopo + (yBase - yTopo) * ((ciclo - 0.45) / 0.55);

        desenharTrilho(ctx, l, a * 0.16);
        desenharBase(ctx, x, a * 0.86);
        if (ciclo < 0.45) desenharCorrente(ctx, x, a * 0.16, yTopo);
        desenharBlocoSimples(ctx, x, y, '3');

        // Animação de clique com 2 frames (mouse_off.png e mouse_on.png)
        const pressionado = ciclo >= 0.42 && ciclo <= 0.54;
        const mouseOffsetY = pressionado ? 6 : 0;
        desenharMousePng(ctx, x + 115, a * 0.50 + mouseOffsetY, pressionado, loader);
      },
    },
    {
      titulo: 'Cinco blocos e você venceu',
      texto: 'Se o bloco cair fora, você perde um coração. São três corações.',
      fala: 'cinblocos_venceu',
      desenho: (ctx, l, a) => {
        // Torre de 5 blocos alinhada à esquerda
        const xTorre = l * 0.36;
        const baseY = a * 0.88;
        desenharBase(ctx, xTorre, baseY);

        const simbolos = ['1', '2', '3', '4', '5'];
        const larguraBloco = 88;
        const alturaBloco = 42;

        simbolos.forEach((s, i) => {
          const cy = baseY - 20 - i * (alturaBloco + 2);
          desenharBlocoSimples(ctx, xTorre, cy, s, larguraBloco, alturaBloco);
        });

        // 3 corações alinhados na HORIZONTAL no lado direito
        const xCoracoes = l * 0.72;
        const yCoracoes = a * 0.50;
        const espacamentoX = 54;
        const inicioX = xCoracoes - espacamentoX;

        for (let i = 0; i < 3; i++) {
          desenharCoracao(ctx, inicioX + i * espacamentoX, yCoracoes, 42);
        }
      },
    },
  ],

  // ------------------------------------------------------------------ áudio
  /** Caminhos relativos ao index.html. Todos os arquivos vivem em ./assets/. */
  assets: [
    { id: 'bloco', src: './assets/img/bloco.svg' },
    { id: 'mascote', src: './assets/img/bob.webp' },
    { id: 'base', src: './assets/img/base.svg' },
    { id: 'gancho', src: './assets/img/gancho.svg' },
    { id: 'mouse_off', src: './assets/img/mouse/mouse_off.png' },
    { id: 'mouse_on', src: './assets/img/mouse/mouse_on.png' },

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

    // Narração do tutorial — uma por passo. Lote novo (128 kbps, 44 100 Hz),
    // diferente do lote de 2013 acima; ver CHECKLIST-AUDIO.md.
    { id: 'gancho_vai_vem', src: './assets/audio/gancho_vai_vem.mp3' },
    { id: 'toque_soltar', src: './assets/audio/toque_soltar.mp3' },
    { id: 'cinblocos_venceu', src: './assets/audio/cinblocos_venceu.mp3' },

    // Ambiente e feedback
    { id: 'abertura', src: './assets/audio/abertura.mp3' },
    { id: 'somFundo', src: './assets/audio/somFundo.mp3' },
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'sim', src: './assets/audio/sim.wav' },
    { id: 'nao', src: './assets/audio/nao.mp3' },
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
    // Desligado em 03/09/2026, por pedido do humano: narrava sozinho, assim
    // que o menu abria, sem ninguém pedir. O arquivo (`abertura.mp3`) já
    // estava sinalizado como pendência antes disso — foi TROCADO em algum
    // momento e ninguém ouviu o que ficou (ficha 🔴 NÃO VERIFICADA, ver
    // `assets/audio-transcricao/abertura/transcricao.md`). Tocar um arquivo
    // que ninguém revisou para a criança, sozinho, é pior que o silêncio: é
    // uma falha disfarçada de conteúdo. Volta a `'abertura'` quando alguém
    // ouvir e confirmar a ficha.
    abertura: null,

    // Narração sem gravação. Enquanto estiver `null`, a tela fica em SILÊNCIO e
    // o motor avisa no console — ele não sintetiza voz para tapar o buraco.
    // A lista do que gravar, com o texto de cada locução, está em
    // assets/audio-transcricao/A-GRAVAR.md.
    escolhaNivel: null,  // "Escolha um nível"
    falaVitoria: null,   // "Muito bem! Você conseguiu!"
    falaDerrota: null,   // "Quase! Vamos tentar de novo?"
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

function desenharBlocoSimples(ctx, cx, cy, simbolo, l = 104, a = 62) {
  ctx.save();
  ctx.translate(cx - l / 2, cy - a / 2);

  ctx.fillStyle = '#D97706';
  ctx.strokeStyle = '#7C2D12';
  ctx.lineWidth = Math.max(2, Math.round(a * 0.065));
  ctx.beginPath();
  ctx.roundRect(0, 0, l, a, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  const padX = Math.round(l * 0.15);
  const padY = Math.round(a * 0.18);
  ctx.roundRect(padX, padY, l - padX * 2, a - padY * 2, 6);
  ctx.fill();

  ctx.fillStyle = '#7C2D12';
  const fontSize = Math.round(a * 0.52);
  ctx.font = `800 ${fontSize}px system-ui, sans-serif`;
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

function desenharMao(ctx, x, y, pressionado = false) {
  ctx.save();

  // Frame 2: Anel de onda / clique (ripple effect) quando o toque ocorre
  if (pressionado) {
    ctx.save();
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.85)';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y - 34, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y - 34, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Deslocamento de 6px para baixo no Frame 2 para simular o movimento de pressionar
  const offsetY = pressionado ? 6 : 0;

  ctx.fillStyle = '#FDE68A';
  ctx.strokeStyle = '#92400E';
  ctx.lineWidth = 4;

  // Palma da mão
  ctx.beginPath();
  ctx.ellipse(x, y + 26 + offsetY, 26, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dedo indicador
  ctx.beginPath();
  ctx.roundRect(x - 9, y - 34 + offsetY, 18, 46, 9);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function desenharCoracao(ctx, x, y, tamanho = 40) {
  ctx.save();
  ctx.translate(x, y);

  const s = tamanho / 36;
  ctx.scale(s, s);

  ctx.fillStyle = '#EF4444';
  ctx.strokeStyle = '#991B1B';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-12, -10, -26, 4, 0, 24);
  ctx.bezierCurveTo(26, 4, 12, -10, 0, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Brilho suave
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.arc(-6, -2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function desenharMousePng(ctx, x, y, pressionado, loader) {
  const imgId = pressionado ? 'mouse_on' : 'mouse_off';
  const img = loader?.imagem(imgId);

  ctx.save();
  if (img && (img.naturalWidth > 0 || img.width > 0)) {
    const nw = img.naturalWidth || img.width || 100;
    const nh = img.naturalHeight || img.height || 100;
    const largura = 76;
    const altura = Math.round(largura * (nh / nw));
    ctx.drawImage(img, x, y, largura, altura);
  } else {
    // Fallback vetorial de cursor de clique
    ctx.fillStyle = pressionado ? '#F59E0B' : '#FFFFFF';
    ctx.strokeStyle = '#0B1220';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 24, y + 36);
    ctx.lineTo(x + 14, y + 36);
    ctx.lineTo(x + 22, y + 52);
    ctx.lineTo(x + 14, y + 54);
    ctx.lineTo(x + 6, y + 38);
    ctx.lineTo(x, y + 44);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
