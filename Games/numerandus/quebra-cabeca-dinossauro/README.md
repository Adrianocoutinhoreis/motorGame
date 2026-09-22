# Quebra-Cabeça Dino

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `quebra-cabeca-dinossauro`
- **Faixa etária:** 6 a 8 anos
- **Criado em:** 2026-09-22
- **Pasta:** `Games/numerandus/quebra-cabeca-dinossauro/` — dentro da coleção Numerandus.

## O que é

Um quebra-cabeça de sequência numérica com peças de verdade: as 26 peças do brinquedo físico
de referência (fotografadas e redesenhadas — ver "Assets") aparecem embaralhadas numa bandeja,
e a criança **arrasta** cada uma até o contorno pontilhado dela no tabuleiro. Só a peça da vez
encaixa — a peça 2 nunca vai antes da peça 1. Tentar uma peça fora de ordem, mesmo bem em cima
do lugar certo dela, só faz a peça voltar (com uma dica verde confirmando "é aqui, mas ainda não
é a vez") — nunca conta como erro que penaliza.

Baseado no vídeo de referência (`numerandus/finalizados/1ano/quebracabeca-dinossauro`) — sem
projeto-fonte Remotion (diferente do resto da coleção): a mecânica foi extraída analisando o
vídeo quadro a quadro (é a gravação de um brinquedo físico de madeira/EVA sendo montado). O
**mecanismo de arrastar, a regra de ordem e o layout dos dois cartões (tabuleiro + bandeja) foram
desenhados e aprovados num protótipo interativo** (`scratch/dino-drag-teste.html`, com as peças
reais) antes desta implementação começar.

**Três níveis, as MESMAS 26 peças em todos** — cortar peças por nível quebraria o desenho do
dinossauro pela metade, então a dificuldade cresce em dois eixos que não mudam o conteúdo:

| Nível | Bandeja | Precisão pra soltar | O que treina |
|---|---|---|---|
| Fácil | Quase em ordem (embaralhamento 25%) | Generosa (1,2×) | Achar a peça 1, 2, 3… com pouco esforço de busca |
| Médio | Bem misturada (65%) | Padrão (1×) | Buscar a peça certa numa bandeja mais cheia |
| Difícil | Totalmente misturada (100%) | Mais apertada (0,85×) | Busca + mira, como o brinquedo físico de verdade |

Ver `GameScene._embaralharParcial`/`_raioTolerancia` e `config.niveis`.

**É um quebra-cabeça solo — nunca há derrota.** Sem cronômetro regressivo: o relógio da tela de
resultado é só informativo. A meta de cada nível é sempre as 26 peças (`nivel.meta = 26`); a
diferença dos níveis está em quão fácil é ACHAR e MIRAR a peça certa, não em quantas faltam.

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/quebra-cabeca-dinossauro/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao encaixar as 26 peças (sempre vitória — não existe derrota neste jogo), a cena emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 26,             // peças encaixadas certas — SEMPRE cheio, igual à meta
  erros: 2,                // tentativas fora de ordem (posição certa, vez errada), só demonstrativo
  totalPerguntas: 26,      // peças do quebra-cabeça
  nivel: 2,
  jogo: "quebra-cabeca-dinossauro",
  vitoria: true,
  tempoSegundos: 143,
  ajuda: 0
}
```

`erros` conta cada vez que a criança solta uma peça no lugar geométrico certo mas fora da ordem —
**Decisão explícita, mesmo padrão do Encaixe Certo/Material Dourado/Jogo da Memória:** `erros` é
só demonstrativo, sem desconto na nota. `GameScene` nunca chama `placar.errar()` (que acionaria o
desconto de RE-02) — a contagem vive num contador próprio da cena (`_tentativasErradas`) e só é
escrita no campo `erros` da mensagem final, por fora do `ScoreSystem`.

A tela final mostra "N PEÇAS" via `config.unidadePlacar: { singular: 'peça', plural: 'peças' }`.

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
quebra-cabeca-dinossauro/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial, assets, contrato
│   ├── main.js     ponto de entrada
│   └── scenes/
│       └── GameScene.js   arrastar/soltar, ímã de encaixe, regra de ordem
├── assets/img/     base pontilhada + as 26 peças (áudio ainda não gravado)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `assets/img/dinossauro-base-pontilhada.png` | Tabuleiro: contorno pontilhado das 26 peças, fundo transparente | Gerado a partir de uma foto do brinquedo físico de referência (fornecida pelo humano), processada nesta sessão. Cópia de `fontes/dinossauro/dinosauro-base-pontilhada.png`. |
| `assets/img/pecas/peca-01.png` … `peca-26.png` | As 26 peças, recortadas e redesenhadas (cor sólida, contorno, número grande), fundo transparente | Mesma origem — fotografia do brinquedo físico redesenhada nesta sessão. Cópia de `fontes/dinossauro/pecas-redesenhadas/peca-NN.png`. As posições/tamanhos (`GameScene.LAYOUT_PECAS`) vêm de `fontes/dinossauro/pecas-redesenhadas/layout.json`, medido na mesma foto. |
| `assets/img/encaixe-01.png` | Contorno pontilhado só da peça 1 (recorte individual, não o tabuleiro inteiro) | Cópia de `fontes/dinossauro/encaixes-pontilhados/encaixe-01.png`. Usada só no tutorial (passo 2), pra mostrar o alvo real de arrastar, não um retângulo tracejado genérico. |
| `assets/img/dinossauro-completo.png` | O dinossauro inteiro, já montado e colorido (as 26 peças redesenhadas juntas) | Cópia de `fontes/dinossauro/dinosauro-redesenhado.png`. Usada só no tutorial (passo 3), como prévia da recompensa — não é usada durante a partida (lá o dinossauro "se monta" peça por peça, nunca aparece pronto de uma vez por baixo). |
| `assets/audio/acertoSOS.wav` | Efeito de vitória (tela de resultado), 4,55s, sem fala | **Cópia** do mesmo `acertoSOS.wav` já usado em toda a coleção Numerandus (Bingo, Jogo da Velha, Jogo da Ordenação, Encaixe Certo, Jogo da Memória, Material Dourado) — mesmo SHA-256, conferido. Sem fala, serve a qualquer jogo; ficha em `assets/audio-transcricao/acertoSOS/transcricao.md`. |
| `assets/audio/soltar_peca.mp3` | Efeito de encaixe (peça assentando no lugar certo, na ordem certa), 0,72s, sem fala | **Cópia** do mesmo arquivo usado como `clique` no Material Dourado (pedido do humano) e como `soltarPeca` no Jogo da Ordenação/Encaixe Certo — mesmo SHA-256, conferido. **Origem/licença ainda a confirmar** — mesma pendência já registrada nesses outros dois jogos (é o mesmo arquivo nos quatro). Ficha em `assets/audio-transcricao/soltarPeca/transcricao.md`. |

O tutorial (`config.tutorial`) usa as peças/telas REAIS acima, não formas genéricas — `desenho`
recebe o `loader` já carregado como 5º parâmetro (`engine/screens/TutorialScreen.js`).

Resto do áudio ainda falta: ver "Pendências conhecidas" abaixo. `fontes/dinossauro/` guarda o
material original em alta (peças em 3 variantes, prévias, sprite sheet) — não publicado, fora do
pacote deste jogo.

**`peca-13.png` foi editada nesta sessão** (script Python/Pillow, apagando e redesenhando só o
número — contorno da peça intacto): o "13" original ficava colado no entalhe superior direito,
bem em cima da área onde a peça 14 se conecta. Reposicionado pro centro-inferior da peça, longe de
qualquer entalhe. Cópia atualizada em `fontes/dinossauro/pecas-redesenhadas/peca-13.png` também.

**Ordem de empilhamento das peças no tabuleiro: a mais nova sempre por CIMA da anterior**
(14 sobre 13, 15 sobre 14, …) — é a ordem natural de `_pegarPeca`/`paraFrente` (a última peça
arrastada já nasce na frente de `this.area`, e nada a reparenta depois), a mesma do brinquedo
físico. Uma versão anterior desta cena invertia isso (peça nova sempre atrás) pra evitar que a
aba da 14 tampasse o "13" — hoje isso não é mais necessário, porque o número foi movido pra longe
de qualquer aba/entalhe (parágrafo acima); a ordem voltou a ser a natural.

**`peca-25.png` foi editada nesta sessão** (mesma técnica) — o "25" original media só ~30px de
altura numa peça de 303×151 (a mais larga e achatada do conjunto), lendo pequeno demais perto das
vizinhas. Aumentado pra ~43px, ainda centralizado na área aberta da peça, longe de aba/entalhe.
Cópia atualizada em `fontes/dinossauro/pecas-redesenhadas/peca-25.png` também.

**Área de toque mínima garantida mesmo pra peças pequenas na bandeja** — a grade da bandeja
encolhe cada peça pra caber a própria célula, e peças largas/achatadas (25: 303×151, 10: 225×128,
16 e 22) chegavam a ficar com menos de 64px de altura desenhada — abaixo do mínimo de
`docs/DESIGN.md`, achado numa revisão de código. `_criarAreaTocavelAcessivel` (`GameScene.js`)
garante que a área que RESPONDE ao toque nunca fica menor que 64×64px, centrada no desenho, mesmo
quando o desenho em si é menor — o visual não muda, só fica mais fácil de acertar com o dedo.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta.

- **Vitória e encaixe já têm som; clique, erro e narração do tutorial ainda não** —
  `config.audio.vitoria` (`acertoSOS.wav`) e `config.audio.acerto` (`soltar_peca.mp3`) já apontam
  pros arquivos tradicionais da coleção. `clique`, `erro` e a narração do tutorial continuam
  `null`. O motor abre e joga normalmente em silêncio nesses casos (regra do motor: som só de
  arquivo gravado, nunca sintetizado), mas falta produzir/gravar o resto antes de publicar para
  alunos.
- **Origem/licença de `soltar_peca.mp3` ainda a confirmar** — mesma pendência já registrada no
  Jogo da Ordenação e no Encaixe Certo (é o mesmo arquivo nos quatro jogos): fornecido pronto,
  sem procedência documentada. Confirmar antes de publicar para alunos.
- **Segundo toque simultâneo pode soltar a peça sendo arrastada antes da hora** — o `Input.js` do
  motor (`engine/core/Input.js`) só acompanha UM ponteiro de cada vez (um `pressionado`/
  `noPressionado` só, não por `pointerId`). Se a criança já estiver arrastando uma peça com um
  dedo e um SEGUNDO toque (outro dedo, a palma da mão encostando) descer e subir em qualquer
  lugar do canvas, o evento global `soltar` do motor finaliza a peça que ainda está sendo
  arrastada pelo primeiro dedo — ela assenta ou volta pra bandeja no meio do gesto, sem a criança
  ter soltado de verdade. Isso não é específico deste jogo: o Encaixe Certo tem exatamente o
  mesmo padrão de código e o mesmo risco. Corrigir de verdade significa o `Input.js` do motor
  rastrear `pointerId`, o que afeta todos os jogos com arrasto — fora do escopo de uma correção
  só neste jogo.
- **Testado só em navegador headless**, chamando os métodos de arrasto da cena diretamente
  (`_pegarPeca`/`_moverArrasto`/`_soltarArrasto`, mesma técnica usada no Material Dourado) —
  ainda não testado com toque de verdade em tablet, nem em iframe pequeno/médio/grande, nem o
  fluxo de replay/duplicata de mensagem no `tools/ava-teste.html`.
- **Tutorial (`config.tutorial`) ainda não visto rodando** — os 3 passos existem e usam desenho
  vetorial simples (sem depender de nenhum asset), mas só a tela de Menu, a Partida e o Resultado
  foram de fato capturados em navegador nesta sessão.
- **Sem placa de título customizada** — o tema usa a placa neutra padrão (`PlacaTituloLimpa`,
  compartilhada com o Jogo da Ordenação) porque o título original ("QUEBRA-CABEÇA DINOSSAURO")
  estourava a largura fixa da placa; o título foi encurtado para "QUEBRA-CABEÇA DINO" em vez de
  mexer no componente compartilhado (usado por outros jogos).
- **`fontes/dinossauro/` tem variantes não usadas** (`pecas-extraidas/`, `pecas-flat/`,
  `originais/`, `sprite-sheet.png`, prévias) — mantidas como material de referência/histórico da
  decisão de usar a versão "redesenhada", não fazem parte do pacote deste jogo.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/quebra-cabeca-dinossauro
node tools/verificar-independencia.mjs numerandus/quebra-cabeca-dinossauro
```
