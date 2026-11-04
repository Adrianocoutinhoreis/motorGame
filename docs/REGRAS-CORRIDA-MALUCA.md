# REGRAS-CORRIDA-MALUCA.md — especificação da Corrida Maluca

Especificação pedagógica, mecânica e de contrato da **Corrida Maluca**, jogo da coleção
Numerandus. Descreve **o jogo que vai existir**; o brinquedo do vídeo é a referência, e cada
diferença em relação a ele está declarada na seção 2, com o motivo.

- Referência: vídeo `Desktop\corrida maluca\Corrida_Maluca.mp4` (2min37, vertical, narrado —
  transcrição na seção 10)
- Slug: `corrida-maluca` · Pasta: `Games/numerandus/corrida-maluca/`
- Público: 2º ano (7 a 8 anos)
- Objetivo pedagógico: **dobro, triplo e números ordinais** — calcular o dobro e o triplo de um
  número (somando parcelas iguais), resolver problemas de preço com dobro e triplo, e dar o nome
  ordinal de 1 a 10.
- Status: **🚧 jogável, pendências declaradas** (03/11/2026) — implementado em
  `Games/numerandus/corrida-maluca/`; pendências no README do jogo (narração própria não gravada, sem
  teste com criança nem em tablet). Regras e layout conferidos antes num protótipo jogável (artifact
  "Plano Corrida Maluca", https://claude.ai/artifact/TNi9yYYFZtVP6sV4dybgkv). Decisões do humano:
  fichas redondas como as do vídeo, a casa verde dá jogada extra, a trilha cresce com o nível; nas
  outras nove, "o resto pelas recomendadas" (seção 9). O humano pediu reaproveitar "o que puder ser
  aproveitado de áudio por enquanto" dos jogos anteriores da série (seção 7).

---

## 1. O jogo em uma frase

Um tabuleiro com uma trilha da **ENTRADA** à **SAÍDA**, um dado e um baralho de cartas. Na sua vez,
a criança **joga o dado, a ficha anda sozinha contando as casas, e ela responde a carta**: acertou,
**fica na casa**; errou, **volta para onde partiu**. Quem fica numa **casa verde joga o dado de novo**.
O computador joga do mesmo jeito, responde em voz alta, e a criança **confere** se ele acertou.
Vence quem passar primeiro pela SAÍDA.

**O que a criança faz é a conta, não a sorte.** O dado decide quanto a ficha anda; a carta decide se
ela fica lá. Errar nunca acaba a partida: só devolve a ficha ao ponto de onde a jogada saiu.

---

## 2. O que muda em relação ao brinquedo do vídeo

| O que muda | Por quê |
|---|---|
| Vários jogadores → a **criança contra o computador** | Dois alunos num aparelho deixam a nota ambígua no AVA (de quem é?). É o que a série já faz. |
| "Os colegas da mesa concordam que ele acertou" → **a criança confere a resposta do computador** (CERTO / ERRADO) | É a parte cooperativa do vídeo (1:14), num jogo de uma criança só. O computador erra de propósito 1 vez em 4, então conferir exige fazer a conta, e a criança trabalha nas duas vezes da rodada. |
| A criança conta e desloca a ficha → **a ficha anda sozinha, contando em voz alta** | A conta deste jogo está na carta. Mover casa a casa (como na Corrida Espacial) dobraria o trabalho e alongaria a partida. |
| Resposta falada → **três respostas grandes, narradas** | Toque em vez de fala. Uma das erradas é sempre a confusão típica (o triplo no lugar do dobro, ou o contrário). |
| Errou → "volta de onde partiu" → **igual, e o jogo mostra a conta certa** | É o "os colegas dizem não, é décimo": o erro ensina. Não há segunda chance; o preço do erro é a casa perdida, não a partida. |
| Uma trilha de 27 passos → **15, 21 ou 27 passos, por nível** | O mesmo tabuleiro; com menos passos as casas ficam maiores e a partida mais curta para quem está começando (decisão do humano, seção 9). |
| Tabuleiro em cima do pano estampado → **tela 1280×720, tabuleiro branco de borda azul sobre fundo neutro** | Padrão do motor; o fundo não pode brigar com as fichas e as casas verdes. |

**Mantido do brinquedo:** um dado de 1 a 6; a serpentina da ENTRADA à SAÍDA; as 3 casas verdes; a
saída preta; **fichas redondas** (vermelha da criança, de madeira do computador); acertar para ficar,
errar para voltar; a verde dá jogada extra; não é preciso cair exato na SAÍDA.

---

## 3. O tabuleiro e as fichas

- **A trilha** é a serpentina do vídeo: uma fileira embaixo (da ENTRADA para a direita), uma curva,
  a fileira do meio (para a esquerda), outra curva e a fileira de cima até a SAÍDA, no canto de cima à
  direita. A ENTRADA e a SAÍDA não mudam de lugar entre os níveis.
- **Quantas casas:** 15, 21 ou 27 passos (seção 5). As casas são distribuídas a distâncias iguais ao
  longo do mesmo caminho: com menos passos, cada casa fica maior e mais espaçada.
- **Casas verdes:** 3 em todo nível, nas proporções do vídeo (passos 9, 15 e 22 de 27):
  `Math.round(passos × [9, 15, 22] / 27)` → Fácil **5, 8, 12** · Médio **7, 12, 17** · Difícil **9, 15, 22**.
- **A SAÍDA** é a última casa, preta, com um quadriculado de chegada. A ENTRADA é a casa 0, branca com
  contorno tracejado.
- **Fichas:** discos com borda mais escura, vermelha (criança) e de madeira (computador). Na mesma casa
  ficam levemente desencontradas, para as duas aparecerem. A ficha da vez tem um brilho estável.
  **As casas e as fichas não são alvos de toque**: o toque é no dado e nas respostas da carta.

**Medidas (1280 × 720)**, as do protótipo: tabuleiro de 960 × 620 px a partir de (40, 72), borda de
12 px; raio das casas = `min(42, espaçamento × 0,33)` → 42 px no Fácil e no Médio, 33 px no
Difícil (todas acima dos 64 px de diâmetro de `METODO-JOGOS-NUMERANDUS.md` §3.C, embora não sejam
tocadas); painel da direita a partir de x 1016 com a vez, o dado (141 px), o botão JOGAR O DADO
(136 px de altura) e o placar de casas.

---

## 4. A jogada

### 4.1 A vez da criança

1. **JOGAR O DADO** — o botão grande. O dado gira um instante (sem flash) e para.
2. **A ficha anda** casa a casa, e a voz conta quantas já andou ("um", "dois", "três"…). Passar da
   SAÍDA para nela.
3. **A carta** aparece sobre o tabuleiro: o tipo (DOBRO, TRIPLO, ORDINAIS ou PROBLEMA), a pergunta
   narrada e três respostas. A criança toca uma.

### 4.2 Certo e errado

- **Certo:** a resposta fica verde, "ACERTOU!", e a ficha **fica na casa**. Se a casa é verde, "CASA
  VERDE: JOGUE DE NOVO!" (4.4). Se é a SAÍDA, a partida acaba em vitória.
- **Errado:** a resposta tocada fica marcada, a certa acende, e o jogo **mostra e narra a conta**
  ("O TRIPLO DE 4 É 4 + 4 + 4 = 12"). A ficha **volta, casa a casa, para onde a jogada começou**.
  Conta um erro.
- **CONTINUAR** fecha a carta. A criança lê e ouve o retorno no próprio ritmo; nada avança sozinho.

### 4.3 A vez do computador

O computador joga o próprio dado (honesto), a ficha de madeira anda contando, e ele **puxa uma carta e
responde em voz alta**: "O COMPUTADOR DIZ: 12". **Ele erra de propósito 1 vez em 4**, escolhendo uma
das respostas erradas da carta. A criança **confere** com dois botões, CERTO e ERRADO:

- conferiu bem → "ISSO! ELE ACERTOU." / "ISSO! ELE ERROU.";
- conferiu mal → "OLHE DE NOVO: ELE ACERTOU." / "… ELE ERROU." — sempre com a conta certa.

Se o computador errou, a ficha dele volta para onde partiu, como a da criança. **Conferir errado não
custa nada à criança** e não conta como erro na nota (seção 6): é treino, registrado à parte.

### 4.4 A casa verde

Quem **fica** numa casa verde (respondeu a carta e acertou) **joga o dado de novo**: é a vantagem da
casa, para a criança e para o computador. A jogada extra é anunciada ("CASA VERDE! JOGUE O DADO DE
NOVO"; a faixa diz "SUA VEZ DE NOVO") e a casa verde ganha um **anel amarelo estável**, sem piscar,
até o dado parar.

Como "voltar de onde partiu" é voltar ao começo da jogada, **a verde também é um porto seguro**: se a
carta da jogada extra for errada, a ficha volta para a verde, não para antes dela. Encadear verdes
é possível e é sorte de quem joga.

### 4.5 Ordem e fim

- A criança sempre começa.
- A partida termina quando uma ficha **fica** na SAÍDA: passa por ela e acerta a carta. **Não é
  preciso cair exato.** Errou a última carta, volta, como em qualquer casa.
- Se for a vermelha, vitória; se for a de madeira, derrota.

---

## 5. Os três níveis

O dado é sempre um, de 1 a 6. O que cresce é a carta e a trilha.

| Nível | Trilha | Verdes | Dobro | Triplo | Ordinais | Problemas |
|---|---|---|---|---|---|---|
| **1 — Fácil** | 15 passos | 5, 8, 12 | de 1 a 5 | — | 1º a 5º | — |
| **2 — Médio** | 21 passos | 7, 12, 17 | de 1 a 10 | de 1 a 5 | 1º a 10º | — |
| **3 — Difícil** | 27 passos (o do vídeo) | 9, 15, 22 | de 1 a 10 | de 1 a 10 | 1º a 10º | preço de 1 a 5 reais, 2 ou 3 unidades |

**As cartas.** O tipo é sorteado entre os do nível, com chances iguais; a mesma carta não volta dentro
de 4 sorteios.

| Tipo | Pergunta | Respostas erradas | Conta mostrada |
|---|---|---|---|
| Dobro | QUAL É O DOBRO DE 4? | o triplo (12) e uma vizinha (7, 9 ou 6) | O DOBRO DE 4 É 4 + 4 = 8 |
| Triplo | QUAL É O TRIPLO DE 4? | o dobro (8) e uma vizinha (11, 13 ou 7) | O TRIPLO DE 4 É 4 + 4 + 4 = 12 |
| Ordinais | COMO SE CHAMA O 10 NA FORMA ORDINAL? | dois ordinais vizinhos (NONO, OITAVO) | 10 NA FORMA ORDINAL É DÉCIMO (10º) |
| Problema | SE UMA MAÇÃ CUSTA R$ 2, QUANTO CUSTAM 3 MAÇÃS? | a confusão dobro/triplo e uma vizinha, em reais | É O TRIPLO: 2 + 2 + 2 = R$ 6 |

Os problemas usam MAÇÃ, LÁPIS, BALA, PICOLÉ e CADERNO. **Ordinais na tela:** a palavra em caixa alta
com o símbolo embaixo (DÉCIMO · 10º), sempre narrada: quem ainda não lê se guia pela voz e pelo 10º.
A conta é sempre mostrada como **soma de parcelas iguais**, que é como o 2º ano chega ao dobro e ao
triplo antes da tabuada.

**Duração medida** (20 000 partidas simuladas, a criança errando 20% / 25% / 30% das cartas e o
computador 25%):

| Trilha | Cartas da criança, média | 90% das partidas até | Jogadas, as duas fichas | Vitória da criança |
|---|---|---|---|---|
| 15 | 5,0 | 7 | 9,2 | 63% |
| 21 | ~7,3 | ~9,5 | ~13,8 | ~56% |
| 27 | 9,6 | 12 | 18,7 | 48% |

(O 21 foi interpolado entre as medições de 20 e 22 passos.)

---

## 6. Pontuação, erros e o contrato com o AVA

- **Meta:** o tamanho da trilha do nível — **15, 21 ou 27**. Durante a partida, **a própria trilha é a
  barra de progresso**; o placar do painel diz a casa de cada ficha.
- **Progresso:** a casa onde a ficha vermelha está (0 até a meta).
- **Erro:** cada carta respondida errada pela criança. Conferir mal a resposta do computador **não** é
  erro.
- **Vitória:** pontuação = meta − erros (RE-02), mínimo 0. **Derrota:** pontuação = casa alcançada, sem
  desconto (RE-02).
- **Tela final:** "N CASAS" (RE-03) — `unidadePlacar: { singular: 'casa', plural: 'casas' }`. Estrelas
  derivadas pela própria tela (RE-04).
- **AVA:** `acertos` = pontuação, `erros` = erros, `totalPerguntas` = meta, `nivel` = 1 | 2 | 3,
  `vitoria` booleano. Extras: `casaAlcancada`, `casaComputador`, `cartasRespondidas`, `cartasCertas`,
  `cartasPorTipo` (`{ dobro: "certas/respondidas", … }`), `conferenciasCertas`, `conferencias`,
  `jogadasExtras` (as da criança).

**Por que a nota é a trilha, e não as cartas.** É o padrão de meta fixa do contrato (`CONTRATO-AVA.md`
§3) e o mesmo da Corrida Espacial. O acerto das cartas, que mede melhor a conta, não se perde: vai em
`cartasCertas` / `cartasRespondidas` e por tipo, para o relatório.

---

## 7. Áudio

Reaproveitado dos jogos irmãos a pedido do humano (03/11/2026): tudo o que já existia gravado e
serve aqui. O resto a cena já pede pelo id definitivo.

| O quê | ids | Quando | Existe? |
|---|---|---|---|
| Efeitos | `acertoSOS`, `erroSOS`, `somErro`, `somProgresso`, `somConta` | vitória, derrota, carta errada ou conferência mal feita, carta certa ou conferência bem feita, dado parando e ficha pousando | **Sim** — os mesmos arquivos do Subtraindo o Dominó |
| Números | `numero1`–`numero10` | a contagem dos passos (1 a 6) e a resposta do computador | **Sim** — `um.mp3`…`dez.mp3` do Jogo dos Blocos (locução de 2013), não ouvidos; o `um` é de outro lote |
| Números | `numero11`–`numero30` | a resposta do computador no dobro e no triplo | **Não** — gravar |
| Ordinais | `ordinal1`–`ordinal10` | a resposta do computador nas cartas de ordinal | **Não** — gravar |
| Começo das perguntas | `qualODobroDe`, `qualOTriploDe`, `comoSeChamaONumero` + `deFormaOrdinal` | a pergunta em pedaços ("qual é o dobro de" + número; "como se chama o número" + número + "de forma ordinal") | **Não** — gravar |
| Problemas | `problema` (uma fala por enquanto) | Difícil | **Não** — decidir o formato ao gravar (inteira ou em pedaços) |
| Falas curtas | `suaVez`, `vezDoComputador`, `muitoBem` | troca de vez, carta certa | **Sim** — do Jogo dos Blocos via Subtraindo o Dominó (gravação de 2026), não ouvidas |
| Falas curtas | `casaVerde`, `casaVerdeComputador`, `volteDeOndePartiu`, `oComputadorDiz`, `eleAcertou`, `isso`, `olheDeNovo` | casa verde, carta errada, conferência | **Não** — gravar |
| Tutorial | `tutorialTela1`–`4` | cada passo | **Não** — gravar |

O `tenteDeNovo` da coleção **não** foi usado: depois da carta errada a criança não tenta de novo (a ficha
volta e a vez passa), e a fala diria o contrário do que acontece.

Sem o arquivo o motor fica **em silêncio e avisa o texto no console**: o jogo funciona mudo nesses
pontos, e nada da mecânica depende de ouvir. Toda locução tem ficha em
`assets/audio-transcricao/<id>/transcricao.md`.

---

## 8. O que o motor já tem, e o que foi preciso criar

| Peça | Situação |
|---|---|
| Menu, níveis, tutorial, ajuda (RE-05), pausa, resultado, `ScoreSystem`, `AvaBridge`, `Watchdog` | **Já havia** — vem do template |
| Tema visual `'tabuleiro'` | **Feito** — `engine/ui/Background.js`: degradê suave de azul-ardósia a índigo; nas telas de vitrine, iluminação central (um halo atrás da placa e dos botões) e dados, cartas (o verso em roleta colorida das cartas do vídeo) e estrelas flutuando devagar nas margens, longe da placa e dos cartões (opacidade 0,10–0,15, períodos de 6 a 9 s, nada pisca). A placa do título do menu (`PlacaTituloTabuleiro`, em `MenuScreen`) é o tabuleiro branco de borda azul, **só com o texto** em destaque. Na partida: só o degradê, sem halo nem enfeites. Registrado como tema de interior em `MenuScreen`, `ResultScreen` e `TutorialScreen`; documentado em `COMPONENTES.md`. Nenhum outro tema muda. **Histórico:** a 1ª versão espalhava fichas e dados soltos que quase não se viam; a 2ª (03/11/2026) contornava a tela com uma trilha; a atual (04/11/2026) segue o pedido do humano: "fundo com gradiente suave, elementos lúdicos flutuantes (dados, cartas, estrelas) e iluminação central; na placa, apenas o texto em destaque". |
| Dado | **No jogo** (`src/desenho.js`, o mesmo desenho do Subtraindo o Dominó). É o terceiro jogo com um dado; subir para o motor (`engine/ui/Dado.js`) mexeria nos dois irmãos já testados, e ficou para uma mudança própria |
| Trilha distribuída ao longo da rota, fichas, carta, turno do computador | **Feito** — regras puras em `src/regras.js`, desenho em `src/desenho.js`, cena em `src/scenes/GameScene.js`. Conferido por `tools/teste-jogabilidade-corrida-maluca.mjs` (regras puras em Node e a partida com gesto real) |

---

## 9. Decisões

Planejadas no artifact (03/11/2026). O humano decidiu a 6, a 8 e a 11 e mandou "o resto pelas
recomendadas".

1. **Adversário:** o computador.
2. **A mesa que confere:** o computador erra 1 vez em 4 e a criança confere com CERTO / ERRADO; se ele
   errou, volta (4.3).
3. **Mover a ficha:** sozinha, contando em voz alta.
4. **Responder a carta:** três respostas grandes, narradas, com a confusão típica entre as erradas.
5. **Errou a carta:** volta para onde partiu, sem segunda chance, com a conta certa mostrada.
6. **Casa verde (humano):** "se o aluno cair na parte verde ele tem direito de jogar mais uma vez o dado,
   dando assim vantagens para quem ficar nessa posição". "Ficar" é acertar a carta, como o narrador faz
   em 2:09 (4.4).
7. **Chegada:** passar da SAÍDA vale; a última carta precisa ser acertada.
8. **Trilha por nível (humano):** "fácil talvez com menos passos também e assim por diante" → 15, 21 e 27
   passos, o mesmo tabuleiro com casas maiores, medidos por simulação (seção 5).
9. **Níveis:** o que cresce é a carta e a trilha, não o dado.
10. **Ordinais na tela:** palavra com o símbolo (DÉCIMO · 10º), narrada.
11. **Visual (humano):** "trocar os carrinhos pelas fichas redondas com cor, como no jogo original" →
    ficha vermelha (criança) e de madeira (computador); tabuleiro branco de borda azul; tema `'tabuleiro'`.
12. **Nota:** meta = a trilha do nível, RE-02 (seção 6).

**Em aberto**

- **Quem é cada ficha.** O vídeo não diz; a vermelha ficou com a criança. Trocar é só cor.
- **O erro de propósito do computador.** 1 em 4 é um palpite; se a criança passar a desconfiar de tudo
  ("ERRADO" sempre), baixar para 1 em 5, ou só a partir do Médio.
- **A partida do Difícil é longa** (~10 cartas, 19 jogadas). É a trilha do vídeo; medir com criança.
- **Problemas narrados:** gravar cada problema inteiro ou em pedaços.
- **Quem começa** tem uma vantagem pequena (a criança sempre começa); se pesar, alternar entre
  partidas.

---

## 10. Transcrição da narração do vídeo

Transcrição automática (faster-whisper `small`, pt, offline), sem revisão. Os tempos são do vídeo.

> **[0:08]** Aqui é a nossa corrida maluca, na corrida maluca nós vamos estudar dobro, triplo e vamos
> **[0:18]** estudar também números ordinais, a pessoa quando jogar aqui vai ser entrada, aqui vai
> **[0:24]** ser a saída, ele vai jogar se ele ao jogar vai avançar 4 casas, 1, 2, 3, 4, vai puxar
> **[0:34]** uma carta, se uma maçã custa 2 reais quanto custa 3 maçãs, se uma maçã custa 2
> **[0:44]** reais quanto custa 3 maçãs, vai ser 2 vezes 3 é o triplo, então vai custar 6
> **[0:51]** reais, acertou, fica parada aí, ok como prêmio e vai outro colega, se ele não
> **[0:59]** souber, teria que voltar de onde ele partiu, se cair no verde tem direito a uma
> **[1:05]** jogada extra, 1, esse aqui vai sair do número 1, se souber, como se
> **[1:14]** chamam 10 de forma ordinal, décimo e de forma cooperativa, os colegas aqui da
> **[1:23]** mesa concordaram que ele acertou, então tá todo mundo ensinando ao outro,
> **[1:27]** porque se ele tivesse errado, os colegas dizem não, não, não é esse não, é décimo e
> **[1:32]** aí eles colaborativamente estariam ensinando ao outro, esse aqui tirou 3, 1, 2, 3, qual é o
> **[1:39]** triplo de 4, o triplo de 4 é 4 vezes 3 de da 12 e assim vai avançando, 2, tem direito de
> **[1:48]** ficar, eu vou voltar, como se chama o número 4 de forma ordinal, 4, e assim vai
> **[1:54]** avançando, vamos acelerar para poder a gente ganhar tempo, se eu tivesse caído aqui eu
> **[2:01]** teria direito de jogar mais uma vez, 1, 2, 3, 4, 5, 6, vou olhar aqui para ver se eu
> **[2:09]** fico aqui, como se chama o número 5 de forma ordinal, quinto, 2, 1, 2, jogo mais uma
> **[2:16]** vez, 3, 1, 2, 3, deixa eu ver se eu fico aí ou volto, qual é o triplo de 2, 6 e
> **[2:24]** assim eu fui trabalhando, trabalhando, trabalhando e ganhei, foi uma forma de a gente ir mais
> **[2:30]** rápido no vídeo e eu sei que todos entenderam como o nosso jogo funciona.

**O que os quadros mostram e a narração não diz:** a trilha tem 27 passos da ENTRADA à saída preta,
com 3 casas verdes; as fichas são de madeira (bege) e vermelhas; o baralho tem o verso em roleta
colorida; a carta lida em 0:45 é "Se uma maçã custa R$ 2, quanto custam três maçãs?".
