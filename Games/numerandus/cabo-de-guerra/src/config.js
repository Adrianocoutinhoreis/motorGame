/**
 * config.js — o "formulário" do Cabo de Guerra.
 *
 * Baseado no vídeo do 2º ano (`Desktop\cabo_de_guerra\Cabo_De_Guerra.mp4`, 2min06, vertical, narrado —
 * transcrição em docs/REGRAS-CABO-DE-GUERRA.md): uma tira de bolinhas com um nó no meio. Cada lado
 * puxa o nó para a sua ponta: joga o dado, tira uma carta (multiplicação, antecessor e sucessor,
 * capacidade em litros, massa em quilogramas) e, se acertar, o nó anda tantas casas quanto o dado.
 * Ganha quem levar o nó até a própria ponta.
 *
 * A criança joga contra o computador, que responde em voz alta e erra de propósito 1 vez em 4: a
 * criança confere (CERTO / ERRADO), a "mesa que confere" do vídeo. A trilha cresce com o nível
 * (7, 8 e 9 passos do centro até a ponta), medida por simulação.
 *
 * Especificação: docs/REGRAS-CABO-DE-GUERRA.md. Regras e layout conferidos antes num protótipo
 * jogável (artifact "Plano Cabo de Guerra", 09/11/2026).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e docs/REGRAS-EDUCACIONAIS.md
 */
import {
  CORES, escrever, escreverParagrafo, desenharTrilha, desenharNo, desenharDado, desenharCartao,
  desenharContagem, desenharDedo, desenharOndaToque,
} from './desenho.js';

export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'cabo-de-guerra',
  titulo: 'Cabo de Guerra',
  /** Sem subtítulo de propósito: o título ocupa a placa toda, maior (pedido do humano, 09/11/2026). */
  subtitulo: '',

  objetivo: 'Multiplicação, antecessor e sucessor, capacidade (litros) e massa (quilogramas): responder '
    + 'cartas de multiplicação com a tabuada, dar o antecessor e o sucessor de um número e escolher a '
    + 'unidade certa para medir capacidade e massa.',
  faixaEtaria: '7 a 8 anos (2º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0C3126',

  /**
   * Tema próprio ('cabo', ver `engine/ui/Background.js`): verde-floresta escuro e suave, para a tira
   * branca, o nó e as pontas vermelha e de madeira saltarem. Bandeirinhas, nós de corda e dados
   * apagados só nas telas de vitrine; a partida desliga.
   */
  tema: 'cabo',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  /** A tela final diz "N CASAS" (RE-03): a nota é a trilha, como na Corrida Maluca. */
  unidadePlacar: { singular: 'casa', plural: 'casas' },

  // ----------------------------------------------------------------- níveis
  /**
   * `amostra` cabe numa linha da faixa colorida do cartão (a tela de níveis não encolhe o texto):
   *           ~14 letras no máximo.
   * `passos`  da ponta ao centro (a trilha tem 2 × passos + 1 bolinhas); vira a `meta` do AVA.
   * `cartas`  os grupos de carta do nível e o que cada um cobre. O grupo é sorteado com chances
   *           iguais entre os do nível; nenhuma carta repete na partida.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Trilha de 7 passos', amostra: 'Tabuada 2 a 5', cor: '#16A34A',
      meta: 7, vidas: 0, passos: 7,
      cartas: {
        multiplicacao: { a: [2, 3, 4, 5], b: [1, 5] }, antecessor: [11, 50], sucessor: [11, 50], unidade: true,
        dobro: [2, 10], metade: [4, 20], sequencia: { passos: [2, 5, 10], inicio: [1, 20] },
      },
    },
    {
      id: 2, nome: 'Médio', descricao: 'Trilha de 8 passos', amostra: 'Mais tabuadas', cor: '#F59E0B',
      meta: 8, vidas: 0, passos: 8,
      cartas: {
        multiplicacao: { a: [2, 3, 4, 5, 6], b: [2, 8] }, antecessor: [20, 100], sucessor: [20, 99], unidade: true,
        soma: { max: 6 }, dobro: [5, 30], triplo: [2, 10], metade: [10, 60],
        sequencia: { passos: [2, 3, 5, 10], inicio: [1, 40] }, adicaoRepetida: { n: [2, 6], k: [2, 4] },
      },
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Trilha de 9 passos', amostra: 'Tabuada toda', cor: '#DC2626',
      meta: 9, vidas: 0, passos: 9,
      cartas: {
        multiplicacao: { a: [2, 3, 4, 5, 6, 7, 8, 9], b: [2, 9] }, antecessor: [90, 999], sucessor: [90, 998], unidade: true,
        soma: { max: 9 }, garrafas: true, dobro: [10, 99], triplo: [5, 40], metade: [20, 200],
        sequencia: { passos: [2, 3, 4, 5, 6, 10], inicio: [1, 60], desce: true }, adicaoRepetida: { n: [3, 9], k: [3, 6] },
      },
    },
  ],

  /**
   * Regras ajustáveis, conferidas no protótipo.
   *   rolarMs         quanto o dado rola antes de parar
   *   passoMs         o tempo MÍNIMO de cada casa que o nó anda; o passo seguinte também espera a voz
   *                   terminar o número ("um", "dois"…)
   *   falaMaxMs       o teto dessa espera, se um áudio nunca avisar que acabou
   *   cpuEsperaMs     a pausa antes de o computador jogar o dado
   *   computadorErra  a chance de o computador errar a carta de propósito (1 em 4)
   */
  regras: { rolarMs: 900, passoMs: 320, falaMaxMs: 2000, cpuEsperaMs: 900, computadorErra: 0.25 },

  // --------------------------------------------------------------- tutorial
  /**
   * 5 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida (regra RE-05). O motor
   * fala `titulo + '. ' + texto` de cada passo pelo id `tutorialTela1..5`; a gravação ainda não existe
   * (pendência no README): sem o arquivo o tutorial fica em silêncio e o console avisa.
   */
  tutorial: [
    {
      titulo: 'Jogue o dado',
      fala: 'tutorialTela1',
      texto: 'Toque no dado. Ele diz quantas casas você pode puxar.',
      desenho: (ctx, l, a, t) => desenharPasso1(ctx, l, a, t),
    },
    {
      titulo: 'Responda a carta',
      fala: 'tutorialTela2',
      texto: 'Acertou, a ficha anda. Errou, ela fica parada.',
      desenho: (ctx, l, a, t) => desenharPasso2(ctx, l, a, t),
    },
    {
      titulo: 'Puxe a ficha',
      fala: 'tutorialTela3',
      texto: 'A ficha vem para o seu lado, contando as casas.',
      desenho: (ctx, l, a, t) => desenharPasso3(ctx, l, a, t),
    },
    {
      titulo: 'Confira o computador',
      fala: 'tutorialTela4',
      texto: 'Ele também responde. Ele acertou?',
      desenho: (ctx, l, a, t) => desenharPasso4(ctx, l, a, t),
    },
    {
      titulo: 'Leve a ficha até a sua ponta',
      fala: 'tutorialTela5',
      texto: 'Quem levar a ficha até a própria ponta ganha o jogo!',
      desenho: (ctx, l, a, t) => desenharPasso5(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Reaproveitados da coleção (mesmos arquivos, fichas em assets/audio-transcricao/): os efeitos, os
   * números "um" a "dez" (a contagem das casas e a resposta do computador) e as falas de troca de vez.
   * Tudo o que é próprio deste jogo (as perguntas, as unidades, a conferência, o tutorial) ainda não
   * foi gravado: a cena já pede cada id definitivo (lista no README) e, sem o arquivo, fica muda
   * nesse ponto.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'somConta', src: './assets/audio/soltar_peca.mp3' },
    { id: 'numero1', src: './assets/audio/numeros/um.mp3' },
    { id: 'numero2', src: './assets/audio/numeros/dois.mp3' },
    { id: 'numero3', src: './assets/audio/numeros/tres.mp3' },
    { id: 'numero4', src: './assets/audio/numeros/quatro.mp3' },
    { id: 'numero5', src: './assets/audio/numeros/cinco.mp3' },
    { id: 'numero6', src: './assets/audio/numeros/seis.mp3' },
    { id: 'numero7', src: './assets/audio/numeros/sete.mp3' },
    { id: 'numero8', src: './assets/audio/numeros/oito.mp3' },
    { id: 'numero9', src: './assets/audio/numeros/nove.mp3' },
    { id: 'numero10', src: './assets/audio/numeros/dez.mp3' },
    { id: 'suaVez', src: './assets/audio/falas/suaVez.wav' },
    { id: 'vezDoComputador', src: './assets/audio/falas/vezDoComputador.wav' },
    { id: 'muitoBem', src: './assets/audio/falas/muitoBem.wav' },
  ],

  /** Sem mascote: o nó, o dado e as pontas já são os personagens (mesma decisão da Corrida Maluca). */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: 'erroSOS',
    /** O dado parando e o nó pousando em cada casa. */
    pouso: 'somConta',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Levar o nó à ponta da criança vence; o computador levar à dele é derrota (registrada). */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — a mesma trilha, o mesmo nó, o mesmo dado e a mesma
// carta da partida, em miniatura. A área é larga e baixa (~980 × 270). Não
// importa a cena: o tutorial também é a AJUDA durante a partida.
// ---------------------------------------------------------------------------

const limitar = (x) => Math.max(0, Math.min(1, x));
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));
const suave = (k) => k * k * (3 - 2 * k);

/** O fundo do passo: um painel claro; o conteúdo some no fim do ciclo. */
function mesa(ctx, l, a, tc, ciclo) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
  ctx.strokeStyle = CORES.borda;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(4, 4, l - 8, a - 8, 20);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha *= 1 - trecho(tc, ciclo - 0.35, ciclo);
}

/**
 * Uma trilha em miniatura de 11 bolinhas (5 passos) centrada na faixa `y`; devolve `{trilha, xs}`.
 * Desenha a tira, as bolinhas e as pontas; o nó é de quem chama.
 */
function miniTrilha(ctx, l, y, h, ganhou = null) {
  const folga = 56;
  const n = 11;
  const espaco = (l - 2 * 40 - 2 * folga) / (n - 1);
  const xs = Array.from({ length: n }, (_, k) => 40 + folga + k * espaco);
  const raio = Math.min(24, espaco * 0.36);
  const trilha = { xs, y, raio };
  desenharTrilha(ctx, { x: 40, y: y - h / 2, l: l - 80, a: h }, trilha, ganhou, 0.6);
  return { trilha, xs, raio };
}

/** O dado em (x, y) (canto de cima-esquerdo), rolando entre `ini` e `fim` e parando em `face`. */
function dado(ctx, x, y, lado, tc, ini, fim, face) {
  const rolando = tc > ini && tc < fim;
  const f = tc < ini ? 0 : rolando ? 1 + (Math.floor(tc * 9) % 6) : face;
  ctx.save();
  ctx.translate(x + lado / 2, y + lado / 2);
  if (rolando) ctx.rotate(Math.sin(tc * 24) * 0.14);
  ctx.translate(-lado / 2, -lado / 2);
  desenharDado(ctx, lado, f);
  ctx.restore();
}

/** Passo 1 — o dedo toca no dado; ele rola e para no 3 (ciclo de 4 s). */
function desenharPasso1(ctx, l, a, t) {
  const ciclo = 4;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const lado = Math.min(a * 0.5, 120);
  const dx = l * 0.2;
  const dy = a / 2 - lado / 2;
  dado(ctx, dx, dy, lado, tc, 0.6, 1.5, 3);
  const alfa = Math.min(trecho(tc, 0, 0.2), 1 - trecho(tc, 0.9, 1.1));
  const batendo = tc > 0.45 && tc < 0.6;
  if (alfa > 0) desenharDedo(ctx, dx + lado * 0.55, dy + lado * 0.6 + (batendo ? 5 : 0), lado * 0.9, alfa);
  desenharOndaToque(ctx, dx + lado * 0.55, dy + lado * 0.6, lado * 0.5, trecho(tc, 0.5, 1.1));
  if (tc > 1.6) {
    ctx.save();
    ctx.globalAlpha *= suave(trecho(tc, 1.6, 1.9));
    escrever(ctx, 'PUXA 3 CASAS', l * 0.62, a * 0.5, Math.round(a * 0.17), CORES.tinta);
    ctx.restore();
  }
}

/** Uma resposta em miniatura: branca com borda de madeira; `marca` 'certa' acende verde. */
function opcao(ctx, x, y, w, h, texto, marca) {
  ctx.save();
  ctx.fillStyle = marca === 'certa' ? '#D9F7E6' : '#FFFFFF';
  ctx.strokeStyle = marca === 'certa' ? CORES.okEscuro : CORES.cartaBorda;
  ctx.lineWidth = marca ? 5 : 3;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.stroke();
  escrever(ctx, texto, x + w / 2, y + h / 2 + 2, Math.round(h * 0.5), CORES.tinta);
  ctx.restore();
}

/** Passo 2 — a carta "QUAL É O ANTECESSOR DE 30?"; o dedo toca o 29, que acende verde (ciclo de 4,6 s). */
function desenharPasso2(ctx, l, a, t) {
  const ciclo = 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const cw = Math.min(l * 0.7, 620);
  const ch = a * 0.86;
  const cx = (l - cw) / 2;
  const cy = (a - ch) / 2;
  ctx.save();
  ctx.translate(cx, cy);
  desenharCartao(ctx, cw, ch);
  escrever(ctx, 'QUAL É O ANTECESSOR DE 30?', cw / 2, ch * 0.24, Math.round(ch * 0.11), CORES.tinta);
  const ow = cw * 0.26;
  const oh = ch * 0.3;
  const gap = cw * 0.05;
  const ox = (cw - (3 * ow + 2 * gap)) / 2;
  const oy = ch * 0.4;
  const tocou = tc > 1.4;
  ['31', '29', '28'].forEach((txt, i) => opcao(ctx, ox + i * (ow + gap), oy, ow, oh, txt, tocou && i === 1 ? 'certa' : null));
  if (tc > 1.6) {
    ctx.globalAlpha *= suave(trecho(tc, 1.6, 1.9));
    escrever(ctx, 'ACERTOU! A FICHA ANDA.', cw / 2, ch * 0.86, Math.round(ch * 0.1), CORES.okTexto);
  }
  ctx.restore();
  const alvoX = cx + ox + ow + gap + ow * 0.6;
  const alvoY = cy + oy + oh * 0.6;
  const alfa = Math.min(trecho(tc, 0.3, 0.6), 1 - trecho(tc, 1.7, 2.0));
  const batendo = tc > 1.2 && tc < 1.4;
  if (alfa > 0) desenharDedo(ctx, alvoX, alvoY + (batendo ? 5 : 0), oh * 0.9, alfa);
  desenharOndaToque(ctx, alvoX, alvoY, oh * 0.5, trecho(tc, 1.3, 1.9));
}

/** Passo 3 — o nó sai do centro e vem 3 casas para a ponta vermelha, contando (ciclo de 4,6 s). */
function desenharPasso3(ctx, l, a, t) {
  const ciclo = 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const y = a * 0.58;
  const { xs, raio } = miniTrilha(ctx, l, y, 90);
  const andou = Math.min(3, Math.max(0, (tc - 0.6) / 0.55));
  const casa = Math.floor(andou);
  const k = suave(andou - casa);
  const de = 5 - casa;
  const x = casa >= 3 ? xs[2] : xs[de] + (xs[de - 1] - xs[de]) * k;
  desenharNo(ctx, x, y, raio * 1.4, 1);
  const contagem = Math.min(3, Math.floor(andou + 0.5));
  if (tc > 0.7 && contagem > 0) desenharContagem(ctx, x, y - raio * 1.4 - 34, contagem, 0.8);
  escrever(ctx, 'VOCÊ', xs[0] + 6, a * 0.2, Math.round(a * 0.1), CORES.pontaC, 'left');
  escrever(ctx, 'COMPUTADOR', xs[10] - 6, a * 0.2, Math.round(a * 0.1), CORES.pontaPTexto, 'right');
}

/** Passo 4 — "O COMPUTADOR DIZ: 42" numa carta de 7 × 6; o dedo toca CERTO (ciclo de 4,6 s). */
function desenharPasso4(ctx, l, a, t) {
  const ciclo = 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const cw = Math.min(l * 0.66, 600);
  const ch = a * 0.86;
  const cx = (l - cw) / 2;
  const cy = (a - ch) / 2;
  ctx.save();
  ctx.translate(cx, cy);
  desenharCartao(ctx, cw, ch);
  escrever(ctx, '7 × 6 = ?', cw / 2, ch * 0.22, Math.round(ch * 0.13), CORES.tinta);
  escreverParagrafo(ctx, 'O COMPUTADOR DIZ: 42', cw / 2, ch * 0.42, cw * 0.9, Math.round(ch * 0.1), CORES.pontaPTexto);
  const bw = cw * 0.3;
  const bh = ch * 0.26;
  const gap = cw * 0.08;
  const bx = (cw - (2 * bw + gap)) / 2;
  const by = ch * 0.58;
  const tocou = tc > 1.5;
  opcao(ctx, bx, by, bw, bh, 'CERTO', tocou ? 'certa' : null);
  opcao(ctx, bx + bw + gap, by, bw, bh, 'ERRADO', null);
  ctx.restore();
  const alvoX = cx + bx + bw * 0.6;
  const alvoY = cy + by + bh * 0.6;
  const alfa = Math.min(trecho(tc, 0.4, 0.7), 1 - trecho(tc, 1.8, 2.1));
  const batendo = tc > 1.3 && tc < 1.5;
  if (alfa > 0) desenharDedo(ctx, alvoX, alvoY + (batendo ? 5 : 0), bh * 0.9, alfa);
  desenharOndaToque(ctx, alvoX, alvoY, bh * 0.5, trecho(tc, 1.4, 2.0));
}

/** Passo 5 — o nó chega à ponta vermelha, que brilha: "VOCÊ VENCEU!" (ciclo de 5 s). Sem carta na chegada. */
function desenharPasso5(ctx, l, a, t) {
  const ciclo = 5;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const y = a * 0.55;
  const chegou = tc > 2.0;
  const { xs, raio } = miniTrilha(ctx, l, y, 90, chegou ? 'crianca' : null);
  // O nó sai da casa 3 e vem 3 casas até a ponta vermelha (índice 0).
  const andou = Math.min(3, Math.max(0, (tc - 0.4) / 0.5));
  const casa = Math.floor(andou);
  const k = suave(andou - casa);
  const de = 3 - casa;
  const x = casa >= 3 ? xs[0] : xs[de] + (xs[de - 1] - xs[de]) * k;
  desenharNo(ctx, x, y, raio * 1.4, chegou ? 1 : 0);
  escrever(ctx, 'VOCÊ', xs[0] + 6, a * 0.18, Math.round(a * 0.1), CORES.pontaC, 'left');
  if (chegou) {
    ctx.save();
    ctx.globalAlpha *= suave(trecho(tc, 2.0, 2.4));
    escrever(ctx, 'VOCÊ VENCEU!', l / 2, a * 0.86, Math.round(a * 0.13), CORES.okTexto);
    ctx.restore();
  }
}
