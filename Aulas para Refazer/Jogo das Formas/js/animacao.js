Animacao = window.Animacao||{};

(function() {

	var mc, loop;
	var prefix = '[Animacao] ';
	
	Animacao.FIM = 'FIM_ANIMACAO';

	Animacao.play = function(_mc, _loop)
	{
		mc = _mc ? _mc : mc;
		loop = _loop ? _loop : 0;

		try
		{
			if (!mc)
			{
				throw 'MovieClip "mc" não definido';
			}
			if (typeof createjs == 'undefined')
			{
				throw 'Biblioteca "createjs" não foi definida.';
			}

			mc.lastFrame = mc.timeline.duration-1;

			createjs.Ticker.addEventListener('tick', verificaFrame);
			
			mc.gotoAndPlay(0);
			mc.visible = true;
		}
		catch (erro)
		{
			console.log(prefix + erro);
		}
	}

	Animacao.playTo = function(_mc, _frame)
	{
		mc = _mc ? _mc : mc;
		loop = -1;

		try
		{
			if (!mc)
			{
				throw 'MovieClip "mc" não definido';
			}
			if (typeof createjs == 'undefined')
			{
				throw 'Biblioteca "createjs" não foi definida.';
			}

			frame = _frame < mc.timeline.duration-1? _frame : mc.timeline.duration-1;

			mc.lastFrame = frame;

			createjs.Ticker.addEventListener('tick', verificaFrame);
			
			mc.play();
			mc.visible = true;
		}
		catch (erro)
		{
			console.log(prefix + erro);
		}
	}

	function verificaFrame(event)
	{
		if (mc.currentFrame == mc.lastFrame)
		{
			if (loop == 0)
			{
				mc.stop();
				createjs.Ticker.removeEventListener('tick', verificaFrame);
				mc.dispatchEvent(Animacao.FIM);
			}
			else
			{
				loop--;
			}
		}
	}

})();