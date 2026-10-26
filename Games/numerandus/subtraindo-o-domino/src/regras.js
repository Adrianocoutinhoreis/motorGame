/**
 * regras.js — as regras do Subtraindo o Dominó, sem desenho e sem motor.
 *
 * Funções puras, para a cena e o tutorial usarem a MESMA conta e para poderem
 * ser conferidas em Node sem navegador. Especificação em
 * `docs/REGRAS-SUBTRAINDO-O-DOMINO.md` (seções 3 a 6).
 *
 * As pedras são as de um dominó comum SEM as de 0: faces de 1 a `faces`. Com
 * `faces` = 6 são 21 pedras e todo total de dois dados (2 a 12) tem pelo menos
 * uma pedra. Toda função que sorteia recebe `aleatorio` (padrão `Math.random`),
 * injetável para teste.
 */

/** O dado comum: faces de 1 a 6. */
export const FACES_DADO = 6;

/** A mesa: 6 colunas de 144 × 80 px; a pedra (128 × 64) fica no meio da célula (16 px de folga nominal). */
export const MESA_COLUNAS = 6;

/** Todas as pedras de faces 1..`faces`, com a menor face primeiro: 1-1, 1-2 … */
export function criarPecas(faces) {
  const pecas = [];
  for (let a = 1; a <= faces; a++) {
    for (let b = a; b <= faces; b++) pecas.push({ a, b, soma: a + b });
  }
  return pecas;
}

/** As pedras AINDA NA MESA (`livre`) cuja soma é `total`. */
export function pecasQueSomam(pecas, total) {
  return pecas.filter((p) => p.livre !== false && p.soma === total);
}

/**
 * Joga os dois dados. O total sorteado SEMPRE tem pelo menos uma pedra livre:
 * a rodada nunca morre num total sem pedra (decisão 2 do planejamento, "rodada
 * limpa"). Sorteia os dois dados e repete até dar um total que existe na mesa —
 * a chance de cada total continua proporcional aos dados reais (o 7 é o mais
 * comum), só sem os totais sem pedra.
 *
 * @returns {{d1:number, d2:number, total:number}|null} `null` se a mesa esvaziou
 */
export function sortearDados(pecas, aleatorio = Math.random) {
  const totais = new Set(pecas.filter((p) => p.livre !== false).map((p) => p.soma));
  if (!totais.size) return null;
  for (let i = 0; i < 500; i++) {
    const d1 = 1 + Math.floor(aleatorio() * FACES_DADO);
    const d2 = 1 + Math.floor(aleatorio() * FACES_DADO);
    if (totais.has(d1 + d2)) return { d1, d2, total: d1 + d2 };
  }
  // Rede de segurança (nunca chega aqui com dados honestos): um total que existe.
  const total = [...totais][Math.floor(aleatorio() * totais.size)];
  const d1 = Math.max(1, Math.min(FACES_DADO, total - 1));
  return { d1, d2: total - d1, total };
}

/** Embaralha uma cópia (Fisher–Yates). */
export function embaralhar(lista, aleatorio = Math.random) {
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/**
 * Onde cada pedra cai na mesa: `n` células distintas de uma grade de
 * `MESA_COLUNAS` colunas, centradas verticalmente, cada uma com um pequeno
 * desvio e giro (±2 px, ±1,5°) para parecer jogada, sem encostar na vizinha
 * (a folga é de 16 px nominais e nunca passa de 8 px entre as caixas das pedras).
 *
 * @returns {{col:number, linha:number, dx:number, dy:number, giro:number}[]}
 *   `n` posições, na ordem das células (a cena embaralha quem ocupa cada uma)
 */
export function posicionarMesa(n, aleatorio = Math.random) {
  const linhas = Math.ceil(n / MESA_COLUNAS);
  const celulas = embaralhar([...Array(linhas * MESA_COLUNAS).keys()], aleatorio).slice(0, n).sort((x, y) => x - y);
  return celulas.map((c) => ({
    col: c % MESA_COLUNAS,
    linha: Math.floor(c / MESA_COLUNAS),
    dx: (aleatorio() * 2 - 1) * 2,
    dy: (aleatorio() * 2 - 1) * 2,
    giro: (aleatorio() * 2 - 1) * 1.5,
  }));
}

/** A pedra que a ajuda acende: a primeira livre que soma `total` (ou `null`). */
export function pecaDeAjuda(pecas, total) {
  return pecasQueSomam(pecas, total)[0] ?? null;
}

/**
 * Quem vence: mais pedras que o computador. Com número ÍMPAR de rodadas e uma
 * pedra para um dos dois a cada rodada, não existe empate (`'empate'` só para
 * proteger o contrato se alguém mudar as rodadas para um número par).
 */
export function quemVence(pedrasCrianca, pedrasComputador) {
  if (pedrasCrianca > pedrasComputador) return 'v';
  if (pedrasCrianca < pedrasComputador) return 'c';
  return 'empate';
}
