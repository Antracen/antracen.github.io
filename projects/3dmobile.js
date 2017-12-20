var z = 1;
var points = [];
var walls = [];
var xSpeed = 5;
var ySpeed = 5;
var rotSpeed = 0.05;
var xSize = 300;
var ySize = 300;
var moving = false;

function setup(){
	var canvas = createCanvas(xSize, ySize);
	canvas.position(100, 300);
	
	// WALL POINTS
	// DEPTH, RIGHT/LEFT, UP/DOWN
	points.push(new SphericalPoint(-510, -100, -100)); // 0 (FLD)
	points.push(new SphericalPoint(-510, 100, -100)); // 1 (FRD)
	points.push(new SphericalPoint(-510, 100, 100)); // 2 (FRU)
	points.push(new SphericalPoint(-510, -100, 100)); // 3 (FLU)
	
	points.push(new SphericalPoint(-910, 100, -100)); // 4 (BRD)
	points.push(new SphericalPoint(-910, 100, 100)); // 5 (BRU)
	points.push(new SphericalPoint(-910, -100, -100)); // 6 (BLD)
	points.push(new SphericalPoint(-910, -100, 100)); // 7 (BLU)
	
	points.push(new SphericalPoint(-1110, -30, -100)); // 8 (DL)
	points.push(new SphericalPoint(-1110, 170, -100)); // 9 (DR)
	points.push(new SphericalPoint(-1110, 170, 100)); // 10 (UR)
	points.push(new SphericalPoint(-1110, -30, 100)); // 11 (UL)
	
	walls.push(new Wall(2,5,4,1));
	walls.push(new Wall(7,3,0,6));
	walls.push(new Wall(5,10,9,4));
	walls.push(new Wall(11,7,6,8));
	
}

function draw(){
	background(200);	
	if(moving) for(var p of points) p.changeX(xSpeed); // W
	for(var w of walls) w.render();
}

function touchStarted(){
	moving = true;
}

function touchEnded(){
	moving = false;
}

function touchMoved(){	
	if(mouseX < pmouseX) for(var p of points) p.rotate(-rotSpeed); 
	else if(mouseX > pmouseX) for(var p of points) p.rotate(rotSpeed); 
	return false;
}

function SphericalPoint(x, y, z){
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
	
	this.getX = function(){ return this.len * sin(this.phi) * cos(this.theta); }
	this.getY = function(){ return this.len * sin(this.phi) * sin(this.theta); }
	this.getZ = function(){ return this.len * cos(this.phi); }
	
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

function Wall(topleft, topright, bottomright, bottomleft){

	this.lines = [[topleft,topright], [bottomright,bottomleft]];
	
	this.render = function(){
		beginShape();
	
		for(var l of this.lines){
			var p1Coords = [points[l[0]].getX(), points[l[0]].getY(), points[l[0]].getZ()];
			var p2Coords = [points[l[1]].getX(), points[l[1]].getY(), points[l[1]].getZ()];
			
			if(p1Coords[0] > 0 && p2Coords[0] > 0) return; // Don't draw behind camera.
			
			if(p1Coords[0] > 0 && p2Coords[0] < 0){ // Starting points behind player.
				var vector = [p2Coords[0] - p1Coords[0], p2Coords[1] - p1Coords[1], p2Coords[2] - p1Coords[2]];
				var k = -p1Coords[0]/vector[0];
				var point1 = [p1Coords[0] + vector[0]*k, p1Coords[1] + vector[1]*k, p1Coords[2] + vector[2]*k];
				vertex(xSize/2 + xSize*point1[1], ySize/2 + -ySize*point1[2]);
				vertex(xSize/2 + xSize*p2Coords[1]/-p2Coords[0], ySize/2 + -ySize*p2Coords[2]/-p2Coords[0]);
			}
			else if(p1Coords[0] < 0 && p2Coords[0] > 0){ // Ending points behind player.
				var vector = [p1Coords[0] - p2Coords[0], p1Coords[1] - p2Coords[1], p1Coords[2] - p2Coords[2]]
				var k = -p2Coords[0]/vector[0];
				var point2 = [p2Coords[0] + vector[0]*k, p2Coords[1] + vector[1]*k, p2Coords[2] + vector[2]*k];
				vertex(xSize/2 + xSize*p1Coords[1]/-p1Coords[0], ySize/2 + -ySize*p1Coords[2]/-p1Coords[0]);
				vertex(xSize/2 + xSize*point2[1], ySize/2 + -ySize*point2[2]);
			}
			else{ // Everything in front of player.
				vertex(xSize/2 + xSize*p1Coords[1]/-p1Coords[0], ySize/2 + -ySize*p1Coords[2]/-p1Coords[0]);
				vertex(xSize/2 + xSize*p2Coords[1]/-p2Coords[0], ySize/2 + -ySize*p2Coords[2]/-p2Coords[0]);		
			}
		}
		endShape(CLOSE);
	}
}
