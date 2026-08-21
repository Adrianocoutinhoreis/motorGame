FeedbackSOS = window.FeedbackSOS||{};

(function() {

	var som, somBtn, mc;

	FeedbackSOS.CLICOU_SIM = 'FEEDBACK_SIM';
	FeedbackSOS.CLICOU_NAO = 'FEEDBACK_NAO';
	
	FeedbackSOS.getMC = function(){return mc};

	FeedbackSOS.Acerto = function()
	{
		try
		{
			if (typeof lib == 'undefined')
			{
				throw 'Biblioteca "lib" não foi definida.';
			}
			if (typeof lib.AcertoSOS == 'undefined')
			{
				throw 'Objeto "AcertoSOS" não existe na biblioteca.';
			}
			if (typeof createjs == 'undefined')
			{
				throw 'Biblioteca "createjs" não foi definida.';
			}

			mc = new lib.AcertoSOS();
			FeedbackSOS.som = createjs.Sound.play('acertoSOS');
			mcSetup();
		}
		catch (error)
		{
			console.log(error);
		}
	}

	FeedbackSOS.Erro = function()
	{
		try
		{
			if (typeof lib == 'undefined')
			{
				throw 'Biblioteca "lib" não foi definida.';
			}
			if (typeof lib.ErroSOS == 'undefined')
			{
				throw 'Objeto "ErroSOS" não existe na biblioteca.';
			}
			if (typeof createjs == 'undefined')
			{
				throw 'Biblioteca "createjs" não foi definida.';
			}

			mc = new lib.ErroSOS();
			FeedbackSOS.som = createjs.Sound.play('erroSOS');
			mcSetup();
		}
		catch (error)
		{
			console.log(error);
		}
	}

	function mcSetup()
	{
		mc.nao_btn.addEventListener('mouseover', tocarBtn);
		mc.nao_btn.addEventListener('click', fimFeedback);
		mc.sim_btn.addEventListener('mouseover', tocarBtn);
		mc.sim_btn.addEventListener('click', fimFeedback);
		mc.x = 400;
		mc.y = 300;
		raiz.addChild(mc);
	}

	function fimFeedback(event)
	{
		mc.visible = false;
		mc.nao_btn.removeAllEventListeners();
		mc.sim_btn.removeAllEventListeners();

		if (FeedbackSOS.som.playState != 'playFinished')
		{
			FeedbackSOS.som.stop();
		}
		if (FeedbackSOS.somBtn.playState != 'playFinished')
		{
			FeedbackSOS.somBtn.stop();
		}

		if (event.target == mc.sim_btn)
		{
			raiz.dispatchEvent(new Event('FEEDBACK_SIM'));
		}
		else
		{
			raiz.dispatchEvent(new Event('FEEDBACK_NAO'));
			window.close();
		}
	}
	function tocarBtn(event)
	{
		if (event.target == mc.nao_btn)
		{
			FeedbackSOS.somBtn = createjs.Sound.play('nao');
		}
		if (event.target == mc.sim_btn)
		{
			FeedbackSOS.somBtn = createjs.Sound.play('sim');
		}
	}

})();