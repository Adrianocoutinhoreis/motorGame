# REGRAS-SUBTRAINDO-O-DOMINO.md — especificação do Subtraindo o Dominó

Especificação pedagógica, mecânica e de contrato do **Subtraindo o Dominó**, jogo da coleção
Numerandus. Descreve **o jogo que existe**; o brinquedo do vídeo é a referência, e cada
diferença em relação a ele está declarada na seção 2, com o motivo.

- Referência: vídeo `numerandus\finalizados\2ano\Subtraindo_o_domino\Subtraindo_o_domino.mp4`
  (2min58, vertical, narrado — transcrição na seção 10)
- Slug: `subtraindo-o-domino` · Pasta: `Games/numerandus/subtraindo-o-domino/`
- Público: 2º ano (7 a 8 anos)
- Objetivo pedagógico: **decompor um total em duas parcelas** — a partir da soma de dois dados
  (2 a 12), achar a pedra de dominó cujos pontos somam o mesmo valor, percebendo que vários
  pares dão o mesmo resultado (6+3 e 5+4).
- **Regra revisada em 28/10/2026** para a do vídeo: vence quem leva **mais pedras**, com **rodadas extras** no empate, cada um jogando os próprios dados (seções 4.3 a 4.5 e 9, item 8). A regra
  anterior, "a estrela da rodada limpa decide", foi abandonada.
- Status: **🚧 jogável, pendências declaradas** (26/10/2026). Layout, regras e retorno conferidos
  antes num protótipo jogável (artifact "Subtraindo o Dominó", 26/10/2026). O humano pediu que se
  tomasse "a melhor decisão" nas seis decisões do planejamento: foram adotadas **todas as
  recomendadas** (seção 9).

---

## 1. O jogo em uma frase

Uma mesa com as pedras de um dominó (sem as de 0), dois dados e um computador. **Os dois jogam em
toda rodada**: a criança **toca nos dados, acha uma pedra cujos pontos somam o total e confirma em
PRONTO**; depois o computador joga os dados dele e leva a pedra dele. **Vence quem junta MAIS
PEDRAS** (a regra do vídeo; as bandejas são o placar). Se empatar, **rodadas extras** desempatam, como no vídeo.

**O que a criança faz é a conta, não a sorte.** No brinquedo o dado decide quanto sai e quem
chegou antes leva a pedra. Aqui o total da criança vem dos dados, mas **sempre tem uma pedra na
mesa**: ela nunca fica sem por azar, só por não achar a pedra (a vez passa no limite de erros). Quem
pode ficar sem pedra é o computador, quando o total dele já acabou na mesa, e a criança pode
**provocar isso**: é a "subtração" do nome e a estratégia de que o vídeo fala.

---

## 2. O que muda em relação ao brinquedo do vídeo

| O que muda | Por quê |
|---|---|
| Vários jogadores → a **criança contra o computador** | Dois alunos num aparelho deixam a nota ambígua no AVA (de quem é?). É o que a série já faz. |
| Cada jogador joga o seu dado e leva uma pedra; ganha quem tem mais pedras → **igual (revisado em 28/10/2026), com uma proteção**: os dados **da criança** sempre caem num total com pedra | No brinquedo um total esgotado deixa qualquer jogador sem pedra, e a vitória dependeria dos dados (o defeito do Pratinho CDU, 21/10/2026). Aqui só o computador pode ficar sem pedra; a criança só fica sem se não achar a pedra (a vez passa no limite de erros). A primeira versão trocou "mais pedras" por "a estrela da rodada limpa"; o humano viu que as pedras ficavam 3 × 3 e a vitória parecia sem sentido, e pediu a regra do vídeo de volta. |
| Dados de verdade → **dois dados na tela; a criança toca para jogar** | Jogar o dado é a parte divertida; um toque preserva o gesto. |
| Ninguém confere a pedra → **PRONTO confere**; errar não tira nada | Ambiente não punitivo; ajuda em degraus (seção 4.2). |
| "Alguém já tirou antes" → **a pedra levada deixa um contorno apagado na mesa** | É a "subtração" do nome, visível sem escrever nada. |
| 3, 4 ou 5 rodadas combinadas → **3, 3 e 5, por nível** | Como no vídeo. **Empatou, jogam-se rodadas extras** (seção 4.5), que no vídeo é "mais uma rodada até que um consiga pegar uma pedrinha e o outro não". |
| Quem tem mais pedras vence → **igual: as bandejas são o placar**, sem número | Cada bandeja mostra as pedras que o jogador levou, uma vaga por rodada; a vaga vazia com ✕ é a rodada em que ele ficou sem. O alto só tem marcadores de rodada, **sem dono** (a estrela dourada aparece só nas rodadas extras, uma por extra). |
| Vídeo em pé, pano estampado → **tela 1280×720, fundo neutro de feltro** | Padrão do motor; o fundo não pode brigar com as pedras (pedido do humano para o Pratinho, mantido aqui). |

---

## 3. As pedras e os dados

As pedras são as de um dominó comum **sem as de 0**: faces de 1 a `faces`. Com `faces` = 6 são
**21 pedras**; com `faces` = 4 (Fácil), **10**.

| Total | Pedras que somam o total (6 faces) | Quantas | Chance nos dois dados |
|---|---|---|---|
| 2 | 1-1 | 1 | 1/36 |
| 3 | 1-2 | 1 | 2/36 |
| 4 | 1-3, 2-2 | 2 | 3/36 |
| 5 | 1-4, 2-3 | 2 | 4/36 |
| 6 | 1-5, 2-4, 3-3 | 3 | 5/36 |
| 7 | 1-6, 2-5, 3-4 | 3 | 6/36 |
| 8 | 2-6, 3-5, 4-4 | 3 | 5/36 |
| 9 | 3-6, 4-5 | 2 | 4/36 |
| 10 | 4-6, 5-5 | 2 | 3/36 |
| 11 | 5-6 | 1 | 2/36 |
| 12 | 6-6 | 1 | 1/36 |

**Por que sem as de 0 (decisão 1).** A transcrição automática ouviu "tirar o 0 e também o 1", mas
a mesa do vídeo tem de 21 a 23 pedras, algumas com um ponto, e o narrador cita "seis e um" para
o 7. Com todas as pedras de 0 fora, **todo total de 2 a 12 tem pelo menos uma pedra** (se as do 1
também saíssem, os totais 2 e 3 não teriam nenhuma). Ver seção 9, item 1.

**O sorteio** (`regras.js › sortearDados`): joga os dois dados e repete até dar um total que **tem
pelo menos uma pedra ainda na mesa**. A chance de cada total continua proporcional aos dados
reais (o 7 é o mais comum), só sem os totais sem pedra. Conferido em 30 000 jogadas com
subconjuntos aleatórios da mesa.

**A mesa** (`regras.js › posicionarMesa`): grade de 6 colunas de 144 × 80 px, até 4 linhas, as
pedras (128 × 64) em células distintas com um pequeno desvio e giro (±2 px, ±1,5°), centradas
na vertical. A folga entre pedras é de 16 px nominais e **nunca menor que 8 px** entre as caixas
(conferida em 3 000 mesas). A série pede 12 px entre alvos: o pior caso fica abaixo disso por
causa do balanço, que é o que faz a mesa parecer jogada.

---

## 4. A rodada

### 4.1 Os dados e a pedra

1. **Dados azuis com "?"** (bolinhas brancas e contorno claro: o marfim é só das pedras, para os dados se destacarem), num **quadro só deles** (no mesmo estilo das bandejas, alinhado ao PRONTO; a
   borda é dourada na vez da criança e azul na do computador). O dedinho branco aponta o primeiro dado (nenhuma frase escrita; a narração
   diz "Sua vez!"). Os dois dados pulsam de leve.
2. **Toque num dado**: os dois rolam por ~0,9 s e param. O total aparece na pergunta, no alto —
   **"QUAL PEDRA SOMA [9]?"**, a única frase escrita da partida (a única tarefa que não se explica
   só pelo gesto), com o total num selo âmbar — e a narração diz o número (de "dois" a "nove";
   "dez" a "doze" ainda sem gravação).
3. **Marcar uma pedra**: tocar marca (contorno dourado e a pedra sobe um pouco), tocar de novo
   desmarca, e só uma fica marcada por vez. **Nada vale antes do PRONTO**: o botão só liga com uma
   pedra marcada; então pulsa e o dedinho aponta o PRONTO (nunca aponta a pedra certa).
4. **PRONTO** confere.

### 4.2 Certo, errado e a ajuda em degraus

- **Errado**: a pedra balança, ganha contorno e um **✕ vermelho**, soa o som de erro e a
  narração diz "Tente de novo!". A pedra é desmarcada, nada é tirado, e a criança pode marcar
  outra. **A rodada deixa de ser limpa** (isso só vai para o relatório; a pedra continua dela, até o
  limite de erros da seção 4.3).
- **Ajuda em degraus** (`nivel.ajuda`): no N-ésimo PRONTO errado **da rodada**, uma pedra certa
  **ganha destaque até o fim da rodada**: sobe, cresce um pouco, ganha um halo branco largo que
  respira devagar (~1,8 s, sem piscar) com um anel que se abre, e **as outras pedras escurecem**
  para o foco ficar nela (marcar outra pedra a devolve ao brilho normal) — só no **Fácil**, no 2º erro; no Médio e no
  Difícil não há dica (a conta só aparece quando a vez passa, seção 4.3).
- **Certo**: **✓ verde** sobre a pedra e, após ~0,65 s, ela voa para a bandeja **da criança**, com
  75% do tamanho, na vaga da rodada (a pedra é dela mesmo que a rodada tenha tido erro). O lugar dela
  na mesa fica com um **contorno tracejado**. Só o acerto de primeira comemora com som e "Muito bem!".

### 4.3 A vez que passa (limite de erros)

Cada nível tem um **limite de erros por rodada** (`nivel.passaNoErro`): no **Fácil o 4º**, no **Médio o 3º**
e no **Difícil o 2º**. A gravidade cresce com o nível. Ao atingi-lo, **a vez da criança passa**:

1. depois do ✕ do erro, a pedra certa **acende com a conta** (`6 + 3 = 9`, num selo âmbar acima dela) e as
   outras escurecem, por ~1,9 s (`regras.revelaMs`): a derrota ensina a resposta;
2. a pedra **continua na mesa** e a **vaga da criança na bandeja fica vazia**, com um ✕ vermelho: a
   criança **fica sem pedra nessa rodada**, que é o que a faz perder terreno para o computador;
3. o computador joga a vez dele normalmente (seção 4.4) e leva a dele.

Com as pedras decidindo, **uma vez perdida basta para a criança perder a partida nas 3 rodadas** (2 × 3),
porque nas rodadas normais o computador sempre leva a dele. Isso é a "gravidade" do limite: por isso
ele cresce com o nível e a conta é revelada, para a derrota ensinar. Erros abaixo do limite não custam
nada, só a ajuda em degraus. Planejamento e simulação em artifact "Derrota Formativa" (28/10/2026): o
laço de tentativas acaba (no Difícil, quem chuta cai de 10,2 para 1,9 tentativas por rodada) e a derrota
passa a ter forma.

### 4.4 A vez do computador

O computador joga **em toda rodada**, também quando a criança não errou nada:

1. um anel suave passa da bandeja da criança para a dele (de quem é a vez, sem frase) e a narração
   diz "Vez do computador!";
2. os dois dados rolam e param no **total dele**, com o selo do total em **azul** (o dourado é da
   criança). Os dados dele são sorteados **agora**, entre as pedras que ainda estão na mesa: **antes da vez
   dele o total não aparece em lugar nenhum** (nenhuma prévia na vez da criança);
3. ele "pensa" ~0,8 s e **marca uma pedra** que soma o total dele (anel **azul**, a pedra sobe um
   pouco) — escolhida ao acaso entre as que servem; ele **nunca erra**, é um modelo;
4. a pedra voa para a bandeja dele.

**Nas rodadas normais o computador sempre leva a pedra dele**: o total dele é sorteado entre as pedras
que restam. Só nas rodadas extras (seção 4.5) ele pode ficar sem pedra.

**Sem prévia (revisado em 28/10/2026).** A versão anterior abria o total do computador num selo na bandeja
dele desde a vez da criança, no Médio e no Difícil, para ela poder "bloqueá-lo" levando a última pedra desse
total. O humano viu que isso era uma **prévia do dado do computador** e pediu para removê-la. Saíram o selo,
o bloqueio e `sortearDadosComputador`; o total dele só aparece na vez dele.

### 4.5 As pedras, as rodadas extras e o fim

**Vence quem levou mais pedras** (`regras.js › quemVence`). Cada bandeja tem uma vaga por rodada; a
pedra da criança vai para a vaga da rodada (a vez que passa deixa a vaga vazia, com ✕), a do computador
também. No alto há um **marcador por rodada, sem dono**: vazio com contorno dourado é a de agora, cheio
é a que passou. Nada de estrelas por rodada.

**As rodadas extras.** Passadas as rodadas combinadas, se as pedras **empataram** (e ainda há pedra na
mesa), joga-se **mais uma rodada**, como no vídeo ("até que um consiga pegar uma pedrinha e o outro
não"). Ela é **igual a uma rodada normal**: a criança joga, depois o computador, cada um com os
**próprios dados** (nada de um lançamento só para os dois):

1. aparece **uma estrela dourada** no alto (uma por rodada extra) e cada bandeja ganha **uma vaga
   extra** (as pedras que já estão lá se apertam um pouco para abrir lugar);
2. a criança joga como sempre: dados protegidos (sempre com pedra), acha a pedra, PRONTO. Se a vez dela
   passar no limite de erros, ela fica sem pedra nessa extra;
3. depois joga o computador (`regras.js › sortearDadosExtra`): na **1ª extra** os dados dele são
   **protegidos**, como os da criança, e ele leva a pedra; **da 2ª em diante são honestos**, só entre
   totais que **existem no nível**, e se o total dele já acabou na mesa ele **fica sem pedra** (vaga ✕). O **selo do total dele não aparece
   na vez da criança** nas extras: ele só mostra o total quando é a vez dele;
4. **terminou quando um leva e o outro não**: o computador sem pedra e a criança com (ela vence), ou a
   criança sem pedra e o computador com (ele vence). Se os dois levam, ou os dois ficam sem, **joga-se
   outra extra**;
5. para o desempate não virar maratona, **a partir da 3ª extra os dados do computador caem num total
   esgotado que existe no nível**, se houver algum (`sortearDadosSemPedra`). Se a criança levar a última
   pedra da mesa, ele rola dados de verdade e fica sem (vaga ✕); se a mesa esvaziar empatada, ou se o teto de 5
   extras chegar empatado, a criança leva.

Em simulação (20 000 partidas por nível) as extras duram, em média, **2,0 no Fácil, 2,8 no Médio e 2,6 no
Difícil** para uma criança típica (no máximo 3), e **o computador nunca fica sem pedra na 1ª extra**. Para quem
continua errando elas podem se alongar (em simulação, de 9 a 12 extras em cerca de 3% das partidas que chegam a elas, e
a bandeja ganharia uma vaga por extra), por isso há um **teto de 5 extras** (`regras.maxExtras`): empatado no teto, a
criança leva, a mesma regra da mesa vazia empatada.

**Defeito corrigido (28/10/2026).** A 1ª versão dava ao computador dados honestos já na 1ª extra, e o
humano viu que "sempre que chega nas extras o computador erra". A medida confirmou: ele ficava sem pedra
na 1ª extra em **78% das partidas do Fácil, 33% do Difícil e 14% do Médio**. Havia dois defeitos: (1) os dados
eram 2d6 puros, e no Fácil, onde as pedras só chegam a 8, **28% das jogadas caíam em totais que nem existem**
(9 a 12); (2) com poucas pedras na mesa (3 no Fácil) até totais válidos falham quase sempre. A correção:
dados só em totais do nível e **computador protegido na 1ª extra**.

**O empate é o comum.** Como o computador leva uma pedra por rodada e a criança também (mesmo depois de
errar), **quase toda partida chega empatada às extras**, a menos que a criança perca uma vez, e então perde a partida (2 × 3 nas 3 rodadas). Na prática as extras são o clímax
do jogo: testam se a criança continua achando a pedra enquanto o computador pode ficar sem.

Depois da última rodada (ou da extra que desempatou) e de uma pausa curta, vai **direto** para a tela de resultado da
série ("MUITO BEM!" ou "QUASE LÁ!"), sem tela intermediária. **Não há cronômetro.**

---

## 5. Os três níveis

| Nível | Pedras | Rodadas | Nas pedras | Ajuda | Nomes |
|---|---|---|---|---|---|
| Fácil | 10 (faces 1 a 4, totais até 8) | 3 | pontos | no 2º erro da rodada; **a vez passa no 4º** | VOCÊ / COMPUTADOR nas bandejas |
| Médio | 21 (faces 1 a 6, totais até 12) | 3 | pontos | nenhuma; **a vez passa no 3º** | só os ícones |
| Difícil | 21 | 5 | **algarismos** no lugar dos pontos (a criança lê os dois números e soma de cabeça); os dados continuam com pontos | nenhuma; **a vez passa no 2º erro** | só os ícones |

As rodadas extras (seção 4.5) são iguais nos três níveis.

O 1º ano não é o público: a soma até 12 com decomposição é conteúdo do 2º ano.

---

## 6. Pontuação, erros e o contrato com o AVA

A mesma regra do Pratinho CDU (decisão 4):

| Campo | Significado aqui | Valores |
|---|---|---|
| `totalPerguntas` | as rodadas combinadas do nível (as extras não contam) | 3, 3 ou 5 |
| `acertos` | **vitória: nota cheia** (todas as rodadas combinadas), sem desconto dos erros (exceção à RE-02, declarada) · **derrota: as pedras da criança**, sem desconto e **no máximo `totalPerguntas − 1`** | 0 a `totalPerguntas` |
| `erros` | PRONTOs errados na partida inteira, contagem crua | 0 ou mais |
| `vitoria` | mais pedras que o computador | `true`/`false` |
| `nivel` | 1 Fácil, 2 Médio, 3 Difícil | |
| `jogo` | slug estável | `subtraindo-o-domino` |
| extras | `desfecho`, `rodadasLimpas` (acertos de primeira nas rodadas combinadas), `rodadasComFalha`, `errosPronto`, `rodadasComAjuda`, `vezesPerdidas` (rodadas em que a vez da criança passou), `pedrasCrianca`, `pedrasComputador`, `rodadasExtras` (rodadas extras jogadas), `ganhouDoComputador`, `totais` (o total de cada rodada da criança, com as extras), `totaisComputador` (o de cada rodada do computador) | |

Os campos `estrelasCrianca` e `estrelasComputador`, da versão anterior, **deixaram de existir** (28/10/2026).

- **RE-01** caixa alta: `textoEmCaixaAlta: true`.
- **RE-02** — exceção: na vitória a nota não desconta os erros (eles vão para o relatório); na
  derrota é o progresso puro (as pedras da criança, no máximo `totalPerguntas − 1`). Como a vitória vale a
  nota cheia, uma derrota tem sempre nota **menor** que uma vitória. O teto de `totalPerguntas − 1` nasceu de um
  defeito achado nos testes de robustez (28/10/2026): perder só na rodada extra, depois de levar a pedra de todas as
  rodadas combinadas, dava 3 de 3 e a tela mostrava "QUASE LÁ!" com 5 estrelas cheias.
- **RE-03** `mostrarPlacarTexto: false`: só a fileira de estrelas da tela de resultado, sem "N RODADAS".
- **RE-04** a cena **não** passa `estrelas` ao resultado; a tela deriva a fileira.
- **RE-05** tutorial de 3 passos com desenho em canvas, também servido como ajuda na partida.
- Derrota registra (`registrarDerrota: true`).
- Ponto único de fim: `GameScene._terminar`, protegido por `_fimResolvido` (não duplica).

---

## 7. Áudio

| O quê | ids | Quando | Existe? |
|---|---|---|---|
| Efeitos | `acertoSOS`, `erroSOS`, `somErro`, `somProgresso`, `somConta` | vitória, derrota, PRONTO errado, rodada limpa, dados parando e pedra pousando / pedra marcada | **Sim** — os mesmos arquivos da coleção (mesmo SHA-256) |
| O total dos dados | `numero2`–`numero9` | quando os dados param | **Sim** — do Jogo dos Blocos (locução de 2013), não ouvidos |
| O total, do 10 ao 12 | `numero10`, `numero11`, `numero12` | idem | **Não** — gravar |
| Falas curtas | `suaVez`, `vezDoComputador`, `muitoBem`, `tenteDeNovo` | começo da rodada, vez do computador, rodada limpa, PRONTO errado | **Sim** — do Jogo dos Blocos (gravação de 2026), não ouvidas |
| Tutorial | `tutorialTela1`–`3` | `titulo + '. ' + texto` de cada passo | **Não** — gravar |

Sem o arquivo o motor fica **em silêncio e avisa o texto no console**: o jogo funciona mudo
nesses pontos. Toda locução tem ficha em `assets/audio-transcricao/<id>/transcricao.md`.

---

## 8. O que o motor já tem, e o que foi preciso criar

| Peça | Estado |
|---|---|
| `Scene`, `Node`, `Button`, `IconButton`, `SoundToggle`, `PauseScreen`, `HelpScreen`, `Tween`, `ScoreSystem`, `Watchdog`, telas de menu, níveis, tutorial e resultado | **Já havia** |
| Tema visual `'feltro'` | **Feito** — `engine/ui/Background.js`: feltro verde-azulado escuro e dessaturado; nas telas de vitrine, pedras de dominó apagadas (0,05–0,10), paradas, que continuam pelas barras do letterbox. Registrado como tema de interior em `MenuScreen` (placa limpa), `ResultScreen` e `TutorialScreen`; documentado em `COMPONENTES.md`. Nenhum outro tema muda. |
| Pedras, dados, bandejas, marcadores | Em `src/desenho.js` e `src/scenes/GameScene.js` (nós do jogo) |

---

## 9. Decisões

O humano pediu "tome a melhor decisão para o novo jogo" (26/10/2026). Adotadas as seis
recomendadas do planejamento:

1. **Pedras:** 21, sem as de 0 — **a confirmar com o autor do vídeo** (a transcrição fala em "tirar
   o 0 e o 1"; ver seção 3). Se forem 15 pedras, os dados precisam ser sorteados de novo nos
   totais 2 e 3 (`sortearDados` já faz isso para qualquer conjunto).
2. **Vitória:** ~~rodada limpa, a estrela decide~~ → **mais pedras vence** (revisada em 28/10/2026, item 8).
   O computador joga em toda rodada desde 26/10/2026 (o humano viu que ele "nem sempre jogava").
3. **Placar:** as bandejas, sem número; o alto tem marcadores de rodada sem dono.
4. **Nota:** vitória nota cheia; derrota as pedras da criança (seção 6).
5. **Fundo:** tema novo `'feltro'`.
6. **Rodadas:** 3, 3 e 5.
7. **Derrota formativa (28/10/2026):** a vez da criança passa no limite de erros do nível (Fácil 4º, Médio 3º,
   Difícil 2º), com a conta revelada e a vaga vazia na bandeja; a ajuda do Médio passou do 3º para o 2º erro (e foi **retirada** em 28/10/2026, a pedido do humano: a dica da pedra fica só no Fácil);
   `vezesPerdidas` no relatório do AVA (seção 4.3). A "estrela que escapa no 1º erro" dessa versão foi
   retirada junto com as estrelas (item 8).
8. **A regra do vídeo (28/10/2026).** A pedido do humano, o jogo volta à regra do vídeo: **vence quem tem
   mais pedras**, a vez que passa deixa a criança sem pedra, o empate vai a **rodadas extras**
   (iguais às normais: a vez da criança e depois a do computador, cada um com os próprios dados, até um levar a
   pedra e o outro não). Decisões do humano: "podemos fazer passar a vez,
   fazendo assim que o adversário tenha mais chance de ter mais pedras" e "vamos fazer como no vídeo"
   (rodadas fixas com desempate extra). As estrelas por rodada saíram da partida; sobra uma, dourada,
   por rodada extra. `acertos`/extras do AVA mudaram (seção 6). **Revisão no mesmo dia:** a 1ª versão da decisiva dava um total só para os dois, e o selo
   do computador na vez da criança passava a ideia de um lançamento único; o humano pediu que a vez da criança e a do computador
   se alternassem, cada uma com os próprios dados, "até não sobrar mais peças". Foi o que ficou (seção 4.5). **Segunda revisão no mesmo dia:** o selo com o total aberto do computador (Médio e
   Difícil) e o **bloqueio** foram **removidos**, por serem uma prévia do dado dele (seção 4.4).

**Em aberto**

- **O empate é quase sempre a regra, e as extras são o clímax.** Como cada lado leva uma pedra por
  rodada, as rodadas combinadas só decidem se a criança perder a vez (e então perde a partida). É fiel ao
  vídeo (4 jogadores, mesa esvaziando) mas aqui, com 2 jogadores e 21 pedras, a mesa raramente esvazia. Se
  isso fizer as primeiras rodadas parecerem "de aquecimento" com criança de verdade, a saída é fazer o
  computador poder ficar sem pedra antes (hoje só nas extras) ou ter menos pedras.
- **A reta final do Fácil é um presente (aceito em 28/10/2026, opção A).** Na 1ª extra sobram só 4 pedras (1,3 certas): a criança acha a pedra por eliminação em até 3 tentativas, o limite de 4 erros praticamente não alcança quem lembra o que já tentou (o chute cego perde a vez em 25%, contra 47% nas rodadas normais) e, da 2ª extra em diante, o computador fica sem pedra com facilidade. Quase toda partida do Fácil que chega às extras termina em vitória. No Médio (15 pedras) e no Difícil (11) a extra continua tão difícil quanto as normais (chute cego perde a vez em ~70%). O humano optou por manter. Se, com criança de verdade, a reta final do Fácil parecer sem tensão, as saídas são apertar o limite só nas extras do Fácil (2 erros) ou ter mais pedras na mesa.
- **Assimetria nas extras.** Os dados da criança são sempre protegidos (sempre têm pedra); os do computador
  só na 1ª extra, depois honestos. É intencional: a criança nunca perde por azar.
- **As extras sem narração.** Só a estrela dourada no alto as anuncia; não há fala
  "uma rodada a mais" gravada.
- **Dados do 2º ano**: se o Médio com 21 pedras é difícil demais — só se vê com criança.
- **Contraste do PRONTO**: aqui o rótulo é escuro (6,5:1) em vez do branco da série (2,3:1); a
  série inteira ainda usa o branco.
- **Ler o total e a pedra em voz alta** ("sete" já fala; falta o texto de cada pedra).

---

## 10. Transcrição da narração do vídeo

Transcrição automática (Whisper `small`, pt), revisada só na grafia. Os tempos são do vídeo.

> **0:00** Aqui nós temos um dominó comum. Nesse dominó comum, a criança pode brincar dele na
> escola? Pode, porque vai estar trabalhando algumas habilidades importantes, como contagem,
> reconhecimento de quantidade, estratégia, mas não é o caso.
> **0:32** No jogo nós vamos brincar aqui, eu vou tirar o 0 e vou tirar também o 1. Vamos jogar com
> essas outras pedras.
> **0:41** No dominó tradicional do nosso jogo, ganha aquele que primeiro se livrar de todas as
> pedras, aqui não, aqui é o contrário. Aqui vai ganhar quem ficar com mais pedra na mão após
> três rodadas.
> **0:54** Eu estou combinando três rodadas. Se na escola você quiser combinar quatro, cinco
> rodadas, ok.
> **1:00** O primeiro jogador tirou seis e três. Ele vai tirar, não necessariamente o que tiver seis
> e três. Eu posso tirar o 5 e 4, porque o 5 e 4 também é 9. É a minha opção. Eu tirei o 9.
> **1:34** O outro jogador jogou o dado, tirou 7 e ele vai pegar qualquer combinação que dê 7:
> quatro e três, seis e um, cinco e dois. Então ele tirou o 7.
> **1:51** Vai no terceiro jogador, o quarto jogador. Na segunda rodada tirei o número oito e aí vai
> o outro jogador e vai tirar também o número oito. Quando eu já tirei o quatro e quatro, ele vai
> tirar provavelmente o seis e dois, o cinco e três, e assim nós vamos fazer três rodadas ou
> quatro rodadas.
> **2:21** No final de quatro rodadas ganha quem tiver mais pedra. Se por acaso der um empate, todo
> jogador no final de quatro rodadas tiver quatro pedras na mão, aí vai mais uma rodada até que
> apenas um consiga pegar uma pedrinha e os outros não conseguiram, porque a pedrinha precisava,
> alguém já tirou antes na rodada anterior.
> **2:52** E aí a gente vai brincando de retirar o dominó. O nome desse jogo é Subtraindo o Dominó.
