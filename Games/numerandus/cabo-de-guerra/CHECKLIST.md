# Checklist — Cabo de Guerra

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `cabo-de-guerra` · Criado em: 2026-11-09 · Motor: v1.3.6 (com o tema `'cabo'`)
>
> Marcado = **verificado**, por script ou olhando a captura. O que só um humano confere (ouvir,
> jogar com criança, tablet de verdade) está aberto, com o motivo.

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — `config.objetivo` e a especificação
- [x] Faixa etária confirmada e coerente com o design — 2º ano (7 a 8 anos), como o vídeo
- [x] Mecânica descrita em até 3 frases — README, "O que é"
- [x] Níveis definidos — trilha de 7 / 8 / 9 passos; o que cresce é a carta (especificação §5)
- [x] Condição de **vitória** definida e mensurável — levar a ficha até a ponta da criança
- [x] Condição de **derrota** definida — o computador levar a ficha até a ponta dele
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — todo texto da cena e do tutorial está em CAIXA ALTA (`textoEmCaixaAlta: true`; as
        perguntas são geradas em caixa alta e o teste confere 60 000 cartas)
  - [x] RE-02 — a cena usa `placar.paraAva()`; vitória = meta − erros, derrota = as casas puxadas (conferido no AVA)
  - [x] RE-03 — "N CASAS" (`unidadePlacar`; captura `10-resultado-1`)
  - [x] RE-04 — a cena **não** passa `estrelas`
  - [x] RE-05 — a ajuda abre por cima da partida sem perdê-la (teste, item 6)

## 2. Assets

- [x] Arte desenhada no canvas (tira, nó, dado, carta), coerente com a série
- [ ] Áudio de narração presente para **todo** conteúdo falado — **não**: perguntas, números de 11 em
      diante, conferência e o tutorial faltam (lista no README). O jogo funciona mudo nesses pontos.
- [x] Efeitos de acerto, erro e pouso presentes (reaproveitados da coleção)
- [x] Todo asset está dentro de `assets/`, com caminho relativo (`verificar-independencia.mjs`)
- [x] Nenhuma fonte, imagem ou som vindo da internet (`teste-entrega-avulsa.mjs`: 67 requisições, todas locais)
- [x] Origem/licença de cada asset registrada no `README.md` (com as pendências de licença da coleção)
- [x] Ficha de transcrição para cada um dos 18 áudios
- [ ] Transcrições **confirmadas ouvindo** — nenhuma foi ouvida (status 🟡 herdado dos jogos de origem)
- [x] Pendências de áudio listadas no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (captura `01-menu`)
- [x] **Tutorial** com 5 passos ilustrados com as peças da partida e puláveis; o 5º diz o desfecho (quem leva
      a ficha até a própria ponta ganha) — **sem narração ainda**
- [x] **Seleção de nível** (3 níveis; captura `02-niveis`)
- [x] **Partida** com HUD legível: tira grande no centro, "FALTAM N" embaixo das pontas, barra de baixo (dado, vez, botão),
      pausa, ajuda, som
- [x] **Pausa** com continuar / recomeçar / sair; congela a ficha andando (teste, item 6)
- [x] **Ajuda** na partida (RE-05): abre por cima da carta e devolve a carta intacta (teste, item 6)
  - [x] O tempo não corre com a ajuda aberta (`Tween.pausarTodos`)
  - [x] Os passos servem a quem travou: dado, carta, puxar, conferir o computador, como se ganha
- [x] **Resultado** para vitória **e** para derrota (teste, item 8)
- [x] Nenhum beco sem saída

## 4. Mecânica

- [x] Regras implementadas conforme a especificação (teste: dado, carta com a ficha parada, carta certa e
      errada, vez do computador, conferência, o computador puxando, chegada de cada lado)
- [x] Feedback imediato de acerto (verde + som + "ACERTOU!")
- [x] Feedback imediato de erro, sem tom punitivo (a conta certa mostrada; a ficha só fica parada)
- [ ] Dificuldade dos níveis testada **de verdade** — só simulada (20 000 partidas, especificação §5); falta criança
- [x] Nenhum estado travado: as fases de espera da criança (`dado`, `carta`, `conferir`, `retorno`)
      sempre têm um alvo tocável; as outras correm sozinhas
  - [x] `Watchdog` ligado no `atualizar(dt)`, depois do desvio da pausa, nas fases `cpuEspera`,
        `rolando`, `puxando`, `chegou`
  - [x] O `vivo` olha o `relogio` **e** a ficha (os tweens da ficha andando); o teste confere que ele não
        disparou em nenhuma partida
- [x] Reiniciar limpa todo o estado (a cena é recriada; pausa → recomeçar)

## 5. Contrato do AVA

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | a meta: os passos da trilha do nível | 7, 8 ou 9 |
| `acertos` | vitória: meta − cartas erradas; derrota: as casas puxadas | 7 numa vitória limpa no Fácil |
| `erros` | cartas respondidas erradas pela criança (conferir mal não conta) | 0 a ~5 |
| `nivel` | 1 Fácil · 2 Médio · 3 Difícil | 1 |
| `jogo` | slug estável | `cabo-de-guerra` |

- [x] Existe um único ponto de fim de partida (`_terminar` → `irPara('resultado', { resultado })`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (validado pelo `ava-teste.html`)
- [x] `acertos`/`erros` são da partida inteira
- [x] `totalPerguntas` reflete a meta do nível jogado (7 no Fácil, 8 no Médio, conferido)
- [x] `nivel` é sempre enviado
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` para `window.parent` (motor)
- [x] Nenhum dado de aluno é enviado (validado pelo `ava-teste.html`)
- [x] Derrota também registra (`registrarDerrota: true`; teste, item 8)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos (respostas 270×108, CERTO/ERRADO 260×84,
      JOGAR O DADO 244×112, CONTINUAR 300×64, dado 128×128).
      As bolinhas e a ficha não são alvos de toque.
- [x] Espaço entre alvos: 30 px entre as respostas, 40 px entre CERTO e ERRADO
- [ ] Contraste AA conferido em todos os elementos — texto escuro no CONTINUAR verde (como o PRONTO do
      Dominó); o rótulo cinza "FALTAM" dos quadros não foi medido
- [x] Cor nunca é o único portador de significado: a faixa da vez tem texto, a resposta certa ganha
      borda e o retorno escrito, as pontas têm o nome embaixo
- [ ] Nenhuma ação exige saber ler — a pergunta e o retorno são escritos e a **narração ainda não foi
      gravada**; até lá, quem não lê depende de um adulto (é 2º ano, mas é pendência)
- [x] Som pode ser desligado (`SoundToggle` do motor)
- [x] Nada pisca: o brilho da ficha e da ponta é estável; o dado e o botão só respiram

## 7. Validação

- [x] `node tools/testes.mjs` passa (154)
- [x] `node tools/verificar-independencia.mjs numerandus/cabo-de-guerra` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/cabo-de-guerra` **aprovado** (11/11)
- [x] Sem requisição externa (entrega avulsa)
- [x] Fluxo completo de telas percorrido, sem travar (`teste-jogabilidade-cabo-de-guerra.mjs`, 75
      verificações, 3 vezes seguidas sem falha)
- [x] **Vitória:** os números batem com o jogado
- [x] **Derrota:** registra, com as casas puxadas
- [x] **Replay sem recarregar:** 2 partidas geram exatamente 2 mensagens
- [x] **Sem duplicata** parado no resultado
- [x] `tools/ava-teste.html`: a mensagem chega ao pai e passa em todas as regras
- [ ] Testado em iframe pequeno, médio e grande — só o médio
- [ ] Testado com **toque** — só mouse sintético; falta celular em pé e tablet real
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado
- [ ] Este checklist com todos os itens fechados ou justificados — abertos acima, com motivo
- [x] `node tools/build.mjs` rodado depois da última mudança no motor (o tema `'cabo'`), em todos os jogos
- [x] Versão do motor conferida (`engine/version.json` 1.3.6, igual à raiz)
- [x] Pasta testada fora do projeto (`teste-entrega-avulsa.mjs`)
- [ ] Zip gerado e aberto uma última vez — não gerado (o jogo ainda não vai para alunos)
