# fontes/ — arte original em alta resolução

**Esta pasta NÃO é publicada.** Ela guarda os arquivos-fonte, em resolução alta, dos quais as
versões usadas nos jogos foram derivadas.

Por que separar: cada pasta em `Games/` é enviada **inteira** para o AVA. Um PNG de 936 KB
que ninguém carrega em tempo de execução seria peso morto no pacote — mas jogar a fonte fora
também é errado, porque sem ela não se pode regerar a arte em outro tamanho ou formato.

## Conteúdo

| Fonte | Derivado em | Usado por |
|---|---|---|
| `mascote/worker.png` — 868×1400, RGBA, 936 KB | `Games/jogo-dos-blocos/assets/img/worker.webp` — 408×700, 46 KB | Mascote do Jogo dos Blocos (menu, tutorial, resultado) |

## Como a conversão foi feita

Não há `ffmpeg` nem ImageMagick neste ambiente. O **Chrome headless** foi usado como
codificador — ele suporta WebP nativamente via `canvas.toDataURL('image/webp', qualidade)`.
O processo:

1. carrega o PNG num `<canvas>` na mesma origem (senão o canvas fica "sujo" e não exporta);
2. mede o canal alfa e recorta a caixa útil, descartando a moldura transparente;
3. redimensiona para a altura alvo com `imageSmoothingQuality: 'high'`;
4. exporta em WebP com qualidade 0.9.

**Altura alvo de 700 px, e não a original:** o mascote é desenhado com no máximo ~320 px
lógicos de altura; com `devicePixelRatio` 2, isso dá ~640 px reais. Guardar 1400 px seria
carregar o dobro do necessário para nenhum ganho visível.

## Ao substituir uma arte

1. Ponha a fonte em alta aqui, numa subpasta com o nome do uso.
2. Gere a versão do jogo (WebP para figura ilustrada; SVG quando a arte for vetorial de
   verdade — nesse caso não há conversão, o SVG vai direto).
3. Atualize a tabela acima e a tabela de assets do `README.md` do jogo.
4. Rode `node tools/verificar-independencia.mjs <slug>` e
   `node tools/teste-entrega-avulsa.mjs <slug>`: o segundo acusa arquivo que ficou sem uso ou
   referência quebrada.
