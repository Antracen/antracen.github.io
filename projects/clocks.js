let aus, hk, sea, swe;

function setup() {
	let cnv = createCanvas(400, 400);
	cnv.parent("canvascontainer");
	aus = new Clock("Austin", 100, 100, 80, -7);
	hk = new Clock("Hong Kong", 300, 100, 80, 7);
	sea = new Clock("Seattle", 100, 280, 80, -9);
    swe = new Clock("Sweden", 300, 280, 80, 0);
	frameRate(1);
}

function draw() {
	background(240);
	aus.update();
	hk.update();
	sea.update();
    swe.update();
}

class Clock {

	constructor(title, x, y, radius, offset) {
		this.title = title;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.offset = offset;
	}

	update() {
		strokeWeight(1);
		stroke("black");
		ellipse(this.x, this.y, this.radius, this.radius);
		// Draw seconds line
		let second_angle = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
		let second_length = this.radius * 0.5;
		strokeWeight(1);
		stroke("red");
		line(this.x, this.y, this.x + cos(second_angle)*second_length, this.y + sin(second_angle)*second_length);
		// Draw hour line
		let hour_angle = map((hour() + this.offset)%24, 0, 24, 0, 2*TWO_PI);
		let hour_length = 15;
		strokeWeight(3);
		stroke("black");
		line(this.x, this.y, this.x + cos(hour_angle - HALF_PI)*hour_length, this.y + sin(hour_angle - HALF_PI)*hour_length);
		// Draw minute line
		let minute_angle = map(minute(), 0, 60, 0, TWO_PI) - HALF_PI;
		let minute_length = 25;
		strokeWeight(2);
		line(this.x, this.y, this.x + cos(minute_angle)*minute_length, this.y + sin(minute_angle)*minute_length);
		// Draw text
		strokeWeight(0.01);
		textSize(20);
		textStyle(NORMAL);
		textAlign(CENTER);
		text(this.title, this.x, this.y - this.radius + 30);
		text(((hour() + this.offset)%24 < 10 ? "0" : "") + (hour() + this.offset)%24 + ":" + (minute() < 10 ? 0 : "") + minute() + ":" + (second() < 10 ? 0 : "") + second(), this.x, this.y + this.radius - 15);
	}
}
