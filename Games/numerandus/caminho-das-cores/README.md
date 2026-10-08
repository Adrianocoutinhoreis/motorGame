# Caminho das Cores

Atividade educativa construída com o **Motor Educandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `caminho-das-cores`
- **Faixa etária:** 4 a 7 anos
- **Criado em:** 2026-10-01 · **Mecânica atual desde:** 2026-10-08

## O que é

Um jogo de **copiar um padrão**, fiel ao brinquedo físico do vídeo de
referência. Um **cartão** mostra, numa coluna por trilha, que peça vai em cada
posição (cor **e** forma, de baixo pra cima). A criança leva as peças do
**monte** até as **5 trilhas** e confere tocando em **CONFIRMAR**.

### Regras (versão atual)

- **As peças são as do brinquedo:** 5 cores (vermelho, laranja, verde,
  amarelo, azul) × 4 formas (quadrado, triângulo, círculo, pentágono), cada
  combinação uma vez só, **sem peça sobrando**. Cada peça do monte tem
  exatamente um lugar certo, então dá pra chegar lá por eliminação.
- **O caminho:** a ripa entre o monte e as trilhas tem UMA abertura, à
  esquerda (borda dourada + seta). Toda peça sai por ali, corre o corredor e
  desce a trilha até o fundo, **animada sozinha**. A criança não precisa
  guiar a peça com precisão.
- **Tocar na peça e depois na trilha** — o jeito que o tutorial ensina. A
  peça escolhida brilha e fica pulando de leve; as trilhas livres piscam com
  uma seta.
- **Arrastar só no Fácil** (`arrastar: true` no nível): lá dá também pra
  arrastar e soltar em qualquer ponto da trilha. No Médio e no Difícil um
  arrasto não move a peça — só a escolhe, como um toque, pra quem tenta
  arrastar por instinto nunca ficar sem resposta.
- **Tirar uma peça:** tocar na peça do TOPO da trilha. Ela volta ao monte
  pelo mesmo caminho. Uma peça de baixo só balança.
- **CONFIRMAR** só acende com as 5 trilhas cheias (um toque acidental antes
  disso não conta como erro).
- **Ajuda em degraus**, contada só no cartão atual, nunca descontando nada
  (RE-02):
  1. 1º erro: as peças fora do lugar ganham um anel tracejado e balançam; as
     certas brilham verde por um instante. O anel some quando a peça sai da
     trilha.
  2. 2º erro: além disso, a coluna do cartão de cada trilha com erro pisca.
  3. 3º erro em diante: o tabuleiro certo se monta sozinho (holofote +
     cascata) e volta pro que a criança tinha; depois, as marcas do 1º erro.
- **Rodadas:** cada cartão certo acende uma estrela; o nível pede `meta`
  cartões (3 nos três níveis).

### Níveis — seguem os cartões do brinquedo

| Nível | Cartão | Peças por trilha | No monte |
|---|---|---|---|
| Fácil | uma cor por trilha (`monocor`) | 2 | 10 |
| Médio | uma cor por trilha (`monocor`), como no vídeo | 4 | 20 |
| Difícil | cores misturadas (`misturada`), como os outros cartões do vídeo | 4 | 20 |

### Layout

- **Celular (retrato):** HUD numa fileira no topo, o cartão em cima da
  prancha com a **coluna N exatamente sobre a trilha N**, CONFIRMAR grande
  embaixo, ao alcance do polegar.
- **Computador (paisagem):** prancha à direita; à esquerda, de cima pra
  baixo: botões, estrelas + relógio, o cartão e o CONFIRMAR logo embaixo
  dele (ordem pedida pelo humano com uma imagem de referência, 2026-10-08).
- Números **1 a 5** embaixo das colunas do cartão e das trilhas (como os
  escritos à mão na prancha física). Enquanto uma peça é arrastada sobre uma
  trilha, a coluna do cartão correspondente acende.
- A prancha imita o brinquedo: MDF claro, moldura e ripas brancas.

> **Histórico:** a seção abaixo registra as versões anteriores (grade
> deslizante, colisão com paredes, validação no encaixe) e as leituras do
> vídeo que levaram até aqui. Ela descreve mecânicas que **não existem mais**;
> a regra que vale é a de cima. A correção 29 resume a mudança para a versão
> atual.

## Histórico — como os dados do jogo foram definidos

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
22. **Tabuleiro sem nenhuma linha interna + "colisão com as paredes" no
    arrasto** — o humano mandou uma captura com X vermelho em cima de TODAS as
    linhas claras do tabuleiro (a emenda entre a bandeja e as trilhas, e os
    vãos entre as 5 colunas) pedindo pra tirar — o tabuleiro de verdade não
    tem essas emendas à vista. `TabuleiroVisual.desenhar()` virou um retângulo
    de madeira escura ÚNICO (piscina+divisor+trilhas), sem recortar nada em
    pedaços com vão entre eles; as posições de peça/trilha continuam vindo das
    mesmas contas de layout de sempre, só o DESENHO simplificou.
    Junto, pediu pra mudar a regra de arrasto — "parecido com o Jogo da
    Ordenação", que só aceita um movimento pra uma casa VIZINHA vazia, nunca
    "solte perto o bastante" — e "colisão com as paredes": antes, soltar a
    peça gerava um ímã de raio generoso até o slot vazio mais próximo de
    QUALQUER trilha, então dava pra "pular" por cima do vão entre duas trilhas
    vizinhas só por estar perto o bastante de alguma delas. Agora
    (`_dentroDoCanal`) uma trilha só aceita a peça se o CENTRO dela estiver
    DENTRO da largura do canal — o vão de 14px entre colunas (`gapTrilha`)
    vira uma parede de verdade, mesmo sem nenhuma linha desenhada ali: soltar
    bem em cima do vão não encaixa em nenhuma das duas trilhas vizinhas, por
    mais perto que pareça visualmente. Verticalmente, como `Trilha.y/altura`
    já cobrem só o trecho ABAIXO do divisor (nunca a bandeja), uma peça ainda
    não arrastada pra baixo do divisor automaticamente não encaixa em
    trilha nenhuma — "tem que arrastar até achar espaço", não só soltar perto.
    A regra "só a peça do TOPO da pilha sai ao tocar" (correção 21) já cobria
    o "não poder mexer se cima/baixo não estiver vazio" pedido junto.
    Testado via CDP com arrasto `PointerEvent` real em 3 cenários: soltar NO
    MEIO do vão entre duas trilhas não encaixa em nenhuma; soltar DENTRO do
    canal de verdade encaixa; soltar ainda na área da bandeja (acima do
    divisor) não encaixa mesmo com o X alinhado a uma trilha.
23. **Colisão de verdade, não só checagem na hora de soltar** — a correção 22
    só validava NO INSTANTE DE SOLTAR (arrastar livremente por cima de
    qualquer parede e só então largar dentro de um canal continuava
    funcionando, o dedo podia atravessar o vão sem problema). O humano
    corrigiu: "não poderá arrastar por cima das paredes" é o PRÓPRIO ARRASTO
    que precisa travar, não só a entrega final. Agora `_moverArrasto` trava um
    `_canalPreso` assim que a peça cruza a linha do divisor (o canal cujo
    CENTRO está mais alinhado com onde ela estava) e PRENDE o `x` dela dentro
    da largura desse canal pro resto do arrasto — tentar arrastar bem devagar
    pra uma trilha vizinha, sem soltar o dedo, trava na parede e não atravessa,
    por mais longe que o dedo vá. Só volta a ficar livre em X subindo de volta
    pra cima da linha do divisor (a bandeja/corredor aberto, sem parede
    nenhuma) — dali dá pra atravessar livremente até alinhar com outro canal e
    descer de novo. Testado via CDP com uma sequência LONGA de `pointermove`
    (arrasto contínuo, não só 2-3 pontos): arrastando bem devagar da trilha 0
    até onde ficaria a trilha 4 (atravessando as 3 do meio) sem soltar o dedo,
    o X da peça nunca passa da borda do canal 0, e soltar lá encaixa na
    trilha 0, nunca na 4 mesmo o dedo tendo chegado lá; e confirmado que
    subir de volta pra bandeja e descer num canal diferente funciona
    normalmente (não fica "preso" pra sempre no primeiro canal visitado).
24. **As linhas/paredes voltam a aparecer** — a correção 22 tirou TODAS as
    linhas do tabuleiro (virou um retângulo único) e a 23 fez a colisão
    passar a travar o próprio arrasto, não só a entrega — mas sem nenhuma
    linha à vista, a colisão fica sem nenhuma pista visual do PORQUÊ a peça
    trava no meio do caminho (pra quem está vendo, ela só "para sozinha" sem
    motivo aparente). O humano pediu de volta: "as paredes deverão estar no
    tabuleiro, porém na hora do drag drop o geométrico não poderá passar por
    cima dessas paredes" — ou seja, as DUAS coisas juntas, não uma ou outra.
    `TabuleiroVisual.desenhar()` voltou a ser a versão de antes da correção 22
    (piscina/canaleta horizontal/5 trilhas como retângulos separados, com o
    vão claro — `gapTrilha`/`espessuraDivisor` — aparecendo entre eles), sem
    tocar em NADA da lógica de colisão das correções 22/23 (que nunca
    dependeu do desenho — sempre foi geometria pura, `trilha.x`/`largura`).
    Capturado um arrasto real em andamento (`pointermove` sem soltar o dedo
    ainda) mostrando a peça fisicamente parada bem na borda da primeira
    parede, com a parede visível ao lado — prova visual de que as duas coisas
    (parede desenhada + colisão de verdade) coexistem.
25. **A linha da bandeja pro corredor também é parede — só tem UM buraco** —
    a correção 23 só travava a peça nas paredes LATERAIS (entre as 5
    trilhas); a linha HORIZONTAL entre a bandeja e o corredor por baixo dela
    continuava livre em qualquer X. O humano mandou um desenho (seta
    indicando o caminho: desce pela abertura à esquerda, não direto por
    qualquer ponto da linha) — "a regra é arrastar até passar pelo espaço
    inicial, não poderá passar por cima". O "espaço inicial" É o buraco que o
    `TabuleiroVisual` já desenhava (item C do desenho — a única abertura
    ligando a piscina ao corredor, alinhada com a trilha 0), só que antes ele
    era só decoração; agora `_moverArrasto` usa as MESMAS coordenadas
    (`_buracoXMin`/`_buracoXMax`/`_limitePiscina`, calculadas uma vez em
    `aoEntrar` com a conta idêntica à do desenho) pra travar: fora da faixa
    do buraco, aquela linha vira parede de verdade — a peça simplesmente não
    desce, fica presa bem em cima dela. Um novo estado (`_passouBuraco`)
    lembra se a peça já cruzou por ali NESTE arrasto; uma vez dentro do
    corredor, ele liga livremente às 5 trilhas (só a parede lateral de cada
    uma, da correção 23, continua valendo pra entrar numa trilha específica)
    — só precisa cruzar o buraco de novo se voltar pra cima da linha da
    bandeja. Testado via CDP: soltar o dedo tentando descer longe do buraco
    (bem no meio do tabuleiro) nunca atravessa a linha; descendo dentro da
    faixa do buraco passa normalmente e encaixa na trilha alinhada com ele.
26. **Bug real: o ímã conseguia FURAR a parede** — mesmo com as correções
    22-25, o humano ainda via a peça escapando do canal ("não poderá passar
    por cima por nenhuma parede", com um círculo marcando o retângulo inteiro
    da trilha). Testando um arrasto real com registro de posição a cada
    passo (não só olhar o resultado final), achei a causa: o "ímã" que puxa a
    peça pro slot vazio mais próximo (`_moverArrasto`, depois do clamp das
    paredes) usa `forca = 1 - distância/raio` — e quando a peça está LONGE do
    slot de verdade (comum agora: ela trava no canal assim que cruza
    qualquer parede, bem antes de chegar perto do slot vazio, que pode estar
    lá embaixo), `distância > raio` faz `forca` ficar NEGATIVA. Uma força
    negativa não "puxa menos", ela INVERTE — vira repulsão, e `peca.x +=
    dx * forca * FATOR_IMA` empurrava a peça pro lado ERRADO, pra fora do
    canal já travado pelo clamp (alguns pixels só, mas já fura a parede).
    Duas correções juntas, por segurança: `Math.max(0, forca)` (o ímã só
    atrai, nunca empurra) e um RE-CLAMP depois do ímã (rede de segurança —
    quem garante a regra é a colisão, nunca o ímã, que é só estética de
    "encaixar satisfatório"). Achado com um teste que registra a posição X/Y
    a cada ~8ms de um arrasto contínuo e depois confere TODOS os pontos
    contra o retângulo do canal (não só olhar se encaixou certo no final) —
    os testes anteriores (22/23/25) só checavam o resultado, por isso não
    pegavam esse furo de alguns pixels no meio do caminho.
27. **Mecânica reformulada em DUAS etapas — a bandeja virou uma grade
    deslizante** — depois de várias rodadas de ajuste na colisão (correções
    22-26), o humano decidiu que o problema de verdade não era a colisão em
    si, e sim o MODELO de manipulação inteiro: "precisamos fazer com que os
    geométricos usem as regras de movimentação do Jogo da Ordenação" (só anda
    quem tem vizinho vazio). Isso trocou TODO o sistema de arrasto livre +
    paredes das correções 22-26 por um desenho novo, discutido e decidido
    com o humano antes de qualquer código (ver histórico da conversa):
    - **Etapa 1 — bandeja-grade.** A bandeja virou uma grade tipo "jogo dos
      15" (`GridBandeja`), com exatamente UM vazio por vez. Uma peça só anda
      se estiver na mesma linha/coluna do vazio — e arrastar uma peça distante
      desliza ela (e tudo que estava NO MEIO) em CADEIA, num gesto só, sempre
      em LINHA RETA (nunca dobra em "L" — decisão explícita, pra não ter
      ambiguidade de "qual caminho vale" pra uma criança de 6-7 anos). O
      arrasto em si segue o dedo LIVREMENTE (sem nenhuma colisão durante o
      gesto, ao contrário das correções 22-26) — a validade só é decidida ao
      SOLTAR (`_calcularDeslize`), exatamente como o Jogo da Ordenação: erro
      não existe aqui, só volta pro lugar.
    - **A porta (ESPAÇO).** Uma casa FIXA, sempre a mesma (linha de baixo,
      coluna 0), é a única saída da grade. Deslizar uma peça pra dentro dela
      é um COMPROMISSO imediato — ela sai da bandeja na hora (sem estado de
      "espera"), e uma seta nasce sobre cada trilha ainda não cheia.
    - **Etapa 2 — escolha por toque, não mais por arrasto.** Um toque na
      seta (`SetaColuna`) já encaixa a peça na trilha escolhida, na posição
      mais baixa vazia — 1 toque = 1 decisão, sem passo de confirmar à parte.
      Essa troca (arrasto → toque) foi sugestão do próprio humano e elimina de
      vez toda a categoria de bug das correções 22-26 (colisão furando parede
      durante um arrasto): não existe mais arrasto nenhum entre bandeja e
      trilha.
    - **Retirar é a MESMA porta, no sentido contrário.** Continua só a peça
      do TOPO da pilha (LIFO, `Trilha` não mudou nada aqui) — mas agora ela só
      volta se o ESPAÇO da grade estiver livre NAQUELE instante; senão, um
      tremor avisa "ainda não dá" (nunca um erro de verdade).
    - **Peça sem trilha livre nunca fica presa sem saída.** Como
      `distratoras` deixa o total de peças MAIOR que a capacidade das 5
      trilhas, é possível todas as trilhas encherem antes de a bandeja
      esvaziar. `_calcularDeslize` só trata a chegada na casa do espaço como
      "saída de verdade" se existir alguma trilha não cheia — sem isso, a
      peça só ocupa a casa do espaço como uma célula qualquer (mesmo
      comportamento de hoje: alguma peça distratora pode nunca sair da
      bandeja, e isso sempre foi aceitável).
    - **O que NÃO mudou:** Confirmar, rodadas/estrelas e a dica animada depois
      de 3 erros (correção 21) continuam exatamente iguais — eles só olham
      pro estado final das trilhas, nunca pra como a peça chegou lá.
    - O `TabuleiroVisual` perdeu o "buraco"/corredor físico (correção 25) —
      sem arrasto entre bandeja e trilha, não existe mais caminho nenhum pra
      desenhar ali; a faixa entre as duas zonas virou só decoração (divisória
      de madeira sólida).
    - Testado via CDP: grade sempre nasce com 1 vazio (no espaço); peça fora
      do eixo do vazio sempre volta sem mudar de célula; deslize parcial move
      só quem precisa e NUNCA mexe no vazio; deslize completo até o espaço
      exatamente quando existe trilha livre; toque na seta encaixa na trilha
      certa; retirar só funciona com o espaço livre (tremor quando ocupado);
      com as 5 trilhas cheias, chegar no espaço não dispara mais a saída.
      Confirmar com o tabuleiro certo (peças raspadas direto da grade, forma
      e cor batendo com cada `sequencia`) acende a estrela e troca de cartela
      sem erro, com a grade nova também nascendo com 1 vazio no espaço.
      Conferido visualmente em desktop E celular (retrato) — grade, porta e
      setas aparecem do jeito esperado nos dois.
28. **Dois ajustes na correção 27, achados com uso de verdade pelo humano:**
    - **Abertura visível na divisória, embaixo da coluna do espaço**
      (`TabuleiroVisual.aberturaX`/`aberturaLargura`) — pedido do humano: a
      peça só "sumia" da grade sem nenhuma pista de que ali é uma passagem de
      verdade pra baixo. Primeira versão cortava só metade da canaleta
      horizontal, sem borda — pequena e discreta demais: o humano mandou um
      recorte da própria captura perguntando "consegue ver abertura aqui?",
      e dava pra ver que lia como um pedaço de fundo errado, não como uma
      passagem. Reforçada: agora corta a divisória E a canaleta horizontal
      INTEIRAS (não só metade), com borda dourada tracejada (mesma cor do
      destaque do espaço, pra ligar visualmente as duas) e uma seta pra baixo
      desenhada dentro dela — inequívoco mesmo pequeno. Continua decorativo
      (não leva a lugar fisicamente, a peça some e reaparece animada por
      cima), só explica visualmente a casa do espaço.
    - **Bug real: depois de 1-2 peças saírem/voltarem, a bandeja travava —
      "as outras não conseguem mais ir pro objetivo, nem remover peças"**
      (relato do humano, com captura mostrando só 2 peças numa única trilha).
      Causa: a grade tinha um tamanho FIXO em células desde a correção 27,
      mas cada peça que sai ou volta muda quantas peças cabem nela — uma
      grade de N+1 células com N-1 peças (uma saiu) tem DOIS vazios, não um;
      com N+1 peças (uma voltou) não tem NENHUM. Tanto `_calcularDeslize`
      (acha "o" vazio pra decidir se um arrasto é válido) quanto
      `_tentarRetirarDaTrilha` (só libera se "o" vazio é o espaço) dependiam
      de existir exatamente UM — com dois vazios, o errado podia ser achado
      primeiro; com zero, nada mais se movia nunca mais (igual ao relato).
      Corrigido com `_montarGrade`/`_recompactarGrade`: toda vez que o total
      de peças na bandeja muda de verdade (saída ou retirada), a grade é
      refeita do tamanho exato (peças + 1), com o espaço recalculado (sempre
      última linha, primeira coluna) e as peças que sobraram reorganizadas
      (animadas pro slot novo — a maioria nem muda de lugar, só quem ficava
      depois do "buraco" na ordem de leitura desliza). `_tentarRetirarDaTrilha`
      também passou a checar a própria casa do espaço DIRETO
      (`this._grade[espacoLinha][espacoColuna] === null`), não mais via "ache
      o vazio" — mais simples e não depende de só existir um (defesa extra,
      mesma lição da correção 26: a regra tem que se garantir sozinha).
      Achado reproduzindo o relato via CDP (chamadas diretas a
      `_calcularDeslize`/`_sairPelaEspaco`/`_escolherColuna`/
      `_tentarRetirarDaTrilha`, sem atalho nenhum bagunçando a grade) — uma
      sequência de 5 saídas intercaladas com 2 retiradas, verificando a cada
      passo que a grade tinha EXATAMENTE 1 vazio, pegava a falha antes da
      correção e confirma depois.

29. **Volta ao brinquedo do vídeo (2026-10-08)** — assistindo o vídeo de
    novo, quadro a quadro, ficou claro que a grade deslizante da correção 27
    não existe no brinquedo (lá o monte é solto) e, pior, quase não deslizava:
    o vazio nunca saía da casa do ESPAÇO enquanto havia trilha livre, então só
    as peças da coluna 0 e da última linha se mexiam (3 de 11 no Fácil, 6 de 22
    no Difícil, medido por simulação). O vídeo também mostrou que as peças são
    exatamente 5 cores × 4 formas, sem sobra, e que existem cartões de uma cor
    por coluna e cartões misturados. A mecânica foi refeita do zero (ver "O
    que é", no topo): monte solto, caminho animado pela abertura, arrastar OU
    tocar-e-tocar, CONFIRMAR só com tudo cheio, ajuda em degraus por peça e
    por coluna do cartão, níveis pelos tipos de cartão, cartão alinhado às
    trilhas e números 1-5. Saíram a grade, as setas, as distratoras e toda a
    colisão das correções 22-26.

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

`totalPerguntas` é `nivel.meta` — quantos CARTÕES o nível pede (3).
`acertos` conta cada cartão confirmado certo — o tabuleiro INTEIRO batendo
com o cartão. `erros` conta cada CONFIRMAR com o tabuleiro errado; como o
botão só acende com as 5 trilhas cheias, um toque acidental num tabuleiro
incompleto não conta. Errar nunca desconta acertos nem estrelas (RE-02).

O jogo não conhece aluno, `lo_id`, `activity_id`, XP ou nota — isso é do AVA.

## Estrutura

```
caminho-das-cores/
├── index.html      página do jogo
├── engine/         CÓPIA do motor — gerada por build, não editar
├── src/
│   ├── config.js   identidade, 3 níveis, tutorial (com desenho auxiliar), contrato
│   ├── main.js     ponto de entrada
│   └── scenes/     GameScene.js — cartão, prancha, monte, caminho, confirmar, ajuda
├── assets/         só áudio (as peças são desenhadas por código, sem imagem)
│                   — o vídeo de referência NÃO deve ir no pacote (ver Pendências)
├── CHECKLIST.md    passos para concluir o jogo
└── README.md       este arquivo
```

Assim como o Encaixe Certo/Quantidade Certa/Chave Mágica, as peças aqui **não
usam imagem** — círculo, quadrado, triângulo e pentágono são desenhados via
`Path2D`/arcos direto no canvas.

## Assets

| Arquivo | Tipo | Origem / licença |
|---|---|---|
| `acertoSOS.wav` | Áudio, cada cartão confirmado certo | Mesmo arquivo já usado pelo Encaixe Certo/Quantidade Certa/coleção Numerandus |
| `soltar_peca.mp3` | Áudio, peça chegando ao fundo da trilha e cada peça da demonstração se montando | Mesmo arquivo já usado pelo Encaixe Certo/Material Dourado/Quantidade Certa/Chave Mágica — origem/licença a confirmar, pendência compartilhada com os outros jogos que usam este arquivo |
| `error.MP3` | Áudio, CONFIRMAR errado | Mesmo arquivo do Colmeia dos Números/Jogo da Memória/Chave Mágica/Quantidade Certa — ainda não ouvido, ver `assets/audio-transcricao/somErro/transcricao.md` |

## Pendências conhecidas

- **`error.MP3` não foi ouvido aqui** — ficha "não verificada", mesma
  pendência já registrada nos outros jogos que usam este arquivo.
- **Sem narração** — o público (4-7 anos) não lê, então o jogo precisa de
  voz: os 3 passos do tutorial (`fala:` em `config.tutorial`) e uma frase
  curta a cada cartão novo. Adiado de propósito (2026-10-08), pra gravar
  depois da mecânica nova ser aprovada.
- **O vídeo de referência (28 MB) está dentro de `assets/`** — fora do git,
  mas DENTRO da pasta que vai pro AVA. Mover pra `fontes/` antes de publicar.
- **Sem áudio de clique genérico** (`config.audio.clique` continua `null`) —
  mesma decisão já usada no Encaixe Certo/Jogo da Ordenação/Quantidade Certa.
- **Origem/licença de `soltar_peca.mp3` e `acertoSOS.wav`** — mesma pendência
  já registrada nos outros jogos que usam esses arquivos.
- **Não testado em tablet real, nem em iframe pequeno/médio/grande** — mesma
  bateria de testes ainda pendente do resto da coleção.
- **Daltonismo** — as 5 cores são as do brinquedo (vermelho, laranja, verde,
  amarelo, azul); vermelho/verde e vermelho/laranja se confundem pra parte das
  crianças. A forma ajuda, mas a cor também decide. Não calibrado com
  crianças jogando.
- **Testado em navegador headless** (arrastar, tocar-e-tocar, retirar,
  CONFIRMAR certo/errado, os 3 degraus de ajuda, fim do nível) chamando os
  tratadores de gesto da cena — ainda não com toque real num tablet.

## Atualizar o motor neste jogo

```
node tools/build.mjs numerandus/caminho-das-cores
node tools/verificar-independencia.mjs numerandus/caminho-das-cores
```
