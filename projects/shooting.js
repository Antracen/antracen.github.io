// WARNING THIS CODE SUCKS ASS, WILL UPDATE

var player1;
var player2;

function setup(){
		// Canvas
		createCanvas(700, 400);
		// Other
		player1 = new Player(100,100,20,0);
		player2 = new Player(100,100,20,1);
}

function draw(){
	background("#2d2d2d");
	player1.update();
	player1.render();
	player2.update();
	player2.render();
}

function Player(x,y,size,num){
	this.color = color(random(255),random(255),random(255));
	this.points = 0;
	this.num = num;
	this.position = createVector(x, y);
	this.size = size;
	this.velocity = createVector(3,0);
	this.bullets = [];
	
	this.update = function(){
		if(this.num == 0){
			this.updatePosition1();
			this.collision1();
		} else{
			this.updatePosition2();
			this.collision2();
		}
		this.updateBullets();
	}

	this.collision1 = function(){

		for(var i = 0; i < player2.bullets.length; i++){
			if(this.position.dist(player2.bullets[i][0]) < 15){
				player2.points++;
				console.log("Player2: " + player2.points);
				player2.bullets.splice(i,1);
			}
		}
	}
	this.collision2 = function(){

		for(var i = 0; i < player1.bullets.length; i++){
			if(this.position.dist(player1.bullets[i][0]) < 15){
				player1.points++;
				console.log("Player1: " + player1.points);
				player1.bullets.splice(i,1);
			}
		}
	}


	this.updateBullets = function(){
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i][0].add(this.bullets[i][1]);
			if(this.bullets[i][0].x > 800 || this.bullets[i][0].y > 500 || this.bullets[i][0].x < 0 || this.bullets[i][0].y < 0){
				this.bullets.splice(i,1);
			}
		}
	}

	this.updatePosition1 = function(){
		if(keyIsDown(LEFT_ARROW)){
			this.velocity.rotate(-0.1);
		}
		if(keyIsDown(RIGHT_ARROW)){
			this.velocity.rotate(0.1);
		}
		if(keyIsDown(DOWN_ARROW)){
			this.fire();
		}
		this.position.add(this.velocity);
	}

	this.updatePosition2 = function(){
		if(keyIsDown(65)){
			this.velocity.rotate(-0.1);
		}
		if(keyIsDown(68)){
			this.velocity.rotate(0.1);
		}
		if(keyIsDown(83)){
			this.fire();
		}
		this.position.add(this.velocity);
	}

	this.fire = function(){
		if(this.bullets.length < 1){
			this.bullets.push([this.position.copy(), this.velocity.copy().mult(3)]);
		}
	}

	this.render = function(){
		stroke(this.color);
		strokeWeight(this.size);
		point(this.position.x, this.position.y);
		for(var i = 0; i < this.bullets.length; i++){
			stroke(this.color);
			strokeWeight(10);
			point(this.bullets[i][0].x, this.bullets[i][0].y);
		}
	}
}
