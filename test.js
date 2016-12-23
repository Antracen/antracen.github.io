var mic;

function setup() {
	createCanvas(640, 360);
	mic = new p5.AudioIn();
	mic.start();
	frameRate(1);
}

function draw(){
	var vol = mic.getLevel();
	clear();
	text(vol, 100, 100);
}

function keyPressed() {
}
