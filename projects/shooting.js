// WARNING THIS CODE SUCKS ASS, WILL UPDATE

var level;
var started;
var players;
var music;
var keyLayouts;

function setup(){
	var xSize = 700;
	var ySize = 400;
	started = false;
	keyLayouts = [
		[49,50,51], [52,53,54], [55,56,57], // 123 456 789
		[81,87,69], [82,84,89], [85,73,79], // qwe rty uio
		[65,83,68], [70,71,72], [74,75,76], // asd fgh jkl
		[90,88,67], [86,66,78], [77,188,190] // zxc vbn m,.
	];
	createCanvas(xSize, ySize);
	level = new Level(xSize, ySize, "#2d2d2d");
	playMusic();
}

function draw(){
	if(started == false){
		introScreen();
		return;
	}
	level.render();
	keyListener();
	for(var i = 0; i < players.length; i++){
		players[i].update();
		players[i].render();
	}
}

function introScreen(){
	level.render();
	level.cooldown++;
	
	if(level.cooldown > 10){
		level.cooldown = 0;
		if(keyIsDown(UP_ARROW)){
			level.players++;
		}
		if(keyIsDown(DOWN_ARROW)){
			level.players--;
		}
		if(keyIsDown(ENTER)){
			started = true;
			players = [];
			for(var i = 0; i < max(1,min(level.players, keyLayouts.length)); i++){
				players.push(new Player(20,i,keyLayouts[i][0],keyLayouts[i][1],keyLayouts[i][2]));
			}
		}
	}
	fill(255);
	textSize(10);
	text("Choose number of players with arrows up, down and confirm with enter.", 300, 100);
	text(level.players, 300, 200);
}

function playMusic(){
	music = new Audio('music.wav');
	music.volume = 0.2;
	music.addEventListener('ended', function() {
   		this.currentTime = 0;
  		this.play();
	}, false);
	music.play();
}

function Level(xSize, ySize, color){
	this.xSize = xSize;
	this.ySize = ySize;
	this.players = 0;
	this.cooldown = 0;
	this.color = color;
	this.render = function(){
		background(this.color);
	}
}

function Player(size,num,leftKey,shootKey,rightKey){
	this.color = color(random(255),random(255),random(255));
	this.size = size;
	this.leftKey = leftKey;
	this.shootKey = shootKey;
	this.rightKey = rightKey;

	this.points = 0;
	this.num = num;

	this.position = createVector(random(level.xSize), random(level.ySize));
	this.velocity = createVector(random(3),random(3)).setMag(3);

	this.bullets = [];
	this.cooldown = 0;

	this.explosion = [];
	this.exploded = false;

	this.shootSound = [];
	this.shootIndex = 0;
	for(var i = 0; i < 15; i++){
		this.shootSound[i] = new Audio('shoot.wav');
		this.shootSound[i].volume = 0.2;
	}
	
	this.explodeSound = [];
	this.explodeIndex = 0;
	for(var i = 0; i < 5; i++){
		this.explodeSound[i] = new Audio('explode.wav');
		this.explodeSound[i].volume = 0.2;
	}

	this.update = function(){
		if(this.exploded == false) {
			this.updatePosition();
			this.collision();
			this.updateBullets();
		}
		this.updateExplode();
	}

	this.collision = function(){

		for(var i = 0; i < players.length; i++){
			if(i == this.num) continue;
			
			for(var j = 0; j < players[i].bullets.length; j++){
				if(this.position.dist(players[i].bullets[j][0]) < 15){
					players[i].points++;
					players[i].bullets.splice(j,1);
					this.explode();
				}
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

	this.updatePosition = function(){
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
		this.explodeSound[this.explodeIndex].play();
		this.explodeIndex++;
		if(this.explodeIndex > 4){
			this.explodeIndex = 0;
		}
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
		fill(this.color);
		stroke(0,0,0,0);
		textSize(20);
		text(""+this.points, 10+this.num*50, 370);
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

function keyListener(){
	for(var i = 0; i < players.length; i++){
		if(keyIsDown(players[i].leftKey)){
			players[i].velocity.rotate(-0.1);
		}
		if(keyIsDown(players[i].rightKey)){
			players[i].velocity.rotate(0.1);
		}
		if(keyIsDown(players[i].shootKey)){
			players[i].fire();
		}
	}
}
