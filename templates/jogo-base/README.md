# {{TITULO}}

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `{{SLUG}}`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** {{DATA}}

## O que é

> Descreva em duas ou três frases o que a criança faz e o que ela aprende.

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/{{SLUG}}/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (vitória **ou** derrota), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "{{SLUG}}" }
```

O significado de cada campo neste jogo está na seção 5 do `CHECKLIST.md`.
O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
{{SLUG}}/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     as cenas próprias deste jogo
├── assets/         imagens e áudio (tudo local)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| | | |

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta — narração não gravada, arte
> provisória, mecânica a confirmar. É melhor uma entrega com pendência declarada
> do que uma que aparenta estar pronta.

- Nenhuma registrada.

## Atualizar o motor neste jogo

```
node tools/build.mjs {{SLUG}}
node tools/verificar-independencia.mjs {{SLUG}}
```
