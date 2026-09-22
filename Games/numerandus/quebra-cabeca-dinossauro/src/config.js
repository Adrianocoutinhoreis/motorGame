/**
 * config.js — o "formulário" do jogo Quebra-Cabeça Dinossauro.
 *
 * Leia junto: docs/CRIAR-JOGO.md, docs/CONTRATO-AVA.md e
 * docs/METODO-JOGOS-NUMERANDUS.md.
 */

/** As 26 peças reais do brinquedo físico, redesenhadas — ver README ("Assets"). */
const ASSETS_PECAS = Array.from({ length: 26 }, (_, i) => {
  const numero = String(i + 1).padStart(2, '0');
  return { id: `peca${numero}`, src: `./assets/img/pecas/peca-${numero}.png` };
});

/**
 * Desenha uma imagem já carregada centralizada em (cx, cy), redimensionada
 * pra `alturaAlvo` px de altura, preservando a proporção original — usado
 * pelo tutorial pra mostrar as PEÇAS DE VERDADE do jogo (não uma forma
 * genérica desenhada na hora). Sem imagem (falha de carregamento), não
 * desenha nada — o motor já loga o aviso, o tutorial só fica sem aquele
 * quadro em vez de quebrar.
 */
function desenharImagemCentralizada(ctx, imagem, cx, cy, alturaAlvo) {
  if (!imagem) return;
  const escala = alturaAlvo / imagem.naturalHeight;
  const w = imagem.naturalWidth * escala;
  const h = alturaAlvo;
  ctx.drawImage(imagem, cx - w / 2, cy - h / 2, w, h);
}

export default {
  // ------------------------------------------------------------- identidade
  slug: 'quebra-cabeca-dinossauro',
  titulo: 'Quebra-Cabeça Dino',
  subtitulo: 'Arraste as peças na ordem certa!',

  objetivo: 'Praticar a sequência numérica (contar em ordem crescente) montando um quebra-cabeça de peças reais, uma de cada vez, sempre a próxima da sequência.',
  faixaEtaria: '6 a 8 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',
  textoEmCaixaAlta: true,

  // ---------------------------------------------------------------- tema
  // Reaproveita a estrutura do tema 'quarto' (sem sol, sem nuvens, sem
  // colinas — só céu + prateleira de madeira, ver `engine/ui/Background.js`)
  // com cores próprias, âmbar/verde-musgo — o mesmo jeito que o Encaixe
  // Certo já usa pra ganhar uma cara exclusiva sem precisar de um tema novo
  // no motor. As DUAS placas brancas da partida (tabuleiro e bandeja) são
  // quem carrega a identidade visual de verdade; o cenário só não pode
  // competir com elas.
  tema: 'quarto',
  corCeuTopo: '#1C1207',
  corCeuBase: '#6B4423',
  mostrarDecoracoes: false,

  // ----------------------------------------------------------------- níveis
  // As 26 peças do brinquedo físico aparecem SEMPRE inteiras nos 3 níveis —
  // cortar peças por nível quebraria o desenho do dinossauro pela metade.
  // A dificuldade cresce em dois eixos que não mudam o conteúdo:
  //   `embaralhamento` — o quanto a ORDEM DE EXIBIÇÃO na bandeja foge da
  //     leitura em fileiras (0 = quase em ordem, mais fácil de achar a
  //     peça certa; 1 = totalmente embaralhada);
  //   `tolerancia` — multiplicador do raio de encaixe (1 = padrão; >1 mais
  //     generoso, <1 exige soltar mais perto do lugar certo).
  // Ver `GameScene._embaralharParcial`/`_raioTolerancia`.
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Quase em ordem', amostra: '🧩', cor: '#22C55E',
      meta: 26, embaralhamento: 0.25, tolerancia: 1.2,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Bem misturadas', amostra: '🧩🧩', cor: '#F59E0B',
      meta: 26, embaralhamento: 0.65, tolerancia: 1.0,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Tudo misturado', amostra: '🧩🧩🧩', cor: '#DC2626',
      meta: 26, embaralhamento: 1, tolerancia: 0.85,
    },
  ],

  // --------------------------------------------------------------- tutorial
  // As 3 ilustrações usam as peças DE VERDADE do jogo (a mesma arte que
  // aparece na partida), não uma forma genérica desenhada na hora — pedido
  // do humano, depois de ver a primeira versão com quadrados coloridos.
  // `desenho` recebe `loader` como 5º parâmetro (`engine/screens/
  // TutorialScreen.js`, classe `Ilustracao`) — os mesmos assets já
  // carregados pela tela de carregamento, prontos pra usar aqui.
  tutorial: [
    {
      titulo: 'Essas são as peças',
      texto: 'Cada peça do quebra-cabeça tem um número. Vamos usá-los para montar o dinossauro.',
      desenho: (ctx, l, a, t, loader) => {
        const cy = a / 2;
        const alturaAlvo = 150;
        const gap = 26;
        const ids = ['peca01', 'peca02', 'peca03'];
        const imagens = ids.map((id) => loader?.imagem(id));
        const larguras = imagens.map((img) => (img ? (img.naturalWidth / img.naturalHeight) * alturaAlvo : 0));
        const totalLargura = larguras.reduce((soma, w) => soma + w, 0) + gap * (ids.length - 1);
        let x = l / 2 - totalLargura / 2;
        imagens.forEach((img, i) => {
          desenharImagemCentralizada(ctx, img, x + larguras[i] / 2, cy, alturaAlvo);
          x += larguras[i] + gap;
        });
      },
    },
    {
      titulo: 'Arraste na ordem certa',
      texto: 'Comece pela peça 1. Arraste cada peça até o contorno pontilhado dela, sempre seguindo 1, 2, 3…',
      desenho: (ctx, l, a, t, loader) => {
        const cy = a / 2;
        const alturaAlvo = 150;
        const anda = (Math.sin(t * 1.8) + 1) / 2; // 0..1 vai e volta
        const x0 = l / 2 - 170;
        const x1 = l / 2 + 100;
        const x = x0 + (x1 - x0) * anda;

        // O contorno-alvo é o MESMO recorte pontilhado que aparece no
        // tabuleiro de verdade (peça 1), não um retângulo tracejado
        // genérico — a criança já reconhece essa forma quando for jogar.
        desenharImagemCentralizada(ctx, loader?.imagem('imgEncaixe01'), x1, cy, alturaAlvo);
        desenharImagemCentralizada(ctx, loader?.imagem('peca01'), x, cy, alturaAlvo);
      },
    },
    {
      titulo: 'Errar só demora mais',
      texto: 'Se tentar uma peça fora de ordem, ela só volta — sem problema, tente de novo. O dinossauro fica pronto quando todas as peças encaixarem.',
      desenho: (ctx, l, a, t, loader) => {
        const cy = a / 2;
        const alturaAlvo = a * 0.94;
        // Pulsa entre o tabuleiro vazio e o dinossauro completo — mostra a
        // própria recompensa (o desenho inteiro, mesma arte da partida),
        // não um enfeite à parte.
        const pulso = (Math.sin(t * 0.9) + 1) / 2;
        desenharImagemCentralizada(ctx, loader?.imagem('imgBase'), l / 2, cy, alturaAlvo);
        ctx.save();
        ctx.globalAlpha = pulso;
        desenharImagemCentralizada(ctx, loader?.imagem('imgCompleto'), l / 2, cy, alturaAlvo);
        ctx.restore();
      },
    },
  ],


  // ------------------------------------------------------------------ áudio
  assets: [
    { id: 'imgBase', src: './assets/img/dinossauro-base-pontilhada.png' },
    { id: 'imgCompleto', src: './assets/img/dinossauro-completo.png' },
    { id: 'imgEncaixe01', src: './assets/img/encaixe-01.png' },
    ...ASSETS_PECAS,
    // `acertoSOS` é o MESMO som de vitória já usado no resto da coleção
    // Numerandus (Bingo, Jogo da Velha, Jogo da Ordenação, Encaixe Certo,
    // Jogo da Memória, Material Dourado) — sem fala, então serve a qualquer
    // jogo. Ver assets/audio-transcricao/acertoSOS/transcricao.md.
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    // `soltarPeca` é o MESMO som de encaixe do Material Dourado (lá é o
    // `clique` genérico; aqui marca só o ENCAIXE bem-sucedido — pedido do
    // humano). Ver assets/audio-transcricao/soltarPeca/transcricao.md.
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
  ],

  /**
   * Sem mascote em nenhuma tela — padrão de toda a coleção Numerandus.
   * `mascote: null` NÃO desliga a coruja (o motor cai no padrão vetorial);
   * `telas: []` é o jeito de tirá-la de toda tela.
   */
  mascote: { telas: [] },

  /** Resto do áudio ainda não gravado nesta sessão — ver CHECKLIST.md/README.md. */
  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca',
    erro: null,
    vitoria: 'acertoSOS',
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Sem derrota — quebra-cabeça solo, mesmo padrão do Jogo da Ordenação/Encaixe Certo/Material Dourado. */
  registrarDerrota: false,

  /** Tela de resultado: "26 PEÇAS", não "26 acertos". */
  unidadePlacar: { singular: 'peça', plural: 'peças' },
  mostrarTempo: true,
};
