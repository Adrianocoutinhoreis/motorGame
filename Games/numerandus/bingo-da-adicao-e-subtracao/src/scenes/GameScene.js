import {
  Scene, Node, TextNode, Tween, Easing, ESTADOS, ScoreSystem,
  IconButton, SoundToggle, PauseScreen, HelpScreen,
  cores, tipografia, espaco, raio, sombras, alvoAcessivel, texto as aplicarCaixa,
} from '../../engine/index.js';

/**
 * Temas visuais das 2 cartelas de bingo (Jogador vs CPU).
 */
const TEMA_JOGADOR = { id: 'azul', nome: 'VOCÊ', primary: '#0284C7', light: '#E0F2FE', dark: '#0369A1', chip: 'rgba(2, 132, 199, 0.35)', glow: 'rgba(56, 189, 248, 0.7)' };
const TEMA_CPU = { id: 'cpu', nome: 'COMPUTADOR', primary: '#DC2626', light: '#FEE2E2', dark: '#B91C1C', chip: 'rgba(220, 38, 38, 0.35)', glow: 'rgba(248, 113, 113, 0.7)' };
const TEMAS_CARTELAS = [TEMA_JOGADOR, TEMA_CPU];

/**
 * Célula individual de uma Cartela de Bingo 4x4.
 */
class BingoCellNode extends Node {
  constructor(numero, indexNaCartela, cartelaIndex, tema, opcoes = {}) {
    const tamanho = opcoes.tamanho ?? 60;
    super({ ...opcoes, largura: tamanho, altura: tamanho, interativo: true });

    this.numero = numero;
    this.indexNaCartela = indexNaCartela;
    this.cartelaIndex = cartelaIndex;
    this.tema = tema;
    this.marcado = false;
    this.aoTocarNumero = opcoes.aoTocarNumero ?? null;
    this.audio = opcoes.audio ?? null;
    this.somToque = opcoes.somToque ?? null;

    this.regX = tamanho / 2;
    this.regY = tamanho / 2;
    this.x += tamanho / 2;
    this.y += tamanho / 2;

    this.escalaFicha = 0;
    this.opacidadeFicha = 0;
    this.escalaRipple = 0;
    this.opacidadeRipple = 0;

    this.on('apertar', () => this._pressao(true));
    this.on('soltar', () => this._pressao(false));
    this.on('sair', () => this._pressao(false));
    this.on('toque', () => {
      if (this.somToque) this.audio?.efeito(this.somToque);
      this.aoTocarNumero?.(this);
    });
  }

  _pressao(ativo) {
    if (this.marcado) return;
    Tween.removerDe(this);
    Tween.para(this, { scaleX: ativo ? 0.92 : 1, scaleY: ativo ? 0.92 : 1 }, 100, Easing.suaveSaida);
  }

  marcarComAnimacao() {
    this.marcado = true;
    this.escalaFicha = 2.8;
    this.opacidadeFicha = 0.2;
    this.escalaRipple = 1.0;
    this.opacidadeRipple = 0.8;

    Tween.para(this, { escalaFicha: 1, opacidadeFicha: 1 }, 320, Easing.costasSaida);
    Tween.para(this, { escalaRipple: 2.2, opacidadeRipple: 0 }, 400, Easing.suaveSaida);
  }

  desenhar(ctx) {
    const { largura: l, altura: a, tema, numero, marcado } = this;

    ctx.save();

    // Fundo da célula
    ctx.fillStyle = marcado ? tema.light : '#FFFFFF';
    ctx.strokeStyle = marcado ? tema.primary : '#E2E8F0';
    ctx.lineWidth = marcado ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, 10);
    ctx.fill();
    ctx.stroke();

    // Efeito Ripple no impacto
    if (this.opacidadeRipple > 0) {
      ctx.save();
      ctx.strokeStyle = tema.primary;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = this.opacidadeRipple;
      ctx.beginPath();
      ctx.arc(l / 2, a / 2, (l / 2) * this.escalaRipple, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Ficha marcada
    if (marcado && this.opacidadeFicha > 0) {
      ctx.save();
      ctx.globalAlpha = this.opacidadeFicha;
      ctx.translate(l / 2, a / 2);
      ctx.scale(this.escalaFicha, this.escalaFicha);

      // Círculo da ficha
      ctx.fillStyle = tema.chip;
      ctx.strokeStyle = tema.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, (l / 2) - 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Ponto de destaque no centro da ficha
      ctx.fillStyle = tema.primary;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Número no centro da célula
    ctx.fillStyle = marcado ? tema.primary : '#1E293B';
    ctx.font = `${tipografia.pesoForte} ${Math.round(l * 0.42)}px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(numero, l / 2, a / 2 + 1);

    ctx.restore();
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}

/**
 * GameScene — Cena principal do Bingo da Adição e Subtração.
 *
 * Contém as 4 cartelas na mesa (grade 2x2: Azul, Coral, Verde, Roxo)
 * e o painel de desafios matemáticos à direita, fiel ao vídeo tutorial.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];

    // Placar para tracking de acertos/erros (SEM vitória automática por meta)
    // total: 9999 para o ScoreSystem NUNCA emitir 'vitoria' — o bingo controla tudo
    this.placar = new ScoreSystem({
      total: 9999,
      nivel: this.nivel.id,
      vidas: 0,
      pontosPorAcerto: 1,
    });

    // NÃO escutar eventos de vitoria/derrota do ScoreSystem — controlamos manualmente

    this._fimResolvido = false;
    this._linhasVencedoras = [
      // Horizontais
      [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
      // Verticais
      [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
      // Diagonais
      [0, 5, 10, 15], [3, 6, 9, 12],
    ];

    this._linhaVencedoraAtiva = null;
    this._cartelaVencedoraIndex = null;
    this._progressoLinha = 0;

    // Estado da competição (Jogador vs CPU)
    this._acertosJogador = 0;
    this._acertosCpu = 0;
    this._turnoAtivo = false;
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;
    this._timerTurno = null;
    this._timerCpu = null;
    this._aguardandoProximaConta = false;
    this._ultimaContaEnviada = null;
    this._resultadoAtual = null;
    this._existeNaCpu = false;

    // Configurações da CPU baseadas no nível
    const configCpu = config.competicao?.niveisCpu?.[this.nivel.id] ?? { chanceAcerto: 0.7, tempoReacaoMs: [2000, 3500] };
    this._cpuChanceAcerto = configCpu.chanceAcerto;
    this._cpuTempoMin = configCpu.tempoReacaoMs[0];
    this._cpuTempoMax = configCpu.tempoReacaoMs[1];

    // Gerar cartelas e desafios
    this._gerar2CartelasEDesafios();

    // Construir elementos visuais da tela
    this._construirCenario();
    this._construirHUD();
    this._construir2Cartelas();
    this._construirControleAluno();
    this._construirAreaDesafio();
    this._adicionarBotaoPassar();

    // Iniciar primeira carta sorteada
    this._mostrarProximaConta();
  }

  _gerar2CartelasEDesafios() {
    const maxNum = this.nivel.maxNumero ?? 18;
    const ops = this.nivel.operacoes ?? ['+'];

    // Gerar 2 conjuntos de 16 números únicos para as 2 cartelas (Jogador e CPU)
    this.cartelasNumeros = [];
    const todosNumerosCartelas = new Set();

    for (let c = 0; c < 2; c++) {
      const candidatos = [];
      for (let n = 1; n <= maxNum; n++) candidatos.push(n);
      candidatos.sort(() => Math.random() - 0.5);

      // 16 números para a cartela 4x4
      const numeros = candidatos.slice(0, 16);
      while (numeros.length < 16) {
        numeros.push(Math.floor(Math.random() * maxNum) + 1);
      }
      this.cartelasNumeros.push(numeros);

      for (const num of numeros) {
        todosNumerosCartelas.add(num);
      }
    }

    // Cria banco de desafios matemáticos garantindo que o resultado exista em ao menos uma cartela
    this.desafios = [];
    const listaNumerosUnicos = Array.from(todosNumerosCartelas);
    listaNumerosUnicos.sort(() => Math.random() - 0.5);

    for (const num of listaNumerosUnicos) {
      const conta = this._gerarContaParaNumero(num, ops, maxNum);
      this.desafios.push({ numero: num, expressao: conta });
    }

    // Se a lista de desafios for curta, duplica para haver rodadas contínuas
    if (this.desafios.length < 20) {
      for (const num of listaNumerosUnicos) {
        const conta = this._gerarContaParaNumero(num, ops, maxNum);
        this.desafios.push({ numero: num, expressao: conta });
      }
    }

    this.desafios.sort(() => Math.random() - 0.5);
    this.desafioIndex = 0;
    this.desafioAtual = null;
  }

  _gerarContaParaNumero(resultado, ops, maxNum) {
    const op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '+') {
      if (resultado <= 1) return `1 + 0`;
      const a = Math.floor(Math.random() * (resultado - 1)) + 1;
      const b = resultado - a;
      return `${a} + ${b}`;
    } else {
      // Subtração: a - b = resultado -> a = resultado + b
      const maxAdicional = Math.min(8, Math.max(2, Math.floor((maxNum - resultado) / 2)));
      const b = Math.floor(Math.random() * maxAdicional) + 1;
      const a = resultado + b;
      return `${a} - ${b}`;
    }
  }

  _construirCenario() {
    const { largura: L, altura: A } = this;
    const nodeFundo = new Node({ largura: L, altura: A });
    nodeFundo.desenhar = (ctx) => {
      // Fundo suave índigo/slate escuro
      const grad = ctx.createLinearGradient(0, 0, L * 0.3, A);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E1B4B');
      grad.addColorStop(1, '#0F172A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, L, A);

      // Halo sutil no centro
      const halo = ctx.createRadialGradient(L * 0.5, A * 0.4, 20, L * 0.5, A * 0.4, A * 0.6);
      halo.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      halo.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, L, A);
    };
    this.adicionar(nodeFundo);
  }

  _construirHUD() {
    const { largura: L, config } = this;

    // Botão de Ajuda / Tutorial no HUD (RE-05)
    this.telaAjuda = new HelpScreen({
      cena: this,
      aoFechar: () => {
        this.pausada = false;
      },
    });
    this.adicionar(this.telaAjuda);

    this.telaPausa = new PauseScreen({
      audio: this.audio,
      config,
      somToque: config.audio?.clique,
      aoAjuda: () => {
        this.telaPausa.fechar();
        this.telaAjuda.abrir();
      },
      aoReiniciar: () => this.irPara('jogando'),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.telaPausa);

    // Botão Pausa (Canto Superior Esquerdo)
    this.adicionar(new IconButton({
      icone: 'pausa',
      x: espaco.lg,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.telaPausa.abrir(),
    }));

    // Botão Ajuda / Tutorial (Canto Superior Esquerdo ao lado da pausa)
    this.adicionar(new IconButton({
      icone: 'tutorial',
      x: espaco.lg + 72 + espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.telaAjuda.abrir(),
    }));

    // Botão Som (Canto Superior Direito)
    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      tamanho: 72,
      somToque: config.audio?.clique,
    }));

    // Banner central de instrução
    this.bannerFeedback = new TextNode('RESOLVA A CONTA E TOQUE NO NÚMERO!', {
      x: L / 2,
      y: 42,
      tamanho: tipografia.corpo,
      peso: tipografia.pesoForte,
      cor: '#38BDF8',
      alinhamento: 'center',
    });
    this.adicionar(this.bannerFeedback);
  }

  _adicionarBotaoPassar() {
    // Botão Passar (abaixo da barra de tempo, no controle do aluno)
    this.botaoPassar = new Node({
      x: 30 + 180,
      y: 450 + 80,
      largura: 360,
      altura: 44,
      visible: false,
      interativo: true,
    });

    this.botaoPassar.desenhar = (ctx) => {
      if (!this.botaoPassar.visible) return;

      const l = this.botaoPassar.largura;
      const a = this.botaoPassar.altura;

      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.roundRect(0, 0, l, a, 12);
      ctx.fill();

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 20px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PRÓXIMA', l / 2, a / 2);
    };

    this.botaoPassar.contemPontoLocal = (x, y) => {
      return x >= 0 && y >= 0 && x <= this.botaoPassar.largura && y <= this.botaoPassar.altura;
    };

    this.botaoPassar.on('toque', () => {
      this._aoTocarBotaoPassar();
    });

    this.adicionar(this.botaoPassar);
  }

  _construir2Cartelas() {
    const cardSize = 360;
    const gapCartelas = 30;
    const gridStartX = 30;
    const gridStartY = 70;

    const padding = 16;
    const gapCell = 8;
    const nomeSpace = 40; // Espaço para o nome do jogador
    const cellSize = (cardSize - padding * 2 - gapCell * 3 - nomeSpace) / 4; // ~61px

    this.todasCelulasPorCartela = [[], []];
    this.cartelasNodes = [];

    for (let ci = 0; ci < 2; ci++) {
      const tema = TEMAS_CARTELAS[ci];
      const cardX = gridStartX + ci * (cardSize + gapCartelas);
      const cardY = gridStartY;

      // Node da Cartela Individual
      const cardNode = new Node({
        x: cardX,
        y: cardY,
        largura: cardSize,
        altura: cardSize,
      });

      cardNode.desenhar = (ctx) => {
        ctx.save();
        // Sombra
        ctx.shadowColor = 'rgba(2, 6, 23, 0.4)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;

        // Fundo da cartela
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(0, 0, cardSize, cardSize, 18);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Friso superior da cartela com cor temática
        ctx.fillStyle = tema.primary;
        ctx.beginPath();
        ctx.roundRect(0, 0, cardSize, 10, [18, 18, 0, 0]);
        ctx.fill();

        // Nome do jogador no topo
        ctx.fillStyle = tema.primary;
        ctx.font = `bold 16px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.fillText(tema.nome, cardSize / 2, 28);

        // Linha vencedora animada se esta cartela venceu
        if (this._cartelaVencedoraIndex === ci && this._linhaVencedoraAtiva && this._progressoLinha > 0) {
          const [p1, , , p4] = this._linhaVencedoraAtiva;
          const celulasDaCartela = this.todasCelulasPorCartela[ci];
          const c1 = celulasDaCartela[p1];
          const c4 = celulasDaCartela[p4];
          if (c1 && c4) {
            const x1 = c1.x - cardX;
            const y1 = c1.y - cardY;
            const x2 = c4.x - cardX;
            const y2 = c4.y - cardY;

            const cx = x1 + (x2 - x1) * this._progressoLinha;
            const cy = y1 + (y2 - y1) * this._progressoLinha;

            ctx.save();
            ctx.strokeStyle = '#FACC15';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(250, 204, 21, 0.9)';
            ctx.shadowBlur = 16;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(cx, cy);
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.restore();
      };

      this.adicionar(cardNode);
      this.cartelasNodes.push(cardNode);

      // Células 4x4 da cartela
      const numerosDaCartela = this.cartelasNumeros[ci];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const cellIdx = r * 4 + c;
          const num = numerosDaCartela[cellIdx];
          const cellX = cardX + padding + c * (cellSize + gapCell);
          const cellY = cardY + nomeSpace + padding + r * (cellSize + gapCell);

          const celula = new BingoCellNode(num, cellIdx, ci, tema, {
            x: cellX,
            y: cellY,
            tamanho: cellSize,
            audio: this.audio,
            somToque: this.config.audio?.clique,
            aoTocarNumero: (cell) => this._aoTocarCelula(cell),
          });

          this.todasCelulasPorCartela[ci].push(celula);
          this.adicionar(celula);
        }
      }
    }
  }

  _construirAreaDesafio() {
    const { largura: L, altura: A } = this;
    const deckX = 780;
    const deckY = 70;
    const deckW = 470;
    const deckH = 530;

    this.painelDesafio = new Node({
      x: deckX,
      y: deckY,
      largura: deckW,
      altura: deckH,
    });

    this.cardRotacaoY = 0;
    this.cardShowFront = false;

    this.painelDesafio.desenhar = (ctx) => {
      const l = deckW;
      const a = deckH;
      ctx.save();

      ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, 0, l, a, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = `bold 20px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.fillText('CARTA SORTEADA', l / 2, 48);

      const cw = 340;
      const ch = 280;
      const cx = l / 2;
      const cy = a / 2 - 10;

      ctx.save();
      ctx.translate(cx, cy);

      const cosVal = Math.cos(this.cardRotacaoY);
      ctx.scale(Math.abs(cosVal) || 0.01, 1);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;

      if (this.cardShowFront) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 24);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, 12, [24, 24, 0, 0]);
        ctx.fill();

        ctx.fillStyle = '#64748B';
        ctx.font = `bold 18px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.fillText('CALCULE A CONTA:', 0, -ch / 2 + 56);

        ctx.fillStyle = '#0F172A';
        ctx.font = `bold 64px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.desafioAtual ? `${this.desafioAtual.expressao}` : '...', 0, 10);

        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.roundRect(-50, ch / 2 - 64, 100, 40, 20);
        ctx.fill();

        ctx.fillStyle = '#0284C7';
        ctx.font = `bold 24px ${tipografia.familia}`;
        ctx.fillText('=  ?', 0, ch / 2 - 44);
      } else {
        const backGrad = ctx.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2);
        backGrad.addColorStop(0, '#0284C7');
        backGrad.addColorStop(1, '#0369A1');
        ctx.fillStyle = backGrad;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 24);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.arc(0, 0, 56, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold 52px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 2);
      }

      ctx.restore();

      const placarY = a - 100;
      ctx.fillStyle = '#94A3B8';
      ctx.font = `bold 16px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.fillText('PLACAR', l / 2, placarY);

      ctx.fillStyle = TEMA_JOGADOR.primary;
      ctx.font = `bold 28px ${tipografia.familia}`;
      ctx.fillText(`${this._acertosJogador}`, l / 2 - 60, placarY + 35);
      ctx.fillStyle = '#94A3B8';
      ctx.font = `12px ${tipografia.familia}`;
      ctx.fillText('VOCÊ', l / 2 - 60, placarY + 55);

      ctx.fillStyle = TEMA_CPU.primary;
      ctx.font = `bold 28px ${tipografia.familia}`;
      ctx.fillText(`${this._acertosCpu}`, l / 2 + 60, placarY + 35);
      ctx.fillStyle = '#94A3B8';
      ctx.font = `12px ${tipografia.familia}`;
      ctx.fillText('CPU', l / 2 + 60, placarY + 55);

      ctx.fillStyle = '#94A3B8';
      ctx.font = `${tipografia.pesoMedio} 16px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.fillText(`Desafio ${this.desafioIndex} de ${this.desafios.length}`, l / 2, a - 24);

      ctx.restore();
    };

    this.adicionar(this.painelDesafio);
  }

  _construirControleAluno() {
    const ctrlX = 30;
    const ctrlY = 450;
    const ctrlW = 720;
    const ctrlH = 150;

    this._barraTempoProgresso = 1;
    this._barraTempoAtiva = false;

    this.controleAluno = new Node({
      x: ctrlX,
      y: ctrlY,
      largura: ctrlW,
      altura: ctrlH,
    });

    this.controleAluno.desenhar = (ctx) => {
      const l = ctrlW;
      const a = ctrlH;
      ctx.save();

      ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, 0, l, a, 18);
      ctx.fill();
      ctx.stroke();

      const tema = TEMAS_CARTELAS[0];
      ctx.fillStyle = tema.primary;
      ctx.font = `bold 16px ${tipografia.familia}`;
      ctx.textAlign = 'left';
      ctx.fillText('SEU CONTROLE', 20, 30);

      if (this._barraTempoAtiva) {
        const barraX = 20;
        const barraY = 50;
        const barraLargura = l - 40;
        const barraAltura = 20;

        ctx.fillStyle = 'rgba(51, 65, 85, 0.6)';
        ctx.beginPath();
        ctx.roundRect(barraX, barraY, barraLargura, barraAltura, 10);
        ctx.fill();

        const larguraPreenchida = barraLargura * this._barraTempoProgresso;

        let corBarra;
        if (this._barraTempoProgresso > 0.5) {
          corBarra = '#4ADE80';
        } else if (this._barraTempoProgresso > 0.25) {
          corBarra = '#FBBF24';
        } else {
          corBarra = '#EF4444';
        }

        ctx.fillStyle = corBarra;
        ctx.beginPath();
        ctx.roundRect(barraX, barraY, larguraPreenchida, barraAltura, 10);
        ctx.fill();

        ctx.fillStyle = '#94A3B8';
        ctx.font = `bold 14px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.fillText('PENSANDO...', l / 2, barraY - 6);
      }

      ctx.restore();
    };

    this.adicionar(this.controleAluno);
  }

  _mostrarProximaConta() {
    if (this._fimResolvido || this._aguardandoProximaConta) return;

    if (this.desafioIndex >= this.desafios.length) {
      this.desafios.sort(() => Math.random() - 0.5);
      this.desafioIndex = 0;
    }

    this.desafioAtual = this.desafios[this.desafioIndex];
    this.desafioIndex++;
    this._ultimaContaEnviada = this.desafioAtual.numero;

    // Resetar flags de turno
    this._turnoAtivo = true;
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    // Animação de Flip 3D
    this.cardRotacaoY = 0;
    this.cardShowFront = false;

    Tween.de(this)
      .entao({ cardRotacaoY: Math.PI / 2 }, 180, Easing.suaveEntrada)
      .chamar(() => {
        this.cardShowFront = true;

        // Verificar onde está o resultado
        const resultado = this.desafioAtual.numero;
        const celulasJogador = this.todasCelulasPorCartela[0];
        const celulasCpu = this.todasCelulasPorCartela[1];
        const existeNaJogador = celulasJogador.some(c => c.numero === resultado && !c.marcado);
        const existeNaCpu = celulasCpu.some(c => c.numero === resultado && !c.marcado);

        if (!existeNaJogador && !existeNaCpu) {
          // Resultado não existe em NENHUMA cartela — pular
          this._pularContaSemResultado();
        } else {
          // Iniciar turno — aluno tem tempo para pensar
          this._iniciarTurnoComTempo(existeNaJogador, existeNaCpu);
        }
      })
      .entao({ cardRotacaoY: Math.PI }, 220, Easing.suaveSaida);
  }

  /**
   * Inicia turno onde jogador e CPU marcam na mesma conta.
   * A conta só avança quando o aluno clicar PRÓXIMA ou o tempo acabar.
   * @param {boolean} existeNaJogador - se o resultado existe na cartela do jogador
   * @param {boolean} existeNaCpu - se o resultado existe na cartela da CPU
   */
  _iniciarTurnoComTempo(existeNaJogador, existeNaCpu) {
    const resultado = this.desafioAtual.numero;

    // Guardar estado para a CPU reagir DEPOIS do aluno decidir
    this._resultadoAtual = resultado;
    this._existeNaCpu = existeNaCpu;

    // Tempo que o aluno tem para pensar e marcar (configurável por nível)
    const tempoParaPensar = this.nivel.tempoPensarMs || 60000;
    this._barraTempoProgresso = 1;
    this._barraTempoAtiva = true;

    // Botão aparece imediatamente — aluno decide primeiro
    this.botaoPassar.visible = true;

    // Iniciar animação da barra de tempo
    Tween.de(this)
      .entao({ _barraTempoProgresso: 0 }, tempoParaPensar, Easing.linear)
      .chamar(() => {
        this._barraTempoAtiva = false;
      });

    // Timer para quando o tempo do aluno acabar
    this._timerTurno = setTimeout(() => {
      if (this._fimResolvido || !this._turnoAtivo) return;
      // Tempo esgotou — CPU reage e depois avança
      this._reagirCpuEAvancar();
    }, tempoParaPensar);

    // Informar o aluno
    if (existeNaJogador && existeNaCpu) {
      this.bannerFeedback.texto = 'AMBOS TÊM ESSE NÚMERO! MARQUE E CLIQUE PRÓXIMA!';
      this.bannerFeedback.cor = '#A78BFA';
    } else if (existeNaJogador) {
      this.bannerFeedback.texto = 'VOCÊ TEM ESSE NÚMERO! MARQUE E CLIQUE PRÓXIMA!';
      this.bannerFeedback.cor = '#38BDF8';
    } else {
      this.bannerFeedback.texto = 'SÓ O COMPUTADOR TEM ESSE NÚMERO! CLIQUE PRÓXIMA.';
      this.bannerFeedback.cor = '#F97316';
    }
  }

  /**
   * CPU reage (marca ou não) e depois avança o turno.
   * Chamado DEPOIS do aluno decidir (marcar ou clicar PRÓXIMA).
   */
  _reagirCpuEAvancar() {
    if (this._fimResolvido || !this._turnoAtivo) return;

    // Limpar timers do turno
    clearTimeout(this._timerTurno);
    clearTimeout(this._timerCpu);
    Tween.removerDe(this);
    this._barraTempoAtiva = false;
    this._barraTempoProgresso = 1;

    // Esconder botão durante a animação da CPU
    this.botaoPassar.visible = false;

    // CPU reage com seu tempo de reação
    if (this._existeNaCpu) {
      const tempoReacaoCpu = this._cpuTempoMin + Math.random() * (this._cpuTempoMax - this._cpuTempoMin);

      this._timerCpu = setTimeout(() => {
        if (this._fimResolvido || !this._turnoAtivo) return;
        this._cpuMarcarSeTiver(this._resultadoAtual);
        // Depois que a CPU marcou (ou não), avança
        this._avancarAposDecisaoCpu();
      }, tempoReacaoCpu);
    } else {
      // CPU não tem o número — avança direto
      this._avancarAposDecisaoCpu();
    }
  }

  /**
   * Avança para a próxima conta após a decisão da CPU.
   */
  _avancarAposDecisaoCpu() {
    if (this._fimResolvido || !this._turnoAtivo) return;
    this._finalizarTurno();
  }

  /**
   * CPU tenta marcar o número na sua cartela.
   * NÃO avança o turno - apenas marca se tiver o número.
   */
  _cpuMarcarSeTiver(resultado) {
    if (this._fimResolvido || !this._turnoAtivo) return;

    const celulasCpu = this.todasCelulasPorCartela[1];
    const celulaAlvo = celulasCpu.find(c => c.numero === resultado && !c.marcado);

    if (!celulaAlvo) return;

    // Verificar se a CPU vai acertar (baseado na chance)
    const vaiAcertar = Math.random() < this._cpuChanceAcerto;

    if (!vaiAcertar) return; // CPU errou, não marca

    // CPU ACERTOU - marca na cartela
    celulaAlvo.marcarComAnimacao();
    this._acertosCpu++;
    this._cpuMarcouNesteTurno = true;

    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);

    // Verificar se a CPU fez BINGO
    const vitoriaCpu = this._verificarLinhaVencedora(1);
    if (vitoriaCpu) {
      this._comemorarBingoCpu(vitoriaCpu.linha);
      return;
    }

    // Informar que a CPU marcou (mas NÃO avança turno)
    this.bannerFeedback.texto = 'O COMPUTADOR MARCOU! VOCÊ TAMBÉM PODE MARCAR!';
    this.bannerFeedback.cor = '#F97316';
  }

  /**
   * Finaliza o turno atual e avança para a próxima conta.
   */
  _finalizarTurno() {
    if (!this._turnoAtivo) return;
    this._turnoAtivo = false;

    // Limpar todos os timers e cancelar Tweens
    clearTimeout(this._timerTurno);
    clearTimeout(this._timerCpu);
    Tween.removerDe(this);
    this._barraTempoAtiva = false;
    this._barraTempoProgresso = 1;

    // Resetar flags de marcação
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    // Esconder botão Passar
    this.botaoPassar.visible = false;

    // Avançar para próxima conta
    this._aguardandoProximaConta = true;
    Tween.de(this)
      .esperar(1200)
      .chamar(() => {
        this.bannerFeedback.texto = 'TOQUE NO NÚMERO E CLIQUE PASSAR!';
        this.bannerFeedback.cor = '#38BDF8';
        this._aguardandoProximaConta = false;
        this._mostrarProximaConta();
      });
  }

  /**
   * Pular conta quando o resultado não existe em nenhuma cartela.
   */
  _pularContaSemResultado() {
    this.bannerFeedback.texto = 'ESSE NÚMERO NÃO ESTÁ EM NENHUMA CARTELA! PRÓXIMA...';
    this.bannerFeedback.cor = '#94A3B8';
    this._barraTempoAtiva = false;
    this._barraTempoProgresso = 1;
    this.botaoPassar.visible = false;
    clearTimeout(this._timerCpu);
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    this._aguardandoProximaConta = true;
    Tween.de(this)
      .esperar(1500)
      .chamar(() => {
        this.bannerFeedback.texto = 'TOQUE NO NÚMERO E CLIQUE PASSAR!';
        this.bannerFeedback.cor = '#38BDF8';
        this._aguardandoProximaConta = false;
        this._mostrarProximaConta();
      });
  }

  /**
   * Verificar se uma cartela específica fez BINGO.
   */
  _verificarLinhaVencedora(cartelaIndex) {
    const celulas = this.todasCelulasPorCartela[cartelaIndex];
    for (const linha of this._linhasVencedoras) {
      if (linha.every((idx) => celulas[idx]?.marcado)) {
        return { linha };
      }
    }
    return null;
  }

  _aoTocarCelula(celula) {
    if (this._fimResolvido || !this.desafioAtual) return;

    // Permitir toque apenas na cartela do jogador (índice 0)
    if (celula.cartelaIndex !== 0) return;

    if (celula.marcado) return;

    // Se não há turno ativo, ignorar
    if (!this._turnoAtivo) return;

    const resultadoEsperado = this.desafioAtual.numero;

    if (celula.numero === resultadoEsperado) {
      // JOGADOR ACERTOU!
      celula.marcarComAnimacao();
      this._acertosJogador++;
      this._jogadorMarcouNesteTurno = true;

      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);

      this.bannerFeedback.texto = 'MUITO BEM! CLIQUE PRÓXIMA PARA AVANÇAR!';
      this.bannerFeedback.cor = '#4ADE80';

      // Verificar se o JOGADOR fez BINGO
      const vitoriaJogador = this._verificarLinhaVencedora(0);
      if (vitoriaJogador) {
        this._comemorarBingoJogador(vitoriaJogador.linha);
        return;
      }

      // Verificar se a CPU já fez BINGO
      const vitoriaCpu = this._verificarLinhaVencedora(1);
      if (vitoriaCpu) {
        this._comemorarBingoCpu(vitoriaCpu.linha);
        return;
      }

      // NÃO finaliza turno - aluno pode marcar mais números se quiser
      // ou clicar PRÓXIMA para avançar
    } else {
      // ERRO (amigável e não punitivo)
      if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);

      this.bannerFeedback.texto = 'TENTE DE NOVO! PENSE COM CALMA.';
      this.bannerFeedback.cor = '#FBBF24';

      Tween.removerDe(celula);
      Tween.de(celula)
        .entao({ x: celula.x - 6 }, 50)
        .entao({ x: celula.x + 6 }, 50)
        .entao({ x: celula.x }, 50);

      Tween.de(this)
        .esperar(1400)
        .chamar(() => {
          if (this._turnoAtivo) {
            this.bannerFeedback.texto = 'TOQUE NO NÚMERO E CLIQUE PRÓXIMA!';
            this.bannerFeedback.cor = '#38BDF8';
          }
        });
    }
  }

  _aoTocarBotaoPassar() {
    if (this._fimResolvido || !this._turnoAtivo) return;

    // Aluno decidiu — CPU reage e depois avança
    this._reagirCpuEAvancar();
  }

  _verificarLinhaVencedoraEmTodasCartelas() {
    for (let ci = 0; ci < 2; ci++) {
      const celulas = this.todasCelulasPorCartela[ci];
      for (const linha of this._linhasVencedoras) {
        if (linha.every((idx) => celulas[idx]?.marcado)) {
          return { cartelaIndex: ci, linha };
        }
      }
    }
    return null;
  }

  _comemorarBingoJogador(linha) {
    this._cartelaVencedoraIndex = 0;
    this._linhaVencedoraAtiva = linha;

    this.bannerFeedback.texto = '🎉 BINGO! VOCÊ VENCEU! 🎉';
    this.bannerFeedback.cor = '#FACC15';

    // Anima o raio de vitória
    Tween.de(this)
      .entao({ _progressoLinha: 1 }, 600, Easing.suaveSaida)
      .esperar(1500)
      .chamar(() => this._terminar(true));
  }

  _comemorarBingoCpu(linha) {
    this._cartelaVencedoraIndex = 1;
    this._linhaVencedoraAtiva = linha;

    this.bannerFeedback.texto = '😵 O COMPUTADOR FEZ BINGO! VOCÊ PERDEU!';
    this.bannerFeedback.cor = '#EF4444';

    // Anima o raio de vitória na cartela da CPU
    Tween.de(this)
      .entao({ _progressoLinha: 1 }, 600, Easing.suaveSaida)
      .esperar(1500)
      .chamar(() => this._terminar(false));
  }

  _terminar(venceu) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;

    // Limpar timer de turno
    clearTimeout(this._timerTurno);
    this._turnoAtivo = false;

    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: {
        acertos: this._acertosJogador,
        erros: this._acertosCpu, // CPU acertos são "erros" do jogador
        totalPerguntas: this.desafioIndex,
        nivel: this.nivel.id,
        vitoria: venceu,
        jogo: this.config.slug,
        tempoSegundos: 0,
        ajuda: 0,
        // Dados extras para a tela de resultado
        acertosJogador: this._acertosJogador,
        acertosCpu: this._acertosCpu,
      },
    });
  }
}
