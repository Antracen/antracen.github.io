var points = [];
var walls = [];
var xSpeed = 15;
var ySpeed = 15;
var rotSpeed = 0.05;
var xSize = 500;
var ySize = 500;

var rotMatrixRight;
var rotMatrixLeft;

function setup(){
	var canvas = createCanvas(xSize, ySize);
	canvas.position(20, 150);
	
	// Rotational matrix depends on rotational speed.
	rotMatrixRight = [];
	rotMatrixRight.push([cos(rotSpeed),-sin(rotSpeed),0]);
	rotMatrixRight.push([sin(rotSpeed),cos(rotSpeed),0]);
	rotMatrixRight.push([0,0,1]);
	rotMatrixLeft = [];
	rotMatrixLeft.push([cos(-rotSpeed),-sin(-rotSpeed),0]);
	rotMatrixLeft.push([sin(-rotSpeed),cos(-rotSpeed),0]);
	rotMatrixLeft.push([0,0,1]);
	
	// WALL POINTS: DEPTH, RIGHT/LEFT, UP/DOWN
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
	
	// MOVEMENT
	if(keyIsDown(87)) for(var p of points) p.x += xSpeed; // W
	else if(keyIsDown(83)) for(var p of points) p.x -= xSpeed; // S
	if(keyIsDown(65)) for(var p of points) p.y += ySpeed; // A
	else if(keyIsDown(68)) for(var p of points) p.y -= ySpeed; // D	
	
	// CAMERA
	if(keyIsDown(LEFT_ARROW)) for(var p of points) p.rotate(-1); 
	else if(keyIsDown(RIGHT_ARROW)) for(var p of points) p.rotate(1); 
	
	var wallDistances = [];
	for(var i = 0; i < walls.length; i++){
		wallDistances.push([i, walls[i].avgDistance()]);
	}
	
	wallDistances.sort(function(a,b){ return a[1] - b[1] }); // Sort to render furthest walls first.
	
	for(var w of wallDistances) walls[w[0]].render();
}

function SphericalPoint(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
	
	// Rotate by matrix multiplication.
	this.rotate = function(dir){
		var rotMatrix = (dir == -1) ? rotMatrixLeft : rotMatrixRight;
		this.newX = rotMatrix[0][0]*this.x + rotMatrix[0][1]*this.y + rotMatrix[0][2]*this.z;
		this.newY = rotMatrix[1][0]*this.x + rotMatrix[1][1]*this.y + rotMatrix[1][2]*this.z;
		this.newZ = rotMatrix[2][0]*this.x + rotMatrix[2][1]*this.y + rotMatrix[2][2]*this.z;
		this.x = this.newX;
		this.y = this.newY;
		this.z = this.newZ;
	}
}

function Wall(topleft, topright, bottomright, bottomleft){

	this.lines = [[topleft,topright], [bottomright,bottomleft]];
	
	this.avgDistance = function(){
		return (points[topleft].x + points[topright].x + points[bottomright].x + points[bottomleft].x)/4;
	}
	
	this.render = function(){
		stroke(0);
		fill('#E83D84');
		beginShape();
	
		for(var l of this.lines){
			var p1 = {x: points[l[0]].x, y: points[l[0]].y, z: points[l[0]].z};
			var p2 = {x: points[l[1]].x, y: points[l[1]].y, z: points[l[1]].z};
			
			if(p1.x > 0 && p2.x > 0) return; // Don't draw behind camera.
			
			if(p1.x > 0 && p2.x < 0){ // Starting points behind player.
				var vector = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z];
				var k = -p1.x/vector[0];
				var point1 = [p1.x + vector[0]*k, p1.y + vector[1]*k, p1.z + vector[2]*k];
				vertex(xSize/2 + xSize*point1[1], ySize/2 + -ySize*point1[2]);
				vertex(xSize/2 + xSize*p2.y/-p2.x, ySize/2 + -ySize*p2.z/-p2.x);
			}
			else if(p1.x < 0 && p2.x > 0){ // Ending points behind player.
				var vector = [p1.x - p2.x, p1.y - p2.y, p1.z - p2.z]
				var k = -p2.x/vector[0];
				var point2 = [p2.x + vector[0]*k, p2.y + vector[1]*k, p2.z + vector[2]*k];
				vertex(xSize/2 + xSize*p1.y/-p1.x, ySize/2 + -ySize*p1.z/-p1.x);
				vertex(xSize/2 + xSize*point2[1], ySize/2 + -ySize*point2[2]);
			}
			else{ // Everything in front of player.
				vertex(xSize/2 + xSize*p1.y/-p1.x, ySize/2 + -ySize*p1.z/-p1.x);
				vertex(xSize/2 + xSize*p2.y/-p2.x, ySize/2 + -ySize*p2.z/-p2.x);		
			}
		}
		endShape(CLOSE);
	}
}
