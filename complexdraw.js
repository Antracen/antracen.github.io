var complex;

function setup(){
		// Canvas
		createCanvas(500, 500);
		// Other
		points = [];
}

function update(){
	
	if(mouseIsPressed){
		points.push(new Complex(mouseX - canvas.width/2, mouseY - canvas.height/2));
	}

	// Rotate
	if(keyIsDown(RIGHT_ARROW)){
		for(var i in points){
			points[i] = complexmult(points[i], new Complex(Math.cos(0.01*Math.PI), Math.sin(0.01*Math.PI)));
		}
	}
	if(keyIsDown(LEFT_ARROW)){
		for(var i in points){
			points[i] = complexmult(points[i], new Complex(Math.cos(-0.01*Math.PI), Math.sin(-0.01*Math.PI)));
		}
	}

	// Scale
	if(keyIsDown(UP_ARROW)){
		for(var i in points){
			points[i] = complexmult(points[i], new Complex(1.01, 0));
		}
	}
	if(keyIsDown(DOWN_ARROW)){
		for(var i in points){
			points[i] = complexmult(points[i], new Complex(0.99, 0));
		}
	}

	// Move
	if(keyIsDown(87)){
		for(var i in points){
			points[i] = complexadd(points[i], new Complex(0, -1));
		}
	}
	if(keyIsDown(83)){
		for(var i in points){
			points[i] = complexadd(points[i], new Complex(0, 1));
		}
	}
	if(keyIsDown(65)){
		for(var i in points){
			points[i] = complexadd(points[i], new Complex(-1, 0));
		}
	}
	if(keyIsDown(68)){
		for(var i in points){
			points[i] = complexadd(points[i], new Complex(1, 0));
		}
	}
}

function draw(){
	update();
	background("white");
	var img = loadImage("cow.png");
	image(img, 100, 100);
}

function Complex(a, b){
	this.a = a;
	this.b = b;
	this.render = function(){
		stroke("black");
		strokeWeight(3);
		point(canvas.width/2 + this.a, canvas.height/2 + this.b);
	}
}

function complexadd(a, b){
	return new Complex(a.a+b.a, a.b+b.b);
}

function complexmult(a,b){
	return new Complex(a.a*b.a - a.b*b.b, a.a*b.b+a.b*b.a);
}

function keyPressed(){
	// Mirror
	if (keyCode === 32) {
		for(var i in points){
			points[i] = complexmult(points[i], new Complex(-1, 0));
		}
	}
}
