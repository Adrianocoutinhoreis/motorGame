# REGRAS-CUBRA-NOVE.md — especificação do Cubra Nove

Especificação pedagógica, mecânica e de contrato do **Cubra Nove**, jogo da coleção Numerandus.
Descreve **o jogo que existe**; o brinquedo do vídeo é a referência, e cada diferença em relação a
ele está declarada na seção 2, com o motivo.

- Referência: vídeo `numerandus\finalizados\2ano\Cubra_Nove\Cubra_Nove.mp4` (2min57, vertical,
  narrado — transcrição na seção 11)
- Slug: `cubra-nove` · Pasta: `Games/numerandus/cubra-nove/` · Tema do motor: `'madeira'`
- Público: 2º ano (7 a 8 anos)
- Objetivo pedagógico: **adição e subtração com dois dados** — achar, a cada jogada, o número de cada
  dado, a soma (quando cabe até 9) e a diferença (o maior menos o menor, quando não dá 0), e perceber
  quando um resultado não serve (passa de 9, dá 0 ou já está coberto).
- Status: **🚧 jogável, pendências declaradas** (12/11/2026). Regras, layout e retorno conferidos antes
  num protótipo jogável (artifact "Plano Cubra Nove", 12/11/2026), ajustado com o humano em várias
  rodadas (seção 9).

---

## 1. O jogo em uma frase

Cada jogador tem uma fileira de casas de 1 a 9. **Jogam-se dois dados e cobre-se, com cubinhos de
madeira, tudo o que estiver livre entre os dois números, a soma e a diferença.** Em três rodadas, vence
quem cobrir mais; quem cobrir as 9 vence na hora.

**Quem vence é a sorte dos dados — e isso está no vídeo**: todo mundo cobre tudo o que dá, não há
escolha que mude o resultado. Por isso **a nota mede a conta, não a vitória** (seção 6): acertar a casa,
não esquecer número, conferir o computador.

---

## 2. O que muda em relação ao brinquedo do vídeo

| O que muda | Por quê |
|---|---|
| Dois alunos ou duas duplas → **a criança contra o computador** | Dois alunos num aparelho deixam a nota ambígua no AVA. É o que a série já faz. |
| "A dupla vai se ajudando" → **a criança confere o computador** (COBRIU TUDO / FALTOU UM) | O computador esquece um número 1 vez em 4; conferir obriga a fazer as contas dos dados dele também. |
| Ninguém confere o próprio lance → **PRONTO confere**, com ajuda em três degraus | Decidir que não há mais nada para cobrir faz parte da conta ("6 menos 6 dá 0, deu ruim"). O jogo não encerra a vez sozinho, ou entregaria a resposta. |
| "Cobrir os 9 primeiro" ou "mais em três rodadas" → **três rodadas, os 9 vencem na hora** | "Até cobrir os 9" leva em média 12 rodadas e em 63% delas não se cobre nada (seção 10). É o "para não ficar muito demorado" do narrador. |
| O vídeo não diz o que fazer no empate → **rodada extra**, até 5; empatado no teto, a criança leva | 28% das partidas empatam depois de 3 rodadas; 93% dos empates se resolvem até a 5ª extra. Mesma regra do Subtraindo o Dominó. |
| O cubinho do vídeo esconde o número → **o número fica gravado de leve no topo do cubinho** | Para dizer "o 3 já está coberto" a criança precisa ver que é o 3. O cubinho tem 46% da casa, como no vídeo: a cor da casa continua à vista. |
| As mãos pegam o cubinho do monte → **arrastar do monte até a casa, ou tocar na casa** | Arrastar é o gesto do vídeo; o toque é o atalho para nenhuma criança travar no gesto (a lição do Caminho das Cores). |
| Vídeo em pé, pano de chita vermelho → **tela 1280×720, tema `'madeira'`**: o tampo de uma mesa de madeira clara | Combina com os cubinhos de madeira e deixa a prancha branca e as casas coloridas na frente. A 1ª versão usava a chita apagada (vinho escuro com florzinhas); o humano achou feia e escolheu a madeira (12/11/2026). |

---

## 3. A jogada

Os dois dados dão, no máximo, **quatro números**:

| Conta | Cabe quando | Exemplo (5 e 4) |
|---|---|---|
| o 1º dado | sempre | 5 |
| o 2º dado | sempre | 4 |
| a soma | até 9 | 9 |
| a diferença (só a partir do Médio) | não dá 0 | 1 |

Cobre-se **tudo o que estiver livre** entre eles; o que já está coberto não se cobre de novo (o número
se perde), e o mesmo número em duas contas conta uma vez (2 e 4: o dado 2 e 4 − 2). Nada a cobrir é
jogada válida. As regras puras estão em `src/regras.js` e são conferidas jogada a jogada contra o vídeo
em `tools/teste-regras-cubra-nove.mjs`.

**Chance de uma jogada alcançar cada número** (em 36, com a diferença): 1→19, 2→18, 3→17, 4→18, 5→17,
6→16, **7→6, 8→5, 9→4**. Os números grandes só saem pela soma e são os que sobram — no vídeo sobrou o 8.

---

## 4. A partida

### 4.1 A tela

A prancha branca do vídeo ocupa a tela: a fileira do computador em cima, a da criança embaixo. No
meio, **só três coisas** (pedido do humano: "como um jogo de tabuleiro, só o necessário no centro"):

- **os dois dados**, à esquerda — eles são as contas deles: contorno verde quando o número foi coberto,
  apagados e tracejados se já estava coberto. Um toque neles joga; na hora de jogar ganham um contorno
  azul e o **dedinho branco** da coleção aponta para eles (na 1ª rodada na hora; depois, só se a criança
  demorar 2,5 s);
- **no máximo duas contas**, a soma e a diferença (`5 + 4 = 9`), e **um botão por vez**: PRONTO, ou
  COBRIU TUDO e FALTOU UM na conferência. O estado da conta é forma, não palavra: verde (coberta),
  tracejada (já coberta), riscada (não cabe);
- **o monte de cubinhos**, à direita, de onde saem as peças.

A **vez** é o contorno azul da fileira de quem joga. **Não há placar escrito**: as fileiras com os
cubinhos são o placar. **A rodada** é anunciada no centro, só com letras — "RODADA **2** DE 3", o número
grande no vermelho da chita; "RODADA **EXTRA**" em dourado — e pela voz.

**Nenhuma instrução de como jogar** aparece na partida ("toque nos dados", "cubra os números", "ele
cobriu tudo?"): isso está no tutorial, que o botão de ajuda abre a qualquer momento (RE-05).

### 4.2 A vez da criança

1. Toque nos dados: rolam e param (narrados os números, quando gravados).
2. A criança **arrasta um cubinho do monte** até uma casa da própria fileira — ou **toca na casa**, e o
   cubinho voa sozinho do monte até ela. O retorno é **no tabuleiro, sem frase**:
   - **casa certa**: o cubinho encaixa, a casa ganha um anel verde que se abre e apaga, a conta (ou o
     dado) acende em verde, som de acerto;
   - **casa que os dados não dão**: o cubinho volta ao monte, a casa balança com um anel coral, som de
     erro — **1 erro**;
   - **casa já coberta, ou soltar fora da fileira**: o cubinho volta, sem erro.
   Soltar até 30 px acima ou abaixo da fileira ainda vale a casa. **Só o dedo que pegou a peça a move**:
   um segundo toque (a palma encostando) não a solta (motor 1.4.0, `Input.js`).
3. **PRONTO** confere. Sobrou número, é **1 erro** a cada toque, e vem a **ajuda em degraus**, sem texto
   de instrução:
   1. 1º PRONTO cedo: uma bolinha laranja no monte com quantas peças faltam, a conta (ou o dado) que
      falta com um brilho âmbar fixo (a diferença primeiro, depois a soma, depois os dados; no Difícil só
      essa conta surge, já brilhando) e a frase âmbar "AINDA DÁ PARA COBRIR UM NÚMERO.";
   2. 2º PRONTO cedo: o jogo **mostra** ("OLHE ONDE VAI."): um cubinho sai do monte, vai até cada casa
      que falta, fica ali um instante (`regras.demonstraMs`, 0,8 s) e **volta ao monte**. As casas ficam
      marcadas com um contorno âmbar estável e é **a criança quem leva a peça** até elas (pedido do
      humano, 12/11/2026: o gesto tem de ser dela).
4. **Três erros na mesma vez, a vez passa** (`regras.errosParaPassar`), em todos os níveis, inclusive o
   Fácil — contando as casas erradas e os PRONTOs cedo. A criança **fica sem os números que faltavam**,
   como o computador que esquece: as casas continuam descobertas, com o cubinho fantasma mostrando onde
   a peça iria, até ela jogar os dados de novo; a frase coral diz "TRÊS ERROS: A VEZ PASSA.". **O jogo
   nunca cobre por ela**: ninguém vence sem jogar (pedido do humano, 12/11/2026 — a 1ª versão cobria as
   casas no último degrau e a criança podia vencer sem acertar).
5. **O elogio vem no fim da vez, não a cada cubinho**: PRONTO com tudo coberto, sem erro e sem dica,
   sorteia "MUITO BEM!", "ISSO AÍ!" ou "MANDOU BEM!"; com erro ou dica no caminho, "CONSEGUIU!"; quando a
   vez passou pelos três erros, não há elogio.

### 4.3 A vez do computador

Joga os dados e leva um cubinho do monte até cada casa dele, uma de cada vez. **1 vez em 4
(`regras.computadorEsquece`), esquece um número** — e **fica sem ele**: a vez dele acaba (decisão do
humano). Na vez dele, as contas e os dados **não ficam verdes**: a criança tem de comparar os dados com a
fileira dele para achar o que faltou. Ela confere com **COBRIU TUDO** ou **FALTOU UM**; o retorno diz se
ela conferiu bem ("ISSO! FALTOU O 5 (O DADO 5). FICOU SEM ELE." / "OLHE DE NOVO: …") e, se ele esqueceu,
um **cubinho fantasma** tracejado aparece na casa esquecida e fica até a criança jogar os dados de novo.

**O resultado é o mesmo com qualquer resposta**: a criança não ganha nada calando o erro do computador.
Conferir é treino, registrado à parte (não entra na nota).

### 4.4 Rodadas e fim

- Quem **cobrir as 9** vence na hora.
- Depois de **3 rodadas** (`regras.rodadas`), vence quem cobriu mais. Empatou, **rodada extra**, até
  **5** (`regras.maxExtras`); empatado no teto, **a criança leva**.
- A criança sempre começa (a ordem não muda a chance: quem começa vence 49%).

---

## 5. Os três níveis

O dado e as três rodadas são os mesmos; muda o apoio na tela e a diferença.

| Nível | O que cobre | O que aparece na tela |
|---|---|---|
| **1 · Fácil** | os dois dados e a soma, **sem a diferença** | as contas **prontas**: `5 + 4 = 9`, e quais já estão cobertas ou não cabem |
| **2 · Médio** | dados, soma e diferença (o vídeo) | as contas **sem resposta**: `5 + 4 = ?` `5 − 4 = ?`; a resposta aparece ao cobrir |
| **3 · Difícil** | dados, soma e diferença (o vídeo) | **só os dados**, como na mesa; as contas aparecem no fim da vez |

A subtração com resultado positivo é a parte nova para o 2º ano: no Fácil a criança aprende a jogada só
com a soma; no Médio entra a diferença.

---

## 6. Pontuação e contrato com o AVA

- **Meta** (`totalPerguntas`): **9** casas.
- **Erro** (`erros`): cubinho numa casa que os dados não dão, ou PRONTO com número ainda por cobrir
  (1 por vez). Conferir mal o computador **não** conta.
- **Nota** (`acertos`, RE-02, `notaDaPartida`): **vitória = casas cobertas − erros** (mínimo 0);
  **derrota = casas cobertas**, sem desconto. A cena grava a nota pronta em `acertos`, porque o
  `ScoreSystem` só desconta quando a meta é atingida e aqui vence quem cobre mais.
- Tela final: "N NÚMEROS" (RE-03), estrelas derivadas pela tela (RE-04).
- **Extras**: `cobertasCrianca`, `cobertasComputador`, `cobertasPorOrigem` (`dado`, `soma`, `dif`),
  `toquesErrados`, `prontoCedo`, `dicasNaConta`, `demonstracoes`, `vezesPerdidas`, `numerosPerdidos`, `vezesSemNada`, `conferencias`,
  `conferenciasCertas`, `esquecimentosDoComputador`, `rodadas`, `rodadasExtras`, `empateNoTeto`,
  `cobriuOsNove`. `tempoSegundos` e `ajuda` vêm do motor.
- Fim sempre por `irPara('resultado', { nivel, resultado: placar.paraAva(venceu, extras) })`;
  `registrarDerrota: true`.

**Efeito da RE-02 que vale conhecer:** vencer com 6 casas e 2 erros dá 4; perder com 5 casas dá 5. É o
mesmo que acontece nos outros jogos que comparam placares. E como as casas cobertas dependem dos dados,
a nota carrega um pouco da sorte — a habilidade aparece mais limpa nos extras (`toquesErrados`,
`prontoCedo`, `numerosPerdidos`, `conferenciasCertas`). Decisão a rever com o professor (README).

---

## 7. Áudio

- **Reaproveitados do Cabo de Guerra** (mesmos arquivos, fichas em `assets/audio-transcricao/`):
  `acertoSOS`, `erroSOS`, `somErro`, `somProgresso`, `somConta`, `muitoBem`, `vezDoComputador`.
- **A gravar** (a cena já pede cada id; sem o arquivo, fica muda nesse ponto): `rodada1`, `rodada2`,
  `rodada3`, `rodadaExtra`; `issoAi`, `mandouBem`, `conseguiu`; `aindaDaParaCobrir`,
  `olheOndeVai`, `aVezPassa`; `isso`, `olheDeNovo`; o tutorial `tutorialTela1..5`.

---

## 8. O que o motor já tinha, e o que foi preciso criar

| Peça | Situação |
|---|---|
| Menu, níveis, tutorial, ajuda (RE-05), pausa, resultado, `ScoreSystem`, `AvaBridge`, `Watchdog` | do motor |
| Dados com pontos, dedinho, ritmo pelo `relogio` de tweens | padrão do Cabo de Guerra, redesenhados (dados brancos do vídeo) |
| As duas fileiras, o cubinho, o monte, o fantasma, as contas, o aviso do centro | novos, no jogo (`desenho.js`, `GameScene.js`) |
| Tema `'madeira'` | **novo no motor** (`Background.js`: tábuas com veios; dados e cubinhos apagados só nas vitrines; placa limpa no menu) — motor 1.4.0 |
| Um dedo por vez | **novo no motor** (`Input.js`) — resolve também a pendência do Quebra-Cabeça Dinossauro |

---

## 9. Decisões

Tomadas no planejamento (artifact "Plano Cubra Nove") e ajustadas com o humano:

1. Criança contra o computador, e ela confere a jogada dele. *(recomendada, aceita)*
2. A criança cobre arrastando do monte; tocar na casa também vale. *(pedido do humano: arrastar)*
3. PRONTO confere; ajuda em degraus (a dica, depois a demonstração); **três erros na vez, a vez passa** e os números que faltavam se perdem. *(a 1ª versão cobria pela criança no último degrau; trocado a pedido do humano, 12/11/2026)*
4. O computador que esquece **fica sem o número**, com o cubinho fantasma mostrando onde poderia estar.
   *(pedido do humano)*
5. Três rodadas em todos os níveis; rodadas extras no empate, teto 5. *(medida)*
6. Níveis por apoio na tela; o Fácil sem a diferença. *(recomendada, aceita)*
7. O cubinho do tamanho do vídeo, com o número gravado no topo. *(pedido do humano + recomendada)*
8. Centro limpo: dados, até duas contas, um botão e o monte; sem placar, sem rótulos, sem instrução; o
   acerto e o erro no tabuleiro; o elogio no fim da vez; a rodada só com letras. *(pedidos do humano)*
9. Tema `'madeira'` (a chita vinho da 1ª versão foi recusada pelo humano), a criança sempre começa, nome "CUBRA NOVE". *(propostas do plano, adotadas ao começar
   a implementação, 12/11/2026)*

---

## 10. Medidas

Simulação em `tools/teste-regras-cubra-nove.mjs` (100 000 partidas por linha) e no plano (200 000):

| Formato | Criança vence | Cobertas (média) | Vão à rodada extra |
|---|---|---|---|
| Fácil (sem diferença), computador nunca esquece | 50,6% | 5,9 | 28,5% |
| Médio/Difícil, computador nunca esquece | 51,2% | 6,5 | 28,2% |
| **Médio/Difícil, computador esquece 1 em 4** (o jogo) | **63,1%** | 6,5 | 26,0% |

"Até cobrir os 9": mediana de 12 rodadas, 10% passam de 24, 63% das rodadas não cobrem nada.
Empates resolvidos: 56% na 1ª extra, 86% até a 3ª, 93% até a 5ª.

---

## 11. Transcrição da narração do vídeo

Transcrição automática (Whisper `small`, offline, 12/11/2026), sem revisão humana. Erros do
reconhecimento ficaram como vieram: "cubra9" (cubra 9), "duplays" (duplas), "6 mais 39 já tá coberto"
(6 mais 3 é 9, já tá coberto).

```
[00:10] Aqui nós temos o cubra9, esse desafio do cubra9 para as crianças do segundo ano,
[00:17] eles vão trabalhar a questão da adição e da multiplica, da adição e da subtração.
[00:24] Ok? Aqui quando ele joga os dois dados, é um jogo para dois alunos, para dois participantes,
[00:32] ou para dois duplays. E a dupla vai se ajudando.
[00:36] Jogo aqui os dois dados, tirou o 9, eu posso marcar aqui o 9, posso marcar aqui o 1 que é a subtração,
[00:46] posso marcar o 5 que foi o que eu tirei e posso marcar o 4 que foi o que eu tirei.
[00:52] Joga o outro colega, tá combinado? Pode combinar de duas maneiras, tá?
[00:57] Ou ganha quem cobrir os 9 primeiro, ou ganha para não ficar muito demorado,
[01:04] quem cobrir mais pedras, mais espaços em três rodadas.
[01:10] Então nós fizemos aqui a primeira rodada, vamos a primeira rodada e a outra dupla.
[01:15] 6 mais 5 dá 11, não dá, 6 menos 5 dá 1, ok? Vou marcar também os 6 e vou marcar o 5.
[01:25] Cobrir os 6, cobrir os 5 e cobrir a diferença.
[01:29] Segunda rodada, vou cobrir o 7, o 5 já cobri e vou cobrir o 2 e vou cobrir a diferença,
[01:39] que é 3, opa, tá faltando só 2, quem sabe na terceira rodada já no cubro, né?
[01:46] A outra dupla ou o outro participante ainda é na segunda rodada,
[01:51] novamente irá no dois números grandes que a soma não comporta aqui no cubro 9.
[01:56] Então 6 menos 6 dá 0, deu ruim para esse aqui.
[02:01] Os 6 já tá coberto, então não cobriu nada.
[02:04] Vamos para a terceira rodada, tem tudo aqui para a primeira dupla ganhar.
[02:09] 6 mais 39 já tá coberto, 6 menos 3 dá 3, já tá coberto,
[02:16] o 3 já tá coberto, o 6 não, então ele vai cobrir os 6.
[02:20] Vamos agora, o direito da outra dupla também tem a terceira rodada,
[02:26] mas tá muito difícil para eles.
[02:28] Cobrir o 7, 1 já tá coberto, 6 menos 1 dá 5, já tá coberto.
[02:34] Então passou 3 rodadas, a dupla número 1 faltou,
[02:39] tem apenas 1 descoberto e a dupla número 2 tem 1, 2, 3, 4, 5 descoberto.
[02:45] Logo o vencedor é a dupla 1, parabéns para a dupla 1,
[02:50] ou para o participante do lado de cá, ok?
[02:55] Valeu!
```
