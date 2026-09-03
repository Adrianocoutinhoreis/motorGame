import {
  Scene, Node, TextNode, ScoreSystem, IconButton, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog, tipografia, espaco,
} from '../../engine/index.js';

/** As oito trincas que fecham uma partida numa grade 3x3 (índices 0-8, linha a linha). */
const LINHAS_VENCEDORAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6],           // diagonais
];

/** Primeira trinca fechada no tabuleiro, ou null. */
function vencedorDe(tabuleiro) {
  for (const linha of LINHAS_VENCEDORAS) {
    const [a, b, c] = linha;
    if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
      return { marca: tabuleiro[a], linha };
    }
  }
  return null;
}

/** Índice que fecha uma linha para `marca` agora mesmo, ou null se não houver. */
function jogadaQueFecha(tabuleiro, marca) {
  for (const linha of LINHAS_VENCEDORAS) {
    const vazios = linha.filter((i) => tabuleiro[i] == null);
    if (vazios.length !== 1) continue;
    const ocupadasPelaMarca = linha.filter((i) => tabuleiro[i] === marca).length;
    if (ocupadasPelaMarca === 2) return vazios[0];
  }
  return null;
}

/** Centro, depois cantos, depois lados — a ordem clássica de abertura do jogo da velha. */
const PREFERENCIA_POSICIONAL = [4, 0, 2, 6, 8, 1, 3, 5, 7];

/**
 * Escolhe a jogada da CPU.
 *
 * Decisão pedagógica registrada em `docs/STATES.md`: uma CPU perfeita nunca
 * perde, e isso ensina a criança a desistir. Esta CPU nunca desperdiça uma
 * vitória própria, mas só bloqueia a vitória do aluno na maior parte das
 * vezes — `chanceDeErro` é a fração das vezes em que ela deixa passar.
 *
 * @param {Array<string|null>} tabuleiro 9 posições, chamado só com o tabuleiro NÃO cheio
 * @param {number} chanceDeErro 0..1
 * @param {string} corCPU a marca da CPU no tabuleiro ('vermelho' | 'azul')
 * @param {string} corAluno a marca do aluno no tabuleiro (a outra cor)
 */
function jogadaCPU(tabuleiro, chanceDeErro, corCPU, corAluno) {
  const vitoria = jogadaQueFecha(tabuleiro, corCPU);
  if (vitoria != null) return vitoria;

  const bloqueio = jogadaQueFecha(tabuleiro, corAluno);
  if (bloqueio != null && Math.random() >= chanceDeErro) return bloqueio;

  return PREFERENCIA_POSICIONAL.find((i) => tabuleiro[i] == null);
}

const TAMANHO_CELULA = 180;
const GAP_CELULA = 16;
const TAMANHO_TABULEIRO = TAMANHO_CELULA * 3 + GAP_CELULA * 2;

/**
 * Celula — uma casa do tabuleiro.
 *
 * Cartão arredondado desenhado no canvas, com a marca (a cor escolhida pelo
 * aluno, ou a cor da CPU) preenchida pelos MESMOS rostinhos redondos do
 * protótipo original — vermelho e azul (`assets/img/x.png`/`o.png`, herdados
 * de `Aulas para Refazer/Jogo_da_velha/assets/`). Se a imagem não carregar
 * por algum motivo, cai num traço vetorial na mesma cor — o `Loader` do motor
 * nunca derruba o jogo por um recurso que faltou.
 *
 * A marca entra com uma animação de escala suave, e uma linha vencedora fica
 * com realce ESTÁVEL (cor sólida, sem piscar) — evitar flash é decisão de
 * acessibilidade (ver plano: sensibilidade a luz/movimento repetitivo).
 */
class Celula extends Node {
  constructor(indice, imagens, opcoes = {}) {
    super({ ...opcoes, largura: TAMANHO_CELULA, altura: TAMANHO_CELULA, interativo: true });
    this.indice = indice;
    /** `{ vermelho: HTMLImageElement|null, azul: HTMLImageElement|null }` */
    this.imagens = imagens;
    /** null (vazia) | 'vermelho' | 'azul' */
    this.marca = null;
    this.vencedora = false;
    this._escala = 0;
    this._animAlvo = null;
  }

  marcar(marca) {
    this.marca = marca;
    this._escala = 0;
    const alvo = { v: 0 };
    Tween.de(alvo).entao({ v: 1 }, 220, Easing.costasSaida);
    this._animAlvo = alvo;
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (this._animAlvo) this._escala = this._animAlvo.v;
  }

  desenhar(ctx) {
    const l = this.largura;
    ctx.save();
    // Realce da vitória em giz amarelo — a mesma cor da faixa de subtítulo da
    // placa do menu (tema 'quadro'), como se o professor tivesse circulado a
    // linha certa no quadro-negro.
    ctx.fillStyle = this.vencedora ? '#FEF9C3' : '#FFFFFF';
    ctx.strokeStyle = this.vencedora ? '#FACC15' : '#1E3A8A';
    ctx.lineWidth = this.vencedora ? 8 : 5;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, l, 18);
    ctx.fill();
    ctx.stroke();

    if (this.marca) {
      ctx.save();
      ctx.translate(l / 2, l / 2);
      ctx.scale(this._escala, this._escala);
      const imagem = this.imagens?.[this.marca];
      if (imagem) {
        const d = l * 0.72;
        ctx.drawImage(imagem, -d / 2, -d / 2, d, d);
      } else {
        // Sem a imagem (Loader avisou no console): um círculo chapado na
        // MESMA cor — nunca um X ou um O desenhado. O jogo não usa letra como
        // marca, e um traço em forma de X ou de O reintroduziria exatamente a
        // leitura que a arte por cor existe para evitar, mesmo como reserva.
        const r = l * 0.26;
        ctx.fillStyle = this.marca === 'vermelho' ? '#DC2626' : '#2563EB';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Jogo da Velha contra a CPU.
 *
 * Diferente dos outros jogos do motor, aqui não há meta de pontos correntes:
 * a partida tem UM resultado (vitória, derrota ou empate), e é isso que o
 * `ScoreSystem` mede com `total: 10, pontosPorAcerto: 10, vidas: 1` (uma
 * vitória vale as 10 de uma vez — ver `src/config.js`). O empate é o único
 * desfecho que não passa pelos eventos automáticos do placar — ver
 * `_terminarEmpate()`.
 *
 * **A cor não é fixa.** O aluno escolhe vermelho ou azul na tela
 * `EscolhaCorScreen` antes de cada partida nova; esta cena só sabe montar o
 * tabuleiro quando `this.game.dados.corAluno` já existe — sem ele, redireciona
 * para lá e não desenha nada (ver o início de `aoEntrar`).
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];

    // Sem cor escolhida ainda: manda para "Escolha sua cor" e para por aqui —
    // nenhum nó desta cena chega a ser criado. Quando o aluno escolhe, aquela
    // tela chama `irPara('jogando', { nivel, corAluno })` de novo, o motor cria
    // uma `GameScene` NOVA (é assim que `irPara` sempre funciona), e desta vez
    // `corAluno` já vem preenchido — o resto do método roda normalmente.
    //
    // **O `irPara` daqui precisa ser ADIADO, não chamado direto.** `aoEntrar`
    // roda DENTRO do `irPara('jogando', …)` que está trocando de cena agora
    // mesmo — `Game._trocando` ainda está `true` até esse `irPara` terminar.
    // Chamar `this.irPara('escolhaCor', …)` aqui, síncrono, bateria na trava
    // de reentrância do motor (`if (this._trocando) return;`) e não faria
    // nada — foi exatamente o defeito medido nesta sessão: a cena ficava
    // vazia, sem tabuleiro e sem redirecionar. `Game.irPara` não tem nenhum
    // `await` depois de chamar `aoEntrar()`, então um microtask (`.then`) já
    // basta para rodar DEPOIS do `finally` que zera `_trocando`.
    this.corAluno = this.game.dados.corAluno;
    if (!this.corAluno) {
      const nivel = this.nivel;
      Promise.resolve().then(() => this.irPara('escolhaCor', { nivel }));
      return;
    }
    this.corCPU = this.corAluno === 'vermelho' ? 'azul' : 'vermelho';

    this.chanceDeErroCPU = this.nivel.chanceDeErroCPU ?? 0.35;

    this.placar = new ScoreSystem({
      total: this.nivel.meta ?? 10,
      nivel: this.nivel.id ?? 1,
      vidas: this.nivel.vidas ?? 1,
      // Uma vitória fecha a meta de uma vez: não há "acertos parciais" numa
      // partida de jogo da velha, então o único `acertar()` da partida vale a
      // meta inteira — dez pontos, não um (ver `docs/CONTRATO-AVA.md` sobre a
      // tela nunca dizer "1 PONTO" para uma partida de resultado único).
      pontosPorAcerto: 10,
    });

    /** 9 posições: null (vazia), a cor do aluno, ou a cor da CPU. O aluno sempre começa. */
    this.tabuleiro = Array(9).fill(null);
    /** Trava o toque enquanto uma jogada está sendo resolvida (docs/STATES.md). */
    this.travado = false;
    this._vezDaCPU = false;
    this._fimResolvido = false;

    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'quadro' }));

    // ------------------------------------------------------------------ HUD
    // De propósito mínimo: sem barra de progresso (a partida tem um resultado
    // só, não uma pontuação corrente) e sem cenário carregado — o tabuleiro é
    // o elemento dominante da tela (ver plano: layout para neurodivergência).
    // Texto em "giz" branco, com contorno escuro: o mesmo vocabulário do tema
    // 'quadro' (ver `PlacaTituloQuadro` no menu), legível sobre o verde-quadro
    // do cenário.
    this.textoVez = new TextNode('SUA VEZ', {
      x: L / 2,
      y: 56,
      tamanho: tipografia.subtitulo,
      peso: tipografia.pesoForte,
      cor: '#F8FAFC',
      contorno: '#0F3D2E',
      espessuraContorno: 6,
      alinhamento: 'center',
    });
    this.adicionar(this.textoVez);

    this.adicionar(new IconButton({
      icone: 'pausa',
      x: L - 96,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pausar(),
    }));

    // AJUDA: o tutorial por cima da partida, sem perdê-la (regra RE-05).
    this.adicionar(new IconButton({
      icone: 'tutorial',
      x: L - 96 - 72 - 16,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.pedirAjuda(),
    }));

    // ---------------------------------------------------------------- pausa
    this.pausa = new PauseScreen({
      largura: L,
      altura: A,
      audio: this.audio,
      config,
      aoContinuar: () => { this.pausada = false; },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel, corAluno: this.corAluno }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    this.ajuda = new HelpScreen({
      cena: this,
      aoFechar: () => { this.pausada = false; },
    });
    this.adicionar(this.ajuda);

    // ------------------------------------------------------------ tabuleiro
    // Grande e centralizado — livre para dominar o palco porque não há
    // guindaste nem cenário de jogabilidade disputando espaço com ele.
    const x0 = (L - TAMANHO_TABULEIRO) / 2;
    const y0 = 124;
    const imagens = {
      vermelho: this.loader.imagem('pecaVermelha'),
      azul: this.loader.imagem('pecaAzul'),
    };
    this.celulas = [];
    for (let i = 0; i < 9; i++) {
      const lin = Math.floor(i / 3);
      const col = i % 3;
      const celula = new Celula(i, imagens, {
        x: x0 + col * (TAMANHO_CELULA + GAP_CELULA),
        y: y0 + lin * (TAMANHO_CELULA + GAP_CELULA),
      });
      celula.on('toque', () => this._jogarAluno(i));
      this.adicionar(celula);
      this.celulas.push(celula);
    }

    this.pausa.paraFrente(); // a camada de pausa fica sempre por cima

    // --------------------------------------------------------------- placar
    this.placar.on('vitoria', () => this._terminar(true));
    this.placar.on('derrota', () => this._terminar(false));

    // --------------------------------------------------------------- guarda
    // Mesma rede de segurança do Jogo dos Blocos: a "vez de pensar" da CPU é
    // uma única cadeia de Tween, e o cão de guarda garante que ela nunca fica
    // presa numa exceção engolida.
    this.guarda = new Watchdog({
      nome: 'vez do computador',
      ocupado: () => this.travado && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this),
      graca: 0.6,
      limite: 12,
      aoTravar: ({ tentativa }) => {
        if (tentativa === 1) {
          this.travado = false;
          if (this._vezDaCPU) this._jogadaComputador();
          return;
        }
        // Travou de novo: melhor um empate honesto que um tabuleiro que não
        // aceita mais nenhum toque.
        this.guarda.desligar();
        this._terminarEmpate();
      },
    });
  }

  _jogarAluno(indice) {
    if (this.pausada || this.travado || this._fimResolvido) return;
    if (this.tabuleiro[indice]) return;

    this.tabuleiro[indice] = this.corAluno;
    this.celulas[indice].marcar(this.corAluno);

    if (this._resolverSeTerminou()) return;

    this.travado = true;
    this._vezDaCPU = true;
    this.textoVez.texto = 'VEZ DO COMPUTADOR';
    // Espera visível antes da CPU jogar: dá tempo de a criança ver a própria
    // jogada antes que a tela mude de novo (sem cronômetro nem pressa).
    Tween.de(this).esperar(550).chamar(() => this._jogadaComputador());
  }

  _jogadaComputador() {
    if (this._fimResolvido) return;
    this._vezDaCPU = false;

    const indice = jogadaCPU(this.tabuleiro, this.chanceDeErroCPU, this.corCPU, this.corAluno);
    this.tabuleiro[indice] = this.corCPU;
    this.celulas[indice].marcar(this.corCPU);

    if (this._resolverSeTerminou()) return;

    this.travado = false;
    this.textoVez.texto = 'SUA VEZ';
  }

  /**
   * Confere vitória/empate depois de UMA jogada (aluno ou CPU).
   * @returns {boolean} true se a partida terminou (e já está sendo encerrada)
   */
  _resolverSeTerminou() {
    const vencedor = vencedorDe(this.tabuleiro);
    if (vencedor) {
      for (const i of vencedor.linha) this.celulas[i].vencedora = true;
      this.travado = true;
      const venceuAluno = vencedor.marca === this.corAluno;
      // Pausa curta para a criança VER a linha fechada antes da tela mudar.
      Tween.de(this).esperar(700).chamar(() => {
        if (venceuAluno) this.placar.acertar();
        else this.placar.errar();
      });
      return true;
    }

    if (this.tabuleiro.every((v) => v !== null)) {
      this.travado = true;
      Tween.de(this).esperar(500).chamar(() => this._terminarEmpate());
      return true;
    }

    return false;
  }

  /**
   * Empate: o único desfecho que não passa pelos eventos `vitoria`/`derrota`
   * do `ScoreSystem` — nem `venceu` nem `perdeu` ficam verdadeiros sozinhos.
   * `extras.empate` é o sinalizador que a `ResultScreen` lê para escolher a
   * tela neutra (nem vitória, nem derrota).
   */
  _terminarEmpate() {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(false, { empate: true }),
    });
  }

  /**
   * Fim de partida por vitória ou derrota. É AQUI que o registro no AVA
   * acontece: ao entrar no estado 'resultado', o motor chama o `AvaBridge`
   * com este objeto — uma vez só.
   */
  _terminar(venceu) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu),
    });
  }

  pausar() {
    if (this._fimResolvido) return;
    this.pausada = true;
    this.pausa.abrir();
  }

  /**
   * Pedir ajuda. Pausa DE VERDADE: com `pausada` ligado o cronômetro do motor
   * também para, e o `tempoSegundos` do AVA não soma o tempo lendo a
   * explicação (regra RE-05).
   */
  pedirAjuda() {
    if (this._fimResolvido || this.pausada) return;
    this.pausada = true;
    this.ajuda.abrir();
  }

  atualizar(dt) {
    if (this.pausada) {
      // As DUAS camadas: qualquer uma pode estar aberta, e a fechada é
      // invisível e não desenha.
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }

    super.atualizar(dt);
    this.guarda.atualizar(dt);
  }

  aoSair() {
    Tween.removerTodos();
  }
}
