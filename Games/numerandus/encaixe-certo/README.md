# Encaixe Certo

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `encaixe-certo`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-09-11
- **Pasta:** `Games/numerandus/encaixe-certo/` — dentro da coleção Numerandus.

## O que é

Um jogo de correspondência número↔quantidade, com peças de quebra-cabeça de
verdade. Cada rodada sorteia alguns números (1 a 5 no Fácil, 1 a 9 nos outros
dois) e mostra duas metades separadas: a **peça-quantidade** (fixa no
tabuleiro, mostra `N` marcadores — sempre o mesmo bichinho ou fruta para
aquele número, nunca o algarismo) e a **peça-número** (solta numa bandeja
embaralhada, com o algarismo grande). O aluno **arrasta** o número certo até
perto da peça-quantidade certa; perto o bastante e com o valor batendo, a
peça é puxada pro lugar e **trava** — como um encaixe de quebra-cabeça de
verdade, sem folga. Perto do soquete errado, ou longe de todos, a peça só
volta para o próprio lugar na bandeja — nunca conta contra o aluno.

Baseado no vídeo de referência (`numerandus/finalizados/1ano/encaixe_certo`) e
no projeto-fonte `Videos_Numerandus/encaixe_certo/src/EncaixeCerto.tsx`, que
documentam a mecânica original (peças com entalhe/nó, ilustração de um lado,
numeral do outro). O **layout, a paleta, o elenco temático de emojis e a
curva do encaixe foram desenhados e aprovados num plano visual** (mockup
interativo) antes desta implementação começar.

**Elenco temático fixo, 1 a 9** — cada número tem sempre a mesma figura, pra
criança aprender a reconhecer o número pela figura, não só contar:

🍓 morango · 🍎 maçã · 🍊 laranja · 🍋 limão · 🍇 uva · 🍒 cereja · ⚽ bola ·
🐱 gato · ⭐ estrela — maioria frutinha/objeto redondo, de propósito: um rosto
de bicho tem silhueta mais irregular que uma fruta ou bola, mais difícil de
diferenciar rápido numa peça pequena (era 5 bichos pra 3 frutas; agora é 1
bicho pra 6 frutas + 1 bola).

**Três níveis**, mesma mecânica em todos — a dificuldade cresce em três eixos
(quantos pares por rodada, até que número vai, e como os marcadores de
quantidade aparecem dentro da peça):

- **Nível 1 (Fácil):** 3 pares, números 1 a 5, marcadores em fileira arrumada.
- **Nível 2 (Médio):** 5 pares, números 1 a 9, marcadores em grade arrumada.
- **Nível 3 (Difícil):** 7 pares, números 1 a 9, marcadores **espalhados**
  dentro da peça — exige contar um a um, não só reconhecer o padrão de
  relance.

**Os pares aparecem em ONDAS de no máximo 3 por vez** (`GameScene.MAX_PARES_POR_ONDA`),
nunca todos de uma vez — mesmo num nível com 7 pares no total. Achado jogando
(print do humano): caber 7-9 pares na tela ao mesmo tempo força cada peça
pequena, e caber 7-9 marcadores DENTRO de uma peça pequena força cada
marcador a ficar minúsculo (chegou a 17px lógicos medidos, ~5px reais num
celular comum) — péssimo para o público neurodivergente da coleção. Limitar
quantos pares aparecem por vez resolve isso de raiz: a meta do nível continua
valendo para a pontuação (`nivel.meta`), só não aparece de uma vez só. Quando
a onda visível termina, ela comemora e a próxima aparece — até completar a
meta do nível.

**As ondas são DISTRIBUÍDAS por igual, nunca cortadas em fatias fixas**
(`dividirEmOndas`): 7 pares no Difícil viravam `3, 3, 1` — a última onda
sobrava com um par SÓ, e com um par só na tela não existe escolha nenhuma
(um soquete, uma ficha, sempre o par certo, sem alternativa pra comparar ou
errar). Agora vira `3, 2, 2`: toda onda, em qualquer nível, tem pelo menos 2
pares — uma escolha de verdade entre pelo menos duas fichas.

**É um quebra-cabeça solo — nunca há derrota.** Um encaixe errado nunca é
"erro" no placar: só não trava. Não existe cronômetro regressivo nem "game
over". Quando uma onda termina, cada quantidade e seu número saltam juntos (a
peça já está fundida); se era a última onda do nível, vai para a tela de
resultado — senão, a próxima onda aparece.

## O encaixe — a peça de verdade

O entalhe da peça-quantidade e o nó da peça-número nascem da **mesma curva
bezier** (`GameScene.js`: `noParaCima`/`noParaBaixo`), só percorrida em
sentidos opostos — uma vez cortando pra dentro, outra vez sobrando pra fora.
É isso que garante o encaixe **sem folga nem sobreposição**: não são duas
formas parecidas desenhadas cada uma por conta própria, é uma forma só.

## Layout da partida

Tabuleiro (peças-quantidade) em cima, bandeja (fichas-número) embaixo, cada
um no seu próprio cartão (`PainelZona` creme para o tabuleiro, âmbar mais
enxuto para a bandeja) — os dois centralizados verticalmente entre o HUD e a
prateleira do tema `'quarto'`. O tamanho da peça (`w`/`h` em `_construirOnda`)
respeita a largura disponível E a altura que tabuleiro e bandeja precisam,
então nunca estoura pra fora do cartão nem encolhe além do piso de 135px.

## Como rodar localmente

```bash
node tools/serve.mjs
```

Abra: `http://localhost:8080/Games/numerandus/encaixe-certo/`

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao completar todos os pares (sempre vitória), o jogo emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 5,             // pares encaixados — SEMPRE cheio, nunca descontado
  erros: 2,               // tentativas com valor ERRADO perto de um soquete de verdade
  totalPerguntas: 5,      // pares da rodada (3, 5 ou 7, conforme o nível)
  nivel: 2,
  jogo: "encaixe-certo",
  vitoria: true,          // sempre — este jogo não tem derrota
  tempoSegundos: 38,
  ajuda: 0,
}
```

`erros` conta só quando a ficha é solta perto o bastante de um soquete vazio
de VERDADE (`_dentroDaTolerancia`) mas com o valor errado — uma tentativa
real, não uma solta longe de qualquer soquete (motricidade imprecisa não é
um palpite). **Decisão explícita do humano: `erros` é só demonstrativo, sem
desconto nenhum.** A regra RE-02 (a nota desconta a falha na vitória) NÃO se
aplica a este campo aqui: 2 tentativas erradas seguidas de todos os pares
certos reporta `acertos: 5` (cheio) e `erros: 2` (só pra registro) — nunca
`acertos: 3`. Por isso `GameScene` nunca chama `placar.errar()` (que
acionaria o desconto do `ScoreSystem`); a contagem vive num contador próprio
da cena e só é escrita no campo `erros` da mensagem final, por fora do
`ScoreSystem`. O erro nunca aparece durante a partida (a HUD só mostra
`acertos`/`total`) nem na tela de resultado (que lê só `acertos`/
`totalPerguntas`, nunca `erros` — RE-04) — só o relatório passa a saber
quantas tentativas erradas aconteceram.

A tela final mostra "N ACERTOS" (não "N pontos" nem "N pares") via
`config.unidadePlacar: { singular: 'acerto', plural: 'acertos' }`, e também
o **tempo da partida** (mm:ss) — campo opcional em `ResultScreen`
(`config.mostrarTempo: true`).

O mesmo tempo já aparece AO VIVO durante a partida: um cronômetro no HUD
(topo-centro, ícone de relógio + "mm:ss"), puramente informativo — sem prazo,
sem cor de alerta. Lê `this.game.tempoJogando` (getter público do motor), o
mesmo contador que já existia por trás do `tempoSegundos` do AVA — por isso
congela sozinho durante Pausa e Ajuda, sem lógica de pausa própria do jogo.

Esse relógio ao vivo é opcional: `config.mostrarCronometro: false` tira o
badge do HUD por completo (junto com o "X/Y" de progresso entre ondas, que
mora no mesmo indicador) — pra quem preferir não incentivar pressa em quem
ainda está aprendendo a contar. Independente de `mostrarTempo` (a linha na
tela de RESULTADO), que continua existindo mesmo com o relógio ao vivo
desligado.

**Sobre `erros`: ver "Registro no AVA", acima.** Conta tentativas com valor
errado perto de um soquete real, mas é só demonstrativo — nunca desconta a
nota nem trava a peça no lugar errado; ela só não trava e volta pro próprio
lugar na bandeja.

## Estrutura

```
encaixe-certo/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       └── GameScene.js   as peças, o arrastar, o encaixe e a pontuação
├── assets/         áudio (tudo local)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/audio/acertoSOS.wav` | efeito de fim de partida — vitória (id `acertoSOS`) | Aula original 870298 — Educandus. Mesmo arquivo (mesmo SHA-256) do Jogo das Formas/Blocos/Cores/Bingo/Jogo da Velha/Jogo da Ordenação. Ficha: `assets/audio-transcricao/acertoSOS/transcricao.md`. Não há `erroSOS`: este jogo nunca tem derrota. |
| `assets/audio/tela1.wav`, `tela2.wav`, `tela3.wav` | narração dos 3 passos do tutorial (ids `tutorialTela1/2/3`) | Gravação própria deste jogo. Tocada pelo `TutorialScreen` compartilhado (`audio.falar()`) tanto no "COMO JOGAR" do menu quanto na ajuda dentro da partida (RE-05). |
| `assets/audio/soltar_peca.mp3` | som de encaixe — trava do par certo (id `soltarPeca`) | Mesmo arquivo (mesmo SHA-256) do `soltarPeca` do Jogo da Ordenação — mesmo gesto central de "encaixar" nos dois jogos. Origem/licença ainda a confirmar (mesma pendência de lá). Ficha: `assets/audio-transcricao/soltarPeca/transcricao.md`. |

Sem som de clique (`config.audio.clique: null`): botões de HUD (pausa, ajuda,
som), menu, níveis, tutorial e resultado ficam silenciosos ao tocar — mesma
decisão do Jogo da Ordenação, som só onde é gesto de jogo de verdade.

**O som de encaixe (`config.audio.soltar`) reaproveita `soltarPeca` do Jogo
da Ordenação** — toca só quando um par TRAVA certo (nunca num encaixe errado,
que não pontua e não trava).

**A narração do tutorial (`tutorial[].fala`) já está gravada e ligada** —
`tutorialTela1/2/3` tocam nos 3 passos do "COMO JOGAR" (menu) e da ajuda
dentro da partida, pelo `TutorialScreen` compartilhado.

Nenhuma imagem: peças, entalhe/nó, contorno e os marcadores de quantidade são
desenhados no canvas — os marcadores usam **emoji nativo** (`ctx.fillText`),
não path vetorial nem PNG. O tema de cenário é `'quarto'`, com
`corCeuTopo`/`corCeuBase` próprios (azul-marinho escuro) e
`mostrarDecoracoes: false` — uma variante do quarto sem a prateleira/enfeite
padrão do tema, criada com os parâmetros que o `Background` já expõe, sem
nenhuma cor nova no motor.

## Ajustes de qualidade (sessão de 2026-09-14)

- **Tolerância de encaixe recalibrada.** O raio de aceite do soquete chegou a
  1,35× a altura da peça (~90% da largura dela) — soltar a ficha bem longe do
  soquete certo ainda contava como acerto e "teleportava" pro lugar, sem
  parecer um encaixe de verdade. Medido e ajustado para 0,7× a altura
  (~65% da largura): ainda generoso pra motricidade de 4-7 anos, mas exige
  soltar de fato perto do soquete (ver `GameScene._dentroDaTolerancia`).
- **Tutorial sincronizado com o visual atual do jogo.** O passo 2 (arrastar)
  só anima na horizontal agora — antes também descia e vazava da caixa da
  ilustração, cobrindo o título/texto do passo. Corpo das peças, soquete
  fantasma (agora com "?", igual ao jogo real) e disposição dos marcadores
  (padrão canônico dado/dominó, sem sobreposição) também foram alinhados ao
  que `GameScene.js` desenha de verdade.
- **Tela de resultado mais equilibrada e um bug corrigido no motor**
  (`engine/screens/ResultScreen.js`, afeta todos os jogos ao rebuildar): o
  bloco painel+botões centraliza como uma unidade só agora (antes só o painel
  se centralizava, empurrando os botões quase pro chão); e uma variável
  `temaInterior` que tinha ficado sem declarar foi restaurada — não quebrava
  este jogo (que sempre define `corCeuTopo`/`corCeuBase`), mas quebraria
  qualquer jogo que não defina essas cores.
- **Ondas do Difícil nunca mais sobram com 1 par sozinho.** 7 pares em ondas
  de até 3 viravam `3, 3, 1` — a última onda, sem opção nenhuma pra comparar,
  não ensinava nem deixava errar. `dividirEmOndas` agora distribui por igual
  (`3, 2, 2`): toda onda, em qualquer nível, tem pelo menos 2 pares.
- **Ímã de encaixe, pra motricidade fina.** O raio de tolerância (acima)
  resolvia soltar longe do soquete, mas não ajudava quem mira certo e ainda
  assim treme na hora de soltar. Agora, dentro do mesmo raio, a ficha é
  puxada suavemente pro centro do soquete a cada quadro do arrasto
  (`GameScene._moverArrasto`) — quando o dedo solta, ela já está bem mais
  perto (ou exatamente) no lugar certo. O ímã age por POSIÇÃO, igual o anel
  de destaque: uma ficha errada perto de um soquete errado também é puxada,
  então não entrega a resposta — só ajuda a ficha certa a chegar no lugar
  certo (`_tentarEncaixar` continua exigindo o valor bater pra travar).
- **Cronômetro ao vivo agora é opcional** (`config.mostrarCronometro`, padrão
  `true`) — ver a seção "Registro no AVA", acima.
- **Elenco de emoji rebalanceado**: era 5 bichos pra 3 frutas; agora é 1
  bicho (gato) pra 6 frutas/objetos redondos + 1 bola — ver "O que é", acima.
- **Peça fora do lugar bem no último encaixe de cada onda — bug real,
  corrigido.** O par que COMPLETA uma onda dispara a comemoração
  (`_saltarParesDaOnda`) no MESMO instante síncrono em que `_tentarEncaixar`
  tinha acabado de iniciar o tween de "encaixar" daquela ficha — o tween
  ainda não tinha rodado um quadro sequer. A comemoração lia a posição
  ATUAL da ficha (ainda a de antes de soltar, não a do encaixe) como base
  do salto, e o tween de encaixe (nunca cancelado) brigava pelo mesmo eixo
  Y — resultado: a última peça de cada onda podia assentar visivelmente
  fora do lugar bem no instante em que a tela trocava (próxima onda ou
  resultado). Corrigido calculando a posição de encaixe pela GEOMETRIA do
  soquete (nunca pela posição corrente da ficha) e cancelando qualquer tween
  pendente antes de assentar — agora sempre no lugar certo, não importa o
  timing.
- **Narração do tutorial gravada e ligada.** `tutorial[].fala` apontava pra
  `null` nos 3 passos; agora aponta pros arquivos `tutorialTela1/2/3`
  (`assets/audio/tela{1,2,3}.wav`), registrados em `config.assets`. Nenhuma
  mudança de código foi necessária além do `config.js` — o `TutorialScreen`
  compartilhado já sabia tocar `passo.fala` (mesmo mecanismo usado pelo Jogo
  da Ordenação). Verificado ao vivo: os 3 áudios carregam no `AudioBus` e
  `falar()` dispara na ordem certa ao navegar pelos passos, sem aviso de
  narração ausente no console.
- **Som de encaixe ligado, reaproveitando o Jogo da Ordenação.** `audio.soltar`
  apontava pra `null`; agora aponta pra `soltarPeca`, o mesmo arquivo (mesmo
  SHA-256) já usado no Jogo da Ordenação para o mesmo gesto — uma ficha
  encaixando no lugar certo. Verificado ao vivo: o efeito toca exatamente no
  encaixe CERTO (`GameScene._tentarEncaixar`) e não dispara num encaixe
  errado.
- **Investigação completa por erros — nenhum encontrado.** Varredura ao
  vivo por exceções/avisos de console em toda tela e interação (menu,
  tutorial, seleção de nível, os 3 níveis jogados até o fim com todas as
  ondas, pausa, pausa NO MEIO de um arrasto, ajuda em partida, encaixe
  errado proposital, encaixe por gesto de mouse REAL exercitando o ímã) —
  nenhuma exceção JS, nenhum problema de fluxo. Só 2 avisos informativos
  (narração ausente para `escolhaNivel`/`falaVitoria`, ambos já
  documentados, ver "Pendências conhecidas"). De quebra, a pendência de
  "numeração do cartão de nível fora do centro" (abaixo, nesta seção antes
  desta sessão) foi conferida por código e captura de tela e está
  desatualizada — o motor compartilhado já centraliza corretamente; foi
  removida da lista.
- **Tentativas incorretas agora contam no `erros` do AVA — sem desconto.**
  Pedido do humano: contabilizar tentativas incorretas para o relatório,
  mas SEM que isso afete a nota/estrelas da vitória (ao contrário do que
  RE-02 faria em qualquer outro jogo do motor). Passou por três versões
  nesta sessão: (1) campo próprio em `extras`, sem afetar nota; (2) campo
  `erros` padrão via `placar.errar()`, que aciona o desconto de RE-02 —
  descartada por descontar a nota, o que o humano não queria; (3) versão
  final: um contador próprio da cena (`GameScene._tentativasErradas`,
  nunca passa por `placar.errar()`) escrito diretamente no campo `erros`
  da mensagem final, por fora do `ScoreSystem` — assim `acertos` sai
  sempre CHEIO (nunca descontado) e `erros` só registra a contagem. Conta
  só soltas perto o bastante de um soquete vazio de verdade com o valor
  errado — uma solta longe de qualquer soquete (motricidade imprecisa) não
  conta. Verificado ao vivo com o cenário exato pedido (2 tentativas
  erradas + todos os pares certos depois): `acertos: 3` (cheio), `erros: 2`,
  `vitoria: true`.
- **Rótulo da tela final trocado para "ACERTOS".** Pedido do humano:
  `config.unidadePlacar` mudou de `{ singular: 'par', plural: 'pares' }`
  para `{ singular: 'acerto', plural: 'acertos' }` — a tela de resultado
  agora mostra "N ACERTOS" em vez de "N PARES" (mesmo padrão já usado pelo
  Bingo e pelo Jogo da Ordenação). Verificado ao vivo por captura de tela.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **Origem/licença do som de encaixe (`soltarPeca`) ainda a confirmar** —
  arquivo fornecido pronto, sem procedência documentada; mesma pendência já
  existente no Jogo da Ordenação (é o mesmo arquivo nos dois). Confirmar
  antes de publicar para alunos.
- **Sem música de fundo**, sem locução de abertura, e faltam duas narrações
  opcionais do motor compartilhado: `audio.escolhaNivel` ("Escolha um
  nível", na seleção de nível) e `audio.falaVitoria` ("Muito bem! Você
  conseguiu!", na tela de resultado) — ambas silenciosas por falta de
  gravação, ambas documentadas explicitamente em `config.js` (não é
  esquecimento). Mesma regra do motor: som só de arquivo gravado, nunca
  sintetizado.
- **Renderização de emoji varia entre sistemas** (Segoe UI Emoji no Windows,
  Noto Color Emoji no Android/Chrome OS, Apple Color Emoji no iOS/macOS) — o
  desenho do bichinho/fruta muda um pouco entre aparelhos, mas o significado
  se mantém. Vale testar no(s) tablet(s) reais da escola antes de considerar
  fechado.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/encaixe-certo
node tools/verificar-independencia.mjs numerandus/encaixe-certo
```
