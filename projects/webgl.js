function setup(){
	var xSize = 500;
	var ySize = 500;
	createCanvas(xSize, ySize, WEBGL);
	frameRate(50);
}

var z = 0;
function draw(){
	pointLight(255, 255, 255, 0, 0, 0);
	specularMaterial(250, 0, 0);
	background(255);
	rotateX(mouseY*0.01);
	rotateY(-mouseX*0.01);
	box(100,100,100,100,100);
	z += 0.01;
}
