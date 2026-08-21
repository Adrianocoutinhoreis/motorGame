(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.JogoFormas = function() {
	this.initialize();

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Eg+fAu4MAAAhdvMB8/AAAMAAABdvg");
	mask.setTransform(400,300);

	// carregar
	this.carregar_mc = new lib.carregar_mc();
	this.carregar_mc.setTransform(400.5,300);

	// somFundo
	this.somFundo_mc = new lib.botaoSom();
	this.somFundo_mc.setTransform(724.9,61.7,0.437,0.437);

	// abertura
	this.abertura_mc = new lib.tela1();
	this.abertura_mc.setTransform(404.6,302.6);

	// desenvolvimento
	this.jogo_mc = new lib.jogo_mc();
	this.jogo_mc.setTransform(273.5,277.5,1,1,0,0,0,102.5,-247.1);

	// fundoPrincipal
	this.instance = new lib.Landscapechamomile7();
	this.instance.setTransform(800.5,0,1,1,0,0,180);

	this.instance_1 = new lib.BG();

	this.addChild(this.instance_1,this.instance,this.jogo_mc,this.abertura_mc,this.somFundo_mc,this.carregar_mc);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,800.5,609.3);


// symbols:
(lib.barraPontosExterna = function() {
	this.initialize(img.barraPontosExterna);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,72,326);


(lib.barraPontosInterna = function() {
	this.initialize(img.barraPontosInterna);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,19,259);


(lib.BG = function() {
	this.initialize(img.BG);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,800,600);


(lib.Bitmap32 = function() {
	this.initialize(img.Bitmap32);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,340,341);


(lib.Bitmap34 = function() {
	this.initialize(img.Bitmap34);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,157,39);


(lib.Bitmap35 = function() {
	this.initialize(img.Bitmap35);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,40,117);


(lib.BlocoCirculo = function() {
	this.initialize(img.BlocoCirculo);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.Blocolosango = function() {
	this.initialize(img.Blocolosango);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.blocoQuadrado = function() {
	this.initialize(img.blocoQuadrado);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.BlocoRetangulo = function() {
	this.initialize(img.BlocoRetangulo);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.blocoTriangulo = function() {
	this.initialize(img.blocoTriangulo);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.brilho1 = function() {
	this.initialize(img.brilho1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,48);


(lib.brilho2 = function() {
	this.initialize(img.brilho2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,55,56);


(lib.brilho3 = function() {
	this.initialize(img.brilho3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,55,56);


(lib.coruja1 = function() {
	this.initialize(img.coruja1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,96,91);


(lib.coruja2 = function() {
	this.initialize(img.coruja2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,96,91);


(lib.coruja3 = function() {
	this.initialize(img.coruja3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,96,91);


(lib.estrela1 = function() {
	this.initialize(img.estrela1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,46);


(lib.estrela2 = function() {
	this.initialize(img.estrela2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,46);


(lib.estrela3 = function() {
	this.initialize(img.estrela3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,48,46);


(lib.instrucoes1 = function() {
	this.initialize(img.instrucoes1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,340,281);


(lib.instrucoes2 = function() {
	this.initialize(img.instrucoes2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,647,362);


(lib.Landscapechamomile7 = function() {
	this.initialize(img.Landscapechamomile7);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,800,600);


(lib.logo = function() {
	this.initialize(img.logo);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,428,64);


(lib.relogio = function() {
	this.initialize(img.relogio);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,47,54);


(lib.relogioCapa = function() {
	this.initialize(img.relogioCapa);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,194,216);


(lib.relogioFundo = function() {
	this.initialize(img.relogioFundo);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,134,134);


(lib.seta1 = function() {
	this.initialize(img.seta1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,21,83);


(lib.seta2 = function() {
	this.initialize(img.seta2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,24,90);


(lib.seta3 = function() {
	this.initialize(img.seta3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,28,93);


(lib.tronco = function() {
	this.initialize(img.tronco);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,601,437);


(lib.troncoArea = function() {
	this.initialize(img.troncoArea);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,448,501);


(lib.tutobrilho1 = function() {
	this.initialize(img.tutobrilho1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,259,203);


(lib.tutobrilho2 = function() {
	this.initialize(img.tutobrilho2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,259,203);


(lib.tutobrilho3 = function() {
	this.initialize(img.tutobrilho3);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,259,203);


(lib.tutorial1 = function() {
	this.initialize(img.tutorial1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,320,240);


(lib.Symbol3 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF9900").ss(1,1,1).p("AgqAaIhGgvIBVgGIAZhRIAdBPIBWAAIhCA0IAbBRIhIguIhCAzg");
	this.shape.setTransform(11.3,10.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFCC00").s().p("AgqAaIhGgvIBVgGIAZhRIAdBQIBWgBIhCA0IAbBRIhIguIhCAyg");
	this.shape_1.setTransform(11.3,10.9);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,22.7,21.8);


(lib.Symbol2 = function() {
	this.initialize();

	// Layer 1
	this.instance = new lib.relogioCapa();

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,194,216);


(lib.somAnimado_mc = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FCC601").s().p("AiNA7Qg1gvAAhTIAAgIQA3gGA6gFQCLgGAAgBIAugBIAIgBIAeAAIACgBIACgBIASAAQAOABAGABIADgEQAGgFABAHIABgCIgBAEIAAABIAAABIAAABIgEAJIAAABQAAAIgKAbQgJAYgEAGIgEAHIgGAKIgKANQgLAYgTAUQgzA1hGAAQhWAAgzgvg");
	this.shape.setTransform(-17,33.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#9E7925").s().p("AlAGiIgFgGIgIgGQg5gzAAhZIABgHQABguAeguQAcgtAsgfQAxgiAuAAQBgAAAvA8IACABIANgzIA6jNIASg/IABgCQA7jNAVhAQAGgEAKAFIBIAdQBMAiASATIAXAbIAGAHQAqAxAKBLQAEAZAAAcQAABgg7BFQg7BDhTAAIgUgCIgBAAIACiHIAUgeQAogQAUglQAOgaAAgbIgBgPQgQgggigWIgfgPIgsCiIgOA1IglCFIgNAsQgiB7ggBoIgBABQgIA5gnAsQg2A4hNAAQhdAAg5g4gAkWBkQgqAdgcArQgcAsgCAqIgBAIQAABVA1AvQA0AvBVAAQBJAAAyg1QAUgUALgYIAKgPIAGgKIAEgHQAEgGAJgYQAIgbAAgIIAAgBIAEgJIAAgBIAAgBIAAgBIABgEIABgBIAFgQIASg/IABgEIACgFIAAgBIAdhnIANgqIAahhIAPg4IAyitIAyAYQAzAfAEAnQABAHAAAHQAAAngVAfQgLAQgaAXIgZAUIgEBrQBBgHAxg3QA4hCAAhaIgBgfQgHhcg2g3QgKgKhPgiQhPgigDADQgUA5g5DHIgBAEQgJAegIAdQghB5gZBWIgOA1IACACQgRgGgKgHIgBgBQgsgshRAAQgrAAgsAfg");
	this.shape_1.setTransform(1.4,-0.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FDE602").s().p("AlSEOQAcgqApgeQAtgfArAAQBQAAAsAsIABABQAKAHARAGIgBgBIAOg2QAWhYAkh2QAHgdAKgfIABgEQA5jGATg6QAEgDBOAiQBQAjAKAKQA1A2AIBdIABAeQAABbg4BAQgxA5hCAHIAFhtIAYgTQAagXALgPQAWggAAgnQAAgHgCgGQgDgngzggIgygXIgyCtIgQA3IgaBfIgMAtIgdBnIgBAAIgBAFIgBAEIgTA/IgFAQIAAABIgCACQgBgHgFAFIgEAFQgGgCgMAAIgSAAIgCAAIgCABIgeABIgIAAIgtABQAAABiOAHQg6AEg3AHQACgrAdgsg");
	this.shape_2.setTransform(0.4,-10.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AleHDIgHgHIgJgHQhFg+AAhtIABgIQABg4Alg4QAhg3A3gmQA7gqA5AAQBNAAAzAfIAFAEIAIAGIALgOIAZhWIACgDQBkliAlhvQALgHARAIQAtACBUA2QBUA1AiBFQAhBEABAaIACAnIABAdIgBAYIgBAIIgBAHIgCANQgPBHg3A0QgzAzhBARQgdAHghAAIghgBIgChIIgVBCQgnCMgkB3IgBABQgLBFgwA2QhBBFheAAQhxAAhGhFgAC8iDQAigNAVgfQAUgegDgfQgBgKgLgNIgSgVg");

	this.addChild(this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-43.6,-52,87.3,104.2);


(lib.seta_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.seta1();
	this.instance.setTransform(-9.7,-43.4);

	this.instance_1 = new lib.seta2();
	this.instance_1.setTransform(-12.2,-45.4);

	this.instance_2 = new lib.seta3();
	this.instance_2.setTransform(-13.5,-46.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-9.7,-43.4,21,83);


(lib.roda_mc = function() {
	this.initialize();

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00FFB3").s().p("AiSH3QjRjQAAknQAAkmDRjRQDPjQEnAAIAAWPQknAAjPjRg");
	this.shape.setTransform(-35.5,0);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-71.2,-71.2,71.3,142.5);


(lib.pontos_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AiLABIAAgBIEWAAIAAABg");
	var mask_graphics_1 = new cjs.Graphics().p("AiLARIAAghIEWAAIAAAhg");
	var mask_graphics_2 = new cjs.Graphics().p("AiLAiIAAhDIEWAAIAABDg");
	var mask_graphics_3 = new cjs.Graphics().p("AiLAyIAAhjIEWAAIAABjg");
	var mask_graphics_4 = new cjs.Graphics().p("AiLBCIAAiDIEWAAIAACDg");
	var mask_graphics_5 = new cjs.Graphics().p("AiLBSIAAijIEWAAIAACjg");
	var mask_graphics_6 = new cjs.Graphics().p("AiLBjIAAjFIEWAAIAADFg");
	var mask_graphics_7 = new cjs.Graphics().p("AiLBzIAAjlIEWAAIAADlg");
	var mask_graphics_8 = new cjs.Graphics().p("AiLCDIAAkFIEWAAIAAEFg");
	var mask_graphics_9 = new cjs.Graphics().p("AiLCTIAAklIEWAAIAAElg");
	var mask_graphics_10 = new cjs.Graphics().p("AiLCkIAAlHIEWAAIAAFHg");
	var mask_graphics_11 = new cjs.Graphics().p("AiLC0IAAlnIEWAAIAAFng");
	var mask_graphics_12 = new cjs.Graphics().p("AiLDEIAAmHIEWAAIAAGHg");
	var mask_graphics_13 = new cjs.Graphics().p("AiLDVIAAmpIEWAAIAAGpg");
	var mask_graphics_14 = new cjs.Graphics().p("AiLDlIAAnJIEWAAIAAHJg");
	var mask_graphics_15 = new cjs.Graphics().p("AiLD1IAAnpIEWAAIAAHpg");
	var mask_graphics_16 = new cjs.Graphics().p("AiLEFIAAoJIEWAAIAAIJg");
	var mask_graphics_17 = new cjs.Graphics().p("AiLEWIAAorIEWAAIAAIrg");
	var mask_graphics_18 = new cjs.Graphics().p("AiLEmIAApLIEWAAIAAJLg");
	var mask_graphics_19 = new cjs.Graphics().p("AiLE2IAAprIEWAAIAAJrg");
	var mask_graphics_20 = new cjs.Graphics().p("AiLFHIAAqNIEWAAIAAKNg");
	var mask_graphics_21 = new cjs.Graphics().p("AiLFXIAAqtIEWAAIAAKtg");
	var mask_graphics_22 = new cjs.Graphics().p("AiLFnIAArNIEWAAIAALNg");
	var mask_graphics_23 = new cjs.Graphics().p("AiLF3IAArtIEWAAIAALtg");
	var mask_graphics_24 = new cjs.Graphics().p("AiLGIIAAsPIEWAAIAAMPg");
	var mask_graphics_25 = new cjs.Graphics().p("AiLGYIAAsvIEWAAIAAMvg");
	var mask_graphics_26 = new cjs.Graphics().p("AiLGoIAAtPIEWAAIAANPg");
	var mask_graphics_27 = new cjs.Graphics().p("AiLG4IAAtvIEWAAIAANvg");
	var mask_graphics_28 = new cjs.Graphics().p("AiLHJIAAuRIEWAAIAAORg");
	var mask_graphics_29 = new cjs.Graphics().p("AiLHZIAAuxIEWAAIAAOxg");
	var mask_graphics_30 = new cjs.Graphics().p("AiLHpIAAvRIEWAAIAAPRg");
	var mask_graphics_31 = new cjs.Graphics().p("AiLH6IAAvzIEWAAIAAPzg");
	var mask_graphics_32 = new cjs.Graphics().p("AiLIKIAAwTIEWAAIAAQTg");
	var mask_graphics_33 = new cjs.Graphics().p("AiLIaIAAwzIEWAAIAAQzg");
	var mask_graphics_34 = new cjs.Graphics().p("AiLIqIAAxTIEWAAIAARTg");
	var mask_graphics_35 = new cjs.Graphics().p("AiLI7IAAx1IEWAAIAAR1g");
	var mask_graphics_36 = new cjs.Graphics().p("AiLJLIAAyVIEWAAIAASVg");
	var mask_graphics_37 = new cjs.Graphics().p("AiLJbIAAy1IEWAAIAAS1g");
	var mask_graphics_38 = new cjs.Graphics().p("AiLJrIAAzVIEWAAIAATVg");
	var mask_graphics_39 = new cjs.Graphics().p("AiLJ8IAAz3IEWAAIAAT3g");
	var mask_graphics_40 = new cjs.Graphics().p("AiLKMIAA0XIEWAAIAAUXg");
	var mask_graphics_41 = new cjs.Graphics().p("AiLKcIAA03IEWAAIAAU3g");
	var mask_graphics_42 = new cjs.Graphics().p("AiLKtIAA1ZIEWAAIAAVZg");
	var mask_graphics_43 = new cjs.Graphics().p("AiLK9IAA15IEWAAIAAV5g");
	var mask_graphics_44 = new cjs.Graphics().p("AiLLNIAA2ZIEWAAIAAWZg");
	var mask_graphics_45 = new cjs.Graphics().p("AiLLdIAA25IEWAAIAAW5g");
	var mask_graphics_46 = new cjs.Graphics().p("AiLLuIAA3bIEWAAIAAXbg");
	var mask_graphics_47 = new cjs.Graphics().p("AiLL+IAA37IEWAAIAAX7g");
	var mask_graphics_48 = new cjs.Graphics().p("AiLMOIAA4bIEWAAIAAYbg");
	var mask_graphics_49 = new cjs.Graphics().p("AiLMeIAA47IEWAAIAAY7g");
	var mask_graphics_50 = new cjs.Graphics().p("AiLMvIAA5dIEWAAIAAZdg");
	var mask_graphics_51 = new cjs.Graphics().p("AiLM/IAA59IEWAAIAAZ9g");
	var mask_graphics_52 = new cjs.Graphics().p("AiLNPIAA6dIEWAAIAAadg");
	var mask_graphics_53 = new cjs.Graphics().p("AiLNgIAA6/IEWAAIAAa/g");
	var mask_graphics_54 = new cjs.Graphics().p("AiLNwIAA7fIEWAAIAAbfg");
	var mask_graphics_55 = new cjs.Graphics().p("AiLOAIAA7/IEWAAIAAb/g");
	var mask_graphics_56 = new cjs.Graphics().p("AiLOQIAA8fIEWAAIAAcfg");
	var mask_graphics_57 = new cjs.Graphics().p("AiLOhIAA9BIEWAAIAAdBg");
	var mask_graphics_58 = new cjs.Graphics().p("AiLOxIAA9hIEWAAIAAdhg");
	var mask_graphics_59 = new cjs.Graphics().p("AiLPBIAA+BIEWAAIAAeBg");
	var mask_graphics_60 = new cjs.Graphics().p("AiLPSIAA+jIEWAAIAAejg");
	var mask_graphics_61 = new cjs.Graphics().p("AiLPiIAA/DIEWAAIAAfDg");
	var mask_graphics_62 = new cjs.Graphics().p("AiLPyIAA/jIEWAAIAAfjg");
	var mask_graphics_63 = new cjs.Graphics().p("AiLQCMAAAggDIEWAAMAAAAgDg");
	var mask_graphics_64 = new cjs.Graphics().p("AiLQTMAAAgglIEWAAMAAAAglg");
	var mask_graphics_65 = new cjs.Graphics().p("AiLQjMAAAghFIEWAAMAAAAhFg");
	var mask_graphics_66 = new cjs.Graphics().p("AiLQzMAAAghlIEWAAMAAAAhlg");
	var mask_graphics_67 = new cjs.Graphics().p("AiLRDMAAAgiFIEWAAMAAAAiFg");
	var mask_graphics_68 = new cjs.Graphics().p("AiLRUMAAAginIEWAAMAAAAing");
	var mask_graphics_69 = new cjs.Graphics().p("AiLRkMAAAgjHIEWAAMAAAAjHg");
	var mask_graphics_70 = new cjs.Graphics().p("AiLR0MAAAgjnIEWAAMAAAAjng");
	var mask_graphics_71 = new cjs.Graphics().p("AiLSFMAAAgkJIEWAAMAAAAkJg");
	var mask_graphics_72 = new cjs.Graphics().p("AiLSVMAAAgkpIEWAAMAAAAkpg");
	var mask_graphics_73 = new cjs.Graphics().p("AiLSlMAAAglJIEWAAMAAAAlJg");
	var mask_graphics_74 = new cjs.Graphics().p("AiLS1MAAAglpIEWAAMAAAAlpg");
	var mask_graphics_75 = new cjs.Graphics().p("AiLTGMAAAgmLIEWAAMAAAAmLg");
	var mask_graphics_76 = new cjs.Graphics().p("AiLTWMAAAgmrIEWAAMAAAAmrg");
	var mask_graphics_77 = new cjs.Graphics().p("AiLTmMAAAgnLIEWAAMAAAAnLg");
	var mask_graphics_78 = new cjs.Graphics().p("AiLT2MAAAgnrIEWAAMAAAAnrg");
	var mask_graphics_79 = new cjs.Graphics().p("AiLUHMAAAgoNIEWAAMAAAAoNg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:0.5,y:111.8}).wait(1).to({graphics:mask_graphics_1,x:0.5,y:110.2}).wait(1).to({graphics:mask_graphics_2,x:0.5,y:108.5}).wait(1).to({graphics:mask_graphics_3,x:0.5,y:106.9}).wait(1).to({graphics:mask_graphics_4,x:0.5,y:105.3}).wait(1).to({graphics:mask_graphics_5,x:0.5,y:103.7}).wait(1).to({graphics:mask_graphics_6,x:0.5,y:102}).wait(1).to({graphics:mask_graphics_7,x:0.5,y:100.4}).wait(1).to({graphics:mask_graphics_8,x:0.5,y:98.8}).wait(1).to({graphics:mask_graphics_9,x:0.5,y:97.2}).wait(1).to({graphics:mask_graphics_10,x:0.5,y:95.5}).wait(1).to({graphics:mask_graphics_11,x:0.5,y:93.9}).wait(1).to({graphics:mask_graphics_12,x:0.5,y:92.3}).wait(1).to({graphics:mask_graphics_13,x:0.5,y:90.6}).wait(1).to({graphics:mask_graphics_14,x:0.5,y:89}).wait(1).to({graphics:mask_graphics_15,x:0.5,y:87.4}).wait(1).to({graphics:mask_graphics_16,x:0.5,y:85.8}).wait(1).to({graphics:mask_graphics_17,x:0.5,y:84.1}).wait(1).to({graphics:mask_graphics_18,x:0.5,y:82.5}).wait(1).to({graphics:mask_graphics_19,x:0.5,y:80.9}).wait(1).to({graphics:mask_graphics_20,x:0.5,y:79.2}).wait(1).to({graphics:mask_graphics_21,x:0.5,y:77.6}).wait(1).to({graphics:mask_graphics_22,x:0.5,y:76}).wait(1).to({graphics:mask_graphics_23,x:0.5,y:74.4}).wait(1).to({graphics:mask_graphics_24,x:0.5,y:72.7}).wait(1).to({graphics:mask_graphics_25,x:0.5,y:71.1}).wait(1).to({graphics:mask_graphics_26,x:0.5,y:69.5}).wait(1).to({graphics:mask_graphics_27,x:0.5,y:67.9}).wait(1).to({graphics:mask_graphics_28,x:0.5,y:66.2}).wait(1).to({graphics:mask_graphics_29,x:0.5,y:64.6}).wait(1).to({graphics:mask_graphics_30,x:0.5,y:63}).wait(1).to({graphics:mask_graphics_31,x:0.5,y:61.3}).wait(1).to({graphics:mask_graphics_32,x:0.5,y:59.7}).wait(1).to({graphics:mask_graphics_33,x:0.5,y:58.1}).wait(1).to({graphics:mask_graphics_34,x:0.5,y:56.5}).wait(1).to({graphics:mask_graphics_35,x:0.5,y:54.8}).wait(1).to({graphics:mask_graphics_36,x:0.5,y:53.2}).wait(1).to({graphics:mask_graphics_37,x:0.5,y:51.6}).wait(1).to({graphics:mask_graphics_38,x:0.5,y:50}).wait(1).to({graphics:mask_graphics_39,x:0.5,y:48.3}).wait(1).to({graphics:mask_graphics_40,x:0.5,y:46.7}).wait(1).to({graphics:mask_graphics_41,x:0.5,y:45.1}).wait(1).to({graphics:mask_graphics_42,x:0.5,y:43.4}).wait(1).to({graphics:mask_graphics_43,x:0.5,y:41.8}).wait(1).to({graphics:mask_graphics_44,x:0.5,y:40.2}).wait(1).to({graphics:mask_graphics_45,x:0.5,y:38.6}).wait(1).to({graphics:mask_graphics_46,x:0.5,y:36.9}).wait(1).to({graphics:mask_graphics_47,x:0.5,y:35.3}).wait(1).to({graphics:mask_graphics_48,x:0.5,y:33.7}).wait(1).to({graphics:mask_graphics_49,x:0.5,y:32.1}).wait(1).to({graphics:mask_graphics_50,x:0.5,y:30.4}).wait(1).to({graphics:mask_graphics_51,x:0.5,y:28.8}).wait(1).to({graphics:mask_graphics_52,x:0.5,y:27.2}).wait(1).to({graphics:mask_graphics_53,x:0.5,y:25.5}).wait(1).to({graphics:mask_graphics_54,x:0.5,y:23.9}).wait(1).to({graphics:mask_graphics_55,x:0.5,y:22.3}).wait(1).to({graphics:mask_graphics_56,x:0.5,y:20.7}).wait(1).to({graphics:mask_graphics_57,x:0.5,y:19}).wait(1).to({graphics:mask_graphics_58,x:0.5,y:17.4}).wait(1).to({graphics:mask_graphics_59,x:0.5,y:15.8}).wait(1).to({graphics:mask_graphics_60,x:0.5,y:14.1}).wait(1).to({graphics:mask_graphics_61,x:0.5,y:12.5}).wait(1).to({graphics:mask_graphics_62,x:0.5,y:10.9}).wait(1).to({graphics:mask_graphics_63,x:0.5,y:9.3}).wait(1).to({graphics:mask_graphics_64,x:0.5,y:7.6}).wait(1).to({graphics:mask_graphics_65,x:0.5,y:6}).wait(1).to({graphics:mask_graphics_66,x:0.5,y:4.4}).wait(1).to({graphics:mask_graphics_67,x:0.5,y:2.8}).wait(1).to({graphics:mask_graphics_68,x:0.5,y:1.1}).wait(1).to({graphics:mask_graphics_69,x:0.5,y:-0.4}).wait(1).to({graphics:mask_graphics_70,x:0.5,y:-2}).wait(1).to({graphics:mask_graphics_71,x:0.5,y:-3.7}).wait(1).to({graphics:mask_graphics_72,x:0.5,y:-5.3}).wait(1).to({graphics:mask_graphics_73,x:0.5,y:-6.9}).wait(1).to({graphics:mask_graphics_74,x:0.5,y:-8.5}).wait(1).to({graphics:mask_graphics_75,x:0.5,y:-10.2}).wait(1).to({graphics:mask_graphics_76,x:0.5,y:-11.8}).wait(1).to({graphics:mask_graphics_77,x:0.5,y:-13.4}).wait(1).to({graphics:mask_graphics_78,x:0.5,y:-15}).wait(1).to({graphics:mask_graphics_79,x:0.5,y:-16.7}).wait(1));

	// dentro
	this.instance = new lib.barraPontosInterna();
	this.instance.setTransform(-9.9,-147);

	this.instance.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(80));

	// base
	this.instance_1 = new lib.barraPontosExterna();
	this.instance_1.setTransform(-35.9,-162.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(80));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35.9,-162.9,72,326);


(lib.ponteiro_mc = function() {
	this.initialize();

	// Camada 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#666666").s().p("AAIBIIg1AzIhbkCIEMBaIg8A2IBBBBIhAA+gABJCBIA5g3IhBhBIA6g0Ij7hVIBVDyIAzgxg");
	this.shape.setTransform(-2.5,-2.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#9D9D9D").s().p("AAeA/IAgggIAAAAIAZAAIg5A4gAhPAsIAAAAIAugtIAAAYIg1AxgAgBghIAAAAIABgBIAEgFIAAAAIAngnIAlgIIg6A2g");
	this.shape_1.setTransform(1.7,1.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#CCCCCC").s().p("AAIBBIAAgaIBABCIAAAYgAiAiAID6BUIglAIIi5hAIBAC6IAAAAIgHAcgABoBJIAAAAIhBhCIAZABIBBBBgAAuABIABAAIgGAFg");
	this.shape_2.setTransform(-2.4,-2.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AAGAlIgsAvIhAi6IC6BAIgnAmIAAAAIAAAAIgFAEIgCABIAAAAIBBBCIggAgg");
	this.shape_3.setTransform(-2.3,-2.3);

	this.addChild(this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-16.2,-16.2,27.5,27.4);


(lib.t_madeira2 = function() {
	this.initialize();

	// Layer 3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#482F17").s().p("EgBFAkhQgJgDgFgIQgFgIgBgJMAAAhILQAAgKAGgIQAGgHAJgDQBEgWBFAWQAJADAGAHQAGAIAAAKMAAABILQgBAJgFAIQgFAIgJADQgjANgjAAQgiAAgjgNgAgEdkIAAAIQgHAIgDAKIgBAEQgTANgQARQgEADgFAAIAAFiQA7AWA8gWIAAitQggAIgagQIANgBIACAAIArAHIAAiEIgBAEQgeAhgjgQQAagFASgVQgDgOAKgIIAFgCQAHAEADAGIAAtbIgGAEIgEADIg+AAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBgBgBIADgCIAXgGIAEgBIAAgBIAnABIAGgBIAAroQhAANgxgmIABAAQA1ATA7gCIAAohQglAugxgVQAzgJAjgiIAA0ZQgSAQgXAHQgIgEgJgBQgCgJAJgKQAdgQAWgSIAAjuIgBADQgcAggdgQQgGgOALAMIAVgDQAKgKAOgGIAIgLIAAk0IgQAIIgDABQgUAEgPgIQAHgNALgNIAkgUIAAisQg8gTg7ATIAABoQAXAEAOAPIADADQgTAUgVgFIAAHyIADABQAqADAoAIIABABQg5ASgdgdIAAGAIADAAIAEAHIABADQAbAGATATQAUBpgOBtQgBAMgFAKQAEhhgNh0QgBgLgHgHQgXgBgOgMIAAOhQAdAXAgAJQgNADgQACQgTgGgNgLIAAUAIBIAbIADADQgwANgbgiIAAGvIADAAQAYASAfgBQAAAAABAAQAAAAAAAAQAAAAAAAAQAAABAAAAQgiAUgZgbIAAIJQAzgqgBhCIAFA5gEgA1AigIACAAQArARArAKIACABQgzgBgngbgAgva7QgBgFAGAAQAnBFgrBFQgBACgEAAQAPhCgLhFgAgQb6QgJgjADgjQADgWgIgGIAKAGIAFADQgCA9AEA9QgCgQgEgRgAgpJFQAggTApABIAJAAQggAPgrADIgHAAgAAbtBQgIgZgLgaQAAgBAAAAQAAgBAAAAQABAAABAAQAAAAABABQAQAZACAbgAAH9IQAAgBAAAAQABgBAAAAQABAAAAAAQABAAABABQgDAbgIAYQAAAAAAABQAAAAAAAAQAAAAAAAAQgBAAAAAAQABgaAHgZg");
	this.shape.setTransform(0,232.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#693A22","#8D5E46","#693A22"],[0,0.498,1],6,0,-5.9,0).s().p("EgA7AkFIAAliQAFAAAEgDQAQgRATgNIABgEQADgKAHgIIAAgIIgFg5QABBDgzApIAAoJQAZAbAigUQAAAAAAAAQAAgBAAAAQAAAAAAAAQgBAAAAAAQgfABgYgSIgDAAIAAmvQAbAiAwgNIgDgDIhIgbIAA0AQANALATAGQAQgCANgDQgggIgdgYIAAuhQAOAMAXABQAHAHABALQANB0gEBhQAFgKABgMQAOhtgUhpQgTgTgbgGIgBgDIgEgHIgDAAIAAmAQAdAdA5gSIgBgBQgogIgqgDIgDgBIAAnyQAVAFATgUIgDgDQgOgPgXgEIAAhoQA7gTA8ATIAACsIgkAUQgLANgHANQAPAIAUgEIADgBIAQgIIAAE0IgIALQgOAGgKAKIgVADQgLgMAGAOQAdAQAcggIABgDIAADuQgWASgdAQQgJAKACAJQAJABAIAEQAXgHASgQIAAUZQgjAigzAJQAxAVAlguIAAIhQg7ACg1gTIgBAAQAxAmBAgNIAALoIgGABIgngBIAAABIgEABIgXAGIgDACQABABAAABQAAAAABABQAAAAAAABQABAAAAAAIA+AAIAEgDIAGgEIAANbQgDgGgHgEIgFACQgKAIADAOQgSAVgaAFQAjAQAeghIABgEIAACEIgrgHIgCAAIgNABQAaARAggJIAACtQgfALgdAAQgcAAgfgLgEAAlAi8IgCgBQgrgKgrgRIgCAAQAnAbAzABgAgva7QALBFgPBCQAEAAABgCQArhFgnhFIgBAAQgFAAABAFgAgWa0QgDAjAJAjQAEARACAQQgEg9ACg9IgFgDIgKgGQAIAGgDAWgAgpJFIAHAAQArgDAggPIgJAAIgEAAQgmAAgfASgAAIt0QALAaAIAZIACAAQgCgbgQgZIgCgBQAAAAgBAAQAAABAAAAQAAAAAAAAQAAAAAAABgAAH9IQgHAZgBAaQAAAAABAAQAAAAAAAAQAAAAAAAAQAAgBAAAAQAIgYADgbIgCgBQgBAAAAAAQAAAAAAABQgBAAAAAAQAAAAAAABg");
	this.shape_1.setTransform(0,232.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-8.9,-2.9,18,470.2);


(lib.t_madeira1 = function() {
	this.initialize();

	// Layer 3
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#693A22","#8D5E46","#693A22"],[0,0.498,1],0.6,-6.9,0.6,7).s().p("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QgBgPgEgMIEkAAIAAABQgNA0AIAtIACgCQALguAFgyIC/AAQgHAbgBAcIACACIACAFIAAADIgCARIABgBIAEgVIAFgFIAAgBQAKgcAAgaIFuAAQgEA4AYAzIADABIAGAEIAAgCQgHg4gOg2IJ+AAQAgAnA8AUQA7ARAbAvIABACIAEAGIAAADQAAABAAAAQAAABAAAAQAAABAAABQABAAAAABgAiMA6IAAgCQgOgggsACQAnACARAbQgcAOgigFQAhAKAfgQgAkfAuIACgBQAJgDAEgDIgBAAIgBAAQgJAAgEAHgEghsABGQAGghgOggQgFgFgIgGQABgDgCgDQgJgSgFgWQgBARAHAQQAAAEgBADIAAACQACAEgBAEQAFAEACAHQgCAGABAFQAFAZACAZIkgAAQAZg5gPg2QgHADgGAGIgBADQgEAzAFAwIn0AAQAIgugFgmIAAABQgUAnANAsIrRAAIgIgcIgCgCIgEgDIgCABQgFACgCAFIAAADIADAWIgtAAQglhGAlhFIBwAAQgFAYAGATIACgBQAIgVABgVIBqAAQgGA0AAAzIAAACIACAFIAAADQgDAKADAGIABgCIACgTIABgBQALg1gJg2IA4AAQgGAfAIAeIABgBQAHgegFgeICtAAQgpAlAGA7QADAGAHgCQAGgMADgOQACgMAGgNQAMgbAEgWIB8AAQgxAtANBBQAKAVAUAFIABgDQABgFgCgGQgHgIgFgJIAAgEQgFgqASgqIgBgBQgBgEACgDIABgBIAEgIIBiAAQgSAYADAiQACAEAEACIAAAEQAAACACgBIABAAQASgjgHgiIFlAAQgKAbAEAeQACAGAHgCIAAAAQAHghgEgcIH3AAIgFAFIAAAIIAAACIAEgKIAEgFIBlAAQgGAEgDAGIAAAFQgDARgBASQARATAEAWIABACQAFALACALIAAACIAAAEQAAAKAFAIg");
	this.shape.setTransform(-0.5,7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#482F17").s().p("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");
	this.shape_1.setTransform(-0.5,7);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-380.9,-2.9,760.9,20);


(lib.caixabotao = function() {
	this.initialize();

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E3A77B").s().p("AosAVIgBgVQgCgiAagIICIgIIAOAmIiIAKIAABxgAIgA4IgOgvIgBgLQgDg9glgEIkJAAIhXAmQADgdgJgaIGMgZQAlgCgHAoIgFB/gAmCgzIH9ghQgBAeABAfIgMAFQgFgVgMgIInRAiQgGgUgJgSg");
	this.shape.setTransform(0.1,14.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#624017").s().p("AHbDRIlqgQQAAgRgJgSIgBABQgDAEgEAIQgBALACALIo3gZQgsAAgEgsIgEg/IAIABQDJARDJgIQhIgKhMABQiGADiBgUIgOj9IAhCVQENgQDQgBQDPgBDAgCQCPgCAXgyIgEBZQgsAPgzgBQAxAFAugOIgFB2QghgGgjAAQiNgBiLgNIgDAAIgJACQAXAFAaADQCbANCcAAIgDBAQAEA9guAAIgJAAg");
	this.shape_1.setTransform(0.1,69.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#714F1A").s().p("AoXCCIgGhkQA7ACA+gHQAggEALgNQhSAIhSAKIgMjXIAkBaIAAhyICIgLIAKAbIABACQAJAIAGAIIAAgDQgGgWgHgVIHQghQANAIAFAVIAMgFIAAAOQADAGAGgCIABgBQADgMABgLIBWgnIEJAAQAmAFACA9IABANIAOAuIAIAAIgGCZQgSgBgRABQiVAWiZgFIgCABQgEADgFABIgBAAQCuAFCugEIgFCRQAGAXgIASQgXAyiPACQjAACjOABQjRABkNAQg");
	this.shape_2.setTransform(-0.1,35.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#3F1D00").s().p("AoJGcQg2gCgBgyIgMrSQABg3ArgFIRYg8QAUABABAUIAANuQgDBAg8ACgAByGWIFqAQQA3AGgEhDIADhAQicAAicgOQgagCgWgGIAJgBIACgBQCMAOCMABQAkAAAhAGIAFh4QgvAOgwgFQAyAAAtgOIAEhZQAHgSgGgXIAGiPQivAEiugFIACAAQAEgBAEgDIACgBQCaAFCUgYQASgBASABIAGiZIAFiAQAHgoglACImMAZQAJAagDAdQgBALgDAMIAAABQgHACgCgGIgBgOQgBgfABgeIn9AhQAJASAGATQAIAVAFAWIABADQgGgIgJgIIgBgCIgKgbIgOgmIiIAJQgaAIACAiIABAWIANDZQBRgKBTgIQgLANghAEQg9AHg7gCIAGBiIAOEAQCBAUCGgDQBMgBBIAKQjJAHjJgRIgIgBIADBAQAFAsAsAAII2AZQgCgLACgMQADgHAEgEIABgBQAIASABARg");
	this.shape_3.setTransform(0,48.3);

	this.addChild(this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-58.8,0,117.8,96.7);


(lib.caixa = function() {
	this.initialize();

	// Layer
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#693A22","#8D5E46","#693A22"],[0,0.498,1],4.2,0,-4.1,0).s().p("AgpQQIAAgxQAnACAlgGIAGAFIAAAwQgVAFgUAAQgUAAgVgFgAAaPvIgBAAQgfgFgdgHIgCAAQAbAMAkAAgAgpPBQATgJAQgLIANARIgGABIAIADIABABIgOAAIglAFgAgpOEIAQARIgQAPgAAmOKIADgDIAAgBIAAAIIgDgEgAANNrQgHgOgIgKIgBgBIgBgHQAXABAWgBIAAAGQgIAHgHAKIgMALIgBgCgAgMNKIAEABIAAACIgEgDgAATMuIgZABQgDgZABgaIgEgBIgGgDQAFADgCAKQgCAQAGAQIAEAKIgLAAQAHgVgSgUQgBAAgBAAQAAAAgBAAQAAABAAAAQgBABAAAAQAFAUgCASIAAAAIgLABIAAiuQARALAYgIIAAgBQgWAAgRgIIgCABIAAjDQATAQAhgGIgCgCIgygMIAAo/QAKAFANACIATgCQgVgEgVgLIAAmiQAKAFAQABQAGADAAAFIADAQQAFArgCAlQADgFABgFQAHgjgGgjQgCgNgDgOQgNgIgTgDIAAgBIgEgDIgCAAIAAitQAVANAngIIgBgBQgcgDgdgCIgCAAIAAhJQAWACATgBIAAAIIAAAAIADgJIAggDIAGAEIAAATIgFAFIAAAAQgJACgHAFIgQABQgGgFADAGQASAGARgJIAFgEIAAgBIAABrIgFADQgNAGgQAGQgHAEABAFQAHAAAFACQAMgDALgEIAFgDIAAJMIgFADQgXAMgeAEQAcAJAZgPIAFgFIAAD0IgFAAQglABgjgIIAAAAQAgAQAogEIAFgBIAAFPIgEAAIgBAAIgaAAIgCABIgQADIgBABIABABIArAAIABAAIACgBIADgCIAAE4IgWgEgAgcEFIAFAAQAdgBAWgHIgGAAQgbAAgXAIgAAFmOQAIAMAGAMIABAAQgCgNgKgLIgCAAIgBAAgAgptXQATgIAQgMIAQAXIgOAAIglAFgAgpuUIAQASIgQAOgAAkuQIACgCIADgCIAAALIgFgHgAANurIADAAIgCABIgBgBgAgMvNIAGAAQAXACAYgBIAAAFIgGAHIgBAAIgRAHIgHAGQgKgQgMgKgAATvpQgXABgagBIgLAAIAAgnQApgJApAJIAAArIgWgEg");
	this.shape.setTransform(-144.1,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#693A22","#8D5E46","#693A22"],[0,0.498,1],0.2,-4.2,0.2,4.4).s().p("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gIIAAgBIgCgKQACgSgHgKIgHgJIAAgCIAAgUIABgBQACgDAAgDICVAAIgBAFQAAAUAFANQACAEAEAFIAAgCIABgDIAAgEQgCgLAAgLIgCgQIB9AAIgBAAQgDAUAAASQAAAKABAMIABgBIAEgVIADgmIBRAAQgDARAAARIAAABIACADIgBACIAAAKIAAAAIACgMIAAgBIACgDIAAgBQAEgRAAgQICcAAQgBATADATQACANAEAPIACAAIACADIAAgCIgDgdIgGgmIEQAAQAOAYAZAMIADACQAXAKAKAcIABABIACADIAAACIAAADgAg7AkIAAgBQgGgUgSABQAQABAHARQgMAJgOgDQAOAGANgKgAh5AcIAAAAQAEgCACgCIgBAAQgDAAgCAEgAuVArQADgUgGgUIgGgGIAAgBIAAgDIgGgZQgBALADAKIAAAEIAAABIABACIgBADIADAGIAAAIIADAeIh7AAQAIgYgBgXQAAgLgCgKIgGAGIAAACIgBANQAAAYABAXIjUAAQADgagCgVIgBgEIgBAEQgGAWAEAZIhDAAQAFgHACgKQAJggADgkIAKAAQgHAOABAWIABACIABACIAAACQAAAAAAAAQABAAAAAAQAAAAAAAAQAAAAAAAAIABAAIABgEQAGgTgDgTICYAAQgEAQACATIABADIACAAIABgBQADgUgCgRIDWAAIgCADIAAAFIAAABIABgGIACgDIArAAQgCACgCAEIAAACIgBAXIADAHQAEAHACALIAAABIADAOIAAABIAAACQAAAHACAEgA1bArIgBgCQgBgJgFgGIAAhAIAEgEIAJAAQABAWgCAUQgDAWAAAVgA4hArIgEgRIAAgBIgCgCIgBAAQgCACgBADIAAACIABANIgTAAQgQgrAQgqIAqAAQgHAcADAnIAAgBIACATgA3gAGIAAAiIgBABIABgjgAVyABIgBgBIAAAAIABgjIABABIAABIIgCACQABgTAAgUg");
	this.shape_1.setTransform(0,91.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#693A22","#8D5E46","#693A22"],[0,0.498,1],0.2,-4.2,0.2,4.4).s().p("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ANIAAgCIABgDQgCgNAAgNIgCgQIB9AAIgBAAQgFAhADAbIABgBQAFgdACgeIBRAAQgDARAAARIAAABIACADIgBACIAAAKIAAAAIACgNIACgDIAAgBQAEgRAAgQICcAAQgCAjAKAfIACAAIACADIAAgCQgDgigGghIEQAAQAOAYAZAMQAWAJAMAYIACAHIABABIACADIAAACIAAADgAg7AkIAAgBIgDgIQgHgMgOABQAMABAIAKIADAHQgMAJgOgDQAOAGANgKgAh5AbIAAABIAAAAIACgBIAEgDIgBAAQgDAAgCADgAuVArIABgQQgBgMgDgMIgGgGIAAgEIgGgZQgBALADAKIAAAEIAAABIAAAFIADAGIAAAIIACAOIABAQIh7AAIAEgQQAFgbgEgZIgGAGIAAACQgBAWABAWIAAAQIjUAAIABgQQABgTgCgQQgFARABASQAAAIABAIIhBAAIgCgGQAFgHACgKQAJgdADghIAKAAQgHAOABAWIACAEIAAACQAAAAAAAAQABAAAAAAQAAAAAAAAQAAAAAAAAIABAAQAHgVgDgVICYAAQgEAQACATQAAABAAABQABAAAAABQAAAAABAAQABAAAAAAIABgBQADgUgCgRIBwAAIBmAAIgCADIAAAFIAAABIABgGIACgDIArAAQgCACgCAEIAAACIgBAXQAHALACAOIAAABIADAMIAAACIAAABIAAACQAAAHACAEgA4hArIgEgRIAAgBIgCgCIgBAAQgCACgBADIAAACIABANIgTAAQgQgrAQgqIApAAQgFAaACAjIAAgBIACAZgA1cAjQgBgJgFgGIAAg+IANAAQAAATgBATIgEAtIgCgGgAVyAbIAAgaIgBgBIAAAAIABgjIABABIAABIIgCACIABgNgA3gAAIAAAiIgBABIABgjg");
	this.shape_2.setTransform(0,-89.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#693A22","#8D5E46","#693A22"],[0,0.498,1],4.2,0,-4.1,0).s().p("AgoQQIAAgxQAlACAjgGIAJAGIAAAvQgVAFgUAAQgTAAgVgFgAAZPvIgBAAQgegFgdgHIgCAAQAcAMAiAAgAgoPAQAQgJAPgKIANASIgDAAIAFACIACACIgOAAIgiAFgAgoOHIAMAOIgMAMgAAkOLIAFgEIAAgBIAAAMIgFgHgAALNrQgHgMgGgJIAAgCIgBgCIgBgHQAXABAWgBIAAADQgKAJgIALIgLALIgBgCgAgONKIAFABIABAAIgCAEIgEgFgAAQMuIgWABQgDgZABgaIgEgBIAAAAIgHgDQAGADgBAKQgDAOAFAPIABADIAEAKIgLAAQAGgVgRgUQgBAAgBAAQAAAAgBAAQAAABAAAAQgBABABAAQAEAUgCASIgCAAIgIAAIAAitQAMAIAQgCIAMgDIAAgBIgMAAQgOgCgNgGIgBABIAAjDQALAKARABQALABAMgCIgCgCIgVgFIgcgHIAAo/QAJAFAMACIAHAAIANgCIgNgDQgOgEgOgIIAAmiQAJAFAQABIADADQACACABADQAJA0gDAsQADgFABgFQAJgxgNgwIgJgEQgKgFgNgCIgBgBIgDgDIgBAAIAAitQALAHARABQAMAAATgDIgBgBIgegDIgbgCIgBAAIAAhCQAUABAUgBIAAACIAAAAIABgCIAfgEIAJAGIAAALIgFAFQgJACgHAFIgQABQgHgFAEAGQAUAHAUgOIAAgBIAABrQgPAIgUAHQgGAEABAFQAHAAAFACQAQgDAMgHIAAJMQgVAOggAFIgGAAIAGACQAeAGAXgTIAAD0QgcABgZgEIgYgEIgBAAQAMAGANADQAYAGAdgEIAAFPIgDAAIgcAAIgDABIgPADIgCABIACABIAqAAIAEgBIADgCIAAE5IgZgFgAgMEBQgIABgIADIAFAAIALAAQAWgCATgGIgHAAQgTAAgPAEgAAFmOQAIAMAGAMIABAAQgCgNgLgLIgBAAIgBAAgAgotSQAQgIAPgLIARAXIgOAAIgiAEgAgouLIAMAPIgMAMgAAhuKIADgCIAFgFIAAARIgIgKgAALumIgEgHQAFACAIAAIgIAHIgBgCgAgOvHIAFAAQAYACAagBIAAADIgBABIgGACIgSAHQgGAEgFAGQgGgOgNgKgAAQvjQgWABgagBIgIAAIAAgtQAogJApAJIAAAyIgZgFg");
	this.shape_3.setTransform(145.9,0);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#E49E49").s().p("AXiPgQgNgCgIgGIgDgCQgpAFgogFIgVgEQAKgCALgBIAMgBQASAGARgHIADAAQALABAJgBIAEABIgEgIIAAAAIAKADIADABIABABIAEADIABAAIABAAIAAABIAAABQAEACAHACIABACIAAACIADACIACADIABADIgDAAgA1xPfQgMgCgJgHIAAAAQgqAFgqgFIgTgEIATgDIAPgBQASAGARgHIADAAQALABAJgBIAEABIgEgIIAAAAIAKADIABAAIACABIAFAEIABAAIABAAIAAABIAAABQAEACAHACIABACIAAACQAEACABADIABADIgGgBgAVAPbQgBgHABgHIABgEIABgCIACAGIgBAIIADgIIADgSQABgMgBgMIAAgDQACgfAIgeIAGgSIACgFIAAAAIACgHIABgBIABgBIAAABIAAAAIAAABIABAAIABABIABAAIABABIAAABIgBACIAAAAIAAADIgBABIgBADIAAABIgEANIgBAEQgMArgFAtIgBASIgBAJIgBACQgCACgDABIgCAAgA4QPbQgBgHABgHIABgEIABgCIACAGIgBAIIADgIIADgSQABgMgBgMIAAgDQACgfAIgeIAGgSIACgFIAAAAIACgHIABgBIABgBIAAABIAAAAIAAABIABAAIABABIABAAIABABIAAABIgBACIAAAAIAAADIgBAAIAAABIgBADIAAABIgEANIgBAEQgMArgFAtIgBASIgBAJIgBACQgCACgDABIgCAAgAXNPAQgTgQgJgVQAAAAAAgBQAAAAAAAAQABAAAAgBQABAAABAAQAOAKALAMQAKAKAHAMIAAABIgEgCIgEACIgBABIgIgHgA2GO+QgQgQgJgTQAAAAAAgBQAAAAAAAAQABAAAAgBQABAAABAAQAMAJAKAKQAMAMAIANIAAABIgEgCIgEACIgBABIgLgJgAXrPHQABgGAHgEIgCgCIgBgBIgBgDIAAgCIADgFQAEgFAIgDQAFgKAAgLIAAgBQABgFACgDIAAgBIAAAAIAFgIQAEADAAAEIAAABQgBAVgHASIAAACIADgDIABgBQAAgBAAAAQAAgBABgBQAAAAAAAAQAAgBABAAIACgBQADABgBAEIAAABIgGAMQgLAMgQAAIgFAAgA1lPHQABgGAHgEIgCgCIgBgBIgBgDIAAgCQACgFAEgDQADgCAEgCIACgBQAFgKAAgLIAAgBQABgFACgDIAAgBIAAAAIAFgIQAEADAAAEIAAABQgBAVgHASIAAACIADgDIABgBQAAgBAAAAQAAgBABgBQAAAAAAAAQAAgBABAAIACgBQADABgBAEIAAABIgGAMQgLAMgQAAIgFAAgAW9PDIAAgBIgBgCIgCgBQgSgQgOgSIgBgBIgBgDIAAgCIAFADIABAAQATANANATIABABIAAACIAAACIABADIAAABIAAABIgBAAQgBAAAAAAQgBAAAAAAQAAAAAAgBQAAAAAAAAgA2TPDIAAgBIgBgCIgCgBQgSgQgOgSIgBgBIgBgDIAAgCIAFADIABAAQATANANATIABABIAAACIAAACIABADIAAABIAAABIgBAAQgBAAAAAAQgBAAAAAAQAAAAAAgBQAAAAAAAAgAV5OzIADgDIACABQAAAAAAAAQABAAAAAAQAAAAABAAQAAAAAAAAQANgFABgGIAHgDQACACgCADIAAABQgMAOgQAHQgIADgJABQAHgJAKgGgA3aO1IAGgFIACABQAAAAAAAAQABAAAAAAQAAAAABAAQAAAAAAAAQANgFABgGIAHgDQACACgCADIAAABQgNAPgSAGQgHADgHABQAGgIAIgFgAV5N+IgHgKIgPgaIAAgDIADAEIADAFIAAgIIABgBIAAAAIACgBIADgBIACAAIAIAFQAGAEAFAGIABABIgDABQAAAAgBAAQAAABAAAAQgBAAAAABQAAAAAAABIACAEIAHAPQgJgDgHgIIgFgHIgGgIIgCgBIANAQQAKAOAHAPIAAABQgJgGgIgLgA3aN7IgEgHIgPgaIAAgDIADAEIADAFIAAgIIABgBIAAAAIACgBIADgBIACAAIAFADQAIAFAFAFIACADIgDABQAAAAgBAAQAAABAAAAQgBAAAAABQAAAAAAABIABADIAIAQQgKgDgHgJQAKAOAIAQIAAABQgLgHgJgNgA3bNsIgBgCIgGgIIgCgBIAJALgAXEN9IAAgCIADgDIAGgIIAWgfIAHgKIACgBQAEABAAAEIAAABIgCAFIgDAGIgIAMIgBACIgDADQgIAJgKAIIgCACIgGAEIgBgCgA2MN9IAAgCIACgCIAEgGIAZgiIAHgKIACgBQAEABAAAEIAAABIgCAFIgDAGIgIAMIgEAFQgJAKgMAJIAAABIgFADIgBgCgAWKNnIgDgBIgCgDQgGgHgEgHQAAAAgBgBQAAAAAAgBQAAAAAAgBQABAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQABAAAAAAIABgBIADAAIABAAQAIAEAHAGIAGAHIAEAHIABACIAAACIgBABIgDADIgBABIgEAAIgKgIgA3HNnIgCgBIgDgEIgJgNQAAAAgBgBQAAAAAAgBQAAAAAAgBQABAAAAgBQAAAAABgBQAAAAAAAAQABgBAAAAQABAAAAAAIABgBIADAAIABAAQAHADAGAFIAHAHQADAEACAFIABACIAAACIgBABIgDADIgBABIgEAAIgLgIgAVCNRQABgJAFgKIABgBIAAAAIADACQAEAHgCALIgBABIgEADIgCAHIgDADQgCgHAAgHgA4ONRQABgJAFgKIABgBIAAAAIADACQAEAHgCALIgBABIgEADIgCAHIgDADQgCgHAAgHgA21NEIgCgBIgVgGIgDgBIAAgCIADgBIABgBIACABIASADIABAAIAEAAQALAEAOAAIATACIAVACIACAAIACABIgEAAIgVADIgIAAQgUAAgTgEgAWdNEIgCAAIgVgGIgFgCIAAgCIADgBIABgBIAFABIASADIAAAAIACAAQALAEAOAAIAWADIAUABIABAAIABABIgBAAIgVACIgMABQgSAAgSgEgAXisyQgNgCgIgFIgDgDQgSADgSAAIgDAAQgVAAgVgDIgVgDQAKgDALgBIAMgBQARAGAQgFIACgBIACAAIABAAQALABAJgBIAEAAIgEgHIAAgBIAKAEIADAAIABACIAEADIABAAIABgBIAAABIAAABQAEADAHABIABADIAAACIADACIACADIABADIgDgBgAVAs3QgBgGABgHIABgFIABgCIACAHIgBAIIADgIIADgTQABgLgBgMIAAgDQACgfAIgeIAGgTIACgEIAAgBIACgHIABgBIABAAIAAAAIAAABIAAAAIABABIABAAIABABIABABIAAAAIgBACIAAABIAAACIgBABIgBADIAAABIgEANIgBAFQgMArgFAsIgBATIgBAIIgBACQgCADgDAAIgCAAgA1xs4QgMgDgJgGIAAgBQgSADgSAAIgEAAQgWAAgWgDIgTgDIATgDIAPgCQASAGARgGIADAAQALABAJgBIAEAAIgEgHIAAgBIAKAEIABAAIACAAIAFAFIABAAIABgBIAAABIAAABQAEADAHABIABADIAAACQAEACABADIABADIgGgBgA4Qs9QgBgDABgEIABgLIABgCQACAFAAAIIAEgTQACgOgBgPIAAgDQACgcAHgbQACgKADgJIAEgKIAAgBIACgHIABgBIABAAIAAAAIAAABIAAAAIABABIABAAIABABIABABIAAAAIgBACIAAABIAAACIgBABIAAAAIgBAEIgCAFIgCAIIgDALQgLArgEAsIgCATIAAACIgBACQgCADgDAAIgCAAgAXNtRQgTgRgJgUQAAgBAAAAQAAAAAAgBQABAAAAAAQABAAABAAQAOAJALAMQAKALAHAMIAAABIgEgCIgEACIgBABIgIgHgAXrtLQABgGAHgDIgCgCIgBgBIgBgDIAAgDIADgEQAEgFAIgDQAFgKAAgLIAAgBQABgFACgEIAAAAIAAgBIAFgHQAEACAAAFIAAABQgBAUgHATIAAACIADgEIABgBQAAAAAAgBQAAgBABAAQAAgBAAAAQAAAAABgBIACAAQADABgBADIAAACIgGALQgLAMgQAAIgFAAgAW9tPIgBgCQgTgQgPgTIgBgBIgBgEIAAgBIAFADIABgBQATAOANASIABABIAAADIAAACIABADIAAACIgBAAQgBAAAAAAQAAAAgBgBQAAAAAAAAQAAgBAAAAgAV5tfIADgCIACAAQAAABAAAAQABAAAAAAQAAAAABAAQAAAAAAgBQANgEABgGIAHgEQACADgCADIAAABQgMAOgQAGQgIADgJABQAHgIAKgHgA2GtZQgQgQgJgTQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAABAAQAMAIAKAKQAMAMAIAOIAAABIgEgCIgEACIgBABIgLgJgA1ltRQABgDACgDIAFgDIgCgCIgBgBIgBgDIAAgDQABgDADgDQADgDAFgCIADgBQAFgKAAgLIAAgBQABgFACgEIAAAAIAAgBIAFgHQAEACAAAFIAAABQgBAUgHATIAAACIADgEIABgBQAAAAAAgBQAAAAABgBQAAAAAAgBQAAAAABgBIACAAQADABgBADIAAACQgFALgIAGQgIAHgMAAIgFgBgA2TtVIgBgCQgTgQgPgTIgBgBIgBgEIAAgBIAFADIABgBQATAOANASIABABIAAADIAAACIABADIAAACIgBAAQgBAAAAAAQAAAAgBgBQAAAAAAAAQAAgBAAAAgA3atjIAGgEIACAAQAAAAAAABQABAAAAAAQAAAAABAAQAAgBAAAAQANgEABgGIAHgEQACADgCADIAAABQgNAPgSAGQgHACgHABQAGgHAIgGgAV5uTIgHgLIgPgaIAAgCIADADIADAFIAAgIIABAAIAAgBIACAAIADgBIACAAIAIAEQAHAFAFAGIgDABQAAABgBAAQAAAAAAABQgBAAAAAAQAAABAAAAIAJATQgJgCgHgIIgFgHIgGgJIgCgBIANARQAKAOAHAPIAAABQgJgHgIgKgA3audIgEgHIgPgaIAAgCIADADIADAFIAAgIIABAAIAAgBIACAAIADgBIACAAIAFADQAJAFAGAHIgDABQAAABgBAAQAAAAAAAAQgBABAAAAQAAABAAAAIAJATQgKgCgGgJQAJAOAIAQIAAABQgLgIgJgNgA3auqIgCgDIgGgJIgCgBIAKANgAXEuVIAAgCIAJgLIAWgfIAHgJIACgCQAEACAAADIAAABIgCAFIgDAHIgIAMIgBABIgDADQgIAKgKAIIgIAFIgBgCgA2MubIAAgCIAGgHIAVgdIALgPIACgCQAEACAAADIAAABIgFALIAAABQgFAJgHAHQgJALgMAJIgFADIgBgCgAWHusQgHgIgFgIQAAgBgBAAQAAgBAAAAQAAgBAAAAQABgBAAAAQAAgBABAAQAAgBAAAAQABAAAAAAQABgBAAAAIABAAIADgBIABABQASAHAHARIABABIAAACIgBABIgDAEIgBAAIgEABQgGgGgHgEgA3JuyQgHgIgFgIQAAgBgBAAQAAgBAAAAQAAgBAAAAQABgBAAAAQAAgBABAAQAAgBAAAAQABAAAAAAQABgBAAAAIABAAIADgBIABABQASAHAHARIABABIAAACIgBABIgDAEIgBAAIgEABQgGgGgHgEgAVCvBQABgJAFgJIABgBIAAgBIADADQAEAGgCALIgBACIgEADIgCAHIgDACQgCgHAAgHgA4OvBQgBgMAHgMIABgBIAAgBIADADQAEAHgDAMIgEADIAAABIgCAGIgDACIgCgIgAWJvTIgIgDIAAgCIADgBIABAAIAOACIALACQALAEAOgBIAWADIAUACIABAAIABAAIgBABIgVACIgNAAQgcAAgbgJgA3AvXIgPgFIAAgCIADgBIAAAAIABAAIAZAEQALAEAOgBIATADIAVACIACAAIACAAIgEABIgVACIgJAAQgZAAgYgHg");
	this.shape_4.setTransform(1.5,0.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#C9881D").s().p("AXsPpIgHAAQgMgCgJgFIgJgGQglAGgmgCIgVgCIgHgBIgCgBIgBgDIAAgEIAJgGQAHgEAJgBIAGgBIAigFIAQAAIgCgCIgBgCIgPgSQgPAKgRAJIgPAGQgFACgGgBIgBAEIgDADIgDAFIgBACIAAABQgFADgGgBIgEgBIAAAAIABgJIABgSQAFgtAMgrIABgEIAEgNIAAgBIABgDIABgBIAAgDIAAAAIABgCIAAgBIgBgBIAFADIABACIAAABIAEADIACAAIACgBIAJAIIgJgJIAAgBIAAgBQgDgJgJgHIgFgDIgBABIAAAFIgCgBIACACIADAHIgBgBIgBgBIAAAAIAAgBIgBABIgBABIgCAHIAAAAIgCAFIgGASQgIAegCAfIAAADQABAMgBAMIgDASIgDAIIABgIIgCgGIgBACIgBAEQgBAHABAHIACAAIgGABIgBAAIgKgFIgBAAIgCgKIgCgSIgCgTIAAABQgDgqAHgcIAGgSQAEgKAGgIQADgCADAAIACAAIADAAIgBABQgFAKgBAJQAAAHACAHIADgDIgBAHQgGAYgHAYQgGAVACATQABAJAEAJIABAEIABgBIABgDIADgSIACgPIACAAIAAgBQAIgeAAgaIACgQIACgNIgBgBIAAgCIABgBIAAgBIAAgBIgBAAIAAABIgCABIABgBQACgLgEgHIAAAAIADAAIgBgCQAJgIANgEQAJgDAMgBIAIAAIADAAIALABIALAAIABAAIAZgBIAZAFIAVAGIATAGQAFABAEADIABABQAbgCAHAQQACAGgBAJQgBAVgEAVIgHAgQgCAJgFAIQAJAPgXgCIgKAFIgKADIAEAPQAAAIgHAAIgBAAgAXQPaQAIAGANACIADAAIgBgDIgCgDIgDgCIAAgCIgBgCQgHgCgEgCIAAgBIAAgBIgBAAIgBAAIgEgDIgBgBIgDgBIgKgDIAAAAIAEAIIgEgBQgJABgLgBIgDAAIAFgCIAAAAIgFgDIAEgCIgCgBIgEgBIgJABQgLgBgNACIgDAAIgBABIgBABIgBABIAAABIAAABIAGADIgMABQgLABgKACIAVAEQAoAFApgFIADACgAW0OdQAJAVATAQIAIAHIgBABIAAABQAFAHAJADIAFABQABAAAAAAQAAAAABAAQAAAAAAgBQABAAAAAAIACgCIAAgBIgCgDQgFgEgHgDIAAgBQgHgMgKgKQgLgMgOgKQgBAAgBAAQgBAAAAABQAAAAAAAAQAAABAAAAgAYGOUIAAABQAAALgFAKQgIADgEAFIgDAFIAAACIABADIABABIACACQgHAEgBAGQAUACAMgOIAGgMIAAgBQABgEgDgBIgCABQgBAAAAABQAAAAgBAAQAAABAAABQAAAAAAABIgBABIgDADIAAgCQAHgSABgVIAAgBQAAgEgEgDIgFAIIAAgBQAEgOABgPIgBgBIgCgHIgBgBIgBABIgBAAQAAAAgBABQAAAAAAABQAAAAAAABQAAAAAAABIgBACQgGAXgDAWIAAABQABADgBAEIABgBIACgEQAFgGABgHIADgCQgCADgBAFgAWOOFQABANAMAHIAAACIABADIABABQAOASASAQIACABIABACIAAABQAAAAAAABQAAAAAAAAQABAAAAAAQABAAABAAIAAgBIAAgBIgBgDIAAgCIAAgCIgBgBQgNgTgTgNIADgCIABgDQAHADAIgCIAAgBIgCgEIgDgFIgJgLQgHgKgIgIIAEAAIABgBIAAAFIADAEIARAUIAFAFIAIAKQAGAEAGgEIABAAIABgEIAAgBIgHgIIgHgHQgNgPgQgNIAAAAIAAgCIgBgCIgEgHIgGgHQgHgGgIgEIAAAAIABgBIAAgCQAAgBgBAAQAAgBAAAAQgBAAAAAAQgBgBAAAAIgBgBIgCgDIgFgHQgGgGgKgEIgCABQgBAAgBAAQAAABgBAAQAAABAAAAQAAAAAAABIABABIAUARIAFAGQAAAAgBAAQAAAAgBABQAAAAgBAAQAAABAAAAQgBABAAAAQAAABAAAAQAAABAAAAQAAABABAAQAEAHAGAHIACADIgCgBIgBgBQgFgGgGgEIgIgFIgCAAIgDABIgEgHIABAIIABAAIgBABIAAAIIgDgFIgDgEIAAADIAPAaIAHAKQAIALAJAGIAAgBQgHgPgKgOIgNgQIACABIAGAIIAFAHQAHAIAJADIAEAGIAAABIAAAAIgCAAIAAAAgAVZORQgNAVAEAXIABAFIAAACQACACADgBIABgCIACgGIACgHIADgCIAAgBQADgMgCgKIAAgMIgCgBIgCAAIgCABgAV/OvIAAABIAAACIgDADQgKAGgHAJQAJgBAIgDQAQgHAMgOIAAgBQACgDgCgCIgHADQAAAAAAgBQAAgBAAAAQAAgBAAAAQAAgBAAAAIgBAAIgEABIADgGIAAgBQgCgDgDAAQgGABgFAEIgBACIgCAEIgCADIABACIABACIABAAIAEAAIgCACgAXpO9IABAEIABgEQAAgWADgWQACgWgBgWIgBgMIADgGIACgFIAAgBQAAgEgEgBIgCABIgHAKIgWAfIgGAIIgDADIAAACIABACIAGgEIACgCQAKgIAIgJQgIAPgQAOIgCACIACADIAGAHQAHAJAGALIgHgFIgBAAQgEASAUAHIACAAIABAAIABACgAVlOQIgCArIACgBIACgDIAVgVIAMgMIgMgOIgNgPIgIgLIgBgCIgBAkgAX+NMIgCAHQgDAJgCAJQgEAUABAVQACADAFgBIACgCQAGgUADgVIAAgSIAAgBQgBgFgFgCIgCABgAYNNRIAAACIAAABIACARIAAASQAEADAEACIABgBIAFgEIABgEIAAgOQgBgJgDgJIgCgEIgCgBIgDgBQgEAAgCAEgAW7NoIAAACIABABIgCACQAAABAAAAQAAABAAAAQAAAAAAABQAAAAABAAIAEAAIACgBIAGgCIACgCIAHgHQAJgMAFgNIgBgBIgFgBIgBABIgDACIgEAAQgXABgYgBIgFAAIgBAAIgFgBIAFAFIAHAHQAJAJAGAMIABACIAMgLIgDAFgAU8NTQgDAEgBAGQgBAFABADQAAAFAEACIABgBIABgGIAEgSIAAgCIgCgEQgDACgBAEgAWHM7IgDABIAAACIAFACIAVAGIACAAQAXAFAZgCIAVgCIABAAIgBgBIgBAAIgUgBIgWgDIABgBQABAAAAAAQAAAAABgBQAAAAAAAAQAAgBABAAIASACIAVADIAFABIABgBIABgDIAAAAIgBgBIgGgDIgVgGQgYgGgaAAIAAAAIgDAAIgJACIgBAAIgLABIgJADIABABIAHABIAIABIAMABIAGADIAAAAIACAAIgCAAIAAAAIgSgDIgFgBIgBABgA1kPpIgKgBQgLgCgKgFIgGgFQgnAGgngCIgVgCIgEgBIgCgBIgBgDIAAgEIAHgFQAIgFAKgBIADgBIAlgFIAQAAIgBgBIgDgEIgOgRQgQALgTAJIgMAFQgFACgGgBIgBAEIgDADIgDAFIgBACIAAABQgFADgGgBIgEgBIAAAAIABgJIABgSQAFgtAMgrIABgEIAEgNIAAgBIABgDIAAgBIABAAIAAgDIAAAAIABgCIAAgBIgBgBIAFADIABACIAAABIAEADIACAAIACgBIAGAGIADACIgDgDIgGgGIAAgBIAAgBQgEgLgLgGIgCgCIgBABIAAAFIgCgBIACACIADAHIgBgBIgBgBIAAAAIAAgBIgBABIgBABIgCAHIAAAAIgCAFIgGASQgIAegCAfIAAADQABAMgBAMIgDASIgDAIIABgIIgCgGIgBACIgBAEQgBAHABAHIACAAIgGABIgBAAIgKgFIgBAAIgCgKIgCgSIgCgTIAAABQgDgqAHgcIAGgSQAEgKAGgIQADgCADAAIACAAIADAAIgBABQgFAKgBAJQAAAHACAHIADgDIgBAHQgGAYgHAYQgGAVACATQABAJAEAJIABAEIABgBIABgDIADgSIACgPIACAAIAAgBQAIgeAAgaIACgQIACgNIgBgBIAAgCIABgBIAAgBIAAgBIgBAAIAAABIgCABIABgBQACgLgEgHIAAAAIADAAIgBgCQAIgIALgDQAKgEALAAIALgBIAAAAIAMABIALAAIAAAAIAcgBIAWAEIAVAGIAWAHQAFABAEADIABABQAbgCAHAQQACAGgBAJIAAADQgDAkgJAjQgCAJgFAIQAJAPgXgCIgLAFIgJADIAEAPQAAAIgHAAIgBAAgA2DPYQAJAHAMACIAGABIgBgDQgBgDgEgCIAAgCIgBgCQgHgCgEgCIAAgBIAAgBIgBAAIgBAAIgFgEIgCgBIgBAAIgKgDIAAAAIAEAIIgEgBQgJABgLgBIgDAAIAFgCIAAAAIgFgDIAEgCIgCgBIgEgBIgJABQgLgBgNACIgDAAIgBABIgBABIgBABIAAABIAAABIAGADIgPABIgTADIATAEQAqAFAqgFgA2cOdQAJATAQAQIALAJIgBABIAAABQAEAGAHADIAIACQABAAAAAAQAAAAABAAQAAAAAAgBQABAAAAAAIACgCIAAgBIgCgDQgFgEgHgDIAAgBQgIgNgMgMQgKgKgMgJQgBAAgBAAQgBAAAAABQAAAAAAAAQAAABAAAAgA1KOUIAAABQAAALgFAKIgCABQgEACgDACQgEADgCAFIAAACIABADIABABIACACQgHAEgBAGQAUACAMgOIAGgMIAAgBQABgEgDgBIgCABQgBAAAAABQAAAAgBAAQAAABAAABQAAAAAAABIgBABIgDADIAAgCQAHgSABgVIAAgBQAAgEgEgDIgFAIIAAgBQAEgOABgPIgBgBIgCgHIgBgBIgBABIgBAAQAAAAgBABQAAAAAAABQAAAAAAABQAAAAAAABIgBACQgFAUgDAVIgBAEIAAABIABACIAAADIgBACIABAAIAAgBIACgEQAFgGABgHIADgCQgCADgBAFgA3COFQABANAMAHIAAACIABADIABABQAOASASAQIACABIABACIAAABQAAAAAAABQAAAAAAAAQABAAAAAAQABAAABAAIAAgBIAAgBIgBgDIAAgCIAAgCIgBgBQgNgTgTgNIADgCIABgDQAHADAIgCIAAgBIgCgEIgEgGIgIgKQgHgKgIgIIAEAAIABgBIAAAFIADAEIARATIAFAGIAIAKQAGAEAGgEIABAAIABgEIAAgBIgIgJIgHgHQgNgPgPgMIAAAAIAAgCIgBgCQgCgFgDgEIgHgHQgGgFgHgDIAAAAIABgBIAAgCQAAgBgBAAQAAgBAAAAQgBAAAAAAQgBgBAAAAIgBgBIgCgEIgBgBIgHgHQgFgFgIgDIgCABQgBAAgBAAQAAABgBAAQAAABAAAAQAAAAAAABIABABIARAPIAIAIQAAAAgBAAQAAAAgBABQAAAAgBAAQAAABAAAAQgBABAAAAQAAABAAAAQAAABAAAAQAAABABAAIAJANIADAEIgCgBIgCgDQgFgFgIgFIgFgDIgCAAIgDABIgEgHIABAIIABAAIgBABIAAAIIgDgFIgDgEIAAADIAPAaIAEAHQAJANALAHIAAgBQgIgQgKgOQAHAJAKADIAEAGIAAABIAAAAIgCAAIAAAAgA33ORQgNAVAEAXIABAFIAAACQACACADgBIABgCIACgGIACgHIADgCIAAgBQADgMgCgKIAAgMIgCgBIgCAAIgCABgA3ROvIAAABIAAACIgGAFQgIAFgGAIQAHgBAHgDQASgGANgPIAAgBQACgDgCgCIgHADQAAAAAAgBQAAgBAAAAQAAgBAAAAQAAgBAAAAIgBAAIgEABIADgGIAAgBQgCgDgDAAQgGABgFAEIgBACIgEAHIABACIACACIAEAAIgCACgA1nO9IABAEIABgEQAAgWADgWQACgWgBgWIgBgMIADgGIACgFIAAgBQAAgEgEgBIgCABIgHAKIgZAiIgEAGIgCACIAAACIABACIAFgDIAAgBQAMgJAJgKQgIAPgQAOIgCACIACACIADAEQAJAMAHAMIgHgFIgBAAQgEARARAHIAFABIABAAIABACgA3sOYIgBAjIABgBIAVgVIAPgPIgPgRIgKgMIgJgNIgCAsgA1SNMIgCAHQgDAJgCAJQgEAUABAVIACACQACABADgBIACgCIABgFQAFgRACgRIABgUIAAgBQgBgFgFgCIgCABgA1DNRIAAACIAAABIACARIAAASQAEADAEACIABgBIAFgEIABgEIAAgOQgBgJgDgJIgCgEIgCgBIgDgBQgEAAgCAEgA2VNoIAAACIABABIgCACQAAABAAAAQAAABAAAAQAAAAAAABQAAAAABAAIAEAAIACgBIAGgCIACgCIAEgEQAMgOAFgOIgBgBIgFgBIgBABIgDACIgHAAQgXABgYgBIgDAAIgBAAIgEgBIADADIAHAGQAKAKAHAOIABACIAMgLIgDAFgA4UNTQgDAEgBAGQgCALAGAEIABgBIABgGIAEgSIAAgCIgCgEQgDACgBAEgA3JM7IgDABIAAACIADABIAVAGIACABQAXAFAYgBIAVgDIAEAAIgCgBIgCAAIgVgCIgTgCIABgBQABAAAAAAQAAAAABgBQAAAAAAAAQAAgBABAAIAPACIAVADIAIABIABgBIABgDIAAAAIgBgBIgJgDQgKgEgLgCQgYgGgZAAIgBAAIgJACIgEAAIgLACIgGACIABABIAFABIAIABIAOABIADACIAFABIgEAAIgBAAIgSgDIgCgBIgBABgA3hNjIACABIAGAIIABACIgJgLgAXssoIgHgBQgMgBgJgFIgJgGIggAEIgCAAQgVABgUgBIgVgCIgHgBIgCgBIgBgEIAAgEIAJgFQAHgEAJgCIAGgBIAigEIAQAAIgSgXQgPALgRAIIgPAHQgFACgGgCIgBAFIgDADIgDAEIgBACIAAABQgFADgGAAIgEgCIAAAAIABgIIABgTQAFgsAMgrIABgFIAEgNIAAgBIABgDIABgBIAAgCIAAgBIABgCIAAAAIgBgBIAFACIABACIAAABIAEADIACAAIACAAIAJAIIgJgKIAAAAIAAgBQgDgKgJgGIgFgDIgBAAIAAAGIgCgBIACABIADAHIgBAAIgBgBIAAgBIAAAAIgBAAIgBABIgCAHIAAABIgCAEIgGATQgIAegCAfIAAADQABAMgBALIgDATIgDAIIABgIIgCgHIgBACIgBAFQgBAHABAGIACAAIgGACIgBAAIgKgFIgBgBIgCgJIgCgTIgCgTIAAABQgDgpAHgcIAGgTQAEgKAGgHQADgCADgBIACAAIADABIgBABQgFAJgBAJQAAAHACAHIADgCIgBAHQgGAYgHAXQgGAVACATQABAKAEAJIABAEIABgBIABgDIADgTIACgOIACgBIAAgBQAIgdAAgaIACgQIACgNIgBgBIAAgDIABgBIAAgBIAAgBIgBABIAAAAIgCACIABgCQACgLgEgGIAAAAIADgBIgBgCQAJgIANgEQAJgDAMAAIAIAAQAaABAZgBIAZAFIAVAFIATAHQAFAAAEADIABACQAbgDAHAQQACAHgBAJQgBAVgEAUIgHAgQgCAKgFAHQAJAPgXgBIgKAFIgKADIAEAPQAAAIgHAAIgBAAgAXQs3QAIAFANACIADABIgBgDIgCgDIgDgCIAAgCIgBgDQgHgBgEgDIAAgBIAAgBIgBABIgBAAIgEgDIgBgCIgDAAIgKgEIAAABIAEAHIgEAAQgJABgLgBIgBAAIgCAAIACgBIADgBIAAgBIgCgBIgCgBIgBAAIAEgDIgCgBIgEgBIgJACQgLgCgNACIgDABIgBABIgBABIgBABIAAABIAAABIAGACIgMABQgLABgKADIAVADQAVADAVAAIADAAQASAAASgDIADADgAW0t0QAJAUATARIAIAHIgBABIAAABQAFAHAJADIAFABQABAAAAAAQAAAAABgBQAAAAAAAAQABAAAAgBIACgCIAAgBIgCgCQgFgFgHgCIAAgBQgHgMgKgLQgLgMgOgJQgBAAgBAAQgBAAAAAAQAAAAAAABQAAAAAAABgAYGt9IAAABQAAALgFAKQgIADgEAFIgDAEIAAADIABADIABABIACACQgHADgBAGQAUACAMgOIAGgLIAAgCQABgDgDgBIgCAAQgBABAAAAQAAAAgBABQAAAAAAABQAAABAAAAIgBABIgDAEIAAgCQAHgTABgUIAAgBQAAgFgEgCIgFAHIAAAAQAEgPABgPIgBgBIgCgGIgBgBIgBAAIgBABQAAAAgBAAQAAABAAAAQAAABAAAAQAAABAAABIgBACQgGAWgDAXIAAABQABADgBADIABAAIACgEQAFgGABgIIADgCQgCAEgBAFgAWOuMQABAMAMAIIAAABIABAEIABABQAPATATAQIABACQAAAAAAABQAAAAAAAAQABABAAAAQABAAABAAIAAgCIgBgDIAAgCIAAgDIgBgBQgNgSgTgOIADgBIABgEQAHAEAIgDIAAgBQgFgLgJgJQgHgJgIgIIAEgBIABAAIAAAEIADAEIAeAkQAGAEAGgEIABgBIABgDIAAgBQgTgYgYgTIAAgBIAAgCIgBgBQgHgRgSgHIAAgBIABgBIAAgCQAAAAgBgBQAAAAAAAAQgBgBAAAAQgBAAAAAAIgBgBIgEgHQgHgIgMgFIgCAAQgBABgBAAQAAAAgBABQAAAAAAAAQAAABAAAAIABACIAUARIAFAFQAAAAgBABQAAAAgBAAQAAAAgBABQAAAAAAABQgBAAAAABQAAAAAAABQAAAAAAABQAAAAABABQAFAIAHAIIgCgBQgFgGgHgFIgIgEIgCAAIgDABIgEgIIABAIIABABIgBAAIAAAIIgDgFIgDgDIAAACIAPAaIAHALQAIAKAJAHIAAgBQgHgPgKgOIgNgRIACABIAGAJIAFAHQAHAIAJACIAEAHIAAAAIAAAAIgCAAIAAABgAVZuBQgNAWAEAWIABAGIAAABQACACADgBIABgCIACgGIACgHIADgBIAAgCQADgMgCgJIAAgMIgCgBIgCgBIgCABgAV/tjIAAABIAAADIgDACQgKAHgHAIQAJgBAIgDQAQgGAMgOIAAgBQACgDgCgDIgHAEQAAgBAAAAQAAgBAAgBQAAAAAAgBQAAAAAAgBIgBAAIgEACIADgHIAAgBQgCgCgDgBQgGACgFADIgBACIgCAEIgCAEIABACIABABIABABIAEgBIgCACgAXptVIABAEIABgEQAAgVADgWQACgWgBgWIgBgMIADgHIACgFIAAgBQAAgDgEgCIgCACIgHAJIgWAfIgJALIAAACIABACIAIgFQAKgIAIgKQgGANgMALIgGAFIgCACIAIAKQAHAKAGAKIgHgFIgBABQgEARAUAHIACABIABgBIABACgAVluCIgCArIACgBIACgCIAVgVIAMgMIgMgPIgNgOQgFgGgDgGIgBgBIgBAjgAX+vGIgCAHQgDAJgCAKQgEATABAVQACAEAFgCIACgCQAGgUADgUIAAgSIAAgBQgBgGgFgCIgCABgAYNvBIAAACIAAABIACASIAAARQAEAEAEABIABAAIAFgFIABgDIAAgOQgBgKgDgJIgCgEIgCgBIgDgBQgEABgCADgAW7uqIAAAAIAAACIABACIgCACQAAAAAAABQAAAAAAAAQAAABAAAAQAAAAABABIAEAAIACgCIAGgCIACgCIAHgHQAJgMAFgNIgBAAIgFgBIgBAAIgDACIgEABQgaABgbgCIgFAAQANAKAJAOIACACIADAHIABACIAIgHIAEgEIgDAEgAU8u/QgDAFgBAFQgBAFABAEQAAAEAEADIABgBIABgGIAEgTIAAgBIgCgFQgDADgBADgAWHvXIgDABIAAACIAIADQAhALAjgCIAVgCIABgBIgBAAIgBAAIgUgCIgWgDIABAAQABAAAAgBQAAAAABAAQAAAAAAgBQAAAAABgBIASADIAVADIAFAAIABgBIABgCIAAgBIgBgBIgGgCIgVgGQgagHgbABIgJABQgGAAgEACIgLADIABABIAZACIACAAIAIAEIgLgCIgOgCIgBAAgA1ksuIgKgBQgLgCgKgGIgGgEIggADIgDABQgWABgVgCIgVgCIgEAAIgCgBIgBgEIAAgDIAAgBQALgIAOgDIADAAIAlgFIAQAAIgSgXQgQAMgTAIIgMAGQgFACgGgCIgBAFIgGAHIAAACIgBAAIAAABQgFADgGAAIgEgCIAAAAIAAgCIACgTQAEgsALgrIADgLIACgIIACgFIABgEIAAAAIABgBIAAgCIAAgBIABgCIAAAAIgBgBIAFACIABACIAAABIAEADIACAAIACAAIAGAGIADACIgDgDIgGgHIAAAAIAAgBQgEgLgLgHIgCgBIgBAAIAAAGIgCgBIACABIADAHIgBAAIgBgBIAAgBIAAAAIgBAAIgBABIgCAHIAAABIgEAKQgDAJgCAKQgHAbgCAcIAAADQABAPgCAOIgEATQAAgIgCgFIgBACIgBALQgBAEABADIACAAIgGACIgBAAIgKgFIgBgBIgBgDIgDgTIgCgZIAAABQgCglAFgaQABgKADgJQAFgOAIgJQADgCADgBIACAAIADABIgBABQgHAMABAMIACAIIADgCIgDANQgFAVgGAUQgHAZAEAVQACAJADAIIABgBIADgQIADgUIACgBIAAgBQAIgdAAgaIABgKIADgTIAAAAIgBgBIAAgDIABgBIAAgCIgBABIgCACQADgMgEgHIAAAAIADgBIgBgCQAIgHALgEQAKgDALgBIALAAQAaABAZgBIAWAEIAVAFIAWAIQAFAAAEADIABACQAggDADAWIAAAKIAAAJQgDAhgJAfQgCAKgFAHIACAGQABAJgRgBQgJAFgLADIABADIADAMQAAAIgHAAIgBAAgA2Ds/QAJAGAMADIAGABIgBgDQgBgDgEgCIAAgCIgBgDQgHgBgEgDIAAgBIAAgBIgBABIgBAAIgFgFIgCAAIgBAAIgKgEIAAABIAEAHIgEAAQgJABgLgBIgDAAIAFgCIAAgBIgFgCIAEgDIgCgBIgEgBIgJACQgLgCgNACIgDABIgBABIgBABIgBABIAAABIAAABIAGACIgPACIgTADIATADQAWADAWAAIAEAAQASAAASgDgA2ct6QAJATAQAQIALAJIgBABIAAABQAFAHAKADIAEABIADgBIAAgBIACgCIAAgBQgGgGgIgDIAAgBQgIgOgMgMQgKgKgMgIQgBAAgBAAQgBAAAAAAQAAAAAAABQAAAAAAABgA1KuDIAAABQAAALgFAKIgDABQgFACgDADQgDADgBADIAAADIABADIABABIACACIgFADQgCADgBADQAPACAKgIQAIgGAFgLIAAgCQABgDgDgBIgCAAQgBABAAAAQAAAAgBABQAAAAAAABQAAABAAAAIgBABIgDAEIAAgCQAHgTABgUIAAgBQAAgFgEgCIgFAHIAAAAQAEgPABgPIgBgBIAAAAIgDgHIgBAAQgBAAAAABQgBAAAAABQAAAAAAABQAAABAAABIgBACIAAAAIgDAKIgBAEIABgFIABgFIABgDIAAgBIABgTIAAgFIAAgBQgBgGgFgCIgCABIgEANQgDAJgBAKQgDARABARIACACQABAAAAABQABAAAAAAQABAAAAAAQABgBABAAIACgCIAEgOIgDAQIgBAJIAAABIAAACIAAADIAAABIAAAAIABAAIACgEQAFgGABgIIADgCQgCAEgBAFgA3CuSQABAMAMAIIAAABIABAEIABABQAPATATAQIABACQAAAAAAABQAAAAAAAAQABABAAAAQABAAABAAIAAgCIgBgDIAAgCIAAgDIgBgBQgNgSgTgOIADgBIABgEQAHAEAIgDIAAgBQgFgLgJgJQgHgJgIgIIAEgBIABAAIAAAEIADAEIAeAkQAGAEAGgEIABgBIABgDIAAgBQgTgYgYgTIAAgBIAAgCIgBgBQgHgRgSgHIAAgBIABgBIAAgCQAAAAgBgBQAAAAAAAAQgBgBAAAAQgBAAAAAAIgBgBIAAgBQgHgNgQgGIgCAAQgBABgBAAQAAAAgBABQAAAAAAAAQAAABAAAAIABACIARAOIAIAIQAAAAgBABQAAAAgBAAQAAAAgBABQAAAAAAABQgBAAAAABQAAAAAAABQAAAAAAABQAAAAABABQAFAIAHAIIgCgBQgGgHgJgFIgFgDIgCAAIgDABIgEgIIABAIIABABIgBAAIAAAIIgDgFIgDgDIAAACIAPAaIAEAHQAJANALAIIAAgBQgIgQgJgOQAGAJAKACIAEAHIAAAAIAAAAIgCAAIAAABgA33uHQgOAYAGAaIAAAAIAAABQACACADgBIABgCIAEgNIADgBIAAgCQADgMgCgJIAAgMIgCgBIgCgBIgCABgA3RtpIAAABIAAADIgGAEQgIAGgGAHQAHgBAHgCQASgGANgPIAAgBQACgDgCgDIgHAEQAAgBAAAAQAAgBAAgBQAAAAAAgBQAAAAAAgBIgBAAIgEACIADgHIAAgBQgCgCgDgBQgGACgFADIgBACIgEAIIABACIACACIAEgBIgCACgA1mtXIAEgvQABgTAAgTIgBgSIAAgBIAFgLIAAgBQAAgDgEgCIgCACIgLAPIgVAdIgGAHIAAACIABACIAFgDQAMgJAJgLQgHAOgOANIgDACIgCACIAFAHQAJALAHAMIgHgFIgBABQgEAQARAHIAFACIABgBIACAGgA3suAIgBAjIABgBIAVgVIAPgOIgPgSIgKgLIgJgNIgCArgA1DvHIAAADIABAFIABATIAAALQAEAEAEABIABAAIAFgFIABgDIABgIQAAgKgDgJIgEgKIgCgBIgDgBQgEABgCADgA2VuwIAAACIABACIgCACQAAAAAAABQAAAAAAAAQAAABAAAAQAAAAABABIAEAAIACgCIAGgCIACgCIABgBQAOgOAGgRIgBAAIgFgBIgBAAIgDACIgHABQgYABgagCIgFAAQAOAKAJAQIAEAHIAAABIABABIACgBIAKgKIgDAEgA4Xu/IgBAEQgCAMAGAEIABgBIAEgTIABgGIAAgBIgCgFQgFAFgCAHgA3MvcIAAACIAPAFQAcAJAegCIAVgCIAEgBIgCAAIgCAAIgVgCIgTgDIABAAQABAAAAgBQAAAAABAAQAAAAAAgBQAAAAABgBIAPACIAVADIAIABIABgBIABgCIAAgBIgBgBIgJgDQgKgEgLgCQgYgGgaABIgJABQgMABgJAEIABABIAbACIAIAEIgZgEIgBAAIAAAAIgDABgA3hu1IACABIAGAJIACADIgKgNg");
	this.shape_5.setTransform(1.2,0);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#EEB659").s().p("AXiPeQgJgDgEgHIAAgBIABgBIAAgBIAEgCIAFACQAGACAFAFIACACIAAABIgBACQAAABgBAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgGgBgA1wPdQgHgDgEgGIAAgBIABgBIAAgBIAEgCIAFACQAGACAFAFIACACIAAABIgBACQAAABgBAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgIgCgAU6PYQgDgJgBgKQgDgTAGgVQAIgXAFgYIACgHIACgHIAEgDIABgCIABAAIABgBIAAABIgBABIAAABIAAADIAAABIgBANIgDAQIAAgEQgTAaAFAhQACADADgBIgDAOIgDATIAAADIgBABIgCgEgA4WPYQgDgJgBgKQgDgTAGgVQAIgXAFgYIACgHIACgHIAEgDIABgCIABAAIABgBIAAABIgBABIAAABIAAADIAAABIgBANIgDAQIAAgEQgTAaAFAhQACADADgBIgDAOIgDATIAAADIgBABIgCgEgAWdPQIAKgCIAEABIACABIgFADIgLgDgA2zPQIAKgCIAEABIACABIgFADIgLgDgAVPPMIAAgBIgBgGQgEgWANgWIABgBIADABIACABIgBAMIgBgGIgBABQgLALAEARQADACADgBIgCAHIgCAGIgBACIgCABIgDgCgA4BPMIAAgBIgBgGQgEgWANgWIABgBIADABIACABIgBAMIgBgGIgBABQgLALAEARQADACADgBIgCAHIgCAGIgBACIgCABIgDgCgAXiPDQgUgHAFgRIABgBIAHAFQAFAEACAFQADAFAAAGIAAABIgDgBgA1wPCQgSgHAFgQIABgBIAHAFIAFAFQAFAGAAAJIAAABIgFgCgAV5O1IgBgBIAAgCIABgEIADgEIABgCQAFgDAFgCQAEABABACIABABIgEAHQgDAFgHACIgEABIgCgBgA3YO0IAAgCIAEgIIABgCQAFgDAFgCQAEABABACIABABIgEAHQgDAFgHACIgEABIgDgCgAW7OlIgJgKIgEgFIgRgVIgEgEIAAgEIADgEIABAAQAQAMAOAPIAGAHIAHAJIAAABIgBADIgBABQgDACgDAAQgCAAgDgCgA2VOlIgJgKIgFgGIgQgUIgEgEIAAgEIADgEIABAAQAQAMANAOIAHAIIAHAJIAAABIgBADIgBABQgDACgDAAQgCAAgDgCgAWYOiQgLgIgCgMQAAAAABgBQAAAAAAAAQAAAAAAAAQABAAAAAAIABAAQALASARgCIABgCIAAAAIAAgCIAAgBIgBgBIgHgMIAJALIAEAFIACAEIAAABQgJADgGgEIgBAEIgDABIgCABIgFgDgA24OiQgLgIgCgMQAAAAABgBQAAAAAAAAQAAAAAAAAQABAAAAAAIABAAQALASARgCIABgCIAAgCIAAgBIgBgCIgHgLIAJAKIAEAGIACAEIAAABQgJADgGgEIgBAEIgDABIgCABIgFgDgA1dOYIgCgCQAAgVAEgTQABgKADgJIADgHIABgBQAFACABAGIABABIgBATQgCASgFARIgCAEIgCACIgCABIgDgBgAXxOWQAAgVAEgTQABgKADgJIADgHIABgBQAFACABAGIABABIgBASQgCAUgHAUIgCACIgCABQgDAAgCgDgAYNN/IgBgRIgBgSIAAgBIAAgCQABgDAFgBIADABIABABIACAEQAEAJABAKIAAAOIgBADIgFAFIgBAAQgEgBgEgEgA1DN/IgBgRIgBgSIAAgBIAAgCQABgDAFgBIADABIABABIACAEQAEAJABAKIAAAOIgBADIgFAFIgBAAQgEgBgEgEgAW4N5QAAAAAAgBQAAAAgBAAQAAgBABAAQAAgBAAAAIABgCIAAgCIgBgCIADgEQAIgLAKgJIAFgEIADgCIAAAAIAFABIABAAQgEANgKAMIgGAHIgCACIgGACIgDACIgEAAgA2YN5QAAAAAAgBQAAAAgBAAQAAgBABAAQAAgBAAAAIABgCIAAgCIgBgCIADgEQAHgKAJgIIAHgGIADgCIAAAAIAFABIABAAQgFAPgLANIgEAEIgCACIgGACIgDACIgEAAgAU1NuQgBgEABgFQABgFADgFQACgDADgDIACAFIAAABIgEATIgCAGIgBABQgDgDgBgEgA4bNlQABgFADgFQACgDADgDIACAFIAAABIgEATIgCAGIgBABQgGgEACgMgAVpNhIAAgIIADAIIgCAAIAAABIgBgBgA3nNhIAAgIIADAIIgCAAIAAABIgBgBgAVxNZIAAgCIAIAKIgIgIgA3ZNfIgGgGIAAgCIAGAHIACADIgCgCgAV5NUIgUgRIgBgCQAAAAABAAQAAgBAAAAQABgBAAAAQABAAAAgBIADAAQAJAEAGAGIAGAGIACAEIAAABQABAAABAAQAAAAABABQAAAAAAAAQABABAAAAIAAACIgBABIgBABIAAgBIgEABIAAAAIgGgFgA3ZNRIgSgOIgBgCQAAAAABAAQAAgBAAAAQABgBAAAAQABAAAAgBIADAAQAHADAGAFIAGAGIACACIACAEIAAABQABAAABAAQAAAAABABQAAAAAAAAQABABAAAAIAAACIgBABIgBABIAAgBIgEABIAAAAIgIgIgAVnNTIABAAIAAACIgBgCgA3pNTIABAAIAAACIgBgCgAVgNPIAAAAIABABgA3wNPIAAAAIABABgAXiNNIgVgDIgSgDIAAAAQgOgIgRgDIgGgBIgCABQgDABgBADIABAAIAFADIgLgBIgIAAIgHgBIgBgBIAIgDIAMgCIAAAAIAJgBIADAAIABAAQAZAAAYAGIAVAGIAHACIAAABIAAABIAAACIgBABIgGAAgA1wNMIgVgDIgQgCIAAAAQgPgJgTgCIgDgBIgCABQgDABgBADIABAAIAFADIgOgBIgIgBIgEAAIgBgBIAGgCIALgCIADgBIAJgBIABAAQAaAAAYAFQAKACALAEIAJADIAAABIAAABIAAACIgBABIgIgBgAVcNIIACABIAAAAIgCgBgA30NIIACABIAAAAIgCgBgAXis0QgJgDgEgHIAAgBIABgBIAAgBIAEgCIAFACQAGADAFAEIACADIAAABIgBACQAAAAgBAAQAAABAAAAQgBAAAAAAQgBAAAAAAIgGgBgAU6s6QgDgJgBgJQgDgTAGgVQAIgYAFgYIACgHIACgHIAEgDIABgBIABgBIABAAIAAABIgBABIAAABIAAACIAAABIgBANIgDAQIAAgEQgTAbAFAhQACACADgBIgDAPIgDASIAAADIgBABIgCgEgA1ts6QgJgCgFgIIAAgBIABgBIAAgBIAEgCIAFACQAIADAFAHIAAABIgBACIgBAAIgCABIgFgBgA4ZtMQgFgWAHgYQAHgVAFgVIADgNIABgFIABgCIAEgDIACgCIABAAIgBACIAAABIAAACIAAABIAAABIgCASIgCAKIAAgEQgTAbAFAhQACACADgBIgEAVIgCAPIgBABQgEgIgBgIgAWdtCIAKgBIAEABIACABIgFACIgLgDgAVPtFIAAgCIgBgFQgEgXANgVIABgBIADAAIACABIgBAMIgBgFIgBAAQgLAMAEAQQADADADgBIgCAHIgCAGIgBACIgCAAIgDgBgA2ztIIAKgBIAEABIACABIgFACIgLgDgA4BtLIAAgBIAAgBQgHgZAPgYIABgBIADAAIACABIgBAMIgBgFIgBAAQgLAMAEAQQADADADgBIgEANIgBACIgCAAIgDgBgAXitOQgUgHAFgSIABAAIAHAFQAFADACAFQADAFAAAHIAAAAIgDAAgA1wtVQgSgHAFgRIABAAIAHAFIAFAFQAFAGAAAJIAAAAIgFgBgAV5tcIgBgCIAAgCIABgDIADgEIABgCQAFgEAFgBQAEAAABADIABABIgEAGQgDAGgHACIgEAAIgCAAgA3YtkIAAgCIAEgHIABgCQAFgEAFgBQAEAAABADIABABIgEAGQgDAGgHACIgEAAIgDgCgAW7ttIgegjIgEgEIAAgFIADgDIABgBQAYATATAYIAAABIgBAEIgBAAQgDACgDAAQgCAAgDgCgAWYtwQgLgHgCgNQAAAAABAAQAAAAAAAAQAAAAAAAAQABAAAAAAIABAAQALASARgCIABgCIAAgCIAAgBIgIgNQAJAJAGALIAAABQgJACgGgDIgBADIgDACIgCAAIgFgDgA2VtzIgegjIgEgEIAAgFIADgDIABgBQAYATATAYIAAABIgBAEIgBAAQgDACgDAAQgCAAgDgCgA24t2QgLgHgCgNQAAAAABAAQAAAAAAAAQAAAAAAAAQABAAAAAAIABAAQALASARgCIABgCIAAgCIAAgBIgIgNQAJAJAGALIAAABQgJACgGgDIgBADIgDACIgCAAIgFgDgAXxt7QAAgVAEgUQABgJADgJIADgHIABgBQAFACABAFIABABIgBASQgCAVgHAUIgCACIgCAAQgDAAgCgCgA1ct/IgDgCQAAgSADgRQABgJADgJIAEgNIABgBQAFACABAFIABABIAAAGIgCASIAAABIAAADIgBAGIgBAFIgBAEIAAABIgFAPIgCACIgCAAIgCAAgAYNuSIgBgSIgBgRIAAgBIAAgCQABgEAFAAIADABIABABIACAEQAEAJABAJIAAAOIgBAEIgFAEIgBABQgEgCgEgDgA1DuYIgBgMIgBgSIAAgFIAAgDQABgEAFAAIADABIABABIAEAKQADAJAAAJIAAAIIgBAEIgFAEIgBABQgEgCgEgDgAW4uZQAAAAAAAAQAAgBgBAAQAAAAABgBQAAAAAAgBIABgCIAAgBIgBgCIABgBIACgEQAHgKAKgIIABgCIAFgDIADgCIAAgBIAFABIABABQgEANgKAMIgGAHIgCACIgGACIgDABIgEAAgAU1ukQgBgDABgFQABgGADgEQACgEADgCIACAEIAAACIgEASIgCAGIgBABQgDgCgBgFgA2YufQAAAAAAAAQAAgBgBAAQAAAAABgBQAAAAAAgBIABgCIAAgBIgBgCIADgFIAJgKIAHgHIAHgGIADgCIAAgBIAFABIABABQgGAQgNAPIgBABIgCACIgGACIgDABIgEAAgA4buyIABgEQADgIAFgEIACAEIAAABIgBAHIgFASIgBABQgGgEACgLgAVpuwIAAgIIADAHIgCABIAAAAIgBAAgAVxu5IAAgBIAIAJIgIgIgA3nu2IAAgIIADAHIgCABIAAAAIgBAAgA3Zu5IgGgGIAAgBIAGAGIACADIgCgCgAV5u+IgUgRIgBgBQAAgBABAAQAAAAAAgBQABAAAAAAQABgBAAAAIADgBQALAFAIAJIAEAGIAAABQABAAABABQAAAAABAAQAAAAAAABQABAAAAABIAAACIgBABIgBAAIAAAAIgEAAIAAABIgGgGgAVnu+IABAAIAAACIgBgCgA3ZvGIgSgPIgBgBQAAgBABAAQAAAAAAgBQABAAAAAAQABgBAAAAIADgBQAPAHAHAMIABABIAAABQABAAABABQAAAAABAAQAAAAAAABQABAAAAABIAAACIgBABIgBAAIAAAAIgEAAIAAABIgIgIgAVgvCIAAgBIABABgA3pvEIABAAIAAACIgBgCgAXivFIgVgDIgSgCIAAgBQgQgJgVgCIgCAAQgDABgBADIABABIAFADIgCAAIgYgDIgBgBIAKgDQAFgBAFAAIAJgCQAcAAAZAGIAVAGIAHADIAAABIAAAAIAAADIgBABIgGgBgA3wvIIAAgBIABABgAVcvKIACABIAAABIgCgCgA1wvLIgVgDIgQgCIAAgBQgQgJgVgCIgCAAQgDABgBADIABABIAFADIgagDIgBgBQAIgEAMAAIAJgCQAbAAAYAGQAKACALAEIAJADIAAABIAAAAIAAADIgBABIgIgBgA30vQIACABIAAABIgCgCg");
	this.shape_6.setTransform(1.5,-0.8);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FBD888").s().p("AWKPZIgGgCIAAgBIAAgBIABgBIABgBIABgBIADgBQANgCALACIALADIAFACIAAABIgFACQgJADgJAAQgJAAgIgDgA3GPZIgGgCIAAgBIAAgBIABgBIABgBIABgBIADgBQANgCALACIALADIAFACIAAABIgFACQgJADgJAAQgJAAgIgDgAVYO+QgFgRAMgLIAAgBIACAGQACAJgDAMIAAACIgDABIgBABQgBAAAAgBQgBAAAAAAQgBAAAAAAQgBgBAAAAgA34O+QgFgRAMgLIAAgBIACAGQACAJgDAMIAAACIgDABIgBABQgBAAAAgBQgBAAAAAAQgBAAAAAAQgBgBAAAAgAWDO8IgCAAIAAgDIAAgBIACgCQAHgCAEgFIAEgCIABAAQAAABAAAAQAAABAAAAQAAABAAABQAAAAAAABQgBAGgNAEIgBABIgBgBgA3NO8IgCAAIAAgDIAAgBIACgCQAHgCAEgFIAEgCIABAAQAAABAAAAQAAABAAAAQAAABAAABQAAAAAAABQgBAGgNAEIgBABIgBgBgAVCO2QgEghASgaIABAEQAAAagIAdIAAABIgCABIgBAAQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBgA4OO2QgEghASgaIABAEQAAAagIAdIAAABIgCABIgBAAQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAAAgBgBgAX/OjIAAgBQADgXAGgWIABgCQAAgBAAgBQAAAAAAgBQAAAAABgBQAAAAAAAAIABgBIABAAIABABIACAGIABABQgBAPgEAPIAAAAIAAABIAAAAIgDACQgBAIgFAGIgCAEIgBAAQABgDgBgDgA1ROpIABgCIAAgCIgBgCIAAgBIABgFQADgUAFgUIABgCQAAgBAAgBQAAAAAAgBQAAAAABgBQAAAAAAAAIABgBIABAAIABABIACAGIABABQgBAPgEAPIAAAAIAAABIAAAAIgDACQgBAIgFAGIgCAEIAAAAIgBAAgAWSOOIAAAAIgEgHIgHgPIgCgEQAAAAAAgBQAAAAABAAQAAgBAAAAQABAAAAgBIADgBIACABIADACIAKAIQAIAIAHAJIAHAMIAAABIAAABIAAACIAAAAIgBACIgDABQgPAAgKgRgA2+OOIAAAAIgEgHIgIgQIgBgDQAAAAAAgBQAAAAABAAQAAgBAAAAQABAA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");
	this.shape_7.setTransform(1,-0.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#482F17").s().p("AWBQdQgHgCgDgDQgEgEAAgEIAAgzIAVACIAAAxQAqAKAqgKIAAgvQAKAFALACIAAAoQAAAEgEAEQgDADgGACQgZAGgZAAQgZAAgYgGgA3SQdQgGgCgEgDQgDgEAAgEIAAgzIAUACIAAAxQAqAKAqgKIAAgwQAKAFAMACIAAApQAAAEgFAEQgDADgGACQgZAGgZAAQgYAAgZgGgAWMPjIABAAQAeAHAgAFIABAAQglAAgbgMgA3HPjIACAAQAdAHAhAFIABAAQgmAAgbgMgA3fPOIgHAAIADgDIACgEQAFABAFgCIAMgFIAAAHIgCABQgLABgHAFgAYGPOIAKgFQAXACgJgPIAkAAQAHgsgHgsIgPAAQADAWgIAUIAAACQgBAAAAAAQgBAAAAAAQAAAAAAgBQAAAAABgBIAAgCIAAgBQADgVABgVQABgJgCgGIASAAQAFAAADAEQAEAEABAHQAHAvgHAwQgBAGgEAEQgDAEgFAAgAVqPOIADgDIACgEQAFABAFgCIAPgGIAAAIIgFABQgKABgHAEgA1LPOIALgFQAXACgJgPIBEAAQgFgZAHgZIABgDIAAADQACAXgDAbIDUAAQgBgYAAgaIABgNIAAgCIAGgGQACALAAAKQABAZgHAZIB6AAIgCgfIAAgHIgDgIIAAgEIAAgBIgBgBIABgFQgEgKABgKIAGAZIAAACIAAABIAGAJQAGATgDAVIAoAAQgBgFgBgGIAAgCIAAgCIgCgOIgBgBQgBgLgFgJIgDgHIABgWIAAgDQACgEACgCIgqAAIgDADIgBAGIAAgBIAAgFIADgDIjWAAQABARgDAVIAAAAIgDAAIgBgCQgCgUAEgQIiXAAQACATgGATIgBAFIgBABQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAAAgBIAAgCIgCgCIgBgCQgBgVAHgPIgKAAIAAgDQABgJgCgGMApjAAAIgGASIgSAAQABALAAAMIAAACQgDAEgCgEQgEgOABgLIilAAQACANgEAMIAAACQgEgNAAgOIhTAAQADASgJASIAAABQgDABABgGQAAgQAEgQIiVAAQAFAVAGARIAIAQIAAABQgGgHgFgKQgJgQgDgVIAAgBIiRAAIABABIAAAAQAEACAEADIADAEIgOgKIgnAAQADAWALAQIAGAIIAAABQgFgDgFgGQgMgOABgYIhQAAQAGAIADANIAAABIAHAQQADANAAAPIAAAEQACAJgBAJICJAAIAAgBIgBgGIABgDIAAgCIABgBQgBgGACgGIAAgGIgCgDIAAgEIgCgHIgBgEIgBgBQgFgDgEgHIAAgCIgCgEQAAgBgBAAQAAAAAAgBQAAAAAAAAQABAAAAAAIAIAIIAAABQABAEADADIACABIAAABIADAJIABAFIACACIAAABIAAAUIgBAJIgBADIgBABIB7AAQgQgKgOgVIgFgOIABgBIAkAuIEkAAQABgRADgQIACgEIABAAIACgBIACABIABACIABACQAAASgFAPIBUAAQADgRgHgQIABAAQAJAQgEARIAfAAIACASgAJhOKQgFAMgLAIQgEAEgBAJIAAARIA8AAQAFgKABgLIABgFIgIgYIgLgmIk/AAIABABQgCAUADARQACAPAGANIAAABQAAABAAAAQgBABAAAAQgBAAAAAAQgBAAgBAAQgIgPgCgQQgDgSAEgUIhiAAQgEATgCATIgBAQIAAABQgBgBgCgEIAAgMQAAgUAHgSIh8AAIAAADIABAAIAAABIgBAAQACARgCARIgCAOIAAADQgBAAAAABQgBAAAAAAQgBAAgBAAQAAAAgBgBIAAgBIAAgQIgBgmIigAAIAtAmIAcAYQAFADABAHIAAAFIAAACIAAAGIgBADICTAAQgDgRAAgVIABgCIgCgKIgBgIIgBgCQAAAAAAgBQAAgBAAAAQABAAAAgBQAAAAABAAIABAAQAEAGACAHQABAHAAAHIgBABQADARgBASIB3AAIAAgBQAAgXgEgVQgBgBAAAAQAAgBABAAQAAAAAAAAQAAAAABAAIACACIAAABQALAWgFAWICaAAQAPgEALgQIACgEIAAACQgBAMgGAIIgDACICMAAQgDgQAJgSIAJgQIADgFQAHgMgCgNQAEARgFANgAgBO8IgBgDIAAgCIgCgEIgBgBQgKgbgWgNIgEgBQgZgMgOgZIkPAAIAFAmIAEAgIAAABIgDgCIgCgBQgEgPgCgPQgDgSABgUIicAAQAAAQgEASIAAABIgCACIAAABIgCAOIAAAAIAAgLIABgDIgCgCIAAgBQABgSACgRIhRAAIgDAmIgEAXIAAABQgCgLAAgNQAAgSAEgTIAAgBIh9AAIACARQABALABAKIAAAEIgBAFIAAACQgEgEgCgHQ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gVgNIAACtIACAAIAEADIAAABQATADANAIQAFAOACANQAGAigHAkQgBAFgFAFQACglgFgrIgDgQQAAgFgGgDQgQgBgKgFIAAGiQAVALAXAEIgVACQgNgCgKgFIAAI/IA0AMIACACQgjAGgTgQIAADDIACgBQARAIAWAAIACABQgaAIgRgLIAACuQgLAAgJAEgAVzs0IAVACIAABCIACAAIAbACIAfADIABABQgSADgOAAQgSgBgLgHIAACtIACAAIADADIAAABQANACALAFIAJAEQAPAwgKAxQgBAFgEAFQACgsgIg0QgBgDgCgCIgEgDQgQgBgJgFIAAGiQAOAIAPAEIAOADIgOACIgHAAQgNgCgJgFIAAI/IAdAHIAWAFIACACQgNACgLgBQgRgBgMgKIAADDIACgBQAMAGAPACIAMAAIABABIgNADQgQACgNgIIAACtQgMABgJADgAWpMvIgDgKIgBgDQgFgPACgOQACgKgGgDIAHADIAAAAIADABQgBAaADAZgAWTMuQACgSgFgUQAAgBAAAAQAAAAABgBQAAAAABAAQABAAABAAQARAUgGAVIgMgBgA2pMvIgEgKQgGgQACgQQACgKgFgDIAGADIAEABQgBAaADAZgA3AMuQACgSgFgUQAAgBABAAQAAAAAAgBQABAAAAAAQABAAABAAQASAUgHAVIgMgBgAWVEFQAHgDAJgBQAQgEAUAAIAGAAQgSAGgYACIgMAAIgEAAgA2+EFQAXgIAdAAIAGAAQgWAHgfABIgFAAgAXFl2QgGgMgHgMQAAAAAAAAQAAAAAAAAQAAgBABAAQAAAAABABQALALABANgA2Nl2QgGgMgIgMQAAAAAAAAQAAAAABAAQAAgBAAAAQABAAABABQAKALACANgAWxswIAAgCIACAAIgBACgA2iswIACgIIADgBIgEAJgAYGtDIAKgFQAXABgJgPIAkAAQAHgsgHgrIgPAAQADAWgIATIAAACQgBAAAAAAQgBAAAAAAQAAAAAAAAQAAgBABAAIAAgDIAAgBQADgUABgVQABgJgCgHIASAAQAFAAADAEQAEAEABAHQAHAvgHAwQgBAHgEAEQgDAEgFAAgAVqtDIADgDIACgFQAFACAFgCIAPgHIAAAIIgFABQgKACgHAEgA1TtDIgBgDQALgDAJgFQARABgBgJIBCAAQgCgIAAgIQgBgSAGgTQABASgBATIgBAQIDUAAIAAgQQgBgWABgYIAAgCIAGgGQAEAbgFAbIgDAQIB6AAIgBgQIgBgOIAAgIIgDgIIAAgFIgBgBIABgEQgEgKABgLIAGAZIAAAEIAGAIQADAMABAMIgBAQIAoAAQgBgEgBgHIAAgCIAAgBIAAgCIgCgMIgBgBQgCgPgHgMIABgXIAAgCQACgEACgCIgqAAIgDADIgBAGIAAgBIAAgFIADgDIhnAAIhvAAQABARgDAUIAAABQgBAAgBAAQAAAAgBgBQAAAAgBAAQAAgBAAgBQgCgTAEgQIiXAAQACAVgHAVIgBABQAAAAAAABQAAAAAAgBQAAAAAAAAQAAgBAAAAIAAgCIgDgEQgBgWAHgOIgKAAIAAgJIAAgKIEXAAMAlLAAAIgGATIgSAAQABALAAAMIAAACQgDADgCgDQgEgOABgLIilAAQACAMgEANIAAACQgEgOAAgNIhTAAQADARgJATIAAABQgDABABgHQAAgQAEgPIiVAAQAGAeANAYIAAABQgSgUgFgjIAAAAIiRAAIABAAIAAABQAEABAEAEIADADIgOgJIgnAAQAEAcAQASIAAABQgWgOABghIhQAAQAGAIADANIAAABQAKASAAAZIAAAFIAAABQACAIgBAIICJAAIAAAAIgBgGIABgDIAAgDIABgBIAAgDIABgIIAAgHIgCgDIAAgEIgCgGIgBgEQgGgDgEgIIAAgCIgCgFQAAAAgBgBQAAAAAAAAQAAAAAAAAQABAAAAAAIAIAIIAAAAQABAFADACIACACIADAKIABAEIACACIAAABIAAARIAAADIgBAKIgBACIgBABIB7AAQgJgGgKgKIgLgOIgFgPIABAAIAXAdIANAQIEkAAIACgQIACgRIACgDIABgBIACgBIACABIABADIABACQAAAIgBAIQgBAJgDAHIBUAAQABgIgBgIQgBgIgDgJIABAAQAFAJABAIQABAIgCAIIAfAAIACATgAJRtzQgEAEgBAJIAAAAIAAAQIA8AAQAEgHACgJIAAgEIABgFIgTg+Ik/AAIABABQgEAjANAdIAAABQAAABAAABQgBAAAAABQgBAAAAAAQgBAAgBgBQgSgeAJgmIhiAAQgGAagBAbIAAABQgBgBgCgEQgBgbAIgWIh8AAIAAADIABAAIAAAAIgBABQADAYgFAYIAAACQgBABAAAAQgBAAAAABQgBAAgBgBQAAAAgBAAIAAgBIgBg2IigAAIBJA9QAFAEABAGIAAABIAAAEIAAADIAAAGIgBACICTAAIgCgQIgBgVIABgCIgDgSIgBgCQAAgBAAgBQAAAAAAAAQABgBAAAAQAAgBABAAIABAAQAIAMgBAQIgBABIACASIAAAQIB3AAIAAAAIgBgQIgDgdQgBAAAAgBQAAAAABAAQAAgBAAAAQAAAAABAAIACACIAAABQAHAOABAOQAAAIgCAIICaAAQAOgDAJgNIADgDIACgEIAAABIgBAGQgBAIgFAGIgDACICMAAQgBgHABgJQACgIAEgJIAMgVQAHgMgCgOQAHAggYATgAgBtWIgBgDIAAgCIgCgDIgBgBIgCgHQgLgYgXgLQgZgMgOgYIkPAAQAGAhADAkIAAACIgDgDIgCAAQgJghABgjIicAAQAAAQgEARIAAABIgCADIgCAPIAAAAIAAgMIABgCIgCgDIAAgBQABgRACgRIhRAAQgBAegGAfIAAABQgEgdAGghIAAAAIh9AAIACAQQAAANACANIgBAFIAAACQgMgPABgdIABgFIiVAAQAAADgCADIgBABIAAAUIAAACQAOAPgCAYIABADIACAHIAAABIgBAIIB0AAIgBgQQAAgKABgLIAAgBQACgEAAgFIAAAAIAAAGIAAABIACAYIACAQIBcAAQgDgIgBgIQAAgLADgLIAAAAIAFAWIABAPIAAABIAAAAIDxAAIgEgQIgDgKIgBgDIABgJQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAAAAAQAJAKADAOIACAQIC+AAQgGgHgDgJQgJgXAHgfQAAgEAAgFIABAAIACAGIABABQgDAeAHAaIAFAQIA/AAIgDAAIgEgBIgBgBIgCgDIgBgBIAAgBIgBgDIgBgEIAAgBIAAgBIAAgCIAAgBIAAgBQADgIAFgDIAIgEQAGgBAGgDQANgCANAFIAAABQgVgCgWAIQgHACgCAKIAAABIAAABQADAGAEAEIACADIABABQABAAAAAAQABAAAAAAQAAAAAAAAQABABAAAAICTAAIAAAAgA3ptDIABgCIAFgHIACgFQAFACAFgCIAMgGIAAAIIgCAAQgPADgLAIIAAABgA49tDQgDAAgDgDQgDgCgCgFQgTg1ATg0QACgFADgCQADgDADAAIAtAAQgCAJgCAKIgpAAQgQArAQAsIAUAAIgCgNIAAgCQABgDACgCIABAAIACACIAAABIAEARIANAAIACATgAX1tWIACAAIAAAEIgCgEgAhWtZQAOADAMgJIgDgHQgHgKgNgBQAOgBAHAMIADAIIAAABQgIAGgIAAQgFAAgGgCgAVxuDIABACIAAABIAAAaIgBANIgBABIABgrgAA1taIgJgMIgggqIABAAQATASAPAYIAFAIIAAAAIABAEgAKvtgIAAAAIAXAEIAAABIgGAAQgJAAgIgFgAVzulQAEAGAEAGIANAOIAAAbIgVAVgA3fuBIABgrIAJANIAKALIAAAgIgUAVgAKgtmIgBAAQgIgUAEgXQAAAAAAgBQAAAAABAAQAAAAAAAAQAAAAAAAAQgBAcANAQIAEAFIAAABQgGgBgGgFgAMKtmQgDgpgcgQQgIgFAEgGQAaAKAIAiQADALgBALIAAACIgBAEIAAgEgAXptsQgFgKgIgKIAAgRQAMgLAHgNIACgDIAABJQgDgFgFgEgALXtmIACgBQABgEACgCIABgFIABAAIAAAGIAAABIgEAFQgCACgDABIACgDgAh5tmQADgDADAAIgEADIgCABIAAAAIAAgBgAK6tuIABAAQAFAEAGABIAAABQgHAAgFgGgA1ntyQgGgMgKgLIAAgLQAOgNAIgOQAGgHAFgJIABASIgMAAIAABAIgGgFgAQ6uIQACgQADgNIACAHIAAACQgBAXgEAWIgBABQgDgJACgRgAHkt6QgUgIAFgcQAHAjAcAFQAYAEAXABQgJACgJAAQgYAAgZgLgAGLukQAAgBABABQAIAXgGAaQAEgZgHgYgAGpulIABAAQAeALABAnQgHgkgZgOgAUXt3IAAAAgAT1uoQAAgBgBAAQAAgBAAgBQAAAAAAgBQABAAAAAAQAPAbATAZIAAABQgSgWgQgbgALMt9QAGgBAEAEIAAABQgNgCgNADQAFgIALADgAI2ueIABAAIADADIACABIACAGIAAAEQgBgGgHgIgAW6utIgCgCQAEgGAHgEIASgHIAGgCQgKAIgHALIgEAEQgHAAgFgCgA2TurIAAgBIgDgHIAHgGIARgHIABAAIgJALIgKAKIgDAAgAXyutIAIgMIABAMIgJAAgAXcvGIAEgBIgEAEgA13vMIAHgBIgHAGgAXcveIAAgyQgqgJgqAJIAAAtQgMAAgJADIAAgwQAAgEAEgEQAEgDAHgCQAwgKAwAKQAHACAEADQAEAEAAAEIAAA3IgVgFgA13vlIAAgrQgqgJgqAJIAAAnQgLABgJADIAAgrQAAgEADgEQAFgDAGgCQAwgKAxAKQAGACAEADQAFAEAAAEIAAAwIgWgFg");

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("rgba(255,255,255,0.792)").s().p("A0oNLQgHgQgbACIgBgBQgEgDgFgBIgWgHIAA5oIAKABQAJABgBgJIgDgMMAqQAAAIACAJIABABIAKAFIABAAIAGgBQADgBACgDIABgCIAAAAIAEACQAGABAFgDIAAgBIABgCIADgFIAIAAIgJAGIAAADIABAEIACABIAHABIAAZmQgNAEgJAIIABACIgDABIAAAAIgDgDIAAAAIgDAAIgCAAQgDAAgDADQgGAHgEAKMgpjAAAg");
	this.shape_9.setTransform(0.8,0.7);

	this.addChild(this.shape_9,this.shape_8,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-161.8,-105.8,323.8,211.9);


(lib.miniTriangulo = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.blocoTriangulo();
	this.instance.setTransform(-24.9,-24.9);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-24.9,-24.9,50,50);


(lib.miniSeta_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.seta1();
	this.instance.setTransform(-9.7,-43.4);

	this.instance_1 = new lib.seta2();
	this.instance_1.setTransform(-12.2,-45.4);

	this.instance_2 = new lib.seta3();
	this.instance_2.setTransform(-13.5,-46.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-9.7,-43.4,21,83);


(lib.miniRetangulo = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.BlocoRetangulo();
	this.instance.setTransform(-24.9,-24.9);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-24.9,-24.9,50,50);


(lib.miniQuadrado = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.blocoQuadrado();
	this.instance.setTransform(-24.9,-24.9);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-24.9,-24.9,50,50);


(lib.miniPontos3_mc = function() {
	this.initialize();

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AiLK9IAA15IEWAAIAAV5g");
	mask.setTransform(0.5,41.8);

	// dentro
	this.instance = new lib.barraPontosInterna();
	this.instance.setTransform(-9.9,-147);

	this.instance.mask = mask;

	// base
	this.instance_1 = new lib.barraPontosExterna();
	this.instance_1.setTransform(-35.9,-162.9);

	this.addChild(this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-35.9,-162.9,72,326);


(lib.miniPontos2_mc = function() {
	this.initialize();

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AiLEjIAApFIEWAAIAAJFg");
	mask.setTransform(0.5,82.9);

	// dentro
	this.instance = new lib.barraPontosInterna();
	this.instance.setTransform(-9.9,-147);

	this.instance.mask = mask;

	// base
	this.instance_1 = new lib.barraPontosExterna();
	this.instance_1.setTransform(-35.9,-162.9);

	this.addChild(this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-35.9,-162.9,72,326);


(lib.miniPontos_mc = function() {
	this.initialize();

	// base
	this.instance = new lib.barraPontosExterna();
	this.instance.setTransform(-35.9,-162.9);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-35.9,-162.9,72,326);


(lib.miniIma_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.coruja1();
	this.instance.setTransform(-47.9,-45.4);

	this.instance_1 = new lib.coruja2();
	this.instance_1.setTransform(-47.9,-45.4);

	this.instance_2 = new lib.coruja3();
	this.instance_2.setTransform(-47.9,-45.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47.9,-45.4,96,91);


(lib.miniEstrela_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.estrela1();
	this.instance.setTransform(-23.9,-22.9);

	this.instance_1 = new lib.estrela2();
	this.instance_1.setTransform(-23.9,-22.9);

	this.instance_2 = new lib.estrela3();
	this.instance_2.setTransform(-23.9,-22.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.9,-22.9,48,46);


(lib.miniDestaque_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.brilho1();
	this.instance.setTransform(-23.9,-23.9);

	this.instance_1 = new lib.brilho2();
	this.instance_1.setTransform(-25.9,-25.6);

	this.instance_2 = new lib.brilho3();
	this.instance_2.setTransform(-26.1,-25.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.9,-23.9,48,48);


(lib.miniCirculo = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.BlocoCirculo();
	this.instance.setTransform(-24.9,-24.9);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-24.9,-24.9,50,50);


(lib.logo_1 = function() {
	this.initialize();

}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,0,0);


(lib.ima_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.coruja1();
	this.instance.setTransform(-47.9,-45.4);

	this.instance_1 = new lib.coruja2();
	this.instance_1.setTransform(-47.9,-45.4);

	this.instance_2 = new lib.coruja3();
	this.instance_2.setTransform(-47.9,-45.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47.9,-45.4,96,91);


(lib.Tween8 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#669900").s().p("AgGDPQhOgBg5g1Qg+g3gBhQQgBhNA7g6QA3g2BPgFIgBgfIA5A3Ig3A3IgBgiQg7AEgqApQguAsABA7QABA9AwAsQArAmA7ACIAHAAQBBAAAugsQAtgsAAg+QgBg2gpgpIAighQA3A2ACBKQABBQg7A6Qg7A5hVABIgJgBg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-20.5,-20.8,41.1,41.7);


(lib.Tween6 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#669900").s().p("AjDAnQgOgOAAgZQAAgOAFgLQAEgIAGgHQAHgGAIgDQAKgEAOAAQAZAAAPAOQAPAPAAAYQAAAZgPAOQgPAPgZAAQgZAAgPgPgAixgaQgJAJAAARQAAARAJAKQAJAIANABQAOgBAIgIQAJgKAAgRQAAgRgIgJQgJgJgOAAQgOAAgIAJgAEnA0IgRgXIgMgQQgDgDgEgBIgLgBIgFAAIAAAsIgWAAIAAhnIAvAAQASAAAJACQAIADAFAHQAFAIAAAJQAAAMgIAIQgHAFgPACQAHAFAFAEQAFAFAIAMIAOAVgADzgHIARAAQARAAAEgBQAEgCACgDQACgDAAgFQAAgFgDgDQgDgEgFAAIgRAAIgSAAgAC4A0IgKgYIgsAAIgKAYIgYAAIAshnIAYAAIAtBngACJALIAeAAIgPgmgAAlA0IAAhVIghAAIAAgSIBZAAIAAASIghAAIAABVgAhSA0IAAhmIAXAAIAABUIA4AAIAAASgAkZA0IgohnIAZAAIAcBLIAchLIAYAAIgoBng");
	this.shape.setTransform(-0.1,0.1);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-32.3,-5.3,64.5,10.9);


(lib.animamaoOK = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FECF30").s().p("AgYASIACABIgCABgAAYgTIAAAAIAAAAIABAAIgBABIAAgBg");
	this.shape.setTransform(0,21.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgWEVIAVALIAGAHIgEAHQgQgBgHgYgAABDyIgBgCIgDgCIgFgGIAEgHIALgDQALAAAKAIIAAACIgCACIAAAEIgBACIgBABIgCAEIgDAAIgDABQgIAAgHgEgAgOCTIACAAQARgHAUABQANgBABAIIAAAEIABABIAAACIgDAJIgDAGQgfgCgRgVgAgnkFQABgVAHgTIAFAAIAEABIADAFQAGAJAEAJQgJABgJAEQgDAEgEAEIgEADg");
	this.shape_1.setTransform(-1.1,-3.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFCD3").s().p("AgDBBQhUg4BEhUIATAGQAIAEARATQARATAGAfQAGAggMAoQgggCgNgJg");
	this.shape_2.setTransform(1.9,-21.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#EDDE78").s().p("AAADvQgWgCgWgLIgBAAQgjgRgegWIgYgQIgNgpIAQgFQBJgZAUhPQAFANAJAHIgFAXIgSA6QgKAUgGAGIgJAHQgNAIgPADIgKABIgEABIAAABIAFACIACACIAAABIAAAAQAOABAMgEIAHgCIAJgFQANgGAIgLQAIgKAEgMIACgDIABgEIAFgRIAAAAIACABIgDAMQAAAIADAIQACAGAFAFIgBACIgOAAIgFABQgBAbAOAXIAEAHQAKAMAKAIQAQAMASAHIAAACIgkgDgAA/DqIgQgEQgSgGgSgLQgLgHgFgKIgFgHIgDgHQAMAEAHgIQAEgDACgEIgDgIQALAFAMADIAJACQgEAEgDAIQAVAuA4gDIAJgBIAAACQgRAFgSABIgHAAIgPgBgAAgCeQgPgEgMgHQgJgGgEgKIgCgJIAAgBIABAAQALAHAPgEIAEAAIACgCIACAFQBAAoBGgnIAZgNIgIAHQgRALgSAJQgTAJgTAGQgNADgNACIgMABIgDAAQgPAAgPgFgAjHBDQgLg+Afg3QATgrAfglQAtgxASg+QgMBRgrBDIgRAaQgVAggRAjQgQAgAAAkIgBAaIgGgbgAgLAsIgIgHQAXAQAcACIAEgDQAOgPgDgUQAQADAQgBIgDgDQA+gGAuglIABgBIASgVIgFAcQgHATgQANQgiAfgtAPQgVAHgVAAQgiAAgfgUgAgbANIgDAAIgDgMIAAgDQgDgrAxgSQgfAiAdAdIAGAEQgUgCgVAMIgDgBg");
	this.shape_3.setTransform(-0.7,9.4);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFF08A").s().p("ABsE0IgJAAQg4ADgVgtQACgIAFgFIALABQASABASgCQANgBALgFIAegMQASgHAPgLQAJgGAIgIQACAUgGAUQgEAOgHAKQgKAOgOALQgNAKgQAGIgEABgAiqDlQgYgWgLggIAAgbQABgjAQgiQARgjAUghIARgYQArhDAMhRQALglAAgrQAAgTAGgQIADgHQAFgIAGgHQAFgGAHgCQARgEAPAEQhEBVBSA4QAPAKAgACQgaA1gqArQgZAkAEAqIAAAEQgNALgHATQgJAWAJAXIABACQgTBPhJAYIgRAGIAOAoIgYgWgAAMDPIgBgEIACgDQAEgCABgEQACgFAAgFIABgBIAAAAIgBAAIAAAAIAAAAIAAAAIAAgBIAAgBIgCgDQgFgIgLgCIgCAAIgFgBIgJAAIAJgKIAJgCIALgDIAPACQAPACAPgBIAPgCQAfgHAcgNQAMgGAKgIQAHAEAJgCIAAgCIgEgEIgFgBQASgPALgWQAEAIADAIQAHAQAAARQABANgFAOQgFARgMANIgNANIgZANQgjATghAAQgiAAghgVgAglC1IAHgXIAAgBIAIgYQAIAHAKAFIgIAEIgIAKIgKAPIgFAIgAAiBhIAAgCIgBgCIgGgEQgLgEgLgBIgFgFQgegeAfgiQBJgPBCAkIAAgBQgQgMgSgLQgQgFgSgDQgWgEgWABQgaADgXAMIAAAAIAAgJQACgBACgRQAFgSAKgQQAegJAlgCQAwgCAhAVIACABIAMAMQAXAYAHAeIgSAUIgBABQguAng9AGIADADIgIAAQgMAAgNgCgAgTgBIACgJIgCAJg");
	this.shape_4.setTransform(0.4,1.3);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AABFcQgWgCgYgHQgOgEgKgGQg4gagugoQg3gyAChKQABggAKgfIARgzQAHgOAJgLIAlgyIAIgKQAvg2AMhHQADgQABgQIADgyIADgHIACgEIAGgsQACgMAHgKQAGgEAHABIADAAQATAPADAVIAKABQAAgBAiAUQAlAUAIA3QAHA2gHAVQgIAVgPAXQgPAXgPAQIgSASQA7gTA/APQAOADALAGIANAIQArAggDA4IgFAQQAQAVAEAQQADAQABATIgBAAQAAASgKAPIgFAHIgHAIIgNAQIADASIAAACQACATgHASQgGASgMAMIgIAHIgNALIgBAAQgTANgUAHIgHACQgaAGgZgGIgJADQgQAFgQAAIgJAAgAAhFQIgFgCQgSgIgOgLQgNgJgJgLIgEgIQgOgWABgbIAFgBIAOAAIACAAIgBgCQgFgFgCgHQgDgHAAgIIADgMIAFgJIAKgPIAHgKIAIgEQgKgEgIgHIgHAYIAAAAIgHAYIAAAAIgFARIgBAEIgCADQgEAMgIAKQgJAKgMAHIgJAFIgHACQgMAEgOgBIAAAAIAAgBIgCgCIgFgCIAAgBIAEgBIAKgBQAPgDANgIIAJgHQAGgHAKgUIASg5IAFgXQgJgIgFgMIgBgCQgJgWAIgXQAHgSAOgMIgBgEQgEgqAZgjQAqgsAbg1QALgngGghQgGghgRgTQgRgTgKgEIgRgGQgPgEgQAEQgHACgGAHQgGAHgEAIIgDAHQgHAQABASQgBArgKAmQgSA9gtAxQgfAlgTApQgfA5ALA/IAGAbQALAgAYAXIAYAWIAYAQQAeAWAjARIABAAQAWAKAYADIAiADIAFAAIAAAAgAgSEaIAFAHQAHALAJAHQARALATAGIAQAEQALACALgBQASgBARgFIAEgCQAQgFANgLQAOgKAKgOQAIgKAEgOQAFgUgCgUQgHAIgJAGQgQAKgRAHIgfANQgLAFgMABQgTABgRAAIgMgBIgJgCQgMgDgLgGIADAJQgCAEgCADQgJAIgMgFIADAHgAgIEMIAEgHIgJgHIgUgLQAHAYASABgAgSDXIACAKQAEAKALAFQAKAIAPAEQAQAFARgBIAMgBQANgBANgEQATgFATgJQASgJARgMIAIgGIAOgNQALgNAGgQQAEgOAAgOQgBgQgGgQQgDgJgFgHQgLAVgSAQIAFAAIAFAFIAAABQgKADgGgEQgLAIgMAGQgcANgfAGIgPACQgPACgPgCIgOgDIgMAEIgJACIgIAKIAIgBIAFABIADABQAKABAFAIIACADIABABIgBABIAAAAIAAAAIAAABQABAGgCAEQgCAEgEADIgCACIgCABIgEABQgNAEgNgHIgBAAIAAAAgAgPC/IgEAHIAEAGIAEACIADACQAIAFAIgCIADAAIACgEIABgBIAAgCIAAgEIADgCIAAgCQgKgHgJgBgAgTCJQAyAhA5gTQAtgQAigfQAQgOAHgUIAFgbQgHgfgYgWIgLgMIgDgCQghgUgvACQglABggAJQgJAQgEAQQgCATgCABIgBAJIAAACIAAAAIABgCQAWgMAbgCQAVgCAXAEQARADAQAGQATAKAPANIAAAAQhCgjhJAPQgxASADArIAAAEIADANIADAAIADABQAVgMAUACQALAAAMAFIAGADIAAACIABADQACAUgNAPIgEADQgagDgZgPIAIAGgAgXBxIgDAAQAUAVAdACIACgGIAEgJIAAgCIgBgBIAAgEQgBgIgNABIgHAAQgOAAgQAGgAgPAKIAAABIABgBIABgJIgCAJgAgqlPQgHATgCAVIAAAAIABAAIAFgDQAEgEADgEQAIgEAJgBQgEgJgFgJIgDgFIgEgBIgDAAIgCAAgAi0E8IACgBIABgCIgBADg");

	this.addChild(this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-22.5,-34.8,45.2,69.8);


(lib.animamaoNAO = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FECF30").s().p("AAEAgIACAAIgBABgAgFgeIAAgCIAAACg");
	this.shape.setTransform(5.7,15.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EDDE78").s().p("AARDXQgPgEAJgNQAQgYgSgZQgOgWgeABQgaABgagCQgZgCgYgIQgagIgPgVQgRgXAVgWQAUgUAZAVQAVARAaAGQAYAEAYgEIALgCQAGAFAIAEIACACIACAAIAEADIAAAAIAFABIACABIAHACIACgCQAGgGACgIQACgIgBgIIgBgDIgBgDQgCgHgGgGQAJgQgEgQQAOAQABAVQABAHgCAHIgBAHIgDAJQgFAKgHAHIgBABIgBAAIgGAGQgIAFgIACIgFABIgIABIgEAAQgWAAgWgCQgSgCgQgFQgPgFgOgJQgNgHgLgLIgDAFIAOASIgggCQAQAKAUgBIAFgBQAZAMAaAFQAYAFAZAAQAUgCAQAHIACABIAFADIAKAGIAHAHQAHAHAFAKQAHANABAPIABADQAAAQgEAPQgIAEgJAAIgJAAgAA0CWQgFgMgJgKIgCgCIgHgHIgBAAIgBgBIgBAAIgCgCIgLgHIgBgBIgGgDIAHgCIACABQAFAGAGAEIACABIAAAAIACABQAHAEAJACIABAAQAHAAAHgBIABABIgGANIgCAFQAYAOAcgBIAJgBQgFAMgSAHQgPAGgTABQAAgPgGgNgABrCLIgIgBQAKgJgCgMQgBgFgDgEIgJgBQAOgKALgPQACAKANAIQAUAMAUgMIAMgIIgMANQgOAOgTALQgMAHgNABIgJABIAAAAgAA3BtQgFgBgFgCIAAAAIAAAAQAOgKADgQIAAgFQAGABAHgBQAZgCARgTIAJgLIgFAMQgIAQgNANQgLALgMAIQgKAGgJAAIgDAAgAABgjIgTgOQABgNADgNQAEgPAIgLIAUgZIgLADQgLAMgJAPQgMASABAVIAAAGIgIgDQgBgQACgPIAAgCQADgYAPgRQAJgJAJgGQASgDAQANQAIAGACAKQAGAZgRATIgSAVQgHAHgBALIgBAGIgKgHgAh5hUQADgbABgcQABghgDgfIgCgLQAHALAEANQAGAZABAZQAAAYAEAYQACANANADQAUAGAUgIIAAAUQgQgDgQAAQgWAAgUAHIgLAEQAGgQACgSg");
	this.shape_1.setTransform(0,7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFF08A").s().p("AiFEdIgNgMQgNgOgMgPQgLgPgKgTQgIgRgEgSQgGgbAAgcQAAgOAEgNQAGgRAKgOQALgPANgKQATgOAXgIQAQgGATgCQAPgBAQABQAPABAQAFQAOAFALALQAKAKAKALIADAEQADARgIARIgDgCIgDgDIgNgDQgIAFgFAHQgEAFgDAHQgDAFgBAHIACABIAAAAIADADIgKACQgYAFgYgFQgbgGgVgRQgYgVgVAVQgVAVASAYQAOAUAaAJQAYAHAZACQAaACAagBQAfgBANAWQASAZgQAYQgJAOAPADQAPADALgHIgEAKIgBAFIABAAIAEgEIAEAAQAHgMADgOIABgHIABgLQASAAAQgGQASgIAEgMQAQgCANgHQATgKAPgNIACABIgUAgQgOAUgUAQQgVAQgXAMIgKAGQgWATgaAJQgfANgfAAQgyAAgtgigACHCbQgNgIgDgJIAHgKQAJgQAHgSQAFgMABgNIADgiQACgUgCgRQgBgMgDgKQATAIAQAPQALAIAFAMIADAGQAGANACAPQAEAUgEATQgDAOgFAOIgDAIQgFAKgHAJIgLAIQgLAGgKAAQgKAAgJgGgAA/CCQAAgHgEgFQgDgEgFgCIgBgCQgBgPgDgNQgGgUgMgSQgHgLgKgIIABgFQACgLAGgIIASgTQARgTgFgYQgDgLgIgGQgQgMgRACQAHgEAHgCQARgEASADQASABAPAIQANAGAKALQANANAGARQAGAOABAPQADATgBAVQgBAWgEAVQgDANgFANIgJALQgRASgYACIgGAAIgHAAgAhUgUQgNgEgCgNQgDgYgBgXQAAgagHgYQgDgOgHgLQgEgbgKgYQgIgTgLgRQgOgXAMgWQAEgHAGgFQAOgLARgEIgHAHQgJANABAQQABAXAKAVQALAWATAOQAUAOAagBQAaAAATgPQALgIAHgLQADAMAAAMQABAUgEAUQgFAUgOAPQgKAOgKAPQgLAPgGASQgHASgCATIAAADQgLAEgMAAQgIAAgJgCg");
	this.shape_2.setTransform(0,1.4);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFCD3").s().p("AgiA0QgSgNgLgWQgKgTgCgYQAAgQAJgNIAGgHQAJgCAKgBIAQABQAKACAKADQARAHARANQAOALALAPQAMANAFARIAFAPQgHALgMAIQgVAPgaAAIgBAAQgXAAgUgOg");
	this.shape_3.setTransform(-5.4,-24.1);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("ABnEHIATgOIALgEIAFAHQgIAMgQAAIgLgBgABBDjQAIgJAGgKIAEgJIACgEIAFADIACABIAAACIADAEQgEALgJAGIgDACIgEADIgCABgAAvDHIgJgEIgNgGIAAAAIgGgEIACgMIAOgIQAHABAFAFIABABIAEAEIAAAAQABAJgCAKIgBAEIgDAAgAiHkAIgCgFQAXgGATAMQgOAIgNAKQgIgIgFgLg");
	this.shape_4.setTransform(-3.8,-5.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AhMFOQgigCgbgXQgUgPgHgIQgPgQgLgTQgIgPgIgQQgHgOgEgRQgGgVABgVQAAgRAEgSQAEgXANgUQAKgOANgKQARgMARgKIAGgVQAEgSADgSQADgYAAgZQgBgZgFgaIgHgkQgFgWgKgUIgOgdQgKgWAKgWIgJgQQgLgUAOgPQAJgBAJACQAUADALAQQANgGAOAAQAYACAWAIQAVAHARAOQAPAMAJAPQAMAQAHATIABACQAIAUACAVQADAVgGAVQgDAQgIANQgKAQgNAOQAMgFAMgDQAWgHAWAGQARAEARAJQARAJAIARQAKARAHAVQALACAKAFQASAIANANIADADQALAMAFAQQAFAOABAPQACAXgDAXIgCAIQgFAWgOASIgFAGIgBAJQgEAXgNASQgNAWgXAUQgVASghAQQg8AohCAAQgTAAgSgDgAhaAVQgTACgQAHQgXAIgSANQgOAKgLAPQgJAOgGASQgFAMAAAOQAAAcAGAbQAEASAIARQAKATAMAPQALAPANAOIANAMQBJA4BVgjQAZgJAWgTIAKgGQAXgMAVgQQAVgPANgVIAUggIADgFIgEAEQgQANgSAKQgOAHgPACIgKACQgbABgYgPIABgFIAHgNIABgBIgDABQgHABgHgBIAAAAQgJgBgHgEIgCgBIAAAAIgDgCQgGgEgFgFIgBgBIgIACIAGADIACABIALAGIACACIABAAIAAABIABABIAHAGIADADQAJAJAFANQAGANAAAOIAAALIgCAHQgCAOgIAMIgDABIgFADIgBAAIACgFIADgKQAFgPgBgQIAAgCQgBgPgIgOQgEgKgHgHIgIgGIgJgHIgFgCIgCgBQgQgIgVACQgYAAgYgEQgbgGgYgLIgGABQgTAAgRgJIAhABIgOgSIADgEQALAKANAIQAOAIAPAGQAQAFASACQAWABAWAAIAEAAIAIAAIAFgBQAIgDAIgFIAGgFIAAAAIACgCQAHgHAEgJIAEgJIABgHQABgIAAgHQgCgVgNgRIgDgEQgKgKgJgLQgMgLgOgEQgQgGgPAAIgSgBIgNAAgACXAKQACATgCAUIgEAjQgBAMgEAMQgIASgJAQIgHAKQgKAOgPALIAKABQACAEABAEQADANgKAJIAIAAIAJAAQANgCAMgHQATgLAOgOIAMgNQAGgJAFgKIADgIQAGgOACgOQAEgTgDgTQgDgPgGgOIgCgGQgGgMgLgKQgQgNgTgIQAEAKABAKgABTC+IgTANQAZAGAKgQIgFgIgAgCggQgJALgDAQQgDALgBANIATANIAKAHQAJAJAIALQAMARAFAUQAEANABAPIAAACIAAAAQAFADADAEQAEAEAAAHIAAAFQgDARgOAJIgBABIABAAQAFACAFABQALABAKgHQANgIALgMQANgNAHgPIAGgMQAEgNADgNQAFgVAAgVQABgVgCgVQgCgNgGgPQgGgRgNgNQgKgLgNgGQgPgIgSgBQgRgDgRAEQgIADgHADQgJAGgJAKQgPARgDAYIAAABQgCAQABANIAIADIAAgFQgBgTAMgTQAJgPAKgLIAMgEIgUAZgAAsCMIgEAJQgGAJgHAKIAHABIACgBIAEgDIADgCQAKgHADgLIgCgEIgBgBIgCgCIgFgCIgCAEgAhgkzQgKAAgJADQgRAEgOALQgGAFgEAHQgMAXAOAWQALARAIATQAKAZAEAaIACALQACAgAAAhQgBAbgDAcQgCAPgGAQIALgDQAUgIAWAAQAPAAAQAEIAAgSIABgCQABgUAHgSQAHgRAKgQQAKgPALgNQANgQAFgTQAEgVgBgTQAAgNgDgMIgEgOQgGgSgKgPQgKgPgPgLQgQgNgUgGQgJgEgKgBIgPgBIgBAAgAivlBIABAGQAFAKAIAIQANgJAOgIQgNgIgPAAQgGAAgHABgAAHCWIgCAAIgFgCIAAAAIgEgCIgCgBIgDgBQgHgEgHgGIgDgCIAAgBIgBgBQAAgHADgFQADgHAEgFQAFgHAIgFIANADIAEADIACACQAFAGADAGIABAEIABACQABAJgCAIQgCAHgHAHIgBABIgHgCgAgQByIgBAMIAFAEIABAAIALAGIAIADIADABIABgEQACgKgBgJIAAgBIgDgDIgBgBQgFgGgGAAg");

	this.addChild(this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-22.3,-33.7,44.7,67.6);


(lib.estrela_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.estrela1();
	this.instance.setTransform(-23.9,-22.9);

	this.instance_1 = new lib.estrela2();
	this.instance_1.setTransform(-23.9,-22.9);

	this.instance_2 = new lib.estrela3();
	this.instance_2.setTransform(-23.9,-22.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.9,-22.9,48,46);


(lib.destaques = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.instance = new lib.tutobrilho1();
	this.instance.setTransform(-127.9,-100.9);

	this.instance_1 = new lib.tutobrilho2();
	this.instance_1.setTransform(-127.9,-100.9);

	this.instance_2 = new lib.tutobrilho3();
	this.instance_2.setTransform(-127.9,-100.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},2).to({state:[{t:this.instance_1}]},2).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-127.9,-100.9,259,203);


(lib.destaque_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.brilho1();
	this.instance.setTransform(-23.9,-23.9);

	this.instance_1 = new lib.brilho2();
	this.instance_1.setTransform(-25.9,-25.6);

	this.instance_2 = new lib.brilho3();
	this.instance_2.setTransform(-26.1,-25.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23.9,-23.9,48,48);


(lib.carregandoBarra_loader = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("ArELFQkmkmAAmfQAAmeEmkmQDMjLEKg/IARgEQAjgHAkgFIAPgCQA8gIA/gBIAMgBQGfAAEmEmQEmEmAAGeQAAGfkmEmQkmEmmfAAQmeAAkmkmgAiHu/IgPACQgkAGgjAIIgRAEQj9A9jBDCQkcEcAAGQQAAGREcEcQEcEcGQAAQGRAAEckcQEckcAAmRQAAmQkckcQkckcmRAAIgJAAIAAAAIgBAAQhAABg9AIg");
	this.shape.setTransform(103.8,103.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(0,255,255,0.463)").s().p("AAAO/QmMAAkZkZQkZkZAAmNQAAmMEZkZQC/i+D4g9IARgFQAjgHAkgGIAPgCQA9gIA/gBIABAAIABAAIABAAIAIgBQGNAAEZEZQEZEZAAGMQAAGNkZEZQkZEZmNAAIAAAAgAiHuyIgPACQgkAFgjAIIgRAEQj3A+i/C+QkYEYAAGLQAAGMEYEYQEZEZGLAAQGMAAEZkZQEYkYAAmMQAAmLkYkYQkZkZmMAAIgIABIgBAAIgBAAIgBAAQg/ABg9AIg");
	this.shape_1.setTransform(103.8,103.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("rgba(0,255,255,0.663)").s().p("AAAPJQmQAAkckcQkckcAAmRQAAmQEckcQDBjCD9g9IARgEQAjgIAkgGIAPgCQA9gIBAgBIABAAIAAAAIAJAAQGRAAEcEcQEcEcAAGQQAAGRkcEcQkcEcmRAAIAAAAgAiHu0IgPACQgkAGgjAHIgRAFQj4A9i/C+QkZEZAAGMQAAGNEZEZQEZEZGMAAQGNAAEZkZQEZkZAAmNQAAmMkZkZQkZkZmNAAIgIABIgBAAIgBAAIgBAAQg/ABg9AIg");
	this.shape_2.setTransform(103.8,103.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(0,255,255,0.6)").s().p("ArILJQknkoAAmhQAAmgEnknQDNjOENg+IARgEQAjgIAkgFIAPgCQA8gHA/gBIAMgBQGhAAEoEoQEnEnAAGgQAAGhknEoQkoEnmhAAQmgAAkokngAgMvtQg/ABg8AIIgPACQgkAFgjAIIgRAEQkMA+jMDNQknEnAAGfQAAGgEnEnQEnEnGfAAQGgAAEnknQEnknAAmgQAAmfknknQknknmgAAIAAAAIgMAAg");
	this.shape_3.setTransform(103.8,103.8);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(0,255,255,0.4)").s().p("ArPLQIAAAAQkqkrgBmlQABmkEqkrIAAAAQDQjQERg/IARgEQAjgHAkgFIAPgCQA8gIA+gBIANAAQGlAAErEqIAAAAQEqErABGkQgBGlkqErIAAAAQkrEqmlABQmkgBkrkqgAgNv3Qg+ABg8AIIgPACQgkAFgjAHIgRAEQkQA/jQDPQkqEqAAGkQAAGlEqEqQEqEqGkAAQGlAAEqkqQEqkqAAmlQAAmkkqkqQkqkqmlAAIAAAAIgNABg");
	this.shape_4.setTransform(103.8,103.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(0,255,255,0.122)").s().p("ArZLaQkukvAAmrQAAmqEukvQDUjUEXg/IARgEQAjgHAkgFIAPgCQA7gIA+gBIAOAAIAAAAQGrAAEvEuQEuEvAAGqQAAGrkuEvQkvEumrABQmqgBkvkugAgOwFQg+ABg7AIIgPACQgkAEgjAIIgRAEQkWA/jUDUQkuEuAAGpQAAGqEuEvQEvEuGpAAQGqAAEukuQEvkvAAmqQAAmpkvkuQkukvmqAAIAAAAIgOABg");
	this.shape_5.setTransform(103.8,103.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("rgba(0,255,255,0.349)").s().p("ArQLRQkrkrAAmmQAAmlErkrQDRjRERg/IARgDQAjgIAkgFIAPgCQA8gIA+gBIANAAQGmAAErErQErErAAGlQAAGmkrErQkrErmmAAQmlAAkrkrgAgNv5Qg+ABg8AIIgPACQgkAFgjAHIgRAEQkRA/jQDQIAAAAQkqErgBGkQABGlEqErIAAAAQErEqGkABQGlgBErkqIAAAAQEqkrABmlQgBmkkqkrIAAAAQkrkqmlAAIAAgBIgNABgAqkKlQkYkZAAmMQAAmLEYkYQC/i+D3g+IARgEQAjgIAkgFIAPgCQA9gIA/gBIABAAIABAAIABAAIAIgBQGMAAEZEZQEYEYAAGLQAAGMkYEZQkZEYmMAAQmLAAkZkYgAiHubIgPACQgkAGgjAIIgRAEQjuA8i3C3QkSESAAGCQAAGDESESQERERGCAAQGDAAESkRQERkSAAmDQAAmCkRkSQkSkRmDAAIAAAAIgGAAIgCAAIgCAAIgBAAQhAABg8AJg");
	this.shape_6.setTransform(103.8,103.8);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("rgba(49,240,67,0.663)").s().p("ArFLGQkmkmAAmgQAAmfEmkmQDMjMELg/IARgDQAjgIAkgFIAPgCQA8gIA/gBIAMgBQGgABEmEmQEmEmABGfQgBGgkmEmQkmEmmgABQmfgBkmkmgAgMvpQg/ABg8AIIgPACQgkAFgjAHIgRAEQkKA/jMDLQkmEmAAGeQAAGfEmEmQEmEmGeAAQGfAAEmkmQEmkmAAmfQAAmekmkmQkmkmmfAAIAAAAIgMABg");
	this.shape_7.setTransform(103.8,103.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("rgba(49,240,67,0.631)").s().p("ArGLHQknknAAmgQAAmfEnknQDMjNEMg+IARgEQAjgIAkgFIAPgCQA8gIA/gBIAMAAQGgAAEnEnQEnEnAAGfQAAGgknEnQknEnmgAAQmfAAknkngAgMvrQg/ABg8AIIgPACQgkAFgjAIIgRADQkLA/jMDMQkmEmAAGfQAAGgEmEmQEmEmGfABQGggBEmkmQEmkmABmgQgBmfkmkmQkmkmmggBIAAAAIgMABg");
	this.shape_8.setTransform(103.8,103.8);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("rgba(49,240,67,0.553)").s().p("ArJLKQkokoAAmiQAAmhEokoQDOjNENg/IARgEQAjgHAkgFIAPgCQA8gIA/gBIAMgBQGiAAEoEoQEoEoAAGhQAAGikoEoQkoEomiAAQmhAAkokogAgMvuQg/ABg8AHIgPACQgkAFgjAIIgRAEQkNA+jNDOQknEnAAGgQAAGhEnEoQEoEnGgAAQGhAAEoknQEnkoAAmhQAAmgknknQkokomhAAIAAAAIgMABg");
	this.shape_9.setTransform(103.8,103.8);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("rgba(49,240,67,0.522)").s().p("ArKLLQkokoAAmjQAAmiEokoQDOjOEOg/IARgDQAjgIAkgFIAPgCQA8gIA/gBIAMgBQGjABEoEoQEoEoABGiQgBGjkoEoQkoEomjAAQmiAAkokogAgMvwQg/ABg8AIIgPACQgkAFgjAHIgRAEQkNA/jODNQkoEoAAGhQAAGiEoEoQEoEoGhAAQGiAAEokoQEokoAAmiQAAmhkokoQkokomiAAIAAAAIgMABg");
	this.shape_10.setTransform(103.8,103.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("rgba(49,240,67,0.498)").s().p("ArLLMQkpkpAAmjQAAmiEpkpQDOjPEPg/IARgDQAjgIAkgFIAPgCQA8gIA+gBIANAAQGjAAEpEpQEpEpAAGiQAAGjkpEpQkpEpmjAAQmiAAkpkpgAgMvyQg/ABg8AIIgPACQgkAFgjAIIgRADQkOA/jODOQkoEoAAGiQAAGjEoEoQEoEoGiAAQGjAAEokoQEokoABmjQgBmikokoQkokomjgBIAAAAIgMABg");
	this.shape_11.setTransform(103.8,103.8);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("rgba(49,240,67,0.463)").s().p("ArMLOQkqkqAAmkQAAmjEqkpQDPjQEPg+IARgEQAjgIAkgFIAPgCQA8gHA+gBIANgBQGkAAEpEqQEqEpAAGjQAAGkkqEqQkpEpmkAAQmjAAkpkpgAgNv0Qg+ABg8AIIgPACQgkAFgjAIIgRADQkPA/jODPQkpEpAAGiQAAGjEpEpQEpEpGiAAQGjAAEpkpQEpkpAAmjQAAmikpkpQkpkpmjAAIAAAAIgNAAg");
	this.shape_12.setTransform(103.8,103.8);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("rgba(49,240,67,0.431)").s().p("ArOLPQkqkqAAmlQAAmkEqkqQDQjPEQg/IARgEQAjgHAkgFIAPgCQA8gIA+gBIANgBQGlAAEqEqQEqEqAAGkQAAGlkqEqQkqEqmlAAQmkAAkqkqgAgNv1Qg+ABg8AHIgPACQgkAFgjAIIgRAEQkPA+jPDQQkqEpAAGjQAAGkEqEqQEpEpGjAAQGkAAEpkpQEqkqAAmkQAAmjkqkpQkpkqmkAAIAAAAIgNABg");
	this.shape_13.setTransform(103.8,103.8);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("rgba(49,240,67,0.318)").s().p("ArRLSQkskrAAmnQAAmmEskrQDRjRESg/IARgEQAjgIAkgFIAPgCQA8gHA+gBIANgBQGnAAErEsQEsErAAGmQAAGnksErQkrEsmnAAQmmAAkrksgAgNv7Qg+ABg8AIIgPACQgkAFgjAIIgRADQkRA/jRDRQkrErAAGlQAAGmErErQErErGlAAQGmAAErkrQErkrAAmmQAAmlkrkrQkrkrmmAAIAAAAIgNAAg");
	this.shape_14.setTransform(103.8,103.8);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("rgba(49,240,67,0.298)").s().p("ArSLUQktksAAmoQAAmnEtksQDRjRETg/IARgEQAjgHAkgFIAPgCQA8gIA+gBIANgBQGoAAEsEsQEsEsAAGnQAAGoksEsQksEsmoAAQmnAAkrksgAgNv8Qg+ABg8AHIgPACQgkAFgjAIIgRAEQkSA/jRDRQksErAAGmQAAGnEsErQErEsGmAAQGnAAErksQEskrAAmnQAAmmkskrQkrksmnAAIAAAAIgNABg");
	this.shape_15.setTransform(103.8,103.8);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("rgba(49,240,67,0.263)").s().p("ArULVQksktgBmoQABmnEsktQDSjSEUg/IARgEQAjgHAkgFIAPgCQA7gIA+gBIAOAAQGoAAEtEsQEsEtAAGnQAAGoksEtQktEsmoABQmngBktksgAgNv+Qg+ABg8AIIgPACQgkAFgjAHIgRAEQkTA/jRDRQktEsAAGnQAAGoEtEsQErEsGnAAQGoAAEsksQEsksAAmoQAAmnksksQksksmoAAIAAAAIgNABg");
	this.shape_16.setTransform(103.8,103.8);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("rgba(49,240,67,0.231)").s().p("ArVLWQktktAAmpQAAmoEtktQDTjTEUg/IARgEQAjgHAkgFIAPgCQA8gIA9gBIAOAAQGpAAEtEtQEtEtAAGoQAAGpktEtQktEtmpAAQmoAAktktgAgOwAQg+ABg7AIIgPACQgkAFgjAHIgRAEQkUA/jSDSQksEtgBGnQABGoEsEtQEtEsGnABQGogBEtksQEsktAAmoQAAmnksktQktksmoAAIAAgBIgOABg");
	this.shape_17.setTransform(103.8,103.8);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("rgba(49,240,67,0.2)").s().p("ArWLXQkuktAAmqQAAmpEuktQDTjTEVhAIARgDQAjgIAkgFIAPgCQA7gHA+gBIAOgBQGqAAEtEuQEuEtAAGpQAAGqkuEtQktEumqAAQmpAAktkugAgOwCQg9ABg8AIIgPACQgkAFgjAHIgRAEQkUA/jTDTQktEtAAGoQAAGpEtEtQEtEtGoAAQGpAAEtktQEtktAAmpQAAmoktktQktktmpAAIAAAAIgOAAg");
	this.shape_18.setTransform(103.8,103.8);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("rgba(49,240,67,0.149)").s().p("ArYLZQkukvAAmqQAAmpEukuQDUjUEWg/IARgEQAjgIAkgEIAPgCQA7gIA+gBIAOgBQGqAAEuEvQEvEuAAGpQAAGqkvEvQkuEumqAAQmpAAkvkugAgOwDQg+ABg7AHIgPACQgkAFgjAIIgRADQkVBAjTDTQkuEtAAGpQAAGqEuEtQEtEuGpAAQGqAAEtkuQEuktAAmqQAAmpkuktQktkumqAAIAAAAIgOABg");
	this.shape_19.setTransform(103.8,103.8);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("rgba(49,240,67,0.086)").s().p("AraLbQkvkvAAmsQAAmrEvkvQDVjVEXg/IARgEQAjgHAkgFIAPgCQA7gHA+gCIAOAAIAAAAQGsAAEvEvQEvEvAAGrQAAGskvEvQkvEvmsAAQmrAAkvkvgAgOwHQg+ABg7AIIgPACQgkAFgjAHIgRAEQkXA/jUDUQkuEvAAGqQAAGrEuEvQEvEuGqABQGrgBEvkuQEukvAAmrQAAmqkukvQkvkumrAAIAAAAIAAgBIgOABg");
	this.shape_20.setTransform(103.8,103.8);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("rgba(49,240,67,0.063)").s().p("ArbLcQkwkvAAmtQAAmsEwkvQDVjWEYg/IARgEQAjgHAkgFIAPgCQA7gHA+gBIAOgBIAAAAQGtAAEvEwQEwEvAAGsQAAGtkwEvQkvEwmtAAQmsAAkvkwgAgOwJQg+ACg7AHIgPACQgkAFgjAHIgRAEQkXA/jVDVQkvEvAAGrQAAGsEvEvQEvEvGrAAQGsAAEvkvQEvkvAAmsQAAmrkvkvQkvkvmsAAIAAAAIAAAAIgOAAg");
	this.shape_21.setTransform(103.8,103.8);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("rgba(49,240,67,0.027)").s().p("ArcLeQkxkxAAmtQAAmsExkwQDVjWEZhAIARgDQAjgIAkgFIAPgCQA7gHA9gBIAPgBIAAAAQGtAAExExQEwEwAAGsQAAGtkwExQkxEwmtAAQmsAAkwkwgAgOwKQg+ABg7AHIgPACQgkAFgjAHIgRAEQkYA/jVDWQkwEvAAGsQAAGtEwEvQEvEwGsAAQGtAAEvkwQEwkvAAmtQAAmskwkvQkvkwmtAAIAAAAIAAAAIgOABg");
	this.shape_22.setTransform(103.8,103.8);

	this.addChild(this.shape_22,this.shape_21,this.shape_20,this.shape_19,this.shape_18,this.shape_17,this.shape_16,this.shape_15,this.shape_14,this.shape_13,this.shape_12,this.shape_11,this.shape_10,this.shape_9,this.shape_8,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0.1,207.7,207.7);


(lib.botaoParte2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AlhBaQgBgMABgXQgBgZABgLIgDhEIAAgBQgBgBAAAAQAAgBAAAAQAAAAABAAQABAAABABQAKgDAbABIAfABQAXABAPAQQAOANAAAWQgBAZgLAQQgPAPgXACIgMgBIgMABQgFAAABAEQgBAEACAJQgBAJACAGIgCACIgTABQgNgBgHABQgBAAgBAAQAAgBgBAAQAAgBAAAAQAAgBABAAgAk5gSQgCABABAWQgBACACAHQgBAGABAEQgBACAUAAQATgBACgWQgBgWgWAAIgKgBQgHAAAAACgAjaBYQgBAAgBgBQAAAAgBAAQAAgBAAAAQAAAAAAgBIABgiIABghQAAgqgCgXIAAgBQgBgBABAAQAAAAAAgBQABAAAAAAQABAAABABQACgCAaAAQARgBALABQAVABAOAKQANALABAWQgBALgCAKQgFAHgJAIQgBABgBAAQAAAAgBABQAAAAAAAAQAAABAAAAIAKAZIALAaIgCACIgQABIgQgBIgDAAIgBgCIgEgMIgLgcQgCgEgGAAIgJAAQgCAAABAGQgBAGACAOIABAUIgBACIgCABQgGgBgLACIgRgBgAi3gTQgBACABARQgBAAABAGIAAAGIADAAQAEACAIAAQASgBABgNQgBgOgGgEQgGgDgMAAQgJAAAAACgAhYBBQgSgTABgeQgBgcATgTQARgWAaACQAZAAASAUQAOAUABAbQgDAcgNATQgRAUgZADQgbgBgRgUgAhAgFQgJAHABAOQgBAPAJAKQAHAIANABQALgBAJgKQAHgLABgMQAAgPgHgGQgJgMgMAAIgCAAQgLAAgHAMgAAlBPIgPgBIAAgGIAAgGQgBgKACgCIANgVIAKgRIgKgQIgMgVQgBAAAAgBQgBAAAAAAQAAgBAAAAQAAgBABAAQgBgBAAAAQAAgBAAgBQAAAAAAgBQAAgBABAAIAAgFIAAgFIgBgGQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAABAAIAFABIAGAAIAEAAQABAAAAAAQABAAAAAAQABAAAAAAQABAAAAAAQABgBALASIAKASQABgBAKgRQAIgRADABIARAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIAAAUIgLAVQgMAPAAACIALARIAMAUIABAMIgBALIgFADQAAAAgBgBQAAAAAAAAQgBAAAAAAQgBABAAAAQgBgBgBAAQAAAAgBAAQAAAAAAAAQAAAAAAABQgDgBgDABQgBAAAAgBQgBAAgBAAQAAAAgBAAQAAABAAAAQgCgBgIgQIgKgRQgDABgIARQgLAPAAACIgHAAgAB5BNQgBgBgBAAQAAgBAAAAQAAgBgBAAQAAAAABgBIAAgPIACgvIAAgZIAAgdQgBgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIAHAAIAHABIAGAAIAHAAQAAAAAAAAQABAAAAAAQAAABAAAAQAAAAABABQgBAIAAAUQgCAPAAAKIAAAeIABAgIgBACIgBAAQgFAAgIACIgNAAgACiBKIAAgBQgBgKABgUIABgbIAAgkIAAgVIAAgBQgBgBABAAQAAAAAAAAQAAgBABAAQABAAABAAIALAAQAHgBAEABIADAEIATA0QABAFADAAIADgGQAGgRAOgjQAAAAABgBQAAgBAAAAQAAAAABAAQAAAAABAAIAFAAIAGABQABgBAEABIAFgBQAAAAAAAAQAAAAABAAQAAAAAAABQAAAAAAABIgBAeIAAAaQgBAIABASIABAbIgCADIgXAAQgBAAAAAAQgBAAAAgBQAAAAAAAAQgBgBABAAQgBgJACgQQgBgSACgHIgBgDQgCAAgIAaQgFAOgEAQIgCACIgCAAIgFgBIgIgaIgLgcQAAAAAAgBQAAAAAAAAQgBAAAAAAQAAAAAAABIAAACIAAAYIABAZIgCAEIgXABgAEbA3QgNgRABgZQgBgXAPgRQAMgSAUABQARAAAMASQAMAQAAAXQgBAYgMARQgNAPgRADQgTAAgNgRgAEtgFQgGAGABANQgBALAGAJQAFAHAJAAQAIAAAHgIQAFgKAAgKQAAgMgFgGQgGgKgIABIgBAAQgKAAgEAJgAg5g2QgBAAAAgBQgBAAAAAAQAAgBAAAAQAAAAAAgBQAAAAAAAAQAAgBAAAAQAAAAAAgBQAAAAABAAIAAgDIAAgDIgBgCQAAgBAAAAQAAgBAAAAQABAAAAgBQAAAAABAAQADgDANgHQAEgEALgHIACgBQAAAAAAAAQAAAAAAAAQABAAAAABQAAAAAAABIAGAFIAHAGIACACQgBAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQgHAHgPAGQgPAGgKACg");
	this.shape.setTransform(0,-1.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AmiBqQgBgOABgbQgBgeABgNIgDhQIAAgCQgDgDAGACQALgDAgABIAkABQAcACARATQARAPAAAaQgBAdgNATQgRATgcABIgOAAIgPAAQgFAAABAFQgBAFACALQgBAKACAHIgCADIgXABQgPgCgIACQgEgBABgDgAlygWQgCACAAAaQAAADACAHQgCAHACAFQgBADAXAAQAXgCACgaQgBgagaAAIgKgBQgKAAAAACgAkCBoQgBAAgBgBQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgoIACgoQAAgxgDgbIAAgCQAAgBAAAAQAAgBABAAQAAAAABAAQABAAABABQACgDAfABQAVgBANABQAYAAAQANQAQANABAZQgBAOgDALQgFAJgLAKQgBAAgBABQAAAAgBAAQAAABAAAAQAAABAAAAIAMAdIANAfIgDADIgTABIgTgBIgDgBIgBgCIgGgOIgMghQgDgFgHAAIgLAAQgBAAAAAHQAAAHABARIABAXIAAADIgDABQgHgBgNACIgUgBgAjYgWQgBACABAUQgBAAABAHIAAAHIADABQAFABAJAAQAWAAABgRQgCgQgHgEQgGgEgPAAQgLAAABADgAhoBNQgWgXABgjQAAghAWgXQAUgaAfADQAdAAAVAXQASAYAAAgQgDAhgPAXQgVAXgdADQggAAgUgYgAhMgGQgKAJABAQQgBARAKAMQAIAKAQABQANgBALgMQAIgNABgOQgBgRgIgIQgLgPgNABIgCAAQgNAAgJAOgAAsBeIgSgBIAAgIIAAgHQgBgMACgCIAPgZIANgUIgMgUIgPgYQAAAAgBgBQAAAAAAgBQgBAAAAgBQAAAAABgBQgBgDABgDIAAgFIAAgHIgBgGQAAgEADACQADgBAEABIAGAAIAGABQAAgBABAAQAAAAABAAQABAAAAAAQABAAAAABQABgBANAVQAKAUACAAIANgVQAKgTADAAIAUAAQAAAAABAAQABAAAAABQAAAAAAAAQABABAAABIAAAYIgNAZQgPASAAACIANAUIAOAXIABAPQgCAKABADIgFADQgBgBAAAAQAAAAgBAAQAAAAgBAAQgBAAAAABQgBgBgBAAQAAAAgBAAQAAAAAAAAQAAAAAAABQgEgBgDABQgEgBgCABQgCgBgKgTIgLgUQgDABgKAVQgNARAAADIgIAAgACPBbQgBgBgBAAQAAgBAAgBQgBAAAAAAQAAgBAAAAIABgSIACg4IAAgeIAAgiQgBgBAAAAQAAgBAAAAQAAAAABAAQAAAAABAAIAJAAIAHAAIAHAAIAJAAQAAAAAAAAQABABAAAAQAAAAABABQAAAAAAABQgBAJAAAYQgDATABALQgBAMABAXIABAmIgBACIgCAAQgGAAgIADIgQAAgADABYIAAgCQgCgMACgXIABggIgBgrIAAgYIAAgCQAAgBAAAAQAAAAABAAQAAgBABAAQABAAABAAIANgBQAJAAAEABQABgBACAFIAXA+QACAGACAAIAEgHQAHgVARgoQAAgBABgBQAAAAAAgBQABAAAAAAQABAAAAAAIAHAAIAGABQABgBAGABIAFgBQAAAAABAAQAAAAAAAAQAAAAABABQAAABAAABIgBAiQgCATABANQgBAJABAWIABAgQAAAAAAABQAAAAgBABQAAAAAAABQgBAAAAAAIgbAAQgBAAAAAAQgBAAAAgBQgBAAAAgBQAAAAAAgBQAAgKABgTQAAgVACgJIgBgDQgCAAgKAeQgGARgEATIgDACIgCAAIgHAAIgJggIgMggQgBgBAAAAQAAgBAAAAQAAAAgBABQAAAAAAAAIAAADIAAAdIACAdIgDAEIgcACgAFPBBQgQgUABgdQgBgcARgUQAPgVAXABQAUgBAPAWQAOATAAAcQgBAcgOAUQgQASgUADQgXAAgOgUgAFkgGQgHAIAAAOQgBANAHALQAGAJALAAQAKgBAHgJQAGgLABgMQgBgPgFgHQgHgMgJABIgBAAQgMAAgFALgAhEhAQgBAAAAgBQgBAAAAgBQAAAAAAAAQAAgBAAAAQAAgBAAAAQAAgBAAAAQAAAAAAgBQAAAAABAAIAAgDIAAgEIgBgDQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAABAAQADgDAPgIQAFgFANgIIACgCQAAAAAAAAQABAAAAAAQAAAAAAABQABAAAAABIAHAHIAHAGQABAAAAAAQAAAAABABQAAAAAAAAQAAABABAAQAAAAgBAAQAAAAAAAAQgBABAAAAQAAABgBABQgIAJgRAGQgSAIgLACg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("Ak9BQQgBgKABgVQgBgWABgKIgDg9IAAgBQAAgBAAAAQAAAAAAAAQAAAAABAAQAAAAABAAQAJgDAYACIAcAAQAUACAOAOQAMAMABATQgBAWgKAOQgNAOgVACIgLgBIgLABQgEAAAAADQAAAEABAIQAAAIABAFIgBADIgSAAQgLgBgGACQgBAAAAgBQgBAAAAgBQgBAAABgBQAAAAAAgBgAkZgQQgCABABATIABAIQgBAGABADQgBACASAAQARgBACgUQgBgTgUAAIgIgBQgHAAAAACgAjEBPQgBAAAAAAQgBgBAAAAQAAgBAAAAQgBAAAAgBIABgeIABgeQAAglgCgVIAAgBQAAgBAAAAQABAAAAgBQAAAAABAAQABAAAAABQACgCAXABQAQgBAKABQASAAAMAJQANAKAAAUQAAAKgDAIQgEAHgIAHQgBAAAAABQgBAAAAAAQAAABAAAAQAAAAAAABIAJAWIAJAYIgBABIgPABIgOgBIgDAAIgBgBIgEgLIgJgaQgCgDgGAAIgIAAQgBAAAAAFQAAAFABANIABASIAAACIgDABQgFgBgKACIgPgBgAikgRQgBACABAPQgBAAABAFIAAAFIACABQAEABAHAAQAQAAABgMQgBgNgGgDQgEgDgMAAQgIAAABACgAhPA6QgRgRABgbQAAgYAQgSQAQgTAXACQAXAAAQARQAMASABAYQgCAZgMASQgQASgWACQgYgBgPgSgAg5gFQgJAHABAMQgBANAIAJQAGAIAMABQAKgBAIgJQAHgKABgLQgBgNgGgGQgIgKgLAAIgBAAQgKAAgGAKgAAhBHIgOgBIAAgGIAAgFQAAgJABgCIAMgSIAJgQIgJgOIgLgTQAAAAgBAAQAAgBAAAAQAAAAAAgBQAAAAAAgBIAAgEIAAgEIAAgFIgBgFQAAgBABAAQAAgBAAAAQAAAAABAAQAAAAABAAIAFABIAFAAIAEAAIADAAQABgBAKAQQAIAQABAAIAJgQQAIgPACAAIAQAAQAAAAABAAQAAAAAAAAQABABAAAAQAAABAAAAIAAATIgKASQgLAOAAACIAKAOIAKASIABAMIgBAJIgEADQAAgBAAAAQAAAAgBAAQAAAAgBAAQAAAAgBABQAAgBgBAAQAAAAgBAAQAAAAAAAAQAAAAAAABQgBgBAAAAQgBAAgBAAQAAAAgBAAQAAAAgBABQgBgBAAAAQgBAAgBAAQAAAAAAAAQgBAAAAABQgCgBgHgOIgJgQQgDABgHAQIgKAPIgGAAgABsBFQgBgBAAAAQAAgBAAAAQgBAAAAgBQAAAAAAAAIABgOIABgqIAAgXIAAgaQAAAAAAgBQAAAAAAAAQAAAAAAAAQABAAAAAAIAHAAIAFAAIAGAAIAGAAQABAAAAAAQAAAAAAABQABAAAAAAQAAABAAAAQgBAHAAASQgCAOABAJIAAAaIABAdIgBACIgCAAQgEAAgHACIgMAAgACRBDIAAgCQgBgJABgSIABgYIAAggIAAgTIAAgBQAAAAAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIALgBQAGAAAEABIACADIARAuQABAFACAAIADgFQAFgQAOgfQAAAAAAgBQAAAAABAAQAAgBAAAAQABAAAAAAIAFAAIAFABQAAAAABAAQAAAAABAAQAAAAABAAQABAAABAAIAEAAQAAgBAAAAQABAAAAAAQAAABAAAAQAAABAAAAIgBAbIAAAXQgBAHABARIAAAYQAAABAAAAQAAAAAAABQAAAAAAAAQgBABAAAAIgUAAQgBAAAAgBQgBAAAAAAQAAAAgBgBQAAAAAAAAQAAgJABgOQAAgQABgGIAAgDQgCAAgHAXQgFANgDAOIgCACIgCAAIgFAAIgHgYIgKgZQAAgCAAACIAAABIAAAWIAAAXQAAAAAAABQAAAAAAABQgBAAAAABQAAAAgBAAIgUABgAD+AxQgMgPABgWQgBgVANgPQALgQASABQAPgBALAQQALAPAAAVQgBAVgLAPQgLAOgPACQgSAAgLgPgAEOgEQgFAFAAALQgBAKAGAIQAEAHAJAAQAHgBAGgGQAEgJAAgJQAAgLgEgFQgFgJgIAAIgBAAQgIAAgEAJgAg0gwQAAgBAAAAQgBAAAAgBQAAAAAAAAQAAgBAAAAIAAgCIAAgCIAAgEIAAgBQAAgBAAAAQAAgBAAAAQABAAAAgBQAAAAABAAQACgCAMgHQADgDAKgGIACgBQAAgBAAAAQABAAAAAAQAAABAAAAQAAABAAAAIAGAFIAGAFIABACQAAAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAABQgHAGgNAFQgOAGgIACg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[]},1).wait(1));

	// Layer 1
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#624017").s().p("Al1BpIgBgZIgBgVQBvABBugKQATgCAQgEIgHgBIgBAAQhkAJhkABQgZAAgXAFIgEhUQAhAKAjgDQgkAAgggKIgDhAQARAkBlABIBbABIDAABQBlABB4AFIB3AGIAYhqIgLC0QhbAOhfgCQg2gBg0AHQCPAGCPgMIAGgBIgCAlIroAAILoAAIgBAIQgDAggfgBImTASQACgHgBgJQgDgFgCgDIgBgBQgGANAAAMIkCAMIgGAAQghAAADgsg");
	this.shape_3.setTransform(0,15.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#714F1A").s().p("ADuDBQh4gGhkAAIjBgBIhagBQhmgCgQgkQgGgMAFgQIgEhnQBrACBqgCIAjgBIgBAAIgGgDIgCgBIgaABQhgABhdgNQgMgBgNABIgEhtIAGAAIABgGILyAAIryAAIAJgbIAAgJQACgsAbgDIC8AAIA+AcIADARIAAAAQAFABABgEIABgKIAIAEQAEgQAJgGIFKAZQgGAPgEAPIAAADQAEgHAHgGIAAgBIAHgTIBhAIIAAAkIAAAtIATgtIAHgSIgBASIgGAAIAGAAIgICFIh0gMQAIAJAXADQAsAFApgCIgEBIIgXBqIh4gGg");
	this.shape_4.setTransform(0.1,-9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#3F1D00").s().p("AmiEoIAAhAIArAAIABAZQgDAvAngEIECgLQAAgNAHgMIAAAAQADADACAGQABAIgBAHIGSgRQAgAAADgfIAAgIIAqAAIgqAAIACglIgFAAQiPAMiQgFQA0gIA2ACQBfACBcgOIAKi2IAEhGQgpACgsgFQgXgDgIgJIB0AMIAIiHIABgTIABgQQACgYgTgFIhhgHIgKAbIgHATIAAABQgHAGgEAGIAAgCQAEgPAGgPIALgbIlqgXQABAVgBAWIgBAKQgBAEgFgBIAAgBIgDgRQgCgUAGgTIkZgSQgbgBAFAdIADBVIgZAAIAAh5QABgPAOAAIMXAqQAeAEABAnIgBAzIgYAAIAYAAIgHG2IgBAYQAAAkgnABIroAyQgrgBgCgugAmiDoIAAm2IAZAAIABAGIAEBtQANgBAMABQBdAPBggBIAagBIACABIAGACIABABIgjABQhqAChrgCIAEBlQgFAQAGAMIADBAQAfAKAkAAQgiADghgJIADBVQAYgEAZgBQBkAABjgJIACAAIAGABQgQAEgSACQhvAJhvAAIABAVg");

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E3A77B").s().p("AFyAhIATAAIgTAAIAAgiIhhgHIAKgbIBhAGQATAFgCAYIgBAPIgHASIgTAugAmIAnIAAgGIgDhTQgFgdAaACIEaASQgGASACAVIg+gcIi9AAQgaADgCAsIgBAHIgIAbIgIAAIAIAAIgCAGgAhBghQgJAFgEAQIgIgEQAAgWgBgVIFqAXIgLAbg");
	this.shape_6.setTransform(0,-24);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFC99D").s().p("AGwgCIhxgIIALggIBxAHQAWAHgCAcIgBARIgeBMgAnJAvIgEhqQgGgiAfABIFJAVQgIAWACAZIhHghIjdAAQgfAEgCAzIAAAJIgMAogAhMgoQgLAHgEASIgKgEQABgagBgZIGmAbQgHAQgFAQg");
	this.shape_7.setTransform(0,-28.4);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#93713C").s().p("AEWDkQiMgHh1AAIjhgBIhqgBQh2gCgTgrQgHgOAGgTIgFh6QB9ACB8gCIAogBIgBgBQgEAAgDgCIgCgCIgeABQhwABhsgPQgPgBgPABIgFiBIAHAAIAMgnIAAgMQACgyAfgEIDcAAIBIAgQABAKACAKIABAAQAFACACgFIABgMIAKAEQAEgSAKgGIGBAcQgGASgEASIAAADQAEgHAIgHIABgCIAIgWIBxAIIAABhIAehLIgKC0IiIgPQAJALAbADQAzAGAxgCIgFBVIgcB9IiLgHg");
	this.shape_8.setTransform(0.1,-10.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#83612C").s().p("Am0B8IgCg2QCBABCBgMQAWgCATgFIgIgBIgCAAQh0ALh0AAQgeABgbAFIgEhjQAmAMApgEQgqAAglgMIgDhMQATArB2ACIBqABIDhABQB1ABCMAGICLAHIAbh9IgLDVQhrAQhvgCQg/gBg9AIQCoAHCngPIAGAAIgDA1QgDAmglgBInWAVQACgJgBgKQgDgGgEgEIAAAAQgHAPgBAOIksAOIgHAAQgnAAADg0g");
	this.shape_9.setTransform(0,17.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#3F1D00").s().p("AnoFeIAArhQABgRARgBIObAyQAjAFABAuIgKJfQgBAqgtACItlA7QgygBgCg3gAm0EwQgEA4AugFIEtgNQAAgPAHgPIABAAQADAEADAHQABAJgCAJIHWgVQAlABAEgmIACg1IgGABQinAOingGQA8gJA/ABQBvADBrgRIAMjXIAFhTQgxACgzgFQgbgEgJgKICIAOIAKi2IABgTQACgcgWgHIhxgHIgLAgIgIAWIgBABQgHAHgFAIIAAgDQAEgTAHgRQAFgQAIgQImngbQABAYgBAbIAAALQgCAGgGgCIAAAAQgDgLgBgJQgCgZAIgWIlJgVQgfgBAGAiIAEBsIAFCAQAPgBAPABQBsASBwgCIAfAAIABABQADACAEABIABAAIgoABQh8ADh9gDIAFB4QgFATAGAPIADBLQAlAMAqAAQgoAEgngMIAEBlQAbgFAeAAQB1gBB0gLIABAAIAIACQgTAEgVACQiBAMiCgBg");

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#624017").s().p("AlLBeIgBgpQBiABBigJQAQgCAPgDIgGgBIgCAAQhYAIhYAAQgXABgUAEIgEhLQAeAJAegDQggAAgcgJIgCg6QAOAhBbABIBQABICqABQBZAABrAFIBpAGIAVhgIgJCiQhRAMhUgBQgwgBguAGQB/AFB/gLIAFAAIgDAoQgCAcgcAAIllAQQACgHgBgHQgDgFgCgDIAAAAQgGALAAALIjlAKIgFABQgdAAACgog");
	this.shape_11.setTransform(0,13.6);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#714F1A").s().p("ADTCtQhqgFhZAAIirgBIhQgBQhagBgPghQgEgLAEgOIgEhdQBfACBegCIAfgBIgBAAIgGgCIgBgBIgXAAQhVABhSgLQgLgBgMABIgEhhIAGAAIAJgfIAAgIQACgnAXgCICoAAIA2AYIADAPIAAAAQAEACACgEIAAgJIAIADQADgOAIgFIEkAWIgJAbIAAADIAKgLIAAgBIAHgRIBVAGIAABKIAXg6IgICJIhngMQAHAIAVADQAmAEAlgBIgDBAIgVBfIhqgFg");
	this.shape_12.setTransform(0.1,-8.1);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#3F1D00").s().p("AmYFkIAaAAIgPABIgLgBgAktECQgdgEgCglIAAowQABgMANgBIK8AmQAbADABAkIgIHMQAAAggiABIqJAsgAkkC2QgDAqAigDIDlgKQAAgMAGgLIAAAAQADADACAFQABAHgBAHIFkgQQAcABADgdIACgoIgFAAQh/ALh/gFQAugGAwABQBUABBRgMIAJiiIAEhAQglACgngFQgUgCgHgIIBnALIAIiKIABgPQABgVgRgFIhVgGIgJAYIgGARIgBABIgJALIAAgCIAIgbIAKgZIlAgUIAAAmIgBAJQgBAEgFgBIAAAAIgCgPQgCgTAGgRIj6gQQgYgBAFAaIADBSIAEBiQALgBAMABQBSANBVgBIAXgBIABABIAGACIABABIgfABQhfAChfgCIAEBcQgEAPAFAJIACA5QAdAJAgAAQgfADgegJIAEBNQAUgEAXgBQBZAABYgIIABAAIAGABQgOADgRACQhiAJhigBg");
	this.shape_13.setTransform(-3.8,4.9);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#E3A77B").s().p("AFIgBIhWgHIAJgYIBVAGQARAFgBAVIgBANIgXA5gAlbAjIgDhQQgFgaAYACID6AQQgGAQACATIg3gZIinAAQgYADgBAnIgBAGIgJAegAg6geQgIAFgDAOIgHgDIAAgnIFAAVIgKAYg");
	this.shape_14.setTransform(0,-21.5);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#624017").s().p("Al1BpIgCguQBvABBugKQATgCAQgEIgHgBIgBAAQhkAJhkABQgZAAgXAFIgEhUQAhAKAjgDQgkAAgggKIgDhAQARAkBlABIBbABIDAABQBlABB4AFIB3AGIAYhqIgLC0QhbAOhfgCQg2gBg0AHQCPAGCPgMIAGgBIgDAtQgDAggfgBImTASQACgHgBgJQgDgFgCgDIgBgBQgGANAAAMIkCAMIgGAAQghAAADgsg");
	this.shape_15.setTransform(0,15.2);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#714F1A").s().p("ADuDBQh4gGhkAAIjBgBIhagBQhmgCgQgkQgGgMAFgQIgEhnQBrACBqgCIAjgBIgBAAIgGgDIgCgBIgaABQhgABhdgNQgMgBgNABIgEhtIAGAAIAKghIAAgJQACgsAbgDIC8AAIA+AcIADARIAAAAQAFABABgEIABgKIAIAEQAEgQAJgGIFKAZQgGAPgEAPIAAADQAEgHAHgGIAAgBIAHgTIBhAIIAABRIAag/IgJCXIh0gMQAIAJAXADQAsAFApgCIgEBIIgXBqIh4gGg");
	this.shape_16.setTransform(0.1,-9);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#3F1D00").s().p("AmiEoIAApvQABgPAOAAIMXAqQAeAEABAnIgJIBQAAAkgnABIroAyQgrgBgCgugAl2EBQgDAvAngEIECgLQAAgNAHgMIAAAAQADADACAGQABAIgBAHIGSgRQAgAAADgfIACgtIgFAAQiPAMiQgFQA0gIA2ACQBfACBcgOIAKi2IAEhGQgpACgsgFQgXgDgIgJIB0AMIAJiaIABgQQACgYgTgFIhhgHIgKAbIgHATIAAABQgHAGgEAGIAAgCQAEgPAGgPIALgbIlqgXQABAVgBAWIgBAKQgBAEgFgBIAAgBIgDgRQgCgUAGgTIkZgSQgbgBAFAdIAEBbIAEBtQANgBAMABQBdAPBggBIAagBIACABIAGACIABABIgjABQhqAChrgCIAEBlQgFAQAGAMIADBAQAfAKAkAAQgiADghgJIADBVQAYgEAZgBQBkAABjgJIACAAIAGABQgQAEgSACQhvAJhvAAg");

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#E3A77B").s().p("AFygBIhhgHIAKgbIBhAGQATAFgCAYIgBAPIgaBAgAmIAnIgDhZQgFgdAaACIEaASQgGASACAVIg+gcIi9AAQgaADgCAsIgBAHIgKAhgAhBghQgJAFgEAQIgIgEQAAgWgBgVIFqAXIgLAbg");
	this.shape_18.setTransform(0,-24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7}]},1).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.8,-34.3,83.9,68.8);


(lib.botaoParte1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("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");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("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");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AExBCIgRAAIgCgBIgBgCIgFgMIgKgbQgDgEgGAAIgJAAQAAAAgBAAQAAAAAAABQAAAAgBABQAAABABABQgBAGACANIABAUIgBABIgCAAIgRAAIgPgBQgBAAAAAAQAAAAgBgBQAAAAAAgBQAAAAAAgBQgBgKABgUIABgeIgBg7IAAgCQAAAAAAAAQABgBAAAAQABAAAAAAQABAAABAAQAAgCAZgBIAcgBQAVgBAOAJQAPALAAAWQAAANgDAKQgFAFgKAIQgBABgBAAQAAAAgBAAQAAABAAAAQAAABAAAAIAMAYQALAZAAADIgCAAIgGABIgMgBgAD7gjIAAASIAAAHIAAAGIACABIANABQATAAABgQQAAgNgIgDQgGgEgMABIgDAAQgGAAAAACgACPA/QgYgBgPgSQgQgTABgZQgBgZAQgTQAPgVAYAAQAagBASAUQARATAAAbQAAAbgRATQgSARgYAAIgCAAgACPggQgLAAgHALQgIAJABAMQgBAMAIAJQAGAJAMABQANgBAIgJQAHgKAAgLQAAgNgHgJQgIgKgLAAIgCAAgABLA6IgNAAIgOgBQAAAAgBAAQAAAAAAgBQgBAAAAAAQAAgBAAgBIABgOIABgrIgBgaIAAgcQAAAAAAAAQAAAAABAAQAAAAAAAAQABgBAAAAIAGAAIAHAAQACgBAGABIAHAAQAAAAAAAAQABAAAAAAQAAAAAAAAQABAAAAAAIgBAcQgCASABAJIAAAcIABAfIgBACIgCAAgAAYA5IgNgBIgCgBIgBgBIgCgKIgHgYQgBgEgFABIgGAAQAAAAgBAAQAAAAAAABQgBAAAAABQAAABAAABQAAAFACALIAAARIAAABIgCAAIgNAAIgLgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgbIABgZQAAghgBgTIAAgBQAAAAAAAAQAAgBABAAQAAAAAAAAQABAAABAAIATgCIATgBQAPgBALAJQALAJAAATQAAALgDAIQgDAFgIAGQgBABAAAAQAAAAAAAAQgBABAAAAQAAABAAAAIAIAVIAJAXIgBABIgNAAgAgIggQgGAAgBACIAAAQIAAAFIAAAFIACACIAJAAQAMAAAAgOQAAgLgFgCQgDgDgEAAIgEAAgAg4A2IgagBQgHgBgIABIgNgBQgBAAgBAAQAAgBAAAAQgBAAAAAAQAAgBAAAAIABgaIABgYIgBggIgBgRIAAgCQAAAAAAAAQAAgBABAAQAAAAAAAAQABAAAAAAIANgBIAOAAIANgBIAOAAQABAAABAAQAAAAABAAQAAABABAAQAAABAAAAIABAMIABALIgCACIAAgBIgfgBQgBAAAAAAQgBAAAAABQgBAAAAAAQAAABgBAAIAAAGQAAAFABACQAAAAABABQAAAAABAAQAAABABAAQABAAABAAIACgBIACAAIAQgBIAEAAQABAAAAAAQABAAAAgBQABAAAAAAQAAAAABAAQAAAAAAAAQAAAAAAABQABAAAAAAQAAABAAAAIAAAMIgBALQgBAAAAABQAAAAAAAAQgBAAAAAAQgBAAAAAAIgFAAIgRgBIgGgBQgBAAAAABQgBAAAAAAQgBAAAAABQAAAAAAABIAAAFIAAAHQACADAGAAIAJABIAKgBQAHgBADAAQABAAAAABQAAAAAAAAQABABAAAAQAAABAAABIgBAMQgBAKgCACIgBABIgCgBgAifAyQAAAAgBgBQAAAAgBAAQAAAAAAgBQAAAAAAgBIABgZIAAgYIAAgaQgLACgHAAQgBAAAAAAIABgGIABgGIABgHQAAgGABABIAAAAQAJABASgBIATgCIAIgBIABABIABABIAAAGIgBAEIABAHIABAFQgBAAAAABQAAAAAAAAQAAABgBAAQAAAAgBAAIgRgCIgBAbIACAYIAAAbIAAABIgCAAIgKABIgKgBgAi/AxIgEAAIgEAAIgEAAIgCgDIgRgfIgLgRIAAgBIgBABIABAXIAAAYIgCACIgRAAQAAAAgBAAQAAgBAAAAQAAAAAAAAQAAgBAAAAIAAgXIABgWIgBgWIAAgXQAAgBAAAAQAAAAAAAAQAAgBABAAQAAAAABAAIAHgBIAEgBQAAAAABAAQAAgBABAAQAAAAABAAQAAAAABAAIAVAmIAIANIACABIAAgDIAAgWIgBgXQAAAAAAgBQAAgBAAAAQAAAAAAgBQABAAAAAAIAJAAIAKAAQABAAAAAAQAAAAAAAAQABAAAAAAQAAABAAAAIgBAZIgBAXIAAAvIgBACIgEAAgAkWAuQAAAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAgBIgDgKIgNgBQgIgBgBABIgBAHQgBAGAAAAIgLAAIgHgBIAKgrIAMguIABgDIAEAAIAEAAIAFAAQAAAAAAAAQABAAAAAAQABAAAAAAQABAAAAAAIABACQACAGAMApIALAsIgBABIgJABIgJgBgAkogCIgCAKQAAAAAAABQAAAAABAAQAAAAAAAAQABAAAAAAIAGAAIADgBIAAgBIgCgKQgCgKgCgCIgDANg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[]},1).wait(1));

	// Layer 1
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#624017").s().p("AFSCVIkCgMQAAgMgGgNIgBABQgCADgDAFQgBAJACAHImTgSQgfABgDggIgDgtIAGABQCPAMCPgGQg0gHg2ABQhfAChbgOIgLi0IAYBqIB3gGQB4gFBlgBIDAgBIBbgBQBlgBARgkIgDBAQggAKgkAAQAjADAhgKIgEBUQgXgFgZAAQhkgBhkgJIgBAAIgHABQAQAEATACQBuAKBvgBIgCAuQADAsghAAIgGAAg");
	this.shape_3.setTransform(0,15.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#714F1A").s().p("Al8BdIgEhIQApACAsgFQAXgDAIgJIh0AMIgJiXIAaA/IAAhRIBhgIIAHATIAAABQAHAGAEAHIAAgDQgEgPgGgPIFKgZQAJAGAEAQIAIgEIABAKQABAEAFgBIAAAAIADgRIA+gcIC8AAQAbADACAsIAAAJIAKAhIAGAAIgEBtQgNgBgMABQhdANhggBIgagBIgCABIgGADIgBAAIAjABQBqACBrgCIgEBnQAFAQgGAMQgQAkhmACIhaABIjBABQhkAAh4AGIh4AGg");
	this.shape_4.setTransform(0,-9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#3F1D00").s().p("AlyElQgngBAAgkIgJoBQABgnAegEIMXgqQAOAAABAPIAAJvQgCAugrABgABKEIQAHAMAAANIECALQAnAEgDgvIACguQhvAAhvgJQgSgCgQgEIAGgBIACAAQBjAJBkAAQAZABAYAEIADhVQghAJgigDQAkAAAfgKIADhAQAGgMgFgQIAEhlQhrAChqgCIgjgBIABgBIAGgCIACgBIAaABQBgABBdgPQAMgBANABIAEhtIAEhbQAFgdgbABIkZASQAGATgCAUIgDARIAAABQgFABgBgEIgBgKQgBgWABgVIlqAXIALAbQAGAPAEAPIAAACQgEgGgHgGIAAgBIgHgTIgKgbIhhAHQgTAFACAYIABAQIAJCaIB0gMQgIAJgXADQgsAFgpgCIAEBGIAKC2QBcAOBfgCQA2gCA0AIQiQAFiPgMIgFAAIACAtQADAfAgAAIGSARQgBgHABgIQACgGADgDIAAAAIAAAAg");

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E3A77B").s().p("AmLAPIgBgPQgCgYATgFIBhgGIAKAbIhhAHIAABQgAGDAnIgKghIgBgHQgCgsgagDIi9AAIg+AcQACgVgGgSIEagSQAagCgFAdIgDBZgAkSgkIFqgXQgBAVAAAWIgIAEQgEgQgJgFIlJAYIgLgbg");
	this.shape_6.setTransform(0.1,-24);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFC99D").s().p("AnNARIgBgRQgCgcAWgHIBxgHIALAgIhxAIIAABfgAHDAvIgMgoIAAgJQgCgzgfgEIjdAAIhHAhQACgZgIgWIFJgVQAfgBgGAiIgEBqgAlAgrIGmgbQgBAZABAaIgKAEQgEgSgLgHImBAdQgFgQgHgQg");
	this.shape_7.setTransform(0.1,-28.4);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#93713C").s().p("Am8BuIgFhVQAxACAzgGQAbgDAJgLIiIAPIgKi0IAeBLIAAhhIBxgIIAIAWIABACQAIAHAEAHIAAgDQgEgSgHgSIGCgcQAKAGAEASIAKgEIABAMQACAFAFgCIABAAQACgKABgKIBHggIDdAAQAfAEACAyIAAAMIAMAnIAHAAIgFCBQgPgBgPABQhsAPhwgBIgegBIgCACQgDACgEAAIgBABIAoABQB8ACB9gCIgFB6QAGATgHAOQgTArh2ACIhqABIjhABQh1AAiMAHIiLAHg");
	this.shape_8.setTransform(0,-10.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#83612C").s().p("AGKCwIktgOQAAgOgHgPIAAAAQgEAEgDAGQgBAKACAJInWgVQglABgDgmIgDg1IAGAAQCnAPCogHQg9gIg/ABQhvAChrgQIgLjVIAbB9ICLgHQCMgGB1gBIDhgBIBqgBQB2gCATgrIgDBMQglAMgqAAQApAEAmgMIgEBjQgbgFgegBQh0AAh0gLIgCAAIgIABQATAFAWACQCBAMCBgBIgCA2QADA0gnAAIgHAAg");
	this.shape_9.setTransform(0.1,17.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#3F1D00").s().p("AmwFbQgtgCgBgqIgKpfQABguAjgFIObgyQARABABARIAALhQgCA3gyABgABXE4QAHAPAAAPIEtANQAuAFgEg4IADg3QiCABiBgMQgVgCgTgEIAIgCIABAAQB0ALB1ABQAeAAAbAFIAEhlQgnAMgogEQAqAAAlgMIADhLQAGgPgFgTIAFh4Qh9ADh8gDIgogBIABAAQAEgBADgCIABgBIAfAAQBwACBsgSQAPgBAPABIAFiAIAEhsQAGgigfABIlJAVQAIAWgCAZQgBAJgDALIAAAAQgGACgCgGIAAgLQgBgbABgYImnAbQAIAQAFAQQAHARAEATIAAADQgFgIgHgHIgBgBIgIgWIgLggIhxAHQgWAHACAcIABATIAKC2ICIgOQgJAKgbAEQgzAFgxgCIAFBTIAMDXQBrARBvgDQA/gBA8AJQinAGingOIgGgBIACA1QAEAmAlgBIHWAVQgCgJABgJQADgHADgEIABAAIAAAAg");

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#624017").s().p("AEsCFIjlgKQAAgLgGgLIAAAAQgCADgDAFQgBAHACAHIllgQQgcAAgCgcIgDgoIAFAAQB/ALB/gFQgugGgwABQhUABhRgMIgJiiIAVBgIBpgGQBrgFBZAAICqgBIBQgBQBbgBAOghIgCA6QgcAJggAAQAeADAegJIgEBLQgUgEgXgBQhYAAhYgIIgCAAIgGABQAPADAQACQBiAJBigBIgBApQACAogdAAIgFgBg");
	this.shape_11.setTransform(0.3,13.6);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#714F1A").s().p("AlRBTIgEhAQAmABAngEQAUgDAHgIIhoAMIgIiJIAYA6IAAhKIBVgGIAHARIAAABIAKALIgBgDIgIgbIEkgWQAIAFADAOIAIgDIAAAJQACAEAEgCIABAAIACgPIA2gYICoAAQAXACACAnIAAAIIAJAfIAFAAIgDBhQgMgBgLABQhSALhVgBIgYAAIAAABIgGACIgBAAIAfABQBeACBfgCIgEBdQAEAOgFALQgOAhhaABIhQABIirABQhZAAhqAFIhqAFg");
	this.shape_12.setTransform(0.2,-8.1);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#3F1D00").s().p("AFAE0IqIgsQgigCAAggIgInMQABgjAagEIK9gmQAMABABANIAAIvQgBAlgeAFgABHEEIDlAKQAjADgDgqIACgpQhjAAhigJQgQgBgOgEIAGgBIABAAQBYAIBZABQAWAAAVAEIADhNQgdAJgfgDQAgAAAcgJIACg5QAFgLgEgPIAEhaQhfAChegCIgfgBIABAAIAGgCIABgCIAXABQBVABBSgNQALgBAMABIADhiIAEhSQAEgagYABIj5AQQAFARgBATIgCAPIgBAAQgEABgCgEIAAgJIAAgmIlBAVIAKAYIAIAbIABACIgKgLIAAgBIgHgRIgIgYIhWAGQgRAFACAVIAAAPIAICKIBogLQgHAIgUACQgnAFgmgCIAEA/IAJCjQBSANBUgCQAwgBAuAGQiAAFh/gKIgEgBIACAoQADAdAbgBIFlAQQgBgGABgIQACgFADgCIAAgBQAFAMAAALg");
	this.shape_13.setTransform(0.3,0);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#E3A77B").s().p("AleANIgBgNQgBgVARgFIBVgGIAJAYIhWAHIAABHgAFXAjIgJgeIgBgGQgBgngYgDIinAAIg3AZQACgTgGgQID6gQQAYgCgFAaIgDBQgAjzggIFAgVIAAAnIgHADQgDgOgIgFIkkAWIgKgYg");
	this.shape_14.setTransform(0.4,-21.5);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#624017").s().p("AFSCVIkCgMQAAgMgGgNIgBABQgCACgDAGQgBAJACAHImTgSQgfABgDggIgDgtIAGABQCPAMCPgGQgzgHg3ABQhfAChbgOIgLi0IAYBqQA+gEA5gCQB4gFBlgBIDAgBIBbgBQBlgBARgkIgDBAQggAKgkAAQAjADAhgKIgEBUQgXgFgZAAQhkgBhkgJIgBAAIgHABQAQAEATACQBuAKBvgBIgCAuQADAsghAAIgGAAg");
	this.shape_15.setTransform(0,15.2);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#714F1A").s().p("Al8BdIgEhIQAqACArgFQAYgDAHgJQg6AFg6AHIgJiYIAaBAIAAhSIBhgHIAHATIAAABQAHAGAEAGIAAgCQgEgQgGgOIFKgZQAJAGAEAPIAIgDIABAKQABAEAFgBIAAgBQADgIAAgJIA+gbIC8AAQAbADACArIAAAKIAKAhIAGAAIgEBtQgNgBgMABQhdANhggBIgagBIgCABIgGACIgBABIAjABQBqACBrgCIgEBnQAFAQgGAMQgQAkhmACIhaABIjBABQhkAAh4AGQg6ACg+AEg");
	this.shape_16.setTransform(0,-9);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#3F1D00").s().p("AlyElQgngBAAgkIgJoBQABgnAegEIMXgqQAOAAABAPIAAJvQgCAugrABgABREhIECALQAnAEgDgvIACguQhvAAhvgJQgSgCgQgEIAGgBIACAAQBjAJBkAAQAaABAXAEIADhVQghAJgigDQAkAAAfgKIADhAQAGgMgFgQIAEhlQhrAChqgCIgjgBIABgBIAGgCIACgBIAaABQBgABBdgPQAMgBANABIAEhtIAEhbQAFgdgbABIkZASQAGATgCAUQAAAJgDAIIAAABQgFABgBgEIgBgKIAAgrIlqAXQAHANAEAOQAGAOAEAQIAAACQgEgGgHgGIAAgBIgHgTIgKgbIhhAHQgTAFACAYIABAQIAJCaQA6gHA6gFQgHAJgYADQgrAFgqgCIAEBGIAKC2QBcANBfgBQA2gCA0AIQiQAFiPgMIgFAAIACAtQADAfAgAAIGSARQgBgHABgIQACgGADgDIAAAAQAHAMAAANg");

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#E3A77B").s().p("AmLAPIgBgPQgCgYATgFIBhgGIAKAbIhhAHIAABQgAGCAoIgKgiIAAgHQgCgrgbgDIi8AAIg+AbQACgVgGgSIEZgSQAbgCgFAdIgEBagAkTgkIFqgXIAAArIgIAEQgEgQgJgFIlKAYQgEgOgHgNg");
	this.shape_18.setTransform(0.1,-24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7}]},1).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.8,-34.3,83.8,68.8);


(lib.botaoJogar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AkwB5IgQgRIgUgRIgBgDQAAgBAAAAQAAgBAAAAQAAAAABAAQAAAAAAAAIAOgPQAGgHADgKQAEgQABghQgBhLgFgrIAAgCQAAgBAAAAQAAgBABAAQAAgBABAAQAAAAABAAIACAAIAOACIANABIANABIAOgBQADAAAAAEIgBA9IAAA7QAAAlgGAUQgLAkgXAWIgFADIAAAAQAAAAAAAAQgBAAAAAAQAAgBAAAAQgBAAAAgBgAjOA5QgcgeAAgqQAAguAcgdQAbgeAoACQAlACAaAeQAYAdAAArQAAAngYAdQgZAdgmACIgDAAQgmAAgagcgAiqgzQgMAPAAAVQgBATAMAOQANAPATAAQARgBANgPQALgOABgSQgBgUgLgPQgMgQgSAAIgBAAQgSAAgMAPgAgRA0QgXgaABgnQgBgrAWgaQAUgcAiACQAQABAOAJQAPAIAIAPIACAEQAAAEgJAOQgJANgDABIgFgGQgEgGgGgDQgJgGgJgBQgRAAgJAOQgJANAAAVQABASAIAMQAKANASAAQAKAAAOgHIgCgVQgCgMABgHQAAgBAAgBQAAAAAAgBQAAAAAAAAQABAAAAAAIACAAIAJABIAJAAIAJAAIAKgBQADAAgBAFIgBAQIAAASIACAvIAAABQABAAgBABQAAABAAAAQgBABAAAAQgBAAgBAAIgLgCIgKgDQgXAKgUABIgEAAQgfAAgSgYgABtBEQgBgEAXhJIAZhWQABgFACAAIAHABIAIACIAIgBIAHAAQABAAACAEIAaBVIAUBIQAAAAAAAAQAAABgBAAQAAABAAAAQgBAAAAABIgQABQgNABgEgBQgDgBAAgFIgFgRIgYAAQgQAAgBABQgCACgCAMQgCAJgCABQgEABgSABIgEAAQgLAAAAgDgACpgSQgFASAAACQgBACAGAAIAKAAQAGAAAAgBIAAgCQAAgDgEgRIgGgWQgCAFgEASgAD5BBQgBAAAAgBQgBAAAAAAQAAgBAAAAQAAgBgBAAIABgmIABgkQAAgvgCgcIAAgBQAAgBABAAQAAgBAAAAQABAAAAgBQABAAABAAQACgBAXABIAYABQASAAALANQAMANAAAXQAAAQgDAJQgDAJgJAIQAAAAgBAAQAAABAAAAQgBAAAAABQAAAAABABIAJAbIAJAeIgBABIgPABIgOAAIgCgBIgBgCIgDgMIgKghQgCgFgFABIgIAAQgCAAABAFIABAXIABAXIgBACIgCAAIgQACIgOgBgAEYg3IgBAWIAAAHIAAAIIADACIAKABQARAAABgTQAAgOgHgFQgFgFgKAAIgCAAQgGAAAAADg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AlkCOIgTgUIgXgUIgCgEQAAgBAAAAQAAAAABgBQAAAAAAAAQAAAAABAAIAQgRQAHgJAEgMQAFgSAAgnQAAhYgGgyIAAgDQgBgDAEAAQAAAAABAAQAAAAAAAAQAAAAABAAQAAAAABAAIAPABQALABAFABIAQABIAPgBQAEABAAAFIgBBHIAABGQAAApgGAYQgOArgbAaIgFADQgBAAAAAAQgBAAAAAAQAAgBAAAAQgBgBAAAAgAjxBEQgigkABgyQgBg2AigiQAfgjAvADQAsACAdAkQAdAhAAAyQAAAvgdAgQgcAkgtACIgEAAQgtAAgdgggAjHg9QgPATAAAYQAAAXAOARQAOAQAXAAQAUAAAPgSQANgRABgVQgBgYgNgRQgOgTgVAAIgBAAQgVAAgOARgAgUA9QgbgfABguQgBgyAagfQAYggAoADQASAAARAKQARALAJARIACAFQAAAFgKAQQgLAPgDABIgFgHQgGgIgGgDQgLgHgKAAQgUgCgLASQgKAPAAAYQAAAWALAOQAKAQAWgBQALgBARgHIgCgZQgCgOAAgJQAAgBAAAAQAAgBAAAAQABgBAAAAQAAAAABgBIACAAIAKACIALAAIALAAIALgBQADAAAAAGIgBASIAAAWQAAASACAlIABABQAAAEgEAAIgNgCIgNgFQgaANgXACIgFAAQglAAgVgdgACABPQgBgDAbhWIAdhmQABgGACABQADgBAGACIAJABIAJAAIAIAAQACAAACAFIAeBjIAYBUIgCAFIgTABQgPAAgFAAQgEgBABgGIgGgVIgcABQgUAAgBACQgCABgCAOQgCAKgDACQgEACgWAAIgFAAQgNAAABgEgADGgVQgGAUAAADQgBACAHABIALAAQAHAAABgCIABgDIgGgWIgHgZQgDAEgEAWgAEkBMQgDgBAAgDIABgrIABgsIgChWIAAgDQAAgDAEABQADgCAaABQARAAALABQAVABAOAOQAOAPAAAbQAAATgDALQgFAKgKAJQgBABAAAAQgBABAAAAQAAABAAAAQAAABAAAAIALAgIALAjIgCABIgRABIgQABIgDgBIgBgCIgEgPIgLgnQgCgEgGgBIgKABQgCAAABAGQgBAJACASIABAaQAAABAAAAQAAABAAAAQAAAAgBABQAAAAAAAAIgCAAIgTACIgQgBgAFIhAIgBAZIAAAJIAAAIIAEADIALABQAUAAABgXQAAgQgIgFQgGgFgLgBIgEAAQgGAAAAAEg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AkFBpIgPgQIgRgOIgBgDQAAAAAAgBQAAAAAAAAQABgBAAAAQAAAAAAAAIANgNQAEgGAEgIQADgOAAgcQAAhBgFgkIAAgDQAAAAAAgBQABAAAAgBQAAAAABAAQAAAAABAAQAAAAAAAAQAAAAABAAQAAAAAAAAQABAAAAAAIALABIALABIANABIALgBQABAAAAABQABAAAAAAQAAABAAABQAAABAAABIAAA0IAAAzQAAAfgEASQgKAfgVATIgEACQAAAAAAAAQAAAAgBAAQAAgBAAAAQAAAAAAAAgAixAyQgYgbAAgkQAAgnAYgaQAXgZAjACQAfABAXAbQAUAZABAkQgBAigUAYQgVAaghABIgDABQghAAgWgYgAiSgsQgLANAAASQAAARAKAMQALAMARAAQAOAAALgNQAJgNACgPQgCgSgJgMQgJgNgQAAIgBgBQgPAAgLANgAgPAtQgTgXAAghQAAglATgXQARgYAeACQANABAMAHQANAIAHANIACADQAAAEgIAMQgIALgCAAIgEgEQgEgGgFgDQgIgEgHgBQgQgBgHAMQgIAMAAASQABAPAHALQAIALAQAAQAIgBAMgFIgBgTQgCgKABgGQgBAAAAgBQAAAAABgBQAAAAAAAAQAAAAABAAIABAAIAIAAIAIABIAIAAIAIgBQABAAAAAAQABAAAAABQAAABAAAAQABABAAABIgBANIAAAQIABAoIABABQAAABgBABQAAAAAAABQgBAAAAAAQgBABAAAAIgKgCIgJgEQgTAKgRABIgDAAQgcAAgQgVgABfA6QgCgDAVg+IAVhKQAAgCAAgBQABgBAAAAQAAgBAAAAQABAAAAAAQACAAAFABIAHABIAGgBIAGAAQAAAAABABQAAAAAAAAQAAABABABQAAABAAABIAXBIIASA+IgCADIgOABQgLABgDgCQgEAAABgEIgEgQIgVABIgPABQgCABgCALQgBAHgCACIgTABIgDAAQgKAAABgDgACRgPIgDAQQgBACAFAAIAIAAQAGAAAAgBIABgCIgFgQIgFgTQgCAEgEAQgADXA4QgBAAAAgBQAAAAgBAAQAAgBAAAAQAAgBAAAAIABggIAAgfIgBhAIAAgCQAAAAAAgBQAAAAAAgBQABAAAAAAQABAAABAAQABgBAUAAIAVABQAPABAKAKQALAMAAAUQAAAOgDAHQgDAIgIAGQAAABAAAAQgBAAAAABQAAAAAAAAQAAABAAAAIAIAXIAIAaIgBABIgNABIgLAAIgCAAIgBgCIgDgKIgJgdQgBgEgEAAIgIAAQAAAAAAABQgBAAAAAAQAAABAAABQAAABABABIAAAUIABAUIgBABIgBAAIgOABIgMAAgADygvIgBATIAAAGIAAAGIACACIAJABQAPAAABgQQAAgMgHgEQgEgFgIAAIgCAAQgGAAABADg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[]},1).wait(1));

	// Layer 1
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#624017").s().p("Al1BpIgBgZIgBgVQBvABBugKQATgCAQgEIgHgBIgBAAQhkAJhkABQgZAAgXAFIgEhUQAhAKAjgDQgkAAgggKIgDhAQARAkBlABIBbABIDAABQBlABB4AFIB3AGIAYhqIgLC0QhbAOhfgCQg2gBg0AHQCPAGCPgMIAGgBIgCAlIroAAILoAAIgBAIQgDAggfgBImTASQACgHgBgJQgDgFgCgDIgBgBQgGANAAAMIkCAMIgGAAQghAAADgsg");
	this.shape_3.setTransform(0,15.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#714F1A").s().p("ADuDBQh4gGhkAAIjBgBIhagBQhmgCgQgkQgGgMAFgQIgEhnQBrACBqgCIAjgBIgBAAIgGgDIgCgBIgaABQhgABhdgNQgMgBgNABIgEhtIAGAAIABgGILyAAIryAAIAJgbIAAgJQACgsAbgDIC8AAIA+AcIADARIAAAAQAFABABgEIABgKIAIAEQAEgQAJgGIFKAZQgGAPgEAPIAAADQAEgHAHgGIAAgBIAHgTIBhAIIAAAkIAAAtIATgtIAHgSIgBASIgGAAIAGAAIgICFIh0gMQAIAJAXADQAsAFApgCIgEBIIgXBqIh4gGg");
	this.shape_4.setTransform(0.1,-9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#3F1D00").s().p("AmiEoIAAhAIArAAIABAZQgDAvAngEIECgLQAAgNAHgMIAAAAQADADACAGQABAIgBAHIGSgRQAgAAADgfIAAgIIAqAAIgqAAIACglIgFAAQiPAMiQgFQA0gIA2ACQBfACBcgOIAKi2IAEhGQgpACgsgFQgXgDgIgJIB0AMIAIiHIABgTIABgQQACgYgTgFIhhgHIgKAbIgHATIAAABQgHAGgEAGIAAgCQAEgPAGgPIALgbIlqgXQABAVgBAWIgBAKQgBAEgFgBIAAgBIgDgRQgCgUAGgTIkZgSQgbgBAFAdIADBVIgZAAIAAh5QABgPAOAAIMXAqQAeAEABAnIgBAzIgYAAIAYAAIgHG2IgBAYQAAAkgnABIroAyQgrgBgCgugAmiDoIAAm2IAZAAIABAGIAEBtQANgBAMABQBdAPBggBIAagBIACABIAGACIABABIgjABQhqAChrgCIAEBlQgFAQAGAMIADBAQAfAKAkAAQgiADghgJIADBVQAYgEAZgBQBkAABjgJIACAAIAGABQgQAEgSACQhvAJhvAAIABAVg");

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E3A77B").s().p("AFyAhIATAAIgTAAIAAgiIhhgHIAKgbIBhAGQATAFgCAYIgBAPIgHASIgTAugAmIAnIAAgGIgDhTQgFgdAaACIEaASQgGASACAVIg+gcIi9AAQgaADgCAsIgBAHIgIAbIgIAAIAIAAIgCAGgAhBghQgJAFgEAQIgIgEQAAgWgBgVIFqAXIgLAbg");
	this.shape_6.setTransform(0,-24);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFC99D").s().p("AGwgCIhxgIIALggIBxAHQAWAHgCAcIgBARIgeBMgAnJAvIgEhqQgGgiAfABIFJAVQgIAWACAZIhHghIjdAAQgfAEgCAzIAAAJIgMAogAhMgoQgLAHgEASIgKgEQABgagBgZIGmAbQgHAQgFAQg");
	this.shape_7.setTransform(0,-28.4);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#93713C").s().p("AEWDkQiMgHh1AAIjhgBIhqgBQh2gCgTgrQgHgOAGgTIgFh6QB9ACB8gCIAogBIgBgBQgEAAgDgCIgCgCIgeABQhwABhsgPQgPgBgPABIgFiBIAHAAIAMgnIAAgMQACgyAfgEIDcAAIBIAgQABAKACAKIABAAQAFACACgFIABgMIAKAEQAEgSAKgGIGBAcQgGASgEASIAAADQAEgHAIgHIABgCIAIgWIBxAIIAABhIAehLIgKC0IiIgPQAJALAbADQAzAGAxgCIgFBVIgcB9IiLgHg");
	this.shape_8.setTransform(0.1,-10.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#83612C").s().p("Am0B8IgCg2QCBABCBgMQAWgCATgFIgIgBIgCAAQh0ALh0AAQgeABgbAFIgEhjQAmAMApgEQgqAAglgMIgDhMQATArB2ACIBqABIDhABQB1ABCMAGICLAHIAbh9IgLDVQhrAQhvgCQg/gBg9AIQCoAHCngPIAGAAIgDA1QgDAmglgBInWAVQACgJgBgKQgDgGgEgEIAAAAQgHAPgBAOIksAOIgHAAQgnAAADg0g");
	this.shape_9.setTransform(0,17.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#3F1D00").s().p("AnoFeIAArhQABgRARgBIObAyQAjAFABAuIgKJfQgBAqgtACItlA7QgygBgCg3gAm0EwQgEA4AugFIEtgNQAAgPAHgPIABAAQADAEADAHQABAJgCAJIHWgVQAlABAEgmIACg1IgGABQinAOingGQA8gJA/ABQBvADBrgRIAMjXIAFhTQgxACgzgFQgbgEgJgKICIAOIAKi2IABgTQACgcgWgHIhxgHIgLAgIgIAWIgBABQgHAHgFAIIAAgDQAEgTAHgRQAFgQAIgQImngbQABAYgBAbIAAALQgCAGgGgCIAAAAQgDgLgBgJQgCgZAIgWIlJgVQgfgBAGAiIAEBsIAFCAQAPgBAPABQBsASBwgCIAfAAIABABQADACAEABIABAAIgoABQh8ADh9gDIAFB4QgFATAGAPIADBLQAlAMAqAAQgoAEgngMIAEBlQAbgFAeAAQB1gBB0gLIABAAIAIACQgTAEgVACQiBAMiCgBg");

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#624017").s().p("AlLBeIgBgpQBiABBigJQAQgCAPgDIgGgBIgCAAQhYAIhYAAQgXABgUAEIgEhLQAeAJAegDQggAAgcgJIgCg6QAOAhBbABIBQABICqABQBZAABrAFIBpAGIAVhgIgJCiQhRAMhUgBQgwgBguAGQB/AFB/gLIAFAAIgDAoQgCAcgcAAIllAQQACgHgBgHQgDgFgCgDIAAAAQgGALAAALIjlAKIgFABQgdAAACgog");
	this.shape_11.setTransform(0,13.6);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#714F1A").s().p("ADTCtQhqgFhZAAIirgBIhQgBQhagBgPghQgEgLAEgOIgEhdQBfACBegCIAfgBIgBAAIgGgCIgBgBIgXAAQhVABhSgLQgLgBgMABIgEhhIAGAAIAJgfIAAgIQACgnAXgCICoAAIA2AYIADAPIAAAAQAEACACgEIAAgJIAIADQADgOAIgFIEkAWIgJAbIAAADIAKgLIAAgBIAHgRIBVAGIAABKIAXg6IgICJIhngMQAHAIAVADQAmAEAlgBIgDBAIgVBfIhqgFg");
	this.shape_12.setTransform(0.1,-8.1);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#3F1D00").s().p("AmYFkIAaAAIgPABIgLgBgAktECQgdgEgCglIAAowQABgMANgBIK8AmQAbADABAkIgIHMQAAAggiABIqJAsgAkkC2QgDAqAigDIDlgKQAAgMAGgLIAAAAQADADACAFQABAHgBAHIFkgQQAcABADgdIACgoIgFAAQh/ALh/gFQAugGAwABQBUABBRgMIAJiiIAEhAQglACgngFQgUgCgHgIIBnALIAIiKIABgPQABgVgRgFIhVgGIgJAYIgGARIgBABIgJALIAAgCIAIgbIAKgZIlAgUIAAAmIgBAJQgBAEgFgBIAAAAIgCgPQgCgTAGgRIj6gQQgYgBAFAaIADBSIAEBiQALgBAMABQBSANBVgBIAXgBIABABIAGACIABABIgfABQhfAChfgCIAEBcQgEAPAFAJIACA5QAdAJAgAAQgfADgegJIAEBNQAUgEAXgBQBZAABYgIIABAAIAGABQgOADgRACQhiAJhigBg");
	this.shape_13.setTransform(-3.8,4.9);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#E3A77B").s().p("AFIgBIhWgHIAJgYIBVAGQARAFgBAVIgBANIgXA5gAlbAjIgDhQQgFgaAYACID6AQQgGAQACATIg3gZIinAAQgYADgBAnIgBAGIgJAegAg6geQgIAFgDAOIgHgDIAAgnIFAAVIgKAYg");
	this.shape_14.setTransform(0,-21.5);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#624017").s().p("Al1BpIgCguQBvABBugKQATgCAQgEIgHgBIgBAAQhkAJhkABQgZAAgXAFIgEhUQAhAKAjgDQgkAAgggKIgDhAQARAkBlABIBbABIDAABQBlABB4AFIB3AGIAYhqIgLC0QhbAOhfgCQg2gBg0AHQCPAGCPgMIAGgBIgDAtQgDAggfgBImTASQACgHgBgJQgDgFgCgDIgBgBQgGANAAAMIkCAMIgGAAQghAAADgsg");
	this.shape_15.setTransform(0,15.2);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#714F1A").s().p("ADuDBQh4gGhkAAIjBgBIhagBQhmgCgQgkQgGgMAFgQIgEhnQBrACBqgCIAjgBIgBAAIgGgDIgCgBIgaABQhgABhdgNQgMgBgNABIgEhtIAGAAIAKghIAAgJQACgsAbgDIC8AAIA+AcIADARIAAAAQAFABABgEIABgKIAIAEQAEgQAJgGIFKAZQgGAPgEAPIAAADQAEgHAHgGIAAgBIAHgTIBhAIIAABRIAag/IgJCXIh0gMQAIAJAXADQAsAFApgCIgEBIIgXBqIh4gGg");
	this.shape_16.setTransform(0.1,-9);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#3F1D00").s().p("AmiEoIAApvQABgPAOAAIMXAqQAeAEABAnIgJIBQAAAkgnABIroAyQgrgBgCgugAl2EBQgDAvAngEIECgLQAAgNAHgMIAAAAQADADACAGQABAIgBAHIGSgRQAgAAADgfIACgtIgFAAQiPAMiQgFQA0gIA2ACQBfACBcgOIAKi2IAEhGQgpACgsgFQgXgDgIgJIB0AMIAJiaIABgQQACgYgTgFIhhgHIgKAbIgHATIAAABQgHAGgEAGIAAgCQAEgPAGgPIALgbIlqgXQABAVgBAWIgBAKQgBAEgFgBIAAgBIgDgRQgCgUAGgTIkZgSQgbgBAFAdIAEBbIAEBtQANgBAMABQBdAPBggBIAagBIACABIAGACIABABIgjABQhqAChrgCIAEBlQgFAQAGAMIADBAQAfAKAkAAQgiADghgJIADBVQAYgEAZgBQBkAABjgJIACAAIAGABQgQAEgSACQhvAJhvAAg");

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#E3A77B").s().p("AFygBIhhgHIAKgbIBhAGQATAFgCAYIgBAPIgaBAgAmIAnIgDhZQgFgdAaACIEaASQgGASACAVIg+gcIi9AAQgaADgCAsIgBAHIgKAhgAhBghQgJAFgEAQIgIgEQAAgWgBgVIFqAXIgLAbg");
	this.shape_18.setTransform(0,-24);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3}]}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7}]},1).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-41.8,-34.3,83.9,68.8);


(lib.bolinha_loader = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#00FFFF").ss(1,1,1).p("AhlAAQAAgpAegeQAegeApAAQAqAAAeAeQAeAeAAApQAAAqgeAeQgeAegqAAQgpAAgegeQgegeAAgqg");
	this.shape.setTransform(10.8,10.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["#EEFFF1","#00CCFF","#0099CC","#003399"],[0,0.298,0.753,1],3.8,-4.3,0,-0.4,0,10.6).s().p("AhHBIQgegeAAgqQAAgpAegeQAegeApAAQAqAAAeAeQAeAeAAApQAAAqgeAeQgeAegqAAQgpAAgegeg");
	this.shape_1.setTransform(10.8,10.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#184521").ss(3,1,1).p("ABMhLQgggfgsAAQgrAAggAfQgfAgAAArQAAAsAfAgQAgAfArAAQAsAAAggfQAfggAAgsQAAgrgfggg");
	this.shape_2.setTransform(10.8,10.8);

	this.addChild(this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,21.5,21.5);


(lib.areaJogo_mc = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(221,221,221,0)").s().p("A3bfzMAAAg/kMAu2AAAMAAAA/kg");
	this.shape.setTransform(150,-203.4);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,-406.9,300,407);


(lib.txtSomOut = function() {
	this.initialize();

	// Layer 4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#660000").ss(10,1,1).p("AGCEmIkwlWIEokEAjAlqIESE6InTGb");
	this.shape.setTransform(40.6,10.6);

	// Layer 1
	this.instance = new lib.somAnimado_mc();
	this.instance.setTransform(37.8,5.9);

	this.addChild(this.instance,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-5.8,-46.1,87.3,104.2);


(lib.txtSom = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.somAnimado_mc();
	this.instance.setTransform(37.8,5.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({y:-14.6},4).to({y:5.9},5).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-5.8,-46.1,87.3,104.2);


(lib.triangulo_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 4
	this.destaque_mc = new lib.destaque_mc();
	this.destaque_mc.setTransform(25,25.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.destaque_mc}]}).wait(2));

	// Layer 5
	this.estrela_mc = new lib.estrela_mc();
	this.estrela_mc.setTransform(25,25);
	this.estrela_mc._off = true;

	this.timeline.addTween(cjs.Tween.get(this.estrela_mc).wait(1).to({_off:false},0).wait(1));

	// Layer 1
	this.instance = new lib.blocoTriangulo();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.tempo_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// capa
	this.instance = new lib.Symbol2("synched",0);
	this.instance.setTransform(0.5,-27.6,1,1,0,0,0,97,108);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(293));

	// metade 
	this.instance_1 = new lib.roda_mc();
	this.instance_1.setTransform(0,0,1,1,0,180,0);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true},147).wait(146));

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AqIUXIgBAAIgBAAMAAAgotIABAAIABAAIABAAQBVAABSALQBWAKBTAVQBSAVBOAgQBPAhBKAsQBIAqBEA2QBCA0A+A+IAAABQA9A9A0BBQA2BEArBKQArBJAhBOQAhBPAVBUQAWBSAKBUQAJBUAABXIAAAAQAABWgJBTQgKBWgWBSQgVBTggBPQghBPgsBKQgqBIg1BEQg1BDg+A+Qg+A9hBA0QhFA2hJAsQhIArhOAhQhPAghTAWQhRAVhWAKQhTAKhWAAg");
	var mask_graphics_147 = new cjs.Graphics().p("AKKUXQhXAAhUgKQhWgKhRgVQhTgWhPggQhOghhIgrQhJgshFg2QhBg0g+g9Qg+g+g1hDQg1hEgqhIQgshKghhPQgghPgVhTQgWhSgKhWQgJhTAAhWIAAAAQAAhXAJhUQAKhUAWhSQAVhUAhhPQAhhOArhJQArhKA2hEQA0hBA9g9IAAgBQA+g+BCg0QBEg2BIgqQBKgsBPghQBOggBSgVQBTgVBWgKQBTgLBWAAIABAAMAAAAotg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:65.2,y:0}).wait(147).to({graphics:mask_graphics_147,x:-65.1,y:0}).wait(146));

	// fluxo
	this.instance_2 = new lib.roda_mc();
	this.instance_2.setTransform(0,0,1,1,0,0,180);

	this.instance_2.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({skewX:178.6,skewY:358.7},146).wait(1).to({skewX:0,skewY:360},0).to({rotation:180},145).wait(1));

	// fundo
	this.instance_3 = new lib.relogioFundo();
	this.instance_3.setTransform(-66.9,-66.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3}]}).wait(293));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-96.5,-135.6,194,216);


(lib.retangulo_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 4
	this.destaque_mc = new lib.destaque_mc();
	this.destaque_mc.setTransform(25,24.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.destaque_mc}]}).wait(2));

	// Layer 5
	this.estrela_mc = new lib.estrela_mc();
	this.estrela_mc.setTransform(25,25);
	this.estrela_mc._off = true;

	this.timeline.addTween(cjs.Tween.get(this.estrela_mc).wait(1).to({_off:false},0).wait(1));

	// Layer 1
	this.instance = new lib.BlocoRetangulo();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.quadrado_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.destaque_mc = new lib.destaque_mc();
	this.destaque_mc.setTransform(25.3,24.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.destaque_mc}]}).wait(2));

	// Layer 4
	this.estrela_mc = new lib.estrela_mc();
	this.estrela_mc.setTransform(25,25);
	this.estrela_mc._off = true;

	this.timeline.addTween(cjs.Tween.get(this.estrela_mc).wait(1).to({_off:false},0).wait(1));

	// Layer 1
	this.instance = new lib.blocoQuadrado();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.maoOK = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.animamaoOK("synched",0);
	this.instance.setTransform(22.7,34.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({y:24.9},8,cjs.Ease.get(1)).to({y:34.9},4).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,45.2,69.8);


(lib.maoNAO = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.animamaoNAO("synched",0);
	this.instance.setTransform(23.4,61.8,1,1,0,0,0,1,28);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:28.1,scaleX:1,scaleY:1,rotation:-31.4},8).to({regY:28,scaleX:1,scaleY:1,rotation:0},8).to({regY:28.1,scaleX:1,scaleY:1,rotation:28.3,y:61.7},8).to({regY:28,scaleX:1,scaleY:1,rotation:3.8,y:61.8},6).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,44.7,67.6);


(lib.miniTempo2_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// capa
	this.instance = new lib.relogioCapa();
	this.instance.setTransform(-96.5,-135.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(288));

	// metade 
	this.instance_1 = new lib.roda_mc();
	this.instance_1.setTransform(0,0,1,1,0,180,0);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true},144).wait(144));

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AqIUXIgBAAIgBAAMAAAgotIABAAIABAAIABAAQBVAABSALQBWAKBTAVQBSAVBOAgQBPAhBKAsQBIAqBEA2QBCA0A+A+IAAABQA9A9A0BBQA2BEArBKQArBJAhBOQAhBPAVBUQAWBSAKBUQAJBUAABXIAAAAQAABWgJBTQgKBWgWBSQgVBTggBPQghBPgsBKQgqBIg1BEQg1BDg+A+Qg+A9hBA0QhFA2hJAsQhIArhOAhQhPAghTAWQhRAVhWAKQhTAKhWAAg");
	var mask_graphics_144 = new cjs.Graphics().p("AKKUXQhXAAhUgKQhWgKhRgVQhTgWhPggQhOghhIgrQhJgshFg2QhBg0g+g9Qg+g+g1hDQg1hEgqhIQgshKghhPQgghPgVhTQgWhSgKhWQgJhTAAhWIAAAAQAAhXAJhUQAKhUAWhSQAVhUAhhPQAhhOArhJQArhKA2hEQA0hBA9g9IAAgBQA+g+BCg0QBEg2BIgqQBKgsBPghQBOggBSgVQBTgVBWgKQBTgLBWAAIABAAMAAAAotg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:65.2,y:0}).wait(144).to({graphics:mask_graphics_144,x:-65.1,y:0}).wait(144));

	// fluxo
	this.instance_2 = new lib.roda_mc();
	this.instance_2.setTransform(0,0,1,1,0,0,180);

	this.instance_2.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({skewX:178.6,skewY:358.7},143).wait(1).to({skewX:0,skewY:360},0).to({rotation:180},143).wait(1));

	// fundo
	this.instance_3 = new lib.relogioFundo();
	this.instance_3.setTransform(-66.9,-66.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3}]}).wait(288));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-96.5,-135.6,194,216);


(lib.miniTempo_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// capa
	this.instance = new lib.relogioCapa();
	this.instance.setTransform(-96.5,-135.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(150));

	// metade 
	this.instance_1 = new lib.roda_mc();
	this.instance_1.setTransform(0,0,1,1,0,180,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(150));

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AqIUXIgBAAIgBAAMAAAgotIABAAIABAAIABAAQBVAABSALQBWAKBTAVQBSAVBOAgQBPAhBKAsQBIAqBEA2QBCA0A+A+IAAABQA9A9A0BBQA2BEArBKQArBJAhBOQAhBPAVBUQAWBSAKBUQAJBUAABXIAAAAQAABWgJBTQgKBWgWBSQgVBTggBPQghBPgsBKQgqBIg1BEQg1BDg+A+Qg+A9hBA0QhFA2hJAsQhIArhOAhQhPAghTAWQhRAVhWAKQhTAKhWAAg");
	mask.setTransform(65.2,0);

	// fluxo
	this.instance_2 = new lib.roda_mc();
	this.instance_2.setTransform(0,0,1,1,0,0,180);

	this.instance_2.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({skewX:178.6,skewY:358.7},149).wait(1));

	// fundo
	this.instance_3 = new lib.relogioFundo();
	this.instance_3.setTransform(-66.9,-66.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3}]}).wait(150));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-96.5,-135.6,194,216);


(lib.miniCoruja2_mc = function() {
	this.initialize();

	// Layer 5
	this.instance = new lib.miniSeta_mc();
	this.instance.setTransform(-0.7,2);

	// Camada 3
	this.instance_1 = new lib.miniIma_mc();
	this.instance_1.setTransform(0,-82.9);

	this.addChild(this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-47.9,-128.4,96,170);


(lib.miniCoruja_mc = function() {
	this.initialize();

	// Layer 5
	this.instance = new lib.miniSeta_mc();
	this.instance.setTransform(-0.7,2,1,1,0,180,0);

	// Camada 3
	this.instance_1 = new lib.miniIma_mc();
	this.instance_1.setTransform(0,-82.9);

	this.addChild(this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-47.9,-128.4,96,174);


(lib.Tween5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Tween8("synched",0);
	this.instance.setTransform(-2.3,-8.4,1,1,0,0,0,0.1,1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:180},10).to({scaleX:1,scaleY:1,rotation:349.1},10).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23,-30.9,41.1,41.7);


(lib.explode_mc = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.miniQuadrado();
	this.instance.setTransform(19.5,0.1,0.4,0.4);

	this.instance_1 = new lib.miniQuadrado();
	this.instance_1.setTransform(-19.5,0.1,0.4,0.4);

	this.instance_2 = new lib.miniQuadrado();
	this.instance_2.setTransform(-0.1,0,0.4,0.4);

	this.addChild(this.instance_2,this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-29.5,-9.9,59.1,20.1);


(lib.corrente_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{_sobe:0,_desce:1});

	// Layer 5
	this.instance = new lib.seta_mc();
	this.instance.setTransform(-0.7,64,1,1,0,180,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({skewX:0},0).wait(1));

	// Camada 3
	this.instance_1 = new lib.ima_mc();
	this.instance_1.setTransform(0,-20.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-47.9,-66.4,96,174);


(lib.circulo_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 4
	this.destaque_mc = new lib.destaque_mc();
	this.destaque_mc.setTransform(24.5,24.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.destaque_mc}]}).wait(2));

	// Layer 5
	this.estrela_mc = new lib.estrela_mc();
	this.estrela_mc.setTransform(25,25);
	this.estrela_mc._off = true;

	this.timeline.addTween(cjs.Tween.get(this.estrela_mc).wait(1).to({_off:false},0).wait(1));

	// Layer 1
	this.instance = new lib.BlocoCirculo();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.carregando_loader = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// lapis
	/* Layers with classic tweens must contain only a single symbol instance. */

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("ApZJZQj5j5AAlgQAAlfD5j6QD6j5FfAAQFgAAD5D5QD6D6AAFfQAAFgj6D5Qj5D6lgAAQlfAAj6j6g");
	mask.setTransform(98.7,98.7);

	// bolinha
	this.instance = new lib.bolinha_loader();
	this.instance.setTransform(97.5,0.1,1,1,0,0,0,10.8,10.8);
	this.instance.shadow = new cjs.Shadow("rgba(0,0,0,1)",1,1,2);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({guide:{path:[97.6,0.2,98.2,0.2,98.7,0.2,139.5,0.2,168.4,29.1,197.3,58,197.3,98.7,197.3,139.5,168.4,168.4,139.5,197.3,98.7,197.3,58,197.3,29.1,168.4,0.2,139.5,0.2,98.7,0.2,58,29.1,29.1,57.2,0.9,96.7,0.1]}},99).wait(1));

	// frente
	this.instance_1 = new lib.carregandoBarra_loader();
	this.instance_1.setTransform(98.7,98.7,1,1,0,0,0,103.8,103.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1}]}).wait(100));

	// rastro
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FCFB2E").s().p("AgHBKIgGAAIAAiUIAGAAIAVABIAACUIgVgBg");
	this.shape.setTransform(99.5,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FCFB2E").s().p("Ag8BCIgIgBIgYAAIgGAAIAAiUIAGAAIAYAAIAIABQBQACBOANIAACXQhNgQhRgCg");
	this.shape_1.setTransform(108,0.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FCFB2E").s().p("AAoBEQhPgRhXgCIgYAAIgGAAIAAiUIAGAAIAYAAIANABICQANQBAALA9ASIAACcQg4gUg8gMg");
	this.shape_2.setTransform(113.8,2.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FCFB2E").s().p("ABoBNQg4gUg6gMQhRgQhYgCIgXAAIgGAAIAAiUIAGAAIAXAAIAHAAIAHAAIACAAQBKADBGALIANACIAUAEIADABQAsAJArAMQA2AQAzAWIAACjQgzgag2gTg");
	this.shape_3.setTransform(119,4.8);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FCFB2E").s().p("ACGBZQgygag2gTQg2gUg8gMQhSgOhXgCIgXgBIgGAAIAAiWIAGAAIAXABIAHAAIACAAIAGAAIANAAIBaAIIAEAAIAEABIADAAIAIABIAEABIAJABIAJACIAOACIAQADIAFABIAEABQAsAIApANIAWAHQAqANAoARQBNAhBIArIgoAAIAACbQg0gmg5gdg");
	this.shape_4.setTransform(126.4,8.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FCFB2E").s().p("ACuBtQg1gmg4gdQgzgagzgRQg5gUg7gMQhSgQhXgCIgXgBIgGAAIAAiWIAGAAIAXABIAHAAIABAAIAGAAIAOAAIAEABQAsACAqAFIAEAAIADABIAEAAIAIABIAEABIAJABIAJACIAHABIAQADIAHABIAFABIADABQAtAIArANIADABIAQAFIACABQApANAoARQBKAgBGArIACABIADACQBIAsBCA7IhCAAIAACQQg2g1g6gpg");
	this.shape_5.setTransform(133.3,12.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FCFB2E").s().p("ADzC0IgKgLIhshbIgEgDQg1gmg5gdQgwgYg2gTQg4gUg8gMQhRgQhYgCIgXAAIgGAAIAAiWIAGAAIAXAAIAHAAIACAAIAGAAIANABIAFAAIAIAAIA2AEIAEABIAHABIACAAIAKABIAEABIAEAAIAEABIAHABIAEAAIAJABIAKACIAGABIAQADIAHABIAGABIADABQAsAJArAMIABABIACAAIAQAFIADABQAqAOAmARIAhAOIBlA2IAKAGIACABIAAABIABAAIACACQBIAtBDA6QAZAXAZAZQAeAdAbAfIhuBmQgZgdgcgbg");
	this.shape_6.setTransform(138.7,16.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FCFB2E").s().p("ADyCrQgXgbgZgaIgDgCIgCgCIgIgIIgCgDIhshbIgEgDQg1gkg3gdQgygag2gTQg4gTg8gMQhRgRhYgCIgXAAIgGAAIAAiWIAGAAIAXAAIAHAAIACAAIAGAAIANABIAFAAIAIAAIAwAEIAGABIAEAAIAHABIACAAIADAAIAHABIAEABIAEAAIAEABIACAAIAFABIACAAIACAAIAFABIAEAAIAKACIABAAIANADIAIABIAHABIABAAIAFABIABAAQAvAKAtANQB8AlBtBEIAFADIAFADIACABIAAABIABAAIACACQBIAuBDA7QAaAXAYAXIAGAFQAaAbAZAcQA9BHAvBMIh7BXQgphFg2g+g");
	this.shape_7.setTransform(144.1,22.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FCFB2E").s().p("AEjDbQgphFg2g/QgXgbgagaIgCgCIgCgCIgIgIIgDgDIhrhYIgFgEQgyglg5gdQgygag2gTQg4gUg8gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIAHABIACAAIAGAAIANAAIAFAAIAHABIAxADIADABIADAAIAEAAIAHABIACAAIADABIAnAFIAJABIACABIANACIAIABIAHACIABAAIAEABIACAAQAvAJAtAOQB8AkBtBEIAFAEIAFADIACABIAAAAIABABIACABQBIAuBDA7QAZAXAZAZIAFAFIAGAGIAaAbIAQASIAEAEQA9BFAvBNQA5BeAjBoIiMA4QgchYgvhPg");
	this.shape_8.setTransform(148.7,31.1);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FCFB2E").s().p("AFYEuQgchYgvhQQgphEg2g/QgXgZgZgaIgDgCIgCgCIgIgIIgDgDIhrhbIgDgDQg0glg5gdQgygag2gTQg4gUg8gMQhRgRhYgCIgXAAIgGAAIAAiWIAGAAIAXAAIADAAIAIAAIAEAAIAFABIAIAAIAFAAIAFAAIAIABIAuAEIADAAIAAAAIAEAAIAHABIACAAIADAAIAnAGIAKABIABABIANACIAIABIAHABIABABIAFAAIABABQAvAJAtANQB8AlBtBEIAFAEIAFACIACACIAAAAIABABIACABQBIAuBDA7QAaAXAYAZIAGAFIADAEIACACIAaAbIAJALIAIAHIADAEQA9BHAvBLIAHALIBVC7QAfBaANBiIiTAkQgKhXgbhRg");
	this.shape_9.setTransform(150.9,39.6);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FCFB2E").s().p("AF8I3QADgkAAgmQAAg9gHg7QgDgZgFgZQgKg9gTg5QgchVgshOIgEgFQgohCg2g/QgXgbgagaIgCgCIgCgCIgIgIIgDgDIhphbIgFgDQg0gmg5gdQgzgag1gTQg5gTg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJAAIAEAAIAFAAIAIABIAFAAIAEAAIAJABIAuADIACABIAAAAIAFAAIAHABIACAAIACAAIAoAFIAJACIACAAIANADIAIABIAHABIABAAIAEABIACAAQAuAKAuANQB8AlBsBEIAGADIAFADIACABIAAABIABAAIACACQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACABIAaAcIAEAFIAKAKIACADIAEAEQA9BHAvBMIAGAKQA1BYAhBjQAVA/ANBDIAJAzIABAGQAKBNAABQQAAAmgCAkg");
	this.shape_10.setTransform(151.4,49.3);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#FCFB2E").s().p("AFjJ3QAUhMAFhSQADglAAglIAAgQIgGhjIgBgGQgDgZgFgZQgKg8gTg6IgBgEIhHicIgEgFIgCgEIhGhlIgFgHIgDgDIgEgGIgKgLQgXgbgagaIgCgCIgCgCIgIgIIgDgCIhphbIgFgEQg0glg5gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJABIAEAAIAFAAIAIAAIAFABIAEAAIAJAAIAuAEIACAAIAAAAIAFAAIAHABIACAAIACABIAoAFIAJABIACABIANACIAIABIAHACIABAAIAEABIACAAQAuAJAuAOQB8AlBsBEIAGADIAFADIACABIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAaAbIAEAGIAKAKIACACIAEAFIAMAOIBdCAIADAFIABACIAFAHQAhA5AZA7QAQAiAMAlIAhB6IAEAWIAGAlIAAACIABAFQAKBMAABRQAAAlgCAlQgGBigWBbg");
	this.shape_11.setTransform(151.4,58.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FCFB2E").s().p("AEuK1QAhhJAUhPIABgCIABgFIAXiQIAAgHIABgJIACg+IAAgDIAAgIIAAgKQgBgygFgvIgBgGQgDgZgFgZQgKg8gTg6IgBgEIhHicIAAAAIgEgFIgCgEQgfg0gngxIgFgHIgYgbIgkgnIgEgFIgCgCIgCgCIgCgCIgIgIIgDgCIhphbIgFgEQg0glg5gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJABIAEAAIAFAAIAIAAIAFABIAEAAIAJAAIAuAEIACAAIAAAAIAFAAIAHABIACAAIACABIAoAFIAJABIACABIANACIAIABIAHACIABAAIAEABIACAAQAuAJAuAOQB8AlBsBEIAGADIAFADIACABIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAaAbIAEAGIAKAKIACACIAEAFIAJALIADADIABABQAzA9ApBCIACADIABACQBaCUAjCqIAEAWIAHAsQAKBMAABRQAAAlgCAlQgGBigWBbQgXBdgoBXg");
	this.shape_12.setTransform(151.4,67.7);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#FCFB2E").s().p("ADeLuQAuhBAihHIABgDIAziQIABgFIABgCIABgFIAXiQIAAgHIABgFIAAgIQACgdAAgdIAAgDIAAgIIAAgDIAAgHIAAgJIgGhYIgBgGQgDgZgFgZQgKg7gTg5IgBgEIhHieIAAAAIgEgFIgCgEQgfg0gngxIgFgHIgRgUIgHgHIgkgnIgDgEIgBgBIgCgCIgCgCIgCgCIgIgIIgDgCIhphbIgFgEQg0glg5gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJABIAEAAIAFAAIAIAAIAFABIAEAAIAJAAIAuAEIACAAIAAAAIAFAAIAHABIACAAIACABIAoAFIAJABIACABIANACIAIABIAHACIABAAIAEABIACAAQAuAJAuAOQB8AlBsBEIAGADIAFADIACABIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAaAbIAEAGIAKAKIACACIAEAFIAJALIADADQA2BAAqBFQBaCUAjCqIAEAWIAHAsQAKBMAABRQAAAlgCAlQgGBigWBbQgXBdgoBXQgmBSg1BMg");
	this.shape_13.setTransform(151.4,75.6);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FCFB2E").s().p("ABlMqIAPgPQA8g7AuhBQAuhBAihHIAAgBIABgCIAziPIAAgCIABgEIABgCIABgFIAXiQIAAgHIABgFIAAgIQACgdAAgdIAAgDIAAgIIAAgDIAAgHIAAgJQgBgtgFgrIgBgGQgDgZgFgXQgKg8gTg6IgBgEIhHieIAAAAIgEgFIgCgEQgfg0gngxIgFgHIgRgUIgHgHIgkgnIgDgEIgBgBIgCgCIgCgCIgCgCIgIgIIgDgCIhphbIgFgEQg0glg5gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJABIAEAAIAFAAIAIAAIAFABIAEAAIAJAAIAuAEIACAAIAAAAIAFAAIAHABIACAAIACABIAoAFIAJABIACABIANACIAIABIAHACIABAAIAEABIACAAQAuAJAuAOQB8AlBsBEIAGADIAFADIACABIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAaAbIAEAGIAKAKIACACIAEAFIAJALIADADQA2BAAqBFQBaCUAjCsIAEAWIAHAsQAKBKAABRQAAAlgCAlIAAADIgbC0IgBAGQgXBdgoBXIgDAFIguBXIglA6Qg5BShLBLIgIAJg");
	this.shape_14.setTransform(151.4,83.5);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#FCFB2E").s().p("AgdNcQBDguA/g9IAPgOQA8g8AuhAQAuhCAihHIAAgBIABgCIAziPIAAgCIABgDIABgDIABgEIAXiQIAAgIIABgEIAAgJQACgcAAgeIAAgDIAAgHIAAgDIAAgHIAAgJQgBgtgFgqIgBgFQgDgZgFgZQgKg9gTg5IgBgFIhHidIAAgBIgEgFIgCgDQgfg0gngxIgFgHIgRgVIgHgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhphbIgFgDQg0gmg5gdQgzgag1gTQg5gTg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJAAIAEAAIAFAAIAIABIAFAAIAEAAIAJABIAuADIACABIAAAAIAFAAIAHABIACAAIACAAIAoAFIAJACIACAAIANADIAIABIAHABIABAAIAEABIACAAQAuAKAuANQB8AlBsBEIAGADIAFADIACABIAAABIABAAIACACQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACABIAaAcIAEAFIAKAKIACADIAEAEIAJALIADAEQA2A/AqBFQBaCVAjCrIAEAWIAHAsQAKBLAABQQAAAmgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgDAGQgVAsgZAqQgRAegUAcQg5BThLBLIgIAIQhBA/hFAyg");
	this.shape_15.setTransform(151.4,89.2);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FCFB2E").s().p("Ai0N2QBOggBJgwIB6hkIAIgHIAIgHIAHgIQA8g7AuhBQAuhCAihGIAAgBIABgDIAziOIAAgDIABgDIABgCIABgFIAXiQIAAgIIABgEIAAgIQACgdAAgeIAAgDIAAgHIAAgDIAAgHIAAgJQgBgrgFgsIgBgFQgDgZgFgZQgKg9gTg5IgBgEIhHieIAAgBIgEgFIgCgDQgfg0gngxIgFgHIgRgVIgHgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhphbIgFgDQg0glg5gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJAAIAEAAIAFABIAIAAIAFAAIAEAAIAJABIAuAEIACAAIAAAAIAFAAIAHABIACAAIACAAIAoAGIAJABIACABIANACIAIABIAHABIABABIAEAAIACABQAuAJAuANQB8AlBsBEIAGAEIAFACIACACIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAaAbIAEAFIAKALIACACIAEAEIAJALIADAEQA2BAAqBFQBaCUAjCrIAEAWIAHAtQAKBMAABOQAAAmgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhbBDhmArg");
	this.shape_16.setTransform(151.4,94.7);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FCFB2E").s().p("AlNOIQBPgQBKgeQBPggBIgwIB6hkIAIgHIAIgIIAHgHQA8g8AuhAQAuhCAihHIAAgBIABgCIAziPIAAgCIABgDIABgDIABgEIAXiQIAAgIIABgEIAAgJQACgcAAgeIAAgDIAAgHIAAgDIAAgFIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgBgEIhHieIAAgBIgEgFIgCgDQgfg0gngxIgFgHIgRgVIgHgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhphbIgFgDQg0gmg5gcQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJAAIAEAAIAFABIAIAAIAFAAIAEAAIAJABIAuADIACABIAAAAIAFAAIAHABIACAAIACAAIAoAGIAJABIACAAIANADIAIABIAHABIABABIAEAAIACABQAuAJAuANQB8AlBsBEIAGADIAFADIACACIAAAAIABAAIACACQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACABIAaAcIAEAFIAKAKIACADIAEAEIAJALIADAEQA2BAAqBEQBaCVAjCrIAEAWIAHAsQAKBNAABOQAAAmgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBA/hFAyQhbBDhmArQhXAkhdAUg");
	this.shape_17.setTransform(151.4,97.5);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FCFB2E").s().p("An/OPQBdgBBVgSQBPgQBKgeQBPggBIgwIB6hkIAIgHIAIgHIAHgIQA8g7AuhBQAuhBAihHIAAgBIABgDIAziOIAAgCIABgEIABgCIABgFIAXiQIAAgHIABgFIAAgIQACgdAAgdIAAgDIAAgGIAAgDIAAgHIAAgJQgBgtgFgrIgBgGQgDgZgFgZQgKg9gTg5IgBgEIhHieIAAAAIgEgFIgCgEQgfg0gngxIgFgHIgRgVIgHgGIgkgoIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhphaIgFgEQg0glg5gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgXAAIgGAAIAAiWIAGAAIAXAAIACAAIAJABIAEAAIAFAAIAIAAIAFAAIAEABIAJAAIAuAEIACAAIAAAAIAFAAIAHABIACAAIACABIAoAFIAJABIACABIANACIAIABIAHACIABAAIAEABIACAAQAuAJAuAOQB8AkBsBEIAGAEIAFADIACABIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAaAbIAEAFIAKALIACACIAEAEIAJALIADAEQA2BAAqBFQBaCUAjCrIAEAWIAHAtQAKBMAABPQAAAlgCAlIAAADQgGBdgVBXIgBAGQgXBdgoBXIgDAFQgVAtgZAqQgRAdgUAdQg5BShLBLIgIAJQhBA/hFAyQhbBChmArQhXAlhdATQhiAVhqADg");
	this.shape_18.setTransform(151.4,98.6);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FCFB2E").s().p("ApoQYIAYiUQBIALBNAAIAfgBIBmgIIAEAAIAJgCIAQgCIACAAIAEgBIAIgCIAGgBIALgCQBQgQBJgeQBPggBGgwIB9hkIAHgHIAIgHIAHgIQA8g7AuhBQAvhCAhhGIAAgBIABgDIAziOIABgDIABgDIAAgCIABgFIAXiQIABgIIAAgEIABgIQABgdABgeIAAgCIAAgGIAAgDIgBgHIAAgJQgBgtgFgsIgBgFQgDgZgEgZQgLg9gTg5IgBgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgGgHIgRgVIgGgHIglgnIgCgDIgBgBIgCgCIgDgCIgCgCIgIgIIgDgDIhrhbIgEgDQg1glg3gdQgygag2gTQg4gUg8gMQhRgRhYgCIgXAAIgGAAIAAiWIAGAAIAXAAIADAAIAIAAIAEAAIAFABIAIAAIAFAAIAFAAIAIABIAuAEIADAAIAAAAIAEAAIAHABIACAAIADAAIAnAGIAKABIABABIANACIAIABIAHABIABABIAFAAIABABQAvAJAtANQB8AlBtBEIAFAEIAFACIACACIAAAAIABABIACABQBIAuBDA7QAaAXAYAZIAGAFIADAEIACACIAaAbIAFAFIAJALIADACIADAEIAJALIAEAEQA1BAAqBFQBaCUAjCrIAEAWIAHAtQAKBMABBPQgBAlgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgCAGQgVAsgZArQgSAdgTAcQg5BThMBLIgIAIQhABAhGAxQhdBDhkArIgXAJIgUAIIgmANIhdAZIgOADIhNANQg6AHg9ACIgdAAQhZAAhUgNg");
	this.shape_19.setTransform(143.1,98.7);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FCFB2E").s().p("An8QYQhwgRhngoIBCiHQBTAeBZAOQBJALBMAAIAfgBQA0gBAygHIAfgEIAAAAIAEgBIAEgBIAFgBIAFgBIAMgCQBPgQBIgeQBOggBIgwIB9hkIAIgHIAHgHIAIgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgCgtgFgsIAAgFQgDgZgFgZQgLg9gSg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhshbIgEgDQg1glg4gdQgzgag0gTQg4gUg8gMQhRgRhYgCIgXAAIgGAAIAAiWIAGAAIAXAAIADAAIAJAAIADAAIAFABIAJAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAGABIACABIAEAAIABABQAvAJAtANQB6AlBvBEIAFAEIAFACIACACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIABACIAaAbIAFAFIAJALIADACIADAEIAKALIADAEQA2BAApBFQBaCUAjCrIAEAWIAHAtQALBMAABPQAAAlgCAkIgBAEQgGBdgUBXIgCAFQgXBegnBWIgDAGQgVAsgZArQgSAdgTAcQg5BThLBLIgJAIQhABAhGAxQhcBDhnArIgWAJIgPAGIgMAEIgTAHIgKAEQguAPgvAKIgOADQglAHgmAFIgCABIhyAJIgFAAIgIAAIgWAAQhZAAhTgNg");
	this.shape_20.setTransform(132.4,98.7);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#FCFB2E").s().p("AmtQYQhwgRhngoQhSgghMguIBUh9QBIArBPAcICdAoIAFABQBIALBMAAIAfgBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBNgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg2gUg8gMQhRgRhXgCIgYAAIgGAAIAAiWIAGAAIAYAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAtAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgtAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgXAAQhYAAhUgNg");
	this.shape_21.setTransform(124.5,98.7);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#FCFB2E").s().p("AlhQYQhwgRhmgoQhSgghNguQhPgxhKhBIBch3QBFA+BMAuQBIArBPAcICeAoIAEABIAAAAQBIALBNAAIAfgBQA0gBAygHIAfgEIAAAAIAEgBIACAAIAGgCIAEgBIALgCQBQgQBJgeQBPggBIgwIB9hkIAHgHIAIgHIAHgIQA8g7AuhBQAvhCAhhGIAAgBIABgDIAziOIABgDIABgDIAAgCIABgFIAXiQIABgIIAAgEIABgIQABgdABgeIAAgCIAAgGIAAgDIgBgHIAAgJQgBgtgFgsIgBgFQgDgZgEgZQgLg9gTg5IgBgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgGgHIgRgVIgGgHIglgnIgCgDIgBgBIgCgCIgDgCIgCgCIgIgIIgDgDIhrhbIgEgDQg1glg5gdQgygag2gTQg4gUg8gMQhPgRhYgCIgXAAIgGAAIAAiWIAGAAIAXAAIADAAIAIAAIAEAAIAFABIAIAAIAFAAIAFAAIAIABIAuAEIADAAIAAAAIAEAAIAHABIACAAIADAAIAnAGIAIABIABABIANACIAIABIAHABIABABIAFAAIABABQAvAJAtANQB8AlBvBEIAFAEIAFACIACACIAAAAIABABIACABQBIAuBDA7QAaAXAYAZIAGAFIADAEIACACIAaAbIAFAFIAJALIADACIADAEIAJALIAEAEQA1BAAqBFQBaCUAjCrIAEAWIAHAtQAKBMABBPQgBAlgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgCAGQgVAsgZArQgSAdgTAcQg5BThMBLIgIAIQhABAhGAxQhdBDhmArIgXAJIgPAGIgLAEIgNAFIgGACIgNAEQgtAPgwAKIgOADQglAIgkAEIgCABQg3AHg6ACIgGAAIgHAAIgWAAQhZAAhUgNg");
	this.shape_22.setTransform(116.8,98.7);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#FCFB2E").s().p("AkOQYQhwgRhmgoQhSgghNguQhPgxhKhBQgagXgagaQg/g/gyhFIB8hUQArA5A1A1IAlAkQBFA+BMAuQBIArBPAcICeAoIABAAIADABIAAAAQBIALBNAAIAfgBQA0gBAwgHIAfgEIAAAAIAEgBIACAAIAGgCIAGgBIALgCQBQgQBJgeQBPggBIgwIB9hkIAHgHIAIgHIAHgIQA8g7AuhBQAvhCAhhGIAAgBIABgDIAziOIABgDIABgDIAAgCIABgFIAXiQIABgIIAAgEIABgIQABgdABgeIAAgCIAAgGIAAgDIgBgHIAAgJQgBgtgFgsIgBgFQgDgZgEgZQgLg9gTg5IgBgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgGgHIgRgVIgGgHIglgnIgCgDIgBgBIgCgCIgDgCIgCgCIgIgIIgCgDIhshbIgEgDQg1glg5gdQgygag2gTQg4gUg8gMQhRgRhWgCIgXAAIgGAAIAAiWIAGAAIAXAAIADAAIAIAAIAEAAIAFABIAIAAIAFAAIAFAAIAIABIAsAEIADAAIAAAAIAEAAIAHABIACAAIADAAIAnAGIAKABIABABIANACIAIABIAHABIABABIAFAAIABABQAvAJAtANQB8AlBvBEIAFAEIAFACIACACIAAAAIABABIACABQBIAuBDA7QAaAXAYAZIAGAFIADAEIACACIAaAbIAFAFIAJALIADACIADAEIAJALIAEAEQA1BAAqBFQBaCUAjCrIAEAWIAHAtQAKBMABBPQgBAlgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgCAGQgVAsgZArQgSAdgTAcQg5BThMBLIgIAIQhABAhGAxQhdBDhmArIgXAJIgPAGIgLAEIgNAFIgGACIgNAEQgtAPgwAKIgOADQglAIgmAEIgCABQg1AHg6ACIgGAAIgHAAIgWAAQhZAAhUgNg");
	this.shape_23.setTransform(108.5,98.7);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#FCFB2E").s().p("AjfQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPICGhGQAjBKAzBEIBSBgIAJAJIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBMAAIAfgBQAygBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhVgCIgYAAIgGAAIAAiWIAGAAIAYAAIACAAIAJAAIADAAIAGABIAHAAIADAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg3ACIgGAAIgHAAIgXAAQhYAAhUgNg");
	this.shape_24.setTransform(103.9,98.7);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#FCFB2E").s().p("Ai7QYQhwgRhngoQhSgghMguQhQgxhJhBQgbgXgZgaQhAg/gyhFQg2hKgnhPQguhdgahlICMg8QAWBgArBYQAkBKAzBEIBSBgIAFAFIAEAEIACACIAlAkQBFA+BMAuQBJArBOAcICeAoIABAAIADABIAAAAQBIALBNAAIAdgBQA0gBAygHIAfgEIAAAAIAEgBIACAAIAHgCIAFgBIALgCQBQgQBJgeQBPggBIgwIB9hkIAIgHIAHgHIAIgIQA7g7AuhBQAvhCAhhGIAAgBIABgDIA0iOIAAgDIABgDIAAgCIABgFIAYiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIgBgHIAAgJQgBgtgFgsIgBgFQgDgZgEgZQgLg9gTg5IgBgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgGgHIgRgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhshbIgEgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhYgCIgVAAIgGAAIAAiWIAGAAIAVAAIADAAIAJAAIADAAIAFABIAJAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIACAAIADAAIAnAGIAKABIABABIAOACIAIABIAGABIACABIAEAAIABABQAvAJAtANQB8AlBvBEIAFAEIAFACIACACIABAAIAAABIACABQBJAuBCA7QAaAXAZAZIAFAFIAEAEIABACIAaAbIAFAFIAJALIADACIADAEIAKALIADAEQA1BAAqBFQBaCUAjCrIAEAWIAHAtQALBMAABPQAAAlgCAkIgBAEQgGBdgUBXIgCAFQgXBegoBWIgCAGQgVAsgZArQgSAdgTAcQg5BThLBLIgJAIQhABAhGAxQhcBDhnArIgXAJIgOAGIgMAEIgNAFIgGACIgMAEQguAPgwAKIgNADQglAIgmAEIgCABQg4AHg6ACIgGAAIgHAAIgUAAQhZAAhTgNg");
	this.shape_25.setTransform(100.3,98.7);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#FCFB2E").s().p("AitQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQguhdgZhlQgWhVgHhbICUghQAFBNAQBIIAEAPIABAGIABADIACAIQAVBPAkBJQAjBKAzBEIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIACAAIACABIABAAQBIALBNAAIAcgBQA1gBAygHIAegEIABAAIADgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AvhBQAuhCAhhGIABgBIABgDIAziOIAAgDIABgDIABgCIABgFIAXiQIAAgIIABgEIAAgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgBgEIhHieIgBgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag1gTQg5gUg7gMQhSgRhXgCIgVAAIgGAAIAAiWIAGAAIAVAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAoAGIAJABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAGAEIAFACIACACIAAAAIABABIACABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAKALIACACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAFAWIAHAtQAKBMAABPQAAAlgCAkIAAAEQgGBdgVBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhmArIgXAJIgPAGIgMAEIgMAFIgHACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg3AHg6ACIgGAAIgHAAIgUAAQhZAAhUgNg");
	this.shape_26.setTransform(98.8,98.7);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPIhGi7IgBgHIgDgLIgaihIAAgEQgEgvAAgwQAAgvAEgvIADgjICYAAIgFAjQgEAvAAAvQAAAfACAfIACAXIAEAkIACAVQAFAfAGAeIABACIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_27.setTransform(98.7,98.7);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgBIAAgBIAAgBIAAgCQgEgvAAgwQAAgvAEgvIADghIAAgCQALhjAdhcICMA3QgTBCgJBGIgFAjQgEAsAAAuIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIIAKAzIAAACIABACIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_28.setTransform(98.7,98.7);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgCIAAgBIAAgCQgEgvAAgwQAAgvAEgvQARjaBji3ICEBIQgsBSgYBZIgEAOQgOA1gHA4IgFAjQgEAsAAAuIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIQAEAaAGAZIAAACIAAABIABABIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_29.setTransform(98.7,98.7);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgCIAAgDQgEgvAAgwQAAgvAEgvQARjaBji3QAwhZBChRIB7BXQg9BKgsBRIgBACIhACfIgDAKIgEAOIgEANIgRBgIgFAjIAAACIgEBSIAAADIAAADIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIQAEAaAGAZIAAACIAAABIABABIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_30.setTransform(98.7,98.7);

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgCIAAgDQgEgvAAgwQAAgvAEgvQARjaBji3IAMgWQAshNA6hHQAkgrApgpQAcgcAdgZIBrBqQgeAZgcAcQggAggcAhIhjCRIgGAKIgBACIhACfIgDAKIgEAOIgEANIgRBgIgBACIgDAeIgBADIAAACQgDAogBAoIAAAFIAAADIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIQAEAaAGAZIAAACIAAABIABABIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_31.setTransform(98.7,98.7);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgCIAAgDQgEgvAAgwQAAgvAEgvQARjaBji3IAMgWIALgTQARgcASgaIANgTIAQgWIAbgiQAkgrApgpQAcgcAdgZQBOhFBWgzIBmBzQhUAuhLBBQgeAZgcAcQggAggcAhIhjCRIgDAFIgDAFIgBABIAAABIhACfIgDAKIgEAOIgEANQgLAvgGAxIgBACIgDAeIgBADIAAACIgBAKQgCAigBAkIAAAFIAAADIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIQAEAaAGAZIAAACIAAABIABABIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_32.setTransform(98.7,98.7);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgCIAAgDQgEgvAAgwQAAgvAEgvQARjaBji3IAMgWIABgCIADgEIAHgNQARgcASgaIANgTIAQgWIAbgiIAIgJIA6hAIADgCIACgDIADgDIADgDQAcgcAdgZQBOhFBWgzQBQguBWgfIBACJQhCAWg+AhQhUAuhLBBQgeAZgcAcQggAggcAhIhjCRIgDAFIgCADIgBACIAAABIgCADIg/CdIgDAKIgEAOIgEANQgLAvgGAxIgBACIgDAeIgBADIAAACIAAAEIgBAGIgCAiIgBAkIAAAFIAAADIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIQAEAaAGAZIAAACIAAABIABABIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_33.setTransform(98.7,98.7);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#FCFB2E").s().p("AirQYQhwgRhngoQhSgghMguQhQgxhJhBQgagXgagaQg/g/gzhFQg2hKgnhPQgshagahhIgBgHIgDgLQgThNgHhTIAAgCIAAgDQgEgvAAgwQAAgvAEgvQARjaBji3IAMgWIABgCIADgEIACgEIAFgJQARgcASgaIANgTIAQgWIAbgiIAFgFIACgCIABgCQAcgiAgggIABAAIACgDIADgDIADgDQAcgcAdgZQBOhFBWgzIAhgSIAbgOIBngsIADgBQBWgfBdgPIAeCTQhLAMhGAYQhCAWg+AhQhUAuhLBBQgeAZgcAcQggAggcAhIhjCRIgDAFIgCADIgBACIAAABIgBABIgBADIg/CcIgDAKIgEAOIgEANQgLAvgGAxIgBACIgDAeIgBADIAAACIAAAEIAAAEIgBACIgCAiIgBAkIAAAFIAAADIAAAEIAAACIAAAGIAAABIACAuIAAAHIACAXIAEAkIACAVIABAIQAEAaAGAZIAAACIAAABIABABIAAADIABADIAEAPIABAGIABADIAAADIACAFQAVBPAkBJIACAFIBUCJIBSBgIAFAFIAEAEIACACIAmAkQBFA+BMAuQBIArBPAcICdAoIABAAIADABIABAAQBIALBLAAIAegBQA0gBAzgHIAegEIAAAAIAEgBIACAAIAHgCIAFgBIAMgCQBPgQBKgeQBOggBIgwIB9hkIAIgHIAIgHIAHgIQA7g7AuhBQAvhCAhhGIABgBIABgDIAziOIAAgDIABgDIAAgCIACgFIAXiQIAAgIIAAgEIABgIQACgdAAgeIAAgCIAAgGIAAgDIAAgHIAAgJQgBgtgFgsIgBgFQgDgZgFgZQgKg9gTg5IgCgEIhHieIAAgBIgDgFIgCgDQgfg0gngxIgFgHIgSgVIgGgHIgkgnIgDgDIgBgBIgCgCIgCgCIgCgCIgIgIIgDgDIhrhbIgFgDQg1glg4gdQgzgag2gTQg4gUg8gMQhRgRhXgCIgXAAIgFAAIAAiWIAFAAIAXAAIACAAIAJAAIADAAIAGABIAIAAIAEAAIAFAAIAJABIAuAEIACAAIAAAAIAFAAIAGABIADAAIACAAIAnAGIAKABIACABIANACIAIABIAHABIABABIAEAAIABABQAvAJAuANQB7AlBvBEIAFAEIAGACIABACIABAAIAAABIADABQBIAuBCA7QAaAXAZAZIAFAFIAEAEIACACIAZAbIAFAFIAJALIADACIAEAEIAJALIADAEQA2BAAqBFQBaCUAiCrIAEAWIAIAtQAKBMAABPQAAAlgCAkIAAAEQgHBdgUBXIgBAFQgXBegoBWIgDAGQgVAsgZArQgRAdgUAcQg5BThLBLIgIAIQhBBAhFAxQhdBDhnArIgWAJIgPAGIgMAEIgNAFIgGACIgMAEQguAPgvAKIgOADQglAIgmAEIgCABQg4AHg5ACIgGAAIgHAAIgWAAQhXAAhUgNg");
	this.shape_34.setTransform(98.7,98.7);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#FAEA63").s().p("ArtLuQk3k3AAm3QAAm2E3k3QE3k3G2AAQG3AAE3E3QE3E3AAG2QAAG3k3E3Qk3E3m3AAQm2AAk3k3gAqDqDQkLELAAF4QAAF5ELELQELELF4AAQF5AAELkLQELkLAAl5QAAl4kLkLQkLkLl5AAQl4AAkLELg");
	this.shape_35.setTransform(98.7,98.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},3).to({state:[{t:this.shape_2}]},2).to({state:[{t:this.shape_3}]},2).to({state:[{t:this.shape_4}]},2).to({state:[{t:this.shape_5}]},2).to({state:[{t:this.shape_6}]},2).to({state:[{t:this.shape_7}]},3).to({state:[{t:this.shape_8}]},3).to({state:[{t:this.shape_9}]},3).to({state:[{t:this.shape_10}]},3).to({state:[{t:this.shape_11}]},3).to({state:[{t:this.shape_12}]},3).to({state:[{t:this.shape_13}]},3).to({state:[{t:this.shape_14}]},3).to({state:[{t:this.shape_15}]},3).to({state:[{t:this.shape_16}]},3).to({state:[{t:this.shape_17}]},3).to({state:[{t:this.shape_18}]},3).to({state:[{t:this.shape_19}]},3).to({state:[{t:this.shape_20}]},3).to({state:[{t:this.shape_21}]},3).to({state:[{t:this.shape_22}]},3).to({state:[{t:this.shape_23}]},3).to({state:[{t:this.shape_24}]},3).to({state:[{t:this.shape_25}]},3).to({state:[{t:this.shape_26}]},3).to({state:[{t:this.shape_27}]},3).to({state:[{t:this.shape_28}]},3).to({state:[{t:this.shape_29}]},3).to({state:[{t:this.shape_30}]},3).to({state:[{t:this.shape_31}]},3).to({state:[{t:this.shape_32}]},3).to({state:[{t:this.shape_33}]},3).to({state:[{t:this.shape_34}]},3).to({state:[{t:this.shape_35}]},2).wait(1));

	// fundoCarrega
	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#0066CC").s().p("ArtLuQk3k3AAm3QAAm2E3k3QE3k3G2AAQG3AAE3E3QE3E3AAG2QAAG3k3E3Qk3E3m3AAQm2AAk3k3gAqDqDQkLELAAF4QAAF5ELELQELELF4AAQF5AAELkLQELkLAAl5QAAl4kLkLQkLkLl5AAQl4AAkLELg");
	this.shape_36.setTransform(98.7,98.7);

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#FFCC00").s().p("ApZJZQj5j5AAlgQAAlfD5j6QD6j5FfAAQFgAAD5D5QD6D6AAFfQAAFgj6D5Qj5D6lgAAQlfAAj6j6g");
	this.shape_37.setTransform(98.7,98.7);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#86B1DD").s().p("AAARhQnPAAlIlJQlJlIAAnQQAAnPFJlIQFIlJHPAAQHQAAFIFJQFJFIAAHPQAAHQlJFIQlIFJnQAAIAAAAgApZpZQj5D6AAFfQAAFgD5D5QD6D6FfAAQFgAAD5j6QD6j5AAlgQAAlfj6j6Qj5j5lgAAQlfAAj6D5g");
	this.shape_38.setTransform(98.6,98.6);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#EEED66").s().p("ApZJZQj5j5AAlgQAAlfD5j6QD6j5FfAAQFgAAD5D5QD6D6AAFfQAAFgj6D5Qj5D6lgAAQlfAAj6j6g");
	this.shape_39.setTransform(98.7,98.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36}]}).wait(100));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-13.4,-13.4,224.3,224.3);


(lib.CaixaPerdeu = function() {
	this.initialize();

	// Layer 1
	this.text = new cjs.Text("AH, QUE PENA! NÃO FOI DESSA VEZ! QUER JOGAR DE NOVO?", "21px Arial", "#5A3803");
	this.text.textAlign = "center";
	this.text.lineHeight = 23;
	this.text.lineWidth = 252;
	this.text.setTransform(-1.9,-76.9);

	this.instance = new lib.caixa();
	this.instance.setTransform(234.7,151.5,1,1,0,0,0,234.7,151.5);

	this.addChild(this.instance,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-161.8,-105.9,323.8,211.9);


(lib.CaixaGanhou = function() {
	this.initialize();

	// Layer 1
	this.text = new cjs.Text("PARABÉNS! QUER JOGAR DE NOVO?", "21px Arial", "#5A3803");
	this.text.textAlign = "center";
	this.text.lineHeight = 23;
	this.text.lineWidth = 252;
	this.text.setTransform(-1.9,-76.9);

	this.instance = new lib.caixa();

	this.addChild(this.instance,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-161.8,-105.8,323.8,211.9);


(lib.botaoOK = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 4
	this.instance = new lib.maoOK();
	this.instance.setTransform(60.7,54.4,1,1,0,0,0,22.6,34.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({scaleX:1.77,scaleY:1.77},0).wait(1).to({scaleX:0.78,scaleY:0.78},0).to({_off:true},1).wait(1));

	// Layer 2
	this.instance_1 = new lib.caixabotao();
	this.instance_1.setTransform(62.6,49.9,1,1,0,0,180,0,48.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({scaleX:1.1,scaleY:1.1},0).wait(1).to({regY:48.4,scaleX:0.81,scaleY:0.81},0).wait(1).to({regY:48.3,scaleX:1,scaleY:1},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(3.7,1.6,117.8,96.7);


(lib.BotaoNAO = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 5
	this.instance = new lib.maoNAO();
	this.instance.setTransform(64.8,54.8,1,1,0,0,0,22.4,33.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({scaleX:1.77,scaleY:1.77,x:63.8,y:49.9},0).wait(1).to({scaleX:0.78,scaleY:0.78,x:64.8,y:49.8},0).to({_off:true},1).wait(1));

	// Layer 4
	this.instance_1 = new lib.caixabotao();
	this.instance_1.setTransform(62.6,49.9,1,1,0,0,0,0,48.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({scaleX:1.1,scaleY:1.1,x:60.2},0).wait(1).to({scaleX:0.83,scaleY:0.83,x:67.2},0).wait(1).to({scaleX:1,scaleY:1,x:62.6},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(3.7,1.6,117.8,96.7);


(lib.botaoSom = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// txt
	this.instance = new lib.txtSom();
	this.instance.setTransform(32.6,41.7,1,1,0,0,0,39,22.3);
	this.instance.shadow = new cjs.Shadow("rgba(0,0,0,1)",0,5,10);

	this.instance_1 = new lib.txtSomOut();
	this.instance_1.setTransform(39,22.3,1,1,0,0,0,39,22.3);
	this.instance_1.shadow = new cjs.Shadow("rgba(0,0,0,1)",0,5,10);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12.3,-26.7,87.3,104.2);


(lib.Bloco = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.quadrado_mc();
	this.instance.setTransform(22.5,22.5,1,1,0,0,0,22.5,22.5);

	this.instance_1 = new lib.retangulo_mc();
	this.instance_1.setTransform(22.5,22.5,1,1,0,0,0,22.5,22.5);

	this.instance_2 = new lib.circulo_mc();
	this.instance_2.setTransform(22.5,22.5,1,1,0,0,0,22.5,22.5);

	this.instance_3 = new lib.triangulo_mc();
	this.instance_3.setTransform(22.5,22.5,1,1,0,0,0,22.5,22.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,50,50);


(lib.tutoria2_mc = function() {
	this.initialize();

	// destaques
	this.instance = new lib.destaques();
	this.instance.setTransform(22.7,3.7);

	// interface
	this.tempo_mc = new lib.miniTempo2_mc();
	this.tempo_mc.setTransform(106,-55.8,0.4,0.4);
	this.tempo_mc.shadow = new cjs.Shadow("#006666",0,0,2);

	this.instance_1 = new lib.miniPontos3_mc();
	this.instance_1.setTransform(107.1,45.5,0.4,0.4);

	// destaque
	this.instance_2 = new lib.miniDestaque_mc();
	this.instance_2.setTransform(-29.7,5.7,0.4,0.4);

	// blocos
	this.instance_3 = new lib.miniEstrela_mc();
	this.instance_3.setTransform(-9.6,-13.8,0.4,0.4);

	this.instance_4 = new lib.miniQuadrado();
	this.instance_4.setTransform(-69.2,-52.4,0.4,0.4);

	this.instance_5 = new lib.miniQuadrado();
	this.instance_5.setTransform(-29.7,5.7,0.4,0.4);

	this.instance_6 = new lib.miniRetangulo();
	this.instance_6.setTransform(10.5,44.2,0.4,0.4);

	this.instance_7 = new lib.miniRetangulo();
	this.instance_7.setTransform(-9.4,-13.7,0.4,0.4);

	this.instance_8 = new lib.miniRetangulo();
	this.instance_8.setTransform(-69.2,-32.9,0.4,0.4);

	this.instance_9 = new lib.miniCirculo();
	this.instance_9.setTransform(-9.4,5.7,0.4,0.4);

	this.instance_10 = new lib.miniCirculo();
	this.instance_10.setTransform(-9.4,24.7,0.4,0.4);

	this.instance_11 = new lib.miniCirculo();
	this.instance_11.setTransform(-49,44.2,0.4,0.4);

	this.instance_12 = new lib.miniCirculo();
	this.instance_12.setTransform(-29.7,64.2,0.4,0.4);

	this.instance_13 = new lib.miniCirculo();
	this.instance_13.setTransform(-88.9,5.7,0.4,0.4);

	this.instance_14 = new lib.miniRetangulo();
	this.instance_14.setTransform(-49,24.7,0.4,0.4);

	this.instance_15 = new lib.miniRetangulo();
	this.instance_15.setTransform(-69.2,5.7,0.4,0.4);

	this.instance_16 = new lib.miniQuadrado();
	this.instance_16.setTransform(-9.4,44.2,0.4,0.4);

	this.instance_17 = new lib.miniQuadrado();
	this.instance_17.setTransform(10.5,64.2,0.4,0.4);

	this.instance_18 = new lib.miniQuadrado();
	this.instance_18.setTransform(-69.2,24.7,0.4,0.4);

	this.instance_19 = new lib.miniQuadrado();
	this.instance_19.setTransform(-29.7,44.2,0.4,0.4);

	this.instance_20 = new lib.miniTriangulo();
	this.instance_20.setTransform(-69.2,44.2,0.4,0.4);

	this.instance_21 = new lib.miniTriangulo();
	this.instance_21.setTransform(-49,64.2,0.4,0.4);

	this.instance_22 = new lib.miniTriangulo();
	this.instance_22.setTransform(-69.2,-13.7,0.4,0.4);

	this.instance_23 = new lib.miniTriangulo();
	this.instance_23.setTransform(-88.9,24.7,0.4,0.4);

	this.instance_24 = new lib.miniQuadrado();
	this.instance_24.setTransform(-69.2,64.2,0.4,0.4);

	this.instance_25 = new lib.miniCirculo();
	this.instance_25.setTransform(-88.9,44.2,0.4,0.4);

	this.instance_26 = new lib.miniTriangulo();
	this.instance_26.setTransform(-29.7,24.7,0.4,0.4);

	this.instance_27 = new lib.miniRetangulo();
	this.instance_27.setTransform(-9.4,64.2,0.4,0.4);

	this.instance_28 = new lib.miniQuadrado();
	this.instance_28.setTransform(-88.9,64.2,0.4,0.4);

	// coruja
	this.corrente_mc = new lib.miniCoruja_mc();
	this.corrente_mc.setTransform(-30.7,-62.9,0.4,0.4);

	// tronco
	this.instance_29 = new lib.troncoArea();
	this.instance_29.setTransform(-125.3,-82.8,0.383,0.383);

	this.instance_30 = new lib.Bitmap32();
	this.instance_30.setTransform(-104.6,-50.6,0.383,0.397);

	// base
	this.instance_31 = new lib.Landscapechamomile7();
	this.instance_31.setTransform(160,-119.9,0.4,0.4,0,0,180);

	this.addChild(this.instance_31,this.instance_30,this.instance_29,this.corrente_mc,this.instance_28,this.instance_27,this.instance_26,this.instance_25,this.instance_24,this.instance_23,this.instance_22,this.instance_21,this.instance_20,this.instance_19,this.instance_18,this.instance_17,this.instance_16,this.instance_15,this.instance_14,this.instance_13,this.instance_12,this.instance_11,this.instance_10,this.instance_9,this.instance_8,this.instance_7,this.instance_6,this.instance_5,this.instance_4,this.instance_3,this.instance_2,this.instance_1,this.tempo_mc,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-159.9,-119.9,320,240);


(lib.tutoria1_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// ponteiro
	this.instance = new lib.ponteiro_mc();
	this.instance.setTransform(129.2,93.7,1,1,0,0,0,-2.5,-2.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(19).to({x:12.5,y:-101.9},11).wait(1).to({alpha:0.5},0).wait(8).to({x:-10.8},4).wait(43).to({x:-27.3},0).to({x:-67.3},5).wait(59));

	// interface
	this.pontos_mc = new lib.miniPontos_mc();
	this.pontos_mc.setTransform(106.5,45.5,0.4,0.4);

	this.tempo_mc = new lib.miniTempo_mc();
	this.tempo_mc.setTransform(105.8,-55.8,0.4,0.4);
	this.tempo_mc.shadow = new cjs.Shadow("rgba(0,102,102,1)",0,0,2);

	this.instance_1 = new lib.miniPontos2_mc();
	this.instance_1.setTransform(106.5,45.5,0.4,0.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.tempo_mc},{t:this.pontos_mc}]}).to({state:[{t:this.tempo_mc},{t:this.instance_1}]},120).wait(30));

	// destaque
	this.instance_2 = new lib.miniDestaque_mc();
	this.instance_2.setTransform(8.6,65.1,0.4,0.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(43).to({x:-10.6,y:45.6},0).wait(16).to({y:-77.5},4).wait(24).to({x:-30.7},0).wait(2).to({x:-50},0).wait(2).to({x:-69.4},0).wait(19).to({y:65.1},4).to({_off:true},6).wait(30));

	// bloco sugado
	this.instance_3 = new lib.explode_mc();
	this.instance_3.setTransform(-69.4,65.5);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(120).to({_off:false},0).to({alpha:0},4).wait(26));

	// bloco sugado
	this.instance_4 = new lib.miniQuadrado();
	this.instance_4.setTransform(-10.8,46,0.4,0.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(59).to({x:-10.6,y:-77.5},4).wait(24).to({x:-30.7},0).wait(2).to({x:-50},0).wait(2).to({x:-69.4},0).wait(19).to({y:65.5},4).to({_off:true},6).wait(30));

	// blocos
	this.instance_5 = new lib.miniQuadrado();
	this.instance_5.setTransform(-49.9,65.5,0.4,0.4);

	this.instance_6 = new lib.miniCirculo();
	this.instance_6.setTransform(-10.8,65.5,0.4,0.4);

	this.instance_7 = new lib.miniTriangulo();
	this.instance_7.setTransform(-30.3,65.5,0.4,0.4);

	this.instance_8 = new lib.miniRetangulo();
	this.instance_8.setTransform(8.7,65.5,0.4,0.4);

	this.instance_9 = new lib.miniQuadrado();
	this.instance_9.setTransform(-88.9,65.5,0.4,0.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5}]}).to({state:[{t:this.instance_8},{t:this.instance_6},{t:this.instance_7}]},120).wait(30));

	// coruja
	this.corrente_mc = new lib.miniCoruja_mc();
	this.corrente_mc.setTransform(8.8,-62.9,0.4,0.4);

	this.instance_10 = new lib.miniCoruja2_mc();
	this.instance_10.setTransform(-10.9,-79.4,0.4,0.4,0,0,0,0,-41.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.corrente_mc,p:{x:8.8}}]}).to({state:[{t:this.corrente_mc,p:{x:-10.9}}]},43).to({state:[{t:this.instance_10,p:{x:-10.9}}]},20).to({state:[{t:this.instance_10,p:{x:-31.2}}]},24).to({state:[{t:this.instance_10,p:{x:-50.2}}]},2).to({state:[{t:this.instance_10,p:{x:-69.7}}]},2).to({state:[{t:this.corrente_mc,p:{x:-69.8}}]},24).wait(35));

	// mouse
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#666666").s().p("Ag2GNQhcAAhAhAQhChCAAhdIAAlcQAAhcBChBQBAhBBcAAIBsAAQBdAABCBBQBABBAABcIAAFcQAABdhABCQhCBAhdAAgAjPlHQhAA/AABaIAAFcQAABbBABAQA/A/BaAAIBsAAQBbAABAg/QA/hAAAhbIAAlcQAAhag/g/QhAhAhbAAIhsAAQhaAAg/BAg");
	this.shape.setTransform(-129,-76.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CCCCCC").s().p("Ag2FiQhKAAg0g0Qg2g1AAhLIAAkEICyAAIAABIQAAAXARARQAQAQAXAAQAXAAASgQQAQgRAAgXIAAhIICxAAIAAEEQABBLg1A1Qg1A0hLAAgAgKgBQgGgFAAgIIAAiVQAAgHAGgGQAEgFAGAAIAAAAQAHAAAFAFQAFAGAAAHIAACVQAAAIgFAFQgFADgHAAQgFAAgFgDgAA5h+IAAglQAAgYgQgRQgKgKgMgDIAAiJIAjAAQBLAAA1A1QA1A1gBBKIAAAwgAjqh+IAAgwQAAhKA2g1QA0g1BKAAIAkAAIAACJQgMADgJAKQgRARAAAYIAAAlg");
	this.shape_1.setTransform(-129,-76.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("Ag2GIQhaAAg/g/QhAhAAAhbIAAlcQAAhaBAg/QA/hABaAAIBsAAQBbAABABAQA/A/AABaIAAFcQAABbg/BAQhAA/hbAAgAjqCuQAABLA2A1QA0A0BKAAIBsAAQBLAAA1g0QA1g1gBhLIAAkEIixAAIAABIQAAAXgQARQgSAQgXAAQgXAAgQgQQgRgRAAgXIAAhIIiyAAgAgKiwQgGAGAAAHIAACVQAAAIAGAFQAFADAFAAQAHAAAFgDQAFgFAAgIIAAiVQAAgHgFgGQgFgFgHAAIAAAAQgGAAgEAFgAATjZQAMADAKAKQAQARAAAYIAAAlICxAAIAAgwQABhKg1g1Qg1g1hLAAIgjAAgAi0ktQg2A1AABKIAAAwICyAAIAAglQAAgYARgRQAJgKAMgDIAAiJIgkAAQhKAAg0A1g");
	this.shape_2.setTransform(-129,-76.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#CC0000").s().p("AhqBxIAAgvQAAhJA1g0QA0g1BJAAIAjAAIAACGQgLAEgKAJQgQARgBAYIAAAlg");
	this.shape_3.setTransform(-141.7,-100.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#CCCCCC").s().p("Ag2FiQhKAAg0g0Qg2g1AAhLIAAkEICyAAIAABIQAAAXARARQAQAQAXAAQAXAAASgQQAQgRAAgXIAAhIICxAAIAAEEQABBLg1A1Qg1A0hLAAgAgKgBQgGgFAAgIIAAiVQAAgHAGgGQAEgFAGAAIAAAAQAHAAAFAFQAFAGAAAHIAACVQAAAIgFAFQgFADgHAAQgFAAgFgDgAA5h+IAAglQAAgYgQgRQgKgKgMgDIAAiJIAjAAQBLAAA1A1QA1A1gBBKIAAAwg");
	this.shape_4.setTransform(-129,-76.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2},{t:this.shape_4},{t:this.shape},{t:this.shape_3}]},58).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},11).to({state:[{t:this.shape_2},{t:this.shape_4},{t:this.shape},{t:this.shape_3}]},40).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]},11).wait(30));

	// tronco
	this.instance_11 = new lib.troncoArea();
	this.instance_11.setTransform(-125.3,-82.8,0.383,0.383);

	this.instance_12 = new lib.Bitmap32();
	this.instance_12.setTransform(-104.6,-50.6,0.383,0.397);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12},{t:this.instance_11}]}).wait(150));

	// base
	this.instance_13 = new lib.Landscapechamomile7();
	this.instance_13.setTransform(160,-119.9,0.4,0.4,0,0,180);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_13}]}).wait(150));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-159.9,-119.9,320,240);


(lib.ErroSOS = function() {
	this.initialize();

	// Layer 1
	this.nao_btn = new lib.BotaoNAO();
	this.nao_btn.setTransform(-127.3,4.6);
	new cjs.ButtonHelper(this.nao_btn, 0, 1, 2, false, new lib.BotaoNAO(), 3);

	this.sim_btn = new lib.botaoOK();
	this.sim_btn.setTransform(12.9,4.6);
	new cjs.ButtonHelper(this.sim_btn, 0, 1, 2, false, new lib.botaoOK(), 3);

	this.instance = new lib.CaixaPerdeu();
	this.instance.setTransform(0,-39.7);

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.502)").s().p("Eg+eAu4MAAAhdvMB89AAAMAAABdvg");

	this.addChild(this.shape,this.instance,this.sim_btn,this.nao_btn);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-399.9,-299.9,800,600.1);


(lib.AcertoSOS = function() {
	this.initialize();

	// Layer 1
	this.nao_btn = new lib.BotaoNAO();
	this.nao_btn.setTransform(-127.3,4.6);
	new cjs.ButtonHelper(this.nao_btn, 0, 1, 2, false, new lib.BotaoNAO(), 3);

	this.sim_btn = new lib.botaoOK();
	this.sim_btn.setTransform(12.9,4.6);
	new cjs.ButtonHelper(this.sim_btn, 0, 1, 2, false, new lib.botaoOK(), 3);

	this.instance = new lib.CaixaGanhou();
	this.instance.setTransform(0,-39.7);

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.502)").s().p("Eg+eAu4MAAAhdvMB89AAAMAAABdvg");

	this.addChild(this.shape,this.instance,this.sim_btn,this.nao_btn);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-399.9,-300,800,600.1);


(lib.botaoReiniciarAnima = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Tween5();

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:1.24,scaleY:1.24},5).to({scaleX:1.06,scaleY:1.06},5).wait(1));

	// Layer 2
	this.instance_1 = new lib.Tween6("synched",0);
	this.instance_1.setTransform(-0.8,22.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({scaleX:1.32,scaleY:1.32,y:24.6},5).to({scaleX:1,scaleY:1,y:22.6},5).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-33.2,-30.9,64.5,59.1);


(lib.jogo_mc = function() {
	this.initialize();

	// tempo
	this.tempo_mc = new lib.tempo_mc();
	this.tempo_mc.setTransform(486.1,-330.3);
	this.tempo_mc.shadow = new cjs.Shadow("#006666",0,0,2);

	// pontos
	this.pontos_mc = new lib.pontos_mc();
	this.pontos_mc.setTransform(486.5,-122,1,0.742);

	// ima
	this.corrente_mc = new lib.corrente_mc();
	this.corrente_mc.setTransform(26,-408);

	// guia
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0.2)").ss(1,1,1,3,true).p("AXNzUIAAHvIAAHvIAAHtIAAHvIAAHvIAAHvInvAAInvAAInvAAInuAAInvAAInvAAIAAnvIAAnvIAAnvIAAntIAAnvIAAnvIAAnvIHvAAIHvAAIHuAAIHvAAIHvAAIHvAAIAAHvInvAAIAAHvIHvAAAHv7DIAAHvIHvAAIAAnvAHvj2IHvAAIAAnvInvAAgAXNj2InvAAIAAHtIHvAAAHvzUInvAAIAAHvIHvAAgAnu7DIAAHvIHuAAIAAnvA3MzUIHvAAIAAnvA3Mj2IHvAAIAAnvInvAAAnurlIAAHvIHuAAIAAnvgAvdj2IAAHtIHvAAIAAntgAnuzUInvAAIAAHvIHvAAgAnuLmIHuAAIAAnvInuAAgAvdD3IAAHvIHvAAA3MTVIHvAAIAAnvInvAAA3MD3IHvAAAnubEIAAnvInvAAIAAHvAAAbEIAAnvInuAAIAAnvAAATVIHvAAIAAnvInvAAgAPeD3InvAAIAAHvIHvAAgAXNLmInvAAIAAHvIHvAAAPebEIAAnvInvAAIAAHvAHvD3IAAntInvAAIAAHtg");
	this.shape.setTransform(150,-175.2);

	// mask
	this.areaJogo_mc = new lib.areaJogo_mc();
	this.areaJogo_mc.setTransform(0,-1.9);

	// fundoBete
	this.instance = new lib.troncoArea();
	this.instance.setTransform(-74.7,-416.2);

	// fundo
	this.instance_1 = new lib.Bitmap32();
	this.instance_1.setTransform(-28.4,-347.9,1,1.036);

	this.addChild(this.instance_1,this.instance,this.areaJogo_mc,this.shape,this.corrente_mc,this.pontos_mc,this.tempo_mc);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-74.7,-474.5,658.3,559.3);


(lib.carregar_mc = function() {
	this.initialize();

	// lapis
	this.instance = new lib.carregando_loader();
	this.instance.setTransform(0.1,0.1,1,1,0,0,0,98.7,98.7);

	// fundo
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#316293").s().p("Eg+eAu3MAAAhdtMB89AAAMAAABdtg");

	this.addChild(this.shape,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-399.9,-299.9,800,600);


(lib.botaoReiniciar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#669900").s().p("AiUDaQgMgMAAgUQAAgNAEgJQADgHAFgFQAFgFAGgDQAJgDAKAAQASAAAMAMQAMALAAAVQAAAVgMAMQgLAMgTAAQgTAAgLgMgAiICjQgGAHAAAPQAAAPAHAHQAGAIALAAQAKAAAHgIQAHgHAAgPQAAgPgHgHQgHgHgKAAQgLAAgHAHgADhDkIgNgSIgIgNIgGgEIgJgBIgDAAIAAAkIgRAAIAAhWIAkAAQAOAAAGADQAGACAFAGQADAGAAAHQAAAKgGAGQgFAHgMABQAGAEADAEQAFADAGAKIAKARgAC6CzIANAAQANAAACgBQADgBADgDQABgDAAgDQAAgFgCgCQgDgDgEgBIgMAAIgOAAgACNDkIgIgTIgiAAIgHATIgSAAIAhhWIASAAIAiBWgABoDCIAYAAIgMgggAAcDkIAAhHIgZAAIAAgPIBEAAIAAAPIgaAAIAABHgAg/DkIAAhVIASAAIAABHIArAAIAAAOgAjXDkIgehWIATAAIAVBAIAWhAIASAAIgfBWgAgEBtQg7gCgsgqQgvgugBg/QgBhBAtguQArgsA7gEIAAgaIArAtIgqAtIAAgcQgtAEggAhQgjAkAAAyQABAwAkAiQAhAhAuABIAFAAQAxAAAjgkQAjgkAAgwQgBgugggiIAbgbQAqAsABA+QABA/gtAvQguAvhAABIgCAAIgFAAg");
	this.shape.setTransform(-0.1,-3.9);

	this.instance = new lib.botaoReiniciarAnima();
	this.instance.setTransform(1.3,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#669900").s().p("AiDC/QgKgLAAgSQAAgMADgIQADgGAEgEQAFgFAFgCQAHgDAKAAQARgBAKALQAKALAAATQAAASgKALQgKALgRgBQgRABgKgLgAh3COQgGAGAAAOQAAANAGAGQAGAHAJAAQAJAAAGgHQAGgGAAgOQAAgNgGgGQgGgHgJAAQgKAAgFAHgADIDIIgMgRQgFgJgDgCQgCgDgCAAIgIgBIgDAAIAAAgIgPAAIAAhNIAgAAQAMAAAGACQAFACADAGQAEAFAAAGQAAAJgFAGQgFAGgKABQAFADADADQADAEAGAJIAJAPgAClCbIALAAQALAAADgBIAEgCQACgDAAgEQAAgEgCgCQgCgCgEgBIgLAAIgMAAgAB9DIIgHgSIgeAAIgGASIgRAAIAehNIAQAAIAfBNgABdCqIAUAAIgKgdgAAZDIIAAhAIgWAAIAAgNIA8AAIAAANIgXAAIAABAgAg3DIIAAhMIAQAAIAAA/IAmAAIAAANgAi+DIIgbhNIARAAIATA5IATg5IAQAAIgbBNgAgDBMQgzgCgmgkQgogmgBg3QgBg3AngoQAlgmAzgDIgBgJIALAAIAaAZIgkAnIAAgYQgmADgcAdQgeAeABArQAAArAfAcQAdAbAmABIAEABQArgBAegfQAegdgBgrQAAgngbgcIAWgYQAlAmAAA1QABA4gmAmQgnAog4ABIAAAAIgFAAg");
	this.shape_1.setTransform(0,-3.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF3399").s().p("AgFAGIAAgLIALALg");
	this.shape_2.setTransform(-0.3,-23.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF0000").s().p("Ak2FVQgHAAAAgGIAAqdQAAgGAHAAIJuAAQAGAAAAAGIAAKdQAAAGgGAAg");
	this.shape_3.setTransform(-1.7,-0.9,0.903,0.903);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_3}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.7,-26.9,49.3,46);


(lib.tela1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.voltar_btn = new lib.botaoReiniciar();
	this.voltar_btn.setTransform(-292.6,153.5,1.309,1.309);
	new cjs.ButtonHelper(this.voltar_btn, 0, 1, 2, false, new lib.botaoReiniciar(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.voltar_btn}]}).wait(2));

	// info
	this.instance = new lib.Bitmap35();
	this.instance.setTransform(-202.9,-43.8,0.65,0.65);

	this.instance_1 = new lib.Bitmap34();
	this.instance_1.setTransform(-235.6,-129.7,0.692,0.692);

	this.instance_2 = new lib.logo();
	this.instance_2.setTransform(-213.9,-226.5);

	this.proximo_btn = new lib.botaoParte2();
	this.proximo_btn.setTransform(276.1,140.8);
	new cjs.ButtonHelper(this.proximo_btn, 0, 1, 2, false, new lib.botaoParte2(), 3);

	this.tutorial_mc = new lib.tutoria1_mc();
	this.tutorial_mc.setTransform(163.3,-41.9);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#33CC00").s().p("AElBBQgCAAgHgMQgHgMAAgDIABgBQANgDAEgCQAJgFAAgJQAAgGgGgHIgLgLQgGgJAAgLQAAgQAPgLQAMgJASgCIABAAQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAABIALAXIAAABQAAAAAAAAQAAABAAAAQAAAAgBAAQAAAAAAAAIgDAAIgCAAQgHAAgEADQgGADAAAGQAAAFAGAIIAMANQAGAKAAAJQAAASgPANQgNALgTADgAjgAtQgSgTAAgaQAAgaASgTQASgTAbAAQAbAAASATQARATAAAaQAAAbgRASQgSATgbAAQgbAAgSgTgAjIgVQgJAKAAALQAAANAIAJQAIAJAOAAQAMAAAJgKQAIgJAAgMQAAgMgIgJQgIgKgNAAQgNAAgIAKgABFA9IgNgcIgMgdIgBgBIgBADIABAaIAAAaQAAABAAAAQAAABAAAAQgBAAAAABQgBAAAAAAIgeAAIgCgBIAAgCIABgdIABgcIgBglIgBgVIAAgCQAAAAAAgBQAAAAABAAQAAAAABgBQABAAABAAIAOAAIAPAAQAAAAAAAAQABAAAAABQAAAAABABQAAABAAABIAaA4QADAEACAAQABAAADgFIAag4QAAgBABAAQAAgBAAAAQABgBAAAAQABAAAAAAIAIAAIAIAAIAGAAIAHAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIgBAfIgBAdIABAcIABAdQAAABAAAAQgBABAAAAQAAAAgBABQAAAAgBAAIgfAAQAAAAgBAAQAAgBgBAAQAAAAAAgBQAAAAAAgBIAAgbIABgbIgBgCIgMAbIgMAfIgCACIgEABQgFAAAAgCgAk7A+QgRAAgEgBQgBAAAAgBQgBAAAAAAQAAAAgBgBQAAAAAAgBIABgdIAAgdIgBgcIgBgdIAAgBQAAgBAAAAQAAAAAAgBQAAAAABAAQABAAAAAAIAUAAIAUAAIAVgBIAVgBQAEAAABAEIAAALIABAIIABAHQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAgBAAIgUgBIgUgBIgKAAQgDACAAAHQAAAIAEABIAGABIASgBIASgBQADAAAAAQIgBAOQAAAAAAAAQgBABAAAAQAAAAAAAAQgBAAAAAAIgGAAIgcgBIgHAAQgFAAAAAEIABAcIABANQAAADgFAAgADuA9QgDgBgBgDQgDgNgCgBIgXAAIgQAAQgCACgCAIQgBAHgDABIgUAAQgNAAAAgCIAUg4IAXg+QABgBAAgBQAAAAAAgBQABAAAAgBQAAAAAAAAIAIABIAHAAIAHAAIAHAAQABAAAAAAQAAAAABAAQAAABABAAQAAABAAAAIAZA+QAVA2AAADQAAAAAAAAQAAABAAAAQAAAAgBAAQAAABgBAAIgQAAIgQAAgADMgDIgFAOQAAACAFAAIAJAAQAGAAABgBIAAgBIgEgOIgGgRIgGARgAghA9IgCgBIgCgBIgDgLIgLgaQgCgDgFAAIgJAAQgBAAAAAAQAAAAAAABQgBAAAAABQAAABAAABIABASIABASIAAACIgDAAIgQAAIgPAAQgBAAAAgBQgBAAAAAAQAAAAgBgBQAAAAAAgBIABgdIABgdQAAgkgBgUIgBgCQAAAAAAAAQABgBAAAAQAAAAABAAQABgBAAAAIAbgBIAaAAQAUAAANAJQAOAKAAATQAAANgEAIQgDAGgKAHIgCACIAKAWQAKAXAAACIgBABIgQAAIgQAAgAhFggIAAARIAAAGIAAAGIADABIALAAQATAAAAgPQAAgLgHgEQgFgDgMAAQgIAAgBADg");
	this.shape.setTransform(-93,-149.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#66CC00").s().p("AYWLIQgFgFAAgCIADgEIAGgJQADgGAAgHIAAgDIAAgDIABgFIAPgDIAQgEQADAAAAAEQAAAYgSAQIgJAHQgHAGgCAAIgGgGgAV2K7QgCAAgHgMQgHgMAAgEIABgBQANgDAEgBQAJgFAAgJQAAgGgGgHIgLgNQgGgJAAgMQAAgQAPgKQAMgJARgCIACAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAAAIALAYIAAABQAAAAAAAAQAAAAAAABQgBAAAAAAQAAAAAAAAIgDAAIgDAAQgGAAgFACQgFAEAAAGQAAAFAGAIIAMAPQAGAKAAAJQAAASgPANQgNALgTADgAR3KnQgRgTgBgbQABgbARgTQASgTAbAAQAbAAASATQARATAAAbQAAAbgRATQgRATgcAAQgbAAgSgTgASPJjQgJAJAAANQAAAOAIAJQAJAJANAAQANAAAIgKQAJgKAAgMQgBgOgHgIQgJgKgNAAQgNAAgIAKgAUGK2QgPgEgEgNQgDgFABgQIAAgLIAAgLIgBgeIgBgeQAAgBAAgBQAAAAAAAAQABgBAAAAQAAAAABAAIARAAIAQABQAAAAAAAAQABAAAAABQAAAAAAAAQABAAAAABIgBAjIgBAiQAAAPADAEQAEAGAMAAQASAAAAgRIAAgmIgBgmQAAgBAAAAQAAgBAAAAQABgBAAAAQAAAAABAAIAQgBIAPAAQABAAABAAQAAAAAAABQABAAAAAAQAAABAAABIgBAeIgBAeIAAAJIAAAIQABAXgGAIQgJAPgoAAQgRAAgLgDgAQRK3IgMgcIgNgdIgBgBIgBADIABAaIAAAaQAAAAAAABQAAAAAAABQAAAAgBAAQAAABgBAAIgdAAIgDgBIAAgCIABgdIABgdIgBgmIgBgVIAAgCQAAAAAAgBQABAAAAAAQAAgBABAAQABAAABAAIAOAAIAPgBQAAAAABABQAAAAAAAAQAAABABABQAAABAAABIAaA4QADAFACABQABgBADgGIAag4QAAgBABgBQAAAAABgBQAAAAABAAQAAgBAAAAIAIABIAIAAIAHAAIAHgBQAAAAABABQAAAAAAAAQABAAAAABQAAAAAAAAIAAAgIgBAeIABAdIAAAdQAAABAAAAQAAABgBAAQAAAAAAAAQgBAAAAABIggAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgbIABgbIgBgDIgLAbIgNAgIgCACIgDAAQgGAAAAgBgAYFK3QgGgBggABIgUAAIgUAAQgBgBAAAAQgBAAAAAAQgBAAAAgBQAAAAAAgBIACgeIABgdIgBgmIgBgUIAAgCQgBAAAAgBQABAAAAAAQAAgBAAAAQABAAABAAIATAAIATABIAUgBIAUAAQAEAAAAAEIACAMIABAMQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAgBAAIgCAAQgXgCgTAAQgFAAAAADIgBAGQAAAGACACQABABAEAAIAEAAIAEAAIAXAAIAEgBIAFAAQABAAAAAAQABAAAAAAQAAABAAAAQAAAAAAABIgBAOIgBAOQAAAAAAAAQAAABgBAAQAAAAAAAAQgBABAAAAIgIgBIgYgBIgJAAQAAAAgBAAQgBAAAAAAQgBABAAAAQgBAAAAABIAAAFQAAAHABABQACAEAJABIANAAIAOgBIANgBQABAAAAAAQABAAAAABQAAAAAAABQABAAAAABIgCAOIgDANQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAAAAAIgDgBgATUlsQgCAAgHgMQgHgNAAgDIABgBQANgCAEgDQAJgEAAgJQAAgGgGgHIgLgNQgGgJAAgLQAAgQAPgLQAMgJARgCIACAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAABIALAXIAAAAQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAAAAAIgDAAIgDAAQgGAAgFADQgFADAAAGQAAAFAGAIIAMAPQAGAJAAAKQAAASgPANQgNALgTADgAJ6lsQgCAAgHgMQgHgNAAgDIABgBQANgCAEgDQAJgEAAgJQAAgGgGgHIgLgNQgGgJAAgLQAAgQAPgLQAMgJARgCIACAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAABIALAXIAAAAQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAAAAAIgDAAIgDAAQgGAAgFADQgFADAAAGQAAAFAGAIIAMAPQAGAJAAAKQAAASgPANQgNALgTADgAoilsQgCAAgHgMQgHgNAAgDIABgBQANgCAEgDQAJgEAAgJQAAgGgGgHIgLgNQgGgJAAgLQAAgQAPgLQAMgJARgCIACAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIALAXIAAAAQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAAAAAIgDAAIgDAAQgGAAgEADQgGADAAAGQAAAFAGAIIAMAPQAGAJAAAKQAAASgPANQgNALgTADgAztlsQgCAAgHgMQgHgNAAgDIABgBQANgCAEgDQAJgEAAgJQAAgGgGgHIgLgNQgGgJAAgLQAAgQAPgLQAMgJASgCIABAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIALAXIAAAAQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAgBAAIgCAAIgCAAQgHAAgFADQgFADAAAGQAAAFAGAIIAMAPQAGAJAAAKQAAASgPANQgNALgTADgABymAQgRgTAAgbQAAgbARgTQASgTAbAAQAcAAARATQASATAAAbQAAAbgSATQgRATgcAAQgbAAgSgTgACLnFQgJAKAAANQAAAOAIAIQAIAKANAAQANAAAIgKQAJgKAAgMQAAgOgIgJQgJgJgNgBQgMABgIAJgAk4mAQgRgTAAgbQAAgbARgTQASgTAbAAQAbAAASATQARATAAAbQAAAbgRATQgRATgcAAQgbAAgSgTgAkgnFQgJAKAAANQABAOAHAIQAJAKANAAQANAAAIgKQAJgKAAgMQgBgOgHgJQgJgJgNgBQgNABgIAJgAqmmAQgSgTAAgbQAAgbASgTQARgTAcAAQAaAAATATQARATAAAbQAAAbgRATQgSATgbAAQgcAAgRgTgAqPnFQgIAKAAANQAAAOAIAIQAIAKAOAAQAMAAAIgKQAJgKAAgMQAAgOgIgJQgIgJgNgBQgNABgJAJgAuemAQgRgTAAgbQAAgbARgTQATgTAaAAQAbAAASATQASATAAAbQAAAbgSATQgRATgcAAQgaAAgTgTgAuGnFQgIAKAAANQAAAOAIAIQAIAKANAAQANAAAJgKQAIgKAAgMQAAgOgIgJQgIgJgOgBQgMABgJAJgAmpmAQgRgSAAgcQABgaAQgTQAQgTAbAAQAcAAARARIABADQAAACgGAKIgIANIgCABIgEgEQgFgEgEgDQgHgDgIgBQgMABgIAJQgHAKAAANQAAANAHAJQAIAKAMAAQAIAAAHgEQAEgBAFgFIAEgDIACABIAIALIAGAKIgBAFQgRASgaAAQgcABgRgTgAsYmAQgQgSAAgcQAAgaAQgTQARgTAaAAQAdAAAQARIABADQABACgHAKIgHANIgCABIgEgEQgFgEgEgDQgIgDgHgBQgNABgIAJQgHAKAAANQAAANAHAJQAIAKANAAQAHAAAIgEQAEgBAFgFIAEgDIACABIAHALIAGAKIgBAFQgQASgbAAQgcABgRgTgAOylxQgPgEgFgMQgCgGAAgRIAAgKIAAgLIgBgeIAAgfQAAAAAAgBQAAAAAAAAQAAgBABAAQAAAAAAAAIARAAIAQABQAAAAABAAQAAAAAAABQABAAAAAAQAAABAAAAIAAAjIgBAiQAAAOACAFQAEAGANABQARgBABgQIgBgnIAAgmQAAgBAAAAQAAgBAAAAQAAgBABAAQAAAAAAAAIARgBIAPAAQABAAAAAAQABAAAAABQAAAAAAAAQABABAAAAIgBAfIgBAeIAAAJIAAAJQAAAWgGAIQgJAPgnAAQgSAAgKgDgAMpmAQgRgSAAgbQAAgdAQgRQASgUAbABQANAAAMAEQANAGAHAKIACADQAAADgIAKQgIAKgCAAIgEgEQgEgEgFgCQgGgFgJAAQgNABgIAJQgHAJAAAOQAAAOAHAJQAJAJANgBQAKABALgFIgCgPIgBgOIABgDIACAAIAHABIAIAAIAIAAIAJgBQABAAAAABQAAAAABAAQAAABAAAAQAAABAAABIgBAMIAAANIACAhIAAABQAAABAAABQAAAAgBAAQAAABAAAAQgBAAgBAAIgKgCIgJgDQgTAIgRAAQgbgBgRgRgAGalwIgNgcIgNgdIgBgBIAAADIAAAZIABAaQAAABAAABQAAAAgBABQAAAAAAAAQgBABAAAAIgeAAIgCgBIgBgCIABgdIABgdIgBgmIAAgWIgBgBQAAAAABgBQAAAAAAgBQABAAABAAQABAAABAAIAOAAIAPAAQAAAAAAAAQAAAAABAAQAAABAAABQABAAAAABIAaA5QACAFADAAQABABACgIIAbg3QAAgBAAgBQABAAAAgBQABAAAAAAQABAAAAAAIAHAAIAIAAIAHAAIAHAAQABAAAAAAQABAAAAAAQAAAAAAABQABAAAAAAIgBAgIgBAeIABAdIABAdQAAABgBAAQAAABAAAAQAAAAgBAAQAAABgBAAIgfAAQgBAAAAgBQgBAAAAAAQAAgBAAAAQAAgBAAgBIAAgaIABgbIgBgDIgMAbIgNAgIgBACIgEABQgFAAAAgCgAiDlwIgNgcIgMgdIgBgBIgBADIABAZIAAAaQAAABAAABQAAAAgBABQAAAAAAAAQgBABgBAAIgdAAIgCgBIAAgCIAAgdIABgdIgBgmIAAgWIAAgBQAAAAAAgBQAAAAAAgBQABAAABAAQAAAAABAAIAPAAIAPAAQAAAAAAAAQAAAAABAAQAAABAAABQABAAAAABIAaA5QACAFACAAQABABAEgIIAag3QAAgBAAgBQABAAAAgBQABAAAAAAQAAAAABAAIAIAAIAIAAIAGAAIAHAAQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIAAAgIgBAeIABAdIAAAdQAAABAAAAQAAABAAAAQAAAAgBAAQAAABgBAAIgfAAQgBAAAAgBQgBAAAAAAQAAgBAAAAQgBgBAAgBIABgaIABgbIgBgDIgMAbIgMAgIgCACIgEABQgFAAAAgCgA4DlwIgMgcIgNgdIgBgBIgBADIABAZIAAAaQAAABAAABQAAAAAAABQAAAAgBAAQAAABgBAAIgdAAIgCgBIgBgCIABgdIABgdIgBgmIAAgWIgBgBQAAAAAAgBQAAAAABgBQAAAAABAAQABAAABAAIAPAAIAOAAQAAAAABAAQAAAAAAAAQAAABABABQAAAAAAABIAaA5QADAFACAAQABABADgIIAag3QAAgBABgBQAAAAABgBQAAAAABAAQAAAAABAAIAHAAIAIAAIAGAAIAIAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAIgBAgIAAAeIAAAdIABAdQAAABAAAAQAAABgBAAQAAAAAAAAQgBABAAAAIggAAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAgBIAAgaIABgbIgBgDIgLAbIgNAgIgCACIgDABQgGAAAAgCgAu9lvIgUAAIgUgBIgbAAIgLAAQAAgBgBAAQAAAAAAAAQgBgBAAAAQAAAAAAgBIAAgdIAAgdIAAgeIgBgfQAAAAAAAAQAAgBABAAQAAAAABAAQAAgBABAAIAHAAIAJABIAIgBIAJAAQAAABAAAAQAAAAABAAQAAAAAAAAQAAABAAAAIAAABIgCAyIAAAXIAAAQIAAACIABACIACAAIAYgBIAXgBQABAAABAAQAAAAAAABQABAAAAAAQAAAAAAABQAAAPgCALQAAABAAAAQAAABgBAAQAAAAAAABQgBAAAAAAIgDAAgAAXlvQgQAAgEgBQgBgBgBAAQAAAAAAAAQgBgBAAAAQAAAAAAgBIAAgeIABgdIgBgdIAAgdIAAgCQAAAAAAAAQAAgBAAAAQAAAAAAAAQAAgBABAAIAUABIAUAAIAUgBIAWgBQAEAAAAADIABAMIABAHIABAIQAAAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgUgCIgUgBIgKABQgDABAAAHQAAAJAEABIAFAAIASAAIATgBQADAAAAAQIgBAPQAAABgBAAQAAAAAAABQAAAAgBAAQAAAAgBAAIgFAAIgcgCIgHAAQgFABAAAEIABAcIABANQAAACgFABgAxTlvIgFAAQghgBgGgBQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAgBIABgcIABgdIgBgmIgBgWIAAgBQAAAAAAgBQABAAAAAAQAAgBABAAQAAAAABAAIAVAAIAgAAQAWABAKAGQANAIAAAVQAAAEgCAGQgCAFgFADIgCAEIABACQAHADADAIQADAHABAHQAAARgLAKQgLAMgdABIgHAAgAxemjQAAACAAAJQgBALACABQABABALAAQAKAAAEgBQAHgDAAgIQgBgIgGgDQgEgCgKAAQgMAAgBABgAxenSIAAAFIgBAFQAAAJABABQABABALAAQASAAAAgLQABgHgIgDQgEgBgKAAQgJAAAAABgASVlwQgBgBgBAAQAAAAAAAAQgBgBAAAAQAAAAAAgBIABgPIACgwIgBgcIgBgcQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAABAAIAJAAIAIAAIAHAAIAIAAQABAAABAAQAAAAABAAQAAABAAAAQABABAAAAIgBAcIgCAcIABAgIABAfIgCACIgCABIgPAAIgQAAgARnlwQgDgBgBgEQgDgMgBgBIgYAAIgQAAQgBABgCAJQgCAHgDABIgUAAQgNAAAAgDIAUg4IAYhAQAAAAAAgBQAAgBABAAQAAgBAAAAQAAAAABAAIAHABIAHAAIAHAAIAHAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIAZA/QAWA3gBACQAAABAAAAQAAABAAAAQAAAAgBAAQAAAAgBABIgQAAIgQAAgARFmyIgFAQQAAACAGAAIAJAAQAFAAABgCIAAgBIgEgQIgGgQIgGARgALnlwQAAgBgBAAQAAAAAAAAQgBgBAAAAQAAAAAAgBIABgPIABgwIAAgcIgBgcQAAAAAAgBQAAAAAAgBQABAAAAAAQABAAAAAAIAIAAIAJAAIAIAAIAIAAQAAAAABAAQAAAAABAAQAAABAAAAQAAABAAAAIAAAcIgBAcIAAAgIABAfIgBACIgDABIgPAAIgRAAgAJDlwQgEgBgBgEQgDgMgBgBIgYAAIgQAAQgBABgCAJQgCAHgCABIgUAAQgNAAAAgDIATg4IAYhAQAAAAAAgBQABgBAAAAQAAgBAAAAQABAAAAAAIAIABIAHAAIAHAAIAHAAQAAAAABAAQAAAAABAAQAAAAAAABQABAAAAABIAZA/QAVA3AAACQAAABAAAAQAAABAAAAQgBAAAAAAQAAAAgBABIgRAAIgPAAgAIhmyIgGAQQAAACAGAAIAJAAQAGAAABgCIAAgBIgFgQIgFgQIgGARgAExlwIgCgBIgBgCIgDgKIgMgaQgBgDgFgBIgJAAQgBAAAAABQAAAAgBABQAAAAAAABQAAABAAABIABASIABARIAAADIgDAAIgQAAIgPAAQgBgBgBAAQAAAAAAAAQgBgBAAAAQAAAAAAgBIABgeIABgcQAAgmgBgVIgBgBQAAAAAAgBQAAAAABAAQAAAAABgBQAAAAABAAIAbgBIAaAAQAUgBAMAKQAOAKABATQgBANgDAHQgDAJgLAGIgBADIAKAWQALAWAAADIgCABIgRAAIgQAAgAEOnQIgBARIAAAHIAAAFIAEABIALABQATAAAAgPQAAgLgHgEQgGgDgLAAQgJAAAAACgA0tlwQAAgBgBAAQAAAAAAAAQgBgBAAAAQAAAAAAgBIABgPIABgwIAAgcIgBgcQAAAAAAgBQAAAAAAgBQABAAAAAAQABAAAAAAIAIAAIAJAAIAIAAIAIAAQAAAAABAAQAAAAABAAQAAABAAAAQAAABAAAAIAAAcIgBAcIAAAgIABAfIgBACIgDABIgPAAIgRAAgA1alwQgDgBgBgEQgDgMgCgBIgXAAIgQAAQgCABgCAJQgBAHgCABIgUAAQgOAAAAgDIAUg4IAYhAQAAAAAAgBQAAgBAAAAQABgBAAAAQAAAAAAAAIAIABIAIAAIAHAAIAGAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAABABIAYA/QAWA3AAACQAAABgBAAQAAABAAAAQAAAAgBAAQAAAAAAABIgRAAIgQAAgA18myQgFANAAADQAAACAFAAIAJAAQAHAAAAgCIAAgBIgEgQIgGgQIgGARgAQ0peQgSgTAAgbQAAgbASgTQARgTAcAAQAbAAASATQARATAAAbQAAAbgRATQgSATgbAAQgcAAgRgTgARMqiQgJAJAAANQAAAOAIAJQAIAJAOAAQAMAAAIgKQAJgKAAgMQAAgOgIgIQgJgKgMAAQgNAAgIAKgATDpPQgPgEgEgNQgDgFAAgQIAAgLIAAgLIgBgeIgBgeQAAgBABgBQAAAAAAAAQAAgBABAAQAAAAAAAAIARAAIAQABQABAAAAAAQAAAAABABQAAAAAAAAQAAAAAAABIgBAjIgBAiQAAAPADAEQAFAGALAAQATAAgBgRIAAgmIgBgmQAAgBABAAQAAgBAAAAQAAgBABAAQAAAAAAAAIAQgBIAQAAQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAABIgBAeIAAAeIAAAJIAAAIQAAAXgGAIQgJAPgnAAQgSAAgKgDgAOtpOQgSgDAAgEIAAgBIAEgKIADgKQAAAAAAgBQAAAAABAAQAAgBAAAAQABAAAAAAIAIADQAIADAFAAQASAAgBgMQAAgJgQAAIgFAAIgGAAIgFAAQgBAAgBAAQgBAAAAgBQgBAAAAAAQAAgBAAAAQAAgOABgDQAAgBAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAJAAIAJABQADAAACgCQADgDAAgEQAAgKgPAAQgGgBgLAEIgBAAQAAAAgBAAQAAAAAAgBQAAAAgBAAQAAgBAAAAIAAgIIgBgFIgBgEQAAgFAPgDIATgBQAPAAALAHQAOAHAAAOQAAARgPAIQAJADAGAHQAEAGAAAKQAAAQgNAIQgLAIgSAAQgNAAgJgCg");
	this.shape_1.setTransform(-171.1,-15.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#009933").s().p("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CQAKgFgBgJQABgGgHgHIgLgNQgFgJAAgLQAAgQAOgLQANgJARgCIACAAQAAAAAAAAQABAAAAAAQAAABAAAAQAAAAABABIAKAXIAAABQAAAAAAAAQAAABAAAAQAAAAAAAAQgBAAAAAAIgCAAIgDAAQgHAAgEADQgGADABAGQAAAFAFAIIANAPQAFAKAAAJQAAASgOANQgOALgTADgARCQaQgSgTAAgbQAAgbASgTQASgTAbAAQAbAAASATQASATAAAbQAAAcgSASQgSATgbAAQgbAAgSgTgARaPWQgJAKABAMQAAAOAIAJQAHAJAOAAQAMAAAJgKQAIgJAAgNQABgNgJgJQgIgKgNAAQgMAAgJAKgAzwQaQgRgTAAgbQAAgbARgTQATgTAaAAQAbAAASATQASATAAAbQAAAcgSASQgRATgcAAQgaAAgTgTgAzXPWQgJAKAAAMQAAAOAIAJQAIAJANAAQANAAAJgKQAIgJAAgNQAAgNgIgJQgIgKgOAAQgMAAgIAKgAu9QaQgQgSAAgcQAAgaAQgTQARgTAaAAQAcAAARARIABADQAAACgFALIgIAMIgCABIgFgEQgEgEgFgDQgHgDgHAAQgNAAgIAKQgHAJAAANQAAANAHAJQAIAKANAAQAHAAAHgDQAFgCAEgEIAFgEIACABIAIALIAFALIgBAEQgRATgaAAQgbAAgSgTgAokQpQgPgEgEgMQgDgGAAgQIAAgLIAAgKIgBgfIgBgeQAAgBABAAQAAgBAAAAQAAAAABgBQAAAAAAAAIARABIAQAAQAAAAABAAQAAABABAAQAAAAAAAAQAAABAAAAIgBAjIgBAjQAAAOADAEQAFAHALAAQASAAAAgRIAAgnIgBgmQAAAAABgBQAAgBAAAAQAAAAABgBQAAAAAAAAIAQAAIAQgBQABAAAAAAQABABAAAAQAAAAAAABQAAAAAAABIAAAeIgBAfIAAAIIAAAJQAAAWgGAIQgJAPgnAAQgSAAgKgDgAHIQaQgRgSAAgbQAAgcAQgSQASgTAbAAQANAAAMAFQANAFAHAKIACADQAAADgIAKQgIAKgCAAIgEgEQgFgEgEgCQgHgEgHAAQgOAAgIAKQgHAJAAANQAAAPAHAIQAJAJAOAAQAIAAAMgFIgCgPIgBgOIABgCIACgBIAHABIAIAAIAJAAIAIAAQAAAAABAAQAAAAAAAAQABABAAAAQAAABAAABIAAAMIgBANIACAiIAAABQAAAAAAABQAAAAgBABQAAAAAAAAQgBAAAAAAIgLgCIgJgCQgSAHgSAAQgbAAgRgSgAULQrIgUAAIgTgBIgbAAIgKAAQgBAAgBgBQAAAAAAAAQgBAAAAgBQAAAAAAgBIAAgdIABgcIgBgfIgBgeQAAgBAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAIAAIAHAAIAJAAIAIAAQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAABIgDAyIAAAXIAAARIAAACIACABIADAAIAXgBIAYgBQAAAAABAAQAAABAAAAQABAAAAAAQAAABAAAAQAAAPgCALQAAABAAAAQgBABAAAAQAAABAAAAQgBAAAAAAIgEAAgAOnQrQgHgBgeAAIgVAAIgUAAQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAgBIACgdIAAgeIAAglIgBgVIAAgCQgBAAAAgBQABAAAAAAQAAgBAAAAQABAAAAAAIAUABIATAAIAUAAIAUgBQAEAAAAAEIACAMIABANQAAAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAQgXgCgTAAQgEAAgBADIgBAGQAAAGACACQACACAEAAIADAAIAEAAIAXgBIAEAAIAFgBQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIgCAOIAAAOQAAAAAAABQAAAAgBAAQAAAAAAABQgBAAAAAAIgIgBIgYgBIgJAAQAAAAgBAAQgBAAAAABQgBAAAAAAQgBAAAAABIAAAFQAAAHABACQABADAKABIANAAIAOgBIAOgBQAAAAAAAAQABABAAAAQAAAAAAABQABAAAAABIgCAOIgDANQAAABAAAAQgBAAAAABQAAAAgBAAQAAAAgBAAIgCAAgAGlQrQgGgBggAAIgUAAIgUAAQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAgBIACgdIABgeIgBglIgBgVIAAgCQgBAAAAgBQABAAAAAAQAAgBAAAAQABAAABAAIATABIATAAIAUAAIAUgBQAEAAAAAEIACAMIABANQAAAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAQgXgCgTAAQgFAAAAADIgBAGQAAAGACACQABACAEAAIAEAAIAEAAIAXgBIAEAAIAFgBQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIgBAOIgBAOQAAAAAAABQAAAAgBAAQAAAAAAABQgBAAAAAAIgIgBIgYgBIgJAAQAAAAgBAAQgBAAAAABQgBAAAAAAQgBAAAAABIAAAFQAAAHABACQACADAJABIANAAIAOgBIANgBQABAAAAAAQABABAAAAQAAAAAAABQABAAAAABIgCAOIgDANQAAABAAAAQgBAAAAABQAAAAgBAAQAAAAAAAAIgDAAgAlwQrQgHgBgeAAIgVAAIgUAAQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAgBIACgdIAAgeIAAglIgBgVIAAgCQgBAAAAgBQABAAAAAAQAAgBAAAAQABAAAAAAIAUABIATAAIAUAAIAUgBQAEAAAAAEIACAMIABANQAAAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAQgXgCgTAAQgEAAgBADIgBAGQAAAGACACQACACAEAAIADAAIAEAAIAXgBIAEAAIAFgBQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIgCAOIAAAOQAAAAAAABQAAAAgBAAQAAAAAAABQgBAAAAAAIgIgBIgYgBIgJAAQAAAAgBAAQgBAAAAABQgBAAAAAAQgBAAAAABIAAAFQAAAHABACQABADAKABIANAAIAOgBIAOgBQAAAAAAAAQABABAAAAQAAAAAAABQABAAAAABIgCAOIgDANQAAABAAAAQgBAAAAABQAAAAgBAAQAAAAgBAAIgCAAgAsJQrIgUAAIgTgBIgbAAIgLAAQgBAAAAgBQgBAAAAAAQAAAAAAgBQgBAAAAgBIAAgdIABgcIgBgfIgBgeQAAgBABAAQAAgBAAAAQABAAAAAAQABAAABAAIAHAAIAIAAIAIAAIAJAAQAAAAABAAQAAAAAAAAQAAAAAAABQAAAAAAAAIAAABIgCAyIAAAXIAAARIAAACIABABIADAAIAXgBIAYgBQABAAAAAAQABABAAAAQAAAAAAAAQAAABAAAAQAAAPgBALQgBABAAAAQAAABAAAAQAAABgBAAQAAAAAAAAIgEAAgA2JQrQgGgBgfAAIgUAAIgUAAQgBAAgBAAQAAgBgBAAQAAAAAAgBQgBAAAAgBIACgdIABgeIgBglIgBgVIAAgCQAAAAAAgBQAAAAAAA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SQgRATgcAAQgbAAgSgTgAHmL4QgJAKAAAMQAAAOAIAJQAIAJANAAQANAAAIgKQAJgJAAgNQAAgNgIgJQgJgKgNAAQgMAAgIAKgAj7M8QgRgTAAgbQAAgbARgTQASgTAbAAQAbAAASATQASATAAAbQAAAcgSASQgSATgbAAQgbAAgSgTgAjjL4QgJAKAAAMQABAOAHAJQAJAJANAAQAMAAAJgKQAIgJAAgNQABgNgJgJQgIgKgNAAQgMAAgJAKgA24M8QgRgTAAgbQAAgbARgTQASgTAbAAQAcAAARATQASATAAAbQAAAcgSASQgRATgcAAQgbAAgSgTgA2fL4QgJAKAAAMQAAAOAIAJQAIAJANAAQANAAAIgKQAJgJAAgNQAAgNgIgJQgJgKgNAAQgMAAgIAKgAFdM8QgRgSAAgcQAAgaAQgTQARgTAaAAQAdAAAQARIABADQAAACgFALQgGALgCABIgCABIgFgEQgEgEgFgDQgGgDgIAAQgNAAgIAKQgHAJAAANQAAANAHAJQAIAKANAAQAIAAAGgDQAFgCAEgEIAFgEIACABIAIALIAFALIgBAEQgQATgbAAQgbAAgRgTgAlsM8QgRgSAAgcQAAgaAQgTQARgTAbAAQAcAAARARIABADQAAACgGALIgHAMIgDABIgEgEQgEgEgFgDQgHgDgIAAQgNAAgHAKQgHAJgBANQABANAHAJQAHAKANAAQAIAAAHgDQAFgCAEgEIAEgEIACABIAIALIAGALIgBAEQgRATgbAAQgbAAgRgTgAAFNLQgNgEgFgMQgCgGAAgQIAAgLIAAgKIAAgfIgBgeQAAgBAAAAQAAgBAAAAQAAAAABgBQAAAAAAAAIAPABIAQAAQAAAAABAAQAAABAAAAQABAAAAAAQAAABAAAAIAAAjIgBAjQAAAOACAEQAEAHANAAQARAAABgRIgBgnIAAgmQAAgBAAAAQAAgBAAAAQAAAAABgBQAAAAABAAIAQAAIAPgBQABAAAAAAQABABAAAAQAAAAAAABQABAAAAABIgBAeIgBAfIAAAIIAAAJQAAAWgFAIQgKAPgoAAQgRAAgKgDgAKCNMIgMgcIgNgdIgBgBIgBADIABAaIAAAaQAAABAAAAQAAABAAAAQAAAAgBABQAAAAgBAAIgdAAIgCgBIgBgCIABgdIABgcIgBgnIAAgVIgBgCQAAAAAAgBQAAAAABAAQAAAAABgBQABAAABAAIAPAAIAOAAQAAAAABAAQAAAAAAABQAAAAABABQAAABAAABIAaA4QADAGACAAQABAAADgHIAag4QAAgBABAAQAAgBABAAQAAgBABAAQAAAAABAAIAHAAIAIAAIAGAAIAIAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIgBAfIAAAfIAAAcIABAdQAAABAAAAQAAABgBAAQAAAAAAABQgBAAAAAAIggAAQAAAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAgBIAAgbIABgbIgBgCIgLAbIgNAfIgCACIgDABQgGAAAAgCgAxYNMIgMgcIgNgdIgBgBIgBADIABAaIAAAaQAAABAAAAQAAABAAAAQAAAAgBABQAAAAgBAAIgdAAIgDgBIAAgCIABgdIABgcIgBgnIgBgVIAAgCQAAAAAAgBQABAAAAAAQAAAAABgBQABAAABAAIAOAAIAPAAQAAAAABAAQAAAAAAABQAAAAABABQAAABAAABIAaA4QADAGACAAQABAAADgHIAag4QAAgBABAAQAAgBABAAQAAgBABAAQAAAAAAAAIAIAAIAIAAIAHAAIAHAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIAAAfIgBAfIABAcIAAAdQAAABAAAAQAAABgBAAQAAAAAAABQgBAAAAAAIggAAQAAAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAgBIAAgbIABgbIgBgCIgLAbIgNAfIgCACIgDABQgGAAAAgCgA4dNMIgNgcIgMgdIgBgBIgBADIABAaIAAAaQAAABAAAAQAAABgBAAQAAAAAAABQgBAAAAAAIgeAAIgCgBIgBgCIABgdIABgcIgBgnIAAgVIgBgCQAAAAABgBQAAAAAAAAQABAAABgBQAAAAABAAIAPAAIAPAAQAAAAAAAAQAAAAABABQAAAAAAABQABABAAABIAaA4QADAGABAAQACAAADgHIAag4QAAgBAAAAQABgBAAAAQABgBAAAAQABAAAAAAIAIAAIAIAAIAGAAIAHAAQABAAAAAAQABAAAAAAQAAAAAAABQABAAAAABIgBAfIgBAfIABAcIABAdQAAABgBAAQAAABAAAAQAAAAgBABQAAAAgBAAIgfAAQgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAgBIAAgbIABgbIgBgCIgMAbIgMAfIgCACIgEABQgFAAAAgCgApmNNQgGgBgfAAIgVAAIgTAAQgBAAgBAAQAAgBgBAAQAAAAAAgBQgBAAAAgBIACgdIABgeIgBglIgBgVIAAgCQAAAAAAgBQAAAAAAAAQAAAAABgBQAAAAABAAIAUABIATAAIATAAIAUgBQAEAAABAEIABAMIABANQAAAAAAAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgBAAQgXgCgUAAQgEAAgBADIgBAGQABAGACACQABACAEAAIAEAAIADAAIAXgBIAFAAIAFgBQAAAAABAAQAAAAAAABQABAAAAAAQAAABAAAAIgCAOIAAAOQAAAAgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgIgBIgXgBIgJAAQgBAAgBAAQAAAAgBABQAAAAgBAAQAAAAgBABIAAAFQAAAHACACQABADAKABIAMAAIAPgBIANgBQABAAAAAAQAAABABAAQAAAAAAABQAAAAAAABIgCAOIgCANQAAABgBAAQAAABgBAAQAAAAAAAAQgBAAAAAAIgDAAgAuwNNQgHgBgeAAIgVAAIgUAAQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAgBIACgdIAAgeIAAglIgBgVIAAgCQgBAAAAgBQABAAAAAAQAAAAAAgBQABAAAAAAIAUABIATAAIAUAAIAUgBQAEAAAAAEIACAMIABANQAAAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAQgXgCgTAAQgEAAgBADIgBAGQAAAGACACQACACAEAAIADAAIAEAAIAXgBIAEAAIAFgBQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIgCAOIAAAOQAAAAAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgIgBIgYgBIgJAAQAAAAgBAAQgBAAAAABQgBAAAAAAQgBAAAAABIAAAFQAAAHABACQABADAKABIANAAIAOgBIAOgBQAAAAAAAAQABABAAAAQAAAAAAABQABAAAAABIgCAOIgDANQAAABAAAAQgBABAAAAQAAAAgBAAQAAAAgBAAIgCAAgAD2NMQgCgBgBgDQgDgNgCgBIgXAAIgQAAQgCACgCAIQgBAHgDABIgUAAQgOAAAAgCIAVg4IAXhAQAAgBABgBQAAAAAAgBQA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QAAAAABAAQAAAAABAAIAJAAIAIAAIAIAAIAHAAQABAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIAAAkIAAAlQAAAWgEAMQgGAVgPANIgCABIgDgBgArqnJQgRgTAAgbQAAgbARgTQASgTAbAAQAbAAASATQASATAAAbQAAAcgSASQgSATgbAAQgbAAgSgTgArSoNQgJAKAAAMQABAOAHAJQAJAJANAAQAMAAAJgKQAIgJAAgNQABgNgJgJQgIgKgNAAQgMAAgJAKgAtbnJQgRgSAAgcQAAgaAQgTQARgTAbAAQAcAAARARIABADQAAACgGALIgHAMIgDABIgEgEQgEgEgFgDQgHgDgIAAQgNAAgHAKQgHAJgBANQABANAHAJQAHAKANAAQAIAAAHgDQAFgCAEgEIAEgEIACABIAIALIAGALIgBAEQgRATgbAAQgbAAgRgTgAGQm6QgPgEgEgMQgDgGABgQIAAgLIAAgKIgBgfIgBgeQAAgBAAAAQAAgBAAAAQABAAAAgBQAAAAABAAIARABIAQAAQAAAAAAAAQABABAAAAQAAAAAAAAQABABAAAAIgBAjIgBAjQAAAOADAEQAEAHAMAAQASAAAAgRIAAgnIgBgmQAAgBAAAAQAAgBAAAAQABAAAAgBQAAAAABAAIAQAAIAPgBQABAAABAAQAAABAAAAQABAAAAABQAAAAAAABIgBAeIgBAfIAAAIIAAAJQABAWgGAIQgJAPgoAAQgRAAgLgDgAnom6QgPgEgFgMQgCgGAAgQIAAgLIAAgKIAAgfIgBgeQAAgBAAAAQAAgBAAAAQAAAAABgBQAAAAAAAAIARABIAQAAQAAAAABAAQAAABAAAAQABAAAAAAQAAABAAAAIAAAjIgBAjQAAAOACAEQAEAHANAAQARAAABgRIgBgnIAAgmQAAgBAAAAQAAgBAAAAQAAAAABgBQAAAAABAAIAQAAIAPgBQABAAAAAAQABABAAAAQAAAAAAABQABAAAAABIgBAeIgBAfIAAAIIAAAJQAAAWgFAIQgKAPgoAAQgRAAgKgDgA2Jm6QgPgEgFgMQgCgGAAgQIABgLIAAgKIgBgfIgBgeQAAgBAAAAQAAgBAAAAQAAAAABgBQAAAAABAAIAQABIAQAAQABAAAAAAQAAABAAAAQABAAAAAAQAAABAAAAIAAAjIgCAjQABAOA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AQAAgBAAAAIACgeIAAgdIAAgmIgBgVIAAgBQgBgBAAAAQABAAAAgBQAAAAAAAAQABAAAAAAIAUAAIATABIAUgBIAUAAQAEAAAAADIACANIABAMQAAABAAAAQAAAAAAAAQgBABAAAAQAAAAgBAAIgCAAQgXgCgTAAQgEAAgBACIgBAHQAAAGACACQACABAEAAIADAAIAEAAIAXAAIAEgBIAFAAQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIgCAOIAAAOQAAABAAAAQAAABgBAAQAAAAAAAAQgBAAAAAAIgIgBIgYAAIgJAAQAAAAgBAAQgBAAAAAAQgBAAAAABQgBAAAAAAIAAAGQAAAHABABQABAEAKAAIANAAIAOAAIAOgBQAAAAAAAAQABAAAAAAQAAABAAAAQABABAAABIgCAOIgDANQAAAAAAABQgBAAAAAAQAAABgBAAQAAAAgBAAIgCgBgAkyxoQgGgBgfAAIgVAAIgUAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgeIABgdIgBgmIgBgVIAAgBQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIATAAIAUABIATgBIAUAAQAEAAABADIABANIABAMQAAABAAAAQAAAAAAAAQAAABgBAAQAAAAgBAAIgBAAQgXgCgUAAQgEAAgBACIAAAHQAAAGACACQABABAEAAIAEAAIADAAIAXAAIAFgBIAFAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAIgCAOIAAAOQAAABgBAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgIgBIgXAAIgJAAQgBAAgBAAQAAAAgBAAQAAAAgBABQAAAAAAAAIAAAGQAAAHABABQABAEAJAAIANAAIAOAAIAOgBQAAAAABAAQAAAAAAAAQABABAAAAQAAABAAABIgBAOIgDANQAAAAgBABQAAAAAAAAQgBABAAAAQgBAAAAAAIgDgBgAoHxoQgHgBgeAAIgVAAIgUAAQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAgBAAAAIABgeIABgdIgBgmIgBgVIAAgBQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAAAAAIAUAAIAUABIATgBIAUAAQAEAAAAADIACANIABAMQAAABAAAAQAAAAgBAAQAAABAAAAQgBAAAAAAIgCAAQgXgCgTAAQgEAAgCACIAAAHQAAAGACACQABABAFAAIADAAIAEAAIAWAAIAGgBIAEAAQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIgCAOIAAAOQAAABAAAAQAAABgBAAQAAAAAAAAQgBAAAAAAIgJgBIgXAAIgJAAQAAAAgBAAQgBAAAAAAQgBAAAAABQgBAAAAAAIAAAGQAAAHABABQACAEAJAAIANAAIAOAAIAOgBQAAAAAAAAQABAAAAAAQAAABAAAAQAAABAAABIgBAOIgCANQgBAAAAABQgBAAAAAAQAAABgBAAQAAAAgBAAIgCgBgAydxoQgGgBgfAAIgVAAIgTAAQgBAAgBAAQAAAAgBAAQAAgBAAAAQgBgBAAAAIACgeIABgdIgBgmIgBgVIAAgBQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIAUAAIATABIATgBIAUAAQAEAAABADIABANIABAMQAAABAAAAQAAAAAAAAQAAABgBAAQAAAAgBAAIgBAAQgXgCgUAAQgEAAgBACIgBAHQABAGACACQABABAEAAIAEAAIADAAIAXAAIAFgBIAFAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAIgCAOIAAAOQAAABgBAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgIgBIgXAAIgJAAQgBAAgBAAQAAAAgBAAQAAAAgBABQAAAAgBAAIAAAGQABAHABABQABAEAKAAIAMAAIAPAAIANgBQABAAAAAAQAAAAABAAQAAABAAAAQAAABAAABIgCAOIgCANQAAAAgBABQAAAAgBAAQAAABAAAAQgBAAAAAAIgDgBgAjBxoIgFAAQghAAgGgBQgBAAAAgBQgBAAAAAAQgBAAAAgBQAAAAAAgBIABgcIABgdIgBgmIgBgWIAAgBQAAgBAAAAQABAAAAAAQAAgBABAAQAAAAABAAIAVAAIAgAAQAWABAKAGQANAIAAAUQAAAFgCAGQgCAEgFAEIgCAEIABACQAHADADAIQADAHABAHQAAAQgLALQgLAMgdAAIgHAAgAjMybQAAABAAAKQgBAKACACQABABALAAQAKAAAEgCQAHgCAAgIQgBgIgGgDQgEgCgKAAQgMAAgBABgAjMzKIAAAFIgBAFQAAAJABABQABABALAAQASAAAAgLQABgIgIgCQgEgCgKAAQgJAAAAACgAD5xpQgDAAgBgEQgDgMgBgBIgYgBIgQABQgBABgCAIQgCAIgDAAIgUABQgNAAAAgDIAUg4IAXhAQABgBAAAAQAAgBABAAQAAgBAAAAQAAAAABAAIAHAAIAHABIAHgBIAIAAQAAAAAAAAQABABAAAAQAAAAABABQAAAAAAABIAZA/QAWA3gBACQAAABAAAAQAAAAAAAAQAAABgBAAQAAAAgBAAIgQABIgQgBgADXyqIgFAQQAAABAGABIAJAAQAFAAABgCIAAgBIgEgQIgGgQIgGARgAqKxpQgBAAAAAAQgBAAAAgBQAAAAAAAAQgBgBAAAAIABgVIABgVQAAgBAAAAQAAgBAAAAQgBgBAAAAQAAgBgBAAQgDgBgSAAQgTAAgDABQAAAAgBABQAAAAAAABQAAAAAAABQgBAAAAABIAAAVIABAUQAAABAAAAQAAABAAAAQgBABAAAAQgBAAAAAAIgRABIgPgBQgBAAAAAAQgBAAAAgBQAAAAAAAAQgBgBAAAAIABgdIABgdIgBgeIgBgfQAAgBABAAQAAAAAAgBQAAAAABAAQAAAAAAAAIAJAAIAIAAIAIAAIAJAAQAAAAABAAQAAAAAAAAQAAABAAAAQAAAAAAABIgBATIgBAUQAAABABAAQAAABAAABQAAAAAAAAQABABAAAAIAXAAIAVAAQABAAAAgBQABAAAAAAQAAgBAAgBQAAAAAAgBIAAgTIgBgTQAAgBABgBQAAAAAAAAQAAgBABAAQAAAAAAAAIAIAAIAIAAIAIAAIAIAAQABAAAAAAQABAAAAAAQAAABAAAAQAAABAAAAIgBAfIgBAeIABAdIABAdIgBACIgBAAIgQABIgQgBgAsFxpIgHAAQgCAAgDgDIgcgmIgSgYIgCgBIAAACIAAAfIABAeQAAABAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgfAAQgBAAAAAAQgBAAAAAAQAAgBAAAAQgBgBAAAAIABgdIABgdIgBgeIAAgeQAAgBAAAAQAAgBABAAQAAAAABAAQAAAAABAAIANgBIAHgBIAHgBIADADIAhAtIANASQABAAAAABQAAABABAAQAAAAABABQAAAAAAAAQACAAAAgHIgBgcIgBgcQAAgBAAAAQAAgBAAAAQABgBAAAAQAAAAABAAIAPgBIAQAAQABAAAAAAQAAAAABABQAAAAAAAAQAAABAAABIgBAeIgBAeIAAA6QAAAAAAABQAAAAAAABQAAAAgBAAQAAAAgBAAIgHAAIgGABIgGgBgA42xpIgCgCIgUgoQgQggAAgEIABgVIAAgVQAAgBAAAAQAAgBAAAAQABgBAAAAQAAAAAAAAIARAAIAQABQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIgBAVIgBAVQAAAGASAhIALgVQAIgRAAgEIAAgTIAAgTQAAgBAAAAQAAgBAAAAQAAgBAAAAQAAAAABAAIACAAIAPgBIAOAAQABAAABAAQAAAAAAAAQABABAAAAQAAABAAAAIAAAVIAAAUQAAAFgRAjIgVAmIgBACIgCAAIgOABIgOgBgARmyMQgDAAAAgJQgBgHAJgLQAJgLgBgIQAAgLgMAAQgHAAgMAGQgEAAAAgXIAAgDQACgGANgDQAKgDAIAAQAQAAALAJQALAKAAAPQAAAWgSAKQgNAIgBAIIAAAEQgBAAAAABQAAAAAAAAQgBABAAAAQgBAAgBAAIgNABIAAAAgAzCz3IgBAAQgBAEgGAFQgFAHgEAAIgHgDIgGgDIAAgCIALgMQAIgJABgGQABAAAAAAQAAgBABAAQAAAAAAAAQABAAAAAAIAPAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAQACAGAGAHIAOAQIgHADIgHADQgFAAgNgQg");
	this.shape_2.setTransform(-168.4,-30.3);

	this.instance_3 = new lib.Symbol3();
	this.instance_3.setTransform(-324.5,-173.9,1,1,0,0,0,11.3,10.9);
	this.instance_3.shadow = new cjs.Shadow("rgba(255,102,0,1)",0,0,5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#009933").s().p("EAkgABUQgDAAgGgMQgIgMAAgEIABgBQAOgDADgBQAKgFgBgJQABgGgHgHIgLgNQgFgJAAgKQAAgQAOgKQANgJARgCIACAAQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAABAAIAKAYIAAABQAAAAAAAAQAAAAAAABQAAAAAAAAQgBAAAAAAIgCAAIgDAAQgHAAgEACQgGAEABAGQAAAFAFAGIANAPQAFAKAAAJQABASgPANQgOALgSADgAV9BUQgCAAgHgMQgHgMAAgEIABgBQANgDAEgBQAJgFAAgJQAAgGgGgHIgLgNQgGgJAAgKQAAgQAPgKQAMgJARgCIACAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAIALAYIAAABQAAAAAAAAQAAAAAAABQgBAAAAAAQAAAAAAAAIgDAAIgDAAQgGAAgEACQgGAEAAAGQAAAFAGAGIAMAPQAGAKAAAJQAAASgPANQgNALgTADgASgBUQgCAAgHgMQgHgMAAgEIABgBQANgDAEgBQAJgFAAgJQAAgGgGgHIgLgNQgGgJAAgKQAAgQAPgKQAMgJASgCIABAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAAAIALAYIAAABQAAAAAAAAQAAAAAAABQgBAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgFACQgFAEAAAGQAAAFAGAGIAMAPQAGAKAAAJQAAASgPANQgNALgTADgAMrBUQgCAAgHgMQgHgMAAgEIABgBQANgDAEgBQAJgFAAgJQAAgGgGgHIgLgNQgGgJAAgKQAAgQAPgKQAMgJARgCIACAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAIALAYIAAABQAAAAAAAAQAAAAAAABQgBAAAAAAQAAAAAAAAIgDAAIgDAAQgGAAgEACQgGAEAAAGQAAAFAGAGIAMAPQAGAKAAAJQAAASgPANQgNALgTADgAC5BUQgCAAgHgMQgHgMAAgEIABgBQANgDAEgBQAJgFAAgJQAAgGgGgHIgLgNQgGgJAAgKQAAgQAPgKQAMgJASgCIABAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAAAIALAYIAAABQAAAAAAAAQAAAAAAABQgBAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgFACQgFAEAAAGQAAAFAGAGIAMAPQAGAKA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ABgdIABgdIgBgkIAAgVIgBgCQAAAAAAgBQAAAAABAAQAAgBABAAQABAAABAAIAPAAIAOgBQAAAAABABQAAAAAAAAQAAABABABQAAABAAABIAaA2QADAFACABQABgBADgGIAag2QAAgBABgBQAAAAABgBQAAAAABAAQAAgBABAAIAHABIAIAAIAGAAIAIgBQAAAAABABQAAAAAAAAQABAAAAABQAAAAAAAAIgBAgIAAAcIAAAdIABAdQAAABAAAAQAAABgBAAQAAAAAAAAQgBAAAAAAIggAAQAAAAgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgbIABgbIgBgDIgLAbIgNAgIgCACIgDAAQgGAAAAgCgEgi6AA/QgRgRgBgcQAAgaARgSQASgSAbgBQANAAAMAGQANAFAHAKIABADQABADgJAKQgHAIgDAAIgDgCQgFgEgEgDQgHgDgIAAQgNAAgIAKQgHAGAAAOQAAAPAHAIQAIAJAOAAQAJAAALgFIgCgPIgBgOIABgCIACgBIAHABIAIAAIAJAAIAJAAQAAAAAAAAQABAAAAAAQAAABAAAAQAAABAAAAIAAANIgBANIACAiIAAABQAAAAAAABQAAAAAAAAQAAABgBAAQAAAAgBAAIgKgCIgJgDQgTAIgRgBQgbABgRgTgAdDBRIgTgBIgUAAIgaAAIgMgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgdIAAgdIAAgcIgBgeQAAgBAAAAQAAgBABAAQAAAAABAAQAAgBABAAIAHAAIAIABIAJgBIAIAAQABAAAAABQAAAAABAAQAAAAAAAAQAAABAAAAIAAABIgCAvIAAAYIAAARIAAACIABABIACAAIAYgBIAYgBQAAAAABAAQAAAAAAAAQABABAAAAQAAAAAAABQAAAPgCALQAAABAAAAQgBABAAAAQAAAAAAABQgBAAAAAAIgEAAgAbdBQQgGgBgfAAIgVAAIgUAAQAAAAgBAAQAAAAgBAAQAAAAAAgBQAAAAAAgBIABgeIABgdIgBgkIgBgUIAAgCQAAAAAAgBQAAAAAAAAQAAgBABAAQAAAAABAAIATAAIAUABIATgBIAUAAQAEAAABAEIABAMIABAMQAAABAAAAQAAAAAAABQAAAAgBAAQAAAAgBAAIgBAAQgXgCgUAAQgEAAgBADIAAAGQAAAFACABQABABAEAAIAEAAIADAAIAXAAIAFgBIAFAAQAAAAABAAQAAAAAAAAQABABAAAAQAAAAAAABIgCANIAAAPQAAAAgBAAQAAABAAAAQAAAAgBAAQAAABgBAAIgIgBIgXgBIgJAAQgBAAgBAAQAAAAgBAAQAAABgBAAQAAAAAAABIAAAFQAAAHABABQABAEAJABIANAAIAOgBIAOgBQAAAAABAAQAAAAAAABQABAAAAABQAAAAAAABIgBAOIgDANQAAAAgBABQAAAAAAABQgBAAAAAAQgBAAAAAAIgDgBgAVcBQQgHgBgeAAIgVAAIgUAAQgBAAAAAAQgBAAAAAAQgBAAAAgBQAAAAAAgBIACgeIAAgdIAAgkIgBgUIAAgCQgBAAAAgBQABAAAAAAQAAgBAAAAQABAAAAAAIAUAAIATABIAUgBIAUAAQAEAAAAAEIACAMIABAMQAAABAAAAQAAAAgBABQAAAAAAAAQAAAAgBAAIgCAAQgXgCgTAAQgEAAgBADIgBAGQAAAFACABQABABAFAAIADAAIAEAAIAWAAIAGgBIAEAAQABAAAAAAQABAAAAAAQAAABAAAAQAAAAAAABIgCANIAAAPQAAAAAAAAQAAABgBAAQAAAAAAAAQgBABAAAAIgIgBIgYgBIgJAAQAAAAgBAAQgBAAAAAAQgBABAAAAQgBAAAAABIAAAFQAAAHABABQACAEAJABIANAAIAOgBIAOgBQAAAAAAAAQABAAAAABQAAAAAAABQABAAAAABIgCAOIgDANQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgCgBgA5wBQQgFgBggAAIgUAAIgUAAQgBAAAAAAQgBAAAAAAQgBAAAAgBQAAAAAAgBIABgeIABgdIgBgkIgBgUIAAgCQAAAAAAgBQAAAAABAAQAAgBAAAAQABAAAAAAIAUAAIAUABIATgBIATAAQAFAAABAEIABAMIABAMQAAABAAAAQAAAAgBABQAAAAAAAAQgBAAAAAAIgBAAQgYgCgTAAQgFAAgBADIAAAGQAAAFACABQACABADAAIAEAAIAEAAIAWAAIAGgBIAEAAQABAAAAAAQABAAAAAAQAAABAAAAQAAAAABABIgDANIAAAPQAAAAAAAAQAAABgBAAQAAAAAAAAQgBABgBAAIgIgBIgWgBIgJAAQgBAAgBAAQgBAAAAAAQgBABAAAAQgBAAAAABIAAAFQAAAHABABQABAEAKABIANAAIAOgBIANgBQABAAAAAAQABAAAAABQAAAAAAABQAAAAAAABIgBAOIgCANQgBAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgDgBgAFTBQIgGAAQggABgGgCQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAAAIABgdIABgdIgBgkIAAgVIAAgCQgBAAAAgBQABAAAAAAQAAAAABgBQAAAAABAAIAUAAIAhAAQAWABAKAGQANAIAAAUQAAAFgCAEQgDAEgEAEIgCAEIABACQAHAEADAHQADAHAAAIQAAAPgKAMQgLAMgdgBIgHAAgAFJAdQgBACAAAKQgBAJACACQABABALAAQAKAAAEgBQAHgDAAgIQgBgHgGgDQgFgDgJAAQgMAAAAABgAFIgQIAAAFIgBAFQAAAHACABQAAABALAAQASAAAAgJQAAgIgHgCQgEgBgKgBQgJABAAABgEAjoABPQgDAAgBgDQgDgNgBgBIgYgBIgQABQgBACgCAHQgCAIgCAAIgVABQgNAAAAgCIAUg4IAYg/QAAAAAAgBQAAgBABAAQAAgBAAAAQAAAAABAAIAHAAIAIABIAGgBIAHAAQABAAAAABQABAAAAAAQAAAAABABQAAAAAAABIAZA9QAWA3AAADQAAAAgBAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgQABIgQgBgEAjGAAOIgFAQQAAABAGABIAIAAQAGAAABgBIAAgCIgEgPIgGgPIgGAPgEAhkABPQgBAAAAAAQgBAAAAAAQAAgBAAAAQAAgBAAAAIAAgVIABgVQAAAAAAgBQAAgBgBAAQAAgBAAAAQgBAAAAAAQgDgBgTAAQgRAAgEABQAAAAgBAAQAAAAAAABQAAAAAAABQAAABAAAAIAAAVIAAAVQAAAAAAABQAAAAgBABQAAAAAAAAQgBAAAAAAIgQABIgQgBQgBAAAAAAQgBAAAAAAQAAgBAAAAQAAgBAAAAIABgdIABgdIgBgcIgBgfQAAAAAAgBQAAAAAAAAQAAgBABAAQAAAAABAAIAIAAIAIAAIAJAAIAIAAQAAAAABAAQAAAAAAABQAAAAAAAAQABABAAAAIgBAUIgBATQAAABAAAAQAAAAAAAAQAAAAAAABQABAAAAAAIAWA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gBAAIgHAAIgGABIgGgBgA/3BPQgDAAgBgDQgDgNgBgBIgYgBIgQABQgBACgCAHQgCAIgDAAIgUABQgNAAAAgCIAUg4IAYg/QAAAAAAgBQAAgBABAAQAAgBAAAAQAAAAABAAIAHAAIAHABIAHgBIAHAAQABAAAAABQABAAAAAAQAAAAABABQAAAAAAABIAZA9QAWA3gBADQAAAAAAAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgQABIgQgBgEggZAAOIgFAQQAAABAGABIAJAAQAFAAABgBIAAgCIgEgPIgGgPIgGAPgEgllABPIgOAAQAAAAgBAAQAAAAgBAAQAAAAAAgBQgBAAAAgBIAAgBIACgpIAAgaQAAgBAAAAQAAgBAAAAQgBAAAAAAQAAAAgBAAIgEAAIgGABQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAgBAAAAIAAgHIAAgJQAAgBAAAAQAAgBABAAQAAAAAAgBQABAAABAAQAMgFAHgJIADgCIABAAIAKACIALABIABACIAAADQgBAHAAAcIAAAeIAAAfIgCADIgDABIgMAAgEglDAAmIACgNIAEgMQABAAAAgBQAAAAAAAAQABAAAAAAQAAgBABAAIAKABIAKAAIAYgCIAJgBQAAAAAAAAQAAAAABABQAAAAAAABQAAAAAAABIgBAHIgCAHIgCANIgCABIgKAAIgKAAIgZACIgFAAIgEABQgBAAAAAAQgBgBAAAAQAAgBAAgBQAAAAAAgCgAHTg/IgBAAIgHAJQgGAHgDAAIgHgDIgGgDIAAgBIALgNQAIgJABgFQABgBAAAAQAAAAAAgBQABAAAAAAQABAAAAAAIAPAAQAAAAABAAQAAAAAAAAQABABAAAAQAAAAAAABQACAGAGAGIAOAQIgHADIgHADQgFAAgNgQg");
	this.shape_3.setTransform(-58.6,-173.5);

	this.instance_4 = new lib.relogio();
	this.instance_4.setTransform(-341.6,-41.6);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#009933").s().p("AIrCsQgRgSAAgbQAAgcARgSQATgUAaABQAbgBASAUQASASAAAcQAAAbgSASQgRATgcAAQgaAAgTgTgAJDBoQgIAKAAANQAAANAIAJQAIAKANgBQANAAAJgKQAIgJAAgMQAAgOgIgJQgIgKgOAAQgMAAgJAKgADvCsQgSgSAAgbQAAgcASgSQASgUAbABQAbgBASAUQARASAAAcQAAAbgRASQgSATgbAAQgbAAgSgTgAEHBoQgIAKgBANQAAANAJAJQAHAKAOgBQAMAAAJgKQAJgJAAgMQgBgOgHgJQgJgKgNAAQgMAAgJAKgAj+CsQgRgSAAgbQAAgcARgSQATgUAaABQAbgBASAUQASASAAAcQAAAbgSASQgRATgcAAQgaAAgTgTgAjmBoQgIAKAAANQAAANAIAJQAIAKANgBQANAAAJgKQAIgJAAgMQAAgOgIgJQgIgKgOAAQgMAAgJAKgAo4CsQgRgSAAgbQAAgcARgSQATgUAaABQAbgBASAUQASASAAAcQAAAbgSASQgRATgcAAQgaAAgTgTgAogBoQgIAKAAANQAAANAIAJQAIAKANgBQANAAAJgKQAIgJAAgMQAAgOgIgJQgIgKgOAAQgMAAgJAKgAunCsQgRgSAAgbQAAgcARgSQASgUAbABQAbgBASAUQARASABAcQgBAbgRASQgRATgcAAQgbAAgSgTgAuPBoQgJAKAAANQABANAHAJQAJAKANgBQANAAAIgKQAJgJAAgMQAAgOgJgJQgIgKgNAAQgNAAgIAKgAKmC3QgFgFgBgJQABgJAFgGQAHgGAIAAQAJAAAGAGQAGAGAAAJQAAAJgGAFQgGAHgJAAQgIAAgHgHgAF1CsQgRgSAAgbQAAgcARgSQASgTAbAAQANAAAMAFQAMAFAIAKIABADQAAAEgIAKQgIAJgCAAIgDgEQgFgEgEgCQgHgEgIAAQgNAAgIAKQgHAJgBAOQABAOAHAIQAIAJAOAAQAJAAALgEIgCgQIgBgOIABgCIACgBIAHABIAIAAIAJAAIAIAAQABAAAAAAQABAAAAABQAAAAAAABQAAAAAAABIAAAMIgBAOIACAhIABABQAAABgBAAQAAABAAAAQAAAAgBAAQAAABgBAAIgKgDIgKgCQgSAHgRAAQgbAAgSgSgADPC+IgUgBIgUAAIgaAAIgLgBQgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAgBIAAgdIAAgcIAAgeIgBgfQAAAAAAgBQAAAAAAAAQABgBAAAAQABAAAAAAIAIAAIAIAAIAJAAIAIAAQAAAAABAAQAAAAAAAAQAAABAAAAQABAAAAAAIAAABIgDAyIAAAXIAAARIAAACIACACIACAAIAYgBIAXgCQABAAAAABQABAAAAAAQAAAAAAABQABAAAAABQgBAPgCALQAAAAAAABQAAAAAAABQgBAAAAAAQAAAAgBABIgDAAgABoC9QgFgBggAAIgUAAIgUAAQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAgBIACgdIABgdIgBgmIgCgVIAAgCQAAAAAAAAQAAgBABAAQAAAAAAAAQABgBABAAIATABIATAAIAUAAIATgBQAFABABADIABANIABAMQAAAAAAABQAAAAAAAAQgBAAAAAAQgBAAAAAAIgBAAQgYgCgTAAQgEABgCACIAAAGQAAAHACABQABACAEAAIAEAAIAEAAIAXgBIAEAAIAFgBQABABAAAAQABAAAAAAQAAAAAAAAQAAABABAAIgCAOIgBAOQAAABAAAAQAAAAgBABQAAAAAAAAQgBAAgBAAIgIgBIgWgBIgJAAQgBAAgBABQgBAAAAAAQgBAAAAAAQgBABAAAAIAAAFQAAAHABACQACAEAJAAIANAAIAOgBIANgBQABAAAAABQABAAAAAAQAAABAAAAQAAABAAABIgBANIgDAOQAAAAAAAAQgBABAAAAQAAAAgBAAQAAABAAAAIgEgBgAreC+IgTgBIgUAAIgaAAIgMgBQAAAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAgBIAAgdIAAgcIAAgeIgBgfQAAAAAAgBQAAAAABAAQAAgBABAAQAAAAABAAIAHAAIAIAAIAJAAIAIAAQABAAAAAAQAAAAABAAQAAABAAAAQAAAAAAAAIAAABIgCAyIAAAXIAAARIAAACIABACIACAAIAYgBIAYgCQAAAAABABQAAAAAAAAQABAAAAABQAAAAAAABQAAAPgCALQAAAAAAABQgBAAAAABQAAAAAAAAQgBAAAAABIgEAAgAv4C9QgGgBgfAAIgVAAIgUAAQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAgBIABgdIABgdIgBgmIgBgVIAAgCQAAAAAAAAQAAgBAAAAQ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IAJABQAEgBACgCQADgDAAgDQAAgLgPAAQgGAAgLADIgBAAQAAAAgBAAQAAAAAAAAQAAAAgBgBQAAAAAAgBIgBgIIAAgFIgBgEQAAgEAPgDIATgCQAPABALAGQAOAIAAAOQAAAQgOAJQAIADAFAGQAGAHgBAJQAAAQgNAJQgLAIgSgBQgNAAgIgCgAKAgiQgFgGAAgHQAAgIAFgEQAEgFAHAAQAIAAAEAFQAFAEAAAIQAAAHgFAGQgEAEgIAAQgHAAgEgEgAElggIgMgcIgMgcIgCgBIAAACIAAAaIABAaQAAABAAAAQAAABgBAAQAAABAAAAQgBAAgBAAIgdAAIgCgBIAAgBIABgdIABgdIgBgnIgBgVIAAgBQAAgBAAAAQAAgBABAAQAAAAABAAQAAgBABAAIAPAAIAOAAQABAAAAAAQAAABABAAQAAABAAAAQABABAAABIAaA4QACAGACAAQABAAADgHIAag3QABgBAAgBQABgBAAAAQABgBAAAAQAAAAABAAIAIAAIAHAAIAHAAIAHAAQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIAAAfIgBAfIABAdIAAAdQAAAAAAABQAAAAAAAAQAAABgBAAQAAAAgBAAIgfAAQgBAAAAAAQgBAAAAgBQAAAAAAgBQgBAAAAgBIABgaIAAgbIAAgDIgMAbIgMAfIgDACIgDABQgFAAgBgCgATFgfQgGgBgfAAIgVAAIgTAAQgBAAgBAAQAAAAgBgBQAAAAAAAAQgBgBAAAAIACgeIABgeIgBglIgBgVIAAgBQAAgBAAAAQAAgBAAAAQAAAAABAAQAAgBABAAIAUABIATAAIATAAIAUgBQAEAAABAEIABAMIABANQAAAAAAABQAAAAAAAAQAAAAgBAAQAAABgBAAIgBAAQgXgCgUgBQgEAAgBADIgBAGQABAHACABQABACAEAAIAEAAIADAAIAXgBIAFAAIAFgBQAAAAABABQAAAAAAAAQABAAAAAAQAAABAAAAIgCAOIAAAOQAAAAgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgIgBIgXAAIgJAAQgBAAgBAAQAAAAgBAAQAAAAgBAAQAAABgBAAIAAAFQAAAIACABQABADAKABIAMAAIAPAAIANgBQABAAAAAAQAAAAABAAQAAABAAAAQAAABAAAAIgCAPIgCAMQAAABgBAAQAAABgBAAQAAAAAAAAQgBAAAAAAIgDAAgADUgfQgGgBgfAAIgUAAIgUAAQgBAAgBAAQAAAAgBgBQAAAAAAAAQgBgBAAAAIACgeIABgeIgBglIgBgVIAAgBQAAgBAAAAQAAgBAAAAQABAAAAAAQAAgBABAAIAUABIATAAIATAAIAUgBQAEAAABAEIABAMIABANQAAAAAAABQAAAAAAAAQAAAAgBAAQAAABAAAAIgCAAQgYgCgTgBQgEAAgBADIgBAGQAAAHADABQABACAEAAIAEAAIADAAIAXgBIAFAAIAFgBQAAAAABABQAAAAAAAAQABAAAAAAQAAABAAAAIgCAOIAAAOQAAAAgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgIgBIgXAAIgJAAQgBAAgBAAQAAAAgBAAQAAAAgBAAQAAABgBAAIAAAFQAAAIABABQACADAKABIAMAAIAPAAIANgBQABAAAAAAQAAAAABAAQAAABAAAAQAAABAAAAIgCAPIgCAMQAAABgBAAQAAABgBAAQAAAAAAAAQgBAAAAAAIgDAAgAl7gfQgGgBgfAAIgVAAIgTAAQgBAAgBAAQAAAAgBgBQAAAAAAAAQgBgBAAAAIACgeIABgeIgBglIgBgVIAAgBQAAgBAAAAQAAgBAAAAQAAAAABAAQAAgBABAAIAUABIATAAIATAAIAUgBQAEAAABAEIABAMIABANQAAAAAAABQAAAAAAAAQAAAAgBAAQAAABgBAAIgBAAQgXgCgUgBQgEAAgBADIgBAGQABAHACABQABACAEAAIAEAAIADAAIAXgBIAFAAIAFgBQAAAAABABQAAAAAAAAQABAAAAAAQAAABAAAAIgCAOIAAAOQAAAAgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgIgBIgXAAIgJAAQgBAAgBAAQAAAAgBAAQAAAAgBAAQAAABgBAAIAAAFQAAAIACABQABADAKABIAMAAIAPAAIANgBQABAAAAAAQAAAAABAAQAAABAAAAQAAABAAAAIgCAPIgCAMQAAABgBAAQAAABgBAAQAAAAAAAAQgBAAAAAAIgDAAgALxgfQgQAAgFgBQAAAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAAAIABgeIAAgeIgBgdIgBgcIAAgCQgBgBAAAAQABAAAAAAQAAgBABAAQAAAAABAAIATAAIAUAAIAWgBIAUgBQAFABABADIAAAMIABAHIABAIQAAAAAAAAQAAAAgBAAQAAAAAAAAQgBABAAAAIgUgCIgUgBIgKAAQgDACAAAHQAAAJAEAAIAGABIASgBIASgBQADAAgBAQIAAAQQAAAAgBABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgGAAIgdgBIgHAAQgEABAAADIABAcIABAOQAAACgGAAgANAggQgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAAAIAAgQIACgvIgBgcIgBgcQAAgBABAAQAAgBAAAAQAAAAABAAQAAgBAAAAIAJABIAIAAIAIAAIAIgBQABAAAAABQABAAAAAAQABAAAAABQAAAAAAABIgBAcIgBAcIAAAfIABAgIgBABIgCABIgQAAIgQAAgAGRggIgQAAQgBAAAAAAQgBAAAAgBQAAAAAAAAQgBgBAAAAIAAgeIABgdQAAgcgDgeIAAgBQAAgBABAAQAAAAAAgBQAAAAABAAQAAAAABgBQAHgBAYAAIAaABQAVAAAMANQANANABAVQAAAVgMANQgMAOgUAAIgLAAIgLAAQgBAAgBAAQAAAAgBAAQAAABAAAAQgBABAAAAIABANIABAMQAAAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgQAAgAGgh+IAAAVIAAAIIAAAIQAAACAQAAQAUAAAAgUQgBgUgTgBQgOAAgCACgAA9ggQgBAAAAAAQgBgBAAAAQAAAAAAgBQgBAAAAAAIABggIABgfIgBgfIgcACIgBAAIABgHIACgIIAAgIQABgHACAAIABAAQAOACAcAAIAdgCIALgBIACABIABABIgBAHIAAAHIABAHIAAAFQAAABAAAAQAAABAAAAQAAAAAAAAQgBABAAAAIgbgCIAAAfIAAAfIABAgIgBABIgCABIgQAAIgPAAgAgyggQgCgBgBgDQgEgNgBgBIgYAAIgPAAQgCACgCAIQgBAHgDABIgUAAQgOABAAgDIAUg4IAYhAQAAgBABgBQAAAAAAgBQAAAAABAAQAAgBAAAAIAHABIAIAAIAHAAIAHAAQAAAAABAAQAAAAAAABQABAAAAAAQABABAAAAIAZBAQAVA2AAADQAAAAAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgQAAIgRAAgAhUhhIgEAQQgBABAGABIAJAAQAGgBAAgBIAAgBIgDgQIgGgQIgHARgAkfggIgCgBIgCgBIgDgKIgLgaQgBgDgGgBIgJAAQAAAAgBAAQAAABAAAAQAAABAAABQAAAAAAACIABASIABARIgBACIgCAAIgQAAIgQAAQgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAAAIABgeIAAgdQAAglgBgVIAAgBQAAgBAAAAQAAAAAAgBQABAAAAAAQABAAAAgBIAbgBIAaAAQAVAAAMAJQAOALAAATQAAANgDAHQgEAIgKAHIgCADIAKAVQALAXAAACIgCABIgQAAIgQAAgAlCh/IgBARIAAAGIAAAGIADABIALABQATgBAAgPQAAgLgGgDQgGgEgLAAQgJABAAACgAosggIgQAAQgBAAgBAAQAAAAAAgBQgBAAAAAAQAAgBAAAAIAAgeIABgdQAAgcgDgeIAAgBQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAABgBQAGgBAYAAIAaABQAVAAANANQANANAAAVQAAAVgLANQgMAOgVAAIgLAAIgKAAQgBAAgBAAQgBAAAAAAQgBABAAAAQAAABAAAAIABANIABAMQAAAAgBAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgPAAgAodh+IgBAVIAAAIIABAIQAAACAPAAQAUAAAAgUQAAgUgUgBQgOAAgBACgAsgggQgDgBgBgDQgDgNgBgBIgYAAIgQAAQgBACgCAIQgCAHgDABIgUAAQgNABAAgDIAUg4IAYhAQAAgBAAgBQAAAAABgBQAAAAAAAAQAAgBABAAIAHABIAHAAIAHAAIAHAAQABAAAAAAQABAAAAABQAAAAABAAQAAABAAAAIAZBAQAWA2gBADQAAAAAAABQAAAAAAAAQAAABgBAAQAAAAgBAAIgQAAIgQAAgAtChhIgFAQQAAABAGABIAJAAQAFgBABgBIAAgBIgEgQIgGgQIgGARgAuaggIgHgBQAAAAAAAAQgBAAAAAAQgBgBAAAAQgBgBAAAAIgcgmIgTgYIgBgBIgBACIABAeIAAAfQAAABAAAAQAAABgBAAQAAABAAAAQgBAAgBAAIgeAAQgBAAAAAAQgBAAAAgBQAAAAAAAAQAAgBAAAAIABgdIABgdIgBgfIgBgdQAAgBAAAAQAAgBABAAQAAAAABAAQAAgBABAAIANAAIAGgCIAHAAIAEADIAgAtIAOARQAAABABABQAAAAABABQAAAAABAAQAAABABAAQABAAAAgIIgBgbIgBgcQAAgBAAgBQAAAAAAgBQABAAAAAAQAAgBAAAAIARAAIAQgBQAAAAAAABQAAAAABAAQAAABAAAAQAAABAAABIAAAdIgBAeIAAA7QAAAAgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgGAAIgHAAIgHAAgAxzhJIADgNIAFgMQAAgBAAAAQAAAAAAgBQABAAAAAAQABAAAAAAIAKABIAKAAIAYgDIAJgBQAAAAAAABQAAAAABAAQAAABAAAAQAAABAAABIgBAGIgCAHIgBAOIgDABIgKAAIgKAAIgZABIgEABIgGAAQAAAAAAAAQgBAAAAgBQAAAAAAgBQgBgBAAgBgAKDhLQgIgcAAgEIAAgKIABgMIgBgLIAAgMQAAgBABgBQAAAAAAgBQAAAAAAAAQABgBAAAAIAHABIAHAAIAIAAIAIgBQABABAAAVQAAAQgDAOIgGAdQgBADgHAAQgHAAgBgDgAs9inQgGgDgDAAQgDAAgDACIgFADQgCAAgFgFQgGgFABgCQAAgEAJgFQAIgEAEgBQAEABAFADQAHADADAAQAEAAADgDIAGgDIAGAGQAFAGAAACIAAAAQgMANgMAAQgDAAgFgEg");
	this.shape_4.setTransform(-178,-19);

	this.tutorial_mc_1 = new lib.tutoria2_mc();
	this.tutorial_mc_1.setTransform(160.4,12.2,1,1,0,0,0,-2.7,0);

	this.jogar_btn = new lib.botaoJogar();
	this.jogar_btn.setTransform(-51.9,150.8);
	new cjs.ButtonHelper(this.jogar_btn, 0, 1, 2, false, new lib.botaoJogar(), 3);

	this.anterior_btn = new lib.botaoParte1();
	this.anterior_btn.setTransform(-151,150.8);
	new cjs.ButtonHelper(this.anterior_btn, 0, 1, 2, false, new lib.botaoParte1(), 3);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#009933").s().p("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AAAAABABQAAAAAAAAQABABAAAAQAAABAAABIgBANIgDAOQAAAAgBAAQAAABAAAAQgBAAAAAAQgBAAAAAAIgDAAgAQsC8IgHAAQgBAAgCgEIgcglIgTgYIgBgBIgBACIABAeIAAAfQAAABAAAAQAAABgBAAQAAABAAAAQgBAAgBAAIgeAAQgBAAAAAAQgBAAAAgBQAAAAAAAAQAAgBAAAAIABgeIABgcIgBgeIgBgfQAAAAAAAAQAAgBABAAQAAAAABAAQAAgBABAAIANAAIAGgCIAHAAIAEADIAgAtIAOARQAAABABABQAAAAABABQAAAAABAAQAAABABAAQABgBAAgGIgBgcIgBgcQAAgBAAgBQAAAAAAgBQABAAAAAAQAAgBAAAAIARAAIAQgBQAAAAAAABQAAAAABAAQAAABAAAAQAAABAAAAIAAAfIgBAdIAAA7QAAAAgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgGAAIgHABIgHgBgAMcC8IgCAAIgCgCIgEgLIgKgZQgCgEgGAAIgJAAQAAAAAAAAQAAABgBAAQAAABAAABQAAAAAAACIABASIABARIgBACIgCAAIgQABIgQgBQAAAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAAAIABgeIABgdQAAglgCgVIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABgBIAbgBIAZAAQAVAAANAJQANAKAAATQABAOgEAHQgEAIgKAHIgCADIALAVQALAXAAACIgCABIgQABIgQgBgAL4BdIAAARIAAAGIAAAGIACABIALABQAUAAAAgQQAAgKgHgFQgFgDgMAAQgIABgBACgAKOC8QgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAAAIAAggIABgfIAAgfIgcACIgCgBIABgGIACgIIAAgIQABgGABgBIABAAQAPACAcAAIAdgCIAMgBIACABIAAABIAAAHIAAAHIAAAGIABAGQAAABgBAAQAAABAAAAQAAAAAAAAQgBAAAAAAIgagBIgBAfIABAfIABAgIgBACIgDAAIgPABIgQgBgAFeC9IgMAAIgOgBQAAAAgBAAQAAAAAAgBQgBAAAAAAQAAgBAAAAIAAgdIABgdIgBgeIAAgfQAAAAAAAAQAAgBABAAQAAAAAAgBQABAAAAAAIAVgBQAbAAAIABQAVACA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IgBQABAAAAAWQAAAQgDAOIgGAdQgCADgGAAQgHAAgBgDgAKhgbQgCAAgHgNQgHgMAAgDIABgBQANgDAEgCQAJgEAAgKQAAgFgGgIIgLgMQgGgJAAgMQAAgQAPgLQAMgIASgDIABAAQAAAAABAAQAAAAAAABQABAAAAAAQAAABAAAAIALAYIAAAAQAAAAAAABQAAAAAAAAQgBAAAAAAQAAAAgBAAIgCAAIgCAAQgHAAgFADQgFADAAAGQAAAFAGAJIAMAPQAGAJAAAKQAAASgPAMQgNALgTAEgAgogbQgCAAgHgNQgHgMAAgDIABgBQANgDAEgCQAJgEAAgKQAAgFgGgIIgLgMQgGgJAAgMQAAgQAPgLQAMgIARgDIACAAQAAAAABAAQAAAAAAABQAAAAABAAQAAABAAAAIAJAYIAAAAQAAAAAAABQAAAAAAAAQgBAAAAAAQAAAAAAAAIgDAAIgBAAQgGAAgFADQgFADAAAGQAAAFAGAJIAKAPQAGAJAAAKQAAASgNAMQgNALgTAEgAIcgwQgRgTAAgbQAAgbARgTQATgSAagBQAbABASASQASAUAAAaQAAAcgSASQgRAUgcAAQgaAAgTgUgAI0h0QgIAKAAAMQAAAOAIAJQAIAKANAAQANAAAJgKQAIgKAAgNQAAgNgIgJQgIgKgOAAQgMAAgJAKgAElgwQgRgTAAgbQAAgbARgTQASgSAbgBQAcABARASQASAUAAAaQAAAcgSASQgRAUgcAAQgbAAgSgUgAE+h0QgJAKAAAMQAAAOAIAJQAIAKANAAQANAAAIgKQAJgKAAgNQAAgNgIgJQgJgKgNAAQgMAAgIAKgAitgwQgRgTAAgbQAAgbARgTQASgSAbgBQAcABARASQASAUAAAaQAAAcgSASQgRAUgcAAQgbAAgSgUgAiUh0QgJAKAAAMQAAAOAIAJQAIAKANAAQANAAAIgKQAJgKAAgNQAAgNgIgJQgJgKgNAAQgMAAgIAKgAt9gwQgSgTAAgbQAAgbASgTQARgSAcgBQAbABASASQARAUAAAaQAAAcgRASQgSAUgbAAQgcAAgRgUgAtlh0QgJAKAAAMQAAAOAIAJQAIAKAOAAQAMAAAIgKQAJgKAAgNQAAgNgIgJQgJgKgMAAQgNAAgIAKgAGsgwQgRgSAAgcQAAgaAQgTQARgTAaAAQAcAAARARIACADQAAADgHAKIgHAMIgCABIgEgDQgFgFgEgDQgIgDgHAAQgNAAgHAKQgIAJAAANQAAANAIAKQAHAKANAAQAHgBAIgDQAEgCAFgEIAEgEIABACIAIALIAHAKIgCAEQgRATgaAAQgcAAgQgTgA0egfQgIgBgWgBIgVABIgTABQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAgBIgCgJIgCgJQABgCAHgBQAJgCACgCQAJgHAJgMQAMgOAAgHQAAgGgFgEQgEgFgGAAQgIAAgHADQgEABgFAEIgFACQgDABAAgIIAAgHIgCgFIgBgEIACgDQAHgFAMgDQALgCALgBQAQABAMAHQANAIAAARQAAAUggAdIAkgCQAAAAABABQAAAAAAAAQABABAAAAQAAABAAABIAAAGIgBAGIAAAHIAAAGQAAABAAAAQAAABgBAAQAAAAgBAAQAAAAgBAAIgIgBgAEFgfIgUAAIgTgBIgbAAIgKAAQgBAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAAAIAAgdIABgdIgBgfIgBgeQAAgBAAAAQAAAAABgBQAAAAABAAQAAAAABAAIAIAAIAIABIAIgBIAIAAQABAAAAAAQAAAAABAAQAAABAAAAQAAAAAAABIAAABIgDAxIAAAYIAAAQIAAACIACABIADAAIAXgBIAXAAQABAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAQAAAPgCALQAAABAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgEAAgAj+gfQgFgBgfAAIgVAAIgUAAQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAAAIABgeIABgeIgBglIgBgVIAAgBQAAgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAIAUABIAUABIATgBIATgBQAFAAABAEIABAMIABANQAAAAAAABQAAAAgBAAQAAAAAAAAQgBABAAAAIgCAAQgXgCgTAAQgEAAgCACIAAAHQAAAFACACQACACAEAAIADAAIAEAAIAWAAIAGgBIAEgBQABAAAAABQABAAAAAAQAAAAAAAAQAAABABAAIgDAOIAAAOQAAAAAAABQAAAAgBAAQAAABAAAAQgBAAgBAAIgIgBIgWAAIgJAAQgBAAgBAAQgBAAAAAAQgBAAAAAAQgBABAAAAIAAAGQAAAGABACQABADAKABIANAAIAOAAIAOgBQAAAAAAAAQABAAAAAAQAAABAAAAQAAABAAAAIgBAPIgCAMQgBABAAAAQgBABAAAAQAAAAgBAAQAAAAgBAAIgDAAgAoIgfQgFgBggAAIgUAAIgUAAQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAAAIACgeIABgeIgBglIgBgVIAAgBQgBgBAAAAQABgBAAAAQAAAAAAAAQABgBABAAIATABIATABIAUgBIATgBQAFAAAAAEIACAMIABANQAAAAAAABQAAAAAAAAQgBAAAAAAQAAABgBAAIgBAAQgYgCgTAAQgFAAAAACIgBAHQAAAFACACQABACAEAAIAEAAIAEAAIAXAAIAEgBIAFgBQABAAAAABQABAAAAAAQAAAAAAAAQAAABAAAAIgBAOIgBAOQAAAAAAABQAAAAgBAAQAAABAAAAQgBAAgBAAIgHgBIgYAAIgJAAQAAAAgBAAQgBAAAAAAQgBAAAAAAQgBABAAAAIAAAGQAAAGABACQACADAJABIANAAIAOAAIANgBQABAAAAAAQABAAAAAAQAAABAAAAQABABAAAAIgCAPIgDAMQAAABAAAAQgBABAAAAQAAAAgBAAQAAAAAAAAIgEAAgABxgfIgHAAQggAAgGgCQgBAAAAAAQgBAAAAAAQgBgBAAAAQAAgBAAAAIACgcIABgdIgBgnIgBgVIAAgBQgBgBAAAAQABAAAAgBQAAAAABAAQAAAAABgBIAUAAIAhAAQAWACAKAFQAOAJAAAUQAAAFgDAGQgDAEgDAEIgDAEIACABQAGAEAEAHQACAIAAAHQABAQgLALQgLAMgdAAIgGAAgABmhSQgBABAAAKQAAAKABABQABABALAAQAKABAEgCQAHgDgBgHQAAgIgGgDQgFgCgJAAQgLAAgBABgABliCIAAAGIgBAEQAAAJACACQABABAKAAQATAAgBgMQAAgHgHgDQgEgBgKAAQgKAAABABgAlmggIgEAAIgGAAIgFAAQgBAAgMgRIgLgRQgCACgLAQQgKAQgCAAIgGAAQgTAAABgCIAAgFIgBgFQAAgLACgCIAOgTQAMgQAAgCQAAgCgMgPIgPgTIgBgDIAAgGIABgEIgBgGIAAgFQAAAAAAgBQAAAAABAAQAAAAABAAQAAgBABAAIAGABIAGAAIAFAAIAFgBQABABAMARIAMARIAMgSQALgQACgBIAVAAQABAAAAABQABAAAAAAQABAAAAAAQAAABAAAAIAAAVQAAADgOARIgNATQAAACAMAPIAOAUQACACAAAMIgBAJQgBACgFAAIgEAAgAnwggQgBAAAAAAQgBgBAAAAQAAAAAAgBQAAAAAAAAIABgQIABgvIgBgcIAAgcQAAgBAAAAQAAgBAAAAQAAAAABAAQAAgBAAAAIAJABIAIAAIAIAAIAIgBQABAAAAABQABAAAAAAQABAAAAABQAAAAAAABIgBAcIgBAcIABAfIAAAgIgBABIgCABIgPAAIgRAAgAq7ggIgNAAIgNAAQgBAAAAAAQgBAAAAAAQAAgBAAAAQgBgBAAAAIABgdIABgdIgBgfIgBgdQAAgBABAAQAAgBAAAAQAAAAABgBQAAAAABAAIAVgBQAaAAAJACQAUACAMAIQALAIAGAOQAHAOAAANQAAAbgRASQgOARgbABIgcAAgAq1h8IAAAPIgBAPIABAQIAAAPQAAAEAOAAQAPAAAJgKQAIgKAAgQQAAgOgJgJQgJgLgOAAQgOABAAAEgAu4ggQgDgBgBgDQgCgNgCgBIgXAAIgRAAQgBACgCAIQgCAHgCABIgUAAQgNABAAgDIAUg4IAXhAQAAgBABgBQAAAAAAgBQAAAAAAAAQABgBAAAAIAHABIAIAAIAHAAIAHAAQAAAAABAAQAAAAAAABQABAAAAAAQABABAAABIAZA/QAVA2AAADQAAAAAAABQAAAAAAAAQgBABAAAAQAAAAgBAAIgRAAIgQAAgAvZhhQgGANAAADQABABAFABIAJAAQAGgBAAgBIAAgBIgEgQIgGgRIgFASgAwxggIgHgBQgCAAgCgCIgcgmIgSgYIgCgBIgBACIABAeIAAAfQAAABAAAAQAAABAAAAQAAABgBAAQAAAAgBAAIgeAAQgBAAgBAAQAAAAAAgBQgBAAAAAAQAAgBAAAAIABgdIABgdIgBgfIAAgdQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAABAAIAMgBIAHgCIAHAAIADADIAhAtIANASQABAAAAABQABAAAAABQABAAAAAAQABABAAAAQABAAABgIIgBgcIgBgbQAAgBAAgBQAAAAAAgBQAAAAAAAAQABAAAAAAIAQgBIAQgBQAAAAABABQAAAAAAAAQAAABAAAAQABABAAABIgBAdIgBAeIAAA7QAAAAAAABQAAAAgBAAQAAABAAAAQgBAAgBAAIgGAAIgGAAIgHAAgA0KhJIADgNIAEgMQAAgBAAAAQABAAAAgBQAAAAABAAQAAAAABAAIAJABIALAAIAYgDIAIgBQAAAAABABQAAAAAAAAQAAABAAAAQABABAAABIgBAGIgCAHIgCAOIgDABIgKAAIgJAAIgaABIgEAAIgFABQAAAAgBAAQAAAAgBgBQAAAAAAgBQAAgBAAgBgAvVinQgFgDgEAAQgCAAgDACIgFADQgDAAgFgFQgFgFAAgCQABgEAIgFQAJgEADAAQAEAAAGADQAGADADAAQAEAAAEgDIAGgDIAFAGQAGAGAAACIgBAAQgLANgMAAQgEAAgFgEg");
	this.shape_5.setTransform(-196.7,-100.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.tutorial_mc},{t:this.proximo_btn},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.shape_5},{t:this.anterior_btn},{t:this.jogar_btn},{t:this.tutorial_mc_1},{t:this.shape_4},{t:this.instance_4},{t:this.shape_3},{t:this.instance_3}]},1).wait(1));

	// cordas
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_6.setTransform(-355.5,202.3);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_7.setTransform(-356.3,200.2);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_8.setTransform(-355.6,200.4);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAgBAAQAAAAAAAAQAAAAAAAAQAAABAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_9.setTransform(-355.9,201.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_10.setTransform(-354.9,-238.3);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAAAAAQgBAAAAAAQAAAAAAABQAAAAAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_11.setTransform(-355.3,-238.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_12.setTransform(-355.6,-240.4);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_13.setTransform(-355,-240.2);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_14.setTransform(347.8,200.1);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_15.setTransform(348.5,202.1);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_16.setTransform(348.4,200.2);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAAAAAQgBAAAAAAQAAAAAAABQAAAAAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_17.setTransform(348.1,201.8);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_18.setTransform(349.2,-238.5);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_19.setTransform(348.4,-240.5);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_20.setTransform(349.1,-240.4);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAAAAAQgBAAAAAAQAAAAAAAAQAAABAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_21.setTransform(348.8,-238.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]}).wait(2));

	// toras
	this.instance_5 = new lib.t_madeira2();
	this.instance_5.setTransform(348.1,-17.2,1,1.015,0,0,0,0,232.4);

	this.instance_6 = new lib.t_madeira2();
	this.instance_6.setTransform(-355.8,-17.2,1,1.015,0,0,0,0,232.4);

	this.instance_7 = new lib.t_madeira1();
	this.instance_7.setTransform(-3.9,204.7,1,0.86,0,0,0,0,7);

	this.instance_8 = new lib.t_madeira1();
	this.instance_8.setTransform(-3.9,-238.9,1,0.86,0,0,0,0,7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5}]}).wait(2));

	// fundo
	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.lf(["#FFFFFF","rgba(255,255,255,0.863)"],[0,1],-190.6,208.7,324.5,-303.6).s().p("Eg2+Ai1MAAAhFpMBt9AAAMAAABFpg");
	this.shape_22.setTransform(-3,-19.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_22}]}).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-384.9,-256.2,760.9,477.2);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;