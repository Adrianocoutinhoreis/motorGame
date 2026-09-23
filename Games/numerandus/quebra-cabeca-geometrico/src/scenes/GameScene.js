import {
  Scene, Node, TextNode, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Panel, Tween, Easing, ScoreSystem, ESTADOS, rand, espaco, alvoAcessivel,
} from '../../engine/index.js';

/**
 * Geometria e dados REAIS das 7 peças do brinquedo físico — transcritos de
 * fotos limpas (sem mão na frente) e cruzados contra a foto da montagem
 * final até as 12 arestas (6 com a central + 6 entre vizinhas) baterem.
 * Ver README.md "Como os números foram conferidos".
 *
 * Cada hexágono tem 6 triângulos, `numeros[k]` na ordem
 * [topo, cima-direita, baixo-direita, base, baixo-esquerda, cima-esquerda]
 * (sentido horário, k=0..5) — a MESMA ordem em `Hexagono._cunhas`.
 */
const NUMEROS_CENTRAL = [6, 1, 3, 2, 6, 1];

/**
 * Uma posição ao redor da central: `seedK` é o triângulo DELA que encosta
 * ali; `pieceJ` é o triângulo da peça vizinha que encosta na central (sempre
 * o oposto, `seedK + 3`, porque as duas peças se tocam por uma aresta só).
 * `numeros` é a peça de verdade que vai naquele lugar (na rotação em que ela
 * aparece na foto da montagem final — `steps: 0` já é a resposta certa).
 */
const SLOTS = [
  { dir: 'topo', anguloGraus: -90, seedK: 0, pieceJ: 3, numeros: [3, 3, 3, 6, 6, 5] },
  { dir: 'cima-direita', anguloGraus: -30, seedK: 1, pieceJ: 4, numeros: [3, 4, 3, 2, 1, 3] },
  { dir: 'baixo-direita', anguloGraus: 30, seedK: 2, pieceJ: 5, numeros: [2, 2, 1, 1, 3, 3] },
  { dir: 'base', anguloGraus: 90, seedK: 3, pieceJ: 0, numeros: [2, 3, 1, 2, 6, 6] },
  { dir: 'baixo-esquerda', anguloGraus: 150, seedK: 4, pieceJ: 1, numeros: [1, 9, 9, 1, 6, 1] },
  { dir: 'cima-esquerda', anguloGraus: 210, seedK: 5, pieceJ: 2, numeros: [4, 6, 1, 1, 5, 3] },
];

/**
 * Pares de peças VIZINHAS entre si (além de cada uma tocar a central) — numa
 * flor de 7 hexágonos toda aresta é encontro de duas peças, nunca só
 * "pontinha" (ver README, achado da revisão do protótipo). `ja`/`jb` são os
 * triângulos de cada lado que se tocam.
 */
const ANEL = [
  { a: 0, ja: 2, b: 1, jb: 5 },
  { a: 1, ja: 3, b: 2, jb: 0 },
  { a: 2, ja: 4, b: 3, jb: 1 },
  { a: 3, ja: 5, b: 4, jb: 2 },
  { a: 4, ja: 0, b: 5, jb: 3 },
  { a: 5, ja: 1, b: 0, jb: 4 },
];

/**
 * Distância do centro da flor até o centro de cada peça vizinha, em raios.
 * Pra dois hexágonos do MESMO tamanho encostarem aresta com aresta sem
 * sobrar vão nem se sobrepor, o centro a centro é `raio * √3` — não um
 * número redondo qualquer (1.8, usado antes, deixava uma fresta branca
 * entre as peças, visível tanto no tabuleiro quanto no tutorial).
 */
const DIST_FATOR = Math.sqrt(3);

/**
 * Separação visual mínima entre peças encaixadas. O contato matemático exato
 * faz os traços de 1,5 px das duas peças ocuparem a mesma aresta e cria a
 * aparência de sobreposição por antialiasing. Dois pixels preservam a leitura
 * da flor sem transformar as junções em vãos perceptíveis.
 */
const FOLGA_ENTRE_PECAS = 2;

/** Redução leve das peças na montagem para deixar as junções mais limpas. */
const ESCALA_PECAS_TABULEIRO = 0.96;

/** Cor real de cada número (mesma fonte do config.js — ver ali o porquê do 6=9). */
const CORES_POR_NUMERO = {
  1: '#2E8B7C', 2: '#D959A8', 3: '#4A3FA6', 4: '#E8B93B', 5: '#C2A878', 6: '#C1364B', 9: '#C1364B',
};

/** 6 e 9 são o MESMO triângulo, só de cabeça para baixo — contam como iguais. */
function normalizarNumero(n) {
  return n === 9 ? 6 : n;
}

/** Número que aparece na posição-de-tela `j` (0..5), dada a peça girada `passos` vezes de 60°. */
function numeroEm(numeros, j, passos) {
  return numeros[(((j - passos) % 6) + 6) % 6];
}

/**
 * Hexágono de 6 triângulos numerados — a peça (e também a peça central e os
 * contornos preenchidos do tabuleiro, todos a mesma classe). `numeros` fica
 * FIXO em `steps: 0`; girar é só `this.rotation` (o motor cuida do resto,
 * inclusive da área de toque — `contemPontoLocal` já considera a rotação).
 */
class Hexagono extends Node {
  constructor(opcoes = {}) {
    const raio = opcoes.raio ?? 70;
    const lado = alvoAcessivel(raio * 2);
    super({ ...opcoes, largura: lado, altura: lado, interativo: opcoes.interativo ?? false });
    this.definirRaio(raio);
    this.numeros = opcoes.numeros;
    this.passos = 0;
    this.brilho = 0;
  }

  /** Mantém desenho, caixa lógica e ponto de registro com o mesmo tamanho. */
  definirRaio(raio) {
    const lado = alvoAcessivel(raio * 2);
    this.raio = raio;
    this.largura = lado;
    this.altura = lado;
    this.regX = lado / 2;
    this.regY = lado / 2;
  }

  /** Área de toque: um círculo do tamanho do hexágono (nunca menor que o alvo acessível). */
  contemPontoLocal(x, y) {
    const c = this.largura / 2;
    const dx = x - c;
    const dy = y - c;
    return dx * dx + dy * dy <= c * c;
  }

  desenhar(ctx) {
    const c = this.largura / 2;
    const r = this.raio;
    ctx.save();
    ctx.translate(c, c);
    if (this.brilho > 0) {
      ctx.save();
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = ((-120 + 60 * k) * Math.PI) / 180;
        const px = r * Math.cos(a);
        const py = r * Math.sin(a);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(250, 204, 21, ${0.5 * this.brilho})`;
      ctx.shadowColor = `rgba(250, 204, 21, ${0.9 * this.brilho})`;
      ctx.shadowBlur = 32 * this.brilho;
      ctx.fill();
      ctx.restore();
    }
    for (let k = 0; k < 6; k++) {
      const a0 = ((-120 + 60 * k) * Math.PI) / 180;
      const a1 = ((-120 + 60 * (k + 1)) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r * Math.cos(a0), r * Math.sin(a0));
      ctx.lineTo(r * Math.cos(a1), r * Math.sin(a1));
      ctx.closePath();
      ctx.fillStyle = CORES_POR_NUMERO[this.numeros[k]] ?? '#8B87A3';
      ctx.fill();
      ctx.strokeStyle = '#241F38';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${Math.round(r * 0.34)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let k = 0; k < 6; k++) {
      const mid = ((-120 + 60 * k + 30) * Math.PI) / 180;
      ctx.fillText(String(this.numeros[k]), r * 0.62 * Math.cos(mid), r * 0.62 * Math.sin(mid));
    }
    if (this.brilho > 0) {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = ((-120 + 60 * k) * Math.PI) / 180;
        const px = r * Math.cos(a);
        const py = r * Math.sin(a);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(250, 204, 21, ${this.brilho})`;
      ctx.lineWidth = 6;
      ctx.stroke();
    }
    ctx.restore();
  }
}

/** O contorno pontilhado de um lugar vazio — pisca âmbar quando recusa uma peça errada. */
class ContornoVazio extends Node {
  constructor(opcoes = {}) {
    const raio = opcoes.raio ?? 70;
    const lado = raio * 2;
    super({ ...opcoes, largura: lado, altura: lado });
    // `x`/`y` dos slots representam o centro da flor. Sem o ponto de
    // registro central, o motor interpreta essas coordenadas como o canto
    // superior esquerdo e desloca o contorno um raio para baixo e à direita.
    this.regX = lado / 2;
    this.regY = lado / 2;
    this.raio = raio;
    this.destacado = false;
    this.dica = false;
  }

  piscarErro() {
    this.destacado = true;
    Tween.removerDe(this);
    Tween.de(this).esperar(650).chamar(() => { this.destacado = false; });
  }

  desenhar(ctx) {
    const c = this.largura / 2;
    const r = this.raio;
    ctx.save();
    ctx.translate(c, c);
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = ((-120 + 60 * k) * Math.PI) / 180;
      const px = r * Math.cos(a);
      const py = r * Math.sin(a);
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    // Preenchimento praticamente OPACO — com 12% (e depois 32%) de opacidade
    // a "flor" toda ainda lia como quase-invisível: o olho só registra a
    // peça central (sólida, colorida) como "o conteúdo", que começa bem mais
    // pra baixo do que a primeira peça da bandeja — parece descentralizado
    // mesmo estando centralizado de verdade (conferido pixel a pixel). Um
    // contorno bem visível deixa a flor inteira óbvia como área de jogo.
    ctx.fillStyle = this.destacado ? '#FCE8CC' : this.dica ? '#DCFCE7' : '#E8E3F5';
    ctx.fill();
    ctx.strokeStyle = this.destacado ? '#F59E0B' : this.dica ? '#16A34A' : '#7C6FB0';
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 7]);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Quebra-Cabeça Geométrico.
 *
 * Mecânica: uma peça central fixa fica no meio do tabuleiro; as outras 6
 * (todas as mesmas 7 peças reais do brinquedo, sempre) aparecem na bandeja.
 * A criança gira cada peça (botão dedicado, nunca gesto) até o número do
 * lado que vai tocar bater com o vizinho, e arrasta até o contorno
 * pontilhado. Só encaixa de vez quando os números das arestas batem, tanto
 * com a central quanto com as peças já colocadas do lado — cair perto do
 * lugar certo com o número errado só pisca âmbar e volta pra bandeja.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({ total: this.nivel.meta ?? 6, nivel: this.nivel.id ?? 1 });

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo,
      corCeuBase: config.corCeuBase,
      mostrarDecoracoes: config.mostrarDecoracoes ?? false,
    }));

    this._arrastando = null;
    this._colocadas = 0;
    this._tentativasErradas = 0;

    // -------------------------------------------------------------- layout
    // Dois cartões lado a lado — tabuleiro (a flor de hexágonos, formato
    // quase quadrado) e bandeja (as 6 peças, sempre todas visíveis, sem
    // rolagem) — mesmo plano de dois painéis do Quebra-Cabeça Dino.
    const margemLateral = 40;
    const topo = 108;
    // Mais folga que o padrão de 24px: com uma flor de hexágonos quase
    // quadrada (não uma silhueta comprida como a do Dino), a margem de baixo
    // apertada colada nos 108px reservados pro HUD em cima dava a impressão
    // dos cartões estarem "empurrados" pro rodapé, mesmo com o conteúdo
    // centralizado dentro deles (conferido pixel a pixel).
    const margemInferior = 40;
    const gapCartoes = 24;
    const areaLargura = L - margemLateral * 2;
    const areaAltura = A - topo - margemInferior;
    const padTabuleiro = 24;

    // A flor (central + 6 ao redor, encostadas aresta com aresta) cabe numa
    // caixa de 5 raios de largura por `2*(√3+1)` ≈ 5.46 de altura — ver
    // README pra conta completa. Um painel bem mais LARGO que essa proporção
    // (como um corte fixo de 56% da área teria dado aqui) sobra vão vazio
    // dos dois lados e faz a flor parecer pequena/perdida, mesmo centralizada
    // de verdade — por isso a largura do cartão do tabuleiro é calculada pra
    // encostar na forma da flor, não um percentual arbitrário da área.
    const RAZAO_LARGURA_ALTURA_FLOR = 5 / (2 * (DIST_FATOR + 1));
    const larguraTabuleiroIdeal = padTabuleiro * 2 + (areaAltura - padTabuleiro * 2) * RAZAO_LARGURA_ALTURA_FLOR;
    const larguraTabuleiro = Math.round(Math.min(larguraTabuleiroIdeal, (areaLargura - gapCartoes) * 0.62));
    const larguraBandeja = areaLargura - gapCartoes - larguraTabuleiro;

    this.area = new Node({ x: margemLateral, y: topo });
    this.adicionar(this.area);

    // ---------------------------------------------------------- tabuleiro
    this.area.adicionar(new Panel({ largura: larguraTabuleiro, altura: areaAltura, raio: 22 }));

    this.raioTabuleiro = Math.max(30, Math.min(
      (areaAltura - padTabuleiro * 2) / (2 * (DIST_FATOR + 1)),
      (larguraTabuleiro - padTabuleiro * 2) / 5,
    )) * ESCALA_PECAS_TABULEIRO;
    this.centroTabuleiro = { x: larguraTabuleiro / 2, y: areaAltura / 2 };

    this.tabuleiro = new Node();
    this.area.adicionar(this.tabuleiro);

    this.central = new Hexagono({
      x: this.centroTabuleiro.x, y: this.centroTabuleiro.y,
      raio: this.raioTabuleiro, numeros: NUMEROS_CENTRAL,
    });
    this.tabuleiro.adicionar(this.central);

    this.slots = SLOTS.map((def) => {
      const ang = (def.anguloGraus * Math.PI) / 180;
      const dist = this.raioTabuleiro * DIST_FATOR + FOLGA_ENTRE_PECAS;
      const x = this.centroTabuleiro.x + dist * Math.cos(ang);
      const y = this.centroTabuleiro.y + dist * Math.sin(ang);
      const contorno = new ContornoVazio({ x, y, raio: this.raioTabuleiro });
      contorno.alpha = this.nivel.contornosDiscretos ? 0.18 : 1;
      this.tabuleiro.adicionar(contorno);
      return { def, x, y, contorno, ocupada: false, peca: null };
    });

    // A central tem que ficar NA FRENTE dos contornos pontilhados (adicionados
    // depois dela, acima): como as duas encostam exatamente aresta com aresta
    // (sem vão), o traço tracejado do contorno vizinho bate bem em cima da
    // borda da central — sem isto, o tracejado ficava por cima, riscando a peça.
    this.central.paraFrente();

    // -------------------------------------------------------------- bandeja
    const xBandeja = larguraTabuleiro + gapCartoes;
    const padBandeja = 24;
    this.area.adicionar(new Panel({ x: xBandeja, largura: larguraBandeja, altura: areaAltura, raio: 22 }));
    // Primeira posição acima dos painéis e do tabuleiro. Quando uma peça
    // rejeitada volta da área de encaixe, ela deve ser reinserida daqui para
    // cima: visível sobre o cartão branco, mas atrás das outras peças e dos
    // botões de girar.
    this.indiceBasePecas = this.area.filhos.length;

    const gapGrade = 16;
    const larguraGrade = larguraBandeja - padBandeja * 2;
    const alturaGrade = areaAltura - padBandeja * 2;
    const colunas = this._melhorGradeColunas(larguraGrade, alturaGrade, SLOTS.length, gapGrade);
    const linhas = Math.ceil(SLOTS.length / colunas);
    const cellW = (larguraGrade - gapGrade * (colunas - 1)) / colunas;
    const cellH = (alturaGrade - gapGrade * (linhas - 1)) / linhas;
    // Todas as peças mantêm exatamente o mesmo tamanho da peça central. A
    // grade foi dimensionada para comportar esse raio, então não é necessário
    // reduzir na bandeja nem aumentar durante o encaixe.
    this.raioBandeja = this.raioTabuleiro;

    // A ORDEM na bandeja embaralha (posição), nunca os DADOS da peça — as 6
    // continuam sendo as mesmas 6 peças reais em todo nível.
    const ordem = this._embaralhar(SLOTS.map((_, i) => i));

    this.pecas = [];
    ordem.forEach((slotIndex, indice) => {
      const def = SLOTS[slotIndex];
      const col = indice % colunas;
      const lin = Math.floor(indice / colunas);
      const cellX = xBandeja + padBandeja + col * (cellW + gapGrade);
      const cellY = padBandeja + lin * (cellH + gapGrade);
      let cx = cellX + cellW / 2;
      let cy = cellY + cellH / 2;

      const peca = new Hexagono({
        x: cx, y: cy, raio: this.raioBandeja, numeros: def.numeros, interativo: true,
      });
      peca.slotCorreto = slotIndex;
      peca.trayX = cx;
      peca.trayY = cy;
      peca.colocada = false;
      peca.errosEncaixe = 0;

      // Nível fácil: a peça já nasce na rotação certa (só arrastar). Nos
      // outros dois, nasce embaralhada — a criança PRECISA girar primeiro.
      if (this.nivel.rotacaoAleatoria) {
        peca.passos = rand.inteiro(1, 5);
        peca.rotation = peca.passos * 60;
      }

      peca.on('apertar', (ponto) => this._pegarPeca(peca, ponto));
      this.area.adicionar(peca);

      // A aresta do hexágono na diagonal de 45° fica a ~0.9×raio do centro
      // (não 0.55× — essa conta errada botava o botão em cima do número da
      // própria peça). 0.98×raio deixa o botão encostado na quina, quase
      // todo por fora, tipo selo — só um pouco por cima do desenho.
      const ladoBotao = alvoAcessivel(56);
      const margemBotao = 12;
      // Se o selo ultrapassaria o cartão, desloca o conjunto inteiro para
      // dentro. Mover apenas o botão o aproximava demais da peça nas últimas
      // coluna e linha.
      const limiteCentroX = xBandeja + larguraBandeja - margemBotao - ladoBotao / 2;
      const limiteCentroY = areaAltura - margemBotao - ladoBotao / 2;
      const excessoX = Math.max(0, cx + this.raioBandeja * 0.98 - limiteCentroX);
      const excessoY = Math.max(0, cy + this.raioBandeja * 0.98 - limiteCentroY);
      cx -= excessoX;
      cy -= excessoY;
      peca.x = cx;
      peca.y = cy;
      peca.trayX = cx;
      peca.trayY = cy;

      const centroBotaoX = cx + this.raioBandeja * 0.98;
      const centroBotaoY = cy + this.raioBandeja * 0.98;
      const botaoGirar = new IconButton({
        icone: 'reiniciar',
        tamanho: ladoBotao,
        x: centroBotaoX - ladoBotao / 2,
        y: centroBotaoY - ladoBotao / 2,
        variante: 'suaveAzul',
        audio: this.audio,
        somToque: config.audio?.clique,
        aoTocar: () => this._girarPeca(peca),
      });
      this.area.adicionar(botaoGirar);
      peca.botaoGirar = botaoGirar;

      this.pecas.push(peca);
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

    // Celebra e deixa a montagem visível antes de abrir o resultado.
    this.placar.on('vitoria', () => {
      // `_encaixar` ainda move a última peça por 180 ms. A celebração só
      // começa depois que ela chegou exatamente ao centro do slot.
      Tween.de(this).esperar(220).chamar(() => this._celebrarConclusao());
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
    // A peça mantém o mesmo tamanho da central durante todo o arrasto.
    peca.scaleX = 1;
    peca.scaleY = 1;
    this._arrastando = peca;
    const errosParaDica = this.nivel.errosParaDica ?? 0;
    if (this.nivel.destacarSlotCorreto && peca.errosEncaixe >= errosParaDica) {
      const correto = this.slots[peca.slotCorreto];
      if (correto && !correto.ocupada) correto.contorno.dica = true;
    }
  }

  /** Raio de aceite de um lugar — mesmo raio usado pro ÍMÃ durante o arrasto. */
  _raioTolerancia() {
    return Math.max(36, this.raioTabuleiro * 0.6) * (this.nivel.tolerancia ?? 1);
  }

  /** Lugar vazio mais perto da peça agora, ou null se nenhum está dentro da tolerância. */
  _lugarMaisPerto(peca) {
    const raio = this._raioTolerancia();
    let melhor = null;
    let melhorDist = Infinity;
    for (const slot of this.slots) {
      if (slot.ocupada) continue;
      const d = Math.hypot(peca.x - slot.x, peca.y - slot.y);
      if (d <= raio && d < melhorDist) { melhorDist = d; melhor = slot; }
    }
    return melhor;
  }

  _moverArrasto(ponto) {
    const peca = this._arrastando;
    if (!peca) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    peca.x = local.x + this._deslocX;
    peca.y = local.y + this._deslocY;

    // Ímã: perto o bastante de QUALQUER lugar vazio, puxa suavemente pro
    // centro dele — ajuda quem não solta com precisão de pixel. Não indica
    // se aquele é o lugar CERTO pra esta peça (isso a criança descobre ao soltar).
    const slot = this._lugarMaisPerto(peca);
    if (this.nivel.contornosDiscretos) {
      for (const candidato of this.slots) {
        if (!candidato.ocupada) candidato.contorno.alpha = candidato === slot ? 1 : 0.18;
      }
    }
    if (slot) {
      const dx = slot.x - peca.x;
      const dy = slot.y - peca.y;
      const dist = Math.hypot(dx, dy);
      const raio = this._raioTolerancia();
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
    peca.scaleX = 1;
    peca.scaleY = 1;
    this._restaurarContornos();

    const slot = this._lugarMaisPerto(peca);
    if (slot && this._validarEncaixe(slot, peca)) {
      this._encaixar(peca, slot);
      return;
    }

    if (slot) {
      // Lugar certo geometricamente, número errado: pisca âmbar (nunca
      // vermelho — errar aqui só demora mais, não é punição) e volta.
      slot.contorno.piscarErro();
      this._tentativasErradas += 1;
      peca.errosEncaixe += 1;
      if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    }

    // `_pegarPeca` trouxe a peça pra FRENTE de tudo (`paraFrente`) pra ela
    // arrastar por cima de todo o resto. Na volta, recoloca acima dos painéis,
    // mas atrás das outras peças e dos botões. O índice 0 a esconderia sob o
    // cartão branco da bandeja.
    this.area.adicionarEm(this.indiceBasePecas, peca);

    Tween.removerDe(peca);
    Tween.para(peca, { x: peca.trayX, y: peca.trayY }, 220, Easing.suaveSaida);
  }

  /**
   * A peça encaixa em `slot`? Compara o número que toca a central E, pra
   * cada vizinho do anel que JÁ está colocado, o número que toca ele também
   * — as 6 e 9 contam como iguais (`normalizarNumero`, ver topo do arquivo).
   */
  _validarEncaixe(slot, peca) {
    const slotIndex = this.slots.indexOf(slot);
    // Cada peça possui uma única posição na solução. Aceitar apenas uma
    // coincidência com a central podia deixar a montagem sem saída.
    if (peca.slotCorreto !== slotIndex) return false;
    const tocaCentral = numeroEm(peca.numeros, slot.def.pieceJ, peca.passos);
    if (normalizarNumero(tocaCentral) !== normalizarNumero(NUMEROS_CENTRAL[slot.def.seedK])) return false;

    if (!this.nivel.validarVizinhos) return true;

    for (const par of ANEL) {
      let jPeca = null;
      let outroSlot = null;
      let jOutro = null;
      if (par.a === slotIndex) { jPeca = par.ja; outroSlot = this.slots[par.b]; jOutro = par.jb; }
      else if (par.b === slotIndex) { jPeca = par.jb; outroSlot = this.slots[par.a]; jOutro = par.ja; }
      else continue;

      if (!outroSlot.ocupada) continue;
      const valorPeca = normalizarNumero(numeroEm(peca.numeros, jPeca, peca.passos));
      const valorOutro = normalizarNumero(numeroEm(outroSlot.peca.numeros, jOutro, outroSlot.peca.passos));
      if (valorPeca !== valorOutro) return false;
    }
    return true;
  }

  _encaixar(peca, slot) {
    peca.colocada = true;
    peca.errosEncaixe = 0;
    peca.interativo = false;
    if (peca.botaoGirar) { peca.botaoGirar.visible = false; peca.botaoGirar.interativo = false; }
    slot.ocupada = true;
    slot.peca = peca;
    // O contorno pontilhado não faz mais falta (e o tracejado dele podia
    // "vazar" nas bordas da peça que assentou por cima) — some de vez.
    slot.contorno.visible = false;

    // Mantém explicitamente o mesmo tamanho da central. Como a bandeja já usa
    // `raioTabuleiro`, esta chamada apenas garante a geometria sincronizada e
    // não provoca aumento visual durante o encaixe.
    peca.definirRaio(this.raioTabuleiro);
    Tween.removerDe(peca);
    Tween.para(peca, { x: slot.x, y: slot.y }, 180, Easing.suaveSaida);

    if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
    this._colocadas += 1;
    this.placar.acertar(1);
    this._atualizarProgresso();
  }

  _girarPeca(peca) {
    if (this.pausada || this.placar.encerrado || peca.colocada || this._arrastando === peca) return;
    peca.passos = (peca.passos ?? 0) + 1;
    Tween.removerDe(peca);
    Tween.para(peca, { rotation: peca.passos * 60 }, 220, Easing.suaveSaida);
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
    this._restaurarContornos();
  }

  /** Remove dicas temporárias e recupera a aparência definida pelo nível. */
  _restaurarContornos() {
    for (const slot of this.slots) {
      slot.contorno.dica = false;
      if (!slot.ocupada) slot.contorno.alpha = this.nivel.contornosDiscretos ? 0.18 : 1;
    }
  }

  // ------------------------------------------------------------------ HUD

  _atualizarProgresso() {
    this.progressoTexto.texto = `${this._colocadas} / ${SLOTS.length} PEÇAS`;
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

  /**
   * Celebra sem desmontar o raciocínio visual: destaca cada peça em sequência,
   * pulsa a flor uma única vez e mantém a montagem parada antes do resultado.
   */
  _celebrarConclusao() {
    if (this._celebrando) return;
    this._celebrando = true;
    this.progressoTexto.texto = 'MUITO BEM!';

    // Garante coordenadas finais exatas antes de qualquer efeito visual.
    for (const slot of this.slots) {
      if (!slot.peca) continue;
      Tween.removerDe(slot.peca);
      slot.peca.x = slot.x;
      slot.peca.y = slot.y;
      slot.peca.scaleX = 1;
      slot.peca.scaleY = 1;
    }

    const pecasMontadas = [
      this.central,
      ...this.slots.map((slot) => slot.peca).filter(Boolean),
    ];

    pecasMontadas.forEach((peca, indice) => {
      Tween.removerDe(peca);
      Tween.de(peca)
        .esperar(indice * 380)
        .chamar(() => {
          if (this.config.audio?.progresso) {
            this.audio.efeito(this.config.audio.progresso, { volume: 0.32 });
          }
        })
        .entao({ brilho: 1, scaleX: 1.06, scaleY: 1.06 }, 240, Easing.suaveSaida)
        .entao({ brilho: 0, scaleX: 1, scaleY: 1 }, 360, Easing.suaveSaida);
    });

    // O destaque termina perto de 2,9 s; mantém apenas uma pausa curta antes
    // do resultado para a transição não parecer demorada.
    Tween.de(this).esperar(3200).chamar(() => this._terminar(true));
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

  /** Mesmo método do Dino: mais colunas cabendo sem cortar nem rolar, célula máxima. */
  _melhorGradeColunas(areaW, areaH, total, gap) {
    let melhorColunas = 1;
    let melhorPontuacao = -Infinity;
    for (let colunas = 1; colunas <= total; colunas++) {
      const linhas = Math.ceil(total / colunas);
      const cellW = (areaW - gap * (colunas - 1)) / colunas;
      const cellH = (areaH - gap * (linhas - 1)) / linhas;
      if (cellW <= 0 || cellH <= 0) continue;
      const pontuacao = Math.min(cellW, cellH);
      if (pontuacao > melhorPontuacao) { melhorPontuacao = pontuacao; melhorColunas = colunas; }
    }
    return melhorColunas;
  }

  /** Fisher-Yates completo — a ORDEM na bandeja pode embaralhar livre, é só posição. */
  _embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = rand.inteiro(0, i);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
}
