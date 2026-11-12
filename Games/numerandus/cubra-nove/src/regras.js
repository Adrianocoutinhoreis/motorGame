/**
 * regras.js — as regras do Cubra Nove, sem desenho e sem motor.
 *
 * Funções puras, para a cena e os testes usarem a MESMA conta e para poderem ser conferidas em Node
 * sem navegador. Especificação em `docs/REGRAS-CUBRA-NOVE.md`. Toda função que sorteia recebe
 * `aleatorio` (padrão `Math.random`), injetável para teste.
 *
 * A jogada do vídeo: dois dados; cobre-se, na própria fileira de 1 a 9, TUDO o que estiver livre entre o
 * número de cada dado, a soma (se for até 9) e a diferença (se não der 0). Casa coberta não se cobre de
 * novo; nada a cobrir é jogada válida ("6 menos 6 dá 0, deu ruim").
 */

/** As casas de cada fileira: 1 a 9. */
export const CASAS = 9;

/** O dado comum: faces de 1 a 6. */
export const FACES_DADO = 6;

/** Joga os dois dados: `[a, b]`, honestos. */
export function rolarDados(aleatorio = Math.random) {
  return [1 + Math.floor(aleatorio() * FACES_DADO), 1 + Math.floor(aleatorio() * FACES_DADO)];
}

/**
 * As contas de uma jogada, na ordem em que a tela as mostra: os dois dados, a soma e (com
 * `comDiferenca`) a diferença, o maior menos o menor.
 *
 * @returns {{tipo:'dado'|'soma'|'dif', valor:number, cabe:boolean, texto:string}[]}
 *   `cabe` é falso para a soma acima de 9 e para a diferença 0: essas não cobrem nada.
 */
export function contasDaJogada(a, b, comDiferenca) {
  const contas = [
    { tipo: 'dado', valor: a, cabe: true, texto: String(a) },
    { tipo: 'dado', valor: b, cabe: true, texto: String(b) },
    { tipo: 'soma', valor: a + b, cabe: a + b <= CASAS, texto: `${a} + ${b}` },
  ];
  if (comDiferenca) {
    const maior = Math.max(a, b);
    const menor = Math.min(a, b);
    contas.push({ tipo: 'dif', valor: maior - menor, cabe: maior - menor >= 1, texto: `${maior} − ${menor}` });
  }
  return contas;
}

/**
 * O que ainda dá para cobrir: os valores das contas que cabem e cuja casa está livre, sem repetir.
 * `cobertas` é um vetor de booleanos indexado de 1 a 9 (`cobertas[v]`).
 */
export function alvosDaJogada(contas, cobertas) {
  const alvos = [];
  for (const c of contas) if (c.cabe && !cobertas[c.valor] && !alvos.includes(c.valor)) alvos.push(c.valor);
  return alvos;
}

/**
 * O que acontece ao pôr um cubinho na casa `v`: `'ok'` (os dados dão esse número e a casa está livre),
 * `'ja'` (a casa já está coberta: a peça volta, sem erro) ou `'nao'` (os dados não dão esse número: erro).
 */
export function avaliarCasa(v, alvos, cobertas) {
  if (cobertas[v]) return 'ja';
  return alvos.includes(v) ? 'ok' : 'nao';
}

/**
 * Para o 2º degrau da ajuda: a conta que falta e que a tela acende. A diferença primeiro (é a que mais
 * se esquece e a novidade do 2º ano), depois a soma, depois os dados.
 */
export function contaDaDica(contas, cobertas) {
  const ordem = { dif: 0, soma: 1, dado: 2 };
  return [...contas]
    .filter((c) => c.cabe && !cobertas[c.valor])
    .sort((x, y) => ordem[x.tipo] - ordem[y.tipo])[0] ?? null;
}

/** Quantas casas de uma fileira estão cobertas. */
export function contarCobertas(cobertas) {
  let n = 0;
  for (let v = 1; v <= CASAS; v++) if (cobertas[v]) n++;
  return n;
}

/** Uma fileira vazia: `cobertas[1..9]` todos falsos. */
export function fileiraVazia() {
  return Array(CASAS + 1).fill(false);
}

/**
 * O número que o computador "esquece" nesta jogada (para a criança conferir), ou `null`. Com chance
 * `chance` (1 em 4), um dos alvos sorteado. Esquecido, ele fica SEM esse número: a vez acaba (decisão do
 * plano, 12/11/2026).
 */
export function esquecimentoDoComputador(alvos, chance = 0.25, aleatorio = Math.random) {
  if (!alvos.length || aleatorio() >= chance) return null;
  return alvos[Math.floor(aleatorio() * alvos.length)];
}

/**
 * Como está a partida depois de uma rodada COMPLETA (as duas vezes jogadas):
 *   'crianca' | 'computador'  vence quem cobriu mais, passadas as rodadas combinadas (e as extras);
 *   'extra'                   empatou e ainda cabe rodada extra;
 *   'continua'                ainda faltam rodadas combinadas.
 * Empatado no teto de extras, a criança leva (a mesma regra do Subtraindo o Dominó).
 * Cobrir os 9 vence NA HORA, durante a vez — quem chama confere isso antes (`cobriuTudo`).
 */
export function situacaoDaRodada({ c, p, rodada, rodadas, extras, maxExtras }) {
  if (rodada < rodadas + extras) return 'continua';
  if (c !== p) return c > p ? 'crianca' : 'computador';
  return extras < maxExtras ? 'extra' : 'crianca';
}

/** Alguém cobriu as 9 casas? */
export function cobriuTudo(cobertas) {
  return contarCobertas(cobertas) === CASAS;
}

/**
 * A nota da partida (RE-02): na vitória, as casas cobertas menos os erros, nunca abaixo de 0; na
 * derrota, as casas cobertas, sem desconto. A meta é 9.
 */
export function notaDaPartida({ vitoria, cobertas, erros }) {
  return vitoria ? Math.max(0, cobertas - erros) : cobertas;
}
