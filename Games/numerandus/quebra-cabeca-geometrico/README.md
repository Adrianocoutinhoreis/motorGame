# QUEBRA CABEÇA GEOMÉTRICO

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `quebra-cabeca-geometrico`
- **Faixa etária:** 7 a 9 anos (2º ano)
- **Criado em:** 2026-09-23

## O que é

Um quebra-cabeça geométrico real (brinquedo físico de 7 peças hexagonais) em
versão digital. Uma peça central fica sempre fixa no meio do tabuleiro; a
criança gira (botão dedicado) e arrasta cada uma das outras 6 peças até o
número do lado que vai tocar bater com o número da peça vizinha — central ou
já colocada. Pratica comparação de números (reconhecer iguais) e orientação
espacial (girar até a peça "olhar" pro lado certo). Sem ordem certa pra
seguir, sem derrota: errar só demora mais, a peça volta pra bandeja.

## Como os números foram conferidos

Este é o achado mais importante do jogo, então fica registrado aqui: as 7
peças do brinquedo físico foram fotografadas limpas (sem mão na frente,
fundo removido) em duas fotos de referência — uma com as peças soltas, outra
com as 7 já na posição E rotação corretas da montagem final. A partir delas:

- Os números de cada peça (`GameScene.js`, `SLOTS`/`NUMEROS_CENTRAL`) foram
  transcritos direto da segunda foto — sem precisar resolver rotação por
  matemática, porque as peças já apareciam na orientação certa.
- **6 e 9 são o mesmo triângulo impresso.** A peça não reimprime o número
  virado: em certas posições do hexágono o "6" cai de cabeça para baixo e lê
  como "9". O jogo trata os dois como iguais ao comparar (`normalizarNumero`).
- A regra de encaixe foi testada matematicamente nas 12 arestas possíveis (6
  entre peça-vizinha e central, 6 entre peças vizinhas entre si) e todas
  batem — nenhuma peça toca outra só na "pontinha" sem regra, porque com a
  central presente a flor fica completa (7 hexágonos, sem lado faltando).

## Como rodar localmente

O motor usa módulos ES, então abrir o `index.html` por `file://` **não funciona**
(o navegador bloqueia os módulos). Sirva por HTTP:

```
node tools/serve.mjs
```

e abra `http://localhost:8080/Games/numerandus/quebra-cabeca-geometrico/`.

Para ver a mensagem do AVA saindo de verdade, use o host de teste:
`http://localhost:8080/tools/ava-teste.html`

## Registro no AVA

Ao terminar uma partida (só vitória — este jogo não tem derrota, ver seção 5
do `CHECKLIST.md`), o jogo emite:

```js
{ type: "JOGO_CONCLUIDO", acertos, erros, totalPerguntas, nivel, jogo: "quebra-cabeca-geometrico" }
```

`totalPerguntas` é sempre 6 (as 6 peças que vão ao redor da central — ela
mesma não conta, já começa colocada). `acertos` é sempre 6 numa vitória
(a partida só termina quando todas encaixam). `erros` conta tentativas soltas
no lugar geométrico certo mas com o número errado, só demonstrativo — nunca
desconta a nota (RE-02).

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
quebra-cabeca-geometrico/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, níveis, tutorial (desenha as peças de verdade), contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     GameScene.js — toda a mecânica (arrastar, girar, validar encaixe)
├── assets/         só áudio (as peças são desenhadas por código, sem imagem)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

Diferente do Quebra-Cabeça Dino, as peças aqui **não usam imagem** — são
desenhadas direto no canvas (`GameScene.js`, classe `Hexagono`, e a mesma
geometria repetida em `config.js` pro tutorial), porque são hexágonos simples
de 6 triângulos coloridos. Isso mantém o jogo leve e evita precisar de arte
redesenhada — só os NÚMEROS e CORES de cada peça precisavam ser fiéis ao
brinquedo real, e esses vieram das fotos de referência (ver seção acima).

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `acertoSOS.wav` | Áudio, vitória | Mesmo arquivo de toda a coleção Numerandus — ver `assets/audio-transcricao/acertoSOS/transcricao.md` |
| `soltar_peca.mp3` | Áudio, encaixe | Mesmo arquivo do Material Dourado/Dino — origem/licença a confirmar, ver `assets/audio-transcricao/soltarPeca/transcricao.md` |
| `tutorial/tela1.wav` | Narração, tutorial 1 | Arquivo fornecido para o jogo |
| `tutorial/tela2.wav` | Narração, tutorial 2 | Arquivo fornecido para o jogo |
| `tutorial/tela3.wav` | Narração, tutorial 3 | Arquivo fornecido para o jogo |
| `error.MP3` | Efeito de tentativa incorreta | Mesmo arquivo do Jogo da Memória |
| `progresso.mp3` | Efeito de progresso, celebração final | Origem a confirmar |

## Pendências conhecidas

- **Áudio de clique genérico** — ainda não gravado (`config.audio.clique` continua `null`).
- **Origem/licença de `soltar_peca.mp3` e `progresso.mp3`** — ainda a confirmar (mesma
  pendência de `soltar_peca.mp3` já registrada no Jogo da Ordenação, Encaixe Certo,
  Material Dourado e Dino, por ser o mesmo arquivo).
- **Fichas de transcrição incompletas.** Só `acertoSOS` e `soltarPeca` têm ficha em
  `assets/audio-transcricao/`. Faltam as de `tutorialTela1`, `tutorialTela2`,
  `tutorialTela3` (têm FALA de verdade — precisam ser ouvidas e transcritas, não só
  marcadas "sem fala"), `somErro` e `somProgresso`.
- **Nível 3 ("Difícil") não remove o contorno pontilhado por completo.** O
  plano original cogitava um nível sem indicação nenhuma de posição (mais
  fiel ao brinquedo físico, onde não existe contorno); a versão atual chega
  perto disso com `contornosDiscretos` (os contornos ficam quase apagados,
  só o mais próximo do arrasto acende, sem indicar se é o lugar CERTO) e
  `validarVizinhos` (o encaixe também precisa bater com as peças vizinhas já
  coladas, não só com a central — por isso a descrição "Compare as
  vizinhas"). Remover o contorno por inteiro continua registrado como
  possível v2, não como bug.
- **Testado só com chamada direta aos métodos da cena** (`--preparar` do
  `captura-cena.mjs`) — nenhum evento de ponteiro real (toque/arrasto de
  verdade) foi disparado ainda. Ver Pendências do Dino: o mesmo limite do
  `Input.js` compartilhado (só rastreia um ponteiro por vez) também vale aqui.
- **Não testado em tablet real, nem em iframe pequeno/médio/grande.**

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/quebra-cabeca-geometrico
node tools/verificar-independencia.mjs numerandus/quebra-cabeca-geometrico
```
