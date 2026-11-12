# Checklist — Cubra Nove

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `cubra-nove` · Criado em: 2026-11-12 · Motor: v1.4.0 (com o tema `'madeira'` e o "um dedo por vez")
>
> Marcado = **verificado**, por script ou olhando a captura. O que só um humano confere (ouvir,
> jogar com criança, tablet de verdade) está aberto, com o motivo.

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — `config.objetivo` e a especificação
- [x] Faixa etária confirmada e coerente com o design — 2º ano (7 a 8 anos), como o vídeo
- [x] Mecânica descrita em até 3 frases — README, "O que é"
- [x] Níveis definidos — Fácil (dados e soma, contas prontas), Médio (com a diferença, "?"), Difícil (só os dados)
- [x] Condição de **vitória** definida e mensurável — cobrir mais que o computador em 3 rodadas (ou as 9 na hora)
- [x] Condição de **derrota** definida — o computador cobrir mais (ou as 9)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — todo texto da cena e do tutorial está em CAIXA ALTA (`textoEmCaixaAlta: true`)
  - [x] RE-02 — vitória = casas cobertas − erros, derrota = casas cobertas (`notaDaPartida`; conferido no AVA)
  - [x] RE-03 — "N NÚMEROS" (`unidadePlacar`; captura `14-resultado-derrota`: "1 NÚMERO")
  - [x] RE-04 — a cena **não** passa `estrelas`
  - [x] RE-05 — a ajuda abre por cima da partida sem perdê-la (teste, item 8)

## 2. Assets

- [x] Arte desenhada no canvas (prancha, casas, cubinho, dados, contas, monte), coerente com a série
- [ ] Áudio de narração presente para **todo** conteúdo falado — **não**: a rodada, os elogios novos, as
      dicas, a conferência e o tutorial faltam (lista no README). O jogo funciona mudo nesses pontos.
- [x] Efeitos de acerto, erro e pouso presentes (reaproveitados da coleção)
- [x] Todo asset está dentro de `assets/`, com caminho relativo (`verificar-independencia.mjs`)
- [x] Nenhuma fonte, imagem ou som vindo da internet (`verificar-independencia.mjs`)
- [x] Origem/licença de cada asset registrada no `README.md` (com as pendências de licença da coleção)
- [x] Ficha de transcrição para cada um dos 7 áudios
- [ ] Transcrições **confirmadas ouvindo** — nenhuma foi ouvida (herdadas do Cabo de Guerra)
- [x] Pendências de áudio listadas no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (captura `01-menu`)
- [x] **Tutorial** com 5 passos desenhados com as peças da partida: jogar os dados, cobrir, PRONTO,
      conferir o computador, quem cobre mais vence
- [x] **Seleção de nível** (3 níveis; captura `02-niveis`)
- [x] **Partida** com o centro limpo: dados, até duas contas, um botão, o monte (capturas `03` a `08`)
- [x] **Pausa** com continuar / recomeçar / sair; congela o voo do cubinho (teste, item 8)
- [x] **Ajuda** na partida (RE-05): abre por cima e devolve a partida intacta (teste, item 8)
  - [x] O tempo não corre com a ajuda aberta (`Tween.pausarTodos`)
- [x] **Resultado** para vitória **e** para derrota (teste, item 11)
- [x] Nenhum beco sem saída

## 4. Mecânica

- [x] Regras implementadas conforme a especificação (regras puras conferidas jogada a jogada contra o
      vídeo; teste de jogabilidade: dados, arrasto, toque, erro, ajuda, computador, fantasma)
- [x] Feedback imediato de acerto (anel verde + conta verde + som), sem frase
- [x] Feedback imediato de erro, sem tom punitivo (a casa balança, a peça volta)
- [ ] Dificuldade dos níveis testada **de verdade** — só simulada (100 000 partidas); falta criança
- [x] Nenhum estado travado: as fases de espera da criança (`dado`, `cobrir`, `conferir`) sempre têm um
      alvo tocável; as outras correm sozinhas
  - [x] `Watchdog` ligado no `atualizar(dt)`, depois do desvio da pausa, nas fases que correm sozinhas e
        durante o voo de uma peça; toda espera passa pelo `relogio` (`_depois`), e o destravamento roda o
        passo pendente; o teste confere que ele não disparou
- [x] Reiniciar limpa todo o estado (a cena é recriada; pausa → recomeçar)

## 5. Contrato do AVA

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | a meta: as 9 casas | 9 |
| `acertos` | vitória: casas cobertas − erros; derrota: casas cobertas | 6 a 8 numa vitória limpa |
| `erros` | casas erradas + PRONTO cedo (conferir mal não conta) | 0 a ~4 |
| `nivel` | 1 Fácil · 2 Médio · 3 Difícil | 1 |
| `jogo` | slug estável | `cubra-nove` |

- [x] Existe um único ponto de fim de partida (`_terminar` → `irPara('resultado', { resultado })`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (validado pelo `ava-teste.html`)
- [x] `acertos`/`erros` são da partida inteira
- [x] `totalPerguntas` é 9 em todo nível (conferido no Fácil e no Médio)
- [x] `nivel` é sempre enviado
- [x] `jogo` usa o slug estável
- [x] Os números vão como `number`
- [x] Os extras vão dentro de `extras` e chegam ao AVA (conferido: `cobertasCrianca`, `cobertasPorOrigem`…)
- [x] Nenhum dado de aluno é enviado (validado pelo `ava-teste.html`)
- [x] Derrota também registra (`registrarDerrota: true`; teste, item 11)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos (casas 100×100, dados 144×284, monte 150×150,
      PRONTO 300×84, COBRIU TUDO e FALTOU UM 270×84)
- [x] Espaço entre alvos: 8 px entre as casas (cada casa tem 100 px), 24 px entre os botões
- [ ] Contraste AA conferido em todos os elementos — não medido; o número branco só no verde-escuro
      (casa 2), os demais escuros; falta a medida
- [x] Cor nunca é o único portador de significado: a conta "não cabe" é riscada, a "já coberta" é
      tracejada, a casa coberta tem o cubinho, o erro balança
- [ ] Nenhuma ação exige saber ler — as dicas e a conferência são escritas e a **narração ainda não foi
      gravada**; até lá, quem não lê depende de um adulto
- [x] Som pode ser desligado (`SoundToggle` do motor)
- [x] Nada pisca: os contornos são estáveis; o anel do acerto e o balanço do erro acontecem uma vez; o
      dedinho faz um toque lento (1,4 s)
- [x] Um dedo por vez: a palma encostando não solta a peça (teste, item 9)

## 7. Validação

- [x] `node tools/testes.mjs` passa (157)
- [x] `node tools/teste-regras-cubra-nove.mjs` passa (22)
- [x] `node tools/verificar-independencia.mjs numerandus/cubra-nove` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/cubra-nove` **aprovado** (12/11: 56 requisições, todas locais; os 7 áudios carregam)
- [x] Fluxo completo de telas percorrido, sem travar (`teste-jogabilidade-cubra-nove.mjs`, 60 verificações)
- [x] **Vitória:** os números batem com o jogado
- [x] **Derrota:** registra, com as casas cobertas
- [x] **Replay sem recarregar:** 2 partidas geram exatamente 2 mensagens
- [x] **Sem duplicata** parado no resultado
- [x] `tools/ava-teste.html`: a mensagem chega ao pai e passa em todas as regras
- [ ] Testado em iframe pequeno, médio e grande — só o médio
- [ ] Testado com **toque** real — só mouse e toque emulados; falta celular em pé e tablet real
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado
- [ ] Este checklist com todos os itens fechados ou justificados — abertos acima, com motivo
- [x] `node tools/build.mjs` rodado depois da última mudança no motor (1.4.0), em todos os jogos
- [x] Versão do motor conferida (`engine/version.json` 1.4.0, igual à raiz)
- [ ] Zip gerado e aberto uma última vez — não gerado (usar `tar -a -c -f x.zip .`)
