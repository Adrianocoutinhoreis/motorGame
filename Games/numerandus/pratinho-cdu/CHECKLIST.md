# Checklist — Pratinho CDU

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `pratinho-cdu` · Criado em: 2026-10-20 · Motor: v1.3.6
>
> **Como foi verificado até aqui (22/10/2026):** `node tools/testes.mjs`, os dois portões de
> entrega, 30 000 jogadas sorteadas conferindo as regras (`src/regras.js`) e, principalmente,
> `node tools/teste-jogabilidade-pratinho-cdu.mjs`: **89 verificações com GESTO REAL** de ponteiro
> e de toque (menu, partida, erros, comparação, pausa, ajuda, os três níveis, celular em pé, o AVA
> dentro de um iframe em 4 tamanhos, o `Watchdog`). Nada é chamado por dentro da cena.
> **Ninguém ainda jogou de verdade** (criança, tablet): itens que pedem ouvido, criança ou aparelho
> real estão abertos, e são o que falta para marcar o jogo como pronto.

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — ler números de até três algarismos pelo
      valor posicional (contar centenas, dezenas e unidades, formar o número, inclusive com zero
      numa casa) e comparar dois números
- [x] Faixa etária confirmada e coerente com o design — 6 a 8 anos: o Fácil (até 99) atende o
      1º ano, Médio e Difícil (até 999) o 2º; alvos ≥ 64 px, nenhuma frase de retorno na tela
- [x] Mecânica descrita em até 3 frases (README, "O que é")
- [x] Níveis definidos: quantos, o que muda entre eles, o que cada um treina (`docs/REGRAS-PRATINHO-CDU.md` §5)
- [x] Condição de **vitória** definida e mensurável — mais estrelas que o computador ao fim das 5
      rodadas; a estrela de cada rodada é de quem a faz limpa (sem PRONTO errado)
- [x] Condição de **derrota** definida — menos estrelas que o computador (tela "QUASE LÁ!"); não há
      empate de partida. REGRAS §6
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — `textoEmCaixaAlta: true`; as letras C, D e U são desenhadas em caixa alta
  - [x] RE-02 — **exceção declarada**: a vitória vale 5 estrelas sem desconto de erros (decisão do
        humano, 22/10/2026; os erros ficam no relatório); a a derrota é o progresso puro (as rodadas
        limpas), sem desconto, como a regra manda (ver a tabela de testes em `docs/REGRAS-PRATINHO-CDU.md` §6)
  - [x] RE-03 — `mostrarPlacarTexto: false`: só as estrelas, sem fração nem "N RODADAS" que
        mentiria para quem jogou as 5
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`

## 2. Assets

- [x] Arte produzida (SVG/vetorial ou desenhada no canvas) — tudo desenhado em `src/desenho.js`
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo — **pendente**: o tutorial e a
      contagem (`numero1`–`numero9`) falam; faltam 6 falas da partida (lista de ids no README)
- [x] Efeitos de acerto, erro e contagem presentes (reaproveitados da coleção)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para **cada** áudio, em `assets/audio-transcricao/<nome>/transcricao.md`
- [ ] Transcrições **confirmadas ouvindo** — a narração do tutorial, os nove números, as sete falas novas e o `somErro` estão "não verificados" (mesma pendência
      da cópia em toda a coleção); `somConta` tem a origem/licença a confirmar
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (captura)
- [x] **Tutorial** com passos ilustrados e puláveis (4 passos, capturados) — narração gravada (21/10/2026), ainda não ouvida
- [x] **Seleção de nível** (3 níveis)
- [x] **Partida** com HUD legível: 5 estrelas de rodada, pausa, ajuda e som
- [x] **Pausa** com continuar / recomeçar / sair (`PauseScreen` do motor, mesma ligação da Corrida Espacial)
- [x] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial por cima do jogo
  - [x] Não há tempo correndo: `Tween.pausarTodos()` congela também a vez do computador
  - [x] Os passos servem a quem já está jogando: cada um mostra uma ação da partida
- [x] **Resultado** para vitória **e** derrota (capturados em 22/10/2026)
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição
- [x] Feedback **imediato** de acerto: anel verde no cartão, visto, o resultado da conta pula, som
- [x] Feedback **imediato** de erro: o cartão balança com anel âmbar e som; nada é tirado
- [ ] Dificuldade dos níveis testada de verdade (com criança) — **pendente**
- [x] Nenhum estado travado: sempre dá para agir ou a partida termina
  - [x] `Watchdog` ligado no `atualizar(dt)` depois do desvio da pausa, cobrindo queda dos
        grãos, ajuda de contar junto, comemoração e vez do computador (`_destravar`)
  - [x] A invariante do `vivo` conferida **durante** a fase travada: o teste de jogabilidade (§13)
        quebra uma vez a abertura da comparação na vez do computador, o `Tween.chamar` engole a
        exceção, e o `Watchdog` leva a partida à comparação sem ficar preso
- [x] Reiniciar limpa **todo** o estado (a cena é recriada por `irPara('jogando')`)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | as 5 rodadas da partida | `5` |
| `acertos` | vitória: sempre 5 (sem desconto, exceção à RE-02) · derrota: as rodadas limpas (0 a 2) | `0` a `5` |
| `erros` | PRONTOs errados na partida inteira (leitura + comparação), contagem crua | `0` ou mais |
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
- [x] Derrota também registra, com as rodadas limpas como `acertos` — conferido dentro do iframe do
      `ava-teste.html`: 3 rodadas com erro → `vitoria: false`, `acertos: 2`, `erros: 3`

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — o grão desenhado é menor, mas o alvo
      dele é um círculo de pelo menos 64 px (grãos vizinhos: vale o mais perto do dedo)
- [x] Espaço suficiente entre alvos (≥ 16 px entre rolinhos, opções e a coluna do PRONTO)
- [ ] Contraste de texto e de elementos essenciais em nível AA — **medido em 22/10/2026**: tudo passa
      (de 3,4:1 a 13,5:1), exceto o rótulo branco do PRONTO sobre o verde `#22C55E` (**2,28:1**, abaixo
      dos 3:1 do texto grande). Esse verde é o do botão "sucesso" da série inteira (a Corrida Espacial usa
      o mesmo), então não é decisão deste jogo. O que era do jogo foi corrigido: o número na pílula
      laranja da conta (U) era branco a 2,64:1 e passou a tinta escura
- [x] Cor **nunca** é o único portador de significado: cada fatia tem a letra; criança e
      computador têm ícone (pessoa / monitor) além da cor; o sinal de comparação é um símbolo
- [ ] Nenhuma ação exige saber ler: tudo tem ícone — **narração pendente**
- [x] Som pode ser desligado (`SoundToggle` do motor)
- [x] Nada pisca de forma rápida ou repetitiva (halo estável; a onda abre uma vez por toque)

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa (154)
- [x] `node tools/verificar-independencia.mjs numerandus/pratinho-cdu` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/pratinho-cdu` **aprovado** (58 requisições, todas locais)
- [x] `node tools/teste-jogabilidade-pratinho-cdu.mjs` **aprovado**: 89 verificações com gesto real
- [x] Jogo abre por `node tools/serve.mjs` sem requisição externa (confirmado pelo teste de entrega)
- [x] Fluxo completo de telas percorrido, sem travar: menu → níveis → partida → resultado → jogar de novo,
      só com toques, nos três níveis
- [x] **Vitória:** a mensagem `JOGO_CONCLUIDO` chega ao pai com os números batendo com o jogado
      (5 rodadas limpas → `acertos: 5`, `erros: 0`, `vitoria: true`)
- [x] **Derrota:** também registra, com `vitoria: false` e `acertos` = rodadas limpas (2)
- [x] **Replay:** 2 partidas sem recarregar geram exatamente 2 mensagens
- [x] **Sem duplicata:** ficar parado na tela de resultado (vitória e derrota) não gera mensagem extra
- [x] `tools/ava-teste.html`: a mensagem **chega ao pai** e o host a valida contra o contrato (2 válidas, 0 inválidas)
- [x] Testado em iframe de 400×700, 640×480, 760×500 e 1280×720: o canvas cabe na moldura nos quatro
- [x] Testado com **toque** emulado, num celular em pé (390×844, conteúdo girado): menu, nível, JOGAR,
      grão e seta ▲. **Tablet real: não testado**
- [x] Testado após trocar de aba e voltar — **simulado** pelo `visibilitychange` que o motor escuta (o
      laço para, retoma, e a partida segue intacta); uma troca de aba real não foi feita
- [x] Nenhum erro de JavaScript e nenhum disparo do `Watchdog` em partidas normais, na sessão inteira

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados
- [x] `node tools/build.mjs numerandus/pratinho-cdu` rodado por último
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo
- [x] Pasta copiada para **fora** do projeto, servida de uma subpasta qualquer e testada
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar — o
      `teste-entrega-avulsa` já copia a pasta para fora do projeto e a serve de uma subpasta funda;
      falta só gerar o zip

---

## O que falta para marcar como PRONTO

O que dá para verificar sem pessoas está verificado. O que bloqueia, em ordem:

1. **Narração da partida: faltam 6 falas.** Já falam: a contagem (`numero1`–`numero9`) e `suaVez`,
   `vezDoComputador`, `muitoBem`, `qualEMaior`, `tenteDeNovo`, `voceFezOMaior` e `computadorFezOMaior`
   (arquivos do Jogo dos Blocos). Faltam, em prioridade para quem não lê: `confiraACasaAcesa`,
   `vamosContarJuntos`, `nenhumGraoZero`; depois `olheACentena`, `olheADezena`, `empate`. O jogo funciona
   mudo nesses pontos, como a Corrida Espacial. Lista completa no README.
2. **Áudios não ouvidos**: a narração do tutorial, os nove números, as sete falas novas, o `somErro` e o `erroSOS` estão "não verificados";
   `somConta` e a narração têm a origem/licença a confirmar.
3. **Criança e tablet de verdade**: dificuldade dos níveis, se a derrota por tentativas extras soa dura
   aos 6 anos, e se o toque no grão (alvo de 64 px sobre um grão de ~30 px) acerta o que ela quer.
4. **Contraste do PRONTO** (2,28:1): decisão da série, não do jogo.
