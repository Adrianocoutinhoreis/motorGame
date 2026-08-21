var canvas, stage, raiz;

function init()
{
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	images = images || {};
	
	var manifest = [
		{src:"images/barraPontosExterna.png", id:"barraPontosExterna"},
		{src:"images/barraPontosInterna.png", id:"barraPontosInterna"},
		{src:"images/BG.jpg", id:"BG"},
		{src:"images/Landscapechamomile7.jpg", id:"Landscapechamomile7"},
		{src:"images/relogio.png", id:"relogio"},
		{src:"images/troncoArea.png", id:"troncoArea"},
		{src:"images/Bitmap32.png", id:"Bitmap32"},
		{src:"images/Bitmap34.png", id:"Bitmap34"},
		{src:"images/Bitmap35.png", id:"Bitmap35"},
		{src:"images/BlocoCirculo.png", id:"BlocoCirculo"},
		{src:"images/blocoQuadrado.png", id:"blocoQuadrado"},
		{src:"images/Blocolosango.png", id:"Blocolosango"},
		{src:"images/BlocoRetangulo.png", id:"BlocoRetangulo"},
		{src:"images/blocoTriangulo.png", id:"blocoTriangulo"},
		{src:"images/brilho1.png", id:"brilho1"},
		{src:"images/brilho2.png", id:"brilho2"},
		{src:"images/brilho3.png", id:"brilho3"},
		{src:"images/coruja1.png", id:"coruja1"},
		{src:"images/coruja2.png", id:"coruja2"},
		{src:"images/coruja3.png", id:"coruja3"},
		{src:"images/estrela1.png", id:"estrela1"},
		{src:"images/estrela2.png", id:"estrela2"},
		{src:"images/estrela3.png", id:"estrela3"},
		{src:"images/logo.png", id:"logo"},
		{src:"images/relogioCapa.png", id:"relogioCapa"},
		{src:"images/relogioFundo.png", id:"relogioFundo"},
		{src:"images/seta1.png", id:"seta1"},
		{src:"images/seta2.png", id:"seta2"},
		{src:"images/seta3.png", id:"seta3"},
		{src:"images/tronco.png", id:"tronco"},
		{src:"images/tutobrilho1.png", id:"tutobrilho1"},
		{src:"images/tutobrilho2.png", id:"tutobrilho2"},
		{src:"images/tutobrilho3.png", id:"tutobrilho3"},
		{src:"images/tutorial1.jpg", id:"tutorial1"}

	];
	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", imagensCarregadas);
	loader.addEventListener("fileload", carregandoImagens);
	loader.loadManifest(manifest);

	function imagensCarregadas(event)
	{
		raiz = new lib.JogoFormas();
		
		stage.addChild(raiz);
		createjs.Ticker.setFPS(12);
		createjs.Ticker.addEventListener("tick", stage);

		var manifest = [
			{src:"sons/sim.wav", id:"sim"},
			{src:"sons/nao.wav", id:"nao"},
			{src:"sons/acertoSOS.wav", id:"acertoSOS"},
			{src:"sons/erroSOS.wav", id:"erroSOS"},
			{src:"sons/somFundo.mp3", id:"somFundo"},
			{src:"sons/quadrado.mp3", id:"quadrado"},
			{src:"sons/retangulo.mp3", id:"retangulo"},
			{src:"sons/triangulo.mp3", id:"triangulo"},
			{src:"sons/circulo.mp3", id:"circulo"},
			{src:"sons/instrucao1.mp3", id:"instrucao1"},
			{src:"sons/instrucao2.mp3", id:"instrucao2"}
		];
		var loader = new createjs.LoadQueue(false);
		loader.installPlugin(createjs.Sound);
		loader.addEventListener("complete", somCarregado);
		loader.loadManifest(manifest);
	}

	function carregandoImagens(evt)
	{
		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
	}

	function somCarregado()
	{
		stage.enableMouseOver();
		SomFundo(raiz.somFundo_mc);

		jogo = raiz.jogo_mc;
		
		jogo.visible = false;

		raiz.abertura_mc.gotoAndStop(0);
		raiz.abertura_mc.voltar_btn.addEventListener('click', function(){window.close();});
		raiz.abertura_mc.tutorial_mc.gotoAndPlay(0);
		raiz.abertura_mc.proximo_btn.addEventListener('click', toggleAbertura);
		raiz.abertura_mc.som = createjs.Sound.play('instrucao1');

		raiz.carregar_mc.visible = false;
	}

	function toggleAbertura(event)
	{
		if (raiz.abertura_mc.som.playState != 'playFinished')
		{
			raiz.abertura_mc.som.stop();
		}
		if (raiz.abertura_mc.currentFrame == 0)
		{
			raiz.abertura_mc.gotoAndStop(1);
			raiz.abertura_mc.anterior_btn.addEventListener('click', toggleAbertura);
			raiz.abertura_mc.jogar_btn.addEventListener('click', novoJogo);
			raiz.abertura_mc.som = createjs.Sound.play('instrucao2');
		}
		else
		{
			raiz.abertura_mc.gotoAndStop(0);
			raiz.abertura_mc.tutorial_mc.gotoAndPlay(0);
			raiz.abertura_mc.proximo_btn.addEventListener('click', toggleAbertura);
			raiz.abertura_mc.som = createjs.Sound.play('instrucao1');
		}
	}

	function resetaJogo(event)
	{
		for (var lin = 0; lin < arrayBlocos.length; lin++)
		{
			for (var col = 0; col < arrayBlocos[lin].length; col++)
			{
				if (arrayBlocos[lin][col])
				{
					jogo.removeChild(arrayBlocos[lin][col]);
					arrayBlocos[lin][col] = null;
				}
			}
		}
		jogo.visible = false;

		raiz.abertura_mc.visible = true;
		raiz.abertura_mc.gotoAndStop(0);
		raiz.abertura_mc.tutorial_mc.gotoAndPlay(0);
		raiz.abertura_mc.proximo_btn.addEventListener('click', toggleAbertura);

		novoJogo();
	}

	function novoJogo()
	{
		if (raiz.abertura_mc.som.playState != 'playFinished')
		{
			raiz.abertura_mc.som.stop();
		}
		maxLinhas = 7;
		maxColunas = 6;
		arrayBlocos = [];
		blocoAtual = [];
		arrayDestaque = [];
		arraySoltos = [];
		arrayFormas = ['quadrado', 'retangulo', 'circulo', 'triangulo'];
		coluna = -1;
		acao = 'sobe';
		maxPontos = 20;
		scoreRatio = jogo.pontos_mc.timeline.duration/maxPontos;
		jogo.pontos_mc.gotoAndStop(0);
		pontos = 0;

		CONTROLE = [];

		for (var lin = 0; lin < maxLinhas; lin++)
		{
			var arrayLinha = [];
			for (var col = 0; col < maxColunas; col++)
			{
				if (lin < 3)
				{
					var bloco = new lib.Bloco();
					bloco = setBloco(bloco);

					bloco.x = (bloco.nominalBounds.width)*col;
					bloco.y = -(bloco.nominalBounds.height)*(lin+1);
					bloco.lin = lin;
					bloco.col = col;
					jogo.addChild(bloco);
					
					arrayLinha.push(bloco);
					CONTROLE.push(bloco);
				}
				else
				{
					arrayLinha.push(null);
				}
			}
			arrayBlocos.push(arrayLinha);
		}

		for (var lin = 0; lin < arrayBlocos.length; lin++)
		{
			validaLinha(arrayBlocos[lin]);
		}

		jogo.corrente_mc.gotoAndStop(0);
		jogo.addEventListener('mouseover', liberaCorrente);
		jogo.addEventListener('mouseout', travaCorrente);
		jogo.addEventListener('click', sobeBloco);

		raiz.abertura_mc.visible = false;
		jogo.visible = true;
		liberaTempo();
	}

	// [sobeBloco]
	// Sobe os blocos em destaque na coluna até o gancho.
	function sobeBloco(event)
	{
		if (acao = 'sobe')
		{
			stage.enableMouseOver(false);
			acao = 'movendo';
			if ((arrayDestaque.length > 0) && (arrayDestaque[0].forma))
			{
				blocoAtual = arrayDestaque.slice();
				arrayDestaque = [];

				travaCorrente();

				for (var i = 0; i < blocoAtual.length; i++)
				{
					var alvoY = jogo.corrente_mc.y + 50*i;
					blocoAtual[i].destaque.visible = false;;
					blocoAtual[i].tween = createjs.Tween.get(blocoAtual[i]).to({y:alvoY}, 500);
				}
				blocoAtual[0].tween.call(fimSobe);
			}
		}
	}

	// [fimSobe]
	// Chamada ao fim da subida dos blocos, libera o gancho pra soltar os blocos.
	function fimSobe(event)
	{
		stage.enableMouseOver();
		jogo.corrente_mc.gotoAndStop(1);

		for (var i = 0; i < blocoAtual.length; i++)
		{
			bloco = blocoAtual[i];
			arrayBlocos[bloco.lin][bloco.col] = null;
		}
		acao = 'solta';
		liberaCorrente();
		jogo.addEventListener('click', soltaBloco);
	}

	// [soltaBloco]
	// Função que solta os blocos do gancho até os blocos abaixo.
	function soltaBloco(event)
	{
		if (acao == 'solta')
		{
			stage.enableMouseOver(false);
			acao = 'movendo';

			travaCorrente();
			
			n = blocoAtual.length;
			for (var i = 0; i < blocoAtual.length; i++)
			{
				var alvoY = arrayDestaque[0].y - 50*n;
				n--;
				blocoAtual[i].destaque.visible = false;
				blocoAtual[i].tween = createjs.Tween.get(blocoAtual[i]).to({y:alvoY}, 500);
			}
			blocoAtual[0].tween.call(fimSolta);
		}
	}


	function fimSolta(event)
	{
		var lin = arrayDestaque[0].lin+blocoAtual.length;
		var col = arrayDestaque[0].col;
		var bloco = blocoAtual[0];
		for (var i = 0; i < blocoAtual.length; i++)
		{
			if (!arrayBlocos[lin])
			{
				arrayBlocos[lin] = [null, null, null, null];
			}
			arrayBlocos[lin][col] = blocoAtual[i];
			blocoAtual[i].lin = lin;
			blocoAtual[i].col = col;
			lin--;
			if (blocoAtual[i].star)
			{
				bloco = blocoAtual[i];
			}
		}
		comboAtual = sequencia(bloco);
		
		if (comboAtual.length > 2)
		{			
			eliminaCombo();
		}
		else
		{
			fimRodada();
		}
	}

	// [eliminaCombo]
	// Elimina os blocos da sequência
	function eliminaCombo()
	{
		travaCorrente();
		console.log('Combo', comboAtual.length);
		if (comboAtual.length > 3)
		{
			var index = Math.floor(Math.random()*comboAtual.length);
			comboAtual.star = [comboAtual[index]];
		}

		for (var i = 0; i < comboAtual.length; i++)
		{
			comboAtual[i].tween = createjs.Tween.get(comboAtual[i]).to({alpha:0},500);
		}
		comboAtual[0].tween.call(pontuacao);
		createjs.Sound.play(comboAtual[0].forma);
	}

	// [pontuacao]
	// Atribui a pontuação da rodada, e pede pra verificar se existem blocos soltos("flutuando").
	// Se não, encerra a rodada.
	function pontuacao(event)
	{
		while (comboAtual.length > 0)
		{
			pontos += comboAtual[0].score;
			var lin = comboAtual[0].lin;
			var col = comboAtual[0].col;

			if ((comboAtual.star) && (comboAtual.star[0] == comboAtual[0]))
			{
				comboAtual[0].getChildAt(0).gotoAndStop(1);
				comboAtual[0].score = 2;
				comboAtual[0].alpha = 1;
				console.log(comboAtual[0].lin, comboAtual[0].col)
				comboAtual.star.splice(0,1);
			}
			else
			{
				CONTROLE.slice(CONTROLE.indexOf(comboAtual[0]), 1);
				jogo.removeChild(comboAtual[0]);
				arrayBlocos[lin][col] = null;
				comboAtual[0] = null;
			}
			comboAtual.splice(0,1);
		}
		console.log('Pontos', pontos);
		
		VALIDA();

		if (!verificaSoltos())
		{
			fimRodada();
		}
	}

	function VALIDA()
	{
		for (var lin = 0; lin < arrayBlocos.length; lin++)
		{
			for (var col = 0; col < arrayBlocos[lin].length; col++)
			{
				if ((arrayBlocos[lin][col]) && (CONTROLE.indexOf(arrayBlocos[lin][col]) == -1))
				{
					console.log('ERRO');
				}
			}
		}
	}

	// [verificaSoltos]
	// Verifica se existem blocos soltos("flutuando")
	// Se existir, faz os blocos caírem, e chama fimSoltos()
	// Senão, encerra a rodada.
	function verificaSoltos()
	{
		for (var lin = 1; lin < arrayBlocos.length; lin++)
		{
			for (var col = 0; col < arrayBlocos[lin].length; col++)
			{
				var bloco = arrayBlocos[lin][col];;
				if ((bloco) && (!arrayBlocos[lin-1][col]))
				{
					for (var l = lin-1; l >= 0; l--)
					{
						if (arrayBlocos[l][col])
						{
							console.log('Tem Bloco!', l, col);
							break;
						}
					}
					if (bloco.score == 2)
					{
						console.log('Bloco',bloco.lin, l);
					}
					bloco.lin = l+1;
					arrayBlocos[lin-1][col] = bloco;
					arrayBlocos[lin][col] = null;
					arraySoltos.push(bloco);
				}
			}
		}

		if (arraySoltos.length > 0)
		{
			for (var i = 0; i < arraySoltos.length; i++)
			{
				var bloco = arraySoltos[i];
				var alvoY = -(bloco.height)*(bloco.lin+1);
				bloco.tween = createjs.Tween.get(bloco).to({y:alvoY}, 500);
			}
			bloco.tween.call(fimSoltos);
			return true;
		}
		else
		{
			return false;
		}
	}

	// [fimSoltos]
	// Verifica se algum combo foi criado depois dos blocos caírem.
	// Se sim, elimina o combo.
	// Senão, acaba a rodada.
	function fimSoltos(event)
	{
		for (var i = 0; i < arraySoltos.length; i++)
		{
			var seq = sequencia(arraySoltos[i]);
			if (seq.length > 2)
			{
				if (comboAtual.indexOf(arraySoltos[i]) == -1)
				{
					comboAtual =  comboAtual.concat(seq);
				}
			}
		}

		if (comboAtual.length > 0)
		{
			eliminaCombo();
		}
		else
		{
			fimRodada();
		}
	}

	// [fimRodada]
	// Faz as verificações do final da rodada, encerrando o jogo caso necessário.
	function fimRodada()
	{
		stage.enableMouseOver();
		acao = 'sobe';

		if (arrayBlocos.length > maxLinhas)
		{
			for (var i = 0; i < arrayBlocos[maxLinhas].length; i++)
			{
				if (arrayBlocos[maxLinhas][i])
				{
					var fimJogo = 'erro';
					break;
				}
			}
		}

		jogo.pontos_mc.gotoAndStop(pontos*scoreRatio);

		if ((pontos >= maxPontos) && (!fimJogo))
		{
			jogo.pontos_mc.gotoAndStop(maxPontos*scoreRatio -1);
			var fimJogo = 'acerto';
		}

		if (fimJogo)
		{
			clearInterval(tempo);
			jogo.removeAllEventListeners();
			travaCorrente();
			raiz.addEventListener(FeedbackSOS.CLICOU_SIM, resetaJogo);
			if (fimJogo == 'acerto')
			{
				FeedbackSOS.Acerto();
			}
			else
			{
				FeedbackSOS.Erro();
			}
		}
		else
		{
			jogo.corrente_mc.gotoAndStop(0);
			jogo.addEventListener('click', sobeBloco);
			for (var i = 0; i < arrayDestaque.length; i++)
			{
				if (arrayDestaque[i].destaque)
				{
					arrayDestaque[i].destaque.visible = false;
				}
			}

			comboAtual = new Array();
			arrayDestaque = [];
			liberaCorrente();
		}

		blocoAtual = [];
	}

	// [destaque]
	// Destaca os objetos de uma coluna específica.
	function destaque(col)
	{
		if ((col != coluna) || (arrayDestaque.length == 0))
		{
			if ((coluna != -1) && (arrayDestaque.length > 0))
			{
				for (var i = 0; i < arrayDestaque.length; i++)
				{
					if (arrayDestaque[i].destaque)
					{
						arrayDestaque[i].destaque.visible = false;
					}
				}
			}

			var lin = arrayBlocos.length-1;
			while ((lin >= 0) && (arrayBlocos[lin][col] == null))
			{
				lin--;
			}
			if (lin != -1)
			{
				arrayDestaque = [arrayBlocos[lin][col]];
				arrayBlocos[lin][col].destaque.visible = true;
				var forma = arrayBlocos[lin][col].forma;
				lin--;
				while ((lin >= 0) && (arrayBlocos[lin][col]) && (arrayBlocos[lin][col].forma == forma))
				{
					arrayBlocos[lin][col].destaque.visible = true;
					arrayBlocos[lin][col].destaque.gotoAndPlay(0);
					arrayDestaque.push(arrayBlocos[lin][col]);
					lin--;
				}
			}
			else
			{
				arrayDestaque = [{x:(50*col), y:0, lin:-1, col:col}];
			}

			coluna = col;
		}
	}

	// [setBloco] (bloco:Bloco, star:Boolean);
	// Seta as características básicas de um bloco(frame, forma, etc). 
	// Retorna o bloco.
	function setBloco(bloco, star, forma)
	{
		var index = forma ? forma : Math.floor(Math.random()*bloco.timeline.duration);

		bloco.gotoAndStop(index);
		bloco.forma = arrayFormas[index];

		if (star)
		{
			bloco.getChildAt(0).gotoAndStop(1);
			bloco.score = 2;
		}
		else
		{
			bloco.gotoAndStop(index);
			bloco.forma = arrayFormas[index];
			bloco.getChildAt(0).gotoAndStop(0);
			bloco.score = 1;
		}

		bloco.destaque = bloco.getChildAt(0).destaque_mc;
		bloco.destaque.visible = false;
		bloco.width = bloco.nominalBounds.width*bloco.scaleX;
		bloco.height = bloco.nominalBounds.height*bloco.scaleY;
		bloco.mask = jogo.areaJogo_mc.getChildAt(0);

		return bloco;
	}

	// [sequencia] (bloco:Bloco, _seq:Array)
	// Verifica todos os blocos iguais sequenciais ao bloco dado.
	// Entra em recursividade adicionando os blocos sequenciais ao array.
	// Retorna o array de blocos iguais sequenciais, incluindo o bloco original.
	function sequencia(bloco, _seq)
	{
		var seq = _seq ? _seq : [];
		seq.push(bloco);

		var coord = [{'lin':bloco.lin-1, 'col':bloco.col}, {'lin':bloco.lin+1, 'col':bloco.col}, {'lin':bloco.lin, 'col':bloco.col-1}, {'lin':bloco.lin, 'col':bloco.col+1}];

		for (var i = 0; i < coord.length; i++)
		{
			if (validaPosicao(coord[i]))
			{
				var lin = coord[i].lin;
				var col = coord[i].col;

				if ((arrayBlocos[lin][col] != null) && (arrayBlocos[lin][col].forma == bloco.forma))
				{
					if (seq.indexOf(arrayBlocos[lin][col]) == -1)
					{
						seq = sequencia(arrayBlocos[lin][col], seq);
					}
				}
			}
		}
		return seq;
	}

	// [validaPosicao] (obj:Object)
	// Verifica se a posição dada está dentro dos limites 0-maxLinhas, 0-maxColunas do jogo.
	// Retorna true ou false;
	function validaPosicao(obj)
	{
		var valido = true;
		if ((obj.lin < 0) || (obj.col < 0) || (obj.lin == maxLinhas) || (obj.col == maxColunas))
		{
			valido = false;
		}
		return valido;
	}

	// [validaLinha] (linha:Array)
	// Verifica se uma nova linha criada conecta três ou mais formas iguais, e caso verdadeiro, altera as formas para evitar pontos instantâneos.
	function validaLinha(linha)
	{
		for (var i = 0; i < linha.length; i++)
		{
			if (linha[i] != null)
			{
				var seq = sequencia(linha[i]);
				//console.log('[validaLinha] Bloco', linha[i].lin, linha[i].col, '| seq.length', seq.length);
				while (seq.length > 2)
				{
					linha[i] = setBloco(linha[i]);
					//console.log('[validaLinha] Resorteando bloco...')
					seq = sequencia(linha[i]);
				}
			}
		}
	}

	//----------- CONTROLE DA CORRENTE -----------//

	function liberaCorrente(event)
	{
		jogo.mouseEnabled = true;

		$(document).mousemove(function(e) {
			moveCorrente(e.pageX, e.pageY);
		});

		destaque(coluna);

		if (acao == 'sobe')
		{
			jogo.addEventListener('click', sobeBloco);
		}
		else
		{
			jogo.addEventListener('click', soltaBloco);
		}
	}

	function travaCorrente(event)
	{
		$(document).off('mousemove');
		jogo.removeEventListener('click', sobeBloco);
		jogo.removeEventListener('click', soltaBloco);
	}

	function moveCorrente(_x, _y)
	{
		var pt = jogo.globalToLocal(_x, _y);
		if (pt.x < 60)
		{
			var n = 0;
		}
		else if (pt.x < 110)
		{
			var n = 1;
		}
		else if (pt.x < 160)
		{
			var n = 2;
		}
		else if (pt.x < 210)
		{
			var n = 3;
		}
		else if (pt.x < 260)
		{
			var n = 4;
		}
		else
		{
			var n = 5;
		}

		for (var i = 0; i < blocoAtual.length; i++)
		{
			blocoAtual[i].x = 50*n;
		}
		jogo.corrente_mc.x = 25 + 50*n;
		destaque(n);
	}
	//----------- CONTROLE DA CORRENTE -----------//

	//------------ CONTROLE DO TIMER ------------//
	function liberaTempo()
	{
		tempoAtual = 0;
		maxTempo = 120;
		jogo.tempo_mc.gotoAndStop(0);
		timeRatio = jogo.tempo_mc.timeline.duration/maxTempo;
		console.log(timeRatio);
		tempo = setInterval(novaLinha, 1000);
	}

	function novaLinha(event)
	{
		if (acao != 'movendo')
		{
			var a = acao;
			acao = 'tempo';
			var fimJogo = false;
			
			tempoAtual++;
			jogo.tempo_mc.gotoAndStop(tempoAtual*timeRatio);
			if (tempoAtual == maxTempo)
			{
				clearInterval(tempo);
				fimJogo = true;
			}
			else if (tempoAtual%15 == 0)
			{
				jogo.mouseEnabled = false;

				for (var i = 0; i < arrayBlocos[maxLinhas-1].length; i++)
				{
					if (arrayBlocos[maxLinhas-1][i])
					{
						fimJogo = true;
						break;
					}
				}

				// Sobe as linhas
				for (var lin = maxLinhas; lin > 0; lin--)
				{
					arrayBlocos[lin] = arrayBlocos[lin-1].slice();
					for (var col = 0; col < arrayBlocos[lin].length; col++)
					{
						if (arrayBlocos[lin][col])
						{
							arrayBlocos[lin][col].lin = lin;
						}
					}
				}

				// Gera a nova linha
				for (var i = 0; i < arrayBlocos[0].length; i++)
				{
					var bloco = new lib.Bloco();
					bloco = setBloco(bloco);
					bloco.x = 50*i;
					bloco.y = 0;
					bloco.lin = 0;
					bloco.col = i;
					jogo.addChild(bloco);
					arrayBlocos[0][i] = bloco;
					CONTROLE.push(bloco);
				}

				validaLinha(arrayBlocos[0]);

				// Sobe os blocos
				for (var lin = 0; lin < arrayBlocos.length; lin++)
				{
					for (var col = 0; col < arrayBlocos[lin].length; col++)
					{
						var bloco = arrayBlocos[lin][col];
						if (bloco)
						{
							bloco.tween = createjs.Tween.get(bloco).to({y:bloco.y-50}, 200);
						}
					}
				}

				jogo.mouseEnabled = true;
			}

			if (fimJogo)
			{
				clearInterval(tempo);
				jogo.removeAllEventListeners();
				travaCorrente();
				raiz.addEventListener(FeedbackSOS.CLICOU_SIM, resetaJogo);
				FeedbackSOS.Erro();
			}

			acao = a;
		}
	}
}