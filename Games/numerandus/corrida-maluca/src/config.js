/**
 * config.js — o "formulário" da Corrida Maluca.
 *
 * Baseado no vídeo do 2º ano (`Desktop\corrida maluca\Corrida_Maluca.mp4`, 2min37, vertical,
 * narrado — transcrição em docs/REGRAS-CORRIDA-MALUCA.md): um tabuleiro com uma trilha da ENTRADA
 * à SAÍDA, um dado e um baralho de cartas de dobro, triplo e números ordinais. Quem joga anda as
 * casas do dado e responde uma carta: acertou, fica; errou, volta de onde partiu. Quem fica numa
 * casa verde joga o dado de novo. Vence quem chega primeiro na SAÍDA.
 *
 * A criança joga contra o computador, que responde em voz alta e erra de propósito 1 vez em 4: a
 * criança confere (CERTO / ERRADO), a "mesa que confere" do vídeo. A trilha cresce com o nível
 * (15, 21 e 27 passos, o último é o do vídeo).
 *
 * Especificação: docs/REGRAS-CORRIDA-MALUCA.md. Layout e regras conferidos antes num protótipo
 * jogável (artifact "Plano Corrida Maluca", 03/11/2026).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
import {
  CORES, escrever, escreverParagrafo, desenharFicha, desenharDado, desenharAnel, desenharCartao,
  desenharContagem, desenharDedo, desenharOndaToque,
} from './desenho.js';

export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'corrida-maluca',
  titulo: 'Corrida Maluca',
  subtitulo: 'Acerte a carta e chegue primeiro!',

  objetivo: 'Dobro, triplo e números ordinais: calcular o dobro e o triplo de um número somando '
    + 'parcelas iguais, resolver problemas de preço com dobro e triplo e dar o nome ordinal de 1 a 10.',
  faixaEtaria: '7 a 8 anos (2º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#1E2740',

  /**
   * Tema próprio ('tabuleiro', ver `engine/ui/Background.js`): azul-ardósia escuro e neutro, sem o
   * pano estampado do vídeo, para o tabuleiro branco e as casas verdes não disputarem com nada.
   * Fichas e dados apagados só nas telas de vitrine; a partida desliga.
   */
  tema: 'tabuleiro',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  /** A tela final diz "N CASAS" (RE-03): a nota é a trilha, como na Corrida Espacial. */
  unidadePlacar: { singular: 'casa', plural: 'casas' },

  // ----------------------------------------------------------------- níveis
  /**
   * `amostra` cabe numa linha da faixa colorida do cartão (a tela de níveis não encolhe o texto):
   *           ~14 letras no máximo. Os ordinais estão nos três níveis, por isso não entram nela.
   * `passos`  o tamanho da trilha: as casas da ENTRADA à SAÍDA (vira a `meta` do AVA)
   * `cartas`  os tipos de carta do nível e até que número cada um vai (`problema: true` liga os
   *           problemas de preço). O tipo é sorteado com chances iguais entre os do nível.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Trilha de 15 casas', amostra: 'Dobro', cor: '#16A34A',
      meta: 15, vidas: 0, passos: 15, cartas: { dobro: 5, ordinal: 5 },
    },
    {
      id: 2, nome: 'Médio', descricao: 'Trilha de 21 casas', amostra: 'Dobro e triplo', cor: '#F59E0B',
      meta: 21, vidas: 0, passos: 21, cartas: { dobro: 10, triplo: 5, ordinal: 10 },
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Trilha de 27 casas', amostra: 'Com dinheiro', cor: '#DC2626',
      meta: 27, vidas: 0, passos: 27, cartas: { dobro: 10, triplo: 10, ordinal: 10, problema: true },
    },
  ],

  /**
   * Regras ajustáveis, conferidas no protótipo.
   *   rolarMs         quanto o dado rola antes de parar
   *   passoMs         o tempo MÍNIMO de cada casa que a ficha anda; o passo seguinte também espera a voz
   *                   terminar o número ("um", "dois"…), e a carta só abre depois do último
   *   falaMaxMs       o teto dessa espera, se um áudio nunca avisar que acabou
   *   cpuEsperaMs     a pausa antes de o computador jogar o dado
   *   computadorErra  a chance de o computador errar a carta de propósito (decisão 2: 1 em 4)
   */
  regras: { rolarMs: 900, passoMs: 300, falaMaxMs: 2000, cpuEsperaMs: 900, computadorErra: 0.25 },

  // --------------------------------------------------------------- tutorial
  /**
   * 5 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida (regra RE-05). O motor
   * fala `titulo + '. ' + texto` de cada passo pelo id `tutorialTela1..5` (`assets/audio/tutorial/01..05.wav`,
   * gravados para este jogo). Se o texto de um passo mudar, a gravação muda junto: o texto segue o que
   * foi gravado (o 4º ainda diz "Chegue primeiro na saída!", como no áudio).
   */
  tutorial: [
    {
      titulo: 'Jogue o dado',
      fala: 'tutorialTela1',
      texto: 'Toque no dado. A ficha anda sozinha, contando as casas.',
      desenho: (ctx, l, a, t) => desenharPasso1(ctx, l, a, t),
    },
    {
      titulo: 'Responda a carta',
      fala: 'tutorialTela2',
      texto: 'Acertou, a ficha fica. Errou, ela volta para onde estava.',
      desenho: (ctx, l, a, t) => desenharPasso2(ctx, l, a, t),
    },
    {
      titulo: 'Casa verde',
      fala: 'tutorialTela3',
      texto: 'Ficou na casa verde? Jogue o dado de novo!',
      desenho: (ctx, l, a, t) => desenharPasso3(ctx, l, a, t),
    },
    {
      titulo: 'Confira o computador',
      fala: 'tutorialTela4',
      texto: 'Ele também responde. Ele acertou? Chegue primeiro na saída!',
      desenho: (ctx, l, a, t) => desenharPasso4(ctx, l, a, t),
    },
    {
      // O desfecho do jogo (pedido do humano, 04/11/2026: "precisa informar o desfecho do jogo, que ao
      // chegar na casa da saída ganha" — "isso é para o tutorial apenas").
      titulo: 'Chegue na saída',
      fala: 'tutorialTela5',
      texto: 'Quem chegar primeiro na saída ganha o jogo!',
      desenho: (ctx, l, a, t) => desenharPasso5(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Reaproveitados da coleção (mesmos arquivos, mesmo SHA-256, fichas em assets/audio-transcricao/):
   * os efeitos, os números "um" a "dez" (a contagem dos passos e a resposta do computador) e as falas
   * de troca de vez. Tudo o que é próprio deste jogo (as perguntas, os ordinais, a casa verde, a
   * conferência) ainda não foi gravado — só o tutorial já tem narração própria: a cena já pede cada id definitivo (lista no README)
   * e, sem o arquivo, fica muda nesse ponto.
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
    // A narração do tutorial (título + texto de cada passo), gravada para este jogo em 03 e 04/11/2026.
    { id: 'tutorialTela1', src: './assets/audio/tutorial/01.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tutorial/02.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tutorial/03.wav' },
    { id: 'tutorialTela4', src: './assets/audio/tutorial/04.wav' },
    { id: 'tutorialTela5', src: './assets/audio/tutorial/05.wav' },
  ],

  /** Sem mascote: as fichas e o dado já são os personagens (mesma decisão do Subtraindo o Dominó). */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: 'erroSOS',
    /** O dado parando e a ficha pousando em cada casa. */
    pouso: 'somConta',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Chegar primeiro na SAÍDA vence; o computador chegar é derrota (registrada). Ver §6 da especificação. */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — as mesmas fichas, o mesmo dado e a mesma carta da
// partida, sobre uma faixa do tabuleiro branco em miniatura. A área é larga e
// baixa (~980 × 270). Não importa a cena: o tutorial também é a AJUDA durante
// a partida.
// ---------------------------------------------------------------------------

const limitar = (x) => Math.max(0, Math.min(1, x));
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));
const suave = (k) => k * k * (3 - 2 * k);

/** O fundo: o tabuleiro branco de borda azul. Devolve nada; o conteúdo some no fim do ciclo. */
function mesa(ctx, l, a, tc, ciclo) {
  ctx.save();
  ctx.fillStyle = CORES.tabuleiro;
  ctx.strokeStyle = CORES.borda;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(4, 4, l - 8, a - 8, 20);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha *= 1 - trecho(tc, ciclo - 0.35, ciclo);
}

/** Uma fileira de casas em miniatura; `verde` é o índice da casa verde (ou -1). Devolve os centros. */
function fileira(ctx, x0, y, n, passo, r, verde = -1) {
  const centros = [];
  ctx.save();
  ctx.strokeStyle = CORES.trilha;
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x0 + (n - 1) * passo, y);
  ctx.stroke();
  for (let i = 0; i < n; i++) {
    const x = x0 + i * passo;
    centros.push(x);
    ctx.fillStyle = i === verde ? CORES.verde : CORES.casa;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return centros;
}

/** A ficha `quem` em (x, y). */
function ficha(ctx, quem, x, y, r, brilho = 0) {
  ctx.save();
  ctx.translate(x, y);
  desenharFicha(ctx, quem, r, brilho);
  ctx.restore();
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

/** Passo 1 — o dedo toca no dado; ele rola e para no 3; a ficha anda 3 casas contando (ciclo de 5 s). */
function desenharPasso1(ctx, l, a, t) {
  const ciclo = 5;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const lado = Math.min(a * 0.42, 108);
  const dx = l * 0.06;
  const dy = a / 2 - lado / 2;
  dado(ctx, dx, dy, lado, tc, 0.6, 1.5, 3);
  const r = Math.min(a * 0.13, 32);
  const passo = r * 3;
  const x0 = l * 0.3;
  const centros = fileira(ctx, x0, a * 0.6, 6, passo, r);
  // A ficha anda uma casa a cada 0,55 s depois que o dado para.
  const andou = Math.min(3, Math.max(0, (tc - 1.7) / 0.55));
  const casa = Math.floor(andou);
  const k = suave(andou - casa);
  const x = casa >= 3 ? centros[3] : centros[casa] + (centros[casa + 1] - centros[casa]) * k;
  ficha(ctx, 'crianca', x, a * 0.6, r * 0.78, 1);
  const contagem = Math.min(3, Math.floor(andou + 0.5));
  if (tc > 1.8 && contagem > 0) desenharContagem(ctx, centros[contagem], a * 0.6 - r - 30, contagem, 0.85);
  const alfa = Math.min(trecho(tc, 0, 0.2), 1 - trecho(tc, 0.9, 1.1));
  const batendo = tc > 0.45 && tc < 0.6;
  if (alfa > 0) desenharDedo(ctx, dx + lado * 0.55, dy + lado * 0.6 + (batendo ? 5 : 0), lado * 0.9, alfa);
  desenharOndaToque(ctx, dx + lado * 0.55, dy + lado * 0.6, lado * 0.5, trecho(tc, 0.5, 1.1));
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

/** Passo 2 — a carta "QUAL É O DOBRO DE 4?"; o dedo toca o 8, que acende verde: ACERTOU! (ciclo de 4,6 s). */
function desenharPasso2(ctx, l, a, t) {
  const ciclo = 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const cw = Math.min(l * 0.62, 560);
  const ch = a * 0.86;
  const cx = (l - cw) / 2;
  const cy = (a - ch) / 2;
  ctx.save();
  ctx.translate(cx, cy);
  desenharCartao(ctx, cw, ch);
  escrever(ctx, 'QUAL É O DOBRO DE 4?', cw / 2, ch * 0.24, Math.round(ch * 0.12), CORES.tinta);
  const ow = cw * 0.26;
  const oh = ch * 0.3;
  const gap = cw * 0.05;
  const ox = (cw - (3 * ow + 2 * gap)) / 2;
  const oy = ch * 0.4;
  const tocou = tc > 1.4;
  ['12', '8', '7'].forEach((txt, i) => opcao(ctx, ox + i * (ow + gap), oy, ow, oh, txt, tocou && i === 1 ? 'certa' : null));
  if (tc > 1.6) {
    ctx.globalAlpha *= suave(trecho(tc, 1.6, 1.9));
    escrever(ctx, 'ACERTOU! A FICHA FICA.', cw / 2, ch * 0.86, Math.round(ch * 0.1), CORES.okTexto);
  }
  ctx.restore();
  const alvoX = cx + ox + ow + gap + ow * 0.6;
  const alvoY = cy + oy + oh * 0.6;
  const alfa = Math.min(trecho(tc, 0.3, 0.6), 1 - trecho(tc, 1.7, 2.0));
  const batendo = tc > 1.2 && tc < 1.4;
  if (alfa > 0) desenharDedo(ctx, alvoX, alvoY + (batendo ? 5 : 0), oh * 0.9, alfa);
  desenharOndaToque(ctx, alvoX, alvoY, oh * 0.5, trecho(tc, 1.3, 1.9));
}

/** Passo 3 — a ficha para na casa verde; o anel amarelo aparece e o dado convida de novo (ciclo de 4,4 s). */
function desenharPasso3(ctx, l, a, t) {
  const ciclo = 4.4;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const r = Math.min(a * 0.13, 32);
  const passo = r * 3;
  const x0 = l * 0.1;
  const y = a * 0.6;
  const centros = fileira(ctx, x0, y, 6, passo, r, 3);
  const andou = Math.min(3, Math.max(0, (tc - 0.4) / 0.5));
  const casa = Math.floor(andou);
  const x = casa >= 3 ? centros[3] : centros[casa] + (centros[casa + 1] - centros[casa]) * suave(andou - casa);
  if (tc > 2.1) desenharAnel(ctx, centros[3], y, r, suave(trecho(tc, 2.1, 2.4)));
  ficha(ctx, 'crianca', x, y, r * 0.78, 1);
  const lado = Math.min(a * 0.42, 108);
  const dx = l * 0.78;
  const pulso = tc > 2.4 ? 1 + Math.sin(tc * 3.5) * 0.04 : 1;
  ctx.save();
  ctx.translate(dx + lado / 2, a * 0.58);
  ctx.scale(pulso, pulso);
  ctx.translate(-lado / 2, -lado / 2);
  desenharDado(ctx, lado, 0);
  ctx.restore();
  if (tc > 2.4) {
    ctx.save();
    ctx.globalAlpha *= suave(trecho(tc, 2.4, 2.7));
    escrever(ctx, 'DE NOVO!', dx + lado / 2, a * 0.17, Math.round(a * 0.11), CORES.verde);
    ctx.restore();
  }
}

/** Passo 4 — "O COMPUTADOR DIZ: 12" numa carta de triplo de 4; o dedo toca CERTO (ciclo de 4,6 s). */
function desenharPasso4(ctx, l, a, t) {
  const ciclo = 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const r = Math.min(a * 0.13, 30);
  ficha(ctx, 'computador', l * 0.1, a * 0.5, r, 1);
  const cw = Math.min(l * 0.66, 600);
  const ch = a * 0.86;
  const cx = l * 0.2;
  const cy = (a - ch) / 2;
  ctx.save();
  ctx.translate(cx, cy);
  desenharCartao(ctx, cw, ch);
  escrever(ctx, 'QUAL É O TRIPLO DE 4?', cw / 2, ch * 0.22, Math.round(ch * 0.11), CORES.tinta);
  escreverParagrafo(ctx, 'O COMPUTADOR DIZ: 12', cw / 2, ch * 0.42, cw * 0.9, Math.round(ch * 0.1), CORES.fichaPTexto);
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

/**
 * Passo 5 — o desfecho: as duas fichas correm até a SAÍDA; a vermelha chega primeiro, brilha e aparece
 * "VOCÊ VENCEU!" (ciclo de 5 s). Sem carta na chegada, como na partida.
 */
function desenharPasso5(ctx, l, a, t) {
  const ciclo = 5;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const r = Math.min(a * 0.13, 32);
  const passo = r * 3;
  const n = 6;
  const x0 = l * 0.1;
  const y = a * 0.62;
  const centros = fileira(ctx, x0, y, n, passo, r);
  // A última casa é a SAÍDA: preta, com o quadriculado de chegada e o nome em cima.
  const xs = centros[n - 1];
  ctx.save();
  ctx.fillStyle = CORES.saida;
  ctx.beginPath();
  ctx.arc(xs, y, r, 0, Math.PI * 2);
  ctx.fill();
  const q = r * 0.3;
  for (let k = 0; k < 4; k++) {
    ctx.fillStyle = k === 0 || k === 3 ? '#FFFFFF' : CORES.saida;
    ctx.fillRect(xs - q + (k % 2) * q, y - q + Math.floor(k / 2) * q, q, q);
  }
  ctx.restore();
  escrever(ctx, 'SAÍDA', xs, y + r + Math.round(a * 0.1), Math.round(a * 0.09), CORES.tinta);
  // A vermelha sai da casa 2 e anda 3 até a SAÍDA; a de madeira fica para trás, na casa 1.
  const andou = Math.min(3, Math.max(0, (tc - 0.4) / 0.5));
  const casa = Math.floor(andou);
  const x = casa >= 3 ? centros[5] : centros[2 + casa] + (centros[3 + casa] - centros[2 + casa]) * suave(andou - casa);
  const chegou = tc > 1.95;
  ficha(ctx, 'computador', centros[1], y, r * 0.78, 0);
  ficha(ctx, 'crianca', x, y, r * 0.78, chegou ? 1 : 0);
  if (chegou) {
    ctx.save();
    ctx.globalAlpha *= suave(trecho(tc, 1.95, 2.3));
    const xt = (centros[n - 1] + l - 8) / 2 + r * 0.6;
    escrever(ctx, 'CHEGOU!', xt, a * 0.36, Math.round(a * 0.1), CORES.tinta);
    escrever(ctx, 'VOCÊ VENCEU!', xt, a * 0.56, Math.round(a * 0.13), CORES.okTexto);
    ctx.restore();
  }
}
