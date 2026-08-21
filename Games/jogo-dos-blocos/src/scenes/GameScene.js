import {
  Scene, Node, Sprite, TextNode, ScoreSystem, ScoreBar, Lives, IconButton,
  PauseScreen, Background, CraneController, Tween, Easing, ESTADOS,
  cores, tipografia, espaco, texto as aplicarCaixa,
} from '../../engine/index.js';

/** Medidas do jogo, em coordenadas lógicas (1280×720). */
const BLOCO_L = 114;
const BLOCO_A = 76;
const BASE_L = 300;
const BASE_TOPO_Y = 634;   // altura da superfície onde a torre começa
/**
 * Trilho e gancho: a altura é calculada para que o bloco pendurado NUNCA
 * encoste no quinto bloco da torre.
 */
const TRILHO_Y = 84;
const GANCHO_ALTURA = 108;
/** Meio bloco de folga para cada lado: erra quem soltar claramente fora. */
const TOLERANCIA = BLOCO_L * 0.6;
/** Limite de quanto a torre pode entortar em relação ao centro da base. */
const DESVIO_MAXIMO = 96;
const VELOCIDADE_QUEDA = 900; // px por segundo

/**
 * Bloco — a peça que o aluno empilha.
 */
class Bloco extends Node {
  constructor(imagem, simbolo, opcoes = {}) {
    super({ ...opcoes, largura: BLOCO_L, altura: BLOCO_A });
    this.imagem = imagem;
    this.simbolo = simbolo;
    this.regX = BLOCO_L / 2;
    this.regY = BLOCO_A / 2;
    this._tempoInercia = Math.random() * 10;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._tempoInercia += dt;
  }

  desenhar(ctx) {
    // Bloco quadrado estilo brinquedo de madeira maciça vetorial
    ctx.save();
    
    // Sombras do bloco
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Corpo principal em degradê de madeira quente
    const grad = ctx.createLinearGradient(0, 0, 0, BLOCO_A);
    grad.addColorStop(0, '#F59E0B');
    grad.addColorStop(0.5, '#D97706');
    grad.addColorStop(1, '#B45309');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#7C2D12';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(0, 0, BLOCO_L, BLOCO_A, 6); // canto mais quadrado (raio 6)
    ctx.fill();
    ctx.shadowColor = 'transparent'; // reseta sombra para o miolo
    ctx.stroke();

    // Painel interno quadrado chanfrado
    const mioloGrad = ctx.createLinearGradient(0, 0, 0, BLOCO_A - 16);
    mioloGrad.addColorStop(0, '#FEF3C7');
    mioloGrad.addColorStop(1, '#FDE68A');
    ctx.fillStyle = mioloGrad;
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(10, 8, BLOCO_L - 20, BLOCO_A - 16, 4); // miolo mais quadrado (raio 4)
    ctx.fill();
    ctx.stroke();

    // Detalhes de parafusos de madeira nos cantos
    ctx.fillStyle = '#B45309';
    [ [16, 14], [BLOCO_L - 16, 14], [16, BLOCO_A - 14], [BLOCO_L - 16, BLOCO_A - 14] ].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Símbolos de dois dígitos ("10") precisam caber na mesma janela.
    const tamanho = this.simbolo.length > 1 ? 36 : 44;
    ctx.fillStyle = '#7C2D12';
    ctx.font = `${tipografia.pesoForte} ${tamanho}px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(aplicarCaixa(this.simbolo), BLOCO_L / 2, BLOCO_A / 2 + 1);
    ctx.restore();
  }
}

/**
 * Guindaste — o trilho industrial, carrinho, corrente e gancho.
 */
class Guindaste extends Node {
  constructor(imagem, opcoes = {}) {
    super({ ...opcoes, largura: 1280, altura: 720 });
    this.imagem = imagem;
    this.posX = 640;
  }

  desenhar(ctx) {
    const l = this.largura;

    ctx.save();

    // ------------------------------------------------ 0. Torre Treliçada Vertical
    const torreX = l * 0.08; // ~102px
    const torreW = 48;
    const torreTopoY = TRILHO_Y - 26; // ~58px
    const torreBaseY = 660; // chão

    // Vigas verticais principais da torre
    ctx.strokeStyle = '#CA8A04';
    ctx.fillStyle = '#EAB308';
    ctx.lineWidth = 4;
    
    // Corpo principal amarelo das colunas verticais
    ctx.beginPath();
    ctx.rect(torreX - torreW / 2, torreTopoY, torreW, torreBaseY - torreTopoY);
    ctx.fill();
    ctx.stroke();

    // Treliça em 'X' (Estrutura de aço cruzada)
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 3;
    const passoX = 42;
    for (let y = torreBaseY; y > torreTopoY; y -= passoX) {
      const yProximo = y - passoX;
      ctx.beginPath();
      ctx.moveTo(torreX - torreW / 2, y);
      ctx.lineTo(torreX + torreW / 2, yProximo);
      ctx.moveTo(torreX + torreW / 2, y);
      ctx.lineTo(torreX - torreW / 2, yProximo);
      ctx.moveTo(torreX - torreW / 2, yProximo);
      ctx.lineTo(torreX + torreW / 2, yProximo);
      ctx.stroke();
    }

    // Cabine do Operador na junção da torre
    ctx.fillStyle = '#0284C7';
    ctx.strokeStyle = '#0369A1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(torreX - 32, TRILHO_Y - 14, 30, 28, 4);
    ctx.fill();
    ctx.stroke();
    // Janela da cabine
    ctx.fillStyle = '#BAE6FD';
    ctx.fillRect(torreX - 28, TRILHO_Y - 10, 14, 14);

    // Mastro de Topo e Cabos Tirantes de Sustentação
    const picoX = torreX;
    const picoY = TRILHO_Y - 70;
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(torreX - 20, TRILHO_Y - 26);
    ctx.lineTo(picoX, picoY);
    ctx.lineTo(torreX + 20, TRILHO_Y - 26);
    ctx.stroke();

    // Cabos de aço tirantes sustentando a lança horizontal
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(picoX, picoY);
    ctx.lineTo(l * 0.40, TRILHO_Y - 18);
    ctx.moveTo(picoX, picoY);
    ctx.lineTo(l * 0.75, TRILHO_Y - 18);
    ctx.stroke();

    // ------------------------------------------------ 1. Lança / Trilho Horizontal
    // Viga principal amarela da lança horizontal
    ctx.fillStyle = '#EAB308';
    ctx.strokeStyle = '#CA8A04';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(l * 0.04, TRILHO_Y - 18, l * 0.86, 24, 6);
    ctx.fill();
    ctx.stroke();

    // Treliça interna da lança horizontal
    ctx.strokeStyle = '#A16207';
    ctx.lineWidth = 2;
    for (let x = l * 0.12; x < l * 0.88; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, TRILHO_Y - 18);
      ctx.lineTo(x + 18, TRILHO_Y + 6);
      ctx.lineTo(x + 36, TRILHO_Y - 18);
      ctx.stroke();
    }

    // Faixas pretas de advertência nas pontas do trilho
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(l * 0.04, TRILHO_Y - 18, 20, 24, [6, 0, 0, 6]);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(l * 0.90 - 20, TRILHO_Y - 18, 20, 24, [0, 6, 6, 0]);
    ctx.fill();

    // Trilho de aço inferior onde corre o carrinho
    ctx.fillStyle = '#334155';
    ctx.fillRect(l * 0.04, TRILHO_Y + 6, l * 0.86, 6);

    // ------------------------------------------------ 2. Carrinho do Guindaste
    const tx = this.posX;
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(tx - 26, TRILHO_Y - 4, 52, 20, 6);
    ctx.fill();

    // Roldana metálica giratória
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(tx, TRILHO_Y + 12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(tx, TRILHO_Y + 12, 4, 0, Math.PI * 2);
    ctx.fill();

    // ------------------------------------------------ 3. Cabo de aço até o gancho
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(tx, TRILHO_Y + 16);
    ctx.lineTo(tx, TRILHO_Y + 34);
    ctx.stroke();

    // ------------------------------------------------ 4. Gancho
    if (this.imagem) {
      ctx.drawImage(this.imagem, tx - 48, TRILHO_Y + 20, 96, GANCHO_ALTURA);
    }
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Jogo dos Blocos.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.baseCentroX = L / 2;

    this.placar = new ScoreSystem({
      total: this.nivel.meta ?? 5,
      nivel: this.nivel.id ?? 1,
      vidas: this.nivel.vidas ?? 3,
    });

    /** Blocos já empilhados. O topo da torre é o último deles. */
    this.torre = [];
    this.indiceSimbolo = 0;
    this.blocoNoGancho = null;
    this.travado = false;   // durante a queda, o toque não faz nada
    this.particulas = [];

    // ------------------------------------------------------------- cenário
    this.adicionar(new Background({ largura: L, altura: A, tema: 'construcao' }));

    // Área de toque: cobre a tela inteira, ATRÁS do HUD.
    this.areaToque = new Node({ largura: L, altura: A, interativo: true });
    this.areaToque.on('toque', () => this.soltar());
    this.adicionar(this.areaToque);

    const imgBase = this.loader.imagem('base');
    if (imgBase) {
      this.adicionar(new Sprite(imgBase, {
        x: this.baseCentroX - BASE_L / 2,
        y: BASE_TOPO_Y - 4,
        largura: BASE_L,
        altura: 78,
      }));
    }

    this.guindaste = new Guindaste(this.loader.imagem('gancho'), { largura: L, altura: A });
    this.adicionar(this.guindaste);

    this.camadaBlocos = new Node({});
    this.adicionar(this.camadaBlocos);

    this.camadaEfeitos = new Node({});
    this.adicionar(this.camadaEfeitos);

    // ------------------------------------------------------------ guindaste
    const margem = BLOCO_L / 2 + 60;
    this.controle = new CraneController({
      modo: 'oscilante',
      xMin: margem,
      xMax: L - margem,
      duracao: this.nivel.duracaoGuindaste ?? 2.6,
      y: TRILHO_Y + GANCHO_ALTURA,
    });

    // ------------------------------------------------------------------ HUD
    this.adicionar(new TextNode(this.nivel.nome ?? '', {
      x: L / 2,
      y: espaco.md + 4,
      tamanho: tipografia.apoio,
      peso: tipografia.pesoForte,
      cor: cores.superficie,
      contorno: cores.primariaEscura,
      espessuraContorno: 6,
      alinhamento: 'center',
    }));

    this.barra = new ScoreBar({
      largura: 300,
      altura: 34,
      x: espaco.md,
      y: espaco.md,
      total: this.placar.total,
    }).acompanhar(this.placar);

    this.vidas = new Lives({
      total: this.nivel.vidas ?? 3,
      x: espaco.md + 320,
      y: espaco.md - 5,
    }).acompanhar(this.placar);

    this.adicionar(this.barra, this.vidas);

    this.adicionar(new IconButton({
      icone: 'pausa',
      x: L - 96,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pausar(),
    }));

    // ---------------------------------------------------------------- pausa
    this.pausa = new PauseScreen({
      largura: L,
      altura: A,
      audio: this.audio,
      config,
      aoContinuar: () => { this.pausada = false; },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    // --------------------------------------------------------------- placar
    this.placar.on('vitoria', () => this._terminar(true));
    this.placar.on('derrota', () => this._terminar(false));

    if (config.audio?.musica) this.audio.musica(config.audio.musica);

    this._novoBloco();
  }

  /** Altura (y do centro) onde o próximo bloco deve assentar. */
  get alturaDoTopo() {
    return BASE_TOPO_Y - this.torre.length * BLOCO_A - BLOCO_A / 2;
  }

  /** X do centro do topo da torre — o alvo da próxima jogada. */
  get centroDoTopo() {
    const ultimo = this.torre[this.torre.length - 1];
    return ultimo ? ultimo.x : this.baseCentroX;
  }

  _novoBloco() {
    if (this.placar.encerrado) return;

    const simbolo = this.nivel.simbolos[this.indiceSimbolo] ?? '?';
    const bloco = new Bloco(this.loader.imagem('bloco'), simbolo, {
      x: this.controle.xMin,
      y: TRILHO_Y + GANCHO_ALTURA + BLOCO_A / 2 - 12,
    });

    this.camadaBlocos.adicionar(bloco);
    this.blocoNoGancho = bloco;
    this.controle.carregar(bloco);
    this.travado = false;
  }

  soltar() {
    if (this.pausada || this.travado || this.placar.encerrado) return;
    if (!this.blocoNoGancho) return;

    const solto = this.controle.soltar();
    if (!solto) return;

    this.travado = true;
    const bloco = this.blocoNoGancho;
    this.blocoNoGancho = null;
    bloco.rotation = 0; // reseta a inércia durante a queda livre

    const alvoX = this.centroDoTopo;
    const desvio = bloco.x - alvoX;
    const encaixou = Math.abs(desvio) <= TOLERANCIA;

    if (encaixou) this._quedaComEncaixe(bloco, alvoX, desvio);
    else this._quedaComErro(bloco);
  }

  _quedaComEncaixe(bloco, alvoX, desvio) {
    let destinoX = alvoX + desvio * 0.4;
    const limiteEsq = this.baseCentroX - DESVIO_MAXIMO;
    const limiteDir = this.baseCentroX + DESVIO_MAXIMO;
    destinoX = Math.max(limiteEsq, Math.min(destinoX, limiteDir));

    const destinoY = this.alturaDoTopo;
    const duracao = Math.max(180, ((destinoY - bloco.y) / VELOCIDADE_QUEDA) * 1000);

    Tween.para(bloco, { x: destinoX, y: destinoY }, duracao, Easing.suaveEntrada)
      .chamar(() => this._assentou(bloco));
  }

  _assentou(bloco) {
    this.torre.push(bloco);

    // Achatada curta de peso físico
    bloco.scaleX = 1.12;
    bloco.scaleY = 0.86;
    Tween.para(bloco, { scaleX: 1, scaleY: 1 }, 220, Easing.costasSaida);

    // Partículas de poeira nos cantos do impacto
    this._criarParticulasEncaixe(bloco.x - BLOCO_L / 2, bloco.y + BLOCO_A / 2);
    this._criarParticulasEncaixe(bloco.x + BLOCO_L / 2, bloco.y + BLOCO_A / 2);

    // `sons` do nível aponta para arquivos reais (um.mp3, dois.mp3…). O
    // `texto` acompanha só como legenda; se o arquivo faltar, o motor avisa.
    const som = this.nivel.sons?.[this.indiceSimbolo];
    this.audio.falar(som ?? null, { texto: bloco.simbolo });

    this.indiceSimbolo++;
    this.placar.acertar();

    if (!this.placar.encerrado) {
      Tween.de({}).esperar(420).chamar(() => this._novoBloco());
    }
  }

  _criarParticulasEncaixe(px, py) {
    for (let i = 0; i < 5; i++) {
      const part = new Node({
        x: px + (Math.random() * 16 - 8),
        y: py,
        regX: 4,
        regY: 4,
      });
      part.vx = (Math.random() - 0.5) * 120;
      part.vy = -Math.random() * 80 - 20;
      part.alpha = 1;
      part.desenhar = (ctx) => {
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
      };
      this.camadaEfeitos.adicionar(part);

      Tween.para(part, { x: part.x + part.vx * 0.4, y: part.y + part.vy * 0.4, alpha: 0 }, 350)
        .chamar(() => part.removerDoPai());
    }
  }

  _quedaComErro(bloco) {
    const paraDireita = bloco.x > this.centroDoTopo;
    const destinoY = this.altura + BLOCO_A;

    if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);

    Tween.para(
      bloco,
      {
        x: bloco.x + (paraDireita ? 120 : -120),
        y: destinoY,
        rotation: paraDireita ? 95 : -95,
        alpha: 0,
      },
      700,
      Easing.suaveEntrada,
    ).chamar(() => {
      bloco.removerDoPai();
      this._errou();
    });
  }

  _errou() {
    this.placar.errar();
    if (!this.placar.encerrado) this._novoBloco();
  }

  pausar() {
    if (this.placar.encerrado) return;
    this.pausada = true;
    this.controle.pausar();
    this.pausa.abrir();
  }

  _terminar(venceu) {
    this.controle.pausar();
    this.travado = true;

    this.irPara('resultado', {
      nivel: this.nivel,
      estrelas: this.placar.estrelas,
      resultado: this.placar.paraAva(venceu, {
        conteudo: this.nivel.nome,
        blocosEmpilhados: this.torre.length,
      }),
    });
  }

  atualizar(dt) {
    if (this.pausada) {
      this.pausa.atualizar(dt);
      return;
    }

    super.atualizar(dt);

    this.controle.atualizar(dt);
    this.guindaste.posX = this.controle.x;

    if (this.blocoNoGancho) {
      this.blocoNoGancho.x = this.controle.x;
      // Inércia de balanço pendular leve enquanto o guindaste oscila
      const inclinacao = (this.controle.direcao ?? 1) * 3.5;
      this.blocoNoGancho.rotation = inclinacao;
    }
  }

  aoSair() {
    this.audio.calar();
    Tween.removerTodos();
  }
}
