import {
  Scene, Node, TextNode, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores, espaco,
} from '../../engine/index.js';

/**
 * Caminho das Cores — mecânica de COPIAR UM PADRÃO, em DUAS etapas (desenho
 * revisto com o humano depois da primeira versão de "encaixe livre por
 * arrasto direto na trilha" — ver `README.md`, correções 21 a 26, pra
 * história completa da mecânica antiga).
 *
 * ETAPA 1 — a BANDEJA é uma GRADE deslizante (tipo "jogo dos 15"), com as
 * mesmas regras de movimentação do Jogo da Ordenação: só anda quem tem uma
 * casa vizinha vazia. Só existe UM vazio por vez; arrastar uma peça que está
 * na MESMA linha/coluna do vazio desliza ela (e tudo que estava entre ela e
 * o vazio) em CADEIA, em linha reta, num gesto só — nunca dobra em "L" (ver
 * `_calcularDeslize`). Uma casa fixa, sempre a mesma (linha de baixo, coluna
 * 0 — "o ESPAÇO"), é a única porta de saída: deslizar uma peça pra dentro
 * dela já é a decisão de mandá-la pra uma trilha, sem volta.
 *
 * ETAPA 2 — ao sair pelo espaço, a peça fica "em escolha" e uma seta nasce
 * sobre cada trilha ainda não cheia (`SetaColuna`/`_mostrarSetas`); um toque
 * na seta já encaixa a peça na posição mais baixa vazia daquela trilha —
 * sem passo de confirmar à parte (1 toque = 1 decisão). RETIRAR uma peça só
 * é possível pela do TOPO da pilha (LIFO, ver `Trilha`), e ela só volta se o
 * espaço da grade estiver livre naquele instante (a mesma porta, nos dois
 * sentidos).
 *
 * Por cima das duas etapas, o resto da mecânica não mudou nada: a criança
 * monta o tabuleiro em QUALQUER ordem, nada é validado até ela tocar
 * CONFIRMAR. Se o tabuleiro inteiro bater com a cartela, a estrela da rodada
 * acende e uma cartela NOVA nasce (até completar a meta do nível — igual ao
 * Material Dourado: várias rodadas, uma estrela por rodada). Se não bater,
 * só demora mais (RE-02: nunca desconta) — a partir do 3º erro seguido
 * NESTA cartela, o jogo mostra a composição certa se montando sozinha no
 * tabuleiro (holofote + cascata, como no Material Dourado) e depois volta
 * pro que a criança tinha, pra ela mesma corrigir.
 *
 * Ao contrário do Encaixe Certo/Quantidade Certa, aqui NÃO existe encaixe
 * geométrico (nó/entalhe) — no brinquedo físico qualquer peça cabe
 * fisicamente em qualquer trilha; quem filtra é a comparação com a cartela,
 * não a forma da peça.
 *
 * Decisões registradas no artefato de planejamento, antes desta implementação
 * começar:
 *   - Fundo LISO (sem gradiente, sem decoração) — conteúdo já é visualmente
 *     carregado (várias cores/formatos); o fundo não deveria competir.
 *   - Sem mascote — decisão do humano.
 *   - Sem vidas, sem derrota — errar só demora mais.
 */

const FORMAS = ['circulo', 'quadrado', 'triangulo', 'pentagono'];
const CORES_BANCO = [
  cores.ludica.vermelho, cores.ludica.laranja, cores.ludica.amarelo,
  cores.ludica.verde, cores.ludica.azul, cores.ludica.roxo,
];

/**
 * Dica progressiva ao confirmar errado repetidas vezes NESTA cartela — a
 * contagem (`GameScene._errosRodada`) zera a cada cartela nova, nunca
 * acumula pela partida inteira. A partir de `ERROS_PARA_DICA` erros
 * seguidos, o tabuleiro se monta SOZINHO com a composição certa (holofote +
 * cascata, igual ao Material Dourado) e volta pro que a criança tinha — a
 * demonstração nunca confirma a cartela sozinha, só mostra, e se repete a
 * cada novo erro depois do limite, não só da primeira vez.
 */
const ERROS_PARA_DICA = 3;
// Timing da demonstração (mesmos valores do Material Dourado, pra qualquer
// criança que já viu uma reconhecer a outra): cada peça de uma trilha
// nasce/some ATRASO_ENTRE_PECAS depois da anterior, todas as 5 trilhas em
// paralelo (o tempo total depende só da profundidade do nível, não do total
// de peças do tabuleiro).
const ATRASO_ENTRE_PECAS = 190;
const DURACAO_POP = 360;
const DURACAO_SAIDA = 320;
const ESPERA_MONTADA = 1100;
const ESPERA_AVANCO = 900;

function todasCombinacoes() {
  const lista = [];
  for (const forma of FORMAS) for (const cor of CORES_BANCO) lista.push({ forma, cor });
  return lista;
}

/**
 * Sorteia as sequências das trilhas (sem nenhuma regra de distinção dentro da
 * coluna — o vídeo mostra combinações livres, inclusive repetidas, dentro da
 * mesma cartela) e as peças distratoras: combinações formato+cor que NÃO
 * aparecem em NENHUMA trilha, pra nunca criar uma peça "quase certa" ambígua.
 * Chamada uma vez por CARTELA (a cada rodada nova, não só uma vez por nível).
 */
function gerarRodada(nivel) {
  const trilhas = [];
  const usadas = new Set();
  for (let t = 0; t < nivel.trilhas; t++) {
    const sequencia = [];
    for (let i = 0; i < nivel.profundidade; i++) {
      const forma = rand.item(FORMAS);
      const cor = rand.item(CORES_BANCO);
      sequencia.push({ forma, cor });
      usadas.add(`${forma}|${cor}`);
    }
    trilhas.push(sequencia);
  }
  const livres = todasCombinacoes().filter((c) => !usadas.has(`${c.forma}|${c.cor}`));
  const distratoras = rand.embaralhar(livres).slice(0, nivel.distratoras);
  return { trilhas, distratoras };
}

// ------------------------------------------------------------------ formas

/** Traça uma forma geométrica dentro de uma caixa local de `tam`×`tam` (origem no canto superior esquerdo). */
function tracarForma(ctx, forma, tam) {
  switch (forma) {
    case 'circulo':
      ctx.beginPath();
      ctx.arc(tam / 2, tam / 2, tam * 0.46, 0, Math.PI * 2);
      break;
    case 'quadrado':
      ctx.beginPath();
      ctx.roundRect(tam * 0.05, tam * 0.05, tam * 0.9, tam * 0.9, tam * 0.12);
      break;
    case 'triangulo':
      ctx.beginPath();
      ctx.moveTo(tam * 0.5, tam * 0.04);
      ctx.lineTo(tam * 0.96, tam * 0.92);
      ctx.lineTo(tam * 0.04, tam * 0.92);
      ctx.closePath();
      break;
    default: { // 'pentagono'
      const cx = tam * 0.5; const cy = tam * 0.53; const raio = tam * 0.48;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
        const x = cx + raio * Math.cos(ang);
        const y = cy + raio * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
  }
}

// ------------------------------------------------------------------- peças

/**
 * Peça solta e arrastável — um formato numa cor. `trancada` marca "já está
 * numa trilha" (ver `Trilha`): continua interativa (`toque` tira ela de
 * volta pra bandeja, se o espaço da grade estiver livre), só não pode mais
 * ser ARRASTADA. `linha`/`coluna` é a posição dela na GRADE da bandeja
 * (etapa 1, ver `GameScene._grade`) — `-1,-1` enquanto está "em escolha"
 * (fora da grade, ainda não encaixada em nenhuma trilha) ou já numa trilha.
 * Sem papel nenhum até ser colocada numa trilha — nada é validado no
 * instante do encaixe (encaixe livre, ver doc da classe `GameScene`), só
 * quando a própria criança confirma.
 */
class Peca extends Node {
  constructor(forma, cor, tam) {
    super({
      largura: tam, altura: tam, interativo: true, regX: tam / 2, regY: tam / 2,
    });
    this.forma = forma;
    this.cor = cor;
    this.tam = tam;
    this.arrastando = false;
    this.trancada = false;
    this.linha = -1;
    this.coluna = -1;
    /** @type {Trilha|null} a trilha onde está encaixada, ou `null` se solta na bandeja/em escolha. */
    this.trilha = null;
    this.indiceTrilha = -1;
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = this.arrastando ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = this.arrastando ? 16 : 7;
    ctx.shadowOffsetY = this.arrastando ? 6 : 3;
    tracarForma(ctx, this.forma, this.tam);
    ctx.fillStyle = this.cor;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.restore();
  }
}

/**
 * Trilha — um "poço" vertical com `profundidade` posições, de baixo pra cima
 * (índice 0 = fundo). Encaixe LIVRE: qualquer peça pode ocupar a posição
 * vazia mais baixa (`pecas`, um array paralelo à `sequencia` — `null` =
 * vazio), sem checar se é a certa. A pilha só sai por cima (como uma pilha
 * de verdade): só a peça do TOPO é removível, nunca uma do meio. A
 * correção É comparada com `sequencia` só na hora de confirmar
 * (`GameScene._confirmar`), nunca aqui.
 */
class Trilha extends Node {
  /**
   * `larguraColuna` é a largura VISUAL do canal de madeira (estica pra
   * preencher o tabuleiro, sem sobra nas laterais) — pode ser bem maior que
   * `tam` (o tamanho da peça); a peça sempre fica CENTRALIZADA dentro da
   * coluna, nunca esticada/achatada. Sem o parâmetro, cai de volta pra `tam`.
   */
  constructor(sequencia, tam, gapSlot, padY, larguraColuna) {
    const altura = sequencia.length * tam + (sequencia.length - 1) * gapSlot + padY * 2;
    const largura = larguraColuna ?? tam;
    super({ largura, altura });
    this.sequencia = sequencia;
    this.tam = tam;
    this.gapSlot = gapSlot;
    this.padY = padY;
    this.pecas = new Array(sequencia.length).fill(null);
  }

  completa() { return this.pecas.every((p) => p !== null); }

  /** Índice da posição vazia mais baixa, ou -1 se a trilha já está cheia. */
  indiceVazio() { return this.pecas.indexOf(null); }

  /** Índice da peça do TOPO da pilha (a única removível), ou -1 se vazia. */
  indiceTopo() {
    for (let i = this.pecas.length - 1; i >= 0; i--) if (this.pecas[i]) return i;
    return -1;
  }

  /** Centro (em coordenadas do PAI, já somando `this.x/y`) do slot de índice `i`. */
  _centroDoSlot(i) {
    return {
      x: this.x + this.largura / 2,
      y: this.y + this.altura - this.padY - this.tam / 2 - i * (this.tam + this.gapSlot),
    };
  }

  // SEM silhueta do que falta — nem formato, nem contorno pontilhado. Mostrar
  // a forma esperada na própria trilha entregava a resposta de graça. O
  // canal de madeira em si é pintado pelo `TabuleiroVisual`, por baixo; as
  // peças já colocadas são NÓS DE VERDADE (`Peca`, filhos da mesma `area`,
  // ver `GameScene`), não algo que a trilha desenha — não sobra nada pra
  // desenhar aqui (etapa 2 é só clique na seta, ver `SetaColuna`), por isso
  // nem sobrescreve `desenhar` (o padrão de `Node` não pinta nada).
}

/**
 * Tabuleiro visual imitando o painel físico de MDF do vídeo — paredes
 * (madeira clara) de VERDADE entre as 5 colunas das trilhas: sem elas à
 * vista, as regras de movimentação (quem pode ir aonde) ficam sem nenhuma
 * pista visual do PORQUÊ — lição registrada no `README.md` (correção 24).
 *
 * Não existe mais um "buraco"/corredor físico LIGANDO a piscina (bandeja) às
 * trilhas — na mecânica atual (ver doc da classe `GameScene`) uma peça sai
 * da bandeja pela casa fixa do ESPAÇO (dentro da própria grade,
 * `GridBandeja`) e reaparece numa trilha por uma animação de voo, não por um
 * caminho arrastado. Mas a divisória logo ABAIXO da coluna do espaço tem uma
 * abertura (`aberturaX`/`aberturaLargura`) — só pra dar uma pista visual de
 * que ali é uma passagem de verdade pra baixo (pedido do humano: sem ela, a
 * peça só "sumia" da grade sem nenhum indício do porquê); não leva a lugar
 * nenhum fisicamente, a peça some e reaparece animada, a abertura é só
 * decoração que explica a casa do espaço.
 */
class TabuleiroVisual extends Node {
  constructor(opcoes) {
    super(opcoes);
    this.corFundo = '#E1D3C1'; // Madeira clara (também a cor da PAREDE)
    this.corCanaleta = '#8A6E59'; // Madeira escura/fundo

    this.tamPeca = opcoes.tamPeca;
    this.gapTrilha = opcoes.gapTrilha;
    this.padPanelX = opcoes.padPanelX;
    this.padPanelTopo = opcoes.padPanelTopo;
    this.alturaBandeja = opcoes.alturaBandeja;
    this.espessuraDivisor = 10;
    this.numTrilhas = opcoes.numTrilhas;
    this.alturaCanaletaHoriz = this.tamPeca + 12;
    this.aberturaX = opcoes.aberturaX;
    this.aberturaLargura = opcoes.aberturaLargura;
  }

  desenhar(ctx) {
    ctx.save();

    // 1. Fundo (Madeira Clara)
    ctx.fillStyle = this.corFundo;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, 8);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.stroke();

    // 2. Canaletas (Madeira Escura) — piscina, canaleta horizontal e as 5
    // trilhas verticais, cada uma um retângulo À PARTE: o vão claro que sobra
    // entre as trilhas (a cor de fundo mostrando por baixo) é a parede entre
    // colunas — decorativo aqui, a grade da bandeja (`GridBandeja`) é quem
    // desenha as próprias raias da etapa 1.
    ctx.fillStyle = this.corCanaleta;

    // A. Piscina no topo
    const piscinaX = this.padPanelX;
    const piscinaY = this.padPanelTopo;
    const piscinaW = this.largura - this.padPanelX * 2;
    const piscinaH = this.alturaBandeja;
    ctx.fillRect(piscinaX, piscinaY, piscinaW, piscinaH);

    // B. Canaleta Horizontal (só divisória — ver doc da classe)
    const chY = piscinaY + piscinaH + this.espessuraDivisor;
    const chH = this.alturaCanaletaHoriz;
    ctx.fillRect(piscinaX, chY, piscinaW, chH);

    // B.1 Abertura bem embaixo da coluna do espaço — corta a divisória E A
    // CANALETA INTEIRA (não só metade) com a cor clara da parede, com borda
    // dourada (mesma cor do destaque do espaço, ver `GridBandeja`) e uma
    // seta pra baixo dentro dela — precisa ser INEQUÍVOCA (pedido do humano
    // depois de uma primeira versão pequena/discreta demais: parecia um
    // glitch, não uma passagem de verdade).
    if (this.aberturaLargura > 0) {
      const ax = this.aberturaX;
      const ay = piscinaY + piscinaH;
      const aw = this.aberturaLargura;
      const ah = this.espessuraDivisor + chH;

      ctx.fillStyle = this.corFundo;
      ctx.beginPath();
      ctx.roundRect(ax, ay, aw, ah, [0, 0, 8, 8]);
      ctx.fill();

      ctx.strokeStyle = 'rgba(224, 171, 27, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Seta pra baixo, centralizada na abertura.
      const cx = ax + aw / 2;
      const cy = ay + ah / 2;
      const metade = Math.min(aw, ah) * 0.22;
      ctx.fillStyle = '#E0AB1B';
      ctx.beginPath();
      ctx.moveTo(cx - metade, cy - metade * 0.6);
      ctx.lineTo(cx + metade, cy - metade * 0.6);
      ctx.lineTo(cx, cy + metade * 0.8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = this.corCanaleta;
    }

    // C. Trilhas verticais
    const larguraColuna = (piscinaW - (this.numTrilhas - 1) * this.gapTrilha) / this.numTrilhas;
    const inicioXTrilhas = piscinaX;
    for (let i = 0; i < this.numTrilhas; i++) {
      const tx = inicioXTrilhas + i * (larguraColuna + this.gapTrilha);
      const ty = chY + chH;
      const tw = larguraColuna;
      const th = this.altura - this.padPanelX - ty;
      ctx.fillRect(tx, ty, tw, th);
    }

    // Sombras internas nas canaletas, pra dar profundidade.
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 3;
    ctx.strokeRect(piscinaX, piscinaY, piscinaW, piscinaH);
    ctx.strokeRect(piscinaX, chY, piscinaW, chH);

    ctx.restore();
  }
}

/**
 * Grade visual da bandeja (etapa 1) — uma raia fina por célula DE VERDADE
 * (as que sobram fora da conta, numa última linha incompleta, não têm raia:
 * não existem pro quebra-cabeça — ver `GameScene._celulasReais`/
 * `_montarGrade`) e um destaque dourado tracejado na casa do ESPAÇO, a porta
 * fixa de saída (seu tamanho e a posição do espaço mudam ao vivo conforme a
 * bandeja esvazia ou recebe uma peça de volta — `_montarGrade` atualiza
 * `celulas`/`espacoLinha`/`espacoColuna` direto nesta instância). Sem essa
 * raia a regra "só anda quem tem vizinho vazio" ficaria sem nenhuma pista
 * visual — mesma lição das paredes do `TabuleiroVisual`.
 */
class GridBandeja extends Node {
  constructor(opcoes) {
    super(opcoes);
    this.tam = opcoes.tam;
    this.gap = opcoes.gap;
    this.celulas = opcoes.celulas;
    this.espacoLinha = opcoes.espacoLinha;
    this.espacoColuna = opcoes.espacoColuna;
  }

  desenhar(ctx) {
    const pitch = this.tam + this.gap;
    ctx.save();
    for (const { linha, coluna } of this.celulas) {
      const x = coluna * pitch;
      const y = linha * pitch;
      const ehEspaco = linha === this.espacoLinha && coluna === this.espacoColuna;
      ctx.beginPath();
      ctx.roundRect(x, y, this.tam, this.tam, 8);
      if (ehEspaco) {
        ctx.fillStyle = 'rgba(224, 171, 27, 0.22)';
        ctx.fill();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(224, 171, 27, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,0.14)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

/**
 * Seta de "solte aqui" — nasce sobre cada trilha ainda não cheia quando uma
 * peça sai pelo espaço e está "em escolha" (ver `GameScene._mostrarSetas`).
 * Um TOQUE nela encaixa a peça ali mesmo, sem passo de confirmar à parte.
 * Alvo de toque generoso (56×56) mesmo a seta sendo visualmente menor —
 * perfil 4-7 anos não mira com precisão de adulto.
 */
class SetaColuna extends Node {
  constructor(opcoes) {
    super({
      ...opcoes, largura: 56, altura: 56, regX: 28, regY: 28, interativo: true,
    });
  }

  desenhar(ctx) {
    ctx.save();
    ctx.fillStyle = '#FBBF24';
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 8);
    ctx.lineTo(46, 8);
    ctx.lineTo(28, 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/** CartelaPainel — a referência fixa: uma coluna por trilha, sempre visível, nunca interativa. */
class CartelaPainel extends Node {
  constructor(colunas, tam, gapIcone, gapColuna, padX, padY) {
    const maxLen = Math.max(...colunas.map((c) => c.length));
    const largura = colunas.length * tam + (colunas.length - 1) * gapColuna + padX * 2;
    const altura = maxLen * tam + (maxLen - 1) * gapIcone + padY * 2;
    super({ largura, altura });
    this.colunas = colunas;
    this.tam = tam;
    this.gapIcone = gapIcone;
    this.gapColuna = gapColuna;
    this.padX = padX;
    this.padY = padY;
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, 14);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.restore();

    this.colunas.forEach((coluna, c) => {
      const x0 = this.padX + c * (this.tam + this.gapColuna);
      if (c > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.55)';
        ctx.lineWidth = 2;
        const xLinha = x0 - this.gapColuna / 2;
        ctx.beginPath();
        ctx.moveTo(xLinha, 8);
        ctx.lineTo(xLinha, this.altura - 8);
        ctx.stroke();
        ctx.restore();
      }
      coluna.forEach((cel, i) => {
        const y0 = this.altura - this.padY - this.tam - i * (this.tam + this.gapIcone);
        ctx.save();
        ctx.translate(x0, y0);
        tracarForma(ctx, cel.forma, this.tam);
        ctx.fillStyle = cel.cor;
        ctx.fill();
        ctx.restore();
      });
    });
  }
}

/** Desenha uma estrela de 5 pontas — mesmo path do Material Dourado. */
function desenharEstrela(ctx, cx, cy, raioExterno, raioInterno, preenchida) {
  const pontos = 5;
  const passo = Math.PI / pontos;
  ctx.beginPath();
  for (let i = 0; i < pontos * 2; i++) {
    const r = i % 2 === 0 ? raioExterno : raioInterno;
    const ang = i * passo - Math.PI / 2;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = preenchida ? '#FBBF24' : 'rgba(255, 255, 255, 0.18)';
  ctx.strokeStyle = preenchida ? '#B8860B' : 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.4;
  ctx.fill();
  ctx.stroke();
}

/**
 * Fileira de estrelas de progresso — uma por CARTELA da meta do nível (não
 * por trilha: cada cartela só conta quando o tabuleiro inteiro bate, ver
 * `GameScene._confirmar`). `atual` acende as `N` primeiras.
 */
class PainelEstrelas extends Node {
  constructor({ x, y, meta }) {
    super({ x, y });
    this.meta = meta;
    this.atual = 0;
  }

  desenhar(ctx) {
    const raioExterno = 15;
    const raioInterno = raioExterno * 0.42;
    const passo = 38;
    for (let i = 0; i < this.meta; i++) {
      desenharEstrela(ctx, i * passo, 0, raioExterno, raioInterno, i < this.atual);
    }
  }
}

/**
 * Véu com buraco — o "holofote" da dica (`GameScene._mostrarDicaTabuleiro`):
 * escurece a tela inteira, MENOS um recorte retangular (`buraco`) em volta
 * do tabuleiro, igual ao holofote de tutorial de app (mesma técnica e
 * mesmo papel do `VeuComBuraco` do Material Dourado — um caminho só, regra
 * `evenodd`: o que cai dentro do buraco (contagem par) não é pintado).
 */
class VeuComBuraco extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.cor = opcoes.cor ?? 'rgba(4, 7, 13, 0.74)';
    this.buraco = { x: 0, y: 0, largura: 0, altura: 0, raio: 0 };
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const {
      x, y, largura: bl, altura: ba, raio,
    } = this.buraco;
    const temBuraco = bl > 0 && ba > 0;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, l, a);
    if (temBuraco) ctx.roundRect(x, y, bl, ba, raio);
    ctx.fillStyle = this.cor;
    ctx.fill('evenodd');
    ctx.restore();

    if (temBuraco) {
      ctx.save();
      ctx.strokeStyle = 'rgba(224, 171, 27, 0.9)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(224, 171, 27, 0.65)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(x, y, bl, ba, raio);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// ------------------------------------------------------------------ a cena

export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    // RESPONSIVO: `config.js` já decidiu `largura`/`altura` uma vez, no
    // carregamento, por tipo de tela (ver lá o porquê). Aqui só lemos o
    // resultado — tela mais larga que alta é "computador" (cartela e
    // tabuleiro lado a lado); mais alta que larga é "celular" (empilhados).
    // O TABULEIRO em si nunca muda de forma nos dois modos — continua
    // estreito e vertical, só a posição da cartela muda.
    this._desktop = L > A;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    // `meta` agora é quantas CARTELAS (rodadas) o nível pede, não mais as 5
    // trilhas de UMA cartela só — o jogo ganhou rodadas (como o Material
    // Dourado): bater o tabuleiro inteiro avança pra uma cartela nova, até
    // completar a meta (ver `_confirmar`/`_avancarRodada`).
    this.placar = new ScoreSystem({ total: this.nivel.meta, nivel: this.nivel.id ?? 1 });

    // Tentativa de Confirmar errada só é registrada pro relatório do AVA —
    // nunca desconta acertos nem estrelas (RE-02).
    this._tentativasErradas = 0;
    // Erros só DESTA cartela — degrau da dica, zera a cada cartela nova.
    this._errosRodada = 0;
    this._rodadaIndex = 0;
    // Trava a mesa/Confirmar durante a demonstração da dica e durante o
    // intervalo entre uma cartela certa e a próxima nascer.
    this._aguardandoAvanco = false;
    // Trava a grade/Confirmar enquanto uma peça está "em escolha" (saiu pelo
    // espaço, ainda não tocou numa seta — ver `_sairPelaEspaco`/`_escolherColuna`).
    this._escolhendoColuna = false;
    this._pecaEmEscolha = null;
    this._setas = [];

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo ?? '#2E2150',
      corCeuBase: config.corCeuBase ?? '#2E2150',
      mostrarDecoracoes: false,
      mostrarChao: false,
    }));

    // Holofote da dica (ver `VeuComBuraco`/`_mostrarDicaTabuleiro`) — nasce
    // invisível e sem buraco; `_mostrarVeuDica` o traz pra FRENTE de tudo só
    // na hora de mostrar, com o recorte em volta do tabuleiro já calculado.
    this._veuDica = new VeuComBuraco({ largura: L, altura: A });
    this._veuDica.alpha = 0;
    this.adicionar(this._veuDica);

    const margemLateral = 44;
    if (this._desktop) {
      // No computador os botões formam uma FILEIRA no canto superior
      // DIREITO — do lado OPOSTO à cartela (que encosta na borda esquerda) —
      // em vez de competir por espaço com ela.
      this._topo = espaco.md;
      // Zona reservada à direita pros botões + Confirmar — bem mais larga
      // que o próprio botão (72px): sobra espaço de verdade pro Confirmar
      // morar ali embaixo, e a busca de `tam` (em `_calcularLayoutDesktop`)
      // escolhe peças/colunas um pouco mais estreitas, abrindo folga real
      // pra cartela+tabuleiro não ficarem espremidos contra a borda.
      this._zonaDireita = 340;
      this._areaLargura = L - margemLateral - this._zonaDireita;
      this._areaAltura = A - this._topo - 30;
      this.area = new Node({ x: margemLateral, y: this._topo });
    } else {
      // 180 é o mínimo real pra caber DUAS fileiras de HUD empilhadas acima
      // da cartela — estrelas+relógio (mecânica revista, ver abaixo) numa,
      // pausa/ajuda/som/confirmar na outra, com respiro entre as duas e
      // antes da cartela. Antes (sem a 1ª fileira) bastavam 102.
      this._topo = 180;
      this._areaLargura = L - margemLateral * 2;
      this._areaAltura = A - this._topo - 30;
      this.area = new Node({ x: margemLateral, y: this._topo });
    }
    this.adicionar(this.area);

    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', () => this._soltarArrasto()));
    this.aoDesmontar(this.input.on('cancelar', () => this._soltarArrasto()));

    // ------------------------------------------------------------------ HUD
    // Em QUALQUER tela os 3 botões formam uma FILEIRA — só muda o canto:
    // celular no topo ESQUERDO (encostado na margem), computador no topo
    // DIREITO. `linhaDireitaX` ancora pela direita: o último botão (som,
    // i=2) termina exatamente em `L - margemLateral`.
    const linhaDireitaX = (i) => L - margemLateral - 72 - (2 - i) * 88;
    const btnX1 = this._desktop ? linhaDireitaX(0) : margemLateral;
    const btnX2 = this._desktop ? linhaDireitaX(1) : margemLateral + 88;
    const btnX3 = this._desktop ? linhaDireitaX(2) : margemLateral + 88 * 2;
    const btnY = espaco.md;

    // `corContorno: 'transparent'` — pausa/ajuda ficam sem o anel de
    // contorno (só a sombra de base dá profundidade); o som mantém o anel
    // azul de propósito (sinaliza estado "ligado").
    this._btnPausa = new IconButton({
      icone: 'pausa', x: btnX1, y: btnY, audio: this.audio, somToque: config.audio?.clique, corContorno: 'transparent', aoTocar: () => this._pausar(),
    });
    this.adicionar(this._btnPausa);

    this._btnAjuda = new IconButton({
      icone: 'tutorial', x: btnX2, y: btnY, audio: this.audio, somToque: config.audio?.clique, corContorno: 'transparent', aoTocar: () => this._pedirAjuda(),
    });
    this.adicionar(this._btnAjuda);

    this._btnSom = new SoundToggle({
      audio: this.audio, x: btnX3, y: btnY, somToque: config.audio?.clique,
    });
    this.adicionar(this._btnSom);

    // ------------------------------------------------------------ confirmar
    // Botão novo: nada mais encaixa automaticamente (ver `_encaixarLivre`) —
    // a criança monta o tabuleiro inteiro e só descobre se acertou ao tocar
    // aqui (`_confirmar`). No computador mora centralizado na zona
    // reservada à direita (mesma zona dos botões); no celular, embaixo deles
    // à esquerda.
    const larguraConfirmar = 220;
    const alturaConfirmar = 72;
    // Desktop: centralizado na zona reservada à direita, numa fileira
    // PRÓPRIA embaixo dos ícones (sobra altura de sobra ali). Celular: NA
    // MESMA fileira dos ícones, à direita deles — embaixo colidiria com a
    // cartela, que começa logo abaixo da fileira de ícones nesse formato.
    const xConfirmar = this._desktop
      ? L - margemLateral - this._zonaDireita / 2 - larguraConfirmar / 2
      : btnX3 + 88;
    const yConfirmar = this._desktop ? espaco.md + 72 + 24 : btnY;
    this.botaoConfirmar = new Button({
      rotulo: 'CONFIRMAR',
      largura: larguraConfirmar,
      altura: alturaConfirmar,
      tamanhoTexto: 24,
      variante: 'sucesso',
      x: xConfirmar,
      y: yConfirmar,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._confirmar(),
    });
    this.adicionar(this.botaoConfirmar);
    this._xBaseConfirmar = this.botaoConfirmar.x;

    // ------------------------------------------------------- estrelas/tempo
    // Progresso agora é por CARTELA (rodada), não por trilha — uma estrela
    // acende a cada tabuleiro confirmado certo (ver `_confirmar`), igual ao
    // Material Dourado. O cronômetro é CRESCENTE e só informativo (nunca
    // pune, nunca tem limite) — pedido do humano.
    this._estrelas = new PainelEstrelas({ x: margemLateral, y: espaco.md + 16, meta: this.nivel.meta });
    this.adicionar(this._estrelas);

    this._relogioTexto = config.mostrarCronometro === false ? null : new TextNode('0:00', {
      x: margemLateral, y: espaco.md + 46, tamanho: 26, peso: '800', cor: '#FFFFFF',
    });
    if (this._relogioTexto) this.adicionar(this._relogioTexto);
    this._relogioSegundoMostrado = 0;

    this.pausa = new PauseScreen({
      largura: L,
      altura: A,
      audio: this.audio,
      config,
      mostrarSom: false,
      aoContinuar: () => { this.pausada = false; Tween.retomarTodos(); },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    this.ajuda = new HelpScreen({
      cena: this,
      aoFechar: () => { this.pausada = false; Tween.retomarTodos(); },
    });
    this.adicionar(this.ajuda);

    this.placar.on('vitoria', () => this._celebrarCompleto());

    // ------------------------------------------------------------- tabuleiro
    // Layout (tamanho das peças, da cartela, do tabuleiro) calculado UMA VEZ
    // só — não muda entre cartelas da mesma partida, só o CONTEÚDO muda
    // (`_novaCartela`). O painel de madeira (`_painelDireita`) também nasce
    // aqui e nunca é recriado — só cartela, trilhas e peças soltas ciclam a
    // cada rodada.
    const nivel = this.nivel;
    this._layout = this._desktop
      ? this._calcularLayoutDesktop(nivel, this._areaLargura, this._areaAltura)
      : this._calcularLayout(nivel, this._areaLargura, this._areaAltura);

    const cartelaLargura = nivel.trilhas * this._layout.cartelaTam + (nivel.trilhas - 1) * this._layout.cartelaGapColuna + this._layout.cartelaPadX * 2;
    const cartelaAltura = nivel.profundidade * this._layout.cartelaTam + (nivel.profundidade - 1) * this._layout.cartelaGapIcone + this._layout.cartelaPadY * 2;

    if (this._desktop) {
      const totalWidth = cartelaLargura + this._layout.gapCartela + this._layout.boardWidth;
      const startX = (this._areaLargura - totalWidth) / 2;
      this._cartelaX = startX;
      this._cartelaY = (this._areaAltura - cartelaAltura) / 2;
      this._boardX = startX + cartelaLargura + this._layout.gapCartela;
      this._boardY = (this._areaAltura - this._layout.boardHeight) / 2;
    } else {
      this._cartelaX = (this._areaLargura - cartelaLargura) / 2;
      this._cartelaY = 0;
      this._boardX = (this._areaLargura - this._layout.boardWidth) / 2;
      this._boardY = cartelaAltura + this._layout.gapCartela;
    }

    this._tamPeca = this._layout.tam;

    // Largura da GRADE da bandeja (etapa 1), em colunas — essa sim constante
    // pro nível inteiro (mesma conta de `layout.porLinha`, pensada pra
    // largura disponível). A ALTURA (em linhas) e a casa do ESPAÇO, ao
    // contrário, mudam ao vivo (ver `_montarGrade`): cada peça que sai pelo
    // espaço ou volta de uma trilha muda quantas peças a bandeja tem, e a
    // grade é refeita do tamanho exato (peças + 1 vazio) toda vez — sem
    // isso, perder ou ganhar uma peça sem encolher/crescer a grade deixaria
    // 0 ou 2 vazios nela, e tanto o arrasto (`_calcularDeslize`) quanto a
    // retirada (`_tentarRetirarDaTrilha`) só reconhecem UM vazio só.
    this._gradeColunas = this._layout.porLinha;

    const pitchGrade = this._layout.tam + this._layout.gapBandeja;
    const piscinaW = this._layout.boardWidth - this._layout.padPanelX * 2;
    const larguraGrade = this._gradeColunas * pitchGrade - this._layout.gapBandeja;
    this._gradeOffsetX = Math.max(0, (piscinaW - larguraGrade) / 2);

    this._painelDireita = new TabuleiroVisual({
      largura: this._layout.boardWidth,
      altura: this._layout.boardHeight,
      tamPeca: this._layout.tam,
      gapTrilha: this._layout.gapTrilha,
      padPanelX: this._layout.padPanelX,
      padPanelTopo: this._layout.padPanelTopo,
      alturaBandeja: this._layout.alturaBandeja,
      numTrilhas: nivel.trilhas,
      // Abertura na divisória, bem embaixo da COLUNA do espaço (coluna 0 da
      // grade) — pedido do humano depois de ver a peça só "sumir" sem
      // nenhuma pista visual de que ali é uma passagem de verdade pra baixo.
      aberturaX: this._layout.padPanelX + this._gradeOffsetX,
      aberturaLargura: this._layout.tam,
    });
    this._painelDireita.x = this._boardX;
    this._painelDireita.y = this._boardY;
    this.area.adicionar(this._painelDireita);

    this._gradeBandeja = new GridBandeja({
      tam: this._layout.tam,
      gap: this._layout.gapBandeja,
      celulas: [],
      espacoLinha: 0,
      espacoColuna: 0,
    });
    this._gradeBandeja.x = this._boardX + this._layout.padPanelX + this._gradeOffsetX;
    this._gradeBandeja.y = this._boardY + this._layout.padPanelTopo;
    this.area.adicionar(this._gradeBandeja);

    this._grade = [];
    this._trilhas = [];
    this._arrastando = null;
    this._novaCartela();

    // Só no CELULAR os botões seguem a altura da cartela (empilhados logo
    // acima dela, numa fileira PRÓPRIA — abaixo de estrelas/relógio, que
    // ficam fixos no topo). No computador eles já nasceram numa posição
    // fixa. `36` é a metade da altura do ícone (regY, ver `Button`): sem
    // somar, `.y` (que de agora em diante é o CENTRO, não mais a borda de
    // cima) ficava alto demais e cortava o topo do círculo.
    if (!this._desktop) {
      const cartelaAbsY = this._topo + this._cartelaY;
      const btnYMovel = cartelaAbsY - 12 - 36;
      this._btnPausa.y = btnYMovel;
      this._btnAjuda.y = btnYMovel;
      this._btnSom.y = btnYMovel;
      // Confirmar acompanha a MESMA fileira (ver criação dele, acima) — sem
      // isto ele ficava preso na altura original enquanto os ícones subiam
      // pra ficar coladinhos na cartela, sobrepondo ela.
      this.botaoConfirmar.y = btnYMovel;
      this._xBaseConfirmar = this.botaoConfirmar.x;
    }
  }

  /**
   * Monta uma cartela NOVA: sorteia sequências/distratoras e recria cartela,
   * trilhas e bandeja do zero (o tabuleiro de madeira e o layout NÃO mudam
   * entre cartelas, só o conteúdo — ver `aoEntrar`). Chamada na primeira
   * rodada e sempre que `_avancarRodada` troca de cartela.
   */
  _novaCartela() {
    const nivel = this.nivel;
    const layout = this._layout;
    const { trilhas: sequencias, distratoras } = gerarRodada(nivel);

    this._cartela?.removerDoPai();
    this._pecaEmEscolha?.removerDoPai();
    this._pecaEmEscolha = null;
    this._escolhendoColuna = false;
    this._mostrarSetas(false);
    for (const linha of this._grade ?? []) {
      for (const cel of linha) if (cel && cel !== 'VOID') cel.removerDoPai();
    }
    for (const trilha of this._trilhas) {
      for (const peca of trilha.pecas) peca?.removerDoPai();
      trilha.removerDoPai();
    }

    this._cartela = new CartelaPainel(
      sequencias, layout.cartelaTam, layout.cartelaGapIcone, layout.cartelaGapColuna, layout.cartelaPadX, layout.cartelaPadY,
    );
    this._cartela.x = this._cartelaX;
    this._cartela.y = this._cartelaY;
    this.area.adicionar(this._cartela);

    // Grade da bandeja (etapa 1) — todas as peças soltas (certas das trilhas
    // + distratoras), embaralhadas, mais UM vazio (`_montarGrade` decide o
    // tamanho certo e põe o vazio sempre na casa do espaço), pra criança já
    // ver a "porta" aberta no começo de cada cartela.
    const pecasDados = rand.embaralhar([...sequencias.flat(), ...distratoras]);
    const pecas = pecasDados.map((dado) => new Peca(dado.forma, dado.cor, layout.tam));
    this._montarGrade(pecas);
    for (const peca of pecas) {
      const pos = this._posicaoCelula(peca.linha, peca.coluna);
      peca.x = pos.x; peca.y = pos.y;
      this.area.adicionar(peca);
      this._ligarTogues(peca);
    }

    // trilhas — a coluna estica pra preencher a largura toda do tabuleiro
    const piscinaW = layout.boardWidth - layout.padPanelX * 2;
    const larguraColuna = (piscinaW - (nivel.trilhas - 1) * layout.gapTrilha) / nivel.trilhas;
    const inicioXTrilhas = this._boardX + layout.padPanelX;
    const yBaseTrilhas = this._boardY + layout.boardHeight - layout.padPanelX;

    this._trilhas = sequencias.map((sequencia, i) => {
      const trilha = new Trilha(sequencia, layout.tam, layout.gapSlot, layout.padTrilhaY, larguraColuna);
      trilha.x = inicioXTrilhas + i * (larguraColuna + layout.gapTrilha);
      trilha.y = yBaseTrilhas - trilha.altura;
      this.area.adicionar(trilha);
      return trilha;
    });

    this._errosRodada = 0;
    this._atualizarTextoHud();
  }

  /**
   * Lista, em ordem de leitura (linha a linha, esquerda pra direita), toda
   * célula REAL de uma grade `linhas`×`_gradeColunas` com `totalCelulas`
   * ocupáveis. Só a ÚLTIMA linha pode ficar incompleta (sobra da divisão);
   * o resto da grade (`this._grade`, ver `_montarGrade`) marca essas sobras
   * como `'VOID'` — não fazem parte do quebra-cabeça, nunca recebem peça
   * nem participam de um deslize.
   */
  _celulasReais(totalCelulas, linhas) {
    const celulas = [];
    let restantes = totalCelulas;
    for (let l = 0; l < linhas; l++) {
      const nestaLinha = Math.min(this._gradeColunas, restantes);
      for (let c = 0; c < nestaLinha; c++) celulas.push({ linha: l, coluna: c });
      restantes -= nestaLinha;
    }
    return celulas;
  }

  /**
   * (Re)constrói `this._grade` do ZERO pra conter EXATAMENTE as peças de
   * `pecas` — uma célula a mais que peças, pro vazio do espaço (que também é
   * recalculado aqui: sempre a ÚLTIMA linha, primeira coluna, da grade do
   * tamanho ATUAL). Usada tanto pra montar a bandeja de uma cartela nova
   * (`_novaCartela`) quanto pra REORGANIZAR a grade depois que o total de
   * peças nela muda de verdade — uma sai pelo espaço (`_sairPelaEspaco`) ou
   * uma volta de uma trilha (`_tentarRetirarDaTrilha`).
   *
   * Isso existe porque o tamanho da grade é FIXO em células (linhas ×
   * colunas) só entre um deslize e outro — perder ou ganhar uma peça sem
   * encolher/crescer a grade deixaria 0 ou 2 vazios nela (uma grade de N+1
   * células com N-1 peças tem DOIS vazios; com N+1 peças não tem NENHUM), e
   * tanto `_calcularDeslize` quanto `_tentarRetirarDaTrilha` só reconhecem
   * UM vazio só. `_montarGrade` é o que garante sempre exatamente 1, do
   * tamanho certo pro total de peças do momento.
   *
   * Só define `peca.linha/coluna` nas próprias peças — quem posiciona o nó
   * de verdade (`peca.x/y`, com ou sem tween) é cada chamador, que sabe se é
   * uma cartela nascendo (sem animação) ou uma reorganização ao vivo (com).
   */
  _montarGrade(pecas) {
    this._gradeLinhas = Math.max(1, Math.ceil((pecas.length + 1) / this._gradeColunas));
    this._espacoLinha = this._gradeLinhas - 1;
    this._espacoColuna = 0;

    const celulas = this._celulasReais(pecas.length + 1, this._gradeLinhas);
    const semEspaco = celulas.filter(
      (c) => !(c.linha === this._espacoLinha && c.coluna === this._espacoColuna),
    );

    this._grade = Array.from({ length: this._gradeLinhas }, () => new Array(this._gradeColunas).fill('VOID'));
    for (const { linha, coluna } of celulas) this._grade[linha][coluna] = null;

    pecas.forEach((peca, indice) => {
      const { linha, coluna } = semEspaco[indice];
      this._grade[linha][coluna] = peca;
      peca.linha = linha;
      peca.coluna = coluna;
    });

    this._gradeBandeja.celulas = celulas;
    this._gradeBandeja.espacoLinha = this._espacoLinha;
    this._gradeBandeja.espacoColuna = this._espacoColuna;
  }

  /**
   * Reorganiza a grade ao vivo depois que o total de peças NELA muda (uma
   * saiu ou voltou) — lê quem sobrou em `this._grade`, manda pro
   * `_montarGrade` (que decide o tamanho novo e a casa do espaço de novo) e
   * anima cada peça pro slot novo dela. A maioria nem muda de lugar; só
   * desliza quem ficou depois do "buraco" na ordem de leitura.
   */
  _recompactarGrade() {
    const restantes = [];
    for (let l = 0; l < this._gradeLinhas; l++) {
      for (let c = 0; c < this._gradeColunas; c++) {
        const cel = this._grade[l][c];
        if (cel && cel !== 'VOID') restantes.push(cel);
      }
    }
    this._montarGrade(restantes);
    for (const peca of restantes) {
      const pos = this._posicaoCelula(peca.linha, peca.coluna);
      Tween.removerDe(peca);
      Tween.para(peca, { x: pos.x, y: pos.y }, 220, Easing.suave);
    }
  }

  /** Centro (coordenadas do PAI, `this.area`) da célula `linha,coluna` da grade da bandeja. */
  _posicaoCelula(linha, coluna) {
    const layout = this._layout;
    const pitch = layout.tam + layout.gapBandeja;
    return {
      x: this._boardX + layout.padPanelX + this._gradeOffsetX + coluna * pitch + layout.tam / 2,
      y: this._boardY + layout.padPanelTopo + linha * pitch + layout.tam / 2,
    };
  }

  /**
   * Canvas VERTICAL: cartela e tabuleiro EMPILHAM. O tabuleiro usa a largura
   * DISPONÍVEL inteira sempre, e a busca de `tam` decide só a ALTURA do
   * conjunto empilhado cabendo em `areaAltura`.
   */
  _calcularLayout(nivel, areaLargura, areaAltura) {
    const gapTrilha = 14;
    const padTrilhaY = 6;
    const gapSlot = 6;
    const gapBandeja = 6;
    const padPanelX = 14;
    const padPanelTopo = 16;
    const padPanelBase = 16;
    const gapDivisor = 10;

    const cartelaGapIcone = 8;
    const cartelaGapColuna = 12;
    const cartelaPadX = 16;
    const cartelaPadY = 20;
    const gapCartela = 30;

    const totalPecasBandeja = nivel.trilhas * nivel.profundidade + nivel.distratoras;
    const boardWidth = areaLargura;

    const montar = (tam) => {
      const larguraUtilBandeja = boardWidth - padPanelX * 2;
      const porLinha = Math.max(1, Math.floor((larguraUtilBandeja + gapBandeja) / (tam + gapBandeja)));
      // +1: a grade da bandeja (etapa 1) sempre tem UMA casa vazia a mais que
      // peças (o "espaço" — ver `GameScene._celulasReais`), não é só uma
      // lista compacta de itens.
      const totalLinhas = Math.ceil((totalPecasBandeja + 1) / porLinha);
      const alturaBandeja = totalLinhas * tam + (totalLinhas - 1) * gapBandeja;
      const alturaTrilhas = nivel.profundidade * tam + (nivel.profundidade - 1) * gapSlot + padTrilhaY * 2;
      const alturaCanaletaHoriz = tam + 12;
      const boardHeightConteudo = padPanelTopo + alturaBandeja + gapDivisor + alturaCanaletaHoriz + alturaTrilhas + padPanelBase;

      const cartelaTam = Math.floor(tam * 0.9);
      const cartelaWidth = nivel.trilhas * cartelaTam + (nivel.trilhas - 1) * cartelaGapColuna + cartelaPadX * 2;
      const cartelaHeight = nivel.profundidade * cartelaTam + (nivel.profundidade - 1) * cartelaGapIcone + cartelaPadY * 2;

      return {
        tam, cartelaTam, cartelaGapIcone, cartelaGapColuna, cartelaPadX, cartelaPadY, gapCartela,
        gapTrilha, padTrilhaY, gapSlot, padPanelX, padPanelTopo, padPanelBase, gapBandeja, porLinha,
        alturaBandeja, gapDivisor, boardWidth, boardHeightConteudo, cartelaWidth, cartelaHeight,
      };
    };

    const finalizar = (cand) => {
      const boardHeight = Math.max(cand.boardHeightConteudo, areaAltura - cand.cartelaHeight - cand.gapCartela);
      return { ...cand, boardHeight };
    };

    for (let tam = 220; tam >= 30; tam -= 2) {
      const cand = montar(tam);
      if (cand.cartelaWidth > areaLargura) continue;
      const totalHeight = cand.cartelaHeight + cand.gapCartela + cand.boardHeightConteudo;
      if (totalHeight <= areaAltura) return finalizar(cand);
    }
    return finalizar(montar(30));
  }

  /**
   * Canvas HORIZONTAL (computador): cartela e tabuleiro ficam LADO A LADO.
   * `boardWidth` NÃO usa a largura disponível inteira — fica ESTREITO, do
   * tamanho da própria grade de colunas, porque o tabuleiro nunca deve
   * alargar. A bandeja ocupa mais FILEIRAS dentro dessa largura estreita.
   */
  _calcularLayoutDesktop(nivel, areaLargura, areaAltura) {
    const gapTrilha = 14;
    const padTrilhaY = 6;
    const gapSlot = 6;
    const gapBandeja = 6;
    const padPanelX = 14;
    const padPanelTopo = 16;
    const padPanelBase = 16;
    const gapDivisor = 10;

    const cartelaGapIcone = 8;
    const cartelaGapColuna = 12;
    const cartelaPadX = 16;
    const cartelaPadY = 20;
    const gapCartela = 36;

    const totalPecasBandeja = nivel.trilhas * nivel.profundidade + nivel.distratoras;

    const montar = (tam) => {
      const larguraGradeTrilhas = nivel.trilhas * tam + (nivel.trilhas - 1) * gapTrilha;
      const boardWidth = larguraGradeTrilhas + padPanelX * 2;

      const larguraUtilBandeja = boardWidth - padPanelX * 2;
      const porLinha = Math.max(1, Math.floor((larguraUtilBandeja + gapBandeja) / (tam + gapBandeja)));
      // +1: a grade da bandeja (etapa 1) sempre tem UMA casa vazia a mais que
      // peças (o "espaço" — ver `GameScene._celulasReais`), não é só uma
      // lista compacta de itens.
      const totalLinhas = Math.ceil((totalPecasBandeja + 1) / porLinha);
      const alturaBandeja = totalLinhas * tam + (totalLinhas - 1) * gapBandeja;
      const alturaTrilhas = nivel.profundidade * tam + (nivel.profundidade - 1) * gapSlot + padTrilhaY * 2;
      const alturaCanaletaHoriz = tam + 12;
      const boardHeightConteudo = padPanelTopo + alturaBandeja + gapDivisor + alturaCanaletaHoriz + alturaTrilhas + padPanelBase;

      const cartelaTam = Math.floor(tam * 0.9);
      const cartelaWidth = nivel.trilhas * cartelaTam + (nivel.trilhas - 1) * cartelaGapColuna + cartelaPadX * 2;
      const cartelaHeight = nivel.profundidade * cartelaTam + (nivel.profundidade - 1) * cartelaGapIcone + cartelaPadY * 2;

      return {
        tam, cartelaTam, cartelaGapIcone, cartelaGapColuna, cartelaPadX, cartelaPadY, gapCartela,
        gapTrilha, padTrilhaY, gapSlot, padPanelX, padPanelTopo, padPanelBase, gapBandeja, porLinha,
        alturaBandeja, gapDivisor, boardWidth, boardHeightConteudo, cartelaWidth, cartelaHeight,
      };
    };

    const finalizar = (cand) => {
      const boardHeight = Math.max(cand.boardHeightConteudo, areaAltura);
      return { ...cand, boardHeight };
    };

    for (let tam = 220; tam >= 30; tam -= 2) {
      const cand = montar(tam);
      const totalWidth = cand.cartelaWidth + cand.gapCartela + cand.boardWidth;
      const maxHeight = Math.max(cand.boardHeightConteudo, cand.cartelaHeight);
      if (totalWidth <= areaLargura && maxHeight <= areaAltura) return finalizar(cand);
    }
    return finalizar(montar(30));
  }

  // --------------------------------------------------------------- arrasto

  /**
   * Liga tanto o ARRASTO (peça na grade da bandeja, `apertar` inicia) quanto
   * o TOQUE de retirar (peça já encaixada numa trilha — só funciona se for a
   * do TOPO da pilha dela). A mesma peça usa os dois conforme `trancada`.
   */
  _ligarTogues(peca) {
    peca.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando) return;
      if (this._aguardandoAvanco || this._escolhendoColuna) return;
      if (peca.trancada) return; // já numa trilha: sai por toque, não por arrasto
      const local = this.area.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = peca.x - local.x;
      this._deslocY = peca.y - local.y;
      peca.arrastando = true;
      peca.paraFrente();
      Tween.removerDe(peca);
      Tween.para(peca, { scaleX: 1.1, scaleY: 1.1 }, 100, Easing.suaveSaida);
      this._arrastando = peca;
      this._origemArrasto = { linha: peca.linha, coluna: peca.coluna };
    });

    peca.on('toque', () => {
      if (this.pausada || this.placar.encerrado || this._aguardandoAvanco) return;
      if (!peca.trancada) return; // peça solta na grade não tem ação de toque
      const trilha = peca.trilha;
      if (!trilha || trilha.indiceTopo() !== peca.indiceTrilha) return; // só o topo sai
      this._tentarRetirarDaTrilha(trilha, peca.indiceTrilha);
    });
  }

  /** Posição (linha,coluna) do ÚNICO vazio da grade, ou `null` (nunca deveria acontecer). */
  _celulaVazia() {
    for (let l = 0; l < this._gradeLinhas; l++) {
      for (let c = 0; c < this._gradeColunas; c++) {
        if (this._grade[l][c] === null) return { linha: l, coluna: c };
      }
    }
    return null;
  }

  /**
   * A fileira (linha, se `vertical`, senão coluna) inteira que passa por
   * `fixo`, como uma lista de células em ORDEM — parada no primeiro `'VOID'`
   * (só existe no fim da última linha, nunca "sanduichado" — ver
   * `_celulasReais`). É o "trilho reto" por onde um deslize em cadeia anda.
   */
  _lane(vertical, fixo) {
    const lane = [];
    const n = vertical ? this._gradeLinhas : this._gradeColunas;
    for (let i = 0; i < n; i++) {
      const linha = vertical ? i : fixo;
      const coluna = vertical ? fixo : i;
      if (this._grade[linha][coluna] === 'VOID') break;
      lane.push({ linha, coluna });
    }
    return lane;
  }

  /**
   * O CORAÇÃO da etapa 1 — regras de movimentação do Jogo da Ordenação
   * (só anda quem tem vizinho vazio), com o "deslizar em cadeia" decidido no
   * planejamento: `peca` só anda se estiver na MESMA linha OU coluna do
   * vazio (nunca os dois), em LINHA RETA, nunca dobrando em "L". O quanto
   * ela anda vem de `pontoSolto` (onde o dedo soltou, já em coordenadas de
   * `this.area`) projetado no eixo certo — solta na metade do caminho, anda
   * só a metade; solta em cima do vazio (ou além), desliza até lá.
   *
   * Tudo que estava ENTRE a posição original da peça e o destino anda uma
   * casa em direção a ela (preenchendo o rastro) — a peça cai exatamente no
   * destino. Se o destino é a própria casa do ESPAÇO (a porta fixa) E ainda
   * existe alguma trilha não cheia, a peça SAI da grade em vez de ocupá-la
   * (ver `_sairPelaEspaco`); sem trilha livre, ela só ocupa a casa como
   * qualquer outra (nunca trava um distrator sem lugar nenhum pra ir).
   *
   * Devolve `{ deslocados, saiuPeloEspaco }`, ou `null` se o gesto não é um
   * movimento válido (fora do eixo do vazio, ou não andou o bastante) — a
   * peça só volta pro lugar, nunca treme feio (errar não existe aqui).
   */
  _calcularDeslize(peca, pontoSolto) {
    const vazio = this._celulaVazia();
    if (!vazio) return null;
    const mesmaLinha = peca.linha === vazio.linha;
    const mesmaColuna = peca.coluna === vazio.coluna;
    if (!mesmaLinha && !mesmaColuna) return null;

    const vertical = mesmaColuna && !mesmaLinha;
    const fixo = vertical ? peca.coluna : peca.linha;
    const lane = this._lane(vertical, fixo);
    const k = lane.findIndex((p) => p.linha === peca.linha && p.coluna === peca.coluna);
    const b = lane.findIndex((p) => p.linha === vazio.linha && p.coluna === vazio.coluna);
    if (k === -1 || b === -1) return null;

    const pos = this._posicaoCelula(peca.linha, peca.coluna);
    const pitch = this._layout.tam + this._layout.gapBandeja;
    const deltaPx = vertical ? (pontoSolto.y - pos.y) : (pontoSolto.x - pos.x);
    const sinal = b > k ? 1 : -1;
    const passosDesejados = Math.round((deltaPx * sinal) / pitch);
    const passos = Math.max(0, Math.min(passosDesejados, Math.abs(b - k)));
    if (passos <= 0) return null;

    const t = k + passos * sinal;
    const deslocados = [];
    for (let i = k + sinal; ; i += sinal) {
      const de = lane[i];
      const para = lane[i - sinal];
      const movendo = this._grade[de.linha][de.coluna];
      this._grade[para.linha][para.coluna] = movendo;
      if (movendo) {
        movendo.linha = para.linha;
        movendo.coluna = para.coluna;
        deslocados.push(movendo);
      }
      if (i === t) break;
    }

    const destino = lane[t];
    const naCasaDoEspaco = destino.linha === this._espacoLinha && destino.coluna === this._espacoColuna;
    const temTrilhaLivre = this._trilhas.some((tr) => !tr.completa());
    const saiuPeloEspaco = naCasaDoEspaco && temTrilhaLivre;

    if (saiuPeloEspaco) {
      this._grade[destino.linha][destino.coluna] = null;
    } else {
      this._grade[destino.linha][destino.coluna] = peca;
      peca.linha = destino.linha;
      peca.coluna = destino.coluna;
    }

    return { deslocados, saiuPeloEspaco };
  }

  _moverArrasto(ponto) {
    const peca = this._arrastando;
    if (!peca) return;
    // Segue o dedo LIVREMENTE (sem travar em nada) — igual ao Jogo da
    // Ordenação: a validade do movimento só é decidida ao SOLTAR
    // (`_calcularDeslize`), nunca durante o arrasto em si.
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    peca.x = local.x + this._deslocX;
    peca.y = local.y + this._deslocY;
  }

  _soltarArrasto() {
    const peca = this._arrastando;
    if (!peca) return;
    this._arrastando = null;
    peca.arrastando = false;
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    const resultado = this._calcularDeslize(peca, { x: peca.x, y: peca.y });
    if (!resultado) {
      const pos = this._posicaoCelula(this._origemArrasto.linha, this._origemArrasto.coluna);
      Tween.para(peca, { x: pos.x, y: pos.y }, 160, Easing.suaveSaida);
      return;
    }

    if (resultado.saiuPeloEspaco) {
      // `_sairPelaEspaco` já chama `_recompactarGrade`, que reconstrói a
      // grade (tamanho novo, espaço recalculado) e reanima TODAS as peças
      // que sobraram — incluindo as que `_calcularDeslize` já deslocou. Não
      // precisa (e não deveria) animar `deslocados` aqui também: a
      // recompactação é quem manda na posição final de cada uma.
      this._sairPelaEspaco(peca);
      return;
    }

    for (const outra of resultado.deslocados) {
      const pos = this._posicaoCelula(outra.linha, outra.coluna);
      Tween.para(outra, { x: pos.x, y: pos.y }, 180, Easing.suave);
    }
    const pos = this._posicaoCelula(peca.linha, peca.coluna);
    Tween.para(peca, { x: pos.x, y: pos.y }, 180, Easing.suave);
  }

  /**
   * A peça cruzou a casa do espaço — decisão DEFINITIVA de mandá-la pra uma
   * trilha (ver doc da classe `GameScene`: "commit imediato, sem volta
   * atrás"). Fica "em escolha" (some da grade, ainda não é de nenhuma
   * trilha) enquanto uma seta nasce sobre cada coluna disponível. A bandeja
   * ficou com uma peça a menos — `_recompactarGrade` encolhe a grade pro
   * tamanho certo de novo (ver doc de `_montarGrade` pro porquê disso ser
   * necessário).
   */
  _sairPelaEspaco(peca) {
    const posEspaco = this._posicaoCelula(this._espacoLinha, this._espacoColuna);
    this._recompactarGrade();

    peca.linha = -1; peca.coluna = -1;
    this._pecaEmEscolha = peca;
    this._escolhendoColuna = true;
    peca.paraFrente();
    Tween.removerDe(peca);
    Tween.para(peca, {
      x: posEspaco.x, y: posEspaco.y + this._layout.tam * 0.7, scaleX: 1.15, scaleY: 1.15,
    }, 240, Easing.suaveSaida);
    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
    this._mostrarSetas(true);
  }

  /** Mostra (ou esconde) a seta de "solte aqui" sobre cada trilha ainda não cheia. */
  _mostrarSetas(mostrar) {
    for (const seta of this._setas) { Tween.removerDe(seta); seta.removerDoPai(); }
    this._setas = [];
    if (!mostrar) return;
    for (const trilha of this._trilhas) {
      if (trilha.completa()) continue;
      const seta = new SetaColuna({ x: trilha.x + trilha.largura / 2, y: trilha.y - 36 });
      this.area.adicionar(seta);
      seta.on('toque', () => this._escolherColuna(trilha));
      const yBase = seta.y;
      Tween.de(seta)
        .entao({ y: yBase - 10 }, 420, Easing.suave)
        .entao({ y: yBase }, 420, Easing.suave)
        .emLaco(true);
      this._setas.push(seta);
    }
  }

  /** Toque numa seta (etapa 2) — 1 toque = 1 decisão, sem passo de confirmar à parte. */
  _escolherColuna(trilha) {
    if (!this._pecaEmEscolha || this.pausada || this._aguardandoAvanco) return;
    if (trilha.completa()) return;
    const peca = this._pecaEmEscolha;
    this._pecaEmEscolha = null;
    this._escolhendoColuna = false;
    this._mostrarSetas(false);
    this._encaixarLivre(peca, trilha);
  }

  /**
   * Encaixe LIVRE: a peça entra na posição vazia mais baixa da trilha
   * escolhida, CERTA OU ERRADA — nada é validado aqui, só quando a criança
   * confirma (`_confirmar`).
   */
  _encaixarLivre(peca, trilha) {
    const indice = trilha.indiceVazio();
    const pos = trilha._centroDoSlot(indice);
    trilha.pecas[indice] = peca;
    peca.trilha = trilha;
    peca.indiceTrilha = indice;
    peca.trancada = true;
    Tween.removerDe(peca);
    Tween.para(peca, {
      x: pos.x, y: pos.y, scaleX: 1, scaleY: 1,
    }, 220, Easing.suaveSaida);
    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
  }

  /**
   * Toque na peça do TOPO de uma trilha (ver `_ligarTogues`) — só sai de
   * verdade se o ESPAÇO da grade estiver livre NESTE instante: é a mesma
   * porta usada pros dois sentidos (ver doc da classe `GameScene`). Se
   * alguma outra peça está ocupando o espaço agora, só um tremor avisa
   * "ainda não dá" — nunca um erro de verdade.
   */
  _tentarRetirarDaTrilha(trilha, indice) {
    // Checa a própria casa do espaço DIRETO — nunca via "ache o vazio da
    // grade" (`_celulaVazia`): essa pergunta só faz sentido quando existe
    // exatamente 1 vazio, e é exatamente essa garantia que está sendo
    // verificada aqui (depende de toda retirada/saída passar por
    // `_montarGrade`/`_recompactarGrade` — ver doc de lá).
    const espacoLivre = this._grade[this._espacoLinha][this._espacoColuna] === null;
    if (!espacoLivre) {
      this._sacudirPeca(trilha.pecas[indice]);
      return;
    }
    const peca = trilha.pecas[indice];
    trilha.pecas[indice] = null;
    peca.trilha = null;
    peca.indiceTrilha = -1;
    peca.trancada = false;
    // A bandeja ganhou uma peça de volta — `_recompactarGrade` cresce a
    // grade pro tamanho certo (ver doc de `_montarGrade`) e já anima todo
    // mundo, inclusive esta peça, pro slot dela.
    this._grade[this._espacoLinha][this._espacoColuna] = peca;
    peca.linha = this._espacoLinha;
    peca.coluna = this._espacoColuna;
    this._recompactarGrade();
  }

  /** Tremor pequeno — feedback de "ainda não dá", nunca punitivo (ver `_sacudirErro`, o irmão deste pro botão Confirmar). */
  _sacudirPeca(peca) {
    const xBase = peca.x;
    Tween.removerDe(peca);
    Tween.de(peca)
      .entao({ x: xBase - 6 }, 50, Easing.suaveSaida)
      .entao({ x: xBase + 6 }, 70, Easing.suave)
      .entao({ x: xBase }, 50, Easing.suaveSaida);
  }

  // -------------------------------------------------------------- confirmar

  /**
   * Compara o tabuleiro INTEIRO com a cartela. Certo: acende a estrela da
   * rodada e, depois de um instante, uma cartela nova nasce (ou a vitória,
   * se já bateu a meta). Errado: só demora mais (RE-02) — a partir do 3º
   * erro seguido NESTA cartela, mostra a dica (`_mostrarDicaTabuleiro`).
   */
  _confirmar() {
    if (this.placar.encerrado || this.pausada || this._aguardandoAvanco || this._escolhendoColuna) return;

    const correto = this._trilhas.every((trilha) => trilha.pecas.every((peca, i) => (
      peca && peca.forma === trilha.sequencia[i].forma && peca.cor === trilha.sequencia[i].cor
    )));

    if (correto) {
      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
      this.placar.acertar(1);
      this._estrelas.atual = this._rodadaIndex + 1;
      this._aguardandoAvanco = true;
      if (!this.placar.encerrado) {
        Tween.de(this).esperar(ESPERA_AVANCO).chamar(() => this._avancarRodada());
      }
      return;
    }

    this._tentativasErradas += 1;
    this._errosRodada += 1;
    if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    this._sacudirErro();

    if (this._errosRodada >= ERROS_PARA_DICA) {
      this._mostrarDicaTabuleiro();
    }
  }

  /** Feedback de "ainda não" — o tabuleiro balança de leve, sem som novo nem trava (nunca punitivo). */
  _sacudirErro() {
    const xBase = this._painelDireita.x;
    Tween.removerDe(this._painelDireita);
    Tween.de(this._painelDireita)
      .entao({ x: xBase - 10 }, 55, Easing.suaveSaida)
      .entao({ x: xBase + 10 }, 80, Easing.suave)
      .entao({ x: xBase - 5 }, 70, Easing.suave)
      .entao({ x: xBase }, 60, Easing.suaveSaida);

    Tween.removerDe(this.botaoConfirmar);
    Tween.de(this.botaoConfirmar)
      .entao({ x: this._xBaseConfirmar - 10 }, 55, Easing.suaveSaida)
      .entao({ x: this._xBaseConfirmar + 10 }, 80, Easing.suave)
      .entao({ x: this._xBaseConfirmar - 5 }, 70, Easing.suave)
      .entao({ x: this._xBaseConfirmar }, 60, Easing.suaveSaida);
  }

  _avancarRodada() {
    this._aguardandoAvanco = false;
    this._rodadaIndex += 1;
    this._novaCartela();
  }

  // --------------------------------------------------------------- a dica

  /**
   * Degrau único da dica (ver `ERROS_PARA_DICA`): o holofote liga, o
   * tabuleiro se monta SOZINHO com a composição certa (peças fantasma, em
   * cascata, nas 5 trilhas em paralelo), fica montado um instante, desmonta
   * na mesma cascata invertida e some — as peças REAIS da criança nunca são
   * tocadas, só ficam escondidas (`visible = false`) enquanto os fantasmas
   * mostram a resposta, e reaparecem exatamente como estavam depois. Nunca
   * confirma a cartela sozinha, só mostra; repete a cada novo erro.
   */
  _mostrarDicaTabuleiro() {
    this._aguardandoAvanco = true;
    this._mostrarVeuDica(true);

    const profundidade = this.nivel.profundidade;
    const pecasOcultas = [];
    const fantasmas = [];

    for (const trilha of this._trilhas) {
      for (const peca of trilha.pecas) {
        if (peca) { peca.visible = false; pecasOcultas.push(peca); }
      }
      trilha.sequencia.forEach((cel, i) => {
        const pos = trilha._centroDoSlot(i);
        const fantasma = new Peca(cel.forma, cel.cor, this._tamPeca);
        fantasma.interativo = false;
        fantasma.x = pos.x;
        fantasma.y = pos.y;
        fantasma.scaleX = 0;
        fantasma.scaleY = 0;
        this.area.adicionar(fantasma);
        fantasmas.push(fantasma);
        Tween.de(fantasma)
          .esperar(i * ATRASO_ENTRE_PECAS)
          .chamar(() => { if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto); })
          .entao({ scaleX: 1, scaleY: 1 }, DURACAO_POP, Easing.costasSaida);
      });
    }

    const duracaoEntrada = (profundidade - 1) * ATRASO_ENTRE_PECAS + DURACAO_POP;
    const duracaoSaida = (profundidade - 1) * ATRASO_ENTRE_PECAS + DURACAO_SAIDA;

    Tween.de(this)
      .esperar(duracaoEntrada + ESPERA_MONTADA)
      .chamar(() => {
        fantasmas.forEach((fantasma, indice) => {
          const i = indice % profundidade;
          Tween.de(fantasma)
            .esperar(i * ATRASO_ENTRE_PECAS)
            .entao({ scaleX: 0, scaleY: 0 }, DURACAO_SAIDA, Easing.suaveEntrada);
        });
      })
      .esperar(duracaoSaida)
      .chamar(() => {
        for (const fantasma of fantasmas) fantasma.removerDoPai();
        for (const peca of pecasOcultas) peca.visible = true;
        this._mostrarVeuDica(false);
        this._aguardandoAvanco = false;
      });
  }

  /**
   * Retângulo (em coordenadas da CENA) em volta do tabuleiro de madeira —
   * `this._painelDireita` é filho de `this.area`, por isso soma `area.x/y`.
   */
  _areaTabuleiroNaCena() {
    const pad = 16;
    return {
      x: this.area.x + this._painelDireita.x - pad,
      y: this.area.y + this._painelDireita.y - pad,
      largura: this._painelDireita.largura + pad * 2,
      altura: this._painelDireita.altura + pad * 2,
      raio: 20,
    };
  }

  /** Liga/desliga o holofote com uma transição suave (nunca de golpe). */
  _mostrarVeuDica(mostrar) {
    Tween.removerDe(this._veuDica);
    if (mostrar) {
      this._veuDica.buraco = this._areaTabuleiroNaCena();
      this._veuDica.paraFrente();
    }
    Tween.para(this._veuDica, { alpha: mostrar ? 1 : 0 }, 260, Easing.suave);
  }

  _celebrarCompleto() {
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    Tween.de(this).esperar(600).chamar(() => this._terminar(true));
  }

  // ------------------------------------------------------------------- HUD

  _pausar() {
    if (this.placar.encerrado) return;
    this._cancelarArrastoEmCurso();
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  _pedirAjuda() {
    if (this.placar.encerrado || this.pausada) return;
    this._cancelarArrastoEmCurso();
    Tween.pausarTodos();
    this.pausada = true;
    this.ajuda.abrir();
  }

  _cancelarArrastoEmCurso() {
    if (!this._arrastando) return;
    const peca = this._arrastando;
    this._arrastando = null;
    peca.arrastando = false;
    peca.scaleX = 1; peca.scaleY = 1;
    Tween.removerDe(peca);
    const pos = this._posicaoCelula(this._origemArrasto.linha, this._origemArrasto.coluna);
    peca.x = pos.x;
    peca.y = pos.y;
  }

  _terminar(venceu) {
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: { ...this.placar.paraAva(venceu), erros: this._tentativasErradas },
    });
  }

  atualizar(dt) {
    if (this.pausada) {
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }
    super.atualizar(dt);
    this._atualizarRelogio();
  }

  _atualizarRelogio() {
    const total = Math.floor(this.game.tempoJogando);
    if (total === this._relogioSegundoMostrado) return;
    this._relogioSegundoMostrado = total;
    this._atualizarTextoHud();
  }

  _atualizarTextoHud() {
    if (!this._relogioTexto) return;
    const total = this._relogioSegundoMostrado;
    const min = Math.floor(total / 60);
    const seg = total % 60;
    this._relogioTexto.texto = `${min}:${String(seg).padStart(2, '0')}`;
  }
}
