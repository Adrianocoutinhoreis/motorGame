import {
  Scene, Node, TextNode, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores, espaco,
} from '../../engine/index.js';

/**
 * Caminho das Cores — mecânica de COPIAR UM PADRÃO, não de classificar por
 * cor (correção do humano durante o planejamento, depois de uma primeira
 * leitura errada do vídeo).
 *
 * Uma CARTELA mostra, numa coluna por trilha, a sequência exata de peças
 * (formato E cor, não só cor) que aquela trilha precisa reproduzir, de baixo
 * pra cima. A criança arrasta peças soltas da BANDEJA até QUALQUER trilha,
 * em QUALQUER ordem — "encaixe livre" (mesmo mecanismo do Colmeia dos
 * Números): nada é validado no instante do encaixe, só quando ela mesma
 * toca CONFIRMAR. Se o tabuleiro inteiro bater com a cartela, a estrela da
 * rodada acende e uma cartela NOVA nasce (até completar a meta do nível —
 * igual ao Material Dourado: várias rodadas, uma estrela por rodada). Se não
 * bater, só demora mais (RE-02: nunca desconta) — a partir do 3º erro
 * seguido NESTA cartela, o jogo mostra a composição certa se montando
 * sozinha no tabuleiro (holofote + cascata, como no Material Dourado) e
 * depois volta pro que a criança tinha, pra ela mesma corrigir.
 *
 * Ao contrário do Encaixe Certo/Quantidade Certa, aqui NÃO existe encaixe
 * geométrico (nó/entalhe) — no brinquedo físico qualquer peça cabe
 * fisicamente em qualquer trilha; quem filtra é a comparação com a cartela,
 * não a forma da peça. O ímã/tolerância de arrasto e o algoritmo de várias
 * fileiras da bandeja (`porLinha`) são reaproveitados do Quantidade Certa.
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
 * volta pra bandeja), só não pode mais ser ARRASTADA. Sem papel nenhum até
 * ser colocada — nada é validado no instante do encaixe (encaixe livre, ver
 * doc da classe `GameScene`), só quando a própria criança confirma.
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
    this.trayX = 0;
    this.trayY = 0;
    /** @type {Trilha|null} a trilha onde está encaixada, ou `null` se solta na bandeja. */
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
    this.destacada = false;
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

  /** Posição do próximo encaixe vazio (a mais baixa), ou `null` se já está cheia. */
  posicaoProximoEncaixe() {
    const i = this.indiceVazio();
    return i === -1 ? null : this._centroDoSlot(i);
  }

  /**
   * SEM silhueta do que falta — nem formato, nem contorno pontilhado. Mostrar
   * a forma esperada na própria trilha entregava a resposta de graça. O
   * canal de madeira em si é pintado pelo `TabuleiroVisual`, por baixo; as
   * peças já colocadas são NÓS DE VERDADE (`Peca`, filhos da mesma `area`,
   * ver `GameScene`), não algo que a trilha desenha — aqui só sobra o realce
   * de arrasto.
   */
  desenhar(ctx) {
    if (this.destacada) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath();
      ctx.roundRect(0, 0, this.largura, this.altura, 10);
      ctx.fill();
      ctx.restore();
    }
  }
}

/**
 * Tabuleiro visual imitando o painel físico de MDF do vídeo — paredes
 * (madeira clara) de VERDADE entre a bandeja e as trilhas, e entre as 5
 * colunas: pedido do humano depois de ver o tabuleiro sem nenhuma linha —
 * sem elas à vista, a colisão de `GameScene._moverArrasto` (a peça arrastada
 * não atravessa esses mesmos vãos) fica sem nenhuma pista visual do PORQUÊ a
 * peça trava ali. As paredes aqui são exatamente os vãos que a colisão
 * respeita (`gapTrilha`/`espessuraDivisor`) — nunca só decoração.
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
    // entre elas (a cor de fundo mostrando por baixo) É a parede — a mesma
    // largura (`gapTrilha`) e altura (`espessuraDivisor`) que
    // `GameScene._moverArrasto`/`_dentroDoCanal` usam pra travar o arrasto.
    ctx.fillStyle = this.corCanaleta;

    // A. Piscina no topo
    const piscinaX = this.padPanelX;
    const piscinaY = this.padPanelTopo;
    const piscinaW = this.largura - this.padPanelX * 2;
    const piscinaH = this.alturaBandeja;
    ctx.fillRect(piscinaX, piscinaY, piscinaW, piscinaH);

    // B. Canaleta Horizontal
    const chY = piscinaY + piscinaH + this.espessuraDivisor;
    const chH = this.alturaCanaletaHoriz;
    ctx.fillRect(piscinaX, chY, piscinaW, chH);

    // C. Buraco na esquerda (ligação da piscina com a canaleta horizontal)
    const larguraColuna = (piscinaW - (this.numTrilhas - 1) * this.gapTrilha) / this.numTrilhas;
    const inicioXTrilhas = piscinaX;
    const buracoW = larguraColuna + 16;
    ctx.fillRect(inicioXTrilhas - 8, piscinaY + piscinaH, buracoW, this.espessuraDivisor);

    // D. Trilhas verticais
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
    this._painelDireita = new TabuleiroVisual({
      largura: this._layout.boardWidth,
      altura: this._layout.boardHeight,
      tamPeca: this._layout.tam,
      gapTrilha: this._layout.gapTrilha,
      padPanelX: this._layout.padPanelX,
      padPanelTopo: this._layout.padPanelTopo,
      alturaBandeja: this._layout.alturaBandeja,
      numTrilhas: nivel.trilhas,
    });
    this._painelDireita.x = this._boardX;
    this._painelDireita.y = this._boardY;
    this.area.adicionar(this._painelDireita);

    // O "buraco" — a ÚNICA abertura ligando a bandeja (piscina) ao corredor
    // horizontal por baixo dela (ver `TabuleiroVisual`, item C do desenho:
    // mesma conta, mesmas coordenadas, só que aqui é pra COLISÃO, não pra
    // pintar). Fora dessa faixa de X, a linha entre a piscina e o corredor é
    // uma parede — `_moverArrasto` só deixa a peça descer por ali.
    const piscinaW = this._layout.boardWidth - this._layout.padPanelX * 2;
    const larguraColunaBuraco = (piscinaW - (nivel.trilhas - 1) * this._layout.gapTrilha) / nivel.trilhas;
    this._buracoXMin = this._boardX + this._layout.padPanelX - 8;
    this._buracoXMax = this._buracoXMin + larguraColunaBuraco + 16;
    this._limitePiscina = this._boardY + this._layout.padPanelTopo + this._layout.alturaBandeja;

    this._pecas = [];
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
    for (const p of this._pecas) p.removerDoPai();
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

    // peças soltas, no topo do painel
    const pecasDados = rand.embaralhar([...sequencias.flat(), ...distratoras]);
    this._pecas = [];
    const celulaBandeja = layout.tam + layout.gapBandeja;
    pecasDados.forEach((dado, indice) => {
      const linha = Math.floor(indice / layout.porLinha);
      const inicioLinha = linha * layout.porLinha;
      const nestaLinha = Math.min(layout.porLinha, pecasDados.length - inicioLinha);
      const coluna = indice - inicioLinha;
      const larguraLinha = nestaLinha * layout.tam + (nestaLinha - 1) * layout.gapBandeja;

      const piscinaW = layout.boardWidth - layout.padPanelX * 2;
      const inicioX = this._boardX + layout.padPanelX + (piscinaW - larguraLinha) / 2 + layout.tam / 2;
      const topoY = this._boardY + layout.padPanelTopo + layout.tam / 2;

      const peca = new Peca(dado.forma, dado.cor, layout.tam);
      const px = inicioX + coluna * celulaBandeja;
      const py = topoY + linha * (layout.tam + layout.gapBandeja);
      peca.x = px; peca.y = py;
      peca.trayX = px; peca.trayY = py;
      this.area.adicionar(peca);
      this._pecas.push(peca);
      this._ligarTogues(peca);
    });

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
      const totalLinhas = Math.ceil(totalPecasBandeja / porLinha);
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
      const totalLinhas = Math.ceil(totalPecasBandeja / porLinha);
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
   * Liga tanto o ARRASTO (peça solta na bandeja, `apertar` inicia) quanto o
   * TOQUE de remover (peça já encaixada numa trilha — só funciona se for a
   * do TOPO da pilha dela). A mesma peça usa os dois conforme `trancada`.
   */
  _ligarTogues(peca) {
    peca.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando || this._aguardandoAvanco) return;
      if (peca.trancada) return; // já numa trilha: sai por toque, não por arrasto
      const local = this.area.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = peca.x - local.x;
      this._deslocY = peca.y - local.y;
      peca.arrastando = true;
      peca.paraFrente();
      Tween.removerDe(peca);
      Tween.para(peca, { scaleX: 1.1, scaleY: 1.1 }, 100, Easing.suaveSaida);
      this._arrastando = peca;
      // Nenhum canal travado ainda e ainda não cruzou o buraco — a peça
      // começa na bandeja, área aberta (ver `_moverArrasto`).
      this._canalPreso = null;
      this._passouBuraco = false;
    });

    peca.on('toque', () => {
      // O Input dispara 'toque' sempre que apertar e soltar caem no MESMO nó
      // — e uma peça ARRASTADA continua embaixo do dedo até soltar, então
      // todo arrasto bem-sucedido termina com um 'toque' nela também, no
      // mesmo gesto. `_ultimaPecaEncaixada` (setado em `_encaixarLivre`,
      // chamado ANTES deste handler na mesma sequência síncrona do Input)
      // marca exatamente esse caso pra ignorar — sem isso, encaixar uma peça
      // a desencaixava no ato.
      if (this._ultimaPecaEncaixada === peca) { this._ultimaPecaEncaixada = null; return; }
      if (this.pausada || this.placar.encerrado || this._aguardandoAvanco) return;
      if (!peca.trancada) return;
      const trilha = peca.trilha;
      if (!trilha || trilha.indiceTopo() !== peca.indiceTrilha) return; // só o topo sai
      this._removerDaTrilha(trilha, peca.indiceTrilha);
    });
  }

  /** O ponto `x` cai dentro da largura do canal desta trilha? */
  _dentroDoCanal(trilha, x) {
    return x >= trilha.x && x <= trilha.x + trilha.largura;
  }

  /**
   * Canal cujo CENTRO está mais perto de `x` — usado só no instante em que a
   * peça cruza a linha do divisor vindo de cima (ver `_moverArrasto`), pra
   * decidir em qual dos 5 ela "entra".
   */
  _canalMaisProximo(x) {
    let melhor = this._trilhas[0];
    let menor = Infinity;
    for (const trilha of this._trilhas) {
      const centro = trilha.x + trilha.largura / 2;
      const d = Math.abs(x - centro);
      if (d < menor) { menor = d; melhor = trilha; }
    }
    return melhor;
  }

  /** Raio do ÍMÃ (puxão suave pro slot exato depois de já estar dentro de um canal). */
  _raioTolerancia() { return this._tamPeca * 0.75; }

  /**
   * "Colisão com as paredes" de verdade, em TRÊS zonas (não é só uma checagem
   * na hora de soltar, o próprio ARRASTO é travado):
   *
   *   1) BANDEJA (piscina) — acima de `_limitePiscina`: livre, nenhuma
   *      parede ali, a peça anda pra qualquer lado.
   *   2) A linha da bandeja pro corredor só tem UMA abertura — o "buraco"
   *      (`_buracoXMin`/`_buracoXMax`, mesma posição que `TabuleiroVisual`
   *      desenha). Fora dessa faixa de X, aquela linha é parede: a peça não
   *      desce, fica presa bem em cima dela (`_passouBuraco` controla isso —
   *      só vira `true` no instante em que ela cruza DENTRO da faixa do
   *      buraco, e volta a `false` se ela subir de novo pra bandeja).
   *   3) Depois do buraco, o CORREDOR horizontal (entre a linha da bandeja e
   *      o topo das trilhas) liga a TODAS as 5 — livre em X. Só ao descer
   *      mais, pra DENTRO de uma trilha, a peça TRAVA no canal mais alinhado
   *      com onde estava (`_canalPreso`) e o `x` fica PRESO na largura desse
   *      canal até voltar pro corredor — nunca escorrega por cima da parede
   *      lateral pra uma trilha vizinha, mesmo arrastando bem devagar.
   *
   * Pedido do humano: "a regra é arrastar até passar pelo espaço inicial,
   * não poderá passar por cima" (o buraco) — igual ao Jogo da Ordenação não
   * deixar uma ficha atravessar pra uma casa não-vizinha.
   */
  _moverArrasto(ponto) {
    const peca = this._arrastando;
    if (!peca) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    let novoX = local.x + this._deslocX;
    let novoY = local.y + this._deslocY;

    const topoTrilhas = this._trilhas[0].y;
    const fundoTrilhas = topoTrilhas + this._trilhas[0].altura;

    if (novoY <= this._limitePiscina) {
      // Bandeja — livre, e ainda não cruzou o buraco (se tinha cruzado antes
      // e voltou pra cima, precisa cruzar de novo pra descer outra vez).
      this._passouBuraco = false;
      this._canalPreso = null;
    } else {
      if (!this._passouBuraco) {
        if (novoX >= this._buracoXMin && novoX <= this._buracoXMax) {
          this._passouBuraco = true;
        } else {
          novoY = this._limitePiscina; // parede — não desce fora do buraco
        }
      }
      if (this._passouBuraco) {
        if (novoY <= topoTrilhas) {
          // Corredor horizontal — livre em X, liga a qualquer trilha.
          this._canalPreso = null;
        } else {
          if (!this._canalPreso) this._canalPreso = this._canalMaisProximo(novoX);
          const canal = this._canalPreso;
          novoX = Math.min(Math.max(novoX, canal.x), canal.x + canal.largura);
          novoY = Math.min(novoY, fundoTrilhas);
        }
      }
    }

    peca.x = novoX;
    peca.y = novoY;

    const alvo = this._canalPreso && !this._canalPreso.completa() ? this._canalPreso : null;
    for (const trilha of this._trilhas) trilha.destacada = trilha === alvo;

    if (alvo) {
      const posAlvo = alvo.posicaoProximoEncaixe();
      const dx = posAlvo.x - peca.x;
      const dy = posAlvo.y - peca.y;
      const raio = this._raioTolerancia();
      const forca = 1 - Math.sqrt(dx * dx + dy * dy) / raio;
      const FATOR_IMA = 0.3;
      peca.x += dx * forca * FATOR_IMA;
      peca.y += dy * forca * FATOR_IMA;
    }
  }

  /**
   * Encaixe LIVRE: solta dentro de um canal com espaço e a peça entra na
   * posição vazia mais baixa DELE, CERTA OU ERRADA — nada é validado aqui, só
   * quando a criança confirma (`_confirmar`). Como `_moverArrasto` já travou
   * o `x` dentro do canal (`_canalPreso`) o tempo todo, chegar aqui fora de
   * um canal só acontece se a peça nunca cruzou o divisor (solta ainda na
   * bandeja) — nesse caso só volta pra bandeja (nunca treme feio: errar não
   * existe mais nesta etapa, só ao confirmar).
   */
  _soltarArrasto() {
    const peca = this._arrastando;
    if (!peca) return;
    this._arrastando = null;
    peca.arrastando = false;
    for (const trilha of this._trilhas) trilha.destacada = false;
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    const alvo = this._canalPreso;
    this._canalPreso = null;
    if (alvo && !alvo.completa()) {
      this._encaixarLivre(peca, alvo);
      return;
    }
    this._voltarPraBandeja(peca);
  }

  _encaixarLivre(peca, trilha) {
    const indice = trilha.indiceVazio();
    const pos = trilha._centroDoSlot(indice);
    trilha.pecas[indice] = peca;
    peca.trilha = trilha;
    peca.indiceTrilha = indice;
    peca.trancada = true;
    // Ver `_ligarTogues`: o 'toque' que o Input dispara logo depois deste
    // mesmo soltar (apertou e soltou na peça = mesmo nó) precisa ser
    // ignorado, senão desfaz o encaixe que acabou de acontecer.
    this._ultimaPecaEncaixada = peca;
    this._pecas = this._pecas.filter((p) => p !== peca);
    Tween.removerDe(peca);
    Tween.para(peca, { x: pos.x, y: pos.y }, 160, Easing.suaveSaida);
    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
  }

  /** Tira a peça do topo da pilha e devolve pra bandeja (ver `_ligarTogues`). */
  _removerDaTrilha(trilha, indice) {
    const peca = trilha.pecas[indice];
    trilha.pecas[indice] = null;
    peca.trilha = null;
    peca.indiceTrilha = -1;
    peca.trancada = false;
    this._pecas.push(peca);
    Tween.removerDe(peca);
    Tween.para(peca, { x: peca.trayX, y: peca.trayY }, 200, Easing.suaveSaida);
  }

  /** Volta pra bandeja sem feedback de erro — soltar fora de alcance não é "errar", só não fez nada ainda. */
  _voltarPraBandeja(peca) {
    Tween.removerDe(peca);
    Tween.para(peca, { x: peca.trayX, y: peca.trayY }, 220, Easing.suaveSaida);
  }

  // -------------------------------------------------------------- confirmar

  /**
   * Compara o tabuleiro INTEIRO com a cartela. Certo: acende a estrela da
   * rodada e, depois de um instante, uma cartela nova nasce (ou a vitória,
   * se já bateu a meta). Errado: só demora mais (RE-02) — a partir do 3º
   * erro seguido NESTA cartela, mostra a dica (`_mostrarDicaTabuleiro`).
   */
  _confirmar() {
    if (this.placar.encerrado || this.pausada || this._aguardandoAvanco) return;

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
    this._canalPreso = null;
    this._passouBuraco = false;
    peca.arrastando = false;
    peca.scaleX = 1; peca.scaleY = 1;
    for (const trilha of this._trilhas ?? []) trilha.destacada = false;
    peca.x = peca.trayX;
    peca.y = peca.trayY;
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
