# Checklist — Quebra-Cabeça Dino

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `quebra-cabeca-dinossauro` · Criado em: 2026-09-22 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — praticar a sequência numérica (contar em ordem
      crescente) arrastando peças reais de quebra-cabeça, sempre a próxima da sequência
- [x] Faixa etária confirmada e coerente com o design — 6 a 8 anos, 1º ano
- [x] Mecânica descrita em até 3 frases — ver README ("O que é")
- [x] Níveis definidos: 3, mesmas 26 peças em todos; muda o embaralhamento da bandeja e a
      tolerância de encaixe (ver README, tabela de níveis)
- [x] Condição de **vitória** definida e mensurável (as 26 peças encaixadas, na ordem)
- [x] Condição de **derrota** definida (ou registrado que não existe derrota) — não existe
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (`config.textoEmCaixaAlta: true`; frases de instrução seguem em caixa normal no config,
        convertidas pelo motor)
  - [x] RE-02 — a nota da partida desconta o erro **na vitória**, nunca na derrota
        (a cena usa `placar.paraAva()`; `placar.errar()` nunca é chamado — ver README)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("26 PEÇAS"), não "26 de 26"
        (`config.unidadePlacar`)
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida — 26 peças + tabuleiro pontilhado, recortados/redesenhados a partir de foto
      do brinquedo físico de referência (fornecida pelo humano)
- [ ] Áudio de narração do tutorial — **nenhum gravado ainda**
- [x] Efeito de vitória presente — `acertoSOS.wav`, o mesmo tradicional de toda a coleção Numerandus
      (mesmo SHA-256 conferido), ficha em `assets/audio-transcricao/acertoSOS/transcricao.md`
- [x] Efeito de acerto (peça encaixada) presente — `soltar_peca.mp3`, o mesmo som usado como
      `clique` no Material Dourado (mesmo SHA-256 conferido), ficha em
      `assets/audio-transcricao/soltarPeca/transcricao.md` — **origem/licença ainda a confirmar**,
      mesma pendência já registrada no Jogo da Ordenação/Encaixe Certo (é o mesmo arquivo)
- [ ] Efeito de erro (fora de ordem)/clique genérico — **ainda faltam** (`config.audio.erro/clique`
      continuam `null`, ver README)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [ ] Ficha de transcrição criada para cada áudio — não se aplica ainda, nenhum áudio existe
- [ ] Transcrições confirmadas ouvindo — não se aplica ainda
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR — testado (`tools/captura-cena.mjs`), sem mascote
- [x] **Tutorial** ilustrado e pulável — os 3 passos testados rodando (`tools/captura-cena.mjs`,
      `mostrarPasso(0..2)`); narração ainda não gravada (`config.audio`, ver seção 2)
- [x] **Seleção de nível** (3 níveis) — telas padrão do motor, não customizadas
- [x] **Partida** com HUD legível (progresso "N / 26 PEÇAS", pausa, ajuda, som) — testado
- [ ] **Pausa** com continuar / recomeçar / sair — usa `PauseScreen` padrão; não clicada manualmente
- [ ] **Ajuda** na partida (regra RE-05) — usa `HelpScreen` padrão sobre `config.tutorial`; não
      testada abrindo de verdade nesta sessão
  - [ ] O tempo NÃO corre enquanto a ajuda está aberta — implementado via `Tween.pausarTodos()`
        + `pausada`, mesmo padrão do resto da coleção; não confirmado visualmente
- [x] **Resultado** para vitória (testado, "26 PEÇAS", 5 estrelas) — derrota não se aplica
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu (telas padrão do motor)

## 4. Mecânica

- [x] Regras implementadas conforme a definição — arrastar + ímã de encaixe + ordem crescente,
      testado nos 3 níveis via chamada direta aos métodos da cena
- [x] Feedback **imediato** de acerto — visual (peça assenta com tween, contador avança) e som
      (`soltar_peca.mp3`, testado sem erro de JS ao encaixar)
- [x] Feedback **imediato** de erro (fora de ordem) — visual (dica verde no lugar certo, peça
      volta pra bandeja), sem tom punitivo; **som ainda não existe**
- [x] Dificuldade dos níveis testada de verdade (capturas de tela nos 3 níveis, não só configurada)
- [x] Nenhum estado travado: a peça sempre volta pra bandeja se soltar errado, nunca trava
  - [ ] `Watchdog` — não se aplica: não há fase de toque bloqueado de propósito (a bandeja e o
        tabuleiro sempre respondem, exceto a peça já colocada)
- [x] Reiniciar limpa **todo** o estado da partida anterior (`irPara('jogando', ...)` remonta a cena)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md`.

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | peças do quebra-cabeça | `26` |
| `acertos` | peças encaixadas certas (sempre as 26, ao final) | `26` |
| `erros` | tentativas soltas no lugar certo mas fora de ordem, só demonstrativo | `0`, `1`, `2`… |
| `nivel` | nível jogado (1 Fácil, 2 Médio, 3 Difícil) | `1`, `2` ou `3` |
| `jogo` | slug estável | `quebra-cabeca-dinossauro` |

- [x] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`, em `_terminar`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (gerado pelo `AvaBridge`, não escrito à mão)
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado (26, igual em todos)
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window` (motor)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Derrota também registra — não se aplica, jogo sem derrota (`registrarDerrota: false`)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — **achado numa revisão de código e
      corrigido**: peças largas/achatadas (25, 10, 16, 22) encolhiam abaixo de 64px de ALTURA só
      pra caber na célula da grade da bandeja (a 25 chegava a 42px). A ÁREA DE TOQUE de cada peça
      da bandeja agora é garantida ≥64×64px centrada no desenho (`_criarAreaTocavelAcessivel`,
      via `alvoAcessivel` do motor) mesmo quando o desenho em si fica menor — testado programaticamente
      (`contemPontoLocal` aceita um toque até 32px além da borda visível da peça 25, recusa além
      disso) e visualmente (nada mudou no desenho, só a área que responde ao toque)
- [x] Espaço suficiente entre alvos — grade da bandeja usa `gap` fixo entre células
- [x] Contraste de texto e de elementos essenciais em nível AA — cartões brancos sobre fundo escuro
- [x] Cor **nunca** é o único portador de significado — cada peça tem número grande, forma única
      de encaixe e a dica de erro é anel + reposicionamento, não só cor
- [ ] Nenhuma ação exige saber ler: narração do tutorial e da partida ainda não gravada (pendência
      de áudio, ver seção 2)
- [x] Som pode ser desligado (`SoundToggle` padrão do motor)
- [x] Nada pisca de forma rápida ou repetitiva

## 7. Validação (no navegador)

- [x] `node tools/testes.mjs` passa (154 testes do motor, sem regressão)
- [x] `node tools/verificar-independencia.mjs numerandus/quebra-cabeca-dinossauro` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/quebra-cabeca-dinossauro` **aprovado** (11/11,
      27 imagens carregadas, zero erro de JS, zero 404)
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa (teste de entrega
      avulsa confirma)
- [x] Fluxo Menu → Partida → Resultado percorrido, sem travar
- [x] **Vitória:** testada via `tools/captura-cena.mjs` nos 3 níveis (26/26, "26 PEÇAS", 5
      estrelas, `nivel` 1/2/3 corretos) e com tentativas fora de ordem no meio (peça no lugar
      certo, ordem errada — confirma que a peça recusa e volta, RE-02 preservado)
- [~] **Derrota:** não se aplica — jogo sem derrota
- [ ] **Replay/duplicata de mensagem AVA:** ainda não testado
- [ ] `tools/ava-teste.html`: mensagem chegando ao pai — ainda não testado
- [ ] Testado em iframe pequeno, médio e grande
- [ ] Testado com **toque** em tablet real (só testado com chamada direta aos métodos da cena
      até agora — nenhum evento de ponteiro real foi disparado)
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados — **áudio, tutorial rodando e
      teste em tablet real pendentes**
- [x] `node tools/build.mjs numerandus/quebra-cabeca-dinossauro` rodado
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.5)
- [ ] Pasta copiada para **fora** do projeto e testada manualmente — `teste-entrega-avulsa.mjs` já
      cobre isso automaticamente (ver seção 7), mas não houve teste manual adicional
- [ ] Zip gerado e aberto antes de enviar
