// TODO Make it so player can have a startRot.

var walls = [];
var xSpeed = 15;
var ySpeed = 15;
var rotSpeed = 0.05;
var xSize = 500;
var ySize = 500;
var startX = -1000;
var startY = 0;

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
	
	// WALLS	
	walls.push(new StraightWall([0,200],[0,0], 200));
	walls.push(new StraightWall([0,0],[-400,0], 200));
	walls.push(new StraightWall([-400,0],[-600,200], 200));
	walls.push(new StraightWall([-600,200],[-800,200], 200));
	walls.push(new StraightWall([-800,200],[-800,500], 200));
	walls.push(new StraightWall([-800,500],[-600,500], 200));
	walls.push(new StraightWall([-600,500],[-600,700], 200));

	walls.push(new StraightWall([-500,700],[-500,500], 200));
	walls.push(new StraightWall([-500,500],[-400,400], 200));
	walls.push(new StraightWall([-400,400],[0,400], 200));
	walls.push(new StraightWall([0,400],[0,300], 200));

	for(var w of walls) w.move(startX,startY); // Position player
}

function draw(){
	background(200);
	
	// MOVEMENT
	if(keyIsDown(87)) for(var w of walls) w.move(xSpeed,0); // W
	else if(keyIsDown(83)) for(var w of walls) w.move(-xSpeed,0); // S
	if(keyIsDown(65)) for(var w of walls) w.move(0,ySpeed); // A
	else if(keyIsDown(68)) for(var w of walls) w.move(0,-ySpeed); // D	
	
	// CAMERA
	if(keyIsDown(LEFT_ARROW)) for(var w of walls) w.rotate(-1); 
	else if(keyIsDown(RIGHT_ARROW)) for(var w of walls) w.rotate(1); 
	
	var wallDistances = [];
	for(var i = 0; i < walls.length; i++) wallDistances.push([i, walls[i].avgDistance()]);
	
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
		this.x = rotMatrix[0][0]*this.x + rotMatrix[0][1]*this.y + rotMatrix[0][2]*this.z;
		this.y = rotMatrix[1][1]*this.y + rotMatrix[1][0]*this.x + rotMatrix[1][2]*this.z;
		this.z = rotMatrix[2][2]*this.z + rotMatrix[2][0]*this.x + rotMatrix[2][1]*this.y;
	}
}

function StraightWall(bottomright, bottomleft, height){

	this.points = [
		new SphericalPoint(bottomleft[0], bottomleft[1], height-100),
		new SphericalPoint(bottomright[0], bottomright[1], height-100),
		new SphericalPoint(bottomright[0], bottomright[1], -100),
		new SphericalPoint(bottomleft[0], bottomleft[1], -100)
	];
	
	this.avgDistance = function(){
		return (this.points[0].x + this.points[1].x)/2;
	}

	this.move = function(x, y){
		for(var p of this.points){
			p.x += x;
			p.y += y;
		}
	}

	this.rotate = function(angle){
		for(var p of this.points) p.rotate(angle);
	}

	this.render = function(){
		stroke(0);
		fill('#aeaeae');
		beginShape();
		for(var i = 0; i <= 1; i++){
			for(var j = i; j <= 2*i; j++){
				var p1 = {x: this.points[j].x, y: this.points[j].y, z: this.points[j].z};
				var p2 = {x: this.points[j+1].x, y: this.points[j+1].y, z: this.points[j+1].z};
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
		}
		endShape(CLOSE);
	}
}
