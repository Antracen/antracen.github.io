var z = 1;
var lines = [];
var points = [];
var walls = [];

function setup(){
	var xSize = 200;
	var ySize = 200;
	var canvas = createCanvas(xSize, ySize);
	canvas.position(100, 300);
	frameRate(50);
	
	// FRONT WALL POINTS
	points.push(new PolarPoint(-10, -100, -100)); // TOP LEFT
	points.push(new PolarPoint(-10, 100, -100)); // TOP RIGHT
	points.push(new PolarPoint(-10, -100, 100)); // BOTTOM LEFT
	points.push(new PolarPoint(-10, 100, 100)); // BOTTOM RIGHT
	
	// RIGHT WALL POINTS
	points.push(new PolarPoint(-13, 100, -100)); // TOP RIGHT
	points.push(new PolarPoint(-13, 100, 100)); // BOTTOM RIGHT
	
	// FRONT WALL LINES
	lines.push(new Line(0,1)); // TOP
	lines.push(new Line(0,2)); // LEFT
	lines.push(new Line(1,3)); // RIGHT
	lines.push(new Line(2,3)); // DOWN
	
	// RIGHT WALL LINES
	lines.push(new Line(1, 4)); // TOP
	lines.push(new Line(3,5)); // BOTTOM
	lines.push(new Line(4,5)); // RIGHT
	
	walls.push(new Wall(0,1,2,3));
	walls.push(new Wall(2,4,5,6));
}

function draw(){
	background(200);

	if(keyIsDown(87)){ // W
		for(var p of points){
			p.changeX(0.04);
		}
	}
	else if(keyIsDown(83)){ // S
		for(var p of points){
			p.changeX(-0.04);
		}			
	}
	if(keyIsDown(65)){ // A
		for(var p of points){
			p.changeY(1);
		}			
	}
	else if(keyIsDown(68)){ // D
		for(var p of points){
			p.changeY(-1);
		}			
	}
	
	if(keyIsDown(LEFT_ARROW)){
		for(var p of points){
			p.rotate(-0.002);
		}
	}
	else if(keyIsDown(RIGHT_ARROW)){
		for(var p of points){
			p.rotate(0.002);
		}
	}
	for(var w of walls) w.render();
}

function PolarPoint(x, y, z){
	this.len = sqrt(x*x + y*y + z*z);
	this.phi = acos(z/this.len);
	this.theta = atan2(y,x);
	
	this.checkTheta = function(){
		while(this.theta < 0) this.theta += 2*PI;
		while(this.theta > 2*PI) this.theta -= 2*PI;
	}
	
	this.checkPhi = function(){
		while(this.phi < 0) this.phi += 2*PI;
		while(this.phi > PI) this.phi -= 2*PI;
	}
	
	this.angleCheck = function(){
		this.checkTheta();
		this.checkPhi();
	}
	
	this.angleCheck();
	
	this.getX = function(){
		return this.len * sin(this.phi) * cos(this.theta);
	}
	this.getY = function(){
		return this.len * sin(this.phi) * sin(this.theta);
	}
	this.getZ = function(){
		return this.len * cos(this.phi);
	}
	
	this.changeX = function(value){
		var x = this.getX();
		var y = this.getY();
		var z = this.getZ();
		x += value;
		this.len = sqrt(x*x + y*y + z*z);
		this.phi = acos(z/this.len);
		this.theta = atan2(y,x);
		this.angleCheck();
	}
	
	this.changeY = function(value){
		var x = this.getX();
		var y = this.getY();
		var z = this.getZ();
		y += value;
		this.len = sqrt(x*x + y*y + z*z);
		this.phi = acos(z/this.len);
		this.theta = atan2(y,x);
		this.angleCheck();
	}
	
	this.rotate = function(dir){
		this.theta += dir;
		this.checkTheta();
		console.log(this.theta);
	}
}

function Line(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
}

function Wall(l1, l2, l3, l4){

	this.lines = [l1,l2,l3,l4];

	this.render = function(){
		for(var l of this.lines){
			line(100 + points[lines[l].p1].getY()/-points[lines[l].p1].getX(), 100 + points[lines[l].p1].getZ()/-points[lines[l].p1].getX(), 100+points[lines[l].p2].getY()/-points[lines[l].p2].getX(), 100+points[lines[l].p2].getZ()/-points[lines[l].p2].getX());
		}
	}
}
