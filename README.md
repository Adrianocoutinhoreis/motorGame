# Motor Educandus

Motor de jogos educacionais em **HTML + CSS + JavaScript puro**, e a refação das aulas
antigas em jogos modernos, autossuficientes e integrados ao AVA.

- **Zero dependência externa** — sem framework, sem CDN, sem etapa de build.
- **Cada jogo é publicável sozinho** — a pasta do jogo vai para o AVA sem depender de nada
  da raiz. Isso é verificado por script, não por disciplina.
- **Todo jogo registra a partida no AVA** conforme `Aulas para Refazer/MD/METODO.md`.
- **Público:** Educação Infantil / 1º ano (4 a 7 anos) — alvos grandes, nada exige leitura,
  tudo narrado.

---

## Começo rápido

```bash
node tools/serve.mjs                       # servidor local (obrigatório: file:// não funciona)
# http://localhost:8080/Games/jogo-dos-blocos/
# http://localhost:8080/tools/ava-teste.html   ← simula o AVA, com iframe de verdade
```

Criar um jogo novo:

```bash
node tools/new-game.mjs meu-jogo "Meu Jogo"
```

O jogo gerado **já funciona de ponta a ponta** — menu, tutorial, níveis, partida, resultado
e o registro no AVA — antes de você escrever uma linha. Ver [`docs/CRIAR-JOGO.md`](docs/CRIAR-JOGO.md).

---

## Estrutura

```
motorGame/
├── engine/          o motor — FONTE DA VERDADE, edite só aqui
├── templates/       esqueleto de jogo novo
├── tools/           build, servidor, gerador, testes, host de teste do AVA
├── docs/            a documentação (comece por MOTOR.md)
├── fontes/          arte original em alta — NÃO publicada, fora dos pacotes
├── Games/           os jogos — cada pasta é uma entrega independente
└── Aulas para Refazer/   os originais de 2013, para consulta
```

---

## Documentação

| Documento | Para quê |
|---|---|
| [`docs/MOTOR.md`](docs/MOTOR.md) | Arquitetura, princípios e limites do motor |
| [`docs/CRIAR-JOGO.md`](docs/CRIAR-JOGO.md) | Passo a passo de um jogo novo |
| [`docs/COMPONENTES.md`](docs/COMPONENTES.md) | Catálogo com API, exemplo e origem de cada componente |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design system: cor, tipo, espaço, movimento, acessibilidade |
| [`docs/REGRAS-EDUCACIONAIS.md`](docs/REGRAS-EDUCACIONAIS.md) | Decisões pedagógicas que todo jogo segue (registro aberto) |
| [`docs/STATES.md`](docs/STATES.md) | Máquina de estados + maturidade do motor |
| [`docs/CONTRATO-AVA.md`](docs/CONTRATO-AVA.md) | O METODO.md aplicado a este motor |
| [`docs/CHECKLIST-JOGO.md`](docs/CHECKLIST-JOGO.md) | O modelo de checklist que cada jogo recebe |
| [`docs/CHECKLIST-AULAS.md`](docs/CHECKLIST-AULAS.md) | Inventário e status das aulas a refazer |

Especificação por jogo (mecânica e layout, com o porquê de cada número):

| Documento | Jogo |
|---|---|
| [`docs/REGRAS-JOGO-DAS-FORMAS.md`](docs/REGRAS-JOGO-DAS-FORMAS.md) | Jogo das Formas — mecânica, níveis, pontuação, contrato |
| [`docs/PLANO-VISUAL-JOGO-DAS-FORMAS.md`](docs/PLANO-VISUAL-JOGO-DAS-FORMAS.md) | Jogo das Formas — layout, tamanhos, movimento |

---

## Jogos

| Jogo | Aula | Status |
|---|---|---|
| [Jogo dos Blocos](Games/jogo-dos-blocos/) | `870294` | ✅ refeito (piloto) |
| [Jogo das Formas](Games/jogo-das-formas/) | `870298` | 🚧 jogável, [pendências declaradas](Games/jogo-das-formas/README.md#pendências-conhecidas) |
| Jogo das Cores | `870296` | 📋 planejado |

---

## Ferramentas

| Comando | O que faz |
|---|---|
| `node tools/serve.mjs [porta]` | Servidor estático local. Imprime o endereço de cada jogo e serve `/__jogos.json`, que alimenta as abas do host do AVA. **Depois de editá-lo, reinicie** — Node não recarrega o próprio código |
| `node tools/new-game.mjs <slug> "Nome"` | Cria um jogo a partir do template |
| `node tools/build.mjs [slug]` | Copia o motor para dentro dos jogos |
| `node tools/verificar-independencia.mjs [slug]` | **Portão de entrega**: falha se o jogo depender de algo externo ou se a cópia do motor estiver desatualizada |
| `node tools/audio-info.mjs [slug]` | Inventário de áudio medido: formato, duração, hash, lote, e reprova ficha ausente ou desatualizada |
| `node tools/testes.mjs` | Testes de lógica, sem navegador — a suíte imprime o total ao terminar |
| `node tools/teste-navegador.mjs [porta]` | Verificações ponta a ponta em navegador headless (piloto) |
| `node tools/teste-jogabilidade-formas.mjs [porta]` | A jogada do Jogo das Formas com **toque real** — pegar, arrastar, depositar, e a pausa não virar jogada |
| `node tools/teste-entrega-avulsa.mjs <slug>` | Copia o jogo para fora do projeto, serve de uma subpasta e abre — simula a publicação |
| `tools/ava-teste.html` | Host que simula o AVA e valida o contrato ao vivo. Traz uma **aba por jogo**, descoberta em tempo de execução (por `/__jogos.json` no `serve.mjs`, ou pela listagem de `Games/` em qualquer estático — Live Server da IDE incluída). Jogo novo aparece sozinho |

---

## O fluxo de trabalho

```
editar engine/  →  node tools/testes.mjs
                →  node tools/build.mjs
                →  node tools/serve.mjs 8099   (em outro terminal)
                →  node tools/teste-navegador.mjs 8099
                →  node tools/verificar-independencia.mjs
                →  node tools/teste-entrega-avulsa.mjs <slug>
                →  jogar de verdade (seção 7.2 do CHECKLIST do jogo)
```

Os dois últimos passos são os que importam: o penúltimo reproduz a publicação (a pasta
sozinha, servida de uma subpasta qualquer, fora do projeto), e o último é o que **nenhum
script substitui** — conferir, jogando, que os números do console batem com o que o aluno fez.

> **Nunca edite `Games/<jogo>/engine/`** — é uma cópia gerada e a próxima build a apaga.
> O motor se edita em `engine/`, na raiz.
