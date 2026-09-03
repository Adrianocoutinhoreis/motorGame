import {
  Scene, Node, TextNode, ScoreSystem, ScoreBar, TimerBar, IconButton, SoundToggle,
  PauseScreen, HelpScreen, Panel, Background, GridBoard, PathSelector, Watchdog,
  Tween, Easing, ESTADOS, cores, tipografia, espaco, raio, sombras, movimento, rand,
} from '../../engine/index.js';

/**
 * GameScene — a partida do Jogo das Cores.
 *
 * Especificação: `docs/REGRAS-JOGO-DAS-CORES.md` e
 * `docs/PLANO-VISUAL-JOGO-DAS-CORES.md`.
 *
 * O ciclo de uma jogada:
 *
 *   aperta numa peça  →  arrasta pelas vizinhas IGUAIS  →  solta
 *        (ou)  toca peça por peça  →  para de tocar
 *   3 ou mais  →  narra a cor  →  peças somem  →  gravidade  →  peças novas
 *
 * Durante a resolução `this.fase` é `'movendo'` e o gesto não começa outro
 * caminho. É a trava que `docs/STATES.md` exige — e o `Watchdog` (seção final)
 * é a rede para quando ela não se soltar.
 */

/** Quanto o caminho de TOQUE espera, em ms, antes de fechar sozinho. */
const ESPERA_DO_TOQUE = 900;

/** Atraso, em ms, de cada coluna na onda da mistura. Ver `_misturar`. */
const ATRASO_POR_COLUNA = 45;

// ---------------------------------------------------------------------------
// Peca
// ---------------------------------------------------------------------------

/**
 * Peca — um quadrado colorido do tabuleiro. Chapada, sem arquivo de imagem.
 *
 * **Decisão de acessibilidade de 02/09/2026, do humano.** Até aqui a peça era
 * um SVG com uma TEXTURA própria assada dentro (xadrez, bolinhas, ondas…) — o
 * canal redundante que fazia o jogo existir para quem não distingue cor.
 * Considerou-se substituir a textura por um ÍCONE DE FORMA (círculo = azul,
 * quadrado = vermelho…), e a ideia foi recusada de propósito: no Jogo das
 * Formas a mesma criança aprende que forma e cor são atributos
 * INDEPENDENTES, e fixar uma forma por cor aqui contradiria essa lição entre
 * as duas aulas da mesma coleção. A escolha final, explícita, foi cor
 * chapada SEM símbolo nenhum — menos poluição visual, e sem reintroduzir a
 * associação forma=cor.
 *
 * **A consequência é real, e fica registrada, não escondida:** sem textura,
 * o jogo volta a depender só da cor. `vermelho`, `azul` e `roxo` ficam a 5
 * unidades de luminância um do outro (medição em `REGRAS-JOGO-DAS-CORES.md`,
 * seção 3.2) — em escala de cinza são praticamente o mesmo cinza, e vermelho
 * e azul são os dois do nível 1. Para quem não distingue essas cores, o jogo
 * deixa de ser jogável nesse nível. Não é um efeito colateral não previsto:
 * é o preço desta decisão, medido.
 *
 * `cor` é o nome da cor (`'azul'`), não o código — é o que o `PathSelector`
 * compara, e é o id da narração.
 */
class Peca extends Node {
  constructor({ cor, lado, arte }) {
    super({ largura: lado, altura: lado });
    this.cor = cor;
    this.lado = lado;
    this.arte = arte;
    // Âncora no centro: tween de escala e de posição ficam naturais.
    this.regX = lado / 2;
    this.regY = lado / 2;
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = sombras.suave.cor;
    ctx.shadowBlur = sombras.suave.desfoque;
    ctx.shadowOffsetX = sombras.suave.x;
    ctx.shadowOffsetY = sombras.suave.y;
    ctx.fillStyle = this.arte.cores[this.cor]?.cor ?? cores.tintaSuave;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.lado, this.lado, raio.md);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    // Contorno interno, para a peça se separar da vizinha da MESMA cor —
    // sem ele duas peças iguais lado a lado se fundem num retângulo só.
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// GameScene
// ---------------------------------------------------------------------------

export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.geo = config.grade;
    this.coresDoNivel = this.nivel.cores;
    /** Quantas peças um caminho precisa para valer. Um lugar só. */
    this.minimo = this.geo.minimo ?? 3;

    this.placar = new ScoreSystem({
      total: this.nivel.meta,
      nivel: this.nivel.id,
      vidas: 0,
    });

    // A peça é chapada — sem SVG a carregar. `arte` sobrevive como objeto só
    // por `cores` (o token de cada nome, usado em `Peca.desenhar()` e no
    // painel lateral).
    this.arte = { cores: config.cores };

    // ------------------------------------------------------------- cenário
    // Tema emprestado do Jogo das Formas por decisão do humano (config.tema).
    //
    // `mostrarPecas: false` não é economia: o fundo é a única superfície desta
    // tela que NÃO pode ter cor interessante. Qualquer mancha colorida atrás do
    // tabuleiro compete com a comparação de cores que é o conteúdo do jogo.
    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'formas',
      mostrarPecas: false,
    }));

    this._calcularGeometria();
    this._montarTabuleiro();
    this._montarHud();
    this._montarPainelCores();
    this._montarGesto();
    this._montarAviso();
    // As CAMADAS por último, e a ordem aqui é funcional, não estética: quem
    // recebe o toque é o nó mais ao topo. Com a pausa montada antes de
    // `_montarGesto`, a área de gesto — que cobre o tabuleiro, e o tabuleiro
    // cobre o painel da pausa — ficava por cima dos botões dela: a pausa abria
    // e CONTINUAR, SAIR e a ajuda não respondiam a nada. O motor agora também se
    // protege (`PauseScreen.abrir` e `HelpScreen.abrir` sobem a própria camada),
    // mas montar na ordem certa é o que deixa o desenho e o toque coerentes.
    this._montarPausa();
    this._montarGuarda();

    /** 'livre' = aceita gesto · 'movendo' = resolvendo um caminho. */
    this.fase = 'livre';
    /** Quantos caminhos válidos a criança fechou — vai nos extras do AVA. */
    this.caminhosFeitos = 0;
    /**
     * Quantas misturas a criança VIU — o tabuleiro que nasce morto é corrigido
     * antes de a tela aparecer e não entra aqui, porque este número mede
     * interrupção, e aquela não interrompe nada.
     *
     * Vai nos extras do AVA porque é DADO DE PROJETO, não desempenho da criança:
     * muitas misturas numa turma dizem que o nível tem cores demais para o
     * tabuleiro.
     */
    this.misturas = 0;

    this.tempo.iniciar();
    this.placar.on('vitoria', () => this._terminar(true));
    this.placar.on('derrota', () => this._terminar(false));
  }

  // ------------------------------------------------------------- geometria

  /**
   * Tudo derivado, nada cravado. PLANO-VISUAL, seção 2.
   *
   * O tabuleiro é empurrado para a DIREITA, e não centrado: a coluna do HUD à
   * esquerda equilibra a composição, e é a mesma solução do Jogo das Formas —
   * para os dois jogos não parecerem de coleções diferentes.
   */
  _calcularGeometria() {
    const { celula } = this.geo;
    this.colunas = 7;
    this.linhas = 5;

    this.larguraTabuleiro = this.colunas * celula;
    this.alturaTabuleiro = this.linhas * celula;
    this.tabuleiroX = this.largura - espaco.md - this.larguraTabuleiro;
    this.tabuleiroY = Math.round((this.altura - this.alturaTabuleiro) / 2);

    this.hudX = espaco.md;
    this.hudLargura = this.tabuleiroX - espaco.md * 2;

    this.xCelula = (col) => this.tabuleiroX + col * celula + celula / 2;
    this.yCelula = (lin) => this.tabuleiroY + lin * celula + celula / 2;
  }

  // ------------------------------------------------------------- tabuleiro

  _montarTabuleiro() {
    this.grade = new GridBoard({
      linhas: this.linhas,
      colunas: this.colunas,
      // Vizinhança de 8: a diagonal vale, como no original de 2013.
      diagonais: true,
      // A peça deste jogo tem `cor`, não `tipo`. Sem isto o `temJogada()` da
      // grade compararia `undefined` com `undefined` e responderia "tem jogada"
      // sempre — verificação que nunca reprova.
      tipoDe: (p) => p?.cor,
    });

    this.moldura = new Node({ largura: this.largura, altura: this.altura });
    const { tabuleiroX: bx, tabuleiroY: by, larguraTabuleiro: bw, alturaTabuleiro: bh } = this;
    // A moldura é o que arredonda os cantos que o original deixava VAZIOS (ele
    // tinha 31 peças, não 35). Assim o `GridBoard` não precisa do conceito de
    // célula bloqueada, que mexeria em gravidade e reposição por um ganho
    // puramente visual. REGRAS, seção 3.1.
    //
    // **Branco sólido, decisão de acessibilidade de 02/09/2026.** Era um
    // véu de 10% — o degradê índigo→ciano do cenário passava quase inteiro por
    // baixo das peças, e a matiz do meio daquele degradê (`#6366F1`) é quase a
    // mesma do `ludica.roxo`: a peça roxa se camuflava nele. O branco fica
    // LIMITADO à área do tabuleiro — não ao cenário inteiro, que continua o
    // mesmo — igual ao cartão do painel "AS CORES" ao lado (`Panel`, também
    // `cores.superficie`): as oito cores da paleta lúdica precisam de fundo
    // neutro para se destacar, e branco não compete com nenhuma delas.
    //
    // **Sem sombra, de propósito** — diferente do `Panel`. A borda direita da
    // moldura fica a só 8 px da borda do palco (`bx+bw+12` = 1272 de 1280), e o
    // `sombras.cartao` tem 18 px de desfoque: a sombra vazava para além da caixa
    // lógica, na área que `pintarSangria` desenha à parte sem saber da moldura —
    // e como só o INTERIOR ganhava o escurecimento, nascia uma emenda visível
    // bem na junção do letterbox. Pegou no teste de 1b (`teste-jogabilidade-
    // cores.mjs`), que existe exatamente para isto.
    this.moldura.desenhar = (ctx) => {
      ctx.save();
      ctx.fillStyle = cores.superficie;
      ctx.beginPath();
      ctx.roundRect(bx - 12, by - 12, bw + 24, bh + 24, 44);
      ctx.fill();
      ctx.restore();
    };
    this.adicionar(this.moldura);

    this.tabuleiro = new Node();
    this.adicionar(this.tabuleiro);

    for (let lin = 0; lin < this.linhas; lin++) {
      for (let col = 0; col < this.colunas; col++) this._nascerPeca(lin, col);
    }

    // **Sem `_evitarComboDeGraca`.** No Jogo das Formas um grupo que se toque
    // resolve sozinho, então o tabuleiro inicial podia dar pontos que a criança
    // não fez. Aqui o caminho é DESENHADO por ela: nada acontece sem gesto, e
    // não existe ponto de graça a evitar.
    //
    // Mas o problema SIMÉTRICO existe e é grave: o tabuleiro pode nascer sem
    // nenhuma jogada possível. Medido: 1,6% dos tabuleiros de 8 cores. Aqui a
    // correção é silenciosa e sem animação — ninguém viu o tabuleiro ainda, e
    // uma mistura na tela de entrada só assustaria.
    this.grade.garantirJogada({ minimo: this.minimo });
    // Incondicional de propósito. A versão anterior era
    // `if (garantirJogada(...)) recolocar()`, e o `recolocar` só rodava nos 1,6%
    // de tabuleiros que nascem mortos — quer dizer, **em nenhum teste**. Quebrado,
    // ninguém saberia até uma criança ver peças fora do lugar. Assim a posição
    // sai de um lugar só, sempre, e todo teste passa por ela.
    this._recolocarPecas();

    this.camadaCaminho = new Node({ largura: this.largura, altura: this.altura });
    this.camadaCaminho.desenhar = (ctx) => this._desenharCaminho(ctx);
    this.adicionar(this.camadaCaminho);
  }

  _sortearCor() {
    return this.coresDoNivel[rand.inteiro(0, this.coresDoNivel.length - 1)];
  }

  _nascerPeca(lin, col, corForcada = null) {
    const peca = new Peca({
      cor: corForcada ?? this._sortearCor(),
      lado: this.geo.peca,
      arte: this.arte,
    });
    peca.x = this.xCelula(col);
    peca.y = this.yCelula(lin);
    this.tabuleiro.adicionar(peca);
    this.grade.definir(lin, col, peca);
    return peca;
  }

  // -------------------------------------------------------------------- HUD

  /**
   * Coluna à esquerda, 324 px de largura, derivada de `tabuleiroX`.
   *
   * Os botões são 96 px lógicos = 48 físicos no celular, acima do piso de 44 do
   * WCAG 2.5.5. São alvos ISOLADOS: errar um não faz nada, ao contrário das
   * células do tabuleiro, que se encaixam na vizinha.
   */
  _montarHud() {
    const { config } = this;
    const x = this.hudX;
    const w = this.hudLargura;

    this.barra = new ScoreBar({
      largura: w,
      altura: 44,
      x,
      y: this.tabuleiroY,
      icone: 'estrela',
      mostrarNumeros: true,
    });
    this.barra.acompanhar(this.placar);
    this.adicionar(this.barra);

    this.tempo = new TimerBar({
      largura: w,
      altura: 44,
      x,
      y: this.tabuleiroY + 44 + espaco.md,
      duracao: this.nivel.duracao,
    });
    this.tempo.on('acabou', () => {
      if (!this.placar.encerrado) this.placar.encerrarPorTempo();
    });
    this.adicionar(this.tempo);

    const yBotoes = this.tabuleiroY + (44 + espaco.md) * 2;
    const lado = 96;
    // TRÊS botões na coluna de 324, e o vão cai de 20 para 16: 96×3 + 16×2 = 320.
    // 16 é o piso de `acessibilidade.espacoEntreAlvos`, então isto encosta no
    // limite de propósito — a alternativa era uma segunda fileira, que roubaria
    // altura do painel "AS CORES", e aquele painel é conteúdo pedagógico.
    const vaoBotoes = 16;
    const passoBotao = lado + vaoBotoes;

    this.adicionar(new IconButton({
      icone: 'pausa',
      variante: 'suaveAzul',
      tamanho: lado,
      x,
      y: yBotoes,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pausar(),
    }));

    // AJUDA — o tutorial por cima da partida, sem perdê-la. Ícone `tutorial`, o
    // mesmo do "COMO JOGAR" do menu: é a mesma explicação, e a criança que já viu
    // aquele botão reconhece este.
    this.adicionar(new IconButton({
      icone: 'tutorial',
      variante: 'suaveAzul',
      tamanho: lado,
      x: x + passoBotao,
      y: yBotoes,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pedirAjuda(),
    }));

    this.adicionar(new SoundToggle({
      tamanho: lado,
      x: x + passoBotao * 2,
      y: yBotoes,
      audio: this.audio,
    }));

    this.yPainelCores = yBotoes + lado + espaco.md;
  }

  /**
   * "AS CORES" — onde textura, cor e NOME se encontram.
   *
   * É conteúdo, não legenda: a criança que ainda não lê associa a amostra ao
   * padrão do tabuleiro, e a que já lê ganha a palavra escrita junto do nome que
   * vai ouvir ao fechar o caminho.
   */
  _montarPainelCores() {
    const x = this.hudX;
    const w = this.hudLargura;
    const y = this.yPainelCores;
    const h = this.tabuleiroY + this.alturaTabuleiro - y;

    const painel = new Panel({ largura: w, altura: h, x, y });
    this.adicionar(painel);

    painel.adicionar(new TextNode('As cores', {
      x: espaco.md,
      y: espaco.sm,
      tamanho: tipografia.apoio,
      peso: tipografia.pesoForte,
      cor: cores.tintaSuave,
      alinhamento: 'left',
    }));

    // A altura da linha é DERIVADA do número de cores do nível, não fixa: com 4
    // cores o painel respira, com 8 ele fecha. Cravar 44 faria o nível 3 estourar.
    const yLista = espaco.sm + tipografia.apoio + espaco.sm;
    const passo = (h - yLista - espaco.sm) / this.coresDoNivel.length;
    const amostra = Math.min(34, passo - 6);

    for (let i = 0; i < this.coresDoNivel.length; i++) {
      const nome = this.coresDoNivel[i];
      const cy = yLista + passo * i + passo / 2;

      const swatch = new Peca({ cor: nome, lado: amostra, arte: this.arte });
      swatch.x = espaco.md + amostra / 2;
      swatch.y = cy;
      painel.adicionar(swatch);

      painel.adicionar(new TextNode(nome, {
        x: espaco.md + amostra + espaco.sm,
        y: cy - tipografia.apoio * 0.6,
        tamanho: tipografia.apoio,
        peso: tipografia.pesoForte,
        cor: cores.tinta,
        alinhamento: 'left',
      }));
    }
  }

  _montarPausa() {
    this.pausa = new PauseScreen({
      largura: this.largura,
      altura: this.altura,
      audio: this.audio,
      somToque: this.config.audio?.clique,
      aoContinuar: () => {
        this.pausada = false;
        this.tempo.retomar();
        Tween.retomarTodos();
      },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    // A AJUDA é o tutorial por cima da partida. Ver `HelpScreen`: a partida
    // continua viva atrás do véu, e voltar devolve o tabuleiro como estava.
    this.ajuda = new HelpScreen({
      cena: this,
      aoFechar: () => {
        this.pausada = false;
        if (!this.placar.encerrado) this.tempo.retomar();
        Tween.retomarTodos();
      },
    });
    this.adicionar(this.ajuda);
  }

  /**
   * Pedir ajuda: pausa a partida e abre o tutorial por cima dela.
   *
   * Pausa de verdade, e não só "para de aceitar gesto": com `pausada` o
   * cronômetro para, o cão de guarda não conta o tempo como travamento, e o
   * `tempoSegundos` do AVA não soma o tempo lendo a explicação — o que é o
   * certo, porque ler a ajuda não é jogar.
   */
  pedirAjuda() {
    if (this.placar.encerrado || this.pausada) return;
    this.pausada = true;
    this.tempo.pausar();
    this._pararEsperaDoToque();
    this.caminho.cancelar();
    Tween.pausarTodos();
    this.ajuda.abrir();
  }

  // ------------------------------------------------------------------ gesto

  /**
   * Os dois gestos, com as MESMAS regras de vizinhança e cor.
   *
   * ## Como arrasto e toque são separados
   *
   * O `Input` emite `soltar` e, logo depois, `toque` — este último só se apertar
   * e soltar caíram no mesmo nó. Como a área de jogo é um nó só, um arrasto que
   * começa e termina nela dispara os dois. Então:
   *
   *  - `arrastar` marca o gesto como arrasto ao entrar na SEGUNDA célula. Uma
   *    célula só não é arrasto: é dedo tremendo sobre a peça que ele tocou;
   *  - `soltar` fecha o caminho **se houve arrasto**, e arma `_ignorarToque`;
   *  - `toque` monta o caminho por toques, a menos que o arrasto acabou de
   *    acontecer.
   *
   * `_ignorarToque` é zerado em `apertar`, e não só quando é usado: um arrasto
   * que termina FORA da área de jogo nunca gera `toque`, e a bandeira presa
   * engoliria o toque seguinte.
   */
  _montarGesto() {
    // Nó interativo cobrindo a área de jogo. Sem ele não existe toque nenhum:
    // `toque` exige um nó sob o dedo, e as peças nascem `interativo: false`.
    // (COMPONENTES.md, "A armadilha: sem nó interativo, não existe toque".)
    this.areaJogo = new Node({
      x: this.tabuleiroX,
      y: this.tabuleiroY,
      largura: this.larguraTabuleiro,
      altura: this.alturaTabuleiro,
      interativo: true,
    });
    this.adicionar(this.areaJogo);

    this.caminho = new PathSelector({
      grade: this.grade,
      minimo: this.minimo,
      corDe: (p) => p?.cor,
    });

    this._arrastou = false;
    this._ignorarToque = false;
    this._pecaInicial = null;

    this.areaJogo.on('apertar', (ponto) => {
      this._arrastou = false;
      this._ignorarToque = false;
      this._pecaInicial = this._pecaSob(ponto);
    });

    this.areaJogo.on('arrastar', (ponto) => {
      if (this.pausada || this.fase !== 'livre' || this.placar.encerrado) return;
      const peca = this._pecaSob(ponto);
      if (!peca) return;

      if (!this._arrastou) {
        if (!this._pecaInicial || peca === this._pecaInicial) return;
        this._arrastou = true;
        this._pararEsperaDoToque();
        this.caminho.cancelar();
        this.caminho.comecar(this._pecaInicial);
      }
      this.caminho.oferecer(peca);
    });

    this.areaJogo.on('soltar', () => {
      if (!this._arrastou) return;
      this._ignorarToque = true;
      this._arrastou = false;
      this._fecharCaminho();
    });

    this.areaJogo.on('toque', (ponto) => {
      if (this._ignorarToque) { this._ignorarToque = false; return; }
      if (this.pausada || this.fase !== 'livre' || this.placar.encerrado) return;
      const peca = this._pecaSob(ponto);
      if (!peca) return;

      this.caminho.alternar(peca);
      // Válido no toque significa feito — mas só quando a criança PARA de tocar,
      // senão um caminho de cinco seria cortado no terceiro toque. Ver a
      // pendência sobre o valor desta espera nas REGRAS, seção 11.
      if (this.caminho.valido) this._armarEsperaDoToque();
      else this._pararEsperaDoToque();
    });

    // Tocar fora do tabuleiro cancela um caminho de toque em curso. Sem isto não
    // haveria como desistir a não ser desfazendo peça por peça.
    //
    // **`apertar` no `Input`, e não `toque`** — e a primeira versão disto usava
    // `toque`, que não funcionava. O motivo é a armadilha documentada em
    // COMPONENTES.md: `toque` exige um nó INTERATIVO sob o dedo, e fora do
    // tabuleiro não há nenhum (o painel e o fundo nascem `interativo: false`),
    // então nada era emitido. Já `apertar` o `Input` emite sempre que o ponto cai
    // na área do jogo, com nó ou sem nó — que é exatamente o caso aqui.
    //
    // Ouvir no `Input` recebe TODO aperto, inclusive os que começam no tabuleiro
    // e nos botões; por isso a primeira linha do corpo é a que importa.
    this.ouvirEntrada('apertar', (ponto) => {
      if (this._dentroDoTabuleiro(ponto)) return;
      if (this.pausada || this.caminho.tamanho === 0) return;
      this._pararEsperaDoToque();
      this.caminho.cancelar();
    });
  }

  // ------------------------------------------------------------------ aviso

  /**
   * "MISTUREI AS CORES!" — a faixa que explica o tabuleiro se reorganizando.
   *
   * Existe porque a alternativa é pior: a tela toda mexendo sozinha, em silêncio,
   * sem a criança ter tocado em nada. Nesta idade isso lê-se como erro dela.
   *
   * Fica centrada no tabuleiro, e essa escolha tem um custo: por menos de um
   * segundo ela cobre parte de uma linha de peças em movimento. O outro lugar
   * possível era a coluna do HUD, onde o olho não está. Preferi cobrir peça a
   * não ser lida — **e é dos itens que só o olho verifica** (PLANO-VISUAL,
   * seção 6).
   */
  _montarAviso() {
    const w = Math.min(460, this.larguraTabuleiro - espaco.lg * 2);
    const h = 92;

    this.aviso = new Panel({
      largura: w,
      altura: h,
      // Âncora no centro: o tween de escala tem de crescer a partir do meio, e
      // não empurrar a faixa para o lado enquanto cresce.
      x: this.tabuleiroX + this.larguraTabuleiro / 2,
      y: this.tabuleiroY + this.alturaTabuleiro / 2,
      regX: w / 2,
      regY: h / 2,
      contorno: cores.tinta,
    });
    this.aviso.visible = false;

    this.aviso.adicionar(new TextNode('Misturei as cores!', {
      x: w / 2,
      y: h / 2,
      // `subtitulo`, não `titulo`: em caixa alta (RE-01) são 18 caracteres, e a
      // 48 px eles estouram os 460 da faixa.
      tamanho: tipografia.subtitulo,
      peso: tipografia.pesoForte,
      cor: cores.tinta,
      alinhamento: 'center',
      linhaBase: 'middle',
      larguraMaxima: w - espaco.md * 2,
    }));

    this.aviso.mostrar = () => {
      this.aviso.visible = true;
      this.aviso.alpha = 0;
      this.aviso.scaleX = 0.8;
      this.aviso.scaleY = 0.8;
      Tween.removerDe(this.aviso);
      Tween.para(
        this.aviso,
        { alpha: 1, scaleX: 1, scaleY: 1 },
        movimento.padrao,
        Easing.costasSaida,
      );
    };
    this.aviso.esconder = () => {
      Tween.removerDe(this.aviso);
      Tween.para(this.aviso, { alpha: 0 }, movimento.rapido, Easing.suaveEntrada)
        .chamar(() => { this.aviso.visible = false; });
    };

    this.adicionar(this.aviso);
  }

  _dentroDoTabuleiro(ponto) {
    return ponto.x >= this.tabuleiroX
      && ponto.x < this.tabuleiroX + this.larguraTabuleiro
      && ponto.y >= this.tabuleiroY
      && ponto.y < this.tabuleiroY + this.alturaTabuleiro;
  }

  /**
   * A peça sob um ponto — pela CÉLULA inteira, não pelo retângulo da peça.
   *
   * É o que faz o alvo tocável ser 128 px (64 físicos no celular) e não 112: o
   * vão de 16 px entre vizinhas pertence à célula, e exigir precisão dentro da
   * peça devolveria ao dedo da criança o problema que a medição resolveu.
   */
  _pecaSob(ponto) {
    if (!this._dentroDoTabuleiro(ponto)) return null;
    const { celula } = this.geo;
    const col = Math.floor((ponto.x - this.tabuleiroX) / celula);
    const lin = Math.floor((ponto.y - this.tabuleiroY) / celula);
    return this.grade.obter(lin, col);
  }

  _armarEsperaDoToque() {
    this._pararEsperaDoToque();
    this._esperaToque = Tween.de(this)
      .esperar(ESPERA_DO_TOQUE)
      .chamar(() => { this._esperaToque = null; this._fecharCaminho(); });
  }

  _pararEsperaDoToque() {
    if (this._esperaToque) {
      this._esperaToque.parar();
      this._esperaToque = null;
    }
  }

  // ------------------------------------------------------------- resolução

  _fecharCaminho() {
    const ganhas = this.caminho.confirmar();
    if (ganhas.length === 0) return;   // tentativa cancelada: nem som, nem erro

    this.fase = 'movendo';
    this.caminhosFeitos++;

    // A narração é o CONTEÚDO: nomear a cor no instante em que ela é conquistada
    // é o que transforma discriminação visual em vocabulário. Sem arquivo, o
    // motor fica em silêncio e diz no console o que a voz deveria falar.
    const nome = ganhas[0].cor;
    this.audio.falar(this.config.cores[nome]?.som ?? null, { texto: nome });

    this.placar.acertar(ganhas.length);

    for (const peca of ganhas) {
      if (this.grade.obter(peca.lin, peca.col) === peca) {
        this.grade.remover(peca.lin, peca.col);
      }
      Tween.removerDe(peca);
      Tween.para(peca, { scaleX: 1.15, scaleY: 1.15 }, movimento.rapido, Easing.suaveSaida)
        .entao({ alpha: 0, scaleX: 0.6, scaleY: 0.6 }, movimento.padrao, Easing.suaveEntrada)
        .chamar(() => peca.removerDoPai());
    }

    if (this.placar.encerrado) return;

    // A cadeia é `Tween.de(this)` — a CENA como alvo — e isso é o que o
    // `Watchdog` observa: enquanto a fase está ocupada existe tween vivo aqui.
    Tween.de(this)
      .esperar(movimento.rapido + movimento.padrao)
      .chamar(() => this._cairERepor());
  }

  _cairERepor() {
    // Gravidade para BAIXO: a linha 0 é o topo neste jogo.
    const movimentos = this.grade.aplicarGravidade('baixo');
    for (const m of movimentos) {
      Tween.removerDe(m.peca);
      Tween.para(m.peca, { y: this.yCelula(m.paraLin) }, movimento.padrao, Easing.quicarSaida);
    }

    // Repõe de cima: a peça nasce ACIMA da moldura e cai para o lugar. Nascer no
    // lugar faria peças aparecerem do nada no meio do tabuleiro.
    const novas = [];
    for (const { lin, col } of this.grade.vazias()) {
      const peca = this._nascerPeca(lin, col);
      peca.y = this.tabuleiroY - this.geo.celula * (this.linhas - lin);
      novas.push({ peca, lin });
    }
    for (const { peca, lin } of novas) {
      Tween.para(peca, { y: this.yCelula(lin) }, movimento.padrao * 1.4, Easing.quicarSaida);
    }

    Tween.de(this)
      .esperar(movimento.padrao * 1.4)
      .chamar(() => this._liberarGesto());
  }

  /**
   * O fim de toda resolução: devolver o gesto à criança — mas só depois de
   * garantir que existe jogada para ela fazer.
   *
   * **É aqui que o defeito relatado se resolve.** Sem esta conferência o jogo
   * devolvia o gesto num tabuleiro que podia estar morto, e a criança ficava
   * arrastando o dedo por peças que nunca formavam caminho, sem nada na tela
   * dizendo que o problema não era ela. Medido no nível 3 (8 cores): **76% das
   * partidas chegavam a esse tabuleiro** antes da meta.
   */
  _liberarGesto() {
    const info = this.grade.garantirJogada({ minimo: this.minimo });
    if (!info) {
      this.fase = 'livre';
      return;
    }
    if (!info.possivel) {
      // Não existem `minimo` peças de uma mesma cor no tabuleiro — configuração
      // impossível, não azar. Devolve o gesto de todo modo: melhor um tabuleiro
      // sem jogada do que um jogo que não responde ao dedo.
      console.error('[cores] não há jogada possível e não consegui criar uma; o nível está mal configurado');
      this.fase = 'livre';
      return;
    }
    this._misturar(info);
  }

  /**
   * A mistura, com a criança olhando. `fase` continua `'movendo'`.
   *
   * Três decisões, e nenhuma é enfeite:
   *
   *  - **as peças VOAM para o lugar novo**, uma por uma, em vez de trocar num
   *    corte. A criança precisa ver que são as mesmas peças mudando de lugar; um
   *    corte seco lê-se como "o jogo recomeçou" ou como erro;
   *  - **o tempo para.** O travamento é falha do tabuleiro, não da criança, e
   *    cobrar dela o segundo que a mistura leva seria cobrar pelo nosso defeito;
   *  - **é anunciado**, na voz e por escrito. Uma tela que se reorganiza sozinha
   *    e em silêncio é assustadora nesta idade.
   */
  _misturar(info) {
    this.misturas++;

    this.audio.falar(this.config.audio?.misturar ?? null, { texto: 'Misturei as cores!' });
    this.tempo.pausar();
    this.aviso.mostrar();

    // **Escalonado por coluna, e isso saiu de uma captura.** Na primeira versão
    // as 35 peças partiam juntas, cruzavam o meio da tela ao mesmo tempo e se
    // amontoavam num bolo — lê-se como a tela desmoronando, não como misturar.
    // Saindo da esquerda para a direita, vira uma onda, e a criança consegue
    // seguir peça por peça.
    for (const m of info.movimentos) {
      Tween.removerDe(m.peca);
      Tween.de(m.peca)
        .esperar(m.deCol * ATRASO_POR_COLUNA)
        .entao(
          { x: this.xCelula(m.paraCol), y: this.yCelula(m.paraLin) },
          movimento.lento,
          Easing.suave,
        );
    }

    // A cadeia é `Tween.de(this)` — a cena — porque é ela que o `Watchdog`
    // observa. Uma mistura resolvida por tweens só nas peças deixaria a fase
    // ocupada sem sinal de vida na cena, e o cão de guarda a mataria no meio.
    // Derivado, não cravado: a última coluna só PARTE em
    // `(colunas-1) * ATRASO_POR_COLUNA`, e devolver o gesto antes de ela chegar
    // deixaria a criança arrastar por peças em voo.
    const duracao = (this.colunas - 1) * ATRASO_POR_COLUNA + movimento.lento + movimento.padrao;
    Tween.de(this)
      .esperar(duracao)
      .chamar(() => {
        this.aviso.esconder();
        this.fase = 'livre';
        // `pausada` importa: a criança pode ter aberto a pausa durante a
        // mistura, e retomar aqui destravaria o cronômetro por trás da tela.
        if (!this.pausada && !this.placar.encerrado) this.tempo.retomar();
      });
  }

  /**
   * Põe cada peça no lugar que a grade diz. Para depois de uma troca SEM
   * animação: `garantirJogada` mexe na grade, e o x/y da peça não a acompanha.
   */
  _recolocarPecas() {
    this.grade.paraCada((peca, lin, col) => {
      if (!peca) return;
      peca.x = this.xCelula(col);
      peca.y = this.yCelula(lin);
    });
  }

  // ---------------------------------------------------------- o caminho na tela

  /**
   * O desenho mais importante da tela: é ele que mostra à criança o que ela está
   * montando. Três elementos, e a ordem importa.
   *
   * **A linha vai POR CIMA das peças.** Descoberto no protótipo: com peça de 112
   * numa célula de 128 sobram 16 px entre vizinhas, e a linha desenhada por baixo
   * ficava inteiramente escondida. Aumentar o vão encolheria a peça — então a
   * linha subiu, com contorno escuro para se ler sobre as oito cores.
   *
   * **A ponta numerada faz dois trabalhos:** marca de onde o caminho pode crescer
   * (a regra é "vizinha da ÚLTIMA" — sem isso a criança vê o conjunto mas não
   * sabe qual peça está viva) e CONTA quantas peças entraram. Fica verde ao
   * passar do mínimo, que é como a tela diz "agora isto vale" sem texto.
   */
  _desenharCaminho(ctx) {
    const pecas = this.caminho?.pecas ?? [];
    if (pecas.length === 0) return;

    const lado = this.geo.peca;
    const r = raio.md + 6;

    // 1. o aro em cada peça do caminho
    for (const p of pecas) {
      const x = p.x - lado / 2;
      const y = p.y - lado / 2;
      ctx.strokeStyle = cores.superficie;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, lado + 8, lado + 8, r);
      ctx.stroke();
      ctx.strokeStyle = cores.tinta;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x - 7.5, y - 7.5, lado + 15, lado + 15, r + 3);
      ctx.stroke();
    }

    // 2. a linha, por cima
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const traco = () => {
      ctx.beginPath();
      pecas.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      // Um caminho de uma peça só não tem segmento: um ponto no lugar, para o
      // aro não ficar sozinho sem indicação de que o gesto começou.
      if (pecas.length === 1) ctx.lineTo(pecas[0].x, pecas[0].y);
      ctx.stroke();
    };
    ctx.strokeStyle = 'rgba(17, 24, 39, 0.55)';
    ctx.lineWidth = 20;
    traco();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 12;
    traco();
    ctx.restore();

    // 3. a ponta numerada
    const ponta = pecas[pecas.length - 1];
    const valido = this.caminho.valido;
    ctx.fillStyle = valido ? cores.acerto : cores.superficie;
    ctx.strokeStyle = cores.tinta;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(ponta.x, ponta.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = valido ? cores.superficie : cores.tinta;
    ctx.font = `${tipografia.pesoForte} 22px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(pecas.length), ponta.x, ponta.y + 1);
  }

  // ------------------------------------------------------------ cão de guarda

  /**
   * A invariante que ele vigia: enquanto `fase !== 'livre'`, existe SEMPRE um
   * tween vivo na cena, porque toda a resolução é uma cadeia de `Tween.de(this)`
   * e é o `chamar` do fim dela que devolve o gesto à criança.
   *
   * Fase ocupada e nenhum tween na cena não é demora: é cadeia perdida. Ver
   * `Watchdog` em COMPONENTES.md, e o defeito real que o trouxe (uma exceção
   * engolida por `Tween.chamar` deixou a garra do Jogo das Formas travada para
   * sempre, com o jogo animando e surdo).
   */
  _montarGuarda() {
    this.guarda = new Watchdog({
      nome: 'resolução do caminho',
      ocupado: () => this.fase !== 'livre' && !this.pausada && !this.placar.encerrado,
      vivo: () => Tween.temAtivo(this),
      graca: 0.5,
      limite: 12,
      aoTravar: ({ tentativa }) => {
        if (tentativa === 1) {
          // Devolve o gesto e reconcilia o tabuleiro: se a cadeia morreu no
          // meio, pode ter sobrado célula vazia sem peça reposta.
          this.caminho.cancelar();
          this.fase = 'livre';
          this._cairERepor();
          return;
        }
        this.guarda.desligar();
        this._terminar(this.placar.venceu);
      },
    });
  }

  // -------------------------------------------------------------- ciclo/fim

  pausar() {
    if (this.placar.encerrado) return;
    this.pausada = true;
    this.tempo.pausar();
    this._pararEsperaDoToque();
    this.caminho.cancelar();
    Tween.pausarTodos();
    this.pausa.abrir();
  }

  /**
   * Fim de partida. É AQUI que o registro no AVA acontece: ao ENTRAR no estado
   * 'resultado' o motor chama o `AvaBridge` com este objeto, uma vez só.
   *
   * **`erros` é sempre 0, e é uma afirmação, não uma omissão.** Este jogo não
   * tem resposta errada possível: a checagem de cor acontece na SELEÇÃO, e a
   * criança não consegue montar um caminho inválido. Soltar com menos de três é
   * tentativa cancelada — ela estava explorando o tabuleiro, que é o
   * comportamento que a atividade quer. REGRAS, seção 7.
   *
   * A cena não passa nota de estrelas: a fileira da `ResultScreen` tem cinco e
   * quem a calcula é a tela (regra RE-04).
   */
  _terminar(venceu) {
    this.tempo.pausar();
    this.fase = 'movendo';
    this._pararEsperaDoToque();
    this.caminho.cancelar();

    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu, {
        caminhosFeitos: this.caminhosFeitos,
        // Não é desempenho da criança: é medida do NÍVEL. Ver `_misturar`.
        misturas: this.misturas,
      }),
    });
  }

  atualizar(dt) {
    if (this.pausada) {
      // As DUAS camadas: qualquer uma pode estar aberta, e a fechada custa quase
      // nada (invisivel nao desenha).
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }
    super.atualizar(dt);

    // Depois do desvio da pausa: pausa é ocupação legítima e o cão não a conta.
    this.guarda.atualizar(dt);
  }

  /**
   * Limpeza. `Tween.removerTodos()` não é excesso de zelo: os tweens vivem numa
   * lista GLOBAL, e um `chamar` pendente de reposição rodaria depois de a cena
   * ter sido destruída — mexendo num tabuleiro que não existe mais. Sair para o
   * menu no meio de uma resolução é exatamente esse caso.
   */
  aoSair() {
    this._pararEsperaDoToque();
    Tween.removerTodos();
  }
}
