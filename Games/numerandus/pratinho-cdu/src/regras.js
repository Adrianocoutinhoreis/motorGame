/**
 * regras.js — as regras do Pratinho CDU, sem desenho e sem motor.
 *
 * Funções puras, para a cena e o tutorial usarem a MESMA conta e para poderem
 * ser conferidas em Node sem navegador. Especificação em
 * `docs/REGRAS-PRATINHO-CDU.md` (seções 3 a 5).
 *
 * O prato é medido em RAIOS: (0, 0) é o centro e 1 é a borda das fatias.
 * Ângulos em graus, no sentido da tela (y para baixo): 270° é o topo.
 * Toda função que sorteia recebe `aleatorio` (padrão `Math.random`), injetável
 * para teste.
 */

/** As três casas, na ordem de leitura do número. */
export const CASAS = ['c', 'd', 'u'];

/** Quanto vale um grão em cada casa. */
export const VALOR = { c: 100, d: 10, u: 1 };

/**
 * As fatias do prato, como no brinquedo do vídeo: C em cima à esquerda, D em
 * cima à direita, U embaixo. Cada uma é um terço do prato.
 */
export const SETOR = { c: [150, 270], d: [270, 390], u: [30, 150] };

/** Onde fica a letra de cada fatia (raio), e o espaço livre em volta dela. */
export const RAIO_LETRA = 0.55;
const FOLGA_LETRA = 0.26;

/** Faixa de raio onde um grão pode cair dentro da fatia. */
const RAIO_MIN = 0.26;
const RAIO_MAX = 0.9;
/** Folga angular para nenhum grão cair em cima da linha entre fatias. */
const FOLGA_ANGULO = 11;
/** Candidatos sorteados por grão; fica o mais afastado dos que já caíram. */
const CANDIDATOS = 40;

const sortear = (min, max, aleatorio) => min + Math.floor(aleatorio() * (max - min + 1));
const rad = (graus) => (graus * Math.PI) / 180;

/**
 * Quantos grãos caem em cada casa, segundo a faixa do nível.
 *
 * `nivel.faixa` = { c: [min, max], d: [...], u: [...] }; casa fora de
 * `nivel.casas` recebe 0. Com `nivel.chanceZero` > 0, nessa fração das jogadas
 * a dezena OU a unidade fica vazia — o zero no meio do número (305, 340).
 */
export function sortearQuantidades(nivel, aleatorio = Math.random) {
  const qt = { c: 0, d: 0, u: 0 };
  for (const casa of nivel.casas) {
    const [min, max] = nivel.faixa[casa];
    qt[casa] = sortear(min, max, aleatorio);
  }
  if (nivel.chanceZero > 0 && aleatorio() < nivel.chanceZero) {
    const candidatas = ['d', 'u'].filter((c) => nivel.casas.includes(c));
    if (candidatas.length) qt[candidatas[Math.floor(aleatorio() * candidatas.length)]] = 0;
  }
  return qt;
}

/** O número formado pelas quantidades, só com as casas do nível. */
export function valorDe(qt, casas = CASAS) {
  return casas.reduce((soma, casa) => soma + (qt[casa] ?? 0) * VALOR[casa], 0);
}

/**
 * As três opções do Fácil (só dezena e unidade), embaralhadas.
 *
 * As erradas são os erros que o jogo quer corrigir, nesta ordem de
 * preferência: os algarismos TROCADOS (35 → 53) e a SOMA dos grãos (3 + 5 = 8,
 * quem conta tudo junto sem separar as casas). Só quando essas não servem
 * (repetidas ou iguais à certa) entram vizinhos de dez em dez ou de um em um.
 */
export function opcoesFacil(qt, aleatorio = Math.random) {
  const certo = 10 * qt.d + qt.u;
  const opcoes = [certo];
  const candidatas = [10 * qt.u + qt.d, qt.d + qt.u, certo + 10, certo - 10, certo + 1, certo - 1];
  for (const v of candidatas) {
    if (opcoes.length === 3) break;
    if (v >= 0 && v <= 99 && !opcoes.includes(v)) opcoes.push(v);
  }
  for (let i = opcoes.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [opcoes[i], opcoes[j]] = [opcoes[j], opcoes[i]];
  }
  return opcoes;
}

/**
 * Onde os grãos de cada casa param, em raios.
 *
 * Nenhum grão cai na linha entre fatias (folga angular) nem em cima da letra.
 * O espalhamento é por "melhor candidato": para cada grão sorteiam-se vários
 * pontos e fica o mais longe dos grãos já postos (e da letra). Com um limite
 * fixo de distância, 9 grãos numa fatia não cabiam e quase metade das jogadas
 * do Difícil saía com grãos encostados; assim a distância é sempre a maior que
 * o sorteio encontrou, e o prato continua com cara de punhado jogado.
 *
 * Dentro de cada casa os grãos vêm ORDENADOS pelo ângulo, de uma borda da
 * fatia à outra: é a ordem em que a contagem os acende, então a criança vê a
 * contagem andar pela fatia em vez de pular.
 *
 * @returns {{casa: string, k: number, x: number, y: number, giro: number}[]}
 */
export function posicionarGraos(qt, aleatorio = Math.random) {
  const graos = [];
  for (const casa of CASAS) {
    const n = qt[casa] ?? 0;
    const [ini, fim] = SETOR[casa];
    const meio = rad((ini + fim) / 2);
    const letra = { x: RAIO_LETRA * Math.cos(meio), y: RAIO_LETRA * Math.sin(meio) };
    const pontos = [];
    while (pontos.length < n) {
      let melhor = null;
      let folgaMelhor = -Infinity;
      for (let c = 0; c < CANDIDATOS; c++) {
        const ang = rad(ini + FOLGA_ANGULO + aleatorio() * (fim - ini - 2 * FOLGA_ANGULO));
        const r = Math.sqrt(aleatorio() * (RAIO_MAX ** 2 - RAIO_MIN ** 2) + RAIO_MIN ** 2);
        const p = { x: r * Math.cos(ang), y: r * Math.sin(ang), ang: ang * (180 / Math.PI) };
        // A letra conta como um "grão" maior: a distância a ela desconta a folga extra.
        let folga = Math.hypot(p.x - letra.x, p.y - letra.y) - (FOLGA_LETRA - 0.12);
        // Os grãos das fatias vizinhas também contam: perto do centro, dois grãos
        // de casas diferentes ficariam colados um de cada lado da linha.
        for (const o of pontos) folga = Math.min(folga, Math.hypot(o.x - p.x, o.y - p.y));
        for (const o of graos) folga = Math.min(folga, Math.hypot(o.x - p.x, o.y - p.y));
        if (folga > folgaMelhor) { folgaMelhor = folga; melhor = p; }
      }
      pontos.push(melhor);
    }
    const desdeOInicio = (p) => (((p.ang - ini) % 360) + 360) % 360;
    pontos.sort((a, b) => desdeOInicio(a) - desdeOInicio(b));
    pontos.forEach((p, k) => graos.push({ casa, k, x: p.x, y: p.y, giro: aleatorio() * 180 }));
  }
  return graos;
}

/**
 * Grãos que caíram FORA do prato ("caiu fora não conta"), em volta da borda,
 * longe uns dos outros. `raioMin`/`raioMax` em raios do prato.
 */
export function posicionarFora(n, aleatorio = Math.random, raioMin = 1.2, raioMax = 1.36) {
  const fora = [];
  for (let tentativa = 0; fora.length < n && tentativa < 400; tentativa++) {
    const ang = aleatorio() * Math.PI * 2;
    const r = raioMin + aleatorio() * (raioMax - raioMin);
    const p = { x: r * Math.cos(ang), y: r * Math.sin(ang), giro: aleatorio() * 180 };
    if (fora.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < 0.4)) continue;
    fora.push(p);
  }
  return fora;
}

/** Uma jogada inteira: quantidades, grãos no prato e grãos fora. */
export function sortearJogada(nivel, aleatorio = Math.random) {
  const qt = sortearQuantidades(nivel, aleatorio);
  const [foraMin, foraMax] = nivel.fora ?? [0, 0];
  const nFora = foraMax > 0 ? sortear(foraMin, foraMax, aleatorio) : 0;
  return {
    qt,
    valor: valorDe(qt, nivel.casas),
    graos: posicionarGraos(qt, aleatorio),
    fora: posicionarFora(nFora, aleatorio),
  };
}

/** As casas em que os rolinhos não batem com as quantidades. */
export function casasErradas(digitos, qt, casas = CASAS) {
  return casas.filter((casa) => (digitos[casa] ?? 0) !== (qt[casa] ?? 0));
}

/** Quem formou o maior número: 'v' (criança), 'c' (computador) ou 'empate'. */
export function quemFormouMaior(numeroCrianca, numeroComputador) {
  if (numeroCrianca === numeroComputador) return 'empate';
  return numeroCrianca > numeroComputador ? 'v' : 'c';
}

/** O sinal entre os dois números, na ordem criança ? computador. */
export function sinalEntre(numeroCrianca, numeroComputador) {
  if (numeroCrianca === numeroComputador) return '=';
  return numeroCrianca > numeroComputador ? '>' : '<';
}
