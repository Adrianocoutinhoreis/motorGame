/**
 * desenho.js — o desenho da Corrida Maluca, compartilhado pela partida e pelo
 * tutorial.
 *
 * Funções puras de canvas (recebem `ctx` e coordenadas, não guardam estado),
 * para que o tutorial — que também é a AJUDA dentro da partida (regra RE-05) —
 * mostre exatamente o mesmo tabuleiro, as mesmas fichas e o mesmo dado que a
 * criança vê na partida, sem importar a cena.
 *
 * Nada aqui pisca: o anel da casa verde e o brilho da ficha da vez são
 * estáveis, e a onda que se abre no toque acontece uma vez só.
 */

/**
 * As cores: o tabuleiro branco de borda azul do vídeo; as fichas do vídeo, vermelha (a criança) e
 * de madeira (o computador); o dado azul de bolinhas brancas da coleção (o mesmo do Subtraindo o
 * Dominó), que se destaca do tabuleiro branco e do fundo escuro.
 */
export const CORES = {
  tabuleiro: '#FFFFFF',
  borda: '#1F3FAE',
  trilha: '#E6EAF2',
  casa: '#B9BEC8',
  verde: '#1F9A55',
  saida: '#161B2B',
  entrada: '#FFFFFF',
  tinta: '#17203A',
  anel: '#FFD60A',
  fichaC: '#D8322F',
  fichaCBorda: '#8F1D1B',
  fichaP: '#D2AD72',
  fichaPBorda: '#8A6A36',
  /** A madeira escurecida, para texto e faixa da vez do computador (o bege não segura texto branco). */
  fichaPTexto: '#7A5626',
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
  tintaSuave: '#9AA8BA',
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

// --------------------------------------------------------------------- tabuleiro

/**
 * O tabuleiro: o retângulo branco de borda azul, o caminho por trás das casas, as casas (a ENTRADA
 * tracejada, as verdes, a SAÍDA preta com o quadriculado) e os rótulos ENTRADA e SAÍDA.
 *
 * @param {{x:number,y:number,l:number,a:number}} caixa  o retângulo do tabuleiro
 * @param {{casas:number[][], verdes:number[], saida:number, raio:number}} trilha
 * @param {number[][]} rota  o caminho de fundo (a serpentina inteira)
 * @param {number} [escala]  para o tutorial, que desenha o tabuleiro em miniatura
 */
export function desenharTabuleiro(ctx, caixa, trilha, rota, escala = 1) {
  const { casas, verdes, saida, raio } = trilha;
  ctx.save();
  ctx.fillStyle = CORES.tabuleiro;
  ctx.strokeStyle = CORES.borda;
  ctx.lineWidth = 12 * escala;
  ctx.beginPath();
  ctx.roundRect(caixa.x, caixa.y, caixa.l, caixa.a, 22 * escala);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = CORES.trilha;
  ctx.lineWidth = 26 * escala;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  rota.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();

  casas.forEach(([x, y], i) => {
    ctx.beginPath();
    ctx.arc(x, y, raio, 0, Math.PI * 2);
    if (i === 0) {
      ctx.fillStyle = CORES.entrada;
      ctx.fill();
      ctx.setLineDash([8 * escala, 6 * escala]);
      ctx.lineWidth = 4 * escala;
      ctx.strokeStyle = CORES.borda;
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    ctx.fillStyle = i === saida ? CORES.saida : verdes.includes(i) ? CORES.verde : CORES.casa;
    ctx.fill();
    if (i === saida) {
      // O quadriculado de chegada.
      const q = raio * 0.3;
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = k === 0 || k === 3 ? '#FFFFFF' : CORES.saida;
        ctx.fillRect(x - q + (k % 2) * q, y - q + Math.floor(k / 2) * q, q, q);
      }
    }
  });
  ctx.restore();
}

/** O anel amarelo, estável, da casa verde de onde sai a jogada extra. */
export function desenharAnel(ctx, x, y, raio, alfa = 1) {
  if (alfa <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alfa;
  ctx.strokeStyle = CORES.anel;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(x, y, raio + 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Uma ficha redonda do vídeo, centrada em (0, 0): um disco grosso com a borda mais escura, um anel
 * claro e um brilho em cima. `quem` 'crianca' é a vermelha, 'computador' a de madeira.
 * `brilho` (0..1) é o halo estável da ficha da vez.
 */
export function desenharFicha(ctx, quem, r = 26, brilho = 0) {
  const cor = quem === 'crianca' ? CORES.fichaC : CORES.fichaP;
  const borda = quem === 'crianca' ? CORES.fichaCBorda : CORES.fichaPBorda;
  ctx.save();
  if (brilho > 0) {
    ctx.save();
    ctx.globalAlpha *= brilho;
    ctx.shadowColor = 'rgba(255, 214, 10, 0.95)';
    ctx.shadowBlur = r * 0.7;
    ctx.fillStyle = 'rgba(255, 214, 10, 0.55)';
    ctx.beginPath();
    ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(20, 25, 40, 0.28)';
  ctx.beginPath();
  ctx.ellipse(r * 0.08, r * 0.27, r * 1.04, r * 0.96, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = borda;
  ctx.beginPath();
  ctx.arc(0, r * 0.12, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = cor;
  ctx.strokeStyle = borda;
  ctx.lineWidth = r * 0.1;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = r * 0.08;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.69, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.31, -r * 0.38, r * 0.38, r * 0.21, -0.44, 0, Math.PI * 2);
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

/**
 * O dado, com o canto de cima-esquerdo em (0, 0): azul com bolinhas brancas e um contorno claro (o
 * mesmo do Subtraindo o Dominó). `face` 0 desenha o "?" de antes de jogar.
 */
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

/** O selo com a contagem dos passos sobre a ficha que anda: um círculo claro com o número. */
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

/** O dedinho branco da coleção (o mesmo da Corrida Espacial e do Subtraindo o Dominó). */
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
    ctx.fillRect(i * w, 0, w + 1, 22);
  });
  ctx.restore();
  ctx.strokeStyle = CORES.cartaBorda;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(0, 0, l, a, 28);
  ctx.stroke();
  ctx.restore();
}
