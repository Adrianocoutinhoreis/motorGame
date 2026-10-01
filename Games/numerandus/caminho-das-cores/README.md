# Caminho das Cores

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `caminho-das-cores`
- **Faixa etária:** 6 a 7 anos (1º ano)
- **Criado em:** 2026-10-01

## O que é

Um jogo de **copiar um padrão**: uma cartela de referência mostra, numa coluna
por trilha, a sequência exata de peças geométricas (formato **e** cor, numa
ordem específica, de baixo pra cima) que aquela trilha precisa reproduzir. A
criança **arrasta** cada peça solta da bandeja até a trilha certa — a trilha só
aceita a peça da vez (a próxima da sequência); peça certa fora de ordem, ou
peça errada, treme e volta. Pratica comparação visual, reconhecimento de
forma+cor simultâneo e sequenciamento — não é classificação por cor.

## Como os dados do jogo foram definidos

Referência única: um vídeo de celular (`numerandus/1 ano/caminho_da_cores`,
141s, gravado na vertical) mostrando o brinquedo físico — uma prancha com
trilhas, uma bandeja de peças soltas e cartões de papel com colunas de peças
desenhadas. Não existe protótipo de código nem projeto Remotion para este
jogo. A leitura do vídeo, o layout e a mecânica foram discutidos e ajustados
num artefato de planejamento antes desta implementação começar, incluindo
correções feitas pelo humano depois de leituras erradas do vídeo:

1. **Não é "classificar por cor"** — a primeira leitura do vídeo (cartelas de
   uma cor só, trilhas virando colunas monocromáticas) estava errada. A regra
   de verdade é **copiar um padrão**: cada posição da cartela define formato
   **e** cor específicos, não só a cor da trilha.
2. **A ordem importa** — a trilha só aceita a **próxima** peça da sequência da
   coluna correspondente, de baixo pra cima (a peça "cai" pro espaço vazio
   mais baixo, igual à física do brinquedo). Soltar a peça certa fora de
   ordem é tratado como erro, igual a soltar a peça errada.
3. **Sem silhueta do que falta na trilha** — a primeira versão desenhava um
   contorno pontilhado com o formato esperado em cada posição vazia; o humano
   apontou que isso entrega a resposta de graça (basta casar o contorno, sem
   nunca olhar pra cartela). A trilha hoje não mostra pista nenhuma de formato
   ou cor. A primeira correção trocou isso por uma ripa central por trilha,
   mas o humano apontou que ela ficava desalinhada (a largura da trilha e a
   do vão entre trilhas são diferentes) e pediu o espaçamento **entre** as
   colunas — hoje as ripas são divisórias no vão entre uma trilha e a
   próxima (`Divisores`), igual às linhas entre colunas da cartela, nunca por
   cima de onde a peça se encaixa.
4. **Fácil não podia ter só 3 peças no total** — a primeira proposta de
   níveis (Fácil = 3 trilhas × 1 peça) deixava o tabuleiro visualmente vazio
   e nunca exercitava a sequência (com 1 peça por trilha não existe "ordem").
   Todos os níveis agora têm profundidade ≥ 2.
5. **A bandeja é uma faixa larga embaixo, não uma caixa estreita ao lado das
   trilhas** — a primeira versão tinha a bandeja só acima das trilhas (mesma
   largura delas, sem a cartela). O humano mandou um esboço de referência:
   cartela e trilhas dividem a fileira de cima lado a lado, e a bandeja de
   peças soltas corre a LARGURA INTEIRA da área, numa fileira só embaixo das
   duas — mais parecido com o brinquedo físico, e com mais espaço horizontal
   pra bandeja (menos fileiras de peças empilhadas verticalmente).

**Tema visual:** fundo liso (sem gradiente, sem decoração) — o conteúdo já é
visualmente carregado (várias cores/formatos ao mesmo tempo); o fundo não
deveria competir por atenção. Sem mascote — decisão do humano para este jogo.

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/caminho-das-cores/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (este jogo nunca tem derrota — ver seção 5 do
`CHECKLIST.md`), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "caminho-das-cores" }
```

`totalPerguntas` é o número de trilhas da rodada (`meta`: 3, 4 ou 5).
`acertos` conta cada TRILHA completada por inteiro — toda a sequência da
coluna reproduzida, não cada peça isolada. `erros` conta tentativas de
soltar uma peça errada (formato/cor não bate) OU fora de ordem (peça certa,
mas não é a vez dela) — cada uma só demora mais, nunca desconta acertos nem
estrelas (RE-02).

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
caminho-das-cores/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, 3 níveis, tutorial (com desenho auxiliar), contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     GameScene.js — cartela, trilhas, bandeja, arraste
├── assets/         só áudio (as peças são desenhadas por código, sem imagem)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

Assim como o Encaixe Certo/Quantidade Certa/Chave Mágica, as peças aqui **não
usam imagem** — círculo, quadrado, triângulo e pentágono são desenhados via
`Path2D`/arcos direto no canvas.

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `acertoSOS.wav` | Áudio, vitória | Mesmo arquivo já usado pelo Encaixe Certo/Quantidade Certa/coleção Numerandus |
| `soltar_peca.mp3` | Áudio, peça encaixada na trilha | Mesmo arquivo já usado pelo Encaixe Certo/Material Dourado/Quantidade Certa/Chave Mágica — origem/licença a confirmar, pendência compartilhada com os outros jogos que usam este arquivo |
| `error.MP3` | Áudio, peça errada ou fora de ordem | Mesmo arquivo do Quebra-Cabeça Geométrico/Jogo da Memória/Chave Mágica/Quantidade Certa — ainda não ouvido, ver `assets/audio-transcricao/somErro/transcricao.md` |

## Pendências conhecidas

- **`error.MP3` não foi ouvido aqui** — ficha "não verificada", mesma
  pendência já registrada nos outros jogos que usam este arquivo.
- **Sem narração do tutorial** — os 3 passos não têm `fala:` (nenhum áudio
  gravado ainda para este jogo).
- **Sem áudio de clique genérico** (`config.audio.clique` continua `null`) —
  mesma decisão já usada no Encaixe Certo/Jogo da Ordenação/Quantidade Certa.
- **Origem/licença de `soltar_peca.mp3` e `acertoSOS.wav`** — mesma pendência
  já registrada nos outros jogos que usam esses arquivos.
- **Testado com chamada direta aos métodos da cena, com toque sintético via
  `PointerEvent`/CDP e via `tools/ava-teste.html`** — nenhum evento de toque
  disparado por um dedo de verdade num tablet ainda.
- **Não testado em tablet real, nem em iframe pequeno/médio/grande** — mesma
  bateria de testes ainda pendente do resto da coleção.
- **Paleta de 6 cores × 4 formatos é uma proposta do planejamento**, revisada
  uma vez por feedback visual direto do humano — ainda não calibrada com
  crianças de verdade jogando (inclusive quanto a acessibilidade para
  daltonismo, pendência já registrada no Jogo das Cores).

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/caminho-das-cores
node tools/verificar-independencia.mjs numerandus/caminho-das-cores
```
