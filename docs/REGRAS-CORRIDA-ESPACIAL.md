 # REGRAS-CORRIDA-ESPACIAL.md — especificação da Corrida Espacial

Especificação pedagógica, mecânica e de contrato da **Corrida Espacial**, jogo da coleção
Numerandus. Descreve **o jogo que vai existir**; o brinquedo físico do vídeo é a referência,
e cada diferença em relação a ele está declarada na seção 2, com o motivo.

- Referência: `Videos_Numerandus\corrida_espacial\Vídeo de Educandus Tecnologia Educacional (1).mp4`
  (1min52, vertical, narrado — transcrição na seção 10)
- Slug: `corrida-espacial` · Pasta: `Games/numerandus/corrida-espacial/`
- Público: Educação Infantil / 1º ano (4 a 7 anos)
- Objetivo pedagógico: **avançar na reta numérica de 1 a 20** — contar de um em um a partir
  de uma casa, somar a partir de uma casa, e calcular a diferença entre dois dados.
- Status: **🚧 jogável, pendências declaradas** (14/10/2026) — implementado em
  `Games/numerandus/corrida-espacial/`; pendências no README do jogo (narração não gravada,
  sem teste com criança nem em tablet). Decisões do humano: adversário CPU com corrida de
  verdade, pista horizontal, mover contando ou arrastando + PRONTO. Layout e regras
  conferidos antes num protótipo jogável (artifact "Protótipo Corrida Espacial").

---

## 1. O jogo em uma frase

Dois foguetes, cada um numa pista de 1 a 20. A criança **rola o dado, leva o próprio foguete
até a casa certa** — contando casa a casa ou pulando direto — e confirma. O foguete do
computador faz o mesmo, contando em voz alta. Ganha quem passar primeiro pela chegada.

**O que a criança faz é a conta, não a sorte.** No brinquedo o dado decide tudo e a criança só
desloca a peça. Aqui o dado continua decidindo *quanto* andar, mas *onde parar* é a criança
quem descobre, e é isso que o jogo confere.

---

## 2. O que muda em relação ao brinquedo do vídeo

| O que muda | Por quê |
|---|---|
| **Pista horizontal**, da esquerda para a direita, terminando num planeta | No brinquedo as pistas são verticais. Em 1280×720, vinte casas na vertical dão cerca de 30 px cada — números ilegíveis e arrasto impreciso aos 4 anos. Na horizontal são cerca de 52 px, e a pista vira a **reta numérica** do 1º ano |
| O adversário é o **computador** | O vídeo mostra dois "coleguinhas". Dois alunos num aparelho tornam o registro no AVA ambíguo (de quem é a nota?) |
| A criança **confirma** a jogada (botão PRONTO) | No brinquedo ninguém confere se a peça parou na casa certa. A confirmação é o momento em que o jogo avalia |
| Os três jeitos de brincar viram **os três níveis** | O narrador apresenta exatamente três modos, em ordem crescente de dificuldade (1 dado → soma de 2 dados → diferença de 2 dados) |
| A janelinha do foguete **sempre mostra o número** da casa | No brinquedo é um furo que deixa ver a casa por baixo. Aqui é o mesmo efeito, desenhado — e o número é o feedback imediato a cada casa avançada |

**Mantido do brinquedo:** pistas de 1 a 20, foguetes saindo de fora da pista (antes da casa 1),
cores azul (criança) e laranja (adversário), chegada quadriculada, e **não é preciso cair
exatamente no 20** — "tirou 9 e já ultrapassou" vence.

---

## 3. A pista e os foguetes

- **Duas pistas paralelas**, azul em cima (criança) e laranja embaixo (computador), casas 1 a 20.
- **Largada:** a casa 0, fora da pista, à esquerda. **Chegada:** faixa quadriculada depois da
  casa 20, com o planeta de destino. Qualquer andança que passe de 20 termina na chegada.
- **Foguete:** é o **alvo de toque** — as casas não são (com ~52 px ficariam abaixo dos 64 px
  mínimos de `METODO-JOGOS-NUMERANDUS.md` §3.C). O foguete tem pelo menos 90×64 px.
- **Janelinha:** mostra o número da casa em que o foguete está agora, inclusive durante o
  movimento. Na largada, mostra vazio.

**Medidas (1280 × 720)**, as do protótipo, em constantes no topo de
`src/scenes/GameScene.js`: casa 52 × 88 px, 40 px entre as pistas, pista azul em y 190,
largada de 110 px, faixa quadriculada de 28 px, painel de baixo a partir de y 508 (vez,
dados e os botões ROLAR / PRONTO de 160 × 136). Um plano visual separado não foi escrito:
o protótipo cumpriu esse papel.

---

## 4. A jogada

### 4.1 O turno da criança

1. **DADO** — botão grande. Os dados rolam (animação curta, sem flash) e param mostrando a face.
   O resultado aparece também como algarismo ao lado de cada dado.
2. **Mover** — o foguete azul ganha um brilho estável de "sua vez". Dois gestos, os dois
   válidos, e podem ser misturados na mesma jogada:
   - **Contar:** cada toque no foguete avança **uma casa**, e a voz diz quantas já andou
     ("um", "dois", "três"…). É o "vem contando 1, 2, 3, 4, 5, 6" do vídeo.
   - **Pular:** arrastar o foguete e soltar numa casa; ele encaixa na casa mais próxima. É o
     "se souber somar, já pula de 2 mais 6 pra 8".
   - Arrastar para trás é permitido: dá para corrigir antes de confirmar. Nunca volta antes da
     casa onde a jogada começou.
3. **PRONTO** — confirma. O jogo compara a casa onde o foguete está com a casa certa.

### 4.2 Certo e errado

- **Certo:** o foguete dá um pequeno impulso, a casa é narrada ("oito!"), e o turno passa.
- **Errado:** o foguete volta suavemente para a casa onde a jogada começou, "TENTE DE NOVO",
  e **conta um erro**. Os dados continuam na tela — a criança tenta de novo a mesma jogada.
- **Ajuda progressiva** (mesma ideia da dica do Material Dourado): no **segundo erro** da mesma
  jogada, o jogo mostra o caminho — as casas acendem uma a uma, contadas em voz alta, até a
  certa. A criança ainda precisa levar o foguete e confirmar. **Nenhuma jogada trava.**
- **Andança zero** (só no Difícil): a jogada certa é tocar PRONTO sem mexer o foguete. É o
  "3 menos 3, zero, não sai do lugar" do vídeo.

### 4.3 O turno do computador

O foguete laranja rola os próprios dados (honestos, sem ajuste) e anda **casa a casa, contando
em voz alta**, num ritmo que a criança consegue acompanhar. O computador não erra: ele é o
modelo de contagem, não um adversário que compete em cálculo. A disputa é de sorte; a nota é de
cálculo (seção 6).

### 4.4 Ordem e fim

- A criança sempre começa.
- A partida termina quando um foguete chega. Se for o azul, é vitória; se for o laranja, derrota.

---

## 5. Os três níveis

| Nível | Dados | Andança | Média por jogada | Jogadas até 20 (média) |
|---|---|---|---|---|
| **1 — Fácil** | 1 dado | o valor do dado: 1 a 6 | 3,5 | ~6 |
| **2 — Médio** | 2 dados | a **soma**: 2 a 12 | 7 | ~3 |
| **3 — Difícil** | 2 dados | a **diferença**, maior menos menor: 0 a 5 | 1,94 | ~10 |

No Difícil, a andança 0 sai em 1 a cada 6 jogadas (6 dos 36 resultados), o que garante que a
criança encontre o caso do zero em quase toda partida.

---

## 6. Pontuação, erros e o contrato com o AVA

- **Progresso:** a casa alcançada pelo foguete azul (0 a 20). `meta: 20`. Durante a partida, a
  **própria pista é a barra de progresso** — não há barra separada.
- **Erro:** cada PRONTO numa casa errada.
- **Vitória:** pontuação = 20 − erros (RE-02), mínimo 0. **Derrota:** pontuação = casa
  alcançada, sem desconto (RE-02).
- **Tela final:** "N CASAS" (RE-03) — `unidadePlacar: { singular: 'casa', plural: 'casas' }`.
  Estrelas derivadas pela própria tela (RE-04).
- **AVA:** `acertos` = pontuação, `erros` = erros, `totalPerguntas` = 20. Extras:
  `modo`, `casaAlcancada`, `casaComputador`, `jogadas`, `certasDePrimeira`,
  `jogadasComAjuda`, `venceuCorrida`.
- **Como o placar soma:** cada jogada certa chama `placar.acertar(casas avançadas)`; ao
  chegar a 20, o próprio `ScoreSystem` dispara a vitória. A derrota é o foguete laranja
  chegar — a cena encerra com `paraAva(false)`, e a pontuação é a casa alcançada.

Conferido em navegador (14/10/2026): vitória com 1 erro → `acertos: 19`, "19 CASAS",
4 estrelas; derrota com o azul na casa 11 → "11 CASAS", 2 estrelas; duas partidas
seguidas → exatamente duas mensagens.

---

## 7. Áudio

| Som | `id` | Uso | Existe? |
|---|---|---|---|
| Narração do tutorial (4 telas) | `tutorialTela1`–`4` | `fala` de cada passo | **Não** — gravar |
| Números "um" a "vinte" | `numero1`–`numero20` | a contagem casa a casa (criança e computador) **e** o nome da casa de chegada — uma gravação serve às duas | **Não** — gravar |
| "mais", "menos" | `mais`, `menos` | leitura dos dados no Médio e no Difícil | **Não** — gravar |
| Frases curtas | `tenteDeNovo`, `zeroFicaNoLugar`, `passouFicaNoLugar`, `chegou`, `chegouLaranja`, `suaVez`, `vezDoComputador` | retorno da jogada e troca de vez | **Não** — gravar |
| Jogada certa, erro, pouso do laranja, vitória | `somProgresso`, `somErro`, `pouso`, `acertoSOS` | efeitos | **Sim** — reaproveitados da coleção |
| Dado rolando | — | — | Não existe; o dado roda em silêncio |

Até as gravações chegarem, o jogo funciona mudo nesses pontos — nenhuma mecânica depende de
ouvir.

---

## 8. O que o motor já tem, e o que falta

| Peça | Situação |
|---|---|
| Menu, níveis, tutorial, ajuda (RE-05), pausa, resultado, `ScoreSystem`, `AvaBridge` | Pronto — vem do template |
| Tema visual `'espaco'` | **Feito** — `engine/ui/Background.js` (céu de noite, estrelas paradas e determinísticas que continuam pelas barras do letterbox, três planetas com opacidade 0,10–0,14), e registrado como tema de interior em `MenuScreen` (placa limpa), `ResultScreen` e `TutorialScreen` |
| Dado | **Feito na cena** (`src/desenho.js`) — vira componente do motor só se um segundo jogo precisar |
| Pista, foguete, turno do computador | **Feito** — `src/scenes/GameScene.js`; regras puras em `src/regras.js` |

---

## 9. Decisões em aberto

- **Médio é curto:** ~3 jogadas por corrida, e quem começa tem vantagem. Medir jogando; se
  pesar, considerar alternar quem começa entre partidas ou uma pista mais longa no Médio.
- **"18 CASAS" numa vitória com 2 erros** pode soar estranho para quem acabou de ver o foguete
  na casa 20. É a RE-02 aplicada; conferir com um aluno de verdade antes de mudar.
- **Voz:** gravar a contagem com a mesma voz dos outros jogos da coleção?

---

## 10. Transcrição da narração do vídeo

Transcrição automática (Whisper `small`, pt), revisada só na grafia:

> Estamos aqui agora com a corrida espacial, onde a criança tem 3 formas diferentes de brincar.
> O primeiro com apenas um dado: tirou 2, veio aqui, avança 2. Agora tirou 3, o outro
> coleguinha veio, avançou 3. […] tirou 6. Se ele souber somar, ele já pula de 2 mais 6 pra 8.
> Se ele não souber, ele vem contando 1, 2, 3, 4, 5, 6, parou no 8 do mesmo jeito. […] E assim
> eles vão jogando até chegar aqui em cima pra ver quem seria o vencedor.
>
> A outra forma de jogar seria com 2 dados, eu vou trabalhar a adição: já veio para o 10; esse
> aqui jogou 3, veio para o 3. Agora foi o outro novamente, 8, já veio para o 18, já está bem
> pertinho de ganhar. Esse aqui tirou 7: 3 com 7, 10. E o outro, quando jogou, tirou 9 e já
> ultrapassou.
>
> A última forma de brincar seria com a subtração: joguei […], 0, não vou sair do lugar.
> Tirei 6 e 4: 6 menos 4, 2, avança aqui para o 2. E assim ele vai brincando até avançar e
> chegar também no seu destino. […] 3 menos 3, 0. E aqui 6 menos 4, 2: 1, 2. Assim vai
> avançando até chegar no final.
