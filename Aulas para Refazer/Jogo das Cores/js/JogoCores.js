var canvas, stage, raiz, images;

function init()
{
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	images = images || {};
	
	var manifest = [
		{src:"images/barraPontosExterna.png", id:"barraPontosExterna"},
		{src:"images/barraPontosInterna.png", id:"barraPontosInterna"},
		{src:"images/fundo.jpg", id:"fundo"}
	];
	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", imagensCarregadas);
	loader.addEventListener("fileload", carregandoImagens);
	loader.loadManifest(manifest);

	function carregandoImagens(evt)
	{
		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
	}

	function imagensCarregadas(event)
	{
		raiz = new lib.JogoCores();
	
		stage.addChild(raiz);
		createjs.Ticker.setFPS(12);
		createjs.Ticker.addEventListener("tick", stage);


		var manifest = [
			{src:"sons/verde.mp3", id:"verde"},
			{src:"sons/amarelo.mp3", id:"amarelo"},
			{src:"sons/azul.mp3", id:"azul"},
			{src:"sons/vermelho.mp3", id:"vermelho"},
			{src:"sons/rosa.mp3", id:"rosa"},
			{src:"sons/marrom.mp3", id:"marrom"},
			{src:"sons/roxo.mp3", id:"roxo"},
			{src:"sons/laranja.mp3", id:"laranja"},
			{src:"sons/somFundo.mp3", id:"somFundo"},
			{src:"sons/sim.wav", id:"sim"},
			{src:"sons/nao.wav", id:"nao"},
			{src:"sons/acertoSOS.wav", id:"acertoSOS"},
			{src:"sons/erroSOS.wav", id:"erroSOS"},
			{src:"sons/facil.mp3", id:"facil"},
			{src:"sons/dificil.mp3", id:"dificil"},
			{src:"sons/instrucao.mp3", id:"instrucao"}
		];
		var loader = new createjs.LoadQueue(false);
		loader.installPlugin(createjs.Sound);
		loader.addEventListener("complete", somCarregado);
		loader.loadManifest(manifest);
	}

	function somCarregado()
	{
		stage.enableMouseOver();
		SomFundo(raiz.somFundo_mc);

		arrayCores = [['verde', 'amarelo', 'azul', 'vermelho'], ['rosa', 'marrom', 'roxo', 'laranja']]

		raiz.pontos_mc.gotoAndStop(0);
		raiz.tempo_mc.gotoAndStop(0);

		mostraInstrucao();
		
		raiz.carregar_mc.visible = false;
	}

	function mostraInstrucao()
	{
		raiz.instrucao_mc.visible = true;
		raiz.instrucao_mc.voltar_btn.addEventListener('click', function(){window.close();});
		raiz.instrucao_mc.som = createjs.Sound.play('instrucao');
		raiz.instrucao_mc.tutorial_mc.gotoAndPlay(0);

		raiz.instrucao_mc.facil_btn.addEventListener('mouseover', function(){ som = createjs.Sound.play('facil')});
		raiz.instrucao_mc.facil_btn.addEventListener('click', selecionaNivel);
		raiz.instrucao_mc.dificil_btn.addEventListener('mouseover', function(){ som = createjs.Sound.play('dificil')});
		raiz.instrucao_mc.dificil_btn.addEventListener('click', selecionaNivel);
	}

	function selecionaNivel(event)
	{
		if (event.target == raiz.instrucao_mc.facil_btn)
		{
			nivel = 0;
		}
		else
		{
			nivel = 1;
		}
		if (raiz.instrucao_mc.som.playState != 'playFinished')
		{
			raiz.instrucao_mc.som.stop();
		}
		raiz.instrucao_mc.visible = false;
		preparaJogo();
	}

	function preparaJogo()
	{
		arrayBlocos = [];
		maxPontos = 15+15*(nivel+1);
		scoreRatio = raiz.pontos_mc.timeline.duration/maxPontos;
		raiz.pontos_mc.gotoAndStop(0);

		raiz.jogo_mc._mask = raiz.jogo_mc.getChildAt(1);
		for (var lin = 0; lin < 5; lin++)
		{
			var arrayLinha = [];
			for (var col = 0; col < 7; col++)
			{
				if (((lin == 0) || (lin == 4)) && ((col == 0) || (col == 6)))
				{
					arrayLinha.push(null);
				}
				else
				{
					var bloco = new lib.Bloco();
					bloco.gotoAndStop(nivel);
					var frame = Math.floor(Math.random()*bloco.getChildAt(0).timeline.duration);
					bloco.getChildAt(0).gotoAndStop(frame);
					bloco.cor = arrayCores[nivel][frame];
					bloco.destaque_mc.visible = false;
					bloco.lin = lin;
					bloco.col = col;
					raiz.jogo_mc.addChild(bloco);
					bloco.x = 5 + (col*65);
					bloco.y = 5 + (lin*65);
					arrayLinha.push(bloco);
				}
			}
			arrayBlocos.push(arrayLinha);
		}

		comboAtual = [];
		pontos = 0;

		liberaTempo();

		raiz.jogo_mc.addEventListener('mousedown', comecaCombo);
	}
	
	function comecaCombo(event)
	{
		raiz.jogo_mc.removeEventListener('mousedown', comecaCombo);
		var pt = raiz.jogo_mc.globalToLocal(event.stageX, event.stageY);
		var bloco = raiz.jogo_mc.getObjectUnderPoint(pt.x, pt.y).parent.parent;
		if (bloco instanceof lib.Bloco)
		{
			bloco.destaque_mc.visible = true;
			comboAtual = [bloco];
			event.addEventListener('mousemove', continuaCombo);
			event.addEventListener('mouseup', fimCombo);
		}
	}

	function continuaCombo(event)
	{
		var pt = raiz.jogo_mc.globalToLocal(event.stageX, event.stageY);
		if (raiz.jogo_mc.getObjectUnderPoint(pt.x, pt.y))
		{
			var bloco = raiz.jogo_mc.getObjectUnderPoint(pt.x, pt.y).parent.parent;
			if (bloco instanceof lib.Bloco)
			{
				if (comboAtual.indexOf(bloco) != -1)
				{
					var index = comboAtual.indexOf(bloco)+1;
					while(comboAtual[index])
					{
						comboAtual[index].destaque_mc.visible = false;
						comboAtual.splice(index, 1);
					}
				}
				else
				{
					var blocoCombo = comboAtual[comboAtual.length-1];
					var adj = adjacentes(blocoCombo);
					if ((adj.indexOf(bloco) != -1) && (bloco.getChildAt(0).currentFrame == blocoCombo.getChildAt(0).currentFrame))
					{
						bloco.destaque_mc.visible = true;
						comboAtual.push(bloco);
					}
				}
			}
		}
	}

	function fimCombo(event)
	{
		if (comboAtual.length > 2)
		{
			console.log(comboAtual[0]);
			createjs.Sound.play(comboAtual[0].cor);
			pontos += comboAtual.length;

			for (var i = 0; i < comboAtual.length; i++)
			{
				comboAtual[i].tween = createjs.Tween.get(comboAtual[i]).to({alpha:0}, 500);
			}
			comboAtual[0].tween.call(fimRodada);
		}
		else
		{
			for (var i = 0; i < comboAtual.length; i++)
			{
				comboAtual[i].destaque_mc.visible = false;
			}
			comboAtual = [];
			raiz.jogo_mc.addEventListener('mousedown', comecaCombo);
		}
	}

	function fimRodada(event)
	{
		var arrayTween = [];
		var arrayCols = [];
		
		for (var i = 0; i < comboAtual.length; i++)
		{
			var bloco = comboAtual[i];
			if (arrayCols[bloco.col])
			{
				arrayCols[bloco.col].num++;
				if (arrayCols[bloco.col].lin < bloco.lin)
				{
					arrayCols[bloco.col].lin = bloco.lin;	
				}
			}
			else
			{
				arrayCols[bloco.col] = {'num':1, 'lin':bloco.lin, 'col':bloco.col};
			}

			arrayBlocos[bloco.lin][bloco.col] = 'vazio';
			raiz.jogo_mc.removeChild(bloco);
			bloco = null;
		}

		for (var i = 0; i < arrayCols.length; i++)
		{
			if (arrayCols[i])
			{
				var col = arrayCols[i].col;
				var nLin = arrayCols[i].lin;
				
				while (nLin > 0)
				{
					var lin = nLin-1;
					while ((arrayBlocos[lin]) && (arrayBlocos[lin][col] == 'vazio'))
					{
						lin--;
					}
					if ((lin >= 0) && (arrayBlocos[lin][col] != null))
					{
						arrayBlocos[nLin][col] = arrayBlocos[lin][col];
						arrayBlocos[nLin][col].lin = nLin;
						arrayBlocos[lin][col] = 'vazio';
						arrayTween.push({'bloco':arrayBlocos[nLin][col], 'alvo':arrayBlocos[nLin][col].y+65*(nLin-lin)});
					}
					nLin--;
				}
				
				var mNum = arrayCols[i].num-1;
				if ((arrayCols[i].col == 0) || (arrayCols[i].col == 6))
				{
					mNum++;
				}
				
				for (var num = 0; num < arrayCols[i].num; num++)
				{
					var bloco = new lib.Bloco();
					bloco.gotoAndStop(nivel);
					var frame = Math.floor(Math.random()*bloco.getChildAt(0).timeline.duration);
					bloco.getChildAt(0).gotoAndStop(frame);
					bloco.destaque_mc.visible = false;
					bloco.cor = arrayCores[nivel][frame];
					bloco.lin = mNum;
					bloco.col = col;
					raiz.jogo_mc.addChild(bloco);
					bloco.mask = raiz.jogo_mc._mask;
					bloco.x = 5 + (col*65);
					bloco.y = 5-65*(num+1);
					arrayBlocos[mNum][col] = bloco;
					arrayTween.push({'bloco':bloco, 'alvo':5+65*bloco.lin});
					mNum--;
				}
			}
		}

		if (pontos >= maxPontos)
		{
			raiz.pontos_mc.gotoAndStop(maxPontos*scoreRatio -1);
			clearInterval(tempo);
			FeedbackSOS.Acerto();
			raiz.addEventListener(FeedbackSOS.CLICOU_SIM, resetaJogo);
		}
		else
		{
			raiz.pontos_mc.gotoAndStop(pontos*scoreRatio);
			for (var i = 0; i < arrayTween.length; i++)
			{
				arrayTween[i].bloco.tween = createjs.Tween.get(arrayTween[i].bloco).to({y:arrayTween[i].alvo}, 500);
			}
			raiz.jogo_mc.addEventListener('mousedown', comecaCombo);
		}
	}

	function adjacentes(bloco)
	{
		var adj = [];
		var mLin = bloco.lin+2;
		var mCol = bloco.col+2;
		for (var lin = bloco.lin-1; lin < mLin; lin++)
		{
			if (arrayBlocos[lin])
			{
				for (var col = bloco.col-1; col < mCol; col++)
				{
					if ((arrayBlocos[lin][col]) && (arrayBlocos[lin][col] != bloco))
					{
						adj.push(arrayBlocos[lin][col]);
					}
				}
			}
		}
		return adj;
	}

	function liberaTempo()
	{
		tempoAtual = 0;
		maxTempo = 120;
		raiz.tempo_mc.gotoAndStop(0);
		timeRatio = raiz.tempo_mc.timeline.duration/maxTempo;
		tempo = setInterval(atualizaTempo, 1000);
	}

	function atualizaTempo(event)
	{
		tempoAtual++;
		raiz.tempo_mc.gotoAndStop(tempoAtual*timeRatio)
		console.log('Tempo', tempoAtual);
		if (tempoAtual == maxTempo)
		{
			clearInterval(tempo);
			FeedbackSOS.Erro();
			raiz.addEventListener(FeedbackSOS.CLICOU_SIM, resetaJogo);
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
					arrayBlocos[lin][col].parent.removeChild(arrayBlocos[lin][col]);
					arrayBlocos[lin][col] = null;
				}
			}
		}

		mostraInstrucao();
	}
}