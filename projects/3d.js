var z = 1;
var lines = [];
var points = [];
var walls = [];
var xSpeed = 0.1;
var ySpeed = 4;

function setup(){
	var xSize = 200;
	var ySize = 200;
	var canvas = createCanvas(xSize, ySize);
	canvas.position(100, 300);
	frameRate(100);
	
	// FRONT WALL POINTS
	points.push(new PolarPoint(-10, -100, -100)); // TOP LEFT 0
	points.push(new PolarPoint(-10, 100, -100)); // TOP RIGHT 1
	points.push(new PolarPoint(-10, -100, 100)); // BOTTOM LEFT 2
	points.push(new PolarPoint(-10, 100, 100)); // BOTTOM RIGHT 3
	
	// RIGHT WALL POINTS
	points.push(new PolarPoint(-13, 100, -100)); // TOP RIGHT 4
	points.push(new PolarPoint(-13, 100, 100)); // BOTTOM RIGHT 5
	
	// BACK WALL POINTS
	points.push(new PolarPoint(-13, -100, -100)); // TOP RIGHT 6
	points.push(new PolarPoint(-13, -100, 100)); // BOTTOM RIGHT 7
	
	// FRONT WALL LINES
	lines.push(new Line(0,1)); // TOP 0
	lines.push(new Line(0,2)); // LEFT 1
	lines.push(new Line(1,3)); // RIGHT 2
	lines.push(new Line(2,3)); // DOWN 3
	
	// RIGHT WALL LINES
	lines.push(new Line(1,4)); // TOP 4
	lines.push(new Line(3,5)); // BOTTOM 5
	lines.push(new Line(4,5)); // RIGHT 6
	
	// BACK WALL LINES
	lines.push(new Line(4,6)); // TOP 7
	lines.push(new Line(5,7)); // BOTTOM 8
	lines.push(new Line(6,7)); // RIGHT 9
	
	walls.push(new Wall(0,1,2,3));
	walls.push(new Wall(2,4,5,6));
	walls.push(new Wall(6,7,8,9));
}

function draw(){
	background(200);

	if(keyIsDown(87)){ // W
		for(var p of points){
			p.changeX(xSpeed);
		}
	}
	else if(keyIsDown(83)){ // S
		for(var p of points){
			p.changeX(-xSpeed);
		}			
	}
	if(keyIsDown(65)){ // A
		for(var p of points){
			p.changeY(ySpeed);
		}			
	}
	else if(keyIsDown(68)){ // D
		for(var p of points){
			p.changeY(-ySpeed);
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
	}
}

function Line(p1, p2){
	this.p1 = p1;
	this.p2 = p2;
	
	this.render = function(){
		if(points[this.p1].getX() > 0 && points[this.p2].getX() < 0){
			var vector = [points[this.p1].getX() - points[this.p2].getX(), points[this.p1].getY() - points[this.p2].getY(), points[this.p1].getZ() - points[this.p2].getZ()]
			var k = -points[this.p1].getX()/vector[0];
			var point = [points[this.p1].getX() + vector[0]*k, points[this.p1].getY() + vector[1]*k, points[this.p1].getZ() + vector[2]*k];
			line(100 + point[1], 100 + point[2], 100+points[this.p2].getY()/-points[this.p2].getX(), 100+points[this.p2].getZ()/-points[this.p2].getX());
		}
		else if(points[this.p1].getX() < 0 && points[this.p2].getX() > 0){
			var vector = [points[this.p2].getX() - points[this.p1].getX(), points[this.p2].getY() - points[this.p1].getY(), points[this.p2].getZ() - points[this.p1].getZ()]
			var k = -points[this.p2].getX()/vector[0];
			var point = [points[this.p2].getX() + vector[0]*k, points[this.p2].getY() + vector[1]*k, points[this.p2].getZ() + vector[2]*k];
			line(100 + point[1], 100 + point[2], 100+points[this.p1].getY()/-points[this.p1].getX(), 100+points[this.p1].getZ()/-points[this.p1].getX());
		}
		else if(points[this.p1].getX() > 0 && points[this.p2].getX() > 0) return;
		else line(100 + points[this.p1].getY()/-points[this.p1].getX(), 100 + points[this.p1].getZ()/-points[this.p1].getX(), 100+points[this.p2].getY()/-points[this.p2].getX(), 100+points[this.p2].getZ()/-points[this.p2].getX());
	}
	
}

function Wall(l1, l2, l3, l4){

	this.lines = [l1,l2,l3,l4];

	this.render = function(){
		for(var l of this.lines) lines[l].render();
	}
}
