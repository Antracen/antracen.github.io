var img;
var points;
var initialized;

function preload(){
	img = loadImage("cow.png");
}

function setup(){
	// Canvas
	createCanvas(500, 500);
	// Other
	initialized = false;
	points = [];
}

function Complex(a, b, color){
	this.a = a;
	this.b = b;
	this.color = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
	this.render = function(){
		fill(color);
		stroke(color);
		rect(this.a + canvas.width/2, this.b + canvas.height/2, 5, 5);
	}
}

function complexAdd(a, ba, bb){
	a.a += ba;
	a.b += bb;
}

function complexMult(a, ba, bb){
	a.a = a.a*ba - a.b*bb;
	a.b = a.a*bb+a.b*ba;
}

function draw(){

	if(!initialized){
		background("white");
		image(img, canvas.width/2 - img.width/2, canvas.height/2 - img.height/2);		
		for(var i = 0; i < canvas.width; i+=5){
			for(var j = 0; j < canvas.height; j+=5){
				var color = get(i,j);
				if(color[0] == 255 && color[1] == 255 && color[2] == 255){
					continue;
				}
				points.push(new Complex(i - canvas.width/2, j - canvas.height/2, get(i,j)));
			}
		}
		initialized = true;
		console.log("INITALIZED");
	}
	update();
	background("white");
	for(var i in points){
		points[i].render();
	}
	
}

function update(){

	// Scale
	if(keyIsDown(UP_ARROW)){
		for(var i in points){
			complexMult(points[i], 1.1, 0);
		}
	}
	if(keyIsDown(DOWN_ARROW)){
		for(var i in points){
			complexMult(points[i], 0.9, 0);
		}
	}

	// Rotate
	if(keyIsDown(RIGHT_ARROW)){
		for(var i in points){
			complexMult(points[i], Math.cos(0.03*Math.PI), Math.sin(0.03*Math.PI));
		}
	}
	if(keyIsDown(LEFT_ARROW)){
		for(var i in points){
			complexMult(points[i], Math.cos(-0.03*Math.PI), Math.sin(-0.03*Math.PI));
		}
	}

	// Move
	if(keyIsDown(87)){
		for(var i in points){
			complexAdd(points[i], 0, -1);
		}
	}
	if(keyIsDown(83)){
		for(var i in points){
			complexAdd(points[i], 0, 1);
		}
	}
	if(keyIsDown(65)){
		for(var i in points){
			complexAdd(points[i], -3, 0);
		}
	}
	if(keyIsDown(68)){
		for(var i in points){
			complexAdd(points[i], 3, 0);
		}
	}
}
