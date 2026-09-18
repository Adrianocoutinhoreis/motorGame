import {
  Scene, Node, Shape, Sprite, TextNode, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, ScoreSystem, ESTADOS, rand, espaco,
} from '../../engine/index.js';

/**
 * Selo de contagem — o número de peças de uma coluna, ao lado do rótulo.
 *
 * Existe porque a pilha em leque (`_pilhaLateral`) aperta o passo entre peças
 * conforme a quantidade cresce — com 7, 8, 9 peças bem sobrepostas, contar de
 * olho na pilha fica ambíguo. Este selo nunca depende de contar: é a fonte
 * confiável ao lado do nome da coluna. Fica invisível com `valor` 0 (não
 * mostra "0" — cada coluna vazia é óbvia por estar vazia).
 */
class SeloContagem extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: 34, altura: 28 });
    this.valor = 0;
  }

  desenhar(ctx) {
    if (this.valor <= 0) return;
    const { largura: l, altura: a } = this;
    ctx.save();
    ctx.fillStyle = '#734D10';
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, a / 2);
    ctx.fill();
    ctx.fillStyle = '#FFF3D1';
    ctx.font = '700 17px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.valor), l / 2, a / 2 + 1);
    ctx.restore();
  }
}

/**
 * Botão de peça da bandeja (+1 / +10 / +100) — painel branco, a imagem real
 * da peça e o rótulo embaixo. Mesmo alvo de toque mínimo do motor (a
 * `largura`/`altura` do painel já nascem acima de 64px lógicos).
 */
class BotaoPeca extends Node {
  constructor(opcoes = {}) {
    const largura = opcoes.largura ?? 150;
    const altura = opcoes.altura ?? 150;
    super({
      ...opcoes, largura, altura, interativo: true,
    });
    this.imagem = opcoes.imagem ?? null;
    this.imgLargura = opcoes.imgLargura ?? 64;
    this.imgAltura = opcoes.imgAltura ?? 64;
    this.rotulo = opcoes.rotulo ?? '';
    this.aoTocar = opcoes.aoTocar ?? null;
    this.on('toque', () => this.aoTocar?.());
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#EAD9A8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, 16);
    ctx.fill();
    ctx.stroke();

    if (this.imagem) {
      const iw = this.imgLargura;
      const ih = this.imgAltura;
      ctx.drawImage(this.imagem, (l - iw) / 2, 14, iw, ih);
    }

    ctx.fillStyle = '#734D10';
    ctx.font = '700 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.rotulo, l / 2, a - 16);
    ctx.restore();
  }
}

/**
 * Painel do desafio: "MONTE 138" (ou "RESOLVA 23 + 12") de um lado, "=" no
 * meio, "VOCÊ FORMOU n" do outro — o número da direita fica verde quando bate
 * com o alvo, e é isso (mais o texto do Confirmar) que sinaliza acerto, nunca
 * SÓ a cor sozinha.
 */
class PainelDesafio extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes });
    this.rotulo = 'MONTE';
    this.textoDesafio = '';
    this.total = 0;
    this.bateu = false;
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const numeroY = a * 0.36 + 29;

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Antes vivia sobre um fundo creme/branco, então usava marrom escuro.
    // Com o fundo azul-marinho, o painel deixou de precisar de uma placa
    // própria por baixo (perderia contraste, não ganharia) — os textos vão
    // direto no fundo, com uma paleta clara/amarela pensada pra ESSE fundo
    // escuro (referência trazida pelo humano: rótulo cinza-azulado, alvo em
    // amarelo, total em branco).
    ctx.font = '700 23px system-ui, sans-serif';
    ctx.fillStyle = '#9FB3CC';
    ctx.fillText(this.rotulo, l * 0.24, a * 0.12);
    ctx.fillText('VOCÊ FORMOU', l * 0.76, a * 0.12);

    ctx.fillStyle = '#F5C542';
    ctx.font = '800 54px system-ui, sans-serif';
    ctx.fillText(this.textoDesafio, l * 0.24, numeroY);

    ctx.fillStyle = '#C3D2E3';
    ctx.font = '700 36px system-ui, sans-serif';
    ctx.fillText('=', l * 0.5, numeroY);

    ctx.fillStyle = this.bateu ? '#4ADE80' : '#FFFFFF';
    ctx.font = '800 54px system-ui, sans-serif';
    ctx.fillText(String(this.total), l * 0.76, numeroY);

    ctx.restore();
  }
}

/**
 * Desenha uma estrela de 5 pontas centrada em (cx, cy) — usada no selo de
 * progresso do HUD. `preenchida` decide a cor (dourada = rodada já
 * alcançada, apagada = ainda por vir); nunca é só a cor sozinha que
 * distingue, a própria forma preenchida/vazada já mostra isso de longe.
 */
function desenharEstrela(ctx, cx, cy, raioExterno, raioInterno, preenchida) {
  const pontos = 5;
  const passo = Math.PI / pontos;
  ctx.beginPath();
  for (let i = 0; i < pontos * 2; i++) {
    const r = i % 2 === 0 ? raioExterno : raioInterno;
    const ang = i * passo - Math.PI / 2;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = preenchida ? '#FBBF24' : 'rgba(255, 255, 255, 0.16)';
  ctx.strokeStyle = preenchida ? '#B8860B' : 'rgba(255, 255, 255, 0.32)';
  ctx.lineWidth = 1.2;
  ctx.fill();
  ctx.stroke();
}

/**
 * Relógio + progresso no HUD — só informativo, sem prazo.
 *
 * Era um selo sólido marrom-escuro com texto branco — o mesmo peso visual de
 * um botão importante, competindo com o painel do desafio logo abaixo dele
 * por atenção. Puramente informativo (nem tem ação nenhuma ao tocar), então
 * agora é um contorno claro, discreto, que não disputa a primeira olhada da
 * criança com o que realmente importa na tela.
 *
 * O progresso "X/Y" virou uma fileira de estrelas (pedido do humano, com
 * referência visual) — mais fácil de "ler de relance" numa criança pequena
 * do que uma fração, e cada estrela nova que acende toca `config.audio.progresso`
 * (ver `GameScene._avancarRodada`).
 */
class PainelRelogio extends Node {
  constructor(opcoes = {}) {
    super({
      ...opcoes, largura: opcoes.largura ?? 230, altura: opcoes.altura ?? 50,
    });
    this.texto = '0:00';
    this.progresso = { atual: 0, meta: 5 };
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    ctx.save();
    // Antes uma pill creme translúcida sobre fundo creme (mesma família de
    // cor) — sobre o azul-marinho agora precisa da lógica inversa: vidro
    // claro por cima do escuro, texto claro.
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, a / 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#DCE6F0';
    ctx.font = '700 21px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.texto, 18, a / 2 + 1);

    const { atual, meta } = this.progresso;
    const raioExterno = 9.5;
    const raioInterno = raioExterno * 0.42;
    const passoEstrela = 23;
    let cx = l - 18 - raioExterno - (meta - 1) * passoEstrela;
    for (let i = 0; i < meta; i++) {
      desenharEstrela(ctx, cx, a / 2, raioExterno, raioInterno, i < atual);
      cx += passoEstrela;
    }

    ctx.restore();
  }
}

// Tamanhos das peças na MESA (mesma escala lógica 1280x720 usada no protótipo
// de design revisado com o humano). A placa fica sem espaço entre os cubos
// (a borda de cada cubo desenha a grade) e achatada — sem inclinação 3D, só
// contorno, por pedido explícito.
const CENTENA_W = 190;
const CENTENA_H = 190;
const DEZENA_W = 128;
const DEZENA_H = 192;
const UNIDADE_W = 88;

// Ícones usados nos botões da bandeja (+1/+10/+100) — ainda menores que a
// peça na mesa, mas grandes o bastante pra se reconhecer de relance, não só
// um floquinho no meio do cartão branco.
const ICONE_CENTENA = 94;
const ICONE_DEZENA_W = 66;
const ICONE_DEZENA_H = 100;
const ICONE_UNIDADE = 94;

/**
 * GameScene — a partida do Material Dourado.
 *
 * Mecânica "contar e trocar": tocar soma cubinhos, e ao juntar 10 eles se
 * transformam SOZINHOS numa barrinha (e 10 barrinhas numa placa) — ninguém
 * decompõe um número de antemão, descobre contando e vendo a troca acontecer
 * na mesa. Os botões +10/+100 ficam disponíveis desde o início de cada
 * rodada (não atrás de uma "descoberta" da própria partida): a versão
 * anterior só liberava +10 depois que o total passasse de 10 NESTA partida, e
 * isso deixava o começo de toda rodada preso em tocar "+1" repetidamente
 * mesmo pra um alvo como 40 — o oposto de ajudar. +10 aparece em todo nível
 * (todo alvo de 2+ dígitos precisa de dezena); +100 só no nível Médio, o
 * único cujos alvos (100–999) de fato usam centena — nos níveis Fácil e
 * Difícil ela nunca seria útil, mostrá-la seria só confundir.
 *
 * Tocar numa peça já colocada na mesa desfaz ela (menos 100/10/1, dependendo
 * da coluna). As peças CENTENA/DEZENA ficam em leque lateral: cada peça nova
 * nasce um pouco à direita da anterior, na frente — e o passo encolhe
 * sozinho conforme a quantidade cresce, então de 1 a 9 peças sempre cabem na
 * coluna, nunca escondidas.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = this._criarPlacar();

    this.imgCentena = this.loader.imagem('imgCentena');
    this.imgDezena = this.loader.imagem('imgDezena');
    this.imgUnidade = this.loader.imagem('imgUnidade');

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo,
      corCeuBase: config.corCeuBase,
      mostrarDecoracoes: config.mostrarDecoracoes ?? false,
      // Faltava aqui — `Background` sempre caía no padrão `true` (a
      // prateleira de madeira do tema 'quarto') porque este `new Background`
      // nunca repassava `config.mostrarChao`, diferente das telas padrão do
      // motor (MenuScreen etc.), que já leem isso do config.
      mostrarChao: config.mostrarChao ?? true,
    }));

    // ------------------------------------------------------------- sorteio
    this._rodadas = this._gerarRodadas(this.nivel);
    this._rodadaIndex = 0;
    this._rodadaAtual = this._rodadas[0];
    this._total = 0;

    // Quais botões de peça fazem sentido NESTE nível — fixo pro nível
    // inteiro, não depende de nada que a criança já tenha feito na partida
    // (ver o comentário da classe). Difícil também nunca precisa de centena:
    // os resultados das contas de + e − ficam sempre abaixo de 100.
    this._mostrarDezena = true;
    this._mostrarCentena = this.nivel.id === 2;

    // Tentativas de Confirmar com o número errado — só DEMONSTRATIVO (igual
    // ao Encaixe Certo/Jogo da Memória): NUNCA chama `placar.errar()`, porque
    // isso descontaria a falha da nota final (RE-02) — e aqui a decisão é o
    // oposto, errar ao confirmar só demora mais, nunca perde nada.
    this._tentativasErradas = 0;

    // -------------------------------------------------------------- layout
    const margemLateral = 40;
    const gapColunas = 24;
    this._larguraColuna = (L - margemLateral * 2 - gapColunas * 2) / 3;
    this._xColuna = [0, 1, 2].map((i) => margemLateral + i * (this._larguraColuna + gapColunas));
    // O rótulo (CENTENA/DEZENA/UNIDADE) e o selo de contagem moraram numa
    // fileira própria ACIMA da caixa — uma faixa inteira só pra isso. Agora
    // vivem DENTRO da própria caixa, como um cabeçalho — a coluna lê como uma
    // coisa só (nome + contagem + conteúdo), não duas fileiras separadas, e a
    // fileira que sobrou virou altura a mais pra caixa (o fundo da caixa não
    // mudou de lugar, só o topo subiu).
    // Antes a mesa começava em 206 e a bandeja em 566 — um vão de ~96px
    // vazio entre o HUD (fileira única, termina em 110) e o topo da mesa, e
    // só 20px entre a mesa e a bandeja. Redistribuído pra um ritmo vertical
    // mais parecido (~50px de respiro em cada vão: HUD→mesa, mesa→bandeja,
    // bandeja→borda), visual mais harmônico (pedido do humano).
    this._yMesaTopo = 170;
    this._alturaMesa = 340;
    this._alturaCabecalho = 46;

    // ------------------------------------------------------------------ HUD
    // Uma fileira só no topo (pedido do humano, com referência visual):
    // relógio/estrelas à ESQUERDA · desafio (MONTE = VOCÊ FORMOU) no MEIO ·
    // ícones (pausa/ajuda/som) à DIREITA — três zonas separadas por uma
    // linha vertical fina, em vez de duas fileiras empilhadas (ícones+selo
    // numa, desafio bem maior noutra) competindo por atenção.
    const yLinhaHud = espaco.md;
    const alturaLinhaHud = 100;
    const larguraRelogio = 246;

    // Zona 3 (ícones) primeiro — as outras duas zonas encostam nela.
    const iconeLado = 64;
    const iconeGap = espaco.sm;
    const margemIcones = espaco.lg;
    const xIcone = (i) => L - margemIcones - (3 - i) * iconeLado - (3 - i - 1) * iconeGap;
    this.adicionar(new IconButton({
      icone: 'pausa',
      tamanho: iconeLado,
      x: xIcone(0),
      y: yLinhaHud,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._pausar(),
    }));
    this.adicionar(new IconButton({
      icone: 'tutorial',
      tamanho: iconeLado,
      x: xIcone(1),
      y: yLinhaHud,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._pedirAjuda(),
    }));
    this.adicionar(new SoundToggle({
      tamanho: iconeLado,
      audio: this.audio,
      x: xIcone(2),
      y: yLinhaHud,
      somToque: config.audio?.clique,
    }));

    // Zona 1 (relógio/estrelas), encostada na margem esquerda da mesa. Um
    // pouco mais baixa que o topo da fileira (pedido do humano) — sozinha
    // ali, alinhada só com o topo, sobrava "flutuando" alta demais acima do
    // resto do conteúdo da linha (que é mais baixo, ex.: os números do
    // desafio).
    this._relogio = config.mostrarCronometro === false ? null : new PainelRelogio({
      x: margemLateral,
      y: yLinhaHud + 20,
      largura: larguraRelogio,
    });
    if (this._relogio) this.adicionar(this._relogio);
    this._relogioSegundoMostrado = -1;

    // Linhas divisórias entre as 3 zonas — só um traço fino e claro, não
    // uma borda pesada disputando atenção com o conteúdo.
    const xDivisor1 = margemLateral + larguraRelogio + espaco.lg;
    const xDivisor2 = xIcone(0) - espaco.lg;
    const divisor = (x) => new Shape({
      x, y: yLinhaHud + (alturaLinhaHud - 70) / 2, largura: 2, altura: 70,
      forma: 'retangulo',
      preenchimento: 'rgba(255, 255, 255, 0.18)',
    });
    this.adicionar(divisor(xDivisor1), divisor(xDivisor2));

    // Zona 2 (desafio), entre as duas divisórias.
    this.painelDesafio = new PainelDesafio({
      x: xDivisor1 + espaco.md,
      y: yLinhaHud,
      largura: xDivisor2 - xDivisor1 - espaco.md * 2,
      altura: alturaLinhaHud,
    });
    this.adicionar(this.painelDesafio);

    // ------------------------------------------------------------------ mesa
    // Um painel por coluna (a "bandeja" onde as peças pousam) — sem ele a
    // coluna vazia (rodada recém-começada, total 0) era só um vão em branco,
    // sem nada dizendo "aqui é onde as peças vão aparecer".
    const painelColuna = (x) => new Shape({
      x,
      y: this._yMesaTopo,
      largura: this._larguraColuna,
      altura: this._alturaMesa,
      forma: 'retangulo',
      raio: 20,
      preenchimento: '#FFFDF8',
      contorno: '#EAD9A8',
      espessura: 2,
    });
    this.adicionar(painelColuna(this._xColuna[0]), painelColuna(this._xColuna[1]), painelColuna(this._xColuna[2]));

    this._colCentena = new Node({ x: this._xColuna[0], y: this._yMesaTopo });
    this._colDezena = new Node({ x: this._xColuna[1], y: this._yMesaTopo });
    this._colUnidade = new Node({ x: this._xColuna[2], y: this._yMesaTopo });
    this.adicionar(this._colCentena, this._colDezena, this._colUnidade);

    this._rotuloCentena = new TextNode('CENTENA', this._estiloRotuloColuna(this._xColuna[0]));
    this._rotuloDezena = new TextNode('DEZENA', this._estiloRotuloColuna(this._xColuna[1]));
    this._rotuloUnidade = new TextNode('UNIDADE', this._estiloRotuloColuna(this._xColuna[2]));
    this.adicionar(this._rotuloCentena, this._rotuloDezena, this._rotuloUnidade);

    // Selo de contagem, encostado à direita do rótulo (que está centralizado
    // na coluna) — sem `x`, o Node nascia em 0 e desenhava no canto da tela.
    const xSelo = (i) => this._xColuna[i] + this._larguraColuna / 2 + 48;
    const ySelo = this._yMesaTopo + 15;
    this._seloCentena = new SeloContagem({ x: xSelo(0), y: ySelo });
    this._seloDezena = new SeloContagem({ x: xSelo(1), y: ySelo });
    this._seloUnidade = new SeloContagem({ x: xSelo(2), y: ySelo });
    this.adicionar(this._seloCentena, this._seloDezena, this._seloUnidade);

    // -------------------------------------------------------------- bandeja
    // As peças da bandeja cresceram (150px) — reduzido um pouco pra não
    // sobrar só ~20px até a borda inferior da tela como antes.
    const yBandeja = 540;
    this._removerCentena = () => this._removerPeca('centena');
    this._removerDezena = () => this._removerPeca('dezena');
    this._removerUnidade = () => this._removerPeca('unidade');

    this.botaoMais1 = new BotaoPeca({
      y: yBandeja,
      imagem: this.imgUnidade,
      imgLargura: ICONE_UNIDADE,
      imgAltura: ICONE_UNIDADE,
      rotulo: '+1',
      aoTocar: () => this._adicionar(1),
    });
    this.botaoMais10 = new BotaoPeca({
      y: yBandeja,
      imagem: this.imgDezena,
      imgLargura: ICONE_DEZENA_W,
      imgAltura: ICONE_DEZENA_H,
      rotulo: '+10',
      aoTocar: () => this._adicionar(10),
    });
    this.botaoMais100 = new BotaoPeca({
      y: yBandeja,
      imagem: this.imgCentena,
      imgLargura: ICONE_CENTENA,
      imgAltura: ICONE_CENTENA,
      rotulo: '+100',
      aoTocar: () => this._adicionar(100),
    });
    this.botaoConfirmar = new Button({
      y: yBandeja + 27,
      largura: 250,
      altura: 96,
      tamanhoTexto: 30,
      rotulo: 'CONFIRMAR',
      variante: 'sucesso',
      audio: this.audio,
      aoTocar: () => this._confirmar(),
    });
    this.adicionar(this.botaoMais1, this.botaoMais10, this.botaoMais100, this.botaoConfirmar);

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

    this.placar.on('vitoria', () => this._terminar(true));

    this._reconstruirMesa();
    this._atualizarDesafio();
    this._atualizarBandeja();
    this._atualizarTextoHud();
  }

  _estiloRotuloColuna(x) {
    return {
      x: x + this._larguraColuna / 2,
      y: this._yMesaTopo + 18,
      tamanho: 17,
      peso: '700',
      cor: '#734D10',
      alinhamento: 'center',
    };
  }

  _criarPlacar() {
    return new ScoreSystem({ total: this.nivel.meta ?? 5, nivel: this.nivel.id ?? 1 });
  }

  // -------------------------------------------------------------- sorteio

  _gerarRodadas(nivel) {
    const total = nivel.meta ?? 5;
    const rodadas = [];
    for (let i = 0; i < total; i++) {
      if (nivel.id === 3) {
        rodadas.push(this._gerarEquacao());
      } else if (nivel.id === 2) {
        const alvo = rand.inteiro(100, 999);
        rodadas.push({ alvo, textoDesafio: String(alvo), rotuloDesafio: 'MONTE' });
      } else {
        const alvo = rand.inteiro(11, 99);
        rodadas.push({ alvo, textoDesafio: String(alvo), rotuloDesafio: 'MONTE' });
      }
    }
    return rodadas;
  }

  /**
   * Nível Difícil: uma conta de soma ou subtração SEM reagrupamento (mesmo
   * espírito do vídeo de referência — nunca "vai um"/"empresta um"). A
   * criança monta o RESULTADO com a mesma mecânica de contar e trocar; as
   * parcelas nunca precisam ser decompostas.
   */
  _gerarEquacao() {
    if (rand.chance(0.5)) {
      for (let tentativa = 0; tentativa < 30; tentativa++) {
        const a = rand.inteiro(10, 79);
        const unidadesA = a % 10;
        const dezenasBMax = Math.max(0, Math.min(8, Math.floor((98 - a) / 10)));
        const dezenasB = rand.inteiro(0, dezenasBMax);
        const unidadesB = rand.inteiro(0, 9 - unidadesA);
        const b = dezenasB * 10 + unidadesB;
        if (b >= 1 && a + b < 100) {
          return { alvo: a + b, textoDesafio: `${a} + ${b}`, rotuloDesafio: 'RESOLVA' };
        }
      }
      return { alvo: 35, textoDesafio: '23 + 12', rotuloDesafio: 'RESOLVA' };
    }
    for (let tentativa = 0; tentativa < 30; tentativa++) {
      const a = rand.inteiro(20, 99);
      const unidadesA = a % 10;
      const dezenasBMax = Math.max(0, Math.floor(a / 10) - 1);
      const dezenasB = rand.inteiro(0, dezenasBMax);
      const unidadesB = rand.inteiro(0, unidadesA);
      const b = dezenasB * 10 + unidadesB;
      if (b >= 1 && b < a) {
        return { alvo: a - b, textoDesafio: `${a} − ${b}`, rotuloDesafio: 'RESOLVA' };
      }
    }
    return { alvo: 11, textoDesafio: '23 − 12', rotuloDesafio: 'RESOLVA' };
  }

  // ----------------------------------------------------------------- mesa

  _limparColuna(coluna) {
    for (const filho of [...coluna.filhos]) filho.destruir();
  }

  /**
   * Leque lateral: a peça `i` nasce deslocada `i*passo` à direita da
   * anterior, na FRENTE (adicionada por último = desenhada por cima). O
   * passo normal é `passoBase`, mas se não couberem todas dentro da largura
   * disponível nesse passo, ele encolhe sozinho até caber — assim de 1 a 9
   * peças sempre ficam visíveis dentro da coluna, nunca escondidas nem
   * empurrando a coluna pra fora da tela.
   */
  _pilhaLateral(container, imagem, imgW, imgH, qtd, passoBase, aoRemover) {
    if (qtd <= 0) return;
    const margem = 16;
    const larguraDisponivel = this._larguraColuna - margem * 2;
    const passo = qtd <= 1 ? 0 : Math.min(passoBase, (larguraDisponivel - imgW) / (qtd - 1));
    for (let i = 0; i < qtd; i++) {
      const peca = new Sprite(imagem, {
        largura: imgW,
        altura: imgH,
        interativo: true,
        x: margem + i * passo,
        y: this._alturaMesa - imgH - margem,
      });
      peca.on('toque', aoRemover);
      container.adicionar(peca);
    }
  }

  /** Unidade: grade simples (sem sobreposição — só 9 no máximo, cabe fácil). */
  _grade(container, imagem, tam, qtd, aoRemover) {
    const margem = 16;
    const gap = 10;
    const porLinha = Math.max(1, Math.floor((this._larguraColuna - margem * 2) / (tam + gap)));
    for (let i = 0; i < qtd; i++) {
      const col = i % porLinha;
      const linha = Math.floor(i / porLinha);
      const peca = new Sprite(imagem, {
        largura: tam,
        altura: tam,
        interativo: true,
        x: margem + col * (tam + gap),
        // `_alturaCabecalho`: o rótulo/selo agora moram DENTRO da caixa, no
        // topo — sem esse deslocamento os cubinhos da grade (que começam do
        // topo, diferente do leque da centena/dezena, ancorado embaixo)
        // nasceriam por baixo do texto do cabeçalho.
        y: this._alturaCabecalho + margem + linha * (tam + gap),
      });
      peca.on('toque', aoRemover);
      container.adicionar(peca);
    }
  }

  _reconstruirMesa() {
    this._limparColuna(this._colCentena);
    this._limparColuna(this._colDezena);
    this._limparColuna(this._colUnidade);

    const centena = Math.floor(this._total / 100);
    const dezena = Math.floor((this._total % 100) / 10);
    const unidade = this._total % 10;

    this._pilhaLateral(this._colCentena, this.imgCentena, CENTENA_W, CENTENA_H, centena, 60, this._removerCentena);
    this._pilhaLateral(this._colDezena, this.imgDezena, DEZENA_W, DEZENA_H, dezena, 46, this._removerDezena);
    this._grade(this._colUnidade, this.imgUnidade, UNIDADE_W, unidade, this._removerUnidade);

    this._seloCentena.valor = centena;
    this._seloDezena.valor = dezena;
    this._seloUnidade.valor = unidade;
  }

  // -------------------------------------------------------------- bandeja

  _atualizarBandeja() {
    this.botaoMais10.visible = this._mostrarDezena;
    this.botaoMais10.interativo = this._mostrarDezena;
    this.botaoMais100.visible = this._mostrarCentena;
    this.botaoMais100.interativo = this._mostrarCentena;

    const todos = [this.botaoMais1];
    if (this._mostrarDezena) todos.push(this.botaoMais10);
    if (this._mostrarCentena) todos.push(this.botaoMais100);
    todos.push(this.botaoConfirmar);

    const gap = 32;
    const larguraTotal = todos.reduce((soma, b) => soma + b.largura, 0) + gap * (todos.length - 1);
    let x = (this.largura - larguraTotal) / 2;
    for (const botao of todos) {
      // `Button` (o Confirmar) guarda `regX = largura/2` e já soma isso ao
      // `x` NO CONSTRUTOR, então o próprio `.x` dele passa a significar
      // "centro", não mais "borda esquerda" — reposicionar como se fosse
      // borda esquerda (o que `BotaoPeca` de fato é, com `regX` 0) sobrepunha
      // o Confirmar por cima do botão anterior. Somar `regX` aqui devolve a
      // mesma semântica de "borda esquerda" pros dois tipos de botão.
      botao.x = x + (botao.regX || 0);
      x += botao.largura + gap;
    }
  }

  // -------------------------------------------------------------- desafio

  _atualizarDesafio() {
    const bateu = this._total === this._rodadaAtual.alvo;
    this.painelDesafio.rotulo = this._rodadaAtual.rotuloDesafio;
    this.painelDesafio.textoDesafio = this._rodadaAtual.textoDesafio;
    this.painelDesafio.total = this._total;
    this.painelDesafio.bateu = bateu;

    this.botaoConfirmar.cor = bateu ? '#16A34A' : '#E5D9BE';
    this.botaoConfirmar.corTexto = bateu ? '#FFFFFF' : '#92702B';
    this.botaoConfirmar.corBorda = bateu ? '#0F7A36' : '#C9B98A';
  }

  // -------------------------------------------------------------- ações

  _adicionar(delta) {
    if (this.placar.encerrado || this.pausada) return;
    this._total = Math.min(999, this._total + delta);
    if (this.config.audio?.clique) this.audio.efeito(this.config.audio.clique);
    this._reconstruirMesa();
    this._atualizarDesafio();
  }

  _removerPeca(tipo) {
    if (this.placar.encerrado || this.pausada) return;
    const delta = tipo === 'centena' ? 100 : tipo === 'dezena' ? 10 : 1;
    this._total = Math.max(0, this._total - delta);
    this._reconstruirMesa();
    this._atualizarDesafio();
  }

  _confirmar() {
    if (this.placar.encerrado || this.pausada) return;
    const bateu = this._total === this._rodadaAtual.alvo;

    if (bateu) {
      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
      this.placar.acertar(1);
      if (!this.placar.encerrado) {
        Tween.de(this).esperar(900).chamar(() => this._avancarRodada());
      }
      return;
    }

    // Errar aqui só demora mais — sem mensagem, sem desconto (ver
    // `_tentativasErradas`, escrito no `erros` do AVA por fora do
    // `ScoreSystem`). O painel do desafio já mostra "VOCÊ FORMOU" em cor
    // diferente quando bate, e o Confirmar muda de cor/estado — o retorno
    // continua existindo, só não tem mais uma frase embaixo da tela.
    if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);
    this._tentativasErradas += 1;
  }

  _avancarRodada() {
    this._rodadaIndex += 1;
    if (this.config.audio?.progresso) this.audio.efeito(this.config.audio.progresso);
    if (this._rodadaIndex >= this._rodadas.length) return;
    this._rodadaAtual = this._rodadas[this._rodadaIndex];
    this._total = 0;
    this._reconstruirMesa();
    this._atualizarDesafio();
    this._atualizarBandeja();
    this._atualizarTextoHud();
  }

  // ------------------------------------------------------------------ HUD

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
    this._atualizarRelogio();
  }

  _atualizarRelogio() {
    const total = Math.floor(this.game.tempoJogando);
    if (total === this._relogioSegundoMostrado) return;
    this._relogioSegundoMostrado = total;
    this._atualizarTextoHud();
  }

  _atualizarTextoHud() {
    if (!this._relogio) return;
    const total = Math.max(0, this._relogioSegundoMostrado);
    const min = Math.floor(total / 60);
    const seg = total % 60;
    this._relogio.texto = `${min}:${String(seg).padStart(2, '0')}`;
    this._relogio.progresso = { atual: this._rodadaIndex + 1, meta: this._rodadas.length };
  }
}
