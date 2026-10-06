import {
  Scene, Node, ScoreSystem, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores, espaco,
} from '../../engine/index.js';

/**
 * Caminho das Cores — mecânica de COPIAR UM PADRÃO, não de classificar por
 * cor (correção do humano durante o planejamento, depois de uma primeira
 * leitura errada do vídeo).
 *
 * Uma CARTELA fixa (`CartelaPainel`) mostra, numa coluna por trilha, a
 * sequência exata de peças (formato E cor, não só cor) que aquela trilha
 * precisa reproduzir, de baixo pra cima. A criança arrasta peças soltas da
 * BANDEJA até a trilha certa — cada trilha (`Trilha`) é um "poço" que só
 * aceita a PRÓXIMA peça da sequência: soltar a peça certa fora de ordem, ou
 * numa trilha errada, treme e volta, exatamente como soltar a peça errada.
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
 *   - Sem vidas, sem derrota — errar a ordem só demora mais.
 *   - A rodada inteira (todas as trilhas + toda a bandeja) aparece de uma vez,
 *     igual ao brinquedo físico — ao contrário do Quantidade Certa, aqui não
 *     há "ondas".
 */

const FORMAS = ['circulo', 'quadrado', 'triangulo', 'pentagono'];
const CORES_BANCO = [
  cores.ludica.vermelho, cores.ludica.laranja, cores.ludica.amarelo,
  cores.ludica.verde, cores.ludica.azul, cores.ludica.roxo,
];

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

/** Peça solta e arrastável — um formato numa cor, sem papel nenhum até cair numa trilha. */
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
 * Trilha — um "poço" vertical que só aceita a PRÓXIMA peça da sua sequência,
 * de baixo pra cima (índice 0 = fundo, cresce pra cima — igual à física do
 * brinquedo: a peça cai pro espaço vazio mais baixo). Desenha ela mesma tanto
 * as posições já preenchidas (cor sólida) quanto as vazias (fantasma
 * pontilhado) — a peça arrastada é removida da cena assim que trava; quem
 * fica representando o resultado é a própria trilha.
 */
class Trilha extends Node {
  /**
   * `larguraColuna` é a largura VISUAL do canal de madeira (estica pra
   * preencher o tabuleiro, sem sobra nas laterais — correção pedida pelo
   * humano com um X vermelho na referência) — pode ser bem maior que `tam`
   * (o tamanho da peça); a peça sempre fica CENTRALIZADA dentro da coluna,
   * nunca esticada/achatada. Sem o parâmetro, cai de volta pra `tam` (mesmo
   * de antes).
   */
  constructor(sequencia, tam, gapSlot, padY, larguraColuna) {
    const altura = sequencia.length * tam + (sequencia.length - 1) * gapSlot + padY * 2;
    const largura = larguraColuna ?? tam;
    super({ largura, altura });
    this.sequencia = sequencia;
    this.tam = tam;
    this.gapSlot = gapSlot;
    this.padY = padY;
    this.proximo = 0;
    this.destacada = false;
  }

  completa() { return this.proximo >= this.sequencia.length; }

  /** Centro (em coordenadas do PAI, já somando `this.x/y`) do slot de índice `i`. */
  _centroDoSlot(i) {
    return {
      x: this.x + this.largura / 2,
      y: this.y + this.altura - this.padY - this.tam / 2 - i * (this.tam + this.gapSlot),
    };
  }

  /** Posição do PRÓXIMO encaixe vazio, ou `null` se a trilha já está completa. */
  posicaoProximoEncaixe() {
    if (this.completa()) return null;
    return this._centroDoSlot(this.proximo);
  }

  /**
   * SEM silhueta do que falta — nem formato, nem contorno pontilhado. Mostrar
   * a forma esperada na própria trilha entregava a resposta de graça (bastava
   * casar o contorno, sem nunca olhar pra cartela) — quem decide o que vai em
   * cada posição é SEMPRE a cartela. O canal de madeira em si (a cor marrom
   * da coluna) é pintado pelo `TabuleiroVisual`, por baixo; aqui só sobram as
   * peças já travadas e o realce de arrasto.
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

    for (let i = 0; i < this.proximo; i++) {
      const cel = this.sequencia[i];
      const cy = this.altura - this.padY - this.tam / 2 - i * (this.tam + this.gapSlot);
      ctx.save();
      ctx.translate((this.largura - this.tam) / 2, cy - this.tam / 2);
      tracarForma(ctx, cel.forma, this.tam);
      ctx.fillStyle = cel.cor;
      ctx.fill();
      ctx.restore();
    }
  }
}

/** Tabuleiro visual imitando o painel físico de MDF do vídeo. */
class TabuleiroVisual extends Node {
  constructor(opcoes) {
    super(opcoes);
    this.corFundo = '#E1D3C1'; // Madeira clara
    this.corCanaleta = '#8A6E59'; // Madeira escura/fundo

    this.tamPeca = opcoes.tamPeca;
    this.gapTrilha = opcoes.gapTrilha;
    this.padPanelX = opcoes.padPanelX;
    this.padPanelTopo = opcoes.padPanelTopo;
    this.alturaBandeja = opcoes.alturaBandeja;
    this.espessuraDivisor = 10;
    this.numTrilhas = opcoes.numTrilhas;
    this.alturaCanaletaHoriz = this.tamPeca + 12;
    this.gapSlot = opcoes.gapSlot;
    this.padTrilhaY = opcoes.padTrilhaY;
    this.profundidade = opcoes.profundidade;
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

    // 2. Canaletas (Madeira Escura)
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
    // As colunas agora ESTICAM pra preencher `piscinaW` inteira (sem sobra nas
    // laterais — correção pedida pelo humano com um X vermelho na referência,
    // ver `Trilha`/`_construirRodada`), em vez de uma grade estreita do
    // tamanho da PEÇA centralizada com folga morta dos dois lados.
    const larguraColuna = (piscinaW - (this.numTrilhas - 1) * this.gapTrilha) / this.numTrilhas;
    const inicioXTrilhas = piscinaX;
    const buracoW = larguraColuna + 16;
    ctx.fillRect(inicioXTrilhas - 8, piscinaY + piscinaH, buracoW, this.espessuraDivisor);

    // D. Trilhas verticais
    for (let i = 0; i < this.numTrilhas; i++) {
       const tx = inicioXTrilhas + i * (larguraColuna + this.gapTrilha);
       const ty = chY + chH;
       const tw = larguraColuna;
       // Trilha vai até o fundo do tabuleiro
       const th = this.altura - this.padPanelX - ty;
       ctx.fillRect(tx, ty, tw, th);
    }
    
    // Sombras internas nas canaletas para dar profundidade (opcional)
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



/** Badge do cronômetro — mesmo visual do Encaixe Certo/Quantidade Certa. */
class RelogioBadge extends Node {
  constructor({ x, y, largura = 170, altura = 50 }) {
    super({
      x, y, largura, altura, regX: largura / 2, regY: altura / 2,
    });
    this.texto = '0:00';
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, this.altura / 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.font = '800 24px Outfit, system-ui, sans-serif';
    const textWidth = ctx.measureText(this.texto).width;
    const raio = 12;
    const espacoIconeTexto = 10;
    const larguraConjunto = raio * 2 + espacoIconeTexto + textWidth;
    const inicioX = (this.largura - larguraConjunto) / 2;
    const cx = inicioX + raio;
    const cy = this.altura / 2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 6);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.texto, cx + raio + espacoIconeTexto, cy + 1);
    ctx.restore();
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
    this.placar = new ScoreSystem({ total: this.nivel.trilhas, nivel: this.nivel.id ?? 1 });

    // Tentativa errada (peça errada, ou fora de ordem) só é registrada pro
    // relatório do AVA — nunca desconta acertos nem estrelas (RE-02).
    this._tentativasErradas = 0;

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo ?? '#2E2150',
      corCeuBase: config.corCeuBase ?? '#2E2150',
      mostrarDecoracoes: false,
      mostrarChao: false,
    }));

    const margemLateral = 44;
    if (this._desktop) {
      // No computador os botões viram uma COLUNA na lateral DIREITA (ver HUD
      // abaixo) — reservar espaço à direita, e não à esquerda, deixa a área de
      // conteúdo (cartela + tabuleiro) encostada na borda esquerda, com o
      // tabuleiro caindo bem mais perto do centro real da tela — antes, com a
      // coluna reservada à esquerda, o grupo inteiro (já centralizado DENTRO
      // da área sobrando) ficava deslocado pra direita como um todo, porque a
      // área em si começava depois da coluna. Pedido do humano com um
      // mockup: cartela quase na borda, tabuleiro mais ao meio, botões no
      // canto oposto.
      this._topo = espaco.md;
      // Zona reservada à direita pros botões — bem mais larga que o próprio
      // botão (72+32=104): a referência mais recente mostra um vão GRANDE
      // entre o tabuleiro e a borda direita, não só o espaço mínimo do
      // ícone. Reservar essa zona encolhe `areaLargura`, e é isso que faz a
      // busca de `tam` (em `_calcularLayoutDesktop`) escolher peças/colunas
      // mais estreitas — sem isso, cartela+tabuleiro quase preenchem a tela
      // toda e não sobra vão nenhum pra reservar, não importa a largura
      // pedida aqui.
      const zonaDireita = 340;
      this._areaLargura = L - margemLateral - zonaDireita;
      this._areaAltura = A - this._topo - 30;
      this.area = new Node({ x: margemLateral, y: this._topo });
    } else {
      // 110 deixava ~12px de sobra entre a base dos botões (20 + 72 de
      // altura) e o topo do tabuleiro — meio inútil, e o vão ficava mais
      // visível em cima do TABULEIRO (que não tem botão nenhum por cima pra
      // "ocupar" a faixa) do que em cima da cartela. 102 é o mínimo real: 20
      // (margem) + 72 (altura do botão) + 10 (respiro) — ajuste pedido pelo
      // humano ("um pouco de espaço acima do tabuleiro").
      this._topo = 102;
      this._areaLargura = L - margemLateral * 2;
      this._areaAltura = A - this._topo - 30;
      this.area = new Node({ x: margemLateral, y: this._topo });
    }
    this.adicionar(this.area);

    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', () => this._soltarArrasto()));
    this.aoDesmontar(this.input.on('cancelar', () => this._soltarArrasto()));

    // ------------------------------------------------------------------ HUD
    // No celular, os 3 botões formam uma FILEIRA no topo esquerdo (pedido do
    // humano numa referência anterior). No computador eles viram uma COLUNA
    // no canto superior DIREITO — do lado OPOSTO à cartela (que agora encosta
    // na borda esquerda, ver acima) — em vez de competir por espaço com ela.
    const colunaDireitaX = L - margemLateral - 72;
    const btnX1 = this._desktop ? colunaDireitaX : margemLateral;
    const btnX2 = this._desktop ? colunaDireitaX : margemLateral + 88;
    const btnX3 = this._desktop ? colunaDireitaX : margemLateral + 88 * 2;
    const btnY1 = espaco.md;
    const btnY2 = this._desktop ? espaco.md + 88 : espaco.md;
    const btnY3 = this._desktop ? espaco.md + 88 * 2 : espaco.md;

    this._btnPausa = new IconButton({
      icone: 'pausa', x: btnX1, y: btnY1, audio: this.audio, somToque: config.audio?.clique, aoTocar: () => this._pausar(),
    });
    this.adicionar(this._btnPausa);

    this._btnAjuda = new IconButton({
      icone: 'tutorial', x: btnX2, y: btnY2, audio: this.audio, somToque: config.audio?.clique, aoTocar: () => this._pedirAjuda(),
    });
    this.adicionar(this._btnAjuda);

    this._btnSom = new SoundToggle({
      audio: this.audio, x: btnX3, y: btnY3, somToque: config.audio?.clique,
    });
    this.adicionar(this._btnSom);

    this._relogioBadge = config.mostrarCronometro === false ? null : new RelogioBadge({
      x: L / 2, y: espaco.md + 26, largura: 170, altura: 50,
    });
    if (this._relogioBadge) this.adicionar(this._relogioBadge);
    this._relogioSegundoMostrado = 0;
    this.placar.on('mudou', () => this._atualizarTextoHud());

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

    this._arrastando = null;
    this._construirRodada();

    // Só no CELULAR os botões seguem a altura da cartela (empilhados logo
    // acima dela). No computador eles já nasceram numa coluna fixa na
    // lateral (acima), independente de onde a cartela caiu.
    if (!this._desktop) {
      const cartelaAbsY = this._topo + this._cartela.y;
      const btnY = Math.max(espaco.md, cartelaAbsY - 72 - 12);
      this._btnPausa.y = btnY;
      this._btnAjuda.y = btnY;
      this._btnSom.y = btnY;
    }
  }

  _construirRodada() {
    const nivel = this.nivel;
    const { trilhas: sequencias, distratoras } = gerarRodada(nivel);

    // RESPONSIVO: dois layouts diferentes, um cálculo de tamanho cada (ver os
    // métodos). O TABULEIRO em si (`TabuleiroVisual`, `Trilha`, peças) é
    // construído do MESMO jeito nos dois casos, mais abaixo — só muda onde a
    // cartela e o tabuleiro são POSICIONADOS.
    const layout = this._desktop
      ? this._calcularLayoutDesktop(nivel, this._areaLargura, this._areaAltura)
      : this._calcularLayout(nivel, this._areaLargura, this._areaAltura);

    this._cartela = new CartelaPainel(
      sequencias, layout.cartelaTam, layout.cartelaGapIcone, layout.cartelaGapColuna, layout.cartelaPadX, layout.cartelaPadY,
    );

    let boardX, boardY;
    if (this._desktop) {
      // COMPUTADOR: lado a lado — cartela à esquerda, tabuleiro (ESTREITO,
      // sempre vertical, nunca alarga) à direita. A largura extra do
      // computador só aproxima a cartela do tabuleiro; não alarga o
      // tabuleiro em si (pedido explícito do humano).
      const totalWidth = this._cartela.largura + layout.gapCartela + layout.boardWidth;
      const startX = (this._areaLargura - totalWidth) / 2;
      this._cartela.x = startX;
      this._cartela.y = (this._areaAltura - this._cartela.altura) / 2;
      boardX = startX + this._cartela.largura + layout.gapCartela;
      boardY = (this._areaAltura - layout.boardHeight) / 2;
    } else {
      // CELULAR: empilhado — cartela em cima, tabuleiro embaixo, os dois
      // centralizados horizontalmente. Pedido do humano a partir de uma foto
      // do brinquedo físico segurado em pé: mais perto do vídeo de
      // referência original do que a versão lado a lado.
      this._cartela.x = (this._areaLargura - this._cartela.largura) / 2;
      this._cartela.y = 0;
      boardX = (this._areaLargura - layout.boardWidth) / 2;
      boardY = this._cartela.altura + layout.gapCartela;
    }
    this.area.adicionar(this._cartela);

    this._painelDireita = new TabuleiroVisual({
      largura: layout.boardWidth,
      altura: layout.boardHeight,
      tamPeca: layout.tam,
      gapTrilha: layout.gapTrilha,
      padPanelX: layout.padPanelX,
      padPanelTopo: layout.padPanelTopo,
      alturaBandeja: layout.alturaBandeja,
      numTrilhas: nivel.trilhas,
      gapSlot: layout.gapSlot,
      padTrilhaY: layout.padTrilhaY,
      profundidade: nivel.profundidade
    });
    this._painelDireita.x = boardX;
    this._painelDireita.y = boardY;
    this.area.adicionar(this._painelDireita);

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
      const inicioX = boardX + layout.padPanelX + (piscinaW - larguraLinha) / 2 + layout.tam / 2;
      const topoY = boardY + layout.padPanelTopo + layout.tam / 2;

      const peca = new Peca(dado.forma, dado.cor, layout.tam);
      const px = inicioX + coluna * celulaBandeja;
      const py = topoY + linha * (layout.tam + layout.gapBandeja);
      peca.x = px; peca.y = py;
      peca.trayX = px; peca.trayY = py;
      this.area.adicionar(peca);
      this._pecas.push(peca);
      this._ligarArrastePeca(peca);
    });

    // trilhas — a coluna estica pra preencher a largura toda do tabuleiro
    // (sem sobra nas laterais), mesma conta usada pelo `TabuleiroVisual` pra
    // pintar o canal de madeira por baixo; só a PEÇA continua do tamanho
    // `layout.tam`, centralizada dentro da coluna mais larga (`Trilha`).
    const piscinaW = layout.boardWidth - layout.padPanelX * 2;
    const larguraColuna = (piscinaW - (nivel.trilhas - 1) * layout.gapTrilha) / nivel.trilhas;
    const inicioXTrilhas = boardX + layout.padPanelX;
    const yBaseTrilhas = boardY + layout.boardHeight - layout.padPanelX;

    this._tamPeca = layout.tam;
    this._trilhas = sequencias.map((sequencia, i) => {
      const trilha = new Trilha(sequencia, layout.tam, layout.gapSlot, layout.padTrilhaY, larguraColuna);
      trilha.x = inicioXTrilhas + i * (larguraColuna + layout.gapTrilha);
      trilha.y = yBaseTrilhas - trilha.altura;
      this.area.adicionar(trilha);
      return trilha;
    });

    this._atualizarTextoHud();
  }

  /**
   * Canvas VERTICAL: cartela e tabuleiro EMPILHAM (um embaixo do outro), não
   * ficam mais lado a lado. O tabuleiro usa a largura DISPONÍVEL inteira
   * (`areaLargura`) sempre — não há mais cartela "roubando" largura dele — e
   * a busca de `tam` decide só a ALTURA do conjunto empilhado (cartela +
   * vão + tabuleiro) cabendo em `areaAltura`. Teto alto (220) e busca
   * decrescente: o maior `tam` que ainda cabe, sem limitar artificialmente
   * em níveis simples.
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
      // Fileiras da bandeja calculadas pela largura DE VERDADE disponível
      // (não mais um "nº de linhas" chutado por faixa de quantidade de
      // peças) — o tabuleiro agora tem a largura da tela inteira, bem
      // diferente da largura estreita de quando dividia espaço com a
      // cartela ao lado.
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
      // A folga que sobrar (depois da cartela + vão) vira canal de coluna
      // mais comprido — mesmo raciocínio das correções anteriores, agora
      // aplicado à altura que sobra DEPOIS da cartela, não à área inteira.
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
   * Canvas HORIZONTAL (computador, tela larga com folga nas laterais):
   * cartela e tabuleiro voltam a ficar LADO A LADO. A diferença importante
   * pro layout empilhado (`_calcularLayout`, acima) é que `boardWidth` aqui
   * NÃO usa a largura disponível inteira — fica ESTREITO, do tamanho da
   * própria grade de colunas (`larguraGradeTrilhas`), porque o tabuleiro
   * nunca deve alargar (pedido explícito do humano: "não deixar largo o
   * tabuleiro"). A bandeja de peças soltas simplesmente ocupa mais FILEIRAS
   * dentro dessa largura estreita — sobra altura de sobra no computador pra
   * isso não incomodar.
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
    const gapCartela = 36; // vão HORIZONTAL, entre a cartela e o tabuleiro

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
      // Sobra vertical generosa no computador (o tabuleiro não compete mais
      // por largura) — a folga vira canal de coluna mais comprido, mesmo
      // raciocínio de sempre.
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

  _ligarArrastePeca(peca) {
    peca.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando || peca.trancada) return;
      const local = this.area.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = peca.x - local.x;
      this._deslocY = peca.y - local.y;
      peca.arrastando = true;
      peca.paraFrente();
      Tween.removerDe(peca);
      Tween.para(peca, { scaleX: 1.1, scaleY: 1.1 }, 100, Easing.suaveSaida);
      this._arrastando = peca;
    });
  }

  _trilhaMaisProxima(x, y) {
    let melhor = null;
    let menor = Infinity;
    for (const trilha of this._trilhas) {
      if (trilha.completa()) continue;
      const alvo = trilha.posicaoProximoEncaixe();
      const d = (x - alvo.x) ** 2 + (y - alvo.y) ** 2;
      if (d < menor) { menor = d; melhor = trilha; }
    }
    return melhor;
  }

  /** Raio generoso — motricidade fina de 6-7 anos, mesmo raciocínio do Encaixe Certo/Quantidade Certa. */
  _raioTolerancia() { return this._tamPeca * 0.75; }

  _dentroDaTolerancia(trilha, x, y) {
    const alvo = trilha.posicaoProximoEncaixe();
    if (!alvo) return false;
    const raio = this._raioTolerancia();
    const d = (x - alvo.x) ** 2 + (y - alvo.y) ** 2;
    return d <= raio ** 2;
  }

  _moverArrasto(ponto) {
    const peca = this._arrastando;
    if (!peca) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    peca.x = local.x + this._deslocX;
    peca.y = local.y + this._deslocY;

    const alvo = this._trilhaMaisProxima(peca.x, peca.y);
    const perto = alvo && this._dentroDaTolerancia(alvo, peca.x, peca.y);
    for (const trilha of this._trilhas) trilha.destacada = perto && trilha === alvo;

    if (perto) {
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

  _soltarArrasto() {
    const peca = this._arrastando;
    if (!peca) return;
    this._arrastando = null;
    peca.arrastando = false;
    for (const trilha of this._trilhas) trilha.destacada = false;
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    const alvo = this._trilhaMaisProxima(peca.x, peca.y);
    if (alvo) {
      const perto = this._dentroDaTolerancia(alvo, peca.x, peca.y);
      const esperado = alvo.sequencia[alvo.proximo];
      if (perto && esperado.forma === peca.forma && esperado.cor === peca.cor) {
        alvo.proximo += 1;
        peca.trancada = true;
        peca.interativo = false;
        peca.removerDoPai();
        this._pecas = this._pecas.filter((p) => p !== peca);
        if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
        this._celebrarSlot(alvo);
        if (alvo.completa()) {
          this.placar.acertar(1);
        }
        return;
      }
      if (perto) {
        this._tentativasErradas += 1;
        if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
      }
    }
    this._tremerEVoltar(peca);
  }

  /** Tremor curto antes de voltar pra bandeja — feedback de "não foi essa/não é a vez", nunca punitivo. */
  _tremerEVoltar(peca) {
    const x0 = peca.x;
    Tween.removerDe(peca);
    Tween.de(peca)
      .entao({ x: x0 - 10 }, 45, Easing.linear)
      .entao({ x: x0 + 10 }, 45, Easing.linear)
      .entao({ x: x0 - 6 }, 45, Easing.linear)
      .entao({ x: x0 }, 45, Easing.linear)
      .entao({ x: peca.trayX, y: peca.trayY }, 220, Easing.suaveSaida);
  }

  /** Pulinho de conquista na própria trilha quando uma peça trava nela. */
  _celebrarSlot(trilha) {
    const baseX = trilha.x;
    Tween.removerDe(trilha);
    Tween.de(trilha)
      .entao({ x: baseX - 5 }, 60, Easing.linear)
      .entao({ x: baseX + 5 }, 60, Easing.linear)
      .entao({ x: baseX }, 60, Easing.linear);
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
    const total = this._relogioSegundoMostrado;
    const min = Math.floor(total / 60);
    const seg = total % 60;
    const tempo = `${min}:${String(seg).padStart(2, '0')}`;
    if (this._relogioBadge) this._relogioBadge.texto = tempo;
  }
}
