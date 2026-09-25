# Checklist — Chave Mágica

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `chave-magica` · Criado em: 2026-09-24 · Motor: v1.3.6

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — discriminação visual de forma
      (cabeça + dentes) e correspondência um-a-um, arrastando cada chave até a
      fechadura do mesmo formato
- [x] Faixa etária confirmada e coerente com o design — 6 a 7 anos, 1º ano
- [x] Mecânica descrita em até 3 frases — ver README ("O que é")
- [x] Níveis definidos: 3 (Fácil 4 peças/1 dente, Médio 6 peças/2 dentes,
      Difícil 8 peças/2 dentes/cadeado colorido), todos com 3 vidas e tempo
      crescente (45/40/60s — Fácil recebeu mais folga por ser o primeiro
      contato com a mecânica) — ver `config.js`
- [x] Condição de **vitória** definida e mensurável (todas as chaves do nível encaixadas)
- [x] Condição de **derrota** definida — vidas OU tempo zerados antes de terminar.
      **Primeiro jogo Numerandus com derrota de verdade** (decisão registrada no
      artefato de planejamento, ao contrário do resto da coleção)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (`config.textoEmCaixaAlta: true`)
  - [x] RE-02 — a nota da partida desconta o erro **na vitória**, nunca na derrota
        (a cena usa `placar.paraAva()`; o desconto é do próprio `ScoreSystem.pontuacao`)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("4 CHAVES"), não "4 de 4"
        (`config.unidadePlacar`)
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida — cabeça e dentes desenhados via `Path2D` no canvas (sem
      imagem), geometria portada do protótipo `Aulas para Refazer/Jogo_da_chave_magica`
- [x] Áudio de narração do tutorial — gravado (`tela1/2/3.wav`), `fala:` dos 3 passos
      aponta pra ids agora presentes em `config.assets`; transcrição só INFERIDA do
      texto da tela, ainda não ouvida (ver seção 7/pendência abaixo)
- [x] Efeito de vitória presente — `acertoSOS.wav`, mesmo tradicional da coleção
- [x] Efeito de encaixe certo presente — `soltar_peca.mp3` — origem/licença a confirmar
      (pendência compartilhada com outros jogos)
- [ ] Efeito de erro (`error.MP3`) e de derrota (`erroSOS.wav`) presentes, mas
      **nenhum dos dois foi ouvido** — fichas "não verificada"
- [ ] Efeito de clique genérico — ainda falta (`config.audio.clique` continua `null`)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para cada áudio existente (7 arquivos)
- [ ] Transcrições **confirmadas ouvindo** — só 2 dos 7 áudios são "confirmado por
      natureza" (sem fala); `error.MP3`, `erroSOS.wav` e os 3 da narração do tutorial
      (transcrição inferida do texto da tela, não ouvida) ainda precisam ser ouvidos
- [x] Pendências de áudio ainda não gravado/ouvido listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR — testado (`tools/captura-cena.mjs`), sem mascote
- [x] **Tutorial** ilustrado e pulável — os 3 passos testados rodando
      (`mostrarPasso(0..2)`); narração gravada e carregando (`tela1/2/3.wav`), ainda
      não ouvida pra confirmar que bate com o texto da tela
- [x] **Seleção de nível** (3 níveis) — telas padrão do motor
- [x] **Partida** com HUD legível (progresso, 3 vidas, cronômetro regressivo, pausa,
      ajuda, som) — testado nos 3 níveis
- [x] **Pausa** com continuar / recomeçar / sair — usa `PauseScreen` padrão; testado que
      o cronômetro CONGELA de verdade durante a pausa e retoma exatamente de onde parou
      (`cena.tempo.restante` medido antes/durante/depois — 500ms pausado = 0 de queda,
      500ms retomado = ~500ms de queda)
- [x] **Ajuda** na partida (regra RE-05) — usa `HelpScreen` padrão sobre `config.tutorial`;
      testado abrindo e fechando de verdade via `_pedirAjuda()`/`ajuda.fechar()`: pausa a
      cena E o cronômetro ao abrir (`cena.pausada`, `cena.tempo.rodando`), mostra o passo 1
      do tutorial por cima do jogo, e ao fechar despausa e retoma os dois
- [x] **Resultado** para vitória — testado (6/6... 4/4 CHAVES, "MUITO BEM!", estrelas)
- [x] **Resultado** para derrota — testado por vidas zeradas E por tempo zerado
      ("QUASE LÁ!", em azul, nunca vermelho — mesmo tom não-punitivo do resto da coleção)
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu (telas padrão do motor)

## 4. Mecânica

- [x] Regras implementadas conforme a definição — arrastar + validar formato
      (cabeça+dentes, `chave.pecaId === fechadura.pecaId`) + vidas + cronômetro,
      testado nos 3 níveis via chamada direta aos métodos da cena
- [x] Feedback **imediato** de acerto — visual (chave assenta com tween, cadeado
      abre no Difícil) e som (`soltar_peca.mp3`)
- [x] Feedback **imediato** de erro — visual (fechadura pisca âmbar, nunca vermelho)
      e som (`somErro`); **custa uma vida de verdade**, diferente do resto da coleção
- [x] Dificuldade dos níveis testada de verdade — Fácil (4 peças, 1 dente), Médio
      (6 peças, 2 dentes), Difícil (8 peças, cadeado colorido) confirmados via captura
- [x] Nenhum estado travado: a chave sempre volta pra bandeja se soltar errado
  - [x] `Watchdog` — não se aplica: não há fase de toque bloqueado por tween longo (o
        arrasto é imediato, sem cadeia de animação que possa "perder" a devolução do
        toque, mesmo padrão do Geométrico)
- [x] Reiniciar limpa **todo** o estado da partida anterior (`irPara('jogando', ...)` remonta a cena)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md`.

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | chaves do nível jogado | `4`, `6` ou `8` |
| `acertos` | pontuação (`ScoreSystem.pontuacao`) — total menos erros numa vitória, progresso puro numa derrota | `0`..`8` |
| `erros` | tentativas de encaixe com formato errado — cada uma já custou 1 vida | `0`, `1`, `2`… |
| `nivel` | nível jogado (1 Fácil, 2 Médio, 3 Difícil) | `1`, `2` ou `3` |
| `jogo` | slug estável | `chave-magica` |

- [x] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`, em `_terminar`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (gerado pelo `AvaBridge`, não escrito à mão)
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window` (motor)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Derrota também registra — `registrarDerrota: true`, testado por vidas e por tempo

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — `Chave`/`Fechadura` usam
      `alvoAcessivel` na largura E na altura (mesmo a arte sendo bem mais larga que alta)
- [x] Espaço suficiente entre alvos — grade calculada por `melhorGradeColunas` com gap fixo
- [x] Contraste de texto e de elementos essenciais em nível AA — cartões brancos sobre
      fundo roxo escuro
- [x] Cor **nunca** é o único portador de significado — o formato (cabeça+dentes) é
      quem decide o encaixe, nunca a cor sozinha; a dica de erro é o contorno piscando
      (forma + cor), não só cor
- [x] Nenhuma ação exige saber ler: narração do tutorial gravada e carregando
      (transcrição só inferida, não ouvida — ver seção 2)
- [x] Som pode ser desligado (`SoundToggle` padrão do motor)
- [x] Nada pisca de forma rápida ou repetitiva (o âmbar de erro é uma vez só, ~650ms)

## 7. Validação (no navegador)

- [x] `node tools/testes.mjs` passa (154 testes do motor, sem regressão)
- [x] `node tools/verificar-independencia.mjs numerandus/chave-magica` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/chave-magica` **aprovado**
      (11/11, 7 áudios carregados, zero erro de JS, zero 404)
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa (teste de
      entrega avulsa confirma)
- [x] Fluxo Menu → Tutorial → Níveis → Partida → Resultado percorrido, sem travar
- [x] **Vitória:** testada via `tools/captura-cena.mjs` — todas as chaves soltas nas
      fechaduras certas encaixam, placar e estrelas corretos
- [x] **Derrota por vidas:** testada — 3 erros seguidos zeram as vidas e disparam
      "QUASE LÁ!" corretamente
- [x] **Derrota por tempo:** testada de duas formas — chamando `encerrarPorTempo()`
      direto e deixando o `TimerBar` de verdade chegar a zero (`restante=0.05`,
      esperando o próximo quadro) — as duas disparam a mesma tela de derrota
- [x] **Toque real:** testado com `PointerEvent` sintético via CDP (pointerdown/move/up,
      `pointerType:'touch'`), não só chamada direta — arrastar uma chave até a
      fechadura certa funciona ponta a ponta pelo caminho real do `Input.js`
- [x] **Replay/duplicata de mensagem AVA:** testado via `tools/ava-teste.html` — duas
      partidas seguidas (vitória, "jogar de novo") geram "Partida #1" e "Partida #2"
      distintas no host, cada uma validando as 7 regras do contrato (nenhuma falha)
- [x] `tools/ava-teste.html`: mensagem chegando ao pai — testado de verdade (não só por
      inspeção de código): `JOGO_CONCLUIDO` cruza o `<iframe>`, aparece no host e passa
      em todas as regras de contrato (`type`, `acertos`/`erros`/`totalPerguntas` como
      `number`, `nivel` presente, `jogo` com slug estável, nenhum dado de aluno)
- [x] Testado em iframe pequeno, médio, grande e celular (retrato estreito) via
      `tools/ava-teste.html` — menu e partida renderizam sem cortar nem distorcer em
      nenhum dos quatro; HUD continua legível mesmo no preset mais estreito
- [ ] Testado com **toque em tablet real** (só toque sintético via CDP até agora)
- [x] Testado após trocar de aba — por INSPEÇÃO DE CÓDIGO (não captura ao vivo): o motor
      (`Game.js`) escuta `visibilitychange` e chama `pausarLaco()`/`retomarLaco()`, o `dt`
      é sempre recalculado a partir de `performance.now()` no instante em que o laço
      retoma (nunca acumula o tempo em que a aba ficou escondida) e é limitado a no
      máximo 100ms por quadro — mecanismo genérico do motor, não específico deste jogo,
      então o cronômetro de Chave Mágica não pode "pular" nem "vazar" tempo ao trocar de aba

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como os dados foram definidos, como
      rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados — restam: **narração do
      tutorial e áudio de erro/derrota gravados mas não OUVIDOS pra confirmar**, **teste
      em tablet real** (toque de dedo de verdade) e **zip gerado/aberto antes de enviar**
- [x] `node tools/build.mjs numerandus/chave-magica` rodado
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.6)
- [x] Pasta copiada para **fora** do projeto e testada — `teste-entrega-avulsa.mjs`
      cobre isso automaticamente (ver seção 7)
- [ ] Zip gerado e aberto antes de enviar
- [x] Catálogo (`__jogos.json`/`index.html` da raiz) regenerado via
      `node tools/pages-index.mjs` — 12 jogos listados, incluindo este
