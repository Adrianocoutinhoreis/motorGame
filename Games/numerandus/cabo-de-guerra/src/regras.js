/**
 * regras.js — as regras do Cabo de Guerra, sem desenho e sem motor.
 *
 * Funções puras, para a cena e o tutorial usarem a MESMA conta e para poderem ser conferidas em Node
 * sem navegador. Especificação em `docs/REGRAS-CABO-DE-GUERRA.md`. Toda função que sorteia recebe
 * `aleatorio` (padrão `Math.random`), injetável para teste.
 *
 * A posição do nó é um índice `i` de 0 a 2·passos: 0 é a ponta da criança (esquerda), `passos` é o
 * centro (onde o nó começa) e 2·passos é a ponta do computador (direita).
 */

/** O dado comum: faces de 1 a 6. */
export const FACES_DADO = 6;

/** O retângulo da tira na tela 1280 × 720 e o espaço entre a borda e a primeira bolinha. */
export const TIRA = { x: 40, y: 104, l: 1200, a: 190, folga: 72 };

/**
 * A trilha de um nível: `2 × passos + 1` bolinhas a distâncias iguais, da ponta da criança à do
 * computador. O raio da bolinha é `min(46, espaçamento × 0,4)` e o do nó é 1,45 vez ele (no máximo 60).
 *
 * @returns {{xs:number[], y:number, raio:number, noRaio:number, passos:number, ultimo:number}}
 */
export function montarTrilha(passos) {
  const n = 2 * passos + 1;
  const espaco = (TIRA.l - 2 * TIRA.folga) / (n - 1);
  const xs = Array.from({ length: n }, (_, k) => Math.round(TIRA.x + TIRA.folga + k * espaco));
  const raio = Math.min(46, Math.round(espaco * 0.4));
  return { xs, y: TIRA.y + TIRA.a / 2, raio, noRaio: Math.min(60, Math.round(raio * 1.45)), passos, ultimo: n - 1 };
}

/** Joga o dado: 1 a 6, honesto, para a criança e para o computador. */
export function rolarDado(aleatorio = Math.random) {
  return 1 + Math.floor(aleatorio() * FACES_DADO);
}

/**
 * Onde o nó para depois de uma puxada certa: a criança puxa para o 0, o computador para o 2·passos.
 * Passar da ponta para nela (não é preciso cair exato).
 */
export function alvoDaPuxada(pos, quem, dado, passos) {
  return quem === 'crianca' ? Math.max(0, pos - dado) : Math.min(2 * passos, pos + dado);
}

/** Quem chegou à ponta com o nó, ou `null` se ninguém ainda. */
export function vencedorDaPartida(pos, passos) {
  if (pos <= 0) return 'crianca';
  if (pos >= 2 * passos) return 'computador';
  return null;
}

/** Quantas casas faltam para `quem` levar o nó até a ponta dele. */
export function faltam(pos, quem, passos) {
  return quem === 'crianca' ? pos : 2 * passos - pos;
}

/** Quantas casas a criança já ganhou do centro rumo à ponta dela (0 se o nó está do outro lado). */
export function progressoDaCrianca(pos, passos) {
  return Math.max(0, passos - pos);
}

// ---------------------------------------------------------------------- cartas

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
 * As três respostas de uma carta de número: a certa, a CONFUSÃO típica (o sucessor no lugar do
 * antecessor, o vizinho na tabuada…) e uma vizinha. Todas positivas e diferentes; se faltar
 * candidata, a próxima acima.
 */
export function opcoesNumericas(certa, confusao, vizinhas, aleatorio = Math.random) {
  const out = [certa];
  for (const c of [confusao, ...embaralhar(vizinhas, aleatorio)]) {
    if (c > 0 && !out.includes(c) && out.length < 3) out.push(c);
  }
  for (let k = 1; out.length < 3; k++) if (!out.includes(certa + k)) out.push(certa + k);
  return embaralhar(out, aleatorio);
}

/** Uma carta de unidade: `outra` é a medida errada "de enfeite" (METROS ou CENTÍMETROS) ao lado da outra grandeza. */
const unidade = (id, pergunta, tipo, outra) => (tipo === 'capacidade'
  ? { id, pergunta, certa: 'LITROS', erradas: ['QUILOGRAMAS', outra], conta: 'A CAPACIDADE SE MEDE EM LITROS', tipo }
  : { id, pergunta, certa: 'QUILOGRAMAS', erradas: ['LITROS', outra], conta: 'A MASSA SE MEDE EM QUILOGRAMAS', tipo });

/**
 * As cartas de unidade: pergunta, resposta certa, as erradas, a conta e o tema (capacidade ou massa).
 * 24 cartas, 12 de cada tema. O `id` vira o id da fala (`unidade_<id>`).
 */
export const UNIDADES = [
  // capacidade: litros
  unidade('suco', 'O SUCO DA JARRA É MEDIDO EM…', 'capacidade', 'METROS'),
  unidade('balde', 'A ÁGUA DO BALDE É MEDIDA EM…', 'capacidade', 'CENTÍMETROS'),
  unidade('leite', 'O LEITE DA CAIXA É MEDIDO EM…', 'capacidade', 'METROS'),
  unidade('piscina', 'A ÁGUA DA PISCINA É MEDIDA EM…', 'capacidade', 'METROS'),
  unidade('refrigerante', 'O REFRIGERANTE DA GARRAFA É MEDIDO EM…', 'capacidade', 'CENTÍMETROS'),
  unidade('sopa', 'A SOPA DA PANELA É MEDIDA EM…', 'capacidade', 'METROS'),
  unidade('aquario', 'A ÁGUA DO AQUÁRIO É MEDIDA EM…', 'capacidade', 'CENTÍMETROS'),
  unidade('tanque', 'A ÁGUA DO TANQUE É MEDIDA EM…', 'capacidade', 'METROS'),
  unidade('cafe', 'O CAFÉ DA GARRAFA TÉRMICA É MEDIDO EM…', 'capacidade', 'CENTÍMETROS'),
  unidade('oleo', 'O ÓLEO DA LATA É MEDIDO EM…', 'capacidade', 'METROS'),
  unidade('vitamina', 'A VITAMINA DA JARRA É MEDIDA EM…', 'capacidade', 'CENTÍMETROS'),
  unidade('chuva', 'A ÁGUA DO BALDE DA CHUVA É MEDIDA EM…', 'capacidade', 'METROS'),
  // massa: quilogramas
  unidade('arroz', 'O ARROZ DO SACO É MEDIDO EM…', 'massa', 'METROS'),
  unidade('melancia', 'A MELANCIA NA BALANÇA É MEDIDA EM…', 'massa', 'CENTÍMETROS'),
  unidade('feijao', 'O FEIJÃO DO PACOTE É MEDIDO EM…', 'massa', 'CENTÍMETROS'),
  unidade('acucar', 'O AÇÚCAR DO PACOTE É MEDIDO EM…', 'massa', 'METROS'),
  unidade('farinha', 'A FARINHA DO SACO É MEDIDA EM…', 'massa', 'CENTÍMETROS'),
  unidade('batata', 'A BATATA NA BALANÇA É MEDIDA EM…', 'massa', 'METROS'),
  unidade('abobora', 'A ABÓBORA NA BALANÇA É MEDIDA EM…', 'massa', 'CENTÍMETROS'),
  unidade('carne', 'A CARNE NA BALANÇA É MEDIDA EM…', 'massa', 'METROS'),
  unidade('laranja', 'O SACO DE LARANJAS É MEDIDO EM…', 'massa', 'CENTÍMETROS'),
  unidade('cachorro', 'O CACHORRO NA BALANÇA É MEDIDO EM…', 'massa', 'METROS'),
  unidade('queijo', 'O QUEIJO NA BALANÇA É MEDIDO EM…', 'massa', 'CENTÍMETROS'),
  unidade('mochila', 'A MOCHILA CHEIA NA BALANÇA É MEDIDA EM…', 'massa', 'CENTÍMETROS'),
];

/**
 * Os problemas de somar medidas (grupo `soma`). `frase(a, b)` devolve a pergunta em CAIXA ALTA e a fala
 * (a mesma, em minúsculas). `a` e `b` vão de 1 ao `max` do nível, e a medida concorda no plural.
 */
const quant = (n, singular, plural) => `${n} ${n === 1 ? singular : plural}`;
const SOMAS = [
  { id: 'suco', tipo: 'capacidade', un: 'LITROS', frase: (a, b) => `${quant(a, 'LITRO', 'LITROS')} DE SUCO E MAIS ${quant(b, 'LITRO', 'LITROS')} DE SUCO. QUANTOS LITROS?` },
  { id: 'leite', tipo: 'capacidade', un: 'LITROS', frase: (a, b) => `${quant(a, 'LITRO', 'LITROS')} DE LEITE E MAIS ${quant(b, 'LITRO', 'LITROS')} DE LEITE. QUANTOS LITROS?` },
  { id: 'agua', tipo: 'capacidade', un: 'LITROS', frase: (a, b) => `${quant(a, 'LITRO', 'LITROS')} DE ÁGUA E MAIS ${quant(b, 'LITRO', 'LITROS')} DE ÁGUA. QUANTOS LITROS?` },
  { id: 'arroz', tipo: 'massa', un: 'QUILOS', frase: (a, b) => `${quant(a, 'QUILO', 'QUILOS')} DE ARROZ E MAIS ${quant(b, 'QUILO', 'QUILOS')} DE FEIJÃO. QUANTOS QUILOS?` },
  { id: 'acucar', tipo: 'massa', un: 'QUILOS', frase: (a, b) => `${quant(a, 'QUILO', 'QUILOS')} DE AÇÚCAR E MAIS ${quant(b, 'QUILO', 'QUILOS')} DE FARINHA. QUANTOS QUILOS?` },
  { id: 'fruta', tipo: 'massa', un: 'QUILOS', frase: (a, b) => `${quant(a, 'QUILO', 'QUILOS')} DE MAÇÃ E MAIS ${quant(b, 'QUILO', 'QUILOS')} DE BANANA. QUANTOS QUILOS?` },
];

/** Os problemas de várias vezes a mesma medida (grupo `garrafas`): `n` recipientes de `g` litros ou quilos. */
const GARRAFAS = [
  { id: 'garrafa', tipo: 'capacidade', un: 'LITROS', frase: (n, g) => `${n} GARRAFAS DE ${g} LITROS. QUANTOS LITROS NO TOTAL?` },
  { id: 'jarra', tipo: 'capacidade', un: 'LITROS', frase: (n, g) => `${n} JARRAS DE ${g} LITROS. QUANTOS LITROS NO TOTAL?` },
  { id: 'balde', tipo: 'capacidade', un: 'LITROS', frase: (n, g) => `${n} BALDES DE ${g} LITROS. QUANTOS LITROS NO TOTAL?` },
  { id: 'saco', tipo: 'massa', un: 'QUILOS', frase: (n, g) => `${n} SACOS DE ${g} QUILOS. QUANTOS QUILOS NO TOTAL?` },
  { id: 'caixa', tipo: 'massa', un: 'QUILOS', frase: (n, g) => `${n} CAIXAS DE ${g} QUILOS. QUANTOS QUILOS NO TOTAL?` },
];

/** O nome do tipo da carta na tela. */
export const NOME_DO_TIPO = {
  multiplicacao: 'MULTIPLICAÇÃO',
  antecessor: 'ANTECESSOR',
  sucessor: 'SUCESSOR',
  capacidade: 'CAPACIDADE',
  massa: 'MASSA',
  dobro: 'DOBRO',
  triplo: 'TRIPLO',
  metade: 'METADE',
  sequencia: 'SEQUÊNCIA',
  adicao: 'ADIÇÃO',
};

/** Os grupos de carta que existem (o que `nivel.cartas` pode ligar). */
export const GRUPOS = [
  'multiplicacao', 'antecessor', 'sucessor', 'unidade', 'soma', 'garrafas',
  'dobro', 'triplo', 'metade', 'sequencia', 'adicaoRepetida',
];

/** Um número com as respostas numéricas padrão (texto = o número). */
const comNumeros = (valores) => valores.map((v) => ({ valor: v, texto: String(v) }));

/**
 * Uma carta de um `grupo`. `cfg` é o que o nível diz do grupo:
 *   multiplicacao   { a: [tabuadas], b: [min, max] }
 *   antecessor / sucessor   [min, max]
 *   dobro / triplo  [min, max]  (o número do enunciado)
 *   metade          [min, max]  (sorteia um número PAR nesse intervalo)
 *   sequencia       { passos: [2, 5, 10…], inicio: [min, max], desce?: true }  (4 termos e "qual vem depois?")
 *   adicaoRepetida  { n: [min, max], k: [min, max] }  (k parcelas iguais a n: "4 + 4 + 4 = ?")
 *   soma            { max } (parcelas de 1 a `max`; padrão 5) ou nada
 *   unidade / garrafas   (sem configuração)
 *
 * @returns {{tipo:string, grupo:string, chave:string, pergunta:string, certa:number|string,
 *   opcoes:{valor:number|string, texto:string, sub?:string}[], conta:string, fala:object[]}}
 *   `tipo` é o que a tela mostra (`NOME_DO_TIPO`); `grupo` é a chave de sorteio e de relatório. `fala` é
 *   a pergunta narrada em pedaços: `{id, texto}` é uma fala gravada, `{numero}` é o `numeroN` da coleção.
 */
export function gerarCarta(grupo, cfg, aleatorio = Math.random) {
  if (grupo === 'multiplicacao') {
    const x = cfg.a[Math.floor(aleatorio() * cfg.a.length)];
    const y = inteiro(cfg.b[0], cfg.b[1], aleatorio);
    const certa = x * y;
    return {
      tipo: 'multiplicacao', grupo, chave: `m${x}x${y}`,
      pergunta: `${x} × ${y} = ?`,
      certa,
      // A confusão: um grupo a mais (7 × 7 no lugar de 7 × 6). As vizinhas: um a menos e a soma.
      opcoes: comNumeros(opcoesNumericas(certa, certa + x, [certa - x, x + y, certa + 1], aleatorio)),
      conta: `${x} × ${y} = ${certa}`,
      fala: [{ id: 'quantoE', texto: 'Quanto é' }, { numero: x }, { id: 'vezes', texto: 'vezes' }, { numero: y }],
    };
  }
  if (grupo === 'antecessor' || grupo === 'sucessor') {
    const ant = grupo === 'antecessor';
    const n = inteiro(cfg[0], cfg[1], aleatorio);
    const certa = ant ? n - 1 : n + 1;
    // A confusão do vídeo ("31 não, 31 é sucessor"): o do lado oposto.
    const confusao = ant ? n + 1 : n - 1;
    return {
      tipo: grupo, grupo, chave: `${ant ? 'a' : 's'}${n}`,
      pergunta: `QUAL É O ${ant ? 'ANTECESSOR' : 'SUCESSOR'} DE ${n}?`,
      certa,
      opcoes: comNumeros(opcoesNumericas(certa, confusao, [ant ? n - 2 : n + 2, n], aleatorio)),
      conta: ant ? `ANTECESSOR VEM ANTES: ${n - 1}, ${n}` : `SUCESSOR VEM DEPOIS: ${n}, ${n + 1}`,
      fala: [{ id: ant ? 'qualOAntecessorDe' : 'qualOSucessorDe', texto: `Qual é o ${ant ? 'antecessor' : 'sucessor'} de` }, { numero: n }],
    };
  }
  if (grupo === 'unidade') {
    const u = UNIDADES[Math.floor(aleatorio() * UNIDADES.length)];
    return {
      tipo: u.tipo, grupo, chave: `u${u.id}`,
      pergunta: u.pergunta,
      certa: u.certa,
      opcoes: embaralhar([u.certa, ...u.erradas], aleatorio).map((v) => ({ valor: v, texto: v })),
      conta: u.conta,
      fala: [{ id: `unidade_${u.id}`, texto: u.pergunta.replace('…', '') }],
    };
  }
  if (grupo === 'soma') {
    const max = cfg?.max ?? 5;
    const p = SOMAS[Math.floor(aleatorio() * SOMAS.length)];
    const a = inteiro(1, max, aleatorio);
    const b = inteiro(1, max, aleatorio);
    const certa = a + b;
    const pergunta = p.frase(a, b);
    return {
      tipo: p.tipo, grupo, chave: `p${p.id}${a}_${b}`,
      pergunta,
      certa,
      opcoes: opcoesNumericas(certa, certa + 1, [certa - 1, a * b], aleatorio).map((v) => ({ valor: v, texto: String(v), sub: p.un })),
      conta: `${a} + ${b} = ${certa} ${p.un}`,
      fala: [{ id: 'problema', texto: pergunta.charAt(0) + pergunta.slice(1).toLowerCase() }],
    };
  }
  if (grupo === 'garrafas') {
    const p = GARRAFAS[Math.floor(aleatorio() * GARRAFAS.length)];
    const g = inteiro(2, 5, aleatorio);
    const n = inteiro(2, 5, aleatorio);
    const certa = g * n;
    const pergunta = p.frase(n, g);
    return {
      tipo: p.tipo, grupo, chave: `g${p.id}${g}_${n}`,
      pergunta,
      certa,
      opcoes: opcoesNumericas(certa, g + n, [certa + g, certa - n], aleatorio).map((v) => ({ valor: v, texto: String(v), sub: p.un })),
      conta: `${n} × ${g} = ${certa} ${p.un}`,
      fala: [{ id: 'problema', texto: pergunta.charAt(0) + pergunta.slice(1).toLowerCase() }],
    };
  }
  if (grupo === 'dobro' || grupo === 'triplo') {
    const dobro = grupo === 'dobro';
    const n = inteiro(cfg[0], cfg[1], aleatorio);
    const f = dobro ? 2 : 3;
    const certa = f * n;
    // A confusão do dobro: somar 2 em vez de dobrar; a do triplo: dar só o dobro.
    const confusao = dobro ? n + 2 : 2 * n;
    return {
      tipo: grupo, grupo, chave: `${dobro ? 'd' : 't'}${n}`,
      pergunta: `QUAL É O ${dobro ? 'DOBRO' : 'TRIPLO'} DE ${n}?`,
      certa,
      opcoes: comNumeros(opcoesNumericas(certa, confusao, dobro ? [certa - 2, certa + 2, 3 * n] : [certa - 3, certa + 3, n + 3], aleatorio)),
      conta: dobro ? `O DOBRO DE ${n} É ${n} + ${n} = ${certa}` : `O TRIPLO DE ${n} É ${n} + ${n} + ${n} = ${certa}`,
      fala: [{ id: dobro ? 'qualODobroDe' : 'qualOTriploDe', texto: `Qual é o ${dobro ? 'dobro' : 'triplo'} de` }, { numero: n }],
    };
  }
  if (grupo === 'metade') {
    // Só números pares, para a metade ser inteira.
    const m = inteiro(Math.ceil(cfg[0] / 2), Math.floor(cfg[1] / 2), aleatorio);
    const n = 2 * m;
    return {
      tipo: 'metade', grupo, chave: `h${n}`,
      pergunta: `QUAL É A METADE DE ${n}?`,
      certa: m,
      opcoes: comNumeros(opcoesNumericas(m, m + 1, [m - 1, m + 2, n - 2], aleatorio)),
      conta: `A METADE DE ${n} É ${m}, PORQUE ${m} + ${m} = ${n}`,
      fala: [{ id: 'qualAMetadeDe', texto: 'Qual é a metade de' }, { numero: n }],
    };
  }
  if (grupo === 'sequencia') {
    const passo = cfg.passos[Math.floor(aleatorio() * cfg.passos.length)];
    const desce = !!cfg.desce && aleatorio() < 0.4;
    let ini = inteiro(cfg.inicio[0], cfg.inicio[1], aleatorio);
    if (desce) ini = Math.max(ini, 4 * passo + 1); // o próximo termo tem de continuar positivo
    const dir = desce ? -1 : 1;
    const termos = [0, 1, 2, 3].map((k) => ini + dir * k * passo);
    const ultimo = termos[3];
    const certa = ultimo + dir * passo;
    const pergunta = `${termos.join(', ')}, … QUAL NÚMERO VEM DEPOIS?`;
    return {
      tipo: 'sequencia', grupo, chave: `q${ini}${desce ? 'd' : 'a'}${passo}`,
      pergunta,
      certa,
      // A confusão: o número seguinte comum (+1), sem olhar o passo da sequência.
      opcoes: comNumeros(opcoesNumericas(certa, ultimo + dir, [certa + 1, certa - 1, ultimo + dir * 2 * passo], aleatorio)),
      conta: `A SEQUÊNCIA ${desce ? 'DIMINUI' : 'AUMENTA'} DE ${passo} EM ${passo}: ${[...termos, certa].join(', ')}`,
      fala: [{ id: 'problema', texto: `${termos.join(', ')}. Qual número vem depois?` }],
    };
  }
  if (grupo === 'adicaoRepetida') {
    const n = inteiro(cfg.n[0], cfg.n[1], aleatorio);
    const k = inteiro(cfg.k[0], cfg.k[1], aleatorio);
    const certa = n * k;
    const parcelas = Array(k).fill(n).join(' + ');
    return {
      tipo: 'adicao', grupo, chave: `r${n}x${k}`,
      pergunta: `${parcelas} = ?`,
      certa,
      // A confusão: somar o número com a quantidade de parcelas (4 + 3 em vez de 4 + 4 + 4).
      opcoes: comNumeros(opcoesNumericas(certa, n + k, [certa - n, certa + n, certa + 1], aleatorio)),
      conta: `${parcelas} = ${certa}, OU SEJA, ${k} × ${n} = ${certa}`,
      fala: [{ id: 'problema', texto: `${Array(k).fill(n).join(' mais ')}. Quanto é?` }],
    };
  }
  throw new Error(`[cabo-de-guerra] tipo de carta desconhecido: ${grupo}`);
}

/**
 * Os grupos de carta de um nível, a partir de `nivel.cartas`: só entra o que o nível tem
 * (`unidade`, `soma` e `garrafas` ligam com `true`).
 */
export function gruposDoNivel(cartas) {
  return Object.entries(cartas ?? {}).filter(([, v]) => v).map(([grupo, cfg]) => ({ grupo, cfg: cfg === true ? null : cfg }));
}

/**
 * Sorteia a carta da vez: o grupo com chances iguais entre os do nível e uma carta que ainda não
 * saiu na partida (no vídeo, "tira a pergunta para o lado de cá, porque essa já saiu"). Se, depois de
 * 60 tentativas, só restarem repetidas (monte pequeno), aceita a última.
 * Devolve a carta e a lista de usadas atualizada.
 */
export function sortearCarta(cartas, usadas = [], aleatorio = Math.random) {
  const grupos = gruposDoNivel(cartas);
  let carta = null;
  for (let t = 0; t < 60; t++) {
    const { grupo, cfg } = grupos[Math.floor(aleatorio() * grupos.length)];
    carta = gerarCarta(grupo, cfg, aleatorio);
    if (!usadas.includes(carta.chave)) break;
  }
  return { carta, usadas: usadas.includes(carta.chave) ? usadas : [...usadas, carta.chave] };
}

/**
 * A resposta do computador: certa, ou — com chance `erra` (1 em 4) — uma das erradas da carta, para a
 * criança conferir.
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
 * A nota da partida (RE-02): na vitória, a meta (os passos do nível) menos as cartas erradas, nunca
 * abaixo de 0; na derrota, as casas que a criança puxou do centro, sem desconto.
 */
export function notaDaPartida({ vitoria, meta, erros, progresso }) {
  return vitoria ? Math.max(0, meta - erros) : progresso;
}
