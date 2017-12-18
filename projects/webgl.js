function setup(){
	var xSize = 500;
	var ySize = 500;
	createCanvas(xSize, ySize, WEBGL);
	frameRate(50);
}

var speed = 2;
var direction = new p5.Vector(0,0,-1);
var xPos = 0;
var zPos = 0;
var yPos = 0;
function draw(){

	if(keyIsDown(UP_ARROW)){
		var yz = new p5.Vector(direction.y, direction.z);
		yz.rotate(-0.01);
		direction.y = yz.x;
		direction.z = yz.y;
	}
	else if(keyIsDown(DOWN_ARROW)){
		var yz = new p5.Vector(direction.y, direction.z);
		yz.rotate(0.01);
		direction.y = yz.x;
		direction.z = yz.y;
	}
	if(keyIsDown(32)){
		xPos += direction.x;
		yPos -= direction.y;	
		zPos += direction.z;
	}

	pointLight(255, 255, 255, 0, 0, 0);
	specularMaterial(250, 0, 0);
	background(230);
	translate(xPos,yPos,zPos);
	if(direction.y < 0) rotateX(-p5.Vector.angleBetween(new p5.Vector(0,0,-1), direction));
	else rotateX(p5.Vector.angleBetween(new p5.Vector(0,0,-1), direction));
	box(100,100,100,100,100);
}
