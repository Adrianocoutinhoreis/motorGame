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
  jogo: "jogo-dos-blocos"
}, "*");
```

O jogo **não** envia — nem calcula — aluno, `lo_id`, `activity_id`, turma, XP ou nota.
Isso é do AVA e do servidor (METODO A3/A4).

---

## 2. Quem faz o quê

| Responsabilidade | Onde vive |
|---|---|
| Contar acertos e erros da partida | `ScoreSystem` (do motor), alimentado pela cena do jogo |
| Decidir o que É acerto e erro | **A cena de partida do jogo** — a camada semântica |
| Montar a mensagem no formato exato | `AvaBridge.montarMensagem()` |
| Disparar uma vez e re-armar | `Game._definirEstado()`, nas bordas de `RESULTADO` |
| Enviar o `postMessage` | `AvaBridge._enviar()` |

Um jogo faz **uma** chamada, e nada mais:

```js
this.irPara('resultado', {
  estrelas: this.placar.estrelas,
  resultado: this.placar.paraAva(venceu),
});
```

---

## 3. O mapeamento semântico deste projeto

Os três jogos das aulas são de **habilidade contínua** — não têm "perguntas". A decisão
tomada (e registrada no plano) foi:

> `totalPerguntas` = a **meta** da partida · `acertos` = o **progresso** · `erros` = as **falhas**

Assim `score_percent` calculado pelo servidor (`acertos ÷ totalPerguntas`) significa
"quanto da meta o aluno cumpriu" — uma leitura honesta, e não um número inventado.

| Jogo | `totalPerguntas` | `acertos` | `erros` | `nivel` |
|---|---|---|---|---|
| **Jogo dos Blocos** | 5 (blocos da torre) | blocos encaixados | blocos derrubados | 1 = 1–5 · 2 = 6–10 · 3 = vogais |
| **Jogo das Formas** *(planejado)* | 20 (meta de pontos) | pontos feitos | soltas inválidas | 1 (nível único) |
| **Jogo das Cores** *(planejado)* | 30 (fácil) / 45 (difícil) | pontos feitos | tentativas de combo com menos de 3 | 1 = fácil · 2 = difícil |

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

---

## 5. Como validar (e o que cada teste prova de verdade)

```bash
node tools/testes.mjs                        # 47 testes de lógica, sem navegador
node tools/serve.mjs 8099                    # servidor local
node tools/teste-navegador.mjs 8099          # 32 verificações ponta a ponta, com iframe real
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
