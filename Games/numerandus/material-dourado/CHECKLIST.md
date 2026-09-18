# Checklist — Material Dourado

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `material-dourado` · Criado em: 2026-09-17 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase (o que a criança aprende ou treina)
- [x] Faixa etária confirmada e coerente com o design (alvos, leitura, ritmo) — 6 a 8 anos, 1º ano
- [x] Mecânica descrita em até 3 frases — ver README ("O que é")
- [x] Níveis definidos: quantos, o que muda entre eles, o que cada um treina
- [x] Condição de **vitória** definida e mensurável (completar as 5 rodadas do nível)
- [x] Condição de **derrota** definida (ou registrado que não existe derrota) — não existe
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (frases de instrução seguem em caixa normal)
  - [x] RE-02 — a nota da partida desconta o erro **na vitória**, nunca na derrota
        (a cena usa `placar.paraAva()`; `placar.errar()` nunca é chamado — ver README)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("5 ACERTOS"), não "5 de 5"
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida (3 PNGs isométricos fornecidos pelo humano — cubinho, barrinha, placa)
- [x] Áudio de narração do tutorial presente — 5 de 5 passos (`tela1-5.wav`, fornecidos pelo
  humano); a locução do resultado (`falaVitoria`) ainda não tem áudio — só o efeito sonoro
- [ ] Efeito de acerto presente — **ainda falta** (som específico de confirmar certo, diferente do
  `progresso`, que já toca nesse instante). `clique` (`somClique`, do Jogo da Ordenação), `erro`
  (`somErro`, do Jogo da Memória — **ainda não ouvido/verificado, ver risco no README**),
  `progresso` (`somProgresso`, do Jogo da Memória) e `vitoria` (`acertoSOS`, usado em toda a
  coleção) já estão ligados, todos cópias de arquivos já usados em outros jogos
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [ ] Ficha de transcrição criada para **cada** áudio — pendente para `tela1-5.wav` (ver
  `assets/audio-transcricao/` do Jogo da Memória como referência de formato)
- [ ] Transcrições **confirmadas ouvindo** — pendente, ver item acima
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR
- [x] **Tutorial** com passos narrados, ilustrados e puláveis — narração e ilustração ok (5/5 passos)
- [x] **Seleção de nível** (3 níveis: Fácil, Médio, Difícil)
- [x] **Partida** com HUD legível (progresso, tempo, pausa)
- [x] **Pausa** com continuar / recomeçar / sair
- [x] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial POR CIMA do jogo,
      a partida continua atrás e voltar a devolve intacta — placar, tempo e mesa
  - [x] O tempo NÃO corre enquanto a ajuda está aberta (`Tween.pausarTodos()` + `pausada = true`)
  - [x] Os passos do `config.tutorial` fazem sentido para quem JÁ está jogando e travou — mesmos
        5 passos, mesma mecânica "contar e trocar", nas duas telas
- [x] **Resultado** para vitória (testado) **e** para derrota — não se aplica, jogo não tem derrota
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição — "contar e trocar" com revelação progressiva de +10/+100
- [x] Feedback **imediato** de acerto (visual: verde + texto) — som pendente (sem asset de áudio)
- [x] Feedback **imediato** de erro (visual: âmbar + texto), sem tom punitivo — som ligado
  (`somErro`), mas ainda não confirmado por audição que o próprio TOM do som não é punitivo
- [x] Dificuldade dos níveis testada de verdade (capturas de tela, não só configurada)
- [x] Nenhum estado travado: sempre dá para agir ou a partida termina
  - [ ] `Watchdog` — não se aplica: não há fase com toque bloqueado de propósito (sem
        "travado"/"movendo"), o jogo sempre responde ao toque
- [x] Reiniciar limpa **todo** o estado da partida anterior (`irPara('jogando', ...)` remonta a cena)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md`.

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | rodadas da partida (meta do nível) | `5` |
| `acertos` | números formados e confirmados certos | `0` a `5` |
| `erros` | vezes que confirmou com o número errado (só demonstrativo, não desconta) | `0`, `1`, `2`… |
| `nivel` | nível jogado (1 Fácil, 2 Médio, 3 Difícil) | `1`, `2` ou `3` |
| `jogo` | slug estável | `material-dourado` |

- [x] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`, em `_terminar`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (gerado pelo `AvaBridge`, não escrito à mão)
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window` (motor)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Derrota também registra — não se aplica, jogo sem derrota (`registrarDerrota: false`)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos (cubinho 88-92px, botões da bandeja 128px)
- [x] Espaço suficiente entre alvos (não dá para errar o dedo)
- [x] Contraste de texto e de elementos essenciais em nível AA
- [x] Cor **nunca** é o único portador de significado — o feedback do Confirmar é sempre TEXTO,
      a cor só reforça
- [x] Nenhuma ação exige saber ler: o gesto (tocar) e as imagens comunicam — narração ainda pendente
- [x] Som pode ser desligado (`SoundToggle` padrão do motor)
- [x] Nada pisca de forma rápida ou repetitiva

## 7. Validação (no navegador)

- [x] `node tools/testes.mjs` passa (154 testes do motor, sem regressão)
- [x] `node tools/verificar-independencia.mjs numerandus/material-dourado` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/material-dourado` **aprovado** (simula a publicação)
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa (teste de entrega avulsa confirma)
- [x] Fluxo completo de telas percorrido, sem travar (menu → tutorial → jogo → pausa/ajuda → resultado)
- [x] **Vitória:** testada via `tools/captura-cena.mjs` nos **3 níveis** (Fácil/Médio/Difícil — tela
      de resultado com "5 ACERTOS", 5 estrelas, `nivel` 1/2/3 corretos) e com 1 erro no meio
      (`erros: 1`, `acertos: 5` — confirma que erro não desconta, RE-02)
- [~] **Derrota:** não se aplica — jogo sem derrota
- [ ] **Replay/duplicata de mensagem AVA:** ainda não testado (reabrir/reenviar na mesma sessão do
      `tools/ava-teste.html`)
- [x] `tools/ava-teste.html`: mensagem chegando ao pai — testado nos 3 níveis, `JOGO_CONCLUIDO`
      passa nas 8 checagens automáticas do host todas as vezes
- [ ] Testado em iframe pequeno, médio e grande
- [ ] Testado com **toque** em tablet real (só testado com captura headless até agora)
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados — **áudio e teste em tablet real pendentes**
- [x] `node tools/build.mjs numerandus/material-dourado` rodado
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.5)
- [ ] Pasta copiada para **fora** do projeto e testada manualmente — `teste-entrega-avulsa.mjs` já cobre isso
      automaticamente (ver seção 7), mas não houve teste manual adicional
- [ ] Zip gerado e aberto antes de enviar
