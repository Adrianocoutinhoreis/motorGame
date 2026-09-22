import {
  Scene, Node, Sprite, TextNode, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Panel, Tween, Easing, ScoreSystem, ESTADOS, rand, espaco, alvoAcessivel,
} from '../../engine/index.js';

/**
 * Posição e tamanho de cada uma das 26 peças reais do brinquedo físico,
 * medidas na foto original (ver `fontes/dinossauro/pecas-redesenhadas/
 * layout.json` — mesmas 26 peças, mesma numeração do brinquedo). Coordenadas
 * na caixa ORIGINAL da arte (1440×1024 px); `aoEntrar` escala tudo de uma vez
 * pro tamanho do cartão do tabuleiro (`_escalaTabuleiro`).
 */
const BASE_W = 1440;
const BASE_H = 1024;
const LAYOUT_PECAS = [
  { n: 1, x: 339, y: 68, w: 237, h: 189 },
  { n: 2, x: 218, y: 124, w: 202, h: 157 },
  { n: 3, x: 151, y: 197, w: 185, h: 158 },
  { n: 4, x: 127, y: 293, w: 167, h: 165 },
  { n: 5, x: 128, y: 404, w: 198, h: 217 },
  { n: 6, x: 180, y: 515, w: 281, h: 258 },
  { n: 7, x: 370, y: 463, w: 206, h: 163 },
  { n: 8, x: 486, y: 362, w: 175, h: 171 },
  { n: 9, x: 583, y: 323, w: 177, h: 136 },
  { n: 10, x: 706, y: 323, w: 225, h: 128 },
  { n: 11, x: 859, y: 355, w: 214, h: 194 },
  { n: 12, x: 987, y: 477, w: 229, h: 196 },
  { n: 13, x: 1112, y: 593, w: 258, h: 226 },
  { n: 14, x: 1246, y: 581, w: 194, h: 197 },
  { n: 15, x: 1168, y: 412, w: 273, h: 237 },
  { n: 16, x: 358, y: 593, w: 276, h: 200 },
  { n: 17, x: 495, y: 493, w: 187, h: 170 },
  { n: 18, x: 572, y: 394, w: 245, h: 187 },
  { n: 19, x: 752, y: 386, w: 186, h: 184 },
  { n: 20, x: 839, y: 470, w: 206, h: 196 },
  { n: 21, x: 967, y: 574, w: 205, h: 227 },
  { n: 22, x: 457, y: 684, w: 232, h: 169 },
  { n: 23, x: 610, y: 511, w: 180, h: 224 },
  { n: 24, x: 730, y: 531, w: 203, h: 183 },
  { n: 25, x: 611, y: 647, w: 303, h: 151 },
  { n: 26, x: 851, y: 640, w: 234, h: 195 },
];

/** `LAYOUT_PECAS`, mas indexado por número — evita um `.find()` por peça. */
const LAYOUT_POR_NUMERO = new Map(LAYOUT_PECAS.map((info) => [info.n, info]));

/**
 * Alvo tocável mínimo (`docs/DESIGN.md`: 64×64 px lógicos) MEDIDO A PARTIR
 * DO CENTRO da peça, nunca menor que o próprio desenho — peças largas e
 * achatadas (a 25, 303×151, é a pior: 42px de altura na grade da bandeja)
 * encolhem bastante pra caber na célula da grade, e ficariam abaixo do
 * mínimo se a área de toque fosse só o retângulo desenhado. Ver
 * `_criarAreaTocavelAcessivel`.
 */
function _criarAreaTocavelAcessivel(peca) {
  const meiaLargura = alvoAcessivel(peca.largura) / 2;
  const meiaAltura = alvoAcessivel(peca.altura) / 2;
  const cx = peca.largura / 2;
  const cy = peca.altura / 2;
  peca.contemPontoLocal = (x, y) => (
    x >= cx - meiaLargura && x <= cx + meiaLargura
    && y >= cy - meiaAltura && y <= cy + meiaAltura
  );
}

/**
 * Anelzinho verde que nasce e some no lugar certo de uma peça — só aparece
 * quando a criança ACERTA a posição mas toca fora da ordem (ver
 * `GameScene._mostrarDicaLugar`). Confirma "é aqui mesmo que ela vai" sem
 * deixar a peça encaixar antes da vez, e nunca em vermelho — errar aqui só
 * demora mais, não é punição (`docs/METODO-JOGOS-NUMERANDUS.md`).
 */
class DicaLugar extends Node {
  desenhar(ctx) {
    ctx.save();
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, 14);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Quebra-Cabeça Dinossauro.
 *
 * Mecânica: as 26 peças reais do brinquedo físico aparecem embaralhadas numa
 * bandeja; a criança arrasta cada uma até o contorno pontilhado dela no
 * tabuleiro. Só a peça `_proximo` (a próxima da sequência 1→26) encaixa de
 * verdade — cair no lugar geométrico certo fora de ordem só ganha a dica
 * verde (`DicaLugar`) e volta pra bandeja. Sem cronômetro regressivo, sem
 * derrota: errar só demora mais.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({ total: this.nivel.meta, nivel: this.nivel.id ?? 1 });

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo,
      corCeuBase: config.corCeuBase,
      mostrarDecoracoes: config.mostrarDecoracoes ?? false,
    }));

    this.imgBase = this.loader.imagem('imgBase');
    this.imagensPecas = new Map();
    for (const info of LAYOUT_PECAS) {
      this.imagensPecas.set(info.n, this.loader.imagem(`peca${String(info.n).padStart(2, '0')}`));
    }

    // Tentativas fora de ordem — só DEMONSTRATIVO (mesmo padrão do Encaixe
    // Certo/Material Dourado/Jogo da Memória): NUNCA chama `placar.errar()`
    // (descontaria a nota na vitória, RE-02) — aqui errar só demora mais.
    this._tentativasErradas = 0;
    this._colocadas = 0;
    this._proximo = 1;
    this._arrastando = null;

    // -------------------------------------------------------------- layout
    // Dois cartões lado a lado, do mesmo tamanho aproximado — tabuleiro à
    // esquerda (um pouco maior, porque o dinossauro é mais largo que alto) e
    // peças à direita, cada um seu próprio painel, plano visual aprovado
    // antes desta implementação (protótipo `scratch/dino-drag-teste.html`).
    const margemLateral = 40;
    const topo = 108;
    const margemInferior = 24;
    const gapCartoes = 24;
    const areaLargura = L - margemLateral * 2;
    const areaAltura = A - topo - margemInferior;
    const larguraTabuleiro = Math.round((areaLargura - gapCartoes) * 0.57);
    const larguraBandeja = areaLargura - gapCartoes - larguraTabuleiro;

    this.area = new Node({ x: margemLateral, y: topo });
    this.adicionar(this.area);

    // ---------------------------------------------------------- tabuleiro
    const padTabuleiro = 24;
    this.area.adicionar(new Panel({ largura: larguraTabuleiro, altura: areaAltura, raio: 22 }));

    this._escalaTabuleiro = Math.min(
      (larguraTabuleiro - padTabuleiro * 2) / BASE_W,
      (areaAltura - padTabuleiro * 2) / BASE_H,
    );
    const escT = this._escalaTabuleiro;
    const larguraBase = BASE_W * escT;
    const alturaBase = BASE_H * escT;

    this.tabuleiro = new Node({
      x: (larguraTabuleiro - larguraBase) / 2,
      y: (areaAltura - alturaBase) / 2,
    });
    this.area.adicionar(this.tabuleiro);
    this.tabuleiro.adicionar(new Sprite(this.imgBase, { largura: larguraBase, altura: alturaBase }));

    // -------------------------------------------------------------- bandeja
    const xBandeja = larguraTabuleiro + gapCartoes;
    const padBandeja = 20;
    this.area.adicionar(new Panel({ x: xBandeja, largura: larguraBandeja, altura: areaAltura, raio: 22 }));

    const gapGrade = 10;
    const larguraGrade = larguraBandeja - padBandeja * 2;
    const alturaGrade = areaAltura - padBandeja * 2;
    const colunas = this._melhorGradeColunas(larguraGrade, alturaGrade, LAYOUT_PECAS.length, gapGrade);
    const linhas = Math.ceil(LAYOUT_PECAS.length / colunas);
    const cellW = (larguraGrade - gapGrade * (colunas - 1)) / colunas;
    const cellH = (alturaGrade - gapGrade * (linhas - 1)) / linhas;

    // ------------------------------------------------------ monta as peças
    // A ORDEM DE TOQUE continua sempre 1→26; embaralhar é só a posição na
    // grade da bandeja — o quanto foge da leitura em fileiras é o que muda
    // por nível (`nivel.embaralhamento`, ver config.js).
    const ordemExibicao = this._embaralharParcial(
      LAYOUT_PECAS.map((p) => p.n),
      this.nivel.embaralhamento ?? 1,
    );

    this.pecas = new Map();
    ordemExibicao.forEach((numero, indice) => {
      const info = LAYOUT_POR_NUMERO.get(numero);
      const col = indice % colunas;
      const lin = Math.floor(indice / colunas);
      const escalaCelula = Math.min(cellW / info.w, cellH / info.h);
      const dispW = info.w * escalaCelula;
      const dispH = info.h * escalaCelula;
      const cellX = xBandeja + padBandeja + col * (cellW + gapGrade);
      const cellY = padBandeja + lin * (cellH + gapGrade);

      const peca = new Sprite(this.imagensPecas.get(numero), {
        largura: dispW, altura: dispH, interativo: true,
      });
      peca.numero = numero;
      peca.trayX = cellX + (cellW - dispW) / 2;
      peca.trayY = cellY + (cellH - dispH) / 2;
      peca.trayLargura = dispW;
      peca.trayAltura = dispH;
      peca.x = peca.trayX;
      peca.y = peca.trayY;
      peca.colocada = false;
      peca.alvoX = this.tabuleiro.x + info.x * escT;
      peca.alvoY = this.tabuleiro.y + info.y * escT;
      peca.alvoLargura = info.w * escT;
      peca.alvoAltura = info.h * escT;
      // Peças largas e achatadas (a 25, a 10…) encolhem bem além de 64px de
      // altura só pra caber na célula da grade — a ÁREA DE TOQUE nunca pode
      // encolher junto (`docs/DESIGN.md`), mesmo que o desenho fique menor.
      _criarAreaTocavelAcessivel(peca);

      peca.on('apertar', (ponto) => this._pegarPeca(peca, ponto));
      this.area.adicionar(peca);
      this.pecas.set(numero, peca);
    });

    // -------------------------------------------------------- entrada global
    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', () => this._soltarArrasto()));
    this.aoDesmontar(this.input.on('cancelar', () => this._soltarArrasto()));

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
      audio: this.audio, x: L - 96, y: espaco.md, somToque: config.audio?.clique,
    }));

    this.progressoTexto = new TextNode('', {
      x: L / 2,
      y: espaco.md + 24,
      alinhamento: 'center',
      linhaBase: 'middle',
      tamanho: 26,
      peso: '800',
      cor: '#F5EAD6',
    });
    this.adicionar(this.progressoTexto);
    this._atualizarProgresso();

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

    // Uma pausa curta pra criança ver o dinossauro inteiro antes da tela de
    // resultado — sem isso a troca de tela cortava a comemoração da última
    // peça no meio.
    this.placar.on('vitoria', () => {
      Tween.de(this).esperar(700).chamar(() => this._terminar(true));
    });
  }

  // --------------------------------------------------------------- arrasto

  _pegarPeca(peca, ponto) {
    if (this.pausada || this.placar.encerrado || this._arrastando || peca.colocada) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    this._deslocX = peca.x - local.x;
    this._deslocY = peca.y - local.y;
    peca.paraFrente();
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1.08, scaleY: 1.08 }, 100, Easing.suaveSaida);
    this._arrastando = peca;
  }

  /**
   * Raio de aceite do lugar certo — mesmo raio usado pra VALIDAR o encaixe
   * (`_dentroDaTolerancia`) e pro ÍMÃ que puxa a peça durante o arrasto
   * (`_moverArrasto`). `nivel.tolerancia` (config.js) multiplica esse raio:
   * >1 no Fácil (solta mais longe e ainda conta), <1 no Difícil.
   */
  _raioTolerancia(peca) {
    const base = Math.max(40, Math.min(peca.alvoLargura, peca.alvoAltura) * 0.55);
    return base * (this.nivel.tolerancia ?? 1);
  }

  _dentroDaTolerancia(peca) {
    const cx = peca.alvoX + peca.alvoLargura / 2;
    const cy = peca.alvoY + peca.alvoAltura / 2;
    const px = peca.x + peca.largura / 2;
    const py = peca.y + peca.altura / 2;
    const raio = this._raioTolerancia(peca);
    return (px - cx) ** 2 + (py - cy) ** 2 <= raio ** 2;
  }

  _moverArrasto(ponto) {
    const peca = this._arrastando;
    if (!peca) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    peca.x = local.x + this._deslocX;
    peca.y = local.y + this._deslocY;

    // Ímã: perto o bastante do PRÓPRIO lugar (certo ou fora de ordem — não é
    // a ordem que decide o ímã, só a posição), a peça é puxada suavemente
    // pro centro do encaixe a cada quadro. Ajuda quem não solta com precisão
    // de pixel (mão que treme, dedo maior que a área alvo).
    if (this._dentroDaTolerancia(peca)) {
      const alvoCx = peca.alvoX + peca.alvoLargura / 2 - peca.largura / 2;
      const alvoCy = peca.alvoY + peca.alvoAltura / 2 - peca.altura / 2;
      const dx = alvoCx - peca.x;
      const dy = alvoCy - peca.y;
      const raio = this._raioTolerancia(peca);
      const dist = Math.sqrt(dx ** 2 + dy ** 2);
      const forca = 1 - Math.min(1, dist / raio);
      const FATOR_IMA = 0.3;
      peca.x += dx * forca * FATOR_IMA;
      peca.y += dy * forca * FATOR_IMA;
    }
  }

  _soltarArrasto() {
    const peca = this._arrastando;
    if (!peca) return;
    this._arrastando = null;
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    const noLugarCerto = this._dentroDaTolerancia(peca);
    const naOrdemCerta = peca.numero === this._proximo;

    if (noLugarCerto && naOrdemCerta) {
      peca.colocada = true;
      peca.interativo = false;
      // Ordem natural: a peça que acabou de assentar já está na FRENTE de
      // `this.area` (o `paraFrente()` de `_pegarPeca`, no instante em que
      // foi pega, e nada a reparenta depois) — cada peça nova cobre a
      // anterior com a própria aba, exatamente como no brinquedo físico
      // (14 por cima da 13, 15 por cima da 14, sempre nessa ordem). O
      // número de cada peça já mora longe de qualquer aba/entalhe (ver
      // `peca-13.png`), então nada fica tampado.
      Tween.removerDe(peca);
      Tween.para(peca, {
        x: peca.alvoX, y: peca.alvoY, largura: peca.alvoLargura, altura: peca.alvoAltura,
      }, 160, Easing.suaveSaida);
      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
      this._colocadas += 1;
      this._proximo += 1;
      this.placar.acertar(1);
      this._atualizarProgresso();
      return;
    }

    // A ORDEM manda mais que a posição: cair no lugar geométrico certo fora
    // de ordem só ganha a dica verde — a peça sempre volta pra bandeja.
    if (noLugarCerto && !naOrdemCerta) {
      this._mostrarDicaLugar(peca);
      this._tentativasErradas += 1;
      if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    }

    Tween.removerDe(peca);
    Tween.para(peca, {
      x: peca.trayX, y: peca.trayY, largura: peca.trayLargura, altura: peca.trayAltura,
    }, 220, Easing.suaveSaida);
  }

  _mostrarDicaLugar(peca) {
    const dica = new DicaLugar({
      x: peca.alvoX, y: peca.alvoY, largura: peca.alvoLargura, altura: peca.alvoAltura,
    });
    this.area.adicionar(dica);
    Tween.de(dica).esperar(550).chamar(() => dica.removerDoPai());
  }

  _cancelarArrastoEmCurso() {
    if (!this._arrastando) return;
    const peca = this._arrastando;
    this._arrastando = null;
    peca.scaleX = 1;
    peca.scaleY = 1;
    Tween.removerDe(peca);
    peca.x = peca.trayX;
    peca.y = peca.trayY;
    peca.largura = peca.trayLargura;
    peca.altura = peca.trayAltura;
  }

  // ------------------------------------------------------------------ HUD

  _atualizarProgresso() {
    this.progressoTexto.texto = `${this._colocadas} / ${LAYOUT_PECAS.length} peças`;
  }

  _pausar() {
    if (this.placar.encerrado) return;
    this._cancelarArrastoEmCurso();
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
  }

  // --------------------------------------------------------------- auxiliares

  /**
   * Escolhe quantas colunas a grade da bandeja usa pra caber TODAS as
   * `total` peças no espaço `areaW`×`areaH` sem cortar nem rolar — testa
   * cada nº de colunas e fica com a que dá a MAIOR célula possível (o
   * gargalo é sempre o menor dos dois lados da célula).
   */
  _melhorGradeColunas(areaW, areaH, total, gap) {
    let melhorColunas = 1;
    let melhorPontuacao = -Infinity;
    for (let colunas = 1; colunas <= total; colunas++) {
      const linhas = Math.ceil(total / colunas);
      const cellW = (areaW - gap * (colunas - 1)) / colunas;
      const cellH = (areaH - gap * (linhas - 1)) / linhas;
      if (cellW <= 0 || cellH <= 0) continue;
      const pontuacao = Math.min(cellW, cellH);
      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        melhorColunas = colunas;
      }
    }
    return melhorColunas;
  }

  /**
   * Embaralha `lista` fazendo só `fracao * lista.length` trocas de par
   * (em vez de um Fisher-Yates completo) — 0 = ordem original (fácil de
   * achar a peça certa na bandeja), 1 = bem misturada. É o eixo de
   * dificuldade "achar a peça", separado do eixo "precisão pra soltar"
   * (`nivel.tolerancia`, ver `_raioTolerancia`).
   */
  _embaralharParcial(lista, fracao) {
    const copia = [...lista];
    const trocas = Math.round(Math.max(0, Math.min(1, fracao)) * copia.length);
    for (let k = 0; k < trocas; k++) {
      const i = rand.inteiro(0, copia.length - 1);
      const j = rand.inteiro(0, copia.length - 1);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
}
