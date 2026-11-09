/**
 * desenho.js — o desenho do Cabo de Guerra, compartilhado pela partida e pelo tutorial.
 *
 * Funções puras de canvas (recebem `ctx` e coordenadas, não guardam estado), para que o tutorial —
 * que também é a AJUDA dentro da partida (regra RE-05) — mostre exatamente a mesma trilha, o mesmo nó,
 * o mesmo dado e a mesma carta que a criança vê na partida, sem importar a cena.
 *
 * Nada aqui pisca: o brilho da ponta que ganhou é estável, e a onda que se abre no toque acontece
 * uma vez só. O dado, o dedinho e a carta são os mesmos da Corrida Maluca (jogo irmão).
 */

/**
 * As cores: a tira branca de borda azul do vídeo, com a ponta vermelha da criança e a ponta de
 * madeira do computador (as duas são vermelhas no brinquedo; aqui ganham cores diferentes para a
 * criança saber de que lado está); o nó preto com o laço de corda.
 */
export const CORES = {
  tira: '#FFFFFF',
  borda: '#1F3FAE',
  casa: '#B9BEC8',
  pontaC: '#D8322F',
  pontaCBorda: '#8F1D1B',
  pontaP: '#D2AD72',
  pontaPBorda: '#8A6A36',
  /** A madeira escurecida, para texto e faixa da vez do computador (o bege não segura texto branco). */
  pontaPTexto: '#7A5626',
  centro: '#F0A29D',
  no: '#1B1B1F',
  corda: '#B3844A',
  cordaClara: '#ECDCC3',
  tinta: '#17203A',
  anel: '#FFD60A',
  dado: '#2F5BEA',
  dadoBase: '#1E3FB0',
  dadoContorno: '#BFD0FF',
  dadoPip: '#FFFFFF',
  /** A carta: papel creme com borda de madeira, como as cartas do vídeo. */
  carta: '#FFF7E8',
  cartaBorda: '#3A2A12',
  cartaTipo: '#7A5A22',
  ok: '#22C55E',
  okEscuro: '#15803D',
  okTexto: '#126B3C',
  erro: '#C2410C',
  erroTexto: '#9A3412',
  tintaClara: '#E7EBF2',
  tintaSuave: '#A9C0B6',
};

export const FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export function escrever(ctx, texto, x, y, tamanho, cor, alinhamento = 'center', peso = 800) {
  ctx.font = `${peso} ${tamanho}px ${FONTE}`;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x, y);
}

/** Quebra `texto` em linhas que caibam em `largura` com a fonte atual do `ctx`. */
export function quebrarLinhas(ctx, texto, largura) {
  const linhas = [];
  let atual = '';
  for (const palavra of texto.split(' ')) {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (atual && ctx.measureText(teste).width > largura) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = teste;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/** Escreve um parágrafo centrado em `x`, com a 1ª linha em `y`. Devolve quantas linhas usou. */
export function escreverParagrafo(ctx, texto, x, y, largura, tamanho, cor, entrelinha = 1.2, peso = 800) {
  ctx.font = `${peso} ${tamanho}px ${FONTE}`;
  const linhas = quebrarLinhas(ctx, texto, largura);
  linhas.forEach((l, i) => escrever(ctx, l, x, y + i * tamanho * entrelinha, tamanho, cor, 'center', peso));
  return linhas.length;
}

// ----------------------------------------------------------------------- a trilha

/**
 * A trilha: a tira branca de borda azul com `xs.length` bolinhas em fila. A primeira é a ponta da
 * criança (vermelha) e a última a do computador (de madeira); a do meio é o ponto de partida do nó
 * (rosada). A trilha é sempre igual, quem se mexe é o nó. `ganhou` ('crianca' | 'computador' | null)
 * acende a ponta de quem chegou, com um halo estável.
 *
 * @param {{x:number,y:number,l:number,a:number}} caixa  o retângulo da tira
 * @param {{xs:number[], y:number, raio:number}} trilha
 */
export function desenharTrilha(ctx, caixa, trilha, ganhou = null, escala = 1) {
  const { xs, y, raio } = trilha;
  const n = xs.length;
  const meio = (n - 1) / 2;
  ctx.save();
  ctx.fillStyle = CORES.tira;
  ctx.strokeStyle = CORES.borda;
  ctx.lineWidth = 10 * escala;
  ctx.beginPath();
  ctx.roundRect(caixa.x, caixa.y, caixa.l, caixa.a, 24 * escala);
  ctx.fill();
  ctx.stroke();

  xs.forEach((x, i) => {
    const ponta = i === 0 || i === n - 1;
    const dela = i === 0 ? 'crianca' : 'computador';
    if (ponta && ganhou === dela) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 214, 10, 0.55)';
      ctx.shadowColor = 'rgba(255, 214, 10, 0.95)';
      ctx.shadowBlur = raio * 0.9;
      ctx.beginPath();
      ctx.arc(x, y, raio * 1.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(x, y, ponta ? raio * 1.25 : raio, 0, Math.PI * 2);
    ctx.fillStyle = ponta ? (i === 0 ? CORES.pontaC : CORES.pontaP) : i === meio ? CORES.centro : CORES.casa;
    ctx.fill();
    if (ponta) {
      ctx.strokeStyle = i === 0 ? CORES.pontaCBorda : CORES.pontaPBorda;
      ctx.lineWidth = 4 * escala;
      ctx.stroke();
    }
  });
  ctx.restore();
}

/**
 * O nó da trilha, centrado em (x, y): um disco preto com o laço de corda em volta e um pequeno brilho.
 * `brilho` (0..1) é o halo estável do nó quando a vez é de quem o puxa.
 */
export function desenharNo(ctx, x, y, r, brilho = 0) {
  ctx.save();
  ctx.translate(x, y);
  if (brilho > 0) {
    ctx.save();
    ctx.globalAlpha *= brilho;
    ctx.fillStyle = 'rgba(255, 214, 10, 0.5)';
    ctx.shadowColor = 'rgba(255, 214, 10, 0.95)';
    ctx.shadowBlur = r * 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, r + 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(20, 25, 40, 0.28)';
  ctx.beginPath();
  ctx.ellipse(r * 0.06, r * 0.22, r * 1.1, r * 1.02, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = CORES.corda;
  ctx.lineWidth = r * 0.34;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = CORES.cordaClara;
  ctx.lineWidth = r * 0.1;
  ctx.setLineDash([r * 0.22, r * 0.26]);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = CORES.no;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.2, -r * 0.26, r * 0.22, r * 0.12, -0.44, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------------- dado

/** Posição dos pontos de uma face na grade 3×3 (coluna, linha em -1, 0, 1). */
const PONTOS = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/** O dado, com o canto de cima-esquerdo em (0, 0): azul com bolinhas brancas. `face` 0 desenha o "?". */
export function desenharDado(ctx, lado, face) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = lado * 0.14;
  ctx.shadowOffsetY = lado * 0.06;
  ctx.fillStyle = CORES.dadoBase;
  ctx.beginPath();
  ctx.roundRect(0, lado * 0.05, lado, lado, lado * 0.2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = CORES.dado;
  ctx.beginPath();
  ctx.roundRect(0, 0, lado, lado, lado * 0.2);
  ctx.fill();
  ctx.strokeStyle = CORES.dadoContorno;
  ctx.lineWidth = Math.max(2, lado * 0.035);
  ctx.stroke();
  if (face > 0) {
    const pad = lado * 0.17;
    const passo = (lado - pad * 2) / 2;
    ctx.fillStyle = CORES.dadoPip;
    for (const [c, l] of PONTOS[face] ?? []) {
      ctx.beginPath();
      ctx.arc(lado / 2 + c * passo, lado / 2 + l * passo, lado * 0.078, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    escrever(ctx, '?', lado / 2, lado * 0.54, lado * 0.52, 'rgba(255, 255, 255, 0.82)');
  }
  ctx.restore();
}

/** O selo com a contagem das casas sobre o nó que anda: um círculo claro com o número. */
export function desenharContagem(ctx, x, y, n, escala = 1) {
  if (!n || escala <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(escala, escala);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = CORES.borda;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  escrever(ctx, String(n), 0, 2, 32, CORES.tinta);
  ctx.restore();
}

// ------------------------------------------------------------- o gesto do toque

/** O dedinho branco da coleção (o mesmo da Corrida Espacial, do Subtraindo o Dominó e da Corrida Maluca). */
export function desenharDedo(ctx, cx, yPonta, h, alfa = 1) {
  const partes = [
    [-0.12, -0.6, 0.24, 0.6, 0.12],
    [-0.16, -0.94, 0.62, 0.42, 0.13],
    [-0.3, -0.86, 0.22, 0.3, 0.1],
    [-0.06, -1.12, 0.46, 0.2, 0.05],
  ];
  const tracar = () => {
    ctx.beginPath();
    for (const [x, y, l, a, r] of partes) ctx.roundRect(cx + x * h, yPonta + y * h, l * h, a * h, r * h);
  };
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  tracar();
  ctx.lineWidth = Math.max(3, h * 0.1);
  ctx.strokeStyle = 'rgba(31, 41, 55, 0.9)';
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  tracar();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();
}

export function desenharOndaToque(ctx, x, y, raio, d, cor = '255, 255, 255') {
  if (d <= 0 || d >= 1) return;
  ctx.save();
  ctx.strokeStyle = `rgba(${cor}, ${1 - d})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, raio * (0.4 + d * 0.9), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------ carta

/**
 * A carta, com o canto de cima-esquerdo em (0, 0): papel creme com borda de madeira e, no alto, a
 * faixa em roleta colorida do verso das cartas do vídeo. Só o cartão; o conteúdo é de quem chama.
 */
export function desenharCartao(ctx, l, a) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = CORES.carta;
  ctx.beginPath();
  ctx.roundRect(0, 0, l, a, 28);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.save();
  ctx.clip();
  const faixa = ['#EF4444', '#F59E0B', '#FACC15', '#22C55E', '#06B6D4', '#3B82F6', '#A855F7'];
  const w = l / faixa.length;
  faixa.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * w, 0, w + 1, 18);
  });
  ctx.restore();
  ctx.strokeStyle = CORES.cartaBorda;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(0, 0, l, a, 28);
  ctx.stroke();
  ctx.restore();
}
