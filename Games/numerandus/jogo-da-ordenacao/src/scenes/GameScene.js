import {
  Scene, Node, ScoreSystem, GridBoard, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores, espaco, raio, sombras, TextNode, Icone, tipografia,
} from '../../engine/index.js';

/** Grade do tabuleiro: 3 colunas × 4 linhas, igual ao vídeo de referência. */
const COLUNAS = 3;
const LINHAS = 4;

/**
 * 12 cores fixas, uma por CÉLULA — a cor pertence à CASA, nunca ao número
 * (igual ao vídeo/protótipo de referência). Todas já existem em
 * `engine/theme/tokens.js` (`cores.ludica` + os pares `*Claro`); nenhuma cor
 * nova foi criada para o tabuleiro.
 */
const CORES_CELULA = [
  cores.ludica.vermelho, cores.ludica.laranja, cores.ludica.amarelo,
  cores.ludica.verde, cores.ludica.turquesa, cores.ludica.azul,
  cores.ludica.roxo, cores.ludica.rosa, cores.ludica.marrom,
  cores.primariaClara, cores.acertoClaro, cores.atencaoClaro,
];

/**
 * Ficha — o círculo branco com o número, arrastável.
 *
 * `regX`/`regY` no centro: `x`/`y` deste nó SÃO o centro do círculo (não o
 * canto), o que casa direto com o centro de célula que `GameScene` calcula —
 * sem a conversão canto↔centro que outros componentes do motor fazem (ver
 * `Button`/`NivelCard`), porque aqui quem posiciona é a própria cena, não um
 * chamador externo passando canto.
 */
class Ficha extends Node {
  constructor(valor, diametro) {
    super({ largura: diametro, altura: diametro, interativo: true });
    this.valor = valor;
    this.regX = diametro / 2;
    this.regY = diametro / 2;
    this.arrastando = false;
  }

  desenhar(ctx) {
    const r = this.largura / 2;
    ctx.save();

    ctx.shadowColor = this.arrastando ? 'rgba(17,24,39,0.4)' : sombras.suave.cor;
    ctx.shadowBlur = this.arrastando ? 18 : sombras.suave.desfoque;
    ctx.shadowOffsetY = this.arrastando ? 8 : sombras.suave.y;
    ctx.fillStyle = cores.superficie;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Brilho biselado superior — o mesmo vocabulário do Button/IconButton.
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(r, r * 0.7, r * 0.62, Math.PI * 1.1, Math.PI * 1.9);
    ctx.fill();

    ctx.fillStyle = cores.tinta;
    ctx.font = `800 ${Math.round(r * 1.05)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.valor), r, r + r * 0.04);

    ctx.restore();
  }

  contemPontoLocal(x, y) {
    const r = this.largura / 2;
    const dx = x - r;
    const dy = y - r;
    return dx * dx + dy * dy <= r * r;
  }
}

/**
 * Tabuleiro — o cartão branco com as 12 células coloridas por baixo das
 * fichas. Não é interativo: é só o desenho de fundo, em coordenadas LOCAIS
 * (0,0 no canto superior esquerdo do cartão) — as fichas são filhas deste nó
 * e usam o mesmo sistema de coordenadas, o que faz `localParaGlobal`/
 * `globalParaLocal` (herdados de `Node`) converterem os dois lados de graça.
 */
class Tabuleiro extends Node {
  constructor(opcoes) {
    super(opcoes);
    this.pad = opcoes.pad;
    this.celLargura = opcoes.celLargura;
    this.celAltura = opcoes.celAltura;
    /** Célula-alvo durante um arrasto (`{lin,col}` ou `null`) — anel branco. */
    this.alvo = null;
    /** Tabuleiro inteiro resolvido: moldura dourada estável (não pisca). */
    this.completo = false;
  }

  centroDaCelula(lin, col) {
    return {
      x: this.pad + col * this.celLargura + this.celLargura / 2,
      y: this.pad + lin * this.celAltura + this.celAltura / 2,
    };
  }

  desenhar(ctx) {
    const larguraTotal = this.celLargura * COLUNAS + this.pad * 2;
    const alturaTotal = this.celAltura * LINHAS + this.pad * 2;

    ctx.save();
    ctx.shadowColor = sombras.cartao.cor;
    ctx.shadowBlur = this.completo ? 34 : sombras.cartao.desfoque;
    ctx.shadowOffsetY = sombras.cartao.y;
    if (this.completo) ctx.shadowColor = 'rgba(255,196,0,0.55)';
    ctx.fillStyle = cores.superficie;
    ctx.beginPath();
    ctx.roundRect(0, 0, larguraTotal, alturaTotal, raio.lg);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    if (this.completo) {
      ctx.strokeStyle = '#FFD758';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(2.5, 2.5, larguraTotal - 5, alturaTotal - 5, raio.lg);
      ctx.stroke();
    }

    // Raio só nos 4 cantos do TABULEIRO inteiro — as células ficam encostadas
    // umas nas outras, sem "rua" entre elas, igual à referência (foto + vídeo).
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(this.pad, this.pad, larguraTotal - this.pad * 2, alturaTotal - this.pad * 2, 10);
    ctx.clip();
    for (let lin = 0; lin < LINHAS; lin++) {
      for (let col = 0; col < COLUNAS; col++) {
        const i = lin * COLUNAS + col;
        ctx.fillStyle = CORES_CELULA[i];
        ctx.fillRect(
          this.pad + col * this.celLargura,
          this.pad + lin * this.celAltura,
          this.celLargura,
          this.celAltura,
        );
      }
    }
    ctx.restore();

    // Anel branco na célula-alvo durante um arrasto — o único sinal de "solte
    // aqui", sem depender de nenhuma cor específica (funciona igual em cima
    // de qualquer uma das 12 células).
    if (this.alvo) {
      const { x, y } = this.centroDaCelula(this.alvo.lin, this.alvo.col);
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(x - this.celLargura / 2 + 4, y - this.celAltura / 2 + 4, this.celLargura - 8, this.celAltura - 8, 8);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * GameScene — a partida do Jogo da Ordenação.
 *
 * Regra de movimento: uma ficha só anda para uma célula VIZINHA (lado, cima
 * ou baixo — nunca diagonal) que esteja VAZIA. É o mesmo 15-puzzle clássico
 * do vídeo de referência, não um "solte onde quiser" — ver `_tentarMover`.
 *
 * O tabuleiro NUNCA nasce impossível de resolver: em vez de embaralhar livre
 * (que pode gerar um arranjo sem solução sob essa regra), `embaralharValido`
 * parte do resolvido e anda PRA TRÁS com movimentos legais — ver o método.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({
      total: this.nivel.meta ?? 10,
      nivel: this.nivel.id ?? 1,
      // Sem vidas: este jogo nunca tem derrota (ver `config.registrarDerrota`).
    });

    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'quarto' }));

    // -------------------------------------------------------------- tabuleiro
    // O tabuleiro é a ÁREA DE MAIOR DESTAQUE da tela: ocupa quase toda a
    // altura útil abaixo do HUD. Células levemente retangulares (não um
    // quadrado perfeito) de propósito — a grade 3×4 é bem mais alta que larga,
    // e o quadro do jogo é bem mais largo que alto; um pouco de retângulo
    // cobre bem mais da largura disponível sem descaracterizar a grade.
    const topo = 78;
    const alturaDisponivel = A - topo - 30;
    const pad = 22;
    const celAltura = (alturaDisponivel - pad * 2) / LINHAS;
    const celLargura = celAltura * 1.05;
    const larguraTotal = celLargura * COLUNAS + pad * 2;

    this.tabuleiro = new Tabuleiro({
      x: (L - larguraTotal) / 2,
      y: topo,
      pad,
      celLargura,
      celAltura,
    });
    this.adicionar(this.tabuleiro);

    // ----------------------------------------------------------- dados/grade
    // `GridBoard` (reaproveitado do motor, não reinventado): cada peça é
    // `{ valor }`, e a própria grade mantém `peca.lin`/`peca.col` atualizados
    // a cada `trocar()` — é isso que faz `_pecasCorretas` e `_indiceAlvo`
    // (abaixo) não precisarem de nenhuma cópia própria de posição.
    this.grade = new GridBoard({ linhas: LINHAS, colunas: COLUNAS, tipoDe: (p) => p?.valor });
    this.fichaDoValor = new Map();
    for (let v = 0; v <= 9; v++) {
      const indice = this._indiceAlvo(v);
      this.grade.definir(Math.floor(indice / COLUNAS), indice % COLUNAS, { valor: v });

      const ficha = new Ficha(v, Math.min(celLargura, celAltura) * 0.82);
      this.fichaDoValor.set(v, ficha);
      this.tabuleiro.adicionar(ficha);
      this._ligarArraste(ficha);
    }
    this._embaralharNivel(this.nivel.passosEmbaralho ?? 40);
    this._reposicionarTodas(false);

    // Arrastar é tratado uma vez só, no nível da CENA — não um par de ouvintes
    // globais por ficha. Cada `Ficha` só precisa dizer QUANDO o dedo pousou
    // nela ('apertar', que o `Input` já roteia por nó); mover/soltar/cancelar
    // são sempre os MESMOS três ouvintes, olhando `this._arrastando` para
    // saber qual ficha (se alguma) está em jogo no momento.
    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', (ponto) => this._soltarArrasto(ponto)));
    this.aoDesmontar(this.input.on('cancelar', (ponto) => this._soltarArrasto(ponto)));

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

    /**
     * Cronômetro AO VIVO — só informa, nunca cobra. Lê `this.game.tempoJogando`
     * (o motor já para essa contagem sozinho durante Pausa/Ajuda, ver
     * `Game._tempoJogando`), então este relógio congela junto, de graça — não
     * é lógica própria do jogo, é o mesmo número que vira `tempoSegundos` no
     * fim da partida, só mostrado enquanto ela ainda roda.
     *
     * Sem cor de alerta, sem piscar, sem mudar de aparência perto do fim:
     * é a mesma regra de "brilho estável, nunca oscilação" de todo o motor —
     * um cronômetro que muda de cor perto de um limite IMPLICARIA um limite,
     * e este jogo não tem um.
     *
     * Escrito na parede, como os números flutuantes e o contador do tutorial
     * — não um painel branco novo competindo com o tabuleiro.
     */
    // Tamanho maior que o resto do texto de apoio (`tipografia.corpo`, não
    // `apoio`): num celular a tela inteira encolhe, e "0:00" pequeno pertinho
    // do topo é o primeiro texto a ficar ilegível — o alvo aqui é continuar
    // lendo de longe, não só numa tela de 1280x720.
    const yRelogio = espaco.md + 36;
    this.adicionar(new Icone('relogio', {
      x: L / 2 - 50,
      y: yRelogio - 18,
      tamanho: 36,
      cor: cores.superficie,
    }));
    this._textoRelogio = new TextNode('0:00', {
      x: L / 2 - 8,
      y: yRelogio,
      tamanho: tipografia.corpo,
      peso: '700',
      cor: cores.superficie,
      alinhamento: 'left',
      linhaBase: 'middle',
    });
    this.adicionar(this._textoRelogio);
    this._relogioSegundoMostrado = -1;

    // ---------------------------------------------------------------- pausa
    // `mostrarSom: false`: o som já está sempre visível no HUD atrás do véu
    // (acima), repeti-lo dentro do painel seria redundante — mesmo padrão do
    // Bingo (ver `bingo-da-adicao-e-subtracao/CHECKLIST.md`, seção 2).
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
  }

  /**
   * Posição-ALVO (0..9, ordem de leitura esquerda→direita, cima→baixo) de um
   * valor — crescente: o valor É o índice; decrescente: espelhado. As duas
   * últimas casas (9 e 10 em ordem de leitura) nunca têm alvo: são sempre as
   * vagas livres, em qualquer nível.
   */
  _indiceAlvo(valor) {
    return this.nivel.direcao === 'decrescente' ? (9 - valor) : valor;
  }

  /** Quantas das 10 fichas estão na própria posição-alvo agora. */
  _pecasCorretas() {
    let n = 0;
    for (const peca of this.grade.todas()) {
      if (peca.lin * COLUNAS + peca.col === this._indiceAlvo(peca.valor)) n++;
    }
    return n;
  }

  /**
   * Embaralha ANDANDO PRA TRÁS a partir do resolvido: cada passo pega uma
   * casa vazia ao acaso e puxa pra ela um vizinho ocupado ao acaso — ou seja,
   * cada passo é o mesmo movimento válido que o aluno pode fazer, só que ao
   * contrário. É a única forma segura de embaralhar um 15-puzzle: um
   * embaralhar "livre" pode gerar um arranjo IMPOSSÍVEL de resolver com a
   * regra "só pra vizinha vazia" — o aluno ficaria travado pra sempre, o
   * oposto do que a regra de ambiente não-punitivo pede.
   */
  _embaralharNivel(passos) {
    for (let p = 0; p < passos; p++) {
      const vazias = [];
      for (let lin = 0; lin < LINHAS; lin++) {
        for (let col = 0; col < COLUNAS; col++) {
          if (!this.grade.obter(lin, col)) vazias.push({ lin, col });
        }
      }
      const vazia = rand.item(vazias);
      const vizinhas = [];
      for (const [dl, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const lv = vazia.lin + dl;
        const cv = vazia.col + dc;
        if (this.grade.dentro(lv, cv) && this.grade.obter(lv, cv)) vizinhas.push({ lin: lv, col: cv });
      }
      if (vizinhas.length === 0) continue;
      const origem = rand.item(vizinhas);
      this.grade.trocar(vazia.lin, vazia.col, origem.lin, origem.col);
    }
    // Raríssimo, mas possível: a sequência de passos aleatórios volta exatamente
    // ao resolvido. Uma segunda passada praticamente nunca repete o acaso.
    if (passos > 0 && this._pecasCorretas() === 10) this._embaralharNivel(passos);
  }

  _reposicionarTodas(animar) {
    for (const [valor, ficha] of this.fichaDoValor) {
      const peca = this._pecaDoValor(valor);
      const { x, y } = this.tabuleiro.centroDaCelula(peca.lin, peca.col);
      if (animar) {
        Tween.removerDe(ficha);
        Tween.para(ficha, { x, y }, 220, Easing.suaveSaida);
      } else {
        ficha.x = x;
        ficha.y = y;
      }
    }
  }

  _pecaDoValor(valor) {
    for (const peca of this.grade.todas()) if (peca.valor === valor) return peca;
    return null;
  }

  _celulaMaisProxima(localX, localY) {
    let melhor = null;
    let menor = Infinity;
    for (let lin = 0; lin < LINHAS; lin++) {
      for (let col = 0; col < COLUNAS; col++) {
        const { x, y } = this.tabuleiro.centroDaCelula(lin, col);
        const d = (localX - x) ** 2 + (localY - y) ** 2;
        if (d < menor) { menor = d; melhor = { lin, col }; }
      }
    }
    return melhor;
  }

  _ligarArraste(ficha) {
    ficha.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando) return;
      const local = this.tabuleiro.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = ficha.x - local.x;
      this._deslocY = ficha.y - local.y;
      ficha.arrastando = true;
      ficha.paraFrente();
      Tween.removerDe(ficha);
      Tween.para(ficha, { scaleX: 1.08, scaleY: 1.08 }, 100, Easing.suaveSaida);
      this._arrastando = ficha;
    });
  }

  _moverArrasto(ponto) {
    const ficha = this._arrastando;
    if (!ficha) return;
    const local = this.tabuleiro.globalParaLocal(ponto.x, ponto.y);
    ficha.x = local.x + this._deslocX;
    ficha.y = local.y + this._deslocY;
    this.tabuleiro.alvo = this._celulaMaisProxima(ficha.x, ficha.y);
  }

  _soltarArrasto(ponto) {
    const ficha = this._arrastando;
    if (!ficha) return;
    this._arrastando = null;
    ficha.arrastando = false;
    this.tabuleiro.alvo = null;
    Tween.removerDe(ficha);
    Tween.para(ficha, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    const local = this.tabuleiro.globalParaLocal(ponto.x, ponto.y);
    const destino = this._celulaMaisProxima(local.x, local.y);
    this._tentarMover(ficha.valor, destino);
  }

  /**
   * Tenta mover `valor` para `destino`. Move de verdade só se `destino` for
   * VIZINHA da célula atual da ficha (lado, cima ou baixo) E estiver vazia —
   * nunca "solte onde quiser". Fora disso, a ficha só volta pro lugar, sem
   * pontuar nada: não é um erro, é um gesto que não completou uma jogada.
   */
  _tentarMover(valor, destino) {
    const peca = this._pecaDoValor(valor);
    const origemLin = peca.lin;
    const origemCol = peca.col;
    const diferente = destino.lin !== origemLin || destino.col !== origemCol;
    const vazia = !this.grade.obter(destino.lin, destino.col);
    const vizinha = Math.abs(destino.lin - origemLin) + Math.abs(destino.col - origemCol) === 1;

    if (diferente && vazia && vizinha) {
      this.grade.trocar(origemLin, origemCol, destino.lin, destino.col);

      /**
       * SEM desconto de erro por jogada — e essa NÃO é a inversão de uma
       * decisão anterior por acaso, é uma correção. A primeira versão contava
       * 1 erro toda vez que uma troca válida não aumentava `_pecasCorretas` na
       * hora, para a RE-02 descontar na vitória. Simulando o próprio
       * embaralhamento (`_embaralharNivel`) resolvido pelo caminho ÓTIMO —
       * ou seja, o jeito mais eficiente possível de terminar, sem NENHUMA
       * jogada desperdiçada — o nível Médio (60 passos) ainda acumulava uns
       * 40 desses "erros": num quebra-cabeça deslizante, destravar uma peça
       * quase sempre exige afastar outra que já estava certa, e isso é
       * inerente ao mecanismo, não um deslize do aluno. Com meta 10, isso
       * zerava `pontuacao` (`max(0, 10 − erros)`) em qualquer resolução real
       * dos níveis Médio/Difícil — a criança terminava o tabuleiro certinho e
       * via "0 ACERTOS" e zero estrelas. Não existe um jeito de contar "erro
       * de verdade" aqui sem reconstruir a noção de meta/progresso deste jogo
       * inteira, então a saída honesta é: uma jogada legal nunca é penalizada,
       * só a INVÁLIDA continua sem pontuar nada (a ficha só volta pro lugar).
       * `acertos` do ScoreSystem só CRESCE, mas uma ficha pode ficar certa,
       * sair do lugar e voltar a ficar certa várias vezes — por isso
       * `.acertar()` só é chamado UMA vez, quando as 10 caem certas ao MESMO
       * TEMPO (`_verificarCompleto`, abaixo), nunca por jogada.
       */
      if (this.config.audio?.soltar) this.audio.efeito(this.config.audio.soltar);

      this._reposicionarTodas(true);
      this._verificarCompleto();
    } else {
      this._reposicionarTodas(true);
    }
  }

  _verificarCompleto() {
    if (this.placar.encerrado) return;
    if (this._pecasCorretas() === 10) this.placar.acertar(10);
  }

  /**
   * Tabuleiro inteiro resolvido: SÓ dois efeitos, de propósito — moldura
   * dourada estável (não pisca, fica) + uma onda leve passando pelas 10 peças
   * uma vez. Nada de confete, selo por ficha ou brilho colorido durante a
   * partida: público neurodivergente reage mal a estímulo empilhado, e este é
   * o ÚNICO momento de comemoração do jogo inteiro.
   */
  _celebrarCompleto() {
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    this.tabuleiro.completo = true;

    for (let v = 0; v <= 9; v++) {
      const ficha = this.fichaDoValor.get(v);
      const baseY = ficha.y;
      Tween.de(ficha)
        .esperar(v * 60)
        .entao({ y: baseY - 16 }, 140, Easing.suaveSaida)
        .entao({ y: baseY }, 220, Easing.costasSaida);
    }

    Tween.de(this).esperar(1300).chamar(() => this._terminar(true));
  }

  _pausar() {
    if (this.placar.encerrado) return;
    this._cancelarArrastoEmCurso();
    // A ordem importa: pausar os tweens ANTES de abrir o painel, para não
    // pausar também a entrada dele (mesma correção já validada no Bingo —
    // ver `bingo-da-adicao-e-subtracao/CHECKLIST.md`, seção 1/RE-05).
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

  /** Uma ficha pausada no ar, a meio arrasto, volta pro lugar antes do véu subir. */
  _cancelarArrastoEmCurso() {
    if (!this._arrastando) return;
    const ficha = this._arrastando;
    this._arrastando = null;
    ficha.arrastando = false;
    ficha.scaleX = 1;
    ficha.scaleY = 1;
    this.tabuleiro.alvo = null;
    this._reposicionarTodas(false);
  }

  /**
   * Fim de partida — sempre vitória (quebra-cabeça solo, sem derrota). O
   * desconto de erros na pontuação (RE-02) já está embutido em
   * `this.placar.pontuacao`, que é o que `paraAva` manda como `acertos`.
   */
  _terminar(venceu) {
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu, { direcao: this.nivel.direcao }),
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

  /**
   * Só troca o texto quando o SEGUNDO inteiro muda — trocar a cada quadro
   * (60x/s) reescreveria o mesmo "0:42" sessenta vezes por segundo, trabalho
   * jogado fora. `tempoJogando` já vem congelado durante Pausa/Ajuda (ver o
   * comentário onde o relógio é criado), então não há nada a checar aqui além
   * do valor ter mudado.
   */
  _atualizarRelogio() {
    const total = Math.floor(this.game.tempoJogando);
    if (total === this._relogioSegundoMostrado) return;
    this._relogioSegundoMostrado = total;
    const min = Math.floor(total / 60);
    const seg = total % 60;
    this._textoRelogio.texto = `${min}:${String(seg).padStart(2, '0')}`;
  }
}
