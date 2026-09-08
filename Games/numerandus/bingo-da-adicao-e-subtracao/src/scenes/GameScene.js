import {
  Scene, Node, TextNode, Tween, Easing, ESTADOS, ScoreSystem,
  IconButton, SoundToggle, PauseScreen, HelpScreen,
  cores, tipografia, espaco, raio, sombras, alvoAcessivel, texto as aplicarCaixa,
} from '../../engine/index.js';

/**
 * Temas visuais das 2 cartelas de bingo (Jogador vs CPU).
 */
const TEMA_JOGADOR = { id: 'azul', nome: 'VOCÊ', primary: '#0284C7', light: '#E0F2FE', dark: '#0369A1', chip: 'rgba(2, 132, 199, 0.35)', glow: 'rgba(56, 189, 248, 0.7)' };
const TEMA_CPU = { id: 'cpu', nome: 'COMPUTADOR', primary: '#64748B', light: '#EEF1F4', dark: '#475569', chip: 'rgba(100, 116, 139, 0.35)', glow: 'rgba(148, 163, 184, 0.7)' };

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
    // Decisões da CPU rodam em paralelo (uma por rodada, podem se acumular
    // se o aluno passar rápido) — precisam de todas canceladas no fim do jogo.
    this._timersCpuPendentes = new Set();
    this._aguardandoProximaConta = false;
    this._ultimaContaEnviada = null;
    this._resultadoAtual = null;
    this._existeNaCpu = false;

    // Cartela do CPU começa virada (verso) a cada rodada — só revela quando
    // o próprio aluno pede (botão "ver cartela do CPU"), por um tempo curto
    // e visível (barrinha), no próprio ritmo dele.
    this._cpuVirada = true;
    this._espiandoCpu = false;
    this._espiaCpuEstado = { progresso: 1 };
    this._ESPIA_CPU_DURACAO_MS = 4000;

    // Configurações da CPU baseadas no nível
    const configCpu = config.competicao?.niveisCpu?.[this.nivel.id] ?? { chanceAcerto: 0.7, tempoReacaoMs: [2000, 3500] };
    this._cpuChanceAcerto = configCpu.chanceAcerto;
    this._cpuTempoMin = configCpu.tempoReacaoMs[0];
    this._cpuTempoMax = configCpu.tempoReacaoMs[1];

    // Layout em 3 colunas (desafio+controle / cartela do jogador / CPU+contador),
    // calculado uma vez e compartilhado por todas as funções _construir*.
    this._layout = this._calcularLayout();

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

  /**
   * Layout em 3 colunas (mesmo desenho validado no mockup "Cartela em Foco"):
   * desafio+controle à esquerda, cartela do jogador grande no centro,
   * CPU+contador à direita — cada coluna centralizada na mesma faixa
   * vertical, pra folga nunca virar uma sobra de espaço de um lado só.
   */
  _calcularLayout() {
    const MARGEM = 32;
    const GAP = 16;
    const vTopo = 80;
    const vBase = 720 - 40;
    const vAltura = vBase - vTopo;

    const colEsqX = MARGEM;
    const colEsqW = 340;
    const desafioH = 310;
    const controleBarraH = 46;
    const botaoPassarH = 38;
    const grupoEsqH = desafioH + GAP + controleBarraH + 12 + botaoPassarH;
    const grupoEsqY = vTopo + (vAltura - grupoEsqH) / 2;

    const desafio = { x: colEsqX, y: grupoEsqY, w: colEsqW, h: desafioH };
    const controleBarra = { x: colEsqX, y: desafio.y + desafio.h + GAP, w: colEsqW, h: controleBarraH };
    const botaoPassar = { x: colEsqX, y: controleBarra.y + controleBarra.h + 12, w: colEsqW, h: botaoPassarH };

    const colDirW = 260;
    const cpuH = 270;
    const chipH = 48;
    const colDirX = 1280 - MARGEM - colDirW;
    const grupoDirH = cpuH + GAP + chipH;
    const grupoDirY = vTopo + (vAltura - grupoDirH) / 2;

    const cpu = { x: colDirX, y: grupoDirY, w: colDirW, h: cpuH };
    const cpuChip = { x: colDirX, y: cpu.y + cpu.h + GAP, w: colDirW, h: chipH };

    const faixaEsquerda = colEsqX + colEsqW + MARGEM;
    const faixaDireita = colDirX - MARGEM;
    const faixaLargura = faixaDireita - faixaEsquerda;
    const tamanhoJogador = Math.min(480, faixaLargura, vAltura);
    const player = {
      x: faixaEsquerda + (faixaLargura - tamanhoJogador) / 2,
      y: vTopo + (vAltura - tamanhoJogador) / 2,
      w: tamanhoJogador,
      h: tamanhoJogador,
    };

    return { desafio, controleBarra, botaoPassar, cpu, cpuChip, player };
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

    // Banner de instrução — bem em cima da cartela do jogador, não mais
    // espalhado no topo da tela inteira (ela é o centro das atenções agora).
    const { player } = this._layout;
    this.bannerFeedback = new TextNode('TOQUE NO NÚMERO CERTO AQUI ▾', {
      x: player.x + player.w / 2,
      y: player.y - 10,
      tamanho: tipografia.apoio,
      peso: tipografia.pesoForte,
      cor: '#38BDF8',
      alinhamento: 'center',
      linhaBase: 'bottom',
    });
    this.adicionar(this.bannerFeedback);
  }

  _adicionarBotaoPassar() {
    // Botão Passar — elemento à parte, solto logo abaixo da barra de
    // progresso (não divide mais o mesmo painel com ela).
    const { botaoPassar } = this._layout;
    this.botaoPassar = new Node({
      x: botaoPassar.x,
      y: botaoPassar.y,
      largura: botaoPassar.w,
      altura: botaoPassar.h,
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
    const { player, cpu, cpuChip } = this._layout;

    this.todasCelulasPorCartela = [[], []];
    this.cartelasNodes = [];

    this._construirCartelaVisual(0, player, TEMA_JOGADOR, 44);
    this._construirCartelaVisual(1, cpu, TEMA_CPU, 28);

    // Verso da cartela do CPU — cobre a cartela (ci=1) enquanto _cpuVirada
    // for verdadeiro. Fica por cima das células, mas nunca intercepta toque.
    this.cpuVersoNode = new Node({ x: cpu.x, y: cpu.y, largura: cpu.w, altura: cpu.h });
    this.cpuVersoNode.escalaVerso = 1;

    this.cpuVersoNode.desenhar = (ctx) => {
      if (!this._cpuVirada) return;
      const l = cpu.w;
      const a = cpu.h;
      const escala = Math.max(0.02, Math.abs(this.cpuVersoNode.escalaVerso));

      ctx.save();
      ctx.shadowColor = 'rgba(2, 6, 23, 0.4)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.translate(l / 2, a / 2);
      ctx.scale(escala, 1);
      ctx.translate(-l / 2, -a / 2);

      const grad = ctx.createLinearGradient(0, 0, l, a);
      grad.addColorStop(0, TEMA_CPU.dark);
      grad.addColorStop(1, TEMA_CPU.primary);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(0, 0, l, a, 18);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.beginPath();
      ctx.arc(l / 2, a * 0.42, l * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${Math.round(l * 0.16)}px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', l / 2, a * 0.42 + 2);

      ctx.font = `700 ${Math.max(12, Math.round(l * 0.06))}px ${tipografia.familia}`;
      ctx.fillText('CARTELA VIRADA', l / 2, a * 0.72);
      ctx.restore();
    };

    this.adicionar(this.cpuVersoNode);

    // Selo abaixo da cartela do CPU — três estados: em repouso mostra só o
    // contador; com o turno ativo vira um botão "ver cartela do CPU"; ao
    // tocar, espia por um tempo curto E VISÍVEL (barrinha), depois volta
    // a virar sozinha — sem susto, porque o aluno vê o tempo acabando.
    this.chipCpu = new Node({ x: cpuChip.x, y: cpuChip.y, largura: cpuChip.w, altura: cpuChip.h, interativo: true });
    this.chipCpu.desenhar = (ctx) => {
      const l = cpuChip.w;
      const a = cpuChip.h;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(0, 0, l, a, 14);
      ctx.fill();
      ctx.stroke();

      if (this._espiandoCpu) {
        const padX = 10;
        const barW = l - padX * 2;
        const barH = 4;
        const barY = 8;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.roundRect(padX, barY, barW, barH, 2);
        ctx.fill();
        ctx.fillStyle = TEMA_CPU.primary;
        ctx.beginPath();
        ctx.roundRect(padX, barY, barW * this._espiaCpuEstado.progresso, barH, 2);
        ctx.fill();

        ctx.fillStyle = '#E2E8F0';
        ctx.font = `700 ${Math.max(11, Math.round(a * 0.26))}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TOQUE PRA ESCONDER', l / 2, a / 2 + 9);
      } else if (this._turnoAtivo) {
        ctx.fillStyle = '#E2E8F0';
        ctx.font = `700 ${Math.max(12, Math.round(a * 0.3))}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ESPIAR CARTELA DO CPU', l / 2, a / 2);
      } else {
        ctx.fillStyle = TEMA_CPU.primary;
        ctx.beginPath();
        ctx.arc(18, a / 2, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#CBD5E1';
        ctx.font = `600 ${Math.max(11, Math.round(a * 0.3))}px ${tipografia.familia}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`CPU · ${this._acertosCpu} acertos`, 32, a / 2 + 1);
      }
      ctx.restore();
    };

    this.chipCpu.contemPontoLocal = (x, y) => x >= 0 && y >= 0 && x <= cpuChip.w && y <= cpuChip.h;
    this.chipCpu.on('toque', () => {
      if (this._fimResolvido || !this._turnoAtivo) return;
      if (this._espiandoCpu) this._encerrarEspiadaCpu();
      else this._iniciarEspiadaCpu();
    });

    this.adicionar(this.chipCpu);
  }

  /** Inicia a espiada com tempo visível (barrinha) — o aluno controla quando abrir. */
  _iniciarEspiadaCpu() {
    if (this._espiandoCpu) return;
    this._revelarCpu();
    this._espiandoCpu = true;
    this._espiaCpuEstado.progresso = 1;
    Tween.removerDe(this._espiaCpuEstado);
    Tween.de(this._espiaCpuEstado)
      .entao({ progresso: 0 }, this._ESPIA_CPU_DURACAO_MS, Easing.linear)
      .chamar(() => this._encerrarEspiadaCpu());
  }

  /** Encerra a espiada (tempo esgotado ou o aluno tocou de novo pra fechar). */
  _encerrarEspiadaCpu() {
    Tween.removerDe(this._espiaCpuEstado);
    this._espiandoCpu = false;
    this._virarCpu();
  }

  /**
   * Constrói uma cartela (jogador ou CPU) num retângulo qualquer — o
   * tamanho de célula é derivado da LARGURA do retângulo (células
   * quadradas), então uma cartela mais alta que larga (caso do CPU) só
   * sobra um respiro embaixo da grade, nunca deforma os números.
   */
  _construirCartelaVisual(ci, rect, tema, nomeSpace) {
    const { x: cardX, y: cardY, w: cardW, h: cardH } = rect;
    const padding = 16;
    const gapCell = 8;
    const cellSize = (cardW - padding * 2 - gapCell * 3 - nomeSpace) / 4;

    const cardNode = new Node({ x: cardX, y: cardY, largura: cardW, altura: cardH });

    cardNode.desenhar = (ctx) => {
      ctx.save();
      ctx.shadowColor = 'rgba(2, 6, 23, 0.4)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(0, 0, cardW, cardH, 18);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = tema.primary;
      ctx.beginPath();
      ctx.roundRect(0, 0, cardW, 10, [18, 18, 0, 0]);
      ctx.fill();

      ctx.fillStyle = tema.primary;
      ctx.font = `bold ${Math.round(Math.min(18, cardW * 0.05))}px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.fillText(tema.nome, cardW / 2, Math.max(24, nomeSpace * 0.62));

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

  /**
   * Esconde a cartela do CPU de novo — instantâneo. Sempre cancela também
   * uma espiada em andamento (se o aluno tivesse aberto), pra nunca sobrar
   * um timer rodando escondido depois que a rodada já virou de página.
   */
  _virarCpu() {
    Tween.removerDe(this.cpuVersoNode);
    Tween.removerDe(this._espiaCpuEstado);
    this._espiandoCpu = false;
    this.cpuVersoNode.escalaVerso = 1;
    this._cpuVirada = true;
  }

  /** Revela a cartela do CPU (fim de rodada) — com um flip curto. */
  _revelarCpu() {
    if (!this._cpuVirada) return;
    Tween.removerDe(this.cpuVersoNode);
    Tween.de(this.cpuVersoNode)
      .entao({ escalaVerso: 0 }, 200, Easing.suaveEntrada)
      .chamar(() => {
        this._cpuVirada = false;
      });
  }

  _construirAreaDesafio() {
    const { desafio } = this._layout;
    const deckW = desafio.w;
    const deckH = desafio.h;

    this.painelDesafio = new Node({
      x: desafio.x,
      y: desafio.y,
      largura: deckW,
      altura: deckH,
    });

    this.cardRotacaoY = 0;
    this.cardShowFront = false;

    // Card compacto (340×310) — todas as proporções em fração de l/a, não
    // em px fixos, pra caber sem apertar quando o container encolhe.
    this.painelDesafio.desenhar = (ctx) => {
      const l = deckW;
      const a = deckH;
      ctx.save();

      ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, 0, l, a, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = `bold ${Math.max(12, Math.round(l * 0.045))}px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.fillText('CARTA SORTEADA', l / 2, Math.round(a * 0.12));

      const cw = l * 0.8;
      const ch = a * 0.64;
      const cx = l / 2;
      const cy = a * 0.48;

      ctx.save();
      ctx.translate(cx, cy);

      const cosVal = Math.cos(this.cardRotacaoY);
      ctx.scale(Math.abs(cosVal) || 0.01, 1);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;

      if (this.cardShowFront) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 14);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, 8, [14, 14, 0, 0]);
        ctx.fill();

        ctx.fillStyle = '#64748B';
        ctx.font = `bold ${Math.max(10, Math.round(cw * 0.075))}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.fillText('CALCULE A CONTA:', 0, -ch / 2 + Math.round(ch * 0.28));

        ctx.fillStyle = '#0F172A';
        ctx.font = `bold ${Math.max(20, Math.round(cw * 0.24))}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.desafioAtual ? `${this.desafioAtual.expressao}` : '...', 0, ch * 0.08);
      } else {
        const backGrad = ctx.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2);
        backGrad.addColorStop(0, '#0284C7');
        backGrad.addColorStop(1, '#0369A1');
        ctx.fillStyle = backGrad;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 14);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.arc(0, 0, cw * 0.16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.round(cw * 0.15)}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 2);
      }

      ctx.restore();
      ctx.restore();
    };

    this.adicionar(this.painelDesafio);
  }

  _construirControleAluno() {
    const { controleBarra } = this._layout;
    const ctrlW = controleBarra.w;
    const ctrlH = controleBarra.h;

    this._barraTempoProgresso = 1;
    this._barraTempoAtiva = false;

    // Só a barra de progresso agora — o botão PRÓXIMA virou um elemento à
    // parte, solto logo abaixo (ver _adicionarBotaoPassar), sem dividir o
    // mesmo painel.
    this.controleAluno = new Node({
      x: controleBarra.x,
      y: controleBarra.y,
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
      ctx.roundRect(0, 0, l, a, 14);
      ctx.fill();
      ctx.stroke();

      if (this._barraTempoAtiva) {
        const barraX = 20;
        const barraLargura = l - 40;
        const barraAltura = 14;
        const barraY = a - barraAltura - 10;

        ctx.fillStyle = 'rgba(51, 65, 85, 0.6)';
        ctx.beginPath();
        ctx.roundRect(barraX, barraY, barraLargura, barraAltura, 8);
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
        ctx.roundRect(barraX, barraY, larguraPreenchida, barraAltura, 8);
        ctx.fill();

        ctx.fillStyle = '#94A3B8';
        ctx.font = `500 11px ${tipografia.familia}`;
        ctx.textAlign = 'left';
        ctx.fillText('PENSANDO…', barraX, barraY - 6);
      }

      ctx.restore();
    };

    this.adicionar(this.controleAluno);
  }

  _mostrarProximaConta() {
    if (this._fimResolvido || this._aguardandoProximaConta) return;

    this._virarCpu();

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

    // Guardar estado para a CPU reagir DEPOIS do aluno decidir, e pra saber
    // se dava pra acertar — usado na mensagem de transição, sem punição.
    this._resultadoAtual = resultado;
    this._existeNaJogador = existeNaJogador;
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

    // Sem dica de quem tem o número — o aluno resolve a conta e confere na
    // própria cartela, sem saber de antemão se vai achar ou não.
    this.bannerFeedback.texto = 'TOQUE NO NÚMERO CERTO AQUI ▾';
    this.bannerFeedback.cor = '#38BDF8';
  }

  /**
   * Avança direto para a próxima conta — a CPU decide (marca ou não) em
   * PARALELO, num timer independente, sem segurar a próxima pergunta.
   *
   * Antes, o aluno esperava a "reação" inteira da CPU (até 4,5s no nível
   * fácil) só pra ver a próxima conta aparecer — um delay que só existia
   * pra sincronizar uma revelação automática que nem existe mais (agora é
   * a cartela virada por padrão + espiada manual). Sem essa revelação,
   * não há mais motivo pra prender o aluno esperando.
   */
  _reagirCpuEAvancar() {
    if (this._fimResolvido || !this._turnoAtivo) return;

    clearTimeout(this._timerTurno);
    Tween.removerDe(this);
    this._barraTempoAtiva = false;
    this._barraTempoProgresso = 1;

    // Esconder botão — e virar a cartela de volta na hora, caso o aluno
    // tivesse espiado (o "próxima" sempre vira a cartela e cancela a
    // espiada, mesmo se ainda estava contando).
    this.botaoPassar.visible = false;
    this._virarCpu();

    // Agenda a decisão da CPU num timer à parte — captura o resultado
    // DESTA rodada agora, porque this._resultadoAtual já vai ter mudado
    // quando o timer disparar (a próxima pergunta já estará em andamento).
    if (this._existeNaCpu) {
      const resultadoDaRodada = this._resultadoAtual;
      const tempoReacaoCpu = this._cpuTempoMin + Math.random() * (this._cpuTempoMax - this._cpuTempoMin);
      const idTimer = setTimeout(() => {
        this._timersCpuPendentes.delete(idTimer);
        if (this._fimResolvido) return;
        this._cpuMarcarSeTiver(resultadoDaRodada);
      }, tempoReacaoCpu);
      this._timersCpuPendentes.add(idTimer);
    }

    this._finalizarTurno();
  }

  /**
   * CPU tenta marcar o número na sua cartela — roda em paralelo, pode
   * disparar com a próxima pergunta já em andamento (por isso não olha
   * mais para _turnoAtivo, só para _fimResolvido).
   */
  _cpuMarcarSeTiver(resultado) {
    if (this._fimResolvido) return;

    const celulasCpu = this.todasCelulasPorCartela[1];
    const celulaAlvo = celulasCpu.find(c => c.numero === resultado && !c.marcado);

    if (!celulaAlvo) return;

    // Verificar se a CPU vai acertar (baseado na chance)
    const vaiAcertar = Math.random() < this._cpuChanceAcerto;

    if (!vaiAcertar) return; // CPU errou, não marca

    // CPU ACERTOU - marca na cartela
    celulaAlvo.marcarComAnimacao();
    this._acertosCpu++;

    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);

    // Verificar se a CPU fez BINGO
    const vitoriaCpu = this._verificarLinhaVencedora(1);
    if (vitoriaCpu) {
      this._comemorarBingoCpu(vitoriaCpu.linha);
    }
    // Sem banner de "a CPU marcou" — ela decide fora de vista; o placar no
    // selo (e a espiada, se o aluno quiser) já contam essa história.
  }

  /**
   * Finaliza o turno atual e avança para a próxima conta.
   */
  _finalizarTurno() {
    if (!this._turnoAtivo) return;
    this._turnoAtivo = false;

    // A cartela do CPU já foi virada de volta no clique do PRÓXIMA
    // (ver _reagirCpuEAvancar) — quem quisesse ver o que ele decidiu já
    // teve a chance de espiar antes disso, no próprio ritmo.

    // Limpar timer e cancelar Tweens (a decisão da CPU tem seu próprio
    // timer independente agora — não é cancelada aqui, ver _reagirCpuEAvancar)
    clearTimeout(this._timerTurno);
    Tween.removerDe(this);
    this._barraTempoAtiva = false;
    this._barraTempoProgresso = 1;

    // Resetar flags de marcação
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    // Esconder botão
    this.botaoPassar.visible = false;

    // Avançar para próxima conta — pausa curta só de transição. Se o
    // número nem existia na cartela do aluno, a mensagem tranquiliza em
    // vez de simplesmente sumir: não é erro, só não calhou dessa vez.
    const semChanceDeAcertar = !this._existeNaJogador;
    this._aguardandoProximaConta = true;
    Tween.de(this)
      .esperar(500)
      .chamar(() => {
        if (semChanceDeAcertar) {
          this.bannerFeedback.texto = 'TUDO BEM! ESSE NÚMERO NÃO ESTAVA NA SUA CARTELA.';
          this.bannerFeedback.cor = '#94A3B8';
        } else {
          this.bannerFeedback.texto = 'TOQUE NO NÚMERO E CLIQUE PASSAR!';
          this.bannerFeedback.cor = '#38BDF8';
        }
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
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    this._aguardandoProximaConta = true;
    Tween.de(this)
      .esperar(800)
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
    this._revelarCpu();
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
    this._revelarCpu();
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

    // Limpar timer de turno e qualquer decisão de CPU ainda pendente em paralelo
    clearTimeout(this._timerTurno);
    this._timersCpuPendentes.forEach((id) => clearTimeout(id));
    this._timersCpuPendentes.clear();
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
