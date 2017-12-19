function setup(){
	var xSize = 500;
	var ySize = 500;
	createCanvas(xSize, ySize);
	frameRate(60);
}

var z = 1;
function draw(){

	background(255);

	if(keyIsDown(UP_ARROW)){
		z += 0.01;
	}
	else if(keyIsDown(DOWN_ARROW)){
		z -= 0.01;
	}


	line(250+(-100/z), 250+(-100/z), 250+(100/z), 250+(-100/z));
	line(250+(-100/z), 250+(-100/z), 250+(-100/z), 250+(100/z));
	line(250+(-100/z), 250+(100/z), 250+(100/z), 250+(100/z));
	line(250+(100/z), 250+(-100/z), 250+(100/z), 250+(100/z));
}
