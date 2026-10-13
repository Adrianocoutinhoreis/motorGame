# Checklist — Caminho das Cores

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `caminho-das-cores` · Criado em: 2026-10-01 · Motor: v1.3.6

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — comparar formato e cor com um cartão
      de referência e reproduzir a mesma sequência em cada trilha, na ordem certa
- [x] Faixa etária confirmada e coerente com o design (4 a 7 anos — alvos grandes,
      sem leitura obrigatória, dois jeitos de mover a peça: arrastar ou tocar-e-tocar)
- [x] Mecânica descrita em até 3 frases (ver README, seção "O que é" — versão atual
      desde 2026-10-08, correção 29)
- [x] Níveis definidos: 3, seguindo os cartões do brinquedo — Fácil (uma cor por trilha,
      2 peças), Médio (uma cor por trilha, 4 peças), Difícil (cores misturadas, 4 peças);
      `trilhas` é sempre 5
- [x] Condição de **vitória** definida e mensurável — `nivel.meta` (3) cartões
      confirmados com o tabuleiro inteiro batendo com o cartão (`ScoreSystem`)
- [x] Condição de **derrota** definida (ou registrado que não existe derrota) — **não
      existe**: sem vidas, confirmar errado só demora mais (mesma decisão do Encaixe
      Certo/Quantidade Certa/Material Dourado)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — `textoEmCaixaAlta: true`; textos de tutorial/HUD passam pelo motor, que
        já caixa-alta sozinho
  - [x] RE-02 — a cena nunca chama `placar.errar()`; CONFIRMAR errado só incrementa
        `_tentativasErradas`, somado manualmente no `resultado` do `_terminar` — nunca
        desconta acerto nem estrela
  - [x] RE-03 — `unidadePlacar: { singular: 'cartão', plural: 'cartões' }` — o placar
        mostra "N CARTÕES" (conferido na tela de resultado)
  - [x] RE-04 — `_terminar` não passa `estrelas` em `irPara('resultado', …)`

## 2. Assets

- [x] Arte produzida — nenhuma imagem: círculo/quadrado/triângulo/pentágono desenhados
      por `Path2D`/arcos direto no canvas (mesmo padrão do Encaixe Certo/Quantidade Certa)
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo — **parcial**: os 4
      passos do tutorial têm `fala:` e áudio gravado (`assets/audio/tutorial/`); falta a frase
      curta de cada cartão novo
- [x] Efeitos de acerto e erro presentes (`soltarPeca`/`somErro`, reaproveitados da coleção)
- [ ] ~~Efeito de clique~~ — decisão deliberada, sem som de clique genérico (mesmo padrão
      do Encaixe Certo/Jogo da Ordenação/Quantidade Certa): `config.audio.clique: null`
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para os 8 áudios existentes (as 4 da narração como "não
      verificada")
- [ ] Transcrições **confirmadas ouvindo** — **as 4 narrações do tutorial** (`Tela001`,
      `tela02`, `tela03`, `tela04`) ainda não foram ouvidas; e só 2 dos 3 áudios de efeito são "confirmado por
      natureza" (sem fala); `error.MP3` ainda precisa ser ouvido (mesma pendência
      compartilhada com Geométrico/Memória/Chave Mágica/Quantidade Certa, mesma cópia)
- [x] Pendências de áudio ainda não gravado/ouvido listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (de fábrica, via `templates/jogo-base`)
- [x] **Tema visual próprio** ('trilhas') nas telas de vitrine — peças subindo pelas margens
      e beirada da prancha no rodapé; desligado na partida (ver README, "Tema das telas
      de vitrine"). Conferido em captura nos formatos computador e celular
- [x] **Tutorial** com 4 passos ilustrados e puláveis (incluindo "toque na peça posta pra
      removê-la"), desenhados no visual atual da partida — narração ainda pendente (ver seção 2)
- [x] **Seleção de nível** (3 níveis)
- [x] **Partida** com HUD legível (pausa, ajuda, som, CONFIRMAR, estrelas de progresso por
      cartão, cronômetro CRESCENTE só informativo)
- [x] **Pausa** com continuar / recomeçar / sair
- [x] **Ajuda** na partida (regra RE-05): `HelpScreen` abre por cima, `Tween.pausarTodos()`
      + `this.pausada = true` param o jogo atrás, `_cancelarGesto()` devolve qualquer peça
      em arrasto pro lugar dela no monte antes de abrir
  - [x] O tempo NÃO corre enquanto a ajuda está aberta (`atualizar(dt)` retorna cedo
        quando `pausada`, só atualiza pausa/ajuda)
  - [x] Os mesmos 3 passos do `config.tutorial` servem tanto ao "como jogar" do menu
        quanto à ajuda dentro da partida (nenhum conteúdo duplicado)
- [ ] ~~Resultado para derrota~~ — este jogo nunca tem derrota (`registrarDerrota: false`);
      só existe a tela de vitória
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme o README ("O que é"): monte solto com as peças exatas
      do cartão (sem distratoras), caminho animado pela abertura, CONFIRMAR compara tudo
- [x] **Tocar-e-tocar** (o jeito ensinado no tutorial): tocar na peça a escolhe (brilho +
      pulinho contínuo; as trilhas livres piscam com um dedinho branco apontando pra elas); tocar numa trilha a manda;
      tocar na mesma peça ou fora desfaz a escolha
- [x] **Arrastar só no Fácil** (`arrastar: true`): soltar em qualquer ponto da trilha (do
      corredor pra baixo) manda a peça; fora de uma trilha, ela volta ao monte. No Médio e
      no Difícil um arrasto só escolhe a peça (testado: no Médio a peça não segue o dedo e
      fica escolhida; no Fácil segue e vai pra trilha)
- [x] **Caminho**: a peça vai até a abertura, desce, corre o corredor e cai na posição mais
      baixa vazia (`_percorrer`, velocidade constante). A vaga é reservada no instante da
      decisão, então várias peças podem estar voando ao mesmo tempo sem colidir
- [x] **Retirar**: só a peça do TOPO sai (volta ao monte pelo mesmo caminho, num lugar
      livre); uma de baixo só balança
- [x] **CONFIRMAR** só acende com as 5 trilhas cheias e nenhuma peça voando — toque
      acidental antes disso não conta erro
- [x] Feedback **imediato** de encaixe (a peça assenta com um "squash" e `soltarPeca`)
- [x] **Ajuda em degraus** ao CONFIRMAR errado, sem tom punitivo (RE-02): 1º erro marca as
      peças fora do lugar (anel tracejado + balanço) e faz as certas brilharem verde; 2º
      erro também pisca a coluna do cartão de cada trilha com erro; 3º em diante monta o
      tabuleiro certo sozinho (holofote + cascata) e depois marca as peças
- [x] Cartão certo: estrela, comemoração em cascata, `somProgresso` (o brilho da estrela do
      Material Dourado), cartão novo; `acertoSOS` só na tela final
- [x] Dificuldade dos níveis conferida em captura nos dois formatos (computador e celular)
- [x] Nenhum estado travado: `_aguardandoAvanco` só trava durante a demonstração e o
      intervalo entre cartões, sempre destravado por um `Tween`
- [x] Reiniciar limpa todo o estado — o motor recria a cena em `irPara('jogando', …)`

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | cartões da meta do nível (`nivel.meta`) | 3 |
| `acertos` | cartões confirmados certos (tabuleiro inteiro batendo de uma vez) | 0 a `totalPerguntas` |
| `erros` | vezes que confirmou com o tabuleiro errado (nunca desconta) | 0+ |
| `nivel` | `nivel.id` do config | 1, 2 ou 3 |
| `jogo` | slug estável | `caminho-das-cores` |

- [x] Existe um único ponto de fim de partida (`_terminar` → `irPara('resultado', { resultado })`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (verificado via `tools/ava-teste.html`, ver seção 7)
- [x] `acertos`/`erros` são da partida inteira, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number` (confirmado no payload capturado via ava-teste.html)
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window`
      (mesmo mecanismo genérico do motor — `teste-entrega-avulsa.mjs` confirma que fora de
      iframe o jogo não envia nada)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [ ] ~~Derrota também registra~~ — não existe derrota neste jogo (ver seção 1)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — peças de 66 a 100px conforme
      nível e formato; a trilha inteira (bem mais larga que a peça) é o alvo de soltar
- [x] Espaço suficiente entre alvos (monte numa grade invisível com folga; trilhas
      separadas por ripas)
- [x] Contraste de texto e de elementos essenciais em nível AA (texto do motor já
      segue o design system; peças têm contorno escuro próprio)
- [ ] Cor **nunca** é o único portador de significado — **pendência real**: a
      comparação é formato **e** cor juntos, mas vermelho/verde e vermelho/laranja (as
      cores do brinquedo) se confundem pra parte das crianças; sem segundo canal ainda
- [x] Nenhuma ação exige saber ler: tutorial 100% ilustrado, narração é a única
      pendência (texto de apoio nunca é a única via)
- [x] Som pode ser desligado (`SoundToggle` no HUD), preferência é do motor (`AudioBus`)
- [x] Nada pisca de forma rápida ou repetitiva (tremor e pulinho são curtos, ~150-220ms,
      sem repetição em loop)

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa (154/0, suíte do motor — não específica deste jogo)
- [x] `node tools/verificar-independencia.mjs numerandus/caminho-das-cores` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/caminho-das-cores` **aprovado**
      (11/11 — jogo serve de fora do projeto, 3 áudios carregam, sem postMessage fora de iframe)
- [x] Jogo abre por `node tools/serve.mjs` sem nenhuma requisição externa (confirmado
      pela `teste-entrega-avulsa.mjs`: 50 requisições, todas locais à pasta)
- [x] Fluxo de partida percorrido via `captura-cena.mjs` nos 3 níveis (computador) e no
      Médio/Fácil em formato celular (`--janela=390,844`)
- [x] **Gestos e regras**, testados em navegador headless chamando os tratadores de gesto
      da cena (`_aoApertar`/`_aoArrastar`/`_aoSoltar`) com coordenadas reais: CONFIRMAR
      apagado com tabuleiro vazio e durante o voo, aceso só depois; toque nele vazio não
      conta erro; metade das peças por arrasto e metade por tocar-e-tocar chegam todas na
      trilha certa; retirar o topo devolve ao monte e apaga o CONFIRMAR; peça de baixo
      não sai
- [x] **Confirmar errado**: 1º erro marca 4 peças (trilha 2 invertida), 2º acende a coluna
      2 do cartão; 3º roda a demonstração e devolve as peças da criança
- [x] **Vitória:** 3 cartões seguidos levam à tela de resultado ("3 CARTÕES")
- [ ] ~~Derrota~~ — não existe (ver seção 1/5)
- [ ] **Replay / sem duplicata / validador do `ava-teste.html`** — **refazer** com a
      mecânica nova (o contrato não mudou: `_terminar` é o mesmo, mas não foi re-testado)
- [ ] Testado em iframe pequeno, médio e grande sem cortar nem deformar — **pendente**
- [ ] Testado com **toque de dedo real** num tablet/celular — **pendente**
- [ ] Testado após trocar de aba e voltar — **pendente** (mecanismo genérico do motor)
- [ ] Testado após trocar de aba e voltar — **pendente**; mecanismo é genérico do motor
      (mesma pausa automática usada em toda a coleção), não testado isoladamente aqui

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como foi definido, como rodar, contrato,
      assets, pendências)
- [x] Este checklist com todos os itens fechados ou justificados
- [x] `node tools/build.mjs numerandus/caminho-das-cores` rodado por último (motor
      atualizado na cópia)
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.6,
      igual à raiz)
- [x] Pasta copiada para fora do projeto, servida de uma subpasta qualquer e testada
      (`node tools/teste-entrega-avulsa.mjs numerandus/caminho-das-cores`)
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar — **pendente**
