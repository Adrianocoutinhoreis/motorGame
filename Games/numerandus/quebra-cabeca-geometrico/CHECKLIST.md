# Checklist — QUEBRA CABEÇA GEOMÉTRICO

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `quebra-cabeca-geometrico` · Criado em: 2026-09-23 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — comparar números (reconhecer iguais) e
      orientação espacial, girando e encaixando peças reais até o número do lado que se
      toca ficar igual ao da vizinha
- [x] Faixa etária confirmada e coerente com o design — 7 a 9 anos, 2º ano
- [x] Mecânica descrita em até 3 frases — ver README ("O que é")
- [x] Níveis definidos: 3, mesmas 7 peças em todos; muda se a peça já chega na rotação
      certa e a tolerância do encaixe (ver `config.js`, tabela de níveis)
- [x] Condição de **vitória** definida e mensurável (as 6 peças ao redor da central encaixadas)
- [x] Condição de **derrota** definida (ou registrado que não existe derrota) — não existe
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (`config.textoEmCaixaAlta: true`)
  - [x] RE-02 — a nota da partida desconta o erro **na vitória**, nunca na derrota
        (a cena usa `placar.paraAva()`; `placar.errar()` nunca é chamado — tentativa errada
        só incrementa `_tentativasErradas`, informativo)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("6 PEÇAS"), não "6 de 6"
        (`config.unidadePlacar`)
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida — hexágonos desenhados no CANVAS (sem imagem), cores e números
      transcritos de fotos reais e limpas do brinquedo físico (ver README, seção "Como os
      números foram conferidos")
- [x] Áudio de narração do tutorial — 3 arquivos ligados aos 3 passos
- [x] Efeito de vitória presente — `acertoSOS.wav`, o mesmo tradicional de toda a coleção
      Numerandus (mesmo SHA-256 conferido), ficha em `assets/audio-transcricao/acertoSOS/transcricao.md`
- [x] Efeito de acerto (peça encaixada) presente — `soltar_peca.mp3`, o mesmo som do
      Material Dourado/Dino (mesmo SHA-256 conferido), ficha em
      `assets/audio-transcricao/soltarPeca/transcricao.md` — **origem/licença ainda a confirmar**,
      mesma pendência já registrada nos outros jogos que usam este arquivo
- [x] Efeito de erro presente — `error.MP3`, o mesmo do Jogo da Memória
- [x] Efeito de progresso (celebração ao completar a flor) presente — `progresso.mp3`,
      tocado peça a peça em `GameScene._celebrarConclusao()` — **origem/licença e ficha
      de transcrição ainda faltam**, ver abaixo
- [ ] Efeito de clique genérico — ainda falta (`config.audio.clique` continua `null`)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [ ] Origem/licença de cada asset registrada no `README.md` — falta a linha de
      `progresso.mp3` na tabela de Assets (as 3 narrações do tutorial e o `error.MP3`
      já estão lá)
- [ ] Ficha de transcrição criada para cada áudio existente — só `acertoSOS` e
      `soltarPeca` têm ficha (`assets/audio-transcricao/`); faltam as 3 narrações do
      tutorial (`tutorialTela1/2/3` — têm FALA, precisam de transcrição de verdade, não
      só "sem fala"), `somErro` e `somProgresso`
- [ ] Transcrições confirmadas ouvindo — status "confirmada por natureza" (sem fala), mas
      ninguém ouviu os arquivos de ponta a ponta nesta sessão
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR — testado (`tools/captura-cena.mjs`), sem mascote;
      título oficial "QUEBRA CABEÇA GEOMÉTRICO" em caixa alta
- [x] **Tutorial** ilustrado e pulável — os 3 passos testados rodando
      (`tools/captura-cena.mjs`, `mostrarPasso(0..2)`), usando a MESMA geometria de desenho
      da partida (não uma peça genérica); narração ligada aos 3 passos
- [x] **Seleção de nível** (3 níveis) — telas padrão do motor, testada
- [x] **Partida** com HUD legível (progresso "N / 6 PEÇAS", pausa, ajuda, som) — testado
- [ ] **Pausa** com continuar / recomeçar / sair — usa `PauseScreen` padrão; não clicada manualmente
- [ ] **Ajuda** na partida (regra RE-05) — usa `HelpScreen` padrão sobre `config.tutorial`; não
      testada abrindo de verdade nesta sessão
  - [ ] O tempo NÃO corre enquanto a ajuda está aberta — implementado via `Tween.pausarTodos()`
        + `pausada`, mesmo padrão do resto da coleção; não confirmado visualmente
- [x] **Resultado** para vitória (testado via simulação de partida completa, "6 PEÇAS", 5
      estrelas) — derrota não se aplica
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu (telas padrão do motor)

## 4. Mecânica

- [x] Regras implementadas conforme a definição — girar + arrastar + ímã de encaixe +
      validação de número (central sempre; vizinhas já coladas só no Difícil, via
      `validarVizinhos`), testado nos 3 níveis via chamada direta aos métodos da cena —
      inclusive o caso em que uma peça bate com a central por coincidência de número
      repetido mas não com a peça vizinha já colocada: aceita sem `validarVizinhos`
      (Fácil/Médio), recusada corretamente com ele (Difícil)
- [x] Feedback **imediato** de acerto — visual (peça assenta com tween, contador avança) e
      som (`soltar_peca.mp3`)
- [x] Feedback **imediato** de erro (número errado) — visual (contorno pisca âmbar, nunca
      vermelho, e a peça volta pra bandeja), sem tom punitivo; **som ainda não existe**
- [x] Dificuldade dos níveis testada de verdade — nível Fácil (peça já na rotação certa),
      Médio/Difícil (rotação embaralhada, precisa girar antes de soltar) confirmados via teste
- [x] Nenhum estado travado: a peça sempre volta pra bandeja se soltar errado, nunca trava
  - [ ] `Watchdog` — não se aplica: não há fase de toque bloqueado de propósito (a bandeja e o
        tabuleiro sempre respondem, exceto a peça já colocada)
- [x] Reiniciar limpa **todo** o estado da partida anterior (`irPara('jogando', ...)` remonta a cena)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md`.

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | peças a encaixar ao redor da central (ela não conta) | `6` |
| `acertos` | peças encaixadas certas (sempre as 6, ao final) | `6` |
| `erros` | tentativas soltas no lugar certo mas com número errado, só demonstrativo | `0`, `1`, `2`… |
| `nivel` | nível jogado (1 Fácil, 2 Médio, 3 Difícil) | `1`, `2` ou `3` |
| `jogo` | slug estável | `quebra-cabeca-geometrico` |

- [x] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`, em `_terminar`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (gerado pelo `AvaBridge`, não escrito à mão)
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado (6, igual em todos)
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window` (motor)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [~] Derrota também registra — não se aplica, jogo sem derrota (`registrarDerrota: false`)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — `Hexagono` usa `alvoAcessivel(raio*2)`
      pro lado da caixa de toque (área CIRCULAR, gira junto com a peça sem distorcer o alvo);
      botão de girar é `IconButton` (72px por padrão, `alvoAcessivel` embutido)
- [x] Espaço suficiente entre alvos — grade da bandeja usa `gap` fixo de 16px entre células
- [x] Contraste de texto e de elementos essenciais em nível AA — cartões brancos sobre fundo
      roxo escuro, números brancos com contorno escuro sobre as cores das peças
- [x] Cor **nunca** é o único portador de significado — cada triângulo tem número grande
      além da cor, e a dica de erro é o contorno piscando (forma + cor), não só cor
- [ ] Nenhuma ação exige saber ler: tutorial narrado; instruções específicas da partida ainda sem narração
      (pendência de áudio, ver seção 2)
- [x] Som pode ser desligado (`SoundToggle` padrão do motor)
- [x] Nada pisca de forma rápida ou repetitiva (o âmbar de erro é uma vez só, ~650ms)

## 7. Validação (no navegador)

- [x] `node tools/testes.mjs` passa (154 testes do motor, sem regressão)
- [x] `node tools/verificar-independencia.mjs numerandus/quebra-cabeca-geometrico` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/quebra-cabeca-geometrico` **aprovado**
      (11/11, 7 áudios carregados, zero erro de JS, zero 404)
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa (teste de entrega
      avulsa confirma)
- [x] Fluxo Menu → Tutorial → Níveis → Partida → Resultado percorrido, sem travar
- [x] **Vitória:** testada via `tools/captura-cena.mjs` — as 6 peças soltas nas posições
      certas (nível Fácil, rotação já correta) encaixam todas, `6/6 PEÇAS`, o desenho final
      bate pixel a pixel com a foto de referência da montagem real
- [x] **Girar:** testado — peça com rotação embaralhada (nível Médio) é recusada até girar
      o número certo de vezes, depois encaixa; o contorno pisca âmbar na tentativa errada
- [~] **Derrota:** não se aplica — jogo sem derrota
- [ ] **Replay/duplicata de mensagem AVA:** ainda não testado
- [ ] `tools/ava-teste.html`: mensagem chegando ao pai — ainda não testado
- [ ] Testado em iframe pequeno, médio e grande
- [ ] Testado com **toque** em tablet real (só testado com chamada direta aos métodos da cena
      até agora — nenhum evento de ponteiro real foi disparado)
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como os números foram conferidos, como rodar,
      assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados — **áudio, tutorial rodando,
      teste em tablet real e teste de troca de aba pendentes**
- [x] `node tools/build.mjs numerandus/quebra-cabeca-geometrico` rodado
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.5)
- [x] Pasta copiada para **fora** do projeto e testada — `teste-entrega-avulsa.mjs` cobre isso
      automaticamente (ver seção 7)
- [ ] Zip gerado e aberto antes de enviar
