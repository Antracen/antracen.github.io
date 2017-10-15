// WARNING THIS CODE SUCKS ASS, WILL UPDATE

var player1;
var player2;
var music;

function setup(){
		// Canvas
		createCanvas(700, 400);
		// Other
		player1 = new Player(100,100,20,0);
		player2 = new Player(100,100,20,1);
		music = new Audio('music.wav');
		music.volume = 0.2;
		music.addEventListener('ended', function() {
    		this.currentTime = 0;
    		this.play();
		}, false);
		music.play();
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
	this.explosion = [];
	this.exploded = false;
	this.cooldown = 0;
	this.shootSound = [];
	this.shootIndex = 0;
	for(var i = 0; i < 15; i++){
		this.shootSound[i] = new Audio('shoot.wav');
		this.shootSound[i].volume = 0.2;
	}
	this.explodeSound = new Audio('explode.wav');
	this.explodeSound.volume = 0.2;
	
	if(this.num == 0){
		this.velocity.mult(-1);
		this.position.add(40,100);
	}

	this.update = function(){
		if(this.exploded == false) {
			if(this.num == 0){
				this.updatePosition1();
				this.collision1();
			} else{
				this.updatePosition2();
				this.collision2();
			}
			this.updateBullets();
		}
		this.updateExplode();
	}

	this.collision1 = function(){

		for(var i = 0; i < player2.bullets.length; i++){
			if(this.position.dist(player2.bullets[i][0]) < 15){
				player2.points++;
				player2.bullets.splice(i,1);
				this.explode();
			}
		}
	}
	this.collision2 = function(){

		for(var i = 0; i < player1.bullets.length; i++){
			if(this.position.dist(player1.bullets[i][0]) < 15){
				player1.points++;
				player1.bullets.splice(i,1);
				this.explode();
			}
		}
	}


	this.updateBullets = function(){
		this.cooldown++;
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i][2]++;
			if(this.bullets[i][2] > 100){
				this.bullets.splice(i,1);
				continue;
			}
			this.bullets[i][0].add(this.bullets[i][1]);
			if(this.bullets[i][0].x < 0){
				this.bullets[i][0].x = 700;
			} else if(this.bullets[i][0].x > 700){
				this.bullets[i][0].x = 0;
			}
			if(this.bullets[i][0].y < 0){
				this.bullets[i][0].y = 400;
			} else if(this.bullets[i][0].y > 400){
				this.bullets[i][0].y = 0;
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
		if(this.position.x < 0){
			this.position.x = 700;
		} else if(this.position.x > 700){
			this.position.x = 0;
		}
		if(this.position.y < 0){
			this.position.y = 400;
		} else if(this.position.y > 400){
			this.position.y = 0;
		}
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
		if(this.position.x < 0){
			this.position.x = 700;
		} else if(this.position.x > 700){
			this.position.x = 0;
		}
		if(this.position.y < 0){
			this.position.y = 400;
		} else if(this.position.y > 400){
			this.position.y = 0;
		}
	}

	this.fire = function(){	
		if(this.bullets.length < 8 && this.cooldown > 20){
			this.bullets.push([this.position.copy(), this.velocity.copy().mult(3), 0]);
			this.shootSound[this.shootIndex].play();
			this.shootIndex++;
			if(this.shootIndex > 11){
				this.shootIndex = 0;
			}
			this.cooldown = 0;
		}
	}
	
	this.explode = function(){
		this.explodeSound.play();
		for(var i = 0; i < 40; i++){
			this.explosion.push([this.position.copy(), this.velocity.copy().mult(1).rotate(random(2*PI)), 0]);
		}
		this.bullets = [];
		this.exploded = true;
	}
	
	this.updateExplode = function(){
		for(var i = 0; i < this.explosion.length; i++){
			this.explosion[i][0].add(this.explosion[i][1]);
			this.explosion[i][2]++;
			if(this.explosion[i][2] > 100){
				this.explosion.splice(i,1);
			}
		}
		if(this.explosion.length == 0 && this.exploded == true){
			this.exploded = false;
			this.position = createVector(100,100);
		}
	}

	this.render = function(){
		if(this.num == 0){
			fill(this.color);
			stroke(0,0,0,0);
			textSize(20);
			text(""+this.points, 10, 370);
		}
		else{
			fill(this.color);
			stroke(0,0,0,0);
			textSize(20);
			text(""+this.points, 650, 370);
		}
		if(this.exploded == true){
			for(var i = 0; i < this.explosion.length; i++){
				stroke(this.color);
				strokeWeight(6);
				point(this.explosion[i][0].x, this.explosion[i][0].y);
			}
			return;
		}
		stroke(this.color);
		strokeWeight(this.size);
		point(this.position.x, this.position.y);
		strokeWeight(10);
		point(this.position.x+this.velocity.x*3, this.position.y+this.velocity.y*3);

		for(var i = 0; i < this.bullets.length; i++){
			strokeWeight(10);
			point(this.bullets[i][0].x, this.bullets[i][0].y);
		}
	}
}
//
