# Checklist — Jogo da Velha

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `jogo-da-velha-novo` · Criado em: 2026-09-03 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase (o que a criança aprende ou treina)
- [x] Faixa etária confirmada e coerente com o design (alvos, leitura, ritmo) — herdada do
      motor (4 a 7 anos); nenhuma leitura exigida além do tutorial narrado
- [x] Mecânica descrita em até 3 frases (ver README.md, "O que é")
- [x] Níveis definidos: **três** — Fácil, Médio e Difícil. Não mudam conteúdo (não há números
      nem letras neste jogo), mudam só a força da CPU (`chanceDeErroCPU`: 0.6 / 0.3 / 0). Em
      todos ela nunca desperdiça uma vitória própria; mesmo no Difícil ela é batível por um
      "garfo" (duas ameaças ao mesmo tempo), porque só reage a uma ameaça por vez
- [x] Condição de **vitória** definida e mensurável: o aluno fecha uma das 8 linhas com a
      própria cor (escolhida na tela `EscolhaCorScreen`, antes da partida)
- [x] Condição de **derrota** definida: a CPU fecha uma linha antes do aluno, com a outra cor.
      Também existe **empate** (tabuleiro cheio sem linha), terceiro desfecho não coberto por
      este item — ver seção 5
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (frases de instrução seguem em caixa normal; `TextNode` aplica a caixa sozinho)
  - [x] RE-02 — a nota da partida desconta o erro **na vitória**, nunca na derrota
        (a cena usa `placar.paraAva()`; conferido lendo `ScoreSystem` — com meta 10 e
        `pontosPorAcerto: 10` o desconto nunca chega a aparecer na prática — uma vitória fecha a
        meta inteira de uma vez —, mas o caminho é o mesmo dos outros jogos)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("10 PONTOS"/"0 PONTOS"), não
        "10 de 10" — pedido do humano para não ler "1 PONTO" numa partida de resultado único
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida (SVG/vetorial ou desenhada no canvas) e coerente com o design system —
      tabuleiro e casas desenhados no canvas; marcas vermelha/azul reaproveitadas do protótipo
      original (`assets/img/x.png`/`o.png`, ids `pecaVermelha`/`pecaAzul` — o jogo não fala em
      X/O em lugar nenhum, nem no fallback vetorial quando a imagem falha: é sempre um círculo
      chapado na cor certa, nunca um traço em forma de X ou O)
- [ ] ~~Áudio de narração presente para **todo** conteúdo falado do jogo~~ — **pendente**:
      nenhuma gravação nesta entrega (ver `README.md`)
- [ ] ~~Efeitos de acerto, erro e clique presentes~~ — **pendente**, mesmo motivo
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [ ] ~~Ficha de transcrição criada para cada áudio~~ — não se aplica: nenhum áudio existe
      ainda para transcrever
- [ ] ~~Transcrições confirmadas ouvindo~~ — não se aplica, mesmo motivo
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR — tema 'quadro' próprio (placa em forma de mini
      quadro-negro, `PlacaTituloQuadro` em `engine/screens/MenuScreen.js`), **sem mascote**
      (pedido do humano: `mascote: { telas: [] }` tira a coruja vetorial padrão de TODAS as
      telas, não só do menu) — conferido em captura de tela nesta sessão
- [x] **Tutorial** com passos ilustrados e puláveis — **narração pendente** (ver seção 2): os 3
      passos existem e desenham o tabuleiro de exemplo, mas ficam em silêncio até haver gravação.
      Reescrito para nunca mencionar X ou O (fala em "sua cor"/"a cor do computador", sem cravar
      qual é qual — a cor do aluno só é decidida na partida) e para "EM UMA" em vez de "NUMA"
      (pedido do humano)
- [x] **Seleção de nível** (`LevelSelectScreen`, herdada do motor) — três cartões (Fácil/verde,
      Médio/âmbar, Difícil/vermelho), conferida em captura de tela nesta sessão; a descrição do
      nível Fácil precisou ser encurtada porque estourava para dentro do cartão do Médio — o
      componente não quebra linha nem corta texto sozinho, então a descrição tem de caber
- [x] **Escolha sua cor** (`EscolhaCorScreen`, própria deste jogo — não é tela padrão do motor):
      dois cartões, vermelho e azul, entre a seleção de nível e a partida. `GameScene.aoEntrar()`
      redireciona para cá quando `this.game.dados.corAluno` ainda não existe, e volta para
      'jogando' já com a cor escolhida — nem `MenuScreen` nem `LevelSelectScreen` precisaram
      mudar. Um "jogar de novo" reaproveita a cor da partida anterior, sem perguntar de novo
      (mesmo comportamento que o nível já tem)
- [x] **Partida** com HUD legível: indicador de vez ("SUA VEZ"/"VEZ DO COMPUTADOR") em texto
      grande, ícones de pausa/ajuda — sem barra de progresso (a partida tem um resultado só, não
      pontuação corrente) e sem cronômetro (decisão de layout, ver seção 6)
- [x] **Pausa** com continuar / recomeçar / sair (herdada do `PauseScreen` padrão)
- [x] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial POR CIMA do jogo,
      a partida continua atrás e voltar a devolve intacta — placar e tabuleiro
  - [x] O tempo NÃO corre enquanto a ajuda está aberta (`pausada = true`, mesmo padrão dos
        outros três jogos — comportamento do motor, não específico deste jogo)
  - [x] Os passos do `config.tutorial` fazem sentido para quem JÁ está jogando e travou, não
        só para quem nunca viu o jogo — são os mesmos passos nas duas telas
- [x] **Resultado** para vitória, derrota **e empate** (terceiro estado novo — ver seção 5 e
      `engine/screens/ResultScreen.js`) — os três testados de ponta a ponta num navegador real
      nesta sessão (headless, via CDP): vitória e derrota jogadas de verdade, empate chamado
      diretamente; nenhum erro de JS nos três, payload conferido nos três
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu (herdado do motor)

## 4. Mecânica

- [x] Regras implementadas conforme a definição (8 linhas vencedoras, CPU nunca desperdiça
      vitória própria, bloqueia ~65% das vezes no Médio, empate no tabuleiro cheio)
- [x] **Achado nesta sessão, registrado para quem mexer aqui de novo:** `GameScene.aoEntrar()`
      não pode chamar `this.irPara('escolhaCor', …)` de forma síncrona quando falta a cor — ele
      roda DENTRO do `irPara('jogando', …)` que já está trocando de cena, e `Game._trocando`
      (a trava de reentrância do motor) ainda está `true` até esse `irPara` terminar. Uma
      chamada síncrona ali batia na trava e não fazia nada — a cena ficava vazia, sem tabuleiro e
      sem redirecionar, um defeito medido só jogando de verdade num navegador, nunca nos testes
      de unidade. A correção foi adiar com `Promise.resolve().then(() => this.irPara(...))`, que
      roda depois do `finally` do `irPara` de fora (ele não tem nenhum `await` depois de chamar
      `aoEntrar()`, então um microtask já é tarde o bastante)
- [x] Feedback **imediato** de acerto (visual: a marca aparece com animação de escala; som:
      pendente, ver seção 2)
- [x] Feedback **imediato** de erro — não se aplica no sentido usual (não há "toque errado":
      uma casa ocupada simplesmente ignora o toque, sem penalidade; a derrota real é a CPU
      fechar uma linha, com o mesmo destaque estável da linha vencedora)
- [x] Dificuldade testada de verdade: jogado uma partida forçando a CPU a nunca bloquear
      (vitória do aluno) e uma partida sem ameaça nenhuma (derrota) nesta sessão — ver seção 7
- [x] Nenhum estado travado: sempre dá para agir ou a partida termina
  - [x] A fase travada (`this.travado`, durante a "vez de pensar" da CPU) tem um **`Watchdog`**
        ligado no `atualizar(dt)`, depois do desvio da pausa
  - [x] A invariante do `vivo` (`Tween.temAtivo(this)`) foi conferida contra o padrão já validado
        pelos testes de unidade do `Watchdog` (`tools/testes.mjs`); não foi provocada uma falha
        de verdade nesta sessão (não há injeção de falha específica deste jogo, ao contrário do
        Jogo dos Blocos) — ficou **pendente** como possível melhoria futura
- [x] Reiniciar limpa todo o estado: `aoEntrar()` recria `tabuleiro`, `placar` e as 9 células do
      zero a cada entrada em 'jogando'

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | a partida em si, valendo 10 (`meta: 10`) — vencer é o único "ponto" possível, e vale a meta inteira de uma vez (`pontosPorAcerto: 10`), não "1 ponto" | `10` |
| `acertos` | 10 se o aluno fechou uma linha com a própria cor, 0 se não (derrota ou empate) | `0` ou `10` |
| `erros` | 1 se a CPU fechou uma linha antes, 0 caso contrário (inclui empate) — **não** escalado por 10, é contagem de falhas, não pontuação | `0` ou `1` |
| `nivel` | 1, 2 ou 3, conforme o nível de dificuldade escolhido (Fácil/Médio/Difícil) — não é mais sempre 1, desde que o jogo ganhou três níveis | `1`, `2` ou `3` |
| `jogo` | slug estável | `jogo-da-velha-novo` |
| `extras.empate` | **campo novo deste jogo**: `true` só quando o desfecho é empate (tabuleiro cheio, sem linha). `vitoria` continua `false` nesse caso — o contrato não ganha 3º valor no campo binário; a `ResultScreen` lê `extras.empate` para escolher a tela | ausente, ou `true` |

- [x] Existe **um único** ponto de fim de partida — dois caminhos, mesma forma:
      `_terminar(venceu)` (vitória/derrota, via eventos do `ScoreSystem`) e `_terminarEmpate()`
      (empate, chamada direta); os dois guardados por `this._fimResolvido` para nunca disparar
      duas vezes
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (garantido pelo `AvaBridge`, não pela cena)
- [x] `acertos`/`erros` são da **partida inteira** — aqui coincide com "da única jogada que
      importa", porque a partida É uma decisão só (venceu/perdeu/empatou)
- [x] `totalPerguntas` reflete a meta real do nível jogado (`meta: 10`, mesma para os três níveis
      — o que muda entre eles é a força da CPU, não a meta)
- [x] `nivel` é sempre enviado, nunca nulo (1, 2 ou 3, de `config.niveis[i].id`)
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number` (garantido pelo `AvaBridge`, testado em `tools/testes.mjs`)
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window`
      (comportamento do motor; conferido nesta sessão — "fora de iframe, o jogo NÃO envia
      postMessage" passou no `teste-entrega-avulsa.mjs`)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Derrota também registra (`registrarDerrota: true`); testado nesta sessão — payload com
      `vitoria: false` recebido corretamente

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — as 9 casas têm **180×180**, bem acima
      do piso. Decisão deliberada de layout (pedido do humano): sem guindaste, cenário pesado
      nem barra de progresso disputando espaço, o tabuleiro domina o palco de 1280×720.
      Verificado em captura de tela nos três tamanhos que `docs/STATES.md` valida (1280×720,
      640×480, 400×700 retrato com giro real via emulação de toque) — o alvo físico em celular
      fica muito acima dos 44 px do WCAG 2.5.5, ao contrário da limitação **Parcial** registrada
      para os outros três jogos
- [x] Espaço suficiente entre alvos: 16 px lógicos entre casas, mais o cartão arredondado de
      cada uma (evita errar o dedo entre duas marcas próximas)
- [x] Contraste de texto e de elementos essenciais: rostinho vermelho (#DC2626) e rostinho azul
      (#2563EB) sobre cartão branco, contorno azul-escuro na grade; texto de vez com contorno
      escuro sobre o verde-quadro do cenário
- [ ] ~~Cor nunca é o único portador de significado~~ — **decisão deliberada em sentido
      contrário**: aqui a cor É o conteúdo por pedido do humano (o jogo não usa X/O nem qualquer
      outro símbolo distintivo — ver seção 2), então as duas marcas são o MESMO rostinho, só a
      cor muda. Cabe ao professor avaliar se algum aluno da turma precisa de um canal redundante
      (a arte já tem duas expressões de rosto ligeiramente diferentes entre si, mas não foi
      desenhada pensando nisso)
- [ ] ~~Nenhuma ação exige saber ler: tudo tem ícone e narração~~ — **parcialmente pendente**:
      o indicador de vez ("SUA VEZ"/"VEZ DO COMPUTADOR") é só texto, sem narração (áudio
      pendente) nem ícone equivalente; ver seção 2
- [ ] ~~Som pode ser desligado, e a preferência é lembrada~~ — herdado do `SoundToggle` do
      motor (mesmo em todo jogo), mas sem música/efeito ainda gravado não há o que silenciar
      de fato nesta entrega
- [x] Nada pisca de forma rápida ou repetitiva — decisão deliberada (pedido do humano): a "vez
      de pensar" da CPU é uma espera simples, sem elemento piscando; a linha vencedora fica com
      realce ESTÁVEL (cor sólida), nunca em flash

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa — 154 passaram, 0 falharam (inclui a regressão do
      `ResultScreen` para vitória/derrota comuns dos outros jogos)
- [x] `node tools/verificar-independencia.mjs numerandus/jogo-da-velha-novo` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/jogo-da-velha-novo` **aprovado** — 11 de
      11, incluindo as 2 imagens carregando e zero erros de JS
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa — conferido pelo
      `teste-entrega-avulsa.mjs` ("todos os recursos vieram de dentro da pasta do jogo")
- [x] Fluxo completo de telas percorrido, sem travar (menu → jogando → resultado, três vezes
      nesta sessão, sem recarregar)
- [x] **Escolha de cor:** entrar em 'jogando' sem `corAluno` redireciona de verdade para
      `EscolhaCorScreen` (bug de reentrância medido e corrigido nesta sessão — ver seção 4);
      escolher um cartão volta para 'jogando' já com a cor certa, e as imagens reais
      (`pecaVermelha`/`pecaAzul`) aparecem nas casas — nunca o fallback vetorial, testado
      explicitamente checando que as duas carregaram
- [x] **Vitória:** `resultado` chega com `{acertos:10, erros:0, totalPerguntas:10, vitoria:true}`
      — jogado de verdade (CPU forçada a não bloquear) num navegador headless real, com a cor
      escolhida na tela nova
- [x] **Derrota:** `resultado` chega com `{acertos:0, erros:1, totalPerguntas:10, vitoria:false}`
      — também jogado de verdade
- [x] **Empate:** terceiro desfecho, testado à parte — `resultado` chega com `vitoria:false` e
      `extras.empate:true`; tela mostra o 3º estado sem lançar exceção
- [x] **Replay:** as três partidas desta sessão, na mesma aba sem recarregar, geraram uma
      mensagem `[AVA] JOGO_CONCLUIDO` cada — sem duplicata e sem se perder entre elas. A cor
      escolhida na primeira partida foi reaproveitada nas duas seguintes sem perguntar de novo
      (mesmo comportamento que o nível já tem)
- [x] **Nenhum aviso de transição de estado incomum** no console durante todo o fluxo
      menu → níveis → escolha de cor → partida → resultado → jogar de novo — a `EscolhaCorScreen`
      reaproveita `ESTADOS.MENU` de propósito exatamente para isso (ver o comentário na classe)
- [ ] ~~`tools/ava-teste.html`: a mensagem chega ao pai~~ — a aba abre o jogo certo (conferido
      nesta sessão: rótulo, tooltip com o slug correto e URL aninhada corretos), mas o
      `postMessage` dentro do iframe do host **não foi verificado manualmente nesta sessão** —
      só a versão fora de iframe (que corretamente não envia). Pendente: abrir
      `tools/ava-teste.html` de verdade, escolher a aba do Jogo da Velha e conferir os avisos
      verdes da mensagem
- [x] Testado em três tamanhos (1280×720, 640×480, 400×700 retrato) sem cortar nem deformar —
      capturas de tela conferidas nesta sessão, incluindo o giro automático em retrato
- [x] Testado com **toque** — emulação de dispositivo (touch habilitado via CDP), não tablet
      físico; recomendado confirmar num tablet real antes de publicar
- [ ] ~~Testado após trocar de aba e voltar~~ — **não testado nesta sessão** (comportamento
      herdado do motor, igual aos outros três jogos, mas não confirmado especificamente aqui)

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [x] Este checklist com os itens fechados ou justificados (pendências reais marcadas como tal,
      não escondidas)
- [x] `node tools/build.mjs` rodado por último, para **todos** os jogos (motor atualizado nas
      quatro cópias, porque `engine/screens/ResultScreen.js` mudou na raiz)
- [x] Versão do motor conferida: v1.3.5 em `engine/version.json` dentro da pasta do jogo
- [x] Pasta copiada para **fora** do projeto, servida de uma subpasta profunda e testada —
      `node tools/teste-entrega-avulsa.mjs numerandus/jogo-da-velha-novo`, aprovado
- [ ] ~~Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar~~ — não feito
      nesta sessão; falta antes do envio real ao AVA
