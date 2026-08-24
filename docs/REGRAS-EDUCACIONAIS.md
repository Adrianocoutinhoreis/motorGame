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
| Cor como conteúdo | No Jogo das Cores, cada peça precisará de forma ou símbolo próprio (daltonismo). Isso é regra geral ou específica daquele jogo? |

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
  estrelas: this.placar.estrelas,
  resultado: this.placar.paraAva(venceu, { blocosEmpilhados: this.torre.length }),
});
```

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

## Histórico

| Data | ID | O que mudou | Jogos publicados precisam de ajuste? |
|---|---|---|---|
| 2026-08-19 | RE-01 | Criada, restrita às **letras que são conteúdo**; frases ficavam em caixa normal | Não — o Jogo dos Blocos já cumpria |
| 2026-08-19 | RE-01 | **Ampliada para todo texto exibido.** A versão anterior preservava caixa normal nas frases alegando velocidade de leitura — argumento válido para leitor fluente, mas não para quem tem 4–7 anos e lê apenas letra bastão. Passou a ser opção por jogo (`textoEmCaixaAlta`), ligada por padrão | Sim — Jogo dos Blocos atualizado e reverificado no mesmo dia |
| 2026-08-24 | RE-02 | Criada. A fileira de estrelas vinha do acerto bruto e enchia em toda vitória, porque vencer exige acertar a meta inteira: "5 de 5" com duas quedas era indistinguível de uma partida limpa. A nota passou a descontar a falha na vitória, e o mesmo número passou a ir para o AVA | **Sim** — muda o `score_percent` de vitórias com falha (100% → 60% no caso de 2 quedas em 5). Jogo dos Blocos atualizado e reverificado |
