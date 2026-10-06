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
criança **arrasta** peças soltas da bandeja até QUALQUER trilha, em QUALQUER
ordem — **encaixe livre**, igual ao Colmeia dos Números/Material Dourado: nada
é validado no instante do encaixe, só quando ela mesma toca **CONFIRMAR**. Se o
tabuleiro inteiro bater com a cartela, uma ESTRELA acende e uma cartela NOVA
nasce (o jogo tem várias RODADAS, uma por estrela da meta — igual ao Material
Dourado); se não bater, só demora mais — a partir do 3º erro seguido NESTA
cartela, o jogo mostra a composição certa se montando sozinha no tabuleiro
(holofote + cascata) e volta pro que a criança tinha, pra ela mesma corrigir.
Pratica comparação visual, reconhecimento de forma+cor simultâneo e
sequenciamento — não é classificação por cor.

> **Mecânica revista** depois de jogar a 1ª versão com o humano — ver a
> correção 21, mais abaixo, pra todo o histórico da mudança (a versão original
> validava cada peça no instante do encaixe, sem Confirmar nem rodadas).

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
15. **Responsivo: celular (retrato) × computador (lado a lado)** — a correção
    13 fixava o jogo em retrato sempre; o humano pediu pra diferenciar por
    tipo de tela, já que no computador sobra espaço nas laterais: "vamos
    manter o tabuleiro vertical mas com alguns detalhes mudam no pc [...] o
    botão pode ir para a lateral, e os cards também poderão ficar mais
    horizontalmente" — com a ressalva explícita, na sequência, de **não
    alargar o tabuleiro**. Decidido UMA VEZ, no carregamento (o motor só lê
    `config.largura`/`altura` na hora de criar o `Stage`; não reage a
    redimensionar a janela depois — ver `engine/core/Game.js`):
    `window.innerWidth > window.innerHeight * 1.05` escolhe entre
    `{largura:1280, altura:800}` (computador) e `{largura:720, altura:1280}`
    (celular, igual à correção 13).
    - **Celular**: exatamente o layout da correção 13 — cartela empilhada
      sobre o tabuleiro, botões em fileira no topo esquerdo.
    - **Computador**: cartela e tabuleiro voltam a ficar LADO A LADO (a
      cartela fica mais "horizontal" só no sentido de estar ao lado, não
      embaixo); os 3 botões viram uma COLUNA na lateral esquerda (ocupando a
      folga que sobra ali) em vez de uma fileira no topo. O método novo
      `_calcularLayoutDesktop()` difere do `_calcularLayout()` da correção
      13 numa conta só, mas importante: `boardWidth` NÃO usa mais a largura
      disponível inteira — fica do tamanho da própria grade de 5 colunas
      (`larguraGradeTrilhas + padding`), porque o tabuleiro NUNCA deve
      alargar (pedido explícito). A bandeja de peças soltas só ganha mais
      FILEIRAS dentro dessa largura estreita — o computador tem altura de
      sobra pra isso não incomodar.
    - Testado nos dois modos (uma janela larga tipo computador e uma janela
      390×700 tipo celular, via um driver CDP à parte): tabuleiro sempre
      estreito e vertical nos dois, colunas corretas (5), um encaixe real
      simulado em cada modo, menu/resultado conferidos na tela mais larga de
      computador (1280×800) sem vazamento.
16. **Giro automático do motor desligado SÓ neste jogo** — depois da correção
    15, um teste num celular de pé de verdade mostrou o tabuleiro deitado de
    novo, em vez de vertical como a referência pedia ("é necessário ter o
    tabuleiro totalmente vertical como essa referência"). Causa: o motor
    (`engine/theme/tokens.css`) gira `#palco` 90° automaticamente sempre que
    o aparelho está em pé e tem toque (`@media (orientation: portrait) and
    (pointer: coarse)`) — pensado pra jogos sempre-paisagem (1280×720, o
    resto da coleção inteira), que desperdiçariam 75% da tela sem o giro.
    Mas este jogo, em celular, já escolhe um canvas PORTRAIT (720×1280,
    correção 13) de propósito — o giro automático deitava um canvas que já
    tinha nascido vertical, o oposto do pedido. Corrigido com um `<style>`
    dentro do PRÓPRIO `index.html` deste jogo (não em `tokens.css`, que é
    compartilhado por toda a coleção): anula o `transform`/`width`/`height`
    do giro e também esconde a dica "GIRE O APARELHO" (mesma condição, mesmo
    motivo — ela existe porque o jogo gira, e aqui ele não gira mais) — só
    nesta página; o mecanismo original continua intacto pra todos os outros
    jogos. Confirmado emulando toque+retrato via CDP: `jogo.stage.giro`
    fica `0` aqui (antes vinha `90`) e continua `90` sem alteração num outro
    jogo (Encaixe Certo) testado do mesmo jeito.
17. **No computador, a coluna de botões passa da esquerda pra direita —
    tabuleiro mais perto do centro** — a correção 15 reservava a coluna de
    pausa/ajuda/som na ESQUERDA, e centralizava cartela+tabuleiro como grupo
    dentro do espaço que sobrava depois dela; como essa reserva só existia de
    um lado, o grupo inteiro saía centralizado DENTRO da área sobrando, mas
    deslocado pra DIREITA em relação à tela toda (a reserva à esquerda não
    tinha equivalente à direita). O humano mandou um mockup: cartela quase
    encostada na borda esquerda, tabuleiro visivelmente mais perto do meio da
    tela, botões no canto oposto (direita). A coluna de botões virou direita
    (`colunaDireitaX = L - margemLateral - 72`) e a área de conteúdo passou a
    nascer direto na borda esquerda (`area.x = margemLateral`, sem mais somar
    a largura da coluna) — a mesma conta de centralização do grupo dentro da
    área (inalterada) agora produz o resultado do mockup, só espelhado.
    Testado via CDP nos 3 níveis (profundidade 2/3/4): cartela nunca invade a
    coluna de botões em nenhum dos três (a folga vertical entre o fim dos
    botões e o início da cartela nunca zera, mesmo no Difícil, onde a cartela
    é mais alta).
18. **Zona reservada à direita bem maior — tabuleiro de verdade mais ao
    meio** — a correção 17 reservava só a largura do próprio botão (104px)
    à direita, o suficiente pra não sobrepor nada, mas cartela+tabuleiro
    juntos ainda ocupavam quase a tela inteira (pouquíssima folga sobrando
    pra "centralizar" de verdade) — o tabuleiro continuava terminando bem
    perto da borda direita. O humano mandou uma captura de referência com um
    vão bem maior entre o tabuleiro e a borda, os botões meio soltos ali. A
    zona reservada (`zonaDireita`) subiu pra 340px — bem mais que o botão
    precisa — e, como `_calcularLayoutDesktop` escolhe o `tam` (e por
    tabela, a largura de cartela/tabuleiro) em função do espaço DISPONÍVEL
    (`areaLargura`, que encolhe com a zona maior), isso automaticamente
    produz peças/colunas um pouco mais estreitas E sobra genuína pra
    centralizar — não foi só "mover pra esquerda", foi abrir espaço de
    verdade pro resto da conta funcionar. Testado nos 3 níveis via CDP e
    captura de tela: o tabuleiro do Fácil passou de terminar em 87,8% da
    largura da tela para 72,8% (a referência mostrava a borda do tabuleiro
    por volta de 74,6%) — bem mais perto do meio, sem cortar nada no
    Difícil (22 peças).
19. **Pausa/ajuda sem o anel de contorno — só o som mantém** — outra
    referência do humano mostrou os ícones de pausa/ajuda SEM o traço escuro
    ao redor (só a sombra por baixo já dá profundidade), diferente do botão
    de som, que continua com o anel azul de propósito (ele sinaliza "som
    ligado", não é só decoração). O `IconButton` do motor usava a MESMA cor
    (`corBorda`) tanto pro anel quanto pra sombra de base 3D por baixo —
    apagar uma apagava a outra. Ganhou um campo novo, opcional,
    `corContorno` (cai em `corBorda` quando ausente — nenhum outro botão da
    coleção muda), que troca só o anel; pausa/ajuda deste jogo passam
    `corContorno: 'transparent'`, mantendo a sombra de base intacta. Motor
    re-sincronizado em toda a coleção depois do ajuste.
20. **Botões em FILEIRA também no computador** — até aqui só o celular
    arrumava pausa/ajuda/som numa fileira; no computador eles formavam uma
    COLUNA no canto superior direito. Referência do humano pediu fileira nos
    dois formatos. `linhaDireitaX` ancora a fileira pela direita (o último
    botão, som, termina exatamente em `L - margemLateral`, os anteriores
    ficam à esquerda dele, mesmo passo de 88px da fileira do celular) —
    célula vertical única (`espaco.md`) nos três, em vez de três alturas
    diferentes.
21. **Mecânica revista: encaixe livre + Confirmar + rodadas, igual ao
    Material Dourado/Colmeia dos Números** — depois de jogar a 1ª versão
    (validação no instante do encaixe: só a peça certa, na ordem certa,
    entrava), o humano pediu uma mudança grande: "não será mais automático
    ao encaixar as peças corretamente, o aluno terá que confirmar". Mudanças:
    - **Encaixe livre** (`Trilha.pecas`, um array por posição em vez do
      contador `proximo` de antes): QUALQUER peça entra em QUALQUER trilha
      vazia, certa ou errada, sem feedback na hora — a trilha vira uma PILHA
      (só a peça do TOPO sai ao tocar; as de baixo ficam presas até ela sair).
      A comparação com a cartela só acontece ao confirmar.
    - **Botão CONFIRMAR** novo (`Button`, canto da zona reservada à direita no
      computador, mesma fileira dos ícones no celular): compara o tabuleiro
      INTEIRO com a cartela, posição por posição.
    - **Rodadas**: bateu — acende uma estrela (`PainelEstrelas`, nova) e uma
      cartela NOVA nasce (`_novaCartela`, chamado de novo); `nivel.meta` virou
      "quantas cartelas" em vez de "quantas trilhas de uma cartela só" —
      `nivel.trilhas` continua sendo a forma FIXA do tabuleiro (5 colunas).
    - **Dica progressiva** (mesmo padrão do Material Dourado): a partir do 3º
      erro seguido NESTA cartela, um holofote (`VeuComBuraco`, câmera local —
      não reaproveita a classe do Material Dourado, cada jogo tem a sua)
      escurece tudo menos o tabuleiro, e a composição certa se monta sozinha,
      peça por peça, em cascata, nas 5 trilhas em paralelo — as peças REAIS
      da criança só ficam escondidas (nunca destruídas), reaparecendo iguais
      depois. Repete a cada novo erro, não só da primeira vez.
    - **Cronômetro CRESCENTE** (`config.mostrarCronometro` virou `true`): o
      jogo ganhou um relógio que só sobe, puramente informativo — antes não
      tinha nenhum.
    - **Bug achado na implementação**: o próprio motor dispara o evento
      `toque` (apertar-e-soltar-no-mesmo-nó) sempre que uma peça ARRASTADA
      termina o arrasto — ela continua "sob o dedo" no ponto de soltar, então
      todo encaixe bem-sucedido também contava como um toque na peça recém
      colocada, e o listener de "toque remove a peça" desfazia o encaixe no
      mesmo gesto. Corrigido com uma marca (`_ultimaPecaEncaixada`) que
      ignora esse toque espúrio específico, sem afetar toques de verdade
      (separados no tempo) pra tirar uma peça depois. Achado e corrigido
      durante o teste com arrasto sintético via `PointerEvent` real — os
      testes com chamada direta a `_encaixarLivre()` não o pegavam, porque
      não passam pelo `Input` de verdade.
    - **Celular ganhou uma 2ª fileira de HUD**: estrelas+relógio (fixos no
      topo, como no computador) e pausa/ajuda/som/confirmar (fileira própria,
      colada na cartela) precisavam de mais altura reservada no topo — `180`
      no lugar do `102` de antes (só cabia uma fileira).

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

`totalPerguntas` é `nivel.meta` — quantas CARTELAS (rodadas) o nível pede,
não mais "quantas trilhas de uma cartela só" (mecânica revista, ver a
correção 21). `acertos` conta cada CARTELA confirmada certa — o tabuleiro
INTEIRO batendo com a cartela de uma vez, não cada trilha isolada. `erros`
conta cada vez que a criança tocou CONFIRMAR com o tabuleiro errado — cada
uma só demora mais (a partir da 3ª seguida NESTA cartela, o jogo mostra a
composição certa — ver `GameScene._mostrarDicaTabuleiro`), nunca desconta
acertos nem estrelas (RE-02).

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
caminho-das-cores/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, 3 níveis, tutorial (com desenho auxiliar), contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     GameScene.js — cartela, trilhas, bandeja, arraste, confirmar, dica
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
| `acertoSOS.wav` | Áudio, vitória do NÍVEL inteiro | Mesmo arquivo já usado pelo Encaixe Certo/Quantidade Certa/coleção Numerandus |
| `soltar_peca.mp3` | Áudio, peça encaixada (QUALQUER encaixe, certo ou errado — encaixe livre, ver correção 21) e cada peça-fantasma da dica se montando | Mesmo arquivo já usado pelo Encaixe Certo/Material Dourado/Quantidade Certa/Chave Mágica — origem/licença a confirmar, pendência compartilhada com os outros jogos que usam este arquivo |
| `error.MP3` | Áudio, CONFIRMAR errado (não mais por peça — mecânica revista) | Mesmo arquivo do Colmeia dos Números/Jogo da Memória/Chave Mágica/Quantidade Certa — ainda não ouvido, ver `assets/audio-transcricao/somErro/transcricao.md` |

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
