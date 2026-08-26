# REGRAS-JOGO-DAS-FORMAS.md — especificação da refação da aula 870298

Especificação pedagógica, mecânica e de contrato do **Jogo das Formas**. Este documento
descreve **o jogo que vai existir**, não o de 2013 — as diferenças estão declaradas na
seção 2, cada uma com o motivo.

- Aula original: **870298** (`Aulas para Refazer/Jogo das Formas/js/JogoFormas.js`)
- Slug: `jogo-das-formas`
- Público: Educação Infantil / 1º ano (4 a 7 anos)
- Objetivo pedagógico: reconhecer formas geométricas planas pelo contorno, agrupar por
  categoria, e planejar uma sequência de movimentos sob pressão de tempo.

---

## 1. O jogo em uma frase

Uma pilha de blocos com formas geométricas sobe do chão. A criança usa uma garra para
transportar blocos entre colunas; **três ou mais blocos iguais que se toquem desaparecem** e
a forma é narrada em voz alta. A cada poucos segundos uma linha nova nasce por baixo e
empurra tudo para cima. Ganha quem atinge a meta de pontos antes de o tempo acabar; perde
quem deixa a pilha bater no teto.

---

## 2. O que muda em relação ao original de 2013

| | Original 870298 | Esta refação | Por quê |
|---|---|---|---|
| Níveis | **nenhum** — um jogo só | **três**, progressivos | O original entrega o jogo inteiro de uma vez a quem nunca o viu: 4 formas, grade cheia e linha nova a cada 15 s. Para 4 anos isso é uma parede. Os níveis são degraus até o jogo original, que **é** o Nível 3 |
| Registro no AVA | não existia | `JOGO_CONCLUIDO` em toda partida | Nenhuma das três aulas registrava nada (ver `MOTOR.md`, seção 1) |
| Entrada | `mousemove` + `click` | Pointer Events | Em tablet não existe hover: o original é injogável no toque (seção 4.2) |
| Cronômetro | `setInterval` | laço `rAF` com delta | Aba em segundo plano consumia o tempo da partida |
| Fim de partida | modal `FeedbackSOS` | `ResultScreen` do motor | Estrelas, números e o disparo do AVA num lugar só |
| Combo grande | bloco-estrela | **mantido** | É o único incentivo do jogo a não limpar sempre no mínimo de 3 |
| Formas | 4 | **4** | `Blocolosango.png` existe nos assets, mas o `arrayFormas` do original tem quatro entradas e **não existe `losango.mp3`**. Ver seção 9 |
| Tutorial | duas telas de imagem com locução | `TutorialScreen` navegável | Passos narrados, ilustração animada, ida e volta |

**O que NÃO muda:** a regra de combo, a grade, a gravidade, o ritmo da linha nova e a meta do
Nível 3 são as do original, número por número. Uma refação que mudasse a mecânica não seria a
mesma aula.

---

## 3. A grade e as formas

Grade de **6 colunas × 7 linhas**. A **linha 0 é a base** e a pilha cresce para cima; blocos
suspensos caem para o menor índice de linha livre.

> No motor: `new GridBoard({ linhas: 7, colunas: 6, diagonais: false })` e
> `aplicarGravidade('cima')`. O sentido `'cima'` existe neste motor por causa deste jogo.

As quatro formas:

| Forma | `tipo` | Som |
|---|---|---|
| Círculo | `circulo` | `circulo.mp3` |
| Quadrado | `quadrado` | `quadrado.mp3` |
| Triângulo | `triangulo` | `triangulo.mp3` |
| Retângulo | `retangulo` | `retangulo.mp3` |

Cor, tamanho e desenho de cada peça estão em
[`PLANO-VISUAL-JOGO-DAS-FORMAS.md`](PLANO-VISUAL-JOGO-DAS-FORMAS.md), seção 3, e saem dos
tokens de `engine/theme/tokens.js` — cor escrita aqui envelheceria fora do design system
(`MOTOR.md`, princípio 8).

**Não há símbolo interno nos blocos**, e isso é deliberado: a regra do `DESIGN.md` de que cor
nunca é o único portador de significado já está cumprida pela própria peça — neste jogo o
portador **é** a forma, e a cor é reforço redundante. Um círculo continua sendo um círculo em
escala de cinza. O par que de fato se confunde nesta idade é quadrado × retângulo, e ele se
distingue por proporção e por cor bem separada, sem precisar de marca dentro da peça.

A partida começa com **3 linhas** preenchidas. Nenhuma delas nasce formando combo: o
`GridBoard.desfazerCombosIniciais()` resorteia os tipos até não haver grupo de 3 — o original
fazia isso num `while` que podia, em teoria, não terminar; no motor há limite de tentativas.

---

## 4. A mecânica da partida

### 4.1 A regra de combo — conectividade, não linha

**Três ou mais blocos da mesma forma que se toquem em vizinhança de 4** (acima, abaixo,
esquerda, direita) formam combo. Diagonais **não** contam.

Isto é importante e é fácil de escrever errado: **não é "três em linha"**. Um L de três blocos
iguais é combo válido, e sempre foi — a `sequencia()` do original é um flood-fill recursivo de
4 vizinhos, e o `GridBoard.grupoConectado()` do motor é a extração fiel dela. Uma versão "três
em linha" seria um jogo diferente, e mais pobre: metade dos agrupamentos que a criança monta
naturalmente deixaria de pontuar.

### 4.2 A garra, adaptada ao toque

O original move a garra com `mousemove` e age no `click`: a coluna sob o cursor fica destacada
**antes** de a criança clicar. Em tablet não há cursor nem hover, então esse aviso prévio não
existe — e uma tradução literal produziria um jogo em que se pega às cegas.

A adaptação, em duas etapas:

1. **Toque numa coluna, com a garra vazia** — a garra desliza até a coluna mais próxima do
   dedo (`CraneController.seguirX(x)` em modo `colunas`), desce (~0,35 s), **pega o grupo
   contíguo de mesma forma no topo daquela coluna** e sobe.
2. **Toque numa coluna, com a garra carregada** — a garra desliza até lá, desce, deposita o
   grupo no topo da pilha e sobe.

**Enquanto a garra desce ou sobe, o toque não inicia outra jogada.** É a trava que todo jogo do
motor precisa ter (`STATES.md`, "estados dentro da partida"); sem ela um toque repetido solta
duas vezes.

Duas coisas que a etapa 1 faz e que merecem atenção:

- **Pega o grupo, não o bloco.** Se o topo da coluna tem três círculos empilhados, a garra
  leva os três. É o que dá profundidade tática ao jogo, e é o que uma leitura apressada do
  original perde.
- **Não precisa de aviso prévio, porque pegar não custa nada.** Pegar e devolver na mesma
  coluna deixa o tabuleiro exatamente como estava: nenhum ponto, nenhum erro, nenhum tempo
  perdido além dos segundos do ciclo. Um toque acidental é reversível, e por isso a perda do
  hover não precisa ser compensada com um terceiro toque.

Enquanto carrega, **arrastar o dedo sem soltar** move a garra entre colunas sem descer — a
criança pode escolher com calma, vendo a carga pendurada sobre a coluna de destino.

### 4.3 A cascata

Ao assentar os blocos, nesta ordem:

1. Procura combos (`gruposValidos(3)`).
2. Cada combo encontrado: brilho, **narração da forma** no canal `speech`, remoção, pontos.
3. Gravidade (`aplicarGravidade('cima')`) — o que ficou suspenso cai.
4. Volta ao passo 1 **com os blocos que caíram**: um combo pode nascer da queda, e a cascata
   continua até não haver mais nenhum. Cada elo da cascata pontua.
5. Sem mais combos, a rodada termina e o toque é liberado.

### 4.4 O bloco-estrela

**Combo de 4 blocos ou mais deixa um bloco no tabuleiro, marcado como estrela.** Ele não é
removido com os outros: fica na grade e passa a valer **2 pontos** quando for eliminado num
combo futuro.

É o único incentivo do jogo a montar combos grandes em vez de limpar sempre no mínimo de 3 —
e, para a criança, é uma recompensa visível que permanece na tela. No original o bloco era
sorteado ao acaso dentro do combo; **aqui é o bloco que a garra depositou por último**, porque
o sorteio fazia a recompensa parecer não ter relação com a jogada que a criança acabou de
fazer.

---

## 5. A pressão: a linha nova

**A cada N segundos uma linha nova de blocos nasce na base e empurra a pilha uma linha para
cima.** A linha nova também nasce sem combo de graça.

**"Sem combo de graça" passou a ser garantia, e não tentativa.** O conserto era um re-sorteio
ao acaso repetido até doze vezes, e medido em 60 tabuleiros ele falhava em **8 partidas do
nível 1** — 15 blocos e só 3 formas dão pouca margem para a sorte, e cada re-sorteio podia
recriar o mesmo grupo. Nessas partidas o tabuleiro nascia com pontos que a criança não fez.
Agora cada peça problemática **escolhe** entre as formas do nível uma que não forme grupo, em
ordem aleatória para o tabuleiro não ficar enviesado: 0 falhas em 60 tabuleiros de cada nível,
com a distribuição das formas intacta (32,6 / 34,6 / 32,9 % no nível 1).

É isto que faz o jogo ser um jogo. Sem a linha nova não há risco nenhum: mover peças é neutro,
não há vidas, e a criança passaria 120 s reorganizando um tabuleiro que nunca a ameaça. A
tensão do original é a pilha subindo enquanto se tenta limpar, e é ela que faz o jogo pedir
planejamento em vez de reflexo.

**Derrota:** se, no instante em que a linha nova ia subir, a última linha da grade (índice 6)
já está ocupada, a partida termina em derrota. A pilha bateu no teto.

**Vitória:** atingir a meta de pontos do nível antes de o tempo acabar.

**Tempo esgotado sem a meta:** derrota, com o progresso preservado (seção 7).

---

## 6. Os três níveis

A progressão anda nos eixos que o próprio original já tem — quantidade de formas, largura da
grade, ritmo da linha nova e meta — e **o Nível 3 é o jogo de 2013**, sem atenuação.

| | Nível 1 — Conhecer | Nível 2 — Combinar | Nível 3 — Desafio |
|---|---|---|---|
| Foco | reconhecer as formas | agrupar com mais variedade | ritmo e planejamento |
| Formas | **3** — círculo, quadrado, triângulo | **4** — + retângulo | **4** |
| Grade | 5 colunas × 7 linhas | 6 × 7 | **6 × 7** |
| Linha nova | a cada **20 s** | a cada **18 s** | a cada **15 s** |
| Meta (`totalPerguntas`) | **12** pontos | **16** pontos | **20** pontos |
| Tempo | 120 s | 120 s | **120 s** |
| Linhas iniciais | 3 | 3 | 3 |

Por que a progressão é assim, e não por dificuldade rotulada: o original tinha um jogo só, e o
piloto (Jogo dos Blocos) já registrou que rotular habilidades diferentes como "fácil" e
"difícil" confunde o professor. Aqui os três níveis são o **mesmo** jogo com mais espaço para
pensar — menos formas para distinguir, mais segundos entre as linhas, meta mais curta. A
criança que vence o Nível 3 jogou a aula de 2013 inteira.

Três formas no Nível 1 não é só "mais fácil": com 3 tipos numa grade de 5 colunas, combos
acontecem quase sozinhos, e é assim que a criança descobre a regra antes de precisar
persegui-la.

---

## 7. Pontuação, erros e o contrato com o AVA

Mapeamento do projeto (`CONTRATO-AVA.md`, seção 3): `totalPerguntas` = a meta ·
`acertos` = a pontuação · `erros` = as falhas.

- **Pontos:** cada bloco eliminado vale **1**; bloco-estrela vale **2**. A meta é em pontos,
  não em combos — 20 pontos são cerca de sete combos mínimos, ou menos se houver cascata e
  estrelas.
- **`erros` — a falha deste jogo.** Mover blocos sem formar combo **não** é erro: é
  planejamento, e punir isso ensinaria a criança a não pensar. A falha do jogo é deixar a
  pilha crescer. Então:

  > **`erros` = quantos ciclos de linha nova se fecharam sem nenhum combo.**

  Cada janela de N segundos que passa sem que um único bloco desapareça é uma janela em que a
  pilha subiu e nada foi resolvido. É contável, é honesta, e é exatamente o "deu para fazer
  melhor" que a nota existe para dizer. Um ciclo em que a criança montou qualquer combo, mesmo
  o mínimo, não conta erro.

- **RE-02 aplicada:** numa vitória, `acertos` é a pontuação **menos** os erros; numa derrota, é
  a pontuação pura. Quem vence com 20 pontos e três janelas vazias reporta 17 — venceu, e o
  relatório mostra que havia folga. Sem esta contagem, `erros` seria sempre 0 e toda vitória
  valeria 100%, que é precisamente o defeito que a RE-02 foi criada para corrigir.

Mensagem de uma vitória no Nível 2 com duas janelas vazias:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 14,          // 16 pontos - 2 janelas vazias (RE-02)
  erros: 2,
  totalPerguntas: 16,   // meta do Nível 2
  nivel: 2,
  jogo: "jogo-das-formas"
}
```

A cena de partida faz **uma** chamada, e o motor cuida do resto:

```js
this.irPara('resultado', {
  resultado: this.placar.paraAva(venceu, { pontosBrutos: this.placar.acertos }),
});
```

O ponto bruto vai nos extras, como o piloto faz com `blocosEmpilhados`.

---

## 8. Tela de resultado e estrelas

**A fileira tem cinco estrelas, e este jogo não calcula nota nenhuma.** A `ResultScreen`
preenche uma estrela por *um quinto da meta* alcançado, sobre a pontuação que ela já mostra —
com o desconto da RE-02 embutido, porque é a mesma `pontuacao`. Regra **RE-04**.

| Pontuação (`acertos`) ÷ meta | Nível 1 (meta 12) | Nível 3 (meta 20) | Estrelas |
|---|---|---|---|
| 100% ou mais | 12+ | 20+ | ⭐⭐⭐⭐⭐ |
| 80% a 99% | 10–11 | 16–19 | ⭐⭐⭐⭐ |
| 60% a 79% | 8–9 | 12–15 | ⭐⭐⭐ |
| 40% a 59% | 5–7 | 8–11 | ⭐⭐ |
| 20% a 39% | 3–4 | 4–7 | ⭐ |
| abaixo de 20% | 0–2 | 0–3 | nenhuma |

**Passar da meta não estoura a fileira:** a pontuação chega a 15 numa meta de 12 (combo em
cascata, bloco-estrela valendo 2) e a fileira para em cinco.

**Era diferente, e vale registrar o que mudou.** A meta deste jogo é 12, 16 ou 20 — acima de 6
—, e a `ResultScreen` antiga desenhava *uma estrela por pergunta* só até 6, caindo numa nota de
0 a 3 acima disso. Consequências, as duas ruins:

- **duas escalas no mesmo lugar.** O Jogo dos Blocos mostrava 5 estrelas e este mostrava 3, sem
  que nada na tela explicasse por quê — e uma fileira de tamanho variável obriga a criança a ler
  DOIS números (quantas acesas de quantas) antes de saber se foi bem;
- **cada jogo com meta grande calculava a própria nota.** Havia uma `_notaEmEstrelas()` aqui e
  um getter `estrelas` no `ScoreSystem`, com fórmulas diferentes — o getter dava **zero** em
  qualquer derrota, o oposto do que o `DESIGN.md` manda. Os dois saíram.

O piloto não mudou de comportamento: com meta 5, um quinto da meta é exatamente um ponto.

Abaixo das estrelas a tela mostra a pontuação **na unidade** — "14 PONTOS", não "14 de 20"
(regra RE-03). Todo texto em CAIXA ALTA — o `bootstrap` aplica a RE-01, não a tela.

---

## 9. Áudio

Os quatro sons de forma existem nos assets do original e são o conteúdo pedagógico do jogo:
`circulo.mp3`, `quadrado.mp3`, `retangulo.mp3`, `triangulo.mp3`. Tocam no canal `speech`, no
instante em que o combo é eliminado.

**Não existe `losango.mp3`.** O `arrayFormas` do original tem quatro entradas e nunca sorteou
losango. É por isso que esta refação também tem quatro formas: a regra travada por teste é que
**o motor não sintetiza voz** — faltando a gravação, o bloco eliminado sairia em silêncio e o
console nomearia o arquivo ausente.

E há um segundo motivo, independente do áudio: **o `Blocolosango.png` é visualmente
indistinguível do `BlocoRetangulo.png`** — o mesmo azulejo verde com um retângulo dentro, bytes
diferentes e aparência igual. A arte do losango nunca foi feita de verdade. Para o losango
entrar como quinta forma faltam as duas coisas, locução e peça; feitas as duas, ele entra no
Nível 3 sem nenhuma outra mudança.

Também vindos do original: `somFundo.mp3` (música), `acertoSOS.wav` / `erroSOS.wav` (fim de
partida), `nao.wav` (erro).

**A gravar** — não existe no original, e o motor deixa em silêncio até chegar:

| Id | O que a locução diz |
|---|---|
| `abertura` | boas-vindas do menu |
| tutorial, 3 passos | um por passo (seção 10) |
| `linha_subindo` | opcional: aviso de que a pilha está perto do teto |

Cada arquivo novo precisa da ficha de transcrição com hash, como no piloto — é o que o
`tools/audio-info.mjs` cobra.

---

## 10. Tutorial

Três passos, narrados, com ilustração animada — o original tinha duas telas de imagem com
locução corrida.

1. **"TOQUE NUMA COLUNA PARA PEGAR OS BLOCOS"** — a garra desliza, desce e sobe com um grupo.
2. **"JUNTE TRÊS FORMAS IGUAIS QUE SE TOQUEM"** — três círculos se encostam em L e desaparecem.
   O L é de propósito: é o que ensina que combo não é fila.
3. **"CUIDADO: A PILHA SOBE!"** — uma linha nova nasce e empurra a pilha para cima.

O passo 3 é o que o original não ensinava em lugar nenhum, e é a regra que decide a partida.

---

## 11. Acessibilidade e orientação

- **Alvo tocável:** as colunas são faixas de largura inteira da grade, muito acima do mínimo.
  O limite conhecido do motor (alvo mínimo garantido em espaço lógico, reduzido pela escala do
  `Stage` em celular) está registrado em `STATES.md` e não é agravado por este jogo.
- **Cor nunca é o único canal:** cada forma tem contorno próprio e símbolo interno (seção 3).
- **Orientação:** o jogo é 16:9 e em aparelho de pé **o motor gira o conteúdo sozinho** — o CSS
  gira `#palco` e o `Stage` inverte o mapa tela→lógico. Não há overlay "gire o celular" como
  mecanismo; a dica existe apenas como complemento, e não é narrada.
- **Nada exige leitura.** Todo texto é redundante com o áudio ou com o desenho.

---

## 12. O que o motor já tem, e o que falta

| Peça | Estado |
|---|---|
| `GridBoard` — conectividade, grupos, gravidade `'cima'`, desfazer combo inicial | **Pronto**, estreia aqui |
| `CraneController` modo `colunas` (`seguirX`, `irParaColuna`, `carregar`, `soltar`) | **Pronto**, testado só em unidade |
| `TimerBar` | **Pronto**, sem uso real ainda |
| Estrelas por percentual | **Nada a fazer no motor, e nada a fazer na cena** — a `ResultScreen` deriva a fileira do payload (seção 8) |
| Ciclo vertical da garra (descer, pegar, subir) | **É da cena**, com `Tween`. O `CraneController` só faz o eixo horizontal e a gestão de carga |
| Subir a linha nova | **É da cena** — o `GridBoard` não tem operação de deslocar tudo uma linha |
| Narração das formas | `AudioBus`, canal `speech`, pronto |

Nenhuma mudança no motor é pré-requisito. As duas peças que estreiam sem uso real —
`GridBoard` e o modo `colunas` — são o risco técnico da entrega, e é onde os testes devem
apertar primeiro.

---

## 13. Bugs do original, para não reproduzir

Encontrados na leitura de `JogoFormas.js` e registrados aqui porque uma refação distraída os
copia junto com a mecânica.

| Onde | O bug |
|---|---|
| `sobeBloco`, linha 214 | `if (acao = 'sobe')` — **atribuição**, não comparação. A condição é sempre verdadeira, e a trava de estado da rodada nunca protegeu nada |
| `fimSolta`, linha 286 | `arrayBlocos[lin] = [null, null, null, null]` — quatro posições numa grade de **seis** colunas |
| `pontuacao`, linha 350 | `CONTROLE.slice(...)` onde queria `splice(...)`: o array de controle nunca encolhe. A função `VALIDA()` existe só para gritar `'ERRO'` no console quando o estado divergia — e divergia |
| `sequencia`, linha 602 | recursão sem limite; estourava a pilha com o tabuleiro quase todo de uma forma. O `GridBoard` é iterativo por causa disto |
| `validaLinha`, linha 651 | `while (seq.length > 2)` resorteando sem limite de tentativas |
| `moveCorrente`, linha 690 | seis faixas de 50 px escritas à mão numa escada de `if`; a grade e a tela eram fixas em 800×600 |
| `liberaTempo`, linha 735 | `setInterval` — a aba em segundo plano consumia o tempo da partida |

---

## 14. Decisões em aberto

1. **`erros` como "ciclos sem combo"** (seção 7) é a única regra desta especificação que não
   vem do original nem de outro jogo do motor. A alternativa é `erros: 0` sempre — e o preço
   dela é a RE-02 ficar inerte neste jogo, com toda vitória valendo 100%.
2. **`linha_subindo`** — vale gravar um aviso sonoro para a pilha perto do teto, ou o retorno
   visual basta?
3. **Losango** — entra na fila de gravação (seção 9) ou fica fora em definitivo?
