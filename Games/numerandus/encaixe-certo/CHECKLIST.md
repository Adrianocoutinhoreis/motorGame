# Checklist — Encaixe Certo

> Passos para este jogo ser considerado **concluído**.
> Slug: `encaixe-certo` · Criado em: 2026-09-11 · Motor: v1.3.5

## Revisão de 2026-09-14

Sessão de correções, sobre uma versão já redesenhada do jogo (layout do
tabuleiro/bandeja mudou de **lado a lado** para **topo/base**, e o limite de
onda de 4 para 3 pares — as seções 2/3 abaixo descrevem o layout ORIGINAL,
testado em 2026-09-11, e não foram reescritas linha a linha para a versão
atual). Ver `README.md` → "Ajustes de qualidade" para o detalhe de cada item:

- [x] Tolerância de encaixe recalibrada (media ~90% da largura da peça,
      medida e ajustada para ~65%) — `GameScene._dentroDaTolerancia`.
- [x] Tutorial (passo 2) só anima na lateral — não vaza mais da caixa da
      ilustração nem cobre o título/texto.
- [x] Tutorial sincronizado com as cores/estilo atuais do jogo real (corpo
      branco, soquete fantasma com "?", marcadores sem sobreposição).
- [x] Tela de resultado: bloco painel+botões centralizado como unidade
      (motor compartilhado, `engine/screens/ResultScreen.js`).
- [x] Corrigido bug de variável não declarada (`temaInterior`) no
      `ResultScreen.js` do motor — não afetava este jogo na prática, mas
      quebraria qualquer jogo sem `corCeuTopo`/`corCeuBase` próprios.
- [x] `dividirEmOndas` distribui por igual (era `3,3,1` no Difícil — a
      última onda com 1 par só não dava escolha nenhuma pro aluno; agora
      `3,2,2`, nunca menos de 2 pares por onda em nenhum nível).
- [x] `config.mostrarCronometro` (padrão `true`) liga/desliga o relógio ao
      vivo do HUD — testado nos dois estados, sem quebrar a partida.
- [x] Elenco de emoji rebalanceado: 1 bicho (gato) + 6 frutas/objetos
      redondos + 1 bola (era 5 bichos + 3 frutas).
- [x] Ímã de encaixe: dentro do raio de tolerância, a ficha é puxada suave
      pro centro do soquete a cada quadro do arrasto — ajuda motricidade
      fina (mão que treme, dedo maior que o alvo) sem revelar a resposta
      (uma ficha errada perto do soquete errado também é puxada; só o
      valor bater decide se trava). Testado: ímã reduz a distância antes de
      soltar, solta imprecisa (60% do raio) ainda encaixa, ficha errada
      puxada não trava nem soma erro.
- [x] Corrigida peça fora do lugar no ÚLTIMO encaixe de cada onda (corrida
      entre o tween de "encaixar" e a comemoração, que disparam no mesmo
      instante síncrono — ver README.md → "Ajustes de qualidade"). Testado:
      a última ficha de TODA onda, nos 3 níveis (6 ondas no total), nasce
      exatamente no soquete no mesmo tick do encaixe.
- [x] Regressão: `testes.mjs` (154/154), `verificar-independencia.mjs`
      (aprovado), suíte E2E de ponta a ponta (29/29) refeita depois de cada
      mudança acima.

---

## 1. Definição

- [x] Objetivo pedagógico: reconhecer a correspondência entre uma quantidade
      (contada em bichinhos/frutinhas) e o numeral que a representa —
      contagem 1:1 e reconhecimento numérico, não sequência nem operação.
- [x] Faixa etária: 4 a 7 anos.
- [x] Níveis definidos: **três** — Fácil (3 pares, 1 a 5, fileira arrumada),
      Médio (5 pares, 1 a 9, grade arrumada), Difícil (7 pares, 1 a 9,
      marcadores espalhados dentro da peça).
- [x] Condição de vitória: todos os pares da rodada encaixados. Sem derrota —
      quebra-cabeça solo (`config.registrarDerrota: false`).
- [x] `src/config.js` preenchido por inteiro.
- [x] Regras educacionais conferidas (RE-01 a RE-05):
  - [x] RE-01 — todo texto em CAIXA ALTA (`textoEmCaixaAlta: true`).
  - [x] RE-02 — **verificado, não assumido**: um encaixe na peça errada nunca
        vira erro no placar — a peça só não trava e volta pro próprio lugar
        na bandeja (testado via Playwright: `placar.erros` continua 0 depois
        de uma tentativa errada). `ScoreSystem.acertar(1)` só é chamado no
        exato momento em que um par TRAVA de verdade — nunca por tentativa.
  - [x] RE-03 — placar exibe a UNIDADE ("5 PARES", não "5 de 5") via
        `config.unidadePlacar: { singular: 'par', plural: 'pares' }`.
  - [x] RE-04 — estrelas calculadas pela `ResultScreen` a partir de
        `acertos`/`totalPerguntas` reais, sem escala própria do jogo.
  - [x] RE-05 — ajuda/pausa não custam a partida: `Tween.pausarTodos()` é
        chamado ANTES de abrir o painel de Pausa/Ajuda, e qualquer arrasto em
        andamento é cancelado (a peça volta pro lugar na bandeja) antes do
        véu subir — ver `GameScene._cancelarArrastoEmCurso`, testado via
        Playwright simulando um arrasto interrompido por `_pausar()`.

## 2. Telas & Layout

> O layout de cada tela foi desenhado e aprovado num mockup interativo antes
> desta implementação começar — o que está aqui é o que foi aprovado.

- [x] **Menu** com JOGAR e COMO JOGAR, tema `'quarto'` (a mesma lousa verde do
      Jogo da Ordenação, reaproveitada por pedido — ver
      `engine/ui/Background.js`). Título na `PlacaTituloQuarto` (cartão
      simples e neutro): o cenário carrega o tema, a placa não precisa repetir
      "madeira"/"quadro" como enfeite. (Um tema próprio `'oficina'`, bancada
      âmbar, foi tentado antes e removido do motor por pedido — nada mais
      referencia esse tema.)
- [x] **Tutorial** com **3 passos**, cada um com uma miniatura própria (não
      importa `GameScene`, de propósito): passo 1 mostra a peça-quantidade
      sozinha com o entalhe vazio; passo 2 anima o número deslizando da
      bandeja até o encaixe, em loop; passo 3 mostra 3 pares já encaixados.
- [x] **Seleção de Nível** com 3 cartões táteis (`LevelSelectScreen` padrão).
- [x] **Partida**: o tabuleiro de soquetes fica FIXO à ESQUERDA (1 posição
      por par, nunca muda de lugar); a bandeja de números soltos e
      embaralhados fica numa faixa mais estreita à DIREITA, empilhada
      verticalmente. Soquete-alvo mais próximo é destacado (anel branco)
      durante um arrasto — só posição, nunca revela se o valor bate.
- [x] **Layout LADO A LADO** (`PainelZona`, um branco pro tabuleiro e um
      âmbar mais enxuto pra bandeja): tentado primeiro empilhado (tabuleiro
      em cima, bandeja embaixo), depois lado a lado por pedido do humano
      (print de referência de proporção — tabuleiro ~78% da largura,
      bandeja ~22%). O lado a lado é estritamente melhor pro tamanho da
      peça: as duas áreas usam a ALTURA inteira em vez de dividi-la entre
      si, o que aproveita melhor a caixa 1280×720 (larga e baixa) —
      medido: peça de ~200px de largura nos níveis com mais de uma onda,
      contra ~174px na primeira tentativa lado a lado com proporção 68/32,
      e ~210px (o teto) no layout empilhado anterior. Corrige também um
      problema real visto jogando antes desta versão (print do humano):
      linhas incompletas do tabuleiro eram centralizadas cada uma por conta
      própria, e ficavam desalinhadas entre si (efeito "bagunçado"). Agora a
      grade inteira usa um único `inicioX`, então todas as linhas
      compartilham as mesmas colunas — previsibilidade que importa
      especialmente para o público neurodivergente da coleção. `w` (tamanho
      da peça) respeita TRÊS contas: a largura da faixa do tabuleiro, a
      altura que o tabuleiro precisa, e a altura que a bandeja precisa na
      faixa estreita dela — testado nos 3 níveis via Playwright.
- [x] **Pares em ONDAS de no máximo 4** (`GameScene.MAX_PARES_POR_ONDA`):
      achado jogando (print do humano, nível Difícil antes desta correção):
      caber 7-9 pares na tela ao mesmo tempo força cada peça pequena, e
      caber 7-9 marcadores DENTRO de uma peça pequena força cada marcador a
      ficar minúsculo — medido, 17px lógicos para um marcador de "7" ou "8"
      (~5px reais num celular comum, 390px de largura). Resolvido limitando
      quantos pares aparecem por vez: o nível continua valendo a mesma meta
      (3/5/7), só que em ondas — ao completar a onda visível, ela comemora e
      a próxima aparece. Isso garante peça e marcador GRANDES em qualquer
      nível, não é um ajuste específico pros 3 níveis de hoje. HUD mostra
      "X/Y" (pares encaixados do total) só quando o nível tem mais de uma
      onda, pra criança saber que tem mais vindo.
- [x] **Cronômetro ao vivo** no HUD, topo-centro — ícone de relógio + "mm:ss"
      em branco (`cores.superficie`): o tema `'quarto'` tem parede ESCURA no
      topo, mesmo padrão do Jogo da Ordenação. Só INFORMA, nunca cobra. Lê
      `game.tempoJogando` (getter público do motor).
- [x] **Pausa** enxuta: só CONTINUAR / COMEÇAR DE NOVO / SAIR — sem atalho de
      AJUDA dentro do painel, nem ícone de som (`mostrarSom: false`, já que o
      HUD atrás do véu sempre o mostra).
- [x] **Resultado** com estrelas + "N PARES" + **tempo da partida** (mm:ss,
      `config.mostrarTempo: true`).

## 3. As peças e o encaixe

- [x] **Peça-quantidade** (fixa): mostra `N` marcadores do mesmo emoji
      (elenco fixo 1↔9, ver README) — nunca o algarismo escrito.
- [x] **Peça-número** (arrastável): o algarismo grande, cor fixa por número
      (paleta lúdica do motor, `cores.ludica`).
- [x] **Encaixe geometricamente exato**: entalhe e nó nascem da MESMA curva
      bezier (`noParaCima`/`noParaBaixo` em `GameScene.js`), só percorrida em
      sentidos opostos — garante encaixe sem folga nem sobreposição (não é
      aproximação visual, é a mesma matemática dos dois lados).
- [x] **Marcadores de quantidade nunca se sobrepõem**: o tamanho de cada
      marcador nasce do espaço da própria célula de uma grade (no máximo 3
      por linha), não de uma fração fixa da peça — testado visualmente para
      1 a 9 (ver plano de design: bug de sobreposição encontrado e corrigido
      ANTES da implementação, nesta mesma base de código).
- [x] **Disposição 'espalhada'** (nível Difícil): cada marcador ganha um
      desvio fixo sorteado uma vez na criação da peça — nunca recalculado a
      cada quadro (senão os emojis "tremeriam").
- [x] Sorteio dos números e a ORDEM tanto no tabuleiro quanto na bandeja são
      embaralhamentos independentes — a posição nunca é uma dica.
- [x] Um encaixe errado (perto do soquete errado, ou longe de todos) só
      devolve a peça pro seu lugar na bandeja — nunca trava, nunca pontua.

## 4. Feedback e comemoração

- [x] **Comemoração única, quando todos os pares fecham**: cada quantidade e
      seu número saltam JUNTOS (mesmo deslocamento, mesmo instante) —
      separado, o salto abriria uma fresta visível entre as duas metades já
      fundidas (`GameScene._celebrarCompleto`).
- [x] Placar sem risco de "vencer" por engano: `ScoreSystem.acertar(1)` só é
      chamado no instante exato em que um par TRAVA — nunca por tentativa.

## 5. Som

- [x] `acertoSOS` — fim de partida (sempre vitória). Reaproveitado de outro
      jogo da coleção (mesmo arquivo, mesmo SHA-256).
- [x] `config.audio.clique: null` — SEM som de clique. Mesma decisão do Jogo
      da Ordenação: som só onde é gesto de jogo de verdade.
- [ ] **`soltar` (som de encaixe) ainda não gravado** — `config.audio.soltar: null`.
      O jogo funciona inteiro sem ele (feedback visual já existe).
- [ ] **`tutorialTela1/2/3` ainda não gravados** — `tutorial[].fala: null` nos
      3 passos. O tutorial funciona só com texto e ilustração.
- [ ] Sem música de fundo — nenhuma gravação própria ainda produzida para
      este jogo.

## 6. Contrato do AVA

| Campo | Significado | Observação |
|---|---|---|
| `acertos` | Pares encaixados | Igual à meta do nível — sem desconto (ver seção 1/RE-02: nenhuma tentativa é penalizada) |
| `erros` | Sempre 0 | Este jogo nunca conta erro — um encaixe errado não trava e não pontua |
| `totalPerguntas` | Pares da rodada | 3 (Fácil), 5 (Médio) ou 7 (Difícil) |
| `nivel` | Nível escolhido | `1`, `2` ou `3` |
| `jogo` | Slug estável | `encaixe-certo` |
| `vitoria` | Sempre `true` | Quebra-cabeça solo, sem derrota |
| `tempoSegundos` | Tempo jogando, medido pelo motor | Também aparece na `ResultScreen` (`config.mostrarTempo`) |

## 7. Verificação automatizada (feita nesta sessão)

- [x] `node tools/testes.mjs` — 154 passaram, 0 falharam (lógica do motor).
- [x] `node tools/verificar-independencia.mjs numerandus/encaixe-certo` — aprovado.
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/encaixe-certo` — 11 passaram,
      0 falharam (roda de fora do projeto, sem 404, sem dependência externa).
- [x] Playwright, ponta a ponta: menu → níveis → tutorial (3 passos, seta
      avança/volta) → partida nos 3 níveis (layout cabe na área nos três) →
      arrastar peça-número por cima do soquete ERRADO (não trava, não
      pontua) → arrastar cada peça pro soquete CERTO (trava, pontua) →
      vitória automática ao completar → tela de resultado com
      `acertos`/`erros`/`totalPerguntas`/`vitoria` corretos → ajuda em
      partida (abre/fecha, retoma) → pausar no meio de um arrasto (peça
      volta pro lugar, sem erro no console).
- [x] Playwright, ondas (Difícil, 7 pares em 2 ondas de 4+3): tamanho da peça
      medido (~200px) em AMBAS as ondas — nunca encolhe da primeira pra
      segunda; placar acumula certo entre ondas (4 acertos após a onda 1,
      7 no total); jogo continua em `jogando` entre ondas, só vai pro
      resultado depois da ÚLTIMA; payload final do AVA soma as duas ondas
      (`acertos: 7, totalPerguntas: 7`); HUD mostra "X/7" corretamente; nível
      Fácil (1 onda só) NÃO mostra "X/Y" (sem onda extra, não precisa).
- [x] Nenhum erro de console/página em nenhuma das cenas visitadas.

## Melhorias identificadas, ainda não feitas

1. Gravar e ligar o som de encaixe (`audio.soltar`) e a narração do tutorial
   (`tutorialTela1/2/3`) — seção 5.
2. Testar a renderização dos emojis nos tablets reais da escola (Android/
   Windows/iOS podem desenhar o mesmo emoji de forma um pouco diferente).
3. Numeração do nível (`LevelSelectScreen`, motor compartilhado) visivelmente
   fora do centro do emblema — identificado antes em outros jogos, não
   corrigido (afeta todos os jogos que usam a tela padrão).
