# Jogo das Formas

Refação da aula **870298** com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `jogo-das-formas`
- **Aula original:** `870298` (`JogoFormas.js`, CreateJS/Flash, 2013)
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-08-24

Especificação completa, com o porquê de cada número:

- [`docs/REGRAS-JOGO-DAS-FORMAS.md`](../../docs/REGRAS-JOGO-DAS-FORMAS.md) — mecânica, níveis, pontuação, contrato
- [`docs/PLANO-VISUAL-JOGO-DAS-FORMAS.md`](../../docs/PLANO-VISUAL-JOGO-DAS-FORMAS.md) — layout, tamanhos, movimento

## O que é

Uma pilha de blocos com formas geométricas sobe do chão. A criança usa uma garra para
transportar blocos entre colunas; **três ou mais blocos da mesma forma que se toquem
desaparecem**, e a forma é narrada em voz alta. A cada poucos segundos nasce uma linha nova
por baixo e empurra tudo para cima.

Ganha quem atinge a meta de pontos antes de o tempo acabar. Perde quem deixa a pilha bater
no teto.

O que a criança treina: reconhecer formas planas pelo contorno, agrupar por categoria, e
planejar uma sequência de movimentos sob pressão de tempo.

## Níveis

O original não tinha níveis — entregava o jogo inteiro de uma vez. Aqui são três degraus, e
o **Nível 3 é o jogo de 2013, número por número**.

| | Formas | Grade | Linha nova | Meta | Tempo |
|---|---|---|---|---|---|
| 1 — Conhecer | 3 | 5×7 | 20 s | 12 pontos | 120 s |
| 2 — Combinar | 4 | 6×7 | 18 s | 16 pontos | 120 s |
| 3 — Desafio | 4 | 6×7 | **15 s** | **20 pontos** | **120 s** |

Não é fácil/médio/difícil: é o mesmo jogo com mais espaço para pensar.

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/jogo-das-formas/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (vitória **ou** derrota), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "jogo-das-formas" }
```

Neste jogo:

| Campo | Significado |
|---|---|
| `totalPerguntas` | a **meta** do nível: 12, 16 ou 20 pontos |
| `acertos` | a **pontuação**: pontos feitos, menos os erros numa vitória (regra RE-02) |
| `erros` | quantos **ciclos de linha nova se fecharam sem nenhum combo** |
| `nivel` | 1, 2 ou 3 |

**Por que `erros` é isso.** Mover blocos sem formar combo não é erro — é planejamento, e punir
isso ensinaria a criança a não pensar. A falha do jogo é deixar a pilha crescer: cada janela
de 15 a 20 s que passa sem que um único bloco desapareça é uma janela em que a pilha subiu e
nada foi resolvido. Sem essa contagem, `erros` seria sempre 0 e toda vitória valeria 100% —
o defeito que a RE-02 existe para corrigir. Detalhes na seção 7 do documento de regras.

Os pontos **brutos** e a contagem de ciclos viajam nos campos extras (`pontosBrutos`,
`ciclosSemCombo`), para o professor que quiser ver.

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
jogo-das-formas/
├── index.html            página do jogo
├── engine/               CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js         identidade, níveis, formas, tutorial, assets
│   ├── main.js           ponto de entrada
│   └── scenes/
│       └── GameScene.js  a partida: garra, cascata, linha nova
├── assets/
│   ├── img/              os quatro azulejos (andaime de 2013)
│   ├── audio/            narração das formas, música e efeitos
│   └── audio-transcricao/  uma ficha por áudio, com hash
├── CHECKLIST.md          passos para o jogo ser considerado concluído
├── CHECKLIST-AUDIO.md    o áudio, que aqui É o conteúdo pedagógico
└── README.md             este arquivo
```

## Assets

Todos vêm da aula original 870298 — Educandus. Nenhum arquivo novo foi produzido ainda.

| Arquivo | Tipo | Origem | Observação |
|---|---|---|---|
| `img/bloco-circulo.png` | imagem 50×50 | 870298 `BlocoCirculo.png` | **andaime** — ver abaixo |
| `img/bloco-quadrado.png` | imagem 50×50 | 870298 `blocoQuadrado.png` | **andaime** |
| `img/bloco-triangulo.png` | imagem 50×50 | 870298 `blocoTriangulo.png` | **andaime** |
| `img/bloco-retangulo.png` | imagem 50×50 | 870298 `BlocoRetangulo.png` | **andaime** |
| `audio/circulo.mp3` | narração | 870298 | transcrição inferida, não ouvida |
| `audio/quadrado.mp3` | narração | 870298 | transcrição inferida, não ouvida |
| `audio/triangulo.mp3` | narração | 870298 | transcrição inferida, não ouvida |
| `audio/retangulo.mp3` | narração | 870298 | transcrição inferida, não ouvida |
| `audio/somFundo.mp3` | música | 870298 | sem fala |
| `audio/acertoSOS.wav` | efeito | 870298 | fim de partida, vitória |
| `audio/erroSOS.wav` | efeito | 870298 | fim de partida, derrota |
| `audio/nao.wav` | efeito | 870298 | ciclo sem combo — **confirmar ouvindo** |

Os nomes das imagens foram passados para kebab-case. Os do original misturavam maiúscula e
minúscula de forma inconsistente (`BlocoCirculo` × `blocoQuadrado`), o que é armadilha em
servidor sensível a caixa — e o AVA roda em Linux.

## Pendências conhecidas

Declaradas de propósito: melhor uma entrega com pendência escrita do que uma que aparenta
estar pronta.

1. **A arte dos blocos é andaime.** Os quatro PNG são os de 2013, com 50×50 px, sombra e
   degradê assados no arquivo e cores fora dos tokens. Num notebook retina a ampliação chega
   a **3,00×**. A troca pela peça vetorial está especificada na seção 3.1 do plano visual, e a
   costura para trocá-la é um método só: `Bloco.desenhar()` em `src/scenes/GameScene.js`.
   Enquanto isso não acontecer, **conferir num notebook retina antes de publicar**.
2. **Nenhuma transcrição de áudio foi confirmada ouvindo.** As oito fichas estão preenchidas
   por inferência. Ver `CHECKLIST-AUDIO.md`.
3. **`nao.wav` pode ser a palavra "não".** Se for, dizer "não" a uma criança que só deixou um
   ciclo passar é retorno errado para a semântica deste jogo — o certo seria um efeito neutro.
   Decidir ouvindo.
4. **Quatro locuções não existem** e ficam em silêncio, com o console nomeando cada uma:
   `abertura`, `tutorial_pegar`, `tutorial_combo`, `tutorial_pilha`.
5. **O losango ficou fora.** Não existe `losango.mp3`, e o `Blocolosango.png` do original é o
   retângulo repintado — visualmente indistinguível dele. Para entrar como quinta forma
   faltam as duas coisas, locução e peça.
6. **As telas padrão não têm cobertura própria aqui.** O `tools/teste-navegador.mjs` percorre
   menu, tutorial, níveis, pausa e resultado — mas está amarrado ao slug do piloto. Deste jogo,
   o que tem teste automático é a **jogada** (`tools/teste-jogabilidade-formas.mjs`, 17
   verificações com toque real) e a **entrega avulsa**. O passeio pelas telas ainda é manual.

## Atualizar o motor neste jogo

```
node tools/build.mjs jogo-das-formas
node tools/verificar-independencia.mjs jogo-das-formas
node tools/audio-info.mjs jogo-das-formas
```
