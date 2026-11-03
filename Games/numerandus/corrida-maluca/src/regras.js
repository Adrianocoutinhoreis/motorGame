/**
 * regras.js — as regras da Corrida Maluca, sem desenho e sem motor.
 *
 * Funções puras, para a cena e o tutorial usarem a MESMA conta e para poderem
 * ser conferidas em Node sem navegador. Especificação em
 * `docs/REGRAS-CORRIDA-MALUCA.md` (seções 3 a 6). Toda função que sorteia
 * recebe `aleatorio` (padrão `Math.random`), injetável para teste.
 */

/** O dado comum: faces de 1 a 6. */
export const FACES_DADO = 6;

/**
 * A serpentina do vídeo, em px da tela 1280 × 720: a fileira de baixo (da ENTRADA para a direita),
 * a curva da direita, a fileira do meio (para a esquerda), a curva da esquerda e a fileira de cima
 * até a SAÍDA. São os 28 círculos do tabuleiro do vídeo (27 passos); os níveis com menos passos
 * distribuem menos casas, maiores, ao longo do MESMO caminho (`montarTrilha`).
 */
export const ROTA = [
  [110, 630], [215, 630], [320, 630], [425, 630], [530, 630], [635, 630], [740, 630], [845, 630],
  [912, 585], [930, 500], [902, 420],
  [830, 370], [725, 370], [620, 370], [515, 370], [410, 370], [305, 370], [200, 370],
  [125, 300], [118, 215],
  [180, 140], [285, 140], [390, 140], [495, 140], [600, 140], [705, 140], [810, 140], [915, 140],
];

/** As casas verdes do tabuleiro do vídeo, em passos de 27. */
export const VERDES_DO_VIDEO = [9, 15, 22];

/** O comprimento de cada trecho acumulado da rota. */
function comprimentos(rota) {
  const acum = [0];
  for (let i = 1; i < rota.length; i++) {
    acum.push(acum[i - 1] + Math.hypot(rota[i][0] - rota[i - 1][0], rota[i][1] - rota[i - 1][1]));
  }
  return acum;
}

/**
 * As verdes de uma trilha de `passos`: as 3 do vídeo nas MESMAS proporções do caminho
 * (15 → 5, 8, 12 · 21 → 7, 12, 17 · 27 → 9, 15, 22). Nunca a ENTRADA nem a SAÍDA.
 */
export function casasVerdes(passos) {
  return VERDES_DO_VIDEO.map((i) => Math.round((passos * i) / 27)).filter((c) => c > 0 && c < passos);
}

/**
 * A trilha de um nível: `passos + 1` casas (a 0 é a ENTRADA, a última é a SAÍDA) a distâncias
 * iguais ao longo de `ROTA`, as verdes e o raio das casas — `min(42, espaçamento × 0,33)`, que dá
 * 42 px no Fácil e no Médio e 33 no Difícil (66 px de diâmetro).
 *
 * @returns {{casas: number[][], verdes: number[], saida: number, raio: number}}
 */
export function montarTrilha(passos, rota = ROTA) {
  const acum = comprimentos(rota);
  const total = acum[acum.length - 1];
  const casas = [];
  for (let k = 0, s = 1; k <= passos; k++) {
    const d = (total * k) / passos;
    while (s < rota.length - 1 && acum[s] < d) s++;
    const t = (d - acum[s - 1]) / (acum[s] - acum[s - 1]);
    casas.push([
      Math.round(rota[s - 1][0] + t * (rota[s][0] - rota[s - 1][0])),
      Math.round(rota[s - 1][1] + t * (rota[s][1] - rota[s - 1][1])),
    ]);
  }
  return { casas, verdes: casasVerdes(passos), saida: passos, raio: Math.min(42, Math.round((total / passos) * 0.33)) };
}

/** Joga o dado: 1 a 6, honesto, para a criança e para o computador. */
export function rolarDado(aleatorio = Math.random) {
  return 1 + Math.floor(aleatorio() * FACES_DADO);
}

/** Onde a jogada termina: passar da SAÍDA para nela (não é preciso cair exato). */
export function alvoDaJogada(inicio, dado, saida) {
  return Math.min(inicio + dado, saida);
}

// ---------------------------------------------------------------------- cartas

export const ORDINAIS = ['', 'PRIMEIRO', 'SEGUNDO', 'TERCEIRO', 'QUARTO', 'QUINTO', 'SEXTO', 'SÉTIMO', 'OITAVO', 'NONO', 'DÉCIMO'];

/** As coisas dos problemas de preço (Difícil): [uma, várias]. */
export const COISAS = [
  ['UMA MAÇÃ', 'MAÇÃS'], ['UM LÁPIS', 'LÁPIS'], ['UMA BALA', 'BALAS'], ['UM PICOLÉ', 'PICOLÉS'], ['UM CADERNO', 'CADERNOS'],
];

const inteiro = (min, max, aleatorio) => min + Math.floor(aleatorio() * (max - min + 1));

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
 * As três respostas de uma carta de número: a certa, a CONFUSÃO típica (o triplo no lugar do dobro,
 * ou o contrário) e uma vizinha. Todas positivas e diferentes; se faltar candidata, a próxima acima.
 */
export function opcoesNumericas(certa, confusao, vizinhas, aleatorio = Math.random) {
  const out = [certa];
  for (const c of [confusao, ...embaralhar(vizinhas, aleatorio)]) {
    if (c > 0 && !out.includes(c) && out.length < 3) out.push(c);
  }
  for (let k = 1; out.length < 3; k++) if (!out.includes(certa + k)) out.push(certa + k);
  return embaralhar(out, aleatorio);
}

/** `n + n + n` com `vezes` parcelas: a conta que o 2º ano conhece antes da tabuada. */
const parcelas = (n, vezes) => Array(vezes).fill(n).join(' + ');

/**
 * Uma carta de um `tipo`, com o número sorteado até `max`.
 *
 * @returns {{tipo:string, chave:string, pergunta:string, certa:number,
 *   opcoes:{valor:number, texto:string, sub?:string}[], conta:string, fala:{id:string, numero?:number}[]}}
 *   `fala` é a pergunta narrada em pedaços, na ordem: `{id, texto}` é uma fala gravada, `{numero}`
 *   é o `numeroN` da coleção.
 */
export function gerarCarta(tipo, max, aleatorio = Math.random) {
  if (tipo === 'dobro' || tipo === 'triplo') {
    const vezes = tipo === 'dobro' ? 2 : 3;
    const n = inteiro(1, max, aleatorio);
    const certa = n * vezes;
    const confusao = n * (vezes === 2 ? 3 : 2);
    const vizinhas = [certa + 1, certa - 1, n + vezes];
    return {
      tipo,
      chave: `${tipo}${n}`,
      pergunta: `QUAL É O ${tipo.toUpperCase()} DE ${n}?`,
      certa,
      opcoes: opcoesNumericas(certa, confusao, vizinhas, aleatorio).map((v) => ({ valor: v, texto: String(v) })),
      conta: `O ${tipo.toUpperCase()} DE ${n} É ${parcelas(n, vezes)} = ${certa}`,
      fala: [{ id: tipo === 'dobro' ? 'qualODobroDe' : 'qualOTriploDe', texto: `Qual é o ${tipo} de` }, { numero: n }],
    };
  }
  if (tipo === 'ordinal') {
    const n = inteiro(1, max, aleatorio);
    const teto = Math.max(max, 3);
    const viz = embaralhar([n - 1, n + 1, n - 2, n + 2].filter((k) => k >= 1 && k <= teto), aleatorio);
    return {
      tipo,
      chave: `ordinal${n}`,
      // A frase do narrador (1:14): "como se chama o número 10 de forma ordinal?"
      pergunta: `COMO SE CHAMA O NÚMERO ${n} DE FORMA ORDINAL?`,
      certa: n,
      opcoes: embaralhar([n, viz[0], viz[1]], aleatorio).map((v) => ({ valor: v, texto: ORDINAIS[v], sub: `${v}º` })),
      conta: `O ${n} DE FORMA ORDINAL É ${ORDINAIS[n]} (${n}º)`,
      fala: [{ id: 'comoSeChamaONumero', texto: 'Como se chama o número' }, { numero: n }, { id: 'deFormaOrdinal', texto: 'de forma ordinal?' }],
    };
  }
  if (tipo === 'problema') {
    const [uma, varias] = COISAS[inteiro(0, COISAS.length - 1, aleatorio)];
    const preco = inteiro(1, 5, aleatorio);
    const qtd = inteiro(2, 3, aleatorio);
    const certa = preco * qtd;
    const confusao = preco * (qtd === 2 ? 3 : 2);
    return {
      tipo,
      chave: `problema${uma}${preco}${qtd}`,
      pergunta: `SE ${uma} CUSTA R$ ${preco}, QUANTO CUSTAM ${qtd} ${varias}?`,
      certa,
      opcoes: opcoesNumericas(certa, confusao, [certa + 1, certa - 1, preco + qtd], aleatorio).map((v) => ({ valor: v, texto: `R$ ${v}` })),
      conta: `É O ${qtd === 2 ? 'DOBRO' : 'TRIPLO'}: ${parcelas(preco, qtd)} = R$ ${certa}`,
      // Uma fala só, por enquanto: o formato da gravação dos problemas (inteiros ou em pedaços) está em aberto.
      fala: [{ id: 'problema', texto: `Se ${uma.toLowerCase()} custa ${preco} ${preco === 1 ? 'real' : 'reais'}, quanto custam ${qtd} ${varias.toLowerCase()}?` }],
    };
  }
  throw new Error(`[corrida-maluca] tipo de carta desconhecido: ${tipo}`);
}

/**
 * Os tipos de carta de um nível, a partir de `nivel.cartas` ({ dobro: max, triplo: max, ordinal: max,
 * problema: true }): só entra o que o nível tem.
 */
export function tiposDoNivel(cartas) {
  return Object.entries(cartas ?? {}).filter(([, v]) => v).map(([tipo, v]) => ({ tipo, max: v === true ? 0 : v }));
}

/**
 * Sorteia a carta da vez: o tipo com chances iguais entre os do nível e uma carta que não saiu nos
 * últimos `recentes` sorteios (a cena guarda 4). Devolve a carta e a lista de recentes atualizada.
 */
export function sortearCarta(cartas, recentes = [], aleatorio = Math.random, guardar = 4) {
  const tipos = tiposDoNivel(cartas);
  let carta = null;
  for (let t = 0; t < 60; t++) {
    const { tipo, max } = tipos[Math.floor(aleatorio() * tipos.length)];
    carta = gerarCarta(tipo, max, aleatorio);
    if (!recentes.includes(carta.chave)) break;
  }
  return { carta, recentes: [carta.chave, ...recentes].slice(0, guardar) };
}

/**
 * A resposta do computador: certa, ou — com chance `erra` (1 em 4 na decisão 2) — uma das erradas
 * da carta, para a criança conferir.
 * @returns {{opcao: object, certo: boolean}}
 */
export function respostaDoComputador(carta, erra = 0.25, aleatorio = Math.random) {
  if (aleatorio() < erra) {
    const erradas = carta.opcoes.filter((o) => o.valor !== carta.certa);
    return { opcao: erradas[Math.floor(aleatorio() * erradas.length)], certo: false };
  }
  return { opcao: carta.opcoes.find((o) => o.valor === carta.certa), certo: true };
}

/**
 * A nota da partida (RE-02): na vitória, a meta (o tamanho da trilha) menos as cartas erradas, nunca
 * abaixo de 0; na derrota, a casa alcançada pela ficha da criança, sem desconto.
 */
export function notaDaPartida({ vitoria, meta, erros, casa }) {
  return vitoria ? Math.max(0, meta - erros) : casa;
}
