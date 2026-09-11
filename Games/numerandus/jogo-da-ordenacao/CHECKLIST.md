# Checklist — Jogo da Ordenação

> Passos para este jogo ser considerado **concluído**.
> Slug: `jogo-da-ordenacao` · Criado em: 2026-09-10 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico: ordenar os números de 0 a 9 (crescente ou
      decrescente), arrastando cada ficha só para uma célula vizinha vazia —
      raciocínio espacial e sequência numérica, não conta matemática.
- [x] Faixa etária: 5 a 8 anos.
- [x] Níveis definidos: **três** — Fácil (crescente, poucas trocas), Médio
      (crescente, tudo embaralhado), Difícil (decrescente, tudo embaralhado).
- [x] Condição de vitória: as 10 fichas na posição-alvo ao mesmo tempo. Sem
      derrota — quebra-cabeça solo (`config.registrarDerrota: false`).
- [x] `src/config.js` preenchido por inteiro.
- [x] Regras educacionais conferidas (RE-01 a RE-05):
  - [x] RE-01 — todo texto em CAIXA ALTA (`textoEmCaixaAlta: true`).
  - [x] RE-02 — **não se aplica desconto aqui, e isso foi verificado, não
        assumido.** A primeira versão contava erro a cada jogada legal que não
        melhorava o tabuleiro na hora, para `ScoreSystem.pontuacao` descontar
        na vitória; simulando o embaralhamento resolvido pelo caminho ÓTIMO
        (nenhuma jogada desperdiçada), o nível Médio (60 passos) ainda somava
        ~40 desses "erros" — um quebra-cabeça deslizante exige isso, não é
        deslize do aluno — e com meta 10 isso zerava a pontuação em QUALQUER
        resolução real dos níveis Médio/Difícil. Corrigido: nenhuma jogada
        legal é penalizada (ver `GameScene._tentarMover`); toda vitória vale
        10/10. Não há desconto na derrota porque não existe derrota neste jogo.
  - [x] RE-03 — placar exibe a UNIDADE ("9 ACERTOS", não "9 de 10") via
        `config.unidadePlacar: { singular: 'acerto', plural: 'acertos' }`.
  - [x] RE-04 — estrelas calculadas pela `ResultScreen` a partir de
        `acertos`/`totalPerguntas` reais, sem escala própria do jogo.
  - [x] RE-05 — ajuda/pausa não custam a partida: `Tween.pausarTodos()` é
        chamado ANTES de abrir o painel de Pausa/Ajuda (mesma correção já
        validada no Bingo), e qualquer arrasto em andamento é cancelado
        (a ficha volta pro lugar) antes do véu subir — ver
        `GameScene._cancelarArrastoEmCurso`.

## 2. Telas & Layout

> O layout de cada tela foi desenhado e aprovado num mockup interativo antes
> desta implementação começar — o que está aqui é o que foi aprovado.

- [x] **Menu** com JOGAR e COMO JOGAR, tema `'quarto'` próprio (parede
      lilás-acinzentada + prateleira de madeira — ver `engine/ui/Background.js`
      e `engine/screens/MenuScreen.js`). Título num cartão simples e neutro
      (`PlacaTituloQuarto`): o cenário carrega o tema, a placa não precisa
      repetir "livro"/"madeira" como enfeite.
- [x] **Tutorial** com **3 passos**, cada um desenhando uma miniatura do
      tabuleiro REAL (mesmas 12 cores, mesmo círculo branco) — nunca um ensaio
      visualmente diferente da partida de verdade.
- [x] **Seleção de Nível** com 3 cartões táteis (`LevelSelectScreen` padrão).
- [x] **Partida**: o tabuleiro é a **área de maior destaque** da tela — ocupa
      quase toda a altura útil abaixo do HUD. Células **levemente
      retangulares** (não quadrado perfeito, proporção 1.05): a grade 3×4 é
      bem mais alta que larga, e o quadro do jogo é bem mais largo que alto —
      um pouco de retângulo cobre mais da largura sem descaracterizar a grade.
- [x] **Cronômetro ao vivo** no HUD, topo-centro, entre os ícones de
      pausa/ajuda e o de som — ícone de relógio + "mm:ss" escritos em branco
      direto na parede (sem painel novo). Só INFORMA, nunca cobra: sem cor de
      alerta, sem piscar, sem limite nenhum. Lê `game.tempoJogando` (getter
      público no motor), o MESMO número que vira `tempoSegundos` no fim da
      partida — então congela sozinho durante Pausa/Ajuda, sem lógica própria
      do jogo para isso.
- [x] **Pausa** enxuta: só CONTINUAR / COMEÇAR DE NOVO / SAIR — sem atalho de
      AJUDA dentro do painel (`aoAjuda` não é passado; a `PauseScreen` do motor
      só desenha esse botão quando recebe `aoAjuda`) nem ícone de som
      (`mostrarSom: false`, já que o HUD atrás do véu sempre o mostra). Quem
      quiser ajuda usa o ícone de tutorial do próprio HUD.
- [x] **Resultado** com estrelas + "N ACERTOS" + **tempo da partida** (mm:ss,
      `config.mostrarTempo: true` — ver seção 6).

## 3. O tabuleiro e o arrastar

- [x] 12 células (3×4), cada uma com **cor fixa própria** — a cor pertence à
      CASA, nunca ao número (igual ao vídeo de referência). Reaproveita
      `cores.ludica` + os pares `*Claro` de `engine/theme/tokens.js`: nenhuma
      cor nova para o tabuleiro.
- [x] **10 fichas + 2 células vazias.** Clicar e arrastar (evento `'arrastar'`
      do motor) — não toque-toque.
- [x] Regra de movimento (15-puzzle clássico): uma ficha só se move para uma
      célula **vizinha** (lado, cima ou baixo — nunca diagonal) que esteja
      **vazia**. Soltar num lugar inválido (ocupado, não vizinho, ou a mesma
      célula de origem) devolve a ficha ao lugar, sem pontuar nada.
- [x] Embaralhamento **sempre solucionável**: parte do resolvido e "anda pra
      trás" com movimentos legais (`GameScene._embaralharNivel`) — nunca um
      sorteio livre, que poderia gerar um arranjo impossível sob essa regra.
- [x] `GridBoard` do motor reaproveitado para a grade (linhas/colunas,
      `trocar`, `obter`, `dentro`) — não reinventado.

## 4. Feedback e comemoração

- [x] **Sem indicador visual por ficha** durante a partida (nem cor, nem
      selo) — decisão final, por pedido: já testamos anel colorido (dourado,
      magenta, ciano — todos "brigavam" com alguma das 12 cores fixas das
      células) e depois um selo acromático, mas o ambiente final é mais
      enxuto: nenhum efeito por peça, só o resultado.
- [x] **Comemoração única, quando o tabuleiro inteiro fecha**: moldura
      dourada estável no cartão (não pisca) + uma onda leve e sequencial nas
      10 fichas, uma vez só (`GameScene._celebrarCompleto`). Sem confete, sem
      raios de luz — pensado pro público neurodivergente da coleção: poucos
      efeitos, cada um só uma vez, nunca mais de um ao mesmo tempo.
- [x] Placar sem risco de "vencer" cedo demais por oscilação: uma ficha pode
      ficar certa, sair do lugar e voltar a ficar certa várias vezes na mesma
      partida, mas `ScoreSystem.acertar()` só é chamado **uma vez**, quando as
      10 caem certas ao mesmo tempo — nunca por ficha. Ver o comentário em
      `GameScene._tentarMover`.

## 5. Som

- [x] `acertoSOS` — fim de partida (sempre vitória). Canal `sfx`, via
      `config.audio.vitoria`, disparado pela `ResultScreen` do motor.
- [x] `config.audio.clique: null` — SEM som de clique. Botões de HUD (pausa,
      ajuda, som) e as telas de apoio (menu, níveis, tutorial, resultado)
      ficam silenciosos ao tocar. Decisão de projeto: som só onde é gesto de
      jogo de verdade. O `cliqueFicha` que existia aqui (reaproveitado do
      Bingo/Jogo da Velha) foi removido do jogo — nada mais referencia esse id.
- [x] `soltarPeca` — toca só quando um movimento de ficha é ACEITO (célula
      vizinha vazia). Não toca quando a ficha só volta pro lugar. Via
      `config.audio.soltar` — o único efeito de interação que sobra, porque é
      o gesto central do jogo, não um clique de botão.
- [x] `tutorialTela1/2/3` — narração dos 3 passos do tutorial (`config.tutorial[n].fala`),
      tocada pela `TutorialScreen` do motor tanto no "COMO JOGAR" do menu
      quanto na AJUDA dentro da partida (regra RE-05).
- [ ] **Origem/licença pendente**: `soltarPeca` (`soltar_peca.mp3`) e
      `tutorialTela1/2/3` (`tela1/2/3.wav`) — arquivos próprios deste jogo,
      origem a confirmar.
- [ ] **Transcrição da narração do tutorial ainda não foi OUVIDA** — as 3
      fichas em `assets/audio-transcricao/tutorialTelaN/` estão como INFERIDA
      (ver cada uma para o raciocínio). Confirmar ouvindo antes de publicar.
- [ ] Sem música de fundo — nenhuma gravação própria ainda produzida para
      este jogo.

## 6. Contrato do AVA

| Campo | Significado | Observação |
|---|---|---|
| `acertos` | Sempre 10 (as 10 fichas) | Sem desconto — ver seção 1/RE-02: jogada legal nunca é penalizada |
| `erros` | Sempre 0 | Este jogo nunca conta erro — trocas inválidas também não contam nada (ver seção 3) |
| `totalPerguntas` | Sempre 10 (as fichas 0 a 9) | — |
| `nivel` | Nível escolhido | `1`, `2` ou `3` |
| `jogo` | Slug estável | `jogo-da-ordenacao` |
| `vitoria` | Sempre `true` | Quebra-cabeça solo, sem derrota |
| `tempoSegundos` | Tempo jogando, medido pelo motor | Também aparece na `ResultScreen` (`config.mostrarTempo`) |
| `extras.direcao` | `"crescente"` ou `"decrescente"` | Direção do nível jogado |

## Melhorias identificadas, ainda não feitas

1. Origem/licença e transcrição ouvida do `soltarPeca` e do `tutorialTela1/2/3`
   (seção 5) — arquivos novos deste jogo.
2. Narração do tutorial e música — nenhuma gravação própria ainda.
3. Numeração do nível (`LevelSelectScreen`, motor compartilhado) visivelmente
   fora do centro do emblema — identificado antes em outros jogos, não
   corrigido (afeta todos os jogos que usam a tela padrão).
