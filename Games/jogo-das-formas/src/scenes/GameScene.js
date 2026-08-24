import {
  Scene, Node, TextNode, ScoreSystem, ScoreBar, TimerBar, IconButton, SoundToggle,
  PauseScreen, Panel, Background, Mascot, GridBoard, CraneController,
  Tween, Easing, ESTADOS, desenharIcone, cores, tipografia, espaco, raio,
  sombras, movimento, rand,
} from '../../engine/index.js';

/**
 * GameScene — a partida do Jogo das Formas.
 *
 * Especificação: docs/REGRAS-JOGO-DAS-FORMAS.md e docs/PLANO-VISUAL-JOGO-DAS-FORMAS.md.
 * Onde este arquivo e aqueles discordarem, um dos dois está errado — nunca "depende".
 *
 * O ciclo de uma jogada, que é o coração da cena:
 *
 *   toque na coluna  →  garra desliza  →  desce  →  PEGA o grupo do topo  →  sobe
 *   toque na coluna  →  garra desliza  →  desce  →  DEPOSITA  →  sobe  →  cascata
 *
 * Durante qualquer trecho desse ciclo `this.fase` é `'movendo'` e o toque não
 * inicia outra jogada. É a trava que `docs/STATES.md` exige de todo jogo do
 * motor: sem ela, um toque repetido resolve duas jogadas ao mesmo tempo e o
 * tabuleiro diverge do que está na tela — exatamente o defeito que a função
 * `VALIDA()` do original existia para denunciar.
 */

// ---------------------------------------------------------------------------
// Bloco
// ---------------------------------------------------------------------------

/**
 * Bloco — um azulejo do tabuleiro.
 *
 * **A COSTURA DO ANDAIME VIVE AQUI.** Hoje o desenho é o PNG de 2013 no tamanho
 * nativo (50 px); o alvo é a peça vetorial da seção 3.1 do plano visual. Quando
 * a arte definitiva chegar, o único método que muda é `desenhar()` — nada mais
 * na cena sabe se um bloco é imagem ou forma. Ver PLANO-VISUAL, seção 3.2.
 *
 * O bloco NÃO guarda cópia de nada derivado do tipo: cor, nome, som e imagem
 * saem de `arte` na hora de usar. É o que permite ao sorteio anticombo trocar
 * `bloco.tipo` sozinho, sem deixar a aparência dessincronizada do dado.
 */
class Bloco extends Node {
  constructor({ tipo, lado, arte }) {
    super({ largura: lado, altura: lado });
    this.tipo = tipo;
    this.lado = lado;
    this.arte = arte;
    /** Vale 2 pontos e sobrevive ao combo que o criou. Ver REGRAS, seção 4.4. */
    this.estrela = false;
    // Âncora no centro: tween de posição e de escala ficam naturais.
    this.regX = lado / 2;
    this.regY = lado / 2;
  }

  get forma() {
    return this.arte.formas[this.tipo];
  }

  get valor() {
    return this.estrela ? 2 : 1;
  }

  desenhar(ctx) {
    const img = this.arte.imagens[this.tipo];
    if (img) {
      ctx.drawImage(img, 0, 0, this.lado, this.lado);
    } else {
      // Reserva: sem o PNG ainda dá para jogar, e o console já avisou qual
      // arquivo faltou. Falhar alto, nunca em silêncio (MOTOR.md, princípio 10).
      ctx.fillStyle = cores.superficie;
      ctx.strokeStyle = this.forma?.cor ?? cores.tinta;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(0, 0, this.lado, this.lado, raio.sm);
      ctx.fill();
      ctx.stroke();
    }

    if (this.estrela) {
      // Selo vetorial: a arte de 2013 não tem versão "estrela" do azulejo.
      const t = this.lado * 0.42;
      ctx.save();
      ctx.translate(this.lado - t * 0.82, -t * 0.18);
      desenharIcone(ctx, 'estrela', t, cores.atencao, 2);
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------------------
// Garra
// ---------------------------------------------------------------------------

/**
 * Garra — a corrente e o gancho. A carga é desenhada pela cena, não por aqui:
 * os blocos carregados continuam sendo filhos do tabuleiro, e é a cena que os
 * mantém pendurados. Reparentar peça a cada jogada só criaria oportunidade de
 * perder uma.
 */
class Garra extends Node {
  constructor({ trilhoY }) {
    super({ largura: 64, altura: 48 });
    this.trilhoY = trilhoY;
    this.regX = 32;
  }

  desenhar(ctx) {
    // Corrente: do trilho até o gancho. `y` local é 0, então o trilho fica em
    // coordenada negativa relativa.
    const alturaCorrente = this.y - this.trilhoY;
    ctx.strokeStyle = cores.tintaSuave;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(32, -alturaCorrente);
    ctx.lineTo(32, 0);
    ctx.stroke();

    // Gancho: dois braços em V invertido.
    ctx.strokeStyle = cores.tinta;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(10, 24);
    ctx.lineTo(32, 2);
    ctx.lineTo(54, 24);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }
}

// ---------------------------------------------------------------------------
// A cena
// ---------------------------------------------------------------------------

export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.geo = config.grade;

    // ------------------------------------------------------------- o placar
    // `vidas: 0` — este jogo não tem vidas. A derrota vem do teto ou do tempo,
    // e por isso `errar()` nunca encerra a partida sozinho.
    this.placar = new ScoreSystem({
      total: this.nivel.meta,
      nivel: this.nivel.id,
      vidas: 0,
    });

    // -------------------------------------------------------------- a arte
    // Resolvida uma vez: um `loader.imagem()` por quadro por bloco custaria
    // caro e repetiria o mesmo aviso de console centenas de vezes.
    this.arte = {
      formas: config.formas,
      imagens: Object.fromEntries(
        Object.entries(config.formas).map(([tipo, f]) => [tipo, this.loader.imagem(f.imagem)]),
      ),
    };

    // ---------------------------------------------------------- geometria
    this.colunas = this.nivel.colunas;
    this.linhas = this.nivel.linhas;
    const gradeLargura = this.colunas * this.geo.celula;
    this.gradeX = Math.round((L - gradeLargura) / 2);
    this.xColunas = Array.from(
      { length: this.colunas },
      (_, col) => this.gradeX + col * this.geo.celula + this.geo.celula / 2,
    );

    // --------------------------------------------------------------- fundo
    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema }));
    this._montarCenario();

    /**
     * Área de toque: cobre a tela inteira e fica ATRÁS de tudo.
     *
     * Sem ela o jogo não responde a toque nenhum. O `Input` só emite `toque`
     * quando o dedo aperta e solta **sobre o mesmo nó interativo**
     * (`Input._tratar`), e nem o tabuleiro nem os blocos são interativos: um
     * toque na coluna caía no vazio, `noInicial` vinha null, e o evento nunca
     * era emitido.
     *
     * Ouvir no `Input` global em vez de aqui não resolve — piora. O `Input`
     * emite primeiro no nó e só depois em si mesmo, então um ouvinte global
     * recebia o toque em QUALQUER botão, inclusive o CONTINUAR da pausa, que
     * roda antes e já tinha zerado `pausada`. O resultado era o único toque que
     * funcionava ser o de sair da pausa — e ele virava uma jogada no meio da
     * tela. Pendurar no nó resolve os dois de uma vez: o HUD e o painel estão à
     * FRENTE desta área, então ganham o toque; o resto da tela cai aqui.
     *
     * O `arrastar` também mora aqui, e não no `Input`, porque o motor o emite no
     * nó que foi APERTADO — assim um arrasto que começou na área de jogo
     * continua valendo mesmo se o dedo sair dela, e um arrasto que começou no
     * painel nunca mexe na garra.
     */
    this.areaToque = new Node({ largura: L, altura: A, interativo: true });
    this.areaToque.on('toque', (ponto) => this._aoTocar(ponto));
    this.areaToque.on('arrastar', (ponto) => this._aoArrastar(ponto));
    this.adicionar(this.areaToque);

    // ----------------------------------------------------------- tabuleiro
    this.grade = new GridBoard({
      linhas: this.linhas,
      colunas: this.colunas,
      // Vizinhança de 4. Combo é conectividade, NÃO linha — a `sequencia()` do
      // original é flood-fill de 4 vizinhos. Ver REGRAS, seção 4.1.
      diagonais: false,
    });
    this.tabuleiro = new Node();
    this.adicionar(this.tabuleiro);

    // ---------------------------------------------------------- a garra
    this.controle = new CraneController({
      modo: 'colunas',
      colunas: this.xColunas,
      y: this.geo.trilhoY,
    });
    this.garra = new Garra({ trilhoY: this.geo.trilhoY });
    this.garra.x = this.xColunas[Math.floor(this.colunas / 2)];
    this.garra.y = this.geo.trilhoY + 30;
    this.controle.irParaColuna(Math.floor(this.colunas / 2));
    this.adicionar(this.garra);

    /** @type {Bloco[]} carga pendurada; todos do MESMO tipo, por construção. */
    this.carga = [];
    /** 'livre' = aceita toque · 'movendo' = jogada em curso. */
    this.fase = 'livre';

    this._montarHud();
    this._montarPainelFormas();
    this._montarMascote();
    this._montarPausa();

    // ------------------------------------------------------- estado da partida
    /** Um combo aconteceu no ciclo de linha nova corrente? Ver REGRAS, seção 7. */
    this.comboNesteCiclo = false;
    this.tempoDeLinha = 0;
    this.linhaPendente = false;
    /** O último bloco depositado, candidato a virar estrela. */
    this.ultimoDepositado = null;

    this._preencherInicio();

    // A entrada está pendurada em `this.areaToque`, montada junto com o fundo.

    this.placar.on('vitoria', () => this._terminar(true));
    this.placar.on('derrota', () => this._terminar(false));

    if (config.audio?.musica) this.audio.musica(config.audio.musica);
    this.tempo.iniciar(this.nivel.duracao);
  }

  // -------------------------------------------------------------- montagem

  _montarCenario() {
    const { largura: L, altura: A } = this;

    // Chão de madeira. O topo dele encosta na BASE DO AZULEJO, não na base da
    // célula: o azulejo tem 50 px numa célula de 64, então alinhar pela célula
    // deixava 7 px de ar embaixo da pilha e a madeira lia como rodapé, não como
    // piso. Ver PLANO-VISUAL, seção 3.2 (o azulejo no tamanho nativo).
    const topoDoChao = this.geo.baseY - (this.geo.celula - this.geo.azulejo) / 2;
    const chao = new Node({ largura: L, altura: A - topoDoChao });
    chao.y = topoDoChao;
    chao.desenhar = (ctx) => {
      ctx.fillStyle = cores.madeira;
      ctx.fillRect(0, 0, L, A - topoDoChao);
      ctx.fillStyle = cores.madeiraEscura;
      ctx.fillRect(0, 0, L, 8);
    };
    this.adicionar(chao);

    // Trilho da garra.
    const trilho = new Node({ largura: L, altura: 18 });
    trilho.y = this.geo.trilhoY - 9;
    trilho.desenhar = (ctx) => {
      const x0 = this.gradeX - espaco.md;
      const larg = this.colunas * this.geo.celula + espaco.md * 2;
      ctx.fillStyle = cores.tintaSuave;
      ctx.beginPath();
      ctx.roundRect(x0, 0, larg, 18, 9);
      ctx.fill();
      // Rebites: dizem "isto é uma estrutura", sem custo de arte.
      ctx.fillStyle = cores.linha;
      for (let x = x0 + 16; x < x0 + larg - 8; x += 32) {
        ctx.beginPath();
        ctx.arc(x, 9, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    this.adicionar(trilho);
  }

  _montarHud() {
    const { largura: L, config } = this;

    this.barra = new ScoreBar({
      largura: 360,
      altura: 34,
      x: espaco.md,
      y: espaco.md,
      icone: 'estrela',
      mostrarNumeros: true,
    });
    // A barra segue o acerto BRUTO durante a partida, de propósito: ela espelha
    // o que a criança conseguiu limpar, e não pode andar para trás. O desconto
    // da RE-02 acontece só no fim, em `paraAva`/`pontuacao`.
    this.barra.acompanhar(this.placar);

    this.tempo = new TimerBar({
      largura: 360,
      altura: 34,
      x: Math.round((L - 360) / 2),
      y: espaco.md,
      duracao: this.nivel.duracao,
    });
    this.tempo.on('acabou', () => {
      if (!this.placar.encerrado) this.placar.encerrarPorTempo();
    });

    this.adicionar(this.barra, this.tempo);

    this.adicionar(new IconButton({
      icone: 'pausa',
      x: L - 180,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pausar(),
    }));

    this.adicionar(new SoundToggle({
      x: L - 96,
      y: espaco.md,
      audio: this.audio,
    }));
  }

  /**
   * O painel "AS FORMAS" — a referência que fica na tela a partida inteira.
   *
   * Não é enfeite para preencher a faixa vazia à direita da grade: é o objetivo
   * pedagógico exposto. A criança que esqueceu qual é o triângulo olha para o
   * lado, e tocar na linha narra o nome.
   */
  _montarPainelFormas() {
    // Derivado da grade, não escrito à mão: com 5 colunas a faixa livre é mais
    // larga, e o painel acompanha em vez de ficar torto.
    const direitaDaGrade = this.gradeX + this.colunas * this.geo.celula;
    const x = direitaDaGrade + espaco.xl;
    const largura = this.largura - x - espaco.xl;
    const formas = this.nivel.formas;
    const alturaLinha = 72;
    const altura = espaco.lg + espaco.md + formas.length * alturaLinha + espaco.md;

    const painel = new Panel({
      largura,
      altura,
      x,
      // Alinhado ao teto da grade: o painel começa onde a pilha cheia terminaria.
      y: this.geo.baseY - this.linhas * this.geo.celula,
      preenchimento: 'rgba(255,255,255,0.92)',
      contorno: cores.linha,
      raio: raio.lg,
      sombra: sombras.cartao,
    });

    painel.adicionar(new TextNode('As formas', {
      x: largura / 2,
      y: espaco.md,
      tamanho: tipografia.apoio,
      peso: tipografia.pesoForte,
      cor: cores.tintaSuave,
      alinhamento: 'center',
    }));

    formas.forEach((tipo, i) => {
      const y = espaco.lg + espaco.md + i * alturaLinha;

      // A linha inteira é o alvo: 360 × 72, muito acima do mínimo de 64.
      const linha = new Node({ largura, altura: alturaLinha, interativo: true });
      linha.y = y;
      linha.desenhar = () => {};
      linha.contemPontoLocal = (px, py) => px >= 0 && py >= 0 && px <= largura && py <= alturaLinha;
      linha.on('toque', () => {
        const som = this.arte.formas[tipo]?.som;
        if (som) this.audio.falar(som);
      });

      const peca = new Bloco({ tipo, lado: this.geo.azulejo, arte: this.arte });
      peca.x = espaco.lg + this.geo.azulejo / 2;
      peca.y = alturaLinha / 2;
      linha.adicionar(peca);

      linha.adicionar(new TextNode(this.arte.formas[tipo].nome, {
        x: espaco.lg + this.geo.azulejo + espaco.md,
        y: alturaLinha / 2 - tipografia.corpo * 0.6,
        tamanho: tipografia.corpo,
        peso: tipografia.pesoForte,
        cor: cores.tinta,
      }));

      painel.adicionar(linha);
    });

    this.adicionar(painel);
  }

  _montarMascote() {
    const tamanho = 190;
    this.mascote = new Mascot({ tamanho });
    // Centrada na faixa livre à esquerda da grade, apoiada no chão.
    this.mascote.x = Math.round(this.gradeX / 2 - tamanho / 2);
    this.mascote.y = this.geo.baseY - tamanho;
    this.adicionar(this.mascote);
  }

  _montarPausa() {
    this.pausa = new PauseScreen({
      largura: this.largura,
      altura: this.altura,
      audio: this.audio,
      config: this.config,
      aoContinuar: () => {
        this.pausada = false;
        this.tempo.retomar();
      },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);
    this.pausa.paraFrente();
  }

  // ------------------------------------------------------------- tabuleiro

  _sortearTipo() {
    return this.nivel.formas[rand.inteiro(0, this.nivel.formas.length - 1)];
  }

  _novoBloco(tipo, lin, col) {
    const b = new Bloco({ tipo, lado: this.geo.azulejo, arte: this.arte });
    b.x = this.xColunas[col];
    b.y = this._yDaLinha(lin);
    this.tabuleiro.adicionar(b);
    this.grade.definir(lin, col, b);
    return b;
  }

  _yDaLinha(lin) {
    return this.geo.baseY - lin * this.geo.celula - this.geo.celula / 2;
  }

  _preencherInicio() {
    const novos = [];
    for (let lin = 0; lin < this.nivel.linhasIniciais; lin++) {
      for (let col = 0; col < this.colunas; col++) {
        novos.push(this._novoBloco(this._sortearTipo(), lin, col));
      }
    }
    this._evitarComboDeGraca(novos);
  }

  /**
   * Impede combo de graça em peças recém-criadas — na largada e em cada linha
   * nova. Resorteia o tipo delas até nenhuma estar num grupo de 3.
   *
   * **Por que não usa `GridBoard.desfazerCombosIniciais`.** Dois motivos, e o
   * segundo foi medido, não suposto:
   *
   *  1. Aquele método percorre TODAS as peças da grade. Numa linha nova isso
   *     resortearia blocos que já estavam na tela — a forma de um bloco mudando
   *     debaixo do olhar da criança. Aqui só as peças novas mudam.
   *  2. Ele resolve peça por peça, num passe só, e nunca reconfere as que já
   *     passaram: consertar a 12ª peça pode criar um grupo com a 3ª, e esse
   *     grupo sobrevive calado. No nível 1 (5 colunas, 3 formas, 15 blocos) ele
   *     esgotava as 40 tentativas e avisava no console. Aqui cada passe
   *     RECONFERE o conjunto inteiro, e é isso que faz a garantia valer.
   *
   * O aviso é último recurso: se nem 12 passes convergirem, o tabuleiro nasce
   * com um combo de graça — e o console diz, em vez de fingir que está tudo bem.
   */
  _evitarComboDeGraca(pecas, maxPasses = 12) {
    for (let passe = 0; passe < maxPasses; passe++) {
      const problemas = pecas.filter((p) => this.grade.grupoConectado(p).length >= 3);
      if (problemas.length === 0) return true;
      for (const p of problemas) p.tipo = this._sortearTipo();
    }
    console.warn(
      `[jogo-das-formas] ${maxPasses} passes não bastaram para desfazer os combos de graça; `
      + 'o tabuleiro começa com pontos que a criança não fez.',
    );
    return false;
  }

  /** Maior índice de linha ocupado numa coluna, ou -1 se estiver vazia. */
  _linhaDoTopo(col) {
    for (let lin = this.linhas - 1; lin >= 0; lin--) {
      if (this.grade.obter(lin, col)) return lin;
    }
    return -1;
  }

  /** Primeira linha livre de uma coluna (= altura da pilha). */
  _primeiraLivre(col) {
    return this._linhaDoTopo(col) + 1;
  }

  /**
   * O grupo contíguo de MESMA forma no topo de uma coluna.
   *
   * Pega o grupo, não o bloco: se o topo tem três círculos empilhados, a garra
   * leva os três. É o que dá profundidade tática ao jogo — e o que uma leitura
   * apressada do original perde (ver `destaque()`, linha 516 do JogoFormas.js).
   */
  _grupoDoTopo(col) {
    const topo = this._linhaDoTopo(col);
    if (topo < 0) return [];
    const tipo = this.grade.obter(topo, col).tipo;
    const grupo = [];
    for (let lin = topo; lin >= 0; lin--) {
      const p = this.grade.obter(lin, col);
      if (!p || p.tipo !== tipo) break;
      grupo.push(p);
    }
    return grupo; // [0] = o mais alto da coluna
  }

  // ----------------------------------------------------------------- entrada

  _apontarColuna(x) {
    this.controle.seguirX(x);
    Tween.removerDe(this.garra);
    Tween.para(this.garra, { x: this.controle.x }, movimento.padrao, Easing.suaveSaida);
  }

  /**
   * O toque cai na faixa de jogo?
   *
   * A `areaToque` cobre a tela inteira de propósito — é ela que garante que o
   * dedo nunca "caia no vazio". Mas jogada só vale na coluna: acima do trilho
   * fica o HUD, abaixo da base fica o chão, e às laterais moram o mascote e o
   * painel das formas. Tocar ali não é erro, é só não ser jogada.
   */
  _naFaixaDeJogo(ponto) {
    if (ponto.y < this.geo.trilhoY + 18 || ponto.y > this.geo.baseY) return false;
    return ponto.x >= this.gradeX
      && ponto.x <= this.gradeX + this.colunas * this.geo.celula;
  }

  _aoTocar(ponto) {
    if (this.pausada || this.placar.encerrado) return;
    if (this.fase !== 'livre') return;
    if (!this._naFaixaDeJogo(ponto)) return;

    this.controle.seguirX(ponto.x);
    const col = this.controle.indiceColuna;
    if (this.carga.length === 0) this._pegar(col);
    else this._depositar(col);
  }

  /**
   * Arrastar com a garra carregada reposiciona sem descer: a criança escolhe com
   * calma, vendo a carga pendurada sobre a coluna de destino.
   *
   * Com a garra vazia o arrasto não faz nada — mover a garra à toa antes de
   * escolher só adicionaria movimento sem significado na tela.
   */
  _aoArrastar(ponto) {
    if (this.pausada || this.placar.encerrado) return;
    if (this.fase !== 'livre' || this.carga.length === 0) return;
    if (!this._naFaixaDeJogo(ponto)) return;
    this._apontarColuna(ponto.x);
  }

  // ----------------------------------------------------------------- jogada

  /** Onde fica, na vertical, o i-ésimo bloco da carga (0 = o mais alto). */
  _yDaCarga(i) {
    return this.garra.y + 40 + i * this.geo.celula;
  }

  _pegar(col) {
    const grupo = this._grupoDoTopo(col);
    if (grupo.length === 0) return; // coluna vazia: nada a fazer, e nenhum erro

    this.fase = 'movendo';
    const alvoY = this._yDaLinha(this._linhaDoTopo(col)) - 40;

    Tween.removerDe(this.garra);
    Tween.para(this.garra, { x: this.controle.x }, movimento.padrao, Easing.suaveSaida)
      .entao({ y: alvoY }, 350, Easing.suaveEntrada)
      .chamar(() => {
        // Sai da grade e passa a pender do gancho.
        for (const b of grupo) this.grade.remover(b.lin, b.col);
        this.carga = grupo;
        for (const b of this.carga) b.paraFrente();
      })
      .entao({ y: this.geo.trilhoY + 30 }, 350, Easing.suaveSaida)
      .chamar(() => { this.fase = 'livre'; });
  }

  _depositar(col) {
    const livre = this._primeiraLivre(col);
    const n = this.carga.length;

    if (livre + n > this.linhas) {
      // Não cabe. Ação neutra: a garra volta e nada acontece — nem ponto, nem
      // erro. Recusar é mais honesto que empilhar fora da grade, que é o que o
      // original fazia (`arrayBlocos[lin] = [null,null,null,null]`, linha 286).
      this._apontarColuna(this.controle.x);
      this.mascote.definirExpressao('pensando');
      return;
    }

    this.fase = 'movendo';
    // Desce até o bloco MAIS BAIXO da carga encostar na linha de destino.
    const alvoY = this._yDaLinha(livre) - 40 - (n - 1) * this.geo.celula;

    Tween.removerDe(this.garra);
    Tween.para(this.garra, { x: this.controle.x }, movimento.padrao, Easing.suaveSaida)
      .entao({ y: alvoY }, 350, Easing.suaveEntrada)
      .chamar(() => {
        // A carga é toda do mesmo tipo, então a ordem interna não importa:
        // o mais baixo da carga vai para a linha livre mais baixa.
        for (let i = 0; i < n; i++) {
          const bloco = this.carga[n - 1 - i];
          this.grade.definir(livre + i, col, bloco);
          bloco.x = this.xColunas[col];
          bloco.y = this._yDaLinha(livre + i);
        }
        this.ultimoDepositado = this.carga[0];
        this.carga = [];
      })
      .entao({ y: this.geo.trilhoY + 30 }, 350, Easing.suaveSaida)
      .chamar(() => this._resolver());
  }

  // ---------------------------------------------------------------- cascata

  /**
   * A cascata: elimina combos, aplica gravidade, e repete enquanto nascer combo
   * novo. Cada elo pontua.
   *
   * Difere do original num ponto, de propósito: aqui cada passe elimina TODOS os
   * grupos válidos do tabuleiro, enquanto o original só olhava o grupo do bloco
   * depositado e depois os dos blocos que caíram. A versão dele podia deixar um
   * grupo válido de pé — o `console.log('ERRO')` do `VALIDA()` era sintoma disso.
   */
  _resolver() {
    const grupos = this.grade.gruposValidos(3);

    if (grupos.length === 0) {
      this.fase = 'livre';
      this.ultimoDepositado = null;
      if (this.linhaPendente) this._subirLinha();
      return;
    }

    this.fase = 'movendo';
    this.comboNesteCiclo = true;

    let pontos = 0;
    const somados = new Set();

    for (const grupo of grupos) {
      // Combo de 4 ou mais deixa uma estrela. O escolhido é o bloco que a garra
      // acabou de depositar, quando ele está no grupo; se não estiver (é um
      // combo nascido da queda), o mais próximo da base — determinístico, ao
      // contrário do sorteio do original, que fazia a recompensa parecer não ter
      // relação com a jogada. Ver REGRAS, seção 4.4.
      let estrela = null;
      if (grupo.length >= 4) {
        estrela = grupo.includes(this.ultimoDepositado)
          ? this.ultimoDepositado
          : [...grupo].sort((a, b) => (a.lin - b.lin) || (a.col - b.col))[0];
      }

      const som = this.arte.formas[grupo[0].tipo]?.som;
      if (som) this.audio.falar(som);

      for (const bloco of grupo) {
        if (bloco === estrela) continue;
        pontos += bloco.valor;
        somados.add(bloco);
      }

      if (estrela) {
        estrela.estrela = true;
        Tween.removerDe(estrela);
        Tween.para(estrela, { scaleX: 1.25, scaleY: 1.25 }, movimento.entrada, Easing.costasSaida)
          .entao({ scaleX: 1, scaleY: 1 }, movimento.padrao, Easing.suaveSaida);
      }
    }

    // Sai da grade agora; o desaparecer é só visual.
    for (const bloco of somados) {
      if (this.grade.obter(bloco.lin, bloco.col) === bloco) {
        this.grade.remover(bloco.lin, bloco.col);
      }
      Tween.removerDe(bloco);
      Tween.para(bloco, { scaleX: 1.15, scaleY: 1.15 }, movimento.rapido, Easing.suaveSaida)
        .entao({ alpha: 0, scaleX: 0.6, scaleY: 0.6 }, movimento.padrao, Easing.suaveEntrada)
        .chamar(() => bloco.removerDoPai());
    }

    if (pontos > 0) {
      this.placar.acertar(pontos);
      this.mascote.comemorar();
    }
    if (this.placar.encerrado) return;

    // Gravidade e, se algo caiu ou não, um novo passe: um combo pode nascer da
    // queda, e o passe seguinte é quem descobre.
    Tween.de(this)
      .esperar(movimento.rapido + movimento.padrao)
      .chamar(() => {
        const movimentos = this.grade.aplicarGravidade('cima');
        for (const m of movimentos) {
          const bloco = m.peca;
          Tween.removerDe(bloco);
          Tween.para(bloco, { y: this._yDaLinha(m.paraLin) }, movimento.padrao, Easing.quicarSaida);
        }
        Tween.de(this)
          .esperar(movimentos.length > 0 ? movimento.padrao : 0)
          .chamar(() => this._resolver());
      });
  }

  // ------------------------------------------------------------ linha nova

  /**
   * A linha nova: nasce na base e empurra a pilha uma linha para cima.
   *
   * É a pressão do jogo. Sem ela mover peças é neutro, não há vidas, e a criança
   * passaria a partida reorganizando um tabuleiro que nunca a ameaça.
   */
  _subirLinha() {
    if (this.placar.encerrado) return;

    // Derrota: a pilha bateu no teto. Conferido ANTES de subir, como no original.
    for (let col = 0; col < this.colunas; col++) {
      if (this.grade.obter(this.linhas - 1, col)) {
        this.linhaPendente = false;
        this.placar.encerrarPorTempo(); // não venceu ⇒ emite 'derrota'
        return;
      }
    }

    this.linhaPendente = false;

    // Um ciclo fechado sem nenhum combo é a falha deste jogo (REGRAS, seção 7).
    if (!this.comboNesteCiclo) {
      this.placar.errar();
      this.mascote.lamentar();
      if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    }
    this.comboNesteCiclo = false;

    // Desloca tudo uma linha para cima, de cima para baixo para não sobrescrever.
    // O `GridBoard` não tem operação de deslocar a grade inteira (está registrado
    // no plano visual, seção 12), então ela mora aqui — e usa só a API pública,
    // para que `definir` mantenha `lin`/`col` de cada peça em dia.
    for (let lin = this.linhas - 1; lin > 0; lin--) {
      for (let col = 0; col < this.colunas; col++) {
        const bloco = this.grade.obter(lin - 1, col);
        if (bloco) this.grade.definir(lin, col, bloco);
        this.grade.remover(lin - 1, col);
      }
    }

    // A linha nova, nascendo abaixo da base e subindo para o lugar.
    const novos = [];
    for (let col = 0; col < this.colunas; col++) {
      const bloco = this._novoBloco(this._sortearTipo(), 0, col);
      bloco.y = this._yDaLinha(-1);
      novos.push(bloco);
    }
    this._evitarComboDeGraca(novos);

    // Percorre a GRADE, não os filhos do tabuleiro: um bloco em meio ao
    // desaparecimento de um combo ainda é filho, mas já saiu da grade, e mexer
    // no y dele o faria dar um salto no fim da animação.
    for (const bloco of this.grade.todas()) {
      Tween.removerDe(bloco);
      Tween.para(bloco, { y: this._yDaLinha(bloco.lin) }, movimento.lento, Easing.suave);
    }

    // A pilha alta é aviso: a coruja se inclina antes de a partida acabar.
    const maisAlta = Math.max(...this.xColunas.map((_, col) => this._primeiraLivre(col)));
    if (maisAlta >= this.linhas - 2) this.mascote.definirExpressao('triste');

    // Um combo pode nascer da linha nova encostando na pilha? Não: o sorteio
    // anticombo acima garante que não. Mas a subida pode ter juntado peças que
    // antes estavam separadas por uma coluna vazia, então vale conferir.
    Tween.de(this)
      .esperar(movimento.lento)
      .chamar(() => { if (this.fase === 'livre') this._resolver(); });
  }

  // -------------------------------------------------------------- ciclo/fim

  pausar() {
    if (this.placar.encerrado) return;
    this.pausada = true;
    this.tempo.pausar();
    this.pausa.abrir();
  }

  /**
   * A nota da partida, em 0 a 3 estrelas, pelo PERCENTUAL da meta alcançado.
   *
   * A `ResultScreen` desenha uma estrela por pergunta só até 6; acima disso ela
   * usa o valor que a cena passar. A nota de reserva do `ScoreSystem` derivaria
   * dos erros e daria ZERO em qualquer derrota — uma criança que fez 15 de 20
   * pontos veria a fileira vazia, o oposto do que o DESIGN.md manda. Por isso a
   * conta é aqui. Ver PLANO-VISUAL, seção 8.
   */
  _notaEmEstrelas() {
    const fracao = this.placar.total > 0 ? this.placar.pontuacao / this.placar.total : 0;
    if (fracao >= 1) return 3;
    if (fracao >= 0.7) return 2;
    if (fracao >= 0.3) return 1;
    return 0;
  }

  /**
   * Fim de partida. É AQUI que o registro no AVA acontece: ao ENTRAR no estado
   * 'resultado' o motor chama o `AvaBridge` com este objeto, uma vez só.
   *
   * `acertos` sai de `placar.pontuacao`, que desconta as falhas na vitória
   * (regra RE-02). O bruto viaja nos extras, para o professor que quiser ver.
   */
  _terminar(venceu) {
    this.tempo.pausar();
    this.fase = 'movendo';
    if (venceu) this.mascote.comemorar(); else this.mascote.lamentar();

    this.irPara('resultado', {
      nivel: this.nivel,
      estrelas: this._notaEmEstrelas(),
      resultado: this.placar.paraAva(venceu, {
        pontosBrutos: this.placar.acertos,
        ciclosSemCombo: this.placar.erros,
      }),
    });
  }

  atualizar(dt) {
    if (this.pausada) {
      // A pausa continua animando com a partida congelada.
      this.pausa.atualizar(dt);
      return;
    }
    super.atualizar(dt);

    // A carga acompanha o gancho. Feito aqui, e não por reparentar os blocos na
    // garra, para que uma peça carregada nunca saia da árvore do tabuleiro.
    for (let i = 0; i < this.carga.length; i++) {
      this.carga[i].x = this.garra.x;
      this.carga[i].y = this._yDaCarga(i);
    }

    if (this.placar.encerrado) return;

    // O relógio da linha nova corre sempre; a subida espera a jogada terminar.
    // O original congelava o cronômetro inteiro durante um movimento
    // (`if (acao != 'movendo')`), o que dava tempo de graça a quem demorava.
    this.tempoDeLinha += dt;
    if (this.tempoDeLinha >= this.nivel.segundosPorLinha) {
      this.tempoDeLinha = 0;
      this.linhaPendente = true;
    }
    if (this.linhaPendente && this.fase === 'livre') this._subirLinha();
  }

  /**
   * Limpeza. `Tween.removerTodos()` não é excesso de zelo: os tweens vivem numa
   * lista GLOBAL, e um `chamar` pendente de cascata rodaria depois de a cena ter
   * sido destruída — chamando `_resolver()` num tabuleiro que não existe mais.
   * Sair para o menu no meio de uma jogada é exatamente esse caso.
   */
  aoSair() {
    this.audio.calar();
    this.audio.pararMusica();
    Tween.removerTodos();
  }
}
