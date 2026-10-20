# REGRAS-PRATINHO-CDU.md — especificação do Pratinho CDU

Especificação pedagógica, mecânica e de contrato do **Pratinho CDU**, jogo da coleção
Numerandus. Descreve **o jogo que existe**; o brinquedo do vídeo e o jogo HTML antigo são as
referências, e cada diferença em relação a eles está declarada na seção 2, com o motivo.

- Referências:
  - vídeo `numerandus\finalizados\2ano\Pratinho_CDU\Pratinho_Cdu.mp4` (3min08, vertical,
    narrado — **transcrição pendente**, seção 10);
  - animação Remotion `numerandus\jogos\2ano\CDU_video\my-video\src\` (`CduPlate.tsx`,
    `AdditionAnimation.tsx`, `Whiteboard.tsx`): "2 na centena, 3 na dezena, 5 na unidade →
    200 + 30 + 5 = 235", levado para a "Rodada 1" do quadro;
  - o jogo HTML antigo `Aulas para Refazer\Jogo_CDU_1ano` ("Jogo do Pratinho CDU").
- Slug: `pratinho-cdu` · Pasta: `Games/numerandus/pratinho-cdu/`
- Público: 1º e 2º ano (6 a 8 anos)
- Objetivo pedagógico: **ler números de até três algarismos pelo valor posicional** — contar
  as quantidades de centenas, dezenas e unidades, formar o número (inclusive com **zero numa
  casa**) e **comparar** dois números.
- Status: **🚧 jogável, pendências declaradas** (20/10/2026). Layout, regras e retorno
  conferidos antes num protótipo jogável (artifact "Pratinho CDU", 19 e 20/10/2026), com estas
  decisões do humano: fundo neutro; estrelas no lugar do texto de rodada; nenhuma frase de
  retorno na tela; contagem por halo, sem número; DESFAZER para o toque por engano.

---

## 1. O jogo em uma frase

A criança joga um punhado de grãos num prato dividido em **C, D e U**, **conta cada fatia**,
**forma o número** e depois diz **qual é maior**, o dela ou o do computador; quem formou o
maior ganha a estrela da rodada.

**O que a criança faz é a leitura e a comparação, não a sorte.** Quantos grãos caem é acaso;
transformar as quantidades em número e comparar os números é o que o jogo confere e o que vai
para a nota.

---

## 2. O que muda em relação às referências

| O que muda | Por quê |
|---|---|
| **Sem cronômetro** (o jogo antigo dava 20 s e uma tela "Tempo Esgotado") | `METODO-JOGOS-NUMERANDUS.md` §3.B: nunca cronômetro regressivo |
| **Rolinhos C/D/U** no lugar de digitar num campo de texto | Aos 6 anos a criança não digita, e o motor não tem teclado. O rolinho por casa também reforça o valor posicional: cada algarismo mora na sua casa |
| **Contar tocando no GRÃO**, que fica marcado com um halo | Pedido do humano (20/10): a criança aponta o grão que está contando, como faria com o dedo no brinquedo. O grão desenhado (~30 px) fica abaixo dos 64 px mínimos, então o alvo é um círculo de pelo menos 64 px em volta dele. O halo não tem número: quem conta é a criança |
| **Ganha a rodada quem forma o MAIOR número**, e é a criança que diz qual é | O jogo antigo somava as rodadas; somar números de 3 algarismos foge do 1º ano. Comparar é conteúdo do 1º e do 2º ano e dá um segundo momento de raciocínio por rodada |
| **5 rodadas** (o antigo tinha 4) | A trilha de 5 estrelas da série (Caminho das Cores) e a fileira de 5 estrelas do resultado (RE-04) |
| **Grãos fora do prato só no Difícil**; **nunca** grão na linha entre fatias | "Caiu fora não conta" é do brinquedo e é boa atenção. Grão em cima da linha cria dúvida sem conteúdo nenhum |
| **Fácil só com D e U** (a fatia C apagada) | Números até 99 para o 1º ano; centenas até 999 são do 2º |
| **Nenhuma frase de retorno na tela** | Pedido do humano (20/10): o retorno é cor, símbolo, movimento e som; as frases existem como fala |
| **Nada vale antes do PRONTO**, com DESFAZER | Pedido do humano (20/10): um toque por engano não pode virar erro |

**Mantido do brinquedo:** o prato redondo em três fatias com C verde, D vermelho e U
laranja; os grãos escuros jogados num punhado; a conta "200 + 30 + 5 = 235" da animação; o
quadro das rodadas, deitado como a folha do caderno.

---

## 3. O prato e os grãos

- **Fatias**: C em cima à esquerda (150°–270°), D em cima à direita (270°–30°), U embaixo
  (30°–150°), cada uma com a letra a 0,55 raio do centro.
- **Onde um grão cai** (`src/regras.js`, `posicionarGraos`): entre 0,26 e 0,9 raio, com 11° de
  folga das linhas entre fatias e longe da letra. O espalhamento é por "melhor candidato": para
  cada grão sorteiam-se 40 pontos e fica o mais longe dos grãos já postos, de qualquer fatia.
  Um limite fixo de distância não funcionava: com 9 grãos numa fatia, quase metade das jogadas
  do Difícil saía com grãos encostados. Hoje cerca de 6% das jogadas do Difícil ainda têm dois
  halos a menos de um diâmetro — só visual.
- **Ordem da contagem**: dentro da fatia, os grãos acendem de uma borda à outra (pelo ângulo),
  para a contagem andar pela fatia em vez de pular.
- **Fora do prato** (Difícil): 1 a 3 grãos entre 1,2 e 1,36 raio, desbotados. O prato encolhe
  nesse nível (raio 196 em vez de 236) para eles caberem na tela.
- **Conferência**: 30 000 jogadas sorteadas (10 000 por nível) passaram nas regras de faixa,
  fatia, raio, opções do Fácil e comparação.

---

## 4. A rodada

### 4.1 A vez da criança

1. **JOGAR** (botão grande no cartão). Os grãos caem com quique, em ordem embaralhada; os
   rolinhos (ou as 3 opções do Fácil) já aparecem, travados.
2. **Contar**: tocar num grão marca aquele grão (halo branco + onda + som); tocar de novo
   desmarca. O alvo é o grão mais perto do dedo, a até max(32 px, 0,14 raio). Fatia vazia: um
   **0** grande aparece e some. Toque no vazio de uma fatia com grãos: ela só pisca.
3. **Formar**: ▲/▼ em cada rolinho (param no 0 e no 9). No Fácil, marcar uma das 3 opções.
4. **DESFAZER** volta um passo por toque (um grão, um clique de rolinho, uma troca de opção).
5. **PRONTO** confere.

### 4.2 Certo, errado e a ajuda em degraus

- **Certo**: anel verde no cartão, a conta por casa em pílulas coloridas com um visto verde,
  e o número vai para o quadro. Depois de 1,7 s, vez do computador.
- **Errado**: o cartão balança com anel âmbar e o som de erro. Conta um erro.
  - **2º erro** da rodada: a fatia e o rolinho das casas erradas acendem em âmbar.
  - **4º erro**: o jogo **conta junto** essas fatias, do zero, grão por grão (420 ms cada).
  - **Fácil** (sem rolinho para acender): o 2º erro já conta junto. A opção errada fica
    apagada e não pode ser marcada de novo.
- As opções erradas do Fácil são, nesta ordem: os algarismos **trocados** (35 → 53) e a **soma**
  dos grãos (3 + 5 = 8). Só quando essas não servem entram vizinhos de dez em dez ou de um em um.

### 4.3 A vez do computador

O ícone do cartão vira o monitor âmbar. Os grãos dele caem, ele acende os halos fatia por
fatia (260 ms por grão), põe cada quantidade no rolinho e mostra a conta. O computador nunca
erra: ele é o modelo da leitura.

### 4.4 Qual é o maior?

Os dois números lado a lado (pessoa azul e monitor âmbar) com um **?** tracejado no meio. A
criança marca um (dá para trocar) e toca **PRONTO**.

**O que fazer aparece sem frase** (pedido do humano, 20/10: "o usuário deve estar ciente do
que irá fazer"): a estrela da rodada flutua sobre o **?** — a estrela está em jogo e vai para
um dos lados —, os números que ainda valem pulsam de leve e o dedinho branco da coleção toca
em cada um, em laço. Ele aponta os DOIS: mostra o gesto, não a resposta. Com um número
marcado, o dedinho passa para o PRONTO. A fala `qualEMaior` completa quando for gravada.

**A pergunta escrita** "QUAL NÚMERO É O MAIOR?" fica no alto do cartão durante a comparação
(pedido do humano, 20/10). É o único texto de instrução da partida: contar e formar o número se
explicam pelo gesto, comparar não.

**Maior ou menor** (`nivel.perguntas`, ligado no Fácil a pedido do humano, 20/10): a pergunta é
sorteada por rodada entre "MAIOR" e "MENOR", cada uma pelo menos 2 vezes nas 5 rodadas
(`regras.js`, `sortearPerguntas`), e a palavra que muda vem em âmbar. **A estrela vai para o
número que a pergunta pede**: numa rodada de "menor", ganha quem fez o menor. Assim a resposta
certa e a estrela apontam sempre para o mesmo número, e a criança precisa ler a pergunta. O
sinal entre os números continua sendo a relação real (55 > 23), qualquer que seja a pergunta.
Médio e Difícil perguntam só "maior".

- **Certo**: o **?** vira **>** ou **<** num círculo verde, e o jogo mostra **quem fez o
  maior** sem frase: o número vencedor ganha contorno dourado e a estrela da rodada no canto
  (dourada para a criança, âmbar escura para o computador), e o outro apaga. Depois a estrela
  acende na trilha de cima.
- **Errado**: o cartão balança, o número marcado fica apagado e conta um erro.
- **Empate**: aparece **=** direto e a rodada fecha sozinha, com a estrela cinza.

### 4.5 Estrelas e fim

- No alto, **5 estrelas**, uma por rodada: **dourada** (a criança formou o maior), **âmbar
  escura** (o computador), **cinza** (empate). A da rodada de agora tem contorno azul.
- Depois da 5ª rodada, o cartão mostra o **troféu** (se a criança tiver mais estrelas) e o
  placar de estrelas com os dois ícones. A seta leva ao resultado.

---

## 5. Os três níveis

| Nível | Casas | Grãos por fatia | Zero numa casa | Fora do prato | Resposta |
|---|---|---|---|---|---|
| **1 — Fácil** | D, U | D 1–9, U 0–9 | natural (U = 0 em 1 de cada 10) | não | 3 opções |
| **2 — Médio** | C, D, U | 1–5 cada (o jogo antigo) | nunca | não | rolinhos |
| **3 — Difícil** | C, D, U | C 1–9, D 0–9, U 0–9 | forçado em 50% das jogadas (≈ 59% no total) | 1 a 3 grãos | rolinhos |

---

## 6. Pontuação, erros e o contrato com o AVA

- **Meta**: 5 rodadas. Uma rodada conta (`placar.acertar()`) quando a leitura **e** a
  comparação estão certas.
- **Erro**: cada PRONTO errado, na leitura ou na comparação. Contar, girar rolinho, marcar e
  desfazer **nunca** contam.
- **Vitória do contrato**: terminar as 5 rodadas. Pontuação = 5 − erros, mínimo 0 (RE-02).
- **Não existe derrota.** Quem forma o número maior depende de quantos grãos caíram — é sorte.
  Se "perder do computador" fosse a derrota do contrato, a RE-02 daria a nota cheia (sem
  desconto) justamente para quem perdeu, e descontaria de quem ganhou. A nota fica com a
  leitura; o duelo vai em `extras` e aparece só no fim da partida.
- **Tela final**: só as 5 estrelas (`mostrarPlacarTexto: false`): "3 RODADAS" mentiria para
  quem jogou as 5. Estrelas derivadas pela própria tela (RE-04).
- **AVA**: `acertos` = pontuação, `erros` = erros, `totalPerguntas` = 5, `vitoria: true`.
  Extras: `leiturasDePrimeira`, `errosLeitura`, `errosComparacao`, `rodadasComAjuda`,
  `estrelasCrianca`, `estrelasComputador`, `ganhouDoComputador`, `numeros`.

Conferido em navegador (20/10/2026, robô pelos métodos da cena): partida com 1 comparação
errada → "MUITO BEM!" com 4 estrelas. A mensagem dentro de iframe ainda não foi conferida.

---

## 7. Áudio

| Som | `id` | Uso | Existe? |
|---|---|---|---|
| Narração do tutorial (4 telas) | `tutorialTela1`–`4` | `fala` de cada passo | **Não** — gravar |
| Números "um" a "nove" | `numero1`–`numero9` | a contagem a cada grão (toque da criança e ajuda) | **Não** — gravar |
| Frases curtas | `suaVez`, `vezDoComputador`, `nenhumGraoZero`, `muitoBem`, `tenteDeNovo`, `confiraACasaAcesa`, `vamosContarJuntos`, `qualEMaior`, `qualEMenor`, `voceFezOMaior`, `voceFezOMenor`, `computadorFezOMaior`, `computadorFezOMenor`, `olheACentena`, `olheADezena`, `empate` | retorno e troca de vez | **Não** — gravar |
| Número formado em voz alta | — | ler "duzentos e trinta e cinco" no acerto | **Não pedido** — ver seção 9 |
| Acerto, erro, contagem, resultado | `somProgresso`, `somErro`, `somConta`, `acertoSOS` | efeitos | **Sim** — reaproveitados da coleção |

Sem as gravações o jogo funciona mudo nesses pontos: nenhuma mecânica depende de ouvir.

---

## 8. O que o motor já tem, e o que falta

| Peça | Situação |
|---|---|
| Menu, níveis, tutorial, ajuda (RE-05), pausa, resultado, `ScoreSystem`, `AvaBridge` | Pronto — vem do template |
| Tema visual `'mesa'` | **Feito** — `engine/ui/Background.js`: ardósia escura neutra; nas telas de vitrine, dois pratinhos C/D/U e grãos apagados (0,08–0,14), parados, que continuam pelas barras do letterbox. Registrado como tema de interior em `MenuScreen` (placa limpa), `ResultScreen` e `TutorialScreen` |
| Prato, grão, halo, rolinho, estrelas, ícones | **Feito na cena** (`src/desenho.js`) — viram componente do motor só se um segundo jogo precisar |
| Regras puras | `src/regras.js` |

---

## 9. Decisões em aberto

- **Ler o número em voz alta** no acerto ("duzentos e trinta e cinco"): ~40 gravações
  combináveis. Vale para o 1º ano, que ainda está aprendendo o nome dos números?
- **Estrela do computador**: âmbar escura ao lado da dourada da criança. Conferir com um aluno
  se a diferença fica clara; se não, desenhar o ícone do monitor sob a estrela.
- **Sem número no grão** (decisão de 20/10): a criança que se perde na contagem não tem ponto
  de apoio além da fala `numero1..9`. Se isso aparecer nos testes, mostrar o total da fatia só
  na ajuda de contar junto.
- **Duração**: ~20–40 s por rodada no Médio. Medir com criança se 5 rodadas cansam.
- **Maior ou menor também no Médio e no Difícil?** Hoje só o Fácil varia (`perguntas`). É uma
  linha no nível; decidir depois de ver crianças jogando o Fácil.
- **Estrela para o computador numa resposta certa**: a criança pode acertar "qual é o menor?"
  e ver a estrela ir para o número do computador. É a regra (a estrela é do número pedido),
  mas conferir com um aluno se isso não soa como castigo.

---

## 10. Transcrição da narração do vídeo

**Pendente.** O Whisper usado na Corrida Espacial não está instalado nesta máquina (sem
Python). Pelo vídeo sem som (quadros a cada 8 s): o apresentador joga um punhado de grãos
escuros num prato de três fatias (C verde, D vermelha, U laranja), conta cada fatia e anota a
rodada numa tabela no caderno.
