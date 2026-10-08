/**
 * config.js — o "formulário" do jogo Caminho das Cores.
 *
 * Baseado no vídeo do brinquedo físico (`assets/`, material de referência,
 * fora do pacote): uma prancha com as peças soltas num monte em cima, uma
 * ripa com uma abertura à esquerda, um corredor e 5 trilhas; um cartão de
 * papel mostra o que vai em cada trilha, de baixo pra cima. As peças são
 * 5 cores × 4 formas, cada combinação uma vez só, sem peça sobrando.
 *
 * A criança toca na peça e depois na trilha (no Fácil, também pode
 * arrastar) e a peça percorre o caminho sozinha: sai pela abertura, corre o
 * corredor e desce até o fundo. Nada é validado no encaixe; CONFIRMAR acende
 * com as 5 trilhas cheias e compara tudo com o cartão. Ver a doc da classe
 * em `scenes/GameScene.js` pra ajuda em degraus depois de um erro.
 *
 * Sem mascote (decisão do humano para este jogo).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'caminho-das-cores',
  titulo: 'Caminho das Cores',
  subtitulo: 'Copie o cartão nas trilhas',

  objetivo: 'Comparar formato e cor com um cartão de referência e reproduzir a mesma '
    + 'sequência de peças em cada trilha, respeitando a ordem.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  // Decidido UMA VEZ, no carregamento (o motor só lê `largura`/`altura` ao
  // criar o `Stage`). Tela deitada (computador): paisagem, cartão AO LADO do
  // tabuleiro. Tela em pé (celular): retrato, cartão EM CIMA. O tabuleiro é
  // sempre vertical, como o brinquedo.
  ...(typeof window !== 'undefined' && window.innerWidth > window.innerHeight * 1.05
    ? { largura: 1280, altura: 800 }
    : { largura: 720, altura: 1280 }),
  corLetterbox: '#241A33',

  tema: 'quarto',
  corCeuTopo: '#2E2150',
  corCeuBase: '#2E2150',
  mostrarDecoracoes: false,
  mostrarChao: false,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * `trilhas` é sempre 5 (a prancha física). A dificuldade segue os cartões
   * do brinquedo:
   *   - `cartela: 'monocor'` — uma cor por trilha; o desafio é a ORDEM das
   *     formas (o cartão usado no vídeo);
   *   - `cartela: 'misturada'` — cores espalhadas pelas colunas; é preciso
   *     olhar cor e forma ao mesmo tempo (os outros cartões do vídeo).
   * `profundidade` é quantas peças cada trilha recebe (2 = 10 peças no
   * monte, 4 = as 20 do brinquedo). `meta` é quantos cartões o nível pede.
 * `arrastar: true` libera, além do toque, arrastar a peça até a trilha — só
 * no Fácil; nos outros níveis um arrasto só escolhe a peça.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Uma cor por trilha', amostra: '2 peças por trilha', cor: '#16A34A',
      meta: 3, trilhas: 5, profundidade: 2, cartela: 'monocor', arrastar: true,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Uma cor por trilha', amostra: '4 peças por trilha', cor: '#F59E0B',
      meta: 3, trilhas: 5, profundidade: 4, cartela: 'monocor',
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Cores misturadas', amostra: '4 peças por trilha', cor: '#DC2626',
      meta: 3, trilhas: 5, profundidade: 4, cartela: 'misturada',
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). Narração pendente: quando os áudios existirem, cada passo
   * ganha `fala: '<id do asset>'`.
   */
  tutorial: [
    {
      titulo: 'Olhe o cartão',
      texto: 'Cada coluna do cartão é uma trilha. Ela mostra a cor e a forma de cada peça, de baixo para cima.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 1, t }),
    },
    {
      titulo: 'Toque na peça e na trilha',
      texto: 'Toque na peça que você quer e depois na trilha. A peça passa pela abertura e desce sozinha.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Toque em CONFIRMAR',
      texto: 'Com as trilhas cheias, toque em CONFIRMAR. Se uma peça estiver fora do lugar, ela pisca para você trocar.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 3, t }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * `soltarPeca` toca quando a peça chega ao fundo da trilha; `somErro` no
   * CONFIRMAR errado; `acertoSOS` a cada cartão certo.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
  ],

  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Sem vidas, sem derrota — errar ao confirmar só demora mais. */
  registrarDerrota: false,

  /** RE-03: o placar conta CARTÕES completos. */
  unidadePlacar: { singular: 'cartão', plural: 'cartões' },

  mostrarTempo: true,
  /** Cronômetro CRESCENTE no HUD, como o do celular no vídeo. Só informativo. */
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — cópia pequena e independente das formas da cena.
// ---------------------------------------------------------------------------

function tracarFormaTutorial(ctx, forma, tam) {
  const m = tam / 2;
  ctx.beginPath();
  switch (forma) {
    case 'circulo':
      ctx.arc(0, 0, m * 0.92, 0, Math.PI * 2);
      break;
    case 'quadrado':
      ctx.roundRect(-m * 0.88, -m * 0.88, m * 1.76, m * 1.76, tam * 0.1);
      break;
    case 'triangulo':
      ctx.moveTo(0, -m * 0.92);
      ctx.lineTo(m * 0.94, m * 0.84);
      ctx.lineTo(-m * 0.94, m * 0.84);
      ctx.closePath();
      break;
    default: {
      const raio = m * 0.96;
      for (let i = 0; i < 5; i++) {
        const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
        const x = raio * Math.cos(ang);
        const y = m * 0.08 + raio * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
  }
}

function peca(ctx, forma, cor, tam, x, y) {
  ctx.save();
  ctx.translate(x, y);
  tracarFormaTutorial(ctx, forma, tam);
  ctx.fillStyle = cor;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.stroke();
  ctx.restore();
}

const VERMELHO = '#EF4444';
const AZUL = '#3B82F6';
const AMARELO = '#FACC15';
const COLUNA_A = [{ forma: 'quadrado', cor: VERMELHO }, { forma: 'circulo', cor: VERMELHO }, { forma: 'triangulo', cor: VERMELHO }];
const COLUNA_B = [{ forma: 'triangulo', cor: AZUL }, { forma: 'pentagono', cor: AZUL }, { forma: 'quadrado', cor: AZUL }];

/** Mini prancha: monte em cima, ripa com abertura à esquerda, 2 trilhas. */
function miniPrancha(ctx, x, y, l, a) {
  ctx.fillStyle = '#F4EFE6';
  ctx.beginPath();
  ctx.roundRect(x, y, l, a, 8);
  ctx.fill();
  ctx.fillStyle = '#C8A27A';
  ctx.fillRect(x + 8, y + 8, l - 16, a - 16);
  const ripaY = y + a * 0.34;
  const colL = (l - 16 - 8) / 2;
  ctx.fillStyle = '#F4EFE6';
  ctx.fillRect(x + 8 + colL, ripaY, l - 16 - colL, 8);
  ctx.fillRect(x + 8 + colL, y + a * 0.5, 8, a * 0.5 - 8);
  ctx.save();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = '#E0AB1B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 10, ripaY + 4);
  ctx.lineTo(x + 6 + colL, ripaY + 4);
  ctx.stroke();
  ctx.restore();
  return {
    ripaY, colL, trilha0Cx: x + 8 + colL / 2, trilha1Cx: x + 16 + colL * 1.5, corredorCy: y + a * 0.42, trilhasTopo: y + a * 0.5, fundo: y + a - 8,
  };
}

function desenharCenaTutorial(ctx, l, a, opcoes = {}) {
  const { passo, t = 0 } = opcoes;
  ctx.save();
  const tam = Math.min(46, a * 0.13);

  if (passo === 1) {
    // Cartão à esquerda, trilha à direita; a coluna 1 do cartão "vira" a
    // trilha 1 — as peças aparecem uma a uma, de baixo pra cima.
    const cx = l * 0.3;
    const altura = 3 * tam + 2 * 10 + 24;
    const y0 = a / 2 - altura / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - tam / 2 - 12, y0, tam + 24, altura, 8);
    ctx.fill();
    ctx.stroke();
    COLUNA_A.forEach((cel, i) => peca(ctx, cel.forma, cel.cor, tam, cx, y0 + altura - 12 - tam / 2 - i * (tam + 10)));

    const tx = l * 0.68;
    ctx.fillStyle = '#C8A27A';
    ctx.beginPath();
    ctx.roundRect(tx - tam / 2 - 12, y0, tam + 24, altura, 8);
    ctx.fill();
    const mostradas = Math.min(3, Math.floor((t % 3.2) / 0.8));
    COLUNA_A.slice(0, mostradas).forEach((cel, i) => peca(ctx, cel.forma, cel.cor, tam, tx, y0 + altura - 12 - tam / 2 - i * (tam + 10)));

    ctx.fillStyle = 'rgba(31,41,55,0.7)';
    ctx.font = '800 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1', cx, y0 + altura + 26);
    ctx.fillText('1', tx, y0 + altura + 26);
    ctx.strokeStyle = 'rgba(90, 90, 120, 0.6)';
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(cx + tam / 2 + 22, a / 2);
    ctx.lineTo(tx - tam / 2 - 22, a / 2);
    ctx.stroke();
  } else if (passo === 2) {
    // Dois toques: na peça (ela brilha), depois na trilha 2 (ela acende) — e
    // a peça faz o caminho sozinha: abertura, corredor, fundo da trilha.
    const pl = Math.min(l * 0.6, 300);
    const pa = a * 0.86;
    const px = (l - pl) / 2;
    const py = (a - pa) / 2;
    const p = miniPrancha(ctx, px, py, pl, pa);
    peca(ctx, 'circulo', AMARELO, tam * 0.9, px + pl * 0.62, py + pa * 0.17);
    peca(ctx, 'quadrado', VERMELHO, tam * 0.9, px + pl * 0.82, py + pa * 0.2);

    const pontos = [
      { x: px + pl * 0.42, y: py + pa * 0.18 },
      { x: p.trilha0Cx, y: p.ripaY - 4 },
      { x: p.trilha0Cx, y: p.corredorCy + 8 },
      { x: p.trilha1Cx, y: p.corredorCy + 8 },
      { x: p.trilha1Cx, y: p.fundo - tam * 0.6 },
    ];
    const ciclo = 4.4;
    const tc = ((t % ciclo) + ciclo) % ciclo;
    const alvoTrilha = { x: p.trilha1Cx, y: p.trilhasTopo + (p.fundo - p.trilhasTopo) * 0.35 };

    // Fases: 0-1s toque na peça; 1-2s toque na trilha; 2-3.8s caminho; resto parada.
    const escolhida = tc >= 0.45 && tc < 2;
    const fCaminho = Math.max(0, Math.min(1, (tc - 2) / 1.8));
    const seg = fCaminho * (pontos.length - 1);
    const i = Math.min(pontos.length - 2, Math.floor(seg));
    const k = seg - i;
    const x = pontos[i].x + (pontos[i + 1].x - pontos[i].x) * k;
    const y = pontos[i].y + (pontos[i + 1].y - pontos[i].y) * k;

    if (tc >= 1 && tc < 2.2) {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
      ctx.fillRect(p.trilha1Cx - p.colL / 2, p.trilhasTopo, p.colL, p.fundo - p.trilhasTopo);
    }
    if (fCaminho > 0) {
      ctx.strokeStyle = 'rgba(224, 171, 27, 0.8)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      pontos.forEach((pt, j) => (j === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (escolhida) {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.55)';
      ctx.beginPath();
      ctx.arc(x, y, tam * 0.68, 0, Math.PI * 2);
      ctx.fill();
    }
    peca(ctx, 'triangulo', AZUL, tam, x, y - (escolhida ? Math.abs(Math.sin(t * 5)) * tam * 0.1 : 0));

    // O "dedo": um círculo que encolhe no ponto tocado, com uma onda saindo.
    const toque = (cx, cy, inicio) => {
      const d = tc - inicio;
      if (d < 0 || d > 0.8) return;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - d / 0.8})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, tam * (0.3 + d * 0.6), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(31, 41, 55, 0.55)';
      ctx.beginPath();
      ctx.arc(cx, cy, tam * (d < 0.3 ? 0.32 - d * 0.2 : 0.26), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    toque(pontos[0].x, pontos[0].y, 0.2);
    toque(alvoTrilha.x, alvoTrilha.y, 1.1);
  } else {
    // Duas trilhas cheias, uma peça fora do lugar piscando, e o CONFIRMAR.
    const pl = Math.min(l * 0.5, 240);
    const pa = a * 0.62;
    const px = (l - pl) / 2;
    const py = a * 0.04;
    const p = miniPrancha(ctx, px, py, pl, pa);
    // As 3 peças precisam caber entre o topo e o fundo da trilha.
    const passoY = (p.fundo - p.trilhasTopo) / 3;
    const tamPeca = Math.min(tam * 0.85, passoY * 0.88);
    COLUNA_A.forEach((cel, i) => peca(ctx, cel.forma, cel.cor, tamPeca, p.trilha0Cx, p.fundo - passoY / 2 - i * passoY));
    const colB = [COLUNA_B[0], COLUNA_B[2], COLUNA_B[1]];
    colB.forEach((cel, i) => {
      const y = p.fundo - passoY / 2 - i * passoY;
      peca(ctx, cel.forma, cel.cor, tamPeca, p.trilha1Cx, y);
      if (i > 0) {
        const pulso = 0.5 + 0.5 * Math.sin(t * 4);
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.5 + pulso * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.trilha1Cx, y, tamPeca * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    const lb = 190;
    const ab = 52;
    const xb = l / 2 - lb / 2;
    const yb = py + pa + 18;
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.roundRect(xb, yb, lb, ab, ab / 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CONFIRMAR', l / 2, yb + ab / 2 + 1);
  }

  ctx.restore();
}
