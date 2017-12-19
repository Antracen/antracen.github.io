var z = 1;
var lines = [];
var points = [];
var xSpeed = 5;
var ySpeed = 5;
var rotSpeed = 0.05;
var xSize = 300;
var ySize = 300;

function setup(){
	var canvas = createCanvas(xSize, ySize);
	canvas.position(100, 300);
	
	// FRONT WALL POINTS
	points.push(new PolarPoint(-310, -100, -100)); // TOP LEFT 0
	points.push(new PolarPoint(-310, 100, -100)); // TOP RIGHT 1
	points.push(new PolarPoint(-310, -100, 100)); // BOTTOM LEFT 2
	points.push(new PolarPoint(-310, 100, 100)); // BOTTOM RIGHT 3
	
	// RIGHT WALL POINTS
	points.push(new PolarPoint(-510, 100, -100)); // TOP RIGHT 4
	points.push(new PolarPoint(-510, 100, 100)); // BOTTOM RIGHT 5
	
	// BACK WALL POINTS
	points.push(new PolarPoint(-510, -100, -100)); // TOP RIGHT 6
	points.push(new PolarPoint(-510, -100, 100)); // BOTTOM RIGHT 7
	
	// FRONT WALL LINES
	lines.push(new Line(0,1)); // TOP
	lines.push(new Line(0,2)); // LEFT
	lines.push(new Line(1,3)); // RIGHT
	lines.push(new Line(2,3)); // DOWN
	
	// RIGHT WALL LINES
	lines.push(new Line(1,4)); // TOP
	lines.push(new Line(3,5)); // BOTTOM
	lines.push(new Line(4,5)); // RIGHT
	
	// BACK WALL LINES
	lines.push(new Line(4,6)); // TOP
	lines.push(new Line(5,7)); // BOTTOM
	lines.push(new Line(6,7)); // RIGHT
	
	// LEFT WALL LINES
	lines.push(new Line(0,6)); // BOTTOM
	lines.push(new Line(2,7)); // RIGHT
}

function draw(){
	background(200);

	if(keyIsDown(87)){ // W
		for(var p of points) p.changeX(xSpeed);
	}
	else if(keyIsDown(83)){ // S
		for(var p of points) p.changeX(-xSpeed);			
	}
	if(keyIsDown(65)){ // A
		for(var p of points) p.changeY(ySpeed);			
	}
	else if(keyIsDown(68)){ // D
		for(var p of points) p.changeY(-ySpeed);			
	}
	
	if(keyIsDown(LEFT_ARROW)){
		for(var p of points) p.rotate(-rotSpeed);
	}
	else if(keyIsDown(RIGHT_ARROW)){
		for(var p of points) p.rotate(rotSpeed);
	}
	for(var l of lines) l.render();
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
	}
}

function Line(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
	
	this.render = function(){
		var p1Coords = [points[this.p1].getX(), points[this.p1].getY(), points[this.p1].getZ()];
		var p2Coords = [points[this.p2].getX(), points[this.p2].getY(), points[this.p2].getZ()];
		if(p1Coords[0] > 0 && p2Coords[0] < 0){
			var vector = [p1Coords[0] - p2Coords[2], p1Coords[1] - p2Coords[1], p1Coords[2] - p2Coords[2]]
			var k = -p1Coords[0]/vector[0];
			var point = [p1Coords[0] + vector[0]*k, p1Coords[1] + vector[1]*k, p1Coords[2] + vector[2]*k];
			line(xSize/2 + xSize*point[1], ySize/2 + -ySize*point[2], xSize/2 + xSize*points[this.p2].getY()/-p2Coords[0], ySize/2 + -ySize*p2Coords[2]/-p2Coords[0]);
		}
		else if(p1Coords[0] < 0 && p2Coords[0] > 0){
			var vector = [p2Coords[0] - p1Coords[0], p2Coords[1] - p1Coords[1], p2Coords[2] - p1Coords[2]]
			var k = -p2Coords[0]/vector[0];
			var point = [p2Coords[0] + vector[0]*k, p2Coords[1] + vector[1]*k, p2Coords[2] + vector[2]*k];
			line(xSize/2 + xSize*point[1], ySize/2 + -ySize*point[2], xSize/2 + xSize*p1Coords[1]/-p1Coords[0], ySize/2 + -ySize*p1Coords[2]/-p1Coords[0]);
		}
		else if(p1Coords[0] > 0 && p2Coords[0] > 0) return; // Don't draw behind camera.
		else line(xSize/2 + xSize*p1Coords[1]/-p1Coords[0], xSize/2 + -ySize*p1Coords[2]/-p1Coords[0], ySize/2 + xSize*p2Coords[1]/-p2Coords[0], ySize/2 + -ySize*p2Coords[2]/-p2Coords[0]);
	}
}
