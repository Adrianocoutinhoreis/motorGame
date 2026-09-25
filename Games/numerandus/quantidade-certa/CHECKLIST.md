# Checklist — Quantidade Certa

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `quantidade-certa` · Criado em: 2026-09-25 · Motor: v1.3.6

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — correspondência um-a-um e
      contagem: arrastar a peça de quantidade certa até o número, depois
      contar e encaixar exatamente essa quantidade de continhas
- [x] Faixa etária confirmada e coerente com o design — 6 a 7 anos, 1º ano
- [x] Mecânica descrita em até 3 frases — ver README ("O que é")
- [x] Níveis definidos: 3 (Fácil 3 pares/números até 5, Médio 5 pares/até 8,
      Difícil 7 pares/até 10), sem vidas — ver `config.js`
- [x] Condição de **vitória** definida e mensurável (todos os números da
      rodada combinados **e** com todos os furos preenchidos)
- [x] Condição de **derrota** — **não existe** (mesma decisão do Encaixe
      Certo/resto da coleção: errar o encaixe só demora mais, nunca perde)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (`config.textoEmCaixaAlta: true`)
  - [x] RE-02 — a tentativa errada de encaixe (`_tentativasErradas`) nunca passa
        por `placar.errar()` — só é registrada por fora, pro relatório do AVA;
        a nota nunca desconta isso (mesmo padrão do Encaixe Certo)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("7 NÚMEROS"), não "7 de 7"
        (`config.unidadePlacar`)
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida — peças, furos e continhas desenhados via `Path2D`/arcos
      no canvas (sem imagem), geometria de encaixe portada do Encaixe Certo
- [ ] Áudio de narração do tutorial — **ainda não gravado** (`fala:` aponta pra
      ids sem arquivo em `config.assets`)
- [x] Efeito de vitória presente — `acertoSOS.wav`, mesmo tradicional da coleção
- [x] Efeito de encaixe presente — `soltar_peca.mp3`, reaproveitado para os
      dois gestos de encaixar (peça no número e continha no furo)
- [ ] Efeito de clique genérico — ainda falta (`config.audio.clique` continua `null`,
      mesma decisão já tomada no Encaixe Certo)
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [ ] Ficha de transcrição por áudio (`assets/audio-transcricao/<id>/transcricao.md`)
      — pendente; os 2 arquivos já têm ficha equivalente nos jogos de onde
      foram copiados (Encaixe Certo), mas não uma cópia local ainda
- [ ] Transcrições confirmadas ouvindo — mesma pendência já registrada nos
      jogos que compartilham estes arquivos
- [x] Pendências de áudio listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR — telas padrão do motor
- [x] **Tutorial** ilustrado e pulável — os 3 passos testados rodando
      (`mostrarPasso(0..2)`); narração ainda não gravada
- [x] **Seleção de nível** (3 níveis) — tela padrão do motor
- [x] **Partida** com HUD legível (relógio + progresso "X/Y" quando há mais de
      uma onda, pausa, ajuda, som) — testado nos 3 níveis
- [x] **Pausa** — usa `PauseScreen` padrão; `Tween.pausarTodos()` congela peças,
      continhas e a chuva em andamento
- [x] **Ajuda** na partida (regra RE-05) — testado chamando `_pedirAjuda()`
      de verdade: pausa a cena (`cena.pausada`), mostra o tutorial por cima
- [x] **Resultado** para vitória — testado nos 3 níveis via captura
      (`captura-cena.mjs`), inclusive multi-onda (Difícil, 3 ondas)
- [x] Sem derrota, então sem tela de derrota — nada a testar aqui
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu (telas padrão do motor)

## 4. Mecânica

- [x] Regras implementadas conforme a definição — arrastar peça de quantidade
      até o número certo (`_soqueteVazioMaisProximo`/`_dentroDaTolerancia`,
      ímã de arrasto reaproveitado do Encaixe Certo), depois arrastar continhas
      até furos vazios (`_furoMaisProximo`, alvo GLOBAL — qualquer furo vazio
      de qualquer peça já encaixada serve, não há "furo errado")
- [x] Feedback **imediato** de acerto — peça trava com tween de encaixe, furo
      preenchido muda de cor na hora, peça completa dá um pulinho
      (`_celebrarPeca`) — e som (`soltar_peca.mp3`) nos dois gestos
- [x] Feedback **imediato** de erro (só na etapa 1: peça no número errado) —
      a peça não gruda e volta pra trilha, sem tom punitivo (nunca vermelho,
      nenhum som negativo, só "não coube aqui")
- [x] Dificuldade dos níveis testada de verdade — Fácil (3 pares, até 5),
      Médio (5 pares, até 8) e Difícil (7 pares, até 10, 3 ondas) confirmados
      via captura e via fluxo completo até a vitória
- [x] Nenhum estado travado: a peça/continha sempre volta pro lugar dela se
      soltar fora de um alvo válido
  - [x] `Watchdog` — não se aplica: não há fase de toque bloqueado por tween
        longo (arrasto é imediato, sem cadeia de animação que possa "perder"
        a devolução do toque, mesmo padrão do Encaixe Certo/Chave Mágica)
- [x] Reiniciar limpa **todo** o estado da partida anterior (`irPara('jogando', ...)` remonta a cena)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md`.

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | números da rodada (`meta`) | `3`, `5` ou `7` |
| `acertos` | números completados por inteiro (peça encaixada **e** todos os furos cheios) | `0`..`7` |
| `erros` | tentativas de encaixar a peça de quantidade num número que não bate | `0`, `1`, `2`… |
| `nivel` | nível jogado (1 Fácil, 2 Médio, 3 Difícil) | `1`, `2` ou `3` |
| `jogo` | slug estável | `quantidade-certa` |

- [x] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`, em `_terminar`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (gerado pelo `AvaBridge`, não escrito à mão)
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window` (motor)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Sem derrota registrada — `registrarDerrota: false`, mesma decisão do Encaixe Certo

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — peças de número e de
      quantidade herdam o dimensionamento já testado do Encaixe Certo
      (135–182 px de largura conforme a grade)
- [ ] **Furos individuais são menores que 64×64 px** — são alvos de DESTINO
      (não precisam do mínimo de toque porque quem se move é a CONTINHA, não
      o furo), mas a tolerância de aceite (`_raioToleranciaFuro`) é generosa
      e o alvo é GLOBAL (qualquer furo vazio de qualquer peça serve) — reduz
      bastante a exigência de precisão, mas não foi medido com dedo de
      criança de verdade ainda
- [x] Espaço suficiente entre alvos — grade herdada do Encaixe Certo (`gapTabuleiro`/`gapTrilha`)
- [x] Contraste de texto e de elementos essenciais em nível AA — peças brancas
      sobre fundo verde-escuro liso
- [x] Cor **nunca** é o único portador de significado — o encaixe decide pelo
      NÚMERO (a peça só trava se a quantidade bater), nunca por cor; as
      continhas são coloridas ao acaso, sem combinação nenhuma pra decidir
- [ ] Nenhuma ação exige saber ler: narração do tutorial ainda não gravada
      (pendência de áudio, ver seção 2)
- [x] Som pode ser desligado (`SoundToggle` padrão do motor)
- [x] Nada pisca de forma rápida ou repetitiva (destaque de encaixe é contínuo, nunca oscila)

## 7. Validação (no navegador)

- [x] `node tools/testes.mjs` passa (154 testes do motor, sem regressão)
- [x] `node tools/verificar-independencia.mjs numerandus/quantidade-certa` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/quantidade-certa` **aprovado**
      (11/11, 2 áudios carregados, zero erro de JS, zero 404)
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa
      (teste de entrega avulsa confirma)
- [x] Fluxo Menu → Tutorial → Níveis → Partida → Resultado percorrido, sem travar
- [x] **Vitória:** testada via `tools/captura-cena.mjs` nos 3 níveis, inclusive
      Difícil com 3 ondas — todas as peças combinadas e todos os furos
      preenchidos disparam "MUITO BEM!" com a unidade certa ("7 NÚMEROS")
- [x] **Encaixe errado (etapa 1):** testado — peça no número errado não gruda,
      `_tentativasErradas` incrementa, `placar.acertos` não muda
- [x] **Chuva de continhas:** testada — só começa depois que a ÚLTIMA peça da
      onda encaixa, uma continha nascendo de cada vez (não tudo de uma vez)
- [x] **Toque real:** testado com `PointerEvent` sintético via CDP
      (pointerdown/move/up, `pointerType:'touch'`), não só chamada direta —
      arrastar uma peça de quantidade até o número certo funciona ponta a
      ponta pelo caminho real do `Input.js`
- [x] **Toque real da CONTINHA até o furo** — testado com `PointerEvent`
      sintético via CDP, mesmo caminho real do `Input.js`
- [ ] **Replay/duplicata de mensagem AVA:** ainda não testado
- [ ] `tools/ava-teste.html`: mensagem chegando ao pai — ainda não testado
- [ ] Testado em iframe pequeno, médio e grande
- [ ] Testado com **toque em tablet real** (só toque sintético via CDP até agora)
- [ ] Testado após trocar de aba e voltar

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como os dados foram definidos,
      como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados — **narração
      do tutorial, transcrições, toque real da continha, iframe/ava-teste/tablet
      pendentes**
- [x] `node tools/build.mjs numerandus/quantidade-certa` rodado
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.6)
- [x] Pasta copiada para **fora** do projeto e testada — `teste-entrega-avulsa.mjs`
      cobre isso automaticamente (ver seção 7)
- [ ] Zip gerado e aberto antes de enviar
- [x] Catálogo (`__jogos.json`/`index.html` da raiz) regenerado via
      `node tools/pages-index.mjs` — 13 jogos listados, incluindo este
