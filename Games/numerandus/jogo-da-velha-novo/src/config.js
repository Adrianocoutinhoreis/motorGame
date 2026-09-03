/**
 * config.js — o "formulário" do Jogo da Velha (contra a CPU).
 *
 * Diferente do protótipo original (`Aulas para Refazer/Jogo_da_velha`, série
 * Numerandus): lá eram dois jogadores humanos no mesmo aparelho, sem CPU e
 * sem registro no AVA. Aqui o aluno joga sozinho contra o computador, escolhe
 * a própria cor antes da partida (`src/scenes/EscolhaCorScreen.js`), e a
 * partida é UMA tentativa registrada — vitória, derrota ou empate.
 *
 * Leia junto: docs/CRIAR-JOGO.md, docs/CONTRATO-AVA.md e docs/STATES.md
 * (seção "3. Jogo da Velha").
 */
export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'jogo-da-velha-novo',
  titulo: 'Jogo da Velha',
  subtitulo: 'Escolha a dificuldade e vença o computador!',

  /**
   * Contexto pedagógico. Sem conteúdo numérico ou de letras de propósito — o
   * que esta atividade treina é antecipar a jogada do adversário, não é
   * contagem nem alfabetização (docs/STATES.md registra a mesma honestidade
   * sobre o protótipo original).
   */
  objetivo: 'Planejar a própria jogada e antecipar a jogada do adversário, num tabuleiro 3x3, '
    + 'em três níveis de dificuldade.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  /** Resolução lógica. O Stage escala para qualquer tamanho de iframe. */
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1220',

  /**
   * Tema 'quadro': um quadro-negro de sala de aula — o vocabulário visual do
   * próprio jogo da velha (giz, tabuleiro desenhado), em vez do campo aberto
   * genérico do template. Ver `engine/ui/Background.js` e a placa de título
   * correspondente em `engine/screens/MenuScreen.js`.
   */
  tema: 'quadro',

  /**
   * Regra RE-01 (docs/REGRAS-EDUCACIONAIS.md): todo texto exibido em CAIXA ALTA.
   */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * Três níveis, como os outros jogos do motor — mas aqui o que muda entre
   * eles não é o conteúdo (não há números nem letras neste jogo), é a FORÇA
   * da CPU. Em todo nível a partida vale **10 pontos** na vitória (`meta: 10`,
   * `pontosPorAcerto: 10` na cena) — não "1 ponto", que lia mal na tela de
   * resultado para uma partida com um resultado só. Uma derrota encerra de
   * imediato (`vidas: 1`) — não há "tentativas" dentro de uma partida de jogo
   * da velha.
   *
   * `chanceDeErroCPU` é a fração das vezes em que a CPU DEIXA DE bloquear uma
   * jogada vencedora do aluno, mesmo podendo bloquear — ela nunca deixa de
   * FECHAR uma vitória própria em nenhum nível, nem no Difícil. Decisão
   * pedagógica (docs/STATES.md): uma CPU perfeita nunca perde, e isso ensina
   * a criança a desistir. Mesmo no Difícil (0 de chance de erro) a CPU
   * continua batível: ela só reage a ameaças de UMA jogada, então um aluno que
   * armar duas ameaças ao mesmo tempo (um "garfo") ainda vence — ela não é uma
   * CPU perfeita de verdade, só uma que joga com atenção.
   *
   * Sem `amostra`: nos outros jogos ela prevê o CONTEÚDO do nível ("1 2 3 4
   * 5", "A E I O U"), e aqui o conteúdo não muda entre níveis — só a força da
   * CPU, que já está dita em `descricao`. Uma amostra que não mostra nada de
   * diferente entre os três cartões seria decoração vazia.
   */
  niveis: [
    {
      id: 1,
      nome: 'Fácil',
      descricao: 'A CPU erra bastante',
      cor: '#16A34A',
      meta: 10,
      vidas: 1,
      chanceDeErroCPU: 0.6,
    },
    {
      id: 2,
      nome: 'Médio',
      descricao: 'A CPU joga com atenção',
      cor: '#F59E0B',
      meta: 10,
      vidas: 1,
      chanceDeErroCPU: 0.3,
    },
    {
      id: 3,
      nome: 'Difícil',
      descricao: 'A CPU quase não erra',
      cor: '#DC2626',
      meta: 10,
      vidas: 1,
      chanceDeErroCPU: 0,
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * Passos do "como jogar". Servem às DUAS telas: o "COMO JOGAR" do menu e a
   * AJUDA dentro da partida (regra RE-05) — por isso também explicam o que
   * fazer para quem já está jogando e travou, não só quem nunca viu o jogo.
   *
   * **Sem mencionar X ou O.** O jogo não usa letras como marca — usa cores
   * (vermelho/azul), e a cor do aluno é uma ESCOLHA dele antes da partida
   * ("Escolha sua cor"), não uma cor fixa. Por isso o tutorial fala em "sua
   * cor"/"a cor do computador" de propósito, nunca cravando qual é qual: o
   * mesmo texto serve para quem escolheu vermelho e para quem escolheu azul.
   */
  tutorial: [
    {
      titulo: 'Escolha sua cor e toque em uma casa vazia',
      texto: 'No começo da partida, você escolhe sua cor. Depois, toque em uma casa vazia '
        + 'do tabuleiro para marcar sua jogada.',
      desenho: (ctx, l, a, t, loader) => desenharTabuleiroExemplo(ctx, l, a, { corA: [4] }, loader),
    },
    {
      titulo: 'O computador joga com a outra cor',
      texto: 'Depois da sua vez, o computador pensa um pouquinho e marca uma casa com a cor '
        + 'dele.',
      desenho: (ctx, l, a, t, loader) => desenharTabuleiroExemplo(ctx, l, a, { corA: [4], corB: [0] }, loader),
    },
    {
      titulo: 'Três da mesma cor em linha vence',
      texto: 'Três marcas da MESMA cor, em uma linha, coluna ou diagonal, vencem. Se o '
        + 'tabuleiro encher sem ninguém conseguir, é empate.',
      desenho: (ctx, l, a, t, loader) => desenharTabuleiroExemplo(ctx, l, a, {
        corA: [0, 4, 8], corB: [1, 2],
        linhaVencedora: [0, 4, 8],
      }, loader),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * As marcas do jogo reaproveitam a arte do protótipo original
   * (`Aulas para Refazer/Jogo_da_velha/assets/x.png` e `0.png`): dois
   * rostinhos redondos, vermelho e azul. Os ids aqui já são pela COR
   * (`pecaVermelha`/`pecaAzul`), não por X/O — o jogo não usa letra nenhuma
   * como marca. Origem e licença na tabela do README.md deste jogo.
   */
  assets: [
    { id: 'pecaVermelha', src: './assets/img/x.png' },
    { id: 'pecaAzul', src: './assets/img/o.png' },
  ],

  /**
   * Sem mascote neste jogo, em NENHUMA tela — decisão de projeto (pedido do
   * humano). `mascote: null` faria o motor cair na coruja vetorial padrão
   * (ver `mascoteVisivel` em `engine/ui/Mascot.js`); `telas: []` é como se diz
   * "em tela nenhuma" ao motor, sem precisar apagar o mascote tela por tela.
   */
  mascote: { telas: [] },

  /**
   * Mapa de sons. Todos `null` nesta primeira entrega — decisão consciente,
   * não esquecimento: a regra do motor é todo som vir de arquivo GRAVADO
   * (nunca sintetizado), e ainda não há gravação para este jogo. O jogo abre
   * em silêncio e o console nomeia o que falta, como qualquer outro jogo do
   * motor sem asset pronto.
   *
   * `empate` e `falaEmpate` são campos novos, lidos pela `ResultScreen` só
   * quando a partida termina em empate (extras.empate) — ver
   * engine/screens/ResultScreen.js.
   */
  audio: {
    musica: null,
    clique: null,
    acerto: null,
    erro: null,
    vitoria: null,
    derrota: null,
    empate: null,
    abertura: null,
    falaVitoria: null,
    falaDerrota: null,
    falaEmpate: null,
    escolhaCor: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Decisão do projeto: derrota também é uma tentativa e também é registrada. */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho auxiliar do tutorial. Fica aqui, junto do texto que explica.
// ---------------------------------------------------------------------------

/**
 * Tabuleiro 3x3 em miniatura, para o tutorial. `marcas` é
 * `{ corA: [indices], corB: [indices], linhaVencedora: [3 indices] }` — "A" e
 * "B" são só rótulos de posição no desenho, não "aluno"/"CPU": o tutorial não
 * afirma qual cor é de quem, porque isso é escolha do aluno.
 *
 * `loader` é opcional — o `TutorialScreen` passa o `Loader` da cena como 4º
 * argumento de `desenho`. Com ele, desenha as MESMAS imagens da partida
 * (`pecaVermelha`/`pecaAzul`); sem ele (ou se a imagem falhar), cai no traço
 * vetorial — o `Loader` nunca derruba o jogo por um recurso que faltou.
 */
function desenharTabuleiroExemplo(ctx, l, a, marcas = {}, loader = null) {
  const tamanho = 240;
  const celula = tamanho / 3;
  const x0 = l / 2 - tamanho / 2;
  const y0 = a / 2 - tamanho / 2;

  ctx.save();

  // Destaque estável (sem piscar) da linha vencedora, atrás das células.
  if (marcas.linhaVencedora) {
    const [ini, , fim] = marcas.linhaVencedora;
    const cx0 = x0 + (ini % 3) * celula + celula / 2;
    const cy0 = y0 + Math.floor(ini / 3) * celula + celula / 2;
    const cx1 = x0 + (fim % 3) * celula + celula / 2;
    const cy1 = y0 + Math.floor(fim / 3) * celula + celula / 2;
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx0, cy0);
    ctx.lineTo(cx1, cy1);
    ctx.stroke();
  }

  // Grade
  ctx.strokeStyle = '#1E3A8A';
  ctx.lineWidth = 6;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x0 + i * celula, y0);
    ctx.lineTo(x0 + i * celula, y0 + tamanho);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x0, y0 + i * celula);
    ctx.lineTo(x0 + tamanho, y0 + i * celula);
    ctx.stroke();
  }

  const centroDe = (i) => ({
    cx: x0 + (i % 3) * celula + celula / 2,
    cy: y0 + Math.floor(i / 3) * celula + celula / 2,
  });

  const imgVermelha = loader?.imagem('pecaVermelha');
  const imgAzul = loader?.imagem('pecaAzul');

  for (const i of marcas.corA ?? []) {
    const { cx, cy } = centroDe(i);
    const r = celula * 0.32;
    if (imgVermelha) {
      ctx.drawImage(imgVermelha, cx - r, cy - r, r * 2, r * 2);
    } else {
      // Círculo chapado, nunca um X: o jogo não usa letra como marca, nem
      // aqui na reserva do tutorial.
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const i of marcas.corB ?? []) {
    const { cx, cy } = centroDe(i);
    const r = celula * 0.32;
    if (imgAzul) {
      ctx.drawImage(imgAzul, cx - r, cy - r, r * 2, r * 2);
    } else {
      // Círculo chapado, nunca um O oco: mesmo motivo do vermelho, acima.
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
