(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// stage content:
(lib.JogoCores = function() {
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
	this.somFundo_mc.setTransform(741.9,77.4,0.437,0.437);

	// nivel
	this.instrucao_mc = new lib.instrucao_mc();
	this.instrucao_mc.setTransform(400,284.1);

	// pontos
	this.tempo_mc = new lib.tempo_mc();
	this.tempo_mc.setTransform(81,425.3);

	this.pontos_mc = new lib.ponto_mc();
	this.pontos_mc.setTransform(745.6,378.2,1,1,0,0,0,0,-0.4);

	// jogo
	this.jogo_mc = new lib.jogo_mc();
	this.jogo_mc.setTransform(169.9,135);

	// fundoPrincipal
	this.instance = new lib.fundoJogo_mc();
	this.instance.setTransform(409,317);

	this.addChild(this.instance,this.jogo_mc,this.pontos_mc,this.tempo_mc,this.instrucao_mc,this.somFundo_mc,this.carregar_mc);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-10.1,-1,811.5,601.1);


// symbols:
(lib.barraPontosExterna = function() {
	this.initialize(img.barraPontosExterna);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,72,326);


(lib.barraPontosInterna = function() {
	this.initialize(img.barraPontosInterna);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,19,259);


(lib.fundo = function() {
	this.initialize(img.fundo);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,800,600);


(lib.xis = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FCC601").s().p("AhTAkIAihBIgEgJIgCgEIBXAAIgBAEIgBADIAdAjQAYAbABAIQgcAFgUAAIgIAAIghgrQgIAHgEAOIgIAZQgZgBghgGg");
	this.shape.setTransform(-0.1,4.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FDE602").s().p("AgsAuIgQgkQgRglAAgFQAAgFASgCIAXgCQAMASAXAsIARguIAGgUQA4AKAAAGQAAAIgQAeIgTAlg");
	this.shape_1.setTransform(-1.1,-4.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#9E7925").s().p("AgvBiIghgDQgGgBAAgBQgBgEgFgGIAjhHIgEgJIgBgDIgPghQgSgpAAgFQAAgJAUgDQAIgCAVAAIABADIAIAHIANAVIAMAVIAMggIAGgZQA9ALAEAKIAHAHQABAAAAABQAAAAAAABQABAAAAABQAAAAAAAAQAAAJgSAiIgNAYIgCADIgFAMIAcAhQAYAeACAMQggAHgSAAIgNAAIgJgIIAAAAIgYggQgCAFgDAIIgEANIgFAQIghgBgAhIhWQgSACAAAFQAAAFASAnIAQAjIACADIADAJIghBDQAhAGAYABIAIgZQAEgOAIgJIAhAtIAJAAQATAAAcgFQgBgIgXgbIgeglIABgDIABgDIATgjQARghAAgIQAAgFg4gLIgHAVIgQAvQgXgugNgSIgXACg");

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgxB1IgggCIgBAAQgagDACgOIgBgBIgBgBQgDgEgBgGIAAAAQgBgHADgFIAfg+IAAAAIgBgCIgBgFIgPgeQgTgrAAgKIAAgBQgCgOAMgIQAIgHATgDIADAAQAJgCATAAIABAAQAEAAAGACIABABQAEADACAEIAGAFIABACIABABIAFAHIAFgRIAAABQACgIAHgEIAAABQAEgFAJACIgBAAQBEANAJAQIAFAEIAAABQAIAHAAAKIAAAAQABAMgVAoIgMAXIgBABIAAABIgBACIAUAYIAAAAQAdAjABARQABAHgEAGIgBACQgEAFgHACIgBAAQgjAHgTAAIgBAAIgBAAIgNgBIAAAAQgHgBgEgDIgBgBIgFgFIgFgEIgBgBIgDgDIgCAHIAAABQgCAFgDAEQgFAEgHAAIAAAAIgjgCg");

	this.addChild(this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-11.6,-11.9,23.4,24);


(lib.titulo = function() {
	this.initialize();

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFF00").s().p("AhhBrQgogpAAhAQAAg/AmgrQApgsA+AAQAfAAAcAMQAdANARAYQAEAEAAADQAAAGgSAXQgTAXgFAAIgKgJQgKgKgKgFQgQgJgTAAQgcAAgSAXQgRAWAAAdQAAAiARATQASAUAfAAQAVAAAagKIgEgjQgCgVAAgLQAAgEACgBIAEAAIASABIASABIATgBIAUgBQAFAAAAAHIgBAcIgBAdQAAAbAEA0IAAADQAAAFgGAAQgEAAgSgEIgXgGQgrAQgnAAQg+AAgogqg");
	this.shape.setTransform(-95.2,-17.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FF0000").s().p("AhoBrQgpgsABg/QgBg+ApgsQAqgsA+AAQA/AAAqAsQAoAtAAA9QAABAgoArQgpAshAAAQg+AAgqgsgAgvgyQgUAWAAAcQAAAgATAUQATAWAdAAQAcAAAVgXQATgWAAgdQAAgdgSgWQgUgWgeAAQgcAAgTAXg");
	this.shape_1.setTransform(-64.6,-17.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#669900").s().p("ApkBrQgpgsAAg/QAAg+ApgsQApgsBAAAQA/AAAqAsQApAtAAA9QAABAgpArQgpAshAAAQhAAAgpgsgAosgyQgUAWAAAcQAAAgATAUQATAWAfAAQAdAAAUgXQATgWAAgdQAAgdgSgWQgUgWgeAAQgdAAgUAXgAHGCQIgeAAIgfAAQgGgBAAgEIAChEIAChEIgChFIgChGQAAgEAGgBQAPgCAhABQA/gBATACQAxAFAbAUQAaATAPAhQAOAfAAAhQAAA7gnArQgiAog+ACIhBAAgAHUhHIAAAlIgBAiIABAkIAAAkQAAAJAhAAQAjAAAVgYQATgXAAgiQAAgigVgXQgVgWgiAAQggAAAAAIg");
	this.shape_2.setTransform(-75.1,-17.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FF6600").s().p("AA/CRQgHgCgCgHQgHgegEgCQgDgBgyAAQgjAAgCACQgEADgEASQgEASgFABQgHACgoAAQgggBAAgFQAAgFAvh/QAyiGAEgNQADgHADAAIARAAIASABIAOAAIAQgBQAEAAADAHQAKAVAxB8QAxCAAAAFQAAAEgGABQgGACggAAQgdAAgIgCgAgOgGQgLAeAAAGQAAAEAMAAIATAAQANAAACgDIAAgDQAAgHgJgcQgJgegDgIQgEAJgKAeg");
	this.shape_3.setTransform(6.1,-17.3);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#0099FF").s().p("AuOCqIgWgZIgbgXQgCgCAAgCQAAgBAAAAQAAgBABAAQAAgBAAAAQABAAAAgBQAQgNADgGQAJgJAEgOQAFgVAAgtQABhngIg7IAAgCQAAgEAGgBIAUACIATAAIASAAIASgCQAHAAgBAGIAABWIAABSQAAA0gJAcQgPAyghAcQgFADgBABQgDgBgCgCgANRCGQgEAAgQgdQgQgdAAgHQAAAAAAAAQAAgBAAAAQABAAAAgBQABAAAAAAQAfgHAJgEQAWgLgBgWQABgNgOgOIgbgfQgOgVAAgaQAAgmAjgZQAcgUApgGIADgBQADABADAEQAFAPATAnIABADQAAABAAABQAAAAgBABQAAAAgBAAQgBABgBAAIgGgBIgFgBQgPAAgLAHQgOAHAAAPQAAAMAPASIAbAjQAPAUAAAXQAAApgjAeQgeAagtAIIgDAAg");
	this.shape_4.setTransform(-59.6,-15.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#CC33FF").s().p("AhTBrQgngqAAhBQAAg8AlgsQAogtA8AAQBCAAAlApQAFAEAAAEQAAADgPAZQgOAagEADQAAAAAAAAQgBABAAAAQgBAAAAAAQgBAAAAAAIgLgIQgLgKgLgFQgQgJgRAAQgcAAgTAXQgQAVAAAeQAAAeAQAVQATAXAcAAQARAAAQgIQALgFALgJIAKgIQAAAAABAAQAAAAABAAQAAABABAAQABABAAAAQADAEAPAWQAPAXAAACQAAADgFAGQglAsg/AAQg+AAgngrg");
	this.shape_5.setTransform(62.1,-17.1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#3366FF").s().p("AhnBrQgqgsAAg/QAAg+AqgsQApgsA+AAQA+AAAqAsQApAtABA9QAABAgpArQgqAsg/AAQg+AAgpgsgAgwgyQgTAWAAAcQAAAgASAUQATAWAeAAQAdAAAUgXQATgWAAgdQAAgdgTgWQgTgWgeAAQgcAAgUAXg");
	this.shape_6.setTransform(90.5,-17.1);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFCC00").s().p("AAqCQIgFgBQgCgBgBgEIgJgXIgZg9QgCgIgNgBIgVAAQgDAAAAALQAAAOACAcQADAbAAAOQAAABAAABQgBABAAAAQAAABAAAAQgBAAAAABIgGAAIgmAAQgdAAgGAAQgGgCAAgFIAChEIAChEQAAhVgDgxIgBgCQAAgEAHgBQAGgBA4gBIA7gBQAvAAAdAUQAiAYAAAuQAAAdgJASQgJAQgXARQgEADAAADIAZAzQAZA0AAAGQAAAAgBAAQAAABAAAAQgBAAgBAAQgBAAgBABQgHAAggAAIgkAAgAgnhNQgCAHAAAiIABANIAAAPQAAABAGAAQANACAOAAQAqAAAAgkQAAgYgQgKQgNgIgZABQgTAAgBAFg");
	this.shape_7.setTransform(120.4,-17.1);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#339900").s().p("ABSCQQgPgChHAAIguAAIgvAAQgHAAAAgGQAAgXACguQADguAAgVIgDhXIgBgxIAAgDQgBgFAFAAIAuABIAuABIArgBIAtgBQAKAAACAIIADAdIADAdQgBAEgEAAIgEAAQg3gFgpAAQgLAAgDAFQgBADAAANQABAOAEAFQADAEAKAAIAGgBIAKAAIA1gCIAKgBIALAAQAFAAABAEIgEAgQgCAOAAARQAAAEgFAAIgTgCQgMgCgpAAIgUAAQgJAAgBAEIgBANQABAQACAEQADAIAVABIAeAAIAggBIAhgCQAEAAAAAHQAAAJgDAXQgEAagDAFQgDAEgEAAIgGgBg");
	this.shape_8.setTransform(145.4,-16.9);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#990000").s().p("AgkCZQgFAAgQgcQgQgdAAgHQAAgBAAAAQAAAAAAgBQABAAAAAAQABAAABAAQAegIAJgEQAWgLAAgVQAAgNgOgQIgbgeQgOgVAAgZQAAgmAjgZQAcgVAngGIAEAAQADAAACAFQAFAPAUAnIAAADQAAAAAAABQAAABgBAAQAAABgBAAQAAAAgBAAIgGgBIgGgBQgPAAgLAIQgNAHAAAOQAAANAPASIAbAgQAOAXAAAWQAAAqgjAdQgeAbgqAHIgDAAg");
	this.shape_9.setTransform(165.2,-17);

	// Camada 1
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(0,0,0,0.988)").ss(6,1,1).p("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");
	this.shape_10.setTransform(8.4,-15.1);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#EDD06D").s().p("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");
	this.shape_11.setTransform(8.4,-15.1);

	this.addChild(this.shape_11,this.shape_10,this.shape_9,this.shape_8,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-155.9,-32.4,328.6,34.6);


(lib.somAnimado_mc = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FCC601").s().p("AiNA7Qg1gvAAhTIAAgIQA3gGA6gFQCLgGAAgBIAugBIAIgBIAeAAIACgBIACgBIASAAQAOABAGABIADgEQAGgFABAHIABgCIgBAEIAAABIAAABIAAABIgEAJIAAABQAAAIgKAbQgJAYgEAGIgEAHIgGAKIgKANQgLAYgTAUQgzA1hGAAQhWAAgzgvg");
	this.shape.setTransform(-17,33.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FDE602").s().p("AlSEOQAcgqApgeQAtgfArAAQBQAAAsAsIABABQAKAHARAGIgBgBIAOg2QAWhYAkh2QAHgdAKgfIABgEQA5jGATg6QAEgDBOAiQBQAjAKAKQA1A2AIBdIABAeQAABbg4BAQgxA5hCAHIAFhtIAYgTQAagXALgPQAWggAAgnQAAgHgCgGQgDgngzggIgygXIgyCtIgQA3IgaBfIgMAtIgdBnIgBAAIgBAFIgBAEIgTA/IgFAQIAAABIgCACQgBgHgFAFIgEAFQgGgCgMAAIgSAAIgCAAIgCABIgeABIgIAAIgtABQAAABiOAHQg6AEg3AHQACgrAdgsg");
	this.shape_1.setTransform(0.4,-10.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#9E7925").s().p("AlAGiIgFgGIgIgGQg5gzAAhZIABgHQABguAeguQAcgtAsgfQAxgiAuAAQBgAAAvA8IACABIANgzIA6jNIASg/IABgCQA7jNAVhAQAGgEAKAFIBIAdQBMAiASATIAXAbIAGAHQAqAxAKBLQAEAZAAAcQAABgg7BFQg7BDhTAAIgUgCIgBAAIACiHIAUgeQAogQAUglQAOgaAAgbIgBgPQgQgggigWIgfgPIgsCiIgOA1IglCFIgNAsQgiB7ggBoIgBABQgIA5gnAsQg2A4hNAAQhdAAg5g4gAkWBkQgqAdgcArQgcAsgCAqIgBAIQAABVA1AvQA0AvBVAAQBJAAAyg1QAUgUALgYIAKgPIAGgKIAEgHQAEgGAJgYQAIgbAAgIIAAgBIAEgJIAAgBIAAgBIAAgBIABgEIABgBIAFgQIASg/IABgEIACgFIAAgBIAdhnIANgqIAahhIAPg4IAyitIAyAYQAzAfAEAnQABAHAAAHQAAAngVAfQgLAQgaAXIgZAUIgEBrQBBgHAxg3QA4hCAAhaIgBgfQgHhcg2g3QgKgKhPgiQhPgigDADQgUA5g5DHIgBAEQgJAegIAdQghB5gZBWIgOA1IACACQgRgGgKgHIgBgBQgsgshRAAQgrAAgsAfg");
	this.shape_2.setTransform(1.4,-0.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AleHDIgHgHIgJgHQhFg+AAhtIABgIQABg4Alg4QAhg3A3gmQA7gqA5AAQBNAAAzAfIAFAEIAIAGIALgOIAZhWIACgDQBkliAlhvQALgHARAIQAtACBUA2QBUA1AiBFQAhBEABAaIACAnIABAdIgBAYIgBAIIgBAHIgCANQgPBHg3A0QgzAzhBARQgdAHghAAIghgBIgChIIgVBCQgnCMgkB3IgBABQgLBFgwA2QhBBFheAAQhxAAhGhFgAC8iDQAigNAVgfQAUgegDgfQgBgKgLgNIgSgVg");

	this.addChild(this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-43.6,-52,87.3,104.2);


(lib.roda_mc = function() {
	this.initialize();

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FF9933").s().p("AhmFgQiSiSAAjOQAAjNCSiSQCQiSDPAAIAAPjQjPAAiQiSg");
	this.shape.setTransform(-24.8,0);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-49.8,-49.8,49.9,99.7);


(lib.ponto_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AiLAWIAAgrIEWAAIAAArg");
	var mask_graphics_1 = new cjs.Graphics().p("AiLAjIAAhFIEWAAIAABFg");
	var mask_graphics_2 = new cjs.Graphics().p("AiLAxIAAhhIEWAAIAABhg");
	var mask_graphics_3 = new cjs.Graphics().p("AiLA+IAAh7IEWAAIAAB7g");
	var mask_graphics_4 = new cjs.Graphics().p("AiLBMIAAiXIEWAAIAACXg");
	var mask_graphics_5 = new cjs.Graphics().p("AiLBZIAAixIEWAAIAACxg");
	var mask_graphics_6 = new cjs.Graphics().p("AiLBnIAAjNIEWAAIAADNg");
	var mask_graphics_7 = new cjs.Graphics().p("AiLB1IAAjpIEWAAIAADpg");
	var mask_graphics_8 = new cjs.Graphics().p("AiLCCIAAkDIEWAAIAAEDg");
	var mask_graphics_9 = new cjs.Graphics().p("AiLCQIAAkfIEWAAIAAEfg");
	var mask_graphics_10 = new cjs.Graphics().p("AiLCdIAAk5IEWAAIAAE5g");
	var mask_graphics_11 = new cjs.Graphics().p("AiLCrIAAlVIEWAAIAAFVg");
	var mask_graphics_12 = new cjs.Graphics().p("AiLC4IAAlvIEWAAIAAFvg");
	var mask_graphics_13 = new cjs.Graphics().p("AiLDGIAAmLIEWAAIAAGLg");
	var mask_graphics_14 = new cjs.Graphics().p("AiLDTIAAmlIEWAAIAAGlg");
	var mask_graphics_15 = new cjs.Graphics().p("AiLDhIAAnBIEWAAIAAHBg");
	var mask_graphics_16 = new cjs.Graphics().p("AiLDuIAAnbIEWAAIAAHbg");
	var mask_graphics_17 = new cjs.Graphics().p("AiLD8IAAn3IEWAAIAAH3g");
	var mask_graphics_18 = new cjs.Graphics().p("AiLEKIAAoTIEWAAIAAITg");
	var mask_graphics_19 = new cjs.Graphics().p("AiLEXIAAotIEWAAIAAItg");
	var mask_graphics_20 = new cjs.Graphics().p("AiLElIAApJIEWAAIAAJJg");
	var mask_graphics_21 = new cjs.Graphics().p("AiLEyIAApjIEWAAIAAJjg");
	var mask_graphics_22 = new cjs.Graphics().p("AiLFAIAAp/IEWAAIAAJ/g");
	var mask_graphics_23 = new cjs.Graphics().p("AiLFNIAAqZIEWAAIAAKZg");
	var mask_graphics_24 = new cjs.Graphics().p("AiLFbIAAq1IEWAAIAAK1g");
	var mask_graphics_25 = new cjs.Graphics().p("AiLFoIAArPIEWAAIAALPg");
	var mask_graphics_26 = new cjs.Graphics().p("AiLF2IAArrIEWAAIAALrg");
	var mask_graphics_27 = new cjs.Graphics().p("AiLGDIAAsFIEWAAIAAMFg");
	var mask_graphics_28 = new cjs.Graphics().p("AiLGRIAAshIEWAAIAAMhg");
	var mask_graphics_29 = new cjs.Graphics().p("AiLGfIAAs9IEWAAIAAM9g");
	var mask_graphics_30 = new cjs.Graphics().p("AiLGsIAAtXIEWAAIAANXg");
	var mask_graphics_31 = new cjs.Graphics().p("AiLG6IAAtzIEWAAIAANzg");
	var mask_graphics_32 = new cjs.Graphics().p("AiLHHIAAuNIEWAAIAAONg");
	var mask_graphics_33 = new cjs.Graphics().p("AiLHVIAAupIEWAAIAAOpg");
	var mask_graphics_34 = new cjs.Graphics().p("AiLHiIAAvDIEWAAIAAPDg");
	var mask_graphics_35 = new cjs.Graphics().p("AiLHwIAAvfIEWAAIAAPfg");
	var mask_graphics_36 = new cjs.Graphics().p("AiLH9IAAv5IEWAAIAAP5g");
	var mask_graphics_37 = new cjs.Graphics().p("AiLILIAAwVIEWAAIAAQVg");
	var mask_graphics_38 = new cjs.Graphics().p("AiLIYIAAwvIEWAAIAAQvg");
	var mask_graphics_39 = new cjs.Graphics().p("AiLImIAAxLIEWAAIAARLg");
	var mask_graphics_40 = new cjs.Graphics().p("AiLI0IAAxnIEWAAIAARng");
	var mask_graphics_41 = new cjs.Graphics().p("AiLJBIAAyBIEWAAIAASBg");
	var mask_graphics_42 = new cjs.Graphics().p("AiLJPIAAydIEWAAIAASdg");
	var mask_graphics_43 = new cjs.Graphics().p("AiLJcIAAy3IEWAAIAAS3g");
	var mask_graphics_44 = new cjs.Graphics().p("AiLJqIAAzTIEWAAIAATTg");
	var mask_graphics_45 = new cjs.Graphics().p("AiLJ3IAAztIEWAAIAATtg");
	var mask_graphics_46 = new cjs.Graphics().p("AiLKFIAA0JIEWAAIAAUJg");
	var mask_graphics_47 = new cjs.Graphics().p("AiLKSIAA0jIEWAAIAAUjg");
	var mask_graphics_48 = new cjs.Graphics().p("AiLKgIAA0/IEWAAIAAU/g");
	var mask_graphics_49 = new cjs.Graphics().p("AiLKtIAA1ZIEWAAIAAVZg");
	var mask_graphics_50 = new cjs.Graphics().p("AiLK7IAA11IEWAAIAAV1g");
	var mask_graphics_51 = new cjs.Graphics().p("AiLLJIAA2RIEWAAIAAWRg");
	var mask_graphics_52 = new cjs.Graphics().p("AiLLWIAA2rIEWAAIAAWrg");
	var mask_graphics_53 = new cjs.Graphics().p("AiLLkIAA3HIEWAAIAAXHg");
	var mask_graphics_54 = new cjs.Graphics().p("AiLLxIAA3hIEWAAIAAXhg");
	var mask_graphics_55 = new cjs.Graphics().p("AiLL/IAA39IEWAAIAAX9g");
	var mask_graphics_56 = new cjs.Graphics().p("AiLMMIAA4XIEWAAIAAYXg");
	var mask_graphics_57 = new cjs.Graphics().p("AiLMaIAA4zIEWAAIAAYzg");
	var mask_graphics_58 = new cjs.Graphics().p("AiLMnIAA5NIEWAAIAAZNg");
	var mask_graphics_59 = new cjs.Graphics().p("AiLM1IAA5pIEWAAIAAZpg");
	var mask_graphics_60 = new cjs.Graphics().p("AiLNCIAA6DIEWAAIAAaDg");
	var mask_graphics_61 = new cjs.Graphics().p("AiLNQIAA6fIEWAAIAAafg");
	var mask_graphics_62 = new cjs.Graphics().p("AiLNdIAA66IEWAAIAAa6g");
	var mask_graphics_63 = new cjs.Graphics().p("AiLNrIAA7VIEWAAIAAbVg");
	var mask_graphics_64 = new cjs.Graphics().p("AiLN5IAA7xIEWAAIAAbxg");
	var mask_graphics_65 = new cjs.Graphics().p("AiLOGIAA8LIEWAAIAAcLg");
	var mask_graphics_66 = new cjs.Graphics().p("AiLOUIAA8nIEWAAIAAcng");
	var mask_graphics_67 = new cjs.Graphics().p("AiLOhIAA9BIEWAAIAAdBg");
	var mask_graphics_68 = new cjs.Graphics().p("AiLOvIAA9dIEWAAIAAddg");
	var mask_graphics_69 = new cjs.Graphics().p("AiLO8IAA93IEWAAIAAd3g");
	var mask_graphics_70 = new cjs.Graphics().p("AiLPKIAA+TIEWAAIAAeTg");
	var mask_graphics_71 = new cjs.Graphics().p("AiLPXIAA+tIEWAAIAAetg");
	var mask_graphics_72 = new cjs.Graphics().p("AiLPlIAA/JIEWAAIAAfJg");
	var mask_graphics_73 = new cjs.Graphics().p("AiLPyIAA/jIEWAAIAAfjg");
	var mask_graphics_74 = new cjs.Graphics().p("AiLQAIAA//IEWAAIAAf/g");
	var mask_graphics_75 = new cjs.Graphics().p("AiLQOMAAAggbIEWAAMAAAAgbg");
	var mask_graphics_76 = new cjs.Graphics().p("AiLQbMAAAgg1IEWAAMAAAAg1g");
	var mask_graphics_77 = new cjs.Graphics().p("AiLQpMAAAghRIEWAAMAAAAhRg");
	var mask_graphics_78 = new cjs.Graphics().p("AiLQ2MAAAghrIEWAAMAAAAhrg");
	var mask_graphics_79 = new cjs.Graphics().p("AiLREMAAAgiHIEWAAMAAAAiHg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:0.5,y:68.7}).wait(1).to({graphics:mask_graphics_1,x:0.5,y:67.4}).wait(1).to({graphics:mask_graphics_2,x:0.5,y:66}).wait(1).to({graphics:mask_graphics_3,x:0.5,y:64.7}).wait(1).to({graphics:mask_graphics_4,x:0.5,y:63.3}).wait(1).to({graphics:mask_graphics_5,x:0.5,y:62}).wait(1).to({graphics:mask_graphics_6,x:0.5,y:60.6}).wait(1).to({graphics:mask_graphics_7,x:0.5,y:59.2}).wait(1).to({graphics:mask_graphics_8,x:0.5,y:57.9}).wait(1).to({graphics:mask_graphics_9,x:0.5,y:56.5}).wait(1).to({graphics:mask_graphics_10,x:0.5,y:55.2}).wait(1).to({graphics:mask_graphics_11,x:0.5,y:53.8}).wait(1).to({graphics:mask_graphics_12,x:0.5,y:52.5}).wait(1).to({graphics:mask_graphics_13,x:0.5,y:51.1}).wait(1).to({graphics:mask_graphics_14,x:0.5,y:49.8}).wait(1).to({graphics:mask_graphics_15,x:0.5,y:48.4}).wait(1).to({graphics:mask_graphics_16,x:0.5,y:47.1}).wait(1).to({graphics:mask_graphics_17,x:0.5,y:45.7}).wait(1).to({graphics:mask_graphics_18,x:0.5,y:44.3}).wait(1).to({graphics:mask_graphics_19,x:0.5,y:43}).wait(1).to({graphics:mask_graphics_20,x:0.5,y:41.6}).wait(1).to({graphics:mask_graphics_21,x:0.5,y:40.3}).wait(1).to({graphics:mask_graphics_22,x:0.5,y:38.9}).wait(1).to({graphics:mask_graphics_23,x:0.5,y:37.6}).wait(1).to({graphics:mask_graphics_24,x:0.5,y:36.2}).wait(1).to({graphics:mask_graphics_25,x:0.5,y:34.9}).wait(1).to({graphics:mask_graphics_26,x:0.5,y:33.5}).wait(1).to({graphics:mask_graphics_27,x:0.5,y:32.2}).wait(1).to({graphics:mask_graphics_28,x:0.5,y:30.8}).wait(1).to({graphics:mask_graphics_29,x:0.5,y:29.4}).wait(1).to({graphics:mask_graphics_30,x:0.5,y:28.1}).wait(1).to({graphics:mask_graphics_31,x:0.5,y:26.7}).wait(1).to({graphics:mask_graphics_32,x:0.5,y:25.4}).wait(1).to({graphics:mask_graphics_33,x:0.5,y:24}).wait(1).to({graphics:mask_graphics_34,x:0.5,y:22.7}).wait(1).to({graphics:mask_graphics_35,x:0.5,y:21.3}).wait(1).to({graphics:mask_graphics_36,x:0.5,y:20}).wait(1).to({graphics:mask_graphics_37,x:0.5,y:18.6}).wait(1).to({graphics:mask_graphics_38,x:0.5,y:17.3}).wait(1).to({graphics:mask_graphics_39,x:0.5,y:15.9}).wait(1).to({graphics:mask_graphics_40,x:0.5,y:14.5}).wait(1).to({graphics:mask_graphics_41,x:0.5,y:13.2}).wait(1).to({graphics:mask_graphics_42,x:0.5,y:11.8}).wait(1).to({graphics:mask_graphics_43,x:0.5,y:10.5}).wait(1).to({graphics:mask_graphics_44,x:0.5,y:9.1}).wait(1).to({graphics:mask_graphics_45,x:0.5,y:7.8}).wait(1).to({graphics:mask_graphics_46,x:0.5,y:6.4}).wait(1).to({graphics:mask_graphics_47,x:0.5,y:5.1}).wait(1).to({graphics:mask_graphics_48,x:0.5,y:3.7}).wait(1).to({graphics:mask_graphics_49,x:0.5,y:2.4}).wait(1).to({graphics:mask_graphics_50,x:0.5,y:1}).wait(1).to({graphics:mask_graphics_51,x:0.5,y:-0.3}).wait(1).to({graphics:mask_graphics_52,x:0.5,y:-1.6}).wait(1).to({graphics:mask_graphics_53,x:0.5,y:-3}).wait(1).to({graphics:mask_graphics_54,x:0.5,y:-4.3}).wait(1).to({graphics:mask_graphics_55,x:0.5,y:-5.7}).wait(1).to({graphics:mask_graphics_56,x:0.5,y:-7}).wait(1).to({graphics:mask_graphics_57,x:0.5,y:-8.4}).wait(1).to({graphics:mask_graphics_58,x:0.5,y:-9.7}).wait(1).to({graphics:mask_graphics_59,x:0.5,y:-11.1}).wait(1).to({graphics:mask_graphics_60,x:0.5,y:-12.4}).wait(1).to({graphics:mask_graphics_61,x:0.5,y:-13.8}).wait(1).to({graphics:mask_graphics_62,x:0.5,y:-15.1}).wait(1).to({graphics:mask_graphics_63,x:0.5,y:-16.5}).wait(1).to({graphics:mask_graphics_64,x:0.5,y:-17.9}).wait(1).to({graphics:mask_graphics_65,x:0.5,y:-19.2}).wait(1).to({graphics:mask_graphics_66,x:0.5,y:-20.6}).wait(1).to({graphics:mask_graphics_67,x:0.5,y:-21.9}).wait(1).to({graphics:mask_graphics_68,x:0.5,y:-23.3}).wait(1).to({graphics:mask_graphics_69,x:0.5,y:-24.6}).wait(1).to({graphics:mask_graphics_70,x:0.5,y:-26}).wait(1).to({graphics:mask_graphics_71,x:0.5,y:-27.3}).wait(1).to({graphics:mask_graphics_72,x:0.5,y:-28.7}).wait(1).to({graphics:mask_graphics_73,x:0.5,y:-30}).wait(1).to({graphics:mask_graphics_74,x:0.5,y:-31.4}).wait(1).to({graphics:mask_graphics_75,x:0.5,y:-32.8}).wait(1).to({graphics:mask_graphics_76,x:0.5,y:-34.1}).wait(1).to({graphics:mask_graphics_77,x:0.5,y:-35.5}).wait(1).to({graphics:mask_graphics_78,x:0.5,y:-36.8}).wait(1).to({graphics:mask_graphics_79,x:0.5,y:-38.2}).wait(1));

	// barra
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#FF8A35","#FFBB69"],[0,1],0,152.2,0,-103.4).s().p("Ag2PxQgWgagBglIAAjAIAArDIAAmyIAAouQABglAWgbQAXgaAfAAQAgAAAWAaQAYAaAAAmIAAIuIAAGyIAALDIAADAQAAAlgYAaQgXAbgfAAQgeAAgYgbg");
	this.shape.setTransform(0,-40.4);

	this.shape.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).wait(80));

	// Camada 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#80672C").s().p("AgcTEQgrAAgkgPIAAAAQgmgPggggQgSgSgLgSIAAAAQgfgygCg+IAAsqIAAhpIAAlkIAAhYIAAnyIAAgKIAAiYQABhWA9g+QA+g+BXAAIA5AAQBXAAA+A+QA9A+ABBWIAABvIAAAiIAAHIIAABdIAAC+IAADTIAAOcQgBA/ggAxIAAABQgOAUgPAPQggAggmAPQgjAPgsAAgAiOxiQguAvAABCIAACVIAAAIIAAHzIAABTIAAFcIAABmIAAM+QgBAwAZAlQALAQALAMQAZAYAcAMQAbALAiAAIA5AAQAiAAAbgLQAcgMAZgYQAMgMAKgQQAYgmAAgvIAAgSIAAjmIAAqgIAAjOIAAjFIAAhcIAAnNIAAgeIAAhxQAAhCgugvQgwgvhCAAIg5AAQhCAAgwAvgAhGQBQgNgNgGgQIAAABQgKgTABgXIAAsmIAAhkIAAlPIAAhKIAAnzIAAgGIAAhZQgBgpAdgeIAAAAQAegdAoAAQApAAAdAdQAdAeAAApIAAA9IAAAbIAAHRIAABdIAADSIAADIIAANVQABAXgKATQgGAOgOAOQgeAegoAAQgoAAgegegAAAwKQggAAgXAXIAAABQgXAXgBAhIAABYIAAAFIAAHzIAABKIAAFLIAABjIAAMtQAAARAIAQIAAAAQAGANAKAKQAXAYAgAAQAgAAAYgYQALgKAFgNQAIgQAAgRIAAtSIAAjHIAAjUIAAhdIAAnTIAAgaIAAg+QAAghgYgYQgXgXghAAIAAAAg");
	this.shape_1.setTransform(0,-40.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DBB34E").s().p("Ai8CRIAAlcQAsgIAugHIAAFOIAABkQguAOgsARgABjgfIAAjSIBagFIAADGIAADNQgtAFgtAHg");
	this.shape_2.setTransform(0,-47.3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("rgba(0,0,0,0.498)").s().p("Ag3PzQgKgKgGgNIAAAAQgIgQAAgRIAAssIAAhkIAAlLIAAhKIAAnzIAAgFIAAhYQABghAXgXIAAgBQAXgXAgAAQAhAAAXAXQAYAYAAAhIAAA+IAAAaIAAHTIAABdIAADUIAADHIAANSQAAARgIAQQgFANgLAKQgYAYggAAQggAAgXgYg");
	this.shape_3.setTransform(0,-40.5);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#C49F45").s().p("Ai8DXIAAnxIBagHIAAHwIAABLQguAHgsAIgABjCnIAAnPIAaAAIBAAAIAAHLIAABcIhaAFg");
	this.shape_4.setTransform(0,-97.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#D2AB4B").s().p("AgcSSQgiAAgbgLQgcgMgZgYQgLgMgLgQQgZglABgwIAAs+QAsgRAugOIAAMmQgBAXAKATIAAgBQAGAQANANQAeAeAoAAQAoAAAegeQAOgOAGgOQAKgTgBgXIAAtVQAtgHAtgFIAAKgIAADmIAAASQAAAvgYAmQgKAQgMAMQgZAYgcAMQgbALgiAAgAi8tcIAAiVQAAhCAugvQAwgvBCAAIA5AAQBCAAAwAvQAuAvAABCIAABxIAAAeIhAAAIgaAAIAAgbIAAg9QAAgpgdgeQgdgdgpAAQgoAAgeAdIAAAAQgdAeABApIAABZIAAAGIhaAHg");
	this.shape_5.setTransform(0,-40.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]}).wait(80));

	// Camada 4
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#D2AB4B").s().p("AAMBmQgCgBgEAAIgGAAQAAgBgBgEIgahDIgRgpIgBgCQgBAAAAAAQAAAAAAABQAAAAAAABQAAAAAAABIABAzIAAA1QAAABAAABQAAABgBABQAAAAAAAAQgBABAAAAQgOgCgOgDQgCgCAAgDIABgxIABgvIgBgwIA1ACIAGAUQADANAJAVIAEACIABgKIgBguIAHAAIAVAAQgCAjABAQIAABkQgBABAAABQAAAAAAABQAAAAgBABQAAAAAAAAIgGABIgGAAgAA/BiQgBgBAAAAQgBAAAAgBQAAAAAAgBQgBgBABAAIAAg5IABg1IAAgnIAegCIAAAjQgBASACAlQAAAkABAUIgBAEIgCABIgOADIgNABIgBAAgACLA3QgRggACguQgBgTACgRIAfgEQgDAPAAAQQgBAYAIAOQAHAOAMgDQALgEAHgTQAIgWABgWQAAgLgCgKIAfgHIAAARQgBAwgPAqQgRAqgXAHQgGACgFAAQgRAAgMgZgAiSBNQgagKgPglQgQgjgBgsIABgZIAhAHQgEANABAQQgBAYAIAOQAHASANAEQAKAEAJgOQAHgMABgVQgBgWgFgSIAhADQADAWAAAXQAAAsgQAcQgOAUgRAAQgFAAgFgCgAD6AgQgIgVABgFQgBgBAAAAQABAAAAgBQAAAAAAAAQABgBAAAAQAMgJAEgFQAIgNAAgRQgBgLgFgJIgJgUIgBgBIAngLIAEAKQAFAOABASQgBAggMAdQgNAagRAOIgBABQgCgCgFgRgAkdAJQgIgHgEgBQgDgBAAgCIABgsQgBgcABgQIAAgLIAbAJIAAAHIAAAOQgBADAPAGQAPAIABgdIAfAIQgBAlgJAOQgLARgRgIIgJgFIgKgFQgDgDAAAGIABASIAAASQAAAAAAABQAAAAAAABQAAAAAAAAQgBAAAAAAQgEgDgKgEg");
	this.shape_6.setTransform(0,113.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FF3399").s().p("AAAAAIAAAAIAAAAIAAAAIAAAAg");
	this.shape_7.setTransform(29.7,94.8);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#DBB34E").s().p("AAHBRIgHAAIAAgMIgCg8QABgIABABIANgBIAOgBQABAAAAAFIAABBIAAALIgVAAgAhLBPIAAgPQgCguABgSQAAgFADACIAMABIAHgBQADgCADACIACADIAYBRIg1gCgAA/A2QgQAGgJABQAAAAgBAAQAAAAAAAAQAAgBgBAAQAAAAAAAAQgBgDADgNQAAgOABgCIAAgSQABgLABABIABAAQAMAAAagDIAEgBIAVgIQALgFAAABQABAAAAAAQAAAAAAAAQABAAAAAAQAAAAAAAAQAAAAgBABQAAAAAAAAQAAABABAAQAAABAAAAIAAAJIAAAEIgBAMIACAPIAAANQAAABAAABQAAAAgBABQAAAAAAABQgBAAAAAAQgDACgVABIAAAfIgeACIAAgagAh8BKIgCgHQgIgagMgCQgMgGgHAXIgEAMIghgHQADgmAMgbIABAAQAPgjAZALQARADANAVQAGAIAGAQQAJAcAEAdIghgDgACMAKQADgJAEgFQAOgeATgFQAYgKARAiIAEALQAJAaACAjIgfAHQgCgMgEgJQgIgUgLAEQgLADgHAaQgDAIgCAIIgfAEQADgjALgfgAjxA0IAAgHQAAgqgPgHIgCgBQgNgGAAADIAAAEIAAAnIAAAIIgbgJIAAgmIgChGQAAgBAAAAQAAAAAAgBQAAAAAAAAQAAAAAAAAQAAgCAAgBQAAAAAAgBQAAAAABAAQAAAAABAAQAGAAATAKIAWAKQASAGALAgIAFASQAGAYABAjIAAAFIgfgIgAD4AOIABgSQACgYAKgSQALgWAQgIIACAAQAAgBAAAAQAAAAAAABQAAAAABABQAAABAAABQADAHAHAiIAAACIgBAEIgDgBQgBAAAAAAQAAAAAAAAQgBAAAAAAQAAABAAAAQgFACgFAIQgDAFgBAHQgBAEAAAEQAAAMAGANIAGANIgnALQgGgPABgYg");
	this.shape_8.setTransform(-0.1,99.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#80672C").s().p("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");
	this.shape_9.setTransform(0,107.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]}).wait(80));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-32.1,-162.6,64.5,288.4);


(lib.nivel2_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#BD7196").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape.setTransform(30,58.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFBFDE").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_1.setTransform(1.5,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF99CB").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_2.setTransform(30,30);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFB6DA").s().p("AjIjOIGRAAImRGdg");
	this.shape_3.setTransform(25.6,26.7);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#DB6CA2").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_4.setTransform(58.5,30);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFBDDD").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_5.setTransform(30,1.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#B18663").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_6.setTransform(1.5,30);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#BE9A7C").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_7.setTransform(30,1.5);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#AC7D57").s().p("AjIjOIGRAAImRGdg");
	this.shape_8.setTransform(25.6,26.7);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#533726").s().p("AkrEsIAegfIIaAAIAAoaIAfgeIAAJXg");
	this.shape_9.setTransform(30,30);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#735339").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_10.setTransform(30,30);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#50009F").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_11.setTransform(58.5,30);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#5900B3").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape_12.setTransform(30,58.5);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#C082FF").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_13.setTransform(30,1.5);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#B66CFF").s().p("AjjkrIAeAeIAAIaIgeAfgAisjvIGQAAImQGdg");
	this.shape_14.setTransform(22.9,30);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#8000FF").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_15.setTransform(30,30);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#B86F00").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape_16.setTransform(30,58.5);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FEAF37").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_17.setTransform(1.5,30);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FE9900").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_18.setTransform(30,30);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#DB8400").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_19.setTransform(58.5,30);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FEBC58").s().p("Aj0iwIGRAAImRGdgAkNjOIgegeIJXAAIgfAeg");
	this.shape_20.setTransform(30,23.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


(lib.nivel1_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#486C24").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape.setTransform(30,58.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#669933").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_1.setTransform(30,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#7DBC3F").s().p("AjIjOIGRAAImRGdg");
	this.shape_2.setTransform(25.6,26.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#547E29").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_3.setTransform(58.5,30);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#79B63D").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_4.setTransform(1.5,30);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#9ACC68").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_5.setTransform(30,1.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#DBBB37").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape_6.setTransform(30,58.5);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFD940").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_7.setTransform(30,30);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFE57E").s().p("AjjkrIAeAeIAAIaIgeAfgAisjvIGQAAImQGdg");
	this.shape_8.setTransform(22.9,30);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#E9C73A").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_9.setTransform(58.5,30);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFEBA1").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_10.setTransform(30,1.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#6A839C").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape_11.setTransform(30,58.5);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#9FC4E9").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_12.setTransform(1.5,30);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#95B8DB").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_13.setTransform(30,30);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#7A97B4").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_14.setTransform(58.5,30);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#A9D2FA").s().p("Aj0iwIGRAAImRGdgAkNjOIgegeIJXAAIgfAeg");
	this.shape_15.setTransform(30,23.7);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#A82A00").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape_16.setTransform(30,58.5);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#F03D00").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_17.setTransform(30,30);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#F05A27").s().p("AjjkrIAeAeIAAIaIgeAfgAisjvIGQAAImQGdg");
	this.shape_18.setTransform(22.9,30);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#D23500").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_19.setTransform(58.5,30);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FA9472").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_20.setTransform(30,1.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]},1).to({state:[{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


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
	this.shape_1.graphics.f("#482F17").s().p("Eg65ABfQgHgEgEgIQgthTAthTQAEgHAHgEQAHgFAIABMB1gAAAQALAAAIAGQAIAHADAKQAQBLgQBMQgDAKgIAHQgIAGgLABMh1gAAAIAAAAQgIgBgHgEgEA4bABGICbAAQAPhGgPhFIglAAQAIAkgTAfIgBACQgFABACgDIABgEIgBgBIgBgCIAAgCIACgLIABgGQgEgVACgUImDAAQADAYgCAYIgBADQgMgXAEgcIjTAAQAFASAAATIgBADQgGAHgGgHQgKgWADgSImEAAQAEAVgJATIgBAEQgHgWAAgWIjEAAQAHAdgUAdIgBACQgJABAEgKQAAgaAJgZIldAAQAPAxAdAkIABACQgrgegNg4IAAgBIlTAAIAAABIACABQAKADAJAFIAGAGIgfgQIhbAAQAHAtAmAbIACABQg2gSACg3Ii8AAQAQANAGAVIAAACQAZAdAAAmIgBAHQADAOgBAPIFDAAIgBgBQgCgFAAgFIABgFIABgEIACgCQgBgJACgJQABgGgBgEQgCgDAAgCQABgDgBgDQgEgFgBgEIgDgGQgPgFgHgNIgDgCQgBgFgDgDQgBgBAAAAQAAgBAAAAQAAAAAAAAQABAAABAAQAIAGAJAGIABABQADAHAHAEIAEADIAHAOIADAHIAEAEIACABQAAAPgDAQIgCAQIgDAEIgBACIEhAAQglgRghggIgMgVQAAgBAAAAQAAAAAAAAQAAAAABAAQABAAAAAAIBVBHIKwAAQAAgbAJgaQABgEACgCIADgBIAEgBIAFABIADAEIACAEQAAAcgNAYIDIAAQAEgcgPgZQAAAAAAAAQAAgBAAAAQABAAAAAAQAAAAABABQgqgiglgrQgEgFADgCQAjArAsAoIABABIAAAAQAVAagJAbIC1AAQADgEAEgDQAIgngIgkQAAgBAAAAQAAgBAAAAQAAAAABgBQABAAAAABIALAPIABABQABAjgEAhIC5AAQgCgRABgPIAAgEQgDgJAFgHIACgBQAHAFgBAJIAAADQAJARgCATIB/AAQgLgZAJggIABgBQAQAagFAggAVzAWQgLAHgBAOQgBANABAOICNAAQALgQADgRIABgIIgshiIrsAAIABACQgKA4AgAuIAAABQgDAGgHgDQgqgvAVg9IjoAAQgNAqgBArIgBABQgCgCgEgGQgFgqAUgkIkjAAIABAFIABABIAAABIgBAAQAGAmgMAlIgCAEQgEAEgEgDIgCgCQABgpgCgsIl6AAICqBhQAKAGADALIAAAHIABAEQgCAFAAAEQAAABAAABQAAAAAAABQAAAAAAABQAAAAAAABIFdAAQgHgcAAggIABgEQgFgMgEgPIAAgDQAAgEAEgBIACgBQATATgEAYIAAABQAHAcgEAcIEaAAIAAgCQgCgkgKggQAAgBAAgBQAAgBAAAAQABgBAAAAQABAAABAAIAEAEIADAAQAYAjgMAjIFpAAQAmgGAYgaQAGgGgCgKQgOg3g7gWIACABQBMASgEBHQgBASgPANIgIAEIFKAAQgGgaAVgcIAcgfQAQgUgFgWQAPAzg2AcgAlmAWQgRAEgFAPIABAEQAFAKAIAHIAHADIAEACQADAAACADIFYAAQAAgBAAAAQgBgBAAgBQAAAAAAgBQAAAAAAgBIAAgDIgEgGIgBgCQgbgvg7gRQg8gUgfgnIp/AAQAOA2AHA4IAAACIgGgEIgDgBQgYgzAEg4IluAAQAAAagKAcIAAABIgFAFIgEAVIgBABIACgRIAAgDIgCgFIgCgCQABgcAIgbIi/AAQgFAygMAuIgCACQgIgtANg0IABgBIklAAQAEAMABAPQAAAUAFAVQgDACABADIgBAEQgbgWACguIABgJIleAAQAAAGgEAEIgCACQgCAQABAQIAAADQAhAXgFAlIAFARIABACQAAAHgDAGIESAAQgGgeAFgeIAAgBQAFgHABgGIABAAIgBAHIAAACQAEAhAGAgIDXAAQgQghAOgcIAAgBQALAaADAhIAAACIAAABII3AAQgJgVgHgVIgCgGQACgHgBgGQAAgEAEgBQAcAbADAnIG/AAQgvgrAUhEQACgGgCgIIACAAIAGAJIACACQgJA9AeA1ICUAAIgHgCIgIgBIgCgCIgFgDIgDgDIgBgBQAAgDgCgCIgDgHIAAgBIAAgEIAAgCIAAgCQAGgMANgGQAKgEAKgCQAPgCAMgEQAfgEAdAJIABABIgWgBQgmAAgnAKgEgiCgAMQACADgBADQAIAGAFAFQAOAggFAhIBdAAQgEgIgBgKIAAgEIAAgCQgCgLgFgLIgBgCQgEgWgRgTQABgSADgRIAAgFQAEgGAFgEIhlAAIgEAFIgEAKIAAgCIAAgIIAFgFIn2AAQADAcgHAhIAAAAQgHACgCgGQgEgeAKgbIllAAQAHAigSAjIgBAAQgCABAAgCIAAgEQgEgCgCgEQgCgiARgYIhhAAIgFAIIgBABQgCADABAEIABABQgSAqAFAqIAAAEQAFAJAHAIQACAGgBAFIgBADQgUgFgKgVQgNhBAxgtIh8AAQgEAWgMAbQgGANgCAMQgDAOgGAMQgHACgDgGQgGg7AqglIiuAAQAFAegHAeIgBABQgIgeAHgfIg5AAQAJA2gLA1IgBABIgCATIgBACQgDgGADgKIAAgDIgCgFIAAgCQAAgzAGg0IhpAAQgCAVgIAVIgCABQgGgTAGgYIhxAAQglBFAlBGIAtAAIgDgWIAAgDQACgFAFgCIACgBIAEADIACACIAIAcILRAAQgNgsAUgnIAAgBQAFAmgHAuIHzAAQgFgwAEgzIABgDQAGgGAHgDQAPA2gZA5IEhAAQgDgZgFgZQgBgFACgGQgCgHgFgEQABgEgCgEIAAgCQABgDAAgEQgGgQAAgRQAFAWAJASgAjMBAQAiAFAcgOQgRgbgngCQAsgCAOAgIAAACQgTAKgUAAQgMAAgNgEgAB8A/IhehUIABgBQA0AfAmAvIAAABIAEAGgAZPA2IABAAQAaABAbAEIAAACIgPABQgVAAgSgIgAYpArQgSgfAJgjQAAAAABgBQAAAAAAAAQABAAAAgBQABAAAAABQgEAxAnAbIABABQgQgCgOgIgAbcguQgTgIAIgJQA+APAVA1QAGARgDASIgDAKQgDhFhFgbgAawAqQADgGAGgDQAAgEACgEIABgBQABAEAAAGIAAACQgHALgOABQACgGAGAAgAkRAnIABAAQgEADgJADIgCABQAFgIAJABgAZoAfIABAAQANAGAPACIAAABIgBABQgQAAgMgKgEAnvgAJQAFgaAHgTIADALIABACQgCAlgKAhIAAACQgKgOAGgagARyAMQgvgMANgsQAPA2BCAIQA4AHA3ACQgVACgVAAQg5AAg7gRgAOig1QAAgBAAAAQAAAAAAAAQAAAAAAAAQABAAAAAAQASAogNApIAAABQAJgogPgpgAaTAHQANgCAKAHIABABQgggDgfAGQANgOAaAFgAUygsIABAAQAFADAFACIADACIAEAKIABAFQgEgJgPgNg");
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
	this.shape_8.graphics.f("#482F17").s().p("AWBQdQgHgCgDgDQgEgEAAgEIAAgzIAVACIAAAxQAqAKAqgKIAAgvQAKAFALACIAAAoQAAAEgEAEQgDADgGACQgZAGgZAAQgZAAgYgGgA3SQdQgGgCgEgDQgDgEAAgEIAAgzIAUACIAAAxQAqAKAqgKIAAgwQAKAFAMACIAAApQAAAEgFAEQgDADgGACQgZAGgZAAQgYAAgZgGgAWMPjIABAAQAeAHAgAFIABAAQglAAgbgMgA3HPjIACAAQAdAHAhAFIABAAQgmAAgbgMgA3fPOIgHAAIADgDIACgEQAFABAFgCIAMgFIAAAHIgCABQgLABgHAFgAYGPOIAKgFQAXACgJgPIAkAAQAHgsgHgsIgPAAQADAWgIAUIAAACQgBAAAAAAQgBAAAAAAQAAAAAAgBQAAAAABgBIAAgCIAAgBQADgVABgVQABgJgCgGIASAAQAFAAADAEQAEAEABAHQAHAvgHAwQgBAGgEAEQgDAEgFAAgAVqPOIADgDIACgEQAFABAFgCIAPgGIAAAIIgFABQgKABgHAEgA1LPOIALgFQAXACgJgPIBEAAQgFgZAHgZIABgDIAAADQACAXgDAbIDUAAQgBgYAAgaIABgNIAAgCIAGgGQACALAAAKQABAZgHAZIB6AAIgCgfIAAgHIgDgIIAAgEIAAgBIgBgBIABgFQgEgKABgKIAGAZIAAACIAAABIAGAJQAGATgDAVIAoAAQgBgFgBgGIAAgCIAAgCIgCgOIgBgBQgBgLgFgJIgDgHIABgWIAAgDQACgEACgCIgqAAIgDADIgBAGIAAgBIAAgFIADgDIjWAAQABARgDAVIAAAAIgDAAIgBgCQgCgUAEgQIiXAAQACATgGATIgBAFIgBABQAAAAAAAAQAAAAAAAAQAAAAAAgBQAAAAAAgBIAAgCIgCgCIgBgCQgBgVAHgPIgKAAIAAgDQABgJgCgGMApjAAAIgGASIgSAAQABALAAAMIAAACQgDAEgCgEQgEgOABgLIilAAQACANgEAMIAAACQgEgNAAgOIhTAAQADASgJASIAAABQgDABABgGQAAgQAEgQIiVAAQAFAVAGARIAIAQIAAABQgGgHgFgKQgJgQgDgVIAAgBIiRAAIABABIAAAAQAEACAEADIADAEIgOgKIgnAAQADAWALAQIAGAIIAAABQgFgDgFgGQgMgOABgYIhQAAQAGAIADANIAAABIAHAQQADANAAAPIAAAEQACAJgBAJICJAAIAAgBIgBgGIABgDIAAgCIABgBQgBgGACgGIAAgGIgCgDIAAgEIgCgHIgBgEIgBgBQgFgDgEgHIAAgCIgCgEQAAgBgBAAQAAAAAAgBQAAAAAAAAQABAAAAAAIAIAIIAAABQABAEADADIACABIAAABIADAJIABAFIACACIAAABIAAAUIgBAJIgBADIgBABIB7AAQgQgKgOgVIgFgOIABgBIAkAuIEkAAQABgRADgQIACgEIABAAIACgBIACABIABACIABACQAAASgFAPIBUAAQADgRgHgQIABAAQAJAQgEARIAfAAIACASgAJhOKQgFAMgLAIQgEAEgBAJIAAARIA8AAQAFgKABgLIABgFIgIgYIgLgmIk/AAIABABQgCAUADARQACAPAGANIAAABQAAABAAAAQgBABAAAAQgBAAAAAAQgBAAgBAAQgIgPgCgQQgDgSAEgUIhiAAQgEATgCATIgBAQIAAABQgBgBgCgEIAAgMQAAgUAHgSIh8AAIAAADIABAAIAAABIgBAAQACARgCARIgCAOIAAADQgBAAAAABQgBAAAAAAQgBAAgBAAQAAAAgBgBIAAgBIAAgQIgBgmIigAAIAtAmIAcAYQAFADABAHIAAAFIAAACIAAAGIgBADICTAAQgDgRAAgVIABgCIgCgKIgBgIIgBgCQAAAAAAgBQAAgBAAAAQABAAAAgBQAAAAABAAIABAAQAEAGACAHQABAHAAAHIgBABQADARgBASIB3AAIAAgBQAAgXgEgVQgBgBAAAAQAAgBABAAQAAAAAAAAQAAAAABAAIACACIAAABQALAWgFAWICaAAQAPgEALgQIACgEIAAACQgBAMgGAIIgDACICMAAQgDgQAJgSIAJgQIADgFQAHgMgCgNQAEARgFANgAgBO8IgBgDIAAgCIgCgEIgBgBQgKgbgWgNIgEgBQgZgMgOgZIkPAAIAFAmIAEAgIAAABIgDgCIgCgBQgEgPgCgPQgDgSABgUIicAAQAAAQgEASIAAABIgCACIAAABIgCAOIAAAAIAAgLIABgDIgCgCIAAgBQABgSACgRIhRAAIgDAmIgEAXIAAABQgCgLAAgNQAAgSAEgTIAAgBIh9AAIACARQABALABAKIAAAEIgBAFIAAACQgEgEgCgHQ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gVgNIAACtIACAAIAEADIAAABQATADANAIQAFAOACANQAGAigHAkQgBAFgFAFQACglgFgrIgDgQQAAgFgGgDQgQgBgKgFIAAGiQAVALAXAEIgVACQgNgCgKgFIAAI/IA0AMIACACQgjAGgTgQIAADDIACgBQARAIAWAAIACABQgaAIgRgLIAACuQgLAAgJAEgAVzs0IAVACIAABCIACAAIAbACIAfADIABABQgSADgOAAQgSgBgLgHIAACtIACAAIADADIAAABQANACALAFIAJAEQAPAwgKAxQgBAFgEAFQACgsgIg0QgBgDgCgCIgEgDQgQgBgJgFIAAGiQAOAIAPAEIAOADIgOACIgHAAQgNgCgJgFIAAI/IAdAHIAWAFIACACQgNACgLgBQgRgBgMgKIAADDIACgBQAMAGAPACIAMAAIABABIgNADQgQACgNgIIAACtQgMABgJADgAWpMvIgDgKIgBgDQgFgPACgOQACgKgGgDIAHADIAAAAIADABQgBAaADAZgAWTMuQACgSgFgUQAAgBAAAAQAAAAABgBQAAAAABAAQABAAABAAQARAUgGAVIgMgBgA2pMvIgEgKQgGgQACgQQACgKgFgDIAGADIAEABQgBAaADAZgA3AMuQACgSgFgUQAAgBABAAQAAAAAAgBQABAAAAAAQABAAABAAQASAUgHAVIgMgBgAWVEFQAHgDAJgBQAQgEAUAAIAGAAQgSAGgYACIgMAAIgEAAgA2+EFQAXgIAdAAIAGAAQgWAHgfABIgFAAgAXFl2QgGgMgHgMQAAAAAAAAQAAAAAAAAQAAgBABAAQAAAAABABQALALABANgA2Nl2QgGgMgIgMQAAAAAAAAQAAAAABAAQAAgBAAAAQABAAABABQAKALACANgAWxswIAAgCIACAAIgBACgA2iswIACgIIADgBIgEAJgAYGtDIAKgFQAXABgJgPIAkAAQAHgsgHgrIgPAAQADAWgIATIAAACQgBAAAAAAQgBAAAAAAQAAAAAAAAQAAgBABAAIAAgDIAAgBQADgUABgVQABgJgCgHIASAAQAFAAADAEQAEAEABAHQAHAvgHAwQgBAHgEAEQgDAEgFAAgAVqtDIADgDIACgFQAFACAFgCIAPgHIAAAIIgFABQgKACgHAEgA1TtDIgBgDQALgDAJgFQARABgBgJIBCAAQgCgIAAg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");

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("rgba(255,255,255,0.792)").s().p("A0oNLQgHgQgbACIgBgBQgEgDgFgBIgWgHIAA5oIAKABQAJABgBgJIgDgMMAqQAAAIACAJIABABIAKAFIABAAIAGgBQADgBACgDIABgCIAAAAIAEACQAGABAFgDIAAgBIABgCIADgFIAIAAIgJAGIAAADIABAEIACABIAHABIAAZmQgNAEgJAIIABACIgDABIAAAAIgDgDIAAAAIgDAAIgCAAQgDAAgDADQgGAHgEAKMgpjAAAg");
	this.shape_9.setTransform(0.8,0.7);

	this.addChild(this.shape_9,this.shape_8,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-161.8,-105.8,323.8,211.9);


(lib.madeirinha_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#916438").s().p("AZOFNUgmvgAngGqgAgIAAgKIJOgGQLpAWYiAZIQXAQIACAoIwZgQgEgpmgCdQANABAMgDMArVgC9IF7AAIoGAkUgnwACzgBPAAOQgPgRgVgVg");
	this.shape.setTransform(-4.7,6.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A67341").s().p("AZCE4Q4hgYrpgWIH3gDQLRgFKbgYQKbgXMZgTQAHBPAEA6IwYgRgEgo4gCgQAWgZAAghQAAgQgJhQICfgOMAoIAAAMgrVAC9QATgFAOgQg");
	this.shape_1.setTransform(-3.5,4.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#C68A4E").s().p("AgiHgQgHjPAAgkQAAghAUimIAUifQAAgJgYgyIgBgBQgZg0AAgDQAAgPAjgeQAhgeAAgPQAAgOgKg7IgaibQgciRgJhMIAIgBQATALAVASIAyArIgEAHQgVAmAAAcIAfDkQAJBQAAARQAAAhgWAYQgOAQgSAFQgKADgOgBQAVAVAOARQArAxAAASQAABLgeCHQgcCJAACIQAAANAIBrQAKBsAAAMQAAAMgKBiIgGBAIgZABQgFhsgFi9g");
	this.shape_2.setTransform(-268.8,13.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#644527").s().p("AhONjQAZg7AAgNQAAgRgUgmQgPgegPgTQAoAAAUgLQAGgigagoQgLgRgdgdQAgABAXgRQAZgSAAgeIgBgvIgCgoQgEg6gHhPIgBgKIgDgeQgMiKAAhOQAJoag8iXIBFhaIgGAAQAIgMAug4IAGgEIBGgrIAQAAIAABQQgMBPAADHIACFDIAADjIgEC6IAAAnIgBAiIgCB5IgBApIgCCgQgWgBgbAHQgaAFgNAJQAAABASAmQAUAoAAAPQAAAFgPAUQgPAVAAAKQAAASAZAmQAIAMAGALIgdAAQgSAOhQAEIAFgLg");
	this.shape_3.setTransform(264.2,-3.3);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#B47D47").s().p("EgpTAMZQAKhiAAgNQAAgMgKhsQgKhrAAgMQAAiIAeiKQAeiJAAhIQAAgTgrgwUABPgAPAnwgCyIIGgkIl8AAMgoIAAAIifAOIgfjlQAAgbAVgmIAEgIIAQAMQHnhDWjhLQFRgSE4gNQRtgyMkAAICOgLQCKgJA8gBQA7ABB3AFIB6AEQASABA2gGIAGAAIhFBaQA8CXgJIcQAABMAMCKIADAeIABAKQsZATqbAXQqbAYrRAFIn3ADIpOAGIAAAJUAGqAAhAmuAAnIQaAQIABAvQAAAegZASQgXARgggBQAdAdALARQAaAogGAiQgUALgoAAQAPATAPAeQAUAmAAARQAAANgZA7IgFALIgiACMgoNAAcMgl+AAbIAUgGQiUALhOAFIAGhAg");
	this.shape_4.setTransform(-3.6,5.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#98693B").s().p("EgpSACkIg0grQgUgRgUgMQOVhfRlg5IKFggQKZgfGXgNQJMgTH5gLQHdgKCLAAIhGArIgFAEQgxA4gIAMQg2AGgSgBIh6gEQh3gFg7gBQg7ABiLAJIiOALQsjAAxuAwQk4ANlRASQ2jBLnnBDIgQgMg");
	this.shape_5.setTransform(-0.3,-73.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#C98B4F").s().p("A8iJPIiOgPQFTgVFsgnQQihwFejBQDUh1B8heQCBhjBFhmQBChjAbh/QALg1AGhDIXEAAIAAC+IiWAAIphAkQk4AShtAQQAAAKgKAAQAAAaAyAiIAAAUQgKAAgPAFQgPAFgKAAQACAUATAUQATATAAAQQAABEiIB3QiYCIjyB4QkfCOlVBSQiHAgiLAVI3jgRgEgjWAJLQDUhvCWhsQEtjYCFkEIATgnQBcjHAQkDQCOgCCOAAICVAAQgiBRg8BnQhTCPhsCIQhyCPiNCGQkREHk8CsIgZANIiKAHIhAgBg");
	this.shape_6.setTransform(58.6,-4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#DB9856").s().p("ArAJQIAHgHQEmj6CWk9QAjhIAahMQBIjOALjfQEfgRCXgHQC7gIC9gEQgQEChcDHIgTAoQiFEDktDYQiUBsjUBvInogEg");
	this.shape_7.setTransform(-145.9,-5);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#79532F").s().p("EgrGAAqQgRgtgmgIIAAgUIAXgjIB8ABIHcAFIHoAFIBAABIB7ABID5ACIXhARQUyAPSgARIAAABQAUAAAoASQAEASgHAHIgbAPIAAABIn/AIUgijgA7gE8AAAQqMAAsXAYIjDAGIh7AFIlDALImcAOIgHgZg");
	this.shape_8.setTransform(2.6,60.3);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#AA7643").s().p("EAljAHcQDAg7A6AAQgSgYgIgSQgIgRgGgLQALgMAqgZQAlgaAAgbQAAhkADgPQARhHAeiZIAAjbIAAi/QAgABA8BlQgOBrgmD6QgyFIAAARQAAAcgCADQgGAHgggDQAAAgAUAOQAUAPAAATQAAArjHARIh1AFIgYgQgEgp4ABsQhjhIgng/QgagpAAgnQAAgSAUgyQAUgxAAgrQAAgvgQhFQgIglgQg0IAtgFIAQBVQATBmAAATQAAA0gjA8QgRAfgSAbQAAAOAnAiIAbAWIA7AuQB9BmAAAsQAAADgFAFQg/gpgcgUg");
	this.shape_9.setTransform(9.7,-9.6);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#D29253").s().p("EAqxAJvQyhgQ0xgPQCLgWCHggQFWhREgiPQDxh4CZiHQCIh3AAhFQAAgQgTgTQgUgTgBgVQAKAAAPgFQAPgFAKAAIAAgUQgyghAAgbQAKAAAAgKQBtgPE3gSIJiglICWAAIAADcQgeCagRBGQgDAPAABjQAAAcglAaQgqAZgLALQAGAMAIARQAIASASAXQg6AAjAA8IAYAQICVBnQCABYAdANIgygBgA38I9Ih6gCICKgGIAYgOQE9isERkHQCNiFBxiQQBsiIBUiPQA8hnAihQQIBAECgAjIBZAcQAnAMBJAAQBGAACYgKQB7gIDmgCIDzAAQgFBEgMA1QgaB/hDBjQhEBmiBBjQh8BejUB0QlhDCwfBwQlsAnlUAUICPAQIj6gCgEgp6AIxIh8gBQAkgyBChbIBUhzQAAgOgUgfQgUgfAAgJQAAgTBBgzQAvgmANgOQAFgGAAgCQAAgth9hjIg7gwIgbgWQgngiAAgPQASgaARgfQAjg9AAg0QAAgSgThmIgQhVQBXgHCQgCQIegHCigJIDHgLQgLDfhIDOQgaBNgkBKQiWE7klD5IgIAHInbgFg");
	this.shape_10.setTransform(4.3,-2.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#80672C").s().p("AviA3I5CgNIgZhqIafASMA2yAAlIAqA5QjEARxgAAQtnAA2VgKg");
	this.shape_11.setTransform(14.7,69.6);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#A18238").s().p("AhtJPIgfjrIDKvtQARAXAVAMQAZANAEAEQAMANAAAfQAAAXhaGRQhYGOAAAoQAAAiAiAwIAsA/QgzAhgMBFIgGA6QgBABAAAAQAAABAAABQgBAAAAABQAAAAAAABIgCAbQgKACgZACg");
	this.shape_12.setTransform(283.9,9.4);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#C49F45").s().p("AwUFlQAAg+hdhJQhdhJgcisQgKg7gOgzQB+hLCKhBQEfiHE5hUIalgOQhqAUhtAYQqfCToxEAQovD7lYE7QAXhPAAhHg");
	this.shape_13.setTransform(-135.2,-6.8);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#DBB34E").s().p("A9ZJYIgHgiQAchBAOgmQALgcAIgaQFYk7Iwj8QIykAKdiTQBtgYBqgUIVWgMIh4AhQpECnnwEhQn1EhkgFXQgwA5gpA5g");
	this.shape_14.setTransform(-59.3,3);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#D2AB4B").s().p("AtWJeQAog5Axg5QEhlXH0khQHwkhJEinIB4ghIYsgNQALAaAOATIjMPtIAfDrgEgregGfIgqizIPRgIQk5BTkfCHQiKBBh+BLQgbhkgshHg");
	this.shape_15.setTransform(7.6,4.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-274.6,-91.2,549.4,182.6);


(lib.Tween8 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AgGDPQhOgBg5g1Qg+g3gBhQQgBhNA7g6QA3g2BPgFIgBgfIA5A3Ig3A3IgBgiQg7AEgqApQguAsABA7QABA9AwAsQArAmA7ACIAHAAQBBAAAugsQAtgsAAg+QgBg2gpgpIAighQA3A2ACBKQABBQg7A6Qg7A5hVABIgJgBg");

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-20.5,-20.8,41.1,41.7);


(lib.Tween6 = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AjDAnQgOgOAAgZQAAgOAFgLQAEgIAGgHQAHgGAIgDQAKgEAOAAQAZAAAPAOQAPAPAAAYQAAAZgPAOQgPAPgZAAQgZAAgPgPgAixgaQgJAJAAARQAAARAJAKQAJAIANABQAOgBAIgIQAJgKAAgRQAAgRgIgJQgJgJgOAAQgOAAgIAJgAEnA0IgRgXIgMgQQgDgDgEgBIgLgBIgFAAIAAAsIgWAAIAAhnIAvAAQASAAAJACQAIADAFAHQAFAIAAAJQAAAMgIAIQgHAFgPACQAHAFAFAEQAFAFAIAMIAOAVgADzgHIARAAQARAAAEgBQAEgCACgDQACgDAAgFQAAgFgDgDQgDgEgFAAIgRAAIgSAAgAC4A0IgKgYIgsAAIgKAYIgYAAIAshnIAYAAIAtBngACJALIAeAAIgPgmgAAlA0IAAhVIghAAIAAgSIBZAAIAAASIghAAIAABVgAhSA0IAAhmIAXAAIAABUIA4AAIAAASgAkZA0IgohnIAZAAIAcBLIAchLIAYAAIgoBng");
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


(lib.fundoJogo = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#666666").s().p("AkrAOIAfgbIIaAAIAeAbg");
	this.shape.setTransform(-195.4,158.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CCCCCC").s().p("AkMEOIAAoaIIaAAIAAIag");
	this.shape_1.setTransform(-195.4,130);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#999999").s().p("AgNEOIAAoaIAcgeIAAJVg");
	this.shape_2.setTransform(-166.9,130);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#E7E7E7").s().p("AgOkqIAdAeIAAIaIgdAdg");
	this.shape_3.setTransform(-223.9,130);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#E2E2E2").s().p("AkMAPIgfgcIJXAAIgeAcg");
	this.shape_4.setTransform(-195.4,101.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#E7E7E7").s().p("AgNkqIAbAeIAAIaIgbAdg");
	this.shape_5.setTransform(166,-129.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#CCCCCC").s().p("AkNEOIAAoaIIaAAIAAIag");
	this.shape_6.setTransform(194.5,-129.9);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#666666").s().p("AkqAOIAdgbIIaAAIAeAbg");
	this.shape_7.setTransform(194.5,-101.4);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#999999").s().p("AgOEOIAAoaIAcgeIAAJVg");
	this.shape_8.setTransform(223,-129.9);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#E2E2E2").s().p("AkNAPIgdgcIJVAAIgeAcg");
	this.shape_9.setTransform(194.5,-158.4);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#CCCCCC").s().p("AkNEOIAAoaIIaAAIAAIag");
	this.shape_10.setTransform(194.5,130);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#666666").s().p("AkqAOIAdgbIIaAAIAeAbg");
	this.shape_11.setTransform(194.5,158.5);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#E7E7E7").s().p("AgNkqIAbAeIAAIaIgbAdg");
	this.shape_12.setTransform(166,130);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#999999").s().p("AgOEOIAAoaIAcgeIAAJVg");
	this.shape_13.setTransform(223,130);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#E2E2E2").s().p("AkNAPIgdgcIJVAAIgeAcg");
	this.shape_14.setTransform(194.5,101.5);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#CCCCCC").s().p("AkMEOIAAoaIIaAAIAAIag");
	this.shape_15.setTransform(-195.4,-129.9);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#666666").s().p("AkrAOIAfgbIIaAAIAeAbg");
	this.shape_16.setTransform(-195.4,-101.4);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#E7E7E7").s().p("AgOkqIAdAeIAAIaIgdAdg");
	this.shape_17.setTransform(-223.9,-129.9);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#999999").s().p("AgNEOIAAoaIAcgeIAAJVg");
	this.shape_18.setTransform(-166.9,-129.9);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#E2E2E2").s().p("AkMAPIgfgcIJXAAIgeAcg");
	this.shape_19.setTransform(-195.4,-158.4);

	this.addChild(this.shape_19,this.shape_18,this.shape_17,this.shape_16,this.shape_15,this.shape_14,this.shape_13,this.shape_12,this.shape_11,this.shape_10,this.shape_9,this.shape_8,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-225.4,-159.9,450,320);


(lib.facil_btn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AFDB/QgMgBgWAAIgggBIgqgBIgTgBQgFgCAAgDIABgwIACgwIgCgwIAAgzQAAgEAFAAIAMABIANAAIANgBQAJgCAGAAQAAAAAAAAQABAAAAABQAAAAABABQAAAAAAABIAAABQgDAcgCA4IgBAmIAAAcIAAADQAAABABAAQAAABAAAAQAAAAABAAQAAABABAAIADAAIAoAAQAbgDANAAQABAAABABQABAAAAAAQABABAAAAQAAABAAABQgBAZgDAUQgBADgCABQgCAAgEAAgAAbB8QglgBgYgeQgXgcABgqQAAgnAWgdQAYghAkgBQApgBAYAbQACADAAADQABACgKASIgMATIgCABIgHgGIgMgKQgLgFgLABQgTAAgKAQQgJAMAAAUQAAAVAJAOQAKAPASABQAMAAAKgEQAGgEAGgHQAGgGACABQAAgBAAAAQAAABABAAQAAAAAAAAQABABAAABIALARQAKAPAAADIgDAGQgZAdglAAIgBAAgACHB7QgTgBgHgCQAAAAgBAAQgBgBAAAAQAAgBAAAAQgBgBABgBIABgZIAChLIgBgsQgBgfABgPQAAgEADAAIANAAIALAAIANgBIANgBQABAAABAAQABABAAAAQABAAAAABQAAAAAAABIgBAwQgDAdAAAPIAAAyIACA0QAAABgBABQAAAAAAAAQAAABgBAAQAAAAgBAAIgCACIgRABIgHAAgAhwB0QgEgBAAgFQgEgUgCAAQgBgBgeAAQgTgBgBACQgCABgCALQgDAMgCABQgEAAgVABQgRgBAAgEQAAgDAZhPIAdhdQACgFACAAQACgBAHABIAKAAIAIgBIAJgBQADAAACAEIAhBeQAcBTAAAEQAAABAAAAQgBABAAAAQgBAAAAABQgBAAgBAAQgDABgTAAQgRAAgFgCgAibARQgFAUgBAFQAAACAHAAIALABQAIAAABgDIAAgBIgGgYQgFgSgCgFIgIAXgAkyByQgTAAgGgDQAAAAgBAAQAAAAAAgBQgBAAAAgBQAAAAAAgBIABgpIAAgpIgBgnIgCgpIAAgBQAAgEADAAIAXgBIAXAAIAZgCIAZgDQAGgBAAAFIAAARIABALIACALQAAABAAAAQAAAAAAAAQgBAAAAAAQAAABgBAAIgYgCIgYgBQgLAAgBABQgEACAAALQAAAJAFACIAHABIAVgCQAOgBAIAAQADAAABAWIgCAXQAAABAAABQgBAAAAAAQAAABgBAAQAAAAgBAAIgGgCIgigBIgIABQgFABgBAEIABApIACASQgBAEgGABgAiqhIIABgFIAAgDIgBgEIAAgFQAAgBAAAAQAAAAABgBQAAAAABAAQAAgBABAAIAVgOQAHgHAOgMIACgBIACABIAJAJQADABAGAFIADADIgDACQgKAMgVALQgTAKgNABIgBABQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAgBAAAAg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AF3CUQgNgBgZAAIgmgBIgxgDIgXAAQgEgCAAgEIABg4IABg3IgBg5IAAg7QgBgFAFAAIAPABIAPAAIAQgBQALgCAFAAQABAAAAAAQABAAAAABQAAAAABABQAAABAAAAIAAADQgDAggDBBIgBAsIABAgQAAABAAABQgBAAAAABQAAAAABABQAAAAAAABQAAAAAAABQAAAAABAAQAAABAAAAQABAAAAAAIAFAAIAuAAQAegDARABQAEgBAAAEQAAAegEAXQgCAEgCACQgCgCgGABgAAfCQQgrgBgbgiQgbghABgxQAAgvAZghQAcglApgBQAxgDAcAgQADADAAAEQAAADgLAUQgKAUgEADIgDABIgHgHQgIgHgHgFQgNgFgMAAQgVAAgNASQgKAPAAAYQAAAZAKAQQALARAWABQANgBAMgEQAHgFAIgIQAHgGABAAQAAAAABAAQAAAAAAAAQABABAAAAQABABAAAAIANAUQALASAAAEIgDAGQgdAjgsAAIgBgBgACcCPQgVgBgIgBQgEgCABgEIABgcIADhZIgBg0QgBgjABgSQgBgEAFABIAOAAIAOgBIAOAAIAPgBQAFgCAAAEIgBA3QgDAjgBARIAAA8IADA8IgDAEIgDABIgUABIgJAAgAiCCHQgEgBgBgGQgFgXgCgBQgCgBgiAAQgWAAgCABQgCACgCANQgDANgDACQgFABgZAAQgTgBABgFQgBgDAchbIAjhtQADgHABABQADgBAIABIAMAAIAKgBIAKgBQADAAACAEIAmBuIAiBlQgCADgDAAQgFABgVAAQgUAAgFgCgAi0AUQgHAYAAAEQAAAEAHAAIAOABQAIgBACgDIAAgBQgBgHgFgWQgGgUgDgGQgDAHgGAUgAlkCFQgWgBgHgCQgCgBAAgEIAAgvIABgwIgBguIgDgvIAAgBQAAgFAEAAIAbgBIAaAAIAdgCQATgEAKgBQAGAAABAGIABATIABAOIABAMQAAABAAAAQAAAAAAABQAAAAAAAAQgBAAAAAAIgdgCIgcAAQgLAAgDAAQgEADAAANQAAAKAGADIAHAAIAZgBQAQgCAKAAQAEAAAAAaQAAAXgCAEQAAABAAAAQgBABAAAAQAAABgBAAQAAAAgBAAIgHgCIgogBIgJABQgHAAAAAGIABAvIACAVQAAAFgIABgAjGhVIABgEIAAgDIgBgGIAAgGQAAAAAAgBQAAAAABgBQAAAAABgBQABAAAAAAIAZgRQAIgHARgOIACgDIACADIAKALQAEAAAIAGIACADQAAAAAAAAQAAABgBAAQAAABAAAAQgBABAAAAQgNAOgXAMQgXANgQABIgBABQAAAAgBgBQgBAAAAAAQgBgBAAAAQAAgBAAgBg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AEXBuIgcgBIgcgBIglgBIgRgBQgBAAAAgBQgBAAAAgBQgBAAAAgBQAAAAAAgBIAAgpIACgqIgBgqIgBgsQAAgDAEAAIAKAAIALABIANgCIAMgBQAAAAABAAQAAAAAAABQABAAAAABQAAAAAAABIAAABQgDAYgBAwIgBAgIABAZQgBAAAAABQAAAAAAABQAAAAAAAAQAAABABAAQAAABAAAAQAAAAAAABQAAAAAAAAQABAAAAAAIADAAIAiAAIAkgCQABAAAAAAQABAAAAABQABAAAAABQAAAAAAABQAAAXgDAQIgDAEQgCgBgEABgAgcBRQgVgZAAglQAAghAUgZQAVgcAegBQAkgCAVAYQACADAAACQAAACgIAQQgIAOgDACIgBABIgGgFIgLgIQgJgFgKABQgQAAgJAOQgIAJAAASQABASAHANQAIANARAAQAKAAAIgDQAFgEAGgFIAGgFQAAgBABAAQAAABAAAAQAAAAABAAQAAABAAAAIAKAPQAIANAAADIgCAEQgWAbghAAQgfgCgUgZgAB0BqIgVgBQgBgBgBAAQAAAAAAgBQgBgBAAAAQAAgBAAgBIABgVIAChBIAAgnQgCgaACgNQgBgBAAgBQABAAAAgBQAAAAABAAQAAAAABAAIALAAIAKgBIALAAIALgBQABAAABAAQAAAAABABQAAAAAAAAQAAABAAAAIAAApQgDAaAAANIAAAsIACAtIgCADIgDAAIgOABIgHAAgAhhBkQgDgBAAgEQgEgRgCgBIgaAAQgRgBgBABQgCACAAAKQgDAKgDAAQgDABgSAAQgPgBABgDQgBgDAWhDIAZhRQACgFACAAIAHAAIAJAAIAHAAIAIgBQACAAACADIAcBSIAZBKQAAABgBAAQAAABAAAAQgBAAAAABQgBAAgBAAQgDABgQAAQgOAAgFgCgAiGAPQgFARAAAEQAAACAFAAIALABQAGAAABgDIAAgBIgFgUIgGgUIgHAUgAkJBiQgQAAgFgBQAAgBgBAAQAAAAAAgBQgBAAAAgBQAAAAAAgBIABgjIAAgjIgBgiIgCgjIAAgBQAAgBAAgBQAAgBABAAQAAgBABAAQAAAAABAAIAUgBIATAAIAWgBIAWgDQAEgBABAFIABAOIABAKIAAAKIAAABIgWgBIgVgBQgIAAgCABQgDABAAAJQgBAIAFACIAGAAIATgBQALgBAHAAQADAAAAATIgBAUQAAABAAAAQAAABgBAAQAAAAAAAAQgBABAAAAIgGgDIgeAAIgHAAQgEABAAAEIABAkIABAQQAAADgGAAgAiTg+IABgEIAAgDIgBgDIAAgFQAAAAAAgBQAAAAABAAQAAgBAAAAQABAAABgBIASgLQAGgHANgKIABgBQAAAAABAAQAAAAAAABQAAAAAAAAQABAAAAAAIAHAJQADgBAFAFIACACIgCADQgJAKgSAJQgQAKgLAAIgBABQgBAAgBAAQAAAAAAgBQgBAAAAAAQAAgBAAAAg");

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


(lib.dificil_btn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Camada 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ak8BmQgMgBgFABQgBAAgBAAQgBgBAAAAQgBAAAAgBQAAAAAAgBQAAgNABgaIABgpIgBgmQgBgdAAgMQAAAAAAgBQAAAAABgBQAAAAABAAQABAAABAAIAbAAIAvABQAaAEAQAMQAOAKAIATQAIAQAAASQAAAigVAZQgTAXgjACIglAAIgRAAgAkigVIgBAVIAAASIAAAVIABAWQAAAEATAAQATAAAMgMQAKgOAAgVQgBgSgKgMQgNgOgSAAIgFAAQgNAAAAAFgAhjBjQgBAAgBAAQgBgBAAAAQAAgBAAAAQgBgBABAAIAAgmIABgmIgBgjIgDgmIAAgBQAAgBAAAAQABgBAAAAQAAAAABAAQABAAABAAIAYABIAXAAIAZAAQAQgCAJABQAEgBAAAGIAAANIABALIABAJQAAAAAAAAQAAAAAAAAQgBAAAAAAQAAABgBAAIgVgCIgYgBQgKgCgCACQgEABAAAJQAAAKAGAAIAGABIAVAAQAOgBAIAAQADAAAAATQAAARgBACIgCADIgIgBQgLgCgWAAIgIABQgGABAAAEIACAkIABARQgBACgGABIgJABQgUAAgFgCgAioBjQgBAAAAAAQgBAAAAgBQAAAAAAgBQAAAAAAgBIABgTIABg+IAAgiIgBglQAAgBAAAAQAAgBAAAAQABgBAAAAQABAAABAAIAKABIAKAAIAKAAIAKAAQAAAAABABQAAAAABAAQAAAAAAABQAAAAABABIgBAkIgCAjIABAoIABAoIgBACIgDABIgTACQgQAAgFgCgABaBOQgTgWABgjQgBgfASgVQASgZAdACQAeAAASAWQAAABAAAAQABABAAAAQAAABAAAAQAAABAAABIgGAOIgJANIgCAAIgDgDQgFgFgFgDQgIgEgIAAQgOgBgIALQgJAKAAAQQAAARAJAKQAIAMAOABQAIgBAIgDIAJgIIAEgEIACABIAJANIAGANIgBAFQgSAWgcABQgeAAgSgWgAAQBiQgBgBAAAAQgBAAAAAAQAAgBAAAAQgBgBABAAIABgUIABg6IAAghQgCgZABgLQgBAAABgBQAAAAAAAAQAAgBABAAQAAAAABAAIAKABIAJAAIAJAAIAJAAQAAAAABAAQAAAAABABQAAAAAAAAQABABAAAAIgBAjIgCAhIABAnIABAmIgBADIgDAAIgRACIgTgBgADGBgQgBAAgBgBQAAAAgBgBQAAAAAAgBQAAAAAAgBIABgSIACg4QgBgLAAgUQgBgXAAgLQAAgBAAAAQAAAAAAAAQAAgBABAAQAAAAABAAIAJABIAIAAIAJABIAIgCQABAAAAABQAAAAABAAQAAAAAAABQAAAAAAABIgBAhQgBAVABALIAAAkIAAAlIAAADIgDABIgQABQgOAAgCgBgAEkBgIgaAAIgMgBQgBAAAAgBQgBAAAAAAQAAgBAAAAQgBgBABgBIAAghIAAghIAAgiIgBgkQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAABAAIAIABIAHABIAJgBQAGgBADABQAAAAABAAQAAAAAAAAQAAAAAAABQABAAAAABIAAABQgCASgBAlIgBAbQAAANABAHIAAACQAAAAAAAAQAAABAAAAQAAAAABAAQAAAAABAAIACAAIAXAAQAPgCAIABQAAgBAAAAQABABAAAAQAAAAABAAQAAABAAAAQAAASgCAMQAAABAAABQAAAAgBABQAAAAAAAAQgBABAAAAIgDAAIgTABIgUgBgAAQg7QgBAAAAAAQAAAAgBAAQAAgBAAAAQAAAAAAgBIABgCIAAgDIgBgEIAAgEQAAgBAAAAQAAgBAAAAQABAAAAgBQAAAAABAAIATgKQAGgGAMgHIACgBIACABIAHAIIAJAFIACACQgBAAAAABQAAAAgBAAQAAAAAAABQAAAAAAABQgJAIgSAJQgRAGgMAAg");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AlkB0QgNgCgGABQgCAAAAAAQgBgBgBAAQAAAAAAgBQgBAAABgBQgBgPACgeIABgtIgBgsQgCgfABgOQgBgDAFgBIAfAAIA0ACQAeAEARANQAQANAJAVQAKASAAAVQgBAlgYAdQgVAagnACIgqABIgTAAgAlHgYIAAAYIAAAVIAAAYIAAAXQAAAFAWABQAVgBAOgOQALgPAAgXQgBgVgMgOQgOgPgUAAIgGAAQgPAAAAAFgAhwBvQgEAAABgDIAAgrIABgqIgBgoIgDgrIAAgBQAAgDAEAAIAbACIAaAAIAcAAQASgDALACQAEgBAAAGIAAAPIABAMIACAKQAAAAgBAAQAAABAAAAQAAAAgBAAQAAAAgBAAIgYgCIgbgCQgLgBgCACQgFABAAALQAAALAHAAIAGABIAZAAQAPgBAJAAQAEAAAAAWQAAASgBAEIgDACIgJgBQgNgCgYABIgJAAQgHAAAAAGQAAARACAXIABASQAAAEgHABIgKABQgXgBgGgCgAi9BwQgBAAAAgBQgBAAAAAAQgBgBAAgBQAAAAAAgBIABgVIAChGIgBgnIgBgpQAAgBAAgBQAAAAABgBQAAAAABAAQABgBABAAIALACIALAAIAMAAIALAAQAAAAABAAQAAAAABABQAAAAABAAQAAABAAABIgBAoIgCAoIABAtIABAtIgBADIgDAAIgVADQgTAAgFgCgABlBYQgVgZABgmQgBgkAUgYQAVgcAgACQAiABAUAYQABACAAADIgGAQIgKAPIgDAAIgEgEQgFgFgGgEQgJgEgIAAQgRgBgIAMQgKALAAAUQAAARAKAMQAIANARABQAJgBAIgDIALgJIAEgFIADACIAKAOIAGAPIgBAFQgUAaggABQgiAAgUgZgAASBuQgBAAAAgBQgBAAAAAAQgBgBAAAAQAAgBABAAIABgXIABhBIAAglQgCgcABgMQgBgBABAAQAAgBAAAAQAAgBABAAQAAAAABAAIALABIAKAAIALAAIAKAAQAAAAABAAQAAAAABABQAAAAAAABQABAAAAABIgBAoIgCAlIABArIABArIgBACIgEABQgHACgLAAIgWgBgADfBsQgEgCAAgCIACgVIACg+QgCgNABgXQgCgaABgMQgBgBAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAKABQAFgBAEABIAKABIAJgCQABAAAAAAQABAAAAABQAAAAAAAAQABABAAAAIgCAmQgBAXABANIAAApIAAAqIAAADIgDABIgSABQgQAAgCgBgAFJBsIgdAAIgOgBQgBAAAAgBQgBAAAAgBQgBAAAAgBQAAAAAAgBIAAgmIABgmIgBglIAAgpQgBgBABAAQAAgBAAAAQAAAAABAAQABAAABAAIAJAAIAIABIAKAAQAGgBAEABQAAAAABAAQAAAAAAAAQAAABAAAAQABABAAAAIAAABQgCAVgBAqIgBAeQgBAPACAHIAAADQAAAAAAAAQAAAAAAABQAAAAABAAQAAAAABAAIADAAIAZAAQARgCAJAAQAAAAABAAQAAAAABAAQAAABAAAAQAAABABABQAAATgDAOQAAABAAAAQAAABgBAAQAAABAAAAQgBABAAAAIgDAAIgWAAIgWAAgAAShCQgBAAAAAAQAAgBgBAAQAAAAAAgBQAAAAAAgBIABgCIAAgDIgBgFIAAgFQAAgBAAAAQAAgBAAAAQABAAAAgBQAAAAABAAIAWgLQAGgGANgKIADgBIACABIAIAJIAKAHIACACQAAAAgBABQAAAAAAAAQgBAAAAABQAAAAAAABQgKAJgUAKQgUAIgNAAg");

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AjtBRIgOAAQgJgBgEABQgBAAAAAAQgBgBAAAAQgBAAAAgBQAAAAAAAAIABggIAAgfIAAgfIgBgfQAAgBAAgBQAAAAABAAQAAgBABAAQAAAAABAAIAWAAQAcAAAJABQAUADANAJQALAJAHAPQAGAMAAAPQAAAagRAUQgPASgbACIgeAAgAjmgRIAAARIAAAPIAAAQIAAAQQAAAFAPAAQAPgBALgJQAGgLABgQQAAgPgJgJQgKgLgOAAIgDAAQgMAAAAADgAhPBPQAAgBgBAAQAAAAAAAAQgBgBAAAAQAAgBAAgBIABgdIAAgeIgBgbIgCgfIAAgBQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIATAAIASABIAUAAQANgCAIABQACAAAAAEIAAAKIAAAIIABAHQAAABAAAAQAAAAAAAAQAAAAAAAAQgBAAAAAAIgRgBIgSgBQgIgBgCABQgDABAAAHQAAAIAEAAIAFAAIARAAIARAAQADAAAAAQIAAAOIgDACIgGAAIgagCIgGABQgFAAAAAEIACAcIAAAOQgBACgFABIgHAAIgUgBgAiFBPQAAgBgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIABgPIABgxIgBgbIAAgdQAAgBAAAAQAAgBABAAQAAAAAAAAQABAAAAAAIAIABIAIAAIAJAAIAHAAQAAAAABAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAAdIgBAbIAAAgIABAgIgBACIgCABIgPABQgNAAgEgBgABHA+QgPgSAAgbQAAgZAPgQQANgUAYABQAYABANARIABADIgEAMIgHAKIgCAAIgDgCIgHgGQgHgDgGAAQgLgBgHAIQgGAHAAAOQAAANAGAIQAHAJALAAQAGAAAHgCIAHgHIADgDIACABIAHAKIAEALIgBAEQgOARgWACQgYgBgOgRgAAMBOQAAgBgBAAQAAAAAAgBQAAAAAAAAQAAgBAAAAIAAgPIABgvIAAgZIgBgdQAAAAAAAAQAAgBABAAQAAAAAAAAQABgBAAAAIAIABIAHAAIAHAAIAIAAQAAAAAAAAQABAAAAABQAAAAAAAAQAAABABAAIgBAcIgBAaIAAAeIABAeIgBADIgCAAIgOACIgPgBgADnBMIgUgBIgKAAQAAAAgBAAQAAgBAAAAQgBAAAAgBQAAAAAAgBIAAgaIAAgbIAAgaIAAgcQAAgBAAAAQAAAAAAgBQABAAAAAAQAAAAABAAIAGABIAGAAIAIAAQAEgBACABQABAAAAAAQAAAAAAAAQAAAAAAABQAAAAAAAAIAAABQgBAPgBAcIgBAWQAAAKABAFIAAACIABABIADAAIASAAIASgCQAAAAAAABQABAAAAAAQAAAAABABQAAAAAAABQAAANgCAKIgCADIgCAAIgQABIgPgBgACcBMQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAAAAAgBIABgOIABgsQgBgJABgQIgBgbQAAAAAAgBQAAAAAAAAQABAAAAAAQAAAAABAAIAGABQAFgBACABIAHAAIAGgBQABAAAAAAQABAAAAAAQAAAAAAABQABAAAAABIgBAaIgBAZIABAdIAAAcIAAADIgDAAIgMACIgOgBgAAMguQAAAAAAAAQAAgBgBAAQAAAAAAAAQAAgBAAAAIAAgCIAAgCIAAgDIAAgEQAAAAAAAAQAAgBAAAAQABAAAAgBQAAAAAAAAIAPgIQAFgEAKgHIACAAIABAAIAFAHIAHAEIACACQAAAAgBAAQAAAAAAABQAAAAAAAAQgBAAAAABQgHAHgOAGQgNAFgKABg");

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
	this.shape_6.graphics.f("#E3A77B").s().p("AFyAhIATAAIgTAAIAAgiIhhgHIAKgbIBhAGQATAFgCAYIgBAPIgHASIgTAugAmIAnIAAgGIAIAAIgIAAIgDhTQgFgdAaACIEaASQgGASACAVIg+gcIi9AAQgaADgCAsIgBAHIgIAbIgCAGgAhBghQgJAFgEAQIgIgEQAAgWgBgVIFqAXIgLAbg");
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


(lib.destaque_mc = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.298)").s().p("AkrEsIAApXIJXAAIAAJXg");
	this.shape.setTransform(30,30);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


(lib.cordaGomo_gr = function() {
	this.initialize();

	// Camada 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#987E41").s().p("AhUCdQAPAHASAAQAtAAAfgxQAIgNAGgNQASgpAAgyQAAhGgggxQgIgMgJgJIgIghIgBgMQAeALAYApQAgA4AABPQAABEgZA0IgHAMQghA4grAAQgiAAgbgfg");
	this.shape.setTransform(2.5,0.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F0C867").s().p("AAjBoIgIgJQgggogcAAIgJAAQgVADgKASIgBgYIAAgLQgBhJAdg2IADgGQAhg4AsABQALAAAKADIAEAMIAIAhQAJAtAAAzQAAAfgIA4IAAACIgIA9IgCAAIgCACQACgQgXgdg");
	this.shape_1.setTransform(-3.3,-4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#C4A354").s().p("AguCSQgJgKgJgOQgYgrgGg5QAKgRAVgDIAJgBQAcAAAgAoIAIAKQAXAdgCAPIACgBIACgBIAIg8IAAgCQAIg2AAgiQAAgygJgtQAJAJAIAMQAfAxAABFQAAAzgSAoQgFAOgIAMQghAxgrAAQgSAAgPgHg");
	this.shape_2.setTransform(-1.2,1.2);

	this.addChild(this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-10.9,-18.9,22,38);


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


(lib.caixatxt_mc = function() {
	this.initialize();

	// Layer 1
	this._txt = new cjs.Text("", "14px Arial");
	this._txt.textAlign = "center";
	this._txt.lineHeight = 21;
	this._txt.lineWidth = 284;
	this._txt.setTransform(-0.4,-77,0.986,1);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,255,255,0.8)").s().p("A1oNAQhRAAAAhuIAA2jQAAhuBRAAMArSAAAQBQAAAABuIAAWjQAABuhQAAg");

	this.addChild(this.shape,this._txt);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-146.6,-83.1,293.4,166.5);


(lib.bolinha_loader = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#00FFFF").ss(1,1,1).p("AhHBIQgegeAAgqQAAgpAegeQAegeApAAQAqAAAeAeQAeAeAAApQAAAqgeAeQgeAegqAAQgpAAgegeg");
	this.shape.setTransform(10.8,10.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["#EEFFF1","#00CCFF","#0099CC","#003399"],[0,0.298,0.753,1],3.8,-4.3,0,-0.4,0,10.6).s().p("AhHBIQgegeAAgqQAAgpAegeQAegeApAAQAqAAAeAeQAeAeAAApQAAAqgeAeQgeAegqAAQgpAAgegeg");
	this.shape_1.setTransform(10.8,10.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#184521").ss(3,1,1).p("ABrAAQAAgrgfggQgggfgsAAQgrAAggAfQgfAgAAArQAAAsAfAgQAgAfArAAQAsAAAggfQAfggAAgsg");
	this.shape_2.setTransform(10.8,10.8);

	this.addChild(this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,21.5,21.5);


(lib.bloco_vermelho = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#A82A00").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape.setTransform(30,58.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#D23500").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_1.setTransform(58.5,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FA9472").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_2.setTransform(30,1.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#F05A27").s().p("AjjkrIAeAeIAAIaIgeAfgAisjvIGQAAImQGdg");
	this.shape_3.setTransform(22.9,30);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F03D00").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_4.setTransform(30,30);

	this.addChild(this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


(lib.bloco_verde = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#7DBC3F").s().p("AjIjOIGRAAImRGdg");
	this.shape.setTransform(25.6,26.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#486C24").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape_1.setTransform(30,58.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#547E29").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_2.setTransform(58.5,30);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#79B63D").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_3.setTransform(1.5,30);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#9ACC68").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_4.setTransform(30,1.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#669933").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_5.setTransform(30,30);

	this.addChild(this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


(lib.bloco_azul = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#6A839C").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape.setTransform(30,58.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#7A97B4").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_1.setTransform(58.5,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#A9D2FA").s().p("Aj0iwIGRAAImRGdgAkNjOIgegeIJXAAIgfAeg");
	this.shape_2.setTransform(30,23.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#9FC4E9").s().p("AgOkrIAcAeIAAIaIgcAfg");
	this.shape_3.setTransform(1.5,30);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#95B8DB").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_4.setTransform(30,30);

	this.addChild(this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


(lib.bloco_amarelo = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#DBBB37").s().p("AkrAPIAegdIIaAAIAfAdg");
	this.shape.setTransform(30,58.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#E9C73A").s().p("AgOENIAAoaIAdgeIAAJXg");
	this.shape_1.setTransform(58.5,30);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFEBA1").s().p("AkNAOIgegcIJXAAIgfAcg");
	this.shape_2.setTransform(30,1.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFE57E").s().p("AjjkrIAeAeIAAIaIgeAfgAisjvIGQAAImQGdg");
	this.shape_3.setTransform(22.9,30);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFD940").s().p("AkNENIAAoaIIaAAIAAIagAj0CuIGRmdImRAAg");
	this.shape_4.setTransform(30,30);

	this.addChild(this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


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


(lib.tempo_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// capa
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D2AB4B").s().p("Ak2BAIAAgmIABgmIgDgkIgcAUQgBABAAAAQAAAAgBAAQAAAAAAAAQgBgBAAAAIACgIIACgLQAAgEAAgGIACgJIABAAIA/AHIABAdIADAnIACAoQABABAAAAQAAABAAAAQAAAAgBAAQAAABAAAAQAAAAAAAAQAAAAgBAAQAAABgBAAQAAAAgBAAQgGAEgMAEIgSAGIgCAAQAAAAgBAAQAAAAAAgBQAAAAAAgBQgBAAAAgBgAEPA8QgggJgUgfQgUgdACgmIABgDIAsgDQgFAIAAALQgBASAIAPQAJAPAPAEQAOAFALgIQAKgJAAgOQABgPgIgRQgGgKgHgGIAkgEIACAFQATAkAAAcQgCAggSAOQgNAKgQAAQgLAAgNgFgAjgAkIAAgnIgBgnIgBgMQAvAEAxACQABAAAAABQAAAAgBABQAAAAgBAAQAAABgBAAQgFABgEgBQgHAAgUAFIgLACQgFACgBACIAAAIIACAMQACADAMgBIAPgEIAQgEIAQgEQABAAABAAQAAAAAAABQAAAAABABQAAABgBABQABAFgCAOQAAANgCADQgBABAAAAQAAABgBAAQAAAAgBAAQAAABgBAAIgDAAIgsAIIgXAGIgYAGIgBAAQAAAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAgABrAPIgTgDQgOgBgFgCQgBAAAAAAQgBgBAAAAQgBgBAAAAQAAgBAAAAIAAgmIABgOQA/gBA7gCQgEAOgIAJQgPAQgZgGIgMgDIgNgDQgFAAABAEIAAAQIABAPQAAAAAAABQAAAAgBABQAAAAAAAAQAAAAgBAAIAAAAgAhpAMIAAgDIAAglIABgTIAmABIAAARQACAYgBAJQABAFgEgBQgRACgRADIgDgBgAgjAGIgPgjIgGgRIA0ABIgDAKIgPAoIgCADIgFAAIgCAAQgBAAAAAAQgBAAgBAAQAAgBAAAAQgBgBAAAAgAArAHQgTgCgSAAQgBAAAAAAQgBAAAAgBQAAAAgBgBQAAgBAAgBQAAgJABgZIAAgMIAMAAIAcAAIABAMIABAkQAAABAAABQgBAAAAABQAAAAgBAAQAAABgBAAIAAAAg");
	this.shape.setTransform(-0.1,-84.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DBB34E").s().p("AAXA4IgLAAIAAgXIgBgEQgBABgJAaIgyAAIgIgVIgBgBIgBADIABATIgngBIAAgUQAAgOgCgkIgCgdIAAgCQAAgCAFgBIARgDQAMAAAGgBQACgBABAGIAgBHQAEAJABgBQABAAAEgJQAMgWAQgzQABgFADABIAJAAIAJABIAIAAIAIgBQABAAAAAAQABABAAAAQABAAAAABQAAABAAAAIgBApIgBAoIAAAbIgcAAgABLAeQAAgjgCgqIAAgBQAAgBAAAAQAAgBAAAAQABAAAAAAQABgBABAAQAIgBAdAEIAgAFQAaAGAPAVQAOAUAAAcQgBALgDAJQg6ADhAABIABgagAB0gIQgBACAAAYIAAALIAAALQAAADASACQAXAFABgbQABgagYgEIgQgBIgCAAgAjbAvIgDglIgDgaIAAgBQAAgBABAAQAAgBAAAAQAAgBABAAQAAAAABgBIAXgHIAYgGIAXgGIAYgFQAGAAAAAEIACAQIADARQAAABAAAAQgBABAAAAQAAAAgBABQAAAAgBAAIgCAAQgcACgXAEQgFABgCADIAAAJQABAJACABQACACAFgBIAEgBQADAAACgBQANgDANgEIAHgBIAFgCQABAAAAAAQABAAAAABQABAAAAAAQAAABAAABIgCASQABAKgBAJQgygCgvgEgADpAAQAXgRAeAOQAbANARAfIgkAEQgFgEgGgDQgNgGgLAJIgGAHIgsADQACgiAWgRgAlJAkIABgBIArgbIAggRIAOgHIADAAIAAABQABAFgBAEIAAAHIACAJIABAIQAAAAAAABQAAAAgBABQAAAAAAAAQgBABgBAAIgeALIABALIhAgHg");
	this.shape_1.setTransform(-0.8,-94.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#80672C").s().p("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");
	this.shape_2.setTransform(0,-88.7);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["rgba(255,255,255,0.2)","rgba(0,0,0,0.2)"],[0,1],20.4,35.3,-20.2,-35.2).s().p("AkUEVQgYgXgSgZQhJhkAAiBIAAgDQACigBxhyQBDhDBTgbQA8gUBCAAQBrAABXAyQAsAaAnAmQBzB0AAChQAAAogHAlQgQBTgyBFQgSAZgYAXQhzBziiAAQihAAhzhzgAjhjhQhABCgUBTQgIAhgBAkIAAAHIAAAOQAFB7BYBYIAPAOQBaBRB4AAQB6AABZhRIAPgOQBYhYAFh7IAAgOIAAgHQgDiAhahaQg8g6hLgXQgrgMgwAAQiDAAheBdg");
	this.shape_3.setTransform(0,1.2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#D2AB4B").s().p("AFjI5Ig5hpIgBAAQg1Asg8AaQhhArhxAAQhzAAhggrQg8gag2gsIAAAAIg5BpQgmAfgpgSQgdgSgDgeIAAgLIAFgVIBKiBQgRgVgOgXQgUgggPgjQgRgngKgpIAcgmQAhgpAogmQACCKBVBqQAOARASASQB3B3CoAAQCmAAB4h3QARgSAPgSQA9hMAThfQAHgmAAgrQAAimh3h4QgkgjgngZQAvgOAygLIArgKIAPAPIABAAQCYCZAADVQAAAqgGAnQgSCDhSBoIgBACIBLCAQADALABAKIAAALQgCAegdASQgPAGgOAAQgaAAgYgTgAglBDQgEgEAAgHQAAgGAEgEIAAgBQAFgEAGAAQAHAAAEAEQAEAFAAAGQAAAHgEAEQgFAFgGAAQgGAAgFgFgAIvh1IjVjUQB7gYCDgHQA/B3hWBqQAFAKgGAGQgEAEgFAAQgEAAgEgCgApfmtQARgVAVgUQAZgYAXgUQAkgdAjgSQBkgzBaAvQi+BGiwBaIATgYg");
	this.shape_4.setTransform(2.7,-4.4);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#DBB34E").s().p("AoSDcQgBiaBNh3QAjgSAjgRQDThpDshCQAlgKAmgJQBqAfBXBMIALAKIgsAJQgxAMgwAOQheg7h1ABQhGgBg9AVQhWAchGBGQh3B2AACoIAAAJQgnAmgiApIgcAmQgNg9AAhBgAplArIgDgDIA2giIALgGIgtAtQgEACgEAAQgFAAgEgEgADkkrQB/gcCHgRQAVAQAVAWQAUAUASAVQATAWAOAWQAHAMAGAMQiDAIh7AYg");
	this.shape_5.setTransform(1.1,-20.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#C49F45").s().p("ApXDbQheh1BViDIAOgUQCvhaC+hGQATAJATAPIABgCQAKgFAIAHQAIAHgIAJIlrFpIgMAHIg1AhQgDgGAEgHgAlrAsIAagYQBfhSB1gdQA+gQBDAAQBOAABHAVQgmAJglALQjrBCjUBmQgjARgiATQAfgyAsgsgAJJhJQgRgVgVgUQgVgVgUgRQiHARiAAcIg9g+QgIgJAIgHQAIgHALAHQBqhSB5A+QAjASAkAdQgJgRAHgHQAHgIAPALIAMAMQBQhOAdAiQAPAQgKAbQgKAcgkAmIAKAKQAJARgKAEQgDACgFAAQgGAAgJgEgApWhHQgKgEAJgRIAKgKQhIhMAeghQAegiBQBOIAMgMQAPgLAHAIQAHAHgJARQgYAUgYAYQgVAUgRAVQgJAEgGAAQgFAAgDgCg");
	this.shape_6.setTransform(-0.4,-40);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#80672C").s().p("AFpJUIgFgEIgphMQgrAeguAVQhoAth6AAQh4AAhngtIAAAAQgugVgrgeIgpBMIgFAEQg4Atg7gbIgDgBIgCgBQgsgdgDguIgBgBIAAgPIABAAIAAgBQABgOAEgOIABgEIBChwQgRgXgOgYQgSgggOgjQgOgigIgkIgBgCIgIgoQgEgcgCgdIgBglIABgjIACgYQAHhCAVg7IgpApIgFACQgiAQgXgZIgDgDIgGgJIAAgBIgBgCQgEgIAAgKQhfiCBeiTIAFgHQgGgKAAgMQgBgKAGgNQhKhYAzguIAAAAQAcglA1AVQAMAFAOAJIAeAWIAUATIAegVQARgMASgIQB1g8BpA3QAOAHANAKQASgCASAOIABABQARAPgBASQABAPgNARIgjAjQAXgIAXgGQA/gQBHgBIADAAQBUAABLAXIAYAHIgigiQgOgRACgPQgBgSARgPIABgBQARgOATACQANgKAOgHQBpg3B1A8IAAAAQARAIASAMIAeAVIAUgTQAggbAXgJQA2gVAcAlIAAAAQAzAuhKBYQAGANgCAKQAAAMgFAKIAFAHQBeCThfCCQAAAKgEAIIgCADIgFAJIgDADQgXAZgigQIgFgCIgmgmQAdBVAABgQAAAsgGAqQgSCBhMBpIBCBwIABAEQAEAOABAOIAAADIAAALIAAADQgDAugsAdIgCABIgDABQgWAKgWAAQgkAAgjgcgAF/I5QAmAfApgSQAdgSACgeIAAgLQgBgKgDgLIhLiAIABgCQBShoASiDQAGgnAAgqQAAjViYiZIgBAAIgPgPIgKgJQhXhNhqgfQhHgVhPAAQhDAAg+AQQh1AdheBUIgaAYQgsAsggAyQhNB5AACXQAABCAOA8QAKApARAnQAPAjAUAgQAOAXARAVIhKCBIgFAVIAAALQADAeAdASQApASAmgfIA5hpIAAAAQA2AsA8AaQBgArBxAAQBzAABhgrQA8gaA1gsIABAAgACyodQgIAHAIAJIA+A+ICGCGIDVDUQAKAFAHgHQAGgGgFgKQBWhqg/h3QgGgNgIgMQgOgWgSgWQAOAGAJgEQAJgEgJgRIgKgKQAlgmAKgcQAKgbgPgQQgegihQBOIgMgMQgPgLgHAIQgHAHAJARQgjgdgjgSQh5g+hqBSQgFgDgFAAQgFAAgFADgApWmVIgOAUQhVCFBfB1QgEAHACAGIADADQAHAHAKgFIAtgtIFslrQAIgJgJgHQgIgHgJAFIgCACQgSgPgTgJQhagvhkAzQgjASgkAdQAJgRgHgHQgHgIgOALIgMAMQhQhOgeAiQgeAhBIBMIgKAKQgKARAKAEQAJAEAOgGIgTAYgAkdFYQgSgSgOgRQhVhqgCiKIAAgJQAAimB3h4QBFhFBXgdQA9gUBEAAQB3AABeA6QAnAZAkAjQB3B4AACmQAAArgHAmQgTBfg9BMQgPASgRASQh4B3ioAAQimAAh3h3gAh9k7QhTAchEBDQhwBxgCCeIAAAFQAACCBJBjQASAaAXAXQB0BzCgAAQCjAABzhzQAXgYATgZQAyhEAQhTQAHglAAgpQAAighzh0QgngmgsgaQhXgyhsAAQhCAAg7ATgAgTBNQgIgJAAgMQAAgMAIgIQAJgJAKAAQAMAAAJAJQAIAIAAAMQAAAMgIAJIAAAAQgJAJgMAAQgKAAgJgJgAgJAtIAAABQgEAEAAAGQAAAHAEAEQAFAFAEAAQAGAAAFgFQAEgEAAgHQAAgGgEgFQgEgEgHAAQgEAAgFAEg");
	this.shape_7.setTransform(0,-4.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(288));

	// metade 
	this.instance = new lib.roda_mc();
	this.instance.setTransform(0,0,1,1,0,180,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},144).wait(144));

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AnFOQIgBAAIgBAAIAA8fIABAAIABAAIAAAAQA8AAA5AIQA9AHA6APQA5AOA3AXQA3AWAzAgQAyAdAwAlQAvAlArArIAAABQAqArAlAtQAmAwAeA0QAeAzAXA3QAXA3APA7QAPA5AHA7QAHA7AAA8IAAAAQAAA8gHA6QgHA8gPA6QgPA6gWA3QgYA3geA0QgeAzglAvQglAvgrAsQgrAqguAkQgwAng0AeQgxAeg3AXQg3AXg6APQg5APg8AHQg6AHg9AAg");
	var mask_graphics_144 = new cjs.Graphics().p("AHHOQQg9AAg7gHQg8gHg5gPQg6gPg3gXQg3gXgygeQgzgegwgnQgugkgrgqQgrgsglgvQglgvgegzQgeg0gYg3QgWg3gPg6QgPg6gHg8QgHg6AAg8IAAAAQAAg8AHg7QAHg7APg5QAPg7AXg3QAXg3AegzQAeg0AmgwQAlgtAqgrIAAgBQArgrAvglQAwglAygdQAzggA3gWQA3gXA5gOQA6gPA9gHQA6gIA8AAIABAAIAAcfg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:45.6,y:0}).wait(144).to({graphics:mask_graphics_144,x:-45.5,y:0}).wait(144));

	// fluxo
	this.instance_1 = new lib.roda_mc();
	this.instance_1.setTransform(0,0,1,1,0,0,180);

	this.instance_1.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({skewX:178.6,skewY:358.7},143).wait(1).to({skewX:0,skewY:360,x:0.7},0).to({rotation:180,x:0},143).wait(1));

	// fundo
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("rgba(0,0,0,0.502)").s().p("AkVEVQgXgXgRgaQhKhjAAiBIAAgEQACigBwhwQBEhEBUgcQA6gTBDAAQBrAABXAyQAsAaAnAnQBzBzAAChQAAApgHAkQgQBTgyBEQgSAZgYAYQhzBziiAAQihAAh0hzg");
	this.shape_8.setTransform(0,-8.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8}]}).wait(288));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-69,-101.6,137.9,159.7);


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


(lib.jogo_mc = function() {
	this.initialize();

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,255,0,0)").s().p("A4+Y/IAAqJIqKAAIAA9qIKKAAIAAqKMAx9AAAIAAKKIKLAAIAAdqIqLAAIAAKJg");
	this.shape.setTransform(230,165);

	// Camada 2
	this.instance = new lib.fundoJogo();
	this.instance.setTransform(230.7,165.1);

	this.addChild(this.instance,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(5,5,450.2,320.1);


(lib.Tween5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Tween8("synched",0);
	this.instance.setTransform(-2.3,-8.4,1,1,0,0,0,0.1,1.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:180},10).to({scaleX:1,scaleY:1,rotation:349.1},10).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-23,-30.9,41.1,41.7);


(lib.fundoJogo_mc = function() {
	this.initialize();

	// Camada 3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F1ECF5").s().p("A6ObaIhQAAIgCgBIgeAAIhkAAInZABIgtAAIAAqKIACAAMAAAgieQACAAgCgzIAAhQIAAoHMBBEAAAIAAgBIADABIJWgBIAxAAMAABArZIAABQQgBAAAAAAQAAAAAAAAQAAABAAAAQAAABAAAAIAAKIg");
	this.shape.setTransform(-7,-17.3);

	// Camada 2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(0,0,0,0.2)").s().p("EgmGgaYMBMNgEOMgBQA8lMhKpAAog");
	this.shape_1.setTransform(-2.9,-15.9);

	// Camada 4
	this.instance = new lib.madeirinha_mc("single",2);
	this.instance.setTransform(-20,-3.7);

	this.instance_1 = new lib.madeirinha_mc("single",1);
	this.instance_1.setTransform(-16.1,129.6);

	this.instance_2 = new lib.madeirinha_mc("single",0);
	this.instance_2.setTransform(-6.4,-150.3);

	// Camada 5
	this.instance_3 = new lib.cordaGomo_gr("synched",0);
	this.instance_3.setTransform(-294.3,-144.5,1,1,0,-59,120.9,0.6,-14.2);

	this.instance_4 = new lib.cordaGomo_gr("synched",0);
	this.instance_4.setTransform(-318.6,-149.5,1,1,0,-59,120.9,0.6,-14.2);

	this.instance_5 = new lib.cordaGomo_gr("synched",0);
	this.instance_5.setTransform(-342.1,-157.4,1,1,0,-54.8,125.1,0.6,-14.2);

	this.instance_6 = new lib.cordaGomo_gr("synched",0);
	this.instance_6.setTransform(-365.6,-170,1,1,0,-47.4,132.5,0.6,-14.2);

	this.instance_7 = new lib.cordaGomo_gr("synched",0);
	this.instance_7.setTransform(-387.6,-181.9,1,1,0,-49.4,130.5,0.7,-14.1);

	this.instance_8 = new lib.cordaGomo_gr("synched",0);
	this.instance_8.setTransform(-408.1,-196.4,1,1,0,-42.9,137,0.7,-14.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#987E41").s().p("AgTAAQAJgBAIgFQANgKAIgOQgFAmgaATIgHAEg");
	this.shape_2.setTransform(-407,-188.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#C4A354").s().p("AgThRQAGABAFADQAYAyAEAvQAAARgBANQgJAPgNAJQgHAFgJADg");
	this.shape_3.setTransform(-406.9,-197.1);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F0C867").s().p("AgEAFIAAgNIAJARQgFgCgEgCg");
	this.shape_4.setTransform(-408.4,-205.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#987E41").s().p("AgcAXQgdgTgFgmQAJAOAOAKQAnAXA0gVIAJgEIABgBIABAAIAAAiIgBABIgBAAQgcANgYAAQgUAAgRgMg");
	this.shape_5.setTransform(384.7,-240.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#F0C867").s().p("AAVB6IgBAAQAJgMgDgkIgBgNQgGg0gVgNIgIgFQgTgJgSAJQAFgKAGgKIAHgKQAgg1ArgcIABgBIABgBIAADYIgBABIgBABIgXAbIgCgBg");
	this.shape_6.setTransform(386.1,-256.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#C4A354").s().p("AgmBIQgOgJgJgPQgCgNABgRQADgvAbgyQASgKARAKIAIAEQAXAPAGA1IABALQADAkgJALIABABIACAAIAXgaIABgBIACgCIAAAuIgCABIgBAAIgJAEQgaALgWAAQgWAAgUgNg");
	this.shape_7.setTransform(384.6,-249.4);

	this.instance_9 = new lib.cordaGomo_gr("synched",0);
	this.instance_9.setTransform(267.7,-197,1,1,59.1,0,0,0.6,-14.2);

	this.instance_10 = new lib.cordaGomo_gr("synched",0);
	this.instance_10.setTransform(292,-202,1,1,59.1,0,0,0.6,-14.2);

	this.instance_11 = new lib.cordaGomo_gr("synched",0);
	this.instance_11.setTransform(315.5,-209.9,1,1,54.9,0,0,0.6,-14.2);

	this.instance_12 = new lib.cordaGomo_gr("synched",0);
	this.instance_12.setTransform(339,-222.5,1,1,47.5,0,0,0.6,-14.2);

	this.instance_13 = new lib.cordaGomo_gr("synched",0);
	this.instance_13.setTransform(361,-234.4,1,1,49.5,0,0,0.7,-14.1);

	this.instance_14 = new lib.cordaGomo_gr("synched",0);
	this.instance_14.setTransform(381.5,-248.9,1,1,43,0,0,0.7,-14.1);

	// Camada 6
	this.instance_15 = new lib.fundo();
	this.instance_15.setTransform(-408.9,-317.9);

	this.addChild(this.instance_15,this.instance_14,this.instance_13,this.instance_12,this.instance_11,this.instance_10,this.instance_9,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.instance_8,this.instance_7,this.instance_6,this.instance_5,this.instance_4,this.instance_3,this.instance_2,this.instance_1,this.instance,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-419,-317.9,811.5,600);


(lib.fechar = function() {
	this.initialize();

	// Layer 1
	this.instance = new lib.xis();
	this.instance.shadow = new cjs.Shadow("rgba(0,0,0,0.447)",4,4,8);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-11.6,-11.9,23.4,24);


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


(lib.caixa_mc = function() {
	this.initialize();

	// Camada 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape.setTransform(-350.9,258.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_1.setTransform(-351.7,256.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_2.setTransform(-351,256.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAAAAAQgBAAAAAAQAAAAAAABQAAAAAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_3.setTransform(-351.3,258.5);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_4.setTransform(-350.3,-256.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_5.setTransform(-351,-258.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAAAAAQgBAAAAAAQAAAAAAABQAAAAAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_6.setTransform(-350.7,-257.1);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_7.setTransform(-350.4,-258.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_8.setTransform(352.4,256.6);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_9.setTransform(353.1,258.7);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_10.setTransform(353,256.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAgBAAQAAAAAAAAQAAAAAAAAQAAABAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_11.setTransform(352.7,258.3);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#FBD888").s().p("AgtCIIgIgEIAAgCIAAgBIABgCIABgCIACgCIAEgBIABAAQATgEAQADQAJACAGAEIAIAEIAAABIgIAEQgLAGgOAAQgNAAgNgGgAh5BXQgGgdARgUIABgBIACAKQADARgEAVIgBACIgDADIgCABQgEAAgDgEgAg4BVIgCgBQAAgBAAAAQAAAAAAgBQAAAAAAgBQAAgBAAAAIAAgCIADgEQAKgEAGgJIAHgDIAAAAQACAEgBAEQgBALgUAIIgCABIgCgBgAiZBKQgHg7AcgtIAAAAIABAHQAAAtgLA0IgBACIgCABIgCABQgDAAgDgEgACCAoIgBgCQAGgmAIgoIACgEQgBgHAFgBIABgBIAFAOIAAABQgBAbgGAYIAAAAIAAACIAAAAIgEAEQgDAOgHAKIgCAHIgCABQACgGgCgFgAggADIgBgBIgFgJIgPgiQABgEADgCIAFgBIACABQAKAIAJAKQANANAKAQQAEAKAFAMIABACIgBAEIgBAEIgFAAQgUAAgPgdgAgJgnIAAAAIgBABIABgBgAhShYIgHgFIAAgBIAAgEIgBAAIgHgFIgCAAQgEgHgBgGIAAgBQgBgEABgFIACgBQATAMAHAVIAAACIAAABIAAADIgEABIgCgBgAgIh4IgLgGIgJgGIAAgBQABgFAFgCIADgBQAcAEAZAQIABABIAAABQgBADgDABIgCABIAAAAIgDAAQgTAAgPgGg");
	this.shape_12.setTransform(353,-259);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#E49E49").s().p("AAyCCQhNAMhMgSQAXgGAbgCQAbALAagMIAEAAQAPACAPgCIAFABIgGgOIABAAIAPAGIADABIAIAIIACAAIACgBIAAACIgBABQAHAFAKADIABAEIABADQAFAEADAGQABADgBACQgZgEgPgPgAicCLQgDgQAEgQIACgEQADAJgCARQALgogBgwIgBgGQADhKAYhKIAAgBIAEgMIABgCIABAAIABAAIAAACIAAAAIABABIACABIABABIABACIAAAAIgBAEIAAABIgBAEIgBACIgCAHIgFAYQgYBmgHBrIAAAAIAAAEQgDAEgFABIgDAAgABkBoQACgLAKgGIgEgEIgBgCIgBgFIgBgEQAHgPAQgIQAJgRgBgUIAAgCQABgJADgEIAAgBIABgBQADgHAEgGIABAAQAGAEgBAIIAAACQgBAjgLAhIAAADIAFgGIACgCQAAgEACgDIADgBQAFACgBAGIgBACQgPArgiAAIgIAAgAAMAaQgBgDAFgBQApAhAXAuIABABIgHgDQgEABgCADIgBABQgmgigRgsgAAeBgIgBgEQgdgdgVghIgBgCIgCgHIAAgCIAHAFIADgBIAAAAQAaAZAUAhIABABIAAAEIAAAEIACAGIAAADIgCAAQgDAAAAgDgAhBA/IACACQAAAAABAAQAAAAABAAQAAAAABAAQAAAAAAAAQAUgIACgMIAKgFQACAEgCAFIAAACQgdAlgnAGQANgRASgOgAhRgqIgXguIAAgFIAFAGIAFAJIgBgOIABgBIABgBIADgBIAEgBIAEgBQATAMALAQIgEACQgDACgBADIAOAiQgTgGgMgZIgJgPIgFgCQAcAlASAqIABACQgVgPgQgggAApgaIAAgEQAegtAbguQABgBAAAAQAAgBABAAQAAAAAAAAQABgBAAAAQAGACABAHIAAACIgIAUQgIAQgKAOQgRAXgXASIgBgEgAgyhDQgKgOgIgQQgBgDABgEQACgDADgBIABgBIAFgBIABABQAbAOAMAdIABACIgBAEIgBACQgCAEgDACIgBABQgDABgDAAQgJgKgLgHgAiQiKIABgBIABgBIADAEIABABQAGANgEAUIgHAFIgCANIgFAEQgJgcAPgegAg7iOIABgDIAEgCIACgBIAlAHQAPAHAVAAIABAAQAfAEAgADIACABQgaAGgZAAQgwAAgvgWg");
	this.shape_13.setTransform(353.8,-256.9);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#EEB659").s().p("ABDB/IgBgCIACgCIABgBQACgDAEgBIAHADQAMAGAIAMIAAABIgCAEQgCACgDAAQgUgDgIgQgAimAeQANguAJgxIACgNIAHgFIADgEIABAAIgBADIgBACIABAEIAAACIgGA0IAAgIIgBABQgcAtAIA7QADAEAEgBIgJA/IgBACQgUgzAQg8gAgQB4IAPgDIAEACIADABIgGAFQgHgEgJgBgAiGBxIAAgCQgKguAWgqIADgCIADABIADACIAAAVIgDgJIAAAAQgSAUAHAeQAEAEAEgBIgGAXIgCAEIgCAAQgDAAgCgDgAA/A2IACgBQAGAEAFAFQAPAOAAAVIAAABIAAABQgjgMAHghgAhHBGIgBgEIAGgNIABgDQAIgHAJgCQAFABACAEIABACQgCAHgDAFQgGAJgKADIgHACIgDgEgAAbAsIgrg+IgGgHIAAgIQADgCACgEIACgBQAiAiAcApIABABIgCAGIgBACQgFADgEAAQgFAAgEgDgAgXAmQgRgOgCgWQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAABAAIABABQARAfAXgDIACgEIAAgDIAAgCQgDgMgGgJQALAOAIAUIAAABQgMAFgIgGIgBAGIgFACIAAAAIgDABIgHgFgABuARQgCg7ARg4IACgBQAIADACAJIAAACQABA2gPAxQAAAAgBABQAAAAAAAAQgBABAAAAQAAABgBAAIgDABQgFAAgCgFgACXgWIgDg+IAAgFQACgGAHgBIAEACIADABQANAfgDAjIgCAFIgHAIIgCACQgGgDgGgHgAAWgmIADgEIgBgCIAAgEIAEgIQAOgYAUgSIAFgEIAAAAIAIACIABABQgJAegWAaIgDAEIgJADIgEADIgFAAQgDgCABgDgAishEQACgSAKgKIADAIIABABQgDAXgGAWIgBACQgJgHADgVgAhehLIgBgOIAGANIgDABIgBABIgBgBgAhThaIABgDQAHAIAFAJIgNgOgAhkiBIgCgCQABgEAEgCIAEgBQAYALAKAYIABACQAEACABADIABAEIgCABIgBABIgBgBIgFABIgBABQgRgVgVgTgAhhhkIABABIABADIgCgEgAhshrIAAAAIABABgAAch5IAAAAIAAgBQgZgQgdgEIgDABQgFACgBAEIABACIAIAFIgogFQgBAAAAAAQAAAAAAAAQAAgBgBAAQAAAAAAgBQANgHASgBIAOgCQA/gBA5AbIABABIAAACIgCAEIgBACQgggGgjgFgAhyh4IAEACIAAABIgEgDg");
	this.shape_14.setTransform(353.7,-258.8);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#C9881D").s().p("ABkClQgggCgYgVQhKAOhPgNIgCgCIgCgFQgBgEABgEQAQgPAWgEQAegHAegDQAMgBALABIgagoQghAagnATQgHAEgIgDIgCAIQgFAHgEAHIgBADIgBACQgHAFgJAAIgGgDIgBAAIAAgBQAHhrAYhmIAFgXIACgHIABgCIABgEIAAgCIABgDIAAgBIgBgCIAHAFIACAEIAAABIAHAFIACABIADgBIANAOQgFgJgHgIIAAgBIAAgCQgHgVgTgMIgCABQgBAFABAEIgEgCIAEADQABAGAEAHIgCgBIgBgCIAAgBIgBgBIgBABIgBACIgEAMIAAABQgYBKgDBJIABAGQABAwgLApQACgRgDgJIgCADQgEAQADAQIADAAIgJADIgDAAIgOgIIgCgCQgHgpgBgqIgBABQgHiCAlg3QAFgEAFAAIAAgBIADABIAEABIgBABQgPAdAJAdIAFgEQgJAwgNAuQgQA9AUAzIABgCIAJhAIACgBIABgCQALg0AAgtIAGgzIAAgCIgBgEIABgCIABgEIgBABIgDAEQAEgVgGgNIAFgBIgCgDQAbgeAxACQAnACAkgCQA1AJAuAVQAHABAGAGIACACQA5gGgEA6QgDBDgPA+QgEAQgHAOQANAagjgCQgMAJgRAFIAFAbQACAOgNAAIgBAAgABeCZQABgDgBgDQgDgFgFgEIgBgEIgBgEQgKgCgHgFIABgCIAAgBIgCAAIgCAAIgIgIIgDgBIgPgGIgBABIAGANIgFgBQgPACgPgBIgFAAIAHgEIAAgBIgIgEIAHgFIgDgCIgGgBIgNACQgQgDgTAEIAAAAIgEABIgDACIgBACIgBACIAAABIAAACIAIAEQgbACgXAGQBMATBNgNQAPAQAZAEgAAQAdQARAtAmAiIgCACIABABQAIAQAUAEQADAAACgDIACgDIAAgCQgIgMgMgFIgBgCQgXgtgpghQgFAAABADgACMANIAAACQABAUgJASQgQAHgHAPIABAEIABAGIABACIAEADQgKAGgCALQAoAGARgwIABgCQABgHgFgCIgDACQgCACAAAEIgCACIgFAGIAAgDQALghABgiIAAgCQABgIgGgFIgBABQgEAFgDAHIAAAAQAGgaABgbIgBgBIgFgOIgBABQgFABACAHIgCAEQgJAogFAmIAAACQACAFgCAGIACgBIACgHQAIgKACgOIAEgCQgDAFgBAIgAgngLQACAUARAOIAAACIACAHIABABQAVAiAdAcIABAEQAAAFAFgBIAAgEIgCgGIAAgDIAAgEIgBgCQgUghgagYIAFgDIABgGQAIAGAMgEIAAgCQgIgSgLgPQgKgSgNgNQADAAADgCIABAAIAAAHIAGAIIArA9QAJAHAJgHIABgBIACgGIgBgCQgcgpgigiIgBAAIABgEIgBgCQgMgegbgOIABAAIACgCIgBgDQgBgEgEgBIgBgCQgKgYgYgLIgEABQgEACgBADIACACQAVATARAVQgDACgCADQgBADABAEQAIAPAKAOIgCgBQgLgQgTgMIgEAAIgEACIgGgNIABAOIABAAIgBABIABAPIgFgJIgFgGIAAAEIAXAvQAQAgAVAOIgBgBQgSgqgcgmIAFACIAJAQQAMAZATAGIAFALIABABIgBAAIgBAAQAAAAAAAAQgBAAAAAAQAAAAAAAAQAAABAAAAgAh3AIQgWAqAKAuIAAACQADAEAEgCIACgEIAGgXIAEgDIAAgCQAFgVgDgRIAAgWIgDgBIgDgCIgDADgAg+A9IAAACQAAABAAAAQAAABAAAAQAAABABAAQAAABAAAAQgSANgNASQAngGAdglIAAgCQACgGgCgEIgKAGQAAgEgBgEIgBAAIgGADQADgFACgHIgBgCQgCgEgFgBQgJADgIAGIgBAEIgGANIABADIADAEIAHgBIgEAEgABiBdQABgqAEgrQAEgwgDgyIAIgUIAAgCQgBgGgGgCQAAAAAAAAQgBABAAAAQgBAAAAABQAAAAgBAAQgbAvgeAtIAAADIABAEQAXgSARgXQgMAbgYAYIgEAEQATAYAOAbQgFgFgGgDIgCABQgHAhAjALIAAgBIAAAAIAEALgAhoBSIA4hBIglgxQgJgMgGgMIgECKgACAhyQgRA4ACA8QADAGAHgCQABAAAAgBQABAAAAgBQAAAAABgBQAAAAAAgBQAPgwgBg2IAAgCQgCgJgIgEIgCABgACXhpIAAAGIADA+QAGAGAGADIACgBIAHgIIACgGQADgigNgfIgDgCIgEgBQgHAAgCAGgAAbg/IAAADIABACIgDAEQgBAEADACIAFgBIAEgCIAJgEIADgDQAWgbAJgeIgBgBIgIgCIAAABIgFAEQgqACgqgDIgIAAQAZAXAOAkIABADIASgTIgEAIgAiphTQgDAUAJAIIABgCQAGgWADgXIgBgCIgDgHQgKAKgCASgAgyiQIgEACIgBAEQBEAgBOgQIgCgBQgggDgfgFIABgBQADgBABgDQAjAEAgAGIABgCIACgEIAAgBIgBgCQg5gbg/ACIgOACQgSABgNAHQABAAAAABQAAAAAAAAQAAABAAAAQABAAAAAAIAoAFIAMAGIglgIIgCABg");
	this.shape_15.setTransform(353.4,-257.3);

	this.instance = new lib.t_madeira2();
	this.instance.setTransform(352.7,0.1,1,1.181,0,0,0,0,232.1);

	this.instance_1 = new lib.t_madeira2();
	this.instance_1.setTransform(-351.2,0.1,1,1.181,0,0,0,0,232.1);

	this.instance_2 = new lib.t_madeira1();
	this.instance_2.setTransform(0.6,258.3,1,1,0,0,0,0,7);

	this.instance_3 = new lib.t_madeira1();
	this.instance_3.setTransform(0.6,-257.6,1,1,0,0,0,0,7);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.lf(["#FFFFFF","rgba(255,255,255,0.863)"],[0,1],-192.5,241.9,327.8,-351.9).s().p("Eg3hAoYMAAAhQwMBvDAAAMAAABQwg");
	this.shape_16.setTransform(5,-0.2);

	this.addChild(this.shape_16,this.instance_3,this.instance_2,this.instance_1,this.instance,this.shape_15,this.shape_14,this.shape_13,this.shape_12,this.shape_11,this.shape_10,this.shape_9,this.shape_8,this.shape_7,this.shape_6,this.shape_5,this.shape_4,this.shape_3,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-380.3,-277.5,760.9,555.2);


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


(lib.caiVerde_mc = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.bloco_verde();
	this.instance.setTransform(-19,0,0.6,0.6,0,0,0,30,30);

	this.instance_1 = new lib.bloco_verde();
	this.instance_1.setTransform(19.2,0,0.6,0.6,0,0,0,30,30);

	this.addChild(this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-37,-17.9,74.3,36);


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


(lib.blocoGrupo01_mc = function() {
	this.initialize();

	// Camada 1
	this.instance = new lib.bloco_verde();
	this.instance.setTransform(20.4,-38.4,0.6,0.6,0,0,0,30,30);

	this.instance_1 = new lib.bloco_verde();
	this.instance_1.setTransform(-19.2,-38.4,0.6,0.6,0,0,0,30,30);

	this.instance_2 = new lib.bloco_verde();
	this.instance_2.setTransform(-58.8,-38.4,0.6,0.6,0,0,0,30,30);

	this.instance_3 = new lib.bloco_verde();
	this.instance_3.setTransform(20.4,38.5,0.6,0.6,0,0,0,30,30);

	this.instance_4 = new lib.bloco_verde();
	this.instance_4.setTransform(58.9,-0.4,0.6,0.6,0,0,0,30,30);

	this.addChild(this.instance_4,this.instance_3,this.instance_2,this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-76.8,-56.5,153.8,113.1);


(lib.Bloco = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{_nivel1:0,_nivel2:1});

	// Layer 3
	this.destaque_mc = new lib.destaque_mc();
	this.destaque_mc.setTransform(30,30,1,1,0,0,0,30,30);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.destaque_mc}]}).wait(2));

	// Layer 1
	this.instance = new lib.nivel1_mc();
	this.instance.setTransform(22.5,22.5,1,1,0,0,0,22.5,22.5);

	this.instance_1 = new lib.nivel2_mc();
	this.instance_1.setTransform(22.5,22.5,1,1,0,0,0,22.5,22.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,60,60);


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


(lib.instrucoesAnime_mc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// texto
	this.instance = new lib.titulo();
	this.instance.setTransform(-160.8,-166.7,1.243,1.243);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).wait(175));

	// Camada 4 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_19 = new cjs.Graphics().p("Ag0APQAAg5A0gFQAVgDAPAKQARAKAAARQAAAJgVAYQgYAdgPAAQgtAAAAgig");
	var mask_graphics_20 = new cjs.Graphics().p("AgNBEQgwAAgYgaQgJAFgHAAQgtAAAAgiQAAg5A2gGIAMAAQAHgGAJgFQAjgSAyAHQAzAHAjAbQAoAeAAAmQAAAPgPANQgRARghAAQhTgHgMAAg");
	var mask_graphics_21 = new cjs.Graphics().p("AiDBEQgwAAgYgaQgIAFgIAAQgtAAAAgiQAAg5A2gGIANAAQAHgGAIgFQAjgSA0AHQAxAGAjAaQAJgFAJgDQApgNBAAEQA7AFAuAQQAwARAAASQAAAZg1AUQg5AVhWAAQghAAgYgFQgPAPgfAAQhVgHgMAAg");
	var mask_graphics_22 = new cjs.Graphics().p("AATA5QgpAIg2AAQgiAAgXgFQgSAPgeAAQhVgHgNAAQgwAAgXgaQgJAFgHAAQgtAAAAgiQAAg5A2gGIAMAAQAHgGAJgFQAjgSA0AHQAwAGAkAaQAIgFALgDQApgNBBAEQA4AFAvAQIACAAQA3gPBOgBQBUgBA6ARQBBASAAAdQAAAchQASQhSASh+AAQhKAAgfgSg");
	var mask_graphics_23 = new cjs.Graphics().p("AFVBJQgVgYgMgBQgpgCgWgNIgHACQhSASh9AAQhJAAgfgSQgrAIg2AAQghAAgYgFQgRAPgfAAQhVgHgMAAQgwAAgYgaQgIAFgIAAQgtAAAAggQAAg7A2gGIANAAQAHgGAIgFQAjgSA0AHQAxAGAjAaQAJgFALgDQApgNBAAEQA7AFAuAQIACAAQA2gPBNgBQBTgBA6AQQAjgRBMARQA1ALAtAXQAtAWAAANQAAAlgKAPQgXAjhLAAQgkAAgVgYg");
	var mask_graphics_24 = new cjs.Graphics().p("AGUBHQgRgegOgfQgVAFgeAAQgkAAgVgWQgWgYgLgBQgpgCgWgNIgHACQhSASh8AAQhKAAgfgSQgrAIg2AAQgiAAgXgFQgSAPgeAAQhVgHgNAAQgwAAgXgaQgJAFgHAAQgtAAAAgiQAAg7A2gGIAMAAQAHgGAJgFQAjgSA0AHQAwAHAkAZQAIgEALgEQApgNBBAEQA6AFAvAQIACABQA3gQBMgBQBSgBA6AQQAkgQBMAQQA1ALAtAXQAsAWAAAPIgBATQASAMAWATQArAiAkAqQAjAqAAAOQAAATgMAUQgRAcgfAAQg5AAg9hsg");
	var mask_graphics_25 = new cjs.Graphics().p("AHjCwQgRgwgLgxQgvgPgzhYQgRgegOgfQgWAFgeAAQgkAAgUgYQgWgYgMgBQgogCgXgNIgHACQhSASh7AAQhKAAgggSQgqAIg2AAQgiAAgXgFQgSAPgfAAQhUgHgNAAQgwAAgYgaQgIAFgHAAQguAAABgiQAAg7A2gGIAMAAQAHgGAJgFQAigSA0AHQAxAHAkAZQAIgEALgEQApgNBBAEQA6AFAuAQIACABQA4gQBNgBQBRgBA6AQQAjgQBMAQQA2ALAsAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAnACAOIAHACQAjAPAZAiQAcAmAAAtQAAAYgZAxQgcA3gZAAQgiAAgjhkg");
	var mask_graphics_26 = new cjs.Graphics().p("AFPFEIgFgXQAAgUAggpQAWgeAZgYQAagXBDgLQgKgTgJgcQgRgvgLgyQgvgNgzhZQgRgfgOgfQgWAGgeAAQgkAAgUgYQgWgZgMAAQgogCgXgNIgHABQhSATh7AAQhKAAgggTQgqAJg2AAQgiAAgXgGQgSAQgfAAQhUgIgNAAQgwAAgYgaQgIAFgHAAQguAAABgiQAAg7A2gFIAMgBQAHgFAJgFQAigTA0AHQAxAHAkAaQAIgFALgEQApgNBBAFQA6AEAuAQIACABQA4gPBNgBQBRgBA6AQQAjgRBMAQQA2AMAsAWQAtAWAAAPIgBAUQASAMAWASQAqAkAkArQAiAoACAOIAHADQAjAPAZAiQAcAjAAAtQAAAZgZAwIgDAHQALAHAAAOQgBAPhZBKQhgBPgoAAQgnAAgNgWg");
	var mask_graphics_27 = new cjs.Graphics().p("ABmGSQgEgGAAgIIACgHQAAglA1gsQAugmBHggQAkgQAfgJQAHgQASgWQAWgeAZgYQAagYBDgLQgKgTgJgbQgRgugLgxQgvgPgzhaQgRgfgOgeQgWAFgeAAQgkAAgUgYQgWgYgMgBQgogCgXgNIgHACQhSASh7AAQhKAAgggSQgqAIg2AAQgiAAgXgFQgSAPgfAAQhUgHgNAAQgwAAgYgaQgIAFgHAAQguAAABgiQAAg7A2gGIAMAAQAHgGAJgFQAigSA0AHQAxAGAkAaQAIgFALgDQApgNBBAEQA6AFAuAQIACAAQA4gPBNgBQBRgBA6AQQAjgRBMARQA2ALAsAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAoACAOIAHADQAjAPAZAiQAcAmAAArQAAAYgZAxIgDAGQALAIAAANQgBAQhZBKQhWBGgpAIQhuCUhqAAQg/AAgPgSg");
	var mask_graphics_57 = new cjs.Graphics().p("AE1GSQgEgGAAgIIABgHQAAglA1gsQAugmBIggQAjgQAggJQAHgQARgWQAXgeAZgYQAagYBDgLQgKgTgJgbQgRgugLgxQgvgPgzhaQgSgfgNgeQgWAFgeAAQgkAAgVgYQgVgYgMgBQgogCgXgNIgHACQhSASh9AAQhKAAgggSQgoAIg3AAQghAAgXgFQgSAPgfAAQhVgHgMAAQgwAAgYgaQgIAFgIAAQgtAAAAgiQAAg7A2gGIANAAQAHgGAIgFQAjgSA0AHQAxAGAjAaQAJgFALgDQApgNBAAEQA5AFAuAQIACAAQA4gPBNgBQBTgBA6AQQAjgRBMARQA1ALAtAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAoACAOIAHADQAjAPAZAiQAbAmAAArQAAAYgYAxIgDAGQAKAIAAANQAAAQhaBKQhVBGgpAIQhuCUhrAAQg+AAgPgSgAtBBnQgEgMADgOQAAgaAVgWQAUgUAcgJQAdgGATAHQAWAJAAAdQAAAZgWAcQgbAkgtAAQgkAAgIgZg");
	var mask_graphics_58 = new cjs.Graphics().p("AFlGSQgEgGAAgIIABgHQAAglA1gsQAugmBIggQAjgQAfgJQAIgQARgWQAXgeAZgYQAZgYBDgLQgJgTgJgbQgRgugLgxQgwgPgyhaQgSgfgOgeQgVAFgeAAQgkAAgVgYQgVgYgMgBQgpgCgWgNIgHACQhSASh9AAQhLAAgfgSQgrAIg0AAQghAAgYgFQgRAPgfAAQhVgHgMAAQgwAAgYgaQgJAFgHAAQgtAAAAgiQAAg7A2gGIANAAQAHgGAIgFQAjgSA0AHQAxAGAjAaQAJgFALgDQApgNA+AEQA7AFAuAQIACAAQA3gPBOgBQBTgBA5AQQAkgRBMARQA1ALAtAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAoACAOIAHADQAjAPAZAiQAbAmAAArQAAAYgYAxIgEAGQALAIAAANQAAAQhaBKQhVBGgpAIQhuCUhrAAQg+AAgPgSgAtwDTQgFgLADgNQAAhDBSgdIAMgEIACgKQAAgaAVgWQAUgUAcgJQAdgGATAHQAWAJAAAdQAAAZgWAcQgUAageAHQgFAXgWAgQglA2gwAAQgnAAgKgXg");
	var mask_graphics_59 = new cjs.Graphics().p("AGnGSQgFgGAAgIIACgHQAAglA1gsQAugmBHggQAkgQAfgJQAIgQARgWQAXgeAZgYQAZgYBDgLQgJgTgKgbQgQgugLgxQgwgPgzhaQgRgfgOgeQgVAFgeAAQgkAAgVgYQgWgYgLgBQgpgCgWgNIgHACQhSASh+AAQhKAAgfgSQgrAIg2AAQgfAAgYgFQgSAPgeAAQhVgHgNAAQgwAAgXgaQgJAFgHAAQgtAAAAgiQAAg7A2gGIAMAAQAHgGAJgFQAjgSA0AHQAxAGAjAaQAIgFALgDQAngNBBAEQA6AFAvAQIACAAQA3gPBOgBQBSgBA6AQQAkgRBMARQA1ALAtAXQAsAWAAAPIAAATQARAMAWATQArAkAkAqQAhAoACAOIAHADQAkAPAYAiQAcAmAAArQAAAYgZAxIgDAGQALAIAAANQAAAQhaBKQhVBGgpAIQhvCUhqAAQg+AAgPgSgAuzFrQgDgKACgLQAAgtAbgqQAZglAlgWQAXgOAUgCQADg9BPgcIAMgEIABgKQAAgaAWgWQAUgUAcgJQAcgGAUAHQAVAJAAAdQAAAZgVAcQgUAageAHQgFAXgXAgQgkA2gxAAIgFAAQgFAUgkA2QgyBKgxAAQgdAAgHgTg");
	var mask_graphics_60 = new cjs.Graphics().p("AvpGvQgEgKACgMQAAg6BcgyIATgJQAFgiAVghQAZglAlgWQAXgOAUgCQADg9BPgcIAMgEIABgKQAAgaAWgVQAUgTAcgJQAcgIAUAJQAVAJAAAbQAAAZgVAcQgUAageAHQgFAXgXAgQgkA2gxAAIgFAAQgFAUgkA2QgrA/gqAJIgYAgQg2BEgpAAQgfAAgJgTgAHeF0QgFgGAAgIIACgHQAAglA1gsQAugmBHggQAkgQAfgJQAIgQARgWQAXgeAZgYQAZgYBDgLQgJgTgKgbQgQgugLgxQgwgPgzhaQgRgfgOgeQgVAFgeAAQgkAAgVgYQgWgYgLgBQgpgCgWgNIgHACQhSASh+AAQhKAAgfgSQgrAIg2AAQghAAgYgFQgSAPgcAAQhVgHgNAAQgwAAgXgaQgJAFgHAAQgtAAAAgiQAAg7A2gGIAMAAQAHgGAJgFQAjgSA0AHQAxAGAjAaQAGgFALgDQApgNBBAEQA6AFAvAQIACAAQA3gPBOgBQBSgBA6AQQAkgRBMARQA1ALAtAXQAsAWAAAPIAAATQARAMAWATQArAkAkAqQAhAoACAOIAHADQAkAPAYAiQAcAmAAAtQAAAYgZAvIgDAGQALAIAAANQAAAQhaBKQhVBGgpAIQhvCUhqAAQg+AAgPgSg");
	var mask_graphics_61 = new cjs.Graphics().p("AuhGvIgDgHIgKABQhJAAgcgsQgXgjAOggQgXgCAAgZQAAgPASgTQANgNAOgKQARgLAcATQAWAPAKAQQAWAWAdAjIAJALQAVgSAhgSIATgJQAFgiAVghQAZglAkgWQAYgOATgCQAEg9BOgcIAMgEIACgKQAAgaAVgVQAUgTAcgJQAdgIATAJQAWAJAAAbQAAAZgWAcQgUAageAHQgFAXgWAgQglA2gwAAIgGAAQgEAUglA2QgrA/gqAJIgXAgQg2BEgpAAQggAAgIgTgAIlF0QgEgGAAgIIABgHQAAglA1gsQAugmBIggQAjgQAggJQAHgQARgWQAXgeAZgYQAZgYBDgLQgJgTgJgbQgRgugLgxQgvgPgzhaQgSgfgNgeQgWAFgeAAQgkAAgVgYQgVgYgMgBQgpgCgWgNIgHACQhSASh9AAQhLAAgfgSQgrAIg2AAQghAAgYgFQgRAPgfAAQhTgHgMAAQgwAAgYgaQgIAFgIAAQgtAAAAgiQAAg7A2gGIANAAQAHgGAIgFQAjgSA0AHQAvAGAjAaQAJgFALgDQApgNBAAEQA7AFAuAQIACAAQA4gPBNgBQBTgBA6AQQAjgRBMARQA1ALAtAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAoACAOIAHADQAjAPAZAiQAbAmAAAtQAAAYgYAvIgEAGQALAIAAANQAAAQhaBKQhVBGgpAIQhuCUhrAAQg+AAgPgSg");
	var mask_graphics_62 = new cjs.Graphics().p("AthGvIgDgHIgKABQhJAAgcgsQgXgjAOggQgXgCAAgYQhRgLgfg7QgTglADgqQAAg6AggBQAbAAAsAnQAmAhAhAuQAMAQAIANQAKACAOAJQAWAPAKAQQAWAWAdAjIAJALQAVgSAhgSIATgJQAEgiAWghQAZglAkgWQAYgOATgCQAEg9BOgcIAMgEIACgKQAAgaAVgVQAUgTAcgJQAdgIATAJQAWAJAAAbQAAAZgWAcQgUAageAHQgFAXgWAgQglA2gwAAIgGAAQgEAUglA2QgrA/gqAJIgXAgQg2BEgpAAQggAAgIgTgAJlF0QgEgGAAgIIABgHQAAglA1gsQAugmBIggQAjgQAfgJQAIgQARgWQAXgeAZgYQAZgYBDgLQgJgTgJgbQgRgugLgxQgvgPgzhaQgSgfgOgeQgVAFgeAAQgkAAgVgYQgVgYgMgBQgpgCgWgNIgHACQhSASh9AAQhLAAgfgSQgrAIg2AAQghAAgYgFQgRAPgfAAQhVgHgMAAQguAAgYgaQgIAFgIAAQgtAAAAgiQAAg7A2gGIANAAQAHgGAIgFQAjgSAyAHQAxAGAjAaQAJgFALgDQApgNBAAEQA7AFAuAQIACAAQA3gPBOgBQBTgBA5AQQAkgRBMARQA1ALAtAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAoACAOIAHADQAjAPAZAiQAbAmAAAtQAAAYgYAvIgEAGQALAIAAANQAAAQhaBKQhVBGgpAIQhuCUhrAAQg+AAgPgSg");
	var mask_graphics_63 = new cjs.Graphics().p("AsnGvIgDgHIgKABQhJAAgcgsQgXgjAOggQgXgCAAgYQhRgLgfg7QgMgYgDgbQgMgEgKgIQgSgQgRAAQgmAAgPgvQgHgYAAgZQAAg7AagKQAXgIAjAeQAhAZAZAqIAKARQAaADApAkQAmAhAhAuQAMAQAIANQALACANAJQAWAPAKAQQAWAWAdAjIAJALQAVgSAhgSIATgJQAFgiAVghQAZglAkgWQAYgOATgCQAEg9BOgcIAMgEIACgKQAAgaAVgVQAUgTAcgJQAdgIATAJQAWAJAAAbQAAAZgWAcQgUAageAHQgFAXgWAgQglA2gwAAIgGAAQgEAUglA2QgrA/gqAJIgXAgQg2BEgpAAQggAAgIgTgAKfF0QgEgGAAgIIABgHQAAglA1gsQAugmBIggQAjgQAggJQAHgQARgWQAXgeAZgYQAZgYBDgLQgJgTgJgbQgRgugLgxQgvgPgzhaQgSgfgNgeQgWAFgeAAQgkAAgVgYQgVgYgMgBQgpgCgWgNIgHACQhSASh9AAQhLAAgfgSQgrAIg2AAQghAAgYgFQgRAPgfAAQhVgHgMAAQgwAAgXgaQgHAFgIAAQgtAAAAgiQAAg7A2gGIALAAQAHgGAIgFQAjgSA0AHQAxAGAjAaQAJgFALgDQApgNBAAEQA7AFAuAQIACAAQA4gPBNgBQBTgBA6AQQAjgRBMARQA1ALAtAXQAtAWAAAPIgBATQASAMAWATQAqAkAkAqQAiAoACAOIAHADQAjAPAZAiQAbAmAAAtQAAAYgYAvIgEAGQALAIAAANQAAAQhaBKQhVBGgpAIQhuCUhrAAQg+AAgPgSg");
	var mask_graphics_88 = new cjs.Graphics().p("Ah7A7IgOgkQAAg4ArgfQAlgbA5gBQA1gCAqATQArAUAAAdQhzB4hMAAQguAAgYgjg");
	var mask_graphics_89 = new cjs.Graphics().p("AgdA7IgOghQgnAbgbAAQg9AAgkgdQgZgUAAgMQAAgSApgSQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAjgbA7gBQA1gCApATQAsAUAAAdQhzB4hOAAQgsAAgYgjg");
	var mask_graphics_90 = new cjs.Graphics().p("AAPBeIgNghQgmAbgbAAQgnAAgdgMQgpAWgrAAQgsAAgNg3IgFg3QAAhBA8gmQAYgQARAFQASAFAAAbQAAAHgEAWQgFAWAAAGQAAAFAJAdIABAAIANgGQAmgRAzgIQA2gHAhAIIAMAEIAAAAQAlgbA7gBQA1gCAqATQArAUAAAbQhzB6hOAAQguAAgYgjg");
	var mask_graphics_91 = new cjs.Graphics().p("AAYC1IgNghQgmAcgbAAQgnAAgdgNQgpAXgrAAQgsAAgNg3IgFg5QAAgqAXgeQgMgSgLgmIgShRQAAghATgYQATgXAYAAQA/ABAACGQAAAOgJAbIADAAQASAFAAAcQAAAGgEAUQgFAWAAAGQAAAGAJAcIABABIANgHQAmgRAzgHQA0gIAjAJIAMADIAAAAQAlgaA7gCQA1gBAqATQArATAAAdQhzB6hOAAQguAAgYgjg");
	var mask_graphics_92 = new cjs.Graphics().p("ABIESIgOggQgoAbgYAAQgoAAgdgNQgpAXgrAAQgrAAgOg3IgFg5QAAgpAYgfQgMgUgLgmIgThPQAAgUAIgRQgjgSghhAIgjhaQAAgyAegGQAbgGAoAdQAnAeAbAvQAdAzABAyQAbAeAABXQAAAOgIAbIACAAQATAFAAAcQAAAGgFAWQgFAWAAAGQAAAGAKAcIAAABIANgHQAngRAxgHQA2gIAjAJIAMAEIAAgBQAlgaA6gCQA2gBApATQAsAUAAAcQhzB6hOAAQgvAAgXgjgAjHiEQAAgIgEgLQgEgIgEgFIAAAAQgBADgGAEQgFAFAAAIQAAAIAPAMIAHAAQACAFAAgNg");
	var mask_graphics_93 = new cjs.Graphics().p("ACpF1IgOghQgnAbgbAAQgoAAgdgMQgmAWgrAAQgsAAgNg3IgGg5QABgpAXgeQgMgVgLgmIgThQQABgVAHgQQgjgSghg/IgihZIAAgCQgJAEgOAAQgjAAgfgrQgggrgWAAQgGAAgYg+IgWg9QAAhsCSCLQAzAwAxA8IANAQQAPAGARANQAnAdAbAvQAdA0ABAxQAbAcABBaQAAAOgJAaIACABQATAFAAAbQAAAHgEAWQgFAWgBAGQAAAFAKAdIAAAAIAMgGQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA7gBQA1gCApATQAsAUAAAdQhzB6hOAAQguAAgYgjgAhlghQAAgJgFgKQgDgJgFgFIAAABQAAACgHAFQgFAFAAAHQAAAIAPANIAHgBQADAFAAgMg");
	var mask_graphics_94 = new cjs.Graphics().p("ADtHAIgOghQgoAbgaAAQgoAAgdgMQgpAWgrAAQgpAAgOg3IgFg5QAAgpAYgeQgMgVgLgmIgThQQAAgVAIgQQgjgTghhAIgjhXIAAgDQgJAFgNAAQgjAAgggrQgfgrgWAAQgGAAgRgtIgFAAQhSABguhpQgghHAAgyQAAgyAeAAQAbgBAnAlQAmAmAbA0IALAYQAlAIBJBGQAzAwAxA8IANAQQAPAGARANQAnAdAbAvQAbAxABAyQAbAeAABaQAAAOgIAaIACABQATAFAAAbQAAAHgFAWQgFAWAAAFQAAAGAKAdIAAAAIANgGQAngRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA6gBQA2gCApATQAsAUAAAdQhzB6hOAAQgvAAgXgjgAgiAoQAAgJgEgKQgEgJgEgFIAAABQgBACgGAFQgFAEAAAIQAAAIAPANIAHgBQACAFAAgMg");
	var mask_graphics_95 = new cjs.Graphics().p("ADzJHIgNghQgoAbgbAAQgnAAgdgMQgpAWgrAAQgpAAgOg3IgFg5QAAgpAYgeQgMgUgLgnIgThQQAAgUAHgRQgjgSgghBIgjhZIAAgCQgJAEgNAAQgkAAgfgrQgggpgWAAQgFAAgSgsIgEAAQhSAAguhpQgghHAAgyIABgSIgFgYQgIgsgBgtQAAhZAUg0QATguAbgDQAbgCATAoQAVAsAABJQgRBcgRA0IAJAIQAnAmAaA0IAMAZQAkAHBKBGQAzAwAxA8IAMAOQAPAGASANQAnAdAaAvQAcA0AAAxQAcAfAABZQAAAOgJAaIADABQATAFAAAbQgBAHgEAWQgFAWAAAGQAAAFAKAdIAAABIANgHQAngRAygIQA3gHAiAIIAMAEIABAAQAkgbA7gBQA2gCApATQArAUABAdQh0B6hOAAQguAAgYgjgAgbCvQAAgJgEgKQgEgJgEgFIAAABQgBACgGAFQgGAFAAAHQAAAIAPANIAIgBQACAFAAgMg");
	var mask_graphics_96 = new cjs.Graphics().p("AFIKBIgNghQgoAbgbAAQgnAAgdgMQgpAWgrAAQgrAAgOg3IgFg5QAAgpAYgeQgMgVgLgmIgThQQAAgVAHgQQghgTgghAIgjhZIAAgCQgJAEgNAAQgkAAgfgrQgggrgWAAQgFAAgSgrIgEABQhSAAguhpQgghHAAgyIABgTIgFgXQgIgsgBgtQAAhZAUg0IACgEQhLgHg3gaQg/gdAAghQAAgjAvgSQArgQA7AFQA9AFApAZQAuAcAAAsQgHAbgIAVIABACQAVAsAABJQgRBcgRAzIAJAJQAnAmAaA0IAMAYQAkAIBKBGQAzAwAxA6IAMAQQANAGASANQAnAdAaAvQAeA0AAAxQAcAeAABaQAAAOgJAaIADABQATAFAAAbQgBAHgEAWQgFAWAAAGQAAAFAKAdIAAAAIANgGQAngRAygIQA3gHAiAIIAMAEIABAAQAkgbA7gBQA2gCApATQArAUABAdQh0B6hOAAQguAAgYgjgAA4DpQAAgJgEgKQgEgJgEgFIAAABQgBACgGAFQgGAFAAAHQAAAIAPANIAIgBQACAFAAgMg");
	var mask_graphics_97 = new cjs.Graphics().p("AHIKBIgOghQgnAbgbAAQgoAAgdgMQgoAWgrAAQgsAAgNg3IgGg5QABgpAXgeQgMgVgLgmIgThQQABgVAHgQQgjgTghhAIgihZIAAgCQgJAEgOAAQghAAgfgrQgggrgWAAQgFAAgSgrIgEABQhTAAguhpQgfhHAAgyIABgTIgFgXQgIgsgCgtQAAhZAVg0IACgEQhLgHg4gaQgXgLgPgLQgMALgTAJQg1AZhRAAQhJAAgagYQgPgMAAgTQAAhbCxAGQA2ACAyAKQAJgFAMgFQAqgQA7AFQA+AFAoAZQAuAcAAAsQgHAbgHAVIABACQAUAsAABJQgQBcgSAzIAKAJQAmAmAbA0IALAYQAlAIBHBGQAzAwAxA6IANAQQAPAGARANQAnAdAbAvQAdA0ABAxQAbAeABBaQAAAOgJAaIACABQATAFAAAbQAAAHgEAWQgFAWgBAGQAAAFAKAdIAAAAIAOgGQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA7gBQA1gCApATQAsAUAAAdQhzB6hOAAQguAAgYgjgAC4DpQAAgJgFgKQgDgJgFgFIAAABQAAACgHAFQgFAFAAAHQAAAIAPANIAHgBQADAFAAgMg");
	var mask_graphics_98 = new cjs.Graphics().p("AHIKBIgOghQgnAbgbAAQgoAAgdgMQgoAWgrAAQgsAAgNg3IgGg5QABgpAXgeQgMgVgLgmIgThQQABgVAHgQQgjgTghhAIgihZIAAgCQgJAEgOAAQghAAgfgrQgggrgWAAQgFAAgSgrIgEABQhTAAguhpQgfhHAAgyIABgTIgFgXQgIgsgCgtQAAhZAVg0IACgEQhLgHg4gaQgXgLgPgLQgMALgTAJQglARgyAGQgCADgIAAQgDAAgDgCIgYABQALAUATAvQAYA7AAAKQAAAXgaAqQgkA5gyAAQgrAAgMg/QgFgfADghQAAgXASgvQAOgmARgcQgagGgOgNQgPgMAAgTQAAhbCxAGQA2ACAyAKQAJgFAMgFQAqgQA7AFQA+AFAoAZQAuAcAAAsQgHAbgHAVIABACQAUAsAABJQgQBcgSAzIAKAJQAmAmAbA0IALAYQAlAIBHBGQAzAwAxA6IANAQQAPAGARANQAnAdAbAvQAdA0ABAxQAbAeABBaQAAAOgJAaIACABQATAFAAAbQAAAHgEAWQgFAWgBAGQAAAFAKAdIAAAAIAOgGQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA7gBQA1gCApATQAsAUAAAdQhzB6hOAAQguAAgYgjgAC4DpQAAgJgFgKQgDgJgFgFIAAABQAAACgHAFQgFAFAAAHQAAAIAPANIAHgBQADAFAAgMg");
	var mask_graphics_99 = new cjs.Graphics().p("AIOKBIgOghQgnAbgbAAQgoAAgdgMQgoAWgrAAQgsAAgNg3IgGg5QABgpAXgeQgMgVgLgmIgThQQABgVAHgQQgjgTghhAIgihZIAAgCQgJAEgOAAQgjAAgfgrQgegrgWAAQgFAAgSgrIgEABQhTAAguhpQgfhHAAgyIABgTIgFgXQgIgsgCgtQAAhZAVg0IACgEQhLgHg4gaQgXgLgPgLQgMALgTAJQglARgyAGQgCADgIAAQgDAAgDgCIgYABQALAUATAvQAYA7AAAKQAAAXgaAqIgEAGIgFAQQgFAOAAAGQAAACARAXQARAXAAAOQAAAYgeATQgiAVgCAIIgJAjQgNAdgWAAQgUAAgJgRQgFgKAAgKQgWAFgiAAQgYAAgsgcQgpgaAAgIQAAgXAfgKQAsgOAUgZQAPgcATgQQALgIAOgFQgDgKgDgNQgFgfADghQAAgXASgvQAOgmARgcQgagGgOgNQgPgMAAgTQAAhbCxAGQA2ACAyAKQAJgFAMgFQAqgQA7AFQA+AFAoAZQAuAcAAAsQgHAbgHAVIABACQAUAsAABJQgQBcgSAzIAKAJQAmAmAbA0IALAYQAlAIBHBGQAzAwAxA6IANAQQAPAGARANQAnAdAbAvQAdA0ABAxQAbAeABBaQAAAOgJAaIACABQATAFAAAbQAAAHgEAWQgFAWgBAGQAAAFAKAdIAAAAIAOgGQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA7gBQA1gCApATQAsAUAAAdQhzB6hOAAQguAAgYgjgAD+DpQAAgJgFgKQgDgJgFgFIAAABQAAACgHAFQgFAFAAAHQAAAIAPANIAHgBQADAFAAgMg");
	var mask_graphics_100 = new cjs.Graphics().p("AKWKBIgNghQgoAbgbAAQgnAAgdgMQgpAWgrAAQgsAAgNg3IgFg5QAAgpAXgeQgMgVgLgmIgShQQAAgVAHgQQgjgTgghAIgjhZIAAgCQgJAEgOAAQgjAAgfgrQgggrgWAAQgFAAgSgrIgEABQhTAAgshpQgfhHAAgyIABgTIgFgXQgIgsgCgtQAAhZAVg0IACgEQhLgHg4gaQgXgLgOgLQgMALgUAJQglARgyAGQgCADgIAAQgDAAgDgCIgYABQAMAUATAvQAXA7AAAKQAAAXgaAqIgEAGIgFAQQgFAOAAAGQAAACARAXQARAXAAAOQAAAYgeATQgiAVgCAIIgJAjQgMAdgXAAQgUAAgJgRQgFgKAAgKQgWAFgiAAQgWAAgmgXQg/AcgeAAQh8AAg/g6QgpglAAgiQAAgLAOgTQAQgTAWgNQA6gjAvArIAlAgQAYAVAUAJQAiAOAagCQAUgCAJACQAagNAOgRQAPgcATgQQALgIAOgFQgDgKgCgNQgGgfADghQAAgXASgvQAOgmARgcQgagGgOgNQgPgMAAgTQAAhbCxAGQA2ACAyAKQAJgFAMgFQAqgQA8AFQA9AFAoAZQAtAcAAAsQgIAbgHAVIABACQAVAsAABJQgRBcgRAzIAJAJQAnAmAaA0IALAYQAlAIBJBGQA0AwAxA6IAMAQQAPAGARANQAnAdAbAvQAeA0AAAxQAcAeAABaQAAAOgJAaIADABQASAFAAAbQAAAHgEAWQgFAWAAAGQAAAFAJAdIABAAIANgGQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA7gBQA1gCAqATQArAUAAAdQhzB6hOAAQguAAgYgjgAGGDpQAAgJgFgKQgDgJgEgFIAAABQgBACgGAFQgGAFAAAHQAAAIAPANIAHgBQADAFAAgMg");
	var mask_graphics_101 = new cjs.Graphics().p("ALxKBIgNghQgoAbgbAAQgnAAgdgMQgpAWgrAAQgrAAgOg3IgFg5QAAgpAYgeQgMgVgLgmIgThQQAAgVAHgQQgjgTgghAIgjhZIAAgCQgJAEgNAAQgkAAgfgrQgggrgWAAQgFAAgSgrIgEABQhSAAguhpQgghHAAgyIABgTIgFgXQgIgsgBgtQAAhZAUg0IACgEQhJgHg3gaQgXgLgPgLQgMALgUAJQglARgxAGQgDADgIAAQgDAAgDgCIgYABQAMAUATAvQAYA7gBAKQABAXgbAqIgEAGIgFAQQgEAOAAAGQgBACASAXQAQAXAAAOQAAAYgeATQgiAVgCAIIgJAjQgMAdgXAAQgUAAgJgRQgEgKgBgKQgWAFgiAAQgVAAgmgXQhAAcgeAAQh8AAg/g6QgpglAAgiQAAgHAFgKQhagCg3haQgqhGAAg5QAAgrAaAHIAeAKQAWAHARAAQBAAAA8BZQATAcARAhQAMAaAAADIAAAAQAngIAhAeIAlAgQAZAVATAJQAiAOAagCQAUgCAJACQAagNAPgRQAOgcATgQQALgIAPgFQgEgKgCgNQgFgfACghQAAgXASgvQAPgmAQgcQgagGgOgNQgOgMAAgTQAAhbCwAGQA3ACAyAKQAIgFAMgFQArgQA7AFQA7AFApAZQAuAcAAAsQgHAbgIAVIABACQAVAsAABJQgRBcgRAzIAJAJQAnAmAaA0IAMAYQAkAIBKBGQAzAwAxA6IAMAQQAPAGASANQAnAdAaAvQAeA0AAAxQAcAeAABaQAAAOgJAaIADABQATAFAAAbQgBAHgEAWQgFAWAAAGQAAAFAKAdIAAAAIANgGQAngRAygIQA3gHAiAIIAMAEIABAAQAkgbA7gBQA2gCApATQArAUABAdQh0B6hOAAQguAAgYgjgAHhDpQAAgJgEgKQgEgJgEgFIAAABQgBACgGAFQgGAFAAAHQAAAIAPANIAIgBQACAFAAgMg");
	var mask_graphics_102 = new cjs.Graphics().p("AMwKBIgOghQgnAbgbAAQgoAAgdgMQgoAWgrAAQgsAAgNg3IgGg5QABgpAXgeQgMgVgLgmIgThQQABgVAHgQQgjgTghhAIgihZIAAgCQgJAEgOAAQgjAAgfgrQgggrgWAAQgFAAgSgrIgEABQhTAAguhpQgfhHAAgyIABgTIgFgXQgIgsgCgtQAAhZAVg0IACgEQhLgHg2gaQgXgLgPgLQgMALgTAJQglARgyAGQgCADgIAAQgDAAgDgCIgYABQALAUATAvQAYA7AAAKQAAAXgaAqIgEAGIgFAQQgFAOAAAGQAAACARAXQARAXAAAOQAAAYgeATQgiAVgCAIIgJAjQgNAdgWAAQgUAAgJgRQgFgKAAgKQgWAFgiAAQgWAAgmgXQg/AcgeAAQh8AAg/g6QgqglAAgiQAAgHAGgKQhbgCg2haQgTgegKgcQg1gLgthEQgbgpgOgqQAAiXBhB4QAcAkAgA2IAYAIQAXAHARAAQBAAAA8BZQATAcAQAhQANAaAAADIAAAAQAmgIAiAeIAlAgQAYAVAUAJQAiAOAagCQATgCAKACQAagNAOgRQAPgcATgQQALgIAOgFQgDgKgDgNQgFgfADghQAAgXASgvQAOgmARgcQgagGgOgNQgPgMAAgTQAAhbCxAGQA2ACAyAKQAJgFAMgFQAqgQA5AFQA+AFAoAZQAuAcAAAsQgHAbgHAVIABACQAUAsAABJQgQBcgSAzIAKAJQAmAmAbA0IALAYQAlAIBJBGQAzAwAxA6IANAQQAPAGARANQAnAdAbAvQAdA0ABAxQAbAeABBaQAAAOgJAaIACABQATAFAAAbQAAAHgEAWQgFAWgBAGQAAAFAKAdIAAAAIAOgGQAmgRAzgIQA2gHAjAIIAMAEIAAAAQAlgbA7gBQA1gCApATQAsAUAAAdQhzB6hOAAQguAAgYgjgAIgDpQAAgJgFgKQgDgJgFgFIAAABQAAACgHAFQgFAFAAAHQAAAIAPANIAHgBQADAFAAgMg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(19).to({graphics:mask_graphics_19,x:-5.3,y:-76.5}).wait(1).to({graphics:mask_graphics_20,x:4,y:-76.2}).wait(1).to({graphics:mask_graphics_21,x:15.8,y:-76.2}).wait(1).to({graphics:mask_graphics_22,x:30.5,y:-76.2}).wait(1).to({graphics:mask_graphics_23,x:39.9,y:-74}).wait(1).to({graphics:mask_graphics_24,x:47.5,y:-65.8}).wait(1).to({graphics:mask_graphics_25,x:52.3,y:-56.1}).wait(1).to({graphics:mask_graphics_26,x:52.3,y:-49.1}).wait(1).to({graphics:mask_graphics_27,x:52.3,y:-41.7}).wait(30).to({graphics:mask_graphics_57,x:31.6,y:-41.7}).wait(1).to({graphics:mask_graphics_58,x:26.8,y:-41.7}).wait(1).to({graphics:mask_graphics_59,x:20.2,y:-41.7}).wait(1).to({graphics:mask_graphics_60,x:14.7,y:-38.7}).wait(1).to({graphics:mask_graphics_61,x:7.6,y:-38.7}).wait(1).to({graphics:mask_graphics_62,x:1.2,y:-38.7}).wait(1).to({graphics:mask_graphics_63,x:-4.5,y:-38.7}).wait(1).to({graphics:null,x:0,y:0}).wait(24).to({graphics:mask_graphics_88,x:78.4,y:78.9}).wait(1).to({graphics:mask_graphics_89,x:69.1,y:78.9}).wait(1).to({graphics:mask_graphics_90,x:64.4,y:75.4}).wait(1).to({graphics:mask_graphics_91,x:63.5,y:66.6}).wait(1).to({graphics:mask_graphics_92,x:58.8,y:57.3}).wait(1).to({graphics:mask_graphics_93,x:49.1,y:47.5}).wait(1).to({graphics:mask_graphics_94,x:42.3,y:40}).wait(1).to({graphics:mask_graphics_95,x:41.6,y:26.5}).wait(1).to({graphics:mask_graphics_96,x:33.1,y:20.7}).wait(1).to({graphics:mask_graphics_97,x:20.4,y:20.7}).wait(1).to({graphics:mask_graphics_98,x:20.4,y:20.7}).wait(1).to({graphics:mask_graphics_99,x:13.4,y:20.7}).wait(1).to({graphics:mask_graphics_100,x:-0.2,y:20.7}).wait(1).to({graphics:mask_graphics_101,x:-9.3,y:20.7}).wait(1).to({graphics:mask_graphics_102,x:-15.6,y:20.7}).wait(73));

	// Camada 3
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(255,153,255,0.988)").ss(3,1,1).p("ALaFeQAFgEDTigQDRijAAgTQAAgThviZQhqiSgVgSQgxgshOACQghABlygKQl8gLgQAAAyCAAQAXAUCfCiQDCDGAOAPQAlgiCoiwQBVhZBfhk");
	this.shape.setTransform(-4.9,-36.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(255,153,255,0.988)").ss(3,1,1).p("AmCjCQAWAUCgCiQDBDFANAPQAlgiCoiuQBVhZBfhm");
	this.shape_1.setTransform(-81.7,-17.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(255,153,255,0.988)").ss(3,1,1).p("AP3JVIAAgFQkxAAhugFQgDgiABidQACiYAAgHQAAgVhBg3QAAgBiQh0QjTipgKhRQgGgyAPiiQAOiagngMQgngMiOAAQiQgBhJALQgFClAAEOQgEgBiygHQiugHgRAAIACgBQADgBivisQi+i6gbgeIgFAAIAAAF");
	this.shape_2.setTransform(-19.4,18.7);

	this.shape.mask = this.shape_1.mask = this.shape_2.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},19).to({state:[{t:this.shape_1}]},21).to({state:[]},35).to({state:[{t:this.shape_2}]},13).to({state:[]},27).wait(60));

	// mask (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_0 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");
	var mask_1_graphics_169 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");
	var mask_1_graphics_170 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");
	var mask_1_graphics_171 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");
	var mask_1_graphics_172 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");
	var mask_1_graphics_173 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");
	var mask_1_graphics_174 = new cjs.Graphics().p("AviPMIAAlyIl7AAIAAyfIGLAAIAAmGIemAAIAAF8IGKAAIAASzImGAAIAAFog");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:mask_1_graphics_0,x:-2.9,y:-0.1}).wait(169).to({graphics:mask_1_graphics_169,x:-2.9,y:-0.1}).wait(1).to({graphics:mask_1_graphics_170,x:-2.9,y:-0.1}).wait(1).to({graphics:mask_1_graphics_171,x:-2.9,y:-0.1}).wait(1).to({graphics:mask_1_graphics_172,x:-2.9,y:-0.1}).wait(1).to({graphics:mask_1_graphics_173,x:-2.9,y:-0.1}).wait(1).to({graphics:mask_1_graphics_174,x:-2.9,y:-0.1}).wait(1));

	// cai16
	this.instance_1 = new lib.bloco_azul();
	this.instance_1.setTransform(76.3,-116.6,0.6,0.6,0,0,0,30,30);
	this.instance_1._off = true;

	this.instance_1.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(119).to({_off:false},0).to({y:-77},5).wait(45).to({alpha:0},5).wait(1));

	// cai15
	this.instance_2 = new lib.bloco_amarelo();
	this.instance_2.setTransform(-2.2,-155.1,0.6,0.6,0,0,0,30,30);
	this.instance_2._off = true;

	this.instance_2.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(119).to({_off:false},0).to({x:-2.3,y:-78},10).wait(40).to({alpha:0},5).wait(1));

	// cai14
	this.instance_3 = new lib.bloco_verde();
	this.instance_3.setTransform(-2,-116.9,0.6,0.6,0,0,0,30,30);
	this.instance_3._off = true;

	this.instance_3.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(119).to({_off:false},0).to({x:-1.8,y:-39.5},10).wait(40).to({alpha:0},5).wait(1));

	// ca13
	this.instance_4 = new lib.bloco_vermelho();
	this.instance_4.setTransform(-120.6,-77.6,0.6,0.6,0,0,0,30,30);
	this.instance_4._off = true;

	this.instance_4.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(119).to({_off:false},0).to({y:-38.5},5).wait(45).to({alpha:0},5).wait(1));

	// cai12
	this.instance_5 = new lib.bloco_vermelho();
	this.instance_5.setTransform(-41.7,-155.6,0.6,0.6,0,0,0,30,30);
	this.instance_5._off = true;

	this.instance_5.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(119).to({_off:false},0).to({x:-41.9,y:-77},10).wait(40).to({alpha:0},5).wait(1));

	// cai11
	this.instance_6 = new lib.bloco_azul();
	this.instance_6.setTransform(-41.6,-116.6,0.6,0.6,0,0,0,30,30);
	this.instance_6._off = true;

	this.instance_6.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(119).to({_off:false},0).to({x:-41.9,y:-38.5},10).wait(40).to({alpha:0},5).wait(1));

	// cai10
	this.instance_7 = new lib.bloco_azul();
	this.instance_7.setTransform(-81.6,-116.6,0.6,0.6,0,0,0,30,30);
	this.instance_7._off = true;

	this.instance_7.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(119).to({_off:false},0).to({y:-77},5).wait(45).to({alpha:0},5).wait(1));

	// cai9
	this.instance_8 = new lib.bloco_amarelo();
	this.instance_8.setTransform(36.2,-155.1,0.6,0.6,0,0,0,30,30);
	this.instance_8._off = true;

	this.instance_8.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(119).to({_off:false},0).to({y:-78},10).wait(40).to({alpha:0},5).wait(1));

	// CAI8
	this.instance_9 = new lib.bloco_vermelho();
	this.instance_9.setTransform(36.2,-116.6,0.6,0.6,0,0,0,30,30);
	this.instance_9._off = true;

	this.instance_9.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(119).to({_off:false},0).to({y:-39.5},10).wait(40).to({alpha:0},5).wait(1));

	// cai7
	this.instance_10 = new lib.bloco_vermelho();
	this.instance_10.setTransform(-120.6,-77.1,0.6,0.6,0,0,0,30,30);
	this.instance_10._off = true;

	this.instance_10.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(78).to({_off:false},0).to({y:-37.5},5).wait(23).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// cai6
	this.instance_11 = new lib.bloco_amarelo();
	this.instance_11.setTransform(-42,-115.6,0.6,0.6,0,0,0,30,30);
	this.instance_11._off = true;

	this.instance_11.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(78).to({_off:false},0).to({y:-78},5).wait(36).to({y:0},10).wait(40).to({alpha:0},5).wait(1));

	// cai5
	this.instance_12 = new lib.bloco_azul();
	this.instance_12.setTransform(-81.7,-115.6,0.6,0.6,0,0,0,30,30);
	this.instance_12._off = true;

	this.instance_12.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(78).to({_off:false},0).to({x:-81.5,y:-77},5).wait(36).to({y:-38.5},5).wait(45).to({alpha:0},5).wait(1));

	// cai4
	this.instance_13 = new lib.caiVerde_mc();
	this.instance_13.setTransform(17.1,-156.2);
	this.instance_13._off = true;

	this.instance_13.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(42).to({_off:false},0).to({y:-77.6},10).wait(67).to({y:-0.1},10).wait(40).to({alpha:0},5).wait(1));

	// cai3
	this.instance_14 = new lib.bloco_amarelo();
	this.instance_14.setTransform(76.3,-157.1,0.6,0.6,0,0,0,30,30);
	this.instance_14._off = true;

	this.instance_14.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(42).to({_off:false},0).to({y:-77.5},10).wait(67).to({y:-39.5},5).wait(45).to({alpha:0},5).wait(1));

	// cai2
	this.instance_15 = new lib.bloco_vermelho();
	this.instance_15.setTransform(76.8,-117.1,0.6,0.6,0,0,0,30,30);
	this.instance_15._off = true;

	this.instance_15.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(42).to({_off:false},0).to({y:-39},10).wait(67).to({y:-1},5).wait(45).to({alpha:0},5).wait(1));

	// cai 1
	this.instance_16 = new lib.bloco_azul();
	this.instance_16.setTransform(115.3,-74.9,0.6,0.6,0,0,0,30,30);
	this.instance_16._off = true;

	this.instance_16.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(47).to({_off:false},0).to({y:-38.5},5).wait(117).to({alpha:0},5).wait(1));

	// grupo01
	this.instance_17 = new lib.blocoGrupo01_mc();
	this.instance_17.setTransform(56.4,-38.1);

	this.instance_17.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(29).to({alpha:0.199},2).to({alpha:1},2).to({alpha:0.199},2).to({alpha:1},2).to({alpha:0},2).to({_off:true},1).wait(135));

	// bloco_azul
	this.instance_18 = new lib.bloco_azul();
	this.instance_18.setTransform(-81.6,-76.6,0.6,0.6,0,0,0,30,30);

	this.instance_18.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(78).to({y:-37.5},5).wait(36).to({y:0.8},5).wait(45).to({alpha:0},5).wait(1));

	// bloco_vermelho
	this.instance_19 = new lib.bloco_vermelho();
	this.instance_19.setTransform(-42,-76.6,0.6,0.6,0,0,0,30,30);

	this.instance_19.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(78).to({y:-39},5).wait(23).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_vermelho
	this.instance_20 = new lib.bloco_vermelho();
	this.instance_20.setTransform(-81.6,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_20.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(78).to({y:0.3},5).wait(23).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_verde
	this.instance_21 = new lib.bloco_verde();
	this.instance_21.setTransform(-120.6,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_21.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(169).to({alpha:0},5).wait(1));

	// bloco_azul
	this.instance_22 = new lib.bloco_azul();
	this.instance_22.setTransform(-120.6,40,0.6,0.6,0,0,0,30,30);

	this.instance_22.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(169).to({alpha:0},5).wait(1));

	// bloco_azul
	this.instance_23 = new lib.bloco_azul();
	this.instance_23.setTransform(-81.6,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_23.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(169).to({alpha:0},5).wait(1));

	// bloco_amarelo
	this.instance_24 = new lib.bloco_amarelo();
	this.instance_24.setTransform(-120.6,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_24.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(66).to({alpha:0.281},2).to({alpha:1},2).to({alpha:0.281},2).to({alpha:1},2).to({alpha:0},2).wait(99));

	// bloco_amarelo
	this.instance_25 = new lib.bloco_amarelo();
	this.instance_25.setTransform(-81.6,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_25.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(66).to({alpha:0.281},2).to({alpha:1},2).to({alpha:0.281},2).to({alpha:1},2).to({alpha:0},2).wait(99));

	// bloco_amarelo
	this.instance_26 = new lib.bloco_amarelo();
	this.instance_26.setTransform(-42,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_26.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(66).to({alpha:0.281},2).to({alpha:1},2).to({alpha:0.281},2).to({alpha:1},2).to({alpha:0},2).wait(99));

	// bloco_verde
	this.instance_27 = new lib.bloco_verde();
	this.instance_27.setTransform(-81.6,40,0.6,0.6,0,0,0,30,30);

	this.instance_27.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(169).to({alpha:0},5).wait(1));

	// bloco_amarelo
	this.instance_28 = new lib.bloco_amarelo();
	this.instance_28.setTransform(-42,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_28.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(169).to({alpha:0},5).wait(1));

	// bloco_amarelo
	this.instance_29 = new lib.bloco_amarelo();
	this.instance_29.setTransform(-2.4,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_29.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(169).to({alpha:0},5).wait(1));

	// bloco_vermelho
	this.instance_30 = new lib.bloco_vermelho();
	this.instance_30.setTransform(-42,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_30.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(106).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_verde
	this.instance_31 = new lib.bloco_verde();
	this.instance_31.setTransform(-42,40,0.6,0.6,0,0,0,30,30);

	this.instance_31.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(169).to({alpha:0},5).wait(1));

	// bloco_azul
	this.instance_32 = new lib.bloco_azul();
	this.instance_32.setTransform(-2.7,40,0.6,0.6,0,0,0,30,30);

	this.instance_32.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(169).to({alpha:0},5).wait(1));

	// bloco_vermelho
	this.instance_33 = new lib.bloco_vermelho();
	this.instance_33.setTransform(76.8,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_33.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(106).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_vermelho
	this.instance_34 = new lib.bloco_vermelho();
	this.instance_34.setTransform(37.1,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_34.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_34).wait(106).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_vermelho
	this.instance_35 = new lib.bloco_vermelho();
	this.instance_35.setTransform(36.5,40,0.6,0.6,0,0,0,30,30);

	this.instance_35.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(106).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_verde
	this.instance_36 = new lib.bloco_vermelho();
	this.instance_36.setTransform(-2.7,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_36.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(106).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// bloco_azul
	this.instance_37 = new lib.bloco_azul();
	this.instance_37.setTransform(76.8,40,0.6,0.6,0,0,0,30,30);

	this.instance_37.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(119).to({y:78},5).wait(45).to({alpha:0},5).wait(1));

	// bloco_azul
	this.instance_38 = new lib.bloco_azul();
	this.instance_38.setTransform(36.5,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_38.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(119).to({y:77.8},10).wait(40).to({alpha:0},5).wait(1));

	// bloco_azul
	this.instance_39 = new lib.bloco_azul();
	this.instance_39.setTransform(115.3,40,0.6,0.6,0,0,0,30,30);

	this.instance_39.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_39).wait(169).to({alpha:0},5).wait(1));

	// bloco_amarelo
	this.instance_40 = new lib.bloco_amarelo();
	this.instance_40.setTransform(115.3,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_40.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(169).to({alpha:0},5).wait(1));

	// bloco_amarelo
	this.instance_41 = new lib.bloco_amarelo();
	this.instance_41.setTransform(76.8,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_41.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(42).to({y:0.3},5).wait(72).to({y:38.3},5).wait(45).to({alpha:0},5).wait(1));

	// bloco_azul
	this.instance_42 = new lib.bloco_azul();
	this.instance_42.setTransform(36.5,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_42.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(119).to({y:38.8},10).wait(40).to({alpha:0},5).wait(1));

	// bloco_vermelho
	this.instance_43 = new lib.bloco_vermelho();
	this.instance_43.setTransform(-2.7,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_43.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_43).wait(106).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0.25},2).to({alpha:1},2).to({alpha:0},2).wait(59));

	// Camada 50
	this.instance_44 = new lib.blocoGrupo01_mc();
	this.instance_44.setTransform(56.4,-38.1);

	this.instance_45 = new lib.bloco_azul();
	this.instance_45.setTransform(-81.6,-76.6,0.6,0.6,0,0,0,30,30);

	this.instance_46 = new lib.bloco_vermelho();
	this.instance_46.setTransform(-42,-76.6,0.6,0.6,0,0,0,30,30);

	this.instance_47 = new lib.bloco_vermelho();
	this.instance_47.setTransform(-81.6,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_48 = new lib.bloco_verde();
	this.instance_48.setTransform(-120.6,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_49 = new lib.bloco_azul();
	this.instance_49.setTransform(-120.6,40,0.6,0.6,0,0,0,30,30);

	this.instance_50 = new lib.bloco_azul();
	this.instance_50.setTransform(-81.6,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_51 = new lib.bloco_amarelo();
	this.instance_51.setTransform(-120.6,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_52 = new lib.bloco_amarelo();
	this.instance_52.setTransform(-81.6,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_53 = new lib.bloco_amarelo();
	this.instance_53.setTransform(-42,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_54 = new lib.bloco_verde();
	this.instance_54.setTransform(-81.6,40,0.6,0.6,0,0,0,30,30);

	this.instance_55 = new lib.bloco_amarelo();
	this.instance_55.setTransform(-42,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_56 = new lib.bloco_amarelo();
	this.instance_56.setTransform(-2.4,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_57 = new lib.bloco_vermelho();
	this.instance_57.setTransform(-42,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_58 = new lib.bloco_verde();
	this.instance_58.setTransform(-42,40,0.6,0.6,0,0,0,30,30);

	this.instance_59 = new lib.bloco_azul();
	this.instance_59.setTransform(-2.7,40,0.6,0.6,0,0,0,30,30);

	this.instance_60 = new lib.bloco_vermelho();
	this.instance_60.setTransform(76.8,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_61 = new lib.bloco_vermelho();
	this.instance_61.setTransform(37.1,77.8,0.6,0.6,0,0,0,30,30);

	this.instance_62 = new lib.bloco_vermelho();
	this.instance_62.setTransform(36.5,40,0.6,0.6,0,0,0,30,30);

	this.instance_63 = new lib.bloco_vermelho();
	this.instance_63.setTransform(-2.7,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_64 = new lib.bloco_azul();
	this.instance_64.setTransform(76.8,40,0.6,0.6,0,0,0,30,30);

	this.instance_65 = new lib.bloco_azul();
	this.instance_65.setTransform(36.5,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_66 = new lib.bloco_azul();
	this.instance_66.setTransform(115.3,40,0.6,0.6,0,0,0,30,30);

	this.instance_67 = new lib.bloco_amarelo();
	this.instance_67.setTransform(115.3,0.3,0.6,0.6,0,0,0,30,30);

	this.instance_68 = new lib.bloco_amarelo();
	this.instance_68.setTransform(76.8,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_69 = new lib.bloco_azul();
	this.instance_69.setTransform(36.5,-38.6,0.6,0.6,0,0,0,30,30);

	this.instance_70 = new lib.bloco_vermelho();
	this.instance_70.setTransform(-2.7,-38.6,0.6,0.6,0,0,0,30,30);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_70},{t:this.instance_69},{t:this.instance_68},{t:this.instance_67},{t:this.instance_66},{t:this.instance_65},{t:this.instance_64},{t:this.instance_63},{t:this.instance_62},{t:this.instance_61},{t:this.instance_60},{t:this.instance_59},{t:this.instance_58},{t:this.instance_57},{t:this.instance_56},{t:this.instance_55},{t:this.instance_54},{t:this.instance_53},{t:this.instance_52},{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44}]},169).wait(6));

	// Camada 1
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#B5B2B8").s().p("APyOwIAAlDIFEAAIAAFDgA07OwIAAlDIFEAAIAAFDgAP4psIAAlEIFEAAIAAFEgA01psIAAlEIFEAAIAAFEg");
	this.shape_3.setTransform(-3.8,1.4);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#F1ECF5").s().p("A3XwhMAuvgByMgBgAkPMgrvAAYg");
	this.shape_4.setTransform(-1.1,0.1);

	this.instance_71 = new lib.madeirinha_mc("single",2);
	this.instance_71.setTransform(-6.9,11.3,0.6,0.6);

	this.instance_72 = new lib.madeirinha_mc("single",1);
	this.instance_72.setTransform(-4.6,91.3,0.6,0.6);

	this.instance_73 = new lib.madeirinha_mc("single",0);
	this.instance_73.setTransform(1.2,-76.6,0.6,0.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_73},{t:this.instance_72},{t:this.instance_71},{t:this.shape_4},{t:this.shape_3}]}).wait(175));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-354.7,-207.1,526.8,338.7);


(lib.AS3JanelaFeedback = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 3
	this.fechar_mc = new lib.fechar();
	this.fechar_mc.setTransform(141.2,128.9,1.019,1.019);
	this.fechar_mc._off = true;

	this.timeline.addTween(cjs.Tween.get(this.fechar_mc).wait(13).to({_off:false},0).wait(1));

	// Layer 2
	this.caixa_mc = new lib.caixatxt_mc();
	this.caixa_mc.setTransform(-3.5,211,0.013,0.013);

	this.timeline.addTween(cjs.Tween.get(this.caixa_mc).to({scaleX:0.99,scaleY:0.99},6).to({scaleX:0.81,scaleY:0.81},3).wait(1).to({scaleX:0.99,scaleY:0.99},3).wait(1));

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,0,0,0.694)").s().p("Eg+eAu3MAAAhdtMB89AAAMAAABdtg");
	this.shape.setTransform(0,228.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).wait(14));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-399.9,-71.3,800,600);


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
	this.shape.graphics.f("#000000").s().p("AiUDaQgMgMAAgUQAAgNAEgJQADgHAFgFQAFgFAGgDQAJgDAKAAQASAAAMAMQAMALAAAVQAAAVgMAMQgLAMgTAAQgTAAgLgMgAiICjQgGAHAAAPQAAAPAHAHQAGAIALAAQAKAAAHgIQAHgHAAgPQAAgPgHgHQgHgHgKAAQgLAAgHAHgADhDkIgNgSIgIgNIgGgEIgJgBIgDAAIAAAkIgRAAIAAhWIAkAAQAOAAAGADQAGACAFAGQADAGAAAHQAAAKgGAGQgFAHgMABQAGAEADAEQAFADAGAKIAKARgAC6CzIANAAQANAAACgBQADgBADgDQABgDAAgDQAAgFgCgCQgDgDgEgBIgMAAIgOAAgACNDkIgIgTIgiAAIgHATIgSAAIAhhWIASAAIAiBWgABoDCIAYAAIgMgggAAcDkIAAhHIgZAAIAAgPIBEAAIAAAPIgaAAIAABHgAg/DkIAAhVIASAAIAABHIArAAIAAAOgAjXDkIgehWIATAAIAVBAIAWhAIASAAIgfBWgAgEBtQg7gCgsgqQgvgugBg/QgBhBAtguQArgsA7gEIAAgaIArAtIgqAtIAAgcQgtAEggAhQgjAkAAAyQABAwAkAiQAhAhAuABIAFAAQAxAAAjgkQAjgkAAgwQgBgugggiIAbgbQAqAsABA+QABA/gtAvQguAvhAABIgCAAIgFAAg");
	this.shape.setTransform(-0.1,-3.9);

	this.instance = new lib.botaoReiniciarAnima();
	this.instance.setTransform(1.3,0);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AiDDFQgKgKAAgTQAAgMADgIQADgGAEgEQAFgFAFgCQAHgDAKAAQARAAAKAKQAKALAAATQAAASgKALQgKALgRAAQgRAAgKgLgAh3CUQgGAGAAAOQAAANAGAHQAGAGAJAAQAJAAAGgGQAGgHAAgOQAAgNgGgGQgGgHgJAAQgKAAgFAHgADIDOIgMgRQgFgJgDgCQgCgCgCgBIgIgBIgDAAIAAAgIgPAAIAAhNIAgAAQAMAAAGACQAFACADAGQAEAFAAAHQAAAIgFAGQgFAGgKABQAFADADAEQADADAGAJIAJAPgAClCiIALAAQALAAADgBIAEgDQACgDAAgDQAAgEgCgDQgCgCgEgBIgLAAIgMAAgAB9DOIgHgRIgeAAIgGARIgRAAIAehNIAQAAIAfBNgABdCwIAUAAIgKgdgAAZDOIAAhAIgWAAIAAgNIA8AAIAAANIgXAAIAABAgAg3DOIAAhMIAQAAIAAA/IAmAAIAAANgAi+DOIgbhNIARAAIATA5IATg5IAQAAIgbBNgAgDBSQgzgBgmglQgogngBg2QgBg3AngoQAlgmAzgDIgBgWIAlAmIgkAnIAAgYQgmADgcAdQgeAfABAqQAAArAfAcQAdAbAmABIAEABQArgBAegfQAegcgBgrQAAgogbgcIAWgYQAlAmAAA1QABA2gmAoQgnAog4ABIAAAAIgFAAg");
	this.shape_1.setTransform(0,-3.7);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF0000").s().p("Ak2FVQgHAAAAgGIAAqdQAAgGAHAAIJuAAQAGAAAAAGIAAKdQAAAGgGAAg");
	this.shape_2.setTransform(0.5,-0.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24.7,-26.9,49.3,46);


(lib.instrucao_mc = function() {
	this.initialize();

	// Layer 3
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D27922").s().p("ABzAyQgGgMAAgCQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgKQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAAAABABQAAAAAAAAQAAABAAAAIAKAWIABABQAAAAAAABQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAMQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAhzAqQgQgRAAgZQAAgZAQgRQARgSAaAAQAZAAASASQAQARAAAZQAAAZgQASQgRARgaAAQgaAAgRgSgAhcgUQgIAJAAALQAAAMAIAIQAHAJANAAQAMAAAIgJQAIgJAAgLQAAgLgIgJQgIgJgMAAQgMAAgIAJgAATA5QgOgEgFgMQAAgGAAgOIAAgKIAAgLIAAgaIgBgdQAAgBAAAAQAAgBAAAAQAAAAABAAQAAAAAAAAIAOAAIAPABQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAAhIgBAfQAAANADAFQADAGAMAAQARAAAAgRIgBgiIAAgkQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAABAAIAPgBIAPAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAABIgBAdIgBAaIAAAJIAAAHQAAAWgFAHQgJAOglAAQgRAAgJgCgAjOA7QgEAAgBgCIgLgaIgMgbIgBgBIAAADIAAAYIAAAYQAAABAAABQAAAAAAABQAAAAgBAAQAAAAgBAAIgcAAIgCAAIAAgCIABgbIABgcIgBgiIgBgUIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAOAAIAOgBQAAAAAAAAQABABAAAAQAAABABAAQAAABAAABIAZA1QACADACAAQABAAADgEIAZg0QAAgBABgBQAAAAAAgBQABAAAAgBQAAAAABAAIAHABIAHAAIAHgBIAGAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIgBAdIgBAbIABAcIABAbQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgdAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAgBIABgZIABgZQAAAAAAgBQAAAAAAgBQgBAAAAAAQAAgBAAAAIgLAaIgMAeIgCACIgEAAgAEDA6QgGgBgdAAIgTAAIgTAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgcIABgbIgBgiIgBgUIAAgBQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIATAAIASAAIASAAIATAAQAEAAABADIABAMIABALQAAABAAAAQAAABgBAAQAAAAAAAAQAAAAgBAAIgCAAQgWgCgRAAQgFAAgBACIAAAHQAAAFACACQABACAEAAIADAAIAEgBIAVAAIAFgBIAEAAQABAAAAAAQAAAAABABQAAAAAAAAQAAABAAAAIgBANIgBALQAAABAAAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgIgBIgVgBIgJAAQgBAAgBAAQAAAAgBABQAAAAAAAAQgBABAAAAIAAAFIABAIQABADAJABIAMAAIAOgBIANgBQAAAAAAAAQABABAAAAQAAAAAAABQAAABAAAAIgBAOIgDAMQAAAAAAAAQgBABAAAAQAAAAgBAAQAAAAAAAAIgDAAg");
	this.shape.setTransform(-231.3,-31.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CC6703").s().p("AEcHYQgHgMAAgCQAAgBAAAAQAAAAABAAQAAAAAAAAQAAAAABAAIAQgFQAIgEAAgJQAAgFgFgHIgLgMQgGgJAAgLQAAgPAOgKQAMgIAQgDIACAAQAAAAAAAAQABABAAAAQAAAAAAAAQABABAAAAIAKAWIAAABQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgDAAIgCAAQgGAAgFADQgFADAAAFQAAAGAGAHIALAOQAGAJAAAJQAAARgOAMQgNALgRACIgCABQgBAAgHgMgAkbHYQgGgMAAgCQAAgBAAAAQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAABABAAQAAAAAAAAQAAABAAAAIAKAWIABABQAAAAAAABQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgApcHQQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgApFGQQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgArGHQQgQgRAAgaQAAgZAPgSQAQgSAZAAQAbAAAPARIACADIgGAMIgHALIgCABIgEgEIgJgGQgGgDgHAAQgNAAgHAJQgHAIAAANQAAAMAHAJQAHAJANAAQAHAAAGgDIAJgGIAEgDIACABIAHAKIAGAKIgCAEQgPASgZAAQgaAAgQgSgAATHfQgOgEgFgMQAAgGAAgOIAAgKIAAgLIAAgcIgBgdQAAgBAAAAQAAAAAAgBQABAAAAAAQAAAAAAAAIAOAAIAPABQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAAhIgBAhQAAANADAFQADAGAMAAQARAAAAgRIgBgkIAAgkQAAAAAAgBQAAAAAAgBQAAAAABAAQAAAAABAAIAPgBIAPAAQAAAAABAAQAAAAAAAAQAAABABAAQAAAAAAABIgBAdIgBAcIAAAJIAAAHQAAAWgFAHQgJAOglAAQgRAAgJgCgAhsHQQgRgRAAgZQAAgbAQgRQAQgSAaAAQANAAALAFQAMAFAHAKIABADQAAACgHAKQgHAJgDAAIgDgEQgEgEgFgCQgGgDgIAAQgMAAgHAJQgHAJAAAMQAAAOAHAIQAHAIANAAQAJAAAKgEIgBgOIgBgOIABgCIABAAIAIAAIAHABIAIgBIAIAAQAAAAABAAQAAAAAAABQABAAAAAAQAAABAAABIgBAMIAAAMIACAgIAAABQAAAAAAABQgBAAAAAAQAAAAgBABQAAAAgBAAIgJgCIgJgCQgRAGgQAAQgaAAgQgRgAkxHgQgGgBgeAAIgTAAIgTAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIASAAIATAAIASAAIASAAQAEAAABADIABAMIABALQAAABAAAAQAAAAAAABQAAAAgBAAQAAAAAAAAIgCAAQgWgCgSAAQgEAAgBACIgBAHQAAAFACACQABACAEAAIAEAAIAEgBIAVAAIAEgBIAFAAQAAAAABAAQAAABAAAAQABAAAAAAQAAABAAAAIgCANIAAANQAAABAAAAQgBAAAAAAQAAABgBAAQAAAAgBAAIgHgBIgWgBIgJAAQgBAAAAAAQgBABAAAAQgBAAAAAAQAAABAAAAIgBAFIABAIQACADAJABIAMAAIANgBIANgBQABAAAAAAQAAABAAAAQABAAAAABQAAAAAAABIgCAOIgCAMQAAAAgBAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAgADpHfQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgPIACgsIgBgbIgBgaQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAHAAQABAAAAAAQAAAAABAAQAAABAAAAQAAAAAAABIAAAaIgBAbIAAAdIABAeQAAAAAAABQAAAAAAAAQgBAAAAABQAAAAAAAAIgCAAIgPABIgPgBgAC+HfQgBAAgBAAQAAAAgBgBQAAAAAAgBQgBgBAAAAQgDgMgBgBIgXgBIgPABQgBABgCAIQgBAHgDAAIgTABQgMAAAAgCQAAgDATgzIAWg8QAAgBAAgBQABAAAAgBQAAAAAAAAQABAAAAAAIAHAAIAHABIAGgBIAHAAQAAAAABAAQAAABABAAQAAAAAAABQAAAAABABIAYA8QATAzAAACQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAgBAAIgPABIgPgBgACeGhIgFAQQAAABAFAAIAJAAQAFAAABgBIAAgBIgEgPIgFgPIgGAPgAiqHfQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgPIACgsIgBgbIgBgaQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAHAAQABAAAAAAQAAAAABAAQAAABAAAAQAAAAAAABIAAAaIgBAbIAAAdIABAeQAAAAAAABQAAAAAAAAQgBAAAAABQAAAAAAAAIgCAAIgPABIgPgBgAmnHfIgCAAIgBgCIgEgJIgKgZQgBgDgGgBIgIABQgBAAAAAAQAAAAAAABQgBAAAAABQAAABAAABIABARIABARIAAABIgDAAIgPABIgOgBQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgcIABgcQAAgjgBgTIgBgBQAAgBAAAAQABAAAAAAQAAgBABAAQAAAAABAAIAZgBIAZgBQATAAAMAJQANAJAAATQAAAMgDAHQgEAHgJAHQgBABAAAAQAAAAAAAAQgBABAAAAQAAAAAAABIAKAUQAKAVAAACQAAABAAAAQAAAAAAAAQAAAAgBAAQAAAAAAAAIgQABIgPgBgAnJGFIAAARIAAAFIAAAGIADABIAKAAQASAAAAgOQAAgKgGgEQgFgDgLAAQgIAAgBACgAKhlyQgGgMAAgCQAAgBAAAAQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAABAAAAQABAAAAAAQAAABAAAAIAKAWIABABQAAABAAAAQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAFgl6QgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgAF3m6QgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAD2l6QgQgRAAgaQAAgZAPgSQAQgSAZAAQAbAAAPARIACADIgGAMIgHALIgCABIgEgEIgJgGQgGgDgHAAQgNAAgHAJQgHAIAAANQAAAMAHAJQAHAJANAAQAHAAAGgDIAJgGIAEgDIACABIAHAKIAGAKIgCAEQgPASgZAAQgaAAgQgSgAKLlqQgGgBgeAAIgTAAIgTAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIASAAIATAAIASAAIASAAQAEAAABADIABAMIABALQAAABAAAAQAAAAAAABQAAAAgBAAQAAAAAAAAIgCAAQgWgCgSAAQgEAAgBACIgBAHQAAAFACACQABACAEAAIAEAAIAEgBIAVAAIAEgBIAFAAQAAAAABAAQAAAAAAABQABAAAAAAQAAABAAAAIgCANIAAANQAAABAAAAQgBAAAAAAQAAABgBAAQAAAAgBAAIgHgBIgWgBIgJAAQAAAAgBAAQgBAAAAABQgBAAAAAAQAAABAAAAIgBAFIABAIQACADAJABIAMAAIANgBIANgBQABAAAAAAQAAABAAAAQABAAAAABQAAAAAAABIgCAOIgCAMQgBAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAgAIVlrIgCAAIgBgCIgEgJIgKgZQgBgDgGgBIgIABQgBAAAAAAQAAAAAAABQgBAAAAABQAAABAAABIABARIABARIAAABIgDAAIgPABIgOgBQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgcIABgcQAAgjgBgTIgBgBQAAgBAAAAQABAAAAAAQAAgBABAAQABAAAAAAIAZgBIAZgBQATAAAMAJQANAJAAATQAAAMgDAHQgEAHgJAHQgBAAAAABQAAAAAAAAQgBABAAAAQAAAAAAABIAKAUQAKAVAAACQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgQABIgPgBgAHznFIAAARIAAAFIAAAGIADABIAKAAQASAAAAgOQAAgKgGgEQgFgDgLAAQgIAAgBACg");
	this.shape_1.setTransform(-202.7,-52.4);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#000000").s().p("AmsP4QgGgMAAgCQAAgBAAAAQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAABABAAQAAAAAAAAQAAABAAAAIAKAWIABABQAAABAAAAQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAxjP4QgGgMAAgCQAAgBAAAAQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAABABAAQAAAAAAAAQAAABAAAAIAKAWIABABQAAABAAAAQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAhCPwQgQgRAAgaQAAgZAQgSQAQgSAYAAQAaAAAPARIABADIgFAMIgIALIgBABIgDgEIgIgGQgHgDgHAAQgMAAgIAJQgGAIAAANQAAAMAGAJQAIAJAMAAQAHAAAHgDIAIgGIACgDIACABIAHAKIAGAKIgBAEQgPASgYAAQgaAAgQgSgAjBPwQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgAiqOwQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAogPwQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAoJOwQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgAt4PwQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgAthOwQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAMMP9QgFgFAAgHQAAgHAFgEQAEgFAHAAQAHAAAEAFQAFAEAAAHQAAAHgFAFQgEAEgHAAQgHAAgEgEgACxPwQgQgRAAgZQAAgbAQgRQAQgSAaAAQAMAAAMAFQAMAFAHAKIABADQAAACgHAKQgIAJgCAAIgEgEQgEgEgEgCQgHgDgHAAQgNAAgHAJQgHAJAAAMQAAAOAHAIQAIAIANAAQAIAAALgEIgCgOIgBgOIABgCIACAAIAHAAIAHABIAIgBIAIAAQABAAAAAAQAAAAABABQAAAAAAAAQAAABAAABIAAAMIgBAMIACAgIAAABQAAAAAAABQAAAAAAAAQgBABAAAAQgBAAAAAAIgJgCIgKgCQgRAGgQAAQgZAAgRgRgA1bQBQgEAAgBgCIgMgaIgMgbIAAgBIgBADIAAAYIABAYQAAABAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgcAAIgCAAIgBgCIABgbIABgcIgBgkIAAgUIgBgCQAAAAAAAAQABgBAAAAQABAAAAAAQABAAABAAIAOAAIANgBQAAAAABAAQAAABAAAAQABABAAAAQAAABABABIAYA1QADAFABAAQABAAADgGIAZg0QABgBAAgBQAAAAABgBQAAAAABgBQAAAAAAAAIAIABIAHAAIAGgBIAHAAQAAAAABAAQAAAAABAAQAAABAAAAQAAAAAAABIgBAdIAAAdIAAAcIABAbQAAAAAAABQAAAAAAABQgBAAAAAAQgBAAAAAAIgeAAQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAgBIABgZIAAgZQAAAAAAgBQAAAAAAgBQAAAAAAAAQAAgBgBAAIgLAaIgMAeIgCACIgDAAgABlQAQgGgBgdAAIgTAAIgTAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAAAAAIATAAIASAAIASAAIATAAQAEAAABADIABAMIABALQAAABAAAAQAAAAgBABQAAAAAAAAQAAAAgBAAIgCAAQgWgCgRAAQgFAAgBACIAAAHQAAAFACACQABACAEAAIADAAIAEgBIAVAAIAFgBIAEAAQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIgBANIgBANQAAABAAAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgIgBIgVgBIgJAAQgBAAgBAAQAAAAgBABQAAAAAAAAQgBABAAAAIAAAFIABAIQABADAJABIAMAAIAOgBIANgBQAAAAAAAAQABABAAAAQAAAAAAABQAAAAAAABIgBAOIgDAMQAAAAAAAAQgBABAAAAQAAAAgBAAQAAAAAAAAIgDAAgALdP/QgBAAgBAAQAAAAgBgBQAAAAAAgBQgBgBAAAAQgDgMgBgBIgXgBIgPABQgBABgCAIQgBAHgDAAIgTABQgMAAAAgCQAAgDATgzIAWg8QAAgBAAgBQAAAAABAAQAAgBAAAAQAAAAABAAIAHAAIAHABIAGgBIAHAAQAAAAABAAQAAABAAAAQABAAAAABQABAAAAABIAYA8QATAzAAACQAAABAAAAQAAAAAAAAQAAABgBAAQAAAAgBAAIgPABIgPgBgAK9PBIgFAQQAAABAFAAIAJAAQAFAAABgBIAAgBIgEgPIgFgPIgGAPgAJgP/QAAAAgBAAQAAAAgBgBQAAAAAAAAQAAAAAAgBIABgUIAAgTQAAgBAAgBQAAAAAAgBQgBAAAAgBQAAAAgBAAIgUgBIgUABQgBAAAAAAQAAABAAAAQgBABAAAAQAAABAAABIABATIAAATQAAABAAAAQgBABAAAAQAAABAAAAQgBAAAAAAIgQABIgOgBQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgbIABgcIgBgcIgBgdQAAgBAAAAQABAAAAgBQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAIAAQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIgBATIgBATQAAAAAAABQAAAAABABQAAAAAAAAQAAABABAAQACABATAAQASAAADgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAgBAAAAIgBgSIAAgTQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAABAAIAHAAIAHAAIAIAAIAHAAQABAAAAAAQABAAAAAAQAAABABAAQAAAAAAABIgBAdIgBAcIABAcIABAbIgBACIgCAAIgPABIgPgBgAHrP/IgGAAQgBAAAAAAQAAgBgBAAQAAAAgBgBQAAAAgBgBIgagkIgSgWIgBgBIgBACIABAcIAAAdQAAABAAABQAAAAAAAAQgBABAAAAQAAAAgBAAIgdAAQAAAAgBA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IAIAAQAGAAAAgBIAAgBIgDgPIgGgPIgGAPgAMPPXQgIgbAAgDIABgLIAAgKIAAgLIgBgLQAAgBAAgBQAAAAABAAQAAgBAAAAQAAAAABAAIAHAAIAHAAIAHAAIAHAAQACAAAAAUQAAAPgDANIgHAbQgBADgFAAQgHAAgBgCgABCN4IgBABQgBADgFAGQgGAGgDAAIgHgDIgGgDIABgBIALgMQAGgIACgGQAAAAABAAQAAgBAAAAQAAAAABAAQAAAAAAAAIAPAAQAAAAAAAAQABAAAAAAQAAAAAAABQABAAAAAAQABAGAGAHIANAOIgGADIgHADQgEAAgNgQgAV1M9QgFgFAAgCIADgEIAGgIQADgGAAgGIAAgEIAAgDIABgDIAOgEIAOgDQABAAABAAQAAAAABABQAAAAABABQAAAAAAABQAAAXgRAQIgIAGQgHAFgCAAIgGgFgA1tNAQAAAAgBgBQAAAAAAAAQgBgBAAAAQAAgBAAAAQgBgFAAgLQgUgFgMgRQgMgQAAgVQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAWgMAQQgNARgVAEQAEAJAIAHIABABQAAADgUAAQgPAAgEgBgA11LdQgHAIAAANQAAAOAHAIQAHAIAOAAQAMAAAIgJQAHgIAAgNQAAgNgHgIQgIgJgMAAQgNAAgIAJgAU1MlQgHgMAAgCQAAAAAAgBQAAAAABAAQAAAAAAAAQAAAAABAAIAQgFQAIgEAAgJQAAgFgFgHIgLgMQgGgJAAgLQAAgPAOgKQAMgIAQgDIACAAQAAAAAAAAQABAAAAABQAAAAAAAAQABABAAAAIAKAWIAAABQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgDAAIgCAAQgGAAgFADQgFADAAAFQAAAGAGAHIALAOQAGAJAAAJQAAARgOAMQgNALgRACIgCABQgBAAgHgMgAEqMlQgHgMAAgCQAAAAAAgBQAAAAABAAQAAAAAAAAQAAAAABAAIAQgFQAIgEAAgJQAAgFgFgHIgLgMQgGgJAAgLQAAgPAOgKQAMgIAQgDIACAAQAAAAAAAAQABAAAAABQAAAAAAAAQABABAAAAIAKAWIAAABQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgDAAIgCAAQgGAAgFADQgFADAAAFQAAAGAGAHIALAOQAGAJAAAJQAAARgOAMQgNALgRACIgCABQgBAAgHgMgAl4MlQgGgMAAgCQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAAAABABQAAAAAAAAQAAABAAAAIAKAWIABABQAAAAAAABQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgATAMdQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgATXLdQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAC1MdQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgADMLdQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgABLMdQgQgRAAgaQAAgZAPgSQAQgSAZAAQAbAAAPARIACADIgGAMIgHALIgCABIgEgEIgJgGQgGgDgHAAQgNAAgHAJQgHAIAAANQAAAMAHAJQAHAJANAAQAHAAAGgDIAJgGIAEgDIACABIAHAKIAGAKIgCAEQgPASgZAAQgaAAgQgSgAgyMdQgRgRAAgaQAAgaARgRQARgSAaAAQAXAAARASQARARAAAaQAAAagRASQgRARgXAAQgaAAgRgSgAgbLdQgIAJAAAMQAAANAHAIQAIAJANAAQAJAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgKAAQgMAAgIAJgAtKMdQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAszLdQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgA0DMsQgPgEgEgMQgCgGAAgOIAAgKIAAgLIgBgcIgBgdQAAgBAAAAQABgBAAAAQAAAAAAAAQABAAAAAAIAQAAIAPABQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAAAIgBAhIAAAhQAAANACAFQAEAGAMAAQARAAAAgRIgBgkIgBgkQAAAAAAgBQAAAAABgBQAAAAAAAAQABAAAAAAIAPgBIAPAAQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAABIAAAdIgBAcIAAAJIAAAHQAAAWgFAHQgJAOglAAQgRAAgJgCgALFMuQgEAAgBgCIgLgaIgMgbIgBgBIAAADIAAAYIAAAYQAAABAAABQAAAAAAABQgBAAAAAAQAAAAgBAAIgcAAIgCAAIAAgCIABgbIABgcIgBgkIgBgUIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAOAAIAOgBQAAAAAAAAQABABAAAAQAAABABAAQAAABAAABIAZA1QACAFACAAQABAAADgGIAZg0QAAgBABgBQAAAAAAgBQABAAAAgBQAAAAABAAIAHABIAHAAIAHgBIAGAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIgBAdIgBAdIABAcIABAbQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgdAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAgBIABgZIABgZQAAAAAAgBQAAAAAAgBQgBAAAAAAQAAgBAAAAIgLAaIgMAeIgCACIgEAAgAIyMtIgTAAIgYAAIgLgBQgBAAAAAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIAAgbIAAgcIAAgcIgBgdQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIAIAAIAHAAIAIAAIAJAAQAAAAAAAAQAAAAAAAAQABAAAAABQAAAAAAAAIAAACIgDAuIAAAWIAAAQIABACIABABIACAAIAWgBIAXAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAQAAAPgCAKQAAAAgBABQAAAAAAABQAAAAAAAAQAAAAgBAAIgDABIgTgBgAhjMtIgTAAIgYAAIgLgBQgBAAAAAAQgBAAAAgBQAAAAAAAAQAAgBAAAAIAAgbIAAgcIAAgcIgBgdQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIAIAAIAHAAIAIAAIAJAAQAAAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAACIgDAuIAAAWIAAAQIA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BAAAAQAAABAAAAIAAAdIgBAcIAAA3QAAABAAAAQgBABAAAAQAAAAgBAAQAAAAgBAAIgGAAIgGABIgGgBgAMVMsQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgPIACgsIgBgbIgBgaQAAgBAAAAQAAgBABAAQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAHAAQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAABIAAAaIgBAbIAAAdIABAeQAAAAAAABQAAAAAAAAQgBAAAAABQAAAAAAAAIgCAAIgPABIgPgBgAJXMsQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgPIABgsIAAgbIgBgaQAAgBAAAAQAAgBAAAAQABAAAAAAQAAAAABAAIAIAAIAHAAIAIAAIAIAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIgBAaIgBAbIABAdIAAAeQAAAAAAABQAAAAAAAAQAAAAAAABQgBAAAAAAIgCAAIgOABIgQgBgAmrMsQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgPIABgsIAAgbIgBgaQAAgBAAAAQAAgBAAAAQABAAAAAAQAAAAABAAIAIAAIAHAAIAIAAIAIAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIgBAaIgBAbIABAdIAAAeQAAAAAAABQAAAAAAAAQAAAAAAABQAAAAgBAAIgCAAIgOABIgQgBgAnWMsQAAAAgBAAQgBAAAAgBQgBAAAAgBQAAAAAAgBQgDgMgCgBIgWgBIgPABQgCABgBAIQgCAHgCAAIgTABQgNAAAAgCQAAgDATgzIAWg8QABgBAAgBQAAAAAAgBQABAAAAAAQAAAAAAAAIAHAAIAHABIAHgBIAGAAQABAAAAAAQABABAAAAQAAAAABABQAAAAAAABIAYA8QAUAzAAACQAAABAAAAQAAAAgBABQAAAAAAAAQgBAAAAAAIgQABIgPgBgAn2LuIgEAQQAAABAFAAIAIAAQAGAAAAgBIAAgBIgDgPIgGgPIgGAPgAubMsQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgeIABgdIgBgdIgbACIgBgBIABgHIACgHIAAgHQABgHABAAIACAAQANACAaAAIAcgBIALgBIACAAIAAACIAAAGIAAAGIAAAGIABAGQAAABAAAAQgBAAAAAAQAAABAAAAQgBAAAAAAIgZgBIgBAdIABAdIABAeIgBACIgCAAIgPABIgPgBgAvXMsIgHAAQAAAAgBAAQAAgBAAAAQgBAAAAgBQgBAAAAgBIgbgkIgRgWIgCgBIAAACIAAAcIABAdQAAABAAABQAAAAgBABQAAAAAAAAQgBAAAAAAIgdAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgbIABgcIgBgcIAAgdQAAAAAAAAQAAgBAAAAQABAAAAAAQABAAABAAIAMgBIAGgBIAHgBIADADIAfAqIAMARQABABAAAAQABABAAAAQABAAAAABQAAAAABAAQABAAAAgHIgBgaIgBgaQAAgBAAgBQAAAAABgBQAAAAAAAAQAAAAABAAIAPgBIAPAAQAAAAAAAAQABAAAAAAQAAABAAAAQAAABAAAAIAAAdIgBAcIAAA3QAAABAAAAQgBABAAAAQAAAAgBAAQAAAAgBAAIgGAAIgGABIgGgBgAxZMsQgBAAAAAAQgBAAAAgBQgBAAAAgBQAAAAAAgBQgDgMgCgBIgWgBIgPABQgCABgBAIQgCAHgCAAIgTABQgNAAAAgCQAAgDATgzIAWg8QAAgBABgBQAAAAAAgBQABAAAAAAQAAAAAAAAIAHAAIAHABIAHgBIAGAAQABAAAAAAQABABAAAAQAAAAABABQAAAAAAABIAYA8QAUAzAAACQAAABAAAAQgBAAAAABQAAAAAAAAQgBAAAAAAIgQABIgPgBgAx5LuIgEAQQAAABAFAAIAIAAQAGAAAAgBIAAgBIgDgPIgGgPIgGAPgAnEF3QgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAmtE3QgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgAovF3QgQgRAAgaQAAgZAQgSQAQgSAYAAQAbAAAQARIABADIgFAMIgIALIgBABIgFgEIgIgGQgHgDgHAAQgMAAgIAJQgGAIAAANQAAAMAGAJQAIAJAMAAQAHAAAHgDIAIgGIAEgDIACABIAHAKIAGAKIgBAEQgQASgZAAQgaAAgQgSgAyIF3QgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgAxxE3QgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAjgGEQgEgFAAgHQAAgHAEgEQAEgFAHAAQAHAAAFAFQAEAEAAAHQAAAHgEAFQgFAEgHAAQgHAAgEgEgAwAGGQgOgEgFgMQgCgGAAgOIABgKIAAgLIgBgcIgBgdQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIAPAAIAPABQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAAhIgBAhQAAANADAFQADAGAMAAQARAAAAgRIgBgkIAAgkQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAABAAIAPgBIAPAAQAAAAABAAQAAAAAAAAQAAABABAAQAAAAAAABIgBAdIgBAcIAAAJIAAAHQAAAWgFAHQgJAOglAAQgRAAgJgCgAzUGHQgGgBgdAAIgTAAIgTAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAAAAAgBQABAAAAAAQABAAAAAAIATAAIASAAIASAAIATAAQAEAAABADIABAMIABALQAAABAAAAQAAAAgBABQAAAAAAAAQAAAAgBAAIgCAAQgWgCgRAAQgFAAgBACIAAAHQAAAFACACQABACAEAAIADAAIAEgBIAVAAIAFgBIAEAAQABAAAAAAQABABAAAAQAAAAAAAAQAAABAAAAIgBANIgBANQAAABAAAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgIgBIgVgBIgJAAQgBAAgBAAQAAABgBAAQAAAAAAAAQgBABAAAAIAAAFIABAIQABADAJABIAMAAIAOgBIANgBQAAAAAAAAQABABAAAAQAAAAAAABQAAABAAAAIgBAOIgDAMQAAAAAAAAQgBABAAAAQAAAAgBAAQAAAAAAAAIgDAAgAkPGGIgDAAIgBgCIgDgJIgKgZQgCgDgFgBIgJABQAAAAAAAAQgBAAAAABQAAAAAAABQAAABAAABIABARIABARIgBABIgCAAIgPABIgPgBQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgcIABgcQAAgjgCgTIAAgBQ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BQAAABAAAAQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAy6CsQgGgMAAgCQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAAAAAABQABAAAAAAQAAABAAAAIAKAWIABABQAAABAAAAQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAPACkQgQgRAAgaQAAgZAQgSQAQgSAYAAQAbAAAQARIABADIgFAMIgIALIgBABIgFgEIgIgGQgHgDgHAAQgMAAgIAJQgGAIAAANQAAAMAGAJQAIAJAMAAQAHAAAHgDIAIgGIAEgDIACABIAHAKIAGAKIgBAEQgQASgZAAQgaAAgQgSgAKqCkQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgALBBkQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAufCkQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAuIBkQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgA0uCkQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgA0XBkQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgASNC1QgEAAgBgCIgLgaIgMgbIgBgBIAAADIAAAYIAAAYQAAABAAABQAAAAAAAAQgBABAAAAQAAAAgBAAIgcAAIgCAAIAAgCIABgbIABgcIgBgkIgBgUIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAOAAIAOgBQAAAAAAAAQABABAAAAQAAABABAAQAAABAAABIAZA1QACAFACAAQABAAADgGIAZg0QAAgBAAgBQABAAAAgBQABAAAAgBQAAAAABAAIAHABIAHAAIAHgBIAGAAQABAAAAAAQABAAAAAAQAAABABAAQAAAAAAABIgBAdIgBAdIABAcIABAbQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgdAAQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAgBIABgZIABgZQAAAAAAgBQAAAAgBgBQAAAAAAAAQAAgBAAAAIgLAaIgMAeIgCACIgEAAgAjHC1QgEAAgBgCIgMgaIgMgbIAAgBIgBADIAAAYIABAYQAAABAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgcAAIgCAAIgBgCIABgbIABgcIgBgkIAAgUIgBgCQAAAAAAAAQABgBAAAAQABAAAAAAQABAAABAAIAOAAIANgBQAAAAABAAQAAABAAAAQABABAAAAQAAABABABIAYA1QADAFABAAQABAAADgGIAZg0QABgBAAgBQAAAAABgBQAAAAAAgBQABAAAAAAIAIABIAHAAIAGgBIAHAAQAAAAABAAQAAAAABAAQAAABAAAAQAAAAAAABIgBAdIAAAdIAAAcIABAbQAAAAAAABQAAAAAAABQgBAAAAAAQgBAAAAAAIgeAAQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAgBIABgZIAAgZQAAAAAAgBQAAAAAAgBQAAAAAAAAQAAgBgBAAIgLAaIgMAeIgCACIgDAAgAojC1QgEAAgBgCIgMgaIgMgbIAAgBIgBADIAAAYIABAYQAAABAAABQgBAAAAAAQAAABAAAAQgBAAAAAAIgcAAIgCAAIgBgCIABgbIABgcIgBgkIAAgUIgBgCQAAAAAAAAQABgBAAAAQABAAAAAAQABAAABAAIAOAAIANgBQABAAAAAAQAAABAAAAQABABAAAAQAAABABABIAYA1QADAFABAAQABAAADgGIAZg0QABgBAAgBQAAAAABgBQAAAAAAgBQABAAAAAAIAIABIAHAAIAGgBIAHAAQAAAAABAAQAAAAABAAQAAABAAAAQAAAAAAABIgBAdIAAAdIAAAcIABAbQAAAAAAABQAAAAAAABQgBAAAAAAQgBAAAAAAIgeAAQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAgBIABgZIAAgZQAAAAAAgBQAAAAAAgBQAAAAAAAAQgBgBAAAAIgLAaIgMAeIgCACIgDAAgA1fC0IgTAAIgYAAIgLgBQgBAAAAAAQgBAAAAgBQAAAAAAAAQAAgBAAAAIAAgbIAAgcIAAgcIgBgdQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIAIAAIAHAAIAIAAIAJAAQAAAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAIAAACIgDAuIAAAWIAAAQIABACIABABIACAAIAWgBIAXAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAAAQAAAPgCAKQAAAAgBABQAAAAAAABQAAAAAAAAQgBAAAAAAIgDABIgTgBgAkZC0QgGgBgdAAIgTAAIgTAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIATAAIASAAIASAAIATAAQAEAAABADIABAMIABALQAAABAAAAQAAABgBAAQAAAAAAAAQAAAAgBAAIgCAAQgWgCgRAAQgFAAgBACIAAAHQAAAFACACQABACAEAAIADAAIAEgBIAVAAIAFgBIAEAAQABAAAAAAQABAAAAABQAAAAAAAAQAAABAAAAIgBANIgBANQAAABAAAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgIgBIgVgBIgJAAQgBAAgBAAQAAAAgBABQAAAAAAAAQgBABAAAAIAAAFIABAIQABADAJABIAMAAIAOgBIANgBQAAAAAAAAQABABAAAAQAAAAAAABQAAABAAAAIgBAOIgDAMQAAAAAAAAQgBABAAAAQAAAAgBAAQAAAAAAAAIgDAAgAp1C0QgGgBgdAAIgTAAIgTAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIATAAIASAAIASAAIATAAQAEAAABADIABAMIABALQAAABAAAAQAAABgBAAQAAAAAAAAQAAAAgBAAIgCAAQgWgCgRAAQgFAAgBACIAAAHQAAAFACACQABACAEAAIADAAIAEgBIAVAAIAFgBIAEAAQABAAAAAAQAAAAABABQAAAAAAAAQAAABAAAAIgBANIgBANQAAABAAAAQAAAAAAAAQgBABAAAAQgBAAAAAAIgIgBIgVgBIgJAAQgBAAgBAAQAAAAgBABQAAAAAAAAQgBABAAAAIAAAFIABAIQABADAJABIAMAAIAOgBIANgBQAAAAAAAAQABABAAAAQAAAAAAABQAAABAAAAIgBAOIgDAMQAAAAAAAAQgBABAAAAQAAAAgBAAQAAAAAAAAIgDAAgAUoCzQgBAAgBAAQAAAAgBgBQAAAAAAgBQgBAAAAgBQgDgMgBgBIgXgBIgPABQgBABgCAIQgBAHgDAAIgTABQgMAAAAgCQAAgDATgzIAWg8QAAgBAAgBQAAAAABAAQAAgBAAAAQABAAAAAAIAHAAIAHABIAGgBIAHAAQAAAAABAAQAAABABAAQAAAAAAABQABAAAAABIAYA8QATAzAAACQAAABAAAAQAAAAAAAAQgBABAAAAQAAAAgBAAIgPABIgPgBgAUIB1IgFAQQAAABAFAAIAJAAQAFAAABgBIAAgBIgEgPIgFgPIgGAPgAQfCzQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgPIABgsIAAgbIgBgaQAAgBAAAAQAAgBAAAAQABAAAAAAQAAAAABAAIAIAAIAHAAIAIAAIAIAAQAAAAABAAQAAAAAAAAQAAAAABABQAAAAAAABIgBAaIgBAbIABAdIAAAeQAAAAAAABQAAAAAAAAQAAABAAAAQAAAAgBAAIgCAAIgOABIgQgBgANfCzIgCAAIgBgCIgEgJIgKgZQgBgDgGgBIgIABQgBAAAAAAQAAAAAAABQgBAAAAABQAAABAAABIABARIABARIAAABIgDAAIgPABIgOgBQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgcIABgcQAAgjgBgTIgBgBQAAgBAAAAQABAAAAgBQAAAAABAAQABAAAAAAIAZgBIAZgBQATAAAMAJQANAJAAATQAAAMgDAHQgEAHgJAHQgBAAAAABQAAAAAAAAQgBABAAAAQAAAAAAABIAKAUQAKAVAAACQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgQABIgPgBgAM9BZIAAARIAAAFIAAAGIADABIAKAAQASAAAAgOQAAgKgGgEQgFgDgLAAQgIAAgBACgAJBC0IgQgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgcIABgcQAAgagDgcIAAgBQAAgBAAAAQABgBAAAAQAAAAABAAQAAAAABAAQAGgBAWAAIAZAAQAUABAMALQAMANAAATQAAAUgKANQgMANgTAAIgKAAIgKgBQgBAAgBAAQAAABgBAAQAAAAgBABQAAABAAAAIABAMIABALQAAAAAAABQgBAAAAAAQAAABAAAAQgBAAAAAAIgPAAgAJPBbIAAATIAAAHIAAAIQAAACAPAAQASAAAAgSQAAgUgTAAQgNAAgBACgAHaCzIgDAAIgBgCIgDgJIgKgZQgCgDgFgBIgJABQAAAAAAAAQgBAAAAABQAAAAAAABQAAABAAABIABARIABARIgBABIgCAAIgPABIgPgBQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgcIABgcQAAgjgCgTIAAgBQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAABAAIAZgBIAYgBQATAAAMAJQAOAJAAATQAAAMgEAHQgDAHgKAHQAAAAAAABQgBAAAAAAQAAABAAAAQAAAAAAABIAKAUQAKAVAAACQAAAAAAABQAAAAgBAAQAAAAAAAAQAAAAgBAAIgQABIgOgBgAG4BZIgBARIAAAFIABAGIACABIALAAQASAAAAgOQAAgKgHgEQgFgDgLAAQgIAAAAACgAFuCzQgBAAgBAAQAAAAgBgBQAAAAAAgBQgBAAAAgBQgDgMgBgBIgXgBIgPABQgBABgCAIQgBAHgDAAIgTABQgMAAAAgCQAAgDATgzIAWg8QAAgBAAgBQAAAAABAAQAAgBAAAAQABAAAAAAIAHAAIAHABIAGgBIAHAAQAAAAABAAQAAABABAAQAAAAAAABQABAAAAABIAYA8QATAzAAACQAAABAAAAQAAAAAAAAQgBABAAAAQAAAAgBAAIgPABIgPgBgAFOB1IgFAQQAAABAFAAIAJAAQAFAAABgBIAAgBIgEgPIgFgPIgGAPgABrCzQgBAAgBAAQAAAAgBgBQAAAAAAgBQgBAAAAgBQgDgMgBgBIgXgBIgPABQgBABgCAIQgBAHgDAAIgTABQgMAAAAgCQAAgDATgzIAWg8QAAgBAAgBQABAAAAAAQAAgBAAAAQABAAAAAAIAHAAIAHABIAGgBIAHAAQAAAAABAAQAAABABAAQAAAAAAABQAAAAABABIAYA8QATAzAAACQAAABAAAAQAAAAAAAAQgBABAAAAQAAAAgBAAIgPABIgPgBgABLB1IgFAQQAAABAFAAIAJAAQAFAAABgBIAAgBIgEgPIgFgPIgGAPgAg8C0IgQgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgcIABgcQAAgagDgcIAAgBQAAgBAAAAQABgBAAAAQAAAAABAAQAAAAABAAQAGgBAWAAIAZAAQAUABAKALQAMANAAATQAAAUgKANQgKANgTAAIgKAAIgKgBQgBAAgBAAQAAABgBAAQAAAAgBABQAAABAAAAIABAMIABALQAAAAAAABQgBAAAAAAQAAABAAAAQgBAAAAAAIgPAAgAguBbIAAATIAAAHIAAAIQAAACAPAAQASAAAAgSQAAgUgTAAQgNAAgBACgArqCzIgDAAIgBgCIgDgJIgKgZQgCgDgFgBIgJABQAAAAAAAAQgBAAAAABQAAAAAAABQAAABAAABIABARIABARIgBABIgCAAIgPABIgPgBQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgcIABgcQAAgjgCgTIAAgBQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAABAAIAZgBIAYgBQATAAAMAJQAOAJAAATQAAAMgEAHQgDAHgKAHQAAAAAAABQgBAAAAAAQAAABAAAAQAAAAAAABIAKAUQAKAVAAACQAAAAAAABQAAAAgBAAQAAAAAAAAQAAAAgBAAIgQABIgOgBgAsMBZIgBARIAAAFIABAGIACABIALAAQASAAAAgOQAAgKgHgEQgFgDgLAAQgIAAAAACgAwJC0IgPgBQgBAAAAAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIAAgcIAAgcQAAgagCgcIAAgBQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAQAHgBAWAAIAZAAQAUABAMALQAMANAAATQAAAUgLANQgLANgUAAIgKAAIgKgBQgBAAAAAAQgBABAAAAQgBAAAAABQAAABAAAAIAAAMIABALQAAAAAAABQAAAAAAAAQAAABgBAAQAAAAgBAAIgPAAgAv6BbIgBATIABAHIAAAIQAAACAPAAQASAAAAgSQAAgUgTAAQgNAAgBACgAqpA8QAAAAAAAAQgBAAAAgBQAAAAAAAAQAAAAAAgBIAAgCIAAgCIAAgDIgBgDIACgCIAQgIIAPgLIACgBIABABIAGAFIAHAFIABABIgBACQgHAHgPAGQgOAGgKABgA0hgtQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgA0KhtQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgA2MgtQgQgRAAgaQAAgZAQgSQAQgSAYAAQAbAAAQARIABADIgFAMIgIALIgBABIgFgEIgIgGQgHgDgHAAQgMAAgIAJQgGAIAAANQAAAMAGAJQAIAJAMAAQAHAAAHgDIAIgGIAEgDIACABIAHAKIAGAKIgBAEQgQASgZAAQgaAAgQgSgAODgcQgEAAgBgCIgMgaIgMgbIAAgBIgBADIAAAYIABAYQAAABAAABQgBAAAAABQAAAAAAAAQgBAAAAAAIgcAAIgCAAIgBgCIABgbIABgcIgBgkIAAgUIgBgCQAAAAAAAAQABgBAAAAQABAAAAAAQABAAABAAIAOAAIANgBQAAAAABAAQAAABAAAAQABABAAAAQAAABABABIAYA1QADAFABAAQABAAADgGIAZg0QABgBAAgBQAAAAABgBQAAAAAAgBQABAAAAAAIAIABIAHAAIAGgBIAHAAQAAAAABAAQAAAAABAAQAAABAAAAQAAAAAAABIgBAdIAAAdIAAAcIABAbQAAAAAAABQAAAAAAABQgBAAAAAAQgBAAAAAAIgeAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAgBIABgZIAAgZQAAAAAAgBQAAAAAAgBQAAAAAAAAQgBgBAAAAIgLAaIgMAeIgCACIgDAAgALwgdIgTAAIgZAAIgLgBQAAAAgBAAQAAAAAAgBQgBAAAAAAQAAgBAAAAIAAgbIABgcIgBgcIgBgdQAAgBAAAAQABAAAAgBQAAAAABAAQAAAAABAAIAHAAIAIAAIAIAAIAIAAQABAAAAAAQAAAAAAAAQAAAAAAABQAAAAAAAAIAAACIgCAuIAAAWIAAAQIAAACIABABIACAAIAXgBIAWAAQABAAAAAAQAAAAABAAQAAAAAAABQAAAAAAAAQAAAPgCAKQAAAAAAABQAAAAAAABQgBAAAAAAQAAAAAAAAIgEABIgSgBgAxygcQgEAAgBgCIgLgaIgMgbIgBgBIAAADIAAAYIAAAYQAAABAAABQAAAAAAABQgBAAAAAAQAAAAgBAAIgcAAIgCAAIAAgCIABgbIABgcIgBgkIgBgUIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAOAAIAOgBQAAAAAAAAQABABAAAAQAAABABAAQAAABAAABIAZA1QACAFACAAQABAAADgGIAZg0QAAgBAAgBQABAAAAgBQABAAAAgBQAAAAABAAIAHABIAHAAIAHgBIAGAAQABAAAAAAQABAAAAAAQAAABABAAQAAAAAAABIgBAdIgBAdIABAcIABAbQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgdAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAgBIABgZIABgZQAAAAAAgBQAAAAgBgBQAAAAAAAAQAAgBAAAAIgLAaIgMAeIgCACIgEAAgAKigdQgGgBgeAAIgTAAIgTAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIASAAIATAAIASAAIASAAQAEAAABADIABAMIABALQAAABAAAAQAAAAAAABQAAAAgBAAQAAAAAAAAIgCAAQgWgCgSAAQgEAAgBACIgBAHQAAAFACACQABACAEAAIAEAAIAEgBIAVAAIAEgBIAFAAQAAAAABAAQAAABAAAAQABAAAAAAQAAABAAAAIgCANIAAANQAAABAAAAQgBAAAAAAQAAABgBAAQAAAAgBAAIgHgBIgWgBIgJAAQAAAAgBAAQgBABAAAAQgBAAAAAAQAAABAAAAIgBAFIABAIQACADAJABIAMAAIANgBIANgBQABAAAAAAQAAABAAAAQABAAAAABQAAAAAAABIgCAOIgCAMQAAAAgBAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAgATOgeQAAAAgBAAQgBAAAAgBQgBAAAAgBQAAgBAAAAQgDgMgCgBIgWgBIgPABQgCABgBAIQgCAHgCAAIgTABQgNAAAAgCQAAgDATgzIAWg8QABgBAAgBQAAAAAAgBQAAAAABAAQAAAAAAAAIAHAAIAHABIAHgBIAGAAQABAAAAAAQABABAAAAQAAAAABABQAAAAAAABIAYA8QAUAzAAACQAAABAAAAQAAAAgBABQAAAAAAAAQgBAAAAAAIgQABIgPgBgASuhcIgEAQQAAABAFAAIAIAAQAGAAAAgBIAAgBIgDgPIgGgPIgGAPgARbgeIgGAAQgBAAAAAAQAAgBgBAAQAAAAgBgBQAAAAgBgBIgagkIgSgWIgBgBIgBACIABAcIAAAdQAAABAAABQAAAAAAABQAAAAgBAAQAAAAgBAAIgdAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgbIABgcIgBgcIgBgdQAAAAAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAMgBIAHgBIAGgBIADADIAfAqIANARQAAABABAAQAAABABAAQAAAAAAABQABAAAAAAQABAAAAgHIAAgaIgBgaQAAgBAAgBQAAAAAAAAQAAgBABAAQAAAAAAAAIAPgBIAPAAQABAAAAAAQAAAAAAAAQABABAAAAQAAABAAAAIgBAdIgBAcIAAA3QAAABAAAAQAAABAAAAQgBAAAAAAQgBAAAAAAIgGAAIgGABIgHgBgAPSgeQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgPIABgsIAAgbIgBgaQAAgBAAAAQAAAAAAgBQAAAAABAAQAAAAABAAIAIAAIAHAAIAIAAIAIAAQAAAAABAAQAAAAAAAAQABABAAAAQAAAAAAABIgBAaIgBAbIABAdIAAAeQAAAAAAABQAAAAAAAAQAAAAAAABQgBAAAAAAIgCAAIgOABIgQgBgAMVgeQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgPIACgsIgBgbIgBgaQAAgBAAAAQAAAAABgBQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAHAAQABAAAAAAQAAAAABAAQAAABAAAAQAAAAAAABIAAAaIgBAbIAAAdIABAeQAAAAAAABQAAAAAAAAQgBAAAAABQAAAAAAAAIgCAAIgPABIgPgBgAICgeQgBAAAAAAQgBAAAAgBQgBAAAAgBQAAgBAAAAQgDgMgCgBIgWgBIgPABQgCABgBAIQgCAHgCAAIgTABQgNAAAAgCQAAgDATgzIAWg8QAAgBABgBQAAAAAAgBQAAAAABAAQAAAAAAAAIAHAAIAHABIAHgBIAGAAQABAAAAAAQABABAAAAQAAAAABABQAAAAAAABIAYA8QAUAzAAACQAAABAAAAQgBAAAAABQAAAAAAAAQgBAAAAAAIgQABIgPgBgAHihcIgEAQQAAABAFAAIAIAAQAGAAAAgBIAAgBIgDgPIgGgPIgGAPgAGMgeIgDAAIgBgCIgDgJIgKgZQgCgDgFgBIgJABQAAAAAAAAQgBAAAAABQAAAAAAABQAAABAAABIABARIABARIgBABIgCAAIgPABIgPgBQAAAAgBAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIABgcIABgcQAAgjgCgTIAAgBQAAgBAAAAQAAAAAAAAQABgBAAAAQABAAABAAIAZgBIAYgBQATAAAMAJQAOAJAAATQAAAMgEAHQgDAHgKAHQAAABAAAAQgBAAAAAAQAAABAAAAQAAAAAAABIAKAUQAKAVAAACQAAABAAAAQAAAAgBAAQAAAAAAAAQAAAAgBAAIgQABIgOgBgAFqh4IgBARIAAAFIABAGIACABIALAAQASAAAAgOQAAgKgHgEQgFgDgLAAQgIAAAAACgAEggeQgBAAgBAAQAAAAgBgBQAAAAAAgBQgBgBAAAAQgDgMgBgBIgXgBIgPABQgBABgCAIQgBAHgDAAIgTABQgMAAAAgCQAAgDATgzIAWg8QAAgBAAgBQABAAAAgBQAAAAAAAAQABAAAAAAIAHAAIAHABIAGgBIAHAAQAAAAABAAQAAABAAAAQABAAAAABQAAAAABABIAYA8QATAzAAACQAAABAAAAQAAAAAAABQgBAAAAAAQAAAAgBAAIgPABIgPgBgAEAhcIgFAQQAAABAFAAIAJAAQAFAAABgBIAAgBIgEgPIgFgPIgGAPgAB3gdIgQgBQAAAAgBAAQAAAAAAAAQgBgBAAAAQAAgBAAAAIAAgcIABgcQAAgagDgcIAAgBQAAgBAAAAQABAAAAgBQAAAAABAAQAAAAABAAQAGgBAWAAIAZAAQAUABAMALQAMANAAATQAAAUgKANQgMANgTAAIgKAAIgKgBQgBAAgBAAQAAABgBAAQAAAAgBABQAAAAAAABIABAMIABALQAAAAAAABQAAAAgBAAQAAABAAAAQgBAAAAAAIgPAAgACFh2IAAATIAAAHIAAAIQAAACAPAAQASAAAAgSQAAgUgTAAQgNAAgBACgAT2hFIADgMIAEgMIACgBIAJAAIAKABIAXgCIAHgBQABAAAAAAQABAAAAAAQAAABAAAAQAAABAAAAIgBAHIgCAHIgCAMQAAAAAAAAQAAAAAAAAQgBABAAAAQAAAAgBAAIgJAAIgKAAIgXABIgFABIgEABQgBAAAAgBQAAAAgBAAQAAgBAAgBQAAgBAAgBgASliVQgBAAAAAAQAAAAAAAAQgBAAAAgBQAAAAAAAAIAAgDIAAgCIAAgDIAAgDIACgCIAPgIIAQgLIABgBIACABIAGAGIAHAEIABACIgBACQgHAGgPAHQgPAGgKAAgAkvjgQgFgFAAgCIADgEIAGgIQADgGAAgGIAAgEIAAgDIABgDIAOgEIAOgDQABAAABAAQAAAAABABQAAAAABABQAAAAAAABQAAAXgRAQIgIAGQgHAFgCAAIgGgFgARZj4QgHgMAAgCQAAAAAAgBQAAAAABAAQAAAAAAAAQAAAAABAAIAQgFQAIgEAAgJQAAgFgFgHIgLgMQgGgJAAgLQAAgPAOgKQAMgIAQgDIACAAQAAAAAAAAQABAAAAABQAAAAAAAAQABABAAAAIAKAWIAAABQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgDAAIgCAAQgGAAgFADQgFADAAAFQAAAGAGAHIALAOQAGAJAAAJQAAARgOAMQgNALgRACIgCABQgBAAgHgMgAG1j4QgGgMAAgCQAAAAAAgBQAAAAAAAAQAAAAABAAQAAAAAAAAIAQgFQAJgEAAgJQAAgFgGgHIgLgMQgFgJAAgLQAAgPAOgKQALgIARgDIABAAQABAAAAAAQAAAAAAABQABAAAAAAQAAABAAAAIAKAWIABABQAAAAAAABQAAAAgBAAQAAAAAAAAQAAAAgBAAIgCAAIgDAAQgGAAgEADQgFADAAAFQAAAGAGAHIALAOQAFAJAAAJQAAARgOAMQgMALgSACIgBABQgCAAgHgMgAPkkAQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgAP7lAQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAN6kAQgQgRAAgaQAAgZAPgSQAQgSAZAAQAbAAAPARIACADIgGAMIgHALIgCABIgEgEIgJgGQgGgDgHAAQgNAAgHAJQgHAIAAANQAAAMAHAJQAHAJANAAQAHAAAGgDIAJgGIAEgDIACABIAHAKIAGAKIgCAEQgPASgZAAQgaAAgQgSgAL7kAQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAMSlAQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgAFBkAQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAFYlAQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgAvskAQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgAvVlAQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgA0hkAQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgA0KlAQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgA2MkAQgQgRAAgaQAAgZAQgSQAQgSAYAAQAbAAAQARIABADIgFAMIgIALIgBABIgFgEIgIgGQgHgDgHAAQgMAAgIAJQgGAIAAANQAAAMAGAJQAIAJAMAAQAHAAAHgDIAIgGIAEgDIACABIAHAKIAGAKIgBAEQgQASgZAAQgaAAgQgSgABLjxQgOgEgFgMQgCgGAAgOIABgKIAAgLIgBgcIgBgdQAAgBAAAAQAAgBAAAAQAAAAABAAQAAAAABAAIAPAAIAPABQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIAAAhIgBAhQAAANADAFQADAGAMAAQARAAAAgRIgBgkIAAgkQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAABAAIAPgBIAPAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAABIgBAdIgBAcIAAAJIAAAHQAAAWgFAHQgJAOglAAQgRAAgJgCgAg0kAQgRgRAAgZQAAgbAQgRQAQgSAaAAQALAAALAFQAMAFAHAKIABADQAAACgHAKQgHAJgDAAIgDgEQgEgEgFgCQgEgDgIAAQgMAAgHAJQgHAJAAAMQAAAOAHAIQAHAIANAAQAJAAAIgEIgBgOIgBgOIABgCIABAAIAIAAIAHABIAIgBIAIAAQAAAAABAAQAAAAAAAAQABABAAAAQAAABAAABIgBAMIAAAMIACAgIAAABQAAAAAAABQgBAAAAAAQAAABgBAAQAAAAgBAAIgJgCIgJgCQgRAGgOAAQgaAAgQgRgALKjwIgTAAIgYAAIgLgBQgBAAAAAAQAAAAgBgBQAAAAAAAAQAAgBAAAAIAAgbIAAgcIAAgcIgBgdQAAgBAAAAQAAgBAAAAQABAAAAAAQABAAAAAAIAIAAIAHAAIAIAAIAJAAQAAAAAAAAQAAAAAAAAQABAAAAABQAAAAAAAAIAAACIgDAuIAAAWIAAAQIABACIABABIACAAIAWgBIAXAAQAAAAABAAQAAAAAAAAQABAAAAABQAAAAAAAAQAAAPgCAKQAAAAgBABQAAAAAAABQAAAAAAAAQAAAAgBAAIgDABIgTgBgAiXjwIgTAAIgZAAIgLgBQAAAAgBAAQAAAAAAgBQAAAAgBAAQAAgBAAAAIAAgbIABgcIgBgcIgBgdQAAgBAAAAQABgBAAAAQAAAAABAAQAAAAABAAIAHAAIAIAAIAIAAIAIAAQAAAAABAAQAAAAAAAAQAAAAAAABQAAAAAAAAIAAACIgCAuIAAAWIAAAQIAAACIABABIACAAIAXgBIAWAAQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAQAAAPgCAKQAAAAAAABQAAAAAAABQgBAAAAAAQAAAAAAAAIgEABIgSgBgAxyjvQgEAAgBgCIgLgaIgMgbIgBgBIAAADIAAAYIAAAYQAAABAAABQAAAAAAABQgBAAAAAAQAAAAgBAAIgcAAIgCAAIAAgCIABgbIABgcIgBgkIgBgUIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAOAAIAOgBQAAAAAAAAQABABAAAAQAAABABAAQAAABAAABIAZA1QACAFACAAQABAAADgGIAZg0QAAgBAAgBQABAAAAgBQABAAAAgBQAAAAABAAIAHABIAHAAIAHgBIAGAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIgBAdIgBAdIABAcIABAbQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgdAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAgBIABgZIABgZQAAAAAAgBQAAAAgBgBQAAAAAAAAQAAgBAAAAIgLAaIgMAeIgCACIgEAAgAJQjwIgGAAQgeAAgGgBQgBAAAAgBQgBAAAAAAQAAAAAAgBQAAAAAAgBIABgbIABgbIgBgkIgBgUIAAgBQAAgBAAAAQAAAAAAgBQABAAAAAAQABAAAAAAIATgBIAfABQAVAAAKAGQAMAIAAATQAAAFgDAFIgFAIIgDADIACACQAGADADAIQADAGAAAHQAAAQgKAKQgKALgcAAIgGAAgAJGkgQgBABAAAJQAAAKABABQABABALAAQAJAAAEgBQAGgDAAgHQAAgHgGgDQgEgCgJAAQgLAAgBABgAJFlNIAAAFIAAAFQAAAIABABIAKABQASAAAAgKQAAgHgHgDQgEgBgJAAQgJAAAAABgAD1jwQgGgBgeAAIgTAAIgTAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAgBAAAAQAAAAABAAQAAAAABAAIASAAIATAAIASAAIASAAQAEAAABADIABAMIABALQAAABAAAAQAAABAAAAQAAAAgBAAQAAAAAAAAIgCAAQgWgCgSAAQgEAAgBACIgBAHQAAAFACACQABACAEAAIAEAAIAEgBIAVAAIAEgBIAFAAQAAAAABAAQAAAAAAABQAAAAABAAQAAABAAAAIgCANIAAANQAAABAAAAQgBAAAAAAQAAABgBAAQAAAAgBAAIgHgBIgWgBIgJAAQAAAAgBAAQgBAAAAABQgBAAAAAAQAAABAAAAIgBAFQAAAGABACQACADAJABIAMAAIANgBIANgBQABAAAAAAQAAABAAAAQABAAAAABQAAABAAAAIgCAOIgCAMQgBAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAgAhyjxQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgPIACgsIgBgbIgBgaQAAgBAAAAQABgBAAAAQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAHAAQABAAAAAAQABAAAAAAQAAAAAAABQAAAAAAABIAAAaIgBAbIAAAdIABAeQAAAAAAABQAAAAgBAAQAAABAAAAQAAAAAAAAIgCAAIgPABIgPgBgAl7qeQgHgMAAgCQAAAAAAgBQAAAAABAAQAAAAAAAAQAAAAABAAIAQgFQAIgEAAgJQAAgFgFgHIgLgMQgGgJAAgLQAAgPAOgKQAMgIAQgDIACAAQAAAAAAAAQABAAAAABQAAAAAAAAQABABAAAAIAKAWIAAABQAAAAAAABQAAAAAAAAQAAAAgBAAQAAAAAAAAIgDAAIgCAAQgGAAgFADQgFADAAAFQAAAGAGAHIALAOQAGAJAAAJQAAARgOAMQgNALgRACIgCABQgBAAgHgMgAnwqmQgQgRAAgaQAAgaAQgRQARgSAaAAQAZAAASASQAQARAAAaQAAAagQASQgRARgaAAQgaAAgRgSgAnZrmQgIAJAAAMQAAANAIAIQAHAJANAAQAMAAAIgJQAIgJAAgMQAAgMgIgJQgIgJgMAAQgMAAgIAJgAtFqmQgQgRAAgaQAAgZAPgSQAQgSAZAAQAbAAAPARIACADIgGAMIgHALIgCABIgEgEIgJgGQgGgDgHAAQgNAAgHAJQgHAIAAANQAAAMAHAJQAHAJANAAQAHAAAGgDIAJgGIAEgDIACABIAHAKIAGAKIgCAEQgPASgZAAQgaAAgQgSgA0hqmQgRgRAAgaQAAgaARgRQARgSAaAAQAZAAARASQARARAAAaQAAAagRASQgRARgZAAQgaAAgRgSgA0KrmQgIAJAAAMQAAANAHAIQAIAJANAAQALAAAIgJQAIgJAAgMQAAgMgHgJQgIgJgMAAQgMAAgIAJgA2MqmQgQgRAAgaQAAgZAQgSQAQgSAYAAQAbAAAQARIABADIgFAMIgIALIgBABIgFgEIgIgGQgHgDgHAAQgMAAgIAJQgGAIAAANQAAAMAGAJQAIAJAMAAQAHAAAHgDIAIgGIAEgDIACABIAHAKIAGAKIgBAEQgQASgZAAQgaAAgQgSgAkqqZQgEgFAAgGQAAgHAEgEQAFgFAGAAQAGAAAFAFQAEAEAAAHQAAAGgEAFQgFAEgGAAQgGAAgFgEgApLqVQgEAAgBgCIgLgaIgMgbIgBgBIAAADIAAAYIAAAYQAAABAAABQAAAAAAABQgBAAAAAAQAAAAgBAAIgcAAIgCAAIAAgCIABgbIABgcIgBgkIgBgUIAAgCQAAAAAAAAQAAgBABAAQAAAAABAAQAAAAABAAIAOAAIAOgBQAAAAAAAAQABABAAAAQAAABABAAQAAABAAABIAZA1QACAFACAAQABAAADgGIAZg0QAAgBAAgBQABAAAAgBQABAAAAgBQAAAAABAAIAHABIAHAAIAHgBIAGAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIgBAdIgBAdIABAcIABAbQAAAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAIgdAAQgBAAAAAAQgBAAAAAAQAAgBgBAAQAAgBAAgBIABgZIABgZQAAAAAAgBQAAAAgBgBQAAAAAAAAQAAgBAAAAIgLAaIgMAeIgCACIgEAAgAqcqWQgGgBgeAAIgTAAIgTAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAgBAAAAQAAAAABAAQAAAAABAAIASAAIATAAIASAAIASAAQAEAAABADIABAMIABALQAAABAAAAQAAABAAAAQAAAAgBAAQAAAAAAAAIgCAAQgWgCgSAAQgEAAgBACIgBAHQAAAFACACQABACAEAAIAEAAIAEgBIAVAAIAEgBIAFAAQAAAAABAAQAAAAAAABQAAAAABAAQAAABAAAAIgCANIAAANQAAABAAAAQgBAAAAAAQAAABgBAAQAAAAgBAAIgHgBIgWgBIgJAAQgBAAAAAAQgBABAAAAQgBAAAAAAQAAABAAAAIgBAFIABAIQACADAJABIAMAAIANgBIANgBQABAAAAAAQAAABAAAAQABAAAAABQAAABAAAAIgCAOIgCAMQAAAAgBAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAgAtmqWQgGgBgeAAIgTAAIgTAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgcIABgcIgBgjIgBgUIAAgBQAAgBAAAAQAAgBAAAAQAAAAABAAQAAAAABAAIASAAIATAAIASAAIASAAQAEAAABADIABAMIABALQAAABAAAAQAAABAAAAQAAAAgBAAQAAAAAAAAIgCAAQgWgCgSAAQgEAAgBACIgBAHQAAAFACACQABACAEAAIAEAAIAEgBIAVAAIAEgBIAFAAQAAAAABAAQAAAAAAABQAAAAABAAQAAABAAAAIgCANIAAANQAAABAAAAQgBAAAAAAQAAABgBAAQAAAAgBAAIgHgBIgWgBIgJAAQAAAAgBAAQgBABAAAAQgBAAAAAAQAAABAAAAIgBAFIABAIQACADAJABIAMAAIANgBIANgBQABAAAAAAQAAABAAAAQABAAAAABQAAABAAAAIgCAOIgCAMQgBAAAAAAQAAABAAAAQgBAAAAAAQAAAAgBAAIgCAAgAviqXQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAAAAAgBIABgUIAAgTQAAgBAAgBQAAgBAAAAQgBgBAAAAQAAAAgBAAIgUgBIgUABQgBAAAAAAQAAAAAAABQgBAAAAABQAAABAAABIABATIAAATQAAABAAAAQAAABgBAAQAAABAAAAQgBAAAAAAIgQABIgOgBQgBAAAAAAQgBAAAAgBQAAAAgBAAQAAgBAAAAIABgbIABgcIgBgcIgBgdQAAgBAAAAQABgBAAAAQAAAAAAAAQABAAAAAAIAIAAIAIAAIAIAAIAIAAQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIgBATIgBATQAAAAAAABQAAAAABABQAAAAAAAAQAAABABAAQACABATAAQASAAADgBQAAAAABgBQAAAAAAAAQABgBAAAAQAAgBAAAAIgBgSIAAgTQAAAAAAgBQAAAAAAgBQABAAAAAAQAAAAABAAIAHAAIAHAAIAIAAIAHAAQABAAAAAAQABAAAAAAQAAAAABABQAAAAAAABIgBAdIgBAcIABAcIABAbIgBACIgCAAIgPABIgPgBgAxXqXIgGAAQgBAAAAAAQAAgBgBAAQAAAAgBgBQAAAAgBgBIgagkIgSgWIgBgBIgBACIABAcIAAAdQAAABAAABQAAAAAAABQgBAAAAAAQAAAAgBAAIgdAAQAAAAgBAAQAAAAgBAAQAAgBAAAAQAAgBAAAAIABgbIABgcIgBgcIgBgdQAAAAAAAAQABgBAAAAQAAAAABAAQABAAAAAAIAMgBIAHgBIAGgBIADADIAfAqIANARQAAABABAAQAAABABAAQAAAAAAABQABAAAAAAQABAAAAgHIAAgaIgBgaQAAgBAAgBQAAAAAAgBQAAAAABAAQAAAAAAAAIAPgBIAPAAQABAAAAAAQAAAAAAAAQABABAAAAQAA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");
	this.shape_2.setTransform(-173.2,-1.3);

	// Layer 1
	this.dificil_btn = new lib.dificil_btn();
	this.dificil_btn.setTransform(280.5,194.4);
	new cjs.ButtonHelper(this.dificil_btn, 0, 1, 2, false, new lib.dificil_btn(), 3);

	this.facil_btn = new lib.facil_btn();
	this.facil_btn.setTransform(-281,194.4);
	new cjs.ButtonHelper(this.facil_btn, 0, 1, 2, false, new lib.facil_btn(), 3);

	this.voltar_btn = new lib.botaoReiniciar();
	this.voltar_btn.setTransform(0.1,195.4,1.309,1.309);
	new cjs.ButtonHelper(this.voltar_btn, 0, 1, 2, false, new lib.botaoReiniciar(), 3);

	this.tutorial_mc = new lib.instrucoesAnime_mc();
	this.tutorial_mc.setTransform(148.5,-4.5);

	this.instance = new lib.caixa_mc();

	this.addChild(this.instance,this.tutorial_mc,this.voltar_btn,this.facil_btn,this.dificil_btn,this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-380.3,-277.5,760.9,555.2);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;