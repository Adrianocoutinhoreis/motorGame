/**
 * config.js — o "formulário" do jogo Quebra-Cabeça Geométrico.
 *
 * Leia junto: docs/CRIAR-JOGO.md, docs/CONTRATO-AVA.md e
 * docs/METODO-JOGOS-NUMERANDUS.md.
 */

/**
 * Cor real de cada número, transcrita das 7 peças do brinquedo físico
 * (fotografadas limpas, sem mão na frente — ver README "Assets"). 6 e 9 são
 * o MESMO triângulo impresso: aparece de cabeça para baixo em certas peças e
 * lê como 9, mas a cor (vermelho) é sempre a mesma — por isso os dois
 * números apontam pra cor 6 aqui.
 */
const CORES_POR_NUMERO = {
  1: '#2E8B7C', 2: '#D959A8', 3: '#4A3FA6', 4: '#E8B93B', 5: '#C2A878', 6: '#C1364B', 9: '#C1364B',
};

/**
 * Desenha um hexágono de 6 triângulos numerados — a MESMA geometria da peça
 * de verdade (`GameScene.js`, `Hexagono`), só que aqui é uma função solta
 * porque o tutorial não tem acesso às classes da cena. `numeros` é um array
 * de 6, na ordem [topo, cima-direita, baixo-direita, base, baixo-esquerda,
 * cima-esquerda] — a mesma ordem usada na partida de verdade.
 */
function desenharHexagono(ctx, cx, cy, raio, numeros, mostrarNumeros = true) {
  for (let k = 0; k < 6; k++) {
    const a0 = ((-120 + 60 * k) * Math.PI) / 180;
    const a1 = ((-120 + 60 * (k + 1)) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + raio * Math.cos(a0), cy + raio * Math.sin(a0));
    ctx.lineTo(cx + raio * Math.cos(a1), cy + raio * Math.sin(a1));
    ctx.closePath();
    ctx.fillStyle = CORES_POR_NUMERO[numeros[k]] ?? '#8B87A3';
    ctx.fill();
    ctx.strokeStyle = '#241F38';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  if (mostrarNumeros) {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${Math.round(raio * 0.34)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let k = 0; k < 6; k++) {
      const mid = ((-120 + 60 * k + 30) * Math.PI) / 180;
      ctx.fillText(
        String(numeros[k]),
        cx + raio * 0.62 * Math.cos(mid),
        cy + raio * 0.62 * Math.sin(mid),
      );
    }
  }
}

/** Contorno pontilhado de um hexágono — o "lugar vazio" que a peça procura. */
function desenharContornoPontilhado(ctx, cx, cy, raio, cor = '#B9AEDD') {
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 7]);
  ctx.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = ((-120 + 60 * k) * Math.PI) / 180;
    const px = cx + raio * Math.cos(a);
    const py = cy + raio * Math.sin(a);
    if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

/** A peça central, fixa — números REAIS, confirmados numa foto limpa do brinquedo. */
const NUMEROS_CENTRAL = [6, 1, 3, 2, 6, 1];
/** A peça que fica ao lado da central no tutorial (mesmos dados do nível "cima-direita"). */
const NUMEROS_VIZINHA = [3, 4, 3, 2, 1, 3];

export default {
  // ------------------------------------------------------------- identidade
  slug: 'quebra-cabeca-geometrico',
  // Nome oficial exibido em caixa alta em todas as telas e catálogos.
  titulo: 'QUEBRA CABEÇA GEOMÉTRICO',
  subtitulo: 'Gire e encaixe os números iguais!',

  objetivo: 'Praticar a comparação de números (reconhecer iguais) e a orientação espacial, girando e arrastando peças reais de um quebra-cabeça geométrico até o número do lado que se toca ficar igual ao da peça vizinha.',
  faixaEtaria: '7 a 9 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  larguraPlacaTitulo: 980,
  corLetterbox: '#0B1220',
  textoEmCaixaAlta: true,

  // ---------------------------------------------------------------- tema
  // Reaproveita a estrutura do tema 'quarto' (sem sol, sem nuvens, sem
  // colinas) com cores próprias — roxo profundo, pra combinar com as cores
  // bem saturadas das peças (vermelho, azul, rosa, amarelo) sem competir com
  // elas. Mesmo padrão do Dino/Encaixe Certo: só cor nova, sem tema novo no motor.
  tema: 'quarto',
  corCeuTopo: '#171331',
  corCeuBase: '#2B2050',
  mostrarDecoracoes: false,

  // ----------------------------------------------------------------- níveis
  // As 7 peças (a central + 6 ao redor) são SEMPRE as mesmas — cortar peças
  // por nível quebraria a única montagem correta que o brinquedo físico tem.
  // A dificuldade cresce em vários eixos que não mudam o conteúdo:
  //   `rotacaoAleatoria` — as peças da bandeja já chegam na rotação CERTA
  //     (falso) ou embaralhada, exigindo girar antes de soltar (verdadeiro);
  //   `tolerancia` — multiplicador do raio de encaixe (1 = padrão; >1 mais
  //     generoso, <1 exige soltar mais perto do lugar certo);
  //   `destacarSlotCorreto`/`errosParaDica` — só no Fácil: depois de errar a
  //     mesma peça `errosParaDica` vezes, o lugar certo pisca verde;
  //   `contornosDiscretos` — só no Difícil: os contornos vazios ficam quase
  //     apagados, só o mais próximo do arrasto acende (não indica se é o
  //     lugar CERTO, só o mais perto);
  //   `validarVizinhos` — só no Difícil: o encaixe também precisa bater com
  //     qualquer peça vizinha JÁ colocada, não só com a central (por isso o
  //     nome "Compare as vizinhas").
  // Ver `GameScene._raioTolerancia`/`_validarEncaixe`.
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Já vem alinhada', amostra: '⬡', cor: '#22C55E',
      meta: 6, rotacaoAleatoria: false, tolerancia: 1.2,
      destacarSlotCorreto: true, errosParaDica: 3,
      contornosDiscretos: false, validarVizinhos: false,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Gire e encaixe', amostra: '⬡⬡', cor: '#F59E0B',
      meta: 6, rotacaoAleatoria: true, tolerancia: 1.0,
      destacarSlotCorreto: false, contornosDiscretos: false, validarVizinhos: false,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Compare as vizinhas', amostra: '⬡⬡⬡', cor: '#DC2626',
      meta: 6, rotacaoAleatoria: true, tolerancia: 0.82,
      destacarSlotCorreto: false, contornosDiscretos: true, validarVizinhos: true,
    },
  ],

  // --------------------------------------------------------------- tutorial
  // As 3 ilustrações desenham as peças DE VERDADE (mesma função/geometria da
  // partida, `desenharHexagono` acima) — pedido do humano, depois de ver a
  // primeira versão do Dino com formas genéricas.
  tutorial: [
    {
      titulo: 'Essas são as peças',
      texto: 'Cada triângulo da peça tem um número. Vamos usar os números pra descobrir onde cada peça encaixa.',
      fala: 'tutorialTela1',
      desenho: (ctx, l, a) => {
        const cy = a / 2;
        const raio = 130;
        desenharHexagono(ctx, l / 2 - raio * 0.95, cy, raio, NUMEROS_CENTRAL);
        desenharHexagono(ctx, l / 2 + raio * 0.95, cy, raio, NUMEROS_VIZINHA);
      },
    },
    {
      titulo: 'Gire até o número bater',
      texto: 'Toque no botão de girar até o número da peça combinar com o da vizinha. Depois arraste até o contorno pontilhado.',
      fala: 'tutorialTela2',
      desenho: (ctx, l, a, t) => {
        const cy = a / 2;
        const raio = 120;
        const alvoX = l / 2 + 150;
        desenharContornoPontilhado(ctx, alvoX, cy, raio);

        // Gira e desliza até o contorno, pausa, e recomeça — mesma ideia do
        // "arrasta e solta" do tutorial do Dino, agora com uma etapa de girar
        // antes (a mecânica nova deste jogo).
        const ciclo = 3.6;
        const f = (t % ciclo) / ciclo;
        const anda = Math.max(0, Math.min(1, (f - 0.35) / 0.5));
        const x = (l / 2 - 190) + (alvoX - (l / 2 - 190)) * anda;
        const giroGraus = Math.min(1, f / 0.32) * 240;

        ctx.save();
        ctx.translate(x, cy);
        ctx.rotate((giroGraus * Math.PI) / 180);
        desenharHexagono(ctx, 0, 0, raio, NUMEROS_VIZINHA);
        ctx.restore();
      },
    },
    {
      titulo: 'Complete a flor',
      texto: 'Se uma peça não encaixar, ela volta para você tentar novamente. Complete a flor colocando as 6 peças ao redor da central.',
      fala: 'tutorialTela3',
      desenho: (ctx, l, a, t) => {
        const cx = l / 2;
        const cy = a / 2 + 8;
        // Menor que a montagem real para ficar inteiramente dentro do card.
        // Sem números: mostra apenas o objetivo visual, não a solução.
        const raio = 42;
        const dist = raio * Math.sqrt(3); // encosta aresta com aresta, sem fresta — ver GameScene.js
        desenharHexagono(ctx, cx, cy, raio, NUMEROS_CENTRAL, false);
        // Pulsa entre "só a central" e "central + peças ao redor" — mostra a
        // própria recompensa (o desenho quase pronto), não um enfeite à parte.
        const pulso = (Math.sin(t * 1.1) + 1) / 2;
        ctx.save();
        ctx.globalAlpha = pulso;
        for (let k = 0; k < 6; k++) {
          const ang = ((-90 + 60 * k) * Math.PI) / 180;
          desenharHexagono(
            ctx,
            cx + dist * Math.cos(ang),
            cy + dist * Math.sin(ang),
            raio,
            NUMEROS_VIZINHA,
            false,
          );
        }
        ctx.restore();
      },
    },
  ],

  // ------------------------------------------------------------------ áudio
  assets: [
    // `acertoSOS` é o MESMO som de vitória de toda a coleção Numerandus
    // (Bingo, Jogo da Velha, Jogo da Ordenação, Encaixe Certo, Jogo da
    // Memória, Material Dourado, Quebra-Cabeça Dino) — sem fala.
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    // `soltarPeca` é o MESMO som de encaixe do Material Dourado/Dino — marca
    // o ENCAIXE bem-sucedido (peça no lugar certo E número certo).
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'tutorialTela1', src: './assets/audio/tutorial/tela1.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tutorial/tela2.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tutorial/tela3.wav' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
  ],

  /**
   * Sem mascote em nenhuma tela — padrão de toda a coleção Numerandus.
   * `mascote: null` NÃO desliga a coruja (o motor cai no padrão vetorial);
   * `telas: []` é o jeito de tirá-la de toda tela.
   */
  mascote: { telas: [] },

  /** Efeito de girar/erro ainda não gravado — ver CHECKLIST.md/README.md. */
  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca',
    progresso: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Sem derrota — quebra-cabeça solo, mesmo padrão do Dino/Jogo da Ordenação/Encaixe Certo. */
  registrarDerrota: false,

  /** Tela de resultado: "6 PEÇAS", não "6 acertos". */
  unidadePlacar: { singular: 'peça', plural: 'peças' },
  mostrarTempo: true,
};
