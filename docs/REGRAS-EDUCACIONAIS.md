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
