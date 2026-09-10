import {
  Scene, Node, TextNode, Tween, Easing, ESTADOS, ScoreSystem,
  IconButton, SoundToggle, PauseScreen, HelpScreen, ParticleSystem,
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
    // "errado" é um estado PROVISÓRIO e reversível — o toque errado fica
    // marcado em âmbar até o aluno corrigir (tocando de novo pra desfazer,
    // ou acertando) ou até a rodada acabar, quando aí sim vira erro contado.
    this.errado = false;
    this.aoTocarNumero = opcoes.aoTocarNumero ?? null;

    this.regX = tamanho / 2;
    this.regY = tamanho / 2;
    this.x += tamanho / 2;
    this.y += tamanho / 2;
    // Posição de repouso, fixa — o tremor de "errado" sempre parte e volta
    // pra cá, nunca do `x` atual (que pode estar em pleno tremor).
    this.xBase = this.x;

    this.escalaFicha = 0;
    this.opacidadeFicha = 0;
    this.escalaRipple = 0;
    this.opacidadeRipple = 0;

    this.on('apertar', () => this._pressao(true));
    this.on('soltar', () => this._pressao(false));
    this.on('sair', () => this._pressao(false));
    // Sem som automático aqui: certo e errado tocam efeitos DIFERENTES e
    // MUTUAMENTE EXCLUSIVOS (ver `GameScene._aoTocarCelula`) — um clique
    // genérico em toda célula tocaria junto com o som de erro, e a criança
    // ouviria "acerto + erro" ao mesmo tempo numa tentativa errada.
    this.on('toque', () => this.aoTocarNumero?.(this));
  }

  _pressao(ativo) {
    if (this.marcado) return;
    Tween.removerDe(this);
    Tween.para(this, { scaleX: ativo ? 0.92 : 1, scaleY: ativo ? 0.92 : 1 }, 100, Easing.suaveSaida);
  }

  marcarComAnimacao() {
    this.marcado = true;
    this.errado = false;
    this.escalaFicha = 2.8;
    this.opacidadeFicha = 0.2;
    this.escalaRipple = 1.0;
    this.opacidadeRipple = 0.8;

    Tween.para(this, { escalaFicha: 1, opacidadeFicha: 1 }, 320, Easing.costasSaida);
    Tween.para(this, { escalaRipple: 2.2, opacidadeRipple: 0 }, 400, Easing.suaveSaida);
  }

  /** Marca a tentativa errada (provisória) — treme, mas não é definitiva. */
  marcarErrado() {
    this.errado = true;
    Tween.removerDe(this);
    // Sempre relativo à posição de repouso (`xBase`), nunca ao `x` atual —
    // tocar de novo no meio de um tremor não pode acumular deslocamento e
    // fazer a célula "andar" pra fora do lugar.
    Tween.de(this)
      .entao({ x: this.xBase - 6 }, 45)
      .entao({ x: this.xBase + 6 }, 45)
      .entao({ x: this.xBase }, 45);
  }

  /** Desfaz a marca de errado — tocar de novo nela, ou acertar, limpa. */
  desmarcarErrado() {
    this.errado = false;
  }

  desenhar(ctx) {
    const { largura: l, altura: a, tema, numero, marcado, errado } = this;

    ctx.save();

    // Fundo da célula — âmbar quando errada (provisório), tema quando certa
    ctx.fillStyle = marcado ? tema.light : errado ? '#FEF3C7' : '#FFFFFF';
    ctx.strokeStyle = marcado ? tema.primary : errado ? '#F59E0B' : '#E2E8F0';
    ctx.lineWidth = marcado || errado ? 2.5 : 1.5;
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
    ctx.fillStyle = marcado ? tema.primary : errado ? '#92400E' : '#1E293B';
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
    // Liga assim que QUALQUER lado faz BINGO — bem antes de `_fimResolvido`
    // (que só liga uns 5s depois, dentro de `_terminar`). É o que impede a
    // comemoração de disparar duas vezes na janela entre as duas.
    this._celebracaoIniciada = false;
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
    // Erro REAL do aluno — só conta se uma marca errada (âmbar) ainda
    // estiver lá quando a rodada termina (ver _reagirCpuEAvancar/_terminar).
    this._errosJogador = 0;
    this._celulaErradaAtual = null;
    this._turnoAtivo = false;
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    // Relógio da rodada e decisão da CPU — movidos a QUADRO (`atualizar`),
    // não por `setTimeout`. Um `setTimeout` corre em tempo de relógio real,
    // por fora do jogo: Pausa e Ajuda são só um véu por cima da cena, então
    // o tempo esgotava e a CPU "decidia" por baixo dele — a rodada mudava
    // sozinha enquanto a criança lia a ajuda. `_pausadoProfundo` (ligado
    // enquanto Pausa OU Ajuda estiverem abertas) trava os dois ao mesmo
    // tempo (ver `atualizar`, `_abrirPausaProfunda`/`_fecharPausaProfunda`).
    this._pausadoProfundo = false;
    this._turnoRodando = false;
    this._turnoTempoRestante = 0;
    this._turnoTempoTotal = 0;
    // Decisões da CPU rodam em paralelo (uma por rodada, podem se acumular
    // se o aluno passar rápido) — cada uma é {restante, resultado}, em
    // segundos, decrementada a quadro junto com o relógio da rodada.
    this._cpuDecisoesPendentes = [];
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

    // Confete do BINGO — por último, pra desenhar por cima de tudo.
    // Brilho da vitória começa "desligado" (0).
    this._brilhoVitoria = 0;
    this.particulas = new ParticleSystem();
    this.adicionar(this.particulas);

    // ------------------------------------------------------ destaque (vitória da CPU)
    // Quando o computador vence, em vez do painel escuro genérico, a cartela
    // dele aparece ampliada e centralizada, com o resto da tela borrada atrás
    // — pra o olhar ir direto pro que aconteceu (a linha marcada), não pra um
    // texto solto no meio da tela. Ver `_mostrarDestaqueCpu`.
    this._mostrarBlurCpu = false;
    this._fundoBlurCpuImg = null;
    this.blurFundoCpu = new Node({ x: 0, y: 0, largura: this.largura, altura: this.altura });
    this.blurFundoCpu.desenhar = (ctx) => {
      if (this._mostrarBlurCpu && this._fundoBlurCpuImg) ctx.drawImage(this._fundoBlurCpuImg, 0, 0);
    };
    this.adicionar(this.blurFundoCpu);

    this._destaqueCpu = { ativo: false, escala: 0, numeros: null, marcados: null, linha: null };
    this.destaqueCartelaCpu = new Node({ x: 0, y: 0, largura: this.largura, altura: this.altura });
    this.destaqueCartelaCpu.desenhar = (ctx) => this._desenharDestaqueCpu(ctx);
    this.adicionar(this.destaqueCartelaCpu);

    // Selo de fim de jogo — o ÚLTIMO nó adicionado, pra ficar na frente de
    // TUDO (cartelas, brilho, confete). Sem isso, quem não estivesse com o
    // olho no texto pequeno acima da cartela podia nem perceber quem venceu.
    this._overlayFim = { escala: 0, ativo: false, titulo: '', subtitulo: '', cor: '#FACC15' };
    this.overlayFim = new Node({ x: 0, y: 0, largura: this.largura, altura: this.altura });
    this.overlayFim.desenhar = (ctx) => {
      const o = this._overlayFim;
      if (!o.ativo || o.escala <= 0.01) return;

      const panelW = 860;
      const panelH = 200;
      const cx = this.largura / 2;
      const cy = this.altura / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(o.escala, o.escala);
      ctx.translate(-panelW / 2, -panelH / 2);

      ctx.shadowColor = o.cor;
      ctx.shadowBlur = 40;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.beginPath();
      ctx.roundRect(0, 0, panelW, panelH, 28);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = o.cor;
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = o.cor;
      ctx.font = `800 ${o.subtitulo ? 52 : 58}px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(o.titulo, panelW / 2, panelH / 2 - (o.subtitulo ? 24 : 0));

      if (o.subtitulo) {
        ctx.fillStyle = '#CBD5E1';
        ctx.font = `600 22px ${tipografia.familia}`;
        ctx.fillText(o.subtitulo, panelW / 2, panelH / 2 + 36);
      }

      ctx.restore();
    };
    this.adicionar(this.overlayFim);

    // Iniciar primeira carta sorteada
    this._mostrarProximaConta();
  }

  /**
   * Avança o relógio da rodada e as decisões pendentes da CPU — a quadro,
   * `dt` em segundos. Congela por inteiro enquanto `_pausadoProfundo` (Pausa
   * OU Ajuda abertas): nada aqui decrementa, e por isso nada expira por
   * baixo do véu. Ver o comentário em `aoEntrar` sobre por que isto substitui
   * `setTimeout`.
   */
  atualizar(dt) {
    super.atualizar(dt);
    if (this._pausadoProfundo || this._fimResolvido) return;

    if (this._turnoRodando) {
      this._turnoTempoRestante = Math.max(0, this._turnoTempoRestante - dt);
      this._barraTempoProgresso = this._turnoTempoTotal > 0
        ? this._turnoTempoRestante / this._turnoTempoTotal
        : 0;
      if (this._turnoTempoRestante <= 0) {
        this._turnoRodando = false;
        this._reagirCpuEAvancar();
      }
    }

    if (this._cpuDecisoesPendentes.length > 0) {
      const restantes = [];
      for (const decisao of this._cpuDecisoesPendentes) {
        decisao.restante -= dt;
        if (decisao.restante <= 0) this._cpuMarcarSeTiver(decisao.resultado);
        else restantes.push(decisao);
      }
      this._cpuDecisoesPendentes = restantes;
    }
  }

  /** Liga ao abrir a Pausa OU a Ajuda — trava o relógio da rodada, as
   * decisões da CPU (ver `atualizar`) e qualquer Tween em andamento. */
  _abrirPausaProfunda() {
    this._pausadoProfundo = true;
    Tween.pausarTodos();
  }

  /** Desliga ao fechar — devolve o jogo exatamente de onde parou. */
  _fecharPausaProfunda() {
    this._pausadoProfundo = false;
    Tween.retomarTodos();
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
    // Botões maiores — legibilidade e alvo de toque em aparelhos móveis
    // (o motor reescala a cena inteira a ~0,5× num celular girado).
    const botaoPassarH = 72;
    const grupoEsqH = desafioH + GAP + controleBarraH + 12 + botaoPassarH;
    const grupoEsqY = vTopo + (vAltura - grupoEsqH) / 2;

    const desafio = { x: colEsqX, y: grupoEsqY, w: colEsqW, h: desafioH };
    const controleBarra = { x: colEsqX, y: desafio.y + desafio.h + GAP, w: colEsqW, h: controleBarraH };
    const botaoPassar = { x: colEsqX, y: controleBarra.y + controleBarra.h + 12, w: colEsqW, h: botaoPassarH };

    const colDirW = 260;
    const cpuH = 270;
    const chipH = 76; // maior, pelo mesmo motivo do botaoPassar acima
    const colDirX = 1280 - MARGEM - colDirW;
    const grupoDirH = cpuH + GAP + chipH;
    const grupoDirY = vTopo + (vAltura - grupoDirH) / 2;

    const cpu = { x: colDirX, y: grupoDirY, w: colDirW, h: cpuH };
    const cpuChip = { x: colDirX, y: cpu.y + cpu.h + GAP, w: colDirW, h: chipH };

    const faixaEsquerda = colEsqX + colEsqW + MARGEM;
    const faixaDireita = colDirX - MARGEM;
    const faixaLargura = faixaDireita - faixaEsquerda;
    const tamanhoJogador = Math.min(520, faixaLargura, vAltura);
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

    // Pinta o mesmo fundo numa área qualquer (`area`) — os gradientes ficam
    // ANCORADOS na área LÓGICA (0,0 a L,A), nunca na área pintada, pra a
    // barra do letterbox nunca aparecer como um retângulo à parte: é a
    // mesma pintura, só maior, terminando na mesma cor sólida das bordas.
    const pintarFundo = (ctx, area) => {
      const grad = ctx.createLinearGradient(0, 0, L * 0.3, A);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#1E1B4B');
      grad.addColorStop(1, '#0F172A');
      ctx.fillStyle = grad;
      ctx.fillRect(area.x, area.y, area.largura, area.altura);

      // Halo sutil no centro do JOGO, não da tela larga.
      const halo = ctx.createRadialGradient(L * 0.5, A * 0.4, 20, L * 0.5, A * 0.4, A * 0.6);
      halo.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      halo.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(area.x, area.y, area.largura, area.altura);
    };

    nodeFundo.desenhar = (ctx) => pintarFundo(ctx, { x: 0, y: 0, largura: L, altura: A });
    // Estende o mesmo cenário para dentro das barras do letterbox (monitor
    // mais largo que 16:9) — em vez de deixar duas tarjas lisas e sem graça
    // nas laterais. Ver `Stage.pintarSangria`/`Stage.renderizar` no motor.
    nodeFundo.pintarSangria = (ctx, area) => pintarFundo(ctx, area);

    this.adicionar(nodeFundo);
  }

  _construirHUD() {
    const { largura: L, config } = this;

    // Botão de Ajuda / Tutorial no HUD (RE-05)
    this.telaAjuda = new HelpScreen({ cena: this });
    this.adicionar(this.telaAjuda);

    // Sem `aoAjuda` nem `mostrarSom` aqui de propósito: o HUD por trás do véu
    // já tem os dois ícones sempre visíveis (pausa/ajuda no canto esquerdo,
    // som no direito) — repeti-los dentro do painel de pausa era redundante.
    this.telaPausa = new PauseScreen({
      audio: this.audio,
      config,
      somToque: config.audio?.clique,
      mostrarSom: false,
      aoReiniciar: () => this.irPara('jogando'),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.telaPausa);

    // RE-05: pedir ajuda (ou pausar) não pode consumir o tempo da rodada nem
    // deixar a CPU decidir por baixo do véu. `_pausadoProfundo` trava o
    // relógio da rodada e as decisões da CPU (ver `atualizar`), e
    // `Tween.pausarTodos/retomarTodos` cuida de qualquer outra animação em
    // curso (tremor de erro, brilho, flip de carta) — o mesmo par que o
    // Jogo das Cores já usa para o mesmo problema.
    //
    // Pausar ANTES de abrir, nunca depois: `abrir()` já dispara a própria
    // animação de entrada do painel (escala/alpha), e pausar DEPOIS pausaria
    // essa animação também — o painel "travaria" a meio caminho da entrada.
    // Retomar ao fechar não tem esse risco, por isso fica no evento.
    this.telaAjuda.on('fechou', () => this._fecharPausaProfunda());
    this.telaPausa.on('fechou', () => this._fecharPausaProfunda());

    // Botão Pausa (Canto Superior Esquerdo)
    this.adicionar(new IconButton({
      icone: 'pausa',
      x: espaco.lg,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => {
        this._abrirPausaProfunda();
        this.telaPausa.abrir();
      },
    }));

    // Botão Ajuda / Tutorial (Canto Superior Esquerdo ao lado da pausa)
    this.adicionar(new IconButton({
      icone: 'tutorial',
      x: espaco.lg + 72 + espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => {
        this._abrirPausaProfunda();
        this.telaAjuda.abrir();
      },
    }));

    // Botão Som (Canto Superior Direito)
    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      tamanho: 72,
      somToque: config.audio?.clique,
    }));

    // Banner só pra anunciar BINGO (vitória/derrota) — sem texto de
    // instrução no dia a dia; a marcação nas células já fala por si.
    const { player } = this._layout;
    this.bannerFeedback = new TextNode('', {
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
      ctx.font = `bold ${Math.round(a * 0.36)}px ${tipografia.familia}`;
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
        const padX = 12;
        const barW = l - padX * 2;
        const barH = 6;
        const barY = Math.round(a * 0.16);
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
        ctx.fillText('TOQUE PRA ESCONDER', l / 2, a * 0.62);
      } else if (this._turnoAtivo) {
        ctx.fillStyle = '#E2E8F0';
        ctx.font = `700 ${Math.max(12, Math.round(a * 0.3))}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ESPIAR CARTELA', l / 2, a / 2);
      }
      // Em repouso (passando pra próxima conta), o selo fica só com o
      // contorno vazio — sem "CPU · N acertos": esse texto não tinha função
      // nenhuma aqui (o selo só reage a toque com o turno ativo).
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

      // "VOCÊ" saiu da cartela do aluno — ela já é a grande, centralizada,
      // óbvia sem precisar de rótulo. "COMPUTADOR" continua na cartela dele
      // (menor, à direita, normalmente virada), onde o rótulo ainda ajuda a
      // identificar de quem é ao espiar.
      if (ci !== 0) {
        ctx.fillStyle = tema.primary;
        ctx.font = `bold ${Math.round(Math.min(18, cardW * 0.05))}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.fillText(tema.nome, cardW / 2, Math.max(24, nomeSpace * 0.62));
      }

      // Brilho pulsante na cartela inteira do vencedor — dourado pro
      // aluno (festa), ardósia pra CPU (sem tom de comemoração nem de
      // punição), mas com a MESMA força/visibilidade nos dois casos.
      if (this._cartelaVencedoraIndex === ci && this._brilhoVitoria > 0) {
        const corBrilho = ci === 0 ? '250, 204, 21' : '148, 163, 184';
        const pulso = (0.6 + 0.4 * Math.sin(Date.now() / 120)) * this._brilhoVitoria;
        ctx.save();
        ctx.shadowColor = `rgba(${corBrilho}, 0.9)`;
        ctx.shadowBlur = 34 * pulso;
        ctx.strokeStyle = `rgba(${corBrilho}, ${0.85 * pulso})`;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.roundRect(-4, -4, cardW + 8, cardH + 8, 22);
        ctx.stroke();
        ctx.restore();
      }

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

          const corLinha = ci === 0 ? '#FACC15' : '#94A3B8';
          ctx.save();
          ctx.strokeStyle = corLinha;
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.shadowColor = ci === 0 ? 'rgba(250, 204, 21, 0.9)' : 'rgba(148, 163, 184, 0.7)';
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
          // Som de acerto/erro é decidido em `_aoTocarCelula` (mutuamente
          // exclusivos), não aqui — só a cartela do ALUNO chega lá de
          // verdade (a da CPU não é tocável, `_aoTocarCelula` sai cedo).
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

      if (this._turnoRodando) {
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

    // Tempo que o aluno tem para pensar e marcar (configurável por nível) —
    // relógio próprio a quadro (ver `atualizar`), não Tween nem setTimeout:
    // os dois correm em tempo real, por fora da Pausa/Ajuda.
    const tempoParaPensarSeg = (this.nivel.tempoPensarMs || 60000) / 1000;
    this._turnoTempoTotal = tempoParaPensarSeg;
    this._turnoTempoRestante = tempoParaPensarSeg;
    this._barraTempoProgresso = 1;
    this._turnoRodando = true;

    // Botão aparece imediatamente — aluno decide primeiro
    this.botaoPassar.visible = true;

    // Sem dica de quem tem o número, e sem texto de instrução — o aluno
    // resolve a conta e confere na própria cartela; a marcação (âmbar se
    // errar, cor do tema se acertar) já fala por si.
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

    this._turnoRodando = false;
    Tween.removerDe(this);
    this._barraTempoProgresso = 1;

    // A rodada está terminando — SÓ AGORA uma marca errada vira erro
    // contado de verdade. Se o aluno corrigiu antes (acertou ou desfez),
    // this._celulaErradaAtual já está null e nada é contado.
    if (this._celulaErradaAtual) {
      this._errosJogador++;
      this._celulaErradaAtual.desmarcarErrado();
      this._celulaErradaAtual = null;
    }

    // Esconder botão — e virar a cartela de volta na hora, caso o aluno
    // tivesse espiado (o "próxima" sempre vira a cartela e cancela a
    // espiada, mesmo se ainda estava contando).
    this.botaoPassar.visible = false;
    this._virarCpu();

    // Agenda a decisão da CPU à parte — captura o resultado DESTA rodada
    // agora, porque this._resultadoAtual já vai ter mudado quando a decisão
    // disparar (a próxima pergunta já estará em andamento). Em segundos, e
    // decrementada a quadro em `atualizar` — junto do relógio da rodada,
    // então também congela na Pausa/Ajuda.
    if (this._existeNaCpu) {
      const resultadoDaRodada = this._resultadoAtual;
      const tempoReacaoCpuMs = this._cpuTempoMin + Math.random() * (this._cpuTempoMax - this._cpuTempoMin);
      this._cpuDecisoesPendentes.push({ restante: tempoReacaoCpuMs / 1000, resultado: resultadoDaRodada });
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

    // Sem som aqui de propósito: o efeito de acerto é feedback PRO ALUNO
    // sobre a própria jogada, não uma narração do que a CPU faz fora de
    // vista — ela já decide "fora de vista" (ver comentário mais abaixo).

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

    // Para o relógio da rodada e cancela Tweens (a decisão da CPU tem sua
    // própria contagem independente agora — não é cancelada aqui, ver
    // _reagirCpuEAvancar)
    this._turnoRodando = false;
    Tween.removerDe(this);
    this._barraTempoProgresso = 1;

    // Resetar flags de marcação
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    // Esconder botão
    this.botaoPassar.visible = false;

    // Avançar para próxima conta — pausa curta só de transição.
    this._aguardandoProximaConta = true;
    Tween.de(this)
      .esperar(500)
      .chamar(() => {
        this._aguardandoProximaConta = false;
        this._mostrarProximaConta();
      });
  }

  /**
   * Pular conta quando o resultado não existe em nenhuma cartela.
   */
  _pularContaSemResultado() {
    this._turnoRodando = false;
    this._barraTempoProgresso = 1;
    this.botaoPassar.visible = false;
    this._jogadorMarcouNesteTurno = false;
    this._cpuMarcouNesteTurno = false;

    this._aguardandoProximaConta = true;
    Tween.de(this)
      .esperar(800)
      .chamar(() => {
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

  /**
   * Toque na cartela do aluno. Errar não é definitivo: fica marcado em
   * âmbar (provisório) até ele corrigir — tocando de novo nela pra desfazer,
   * ou acertando. Só vira erro CONTADO se ainda estiver errado quando a
   * rodada terminar (ver _reagirCpuEAvancar) — nunca por um toque isolado.
   */
  _aoTocarCelula(celula) {
    if (this._fimResolvido || !this.desafioAtual) return;

    // Permitir toque apenas na cartela do jogador (índice 0)
    if (celula.cartelaIndex !== 0) return;

    if (celula.marcado) return;

    // Se não há turno ativo, ignorar
    if (!this._turnoAtivo) return;

    const resultadoEsperado = this.desafioAtual.numero;

    if (celula.numero === resultadoEsperado) {
      // JOGADOR ACERTOU! Qualquer tentativa errada anterior é perdoada.
      if (this._celulaErradaAtual) {
        this._celulaErradaAtual.desmarcarErrado();
        this._celulaErradaAtual = null;
      }

      celula.marcarComAnimacao();
      this._acertosJogador++;
      this._jogadorMarcouNesteTurno = true;

      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);

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
    } else if (celula === this._celulaErradaAtual) {
      // Tocou de novo na MESMA célula errada — desfaz (volta atrás).
      celula.desmarcarErrado();
      this._celulaErradaAtual = null;
    } else {
      // Tentativa errada (provisória) — marca em âmbar, some a anterior se houver.
      if (this._celulaErradaAtual) this._celulaErradaAtual.desmarcarErrado();
      celula.marcarErrado();
      this._celulaErradaAtual = celula;

      if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
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

  /**
   * Abre o selo grande de fim de jogo — na frente de tudo (cartelas,
   * brilho, confete), pra quem não estivesse olhando o texto pequeno do
   * banner não deixar de perceber quem venceu.
   */
  _abrirOverlayFim(titulo, subtitulo, cor) {
    const o = this._overlayFim;
    o.ativo = true;
    o.titulo = titulo;
    o.subtitulo = subtitulo;
    o.cor = cor;
    o.escala = 0;
    Tween.removerDe(o);
    Tween.de({})
      .esperar(150)
      .chamar(() => Tween.para(o, { escala: 1 }, 400, Easing.costasSaida));
  }

  /**
   * Congela e borra o quadro atual do jogo, pra servir de fundo atrás da
   * cartela ampliada da vitória da CPU. Feito UMA VEZ (não a cada quadro):
   * neste ponto o jogo já parou (fim de partida), então o fundo não muda mais
   * — recalcular o blur a cada frame seria custo à toa.
   *
   * O truque: copiar o canvas atual pra fora, e desenhar essa cópia DE VOLTA
   * com `ctx.filter = 'blur(...)'` ligado — o filtro do canvas 2D borra
   * qualquer coisa que ele desenhe, inclusive uma imagem já pronta.
   */
  _capturarFundoBorradoCpu() {
    const canvasReal = this.stage?.canvas;
    if (!canvasReal) return;
    const L = this.largura;
    const A = this.altura;

    const bruto = document.createElement('canvas');
    bruto.width = L;
    bruto.height = A;
    bruto.getContext('2d').drawImage(canvasReal, 0, 0, L, A);

    const borrado = document.createElement('canvas');
    borrado.width = L;
    borrado.height = A;
    const ctxBorrado = borrado.getContext('2d');
    ctxBorrado.filter = 'blur(9px)';
    ctxBorrado.drawImage(bruto, 0, 0);
    ctxBorrado.filter = 'none';
    // Escurece por cima do blur — o mesmo véu escuro do resto do motor
    // (PauseScreen/HelpScreen), pra cartela ampliada se destacar de verdade.
    ctxBorrado.fillStyle = 'rgba(10, 14, 26, 0.55)';
    ctxBorrado.fillRect(0, 0, L, A);

    this._fundoBlurCpuImg = borrado;
  }

  /**
   * Mostra a cartela do CPU ampliada e centralizada, com o resto da tela
   * borrado atrás — chamado depois que a linha de BINGO termina de se
   * desenhar na cartela pequena (ver `_comemorarBingoCpu`), então a cartela
   * grande já nasce mostrando a linha completa, sem repetir a animação.
   */
  _mostrarDestaqueCpu(linha) {
    this._capturarFundoBorradoCpu();
    this._mostrarBlurCpu = true;

    const d = this._destaqueCpu;
    d.numeros = this.cartelasNumeros[1];
    d.marcados = this.todasCelulasPorCartela[1].map((c) => c.marcado);
    d.linha = linha;
    d.escala = 0;
    d.ativo = true;

    Tween.removerDe(d);
    Tween.para(d, { escala: 1 }, 450, Easing.costasSaida);
  }

  /** Desenha a cartela ampliada + título, chamado pelo `desenhar` do nó dedicado. */
  _desenharDestaqueCpu(ctx) {
    const d = this._destaqueCpu;
    if (!d.ativo || d.escala <= 0.01 || !d.numeros) return;

    const cardW = 440;
    const cardH = 440;
    const nomeSpace = 44;
    const padding = 18;
    const gapCell = 10;
    const cellSize = (cardW - padding * 2 - gapCell * 3 - nomeSpace) / 4;
    const cardX = (this.largura - cardW) / 2;
    // Centraliza o CONJUNTO inteiro (título + cartela + legenda) na tela, não
    // só a cartela sozinha — um `cardY` fixo deixava tudo puxado pra baixo,
    // porque o título ocupa espaço ACIMA e a legenda ABAIXO da cartela.
    const espacoTitulo = 70;
    const espacoLegenda = 51;
    const alturaConjunto = espacoTitulo + cardH + espacoLegenda;
    const cardY = (this.altura - alturaConjunto) / 2 + espacoTitulo;
    const tema = TEMA_CPU;

    ctx.save();
    ctx.translate(cardX + cardW / 2, cardY + cardH / 2);
    ctx.scale(d.escala, d.escala);
    ctx.translate(-cardW / 2, -cardH / 2);

    // Brilho pulsante ao redor da cartela — igual ao da cartela pequena.
    const pulso = 0.6 + 0.4 * Math.sin(Date.now() / 120);
    ctx.shadowColor = 'rgba(148, 163, 184, 0.9)';
    ctx.shadowBlur = 40 * pulso;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = `rgba(148, 163, 184, ${0.85 * pulso})`;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(-4, -4, cardW + 8, cardH + 8, 22);
    ctx.stroke();

    ctx.fillStyle = tema.primary;
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, 12, [20, 20, 0, 0]);
    ctx.fill();

    ctx.fillStyle = tema.primary;
    ctx.font = `bold 22px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tema.nome, cardW / 2, nomeSpace / 2 + 6);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const cx = padding + c * (cellSize + gapCell);
        const cy = nomeSpace + padding + r * (cellSize + gapCell);
        const marcado = d.marcados[idx];

        ctx.fillStyle = marcado ? tema.light : '#FFFFFF';
        ctx.strokeStyle = marcado ? tema.primary : '#E2E8F0';
        ctx.lineWidth = marcado ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(cx, cy, cellSize, cellSize, 12);
        ctx.fill();
        ctx.stroke();

        if (marcado) {
          ctx.fillStyle = tema.chip;
          ctx.strokeStyle = tema.primary;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx + cellSize / 2, cy + cellSize / 2, cellSize / 2 - 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = marcado ? tema.primary : '#1E293B';
        ctx.font = `${tipografia.pesoForte} ${Math.round(cellSize * 0.4)}px ${tipografia.familia}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.numeros[idx], cx + cellSize / 2, cy + cellSize / 2 + 1);
      }
    }

    // Linha dourada... ardósia: destaca a linha vencedora, já completa.
    if (d.linha) {
      const [p1, , , p4] = d.linha;
      const col1 = p1 % 4;
      const row1 = Math.floor(p1 / 4);
      const col4 = p4 % 4;
      const row4 = Math.floor(p4 / 4);
      const x1 = padding + col1 * (cellSize + gapCell) + cellSize / 2;
      const y1 = nomeSpace + padding + row1 * (cellSize + gapCell) + cellSize / 2;
      const x2 = padding + col4 * (cellSize + gapCell) + cellSize / 2;
      const y2 = nomeSpace + padding + row4 * (cellSize + gapCell) + cellSize / 2;

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(148, 163, 184, 0.9)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowColor = 'transparent';
    }

    ctx.restore();

    // Título — logo acima da cartela, não solto no meio da tela. Branco (não
    // ardósia): o texto fica sobre o fundo escuro borrado, e o cinza médio
    // usado antes tinha contraste baixo demais pra criança ler — o brilho ao
    // redor é que carrega o tom neutro da CPU, não o texto.
    ctx.save();
    ctx.globalAlpha = Math.min(1, d.escala * 1.3);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 40px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(148, 163, 184, 0.6)';
    ctx.shadowBlur = 16;
    ctx.fillText('O COMPUTADOR VENCEU', this.largura / 2, cardY - 50);
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#F1F5F9';
    ctx.font = `600 22px ${tipografia.familia}`;
    ctx.fillText('CONTINUE TENTANDO!', this.largura / 2, cardY + cardH + 40);
    ctx.restore();
  }

  /**
   * Toca o som de fim de partida (vitória/derrota) UMA SÓ VEZ, no instante do
   * BINGO — e deixa que ele continue tocando por cima da transição para a
   * tela de resultado, em vez de cortar e a ResultScreen tocar de novo por
   * cima (o som "se repetia": uma vez aqui, outra vez lá).
   *
   * Por isso usa o canal `music`, não `sfx`: `Game.irPara` corta `sfx` e
   * `speech` em toda troca de cena (`AudioBus.encerrarDaTela`), mas a música
   * atravessa de propósito — é assim que o som sobrevive até a tela seguinte.
   * `config.audio.vitoria/derrota` ficam `null` por causa disso: se
   * estivessem preenchidos, a ResultScreen tocaria o mesmo som outra vez ao
   * entrar.
   *
   * E porque nada corta o canal `music` sozinho, este método também arma um
   * ouvinte no `Game` (persiste além desta cena) que para o som assim que o
   * aluno sair da tela de resultado — pro som não seguir tocando no menu.
   *
   * O canal `music` tem volume padrão bem mais baixo que o `sfx` (0.25 contra
   * 0.8 — ver `AudioBus.volumes`): sem compensar, o efeito tocaria uns 3x mais
   * baixo do que antes, e SOAVA ERRADO. `volume` aqui multiplica o ganho DESTE
   * som por cima do ganho do canal, então a proporção sfx/music restaura o
   * volume original mesmo tocando pelo canal `music`.
   */
  _tocarSomFimEPersistirAteResultado(id) {
    const volumesCanal = this.audio.volumes ?? {};
    const compensacao = (volumesCanal.sfx ?? 0.8) / (volumesCanal.music ?? 0.25);
    this.audio.tocar(id, { canal: 'music', volume: compensacao }).then((handle) => {
      if (!handle) return;
      const desligar = this.game.on('cena', (nome) => {
        if (nome === 'resultado') return; // ainda na tela de resultado, deixa tocar
        handle.parar();
        desligar();
      });
    });
  }

  _comemorarBingoJogador(linha) {
    // `_fimResolvido` só liga uns 5s depois (dentro de `_terminar`), então
    // sem esta trava um segundo toque certo do aluno (ou uma segunda checagem
    // da CPU) nessa janela repetia a comemoração inteira — som, brilho e
    // destaque de novo, com um "atraso" que era na verdade a SEGUNDA vez
    // começando por cima da primeira ainda tocando.
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    this._turnoAtivo = false;

    this._revelarCpu();
    this._cartelaVencedoraIndex = 0;
    this._linhaVencedoraAtiva = linha;

    this.bannerFeedback.texto = '🎉 BINGO! VOCÊ VENCEU! 🎉';
    this.bannerFeedback.cor = '#FACC15';
    this._abrirOverlayFim('🎉 VOCÊ VENCEU! 🎉', '', '#FACC15');

    this._tocarSomFimEPersistirAteResultado('acertoSOS');

    // Brilho pulsante na cartela (ver cardNode.desenhar) + confete saindo
    // dos 4 cantos da linha vencedora, em pequenas explosões escalonadas.
    Tween.para(this, { _brilhoVitoria: 1 }, 200, Easing.suaveSaida);

    const celulasDaCartela = this.todasCelulasPorCartela[0];
    const pontosLinha = linha.map((idx) => celulasDaCartela[idx]).filter(Boolean);
    pontosLinha.forEach((celula, i) => {
      const cx = celula.x + celula.largura / 2;
      const cy = celula.y + celula.altura / 2;
      Tween.de({})
        .esperar(i * 120)
        .chamar(() => {
          this.particulas.disparar({
            x: cx,
            y: cy,
            cor: ['#FACC15', '#FDE047', '#4ADE80', '#38BDF8'][i % 4],
            quantidade: 16,
            tamanhoMin: 8,
            tamanhoMax: 16,
            velocidade: 180,
            duracao: 0.8,
          });
        });
    });

    // Anima o raio de vitória
    Tween.de(this)
      .entao({ _progressoLinha: 1 }, 600, Easing.suaveSaida)
      .esperar(1500)
      .chamar(() => this._terminar(true));
  }

  _comemorarBingoCpu(linha) {
    // Mesma trava contra reentrada de `_comemorarBingoJogador` — aqui é ainda
    // mais fácil de disparar duas vezes: a CPU tem VÁRIAS decisões pendentes
    // em paralelo (`_cpuDecisoesPendentes`), e cada uma checa BINGO por conta
    // própria em `_cpuMarcarSeTiver`.
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    this._turnoAtivo = false;

    this._revelarCpu();
    this._cartelaVencedoraIndex = 1;
    this._linhaVencedoraAtiva = linha;

    this.bannerFeedback.texto = '😵 O COMPUTADOR FEZ BINGO! VOCÊ PERDEU!';
    this.bannerFeedback.cor = '#EF4444';

    this._tocarSomFimEPersistirAteResultado('erroSOS');

    // Mesmo brilho pulsante do aluno, mas em ardósia (ver cardNode.desenhar)
    // — bem visível, sem tom de festa nem de punição. Sem confete: a
    // comemoração fica reservada pra vitória de verdade do aluno.
    Tween.para(this, { _brilhoVitoria: 1 }, 200, Easing.suaveSaida);

    // A vitória da CPU pode surgir do nada, no meio de outra pergunta, sem
    // nenhum aquecimento — por isso fica mais tempo na tela antes de ir pro
    // resultado: a criança precisa de uma folga real pra perceber o que
    // aconteceu E LER "O COMPUTADOR VENCEU", não só um instante. A linha
    // termina de se desenhar na cartela pequena, e só ENTÃO a cartela
    // ampliada e borrada assume — ela já nasce mostrando a linha completa.
    Tween.de(this)
      .entao({ _progressoLinha: 1 }, 900, Easing.suaveSaida)
      .chamar(() => this._mostrarDestaqueCpu(linha))
      .esperar(4200)
      .chamar(() => this._terminar(false));
  }

  _terminar(venceu) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;

    // Para o relógio de turno e qualquer decisão de CPU ainda pendente
    this._turnoRodando = false;
    this._cpuDecisoesPendentes = [];
    this._turnoAtivo = false;

    // Se o jogo acabou (bingo) com uma marca errada ainda pendente, conta —
    // mesma regra de qualquer outra transição de rodada.
    if (this._celulaErradaAtual) {
      this._errosJogador++;
      this._celulaErradaAtual = null;
    }

    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: {
        // Revertido: "X PONTOS" e o `acertos` do AVA são o MESMO campo — a
        // ResultScreen (motor, cópia gerada) lê `resultado.acertos` pras duas
        // coisas, e o AvaBridge manda esse valor cru pro AVA. Não dá pra tela
        // dizer 80 e o relatório dizer 8 sem editar esse arquivo compartilhado
        // (usado por todos os jogos). Valor real: honesto na tela E no AVA.
        acertos: this._acertosJogador,
        erros: this._errosJogador, // erros REAIS do aluno (marca errada não corrigida)
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
