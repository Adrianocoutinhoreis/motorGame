# Checklist — Jogo da Memória

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `jogo-da-memoria` · Criado em: 2026-09-15 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — ver `config.objetivo`: treinar memória
      de posição junto com grandezas e medidas (item ↔ unidade que a mede).
- [x] Faixa etária confirmada (4 a 7 anos) e coerente com o design (cartas grandes,
      sem leitura obrigatória para jogar — emoji carrega o significado do item).
- [x] Mecânica descrita em até 3 frases — ver "O que é" no `README.md`.
- [x] Níveis definidos: 3 níveis, cresce em pares por rodada (3/4/6) e categorias
      sorteadas simultaneamente (ver tabela no `README.md`).
- [x] Condição de **vitória**: todos os pares da rodada encontrados (sempre alcançável).
- [x] Condição de **derrota**: não existe — `registrarDerrota: false`, sem vidas. Errar um
      par só demora mais (decisão confirmada com o humano, ver seção 5 abaixo).
- [x] `src/config.js` preenchido por inteiro.
- [x] **Regras educacionais conferidas** (RE-01 a RE-05):
  - [x] RE-01 — `textoEmCaixaAlta: true`; todo conteúdo desenhado em `Carta` (item/unidade)
        já nasce em caixa alta nos dados (`CATEGORIAS`) e passa por `texto()` no desenho.
  - [x] RE-02 — **decisão explícita, não padrão**: confirmada com o humano antes de
        implementar (ver conversa de design). Uma tentativa errada (duas cartas que não
        combinam) é o PRÓPRIO mecanismo de um jogo da memória, não uma falha a punir — por
        isso `GameScene` nunca chama `placar.errar()`. `this._tentativasErradas` conta as
        tentativas só para o relatório (`erros` na mensagem final), escrito por FORA do
        `ScoreSystem`. `acertos` sai sempre CHEIO (igual à meta) numa vitória, mesmo padrão
        já usado no Encaixe Certo e no Jogo da Ordenação — mas aqui a justificativa é mais
        forte: descontar a nota puniria exatamente a tentativa-e-erro que o jogo treina.
  - [x] RE-03 — placar exibe a UNIDADE ("4 PARES", não "4 de 4") via
        `config.unidadePlacar: { singular: 'par', plural: 'pares' }`.
  - [x] RE-04 — estrelas calculadas pela `ResultScreen` a partir de `acertos`/
        `totalPerguntas` reais; `GameScene` nunca passa `estrelas`.

## 2. Assets

- [x] Arte 100% desenhada em canvas (`Carta` em `GameScene.js`) — verso decorativo,
      emoji + palavra (item) ou palavra (unidade), coerente com o design system do motor.
- [ ] Áudio de narração do tutorial — **pendência conhecida, ver README**: os brutos
      fornecidos não estão identificados por passo; não foram mapeados sem confirmação.
- [x] Efeito de "par encontrado" (`cartaCorreta`, arquivo PRÓPRIO deste jogo, criado
      pelo humano) e de vitória (`acertoSOS`, reaproveitado) presentes. Sem som de clique —
      mesma decisão do Encaixe Certo/Ordenação (som só onde é gameplay de verdade).
- [x] Efeito de erro (`erro`, `error.MP3`) presente — toca quando as duas cartas viradas
      não combinam. **Pendência:** ainda não foi ouvido (ver ficha), então não está
      confirmado que é um efeito neutro e não uma voz — ver README.
- [x] Todo asset está dentro de `assets/`, com caminho relativo.
- [x] Nenhuma fonte, imagem ou som vindo da internet.
- [x] Origem/licença de cada asset registrada no `README.md` (tabela "Assets").
- [x] Ficha de transcrição criada para os 3 áudios usados
      (`assets/audio-transcricao/acertoSOS/`, `.../cartaCorreta/`, `.../erro/`).
- [ ] Transcrições confirmadas: `acertoSOS` e `cartaCorreta` por natureza (sem fala — ver
      as fichas; `cartaCorreta` confirmado diretamente pelo humano que criou o arquivo).
      `erro` continua 🔴 NÃO VERIFICADA — falta ouvir.
- [x] Pendências de áudio ainda não mapeado listadas explicitamente no `README.md`.

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (telas padrão do motor, sem alteração).
- [x] **Tutorial** com 3 passos ilustrados (desenho animado em canvas) e puláveis. Sem
      narração ainda — ver pendência no README; o texto visual e o desenho carregam a
      explicação sozinhos por enquanto.
- [x] **Seleção de nível** (3 níveis: Fácil/Médio/Difícil).
- [x] **Partida** com HUD legível: progresso "X/Y pares" + tempo no mesmo badge, pausa e
      ajuda.
- [x] **Pausa** enxuta: CONTINUAR / COMEÇAR DE NOVO / SAIR (`mostrarSom: false`, o HUD
      atrás do véu já mostra o som).
- [x] **Ajuda** na partida (RE-05): mesmo `HelpScreen`/tutorial do menu, por cima da
      partida — tabuleiro, placar e cartas já viradas continuam intactos ao voltar.
  - [x] O tempo NÃO corre com a ajuda/pausa aberta: `Tween.pausarTodos()`/`retomarTodos()`
        em `_pedirAjuda`/`_pausar` e nos `aoFechar`/`aoContinuar`, e o relógio do HUD só
        avança lendo `this.game.tempoJogando` (que o motor já pausa).
  - [x] Os 3 passos do tutorial servem tanto a quem nunca jogou quanto a quem travou no
        meio — mesma lista em `config.tutorial`, usada pelas duas telas.
- [x] **Resultado**: só vitória (jogo nunca tem derrota — quebra-cabeça de memória solo,
      sempre termina encontrando todos os pares).
- [x] Nenhum beco sem saída: pausa e resultado sempre voltam ao menu.

## 4. Mecânica

- [x] Regras implementadas conforme a definição: par por associação (mesma `categoria`,
      papéis diferentes item/unidade), sorteio sem repetir categoria na rodada.
- [x] Feedback imediato de acerto: borda verde estável nas 2 cartas + som (`cartaCorreta`).
- [x] Feedback imediato de erro: borda vermelha suave (só cor, sem tremor/piscar) + som
      (`erro`) por ~700ms, depois as cartas viram de volta sozinhas — sem tom punitivo
      (RE-02, decisão confirmada: nunca desconta a nota).
- [x] Dificuldade dos 3 níveis testada JOGANDO (não só configurada) — os 3 níveis foram
      jogados até o fim no playtest desta sessão (3, 4 e 6 pares), sem sobreposição de
      cartas mesmo com as 12 do Difícil (grade 3×4).
- [x] Nenhum estado travado: sempre dá para tocar uma carta livre, ou a partida termina.
  - [x] A fase "avaliando um par" (`this._avaliando`) tem um `Watchdog` ligado no
        `atualizar(dt)` — `ocupado: () => this._avaliando && !this.pausada`.
  - [x] `vivo` checa `Tween.temAtivo(this)` (o `esperar` da avaliação) OU das próprias
        cartas selecionadas (o flip de volta) — conferido que os alvos certos são
        observados durante a fase travada, não um substituto que nunca falharia.
- [x] Reiniciar (`aoReiniciar` da pausa) chama `irPara('jogando', …)` — o motor cria uma
      `GameScene` NOVA, então nenhum estado da rodada anterior sobrevive.

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

Mapeamento semântico **deste** jogo (preencha):

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | Pares da rodada (meta do nível) | 3, 4 ou 6 |
| `acertos` | Pares encontrados — SEMPRE cheio, igual à meta (RE-02 não se aplica aqui, decisão explícita, ver seção 1) | igual a `totalPerguntas` |
| `erros` | Tentativas com par ERRADO — só demonstrativo, nunca desconta | 0 em diante |
| `nivel` | Nível escolhido | `1`, `2` ou `3` |
| `jogo` | slug estável | `jogo-da-memoria` |

- [x] Existe um único ponto de fim de partida: `_terminar()`, chamado só pelo evento
      `placar.on('vitoria', …)`.
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (o motor escreve isso, não a cena).
- [x] `acertos`/`erros` são da partida inteira (acumulados em `ScoreSystem`/
      `_tentativasErradas`, não da última jogada).
- [x] `totalPerguntas` reflete a meta real do nível jogado (`this.nivel.meta`).
- [x] `nivel` é sempre enviado (`this.nivel.id`, nunca nulo — `aoEntrar` sempre resolve
      `this.nivel` a partir de `game.dados.nivel` ou do primeiro nível do config).
- [x] `jogo` usa o slug estável (`config.slug`, escrito pelo `AvaBridge`, não pela cena).
- [x] Os três números vão como `number` (`ScoreSystem.paraAva()` já garante isso).
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por
      `window.parent !== window` — comportamento do `AvaBridge`, não desta cena.
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado.
- [x] **Derrota não existe neste jogo** — `registrarDerrota: false`, decisão confirmada
      com o humano (mesmo padrão do Encaixe Certo/Ordenação): um jogo da memória solo sem
      vidas nunca "perde", só demora mais.

## 6. Acessibilidade

- [x] Todo alvo tocável (carta) tem no mínimo 64×64 px lógicos — mesmo no nível Difícil
      (12 cartas, grade 3×4), a carta calculada fica ~146×175px (`GameScene._montarTabuleiro`,
      `w = Math.max(w, 90)` é o piso, bem acima do mínimo).
- [x] Espaço suficiente entre cartas: `gap = 20` px fixo entre todas, em qualquer grade.
- [x] Contraste AA: cartas viradas são fundo branco com texto `#1E293B`/cor da categoria
      (paleta lúdica do motor, já conferida contra branco); verso é verde-escuro `#1B5E44`
      com contorno branco.
- [x] Cor nunca é o único portador de significado: acerto/erro têm cor DE BORDA (verde/
      vermelho), mas a informação central — se o par combina — está no CONTEÚDO da carta
      (item + unidade), não só na cor.
- [ ] Nenhuma ação exige saber ler: o ÍTEM tem emoji (não exige leitura), mas a
      carta-UNIDADE só tem palavra (ex. "LITRO") — criança que ainda não lê depende do
      emoji da carta-item pareada e da memória de posição, não do texto da unidade. É uma
      limitação intrínseca do conteúdo (grandezas e medidas são nomeadas por palavra, não
      há símbolo universal pra "litro"); mitigado por cor fixa por categoria (visível só
      quando as duas cartas já estão viradas) e pelo aprendizado do próprio vocabulário
      ser parte do objetivo pedagógico.
- [x] Som pode ser desligado (`SoundToggle` no HUD, componente padrão do motor).
- [x] Nada pisca: destaque de acerto/erro é cor de borda ESTÁVEL (nunca oscila), sem
      tremor/shake na carta — decisão de design explícita (ver comentário em
      `GameScene._avaliarPar`).

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa — 154 passaram, 0 falharam.
- [x] `node tools/verificar-independencia.mjs numerandus/jogo-da-memoria` **aprovado**.
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/jogo-da-memoria` **aprovado** — 11
      passaram, 0 falharam, 49 requisições todas locais à pasta do jogo.
- [x] Jogo abre por `node tools/serve.mjs` sem nenhuma requisição externa (confirmado pelo
      teste de entrega avulsa acima: todas as requisições vieram de dentro da pasta).
- [x] Fluxo completo de telas percorrido, sem travar — playtest via CDP nesta sessão: menu →
      tutorial (3 passos) → seleção de nível → partida → pausa/ajuda → resultado, nos 3
      níveis (Fácil/Médio/Difícil), mais uma 4ª partida extra. Zero exceção JS, zero
      `console.error` em toda a sessão.
- [x] **Vitória:** console mostrou `[AVA] JOGO_CONCLUIDO` nas 4 partidas jogadas, sempre
      com `acertos == totalPerguntas` (3/3, 4/4, 6/6, 3/3) e `erros`/`ajuda` batendo com o
      que foi de fato jogado (ex.: 1 tentativa errada proposital → `erros: 1`).
- [x] Não existe derrota — RE-02 confirmado como decisão consciente (seção 5 acima); nada a
      testar aqui.
- [x] **Replay:** 4 partidas seguidas sem recarregar geraram exatamente 4 mensagens — 1:1
      com o jogado, sem duplicata nem falta. (Uma reconexão CDP sobreposta, fora do fluxo
      normal de um único navegador, chegou a produzir 2 mensagens fantasmas antes de
      qualquer toque — investigado a fundo: não reproduziu em 2 tentativas seguintes com
      conexão única, e é artefato do arnês de teste, não do jogo. Ver relatório do
      playtest.)
- [x] **Sem duplicata:** ficar parado na tela de resultado não gera mensagem extra
      (comportamento do motor, não desta cena).
- [ ] `tools/ava-teste.html`: a mensagem chega ao pai e passa em todas as regras — não
      testado nesta sessão (só o `postMessage` isolado foi conferido via entrega avulsa).
- [ ] Testado em iframe pequeno/médio/grande sem cortar nem deformar — não testado nesta
      sessão (o teste de navegador genérico cobre o motor, não este jogo especificamente).
- [ ] Testado com toque real (emulador de dispositivo ou tablet real) — o playtest desta
      sessão usou clique simulado via CDP, equivalente a toque de mouse; toque multitouch
      de tablet real ainda não testado.
- [ ] Testado após trocar de aba e voltar — não testado nesta sessão.

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências).
- [ ] Este checklist com todos os itens fechados ou justificados — restam só: narração do
      tutorial não mapeada (seção 2), `tools/ava-teste.html`/iframes/toque real em
      tablet/troca de aba não testados nesta sessão (seção 7), zip de publicação não
      gerado (abaixo) — todos já documentados, nenhum silencioso.
- [x] `node tools/build.mjs numerandus/jogo-da-memoria` rodado (motor v1.3.5 na cópia).
- [x] Versão do motor conferida: `engine/version.json` dentro da pasta do jogo, v1.3.5,
      igual à raiz.
- [x] Pasta testada servida de FORA do projeto, numa subpasta profunda —
      `node tools/teste-entrega-avulsa.mjs numerandus/jogo-da-memoria`, aprovado.
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar — não feito
      nesta sessão (o jogo ainda não está pronto para publicar, ver pendências de áudio).
