var canvas, stage, raiz;
var numErros, blocoAtual, ordemAtual, dificuldade, topo, som;
function init()
{
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	
	images = images||{};

	var manifest = [
		{src:"images/base.png", id:"base"},
		{src:"images/Bitmap1.png", id:"Bitmap1"},
		{src:"images/Bitmap34.png", id:"Bitmap34"},
		{src:"images/Bitmap35.png", id:"Bitmap35"},
		{src:"images/bloco01.png", id:"bloco01"},
		{src:"images/bloco02.png", id:"bloco02"},
		{src:"images/bloco03.png", id:"bloco03"},
		{src:"images/bloco04.png", id:"bloco04"},
		{src:"images/bloco05.png", id:"bloco05"},
		{src:"images/bloco06.png", id:"bloco06"},
		{src:"images/bloco07.png", id:"bloco07"},
		{src:"images/bloco08.png", id:"bloco08"},
		{src:"images/bloco09.png", id:"bloco09"},
		{src:"images/bloco10.png", id:"bloco10"},
		{src:"images/blocoExtra.png", id:"blocoExtra"},
		{src:"images/blocotuto.png", id:"blocotuto"},
		{src:"images/fd.jpg", id:"fd"},
		{src:"images/folhaVida.png", id:"folhaVida"},
		{src:"images/fundoCaminhoCorrente.png", id:"fundoCaminhoCorrente"},
		{src:"images/fundoVidas.png", id:"fundoVidas"},
		{src:"images/madeiraCaminhoCorrente.png", id:"madeiraCaminhoCorrente"},
		{src:"images/sombraFolha.png", id:"sombraFolha"},
		{src:"images/gancho1.png", id:"gancho1"},
		{src:"images/gancho2.png", id:"gancho2"},
		{src:"images/gancho3.png", id:"gancho3"},
		{src:"images/ganchotuto.png", id:"ganchotuto"},
		{src:"images/giro1.png", id:"giro1"},
		{src:"images/giro2.png", id:"giro2"},
		{src:"images/giro3.png", id:"giro3"},
		{src:"images/tutorial01.jpg", id:"tutorial01"}

	];

	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", carregandoImagens);
	loader.addEventListener("complete", imagensCarregadas);
	loader.loadManifest(manifest);

	function carregandoImagens(evt) {
		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
	}

	function imagensCarregadas()
	{
		raiz = new lib.BlocosNumericos();
		
		jogo = raiz.jogo_mc;
		
		stage.addChild(raiz);
		createjs.Ticker.setFPS(12);
		createjs.Ticker.addEventListener("tick", stage);


		var manifest = [
			{src:"sons/um.mp3", id:"um"},
			{src:"sons/dois.mp3", id:"dois"},
			{src:"sons/tres.mp3", id:"tres"},
			{src:"sons/quatro.mp3", id:"quatro"},
			{src:"sons/cinco.mp3", id:"cinco"},
			{src:"sons/a.mp3", id:"a"},
			{src:"sons/e.mp3", id:"e"},
			{src:"sons/i.mp3", id:"i"},
			{src:"sons/o.mp3", id:"o"},
			{src:"sons/u.mp3", id:"u"},
			{src:"sons/abertura.mp3", id:"abertura"},
			{src:"sons/facil.mp3", id:"facil"},
			{src:"sons/dificil.mp3", id:"dificil"},
			{src:"sons/somFundo.mp3", id:"somFundo"},
			{src:"sons/sim.wav", id:"sim"},
			{src:"sons/nao.wav", id:"nao"},
			{src:"sons/acertoSOS.wav", id:"acertoSOS"},
			{src:"sons/erroSOS.wav", id:"erroSOS"}
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

		arraySons = {'facil':['um', 'dois', 'tres', 'quatro', 'cinco'], 'dificil': ['a', 'e', 'i', 'o', 'u']}

		raiz.carregar_mc.visible = false;

		mostraAbertura();
	}

	function mostraAbertura()
	{
		raiz.abertura_mc.visible = true;
		raiz.abertura_mc.voltar_btn.addEventListener('click', function(){window.close();});
		raiz.abertura_mc.tutorial_mc.gotoAndPlay(0);
		raiz.abertura_mc.som = createjs.Sound.play('abertura');
		raiz.abertura_mc.facil_btn.addEventListener('mouseover', function(){ som = createjs.Sound.play('facil')});
		raiz.abertura_mc.facil_btn.addEventListener('click', novoJogo);
		raiz.abertura_mc.facil_btn.dificuldade = 'facil';
		raiz.abertura_mc.dificil_btn.addEventListener('mouseover', function(){ som = createjs.Sound.play('dificil')});

		raiz.abertura_mc.dificil_btn.addEventListener('click', novoJogo);
		raiz.abertura_mc.dificil_btn.dificuldade = 'dificil';
	}

	function novoJogo(event)
	{
		if (raiz.abertura_mc.som.playState != 'playFinished')
		{
			raiz.abertura_mc.som.stop();
		}
		raiz.abertura_mc.visible = false;
		dificuldade = event.target.dificuldade;
		ordemAtual = 0;
		numErros = 0;
		arrayBlocos = [];
		for (var i = 0; i < jogo.vidas_mc.children.length; i++)
		{
			jogo.vidas_mc.children[i].visible = true;
		}
		topo = jogo.base_mc;

		jogo.gancho_mc._x = jogo.gancho_mc.x;

		novoBloco();
	}

	function novoBloco()
	{
		//Reseta posição do gancho, rotação da roda, frame da corrente
		jogo.gancho_mc.x = jogo.gancho_mc._x;
		jogo.gancho_mc.roda_mc.rotation = 0;
		jogo.gancho_mc.corrente_mc.gotoAndStop(0)

		//Seta Tweens
		jogo.gancho_mc.tween = createjs.Tween.get(jogo.gancho_mc, {loop:true}).to({x:jogo.gancho_mc.x+300}, 4000, createjs.Ease.quadInOut).call(fimDireita).to({x:jogo.gancho_mc.x}, 4000, createjs.Ease.quadInOut).call(fimEsquerda);
		jogo.gancho_mc.roda_mc.tween = createjs.Tween.get(jogo.gancho_mc.roda_mc).to({rotation:360}, 4000, createjs.Ease.quadInOut);

		//Criação do Bloco
		blocoAtual = new lib.Bloco();
		blocoAtual.gotoAndStop(dificuldade);
		blocoAtual.getChildAt(0).gotoAndStop(ordemAtual);
		jogo.gancho_mc.corrente_mc.addChild(blocoAtual);
		blocoAtual.x = -(blocoAtual.nominalBounds.width/2);

		jogo.addEventListener('click', soltaBloco);
	}

	function soltaBloco(event)
	{
		jogo.removeEventListener('click', soltaBloco);

		jogo.gancho_mc.tween.setPaused(true);
		jogo.gancho_mc.roda_mc.tween.setPaused(true);

		var pt = jogo.gancho_mc.corrente_mc.localToGlobal(blocoAtual.x, blocoAtual.y);
		var apt = jogo.globalToLocal(pt.x, pt.y);
		jogo.addChild(blocoAtual);
		blocoAtual.x = apt.x;
		blocoAtual.y = apt.y;

		var min = topo.x - 30;
		var max = topo.x + topo.nominalBounds.width - 15;
		var yAlvo = topo.y - blocoAtual.nominalBounds.height;
		var tempo = ((yAlvo-blocoAtual.y)/300)*1000;
		blocoAtual.tween = createjs.Tween.get(blocoAtual).to({y:yAlvo}, tempo);
		jogo.gancho_mc.corrente_mc.gotoAndStop(1);

		if ((blocoAtual.x > min) && (blocoAtual.x < max))
		{
			arrayBlocos.push(blocoAtual);
			topo = blocoAtual;
			if ((som) && (som.playState != 'playFinished'))
			{
				som.stop();
			}
			som = createjs.Sound.play(arraySons[dificuldade][ordemAtual]);

			ordemAtual++;
			if (ordemAtual == 5)
			{
				blocoAtual.tween.call(fimJogo);
			}
			else
			{
				blocoAtual.tween.call(novoBloco);
			}
		}
		else
		{
			if ((blocoAtual.x < topo.x - blocoAtual.nominalBounds.width) || (blocoAtual.x > topo.x + topo.nominalBounds.width + blocoAtual.nominalBounds.width))
			{
				blocoAtual._rotation = 0;
			}
			else if (blocoAtual.x <= min)
			{
				blocoAtual._rotation = -90;
			}
			else if (blocoAtual.x >= max)
			{
				blocoAtual._rotation = 90;
			}
			blocoAtual.tween.call(erro);
		}
	}

	function erro(event)
	{
		blocoAtual.xAlvo = 0;
		if (blocoAtual._rotation != 0)
		{
			if (blocoAtual._rotation > 0)
			{
				var pt = jogo.localToGlobal(topo.x+topo.nominalBounds.width, topo.y);
				blocoAtual.xAlvo = 20;
			}
			else if (blocoAtual._rotation < 0)
			{
				var pt = jogo.localToGlobal(topo.x, topo.y);
				blocoAtual.xAlvo = -20;
			}
			var apt = blocoAtual.globalToLocal(pt.x, pt.y);
			blocoAtual.regX = apt.x;
			blocoAtual.regY = apt.y;
			blocoAtual.x += apt.x;
			blocoAtual.y += apt.y;
		}
		blocoAtual.xAlvo += blocoAtual.x;
		blocoAtual.yAlvo = blocoAtual.y+blocoAtual.nominalBounds.height;

		blocoAtual.tween = createjs.Tween.get(blocoAtual).to({x:blocoAtual.xAlvo, y:blocoAtual.yAlvo, rotation:blocoAtual._rotation, alpha:0}, 1000).call(fimErro);
	}

	function fimErro(event)
	{
		jogo.removeChild(blocoAtual);
		blocoAtual = null;

		jogo.vidas_mc['v'+numErros+'_mc'].visible = false;
		numErros++;
		if (numErros == 3)
		{
			FeedbackSOS.Erro();
			raiz.addEventListener(FeedbackSOS.CLICOU_SIM, resetaJogo)
		}
		else
		{
			novoBloco();
		}
	}

	function resetaJogo(event)
	{
		for (var i = 0; i < arrayBlocos.length; i++)
		{
			arrayBlocos[i].parent.removeChild(arrayBlocos[i]);
			arrayBlocos[i] = null;
		}
		jogo.gancho_mc.x = jogo.gancho_mc._x;
		createjs.Tween.removeTweens(jogo.gancho_mc.roda_mc);
		mostraAbertura();
	}

	function fimJogo(event)
	{
		FeedbackSOS.Acerto();
		raiz.addEventListener(FeedbackSOS.CLICOU_SIM, resetaJogo)
	}

	function fimDireita(event)
	{
		jogo.gancho_mc.roda_mc.tween = createjs.Tween.get(jogo.gancho_mc.roda_mc).to({rotation:0}, 4000, createjs.Ease.quadInOut);
	}

	function fimEsquerda(event)
	{
		jogo.gancho_mc.roda_mc.tween = createjs.Tween.get(jogo.gancho_mc.roda_mc).to({rotation:360}, 4000, createjs.Ease.quadInOut);
	}
}