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
6. **Layout: um painel só, peças em cima e colunas embaixo** — a versão da
   correção 5 (cartela + trilhas numa fileira, bandeja numa faixa à parte
   embaixo de tudo) foi substituída depois de um rascunho do humano direto do
   vídeo de referência: a cartela continua fixa à esquerda, mas à direita
   passa a existir um painel SÓ, com as peças soltas no TOPO e as trilhas
   ancoradas na BASE do mesmo painel, separadas por uma ripa horizontal
   (`DivisorFormasColunas`) — a criança arrasta de cima pra baixo, dentro do
   mesmo painel, igual ao esboço. As trilhas em si não mudaram por dentro
   (mesmo "poço" que só aceita a próxima peça da sequência); só a posição do
   painel mudou, de uma fileira separada embaixo para o topo do painel das
   colunas.
7. **Colunas bem mais altas que o estritamente necessário, sem relógio no
   HUD** — uma foto do brinquedo físico (mandada pelo humano) mostra o
   tabuleiro inteiro dominado por colunas compridas, bem mais altas do que a
   profundidade da sequência pediria sozinha, com a bandeja de peças soltas
   pequena e compacta em cima. `_calcularLayout()` foi ajustado pra fixar a
   altura do painel na altura TOTAL da área de jogo (não mais "o que o
   conteúdo precisa") — a folga vira espaço vazio por cima de onde a peça
   realmente senta, dando a sensação de coluna comprida mesmo com poucas
   peças por trilha. `config.mostrarCronometro` virou `false`: o brinquedo de
   verdade não tem cronômetro, e o relógio ao vivo saiu do HUD (continua
   pausa, ajuda e som).
8. **Tabuleiro ganha visual de madeira, colunas esticam pra preencher a
   largura** — uma foto do brinquedo físico (mandada pelo humano, com um X
   vermelho marcando a sobra de espaço vazio nas laterais das colunas) pediu
   duas mudanças de uma vez: (a) o painel direito troca o fundo liso/roxo
   translúcido por uma pintura de madeira (`TabuleiroVisual`) — uma
   "prateleira" (madeira clara) onde as peças soltas sentam, uma viga grossa
   (madeira escura) dividindo, e colunas (madeira escura) descendo até a base,
   tudo sobre um fundo bege claro; (b) as colunas, que antes tinham a largura
   da PEÇA (`tam`) centralizadas com sobra morta dos dois lados, agora
   ESTICAM pra preencher a largura inteira do tabuleiro, lado a lado com um
   vão fino entre elas — a peça continua do tamanho de sempre, só centralizada
   dentro da coluna mais larga (`Trilha` ganhou um parâmetro `larguraColuna`
   separado de `tam` só pra isso). As cores reaproveitam os tokens de madeira
   já existentes no motor (`cores.madeira`/`madeiraEscura`, usados no tema
   'quarto' do `Background`), em vez de inventar uma paleta nova.
9. **Pausa/ajuda/som juntos no mesmo canto** — o som ficava isolado no canto
   superior DIREITO enquanto pausa e ajuda ficavam à esquerda; a referência
   mais recente mostra os 3 botões numa fileira só, à esquerda. O
   `SoundToggle` foi realinhado pra perto dos outros dois, com o mesmo ajuste
   vertical (acompanha a altura da cartela).
10. **Altura do tabuleiro também estica** — a correção 7 já fixava a altura
    numa tentativa de preencher a tela, mas essa conta se perdeu numa reescrita
    direta do arquivo (ver nota técnica abaixo) e a LARGURA passou a travar o
    tamanho da peça primeiro (a bandeja numa fileira só de peças soltas é
    geralmente mais larga que a grade de trilhas) — nesse ponto a altura do
    tabuleiro sobrava bem abaixo do disponível, deixando espaço morto em cima
    e embaixo de todo o conjunto (cartela + tabuleiro), marcado com X nos 4
    cantos da referência. `_calcularLayout()` agora estica `boardHeight` pra
    pelo menos a altura total da área de jogo DEPOIS de escolher o `tam` pela
    largura — a folga extra vira canal de coluna mais comprido, sem precisar
    recalcular mais nada (`TabuleiroVisual`/`Trilha` já derivam a altura do
    canal e a posição das peças a partir de `boardHeight`). O teto da busca de
    `tam` (antes travado em 100) também subiu pra 220, pra não limitar
    artificialmente o tamanho em níveis com pouco conteúdo.
11. **Cartela alinhada pelo TOPO, não mais centralizada** — esticar o
    tabuleiro (correção 10) deixou a ÁREA de jogo com uma altura bem maior do
    que o conteúdo da cartela precisa; centralizar a cartela nessa área agora
    alta deixava um vão vazio em cima dela (empurrando pausa/ajuda/som pra
    baixo também, já que a posição dos botões segue a altura da cartela) E
    outro vão embaixo — reclamação do humano, marcada com X e setas na
    referência mais recente, pedindo pra "melhorar os espaços vazios". A
    cartela passa a nascer no topo da área (`y = 0`), igual ao tabuleiro
    (que já começa no topo desde a correção 10) — os botões, que seguem a
    altura da cartela, voltam a ficar coladinhos no topo da tela.
12. **Margem do topo mais justa** — mesmo com cartela/tabuleiro alinhados pelo
    topo (correção 11), sobravam ~12px inúteis entre a base dos botões e o
    topo do tabuleiro; esse vão ficava mais visível em cima do TABULEIRO (que
    não tem nenhum botão por cima "ocupando" a faixa) do que em cima da
    cartela — o humano apontou isso como "um pouco de espaço acima do
    tabuleiro" numa nova rodada de ajuste. `this._topo` caiu de 110 para 102
    (o mínimo real: 20 de margem + 72 de altura do botão + 10 de respiro).
    Testado também: tentativa de reproduzir "botões cortados" (mencionado
    junto) em janelas bem estreitas (inclusive replicando a proporção da
    captura enviada) — não reproduziu; os botões sempre renderizaram
    inteiros, com folga, em todos os tamanhos testados.
13. **Canvas vertical (retrato) — único jogo da coleção assim** — uma foto do
    brinquedo físico segurado em PÉ pelo humano mostrou que o vídeo de
    referência original usa o tabuleiro na vertical, não deitado; pedido
    explícito: "deixando verticalmente poderemos deixar o tabuleiro mais
    próximo do vídeo com o tabuleiro centralizado". `largura`/`altura` do
    `config.js` viram `720`/`1280` (espelho exato do `1280`/`720` do resto da
    coleção — mesmas duas magnitudes, só giradas). O `Stage` do motor já
    escala qualquer proporção sem ajuste; o que precisou de trabalho foi:
    - **`MenuScreen`/`ResultScreen` do motor** (compartilhadas por TODA a
      coleção) tinham larguras fixas em pixel pensadas pra 1280 de largura
      (placa de título 740, botão 540, fileira de 3 botões de resultado
      760+) que vazariam numa tela de 720. Corrigido com `Math.min(valor,
      L - margem)` — em qualquer tela larga o resultado é idêntico a antes
      (nenhum outro jogo muda), só entra em ação numa tela mais estreita.
    - **`GameScene.js` deste jogo**: cartela e tabuleiro, que ficavam lado a
      lado, passam a EMPILHAR (cartela em cima, tabuleiro embaixo), ambos
      centralizados horizontalmente. `_calcularLayout()` foi reescrito: o
      tabuleiro agora sempre usa a largura disponível INTEIRA (não briga
      mais por espaço com a cartela do lado), e a busca de `tam` decide só a
      altura do conjunto empilhado cabendo na tela — a folga depois da
      cartela ainda estica o tabuleiro (mesmo raciocínio das correções 10-11,
      agora aplicado à direção vertical).
14. **Sempre 5 colunas, não 3/4/5 por nível** — outra foto do brinquedo
    mostrou os números "1 2 3 4 5" escritos à mão do lado de cada coluna da
    prancha: a prancha física tem 5 colunas FIXAS, não é um parâmetro de
    dificuldade. `nivel.trilhas` virou `5` nos três níveis (`meta` também,
    já que `meta = trilhas`); a dificuldade real continua sendo só
    `profundidade` (2/3/4, sequência mais longa pra acertar).

> **Nota técnica:** boa parte da reestruturação de layout desta seção
> (`TabuleiroVisual`, cartela e tabuleiro centralizados como um conjunto só,
> correções 6-8) veio de uma edição direta no arquivo `GameScene.js`, fora
> desta sessão de IA — registrado aqui porque o histórico de correções desta
> seção só faz sentido junto.

**Tema visual:** o fundo da TELA (atrás do tabuleiro) continua liso e escuro
— ainda é o conteúdo colorido (peças, tabuleiro) que deveria chamar atenção,
não o fundo. O TABULEIRO em si, desde a correção 8, imita madeira de verdade
(mais fiel à foto do brinquedo físico do que um painel liso). Sem mascote —
decisão do humano para este jogo.

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
| `error.MP3` | Áudio, peça errada ou fora de ordem | Mesmo arquivo do Colmeia dos Números/Jogo da Memória/Chave Mágica/Quantidade Certa — ainda não ouvido, ver `assets/audio-transcricao/somErro/transcricao.md` |

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
