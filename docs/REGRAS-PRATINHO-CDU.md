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
**forma o número** e depois diz **qual é maior**, o dela ou o do computador. A estrela da rodada
é dela se fez tudo **sem nenhum PRONTO errado** (uma **rodada limpa**) e do computador se
precisou de outra tentativa. No fim das 5 rodadas, **quem tiver mais estrelas vence**: 3 rodadas
limpas bastam.

**A vitória depende só da criança.** Quantos grãos caem para cada lado é acaso, então o jogo não
usa "quem tirou o maior número" para dar a estrela nem para decidir quem ganha (era assim até
22/10/2026: cerca de metade das partidas terminava em derrota mesmo com a leitura toda certa).
O maior número é só o conteúdo da comparação; o que o jogo confere é ler as quantidades, formar
o número e comparar, certo e sem tentativas extras. O computador nunca erra: é o modelo.

---

## 2. O que muda em relação às referências

| O que muda | Por quê |
|---|---|
| **Sem cronômetro** (o jogo antigo dava 20 s e uma tela "Tempo Esgotado") | `METODO-JOGOS-NUMERANDUS.md` §3.B: nunca cronômetro regressivo |
| **Rolinhos C/D/U** no lugar de digitar num campo de texto | Aos 6 anos a criança não digita, e o motor não tem teclado. O rolinho por casa também reforça o valor posicional: cada algarismo mora na sua casa |
| **Contar tocando no GRÃO**, que fica marcado com um halo | Pedido do humano (20/10): a criança aponta o grão que está contando, como faria com o dedo no brinquedo. O grão desenhado (~30 px) fica abaixo dos 64 px mínimos, então o alvo é um círculo de pelo menos 64 px em volta dele. O halo não tem número: quem conta é a criança |
| **A estrela da rodada é de quem a faz limpa** (a criança, sem PRONTO errado; senão o computador, que nunca erra), e não de quem tira o maior número | O jogo antigo somava as rodadas, e a primeira versão deste dava a estrela a quem formasse o maior número. Em ambos a vitória dependia da sorte dos grãos. Comparar continua sendo conteúdo (o 1º e o 2º ano), mas quem vence é a leitura |
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
que irá fazer"): a estrela da rodada flutua sobre o **?** — está em jogo e é da criança se
ela acertar sem tentativa extra —, os números que ainda valem pulsam de leve e o dedinho branco da coleção toca
em cada um, em laço. Ele aponta os DOIS: mostra o gesto, não a resposta. Com um número
marcado, o dedinho passa para o PRONTO. A fala `qualEMaior` completa quando for gravada.

**A pergunta escrita** "QUAL NÚMERO É O MAIOR?" fica no alto do cartão durante a comparação
(pedido do humano, 20/10). É o único texto de instrução da partida: contar e formar o número se
explicam pelo gesto, comparar não.

**O sinal: símbolo escrito, com o jacaré guardado.** Ao acertar, o **?** vira ">", "<" ou "=" num
círculo verde. Isso confunde: com 41 e 47 o "41 < 47" está certo, mas o "<" fica ao lado do número
vencedor e lê-se como "o 47 tem o sinal de menor" (observação do humano, 21/10/2026). Foi feita uma
alternativa, o **jacaré** (uma boca desenhada, aberta para o número maior, como se ensina em sala), e
retirada "por enquanto" a pedido do humano. Ela continua em `desenharSinalComparacao` e liga-se
trocando `SINAL_COMPARACAO` para `'jacare'` no `config.js` (vale para a partida e para o tutorial).
Outras saídas, se o jacaré não servir: uma setinha apontando para o maior (sem o símbolo matemático)
ou manter ">" e "<" com uma fala que explique.

**Só "maior"** (decisão do humano, 21/10/2026): a pergunta é sempre "QUAL NÚMERO É O MAIOR?" em
todos os níveis, com a palavra MAIOR em âmbar. Uma versão anterior sorteava "maior" e "menor"
no Fácil (a estrela ia para o número pedido); foi retirada por inteiro, sem deixar a opção
desligada no código.

- **Certo**: o **?** vira **>**, **<** ou **=** num círculo verde (ver acima sobre o jacaré), e o
  número **maior** ganha um contorno dourado enquanto o outro apaga. Sem estrela aqui: ela não é
  do maior, é de quem fez a rodada limpa. Depois a estrela acende na trilha de cima, dourada se a
  criança acertou sem tentativa extra, âmbar escura (do computador) se precisou de outra.
- **Errado**: o cartão balança, o número marcado fica apagado e conta um erro.
- **Números iguais**: aparece **=** direto e não há o que comparar; a estrela é da criança se a
  leitura foi limpa. (Não existe empate de partida: toda rodada dá a estrela a um dos dois.)

### 4.5 Estrelas e fim

- No alto, **5 estrelas**, uma por rodada: **dourada** (a criança fez a rodada limpa) ou **âmbar
  escura** (precisou de outra tentativa: a estrela é do computador). A da rodada de agora tem
  contorno azul. O quadro das rodadas mostra só os números, sem estrelas ao lado.
- Depois da 5ª rodada, o jogo vai **direto para a tela de resultado** da série ("MUITO BEM!" ou
  "QUASE LÁ!"), depois de a última estrela acender na trilha e de uma pausa curta. Havia uma tela
  intermediária com o troféu e o placar "2 × 3", mais um toque na seta; saiu a pedido do humano
  (22/10/2026), porque repetia as estrelas da tela de resultado.

---

## 5. Os três níveis

| Nível | Casas | Grãos por fatia | Zero numa casa | Fora do prato | Resposta |
|---|---|---|---|---|---|
| **1 — Fácil** | D, U | D 1–9, U 0–9 | natural (U = 0 em 1 de cada 10) | não | 3 opções |
| **2 — Médio** | C, D, U | 1–5 cada (o jogo antigo) | nunca | não | rolinhos |
| **3 — Difícil** | C, D, U | C 1–9, D 0–9, U 0–9 | forçado em 50% das jogadas (≈ 59% no total) | 1 a 3 grãos | rolinhos |

---

## 6. Pontuação, erros e o contrato com o AVA

- **Meta**: 5 rodadas. Toda rodada termina com a comparação feita (certa) e dá **uma estrela** a
  um dos dois.
- **Erro**: cada PRONTO errado, na leitura ou na comparação. Contar, girar rolinho, marcar e
  desfazer **nunca** contam. O campo `erros` do AVA é essa contagem **crua** (RE-02).
- **Rodada limpa** (`falhaNaRodada` falso, `_fecharRodada`): nenhum PRONTO errado na rodada, nem
  na leitura nem na comparação. A estrela é da criança; se houve ao menos um, é do computador. Não
  importa quantos erros: o primeiro já decide a rodada.
- **Desfecho** (`_desfecho`, 22/10/2026): a criança **vence** com mais estrelas que o computador
  (3 rodadas limpas ou mais); com menos, é **derrota** (tela "QUASE LÁ!"). Não há empate de
  partida (5 rodadas, cada uma dá a estrela a alguém).
- **Nota** (`acertos`, `_notaDaPartida`), que a tela mostra como estrelas (RE-04):
  - **vitória**: **sempre 5 estrelas** (decisão do humano, 22/10/2026). Não desconta os erros;
  - **derrota**: as rodadas limpas da criança (0 a 2), sem desconto (RE-02: na derrota o
    desconto seria castigo duplo).
  Exceção declarada à RE-02, que manda descontar as falhas numa vitória: aqui a vitória é nota
  cheia, e quanto a criança errou fica só no relatório (`erros` cru, `rodadasComFalha`,
  `errosLeitura`, `errosComparacao`, `leiturasDePrimeira`). Com 5 rodadas, 3 estrelas já vencem,
  então uma vitória nunca mostra menos estrelas do que uma derrota (no máximo 2). Alternativa
  simples, se um dia for preferível: estrelas = rodadas limpas também na vitória (3 a 5).
  Histórico da regra: `5 − erros` (zerava com 5 PRONTOs errados e a tela mostrava "MUITO BEM!"
  sem estrelas) → `5 − rodadas com falha` com piso 3 → vitória pelo maior número (dependia da
  sorte) → a rodada limpa de hoje.
- **Som**: vitória `acertoSOS`; derrota `erroSOS` (o mesmo da Velha e da Corrida, ainda não ouvido).
- **Tela final**: só as 5 estrelas (`mostrarPlacarTexto: false`): "3 RODADAS" mentiria para
  quem jogou as 5. Estrelas derivadas pela própria tela (RE-04).
- **AVA**: `acertos` = a nota (vitória 5, derrota 0 a 2), `erros` = PRONTOs errados crus,
  `totalPerguntas` = 5, `vitoria` = venceu (mais rodadas limpas que o computador).
  Extras: `desfecho` (`'vitoria'` | `'derrota'`), `leiturasDePrimeira`, `errosLeitura`,
  `errosComparacao`, `rodadasComFalha`, `rodadasComAjuda`, `estrelasCrianca`, `estrelasComputador`,
  `ganhouDoComputador`, `numeros`. O `ScoreSystem` só monta o payload no fim (`_terminar`).

Conferido em navegador (22/10/2026, robô errando de propósito em rodadas escolhidas, no Médio):

| Partida | Estrelas (criança × computador) | `acertos` | `erros` | `vitoria` | Tela |
|---|---|---|---|---|---|
| sem nenhum erro | 5 × 0 | 5 | 0 | true | "MUITO BEM!", 5 estrelas |
| 1 erro de leitura em 2 rodadas | 3 × 2 | 5 | 2 | true | "MUITO BEM!", 5 estrelas |
| 1 erro de leitura em 3 rodadas | 2 × 3 | 2 | 3 | false | "QUASE LÁ!", 2 estrelas |
| 1 erro de leitura em todas | 0 × 5 | 0 | 5 | false | "QUASE LÁ!", sem estrelas |
| 1 erro na comparação em todas | 0 × 5 | 0 | 5 (`errosComparacao`) | false | "QUASE LÁ!", sem estrelas |

A mensagem dentro de iframe ainda não foi conferida.

---

## 7. Áudio

| Som | `id` | Uso | Existe? |
|---|---|---|---|
| Narração do tutorial (4 telas) | `tutorialTela1`–`4` | `fala` de cada passo | **Sim** (21/10/2026, `assets/audio/tutorial/tut001, tut002, tut003, tut04`; **o passo 4 precisa ser regravado**: o texto mudou em 22/10/2026) — ainda não ouvida por quem revisa |
| Números "um" a "nove" | `numero1`–`numero9` | a contagem a cada grão (toque da criança e ajuda) | **Sim** (22/10/2026), copiados do Jogo dos Blocos (locução de 2013, não ouvidos) |
| Frases curtas **já gravadas** (22/10/2026) | `suaVez`, `vezDoComputador`, `muitoBem`, `qualEMaior`, `tenteDeNovo`, `voceFezOMaior`, `computadorFezOMaior` | começo da rodada, vez do computador, leitura/comparação certa, abre a comparação, PRONTO errado, quem fez o maior | **Sim** — da pasta de áudio do Jogo dos Blocos (gravação de 2026), não ouvidas |
| Frases curtas **a gravar** | `confiraACasaAcesa`, `vamosContarJuntos`, `nenhumGraoZero`, `olheACentena`, `olheADezena`, `empate` | ajuda em degraus, fatia vazia, erro na comparação, números iguais | **Não** — gravar |
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
- **Perder por precisar de tentativas extras** pode soar duro aos 6 anos (a derrota agora diz
  "você errou mais que o computador", não "teve azar"). Conferir com um aluno se a tela "QUASE
  LÁ!" amortece; se não, tornar a regra menos rígida (por exemplo, só o 2º erro da rodada passa a
  estrela ao computador).
- **Estrela do computador**: âmbar escura ao lado da dourada da criança. Conferir com um aluno
  se a diferença fica clara; se não, desenhar o ícone do monitor sob a estrela.
- **Sem número no grão** (decisão de 20/10): a criança que se perde na contagem não tem ponto
  de apoio além da fala `numero1..9`. Se isso aparecer nos testes, mostrar o total da fatia só
  na ajuda de contar junto.
- **Duração**: ~20–40 s por rodada no Médio. Medir com criança se 5 rodadas cansam.

---

## 10. Transcrição da narração do vídeo

**Pendente.** O Whisper usado na Corrida Espacial não está instalado nesta máquina (sem
Python). Pelo vídeo sem som (quadros a cada 8 s): o apresentador joga um punhado de grãos
escuros num prato de três fatias (C verde, D vermelha, U laranja), conta cada fatia e anota a
rodada numa tabela no caderno.
