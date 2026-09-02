import { Node } from './Node.js';

/**
 * Stage — a ponte entre o `<canvas>` e o scene-graph.
 *
 * Responsável pelo problema que os jogos originais simplesmente não resolviam:
 * eles tinham `<canvas width="800" height="600">` fixo, então em tablet ou num
 * iframe de tamanho diferente o jogo era cortado ou ficava minúsculo.
 *
 * Aqui o jogo é desenhado sempre em coordenadas LÓGICAS (padrão 1280×720) e o
 * Stage escala para o espaço disponível preservando a proporção (letterbox).
 * Isso é o que permite publicar um jogo sozinho no AVA sem saber de antemão o
 * tamanho do `<iframe>` que vai recebê-lo.
 *
 * **Giro em celular de pé.** Num aparelho de pé, um jogo 16:9 vira uma tira:
 * medido num 360×800, 75% da tela virava barra preta e o alvo de 64 px lógicos
 * caía a 18 px. Quem resolve é o CSS (`tokens.css`), girando `#palco` um quarto
 * de volta — não o motor, porque assim a tela de carregamento e a de erro, que
 * são DOM, giram junto de graça.
 *
 * O Stage não gira nada; ele precisa apenas SABER que está girado, porque o mapa
 * tela→lógico depende disso: `getBoundingClientRect()` de um elemento girado
 * devolve a caixa alinhada aos eixos, e usá-la sem corrigir troca os eixos do
 * toque. Não é hipótese — foi medido: o toque em JOGAR caía em COMO JOGAR.
 */
export class Stage {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{larguraLogica?: number, alturaLogica?: number, corFundo?: string}} opcoes
   */
  constructor(canvas, opcoes = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    this.larguraLogica = opcoes.larguraLogica ?? 1280;
    this.alturaLogica = opcoes.alturaLogica ?? 720;
    this.corFundo = opcoes.corFundo ?? '#000000';

    /** Raiz do scene-graph. Cenas entram e saem daqui. */
    this.raiz = new Node({ nome: 'raiz', filhosInterativos: true });

    /** Escala aplicada (lógico → CSS) e deslocamento do letterbox, em px CSS. */
    this.escala = 1;
    this.deslocX = 0;
    this.deslocY = 0;
    /** A mesma sobra do letterbox, em px LÓGICOS de cada lado. */
    this.sangriaX = 0;
    this.sangriaY = 0;

    /**
     * Quem pinta as barras do letterbox, quando alguém pinta.
     *
     * Objeto com `pintarSangria(ctx, area)` — na prática o `Background` da cena,
     * ligado aqui pelo `Game` a cada troca de tela. `null` deixa as barras na
     * cor lisa de `corFundo`.
     *
     * O motivo de existir: com o jogo em proporção fixa, num monitor largo
     * sobram duas faixas de cor morta nas laterais, e elas apareciam como duas
     * tarjas escuras em volta da tela. Prolongar o cenário para dentro delas
     * as faz desaparecer **sem cortar nada do jogo** e sem tocar na geometria
     * lógica de 1280×720, que é medida e não pode mudar.
     */
    this.sangria = null;

    /**
     * Quarto de volta aplicado ao contêiner pelo CSS: 0, 90 ou -90 graus.
     * Detectado, nunca definido pelo motor. Ver `_detectarGiro()`.
     */
    this.giro = 0;

    this._aoRedimensionar = () => this.redimensionar();
    window.addEventListener('resize', this._aoRedimensionar);
    window.addEventListener('orientationchange', this._aoRedimensionar);

    // Quando o iframe do AVA muda de tamanho sem que a janela mude (layout do
    // AVA, painel lateral abrindo), o evento `resize` não dispara. O
    // ResizeObserver no elemento pai cobre esse caso.
    if (typeof ResizeObserver !== 'undefined') {
      this._observador = new ResizeObserver(() => this.redimensionar());
      this._observador.observe(canvas.parentElement ?? canvas);
    }

    this.redimensionar();
  }

  /** Recalcula escala e tamanho do buffer. Chamado no resize e no boot. */
  redimensionar() {
    const alvo = this.canvas.parentElement ?? document.body;
    const larguraDisp = Math.max(1, alvo.clientWidth || window.innerWidth);
    const alturaDisp = Math.max(1, alvo.clientHeight || window.innerHeight);

    // "fit": cabe inteiro, sem cortar, mantendo proporção.
    this.escala = Math.min(larguraDisp / this.larguraLogica, alturaDisp / this.alturaLogica);
    const larguraDesenho = this.larguraLogica * this.escala;
    const alturaDesenho = this.alturaLogica * this.escala;
    this.deslocX = (larguraDisp - larguraDesenho) / 2;
    this.deslocY = (alturaDisp - alturaDesenho) / 2;

    // A mesma sobra, medida em px LÓGICOS — é nessa unidade que o cenário
    // desenha, e é o que `pintarSangria` recebe para cobrir as barras.
    this.sangriaX = this.deslocX / this.escala;
    this.sangriaY = this.deslocY / this.escala;

    // Limitar o DPR a 2 evita buffers gigantes (e queda de FPS) em celulares 3x
    // sem diferença visível para arte plana.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const larguraBuffer = Math.round(larguraDisp * dpr);
    const alturaBuffer = Math.round(alturaDisp * dpr);

    if (this.canvas.width !== larguraBuffer || this.canvas.height !== alturaBuffer) {
      this.canvas.width = larguraBuffer;
      this.canvas.height = alturaBuffer;
    }
    this.canvas.style.width = `${larguraDisp}px`;
    this.canvas.style.height = `${alturaDisp}px`;
    this._dpr = dpr;

    // Depois de fixar o tamanho, e não antes: o giro é lido do CSS já aplicado.
    // A escala acima não precisa de nenhum ajuste — `clientWidth/clientHeight`
    // de um elemento girado devolvem a caixa de layout DELE (800×360 num celular
    // de pé de 360×800), que é exatamente a caixa em que o jogo cabe.
    this.giro = this._detectarGiro();

    this.raiz.emit('redimensionado', this);
  }

  /** Converte um ponto de tela (clientX/clientY) para coordenada lógica. */
  telaParaLogico(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    const p = Stage.desfazerGiro(clientX - r.left, clientY - r.top, r.width, r.height, this.giro);
    return {
      x: (p.x - this.deslocX) / this.escala,
      y: (p.y - this.deslocY) / this.escala,
    };
  }

  /**
   * Desfaz o giro do contêiner. Recebe um ponto em px de tela, relativo ao canto
   * da caixa envolvente do canvas, e devolve o ponto em px DENTRO do canvas, no
   * eixo em que o jogo é desenhado.
   *
   * Estático e puro de propósito: é a conta que, errada, faz a criança tocar em
   * JOGAR e cair no tutorial, e assim ela é testável sem navegador.
   *
   * Com `rotate(90deg)` e origem no canto superior esquerdo, o eixo x do canvas
   * corre pelo y da tela, e o y do canvas corre no sentido INVERSO do x da tela.
   */
  static desfazerGiro(px, py, larguraCaixa, alturaCaixa, giro) {
    if (giro === 90) return { x: py, y: larguraCaixa - px };
    if (giro === -90) return { x: alturaCaixa - py, y: px };
    return { x: px, y: py };
  }

  /**
   * Lê um quarto de volta de uma matriz de transformação CSS.
   *
   * Em `matrix(a, b, c, d, e, f)`, um quarto de volta deixa a≈0 e |b|≈1 — o
   * sinal de b diz o sentido. Qualquer outra transformação (escala, translação
   * pura, giro que não seja de 90°) devolve 0: o motor só sabe corrigir o quarto
   * de volta que o próprio `tokens.css` aplica.
   */
  static giroDaMatriz(transformacao) {
    if (!transformacao || transformacao === 'none') return 0;
    const numeros = transformacao.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
    if (!numeros || numeros.length < 4) return 0;
    const a = Number(numeros[0]);
    const b = Number(numeros[1]);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
    if (Math.abs(a) > 0.5 || Math.abs(b) < 0.5) return 0;
    return b > 0 ? 90 : -90;
  }

  /**
   * Procura o giro nos ancestrais do canvas. Sobe a árvore em vez de olhar só o
   * pai porque quem gira é uma regra de CSS por seletor (`#palco`), e um jogo
   * pode aninhar o canvas mais fundo do que o template faz.
   */
  _detectarGiro() {
    if (typeof getComputedStyle !== 'function') return 0;
    let no = this.canvas.parentElement;
    while (no && no !== document.documentElement) {
      const giro = Stage.giroDaMatriz(getComputedStyle(no).transform);
      if (giro !== 0) return giro;
      no = no.parentElement;
    }
    return 0;
  }

  /** O ponto lógico está dentro da área do jogo (fora do letterbox)? */
  dentroDaArea(x, y) {
    return x >= 0 && y >= 0 && x <= this.larguraLogica && y <= this.alturaLogica;
  }

  /**
   * O canvas INTEIRO em coordenadas lógicas — a área do jogo mais as barras.
   *
   * `x` e `y` são negativos ou zero, e é isso que o torna útil: quem desenha o
   * cenário recebe a caixa maior sem precisar saber de escala nem de DPR.
   */
  areaTotal() {
    return {
      x: -this.sangriaX,
      y: -this.sangriaY,
      largura: this.larguraLogica + this.sangriaX * 2,
      altura: this.alturaLogica + this.sangriaY * 2,
    };
  }

  atualizar(dt) {
    this.raiz.atualizar(dt);
  }

  renderizar() {
    const { ctx } = this;
    const dpr = this._dpr;

    // Pinta as barras do letterbox e limpa o buffer inteiro.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.corFundo;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.setTransform(
      this.escala * dpr, 0, 0, this.escala * dpr,
      this.deslocX * dpr, this.deslocY * dpr,
    );

    // As barras, cobertas pelo cenário — quando há barra e há quem a pinte.
    //
    // Passe próprio, recortado no ANEL de fora (regra even-odd: dois retângulos,
    // e o interno abre um buraco). O recorte é o que permite reaproveitar o
    // cenário sem desenhá-lo duas vezes por cima de si mesmo: aqui só o que cai
    // fora da área lógica chega à tela.
    if (this.sangria && (this.sangriaX > 0.5 || this.sangriaY > 0.5)) {
      const area = this.areaTotal();
      // O buraco entra 1 px lógico na área do jogo, e esse 1 não é chute.
      //
      // A borda do recorte sofre antialiasing: o último pixel do anel fica
      // parcialmente coberto e mistura com a cor lisa por baixo, o que desenhava
      // **uma linha escura de 1 px na emenda** — medido, 80% do brilho do céu
      // (`#2e97c7` contra `#38bdf8`). Entrando 1 px, essa mistura cai onde o
      // cenário da cena passa em seguida e a cobre.
      const SOBREPOR = 1;
      ctx.save();
      ctx.beginPath();
      ctx.rect(area.x, area.y, area.largura, area.altura);
      ctx.rect(
        SOBREPOR, SOBREPOR,
        this.larguraLogica - SOBREPOR * 2, this.alturaLogica - SOBREPOR * 2,
      );
      ctx.clip('evenodd');
      try {
        this.sangria.pintarSangria(ctx, area);
      } catch (err) {
        // Cenário é decoração: se ele falhar, o jogo segue com a barra lisa.
        // Desligar depois do primeiro erro evita um console inundado a 60 Hz.
        console.error('[motor] Stage: pintar a sangria falhou; barras ficam lisas.', err);
        this.sangria = null;
      }
      ctx.restore();
    }

    // Recorta na área lógica para nada vazar sobre as barras laterais.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.larguraLogica, this.alturaLogica);
    ctx.clip();
    this.raiz.renderizar(ctx);
    ctx.restore();
  }

  destruir() {
    window.removeEventListener('resize', this._aoRedimensionar);
    window.removeEventListener('orientationchange', this._aoRedimensionar);
    this._observador?.disconnect();
    this.raiz.destruir();
  }
}
