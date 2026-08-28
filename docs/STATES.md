# STATES.md — estados do jogo e maturidade do motor

Duas coisas neste documento:

1. **A máquina de estados** que todo jogo do motor segue — e onde exatamente o registro
   no AVA acontece.
2. **O estado de maturidade do motor** — o que está pronto, o que é provisório e o que
   ainda não existe. Serve para decidir o que construir antes do próximo jogo.

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

## Núcleo

| Peça | Estado | Observação |
|---|---|---|
| `Emitter`, `Matrix2D`, `Node` | Pronto | Hit-test com matriz inversa validado em teste |
| `Stage` (escala + letterbox) | Pronto | Validado em iframe de 400×700, 640×480 e 1280×720 |
| Giro em aparelho de pé | Pronto | O CSS gira `#palco`, o `Stage` detecta e inverte o mapa tela→lógico. Medido: desperdício de tela cai de 75% para 20% num celular de 360×720. Coberto por teste de unidade e por um toque real, no pixel real, com o palco girado |
| Jogada travada sem saída | **Coberto** | Todo jogo tem uma fase em que o toque é ignorado de propósito, e quem a libera é sempre um `chamar` no fim de uma cadeia de `Tween` — que `Tween.chamar` pode perder engolindo uma exceção. O `Watchdog` do motor vigia a invariante "ciclo em curso ⇒ tween vivo no alvo" e devolve a jogada em meio segundo; se travar de novo, a partida encerra com os pontos feitos. Ligado nos dois jogos, com injeção de falha no portão de jogabilidade |
| Alvo tocável em celular | **Parcial** | O mínimo de 64 px é garantido em espaço LÓGICO, e a escala do Stage o reduz a 32–36 px físicos em celular — abaixo do piso de 44 px do WCAG 2.5.5. **O motor continua sem mecanismo próprio**; o que existe é a saída por LAYOUT, feita no Jogo das Formas: o HUD virou coluna lateral e a célula subiu de 64 para 80, o que dá 40 px físicos (+25%). O que governa isso é a fração da ALTURA que o alvo ocupa — alargar a tela não muda nada, e por isso "área visível adaptativa" (abaixo) NÃO resolve este item. Cruzar os 44 px pede reduzir uma linha da grade, que é decisão de jogo |
| Área visível adaptativa | **Planejado** | Sobram ~20% de barra num celular 20:9 e ~25% num iPad deitado, porque o jogo é 16:9 fixo. Exige o `Stage` expor um retângulo visível maior que a caixa segura e o `Background` pintar até a borda dele |
| `Input` (Pointer Events) | Pronto | `toque` só dispara se apertar e soltar no mesmo nó. `arrastar` é contínuo no nó pressionado — é o que o caminho do Jogo das Cores usa |
| `PathSelector` | Pronto | O caminho por vizinhas iguais, com corte do rabo e os dois gestos (arrasto e toque). 18 testes de unidade; estreia no Jogo das Cores |
| `Tween` | Pronto | Encadeamento, espera, laço e cancelamento por alvo |
| `Loader` | Pronto | Falha de recurso não derruba o jogo. `imagem(null)` devolve null em silêncio — pedir sem id é o jogo dizendo "não tenho arte para isto", e avisar ali enchia o console de toda partida |
| `Storage` | Pronto | Cai para memória se o localStorage for bloqueado |
| `Rand` | Pronto | Semente opcional para reproduzir partidas |
| `Scene` / `Game` | Pronto | Limpeza automática de nós e ouvintes |
| Multi-toque | **Planejado** | Hoje um ponteiro por vez; nenhum jogo atual precisa |

## Tema e interface

| Peça | Estado | Observação |
|---|---|---|
| `tokens.js` / `tokens.css` | Pronto | Fonte única compartilhada entre canvas e DOM |
| `icons.js` | Pronto | 16 ícones; ampliar conforme necessidade |
| `Button` / `IconButton` | Pronto | Alvo mínimo de 64px garantido no construtor |
| `Panel`, `ScoreBar`, `TimerBar`, `Lives` | Pronto | `TimerBar` estreou no Jogo das Formas: 120 s por delta, cor mudando a 35% e a 15% e pulso no trecho crítico |
| `SoundToggle` | Pronto | Preferência persistida |
| `Mascot` | Pronto | Dois modos: imagem do jogo (usado no piloto) ou coruja vetorial (padrão) |
| Expressão facial por imagem | **Planejado** | `imagensPorExpressao` existe na API, sem arte que a exercite |
| `Background` | Pronto | Três temas: `campo`, `construcao` e `formas` (degradê indigo→ciano com formas em camadas). O tema vem de `config.tema` |
| Tema por jogo | **Parcial** | O CENÁRIO e a PLACA do título já variam por jogo (`config.tema`), e o Jogo das Formas estreou o tema `formas`. A PALETA continua uma só: botão, cartão de nível e painel são iguais nos dois jogos — de propósito, para as aulas seguirem sendo a mesma coleção. Falta variar mascote e maquinário, que hoje são o mesmo arquivo e o mesmo desenho nos dois |
| Dica "gire o aparelho" | Pronto | Fora do `#palco` de propósito: dentro dele giraria com o jogo e só seria legível depois de o aparelho ser virado. Não intercepta toque e se apaga sozinha. **Não é narrada** — falta gravação |

## Telas padrão

| Tela | Estado | Observação |
|---|---|---|
| `LoadingScreen` | Pronto | HTML, aparece antes do motor existir |
| `MenuScreen` | Pronto | JOGAR + COMO JOGAR + som |
| `TutorialScreen` | Pronto | Passos narrados, ilustração animada, navegação |
| `LevelSelectScreen` | Pronto | Aparece sozinha só quando há mais de um nível |
| `PauseScreen` | Pronto | Camada sobreposta |
| `ResultScreen` | Pronto | Vitória e derrota; **cinco estrelas** pelo percentual da meta, calculadas pela própria tela (RE-04); placar na unidade (RE-03); cenário do tema do jogo |
| Tela de créditos / objetivo | **Planejado** | Útil ao professor; não pedida ainda |

## Jogabilidade

| Peça | Estado | Observação |
|---|---|---|
| `ScoreSystem` | Pronto | Fonte única dos números do AVA |
| `CraneController` | Pronto | Modo oscilante validado no piloto; **modo colunas estreou** no Jogo das Formas. O ciclo vertical (descer, pegar, subir) NÃO é dele: é `Tween` na cena, e vale saber disso antes de planejar o próximo jogo de guindaste |
| `GridBoard` | Pronto | **Estreou** no Jogo das Formas (conectividade de 4, gravidade `cima`, cascata) e ganhou no Jogo das Cores `tipoDe`, `trocar`, `embaralhar` e `garantirJogada` — tabuleiro sem jogada possível, medido e tratado. Dois limites conhecidos: não tem operação de deslocar a grade inteira uma linha (a linha nova mora na cena), e `desfazerCombosIniciais` resolve num passe só sem reconferir as peças já vistas — ver abaixo |
| `PathSelector` | Pronto | **Estreou** no Jogo das Cores: o caminho desenhado pela criança, arrasto e toque, vizinhança vinda da grade. 18 testes de unidade |
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
| Legenda do áudio narrado | **Planejado** | O evento `narracao` já entrega `{ id, texto }` a cada fala; falta só a camada visual |

## AVA

| Peça | Estado | Observação |
|---|---|---|
| `AvaBridge` | Pronto | Coberto por teste de unidade e por verificação em navegador com iframe real |
| Disparo por borda | Pronto | Sem duplicata; replay conta |
| Registro de derrota | Pronto | Decisão do projeto: derrota também é tentativa |
| Registro de abandono | **Planejado** | Hoje sair no meio não registra nada — igual ao original |

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
| **Jogo das Cores** | **Arrasto contínuo** no `Input` (selecionar vários blocos num gesto) — é o que hoje não existe |
