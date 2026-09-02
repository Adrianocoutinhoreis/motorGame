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

> **Estado: joga, com os nomes das cores narrados.** A partida está completa — os dois
> gestos, o caminho, a pontuação, o fim de partida e o registro no AVA — e agora nomeia a cor
> em voz alta ao fechar um caminho. O que falta é o RESTO da narração (instrução, níveis,
> vitória/derrota) e a **identidade visual própria**: por decisão do humano, o visual é
> emprestado do Jogo das Formas por enquanto, e a troca é um campo só (`config.tema`). Ver as
> pendências no fim.

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
{
  type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel,
  jogo: "jogo-das-cores",
  vitoria, tempoSegundos, ajuda,
  caminhosFeitos, misturas          // extras deste jogo
}
```

> `vitoria`, `tempoSegundos` e `ajuda` vêm do MOTOR, não desta cena: atingiu a meta, tempo
> JOGANDO (pausa e ajuda não contam) e quantas vezes a criança abriu a explicação. Ver
> `docs/CONTRATO-AVA.md`, seções 1.1 a 1.3.

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
├── assets/         áudio (tudo local) — a peça não tem imagem, é desenhada
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `audio/vermelho.mp3` … `audio/marrom.mp3` | MP3, ~30 KB cada | **narração nova**, entregue em 02/09/2026 — não são os arquivos da aula 870296 de 2013 (formato e tamanho diferentes). Nenhuma transcrição foi confirmada ouvindo — ver `assets/audio-transcricao/<cor>/transcricao.md` |
| `audio/somFundo.mp3` | MP3, 228 KB | Aula original 870296 — Educandus. É o mesmo arquivo dos outros dois jogos |

**A peça não tem arquivo.** É desenhada em `Peca.desenhar()` (`src/scenes/GameScene.js`):
retângulo de canto arredondado, cor sólida, uma sombra suave. Antes de 02/09/2026 havia oito
SVG (17 KB somados) com uma textura própria em cada — ver por que saíram, abaixo.

### Por que a peça deixou de ter textura — e o que isso custa

Até 02/09/2026 cada cor tinha uma **TEXTURA** redundante assada no SVG: xadrez no vermelho,
bolinhas no azul, ondas no roxo, e assim por diante. Quem vê cor jogava pela cor e nem reparava
nela; quem não vê jogava pela textura — e num jogo cujo conteúdo É a cor, isso importa: cor
sozinha exclui cerca de 1 em 12 meninos (daltonismo vermelho-verde), e a paleta não ajuda —
medida em luminância (0–255), sete das oito cores caem numa faixa de 38 unidades, e
**vermelho, azul e roxo ficam a 5 unidades um do outro**, praticamente o mesmo cinza.

**Decisão de acessibilidade do humano, na mesma data: cor chapada, sem textura e sem símbolo.**
Considerou-se substituir a textura por um ÍCONE DE FORMA (círculo dentro do azul, quadrado
dentro do vermelho…) e foi recusado de propósito — no Jogo das Formas a mesma criança aprende
que forma e cor são atributos **independentes**; fixar uma forma por cor aqui contradiria essa
lição entre as duas aulas da mesma coleção. Entre manter essa contradição e abrir mão do canal
redundante, a escolha foi abrir mão dele.

**A consequência é real e fica registrada, não escondida:** sem textura, o jogo volta a
depender só da cor. Vermelho e azul — os dois do nível 1, separados por 3 unidades — ficam
praticamente indistinguíveis em escala de cinza. Para uma criança que não distingue essas
cores, o nível mais fácil deste jogo hoje **não é jogável**. Não é um efeito colateral: é o
preço medido desta decisão, e fica aqui para quem revisitar o assunto não precisar remedir.

## Pendências conhecidas

> Liste aqui, com honestidade, o que ainda falta — narração não gravada, arte
> provisória, mecânica a confirmar. É melhor uma entrega com pendência declarada
> do que uma que aparenta estar pronta.

1. **Os oito nomes de cor chegaram e estão ligados** (02/09/2026), narração nova — não os
   arquivos de 2013. Nomear a cor no instante em que o caminho fecha é o conteúdo pedagógico da
   aula, e agora acontece. **Mas nenhuma das oito transcrições foi confirmada ouvindo** — as
   fichas em `assets/audio-transcricao/` estão com status 🟡 INFERIDA, apoiadas no nome do
   arquivo e na duração; a de `marrom` merece atenção redobrada porque o arquivo chegou com o
   nome trocado (`marron.mp3`, grafia em espanhol) e foi renomeado antes de entrar no config.
   **Ainda falta o resto:** a instrução do tutorial, os dois áudios de nível (que nem servem —
   dizem "fácil"/"difícil" e este jogo tem três níveis com outros nomes), o feedback de
   vitória/derrota, e uma frase que a aula de 2013 não tem: **"Misturei as cores!"** (ver 6). Até
   chegarem, o motor fica em silêncio nesses pontos e diz no console o que a voz deveria falar.
2. **O visual é emprestado do Jogo das Formas**, por decisão do humano, até este jogo ganhar
   identidade própria. A troca é um campo só: `config.tema`.
3. **Os áudios de nível dizem "fácil" e "difícil"**, e este jogo tem três níveis com nomes
   diferentes (Conhecer, Ampliar, Desafio). Os dois arquivos não servem sem regravar; até lá os
   cartões ficam sem locução, e o motor avisa a lacuna no console.
4. **A espera do toque sequencial** não tem valor definido: quanto tempo depois do último toque
   o caminho se fecha. Só se mede jogando com criança — cedo demais corta caminhos longos,
   tarde demais o jogo parece travado.
5. **Sem canal além da cor para quem não a distingue.** Ver "Por que a peça deixou de ter
   textura", acima — decisão tomada, consequência medida, não é lacuna a fechar sem decidir de
   novo o trade-off (contradiria o Jogo das Formas se virar ícone de forma).
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
