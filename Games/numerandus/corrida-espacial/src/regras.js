/**
 * regras.js — as regras da Corrida Espacial, sem desenho e sem motor.
 *
 * Funções puras, para a cena e o tutorial usarem a MESMA conta e para poderem
 * ser conferidas em Node sem navegador. Especificação em
 * `docs/REGRAS-CORRIDA-ESPACIAL.md` (seções 4 e 5).
 *
 * Casas: 0 é a largada (fora da pista), 1 a 20 são a pista, e `CHEGADA` (21) é
 * a faixa depois do 20 — onde termina qualquer andança que passe dele.
 */

export const ULTIMA_CASA = 20;
export const CHEGADA = ULTIMA_CASA + 1;

/** Um dado comum, de 1 a 6. `aleatorio` é injetável para teste. */
export function rolarDado(aleatorio = Math.random) {
  return 1 + Math.floor(aleatorio() * 6);
}

/** Os dados de uma jogada: um no modo 'dado', dois nos modos 'soma' e 'diferenca'. */
export function rolarDados(modo, aleatorio = Math.random) {
  return modo === 'dado' ? [rolarDado(aleatorio)] : [rolarDado(aleatorio), rolarDado(aleatorio)];
}

/**
 * Quantas casas a jogada anda.
 *   'dado'      → o valor do dado (1 a 6)
 *   'soma'      → a soma dos dois (2 a 12)
 *   'diferenca' → o maior menos o menor (0 a 5); zero = não sai do lugar
 */
export function andanca(modo, dados) {
  if (modo === 'dado') return dados[0];
  if (modo === 'soma') return dados[0] + dados[1];
  return Math.abs(dados[0] - dados[1]);
}

/**
 * A casa onde o foguete precisa parar.
 *
 * `chegada: 'passar'` (o brinquedo do vídeo: "tirou 9 e já ultrapassou"):
 * passar do 20 leva à CHEGADA. `chegada: 'exata'`: passar do 20 não anda.
 */
export function casaAlvo(inicio, casas, chegada = 'passar') {
  const destino = inicio + casas;
  if (destino <= ULTIMA_CASA) return destino;
  return chegada === 'passar' ? CHEGADA : inicio;
}

/** O foguete terminou a corrida? Cair no 20 já conta. */
export function chegou(casa) {
  return casa >= ULTIMA_CASA;
}

/** Os dados na ordem de leitura da conta: no modo 'diferenca', o maior primeiro. */
export function dadosParaLeitura(modo, dados) {
  if (modo === 'diferenca' && dados[1] > dados[0]) return [dados[1], dados[0]];
  return dados;
}
