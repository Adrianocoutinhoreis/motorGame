/**
 * teste-regras-cubra-nove.mjs — as regras puras do Cubra Nove (src/regras.js), sem navegador.
 *
 * Confere a jogada do vídeo jogada a jogada (a transcrição em docs/REGRAS-CUBRA-NOVE.md), as bordas
 * (soma acima de 9, diferença 0, dados iguais, casa já coberta), a dica, o fim da rodada com as extras
 * e a nota da RE-02, e mede por simulação as durações que o plano usou.
 *
 * Uso: node tools/teste-regras-cubra-nove.mjs
 */
import {
  rolarDados, contasDaJogada, alvosDaJogada, avaliarCasa, contaDaDica, contarCobertas, fileiraVazia,
  esquecimentoDoComputador, situacaoDaRodada, cobriuTudo, notaDaPartida,
} from '../Games/numerandus/cubra-nove/src/regras.js';

let passaram = 0;
let falharam = 0;
function teste(nome, fn) {
  try {
    fn();
    passaram++;
    console.log(`  ok   ${nome}`);
  } catch (err) {
    falharam++;
    console.log(`  FALHOU  ${nome}\n         ${err.message}`);
  }
}
const igual = (a, b, msg = '') => {
  const ja = JSON.stringify(a);
  const jb = JSON.stringify(b);
  if (ja !== jb) throw new Error(`${msg} recebido ${ja}, esperado ${jb}`);
};
const ok = (c, msg) => { if (!c) throw new Error(msg); };

/** Uma fileira com estes números cobertos. */
const fileira = (...vs) => { const f = fileiraVazia(); for (const v of vs) f[v] = true; return f; };
/** O que se cobre numa jogada, ordenado. */
const cobre = (a, b, dif, f) => alvosDaJogada(contasDaJogada(a, b, dif), f).sort((x, y) => x - y);

console.log('\nA jogada do vídeo, jogada a jogada');
teste('00:36 — dados 5 e 4, fileira vazia: cobre 9 (soma), 1 (diferença), 5 e 4', () => {
  igual(cobre(5, 4, true, fileiraVazia()), [1, 4, 5, 9]);
});
teste('01:15 — dados 6 e 5 (outro jogador, vazio): 11 não cabe; cobre 6, 5 e 1', () => {
  igual(cobre(6, 5, true, fileiraVazia()), [1, 5, 6]);
});
teste('01:29 — dados 5 e 2 com 1, 4, 5, 9 cobertos: cobre 7, 2 e 3 (o 5 já estava); sobram 6 e 8', () => {
  const f = fileira(1, 4, 5, 9);
  const alvos = cobre(5, 2, true, f);
  igual(alvos, [2, 3, 7]);
  for (const v of alvos) f[v] = true;
  igual([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => !f[v]), [6, 8]);
});
teste('01:56 — dados 6 e 6 com o 6 coberto: "6 menos 6 dá 0, deu ruim" — nada a cobrir', () => {
  igual(cobre(6, 6, true, fileira(1, 5, 6)), []);
});
teste('02:09 — dados 6 e 3 com 1,2,3,4,5,7,9: 9 e 3 já cobertos, cobre só o 6', () => {
  igual(cobre(6, 3, true, fileira(1, 2, 3, 4, 5, 7, 9)), [6]);
});
teste('02:28 — dados 6 e 1 com 1, 5, 6: cobre só o 7 (6 − 1 = 5 já coberto)', () => {
  igual(cobre(6, 1, true, fileira(1, 5, 6)), [7]);
});
teste('02:34 — fim: a dupla 1 tem 1 descoberto (8 cobertas), a dupla 2 tem 5 (4 cobertas) → vence a 1', () => {
  igual(situacaoDaRodada({ c: 8, p: 4, rodada: 3, rodadas: 3, extras: 0, maxExtras: 5 }), 'crianca');
});

console.log('\nAs contas e as bordas');
teste('sem diferença (Fácil): só os dois dados e a soma', () => {
  igual(contasDaJogada(5, 4, false).map((c) => c.tipo), ['dado', 'dado', 'soma']);
  igual(cobre(5, 4, false, fileiraVazia()), [4, 5, 9]);
});
teste('a diferença é sempre o maior menos o menor', () => {
  const d = contasDaJogada(2, 6, true)[3];
  igual([d.valor, d.texto], [4, '6 − 2']);
});
teste('soma acima de 9 e diferença 0 não cabem', () => {
  const c = contasDaJogada(6, 6, true);
  igual([c[2].cabe, c[3].cabe], [false, false]);
});
teste('dados iguais não cobrem o mesmo número duas vezes', () => {
  igual(cobre(3, 3, true, fileiraVazia()), [3, 6]);
});
teste('número que aparece em duas contas (2 e 4: o dado 2 e 4 − 2) conta uma vez só', () => {
  igual(cobre(2, 4, true, fileiraVazia()), [2, 4, 6]);
});
teste('avaliarCasa: livre e dada = ok; coberta = ja; não dada = nao', () => {
  const f = fileira(4);
  const alvos = cobre(5, 4, true, f);
  igual([avaliarCasa(9, alvos, f), avaliarCasa(4, alvos, f), avaliarCasa(8, alvos, f)], ['ok', 'ja', 'nao']);
});
teste('a dica aponta a diferença antes da soma e dos dados', () => {
  const contas = contasDaJogada(5, 4, true);
  igual(contaDaDica(contas, fileiraVazia()).tipo, 'dif');
  igual(contaDaDica(contas, fileira(1)).tipo, 'soma');
  igual(contaDaDica(contas, fileira(1, 9)).tipo, 'dado');
  igual(contaDaDica(contas, fileira(1, 4, 5, 9)), null);
});

console.log('\nRodadas, extras e fim');
teste('antes da 3ª rodada, continua', () => {
  igual(situacaoDaRodada({ c: 5, p: 2, rodada: 2, rodadas: 3, extras: 0, maxExtras: 5 }), 'continua');
});
teste('empate depois das 3 rodadas: rodada extra', () => {
  igual(situacaoDaRodada({ c: 6, p: 6, rodada: 3, rodadas: 3, extras: 0, maxExtras: 5 }), 'extra');
});
teste('numa extra, desempatou: vence quem cobriu mais', () => {
  igual(situacaoDaRodada({ c: 6, p: 7, rodada: 4, rodadas: 3, extras: 1, maxExtras: 5 }), 'computador');
});
teste('empatado no teto de 5 extras: a criança leva', () => {
  igual(situacaoDaRodada({ c: 7, p: 7, rodada: 8, rodadas: 3, extras: 5, maxExtras: 5 }), 'crianca');
});
teste('cobriuTudo só com as 9', () => {
  ok(!cobriuTudo(fileira(1, 2, 3, 4, 5, 6, 7, 8)), '8 não é tudo');
  ok(cobriuTudo(fileira(1, 2, 3, 4, 5, 6, 7, 8, 9)), '9 é tudo');
  igual(contarCobertas(fileira(2, 7)), 2);
});

console.log('\nA nota (RE-02)');
teste('vitória: cobertas − erros, nunca abaixo de 0', () => {
  igual(notaDaPartida({ vitoria: true, cobertas: 7, erros: 2 }), 5);
  igual(notaDaPartida({ vitoria: true, cobertas: 3, erros: 5 }), 0);
});
teste('derrota: as cobertas, sem desconto', () => {
  igual(notaDaPartida({ vitoria: false, cobertas: 5, erros: 3 }), 5);
});

console.log('\nO computador esquece');
teste('sem alvos não esquece; com chance 0 nunca; com chance 1 sempre um dos alvos', () => {
  igual(esquecimentoDoComputador([], 1), null);
  igual(esquecimentoDoComputador([1, 5], 0), null);
  ok([1, 5].includes(esquecimentoDoComputador([1, 5], 1)), 'esqueceu um alvo');
});

console.log('\nSimulação (100 000 partidas por linha): as medidas do plano');
function partida({ dif, esquece = 0, rodadas = 3, maxExtras = 5 }) {
  const c = fileiraVazia();
  const p = fileiraVazia();
  let rodada = 1;
  let extras = 0;
  for (;;) {
    for (const [f, cpu] of [[c, false], [p, true]]) {
      const [a, b] = rolarDados();
      const alvos = alvosDaJogada(contasDaJogada(a, b, dif), f);
      const e = cpu ? esquecimentoDoComputador(alvos, esquece) : null;
      for (const v of alvos) if (v !== e) f[v] = true;
      if (cobriuTudo(f)) return { vence: cpu ? 'computador' : 'crianca', c: contarCobertas(c), extras };
    }
    const s = situacaoDaRodada({ c: contarCobertas(c), p: contarCobertas(p), rodada, rodadas, extras, maxExtras });
    if (s === 'crianca' || s === 'computador') return { vence: s, c: contarCobertas(c), extras };
    if (s === 'extra') extras++;
    rodada++;
  }
}
for (const [nome, cfg] of [
  ['Fácil (sem diferença), computador nunca esquece', { dif: false }],
  ['Médio/Difícil (regra do vídeo), computador nunca esquece', { dif: true }],
  ['Médio/Difícil, computador esquece 1 vez em 4', { dif: true, esquece: 0.25 }],
]) {
  const N = 100000;
  let vence = 0;
  let cob = 0;
  let foiExtra = 0;
  let teto = 0;
  for (let i = 0; i < N; i++) {
    const r = partida(cfg);
    if (r.vence === 'crianca') vence++;
    cob += r.c;
    if (r.extras > 0) foiExtra++;
    if (r.extras === 5) teto++;
  }
  console.log(`  ${nome}: a criança vence ${(100 * vence / N).toFixed(1)}%, cobre ${(cob / N).toFixed(2)} em média, `
    + `${(100 * foiExtra / N).toFixed(1)}% vão a rodada extra, ${(100 * teto / N).toFixed(2)}% chegam ao teto`);
}

console.log(`\n${'-'.repeat(56)}\n${passaram} passaram, ${falharam} falharam`);
if (falharam) process.exit(1);
