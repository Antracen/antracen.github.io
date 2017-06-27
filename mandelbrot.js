var xMin;
var xMax;
var yMin;
var yMax;

function setup(){
	canvas = createCanvas(500, 300);
	xMin = -2.5;
	xMax = 1;
	yMin = -1;
	yMax = 1;
	go();
}

function Complex(a, b){
	this.a = a;
	this.b = b;
	this.square = function(){
		this.newA = this.a*this.a - this.b*this.b;
		this.newB = 2*this.a*this.b;
		this.a = this.newA;
		this.b = this.newB;
	}
	// |z|
	this.value = function(){
		return this.a*this.a+this.b*this.b
	}
	this.add = function(complexNum){
		this.a += complexNum.a;
		this.b += complexNum.b;
	}
}

function go(){
	console.log("GO");
	for(var px = 0; px < canvas.width; px++){
		for(var py = 0; py < canvas.height; py++){
			var c = new Complex(map(px, 0, canvas.width, xMin, xMax), map(py, 0, canvas.height, yMin, yMax));
			var z = new Complex(0,0);
			var iteration = 0
			var max_iteration = 100
			while(z.value() < 100 && iteration < max_iteration){
				z.square();
				z.add(c);
				iteration++;
			}
			var color = map(iteration, 0, 100, 0, 255);
			//stroke(color);
			var r = color*14%255;
			var g = color*11%255;
			var b = color*10%255;
			stroke(r,g,b);
			point(px, py);
		}
	}
}
