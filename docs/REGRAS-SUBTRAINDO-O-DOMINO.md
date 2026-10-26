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
- Status: **🚧 jogável, pendências declaradas** (26/10/2026). Layout, regras e retorno conferidos
  antes num protótipo jogável (artifact "Subtraindo o Dominó", 26/10/2026). O humano pediu que se
  tomasse "a melhor decisão" nas seis decisões do planejamento: foram adotadas **todas as
  recomendadas** (seção 9).

---

## 1. O jogo em uma frase

Uma mesa com as pedras de um dominó (sem as de 0), dois dados e um computador. **Os dois jogam em
toda rodada**: a criança **toca nos dados, acha uma pedra cujos pontos somam o total e confirma em
PRONTO**; depois o computador joga os dados dele e leva a pedra dele. A **estrela da rodada** é da
criança se ela achou a pedra sem errar, senão do computador. Quem junta **mais estrelas** vence.

**O que a criança faz é a conta, não a sorte.** No brinquedo o dado decide quanto sai e quem
chegou antes leva a pedra. Aqui o total ainda vem dos dados, mas a estrela só é da criança se ela
acha a pedra sem errar — e o total sorteado sempre tem uma pedra na mesa, então nenhuma rodada se
perde por azar.

---

## 2. O que muda em relação ao brinquedo do vídeo

| O que muda | Por quê |
|---|---|
| Vários jogadores → a **criança contra o computador** | Dois alunos num aparelho deixam a nota ambígua no AVA (de quem é?). É o que a série já faz. |
| Cada jogador joga o seu dado e leva uma pedra; ganha quem tem mais pedras → **os dois jogam em toda rodada, mas quem vence é a ESTRELA, de quem faz a rodada limpa** | No brinquedo, um total esgotado deixa um jogador sem pedra e as pedras decidem: a vitória dependeria dos dados, o mesmo defeito que o humano apontou no Pratinho CDU (21/10/2026). Com a rodada limpa a vitória depende do que a criança sabe. O computador jogando em toda rodada (pedido do humano, 26/10/2026) mantém a vez do outro jogador, que o vídeo mostra. |
| Dados de verdade → **dois dados na tela; a criança toca para jogar** | Jogar o dado é a parte divertida; um toque preserva o gesto. |
| Ninguém confere a pedra → **PRONTO confere**; errar não tira nada | Ambiente não punitivo; ajuda em degraus (seção 4.2). |
| "Alguém já tirou antes" → **a pedra levada deixa um contorno apagado na mesa** | É a "subtração" do nome, visível sem escrever nada. |
| 3, 4 ou 5 rodadas combinadas → **3, 3 e 5, por nível** | Sempre ímpar: com uma estrela para um dos dois a cada rodada, **não há empate**, e a regra do vídeo para desempatar ("mais uma rodada…") deixa de ser necessária. |
| Quem tem mais pedras vence → **quem tem mais ESTRELAS vence**; as bandejas registram as pedras de cada um | Como no Pratinho CDU e no Caminho das Cores: uma estrela por rodada no alto, sem número. As duas bandejas enchem juntas (cada um leva uma pedra por rodada), então só a estrela mostra quem está na frente. |
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

1. **Dados com "?"**, num **quadro só deles** (no mesmo estilo das bandejas, alinhado ao PRONTO; a
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
  outra. **A rodada deixa de ser limpa** (a estrela será do computador).
- **Ajuda em degraus** (`nivel.ajuda`): no N-ésimo PRONTO errado **da rodada**, uma pedra certa
  **ganha destaque até o fim da rodada**: sobe, cresce um pouco, ganha um halo branco largo que
  respira devagar (~1,8 s, sem piscar) com um anel que se abre, e **as outras pedras escurecem**
  para o foco ficar nela (marcar outra pedra a devolve ao brilho normal) — no 2º erro no Fácil, no 3º no Médio, nunca
  no Difícil.
- **Certo**: **✓ verde** sobre a pedra e, após ~0,65 s, ela voa para a bandeja **da criança**, com
  75% do tamanho (a pedra é dela mesmo que a rodada tenha tido erro). O lugar dela na mesa fica
  com um **contorno tracejado**.

### 4.3 A vez do computador

O computador joga **em toda rodada**, também quando a criança não errou nada (vê-se nos testes: numa
partida perfeita do Difícil ele joga as 5 rodadas):

1. um anel suave passa da bandeja da criança para a dele (de quem é a vez, sem frase) e a narração
   diz "Vez do computador!";
2. os dois dados rolam e param no **total dele**, sorteado entre as pedras que ainda estão na mesa,
   com o selo do total em **azul** (o dourado é da criança);
3. ele "pensa" ~0,8 s e **marca uma pedra** que soma o total dele (anel **azul**, a pedra sobe um
   pouco) — escolhida ao acaso entre as que servem; ele **nunca erra**, é um modelo;
4. a pedra voa para a bandeja dele.

### 4.4 A estrela, a rodada limpa e o fim

**A estrela da rodada é de quem faz a rodada limpa**: da criança se não houve nenhum PRONTO errado
na rodada (estrela dourada no alto, anel dourado na bandeja); senão do computador (estrela
azul-acinzentada, anel azul). Há **uma estrela por rodada**, como no Pratinho CDU; as duas cores
diferem também no brilho, e a bandeja de cada um leva o ícone de quem é. As **pedras** das duas
bandejas só registram o que cada um levou: cada um leva uma por rodada, e quem vence é a estrela.

Depois da última rodada e de uma pausa curta, vai **direto** para a tela de resultado da série
("MUITO BEM!" ou "QUASE LÁ!"), sem tela intermediária. Vence quem tem mais **estrelas**
(`regras.js › quemVence`); com rodadas ímpares não há empate. **Não há cronômetro.**

---

## 5. Os três níveis

| Nível | Pedras | Rodadas | Nas pedras | Ajuda | Nomes |
|---|---|---|---|---|---|
| Fácil | 10 (faces 1 a 4, totais até 8) | 3 | pontos | no 2º erro da rodada | VOCÊ / COMPUTADOR nas bandejas |
| Médio | 21 (faces 1 a 6, totais até 12) | 3 | pontos | no 3º erro | só os ícones |
| Difícil | 21 | 5 | **algarismos** no lugar dos pontos (a criança lê os dois números e soma de cabeça); os dados continuam com pontos | nenhuma | só os ícones |

O 1º ano não é o público: a soma até 12 com decomposição é conteúdo do 2º ano.

---

## 6. Pontuação, erros e o contrato com o AVA

A mesma regra do Pratinho CDU (decisão 4):

| Campo | Significado aqui | Valores |
|---|---|---|
| `totalPerguntas` | as rodadas do nível | 3, 3 ou 5 |
| `acertos` | **vitória: nota cheia** (todas as rodadas), sem desconto dos erros (exceção à RE-02, declarada) · **derrota: as estrelas da criança** (rodadas limpas), sem desconto | 0 a `totalPerguntas` |
| `erros` | PRONTOs errados na partida inteira, contagem crua | 0 ou mais |
| `vitoria` | mais estrelas que o computador | `true`/`false` |
| `nivel` | 1 Fácil, 2 Médio, 3 Difícil | |
| `jogo` | slug estável | `subtraindo-o-domino` |
| extras | `desfecho`, `rodadasLimpas`, `rodadasComFalha`, `errosPronto`, `rodadasComAjuda`, `estrelasCrianca`, `estrelasComputador`, `ganhouDoComputador`, `totais` (o total de cada rodada da criança), `totaisComputador` (o de cada rodada do computador) | |

- **RE-01** caixa alta: `textoEmCaixaAlta: true`.
- **RE-02** — exceção: na vitória a nota não desconta os erros (eles vão para o relatório); na
  derrota é o progresso puro. Com 3 rodadas, **2 pedras vencem**: uma derrota nunca tem mais
  estrelas que uma vitória.
- **RE-03** `mostrarPlacarTexto: false`: só as estrelas, sem "N RODADAS".
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
2. **Vitória:** rodada limpa (seção 4.4). **Revisada em 26/10/2026** a pedido do humano, que viu que o
   computador "nem sempre jogava" (só levava a pedra quando a criança errava): agora ele joga em
   toda rodada (seção 4.3) e **as estrelas decidem**, como no Pratinho CDU.
3. **Placar:** uma estrela por rodada, sem número; as bandejas registram as pedras de cada um.
4. **Nota:** vitória nota cheia; derrota as rodadas limpas (seção 6).
5. **Fundo:** tema novo `'feltro'`.
6. **Rodadas:** 3, 3 e 5.

**Em aberto**

- **Computador que também erra.** Hoje o computador nunca erra: a estrela dele vem do erro da
  criança. Um computador que às vezes errasse daria mais emoção, mas a vitória voltaria a depender
  do acaso. A alternativa descartada ("falha em rodadas fixas", com "mais pedras vence") também
  criaria empates.
- **A regra do vídeo "mais pedras"** deixou de decidir: as pedras das duas bandejas enchem juntas.
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
