# REGRAS-CABO-DE-GUERRA.md — especificação do Cabo de Guerra

Especificação pedagógica, mecânica e de contrato do **Cabo de Guerra**, jogo da coleção Numerandus.
Descreve **o jogo que existe**; o brinquedo do vídeo é a referência, e cada diferença em relação a ele
está declarada na seção 2, com o motivo.

> **Nome da peça (09/11/2026):** o vídeo e o texto abaixo dizem **"nó"**; na interface do jogo
> (textos, tutorial, retorno das cartas) a peça se chama **"FICHA"** ("A FICHA VEM 3 CASAS PARA VOCÊ!").
> Neste documento, "nó" e "ficha" são a mesma coisa. Os nomes no código (`No`, `this.no`, `desenharNo`)
> e o tema `cabo` seguem como estão.

- Referência: vídeo `Desktop\cabo_de_guerra\Cabo_De_Guerra.mp4` (2min06, vertical, narrado —
  transcrição na seção 10)
- Slug: `cabo-de-guerra` · Pasta: `Games/numerandus/cabo-de-guerra/`
- Público: 2º ano (7 a 8 anos)
- Objetivo pedagógico: **multiplicação (tabuada), antecessor e sucessor, capacidade (litros) e massa
  (quilogramas)** — responder cartas de multiplicação, dar o antecessor e o sucessor de um número e
  escolher a unidade certa para medir capacidade e massa.
- Status: **🚧 jogável, pendências declaradas** (09/11/2026) — implementado em
  `Games/numerandus/cabo-de-guerra/`; pendências no README do jogo (narração própria não gravada, sem
  teste com criança nem em tablet). Regras e layout conferidos antes num protótipo jogável (artifact
  "Plano Cabo de Guerra", https://claude.ai/artifact/Fb34hQDyoD3ayHseznDiXC). O humano mandou seguir as
  decisões recomendadas ("sigua com o que voce está recomendando", 09/11/2026), todas na seção 9.

---

## 1. O jogo em uma frase

Uma tira de bolinhas com um **nó** no meio e uma ponta de cada lado. Na sua vez, a criança **joga o
dado, responde uma carta e, se acertar, o nó anda tantas casas quanto o dado mandou, para a ponta
dela**. O computador joga do mesmo jeito para o lado dele, responde em voz alta, e a criança
**confere** se ele acertou. Vence quem leva o nó até a própria ponta: **chegou, venceu**, sem carta.

**O que a criança faz é a conta, não a sorte.** O dado diz quanto o nó anda; a carta diz se ele anda.
Errar nunca acaba a partida: só deixa o nó parado e passa a vez.

---

## 2. O que muda em relação ao brinquedo do vídeo

| O que muda | Por quê |
|---|---|
| Dois jogadores à mesa → a **criança contra o computador** | Dois alunos num aparelho deixam a nota ambígua no AVA (de quem é?). É o que a série já faz. |
| "Os colegas concordam que ele acertou" → **a criança confere a resposta do computador** (CERTO / ERRADO) | É a parte cooperativa do vídeo (1:30, o "31 não, 31 é sucessor"), num jogo de uma criança só. O computador erra de propósito 1 vez em 4, então conferir exige fazer a conta. |
| O jogador desloca o nó com a mão → **o nó desliza sozinho, contando em voz alta** | A conta deste jogo está na carta. Mover casa a casa dobraria o trabalho e alongaria a partida. |
| Resposta falada → **três respostas grandes, narradas** | Toque em vez de fala. Uma das erradas é sempre a confusão típica (o sucessor no lugar do antecessor, um grupo a mais na tabuada). |
| O vídeo não mostra o erro → **errou, o nó fica parado e a vez passa; o jogo mostra a conta certa** | Empurrar o nó para o adversário seria punitivo (`METODO-JOGOS-NUMERANDUS.md` §3.B); não puxar já custa a rodada. |
| A tira de ~11 passos de cada lado → **7, 8 ou 9 passos por nível** | Cabo de guerra é um passeio aleatório: o nó vai e volta, e a partida demora mais do que a soma dos dados sugere. Com 11 passos a média é 13 cartas e 10% das partidas passam de 28 (seção 5). |
| As duas pontas vermelhas → **a da criança vermelha, a do computador de madeira** | A criança precisa saber de que lado está; é a mesma convenção das fichas da Corrida Maluca. |
| A tira sobre a mesa branca → **tela 1280×720, tira branca de borda azul sobre fundo verde-floresta** | Padrão do motor; o fundo não pode brigar com a tira e o nó. |

**Mantido do brinquedo:** o dado de 1 a 6; a tira de bolinhas cinza com uma vermelha no centro; o nó
preto que começa no centro; o monte de cartas sem repetição ("essa já saiu"); os temas das cartas
(multiplicação, antecessor e sucessor, litros, quilograma); não é preciso cair exato na ponta.

---

## 3. A tira e o nó

- **A tira** é uma barra branca de borda azul de 1200 × 150 px a partir de (40, 104), com
  `2 × passos + 1` bolinhas a distâncias iguais: a da esquerda é a **ponta da criança** (vermelha), a da
  direita a **ponta do computador** (de madeira), a do meio (rosada) é o ponto de partida do nó.
- **Medidas:** raio da bolinha = `min(40, espaçamento × 0,36)` → 39 px no Fácil, 28 no Médio e 22 no
  Difícil (as bolinhas não são alvos de toque); o nó tem 1,45 vez o raio (no máximo 50).
- **O nó** é um disco preto com um laço de corda e um brilho pequeno. Quando é puxado, um selo branco
  sobre ele conta as casas já andadas. Na chegada, ele e a ponta que ganhou brilham, de forma estável.
- **A posição** do nó é um índice `i` de 0 a `2 × passos`: 0 é a ponta da criança, `passos` é o centro
  e `2 × passos` a do computador (`src/regras.js`).
- **Embaixo da tira**, os nomes VOCÊ e COMPUTADOR; depois, a faixa da vez, o dado, o botão JOGAR O DADO
  e, nos dois lados, quantas casas faltam para cada um ganhar. Com a carta aberta, os nomes somem
  e a tira e o nó continuam à vista.

---

## 4. A jogada

### 4.1 A vez da criança

1. **JOGAR O DADO** — o botão grande (ou o próprio dado). O dado gira um instante (sem flash) e para.
2. **A carta abre** com o dado do lance ("PUXA 3 CASAS"), a pergunta narrada e três respostas. **O nó
   ainda não anda:** só se mexe se ela acertar. A criança toca uma resposta.
3. **Certo:** a resposta fica verde, "ACERTOU! O NÓ VEM 3 CASAS PARA VOCÊ!". Depois do **CONTINUAR**,
   o nó desliza casa a casa para a ponta dela, e a voz conta "um", "dois", "três".
4. **Errado:** a certa acende e o jogo mostra a conta ("7 × 6 = 42"). Depois do CONTINUAR a vez passa; o
   nó fica onde estava. Conta um erro.

O **CONTINUAR** fecha a carta: a criança lê e ouve o retorno no próprio ritmo; nada avança sozinho.

### 4.2 A vez do computador

Joga o próprio dado (honesto), "tira" uma carta e **responde em voz alta**: "O COMPUTADOR DIZ: 42".
**Erra de propósito 1 vez em 4**, escolhendo uma das respostas erradas da carta. A criança **confere**
com dois botões, CERTO e ERRADO:

- conferiu bem → "ISSO! ELE ACERTOU." / "ISSO! ELE ERROU.";
- conferiu mal → "OLHE DE NOVO: ELE ACERTOU." / "… ELE ERROU." — sempre com a conta certa.

Se ele acertou, o nó vai para o lado dele, tantas casas quanto o dado dele; se errou, fica. **Conferir
errado não custa nada à criança** e não conta como erro na nota: é treino, registrado à parte.

### 4.3 Ordem e fim

- **Quem começa:** sorteio pelo dado (decisão de 11/11/2026). Os dois jogam um dado e quem tira o **maior**
  começa; empate, sorteia de novo. Na tela: dois dados grandes no gramado ("VOCÊ" e "COMPUTADOR") e a faixa
  "QUEM COMEÇA?" → "VOCÊ COMEÇA!" / "O COMPUTADOR COMEÇA!". A regra do vídeo era que a criança joga primeiro.
  Nenhuma carta repete na partida (como no vídeo).
- O nó **chegou a uma ponta**: vence quem o puxou, **na hora, sem carta**. Passar da ponta para nela.
- Ponta da criança: vitória. Ponta do computador: derrota (registrada). Não há cronômetro.

---

## 5. Os três níveis

O dado é sempre um, de 1 a 6. O que cresce é a trilha e a carta.

| Nível | Passos até a ponta | Multiplicação | Antecessor e sucessor | Capacidade e massa |
|---|---|---|---|---|
| **1 — Fácil** | 7 (15 bolinhas) | ×2 a ×5 por 1 a 5 | de 11 a 50 | unidade certa (litro ou quilograma) |
| **2 — Médio** | 8 (17 bolinhas) | ×2 a ×6 por 2 a 8 | de 20 a 100 | + soma de litros e de quilos (1 a 5) |
| **3 — Difícil** | 9 (19 bolinhas) | ×2 a ×9 por 2 a 9 (o 7 × 6 do vídeo) | de 90 a 999, virando dezena e centena | + garrafas de 2 a 4 litros, 2 a 4 delas |

**As cartas.** O grupo é sorteado com chances iguais entre os do nível (7, 10 e 11 grupos); a mesma carta
não volta na partida (`chave`: `m7x6`, `a30`, `ubalde`…).

| Grupo | Pergunta | Respostas erradas | Conta mostrada |
|---|---|---|---|
| Multiplicação | 7 × 6 = ? | um grupo a mais (49), um a menos (35), a soma (13) | 7 × 6 = 42 |
| Antecessor | QUAL É O ANTECESSOR DE 30? | o sucessor (31), 28, o próprio 30 | ANTECESSOR VEM ANTES: 29, 30 |
| Sucessor | QUAL É O SUCESSOR DE 39? | o antecessor (38), 41, o próprio 39 | SUCESSOR VEM DEPOIS: 39, 40 |
| Unidade | O SUCO DA JARRA É MEDIDO EM… | duas outras unidades (QUILOGRAMAS, METROS) | A CAPACIDADE SE MEDE EM LITROS |
| Soma | 2 LITROS DE SUCO E MAIS 3 LITROS DE SUCO. QUANTOS LITROS? | a soma + 1, a − 1, o produto | 2 + 3 = 5 LITROS |
| Garrafas (recipientes) | 3 GARRAFAS DE 2 LITROS. QUANTOS LITROS NO TOTAL? (também jarras, baldes, sacos e caixas de quilos) | a soma das parcelas (5), um grupo a mais, um a menos | 3 × 2 = 6 LITROS |
| Dobro | QUAL É O DOBRO DE 7? | somar 2 em vez de dobrar (9), 12, 16 | O DOBRO DE 7 É 7 + 7 = 14 |
| Triplo | QUAL É O TRIPLO DE 4? | o dobro (8), 9, 15 | O TRIPLO DE 4 É 4 + 4 + 4 = 12 |
| Metade | QUAL É A METADE DE 14? | 8 (um a mais), 6, 9 | A METADE DE 14 É 7, PORQUE 7 + 7 = 14 |
| Sequência | 10, 15, 20, 25, … QUAL NÚMERO VEM DEPOIS? | o número seguinte comum (26), 29, 31 | A SEQUÊNCIA AUMENTA DE 5 EM 5: 10, 15, 20, 25, 30 (no Difícil também diminui) |
| Adição repetida | 4 + 4 + 4 = ? | somar o número com a quantidade de parcelas (7), 8, 16 | 4 + 4 + 4 = 12, OU SEJA, 3 × 4 = 12 |

**Mais variedade de cartas (09/11/2026).** Os níveis tinham 4, 5 e 6 tipos de carta e o de unidade só
tinha 6 cartas, que se repetiam. Agora são **7, 10 e 11 tipos**: 24 cartas de unidade (12 de capacidade e
12 de massa), problemas de soma e de recipientes com 6 e 5 contextos, e os tipos novos acima (dobro,
triplo, metade, sequência e adição repetida, ligados ao que o 2º ano trabalha com a multiplicação). A
soma passou a escrever "1 LITRO" no singular. O teste de jogabilidade confere a conta de cada tipo novo e
quantas cartas diferentes cada nível oferece. Cada carta nova é uma fala a gravar (README, pendências).

A diferença entre antecessor e sucessor é o erro que o vídeo registra ("31 não, 31 é sucessor"), então
o distrator forte desses dois grupos é sempre o do lado oposto.

**Duração medida** (20 000 partidas simuladas por linha; dado honesto, a criança começa, o computador
acerta 75%):

| Passos | Criança acerta | Vence | Cartas dela, média | 90% até | Jogadas, as duas vezes |
|---|---|---|---|---|---|
| **5** | 90% / 75% / 60% | 78% / 64% / 50% | 2,7 / 2,8 / 2,9 | 5 / 6 / 6 | 4,5 / 5,0 / 5,3 |
| **7** | 90% / 75% / 60% | 78% / 60% / 38% | 5,3 / 5,8 / 5,7 | 11 | 9,9 / 10,9 / 11,0 |
| **9** | 90% / 75% / 60% | 81% / 58% / 33% | 8,2 / 9,1 / 8,7 | 17 / 18 / 17 | 15,7 / 17,6 / 17,1 |
| 11 (a do vídeo) | 75% | 56% | 13,5 | 28 | 26,5 |

**Por que o Fácil não tem 5 passos (09/11/2026).** Com 5 passos, um dado 6 respondido certo leva a ficha
do centro à ponta numa jogada só (passar da ponta vale), e 33% das partidas acabavam nas duas primeiras
jogadas, com menos de 3 cartas para a criança. A trilha mais curta em que isso não acontece é a de
**7 passos**, então os níveis são **7 / 8 / 9**. Medido de novo (40 000 partidas, os dois acertando 75%):

| Passos | Acaba nas 2 primeiras jogadas | Nas 4 primeiras | Cartas da criança, média |
|---|---|---|---|
| 5 (descartado) | 33% | 58% | 2,8 |
| 6 | 16% | 39% | 4,0 |
| **7** (Fácil) | 0% | 21% | 5,7 |
| **8** (Médio) | 0% | 14% | 7,2 |
| **9** (Difícil) | 0% | 8% | 9,1 |

Regra de projeto: **nenhum nível pode ter menos de 7 passos**, porque o dado vai até 6 (o teste de
jogabilidade confere isso nas regras puras).

---

## 6. Pontuação, erros e o contrato com o AVA

- **Meta:** os passos do nível — **7, 8 ou 9**. Durante a partida, **os quadros dos dois lados** dizem
  quantas casas faltam para cada um ganhar.
- **Progresso:** as casas que o nó está do centro rumo à ponta da criança (0 se está do outro lado).
- **Erro:** cada carta respondida errada pela criança. Conferir mal a resposta do computador **não** é erro.
- **Vitória:** pontuação = meta − erros (RE-02), mínimo 0. **Derrota:** pontuação = o progresso, sem desconto.
- **Tela final:** "N CASAS" (RE-03) — `unidadePlacar: { singular: 'casa', plural: 'casas' }`. Estrelas
  derivadas pela própria tela (RE-04).
- **AVA:** `acertos` = pontuação, `erros` = erros, `totalPerguntas` = meta, `nivel` = 1 | 2 | 3,
  `vitoria` booleano. Extras: `casasPuxadas`, `cartasRespondidas`, `cartasCertas`, `cartasPorTipo`
  (`{ multiplicacao: "certas/respondidas", … }`), `conferencias`, `conferenciasCertas`, `maiorPuxada`,
  `jogadas`, `venceuCabo`.

**Por que a nota é a trilha, e não as cartas.** É o padrão de meta fixa do contrato (`CONTRATO-AVA.md`
§3) e o mesmo da Corrida Maluca. O acerto das cartas, que mede melhor a conta, não se perde: vai em
`cartasCertas` / `cartasRespondidas` e por grupo, para o relatório.

---

## 7. Áudio

Reaproveitado dos jogos irmãos (como pediu o humano na Corrida Maluca, 03/11/2026): tudo o que já
existia gravado e serve aqui. O resto a cena já pede pelo id definitivo; sem o arquivo ela fica em
silêncio e o console diz o texto. Frases em pedaços **tocam inteiras ou não tocam**.

| O quê | ids | Quando | Existe? |
|---|---|---|---|
| Efeitos | `acertoSOS`, `erroSOS`, `somErro`, `somProgresso`, `somConta` | vitória, derrota, carta errada ou conferência mal feita, carta certa ou conferência bem feita, dado parando e nó pousando | **Sim** — os mesmos arquivos da Corrida Maluca |
| Números | `numero1`–`numero10` | a contagem das casas (1 a 6) e a resposta do computador | **Sim** — `um.mp3`…`dez.mp3` do Jogo dos Blocos (locução de 2013), não ouvidos |
| Números | `numero11`–`numero999` (ao menos os de 11 a 100 e os que as cartas pedem) | a pergunta e a resposta do computador nas cartas de número | **Não** — gravar |
| Falas curtas | `suaVez`, `vezDoComputador`, `muitoBem` | troca de vez, carta certa | **Sim** — do Jogo dos Blocos via Subtraindo o Dominó, não ouvidas |
| Começo das perguntas | `quantoE`, `vezes`, `qualOAntecessorDe`, `qualOSucessorDe` | a pergunta em pedaços ("quanto é" + número + "vezes" + número) | **Não** — gravar |
| Perguntas inteiras | `unidade_<id>` (suco, balde, leite, arroz, melancia, feijao) e `problemaSoma`, `problemaRecipientes`, `problemaSequencia`, `problemaAdicao` | cartas de unidade, soma e garrafas | **Não** — gravar (formato dos problemas em aberto) |
| Falas curtas | `quaseLa`, `oComputadorDiz`, `eleAcertou`, `isso`, `olheDeNovo` | carta errada, conferência | **Não** — gravar |
| Respostas em palavras | `resposta_litros`, `resposta_quilogramas`, `resposta_metros`, `resposta_centímetros` | o computador respondendo uma carta de unidade | **Não** — gravar |
| Tutorial | `tutorialTela1`–`5` | cada passo | **Não** — gravar (os textos estão no `config.js`) |

---

## 8. O que o motor já tem, e o que foi preciso criar

| Peça | Situação |
|---|---|
| Menu, níveis, tutorial, ajuda (RE-05), pausa, resultado, `ScoreSystem`, `AvaBridge`, `Watchdog` | **Já havia** — vem do template |
| Tema visual `'cabo'` | **Feito** — `engine/ui/Background.js`: degradê suave de verde-floresta; nas telas de vitrine, um halo claro no centro e bandeirinhas vermelhas e azuis, nós de corda e dados flutuando devagar nas margens (opacidade 0,12–0,15, períodos de 6 a 9 s, nada pisca). A placa do título é a `PlacaTituloLimpa`. Na partida: só o degradê, sem halo nem enfeites. Registrado como tema de interior em `MenuScreen`, `ResultScreen` e `TutorialScreen`; documentado em `COMPONENTES.md`. Nenhum outro tema muda. |
| Dado, cartas com três respostas, vez do computador, conferência CERTO/ERRADO, dedinho | **Copiados da Corrida Maluca** para `src/desenho.js` e `src/scenes/GameScene.js` (o dado já vive em três jogos; subir para o motor mexeria nos irmãos testados e ficou para uma mudança própria) |
| A tira reta, o nó que desliza, os quadros de quantas casas faltam, a puxada | **Feito** — regras puras em `src/regras.js`, desenho em `src/desenho.js`, cena em `src/scenes/GameScene.js`. Conferido por `tools/teste-jogabilidade-cabo-de-guerra.mjs` (regras puras em Node e a partida com gesto real, 75 verificações) |

---

## 9. Decisões

Planejadas no artifact (09/11/2026). O humano mandou seguir as recomendadas.

1. **Adversário:** o computador.
2. **A mesa que confere:** o computador erra 1 vez em 4 e a criança confere com CERTO / ERRADO.
3. **Errou:** o nó fica parado e a vez passa (o vídeo não mostra a regra). Alternativa descartada: o
   adversário puxa 1 casa de graça.
4. **Trilha por nível:** 7, 8 e 9 passos, medidos por simulação (seção 5). A de 11 fica de fora.
5. **Mover o nó:** sozinho, contando em voz alta, depois da carta certa.
6. **Responder a carta:** três respostas grandes, narradas, com a confusão típica entre as erradas.
7. **Cartas:** nunca repetem na partida (o vídeo: "essa já saiu").
8. **Chegada:** o nó na ponta vence na hora, sem carta; passar da ponta vale.
9. **Níveis:** o que cresce é a trilha e a carta, não o dado.
10. **Visual:** tira branca de borda azul, ponta vermelha (criança) e de madeira (computador), nó preto
    com laço de corda; tema `'cabo'`.
11. **Nota:** meta = os passos do nível, RE-02 (seção 6).

**Em aberto**

- **As cartas de litros e quilogramas.** O narrador só cita os temas. Os formatos (unidade certa, soma e
  garrafas) são proposta; se o baralho físico tem outros, o banco muda (`UNIDADES` e as fábricas em `regras.js`).
- **Quantas bolinhas tem a tira de verdade.** Contei ~11 passos do centro à ponta, pelo vídeo; a trilha do
  jogo não depende disso.
- **Quem é cada ponta.** O vídeo não diz; a vermelha ficou com a criança. Trocar é só cor e sentido.
- **O erro de propósito do computador.** 1 em 4 é um palpite; se a criança passar a desconfiar de tudo,
  baixar para 1 em 5, ou só a partir do Médio.
- **Narração das perguntas:** gravar cada pergunta inteira ou em pedaços, e até que número.
- **Quem começa:** resolvido em 11/11/2026 com o sorteio pelo dado. Simulação (40 000 partidas, computador
  acertando 75%): criança acertando 75% vence 60% / 58% / 57% se começa sempre (Fácil / Médio / Difícil), 41% /
  42% / 43% se o computador começa e **50% nos três níveis com o sorteio**. O AVA recebe `quemComecou` e
  `sorteios` como extras.

---

## 10. Transcrição da narração do vídeo

Transcrição automática (Whisper, offline), **não revisada por um humano**; erros de reconhecimento
possíveis. Os tempos são do vídeo.

```
[008.7-016.0] Temos aqui para o segundaninho o jogo do cabo de guerra e a gente sabe como forçou do cabo de guerra
[016.4-018.0] é um puxa para lá
[018.0-021.4] outro puxa para cá então ele está aqui no centro
[022.4-024.4] vai jogar o dado
[024.5-028.3] de acordo com a pergunta que tirar tem perguntas de
[028.9-031.3] multiplicação tem perguntas de
[032.2-034.2] antecessor sucessor
[035.0-036.5] capacidade de
[036.5-037.8] litros
[037.8-044.9] quilograma e aí se ele acertar a pergunta ele vai andar ou que tirar no seu
[045.6-047.6] dado então vamos lá
[047.9-049.4] joguei o dado
[049.4-051.4] vem a pergunta
[051.4-053.0] 7 vezes 6
[053.0-061.1] 42 acertou então tira a pergunta para o lado de cá porque essa já saiu e vou andar três casas para a frente
[061.1-068.2] eu estive andei três casas agora vai o colega que está jogando comigo o colega que está jogando comigo
[068.2-075.6] ele jogou o dado tirou um se acertar a pergunta ele puxa um para o lado dele então vou tirar
[075.6-083.8] dois vezes três seis então ele vai andar uma casa para cá ok vai agora novamente o jogador que
[083.8-090.2] tem um para lá e aí vou jogar tirei três puxa pergunta
[090.2-100.6] qual é o antecessor de 30 o antecessor de 30 é 31 não não 31 não 31 é sucessor
[100.6-109.4] o antecessor é o que vem antes é o 29 ok 29 acertou então vai três casas para frente
[109.4-116.4] dois três e assim sucessivamente vem para trás vai para frente vem para trás vem para
[116.4-125.7] frente e ganha quem chegar primeiro na sua extremidade aqui ou do lado de cá ok abraço isso
```

O que o vídeo mostra além da fala: uma tira vertical de bolinhas cinza com uma vermelha em cada ponta e
outra no centro (de onde o nó preto sai); um dado pequeno; cartas de madeira com o verso em roleta
colorida e a frente em papel claro ("7 × 6 = ?", "2 × 3 = ?", "Qual é o antecessor de 30?"). O vídeo não
mostra nenhuma carta de litros ou quilograma.
