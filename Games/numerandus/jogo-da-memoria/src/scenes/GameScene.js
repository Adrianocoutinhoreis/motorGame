import {
  Scene, Node, ScoreSystem, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog, rand, cores, texto, espaco,
} from '../../engine/index.js';

const FONTE_EMOJI = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";

/**
 * Pool de categorias de grandezas e medidas — cada categoria é um PAR por
 * ASSOCIAÇÃO (não por igualdade): uma carta-item concreta ("leite") e a
 * carta-unidade correspondente ("LITRO"). Cada categoria sorteia 1 item entre
 * as opções, pra a mesma dificuldade não repetir sempre a mesma dupla entre
 * partidas — só a carta-unidade é fixa (mesma lógica de "elenco temático" do
 * Encaixe Certo, mas aqui o elenco é de GRANDEZAS, não de números).
 *
 * O vídeo de referência (`Videos_Numerandus/Jogo_da_memoria`) mostra só 2
 * pares completos numa demo parcial (arroz↔kilo, quadrado↔geométrico) e sua
 * pareação real mistura item↔unidade com item↔categoria — este pool foi
 * desenhado para ser coerente (sempre item↔unidade) e cobrir os 6 pares que
 * o nível Difícil precisa. Decisão de conteúdo (grandezas e medidas, fiel ao
 * espírito do vídeo) confirmada com o humano antes desta implementação.
 */
const CATEGORIAS = [
  {
    id: 'peso',
    unidade: 'QUILO',
    itens: [
      { emoji: '🍚', texto: 'ARROZ' },
      { emoji: '🍉', texto: 'MELANCIA' },
      { emoji: '🫘', texto: 'FEIJÃO' },
    ],
  },
  {
    id: 'comprimento',
    unidade: 'METRO',
    itens: [
      { emoji: '🧶', texto: 'BARBANTE' },
      { emoji: '🛣️', texto: 'RUA' },
      { emoji: '🧣', texto: 'CACHECOL' },
    ],
  },
  {
    id: 'capacidade',
    unidade: 'LITRO',
    itens: [
      { emoji: '🥛', texto: 'LEITE' },
      { emoji: '💧', texto: 'ÁGUA' },
      { emoji: '🧃', texto: 'SUCO' },
    ],
  },
  {
    id: 'tempo',
    unidade: 'HORA',
    itens: [
      { emoji: '⏰', texto: 'RELÓGIO' },
      { emoji: '📅', texto: 'DIA' },
    ],
  },
  {
    id: 'duzia',
    unidade: 'DÚZIA',
    itens: [
      { emoji: '🥚', texto: 'OVOS' },
    ],
  },
  {
    id: 'forma',
    unidade: 'FORMA',
    itens: [
      { emoji: '🟦', texto: 'QUADRADO' },
      { emoji: '🔺', texto: 'TRIÂNGULO' },
      { emoji: '⚪', texto: 'CÍRCULO' },
    ],
  },
];

/**
 * Verso da carta — MESMO verde-degradê da placa de título do menu
 * (`PlacaTituloQuadro`, `engine/screens/MenuScreen.js:126-129`, decisão
 * confirmada com o humano), não mais o roxo do fundo: contraste por HUE
 * (verde contra o roxo-ardósia de `config.corCeuTopo`/`corCeuBase`), não só
 * por claridade. Borda amarelo-giz (`#FACC15`) reaproveita o mesmo acento já
 * usado na faixa do subtítulo daquela placa e no destaque de vitória do Jogo
 * da Velha — mesmo vocabulário "quadro" em toda a coleção, sem confundir com
 * o verde/vermelho semânticos de acerto/erro usados no verso VIRADO (abaixo).
 */
const COR_VERSO_TOPO = '#1B5E44';
const COR_VERSO_BASE = '#123D2E';
const COR_VERSO_BORDA = '#FACC15';
const COR_VERSO_ICONE = 'rgba(248, 250, 252, 0.55)';

/** Cor fixa por categoria (paleta lúdica do motor, vívida) — usada só como TINTA
 *  de fundo (o selo atrás do emoji da carta-item): uma cor de fundo translúcida
 *  não precisa de contraste próprio, só precisa ser reconhecível. Nunca aparece
 *  no verso, então não entrega a posição — é reforço visual de "estas duas
 *  cartas são da mesma família", útil no instante em que as duas já estão à mostra. */
const CORES_CATEGORIA = {
  peso: cores.ludica.laranja,
  comprimento: cores.ludica.turquesa,
  capacidade: cores.ludica.azul,
  tempo: cores.ludica.roxo,
  duzia: cores.ludica.amarelo,
  forma: cores.ludica.verde,
};

/**
 * Mesmas categorias, versões ESCURECIDAS — usadas como cor de TEXTO (a
 * carta-unidade, ex. "DÚZIA", "LITRO") sobre fundo branco. A paleta lúdica
 * acima é vívida de propósito para tinta/selo, mas como texto sobre branco
 * ela falha contraste AA: o amarelo (`#FACC15`) é o pior caso (contraste
 * ~1,4:1, quase invisível), mas todas as outras também ficam abaixo de 4,5:1
 * nesse tamanho de fonte. Aqui, versões mais escuras da MESMA cor (mesma
 * família/hue, só mais escura) resolvem — sem trocar a identidade visual por
 * categoria, só a legibilidade.
 */
const CORES_CATEGORIA_TEXTO = {
  peso: '#C2410C',
  comprimento: '#0F766E',
  capacidade: '#1D4ED8',
  tempo: '#5B21B6',
  duzia: '#A16207',
  forma: '#15803D',
};

/** Linhas/colunas do tabuleiro por `meta` (pares da rodada) — ver `config.js`. */
const GRADE_POR_META = {
  3: { linhas: 2, colunas: 3 },
  4: { linhas: 2, colunas: 4 },
  6: { linhas: 3, colunas: 4 },
};

/**
 * Carta — uma casa do tabuleiro. Desenha o PRÓPRIO conteúdo (verso decorativo
 * ou frente com o item/unidade) e se anima sozinha (`virarPara`), via
 * `scaleX` (suportado independente de `scaleY` pelo `Node` do motor) — a
 * mesma técnica de flip 2D usada em qualquer motor canvas, sem precisar da
 * transformação 3D que o Remotion original usava em CSS.
 *
 * `regX`/`regY` no centro: o flip gira em torno do PRÓPRIO meio da carta, não
 * da quina — visualmente a carta "vira no lugar", como uma carta de baralho de
 * verdade sendo virada sobre a mesa.
 */
class Carta extends Node {
  constructor({ categoria, papel, conteudo, w, h }) {
    super({
      largura: w, altura: h, regX: w / 2, regY: h / 2, interativo: true,
    });
    this.categoria = categoria;
    this.papel = papel; // 'item' | 'unidade'
    this.conteudo = conteudo; // { emoji, texto } (item) ou { texto } (unidade)
    this.w = w;
    this.h = h;
    /** Estado lógico: o par já foi encontrado (fica virada, glow verde ESTÁVEL). */
    this.resolvida = false;
    /** Estado lógico: a carta está virada pra cima agora (mesmo sem ter resolvido). */
    this.virada = false;
    /** O que DESENHAR agora — muda no meio do tween de flip, não no toque. */
    this._frenteVisivel = false;
    /** null | 'certo' | 'errado' — destaque de borda, nunca piscante. */
    this._destaque = null;
  }

  /**
   * Vira a carta, trocando o que é desenhado no MEIO do movimento (quando
   * `scaleX` passa por 0 — a carta "de lado", momento em que trocar o
   * conteúdo é invisível, exatamente como uma carta física).
   */
  virarPara(mostrarFrente, aoTerminar) {
    Tween.removerDe(this);
    Tween.de(this)
      .entao({ scaleX: 0 }, 130, Easing.suaveEntrada)
      .chamar(() => { this._frenteVisivel = mostrarFrente; this.virada = mostrarFrente; })
      .entao({ scaleX: 1 }, 130, Easing.suaveSaida)
      .chamar(() => { if (aoTerminar) aoTerminar(); });
  }

  desenhar(ctx) {
    const { w, h } = this;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 16);

    if (!this._frenteVisivel) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, COR_VERSO_TOPO);
      grad.addColorStop(1, COR_VERSO_BASE);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = COR_VERSO_BORDA;
      ctx.lineWidth = 4;
      ctx.stroke();
      this._desenharVerso(ctx);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.shadowColor = 'transparent';
      let borda = '#CBD5E1';
      if (this._destaque === 'certo') borda = cores.acerto;
      if (this._destaque === 'errado') borda = cores.erro;
      ctx.lineWidth = this._destaque ? 6 : 4;
      ctx.strokeStyle = borda;
      ctx.stroke();
      this._desenharConteudo(ctx);
    }
    ctx.restore();
  }

  /** Motivo decorativo simples (círculo + cruz) — não depende de imagem nem de emoji. */
  _desenharVerso(ctx) {
    const { w, h } = this;
    const r = Math.min(w, h) * 0.16;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.strokeStyle = COR_VERSO_ICONE;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.moveTo(-r * 0.6, 0); ctx.lineTo(r * 0.6, 0);
    ctx.moveTo(0, -r * 0.6); ctx.lineTo(0, r * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  _desenharConteudo(ctx) {
    const { w, h } = this;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (this.papel === 'item') {
      // Frações de `h` aumentadas (eram 0.30/0.105) — no nível Difícil (12
      // cartas, grade 3×4) a carta é bem menor (~146×175, contra ~227×273 do
      // Fácil/Médio, mesmos rows=2 nos dois), e o emoji ficava pequeno demais
      // pra enxergar num celular. O aumento é proporcional (mesma fração em
      // todos os níveis, não só no Difícil) pra não desenhar cartas com
      // proporção diferente entre níveis — ver espaço vertical conferido nos
      // dois extremos (Difícil h≈175 e Fácil/Médio h≈273) antes de fixar os
      // números: emoji e rótulo continuam sem se sobrepor em nenhum dos dois.
      // Selo circular atrás do emoji, na cor VÍVIDA da categoria (mesma
      // família de cor do texto da carta-unidade, só mais clara — ver
      // CORES_CATEGORIA/CORES_CATEGORIA_TEXTO acima) — vários emoji do
      // elenco são claros/brancos
      // por natureza (🥛 leite, 🥚 ovo, ⚪ círculo) e somem sem isso: um
      // emoji claro sobre carta branca não tem contraste nenhum, não importa
      // o tamanho da fonte. O selo garante contraste com QUALQUER emoji,
      // claro ou escuro, sem depender de acertar a cor certa pra cada um.
      //
      // O preenchimento sozinho (30% de alfa) ficava claro demais pra emoji
      // já claros por natureza — o vidro/líquido do 🥛, por exemplo, quase
      // não se distinguia do selo atrás dele (reportado pelo humano vendo o
      // jogo rodando). Alfa mais alto (0.45) + um ANEL sólido na cor
      // ESCURECIDA (a mesma já com contraste AA comprovado sobre branco, ver
      // CORES_CATEGORIA_TEXTO) resolve isso sem depender de opacidade: o
      // anel desenha uma borda nítida do selo mesmo quando o preenchimento
      // translúcido e o emoji ficam parecidos.
      const emojiY = h * 0.40;
      const raioSelo = h * 0.22;
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = CORES_CATEGORIA[this.categoria] ?? '#94A3B8';
      ctx.beginPath();
      ctx.arc(w / 2, emojiY, raioSelo, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = CORES_CATEGORIA_TEXTO[this.categoria] ?? '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(w / 2, emojiY, raioSelo, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.font = `${Math.round(h * 0.40)}px ${FONTE_EMOJI}`;
      ctx.fillText(this.conteudo.emoji, w / 2, emojiY);
      ctx.fillStyle = '#1E293B';
      ctx.font = `800 ${Math.round(h * 0.13)}px Outfit, system-ui, sans-serif`;
      ctx.fillText(texto(this.conteudo.texto), w / 2, h * 0.76);
    } else {
      // Versão ESCURECIDA da cor da categoria — não a vívida do selo acima:
      // texto colorido sobre fundo branco precisa de contraste de verdade,
      // ver CORES_CATEGORIA_TEXTO.
      ctx.fillStyle = CORES_CATEGORIA_TEXTO[this.categoria] ?? '#334155';
      ctx.font = `800 ${Math.round(h * 0.18)}px Outfit, system-ui, sans-serif`;
      ctx.fillText(texto(this.conteudo.texto), w / 2, h / 2);
    }
    ctx.restore();
  }
}

/**
 * Badge do cronômetro no HUD — mesmo desenho do Encaixe Certo
 * (`Games/numerandus/encaixe-certo/src/scenes/GameScene.js`), reaproveitado
 * verbatim: é um componente genérico de UI, não específico daquele jogo.
 */
class RelogioBadge extends Node {
  constructor({ x, y, largura = 190, altura = 50 }) {
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

    ctx.font = '800 22px Outfit, system-ui, sans-serif';
    const textWidth = ctx.measureText(this.texto).width;
    const raio = 11;
    const espacoIconeTexto = 10;
    const larguraConjunto = raio * 2 + espacoIconeTexto + textWidth;
    const inicioX = (this.largura - larguraConjunto) / 2;
    const cx = inicioX + raio;
    const cy = this.altura / 2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 5.5);
    ctx.moveTo(cx, cy); ctx.lineTo(cx + 4.5, cy);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.texto, cx + raio + espacoIconeTexto, cy + 1);
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Jogo da Memória.
 *
 * Sem vidas, sem derrota (`registrarDerrota: false` em `config.js`): errar um
 * par só demora mais, nunca pune (decisão confirmada com o humano — mesmo
 * padrão do Encaixe Certo/Jogo da Ordenação). `this._tentativasErradas` conta
 * tentativas erradas só para o relatório do AVA, por FORA do `ScoreSystem` —
 * `placar.errar()` nunca é chamado, então a pontuação final nunca desconta.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({
      total: this.nivel.meta, nivel: this.nivel.id ?? 1, pontosPorAcerto: 1,
    });
    this._tentativasErradas = 0;

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quadro',
      corCeuTopo: config.corCeuTopo,
      corCeuBase: config.corCeuBase,
      mostrarDecoracoes: config.mostrarDecoracoes ?? true,
      mostrarChao: config.mostrarChao ?? true,
    }));

    // ------------------------------------------------------------------ HUD
    this.adicionar(new IconButton({
      icone: 'pausa',
      x: espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._pausar(),
    }));

    this.adicionar(new IconButton({
      icone: 'tutorial',
      x: espaco.md + 72 + espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._pedirAjuda(),
    }));

    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      somToque: config.audio?.clique,
    }));

    // Cronômetro + progresso "X/Y pares" no mesmo badge — opcional
    // (`config.mostrarCronometro`, padrão true). `null` quando desligado, e
    // todo método que o toca já checa isso antes (mesmo padrão do Encaixe Certo).
    this._relogioBadge = config.mostrarCronometro === false ? null : new RelogioBadge({
      x: L / 2, y: espaco.md + 26,
    });
    if (this._relogioBadge) this.adicionar(this._relogioBadge);
    this._relogioSegundoMostrado = 0;
    this.placar.on('mudou', () => this._atualizarTextoHud());

    // ---------------------------------------------------------------- pausa
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

    this.placar.on('vitoria', () => this._celebrarVitoria());

    // ------------------------------------------------------------ tabuleiro
    this._selecionadas = [];
    this._avaliando = false;
    this._montarTabuleiro();

    // --------------------------------------------------------------- guarda
    // Mesma rede de segurança do Jogo da Velha/Encaixe Certo: a "avaliação de
    // par" é uma cadeia de Tween só, e o cão de guarda garante que ela nunca
    // fica presa numa exceção engolida (ver `docs/COMPONENTES.md`, Watchdog).
    this.guarda = new Watchdog({
      nome: 'avaliação de par',
      ocupado: () => this._avaliando && !this.pausada,
      vivo: () => Tween.temAtivo(this) || this._selecionadas.some((c) => Tween.temAtivo(c)),
      graca: 0.6,
      limite: 8,
      aoTravar: () => this._destravarAvaliacao(),
    });
  }

  /** Constrói o tabuleiro da rodada: sorteia categorias, monta cartas, calcula a grade. */
  _montarTabuleiro() {
    const { largura: L, altura: A } = this;
    const meta = this.nivel.meta;
    const grade = GRADE_POR_META[meta] ?? { linhas: 2, colunas: Math.ceil(meta) };

    const categorias = rand.embaralhar(CATEGORIAS).slice(0, meta);
    const dadosCartas = [];
    for (const cat of categorias) {
      const item = rand.item(cat.itens);
      dadosCartas.push({ categoria: cat.id, papel: 'item', conteudo: item });
      dadosCartas.push({ categoria: cat.id, papel: 'unidade', conteudo: { texto: cat.unidade } });
    }
    const embaralhadas = rand.embaralhar(dadosCartas);

    // ------------------------------------------------------------- geometria
    const topo = 130;
    const margemLateral = 44;
    const margemInferior = 24;
    const areaLargura = L - margemLateral * 2;
    const areaAltura = A - topo - margemInferior;
    const gap = 20;
    const aspecto = 1.2; // h = w * aspecto — carta um pouco mais alta que larga

    let w = Math.min(
      (areaLargura - gap * (grade.colunas - 1)) / grade.colunas,
      ((areaAltura - gap * (grade.linhas - 1)) / grade.linhas) / aspecto,
      230,
    );
    w = Math.max(w, 90);
    const h = w * aspecto;

    const gridLargura = grade.colunas * w + (grade.colunas - 1) * gap;
    const gridAltura = grade.linhas * h + (grade.linhas - 1) * gap;
    const x0 = margemLateral + (areaLargura - gridLargura) / 2;
    const y0 = topo + (areaAltura - gridAltura) / 2;

    this.cartas = [];
    embaralhadas.forEach((dados, i) => {
      const lin = Math.floor(i / grade.colunas);
      const col = i % grade.colunas;
      const carta = new Carta({ ...dados, w, h });
      carta.x = x0 + col * (w + gap) + w / 2;
      carta.y = y0 + lin * (h + gap) + h / 2;
      carta.on('toque', () => this._tocarCarta(carta));
      this.adicionar(carta);
      this.cartas.push(carta);
    });

    this._atualizarTextoHud();
  }

  _tocarCarta(carta) {
    if (this.pausada || this.placar.encerrado || this._avaliando) return;
    if (carta.virada || carta.resolvida || this._selecionadas.includes(carta)) return;

    carta.virarPara(true);
    this._selecionadas.push(carta);

    if (this._selecionadas.length === 2) {
      this._avaliando = true;
      const [a, b] = this._selecionadas;
      // Pausa curta pra a criança VER as duas cartas antes de saber o resultado —
      // mesmo espírito da pausa antes da linha vencedora do Jogo da Velha.
      Tween.de(this).esperar(320).chamar(() => this._avaliarPar(a, b));
    }
  }

  /** Combinam por ASSOCIAÇÃO: mesma categoria, papéis DIFERENTES (item + unidade). */
  _combinam(a, b) {
    return a.categoria === b.categoria && a.papel !== b.papel;
  }

  _avaliarPar(a, b) {
    if (this._combinam(a, b)) {
      a.resolvida = true; b.resolvida = true;
      a._destaque = 'certo'; b._destaque = 'certo';
      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
      this._avaliando = false;
      this._selecionadas = [];
      this.placar.acertar(1); // dispara 'vitoria' sozinho quando fecha a meta
      return;
    }

    // Não combina: destaque vermelho SUAVE (só a borda muda de cor, sem tremor
    // nem piscar — RE de acessibilidade) por um tempo, depois as duas viram de
    // volta. Conta como tentativa errada só pro RELATÓRIO — `placar.errar()`
    // NUNCA é chamado (ver `_terminar`): decisão confirmada com o humano de
    // manter este jogo 100% não-punitivo, mesmo padrão do Encaixe Certo.
    a._destaque = 'errado'; b._destaque = 'errado';
    if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    this._tentativasErradas += 1;

    Tween.de(this).esperar(700).chamar(() => {
      a._destaque = null; b._destaque = null;
      let restantes = 2;
      const aoVirar = () => {
        restantes -= 1;
        if (restantes === 0) this._destravarAvaliacao();
      };
      a.virarPara(false, aoVirar);
      b.virarPara(false, aoVirar);
    });
  }

  /** Ponto único de "acabou de avaliar, devolve o controle" — usado no caminho
   *  normal (as 2 cartas viraram de volta) e pelo Watchdog, se algo travar. */
  _destravarAvaliacao() {
    this._avaliando = false;
    this._selecionadas = [];
  }

  _pausar() {
    if (this.placar.encerrado) return;
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  _pedirAjuda() {
    if (this.placar.encerrado || this.pausada) return;
    Tween.pausarTodos();
    this.pausada = true;
    this.ajuda.abrir();
  }

  /**
   * O último par fecha e o `ScoreSystem.acertar()` já dispara 'vitoria' NO
   * MESMO INSTANTE (síncrono) — sem esta espera, a tela trocaria pro
   * resultado no exato quadro em que a criança ainda está vendo a última
   * carta virar, sem tempo de olhar o tabuleiro inteiro com todos os pares
   * encontrados. Pedido do humano: alguns segundos de pausa aqui antes de
   * `_terminar`. Mesmo espírito da comemoração do Encaixe Certo
   * (`_celebrarCompleto`/`_saltarParesDaOnda`) antes de trocar de tela.
   *
   * Nenhum toque novo acontece nesse meio-tempo: `this.placar.encerrado` já
   * é `true` (o `ScoreSystem` já se encerrou dentro de `acertar()`), e
   * `_tocarCarta`/`_pausar`/`_pedirAjuda` checam isso antes de agir — o
   * tabuleiro fica parado e completo, exatamente o que a criança precisa ver.
   */
  _celebrarVitoria() {
    this._saltarTabuleiro();
    Tween.de(this).esperar(1800).chamar(() => this._terminar(true));
  }

  /**
   * Salto encadeado em CADA carta do tabuleiro — a tela não fica só parada
   * durante a espera de `_celebrarVitoria`, comemora junto com a criança.
   * Mesma comemoração que o Encaixe Certo já usa ao fechar uma rodada
   * (`_saltarParesDaOnda`): sobe um pouco e aterrissa com uma molinha
   * (`Easing.costasSaida`), espalhada por índice pra parecer uma onda
   * passando pelo tabuleiro — não todas as cartas pulando ao mesmo tempo,
   * que seria mais cansativo de acompanhar que festivo.
   *
   * Cabe folgado dentro do 1,8s de `_celebrarVitoria` mesmo no Difícil (12
   * cartas): a última carta começa em `11×40 = 440ms` e termina a própria
   * animação (150+230ms) em 820ms — sobra mais de 900ms de tabuleiro parado
   * e verde antes de trocar de tela.
   */
  _saltarTabuleiro() {
    this.cartas.forEach((carta, i) => {
      const baseY = carta.y;
      const atraso = i * 40;
      Tween.removerDe(carta);
      Tween.de(carta).esperar(atraso)
        .entao({ y: baseY - 16 }, 150, Easing.suaveSaida)
        .entao({ y: baseY }, 230, Easing.costasSaida);
    });
  }

  /**
   * Fim de partida. Sempre vitória (sem vidas, sem derrota). `erros` é
   * sobrescrito por FORA do `paraAva()` — `this.placar.erros` é sempre 0 (nunca
   * chamamos `errar()`), então `acertos` sai sempre CHEIO, sem o desconto de
   * RE-02. Mesmo formato de payload do Encaixe Certo.
   */
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
    this.guarda.atualizar(dt);
    this._atualizarRelogio();
  }

  _atualizarRelogio() {
    const total = Math.floor(this.game.tempoJogando);
    if (total === this._relogioSegundoMostrado) return;
    this._relogioSegundoMostrado = total;
    this._atualizarTextoHud();
  }

  _atualizarTextoHud() {
    if (!this._relogioBadge) return;
    const total = this._relogioSegundoMostrado;
    const min = Math.floor(total / 60);
    const seg = total % 60;
    const tempo = `${min}:${String(seg).padStart(2, '0')}`;
    this._relogioBadge.texto = `${tempo}  ${this.placar.acertos}/${this.placar.total}`;
  }

  aoSair() {
    Tween.removerTodos();
  }
}
