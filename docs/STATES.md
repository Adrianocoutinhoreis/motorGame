# STATES.md — estados do jogo e maturidade do motor

Três coisas neste documento:

1. **A máquina de estados** que todo jogo do motor segue — e onde exatamente o registro
   no AVA acontece.
2. **O estado de maturidade do motor** — o que está pronto, o que é provisório e o que
   ainda não existe. Serve para decidir o que construir antes do próximo jogo.
3. **Os três jogos novos** (CDU, Chave Mágica e Jogo da Velha) e o que cada um pede do
   motor — medido lendo o código deles, com o que é decisão do humano separado do que é
   código a escrever.

---

# Parte 1 — A máquina de estados do jogo

Os nomes vivem em `engine/core/Estados.js` e são os mesmos usados como nome de cena, para
que estado e tela nunca saiam de sincronia.

```
                    ┌──────────┐
                    │   BOOT   │  index.html carregou
                    └────┬─────┘
                         ▼
                  ┌──────────────┐
                  │  CARREGANDO  │  assets baixando (tela HTML, não canvas)
                  └──────┬───────┘
                         ▼
        ┌──────────────────────────────────┐
        │               MENU               │◄──────────────┐
        │        JOGAR · COMO JOGAR        │               │
        └───┬───────────────┬──────────────┘               │
            │               │                              │
            ▼               ▼                              │
     ┌─────────────┐  ┌──────────┐                         │
     │  TUTORIAL   │─►│  NIVEIS  │  (só se houver >1)      │
     │  passos     │  │ cartões  │                         │
     └──────┬──────┘  └────┬─────┘                         │
            │              │                               │
            └──────┬───────┘                               │
                   ▼                                       │
            ┌─────────────┐   pausa    ┌──────────┐        │
            │   JOGANDO   │◄──────────►│ PAUSADO  │────────┤
            │  a partida  │  continuar └──────────┘        │
            └──────┬──────┘                                │
                   │ vitória OU derrota                    │
                   ▼                                       │
            ╔═══════════════╗                              │
            ║   RESULTADO   ║  ◄── AQUI o AVA é acionado   │
            ╚═══┬═══════┬═══╝                              │
                │       └──────────────────────────────────┘
                ▼  jogar de novo
            (volta a JOGANDO)
```

## A regra que importa

| Momento | O que o motor faz | Por quê |
|---|---|---|
| **Entra** em `RESULTADO` | `AvaBridge.concluir(dados.resultado)` | Fim de UMA partida → um registro |
| **Sai** de `RESULTADO` | `AvaBridge.rearmar()` | A próxima partida poderá registrar |
| Já registrou e chamam de novo | ignora, com aviso no console | Impede duplicar a MESMA partida |

Isso é a borda de subida / descida do METODO.md (B3.5) aplicada a um motor com código-fonte.
No caso do Construct 3 sem `.c3p`, a borda precisava ser inferida do estado das variáveis a
cada quadro; aqui a transição de estado É a borda, então a garantia é estrutural.

**Consequência prática:** um replay genuíno **deve** gerar um novo `JOGO_CONCLUIDO` — é
uma nova tentativa, não dado repetido. O que nunca pode acontecer é a mesma partida contar
duas vezes.

## Transições permitidas

Declaradas em `TRANSICOES` (`engine/core/Estados.js`) e conferidas em tempo de execução.
Uma transição fora da tabela **não é bloqueada** (um jogo pode ter um fluxo legítimo
diferente), mas gera aviso no console — porque quase sempre é bug de navegação.

| De | Para |
|---|---|
| `BOOT` | `CARREGANDO` |
| `CARREGANDO` | `MENU` |
| `MENU` | `TUTORIAL`, `NIVEIS`, `JOGANDO` |
| `TUTORIAL` | `MENU`, `NIVEIS`, `JOGANDO` |
| `NIVEIS` | `MENU`, `JOGANDO`, `TUTORIAL` |
| `JOGANDO` | `PAUSADO`, `RESULTADO`, `MENU` |
| `PAUSADO` | `JOGANDO`, `MENU`, `NIVEIS` |
| `RESULTADO` | `JOGANDO`, `MENU`, `NIVEIS` |

## Por que `PAUSADO` não é uma cena

Trocar de cena destrói a árvore visual — a torre montada, o tabuleiro, o placar. Se a pausa
fosse cena, "pausar" seria "desistir". Por isso `PauseScreen` é um **Node sobreposto** que
a cena de partida adiciona a si mesma: congela a lógica sem descartar nada.

### E a AJUDA não é nem um estado

O botão de ajuda abre o tutorial por cima da partida (`HelpScreen`), pelo mesmo motivo e um
degrau mais fundo: ela não aparece no diagrama porque **o estado continua `JOGANDO`**. Não há
transição, não há cena nova, e o `tempoSegundos` para porque a cena fica `pausada`.

Se a ajuda fosse a cena `TUTORIAL`, reler a regra custaria a partida — e é justamente quem não
entendeu a regra que não pode pagar esse preço (regra **RE-05**).

## Estados dentro da partida (interno de cada jogo)

`JOGANDO` é um só estado para o motor, mas a cena tem seu próprio micro-ciclo. No Jogo dos
Blocos, por exemplo:

```
aguardando toque  →  caindo (travado=true)  →  assentou | derrubou  →  aguardando toque
```

A trava durante a queda existe para o toque repetido não soltar dois blocos. Todo jogo
precisa de uma trava equivalente: **enquanto uma jogada está sendo resolvida, o input não
inicia outra.**

---

# Parte 2 — Maturidade do motor

Legenda: **Pronto** (usado e validado) · **Parcial** (funciona, mas com limite conhecido) ·
**Planejado** (não existe ainda).
Onde o que falta é uma DECISÃO e não código, a linha diz **Não decidido** — e nomeia quem decide.

## Núcleo

| Peça | Estado | Observação |
|---|---|---|
| `Emitter`, `Matrix2D`, `Node` | Pronto | Hit-test com matriz inversa validado em teste |
| `Stage` (escala + letterbox) | Pronto | Validado em iframe de 400×700, 640×480 e 1280×720 |
| Giro em aparelho de pé | Pronto | O CSS gira `#palco`, o `Stage` detecta e inverte o mapa tela→lógico. Medido: desperdício de tela cai de 75% para 20% num celular de 360×720. Coberto por teste de unidade e por um toque real, no pixel real, com o palco girado |
| Jogada travada sem saída | **Coberto** | Todo jogo tem uma fase em que o toque é ignorado de propósito, e quem a libera é sempre um `chamar` no fim de uma cadeia de `Tween` — que `Tween.chamar` pode perder engolindo uma exceção. O `Watchdog` do motor vigia a invariante "ciclo em curso ⇒ tween vivo no alvo" e devolve a jogada em meio segundo; se travar de novo, a partida encerra com os pontos feitos. Ligado nos dois jogos, com injeção de falha no portão de jogabilidade |
| Alvo tocável em celular | **Parcial** | O mínimo de 64 px é garantido em espaço LÓGICO, e a escala do Stage o reduz a 32–36 px físicos em celular — abaixo do piso de 44 px do WCAG 2.5.5. **O motor continua sem mecanismo próprio**; o que existe é a saída por LAYOUT, feita no Jogo das Formas: o HUD virou coluna lateral e a célula subiu de 64 para 80, o que dá 40 px físicos (+25%). O que governa isso é a fração da ALTURA que o alvo ocupa — alargar a tela não muda nada, e por isso "área visível adaptativa" (abaixo) NÃO resolve este item. Cruzar os 44 px pede reduzir uma linha da grade, que é decisão de jogo |
| Área visível adaptativa | Pronto | Era planejado nestes termos: "exige o `Stage` expor um retângulo visível maior que a caixa segura e o `Background` pintar até a borda dele". É o que existe: `Stage.areaTotal()` e `Background.pintarSangria()`. As barras do letterbox recebem o cenário, então desaparecem — **sem cortar nada do jogo e sem tocar na geometria lógica de 1280×720**, que é medida. Coberto por 6 verificações em navegador, incluindo a medição do pixel da junção. Continua NÃO resolvendo o alvo tocável (linha acima): a área do jogo é a mesma, só a moldura mudou |
| `Input` (Pointer Events) | Pronto | `toque` só dispara se apertar e soltar no mesmo nó. `arrastar` é contínuo no nó pressionado — é o que o caminho do Jogo das Cores usa |
| `PathSelector` | Pronto | O caminho por vizinhas iguais, com corte do rabo e os dois gestos (arrasto e toque). 18 testes de unidade; estreia no Jogo das Cores |
| `Tween` | Pronto | Encadeamento, espera, laço, cancelamento por alvo e pausa global (`pausarTodos`/`retomarTodos`). A pausa global foi adicionada para travamento: tweens continuavam rodando durante a pausa e podiam disparar `_liberarGesto` → `_misturar` enquanto o jogo estava congelado, deixando `fase = 'movendo'` e o jogo sem aceitar toque ao fechar a pausa |
| `Loader` | Pronto | Falha de recurso não derruba o jogo. `imagem(null)` devolve null em silêncio — pedir sem id é o jogo dizendo "não tenho arte para isto", e avisar ali enchia o console de toda partida |
| `Storage` | Pronto | Cai para memória se o localStorage for bloqueado |
| `Rand` | Pronto | Semente opcional para reproduzir partidas |
| `Scene` / `Game` | Pronto | Limpeza automática de nós e ouvintes |
| Multi-toque | **Planejado** | Hoje um ponteiro por vez; nenhum jogo atual precisa |
| Arrastar e SOLTAR num alvo | **Planejado** | `Input.arrastar` leva o ponteiro, mas nada é solto em lugar nenhum: faltam alvo de soltura, busca do alvo mais próximo dentro de um raio e devolução animada ao errar. É o que a **Chave Mágica** pede (Parte 3) |

## Tema e interface

| Peça | Estado | Observação |
|---|---|---|
| `tokens.js` / `tokens.css` | Pronto | Fonte única compartilhada entre canvas e DOM. Paleta `ludica` ajustada (03/09/2026): rosa `#EC4899` → `#F9A8D4` e roxo `#8B5CF6` → `#A78BFA` para aumentar a separação visual entre vermelho/rosa e azul/roxo |
| `icons.js` | Pronto | 16 ícones; ampliar conforme necessidade |
| `Button` / `IconButton` | Pronto | Alvo mínimo de 64px garantido no construtor |
| `Panel`, `ScoreBar`, `TimerBar`, `Lives` | Pronto | `TimerBar` estreou no Jogo das Formas: 120 s por delta, cor mudando a 35% e a 15% e pulso no trecho crítico |
| `SoundToggle` | Pronto | Preferência persistida |
| `Mascot` | Pronto | Dois modos: imagem do jogo (usado no piloto) ou coruja vetorial (padrão) |
| Expressão facial por imagem | **Planejado** | `imagensPorExpressao` existe na API, sem arte que a exercite |
| `Background` | Pronto | Três temas: `campo`, `construcao` e `formas` (degradê indigo→ciano com formas em camadas). O tema vem de `config.tema` |
| Tema por jogo | **Parcial** | O CENÁRIO e a PLACA do título já variam por jogo (`config.tema`), e o Jogo das Formas estreou o tema `formas`. A PALETA continua uma só: botão, cartão de nível e painel são iguais nos dois jogos — de propósito, para as aulas seguirem sendo a mesma coleção. Falta variar mascote e maquinário, que hoje são o mesmo arquivo e o mesmo desenho nos dois |
| Dica "gire o aparelho" | Pronto | Fora do `#palco` de propósito: dentro dele giraria com o jogo e só seria legível depois de o aparelho ser virado. Não intercepta toque e se apaga sozinha. **Não é narrada** — falta gravação |
| Teclado / campo numérico | **Planejado** | Nenhum jogo do motor lê texto ou número — os três são só toque. O **Jogo CDU** pede digitar o número lido nas casas C-D-U, e a escolha entre `<input>` do DOM, teclado desenhado no canvas e cartões de resposta **muda a habilidade avaliada** (Parte 3) |

## Telas padrão

| Tela | Estado | Observação |
|---|---|---|
| `LoadingScreen` | Pronto | HTML, aparece antes do motor existir |
| `MenuScreen` | Pronto | JOGAR + COMO JOGAR + som |
| `TutorialScreen` | Pronto | Passos narrados, ilustração animada, navegação |
| `LevelSelectScreen` | Pronto | Aparece sozinha só quando há mais de um nível |
| `PauseScreen` | Pronto | Camada sobreposta. Corrigido: painel não inicia mais com `alpha = 0` — botões eram invisíveis ao hit-test durante a animação de abertura (240ms), causando travamento aparente |
| `HelpScreen` | Pronto | A AJUDA durante a partida: camada sobreposta que HOSPEDA o `TutorialScreen` em vez de redesenhar os passos — a ajuda é o tutorial, e duas versões da mesma explicação divergiriam. Pausa a partida, conta os pedidos (campo `ajuda` do AVA) e devolve o jogo como estava. Regra RE-05 |
| `ResultScreen` | Pronto | Vitória e derrota; **cinco estrelas** pelo percentual da meta, calculadas pela própria tela (RE-04); placar na unidade (RE-03); cenário do tema do jogo |
| Tela de créditos / objetivo | **Planejado** | Útil ao professor; não pedida ainda |
| Tela de transição entre fases | **Planejado** | Um nível com fases internas ("Fase 2 concluída") não existe: `config.niveis` é lista plana. Pedida pela **Chave Mágica** |

## Jogabilidade

| Peça | Estado | Observação |
|---|---|---|
| `ScoreSystem` | Pronto | Fonte única dos números do AVA |
| `CraneController` | Pronto | Modo oscilante validado no piloto; **modo colunas estreou** no Jogo das Formas. O ciclo vertical (descer, pegar, subir) NÃO é dele: é `Tween` na cena, e vale saber disso antes de planejar o próximo jogo de guindaste |
| `GridBoard` | Pronto | **Estreou** no Jogo das Formas (conectividade de 4, gravidade `cima`, cascata) e ganhou no Jogo das Cores `tipoDe`, `trocar`, `embaralhar` e `garantirJogada` — tabuleiro sem jogada possível, medido e tratado. Dois limites conhecidos: não tem operação de deslocar a grade inteira uma linha (a linha nova mora na cena), e `desfazerCombosIniciais` resolve num passe só sem reconferir as peças já vistas — ver abaixo |
| `PathSelector` | Pronto | **Estreou** no Jogo das Cores: o caminho desenhado pela criança, arrasto e toque, vizinhança vinda da grade. 18 testes de unidade |
| Turnos e adversário | **Planejado** | `ScoreSystem` é de UM jogador: uma meta, `acertos`, `erros`, `vidas`. Vez alternada, dois placares e CPU não existem. Pedidos pelo **Jogo CDU** e pelo **Jogo da Velha** |
| Empate como resultado | **Planejado** | `ScoreSystem` emite `vitoria` e `derrota`, e nada mais. No **Jogo da Velha** entre dois jogadores parelhos o empate é o resultado MAIS COMUM, não a exceção |
| Cronômetro por rodada | **Planejado** | `TimerBar` mede a partida inteira (120 s no Formas). O **Jogo CDU** dá 20 s por pergunta, reiniciando quatro vezes |
| Linha vencedora numa grade | **Planejado** | `GridBoard` acha grupos por conectividade e tipo; as oito linhas de três do **Jogo da Velha** são outra consulta — pequena, mas inexistente |
| `GridBoard.desfazerCombosIniciais` sem reconferência | **A corrigir** | Ver abaixo |

### O limite do `desfazerCombosIniciais`, medido

O método percorre `todas()` e, para cada peça em grupo de 3, resorteia o tipo dela até sair do
grupo. Nunca reconfere as peças já visitadas — então **consertar a 12ª peça pode criar um grupo
com a 3ª**, e esse grupo sobrevive calado.

Não é teórico: no Nível 1 do Jogo das Formas (5 colunas, 3 linhas, 3 formas — 15 blocos densos)
ele esgotava as 40 tentativas e imprimia `não consegui desfazer um combo inicial`. O jogo
resolveu na cena, com passes que **reconferem o conjunto inteiro** a cada rodada
(`GameScene._evitarComboDeGraca`), e isso também evita o segundo problema: `todas()` mexeria em
peças que já estão na tela, trocando a forma de um bloco debaixo do olhar da criança.

**Previsão que não se cumpriu, e vale registrar por quê.** Estava escrito aqui que o Jogo das
Cores precisaria do mesmo conserto, com vizinhança de 8. Ele **não precisa de nenhum**: no Jogo
das Formas um grupo que se toque resolve sozinho, então o tabuleiro inicial dava pontos que a
criança não fez; no Jogo das Cores o caminho é DESENHADO por ela e nada acontece sem gesto, de
modo que não existe ponto de graça a evitar.

O que aquele jogo precisou foi do **problema simétrico**, que ninguém tinha previsto: tabuleiro
que nasce ou é reposto **sem nenhuma jogada possível** (`garantirJogada`). Medido em 76% das
partidas de 8 cores — ver `REGRAS-JOGO-DAS-CORES.md`, seção 10-A. A lição não é sobre grade:
é que a mecânica decide qual das duas patologias o tabuleiro tem, e supor a do jogo anterior
custou um defeito encontrado em jogo real em vez de em medição.

## Áudio

| Peça | Estado | Observação |
|---|---|---|
| Canais music / sfx / speech | Pronto | Fila de narração serializada |
| Destravamento por gesto | Pronto | Chamado no primeiro toque |
| Todo som vindo de arquivo | Pronto | **Regra travada por teste.** O motor não sintetiza voz nem gera tom: faltando a gravação, a tela fica em silêncio e o console nomeia o arquivo que falta |
| Nenhum som sobrevive à sua tela | Pronto | O `Game` corta fala e efeito em toda troca de cena (`AudioBus.encerrarDaTela`), e a MÚSICA não — ela é do jogo, não da tela. Cobre também a corrida do som pedido antes do corte que só ia começar depois. Verificado nos dois sentidos: com a correção desligada, três efeitos atravessam para o menu; cortando tudo, a música recomeçaria a cada botão e o teste reprova |
| Música com um dono só | Pronto | Começa no primeiro gesto, comandada pelo `Game`, e nenhuma cena mexe nela. Eram QUATRO donos (o `MenuScreen` e a partida de cada jogo), e o Jogo das Formas ainda a parava ao sair — só nele a música recomeçava ao voltar ao menu, desigual entre jogos da mesma coleção. O teste compara a IDENTIDADE da fonte antes e depois da troca, porque contar fontes não distingue "continuou" de "recomeçou" |
| Legenda do áudio narrado | **Planejado** | O evento `narracao` já entrega `{ id, texto }` a cada fala; falta só a camada visual |

## AVA

| Peça | Estado | Observação |
|---|---|---|
| `AvaBridge` | Pronto | Coberto por teste de unidade e por verificação em navegador com iframe real |
| Disparo por borda | Pronto | Sem duplicata; replay conta |
| Registro de derrota | Pronto | Decisão do projeto: derrota também é tentativa |
| `vitoria` na mensagem | Pronto | Booleano de verdade. Os quatro números não distinguiam "14 de 20" de "14 de 14" |
| `ajuda` na mensagem | Pronto | Inteiro, CONTADO pelo motor a cada abertura da ajuda (`Game.registrarAjuda`), zerado a cada partida. Contagem e não sim/não: `> 0` responde "precisou?" e o número diz quanto. Ler a ajuda não entra no `tempoSegundos` — a ajuda pausa a partida |
| `tempoSegundos` na mensagem | Pronto | Inteiro, medido pelo MOTOR (`Game._tempoJogando`) e por nenhum jogo. Conta tempo JOGANDO: pausa não conta (verificado — 2 s de pausa somam 0,00 s), aba escondida não conta, e zera a cada partida nova. Usa o mesmo `dt` da barra de tempo, então bate com o cronômetro que a criança viu |
| Registro de abandono | **Planejado** | Hoje sair no meio não registra nada — igual ao original |
| Partida com adversário | **Não decidido** | `acertos`, `erros` e `totalPerguntas` descrevem a tentativa de UM aluno. Numa partida de dois humanos (**Jogo da Velha**) ou contra a CPU (**Jogo CDU**), quem é o aluno registrado? **Decide o humano, e vem antes do código** — as três saídas plausíveis estão na Parte 3 |

## Ferramentas

| Ferramenta | Estado |
|---|---|
| `tools/testes.mjs` (lógica) | Pronto — núcleo, contrato do AVA e a regra de "todo som sai de arquivo" |
| `tools/teste-navegador.mjs` (ponta a ponta) | Pronto — todas as telas, partida vencida e perdida, iframe real em três tamanhos |
| `tools/teste-entrega-avulsa.mjs` (publicação) | Pronto — o jogo servido de fora do projeto, numa subpasta profunda |
| `tools/build.mjs` | Pronto |
| `tools/new-game.mjs` | Pronto |
| `tools/serve.mjs` | Pronto |
| `tools/verificar-independencia.mjs` | Pronto |
| `tools/ava-teste.html` | Pronto |

---

## O que construir antes de cada próximo jogo

| Próximo jogo | O que o motor precisa ganhar antes |
|---|---|
| ~~**Jogo das Formas**~~ | **Feito.** Estreou `GridBoard`, `TimerBar` e o modo colunas do `CraneController` |
| ~~**Jogo das Cores**~~ | **Feito.** `Input.arrastar` contínuo e o `PathSelector`; e foi ele que obrigou o `GridBoard` a ganhar `garantirJogada` |
| **Jogo CDU (`jogo-cdu`)** | **Entrada numérica** e **turnos com adversário** — nenhum dos dois existe no motor |
| **Chave Mágica (`jogo-da-chave-magica`)** | **Arrastar e SOLTAR num alvo**, com devolução ao errar — o motor arrasta, mas não solta em lugar nenhum. E **fases dentro de um nível** |
| **Jogo da Velha (`jogo-da-velha`)** | **Dois jogadores no mesmo aparelho** e **empate** — e, antes do código, uma decisão de contrato: quem é o aluno registrado |

---

# Parte 3 — Os três jogos novos e o que eles pedem do motor

Chegaram em `Aulas para Refazer/` três jogos que **não são as aulas de 2013**: são HTML + CSS + JS
modernos, com `DESIGN.md`, da série **Numerandus**. Isso muda a natureza do trabalho — não há
Flash para escavar; há um jogo que já funciona, e a pergunta passa a ser o que preservar dele.

O que foi medido **lendo o código dos três** (o `DESIGN.md` não serve para isso — ver abaixo):

| | Jogo CDU | Chave Mágica | Jogo da Velha |
|---|---|---|---|
| JS | 578 linhas + 277 de tutorial | 754 + 299 de tutorial | 190 |
| Palco | DOM/CSS, contêiner de 950×660 | DOM/CSS com SVG gerado em JS | DOM/CSS |
| Entrada | **teclado** — digitar o número | **arrastar e soltar** | clique na célula |
| Tempo | 20 s por rodada | 20/15/15 s por fase; 90 s no nível 2 | nenhum |
| Vidas | não tem | 3 | não tem |
| Som | nenhum | 4 MP3 tocando, 6 na pasta | nenhum |
| Tutorial | sim, no 1º acesso (`localStorage`) | sim, e **por botão durante a partida** | não tem |
| Registro no AVA | **nenhum** | **nenhum** | **nenhum** |

**Nenhum dos três fala com o AVA.** Não existe um `postMessage` nas 2.098 linhas somadas — é
exatamente a mesma lacuna das três aulas de 2013, e é o motivo de o motor existir.

**Os três `DESIGN.md` são o MESMO arquivo** (md5 `44e449d1…`): são as diretrizes da série — paleta,
tipografia `Fredoka`, o contêiner de 950×660, as animações — e **não descrevem jogo nenhum**. Duas
consequências práticas: as regras de cada jogo **só existem no código**, e o documento fala de
**2º ano** enquanto a pasta do CDU se chama `Jogo_CDU_1ano`. Qual é a faixa precisa ser conferido
antes de refazer qualquer um: o motor de hoje é calibrado para **4 a 7 anos**, e é dessa faixa que
vêm a CAIXA ALTA (RE-01) e os pisos de alvo tocável.

## 1. Jogo CDU — valor posicional, contra a CPU

**O que é.** Quatro rodadas. A criança lança cubinhos que caem nas três zonas — Centenas, Dezenas
e Unidades —, lê quantos há em cada uma e **digita o número** em 20 s. Acertou, o valor entra no
seu total; errou, o campo treme e ela tenta de novo, **sem limite de tentativas**; esgotou o
tempo, a rodada vale 0. Depois a CPU lança, e ao fim das quatro rodadas ganha o maior total.

**A CPU não responde nada** — ela sorteia e soma. O adversário é sorte pura: a criança pode acertar
as quatro rodadas e perder. Isso é o primeiro ponto a decidir, e é pedagógico antes de ser código.

Medido: o sorteio é `Math.random() * 6`, ou seja **0 a 5 cubinhos por zona** (número máximo 555),
embora o comentário logo acima diga "0 a 9". Não é errata a corrigir sem perguntar — contar 9
cubinhos numa zona é outra tarefa que contar 5, e a escolha entre as duas é da aula.

**O que falta no motor**

1. **Entrada numérica.** Os três jogos atuais são só toque: não há campo de texto nem teclado. As
   saídas não são equivalentes e a escolha é de projeto. Um `<input>` do DOM sobre o canvas traz o
   teclado virtual do tablet, que **redimensiona a viewport** e mexe com a caixa de letterbox do
   `Stage`. Um teclado desenhado no canvas custa dez alvos de 44 px dentro dos 1280×720 — cabe, mas
   come área de jogo. Escolher entre números em cartões seria mais barato, e **muda a habilidade**:
   escrever 342 não é a mesma coisa que reconhecer 342 entre quatro opções.
2. **Turnos com adversário.** `ScoreSystem` é de um jogador só — uma meta, `acertos`, `erros`,
   `vidas`. Dois placares e alternância de vez não existem, e o AVA não tem onde pôr o placar da
   CPU (ver "Partida com adversário" na tabela do AVA).
3. **Cronômetro por rodada.** `TimerBar` mede a partida (120 s no Formas). Aqui são 20 s por
   pergunta, reiniciando quatro vezes.
4. **Tentativa sem limite.** Repetir até acertar é bom — é o mesmo espírito do "erro não avança o
   símbolo" do Blocos, o jogo ensina em vez de só medir. Mas `erros` cresce sem teto enquanto
   `totalPerguntas` é 4, que é precisamente a questão aberta registrada na **RE-03**.

## 2. Chave Mágica — discriminação visual de perfis

**O que é.** Chaves com cabeça (4 formatos) e dentes (1 dente na fase 1, 2 nas seguintes). A
criança arrasta cada chave até o molde igual (nível 1) ou até o cadeado certo (nível 2). Medido:
fase 1 = 3 chaves em 20 s, fase 2 = 4 em 15 s, fase 3 = 5 em 15 s, nível 2 = 8 cadeados em 90 s;
3 vidas, e errar custa uma.

**Ele já chegou sozinho à RE-05**, e isso vale registrar: tem um botão de tutorial flutuante
durante a partida, o arrasto fica bloqueado enquanto o tutorial está aberto, e ao abrir ele
**para o cronômetro** (`clearInterval(timerInterval)`) e o retoma ao fechar. Outra pessoa, em outro
projeto, decidiu que reler a regra não pode custar a partida nem o tempo. A regra do motor não
saiu do nada.

**O que falta no motor**

1. **Arrastar e SOLTAR num alvo.** O motor arrasta (`Input.arrastar`, usado pelo caminho do Jogo
   das Cores) mas nada é solto em lugar nenhum: não há alvo de soltura, nem busca do **alvo mais
   próximo dentro de um raio** (o protótipo usa 85 px no nível 1 e 70 no nível 2), nem a devolução
   animada quando a chave erra o molde. É componente novo a projetar, e é o que este jogo pede.
2. **Fases dentro de um nível.** `config.niveis` é uma lista plana. Aqui é um nível com três fases,
   com tela de transição entre elas ("Fase 2 concluída"), e o nível 2 é outro jogo. Falta a
   estrutura e falta a tela.
3. **A conta de estrelas dele se descarta.** O protótipo calcula 3 estrelas por vidas e erros; no
   motor a fileira é de cinco e quem calcula é a tela de resultado, pelo percentual da meta
   (**RE-04**).
4. **O áudio não pode vir como está.** Quatro dos seis MP3 tocam. O de vitória é jingle de
   videogame — material de terceiros, reconhecível. Os outros dois arquivos da pasta são memes
   (bordão de programa de TV e "você não tem aura") e **não tocam**: um deles chegou a ser ligado
   ao tempo esgotado e está comentado. Vale saber por que: um meme de deboche como som de erro
   ri da criança que errou, na faixa em que errar já custa caro. A regra do motor é todo som vir de
   arquivo **com origem declarada** — a tabela de assets de cada README —, e nenhum desses tem
   origem que se possa declarar.

## 3. Jogo da Velha — e a pergunta que ele faz ao contrato

**O que é.** Três por três, X vermelho contra O azul, **dois humanos no mesmo aparelho**, oito
linhas vencedoras, placar de vitórias e empates acumulado na sessão, modal no fim. Sem tempo, sem
vidas, sem som, sem tutorial, sem CPU. São 190 linhas — o menor dos três, e o mais bem resolvido
no que faz.

E **não tem matemática nenhuma**: numa série chamada Numerandus, é o único sem número. O que ele
treina é antecipar a jogada do outro. Não é defeito; muda o que se pode registrar.

**O que falta — e o que precisa ser decidido antes**

1. **Dois jogadores, e o AVA registra UM aluno.** `acertos`, `erros` e `totalPerguntas` descrevem a
   tentativa de um estudante. Numa partida de dois, quem é o aluno? Se os dois são da turma, seriam
   dois registros, e o AVA não sabe disso. **É decisão de contrato, não de código, e vem primeiro.**
   Três saídas plausíveis, nenhuma obviamente certa: (a) virar jogo contra a CPU, e o aluno é o
   humano; (b) manter dois jogadores e registrar só o lado A; (c) não registrar nada, e a aula ser
   recreação declarada.
2. **Empate.** `ScoreSystem` emite `vitoria` e `derrota`, e `vitoria` no AVA é booleano. Empate não
   existe em nenhum dos dois — e no jogo da velha entre dois jogadores parelhos o empate é o
   resultado **mais comum**, não a exceção.
3. **CPU.** O motor não tem adversário. E a força dela é decisão pedagógica: o jogo da velha ótimo
   nunca perde, então uma CPU perfeita ensina a desistir.
4. **Linha vencedora.** `GridBoard` acha grupos por conectividade e tipo; as oito linhas de três
   são outra consulta — pequena, mas não existe.
5. **Placar entre partidas.** O protótipo acumula X, O e empates na sessão. O motor registra **uma**
   partida por vez no AVA (a borda de `RESULTADO`); "melhor de cinco" seria outra coisa a decidir.

## O que os três pedem, em ordem

| Ordem | O que | Para quem | Por que primeiro |
|---|---|---|---|
| 1 | **Decidir o aluno na partida com adversário** | Velha, CDU | Sem isso, o registro no AVA de dois dos três jogos não tem forma. É decisão do humano |
| 2 | **Arrastar e soltar num alvo** | Chave Mágica | Componente autocontido, sem pergunta pendente: dá para construir e testar hoje |
| 3 | **Turnos e empate** | Velha, CDU | Depende de (1) |
| 4 | **Entrada numérica** | CDU | Depende de escolher entre teclado do sistema, teclado no canvas e cartões — e a escolha muda a habilidade avaliada |
| 5 | **Fases dentro de um nível** | Chave Mágica | O jogo funciona sem: as fases podem virar três níveis. Só então vale a estrutura |

Os três são **DOM/CSS**; o motor é canvas com 1280×720 e caixa segura medida. Refazer significa
**reconstruir no motor**, não embrulhar o protótipo — e o ganho é o mesmo das outras três aulas:
`postMessage` que existe de verdade, toque que funciona em tablet, tempo por delta, som com dono
único e ajuda sem perder a partida.

Detalhes de pasta a acertar quando entrarem no projeto: `Jogo_da_chave _magica` tem um espaço a
mais no nome, `Jogo_CDU_1ano/Jogo_CDU_1ano/` está aninhada duas vezes, e o slug do motor é
minúsculo com hífen (`jogo-da-chave-magica`), porque ele vai no campo `jogo` da mensagem do AVA.
