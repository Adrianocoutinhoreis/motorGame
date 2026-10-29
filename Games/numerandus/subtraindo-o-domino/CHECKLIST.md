# Checklist — Subtraindo o Dominó

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `subtraindo-o-domino` · Criado em: 2026-10-26 · Motor: ver `engine/version.json`
>
> **Como foi verificado até aqui (28/10/2026, depois da regra do vídeo):** `node tools/testes.mjs` (154), os
> dois portões de entrega (11 verificações da entrega avulsa, 66 requisições, todas locais) e,
> principalmente, `node tools/teste-jogabilidade-subtraindo-o-domino.mjs`: **149 verificações** (rodado
> duas vezes seguidas, porque as rodadas extras têm aleatoriedade) — regras puras em Node (30 000
> jogadas de dados, 10 000 mesas para os dados "sem pedra", 20 000 jogadas do computador, 3 000 mesas) e **GESTO REAL**
> de ponteiro e de toque (menu, dados, marcar, erro, a vez que passa, as rodadas extras, a ausência
> de prévia do computador, pausa, ajuda, os três níveis, celular em pé, o AVA dentro de um iframe em 4
> tamanhos, o `Watchdog`). Nada é chamado por dentro da cena.
> **Ninguém ainda jogou de verdade** (criança, tablet): itens que pedem ouvido, criança ou aparelho
> real estão abertos, e são o que falta para marcar o jogo como pronto.

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — decompor um total em duas parcelas: a partir da
      soma de dois dados, achar a pedra de dominó cujos pontos somam o mesmo valor
- [x] Faixa etária confirmada e coerente com o design — 7 a 8 anos (2º ano): soma até 12; alvos ≥ 64 px;
      a única frase escrita da partida é a pergunta com o total
- [x] Mecânica descrita em até 3 frases (README, "O que é")
- [x] Níveis definidos: quantos, o que muda entre eles, o que cada um treina (`docs/REGRAS-SUBTRAINDO-O-DOMINO.md` §5)
- [x] Condição de **vitória** definida e mensurável — **mais pedras que o computador** ao fim das rodadas (a
      regra do vídeo); o computador joga em toda rodada; os dados da criança sempre têm pedra
- [x] Condição de **derrota** definida — menos pedras que o computador (tela "QUASE LÁ!"); o empate vai à
      **rodadas extras** (REGRAS §4.5), que desempatam, e se a mesa esvaziar empatada a criança leva
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — `textoEmCaixaAlta: true`; a pergunta é desenhada em caixa alta
  - [x] RE-02 — **exceção declarada**: a vitória vale a nota cheia sem desconto de erros (mesma regra do
        Pratinho CDU; os erros ficam no relatório); a derrota é o progresso puro (as pedras da criança)
  - [x] RE-03 — `mostrarPlacarTexto: false`: só a fileira de estrelas do resultado, sem "N RODADAS"
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`
  - [x] RE-05 — o `tutorial` tem 3 passos com `desenho` animado e serve também à ajuda da partida

## 2. Assets

- [x] Arte produzida (SVG/vetorial ou desenhada no canvas) — tudo desenhado em `src/desenho.js`
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo — **pendente**: faltam `numero10`–`numero12`
      e a narração do tutorial (`tutorialTela1`–`3`); lista de ids no README
- [x] Efeitos de acerto, erro e pouso presentes (reaproveitados da coleção)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para **cada** áudio, em `assets/audio-transcricao/<nome>/transcricao.md` (16)
- [ ] Transcrições **confirmadas ouvindo** — os 8 números e as 3 falas estão "não verificados"; `somErro` também
      (mesma pendência da cópia em toda a coleção); `somConta` tem a origem/licença a confirmar
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (captura)
- [x] **Tutorial** com passos ilustrados e puláveis (3 passos, capturados) — **sem narração gravada**
- [x] **Seleção de nível** (3 níveis)
- [x] **Partida** com HUD legível: marcadores de rodada, pausa, ajuda e som
- [x] **Pausa** com continuar / recomeçar / sair (`PauseScreen` do motor)
- [x] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial por cima do jogo
  - [x] Não há tempo correndo: `Tween.pausarTodos()` congela os dados e o voo da pedra
  - [x] Os passos servem a quem já está jogando: cada um mostra uma ação da partida
- [x] **Resultado** para vitória **e** derrota (a tela da série)
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição
- [x] Feedback **imediato** de acerto: ✓ verde na pedra, a pedra voa para a bandeja, som e "Muito bem!"
- [x] Feedback **imediato** de erro: a pedra balança com ✕ vermelho, som e "Tente de novo!"; nada é tirado
- [x] **A vez da criança passa no limite de erros do nível** (Fácil 4º, Médio 3º, Difícil 2º): conta revelada, vaga
      vazia (✕) na bandeja, pedra na mesa; conferido nos três níveis (REGRAS §4.3). Erros abaixo do limite não
      tiram pedra
- [x] **O computador joga em TODA rodada**, também numa partida perfeita (conferido nos três níveis)
- [x] **Vence quem tem mais pedras** (regra do vídeo): conferido na vitória numa extra (Fácil 4 × 3), na derrota
      por vez perdida (Fácil 2 × 3) e (nos testes do AVA) na vitória do Difícil em extras
- [x] **Rodadas extras** no empate: estrela dourada no alto, vaga extra em cada bandeja, e cada um joga os
      **próprios dados** (vez da criança, depois a do computador); o total do computador **não** aparece na vez
      da criança; o computador é **protegido na 1ª extra** (leva a pedra) e depois joga dados honestos **só em totais que
      existem no nível**, podendo cair num total esgotado e ficar sem (✕); a partir da 3ª extra os dados dele caem
      num total esgotado (conferido em 10 000 mesas); termina quando um leva e o outro não. Defeito corrigido em
      28/10/2026: ele ficava sem pedra na 1ª extra em 78% das partidas do Fácil (28% das jogadas eram totais
      que nem existem no nível); agora 0% na 1ª, e as extras duram de 2 a 3 (teto de 5: empatado nele, a criança leva)
- [x] **Sem prévia do dado do computador** (removida em 28/10/2026, a pedido do humano): no Fácil, no Médio e no
      Difícil nada do computador aparece na vez da criança (sem selo, sem total, sem lançamento compartilhado); o
      total dele só aparece na vez dele. O selo aberto e o "bloqueio" foram retirados
- [ ] **Equilíbrio da regra do vídeo com criança** — o empate nas rodadas combinadas é o normal e as extras são o
      clímax; falta ver se isso agrada (README, pendência 5)
- [ ] Dificuldade dos níveis testada de verdade (com criança) — **pendente**
- [x] Nenhum estado travado: sempre dá para agir ou a partida termina
  - [x] `Watchdog` ligado no `atualizar(dt)` depois do desvio da pausa, cobrindo a rolagem dos dados, o
        voo da pedra e as etapas da vez do computador (`_destravar`)
  - [x] A invariante do `vivo` conferida **durante** a fase travada: o teste de jogabilidade (§12) quebra
        uma vez a parada dos dados (e, no §12b, a parada dos dados do computador), o `Tween.chamar` engole a
        exceção, e o `Watchdog` leva a partida adiante sem ficar preso
- [x] Reiniciar limpa **todo** o estado (a cena é recriada por `irPara('jogando')`)
- [x] Todo total sorteado **para a criança** tem pedra na mesa (30 000 jogadas conferidas): ela nunca perde por
      azar. O do computador também tem pedra na hora do sorteio (20 000 jogadas); só a jogada da criança a tira

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | as rodadas combinadas do nível (as extras não contam) | `3`, `3` ou `5` |
| `acertos` | vitória: nota cheia (sem desconto, exceção à RE-02) · derrota: as pedras da criança | `0` a `5` |
| `erros` | PRONTOs errados na partida inteira, contagem crua | `0` ou mais |
| `nivel` | 1 Fácil, 2 Médio, 3 Difícil | `2` |
| `jogo` | slug estável | `subtraindo-o-domino` |
| `extras` | `desfecho`, `rodadasLimpas`, `rodadasComFalha`, `errosPronto`, `rodadasComAjuda`, `vezesPerdidas`, `pedrasCrianca`, `pedrasComputador`, `rodadasExtras`, `ganhouDoComputador`, `totais`, `totaisComputador` | — |

- [x] Existe **um único** ponto de fim de partida (`GameScene._terminar`, protegido por `_fimResolvido`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (do motor)
- [x] `acertos`/`erros` são da **partida inteira**
- [x] `totalPerguntas` reflete a meta real do nível jogado (3, 3 e 5)
- [x] `nivel` é sempre enviado
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"` (do motor; `teste-entrega-avulsa` confirmou que fora
      de iframe nada é enviado)
- [x] Nenhum dado de aluno é enviado
- [x] Derrota também registra, com as pedras da criança como `acertos` — conferido dentro do iframe do
      `ava-teste.html`: vez perdida na 1ª rodada (4 erros no Fácil) → `vitoria: false`, `acertos: 2`, `erros: 4`,
      `pedrasCrianca: 2`, `pedrasComputador: 3`, `vezesPerdidas: 1`

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — pedra 128×64, dado 128×128, PRONTO 320×96
- [x] Espaço suficiente entre alvos — 16 px nominais entre as pedras e **nunca menos de 8 px** no pior caso do
      balanço (conferido em 3 000 mesas); a série pede 12 px. **Revisar com criança**: se 8 px no pior caso é pouco
- [x] Contraste medido em 26/10/2026: pergunta 9,0–11,6:1; pontos sobre a pedra 14,3:1; selo do total 9,1:1;
      **PRONTO 6,5:1** (texto escuro sobre o verde; o branco da série dá 2,3:1, então aqui já foi corrigido);
      nome da bandeja 4,0:1; marcador dourado 6,0:1 e azul 3,4:1. Em 28/10/2026: marcador de rodada feito sobre o feltro
      10,4:1; estrela da extra 7,0:1; **dados azuis** (28/10/2026): bolinhas brancas sobre o azul 5,5:1, azul do dado × azul-acinzentado do computador 1,8:1 (bem distintos), azul × feltro 2,3:1, por isso o dado leva contorno claro
- [x] Cor **nunca** é o único portador de significado: criança e computador têm ícone (pessoa / monitor); as pedras de cada um ficam na bandeja dele; a vaga sem pedra é ✕ (não
      só cor); o erro é ✕ e o acerto ✓, além da cor
- [ ] Nenhuma ação exige saber ler: tudo tem ícone e gesto — **narração pendente** (a pergunta escrita tem o total
      falado de "dois" a "nove")
- [x] Som pode ser desligado (`SoundToggle` do motor)
- [x] Nada pisca de forma rápida ou repetitiva (os dados rolam por ~0,9 s; o dedinho e o PRONTO pulsam de leve)

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa (154)
- [x] `node tools/verificar-independencia.mjs numerandus/subtraindo-o-domino` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/subtraindo-o-domino` **aprovado** (17 áudios, 66 requisições, todas locais)
- [x] `node tools/teste-jogabilidade-subtraindo-o-domino.mjs` **aprovado**: 149 verificações
- [x] Jogo abre por `node tools/serve.mjs` sem requisição externa (confirmado pelo teste de entrega)
- [x] Fluxo completo de telas percorrido, sem travar: menu → níveis → partida → resultado → jogar de novo, só com toques
- [x] **Vitória:** a mensagem `JOGO_CONCLUIDO` chega ao pai com os números batendo com o jogado
      (Fácil, 3 rodadas limpas e 1 ou mais extras → `acertos: 3`, `erros: 0`, `vitoria: true`, `rodadasExtras ≥ 1`; Difícil, 5 → `acertos: 5`, por extras)
- [x] **Derrota:** também registra, com `vitoria: false` e `acertos` = as pedras da criança (2)
- [x] **Replay:** partidas seguidas sem recarregar geram exatamente uma mensagem cada
- [x] **Sem duplicata:** ficar parado na tela de resultado (vitória e derrota) não gera mensagem extra
- [x] `tools/ava-teste.html`: a mensagem **chega ao pai** e o host a valida contra o contrato (3 válidas, 0 inválidas)
- [x] Testado em iframe de 400×700, 640×480, 760×500 e 1280×720: o canvas cabe na moldura nos quatro
- [x] Testado com **toque** emulado, num celular em pé (390×844, conteúdo girado): menu, nível, dados, pedra e
      PRONTO. **Tablet real: não testado**
- [x] Testado após trocar de aba e voltar — **simulado** pelo `visibilitychange` que o motor escuta; uma troca
      de aba real não foi feita
- [x] Nenhum erro de JavaScript e nenhum disparo do `Watchdog` em partidas normais, na sessão inteira

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados
- [x] `node tools/build.mjs numerandus/subtraindo-o-domino` rodado por último
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo
- [x] Pasta copiada para **fora** do projeto, servida de uma subpasta qualquer e testada (`teste-entrega-avulsa`)
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar

---

## O que falta para marcar como PRONTO

O que dá para verificar sem pessoas está verificado. O que bloqueia, em ordem:

1. **Narração: 6 arquivos a gravar.** `numero10`, `numero11`, `numero12` e a narração do tutorial
   (`tutorialTela1`–`3`, textos no README). O jogo funciona mudo nesses pontos.
2. **O conjunto de pedras do vídeo.** O jogo usa 21 pedras (sem as de 0); a transcrição fala em "tirar o 0 e
   o 1". Confirmar com o autor do vídeo (REGRAS §3).
3. **Áudios não ouvidos**: os 8 números e as 3 falas estão "não verificados"; origem/licença das falas e do
   `somConta` a confirmar.
4. **Criança e tablet de verdade**: dificuldade dos níveis, se o Médio com 21 pedras pesa para o 2º ano, e se
   o toque em pedras com 8 a 16 px entre elas acerta o que ela quer.
5. **A regra do vídeo com criança** (revisada em 28/10/2026): as extras decidem quase toda partida; ver se é
   o clímax ou se as rodadas combinadas parecem aquecimento, e se
   perder a pedra com a vez que passa soa duro. Nenhuma fala anuncia as extras.
