# REGRAS-EDUCACIONAIS.md — decisões pedagógicas do motor

Registro das regras **pedagógicas** que todo jogo do motor precisa seguir.

Não é design (isso é [`DESIGN.md`](DESIGN.md)) nem arquitetura (isso é [`MOTOR.md`](MOTOR.md)).
Aqui ficam as decisões sobre **como o conteúdo é apresentado à criança** — as que, se cada
jogo decidisse sozinho, produziriam três jogos ensinando a mesma coisa de três jeitos
diferentes.

Público de referência: **Educação Infantil e 1º ano (4 a 7 anos)**.

---

## Como usar este documento

- Cada regra tem **ID fixo** (`RE-01`, `RE-02`, …). O ID nunca é reaproveitado, mesmo que a
  regra seja revogada — assim uma referência antiga nunca aponta para a regra errada.
- Uma regra tem **status**: `Vigente` · `Em estudo` · `Revogada`.
- Uma regra só entra como `Vigente` quando alguém decide, não quando alguém sugere. Ideia sem
  decisão fica em [Em estudo](#regras-em-estudo).
- **Ao criar uma regra nova:** copie o [modelo](#modelo-para-uma-regra-nova), acrescente a
  linha no índice, e — se a regra for verificável — acrescente o item correspondente na
  seção 1 do `templates/jogo-base/CHECKLIST.md`. Regra que não vira item de checklist é
  regra que ninguém confere.
- **Ao mudar uma regra vigente:** registre no [histórico](#histórico) e diga explicitamente
  se os jogos já publicados precisam ser atualizados.

---

## Índice

| ID | Regra | Status | Aplica-se a |
|---|---|---|---|
| [RE-01](#re-01--todo-texto-exibido-em-caixa-alta) | Todo texto exibido em CAIXA ALTA | **Vigente** | Todo jogo para 4–7 anos |
| [RE-02](#re-02--a-nota-da-partida-desconta-o-erro-na-vitória-nunca-na-derrota) | A nota da partida desconta o erro na vitória, nunca na derrota | **Vigente** | Todo jogo do motor |
| [RE-03](#re-03--o-placar-do-fim-de-partida-diz-a-unidade-não-uma-fração-da-meta) | O placar do fim de partida diz a unidade, não uma fração da meta | **Vigente** | Todo jogo do motor |
| [RE-04](#re-04--a-fileira-de-estrelas-tem-sempre-cinco-e-quem-a-calcula-é-a-tela) | A fileira de estrelas tem sempre cinco, e quem a calcula é a tela | **Vigente** | Todo jogo do motor |
| [RE-05](#re-05--pedir-ajuda-nunca-custa-a-partida-nem-entra-na-conta) | Pedir ajuda nunca custa a partida nem entra na conta | **Vigente** | Todo jogo do motor |

---

## RE-01 — Todo texto exibido em CAIXA ALTA

**Status:** Vigente · **Desde:** 2026-08-19 · **Revisada em:** 2026-08-19 (ver [histórico](#histórico))
**Aplica-se a:** todo jogo cujo público ainda não lê letra minúscula (padrão: 4 a 7 anos)

### A regra

**Todo texto que a criança vê na tela vai em caixa alta** — a letra que é conteúdo da
atividade, o rótulo do botão, o título da tela, o nome do nível, a frase do tutorial e a
mensagem de resultado. Sem exceção dentro de um mesmo jogo.

### Por quê

Na alfabetização inicial a criança reconhece a **letra bastão maiúscula**, e só ela: o traçado
é mais simples, as formas são mais distintas entre si e não há a ambiguidade que atrapalha
nesta idade — `b` × `d` × `p` × `q` são a mesma forma girada, enquanto `B`, `D`, `P` e `Q` não
se confundem. É também a forma que a criança usa para escrever antes de dominar a cursiva.

O argumento comum contra caixa alta — "texto todo em maiúsculas é mais lento de ler, porque
some o contorno da palavra" — **é verdadeiro para leitores fluentes e irrelevante aqui**. Quem
tem 5 anos não reconhece palavras pelo contorno; decodifica letra a letra. Para essa criança,
minúscula não é mais confortável: é ilegível. Otimizar para o leitor adulto é otimizar para
quem não é o usuário.

Misturar caixas na mesma tela acrescenta uma dificuldade que **não faz parte do que está sendo
ensinado**: quem ainda não sabe que `a` e `A` são a mesma letra passa a ter dois problemas em
vez de um.

### Escopo — e o que a regra NÃO diz

| Onde | Caixa | Motivo |
|---|---|---|
| Letra como conteúdo (peça, alvo, resposta) | **CAIXA ALTA** | O centro da regra |
| Rótulo de botão, título, nome de nível, frase de tutorial, resultado | **CAIXA ALTA** | O público lê só bastão |
| Nome de arquivo, id de áudio, slug (`a.mp3`, `'u'`, `jogo-dos-blocos`) | minúsculo | Identificador técnico; **nunca** aparece para a criança |
| Este e outros documentos, comentários de código, README | normal | São para adultos |
| Jogo voltado a leitores já fluentes | normal | `textoEmCaixaAlta: false` — ver abaixo |

### Como aplicar

**Uma linha no `config.js` do jogo.** O motor cuida do resto: `TextNode`, botões e cartões de
nível aplicam a caixa na hora de desenhar.

```js
textoEmCaixaAlta: true,   // padrão do template
```

Escreva os textos do `config.js` normalmente (com acentuação e pontuação corretas) — o motor
converte na exibição, preservando acentos (`nível` → `NÍVEL`). Isso mantém o arquivo legível
para quem o edita e permite desligar a regra sem reescrever nada.

Para as letras que são conteúdo, escreva já em caixa alta, porque elas também são lidas em voz
alta e comparadas com o áudio:

```js
simbolos: ['A', 'E', 'I', 'O', 'U'],
sons:     ['a', 'e', 'i', 'o', 'u'],   // ids de arquivo — não são exibidos
```

### Onde já está aplicado

- **Jogo dos Blocos** — `textoEmCaixaAlta: true`, e as vogais do nível 3 declaradas em caixa
  alta. Conferido em navegador, em todas as telas.
- **Template de jogo novo** — nasce com a regra ligada.

### Casos ainda não decididos

- **Ensinar a correspondência maiúscula ↔ minúscula** é uma habilidade legítima. Num jogo com
  esse objetivo, a minúscula precisa aparecer — e ele será a **exceção documentada** desta
  regra, registrada aqui, não improvisada no código.
- **Quando o público for de anos iniciais (7–10)**, reavaliar: nessa faixa a leitura de
  minúscula já está em formação e a caixa normal volta a fazer sentido.

---

## Regras em estudo

Ideias levantadas que **ainda não são regra**. Não valem como decisão; estão aqui para não se
perderem e para serem decididas quando alguém puder decidir.

| Assunto | Pergunta em aberto |
|---|---|
| Erro e repetição | Errar deve repetir o mesmo item (como no Jogo dos Blocos) ou avançar? Vale para todos os jogos ou depende do conteúdo? |
| Número de tentativas | 3 vidas é o padrão da casa ou cada jogo decide? |
| Ordem do conteúdo | Sequência sempre na ordem canônica (1,2,3…) ou pode ser sorteada depois de algumas partidas? |
| Tempo | Atividade com cronômetro é adequada a 4–7 anos, ou pressiona quem tem ritmo mais lento? (afeta Formas e Cores) |
| Feedback de erro | Além do som, deve haver alguma dica do que fazer diferente? |
| Cor como conteúdo | **Decidido para o Jogo das Cores em 02/09/2026, ao contrário do que esta linha perguntava:** a peça NÃO tem forma nem símbolo — é chapada, por decisão de acessibilidade do humano (menos poluição visual), com o custo em daltonismo medido e aceito. Ver `REGRAS-JOGO-DAS-CORES.md`, seção 3.2. A pergunta que continua aberta é a inversa: se um próximo jogo tiver cor como conteúdo, ele repete essa escolha ou usa o canal redundante? Nenhuma regra geral foi fixada |

---

## RE-02 — A nota da partida desconta o erro na vitória, nunca na derrota

**Status:** Vigente · **Desde:** 2026-08-24
**Aplica-se a:** todo jogo do motor, e ao número que vai para o AVA

### A regra

**Numa vitória, a pontuação da partida é o progresso menos as falhas** — é ela que preenche as
estrelas e é ela que viaja no campo `acertos` do AVA. **Numa derrota, a pontuação é o progresso
puro**, sem desconto.

### Por quê

Um jogo de meta fixa dá nota máxima a toda vitória, se a nota for o acerto bruto. No Jogo dos
Blocos, vencer **é** encaixar os 5 blocos: o bruto de qualquer vitória vale 5, então "5 de 5"
aparecia igual para quem não derrubou nada e para quem derrubou dois. A criança que jogou com
cuidado recebia o mesmo retorno de quem chegou lá no limite das vidas — e a nota, que existe
para dizer "deu para fazer melhor", não dizia nada.

O desconto não é castigo, é **informação**: mostra que havia um jeito melhor de fazer, com a
torre ainda inteira na tela como prova de que a criança venceu. Duas estrelas apagadas ao lado
de cinco blocos de pé dizem "conseguiu, e dá para conseguir mais limpo".

Na derrota o desconto seria castigo duplo, e por isso não acontece. O erro já cobrou o preço
mais alto que o jogo tem: a partida acabou. Zerar também o progresso de quem encaixou dois
blocos contradiz a diretriz de [`DESIGN.md`](DESIGN.md) — "errar não pode humilhar: a derrota
mostra o quanto o aluno avançou, não o quanto falhou".

### Escopo — e o que a regra NÃO diz

| Onde | Desconta? | Motivo |
|---|---|---|
| Estrelas e número da tela de resultado | **Sim, na vitória** | É a nota da partida |
| Campo `acertos` da mensagem do AVA | **Sim, na vitória** | Tela e relatório têm de dizer o mesmo número |
| Barra de progresso **durante** a partida | Não | A barra espelha a torre construída, e a torre não encurta quando um bloco cai fora. Descontar ali faria a barra recuar enquanto a torre sobe |
| Condição de vitória | Não | Vencer é atingir a meta em acertos brutos. Com desconto, quem errasse nunca poderia vencer |
| Vidas / corações | Não se aplica | Vidas já contam o erro, e são outra leitura: quanto ainda dá para tentar |
| Campo `erros` | Não se aplica | Segue sendo a contagem crua de falhas |

A regra **não** diz que o erro precise aparecer em vermelho, nem que a criança deva ser avisada
do desconto durante a partida. O retorno é no fim, uma vez.

### Como aplicar

Nada a fazer num jogo novo: está no motor. `ScoreSystem.pontuacao` calcula, `paraAva()` envia e
a `ResultScreen` desenha — os três a partir do mesmo número.

```js
// na cena de partida, ao terminar — inalterado
this.irPara('resultado', {
  resultado: this.placar.paraAva(venceu, { blocosEmpilhados: this.torre.length }),
});
```

A cena não passa nota de estrelas: a tela deriva a fileira desta mesma `pontuacao` (RE-04), e
por isso o desconto desta regra chega às estrelas sem ninguém recalculá-lo.

O acerto **bruto** não se perde: mande-o nos campos extras quando for parte do que o professor
precisa ver (o Jogo dos Blocos manda como `blocosEmpilhados`).

### Onde já está aplicado

- **Jogo dos Blocos** — conferido nas cinco combinações de vitória e derrota, e travado por
  teste em `tools/testes.mjs` e `tools/teste-navegador.mjs`.

### Casos ainda não decididos

- **Jogos com pontuação por combo** (Formas, Cores): uma "solta inválida" custa um ponto de
  meta, como aqui, ou um valor próprio? Numa meta de 20 ou 30 pontos, descontar 1 por falha é
  quase invisível — pode ser que ali a nota precise ser proporcional.
- **Jogos cronometrados**: acabar o tempo com a meta incompleta é derrota (e portanto não
  desconta), ou merece leitura própria?

---

## RE-03 — O placar do fim de partida diz a unidade, não uma fração da meta

**Status:** Vigente · **Desde:** 2026-08-25 · **Aplica-se a:** todo jogo do motor

### A regra

A tela de resultado enuncia o placar **na unidade do jogo** — "13 PONTOS" — e **nunca como
fração da meta** — "13 de 12". A meta é anunciada antes da partida e acompanhada durante ela;
no fim, a tela comemora o que foi feito.

### Por quê

**A pontuação pode passar da meta.** No Jogo das Formas um combo resolve vários blocos de uma
vez e o bloco-estrela vale 2, então a partida fecha em 13 numa meta de 12 — vencer é *atingir*
a meta, não *empatar* com ela. A tela anunciava **"13 DE 12"**: uma fração impossível,
apresentada como conquista.

O defeito não é o número, é o **"de N"**: ele promete que N é o teto. Onde o total é o teto
exato — o Jogo dos Blocos, meta 5, cinco blocos e nada mais — a fração fechava e ninguém notou.
Onde não é, ela mente, e a criança que jogou melhor que o previsto recebe algo que **parece erro
de conta**. Uma tela que parece quebrada não comemora nada.

Há um segundo motivo, e ele vale mesmo onde a fração fecharia: aos 4–7 anos ler **um** número é
mais fácil que comparar **dois**. "13 pontos" é uma quantidade; "13 de 12" é uma operação.

A meta não desaparece da vida da criança — ela é dita na escolha de nível ("3 formas · 12
pontos") e mostrada pela barra durante toda a partida, que é onde a informação "quanto falta"
serve para algo.

### Escopo — e o que a regra NÃO diz

| Onde | Vale? | Motivo |
|---|---|---|
| Linha de placar da tela de resultado | **Sim** | É o caso que a regra existe para corrigir |
| Fileira de estrelas da mesma tela | Não se aplica | Ela continua sendo a leitura de "quanto da meta" — em forma que se lê sem saber ler. É complementar, não concorrente. Quantas estrelas e por quê: **RE-04** |
| Barra de progresso **durante** a partida | **Não** | Ali a fração É a informação certa: a criança precisa saber quanto falta enquanto ainda pode agir |
| Cartão de nível | **Não** | "12 pontos" ali é a meta sendo anunciada, e é para isso que serve |
| Campos da mensagem do AVA | **Não** | `acertos`, `erros` e `totalPerguntas` seguem indo inteiros e crus. Como o servidor combina os três é decisão dele (METODO A3) |

A regra **não** muda nenhum número: muda como um número é dito.

**Companheira desta mudança, na mesma tela:** saiu a linha que enumerava as falhas ("sem nenhum
erro!" / "2 tentativas perdidas"). O fim de partida diz o quanto a criança avançou, não o que
ela errou — é a diretriz 5 de [`DESIGN.md`](DESIGN.md) levada até o fim. Os erros seguem
inteiros na mensagem do AVA, que é onde o professor os lê.

### Como aplicar

Nada a fazer num jogo novo: está no motor, em `engine/screens/ResultScreen.js`. O jogo só
declara a meta em `niveis[].meta`, como já fazia.

### Onde já está aplicado

- **Jogo das Formas** — o caso que originou a regra (13 de 12 → 13 PONTOS).
- **Jogo dos Blocos** — conferido na vitória limpa, na vitória com quedas (3 de 5 estrelas +
  "3 PONTOS") e na derrota.
- Travado por teste em `tools/teste-navegador.mjs`: uma verificação exige que o número da tela
  seja o mesmo do AVA, e outra **reprova qualquer texto na forma "N de N"** na tela de resultado.

### Casos ainda não decididos

- **A unidade é sempre "ponto"?** Hoje sim, e cobre os dois jogos. Um jogo que conte outra coisa
  (letras formadas, palavras lidas) pode querer a própria palavra — aí a unidade passa a ser
  declarada no config, e não antes disso.
- **O AVA ainda recebe `acertos` acima de `totalPerguntas`** (13 e 12), então o
  `score_percent` do servidor passa de 100%. A tela deixou de exibir a incongruência, mas ela
  segue existindo no relatório do professor. Decidir qual das duas é a correção: a meta virar
  teto da pontuação, ou o servidor tolerar mais de 100%. **Não decidido de propósito** — mexer
  no número muda o que já foi registrado.

---

## RE-04 — A fileira de estrelas tem sempre cinco, e quem a calcula é a tela

**Status:** Vigente · **Desde:** 2026-08-26
**Aplica-se a:** todo jogo do motor

### A regra

**A tela de resultado mostra sempre CINCO estrelas**, preenchidas por *um quinto da meta
alcançado* — e **o jogo não passa nota nenhuma**: a `ResultScreen` deriva a fileira dos mesmos
`acertos` e `totalPerguntas` que ela já exibe e que vão para o AVA.

A quinta estrela exige a meta **inteira** (`Math.floor` do percentual, não arredondamento).

### Por quê

**Cinco, e fixo.** Uma fileira de tamanho variável obriga a criança a ler DOIS números — quantas
acesas, de quantas — antes de saber se foi bem. Com o total sempre igual, a quantidade de ouro na
tela é a mensagem inteira, e é a mesma leitura de uma partida para a outra e de um jogo para o
outro. Cinco porque é a escala que a criança já reconhece de fora do jogo.

**A tela, e não o jogo.** Era o jogo quem calculava, e o resultado foi previsível: passaram a
existir **duas fórmulas divergentes** de "quantas estrelas" no repositório — uma no
`ScoreSystem` (0 a 3 pelos erros, que dava **zero** em qualquer derrota) e outra na cena do Jogo
das Formas (0 a 3 pelo percentual). A do `ScoreSystem` contradizia a diretriz de
[`DESIGN.md`](DESIGN.md) — "a derrota mostra o quanto o aluno avançou, não o quanto falhou" —, e
nada obrigava as duas a concordarem. Nota é apresentação; apresentação é da tela.

**Piso e teto.** A pontuação **passa da meta** (um combo resolve vários blocos, o bloco-estrela
vale 2), e a fileira para em cinco em vez de estourar. No outro extremo, abaixo de 20% da meta
ela fica vazia: é o preço do `Math.floor`, e é aceitável porque o número embaixo diz o progresso
na unidade ("2 PONTOS", RE-03) e porque o desenho anterior era mais severo — zerava abaixo de
30%. O que `Math.floor` compra é o inverso, e vale mais: com arredondamento, 90% da meta
acenderia as cinco estrelas e a tela voltaria a anunciar nota máxima para uma partida
incompleta, que é exatamente o defeito que a **RE-02** existe para impedir.

### Escopo — e o que a regra NÃO diz

| Onde | Vale? | Motivo |
|---|---|---|
| Fileira de estrelas da tela de resultado | **Sim** | É o caso da regra |
| Quem calcula a nota | **A tela, sempre** | Um jogo que calcule a própria nota recria a divergência que esta regra fecha |
| Campos da mensagem do AVA | **Não** | As estrelas **não vão para o AVA**. Quanto a partida vale em XP ou nota é do servidor (METODO A3) |
| Barra de progresso **durante** a partida | **Não** | Ali a leitura é "quanto falta", em fração da meta, e é a informação certa enquanto a criança ainda pode agir |
| Ícone de estrela no HUD | Não se aplica | É a marca do placar, não uma nota |
| Bloco-estrela do Jogo das Formas | Não se aplica | É uma peça que vale 2 pontos, e não tem relação com a fileira |

A regra **não** diz que a derrota tenha de acender ao menos uma estrela, e **não** muda nenhum
número do relatório: nada aqui atravessa a fronteira do AVA.

### Como aplicar

Nada a fazer num jogo novo, e **uma coisa a não fazer**: não passe `estrelas` em
`irPara('resultado', …)`. O jogo declara a meta em `niveis[].meta` e entrega o payload:

```js
this.irPara('resultado', {
  nivel: this.nivel,
  resultado: this.placar.paraAva(venceu),
});
```

A conta é `estrelasDoResultado()`, exportada de `engine/screens/ResultScreen.js` — separada da
tela porque é a única regra dela que produz um número, e número se prova sem navegador.

### Onde já está aplicado

- **Jogo das Formas** — o caso que originou a regra: metas de 12, 16 e 20 mostravam **três**
  estrelas, e o piloto mostrava cinco, sem que nada na tela explicasse a diferença.
- **Jogo dos Blocos** — **inalterado na prática**: com meta 5, um quinto da meta é exatamente um
  ponto, então a fileira mostra o que já mostrava. O que mudou foi o caminho do código.
- Travado por teste em `tools/testes.mjs` (a conta, incluindo a igualdade com "um ponto por
  estrela" na meta 5, e uma verificação de que `ScoreSystem.estrelas` **não voltou a existir**) e
  em `tools/teste-navegador.mjs` (a fileira desenhada, no navegador).

### Casos ainda não decididos

- **Um jogo com meta muito pequena** (2 ou 3) ganha estrelas em saltos grandes: na meta 2, cada
  ponto acende duas estrelas e meia, e o `floor` faz a terceira aparecer sem que nada tenha
  mudado na tela anterior. Nenhum jogo do motor tem meta abaixo de 5 hoje. Se tiver, decidir ali.
- **Meia estrela** para o resto da divisão foi cogitada e não decidida: resolve o salto acima e
  custa uma arte nova, além de introduzir uma leitura de fração — que é justamente o que a RE-03
  tirou da tela.

---

## Modelo para uma regra nova

Copie o bloco abaixo, troque o `RE-nn` pelo próximo número livre e preencha. Campo que não se
aplica é preenchido com "não se aplica" e o motivo — nunca apagado.

```markdown
## RE-nn — <título curto e afirmativo>

**Status:** Vigente | Em estudo | Revogada · **Desde:** AAAA-MM-DD · **Aplica-se a:** <quais jogos>

### A regra
<uma ou duas frases, no imperativo. Se não couber em duas frases, provavelmente são duas regras.>

### Por quê
<a justificativa pedagógica. Sem isto a regra vira superstição e ninguém sabe quando revê-la.>

### Escopo — e o que a regra NÃO diz
<os limites. É aqui que se evita aplicar a regra onde ela atrapalha.>

### Como aplicar
<exemplo concreto de código ou de configuração.>

### Onde já está aplicado
<lista de jogos conferidos.>

### Casos ainda não decididos
<as exceções previsíveis, para não serem improvisadas depois.>
```

---

## RE-05 — Pedir ajuda nunca custa a partida nem entra na conta

**Status:** Vigente · **Desde:** 2026-09-02
**Aplica-se a:** todo jogo do motor

### A regra

**A explicação de como jogar fica alcançável DURANTE a partida**, por um botão no HUD, e
alcançá-la:

1. **não faz a criança perder a partida** — a ajuda é camada sobre o jogo, que continua vivo e
   pausado, e fechar devolve o tabuleiro, o placar e o tempo como estavam;
2. **não consome o tempo dela** — a partida pausa, então os segundos lendo não entram no
   `tempoSegundos` reportado ao AVA;
3. **não conta como erro** — o pedido é registrado como `ajuda` (quantas vezes), num campo
   separado, e nunca em `erros`.

A ajuda é **o mesmo tutorial** do menu, não uma segunda explicação escrita à parte.

### Por quê

**Quem pede ajuda é quem a atividade ainda não alcançou.** Numa faixa de 4 a 7 anos, a criança
que não entendeu a regra não vai deduzi-la tentando — ela vai tocar em qualquer lugar até o
tempo acabar. Se a única forma de reler a instrução for sair para o menu, o preço de perguntar é
a partida inteira, e o jogo passa a medir quem chutou melhor.

**Cobrar o tempo da leitura seria cobrar duas vezes.** A criança que lê a explicação está
aprendendo o que a aula quer ensinar; contar esse tempo como tempo de jogo transformaria o ato de
estudar a regra em desvantagem no relatório.

**Contar como erro seria pior ainda.** `erros` alimenta a nota (RE-02); um pedido de ajuda ali
baixaria o desempenho de quem fez a coisa certa. Por isso `ajuda` é campo próprio — e é
**contagem, não sim/não**, porque três aberturas na mesma partida são um sinal diferente de uma.

**O que o número mede é a ATIVIDADE, antes da criança.** Muitas ajudas numa turma dizem que a
instrução não está funcionando, ou que o nível começa difícil demais. Quem lê o relatório precisa
saber disso: `ajuda` alta não é aluno fraco.

**Uma explicação só.** A ajuda hospeda o `TutorialScreen`, e não uma cópia dos passos. Duas
versões da mesma instrução divergem: alguém corrige um passo no tutorial do menu e a ajuda dentro
do jogo continua ensinando o jeito antigo — que é a mesma armadilha que a **RE-04** fechou para a
nota, e o mesmo motivo por que o corte de som e a música passaram a ter dono único no motor.

### Escopo — e o que a regra NÃO diz

| Onde | Vale? | Motivo |
|---|---|---|
| Botão de ajuda no HUD da partida | **Sim** | É o caso da regra |
| O tempo lido não entra no `tempoSegundos` | **Sim** | Garantido pela pausa, não por conta separada |
| `ajuda` em campo próprio, nunca em `erros` | **Sim** | `erros` alimenta a nota (RE-02) |
| A ajuda ser o mesmo tutorial do menu | **Sim** | Uma instrução, uma fonte |
| Limitar quantas vezes a criança pode pedir | **Não** | A regra é o contrário: não há teto, e não há penalidade |
| Abrir a ajuda sozinha quando a criança erra muito | **Não decidido** | Tentador e arriscado: interromper quem está tentando é atrapalhar. Ver "casos ainda não decididos" |
| A ajuda contar como pausa no relatório | **Não** | São coisas diferentes: pausa é interrupção externa, ajuda é dúvida sobre a regra |
| Tutorial obrigatório antes da primeira partida | **Não** | Continua opcional, pelo menu — a regra é sobre poder voltar a ele, não sobre ser forçado |

A regra **não** diz que a ajuda tenha de ser lida até o fim, e **não** muda nenhum número de
desempenho: `acertos`, `erros` e `totalPerguntas` ficam iguais.

### Como aplicar

Três linhas na cena de partida, e o template já nasce com elas:

```js
// no HUD, ícone `tutorial` — o mesmo do "COMO JOGAR" do menu
this.adicionar(new IconButton({ icone: 'tutorial', /* … */ aoTocar: () => this.pedirAjuda() }));

this.ajuda = new HelpScreen({
  cena: this,
  aoFechar: () => { this.pausada = false; this.tempo?.retomar(); },
});
this.adicionar(this.ajuda);

pedirAjuda() {
  if (this.placar.encerrado || this.pausada) return;
  this.pausada = true;
  this.tempo?.pausar();          // e o que mais a sua partida tiver de movimento
  this.ajuda.abrir();
}
```

Pause **de verdade** o que a partida tem de tempo e movimento: é `pausada` que faz o
`tempoSegundos` do motor parar. A contagem de pedidos não é assunto do jogo — `HelpScreen.abrir()`
chama `Game.registrarAjuda()`.

E **escreva os passos do `config.tutorial` pensando nos dois públicos**: quem nunca viu o jogo, no
menu, e quem já está jogando e travou.

### Onde já está aplicado

- **Jogo dos Blocos**, **Jogo das Formas** e **Jogo das Cores** — botão no HUD, ao lado da pausa
  e do som, com vão de 16 px (piso de `acessibilidade.espacoEntreAlvos`);
- **`templates/jogo-base`** — o próximo jogo nasce com o botão.

Verificado em navegador com toque real no pixel do botão: a cena **não** é trocada, a torre e o
placar sobrevivem, 1,5 s de ajuda aberta somam 0,00 s de tempo de jogo, e duas aberturas
reportam `ajuda: 2`.

### Casos ainda não decididos

- **Abrir a ajuda sozinha** depois de N erros ou de M segundos sem acerto. Ajudaria quem não
  descobre o botão, e atrapalharia quem está tentando — precisa ser visto com criança antes de
  ser escrito como regra.
- **Narração do passo ao abrir a ajuda no meio da partida.** Hoje o passo narra igual ao tutorial
  do menu. Se a música de fundo estiver alta, a fala pode competir; ninguém mediu ainda.
- **Ajuda por nível.** `config.tutorial` é uma lista só para o jogo inteiro. Um jogo cujos níveis
  mudem a regra precisaria de passos por nível — nenhum dos três precisa.

---

## Histórico

| Data | ID | O que mudou | Jogos publicados precisam de ajuste? |
|---|---|---|---|
| 2026-08-19 | RE-01 | Criada, restrita às **letras que são conteúdo**; frases ficavam em caixa normal | Não — o Jogo dos Blocos já cumpria |
| 2026-08-19 | RE-01 | **Ampliada para todo texto exibido.** A versão anterior preservava caixa normal nas frases alegando velocidade de leitura — argumento válido para leitor fluente, mas não para quem tem 4–7 anos e lê apenas letra bastão. Passou a ser opção por jogo (`textoEmCaixaAlta`), ligada por padrão | Sim — Jogo dos Blocos atualizado e reverificado no mesmo dia |
| 2026-08-24 | RE-02 | Criada. A fileira de estrelas vinha do acerto bruto e enchia em toda vitória, porque vencer exige acertar a meta inteira: "5 de 5" com duas quedas era indistinguível de uma partida limpa. A nota passou a descontar a falha na vitória, e o mesmo número passou a ir para o AVA | **Sim** — muda o `score_percent` de vitórias com falha (100% → 60% no caso de 2 quedas em 5). Jogo dos Blocos atualizado e reverificado |
| 2026-08-25 | RE-03 | Criada. A tela de resultado dizia "${acertos} de ${totalPerguntas}", e no Jogo das Formas isso produzia "13 de 12" — a pontuação passa da meta porque um combo resolve vários blocos e o bloco-estrela vale 2. O placar passou a ser dito na unidade ("13 PONTOS") e a linha que enumerava as falhas saiu da tela | Não — nenhum número mudou, só a forma de enunciá-lo. Os dois jogos atualizados e reverificados |
| 2026-08-26 | RE-04 | Criada. A fileira tinha tamanho variável — uma estrela por pergunta até 6, caindo para três acima disso —, então o Jogo dos Blocos mostrava cinco e o Jogo das Formas três, e cada jogo com meta grande calculava a própria nota. Havia **duas fórmulas divergentes** de "quantas estrelas" no repo. A fileira passou a ter cinco fixas preenchidas pelo percentual da meta, calculadas pela tela; `ScoreSystem.estrelas` e `GameScene._notaEmEstrelas()` foram removidos | **Não para o AVA** — as estrelas nunca viajaram na mensagem. Na tela: Jogo das Formas muda (3 estrelas → 5, ex. 14 de 20 passa de ⭐⭐ para ⭐⭐⭐); Jogo dos Blocos **não muda**, porque na meta 5 um quinto da meta é um ponto. Os dois reverificados |
| 2026-09-02 | RE-05 | Criada. A explicação de como jogar só existia no menu, então reler a regra custava a partida — e numa faixa de 4 a 7 anos a criança que não entendeu não deduz jogando, ela chuta até o tempo acabar. A ajuda passou a ser camada sobre a partida (o MESMO tutorial, hospedado), o tempo lendo não entra no `tempoSegundos` porque a partida pausa, e o pedido é reportado em campo próprio (`ajuda`, contagem) e nunca em `erros` | **Não** — nenhum número de desempenho muda. A mensagem do AVA ganha o campo `ajuda`, que o servidor grava no `payload` sem precisar de coluna. Os três jogos e o template atualizados e reverificados |
