import {
  Scene, Node, TextNode, ScoreSystem, ScoreBar, TimerBar, IconButton, SoundToggle,
  PauseScreen, Panel, Background, Mascot, GridBoard, CraneController,
  Tween, Easing, ESTADOS, desenharIcone, cores, tipografia, espaco, raio,
  sombras, movimento, rand, mascoteVisivel, ParticleSystem, criarEstrelaVoadora, Watchdog,
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

/**
 * A paleta do maquinário, copiada do `Guindaste` do Jogo dos Blocos
 * (`Games/jogo-dos-blocos/src/scenes/GameScene.js`).
 *
 * São valores crus, e de propósito: eles são crus lá também. Criar tokens só
 * para estes dois jogos seria inventar design system a partir de um caso; e
 * mudar os valores aqui faria os dois jogos parecerem de coleções diferentes,
 * que é exatamente o problema que este arquivo está resolvendo. Se um dia um
 * terceiro jogo tiver maquinário, aí vale promover ao `tokens.js`.
 */
const METAL = {
  vigaClara: '#EAB308',
  vigaEscura: '#CA8A04',
  trelica: '#78350F',
  trelicaLanca: '#A16207',
  advertencia: '#1E293B',
  aco: '#334155',
  acoClaro: '#94A3B8',
  carrinho: '#0F172A',
};

/** Passos da treliça — os mesmos do piloto, para o padrão bater entre os jogos. */
const PASSO_TRELICA_PERNA = 42;
const PASSO_TRELICA_LANCA = 36;

/** Largura das pernas do pórtico e folga entre elas e a borda da grade. */
const PERNA_L = 44;
const FOLGA_PERNA = 14;

/**
 * Distância do topo do gancho até o centro do primeiro bloco carregado.
 *
 * Estava repetida à mão em `_pegar`, `_depositar` e `_yDaCarga` — mexer na
 * altura do gancho exigia acertar três números em sincronia, e errar um deles
 * fazia a carga flutuar longe da garra sem nada acusar.
 */
const OFFSET_CARGA = 40;

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
    this._tempoEstrela = Math.random() * Math.PI * 2;
  }

  get forma() {
    return this.arte.formas[this.tipo];
  }

  get valor() {
    return this.estrela ? 2 : 1;
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (this.estrela) {
      this._tempoEstrela += dt * 4;
    }
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
      // 1. Moldura com Aura Dourada Radiante
      const haloAlfa = 0.5 + 0.3 * Math.sin(this._tempoEstrela);
      ctx.save();
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(234, 179, 8, ${haloAlfa.toFixed(2)})`;
      ctx.shadowColor = '#EAB308';
      ctx.shadowBlur = 10 + 4 * Math.sin(this._tempoEstrela);
      ctx.beginPath();
      ctx.roundRect(-2, -2, this.lado + 4, this.lado + 4, raio.sm + 2);
      ctx.stroke();
      ctx.restore();

      // 2. Selo com Respiração / Pulso Contínuo
      const t = this.lado * 0.44;
      const esc = 1 + 0.12 * Math.sin(this._tempoEstrela);
      ctx.save();
      ctx.translate(this.lado - t * 0.75, -t * 0.1);
      ctx.scale(esc, esc);
      ctx.shadowColor = 'rgba(234, 179, 8, 0.9)';
      ctx.shadowBlur = 8;
      desenharIcone(ctx, 'estrela', t, '#EAB308', 2.4);
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------------------
// Garra
// ---------------------------------------------------------------------------

/**
 * Garra — o cabo e as duas mandíbulas. A carga é desenhada pela cena, não por
 * aqui: os blocos carregados continuam sendo filhos do tabuleiro, e é a cena que
 * os mantém pendurados. Reparentar peça a cada jogada só criaria oportunidade de
 * perder uma.
 *
 * `abertura` vai de 0 (fechada, segurando) a 1 (aberta, pronta para pegar ou
 * acabando de soltar). A cena a tweena no ciclo da jogada — é o que faz o gesto
 * ter causa visível: a garra abre para chegar, fecha no bloco, abre para largar.
 */
class Garra extends Node {
  constructor({ trilhoY }) {
    super({ largura: 76, altura: 52 });
    this.trilhoY = trilhoY;
    this.regX = this.largura / 2;
    /** 0 = fechada · 1 = aberta. Começa aberta: a garra chega vazia. */
    this.abertura = 1;
  }

  desenhar(ctx) {
    const cx = this.largura / 2;

    // ------------------------------------------------------------- o cabo
    // Do trilho até o topo do gancho. `y` local é 0, então o trilho fica em
    // coordenada negativa relativa.
    const alturaCabo = Math.max(0, this.y - this.trilhoY);

    ctx.strokeStyle = METAL.aco;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx, -alturaCabo);
    ctx.lineTo(cx, 0);
    ctx.stroke();

    // Elos: travessas curtas em passo fixo ao longo do cabo. Existem para a
    // subida e a descida terem leitura de movimento — um cabo liso de cor
    // sólida sobe e desce sem que nada na tela diga que ele se mexeu.
    ctx.strokeStyle = METAL.acoClaro;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let d = 8; d < alturaCabo; d += 14) {
      ctx.moveTo(cx - 4, -d);
      ctx.lineTo(cx + 4, -d);
    }
    ctx.stroke();

    // ------------------------------------------------------- o bloco do gancho
    // A peça que une o cabo às mandíbulas. Sem ela as duas garras nascem do ar.
    ctx.fillStyle = METAL.carrinho;
    ctx.beginPath();
    ctx.roundRect(cx - 13, 0, 26, 14, 4);
    ctx.fill();

    // ------------------------------------------------------- as mandíbulas
    // Fechada abraça o azulejo de 50 (é onde ela lê como pinça); aberta passa por
    // fora dele com pouca folga. O vão aberto é curto de propósito: com 38 de
    // meia-abertura a garra vazia virava o objeto mais largo da tela e puxava a
    // atenção para o nada, em vez de para o tabuleiro.
    const vao = 26 + this.abertura * 6;   // meia-abertura: 26 → 32
    const inclina = this.abertura * 5;    // a ponta abre para fora ao abrir

    ctx.strokeStyle = cores.tinta;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + lado * 8, 12);
      // Curva para fora e desce: dedo de garra, não traço reto.
      ctx.quadraticCurveTo(
        cx + lado * vao, 16,
        cx + lado * (vao + inclina), 34,
      );
      ctx.stroke();
    }

    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
  }
}

// ---------------------------------------------------------------------------
// Pórtico
// ---------------------------------------------------------------------------

/**
 * Portico — a estrutura que sustenta a garra.
 *
 * **Por que pórtico e não a torre lateral do piloto.** A torre do Jogo dos
 * Blocos fica em `x ≈ 102`. Aqui isso não caberia: a coruja ocupa `x 50..240` e
 * o painel das formas `x 848..1232`, então não há margem livre para plantar uma
 * torre de um lado só. Duas pernas, uma de cada lado da grade, resolvem — e são
 * a máquina mecanicamente correta para o gesto do jogo, que é um carrinho
 * correndo sobre uma pilha. De quebra o pórtico ENQUADRA a área de jogo, o que
 * tira a grade da sensação de flutuar num vazio azul.
 *
 * A paleta, os passos de treliça, o carrinho e a roldana são os do piloto, de
 * propósito: é o que faz os dois jogos parecerem a mesma coleção.
 *
 * Um único campo animado: `posX`, alimentado pela cena a cada quadro com a
 * posição da garra.
 */
class Portico extends Node {
  constructor({ largura, altura, trilhoY, xEsquerda, xDireita, chaoY }) {
    super({ largura, altura });
    this.trilhoY = trilhoY;
    this.xEsquerda = xEsquerda;
    this.xDireita = xDireita;
    this.chaoY = chaoY;
    this.posX = (xEsquerda + xDireita) / 2;
  }

  desenhar(ctx) {
    const topoLanca = this.trilhoY - 18;

    ctx.save();

    // ------------------------------------------------------------ as pernas
    for (const px of [this.xEsquerda, this.xDireita]) {
      const x0 = px - PERNA_L / 2;

      ctx.fillStyle = METAL.vigaClara;
      ctx.strokeStyle = METAL.vigaEscura;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.rect(x0, topoLanca, PERNA_L, this.chaoY - topoLanca);
      ctx.fill();
      ctx.stroke();

      // Treliça em X, no passo do piloto.
      ctx.strokeStyle = METAL.trelica;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let y = this.chaoY; y > topoLanca + PASSO_TRELICA_PERNA; y -= PASSO_TRELICA_PERNA) {
        const yProximo = y - PASSO_TRELICA_PERNA;
        ctx.moveTo(x0, y);
        ctx.lineTo(x0 + PERNA_L, yProximo);
        ctx.moveTo(x0 + PERNA_L, y);
        ctx.lineTo(x0, yProximo);
        ctx.moveTo(x0, yProximo);
        ctx.lineTo(x0 + PERNA_L, yProximo);
      }
      ctx.stroke();

      // Pé alargado: a perna precisa apoiar em algo, não terminar no ar.
      ctx.fillStyle = METAL.vigaEscura;
      ctx.beginPath();
      ctx.roundRect(x0 - 10, this.chaoY - 12, PERNA_L + 20, 16, 4);
      ctx.fill();
    }

    // ------------------------------------------------------------- a lança
    const lancaX = this.xEsquerda - PERNA_L / 2 - 12;
    const lancaL = (this.xDireita - this.xEsquerda) + PERNA_L + 24;

    ctx.fillStyle = METAL.vigaClara;
    ctx.strokeStyle = METAL.vigaEscura;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(lancaX, topoLanca, lancaL, 24, 6);
    ctx.fill();
    ctx.stroke();

    // Treliça interna da lança.
    ctx.strokeStyle = METAL.trelicaLanca;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = lancaX + 12; x < lancaX + lancaL - PASSO_TRELICA_LANCA; x += PASSO_TRELICA_LANCA) {
      ctx.moveTo(x, topoLanca);
      ctx.lineTo(x + PASSO_TRELICA_LANCA / 2, topoLanca + 24);
      ctx.lineTo(x + PASSO_TRELICA_LANCA, topoLanca);
    }
    ctx.stroke();

    // Faixas de advertência nas pontas.
    ctx.fillStyle = METAL.advertencia;
    ctx.beginPath();
    ctx.roundRect(lancaX, topoLanca, 20, 24, [6, 0, 0, 6]);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(lancaX + lancaL - 20, topoLanca, 20, 24, [0, 6, 6, 0]);
    ctx.fill();

    // Trilho de aço por onde o carrinho corre.
    ctx.fillStyle = METAL.aco;
    ctx.fillRect(lancaX, this.trilhoY + 6, lancaL, 6);

    // ----------------------------------------------------------- o carrinho
    const tx = this.posX;
    ctx.fillStyle = METAL.carrinho;
    ctx.beginPath();
    ctx.roundRect(tx - 26, this.trilhoY - 4, 52, 20, 6);
    ctx.fill();

    // Roldana.
    ctx.fillStyle = METAL.acoClaro;
    ctx.beginPath();
    ctx.arc(tx, this.trilhoY + 12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = METAL.aco;
    ctx.beginPath();
    ctx.arc(tx, this.trilhoY + 12, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
    this.gradeDireita = this.gradeX + gradeLargura;
    this.xColunas = Array.from(
      { length: this.colunas },
      (_, col) => this.gradeX + col * this.geo.celula + this.geo.celula / 2,
    );

    /**
     * Os eixos das pernas do pórtico, calculados UMA vez porque três coisas
     * dependem deles: o pórtico, a largura da plataforma (que precisa passar por
     * baixo das pernas, ou elas se apoiam em nada) e o recuo do painel das formas
     * (que a perna direita atravessaria).
     *
     * Derivados da grade, nunca escritos à mão: ela muda de 5 para 6 colunas
     * entre o nível 1 e os níveis 2 e 3.
     */
    this.xPernas = {
      esquerda: this.gradeX - espaco.md - FOLGA_PERNA,
      direita: this.gradeDireita + espaco.md + FOLGA_PERNA,
    };
    /** Borda externa do maquinário — é o que o painel tem de respeitar. */
    this.direitaDoPortico = this.xPernas.direita + PERNA_L / 2;

    // --------------------------------------------------------------- fundo
    // `mostrarPecas: false` — o mesmo céu do menu, sem as quatro peças
    // coloridas flutuando. Atrás da grade elas competiriam com as peças que a
    // criança precisa distinguir de verdade: o cenário não pode ensaiar o
    // exercício. Ficam só as formas brancas gigantes, que não nomeiam nada.
    this.adicionar(new Background({
      largura: L, altura: A, tema: config.tema, mostrarPecas: false,
    }));
    this._montarPlataforma();

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

    // O pórtico fica ATRÁS do tabuleiro: os blocos passam na frente das pernas.
    this._montarPortico();

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

    this.particulas = new ParticleSystem();
    this.adicionar(this.particulas);

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

    this._montarGuarda();

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

  /**
   * A plataforma de obra sobre a qual a pilha cresce.
   *
   * **Por que não é mais uma faixa de largura total.** O `Background` do tema
   * `construcao` JÁ pinta o chão: areia de `altura*0.82` (590) até a base, com
   * uma faixa de borda de 12 px no topo. A faixa de madeira de largura total
   * cobria só 657..720, então sobrava uma tira de areia de 67 px entre o skyline
   * e a madeira, com a faixa escura da areia exposta no meio — três chãos
   * disputando o mesmo lugar. E o marrom saturado brigava com a areia, que foi
   * dessaturada de propósito (há comentário no `Background`) justamente para não
   * competir por atenção com o conteúdo.
   *
   * Virando um objeto do tamanho do maquinário, a areia volta a ser o chão e a
   * madeira passa a ser o que deveria ser desde o começo: a base de onde a pilha
   * nasce E onde o pórtico se apoia. O piloto tem um pedestal de madeira
   * (`base.svg`) exatamente para isso.
   *
   * O topo encosta na BASE DO AZULEJO, não na base da célula: o azulejo tem 50 px
   * numa célula de 64, e alinhar pela célula deixava 7 px de ar sob a pilha.
   */
  _montarPlataforma() {
    const topo = this.geo.baseY - (this.geo.celula - this.geo.azulejo) / 2;
    // A plataforma passa POR BAIXO das pernas do pórtico, com sobra. Derivar a
    // largura da grade em vez das pernas deixava os pés apoiados no ar, a poucos
    // pixels da borda — o defeito que este método existe para não repetir.
    const x = this.xPernas.esquerda - PERNA_L / 2 - espaco.sm;
    const largura = (this.xPernas.direita - this.xPernas.esquerda) + PERNA_L + espaco.sm * 2;
    const altura = this.altura - topo;

    this.chaoY = topo;

    // Coordenadas locais das pernas e da primeira coluna, para o desenho não
    // recalcular nada por quadro.
    const pernasLocal = [this.xPernas.esquerda - x, this.xPernas.direita - x];
    const primeiraColunaLocal = this.gradeX - x;

    const plataforma = new Node({ largura, altura, x, y: topo });
    plataforma.desenhar = (ctx) => {
      // Travessas de apoio, uma sob cada perna: é o que faz a carga do pórtico
      // ter para onde descer, em vez de a plataforma parecer pairar.
      ctx.fillStyle = cores.madeiraEscura;
      for (const px of pernasLocal) {
        ctx.beginPath();
        ctx.roundRect(px - 11, 18, 22, altura - 18, [0, 0, 4, 4]);
        ctx.fill();
      }

      // O tabuleiro da plataforma.
      ctx.fillStyle = cores.madeira;
      ctx.beginPath();
      ctx.roundRect(0, 0, largura, 26, [raio.sm, raio.sm, 0, 0]);
      ctx.fill();

      // Aresta de topo: dá espessura à tábua sem gradiente.
      ctx.fillStyle = cores.madeiraEscura;
      ctx.fillRect(0, 0, largura, 5);

      // Juntas entre tábuas, uma por coluna: o passo da grade aparece no chão, o
      // que ajuda a criança a ver onde cada coluna cai.
      ctx.strokeStyle = cores.madeiraEscura;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let col = 1; col < this.colunas; col++) {
        const jx = primeiraColunaLocal + col * this.geo.celula;
        ctx.moveTo(jx, 6);
        ctx.lineTo(jx, 26);
      }
      ctx.stroke();
    };
    this.adicionar(plataforma);
  }

  /**
   * O pórtico. Entra DEPOIS da plataforma e ANTES do tabuleiro, para os blocos
   * passarem na frente das pernas — invertido, o metal esconderia a pilha.
   */
  _montarPortico() {
    this.portico = new Portico({
      largura: this.largura,
      altura: this.altura,
      trilhoY: this.geo.trilhoY,
      xEsquerda: this.xPernas.esquerda,
      xDireita: this.xPernas.direita,
      chaoY: this.chaoY,
    });
    this.adicionar(this.portico);
  }

  /**
    * O HUD é uma COLUNA à esquerda, não uma faixa no topo.
    *
    * Mudou por causa do celular, e o raciocínio é de orçamento: o tamanho físico
    * do alvo é a fração da ALTURA que uma célula ocupa, então cada pixel gasto em
    * faixa horizontal no topo é pixel que a grade não tem. O HUD ocupava de 0 a
    * 104 — 14% da altura — para mostrar dois valores e dois botões.
    *
    * A coluna só existe porque o mascote saiu da partida: a tira entre a borda da
    * tela e a perna esquerda do pórtico tem 344 px em 6 colunas e 384 em 5, e
    * estava vazia. Nada aqui é escrito à mão — a largura sai de `xPernas`, que
    * sai da grade, que muda entre os níveis.
    *
    * Os botões passaram de 72 para 96 px lógicos: 72 dava 36 px físicos no
    * celular, abaixo do piso de 44 do WCAG 2.5.5, e eles são alvos ISOLADOS —
    * errar um não faz nada, ao contrário das colunas, que se encaixam na vizinha.
    * 96 × 0,5 = 48 px físicos.
    */
  _montarHud() {
    const { config } = this;

    const colunaX = espaco.md;
    const colunaLargura = (this.xPernas.esquerda - PERNA_L / 2) - espaco.md * 2;
    const ladoBotao = 96;

    this.barra = new ScoreBar({
      largura: colunaLargura,
      altura: 40,
      x: colunaX,
      y: espaco.md,
      icone: 'estrela',
      mostrarNumeros: true,
    });
    // A barra segue o acerto BRUTO durante a partida, de propósito: ela espelha
    // o que a criança conseguiu limpar, e não pode andar para trás. O desconto
    // da RE-02 acontece só no fim, em `paraAva`/`pontuacao`.
    this.barra.acompanhar(this.placar);

    this.tempo = new TimerBar({
      largura: colunaLargura,
      altura: 40,
      x: colunaX,
      y: espaco.md + 40 + espaco.md,
      duracao: this.nivel.duracao,
    });
    this.tempo.on('acabou', () => {
      if (!this.placar.encerrado) this.placar.encerrarPorTempo();
    });

    this.adicionar(this.barra, this.tempo);

    // Os dois botões lado a lado, abaixo das barras.
    const yBotoes = espaco.md + (40 + espaco.md) * 2 + espaco.sm;

    this.adicionar(new IconButton({
      icone: 'pausa',
      tamanho: ladoBotao,
      x: colunaX,
      y: yBotoes,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pausar(),
    }));

    this.adicionar(new SoundToggle({
      tamanho: ladoBotao,
      x: colunaX + ladoBotao + espaco.md,
      y: yBotoes,
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
    // Derivado do PÓRTICO, não da grade. A perna direita vai do trilho até o
    // chão, atravessando toda a faixa de altura deste painel — medido, ela
    // invadia 8 px quando o recuo saía da borda da grade. Partir da borda externa
    // do maquinário faz a folga ser real em 5 e em 6 colunas.
    // A margem da direita é `espaco.md`, não `espaco.xl`: com a célula em 80 a
    // largura do painel é `544 − 3 × célula` = 304, e ele precisa de 288 (recuo +
    // azulejo + folga + 174 px do "RETÂNGULO" a 28, medido). Com `espaco.xl`
    // sobravam 276 e o nome da forma não caberia. Encolher o nome seria pior: ele
    // é conteúdo pedagógico, não legenda.
    const x = this.direitaDoPortico + espaco.md;
    const largura = this.largura - x - espaco.md;
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

  /**
   * O operário, na faixa livre à esquerda do pórtico.
   *
   * **`tamanho` é a ALTURA**, e a largura sai da proporção da arte — forçá-la num
   * quadrado a deformaria. 300 contra os 550 do menu: aqui ele acompanha a
   * partida, não a apresenta, e não pode competir com o tabuleiro pela atenção.
   *
   * **A arte é de meio corpo, cortada na altura das coxas.** Ela não tem pé — a
   * base é um corte —, então "apoiar no chão" não se aplica: o que se faz é levar
   * o corte para a borda inferior da tela, onde ele não aparece. É o mesmo padrão
   * que o `MenuScreen` usa com esta imagem. Alinhar pelo chão da plataforma, como
   * se houvesse sola, deixaria um torso terminando no ar em cima da areia.
   *
   * A âncora do `Mascot` é o CENTRO (`regX = regY = tamanho/2`), daí o `y` sair
   * de `altura - tamanho/2`, com alguns pixels de sobra para não arriscar costura
   * visível na borda.
   */
  _montarMascote() {
    // A lista de telas vive no config (`mascote.telas`), e não uma decisão local:
    // é o MESMO interruptor que o menu, o tutorial e o resultado consultam. Duas
    // fontes para "onde o mascote aparece" divergiriam na primeira mudança.
    if (!mascoteVisivel(this.config, 'jogando')) {
      this.mascote = null;
      return;
    }

    const tamanho = 300;
    this.mascote = new Mascot({
      tamanho,
      imagem: this.loader.imagem(this.config.mascote?.asset),
      expressao: 'feliz',
    });

    // Centrado na faixa entre a borda da tela e a perna esquerda do pórtico.
    const faixaLivre = this.xPernas.esquerda - PERNA_L / 2;
    this.mascote.x = Math.round(faixaLivre / 2);
    this.mascote.y = Math.round(this.altura + 8 - tamanho / 2);
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
   * **O conserto de cada peça é ESCOLHIDO, não sorteado**, e isto foi corrigido
   * depois de medir: resorteando ao acaso, os 12 passes falhavam em cerca de uma
   * partida a cada quatro no nível 1 — 15 blocos e só 3 formas dão pouca margem
   * para a sorte, e cada re-sorteio podia recriar o mesmo grupo. O tabuleiro
   * nascia com pontos que a criança não fez, e o portão de jogabilidade ficava
   * intermitente, o que é quase pior: um portão que reprova sem motivo ensina a
   * ignorá-lo.
   *
   * Agora cada peça problemática procura entre as formas do nível uma que NÃO
   * forme grupo, em ordem aleatória para o tabuleiro não ficar enviesado. Uma
   * célula tem no máximo quatro vizinhas, então quase sempre existe uma escolha
   * boa — e quando não existe, cai no sorteio e o passe seguinte reconfere.
   *
   * O aviso é último recurso: se nem 12 passes convergirem, o tabuleiro nasce
   * com um combo de graça — e o console diz, em vez de fingir que está tudo bem.
   */
  _evitarComboDeGraca(pecas, maxPasses = 12) {
    for (let passe = 0; passe < maxPasses; passe++) {
      const problemas = pecas.filter((p) => this.grade.grupoConectado(p).length >= 3);
      if (problemas.length === 0) return true;
      for (const p of problemas) p.tipo = this._tipoSemCombo(p);
    }
    console.warn(
      `[jogo-das-formas] ${maxPasses} passes não bastaram para desfazer os combos de graça; `
      + 'o tabuleiro começa com pontos que a criança não fez.',
    );
    return false;
  }

  /**
   * Uma forma para esta peça que não a deixe num grupo de 3 — procurada entre as
   * formas do nível, em ordem aleatória. Devolve um sorteio comum se nenhuma
   * servir; quem chama reconfere no passe seguinte.
   */
  _tipoSemCombo(peca) {
    const original = peca.tipo;
    const candidatos = [...this.nivel.formas];
    // Embaralha com o `rand` do motor (mesma fonte do sorteio), para o conserto
    // não puxar sempre para a primeira forma da lista.
    for (let i = candidatos.length - 1; i > 0; i--) {
      const j = rand.inteiro(0, i);
      [candidatos[i], candidatos[j]] = [candidatos[j], candidatos[i]];
    }

    for (const tipo of candidatos) {
      if (tipo === original) continue; // já se sabe que esta forma o coloca num grupo
      peca.tipo = tipo;
      if (this.grade.grupoConectado(peca).length < 3) return tipo;
    }

    peca.tipo = original;
    return this._sortearTipo();
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
    return this.garra.y + OFFSET_CARGA + i * this.geo.celula;
  }

  /**
   * Abre ou fecha as mandíbulas. `movimento.rapido` é o token do gesto curto.
   *
   * **Sem `Tween.removerDe` aqui, de propósito.** Ele cancela por ALVO, e o alvo
   * é `this.garra` — a mesma cadeia de `x`/`y` que está em curso e que chamou
   * esta função. Cancelar mataria o próprio movimento. Dois tweens no mesmo
   * objeto animando propriedades diferentes convivem sem se atropelar, e as
   * chamadas de abertura ficam a 350 ms uma da outra no ciclo, então não há
   * sobreposição a resolver.
   */
  _abrirGarra(aberta) {
    Tween.para(this.garra, { abertura: aberta ? 1 : 0 }, movimento.rapido, Easing.suaveSaida);
  }

  _pegar(col) {
    const grupo = this._grupoDoTopo(col);
    if (grupo.length === 0) return; // coluna vazia: nada a fazer, e nenhum erro

    this.fase = 'movendo';
    const alvoY = this._yDaLinha(this._linhaDoTopo(col)) - OFFSET_CARGA;

    Tween.removerDe(this.garra);
    this.garra.abertura = 1; // desce aberta
    Tween.para(this.garra, { x: this.controle.x }, movimento.padrao, Easing.suaveSaida)
      .entao({ y: alvoY }, 350, Easing.suaveEntrada)
      .chamar(() => {
        // Fecha NO bloco, e só então ele passa a pender do gancho: a ordem é o
        // que faz o gesto ter causa visível em vez de a peça saltar para a garra.
        this._abrirGarra(false);
        for (const b of grupo) this.grade.remover(b.lin, b.col);
        this.carga = grupo;
        for (const b of this.carga) b.paraFrente();
      })
      .esperar(movimento.rapido)
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
      this.mascote?.definirExpressao('pensando');
      return;
    }

    this.fase = 'movendo';
    // Desce até o bloco MAIS BAIXO da carga encostar na linha de destino.
    const alvoY = this._yDaLinha(livre) - OFFSET_CARGA - (n - 1) * this.geo.celula;

    Tween.removerDe(this.garra);
    Tween.para(this.garra, { x: this.controle.x }, movimento.padrao, Easing.suaveSaida)
      .entao({ y: alvoY }, 350, Easing.suaveEntrada)
      .chamar(() => {
        // Abre para largar, e só então a carga assenta.
        this._abrirGarra(true);
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
      .esperar(movimento.rapido)
      .entao({ y: this.geo.trilhoY + 30 }, 350, Easing.suaveSaida)
      .chamar(() => this._resolver());
  }

  // ------------------------------------------------------------ cão de guarda

  /**
   * O cão de guarda da jogada.
   *
   * **A invariante que ele vigia:** enquanto `fase !== 'livre'`, existe SEMPRE um
   * tween vivo na garra ou na cena, porque é o `chamar` do fim de uma dessas
   * cadeias que devolve o toque à criança — `_pegar` e `_depositar` animam
   * `this.garra`, e cada passe da cascata é um `Tween.de(this)`. Fase ocupada e
   * nenhum tween nos dois não é demora: é cadeia perdida.
   *
   * Isso é melhor que cronometrar. Uma cascata longa é legítima e pode levar
   * segundos (cada passe custa 380 ms de espera mais 240 de gravidade, e a de
   * pior caso encadeia uns catorze passes num tabuleiro de 42 células), então
   * qualquer prazo generoso o bastante para não acusar em falso seria longo
   * demais para a criança esperar. A invariante acusa em meio segundo.
   *
   * `limite` fica como segunda rede, para o que a invariante não pega: um tween
   * que está vivo mas nunca termina. Os 12 s são folgados de propósito — ali o
   * objetivo é não ficar preso para sempre, não reagir rápido.
   */
  _montarGuarda() {
    this.guarda = new Watchdog({
      nome: 'ciclo da jogada',
      ocupado: () => this.fase !== 'livre' && !this.pausada && !this.placar.encerrado,
      vivo: () => Tween.temAtivo(this) || Tween.temAtivo(this.garra),
      graca: 0.5,
      limite: 12,
      aoTravar: (info) => this._resgatarJogada(info),
    });
  }

  /**
   * O resgate, em dois degraus. Quem detecta é o motor; o que é estado seguro é
   * decisão do jogo, e é aqui.
   *
   * **Primeiro degrau — devolver a jogada.** A garra volta ao repouso, aberta, e
   * a fase é liberada. Depois disso `_resolver()` é chamado de novo: se a cascata
   * morreu no meio, pode ter ficado um grupo válido de pé no tabuleiro, e deixar
   * grupo válido em pé é o defeito que o `VALIDA()` do jogo de 2013 denunciava.
   * Se o caminho estiver realmente quebrado, ele quebra de novo — e aí o cão
   * dispara outra vez em meio segundo, o que é justamente o que se quer.
   *
   * **Segundo degrau — encerrar com o que foi feito.** Travou de novo: o defeito
   * não é transitório e insistir só prende a criança numa tela morta. A partida
   * vai para o resultado com os pontos já conquistados. É pior que jogar e muito
   * melhor que um jogo surdo, e a criança pode tocar em JOGAR DE NOVO.
   */
  _resgatarJogada({ tentativa }) {
    if (tentativa === 1) {
      Tween.removerDe(this.garra);
      this.garra.abertura = 1;
      Tween.para(this.garra, { y: this.geo.trilhoY + 30 }, movimento.padrao, Easing.suaveSaida);
      this.fase = 'livre';
      this._resolver();
      return;
    }

    this.guarda.desligar();
    this._terminar(this.placar.venceu);
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

        if (bloco.estrela) {
          criarEstrelaVoadora({
            cena: this,
            origemX: bloco.x,
            origemY: bloco.y,
            destinoX: this.barra.x + 20,
            destinoY: this.barra.y + 20,
            particulas: this.particulas,
            aoChegar: () => this.barra.pulsarIcone(),
          });
        }
      }

      if (estrela) {
        estrela.estrela = true;
        Tween.removerDe(estrela);
        Tween.para(estrela, { scaleX: 1.3, scaleY: 1.3 }, movimento.entrada, Easing.costasSaida)
          .entao({ scaleX: 1, scaleY: 1 }, movimento.padrao, Easing.suaveSaida);

        this.particulas.disparar({
          x: estrela.x,
          y: estrela.y,
          cor: '#FDE047',
          quantidade: 14,
          tamanhoMin: 10,
          tamanhoMax: 18,
          velocidade: 150,
          duracao: 0.5,
          gravidade: false,
        });
      }
    }

    // Sai da grade agora; o desaparecer é só visual.
    for (const bloco of somados) {
      const corForma = this.arte.formas[bloco.tipo]?.cor ?? '#F59E0B';
      this.particulas.disparar({
        x: bloco.x,
        y: bloco.y,
        cor: corForma,
        quantidade: 10,
        tamanhoMin: 10,
        tamanhoMax: 18,
        velocidade: 120,
        duracao: 0.4,
        gravidade: true,
      });

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
      this.mascote?.comemorar();
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
      this.mascote?.lamentar();
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

    // A pilha alta é aviso: o mascote se inclina antes de a partida acabar.
    //
    // **Este jogo não mostra mascote na partida** (`config.mascote.telas`), então
    // hoje o aviso não aparece em tela nenhuma — e ele era o ÚNICO dos retornos da
    // partida sem som próprio (combo narra a forma, ciclo sem combo toca o efeito
    // de erro). Fica registrado como lacuna deliberada, não como esquecimento: se
    // o aviso de pilha alta tiver de voltar, precisa de um portador que não seja o
    // personagem — piscar a linha do teto, por exemplo.
    const maisAlta = Math.max(...this.xColunas.map((_, col) => this._primeiraLivre(col)));
    if (maisAlta >= this.linhas - 2) this.mascote?.definirExpressao('triste');

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
   * Fim de partida. É AQUI que o registro no AVA acontece: ao ENTRAR no estado
   * 'resultado' o motor chama o `AvaBridge` com este objeto, uma vez só.
   *
   * `acertos` sai de `placar.pontuacao`, que desconta as falhas na vitória
   * (regra RE-02). O bruto viaja nos extras, para o professor que quiser ver.
   *
   * **A cena não passa nota de estrelas.** Passava — `_notaEmEstrelas()`, uma
   * conta de 0 a 3 pelo percentual da meta, que existia só porque a fileira da
   * `ResultScreen` mudava de tamanho conforme a meta e acima de 6 perguntas
   * exigia que o jogo calculasse a própria nota. Com a fileira fixa em cinco, a
   * tela deriva a nota dos campos que já recebe, e a segunda fórmula deixou de
   * existir. Regra RE-04.
   */
  _terminar(venceu) {
    this.tempo.pausar();
    this.fase = 'movendo';
    if (venceu) this.mascote?.comemorar(); else this.mascote?.lamentar();

    this.irPara('resultado', {
      nivel: this.nivel,
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

    // Depois do desvio da pausa, de propósito: pausa é ocupação legítima e o cão
    // não deve contá-la. Antes de qualquer `return` abaixo, também de propósito —
    // uma rede que só é atualizada no caminho felizmente normal não é rede.
    this.guarda.atualizar(dt);

    // O carrinho do pórtico segue a garra. É o mesmo padrão do piloto: a
    // estrutura tem um só campo animado, e quem manda nele é a cena.
    this.portico.posX = this.garra.x;

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
    this.audio.pararMusica();
    Tween.removerTodos();
  }
}
