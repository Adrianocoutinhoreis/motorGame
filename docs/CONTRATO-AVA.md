# CONTRATO-AVA.md — o METODO.md aplicado a este motor

Fonte da verdade do contrato: **`Aulas para Refazer/MD/METODO.md`**, Parte A.
Este documento não substitui aquele; ele mostra **como o motor cumpre** cada item e o que
sobra para quem faz um jogo novo.

> A Parte B do METODO.md trata do caso difícil: instrumentar um export HTML5 do Construct 3
> **sem o projeto-fonte**, acessando o runtime por fora. Aqui nós temos o código-fonte, então
> nada daquilo se aplica: não há worker para desligar, `data.json` para decifrar, nem
> `scriptsInEvents.js` para envolver. A camada mecânica sai de graça. **A camada semântica —
> o que é acerto, erro e fim NAQUELE jogo — continua sendo decisão humana**, e é a única
> parte que cada jogo novo precisa resolver.

---

## 1. A mensagem

Emitida uma vez ao fim de cada partida, para a página que hospeda o `<iframe>`:

```js
window.parent.postMessage({
  type: "JOGO_CONCLUIDO",   // exato, sem variação
  acertos: 5,
  erros: 2,
  totalPerguntas: 5,
  nivel: 1,
  jogo: "jogo-dos-blocos",
  vitoria: true,            // acréscimo nosso — ver 1.1
  tempoSegundos: 47,        // acréscimo nosso, MEDIDO PELO MOTOR — ver 1.2
  ajuda: 0                  // acréscimo nosso, CONTADO PELO MOTOR — ver 1.3
}, "*");
```

O jogo **não** envia — nem calcula — aluno, `lo_id`, `activity_id`, turma, XP ou nota.
Isso é do AVA e do servidor (METODO A3/A4).

### 1.1 `vitoria` — os quatro números não respondem isso

`acertos: 14, totalPerguntas: 20` e `acertos: 14, totalPerguntas: 14` têm o mesmo acerto, e só
o segundo é vitória. O motor já sabia — a tela final usa o dado para escolher o que dizer — e
o AVA não recebia.

Vai como **booleano de verdade**, nunca `0`/`1` nem `"true"`: o `payload` é gravado cru, e um
campo que muda de tipo entre partidas é o que estraga relatório meses depois. `AvaBridge`
normaliza (e trata `"false"`, que em JavaScript é *verdadeiro* se testado com `!!`).

Cuidado ao ler: **derrota também é registrada** (decisão do projeto), então `vitoria: false`
não é lixo — é uma tentativa que aconteceu.

### 1.2 `tempoSegundos` — tempo JOGANDO, não relógio de parede

Inteiro, em segundos, **medido pelo motor** (`Game._tempoJogando`) e por nenhum jogo. Um jogo
que mande `tempoSegundos` nos extras é sobrescrito: número medido em dois lugares é número em
que não se pode confiar.

O que ele NÃO conta:

- a **tela de pausa** (verificado: 2 s de pausa fazem o contador crescer 0,00 s);
- a **aba escondida**, de graça — o laço principal nem roda;
- o tempo de **outra tela** (menu, tutorial, resultado): a contagem zera ao entrar numa partida
  e um replay não herda o tempo da anterior.

O `dt` é o mesmo que alimenta a barra de tempo na tela, então **o número reportado bate com o
cronômetro que a criança viu**. Um relógio próprio aqui daria dois tempos para a mesma partida.

### 1.3 `ajuda` — quantas vezes a criança pediu socorro

Inteiro, **contado pelo motor** (`Game._ajudasPedidas`), somado pelo `HelpScreen` a cada
abertura. Zera ao entrar numa partida, então um replay não herda as ajudas da anterior.

**É contagem, não sim/não**, por decisão: `> 0` já responde "houve necessidade?", e três
aberturas na mesma partida são um sinal diferente de uma. O caminho contrário não existe — de um
booleano não se recupera a contagem depois.

`ajuda: 0` é resposta, não omissão: significa "não precisou". Por isso o campo está sempre
presente, mesmo valendo zero — ausente e zero significam coisas diferentes num relatório, e só
uma delas é o que aconteceu.

**O que ela indica, e o que não indica.** Muitas ajudas numa turma dizem que a instrução do
tutorial não está funcionando, ou que o nível começa difícil demais — é dado sobre a ATIVIDADE
antes de ser sobre a criança. Pedir ajuda não é falha: é o comportamento que a tela oferece, e
o tempo lendo a explicação **não** entra no `tempoSegundos` justamente para não punir quem
perguntou.

> **Por que estes campos podem existir sem o METODO listá-los.** A seção A2.1 do METODO
> lista os campos que o AVA lê para colunas próprias; a **A4** diz que o servidor grava a
> mensagem crua inteira em `payload`. Então campo extra fica registrado sem coluna — é o mesmo
> mecanismo que já carrega `blocosEmpilhados`, `caminhosFeitos` e `misturas`.
>
> A diferença entre eles: `vitoria`, `tempoSegundos` e `ajuda` valem para **todo** jogo do
> motor e vêm do motor; os outros são de um jogo só e vêm da cena, por `extras`.

---

## 2. Quem faz o quê

| Responsabilidade | Onde vive |
|---|---|
| Contar acertos e erros da partida | `ScoreSystem` (do motor), alimentado pela cena do jogo |
| Decidir o que É acerto e erro | **A cena de partida do jogo** — a camada semântica |
| Montar a mensagem no formato exato | `AvaBridge.montarMensagem()` |
| Disparar uma vez e re-armar | `Game._definirEstado()`, nas bordas de `RESULTADO` |
| Enviar o `postMessage` | `AvaBridge._enviar()` |
| Medir `tempoSegundos` | `Game._tempoJogando`, acumulado no laço principal — **nenhuma cena mexe nisso** |
| Contar `ajuda` | `Game.registrarAjuda()`, chamado pelo `HelpScreen` ao abrir — o jogo só põe o botão |
| Declarar `vitoria` | `ScoreSystem.paraAva(venceu)`, e a cena decide o que é vencer |

Um jogo faz **uma** chamada, e nada mais:

```js
this.irPara('resultado', {
  resultado: this.placar.paraAva(venceu),
});
```

---

## 3. O mapeamento semântico deste projeto

Os três jogos das aulas são de **habilidade contínua** — não têm "perguntas". A decisão
tomada (e registrada no plano) foi:

> `totalPerguntas` = a **meta** da partida · `acertos` = a **pontuação** · `erros` = as **falhas**

Assim `score_percent` calculado pelo servidor (`acertos ÷ totalPerguntas`) significa
"quão bem o aluno cumpriu a meta" — não apenas se cumpriu.

### `acertos` é a pontuação, não o acerto bruto

**Numa vitória, `acertos` desconta as falhas.** Vencer o Jogo dos Blocos exige encaixar os 5
blocos, então o acerto bruto de toda vitória é 5 — e enquanto `acertos` era o bruto, toda
vitória valia 100%, com duas quedas pelo caminho ou nenhuma. O relatório não distinguia a
partida limpa da atropelada, e a fileira de estrelas enchia sempre.

| Partida (meta 5, 3 vidas) | Bruto | Falhas | `acertos` enviado | `score_percent` |
|---|---|---|---|---|
| Vitória sem cair nenhum | 5 | 0 | **5** | 100% |
| Vitória com 1 queda | 5 | 1 | **4** | 80% |
| Vitória com 2 quedas | 5 | 2 | **3** | 60% |
| Derrota com 4 blocos de pé | 4 | 3 | **4** | 80% |
| Derrota com 2 blocos de pé | 2 | 3 | **2** | 40% |

**Na derrota não desconta**: o erro já cobrou o preço, que foi a partida acabar. Descontar de
novo zeraria o progresso de quem encaixou dois blocos, e [`DESIGN.md`](DESIGN.md) é explícito —
a derrota mostra o quanto o aluno avançou, não o quanto falhou.

Quem calcula é `ScoreSystem.pontuacao`, e é **o mesmo número que a tela de resultado mostra**:
mostrar um na tela e reportar outro é o defeito que aquela classe existe para impedir. O acerto
bruto não se perde — o Jogo dos Blocos o manda em `blocosEmpilhados`, nos campos extras.
Regra RE-02 de [`REGRAS-EDUCACIONAIS.md`](REGRAS-EDUCACIONAIS.md).

| Jogo | `totalPerguntas` | `acertos` | `erros` | `nivel` |
|---|---|---|---|---|
| **Jogo dos Blocos** | 5 (blocos da torre) | encaixados − derrubados (na vitória) | blocos derrubados | 1 = 1–5 · 2 = 6–10 · 3 = vogais |
| **Jogo das Formas** | 12 / 16 / 20 (meta de pontos) | pontos feitos | soltas inválidas | 1 = Conhecer · 2 = Combinar · 3 = Desafio |
| **Jogo das Cores** | 30 / 36 / 45 (meta de pontos) | pontos feitos | **sempre 0** — ver abaixo | 1 = Conhecer · 2 = Ampliar · 3 = Desafio |

> **O Jogo das Cores manda `erros: 0` sempre, e é afirmação e não omissão.** A checagem de cor
> acontece na SELEÇÃO: a criança não consegue montar um caminho inválido. Soltar com menos de
> três é tentativa cancelada — ela estava explorando o tabuleiro, que é o comportamento que a
> atividade quer. Ver `REGRAS-JOGO-DAS-CORES.md`, seção 7.

### Derrota também registra

Decisão do projeto: **sim**, com os números reais. Um aluno que travou em 2 de 5 é
exatamente quem o professor precisa enxergar no relatório. `registrarDerrota: true` no
`config.js` de cada jogo; mudar para `false` omite o registro de derrota.

### Campos extras

Qualquer campo a mais viaja na mensagem e o servidor guarda a mensagem crua inteira em
`payload` (METODO A4) — então dá para registrar contexto sem coluna nova:

```js
this.placar.paraAva(venceu, { conteudo: 'Números 1 a 5', blocosEmpilhados: 5 })
```

---

## 4. Checklist A5 — como o motor cumpre

| Item do METODO A5 | Como é garantido | Onde conferir |
|---|---|---|
| Um único ponto de fim de partida | Só a entrada em `RESULTADO` dispara | `Game._definirEstado()` |
| Sem disparo duplo | Guarda de borda: `_armado` vira `false` ao enviar | `AvaBridge.concluir()` |
| `type` exato | String literal, sem construção dinâmica | `AvaBridge.montarMensagem()` |
| Totais da partida inteira | `ScoreSystem` acumula do início ao fim | `ScoreSystem` |
| `totalPerguntas` real | Vem de `nivel.meta`, não de constante solta | `config.js` do jogo |
| `nivel` sempre presente | Padrão 1 quando ausente ou nulo | `AvaBridge.montarMensagem()` |
| `jogo` com slug estável | Vem de `config.slug` | `config.js` do jogo |
| Números como `number` | `AvaBridge.numero()` converte e valida | `AvaBridge` |
| `postMessage` para `window.parent`, `"*"`, protegido | Testado com iframe real | `AvaBridge._enviar()` |
| Nada de aluno / `lo_id` / XP | Nunca montado; há teste que falha se aparecer | `tools/testes.mjs` |
| `vitoria` booleano de verdade | `AvaBridge.booleano()` — trata `0/1` e o traiçoeiro `"false"` | `AvaBridge` |
| `tempoSegundos` inteiro e medido pelo motor | O motor vence campo de mesmo nome vindo do jogo | `AvaBridge.montarMensagem()` |
| `tempoSegundos` não conta pausa | Verificado em navegador: 2 s de pausa somam 0,00 s | `tools/teste-navegador.mjs` |
| `ajuda` conta as aberturas, e zero é resposta | Duas aberturas contam 2; o campo vai presente valendo 0 | `tools/testes.mjs` e `teste-navegador.mjs` |
| Ler a ajuda não conta como tempo de jogo | A ajuda pausa a partida; 1,5 s de leitura somam 0,00 s | `tools/teste-navegador.mjs` |

---

## 5. Como validar (e o que cada teste prova de verdade)

```bash
node tools/testes.mjs                        # lógica, sem navegador
node tools/serve.mjs 8099                    # servidor local
node tools/teste-navegador.mjs 8099          # ponta a ponta, com iframe real
```

| Ferramenta | Prova | **Não** prova |
|---|---|---|
| `testes.mjs` | Formato da mensagem, guarda de borda, replay, defaults honestos | Nada visual, nada de navegador |
| `teste-navegador.mjs` | Que a mensagem **cruza o iframe**, que o fluxo de telas funciona, que não há requisição externa | Se a mecânica é divertida ou justa para uma criança |
| `ava-teste.html` (manual) | O mesmo, com você jogando e vendo cada regra validada | — |
| **Jogar de verdade** | Se os números batem com o que o aluno fez | — |

### O roteiro manual que ninguém pode pular

1. Jogue uma partida **errando de propósito um número conhecido de vezes**.
2. Confira no console: `[AVA] JOGO_CONCLUIDO {...}` — `erros` tem de bater exatamente.
3. Jogue uma **segunda** partida sem recarregar: precisa sair uma segunda mensagem.
4. Fique parado na tela de resultado por meio minuto: **nenhuma** mensagem a mais.
5. Perca de propósito: precisa registrar, com os acertos parciais corretos.

Fora de um iframe, `window.parent === window` e a mensagem **corretamente não sai** — só o
`console.log` aparece. Isso não é falha; é o comportamento previsto no METODO B4.5. Para
ver a mensagem saindo, use `tools/ava-teste.html`.

---

## 6. Perguntas a fazer antes de instrumentar um jogo novo

Do METODO B9, adaptadas. Se não souber responder, **pergunte — não chute**:

- O que conta como **um acerto** aqui? E como **um erro**?
- Qual é a **meta** da partida? Ela muda por nível?
- Como se sabe que **terminou**? Existe derrota?
- Um "tentar de novo" recomeça a partida inteira ou só uma etapa?
- Se um campo não é observável, o default honesto é `erros: 0` e `totalPerguntas: null` —
  e isso vai **documentado**, nunca preenchido com palpite.
