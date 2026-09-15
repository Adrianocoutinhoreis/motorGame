/**
 * config.js — o "formulário" do Jogo da Memória.
 *
 * Baseado no vídeo de referência (`numerandus/finalizados/1ano/jOGO_DA_MEMORIA`) e no
 * projeto-fonte `Videos_Numerandus/Jogo_da_memoria/src/JogoDaMemoria/index.tsx`: um
 * tabuleiro de cartas viradas para baixo onde, ao virar duas, elas combinam por
 * ASSOCIAÇÃO — uma carta mostra um item concreto (ex.: "Leite"), a outra mostra a
 * unidade/grandeza correspondente (ex.: "LITRO") — não por serem iguais.
 *
 * O vídeo é só uma demo parcial e sua pareação real é inconsistente (mistura
 * item↔unidade com item↔categoria); o conjunto de pares usado aqui
 * (`src/scenes/GameScene.js`, constante `CATEGORIAS`) foi desenhado para ser coerente
 * e coberto o suficiente para 3 níveis, mantendo o espírito do vídeo — decisão
 * confirmada com o humano antes de começar (ver a conversa de design).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'jogo-da-memoria',
  titulo: 'Jogo da Memória',
  subtitulo: 'Ache o par que combina',

  objetivo: 'Treinar memória de posição junto com noções de grandezas e medidas: virar duas '
    + 'cartas e reconhecer quando um item (ex.: "leite") combina com sua unidade de medida '
    + '(ex.: "litro"), não porque são iguais, mas porque uma mede a outra.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',

  /**
   * Tema 'quadro' reaproveitado do Jogo da Velha (mesma bandeja de giz, mesmos
   * rabiscos brancos) — zero mudança em engine/ui/Background.js. Só a COR do
   * quadro-negro muda: roxo-ardósia em vez do verde da Velha, pelo mesmo
   * mecanismo de override que o Encaixe Certo já usa pro tema 'quarto'
   * (`corCeuTopo`/`corCeuBase` em `Background`, lido por `GameScene`). O verso
   * das cartas (`Carta._desenharVerso`, `GameScene.js`) usa a MESMA família de
   * cor, pra o tabuleiro não parecer emendado de outro jogo.
   */
  tema: 'quadro',
  corCeuTopo: '#241B47',
  corCeuBase: '#3D2B72',

  /** Sem os rabiscos de giz (grade/círculos) do tema — competiam visualmente
   *  com as cartas do tabuleiro. Mesma decisão já tomada pelo Encaixe Certo
   *  (cenário limpo, foco total no que a criança precisa distinguir). */
  mostrarDecoracoes: false,

  /** Sem a bandeja de giz marrom na base da tela — pedido do humano; o céu
   *  roxo-ardósia vai até o fim da tela. Opção nova em `Background`
   *  (`mostrarChao`), retrocompatível (padrão `true`, nenhum outro jogo muda). */
  mostrarChao: false,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * A dificuldade cresce em pares por rodada (`meta`) — cada `meta` precisa ter uma
   * entrada correspondente em `GRADE_POR_META` (`src/scenes/GameScene.js`), que decide
   * quantas linhas/colunas o tabuleiro usa. `meta` nunca passa de 6: é o tamanho do
   * pool de categorias (`CATEGORIAS`), e cada rodada sorteia categorias SEM repetir.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: '3 pares', amostra: '3 pares',
      cor: '#16A34A', meta: 3,
    },
    {
      id: 2, nome: 'Médio', descricao: '4 pares', amostra: '4 pares',
      cor: '#F59E0B', meta: 4,
    },
    {
      id: 3, nome: 'Difícil', descricao: '6 pares', amostra: '6 pares',
      cor: '#DC2626', meta: 6,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). Sem narração ainda (ver "Pendências conhecidas" no README) —
   * `fala` fica de fora de propósito, não é esquecimento: os áudios brutos
   * fornecidos não estão identificados por passo, e o motor nunca chuta uma
   * transcrição/mapeamento sem confirmação humana.
   */
  tutorial: [
    {
      titulo: 'Cada carta esconde uma surpresa',
      texto: 'Toque numa carta virada pra baixo pra ver o que tem nela.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 1, t }),
    },
    {
      titulo: 'Ache a carta que combina',
      texto: 'Vire duas cartas. Se elas combinarem — como "leite" e "litro" — as duas ficam '
        + 'reveladas!',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Errou? Sem problema!',
      texto: 'Se as cartas não combinarem, elas viram de volta com calma. Tente de novo até '
        + 'achar todos os pares.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 3, t }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * `acertoSOS` (vitória) e `soltarPeca` (par encontrado) são o MESMO arquivo já
   * usado no resto da coleção — sem fala, então servem a qualquer jogo (ver
   * `assets/audio-transcricao/` deste jogo). Sem som de clique nem música de
   * fundo, mesma decisão do Encaixe Certo/Ordenação. Narração do tutorial e das
   * telas de apoio (`escolhaNivel`, `falaVitoria`) ficam `null` até um áudio
   * confirmado existir — ver "Pendências conhecidas" no README.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
  ],

  /** Sem mascote nesta partida — o tabuleiro de cartas é a área de maior destaque. */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca', // toca quando um PAR é encontrado (reaproveitado, ver acima)
    erro: null,
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
    falaVitoria: null, // "Muito bem! Você conseguiu!" — narração ainda não gravada
    escolhaNivel: null, // "Escolha um nível" — narração ainda não gravada
  },

  // -------------------------------------------------------------------- AVA
  /** Este jogo nunca tem derrota: só demora mais quando o aluno erra o par. */
  registrarDerrota: false,

  /** RE-03: o placar mostra "N PARES" — literal aqui, é um jogo de pares. */
  unidadePlacar: { singular: 'par', plural: 'pares' },

  /** Linha extra na tela de resultado com o tempo da partida (mm:ss). */
  mostrarTempo: true,

  /**
   * Cronômetro AO VIVO no HUD durante a partida — puramente informativo, sem
   * prazo, sem cor de alerta (mesma decisão do Encaixe Certo/Ordenação).
   * `false` remove o relógio (e o "X/Y" de progresso que mora no mesmo
   * indicador, ver `GameScene._relogioBadge`). `mostrarTempo` acima (tela de
   * RESULTADO) é independente disto.
   */
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenho auxiliar do tutorial. Independente da `GameScene` real de propósito
// (mesmo padrão do Encaixe Certo) — tutorial e partida nunca divergem em
// silêncio por trás de um código compartilhado quebrado.
// ---------------------------------------------------------------------------

const FONTE_EMOJI_TUTORIAL = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";

/** Posição no ciclo [0,1) de um período em segundos — pro loop do desenho animado. */
function faseCiclo(t, periodo) {
  return (((t % periodo) + periodo) % periodo) / periodo;
}

/** Uma carta simples, centrada em (0,0) — verso decorativo ou frente com conteúdo. */
function desenharCartaTutorial(ctx, w, h, frente, conteudo, destaque) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 14);

  if (!frente) {
    // Mesmo verde-degradê da placa de título do menu (GameScene.js,
    // COR_VERSO_TOPO/COR_VERSO_BASE) — contraste por HUE contra o
    // roxo-ardósia do fundo, com o mesmo amarelo-giz de borda usado na faixa
    // do subtítulo daquela placa.
    const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    grad.addColorStop(0, '#1B5E44');
    grad.addColorStop(1, '#123D2E');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
    ctx.lineWidth = 2.2;
    const r = Math.min(w, h) * 0.16;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    let borda = '#CBD5E1';
    if (destaque === 'certo') borda = '#16A34A';
    if (destaque === 'errado') borda = '#DC2626';
    ctx.lineWidth = destaque ? 5 : 3;
    ctx.strokeStyle = borda;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (conteudo.emoji) {
      // Selo colorido atrás do emoji — mesma ideia do verso real (GameScene.js,
      // `_desenharConteudo`): emoji claro (🥛, por exemplo) some sem contraste
      // num cartão branco, não importa o tamanho da fonte.
      const emojiY = -h * 0.08;
      ctx.save();
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = conteudo.corSelo ?? '#94A3B8';
      ctx.beginPath();
      ctx.arc(0, emojiY, h * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Mesma fração aumentada do verso real (GameScene.js, `_desenharConteudo`).
      ctx.font = `${Math.round(h * 0.40)}px ${FONTE_EMOJI_TUTORIAL}`;
      ctx.fillText(conteudo.emoji, 0, emojiY);
      ctx.fillStyle = '#1E293B';
      ctx.font = `800 ${Math.round(h * 0.14)}px Outfit, system-ui, sans-serif`;
      ctx.fillText(conteudo.texto, 0, h * 0.30);
    } else {
      ctx.fillStyle = destaque === 'certo' ? '#16A34A' : '#334155';
      ctx.font = `800 ${Math.round(h * 0.19)}px Outfit, system-ui, sans-serif`;
      ctx.fillText(conteudo.texto, 0, 0);
    }
  }
  ctx.restore();
}

/** `f` em [0,1): fase de flip parado/virando, devolve `{ escalaX, frente }`. */
function estadoFlip(f, pInicioVirar, pFimVirar, pInicioVoltar, pFimVoltar) {
  if (f < pInicioVirar) return { escalaX: 1, frente: false };
  if (f < pFimVirar) {
    const k = (f - pInicioVirar) / (pFimVirar - pInicioVirar);
    return { escalaX: Math.abs(1 - 2 * k), frente: k >= 0.5 };
  }
  if (f < pInicioVoltar) return { escalaX: 1, frente: true };
  if (f < pFimVoltar) {
    const k = (f - pInicioVoltar) / (pFimVoltar - pInicioVoltar);
    return { escalaX: Math.abs(1 - 2 * k), frente: k < 0.5 };
  }
  return { escalaX: 1, frente: false };
}

function desenharCenaTutorial(ctx, l, a, opcoes = {}) {
  const { passo, t = 0 } = opcoes;
  ctx.save();

  if (passo === 1) {
    // Uma carta sozinha, virando em loop — mostra o gesto central: tocar e ver.
    const w = Math.min(l * 0.26, 170);
    const h = w * 1.2;
    const periodo = 2.4;
    const f = faseCiclo(t, periodo);
    const { escalaX, frente } = estadoFlip(f, 0.32, 0.45, 0.80, 0.93);

    ctx.translate(l / 2, a / 2);
    ctx.scale(escalaX, 1);
    desenharCartaTutorial(ctx, w, h, frente, { emoji: '🍚', texto: 'ARROZ', corSelo: '#F97316' });
  } else if (passo === 2) {
    // Duas cartas viram JUNTAS e combinam — destaque verde estável ao final.
    const w = Math.min(l * 0.24, 150);
    const h = w * 1.2;
    const gap = 36;
    const periodo = 2.8;
    const f = faseCiclo(t, periodo);
    const { escalaX, frente } = estadoFlip(f, 0.22, 0.36, 0.86, 1.0);
    const destaque = frente && f >= 0.36 && f < 0.86 ? 'certo' : null;

    ctx.translate(l / 2 - w / 2 - gap / 2, a / 2);
    ctx.save();
    ctx.scale(escalaX, 1);
    desenharCartaTutorial(ctx, w, h, frente, { emoji: '🥛', texto: 'LEITE', corSelo: '#3B82F6' }, destaque);
    ctx.restore();

    ctx.translate(w + gap, 0);
    ctx.save();
    ctx.scale(escalaX, 1);
    desenharCartaTutorial(ctx, w, h, frente, { texto: 'LITRO' }, destaque);
    ctx.restore();
  } else {
    // Duas cartas viram JUNTAS e NÃO combinam — destaque vermelho suave, depois voltam.
    const w = Math.min(l * 0.24, 150);
    const h = w * 1.2;
    const gap = 36;
    const periodo = 2.8;
    const f = faseCiclo(t, periodo);
    // Vira (0.18-0.32), erro parado (0.32-0.60), volta (0.60-0.74), costas (0.74-1.0)
    let escalaX = 1;
    let frente = false;
    let destaque = null;
    if (f < 0.18) { frente = false; }
    else if (f < 0.32) { const k = (f - 0.18) / 0.14; escalaX = Math.abs(1 - 2 * k); frente = k >= 0.5; }
    else if (f < 0.60) { frente = true; destaque = 'errado'; }
    else if (f < 0.74) { const k = (f - 0.60) / 0.14; escalaX = Math.abs(1 - 2 * k); frente = k < 0.5; }
    else { frente = false; }

    ctx.translate(l / 2 - w / 2 - gap / 2, a / 2);
    ctx.save();
    ctx.scale(escalaX, 1);
    desenharCartaTutorial(ctx, w, h, frente, { emoji: '⏰', texto: 'RELÓGIO', corSelo: '#A78BFA' }, destaque);
    ctx.restore();

    ctx.translate(w + gap, 0);
    ctx.save();
    ctx.scale(escalaX, 1);
    desenharCartaTutorial(ctx, w, h, frente, { texto: 'LITRO' }, destaque);
    ctx.restore();
  }

  ctx.restore();
}
