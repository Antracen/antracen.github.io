var ai;
var points;

function setup(){
		// Canvas
		createCanvas(600, 300);
 		background("#2d2d2d");
		// Other
		ai = new AI(100,100);
		points = new Points();
}

function draw(){
	background("#2d2d2d");
	points.update();
	ai.update();
	ai.render();
	points.render();
}

function Points(){
	this.points = [];

	this.add = function(x){
		this.points.push(x);
	}

	this.update = function(){
		for(var i = 0; i < this.points.length; i++){
			if(Math.abs(this.points[i][0] - ai.position.x) <= 2 && Math.abs(this.points[i][1] - ai.position.y) <= 2){
				this.points.splice(i,1);
			}
		}
	}

	this.render = function(){
		stroke(255);
		strokeWeight(3);
		for(var i = 0; i < this.points.length; i++){
			point(this.points[i][0], this.points[i][1]);
		}
	}
}

function AI(x, y){
	this.position = createVector(x, y);
	this.velocity = createVector(1,0);

	this.update = function(){
		this.steer();
		this.position.add(this.velocity);
		if(this.position.x < 0){
			this.position.x = 0;
		} else if(this.position.x >= 600){
			this.position.x = 599;
		}
		if(this.position.y < 0){
			this.position.y = 0;
		} else if(this.position.y >= 300){
			this.position.y = 299;
		}
	}

	this.steer = function(){
		var minDistance = Infinity;
		var targetVelocity = createVector(0,0);
		if(points.points.length == 0){
			var targetVector = p5.Vector.sub(createVector(300,150), this.position);
			if(targetVector.mag() < minDistance){
				targetVelocity = targetVector;
				minDistance = targetVector.mag();
			}
		}
		for(var i = 0; i < points.points.length; i++){
			var targetVector = p5.Vector.sub(createVector(points.points[i][0], points.points[i][1]), this.position);
			if(targetVector.mag() < minDistance){
				targetVelocity = targetVector;
				minDistance = targetVector.mag();
			}
		}
		if(targetVelocity.mag() != 0){
			var forceAdd = p5.Vector.sub(targetVelocity, this.velocity).limit(0.4);
			this.velocity.add(forceAdd);
			this.velocity.limit(3);
		}
	}

	this.render = function(){
		stroke(255);
		strokeWeight(8);
		point(this.position.x, this.position.y);
	}
}

function mousePressed() {
	points.add([mouseX, mouseY]);
}
