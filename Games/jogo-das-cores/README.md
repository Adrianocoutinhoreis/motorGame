# Jogo das Cores

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `jogo-das-cores`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-08-28

## O que é

A criança **desenha um caminho** com o dedo por peças coloridas vizinhas **da mesma cor** — três
ou mais — e ao soltar elas desaparecem, o nome da cor é narrado e peças novas caem de cima.
Treina **discriminar cores e nomeá-las**: para o caminho crescer, é preciso comparar cada peça
vizinha com a cor que se está seguindo.

Refação da aula **870296** de 2013. Especificação completa em
[`docs/REGRAS-JOGO-DAS-CORES.md`](../../docs/REGRAS-JOGO-DAS-CORES.md) e
[`docs/PLANO-VISUAL-JOGO-DAS-CORES.md`](../../docs/PLANO-VISUAL-JOGO-DAS-CORES.md).

> **Estado: joga, sem voz.** A partida está completa — os dois gestos, o caminho,
> a pontuação, o fim de partida e o registro no AVA. O que falta é a **narração**
> (as 16 gravações de 2013 não foram trazidas) e a **identidade visual própria**:
> por decisão do humano, o visual é emprestado do Jogo das Formas por enquanto,
> e a troca é um campo só (`config.tema`). Ver as pendências no fim.

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/jogo-das-cores/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (vitória **ou** derrota), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "jogo-das-cores" }
```

O significado de cada campo neste jogo está na seção 5 do `CHECKLIST.md`.
O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
jogo-das-cores/
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
| `img/cor-vermelho.svg` | SVG, 2,4 KB | **novo**, feito para este jogo. Educandus |
| `img/cor-laranja.svg` | SVG, 2,1 KB | **novo**. Educandus |
| `img/cor-amarelo.svg` | SVG, 2,1 KB | **novo**. Educandus |
| `img/cor-verde.svg` | SVG, 1,9 KB | **novo**. Educandus |
| `img/cor-azul.svg` | SVG, 2,3 KB | **novo**. Educandus |
| `img/cor-roxo.svg` | SVG, 2,2 KB | **novo**. Educandus |
| `img/cor-rosa.svg` | SVG, 2,2 KB | **novo**. Educandus |
| `img/cor-marrom.svg` | SVG, 2,1 KB | **novo**. Educandus |

**A arte é obrigatoriamente nova**, e este jogo é o único dos três em que isso vale: as peças
coloridas de 2013 não eram arquivo, eram vetor exportado dentro de `JogoCores_visual.js`, com
344 KB. Os oito SVG somam **17 KB**.

### Cada peça tem uma TEXTURA, e ela não é enfeite

Xadrez no vermelho, bolinhas no azul, ondas no roxo, e assim por diante — a textura é
**redundante** com a cor: quem vê cor joga pela cor e não repara nela; quem não vê joga pela
textura.

Num jogo cujo conteúdo É a cor, cor sozinha exclui cerca de 1 em 12 meninos. E a paleta não
ajuda: medida em luminância (0–255), sete das oito cores caem numa faixa de 38 unidades, e
**vermelho, azul e roxo ficam a 5 unidades um do outro** — em escala de cinza são o mesmo cinza.
Vermelho e azul estão os **dois no nível 1**, separados por 3. Sem textura, o nível mais fácil
já é impossível para essa criança.

**Se estes arquivos forem redesenhados, a textura tem de sobreviver**, e o teste é uma captura
do tabuleiro em escala de cinza: ela tem de continuar jogável. O comentário dentro de cada SVG
diz qual textura ele carrega e por quê.

### O que NÃO está dentro dos SVG, de propósito

- a **sombra**, desenhada pelo canvas por fora da peça (não caberia no `viewBox`);
- o **aro de seleção** do caminho, que é estado e não arte.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta — narração não gravada, arte
> provisória, mecânica a confirmar. É melhor uma entrega com pendência declarada
> do que uma que aparenta estar pronta.

1. **Nenhum som.** As 16 gravações da aula original — os oito nomes de cor, a instrução, os
   dois de nível e o feedback — continuam em `Aulas para Refazer/Jogo das Cores/`, e nenhuma
   ficha de transcrição foi criada. **É a pendência mais séria**: nomear a cor no instante em
   que ela é conquistada é o que transforma discriminação visual em vocabulário, ou seja, é o
   conteúdo pedagógico da aula. Até então o motor fica em silêncio e diz no console o que a voz
   deveria falar.
   É preciso gravar uma frase que a aula de 2013 não tem: **"Misturei as cores!"** (ver 6).
2. **O visual é emprestado do Jogo das Formas**, por decisão do humano, até este jogo ganhar
   identidade própria. A troca é um campo só: `config.tema`.
3. **Os áudios de nível dizem "fácil" e "difícil"**, e este jogo tem três níveis com nomes
   diferentes (Conhecer, Ampliar, Desafio). Os dois arquivos não servem sem regravar; até lá os
   cartões ficam sem locução, e o motor avisa a lacuna no console.
4. **A espera do toque sequencial** não tem valor definido: quanto tempo depois do último toque
   o caminho se fecha. Só se mede jogando com criança — cedo demais corta caminhos longos,
   tarde demais o jogo parece travado.
5. **A textura a 34 px** (amostra do painel lateral) é o limite conferido: ali o xadrez do
   vermelho e a grade do marrom são o par que mais se aproxima. A amostra vem com o nome
   escrito ao lado, o que atenua. Abaixo disso não foi conferido.
6. **Quantas cores no nível 3.** Com 8 cores o tabuleiro trava e precisa ser misturado 1,23
   vezes por partida; com 7 seriam 0,57. O jogo trata o travamento (mistura anunciada, com o
   cronômetro parado — ver REGRAS, seção 10-A), então isto não é defeito: é a pergunta
   pedagógica de quanta interrupção vale conhecer a oitava cor. Cada partida reporta
   `extras.misturas` ao AVA para a decisão sair de dados de turma, não de simulação.

## Atualizar o motor neste jogo

```
node tools/build.mjs jogo-das-cores
node tools/verificar-independencia.mjs jogo-das-cores
```
