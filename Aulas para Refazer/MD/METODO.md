# LMS / Gamificação nos jogos (contrato + guia oficial de aplicação)

**Documento único e oficial.** Reúne três coisas que antes viviam separadas:

1. **O contrato** — a mensagem que qualquer jogo precisa emitir para registrar partidas
   no AVA (Educandus). É a fonte da verdade; qualquer jogo, de qualquer tecnologia, segue.
2. **A orientação de trabalho** — como uma IA e um humano instrumentam uma aula juntos,
   com honestidade e observabilidade.
3. **O guia de aplicação em Construct 3** — como cumprir o contrato num **export HTML5 do
   C3 sem o projeto-fonte `.c3p`** (o caso difícil, que exige acessar o runtime por fora).

Se você só quer saber **o que enviar**, leia a Parte A. Se vai **instrumentar um jogo C3
exportado**, leia tudo — as armadilhas da Parte B custaram horas.

Validado ponta a ponta no jogo **Monte a Operação [878158]** e alinhado ao arquivo real
`scripts/ava-gamificacao.js` desse jogo (a implementação oficial de referência).

---

# PARTE A — O CONTRATO (o que o jogo envia)

## A1. Objetivo

Quando o jogador termina uma partida, o jogo (que roda dentro de um `<iframe>`) avisa a
página que o hospeda (o AVA) via `window.parent.postMessage`. O AVA escuta, monta a
chamada da API e registra o resultado.

O jogo **não** fala com a API, **não** grava no banco e **não** conhece aluno, turma,
`lo_id`, `activity_id`, XP ou nota. Ele só emite a mensagem. Todo o resto é do AVA.

## A2. A mensagem

```js
window.parent.postMessage(
  {
    type: "JOGO_CONCLUIDO",     // obrigatório, exatamente com essa grafia
    acertos: 5,
    erros: 6,
    totalPerguntas: 8,
    nivel: 1,
    jogo: "monte-a-operacao"    // opcional, slug estável do jogo
  },
  "*"
);
```

### A2.1 Campos

| Campo | Obrigatório | Tipo | Se faltar |
|---|---|---|---|
| `type` | **sim** | string fixa `"JOGO_CONCLUIDO"` | a mensagem inteira é ignorada |
| `acertos` | não | number (aceita string numérica) | vira `0` |
| `erros` | não | number (aceita string numérica) | vira `0` |
| `totalPerguntas` | não | number (aceita string numérica) | fica `null` (e o aproveitamento também) |
| `nivel` | não | number | fica `null` |
| `jogo` | não | string (slug) | fica `null` — o jogo é identificado só pelo `lo_id` |

> **Convenção nossa sobre `nivel`:** **sempre envie `nivel` — nunca omita nem deixe `null`.**
> A maioria das aulas/jogos tem **um único nível** (animação ou layout único onde tudo
> acontece); nesses casos, `nivel: 1`. Só use valores maiores quando o jogo realmente tem
> níveis distintos. Assim `nivel` nunca chega ao AVA como `null`.

### A2.2 Mensagem mínima

Já registra uma partida:

```js
window.parent.postMessage({ type: "JOGO_CONCLUIDO" }, "*");
```

Tudo além de `type` é dado de desempenho — quanto mais completo, melhor o relatório, mas
só `type` é estritamente necessário para a partida contar.

### A2.3 Tolerâncias que o AVA já aceita (bom saber, não é preciso depender)

- Números como texto (`"5"` → `5`).
- `total_perguntas` em snake_case também é aceito.
- A mensagem inteira pode chegar serializada como string JSON.

Mesmo assim, o ideal é enviar em **camelCase** e **number nativo**, como na seção A2.

## A3. O que o jogo NÃO deve enviar (nem calcular)

- **Identificação do aluno** (id, token, matrícula) — o AVA já sabe pelo token da sessão.
- **`lo_id` / `activity_id`** — quem carimba é o AVA (só ele sabe a página/atividade aberta).
- **Turma** — não é usada.
- **XP ou nota** — quanto vale a partida é decisão do servidor.

Se o jogo já manda algum desses, tudo bem (são ignorados) — mas não implemente nada para
gerá-los.

## A4. O que o AVA faz depois (contexto — não é responsabilidade do jogo)

O AVA escuta a mensagem e chama a API; o **servidor grava no banco**:

```json
POST gamification/games/complete
{
  "lo_id": 4321,
  "activity_id": 99,
  "game_key": "monte-a-operacao",
  "acertos": 5,
  "erros": 6,
  "total_perguntas": 8,
  "nivel": 1,
  "payload": { "type": "JOGO_CONCLUIDO", "acertos": 5, "...": "mensagem crua" }
}
```

O servidor calcula `score_percent` (`acertos ÷ total_perguntas`, limitado a 0–100) e grava
o XP. O `payload` guarda a mensagem crua inteira — então **qualquer campo extra que o jogo
mandar já fica registrado**, mesmo sem coluna própria. Ou seja: "injetar no banco" é o
AVA+servidor fazendo isso, disparado pelo nosso `postMessage`. O jogo não toca no banco.

## A5. Checklist do contrato (vale para qualquer jogo)

- [ ] Existe **um único** ponto de "fim de partida" que dispara a mensagem — sem disparo
      duplo (voltar à tela de resultado, re-render, etc.).
- [ ] `type` é exatamente `"JOGO_CONCLUIDO"` (sem variação de caixa/espaço).
- [ ] `acertos`/`erros` são o total da **partida inteira**, não da última pergunta.
- [ ] `totalPerguntas` reflete o número real de perguntas/rodadas (não um fixo hardcoded se
      o jogo varia).
- [ ] `nivel` enviado se o jogo tem níveis; omitido se não tem.
- [ ] `jogo` recebe um slug estável (ex.: `"monte-a-operacao"`).
- [ ] `acertos`/`erros`/`totalPerguntas` como `number`, não string.
- [ ] `postMessage` para `window.parent` (não `window.top`, não origem fixa) com `"*"`.
- [ ] Nenhum dado de aluno/`lo_id`/`activity_id`/turma/XP/nota é exigido pelo jogo.

---

# PARTE B — APLICAÇÃO EM CONSTRUCT 3 (export HTML5, sem `.c3p`)

Cumprir o contrato num jogo com fonte é trivial: acha o "fim de partida" e emite. O caso
difícil — e o motivo desta parte — é um **export HTML5 do C3 rodando em worker mode**, do
qual só temos os arquivos exportados. É preciso acessar o runtime por fora.

## B0. Como trabalhamos: IA + humano

Este guia **não é um oráculo**. A parte MECÂNICA (acessar o runtime, as armadilhas) é
quase universal e a IA resolve sozinha. A parte SEMÂNTICA (o que é "acerto/erro/fim"
NAQUELA página) varia demais — e aí o humano completa. Precisar do humano **não é fracasso;
é o desenho.**

**Regras de conduta da IA (inegociáveis):**

1. **Observabilidade sempre.** `console.log` em CADA etapa: script carregado, `runOnStartup`
   executou, cada troca de tela, cada acerto/erro, e o `JOGO_CONCLUIDO`. O humano acompanha
   pelo console — é assim que os dois enxergam a mesma coisa. Nunca trabalhe às cegas.
2. **Pergunte na hora certa.** Pare e pergunte quando não identificar a mecânica, não achar
   o sinal de conclusão, o contrato não encaixar, ou houver mais de uma leitura plausível.
   Peça o que ajuda: **print da tela**, **o que a página pede**, **quantas perguntas**, **o
   que acontece ao acertar/errar**.
3. **Seja honesta.** Diga quando está se perdendo, quando uma hipótese é **chute**, quando o
   `data.json` não deixa concluir. "Não consigo determinar X sozinho, preciso que você me
   diga Y" vale mais que uma instrumentação que parece pronta e mede errado.
4. **Valide no runtime, não no arquivo.** Toda hipótese tirada do `data.json` é PALPITE até
   o console ao vivo confirmar (armadilha B4.2).

**O ciclo:** investigar (sondas) → observar logs → hipótese → **validar com o humano
(print/explicação)** → ajustar → confirmar ao vivo. Iterar até os números baterem.

## B0.5. Procedimento de execução e modo autônomo (leia ANTES de agir)

As seções da Parte B estão organizadas por **tema**, não pela ordem em que você deve
executá-las. Siga esta ordem — e note que **investigar vem antes de escrever o código**.

**Ordem de execução:**

1. **Preparar o ambiente.** Matar o Service Worker (B4.4) e garantir que você vê o console
   (Apêndice A1). Sem ver logs, você está cego — pare aqui até resolver.
2. **Destravar o acesso** — `useWorker:false` no `scripts/main.js` (B2; Apêndice A2 para
   achar o ponto). **Ainda NÃO escreva o LMS.**
3. **Investigar/sondar** o jogo (B5): layouts, `globalVars`, objetos. Cruzar com o
   `data.json` por pistas (Apêndice A2). Descobrir início, conclusão, contadores, feedback.
4. **Mapear a semântica** (B6 + B6.5): categoria do jogo, o que é acerto/erro/fim, quantas
   perguntas, `nivel`, e o slug `jogo`. É aqui que se decide o significado de cada campo.
5. **Escrever** `scripts/ava-gamificacao.js` (B7 + receitas do Apêndice A3) e **registrá-lo**
   no `main.js` (B1).
6. **Validar** (B8) — jogando, se possível; se não puder jogar, rodar a autoverificação
   estática (Apêndice A4) e deixar a validação-jogando como etapa do humano.
7. **Entregar com honestidade** — documentar, no topo do script, o **significado de cada
   campo** neste jogo, e listar as **suposições que ficaram sem confirmação** (ver regras
   abaixo).

**Modo autônomo vs. com humano — o que você decide sozinha e o que precisa confirmar:**

- **Decide sozinha (camada mecânica):** destravar o worker, registrar o project script,
  listar layouts/variáveis/objetos, montar o esqueleto (acesso + `beforelayoutstart` +
  `tick` + disparo único), e a forma do contrato (Parte A). Isso é quase universal.
- **Precisa confirmar (camada semântica):** o que conta como acerto/erro/fim, quantas
  perguntas há, se a página é apenas expositiva. Varia por jogo e é onde se erra.
- **Se HÁ humano no loop:** pergunte na hora certa (B9), sempre mostrando logs e hipóteses.
- **Se NÃO há humano (autonomia real): NÃO TRAVE.** Faça a melhor leitura possível pelo
  runtime + `data.json` + template (B6.5), escolha a interpretação **mais conservadora e
  honesta**, implemente, e entregue com um bloco **"SUPOSIÇÕES E INCERTEZAS"** listando o
  que não deu para confirmar e como confirmar depois (ex.: "assumi 4 perguntas no Lv1 pelos
  grupos do data.json; confirmar jogando"). Uma entrega honesta com suposições explícitas
  vale mais que travar ou fingir certeza.
- **Nunca invente número.** Se um campo não é determinável por observação nem por derivação,
  use o **default honesto** (`erros:0`, `totalPerguntas:null`) e **diga** — não chute um valor.

## B1. Onde o código entra: um PROJECT SCRIPT (jeito oficial)

O jeito correto — o que a implementação oficial usa — **não** é injetar no `index.html`. É
adicionar um arquivo próprio e registrá-lo como **project script** do C3, para o runtime
carregá-lo e chamar seu `runOnStartup()` (recebendo o `IRuntime` oficialmente).

1. **Criar `scripts/ava-gamificacao.js`** (o código da seção B7).

2. **Registrar no `scripts/main.js`.** Achar o `new self.RuntimeInterface({...})` e ajustar
   três coisas — `useWorker: false`, `projectScripts` e `mainProjectScript`:

   ```js
   window["c3_runtimeInterface"] = new self.RuntimeInterface({
     useWorker: false,                        // ver B2 (precisa de window.parent)
     workerMainUrl: "workermain.js",
     engineScripts: ["scripts/c3runtime.js"],
     projectScripts: [["scripts/ava-gamificacao.js", "scripts/ava-gamificacao.js"]],
     mainProjectScript: "scripts/ava-gamificacao.js",
     scriptFolder: "scripts/",
     workerDependencyScripts: [],
     exportType: "html5"
   });
   ```

O `index.html` fica **intocado**. Isso é mais limpo e evita boa parte do problema de cache
do Service Worker (armadilha B4.4) — embora `main.js` e o script novo ainda sejam recursos
cacheáveis, então o cache-busting durante o desenvolvimento continua valendo.

> **Fallback:** se por algum motivo não der para registrar o project script, dá para injetar
> o mesmo `runOnStartup(...)` inline no `index.html` (logo após `<body>`, com um pequeno
> `aguardar()` até `self.runOnStartup` existir). É o método antigo — funciona, mas é mais
> sujeito ao cache do `index.html`. Prefira o project script.

## B2. O destravamento: sair do worker

Exports de produção do C3 rodam em **worker mode**: o estado (variáveis, layout, objetos)
vive numa thread isolada. **Por que desligar o worker (`useWorker:false`)?** Porque nosso
script precisa de **`window.parent`** para emitir o `postMessage`, e **num Web Worker não
existe `window`**. Com o worker desligado o runtime roda na thread principal (o mesmo modo
de fallback quando o navegador não tem OffscreenCanvas) e temos `window.parent` + o
`IRuntime` acessível. O jogo roda igual; o C3 suporta os dois modos oficialmente.

Com isso: `runtime.globalVars`, `runtime.getLayout(nome)`, `runtime.objects` acessíveis.

## B3. Detectar início e fim da partida

- **Troca de tela: use o evento oficial por layout**, não polling.

  ```js
  runtime.getLayout("Lv 1").addEventListener("beforelayoutstart", () => { /* ... */ });
  ```

  Cada layout dispara `beforelayoutstart` ao começar. Útil para reagir à entrada numa tela
  (ex.: re-sincronizar o sprite de erro por nível) e, se houver uma **tela de conclusão
  dedicada**, para usar o `beforelayoutstart` dela como gatilho de fim. (Isto substitui o
  antigo polling de `runtime.layout.name` no `tick`.) **Para disparar/re-armar a partida,
  prefira a borda de subida do ESTADO (B3.5), não o layout** — é mais robusto com replays.

- **Sinais contínuos (erro por feedback visual): use o `tick`.** Alguns jogos não têm
  variável de erro — o erro é só um sprite (ex.: `errado`) que fica visível por instantes.
  Para contá-lo, observe no `tick` a **borda de subida** `isVisible` 0→1 desse sprite.

- **Fim por estado (sem tela de conclusão):** quando o "fim" é uma condição das variáveis
  (ex.: todos os `LvN_Acertos` atingiram o total), detecte no `tick` por **borda de subida**
  e dispare uma vez (ver B3.5 para rodadas/replays). Foi o caso do Monte a Operação (B10).

## B3.5. Rodadas e replays (capturar cada partida, sem duplicar)

Muitos jogos têm "tentar novamente" / "novo" — a mesma aula jogada de novo. **Política:
cada partida jogada do início ao fim conta como uma tentativa** (o AVA registra tentativas,
com score/XP por tentativa). Então um replay genuíno **deve** gerar um novo `JOGO_CONCLUIDO`
— isso **não** é "dado repetido", é uma nova tentativa. O que NÃO pode acontecer é duplicar
a **mesma** partida. Há três situações a separar:

1. **Spam por frame.** O `tick` roda a cada quadro; sem guarda, mandaria a conclusão toda
   hora enquanto o aluno fica na tela de fim. → resolvido pela detecção por **borda** (só no
   instante da conclusão).
2. **Replay legítimo** (jogou de novo até o fim). → **deve** enviar de novo. Correto.
3. **Duplicata da mesma partida** (o bug real a evitar). Acontece se você re-arma o envio
   ligado a *um layout* enquanto os **contadores ainda estão no máximo**: no próximo tick a
   condição de fim ainda é `true` e dispara de novo com os **mesmos números**.

**A solução robusta — detectar por borda de subida do ESTADO, não por layout:**

```js
let completouAntes = false;
function aoTick(runtime){
  const completou = partidaTerminou(runtime);
  if (completou && !completouAntes) enviarResultado(runtime); // subida: fim de 1 partida
  if (!completou && completouAntes) zerarRodada();            // descida: nova rodada começou
  completouAntes = completou;
}
```

Isso dispara **exatamente uma vez por conclusão real** e **re-arma sozinho** quando o estado
sai de "concluído" — ou seja, quando o jogo zera os contadores para a próxima rodada. Não
depende de acertar qual layout o botão "tentar novamente" abre.

**Cuidados por jogo (confirmar):**
- **O replay precisa fazer a condição de fim CAIR e subir de novo.** Se o "tentar novamente"
  zera os contadores (a corrida recomeça do zero), a borda de descida re-arma naturalmente.
  Se o jogo **não** zera (raro), a condição fica `true` e nenhuma partida nova é capturada —
  aí é preciso um gatilho explícito de reset (ex.: `beforelayoutstart` do layout inicial).
- **"Tentar novamente" de UM nível vs. "novo jogo" (todos os níveis).** Decida o que conta
  como uma partida — normalmente a corrida inteira. Se um único nível repetido deve contar,
  o "fim" é por nível, não pelo conjunto (muda `partidaTerminou`). Confirme a mecânica.
- **Início já "concluído".** Se o jogo pudesse carregar num estado que satisfaz o fim,
  inicialize `completouAntes` lendo o estado no primeiro tick, para não disparar à toa.

## B4. Armadilhas que custam horas (leia ANTES)

1. **Worker mode esconde tudo.** Se `globalVars` vem `{}` e `getLayout` falha, o worker
   está ligado. → `useWorker:false` (B2). Confirme no console: `Hosted in DOM` (bom) vs
   `Hosted in worker` (ruim).
2. **O `data.json` MENTE.** É minificado (array posicional) e lista TODA a estrutura do
   projeto — inclusive partes que **podem não rodar** ou rodar diferente. **Nunca conclua a
   mecânica só lendo o `data.json` — valide no runtime vivo.** (Os NOMES de grupos de
   eventos e variáveis vazam mesmo minificados e dão ótimas pistas — mas são pistas.)
3. **`layoutchange` é traiçoeiro** — não conte com ele. Use `getLayout(nome)
   .addEventListener("beforelayoutstart", …)` por layout (B3), que dispara de fato.
4. **O Service Worker cacheia os arquivos.** Suas edições em `main.js` / `ava-gamificacao.js`
   podem não aparecer porque o SW serve a versão em cache. → Durante o estudo, faça
   **Unregister + Clear site data** no DevTools (Application) uma vez, e use um `console.log`
   no topo do script como detetive: se não aparece, é cache.
5. **Teste local não dispara o `postMessage`.** Fora de um iframe, `window.parent === window`
   e a mensagem não sai — só o `console.log`. Isso é correto: valide pelo console; o
   `postMessage` real só ocorre em produção (dentro do iframe do AVA). Proteja sempre:
   `if (window.parent && window.parent !== window) …` (ou aceite que só o log sai localmente).

## B5. Roteiro de investigação de um jogo novo

Com o acesso destravado, rode sondas (console ou dentro do `runOnStartup`):

1. **Telas:** liste os layouts e observe as trocas (via `beforelayoutstart` de cada um).
   Identifique início, conclusão e reset.
2. **Variáveis globais:** `Object.keys(runtime.globalVars)` e valores ao vivo. Procure
   contadores de progresso/acerto (ex.: `Lv1_Acertos`). **Jogue e veja quais mudam** — é o
   que separa variável viva de estrutura morta.
3. **Objetos:** `Object.keys(runtime.objects)`. Procure feedback (`certo`, `errado`, `X`,
   `wrong`). Por instância: `getFirstInstance()`/`getAllInstances()`, `isVisible`, `instVars`.
4. **Cruze com o `data.json`:** nomes de grupos (`"Certo 2 - Lv3"`, `"Errado - Lv2"`…)
   revelam a estrutura (nº de perguntas por nível). Confirme no runtime (armadilha B4.2).

## B6. Mapear a semântica → o contrato

Os campos são fixos; o **significado** é adaptado ao jogo, e **documentado**.

### 6a. "Completa-acertando-tudo" (ex.: Monte a Operação)
Só conclui acertando tudo; errar repete a pergunta.
- `totalPerguntas` = total de perguntas da partida.
- `acertos` = total de acertos (soma dos `LvN_Acertos`). *(Se quiser medir desempenho fino,
  dá para contar "acertos de primeira tentativa" — mas o oficial usa a soma simples.)*
- `erros` = feedback visual de erro (6c).

### 6b. Variável de progresso = acertos
Se há variável que sobe a cada avanço (`*_Acertos`, `pontos`, `fase`), ela é a contagem.
Leia o valor final.

### 6c. Erros — do mais confiável ao menos
- **(A) Sinal observável:** sprite de erro que fica **visível** ao errar. Conte as
  transições `isVisible` 0→1 (NÃO a criação da instância). Exato, específico do jogo.
- **(B) Tentativas − acertos:** conte interações e subtraia acertos. Genérico (drag-drop),
  mas soltas inválidas inflam.
- **(C) Não-medível:** sem sinal, `erros: 0` e documente. Não invente.

### 6d. `nivel`
**Sempre envie `nivel`; nunca `null`, nunca omita.** Se o jogo tem níveis distintos, derive
do nível ativo (o `LvN_*` que incrementa). Se é **nível único** — animação ou layout único
onde tudo acontece, o caso mais comum — use `nivel: 1`.

### 6e. Casos reais (aula "Unidades e dezenas [11626]", 5 páginas) — confirmar com o humano
- **Tem `acertos` E `erros` como variáveis** (871068): fácil — leia as duas.
- **Só `erros`** (871067 teclado, 871069 chip): derive `acertos = totalPerguntas − com erro`
  ou use grupos `Acertou`/`Errou`. Não invente `acertos`.
- **Fases múltiplas** (871066: `FASE_PEIXE`…): "total" = soma das etapas.
- **Memória** (876399: `Acertos`=pares, `Pares`, `Timer`): acertos/total claros; **`erros`
  é ambíguo** (viradas que não casam). Decida COM o humano.
- **Expositivo** (só ler/assistir): não force métricas — o sinal honesto é "concluiu"
  (`acertos/erros/totalPerguntas` podem ser 0).

### 6f. Exercício de repetição infinita (sem total e sem fim) — ex.: aula 11889
Uma questão por vez, **gerada por sorteio**; ao acertar aparece um botão que gera outra, e
isso segue **indefinidamente**. Não há total de perguntas, tela de conclusão nem fim de
sessão — e o `fim_lo()` do chassi é código morto (B6.6).

Aqui **não existe recorte de "partida inteira"**: esperar por um fim que não existe significa
nunca registrar nada. O recorte honesto é **uma partida = uma questão resolvida**:

- `acertos: 1` — a questão resolvida. É sempre 1 porque só se conclui acertando (é a 6a
  aplicada a uma questão), então `score_percent` fica sempre 100%.
- `erros` — quantas respostas ERRADAS o aluno deu **nesta mesma questão** antes de acertar.
  **É aqui que mora o desempenho real desta categoria.** Zere ao enviar.
- `totalPerguntas: 1`, `nivel: 1`.
- Extra útil no `payload`: `questaoDaSessao` (1ª, 2ª, 3ª… resolvida desde que a página abriu).

Isso está de acordo com a política de B3.5 (cada partida levada ao fim conta como uma
tentativa): cada questão resolvida gera **um** `JOGO_CONCLUIDO`, e o "replay" natural da
página é justamente a próxima questão. **Não invente um total** ("de 10 em 10") sem alguém
decidir isso — deixe explícito na entrega que o recorte foi uma decisão, não um dado do jogo.

Cuidado ao zerar `erros`: além de zerar no envio, vale zerar quando as **globais da questão
mudam** (o sorteio gerou outra), para nunca somar erros de duas questões diferentes.

O denominador honesto de quase toda página é **"concluiu"**. Quando um campo não é
determinável, **pergunte — não chute.**

## B6.5. Convenções do template Educandus (heurística de 1º palpite)

Muitas aulas C3 da Educandus — não todas — usam um TEMPLATE comum. Reconhecê-lo dá um
palpite forte. **São palpites, não regras:** confirme no runtime e com o humano.

**Assinatura do chassi (template):** `PersonagemCarregamento`, `TextToque`/`BgToque`,
`maozinhaDaOndinha`, `BotaoFala`/`BotaoSons`, e o sistema de falas
`Falando`/`TempoFala`/`SomEfeitos`/`SomFalas`/`NumeroDeFalas`. Esses são do template
(carregamento + narração) — **ignore-os** ao procurar desempenho.

**Onde costuma estar a mecânica pedagógica:**
- **Desempenho:** `acertos`, `erros`, `fase`, `Acertos`, `Pares` (comece por `globalVars`).
- **Interação:** `ObjetosArrastaveis`/`ObjetosClicaveis` (+ `DragDrop`); teclado (`Teclado`,
  `botaoOk`); memória (`imagemN_M`, `Pares`).
- **Feedback:** objetos/áudios `correto`/`errado`/`CORRETO`/`vitoria`, ou o sprite visível
  ao errar. **Antes de tudo isso, veja B6.6:** o `scriptsInEvents.js` pode já ter o acerto
  e o erro declarados em JS (`window.parent.feedback("Parabens"…)` / `("Você errou"…)`).
- **Conclusão:** `Conclusao`, `FimDaPagina`, `Parabens`. Se nenhum existir, o fim é um
  estado (variável no máximo) — pergunte ao humano. `window.parent.fim_lo()` existe no
  chassi, mas **frequentemente é código morto** (ver B6.6).
- **Exercício de repetição infinita (padrão "termo desconhecido"):** `gerar_valores()` +
  `testar_vazio()`/`testa_vazio()` + `testar_correto()`/`testa_correto()`, com `TextInput`,
  botão OK (`Sprite_ok`), botão "outra" (`sprite_novo`) e exemplo (`mostrar`/`Sprite_ok2`).
  Globais típicas: `num1`, `num2`, `triangulo` (a incógnita), `camposVazios`, `operacao`.
  Não há total de perguntas nem conclusão — ver 6f.

**Cada aula nova analisada deve ENRIQUECER estas listas** — é assim que o método fica mais
independente com o tempo.

## B6.6. OLHE O `scripts/project/scriptsInEvents.js` PRIMEIRO (atalho de ouro)

Antes de caçar variáveis e sprites, abra **`scripts/project/scriptsInEvents.js`**. Boa parte
das aulas da Educandus já tem JavaScript dentro dos eventos, e ele costuma **declarar a
semântica de graça**:

```js
async Pagina_eventsheet_Event33(runtime, localVars) {
  window.parent.feedback("Parabens", "", "Muito bem! você acertou", "Menina", "");   // ACERTO
},
async Pagina_eventsheet_Event35(runtime, localVars) {
  window.parent.feedback("Você errou", "", "Você errou. Tente novamente!", "Menina", ""); // ERRO
},
async Funcoes_eventsheet_Event202(runtime, localVars) { window.parent.fim_lo(); },
```

Isso é **melhor que o sprite visível (6c-A)**: é o próprio event sheet dizendo "aqui é
acerto" e "aqui é erro", no momento exato, uma vez por avaliação. Então **envolva
(*wrap*) essas funções** em vez de inferir por estado:

```js
const original = self.C3.ScriptsInEvents[chave];
self.C3.ScriptsInEvents[chave] = async function (runtime, localVars) {
  try { contar(runtime); } catch (e) { console.error("[AVA]", e); }  // conta ANTES
  return original.apply(this, arguments);                            // preserva o jogo
};
```

**Três armadilhas próprias deste atalho:**

1. **O wrap TEM de acontecer no topo do módulo, NUNCA dentro do `runOnStartup`.** O runtime
   monta `self.C3_GetObjectRefTable()` guardando as **referências** dessas funções, e isso
   roda depois dos project scripts e **antes** do `runOnStartup`. Envolver no `runOnStartup`
   não tem efeito nenhum — a tabela já aponta para a função original.
2. **Ordem em `projectScripts`:** `scriptsInEvents.js` tem de vir **antes** do
   `ava-gamificacao.js` (o loader dá `await` em cada um, na ordem do array).
3. **Não confie no NÚMERO do evento entre páginas da mesma aula.** `Pagina_eventsheet_Event33`
   é ACERTO em uma página e ERRO em outra (aconteceu na aula 11889). Detecte pelo
   **conteúdo**: `String(fn)` contém `"Parabens"` → acerto; contém `"errou"` → erro. Deixe o
   número no config só como conferência, e logue quando divergir.

**Como achar o número do bloco no `data.json`:** blocos de script aparecem como
`[5, <índice na refTable>, <número do evento>, null]` dentro do evento pai. Cruzando com
`self.C3_GetObjectRefTable()` (em `scripts/c3runtime.js`, buscar
`self.C3_GetObjectRefTable = function`) você confirma o nome exato — e a mesma tabela decodifica
todos os `ace` do `data.json` (ex.: índice do `System.Cnds.Else` revela qual ramo é o "senão",
isto é, qual bloco é o de erro). É a forma mais barata de sair do palpite (B4.2).

**`fim_lo()` costuma ser código morto — confira antes de usar como conclusão.** Na aula 11889
ele só dispara "Ao tocar `ObjetoClicavel1`", e esse objeto **não tem nenhuma instância em
nenhum layout**. Para checar: percorra `project[5]` (layouts) → camadas → instâncias, onde o
índice do objeto fica no **slot 1** de cada instância, e veja se o objeto aparece.

## B7. Template de código (`scripts/ava-gamificacao.js`)

Baseado na implementação oficial (Monte a Operação): categoria 6a, fim por estado, erro por
sinal observável (6c-A), **uma partida = jogo inteiro**, disparo único. Ajuste o **bloco de
config**.

```js
// scripts/ava-gamificacao.js
// Registrar como mainProjectScript no scripts/main.js (ver B1). Ver contrato na Parte A.
"use strict";

// ===== CONFIG POR JOGO =====
const JOGO = "monte-a-operacao";      // slug estável (campo `jogo` do contrato)
// Um item por nível, na ordem do jogo. `perguntas` = quantas o nível exige para concluir.
// Se o jogo não tem níveis, use um único item (nivel:1) com o layout onde tudo acontece.
const NIVEIS = [
  { nivel: 1, layout: "Lv 1", varAcertos: "Lv1_Acertos", perguntas: 4 },
  { nivel: 2, layout: "Lv 2", varAcertos: "Lv2_Acertos", perguntas: 3 },
  { nivel: 3, layout: "Lv 3", varAcertos: "Lv3_Acertos", perguntas: 4 },
  { nivel: 4, layout: "Lv 4", varAcertos: "Lv4_Acertos", perguntas: 4 },
  { nivel: 5, layout: "Lv 5", varAcertos: "Lv5_Acertos", perguntas: 4 }
];
const OBJ_ERRO = "errado";            // sprite que fica visível ao errar (ou null se não há)
// ===========================

const TOTAL_PERGUNTAS = NIVEIS.reduce((t, n) => t + n.perguntas, 0);
const ULTIMO_NIVEL = NIVEIS[NIVEIS.length - 1].nivel;

let erros = 0, erradoVisivel = false, completouAntes = false;

function zerarRodada() { erros = 0; erradoVisivel = false; }

function acertosDoNivel(runtime, nivel) {
  const v = Number(runtime.globalVars[nivel.varAcertos]);
  return Number.isFinite(v) ? v : 0;
}

// Erro = borda de subida (invisível -> visível) do sprite de feedback.
function contarErros(runtime) {
  if (!OBJ_ERRO) return;
  const obj = runtime.objects[OBJ_ERRO];
  const inst = obj ? obj.getFirstInstance() : null;
  const visivel = !!(inst && inst.isVisible);
  if (visivel && !erradoVisivel) erros++;
  erradoVisivel = visivel;
}

// Fim = todos os níveis com todos os acertos (só ocorre no acerto da última pergunta).
function partidaTerminou(runtime) {
  return NIVEIS.every(n => acertosDoNivel(runtime, n) >= n.perguntas);
}

function enviarResultado(runtime) {
  const acertos = NIVEIS.reduce((t, n) => t + acertosDoNivel(runtime, n), 0);
  const msg = {
    type: "JOGO_CONCLUIDO",
    acertos, erros, totalPerguntas: TOTAL_PERGUNTAS, nivel: ULTIMO_NIVEL, jogo: JOGO
  };
  console.log("[AVA] JOGO_CONCLUIDO", msg);
  try { if (window.parent && window.parent !== window) window.parent.postMessage(msg, "*"); } catch (e) {}
}

function aoTick(runtime) {
  try {
    contarErros(runtime);
    const completou = partidaTerminou(runtime);
    // Borda de SUBIDA (não-concluído -> concluído) = fim de UMA partida: envia 1x.
    if (completou && !completouAntes) enviarResultado(runtime);
    // Borda de DESCIDA (concluído -> não-concluído) = uma NOVA rodada começou (os
    // contadores caíram): re-arma para a próxima. Assim cada replay genuíno conta uma
    // vez, sem duplicar por ficar parado na tela de fim nem depender de um layout.
    if (!completou && completouAntes) zerarRodada();
    completouAntes = completou;
  } catch (err) { console.error("[AVA] falha ao acompanhar a partida:", err); }
}

runOnStartup(runtime => {
  // A cada (re)início de nível o sprite "errado" é recriado invisível — re-sincroniza.
  for (const n of NIVEIS)
    runtime.getLayout(n.layout).addEventListener("beforelayoutstart", () => { erradoVisivel = false; });
  runtime.addEventListener("tick", () => aoTick(runtime));
  // Se o jogo pudesse começar já em estado "concluído", inicialize completouAntes na
  // primeira passagem para não disparar à toa. No caso comum (contadores em 0) não precisa.
});
```

Para outras categorias (6b–6e), troque a lógica de `acertos`/`erros`/fim, mantendo o
esqueleto: project script + `runOnStartup` + `beforelayoutstart` para telas + `tick` para
sinais contínuos + detecção por **borda de subida** para disparo único e replays (B3.5).

## B8. Roteiro de validação

1. Recarregue com o SW morto (B4.4). Confirme no console a carga do script e o `runOnStartup`.
2. Jogue até o fim **errando de propósito um número conhecido de vezes, num número conhecido
   de perguntas.**
3. Compare o `[AVA] JOGO_CONCLUIDO` com o que você fez: `totalPerguntas`, `erros`, `acertos`,
   `nivel`, `jogo`.
4. Jogue uma **segunda partida sem recarregar** — confirme que dispara de novo (uma vez), com
   reset entre elas (nada "preso" da anterior).

## B9. Diálogo com o humano (perguntas-modelo)

Melhor perguntar cedo que instrumentar errado. Mostre **sempre** o que já sabe (logs,
hipóteses) junto da pergunta:

- **Entender a página:** "Print da tela principal? O aluno arrasta, clica, digita, só
  assiste? O que acontece ao acertar? E ao errar?"
- **Total:** "Quantas perguntas/itens? É fixo ou muda a cada vez?"
- **Conclusão:** "Como sei que terminou? Tela de parabéns, som, algo muda?"
- **Erros ambíguos (memória):** "Não há 'erro' óbvio. Conto viradas erradas / tentativas /
  tempo, ou deixo `erros:0`?"
- **Incerteza:** "Tenho duas leituras de 'acerto': (a)… (b)… Não decido pelo código. Qual
  bate com o que você vê jogando?"

## B10. Caso resolvido: Monte a Operação [878158]

Implementação oficial de referência: `scripts/ava-gamificacao.js` + registro no
`scripts/main.js` (project script + `useWorker:false`).

- **Categoria:** 6a (completa-acertando-tudo) + erro por sinal observável (6c-A).
- **Uma partida = os 5 níveis (19 perguntas):** o jogo roda `Lv 1`→…→`Lv 5` em sequência; o
  `postMessage` sai **uma vez**, no acerto da última pergunta do `Lv 5`. Abandonar no meio =
  nada registrado (não existe "fim" nesse caso).
- **Perguntas por nível:** Lv1=4, Lv2=3, Lv3=4, Lv4=4, Lv5=4 → `totalPerguntas: 19`.
- **Campos:** `acertos` = soma dos `LvN_Acertos`; `erros` = vezes que o sprite `errado`
  ficou visível; `nivel` = 5 (último); `jogo` = `"monte-a-operacao"`.
- **Config usada:**
  ```
  JOGO      = "monte-a-operacao"
  NIVEIS    = Lv1..Lv5 (perguntas 4/3/4/4/4)
  OBJ_ERRO  = "errado"
  ```

> **Nota sobre o guard:** o `ava-gamificacao.js` original re-armava o envio no
> `beforelayoutstart` do `Lv 1` (com uma flag `jaEnviou`) — funcionou porque voltar ao `Lv 1`
> zerava os contadores. O padrão **recomendado** deste guia (B7/B3.5) é a **borda de subida
> do estado**, que é mais robusta para replays: não depende de acertar qual layout o botão
> "jogar novamente" abre.

> **Correção histórica:** uma versão antiga deste guia dizia que "só o Lv1 roda por padrão"
> e mandava **um `postMessage` por nível**. Errado — o jogo roda os 5 níveis como **uma**
> partida e emite **uma** mensagem no fim. O código oficial confirma isso.

## B10.5. Apêndices práticos de autonomia

### A1. Como rodar o jogo e observar
- **Servir por HTTP, não `file://`** (o C3 bloqueia recursos em `file:`): um static server
  local na pasta do jogo e abrir o `index.html`.
- **Console:** DevTools → Console para ver os `[AVA] …`. **Application → Service Workers →
  Unregister** + **Clear storage** uma vez (B4.4), senão você vê a versão em cache.
- **Ver a mensagem:** fora de um iframe, `window.parent === window` e o `postMessage` **não
  sai** — por isso o script sempre faz também um `console.log`. Valide por ele. Para ver a
  mensagem "saindo" de verdade, abra o jogo dentro de um iframe de teste e escute no pai:
  `window.addEventListener("message", e => console.log(e.data))`.
- **Se VOCÊ (IA) não pode jogar:** você não terá o loop "validar ao vivo". Então (a) baseie
  a semântica no runtime estático + `data.json` + template (B6.5); (b) instrumente com
  **logs abundantes**; (c) entregue pedindo que um humano jogue **uma** partida com o
  console aberto e cole o `[AVA] JOGO_CONCLUIDO` — a validação B8 vira etapa do humano.
  Deixe isso explícito na entrega.

### A2. Achar o `RuntimeInterface` (main.js) e ler o `data.json`
- **No `scripts/main.js` (minificado):** buscar a string **`new self.RuntimeInterface`**
  (ou `RuntimeInterface({`). É onde ficam `useWorker`/`enableWorker`, `projectScripts` e
  `mainProjectScript` — editar conforme B1. Buscar também **`enableWorker`** (às vezes um
  `const enableWorker=false` alimenta `useWorker`).
- **No `data.json` (minificado, array posicional):** **não** tente parsear a estrutura
  inteira — extraia **pistas por texto**. Nomes de layouts, de variáveis globais e de grupos
  de evento aparecem como strings legíveis. Procure tokens como `Lv`, `Acertos`, `erros`,
  `Parabens`, `Conclusao`, `FimDaPagina`, `FASE_`, `Pares` — revelam telas, contadores e a
  contagem de perguntas por nível. **Lembre B4.2: são PISTAS, confirmar no runtime.**

### A3. Receitas de código por categoria (além da 6a em B7)
Mantêm o esqueleto do B7 (project script + `beforelayoutstart` + `tick` + borda de subida,
B3.5); muda só o cálculo de `acertos`/`erros`/fim.

- **6b — variável de progresso = acertos.** Em vez de somar `NIVEIS`, leia a variável final:
  ```js
  const acertos = Number(runtime.globalVars["acertos"]) || 0;
  const totalPerguntas = Number(runtime.globalVars["total"]) || null; // ou derivado
  // fim: beforelayoutstart da tela de conclusão, ou um estado (ex.: acertos>=total)
  ```
- **6c-B — erros = tentativas − acertos.** Conte interações e subtraia no fim:
  ```js
  let tentativas = 0;
  // ex.: em cada solta de DragDrop / clique de resposta: tentativas++
  const erros = Math.max(0, tentativas - acertos); // impreciso: soltas inválidas inflam — documente
  ```
- **Página expositiva (sem acerto/erro).** Não force métricas — envie o "concluiu":
  ```js
  const msg = { type:"JOGO_CONCLUIDO", acertos:0, erros:0, totalPerguntas:0, nivel:1, jogo:JOGO };
  // fim = chegou ao último layout/estado. O valor está em ter concluído.
  ```

### A4. Autoverificação estática (sem jogar)
Confira só lendo o código antes de entregar:
- [ ] `scripts/ava-gamificacao.js` existe e está em `projectScripts` **e** `mainProjectScript`
      no `main.js`.
- [ ] Se o export já tinha `projectScripts` (ex.: `scriptsInEvents.js`), o script novo foi
      **anexado** à lista, não substituiu — e o `scriptsInEvents.js` vem **antes** dele.
- [ ] **`offline.json`: o script novo está na `fileList` E o campo `version` foi bumpado.**
      A chave do cache do Service Worker é a `version`; sem bumpar, o SW serve o `main.js`
      antigo e a instrumentação não existe para quem já abriu a página — **sem nenhum erro no
      console** (B4.4 na sua forma mais cruel). Confira também que o `offline.json` continua
      JSON válido: o SW só monta o cache se **todos** os arquivos da lista baixarem.
- [ ] `useWorker:false` (ou `enableWorker=false`) no `RuntimeInterface`.
- [ ] A mensagem usa `type:"JOGO_CONCLUIDO"` exato; `acertos`/`erros`/`totalPerguntas` como
      **number**; `jogo` com slug estável.
- [ ] `postMessage` para `window.parent` com `"*"`, protegido por `window.parent !== window`.
- [ ] Detecção por **borda de subida** do estado de conclusão — dispara 1x por partida e
      re-arma na borda de descida (não duplica, captura replays). Ver B3.5.
- [ ] **Reset** da partida no `beforelayoutstart` do layout inicial.
- [ ] Há `console.log("[AVA] JOGO_CONCLUIDO", msg)` para o humano validar.
- [ ] O **significado de cada campo neste jogo** está DOCUMENTADO no topo do script, e as
      incertezas estão num bloco "SUPOSIÇÕES E INCERTEZAS".

## B11. Limitações e trabalho futuro

- **A camada mecânica generaliza; a semântica não.** Acessar o runtime e as armadilhas
  valem para ~todo C3 (B1–B5). O que é "acerto/erro/fim" varia por página — por isso o
  humano no loop (B0) e as convenções do template (B6.5). O método ACELERA e GUIA; não
  torna 100% automático.
- **`erros` é o campo mais frágil** (6c) — transiente, sem padrão único. É onde mais se deve
  perguntar em vez de chutar.
- **`useWorker:false` é exigido** em cada export instrumentado — reavaliar impacto em
  produção caso a caso.
- **O método fica mais independente por acúmulo:** cada aula nova enriquece B6.5 e o registro
  abaixo.
- O ideal continua sendo instrumentar no **projeto-fonte `.c3p`** e re-exportar; este método
  é o caminho quando só há o export HTML5.

## B12. Registro de casos (crescer com o uso)

| Aula / página | Categoria | Config-chave | Status |
|---|---|---|---|
| Monte a Operação [878158] | 6a + erro 6c-A | uma partida = 5 níveis (19 q), `OBJ_ERRO="errado"` | ✅ validado (oficial) |
| Unidades e dezenas [11626] (5 págs) | varia (6e) | — | 📋 só analisado (viabilidade) |
| Valor do termo desconhecido [11889] — 872495 adição | 6f + gancho B6.6 | 1 partida = 1 operação resolvida; ACERTO=`Pagina_eventsheet_Event33`, ERRO=`…Event35` | 🧪 implementado; falta jogar (B8) |
| Valor do termo desconhecido [11889] — 872496 subtração | 6f + gancho B6.6 | ACERTO=`…Event33`, ERRO=`…Event35` | 🧪 implementado; falta jogar (B8) |
| Valor do termo desconhecido [11889] — 872497 multiplicação | 6f + gancho B6.6 | ACERTO=`…Event34`, ERRO=`…Event36` | 🧪 implementado; falta jogar (B8) |
| Valor do termo desconhecido [11889] — 872498 divisão | 6f + gancho B6.6 | ACERTO=`…Event34`, ERRO=`…Event36` | 🧪 implementado; falta jogar (B8) |
| Valor do termo desconhecido [11889] — 872499 operações mistas | 6f + gancho B6.6 | ACERTO=`…Event31`, **ERRO=`…Event31`+2=`…Event33`** (número colide com o ACERTO das outras páginas — ver B6.6.3) | 🧪 implementado; falta jogar (B8) |

**Aprendizados da aula 11889 (5 páginas):** o `useWorker` já vinha `false` e o
`scriptsInEvents.js` já existia como project script — então B2 saiu de graça e o trabalho foi
só (a) **anexar** o `ava-gamificacao.js` ao `projectScripts` existente sem quebrar o
`scriptsInEvents.js`, e (b) envolver os blocos de acerto/erro **no topo do módulo** (B6.6.1).
Também apareceu um passo que faltava no método: **`offline.json`** lista os arquivos que o
Service Worker cacheia e a chave do cache é o campo `version` — sem **adicionar o script novo
à `fileList` e bumpar a `version`**, o SW continua servindo o `main.js` antigo e a
instrumentação simplesmente não existe para quem já abriu a página (é a armadilha B4.4 na sua
forma mais cruel, porque não dá erro nenhum).
