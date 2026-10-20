# Checklist — Pratinho CDU

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `pratinho-cdu` · Criado em: 2026-10-20 · Motor: v1.3.6
>
> **Como foi verificado até aqui (20/10/2026):** `node tools/testes.mjs`, os dois portões de
> entrega, 30 000 jogadas sorteadas conferindo as regras (`src/regras.js`) e capturas de tela
> reais (`tools/captura-cena.mjs`) com um robô jogando partidas inteiras pelos métodos da cena.
> **Ninguém tocou no jogo ainda**: itens que pedem dedo, ouvido ou o AVA de verdade estão abertos.

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — ler números de até três algarismos pelo
      valor posicional (contar centenas, dezenas e unidades, formar o número, inclusive com zero
      numa casa) e comparar dois números
- [x] Faixa etária confirmada e coerente com o design — 6 a 8 anos: o Fácil (até 99) atende o
      1º ano, Médio e Difícil (até 999) o 2º; alvos ≥ 64 px, nenhuma frase de retorno na tela
- [x] Mecânica descrita em até 3 frases (README, "O que é")
- [x] Níveis definidos: quantos, o que muda entre eles, o que cada um treina (`docs/REGRAS-PRATINHO-CDU.md` §5)
- [x] Condição de **vitória** definida e mensurável — terminar as 5 rodadas
- [x] Condição de **derrota** definida — não existe; quem ganha mais estrelas do computador
      depende da sorte do punhado e vai em `extras` (REGRAS §6)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — `textoEmCaixaAlta: true`; as letras C, D e U são desenhadas em caixa alta
  - [x] RE-02 — a cena usa `placar.paraAva()`: a nota é 5 menos os PRONTOs errados (conferido:
        partida com 1 comparação errada terminou com 4 estrelas)
  - [x] RE-03 — `mostrarPlacarTexto: false`: só as estrelas, sem fração nem "N RODADAS" que
        mentiria para quem jogou as 5
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`

## 2. Assets

- [x] Arte produzida (SVG/vetorial ou desenhada no canvas) — tudo desenhado em `src/desenho.js`
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo — **pendente**: nenhuma
      fala gravada (lista de ids no README)
- [x] Efeitos de acerto, erro e contagem presentes (reaproveitados da coleção)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para **cada** áudio, em `assets/audio-transcricao/<nome>/transcricao.md`
- [ ] Transcrições **confirmadas ouvindo** — `somErro` segue "não verificada" (mesma pendência
      da cópia em toda a coleção); `somConta` tem a origem/licença a confirmar
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (captura)
- [x] **Tutorial** com passos ilustrados e puláveis (4 passos, capturados) — narração pendente
- [x] **Seleção de nível** (3 níveis)
- [x] **Partida** com HUD legível: 5 estrelas de rodada, pausa, ajuda e som
- [x] **Pausa** com continuar / recomeçar / sair (`PauseScreen` do motor, mesma ligação da Corrida Espacial)
- [x] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial por cima do jogo
  - [x] Não há tempo correndo: `Tween.pausarTodos()` congela também a vez do computador
  - [x] Os passos servem a quem já está jogando: cada um mostra uma ação da partida
- [x] **Resultado** — sempre de vitória (não existe derrota, ver seção 1); capturado
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição
- [x] Feedback **imediato** de acerto: anel verde no cartão, visto, o resultado da conta pula, som
- [x] Feedback **imediato** de erro: o cartão balança com anel âmbar e som; nada é tirado
- [ ] Dificuldade dos níveis testada de verdade (com criança) — **pendente**
- [x] Nenhum estado travado: sempre dá para agir ou a partida termina
  - [x] `Watchdog` ligado no `atualizar(dt)` depois do desvio da pausa, cobrindo queda dos
        grãos, ajuda de contar junto, comemoração e vez do computador (`_destravar`)
  - [ ] A invariante do `vivo` conferida **durante** a fase travada — as cadeias estão em
        `this`, `this.prato` e `this.cartao`, que é o que o `vivo` olha; falta forçar uma exceção
        no meio para ver o resgate
- [x] Reiniciar limpa **todo** o estado (a cena é recriada por `irPara('jogando')`)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | as 5 rodadas da partida | `5` |
| `acertos` | 5 menos os PRONTOs errados (leitura e comparação), mínimo 0 — RE-02 | `3` a `5` |
| `erros` | PRONTOs errados na partida inteira (leitura + comparação) | `0` a `4` |
| `nivel` | 1 Fácil, 2 Médio, 3 Difícil | `2` |
| `jogo` | slug estável | `pratinho-cdu` |
| `extras` | `leiturasDePrimeira`, `errosLeitura`, `errosComparacao`, `rodadasComAjuda`, `estrelasCrianca`, `estrelasComputador`, `ganhouDoComputador`, `numeros` | — |

- [x] Existe **um único** ponto de fim de partida (`GameScene._terminar`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (do motor)
- [x] `acertos`/`erros` são da **partida inteira**
- [x] `totalPerguntas` reflete a meta real do nível jogado (5 em todos)
- [x] `nivel` é sempre enviado
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"` (do motor; `teste-entrega-avulsa` confirmou
      que fora de iframe nada é enviado)
- [x] Nenhum dado de aluno é enviado
- [x] Derrota: ~~também registra~~ não existe derrota (documentado em REGRAS §6)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — o grão desenhado é menor, mas o alvo
      dele é um círculo de pelo menos 64 px (grãos vizinhos: vale o mais perto do dedo)
- [x] Espaço suficiente entre alvos (≥ 16 px entre rolinhos, opções e a coluna do PRONTO)
- [ ] Contraste de texto e de elementos essenciais em nível AA — não medido
- [x] Cor **nunca** é o único portador de significado: cada fatia tem a letra; criança e
      computador têm ícone (pessoa / monitor) além da cor; o sinal de comparação é um símbolo
- [ ] Nenhuma ação exige saber ler: tudo tem ícone — **narração pendente**
- [x] Som pode ser desligado (`SoundToggle` do motor)
- [x] Nada pisca de forma rápida ou repetitiva (halo estável; a onda abre uma vez por toque)

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa (154)
- [x] `node tools/verificar-independencia.mjs numerandus/pratinho-cdu` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/pratinho-cdu` **aprovado** (53 requisições, todas locais)
- [x] Jogo abre por `node tools/serve.mjs` sem requisição externa (confirmado pelo teste acima)
- [x] Fluxo completo de telas percorrido, sem travar (robô, nos três níveis)
- [ ] **Vitória:** console mostra `[AVA] JOGO_CONCLUIDO` com os números batendo com o jogado
- [x] ~~**Derrota**~~ — não existe derrota
- [ ] **Replay:** 2 partidas sem recarregar geram exatamente 2 mensagens
- [ ] **Sem duplicata:** ficar parado na tela de resultado não gera mensagem extra
- [ ] `tools/ava-teste.html`: a mensagem **chega ao pai** e passa em todas as regras
- [ ] Testado em iframe pequeno, médio e grande sem cortar nem deformar
- [ ] Testado com **toque** (emulador de dispositivo ou tablet real)
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados
- [x] `node tools/build.mjs numerandus/pratinho-cdu` rodado por último
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo
- [x] Pasta copiada para **fora** do projeto, servida de uma subpasta qualquer e testada
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar
