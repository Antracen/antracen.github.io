// TODO
// Blocks can rotate through walls.
// Tetris check.

var block;
var level;
var gameOver;

function setup(){
	createCanvas(100,200); // Pixels 10*10
	block = new Block(Math.floor(Math.random()*7));
	level = new Level();
	blocks = [];
	blocks.push(block);
	gameOver = false;
	frameRate(15);
}

function draw(){
	if(!gameOver){
		background(0);
		block.update();
		check_keys();
		for(var i in blocks){
			blocks[i].render();
		}
	}
}

function check_keys(){
	if(keyIsDown(LEFT_ARROW)){
		block.move_X(-1);
	}
	if(keyIsDown(RIGHT_ARROW)){
		block.move_X(1);
	}
	if(keyIsDown(DOWN_ARROW)){
		block.move_down();
	}
}

function Level(){
	level = [];
	for(var i = 0; i < 20; i++){
		level[i] = [];
		for(var j = 0; j < 20; j++){
			level[i].push(color("black"));
		}
	}
}

function Block(type){
	this.frame = 0;
	this.type = type;
	this.block;
	this.color;
	this.top_left = [4, 0];
	switch(this.type){
		case 0:
			this.block = [[1,1],[1,1]];
			this.color = "red";
			break;
		case 1:
			this.block = [[0,1,1],[1,1,0]];
			this.color = "blue";
			break;
		case 2:
			this.block = [[1,1,0],[0,1,1]];
			this.color = "magenta";
			break;
		case 3:
			this.block = [[1,1,1],[0,0,1]];
			this.color = "green";
			break;
		case 4:
			this.block = [[1,1,1], [1,0,0]];
			this.color = "purple";
			break;
		case 5:
			this.block = [[1,1,1,1]];
			this.color = "orange";
			break;
		case 6:
			this.block = [[1,1,1],[0,1,0]];
			this.color = "yellow";
			break;
	}

	this.move_X = function(dir){
		this.top_left[0] += dir;
		if(this.top_left[0] < 0){
			this.top_left[0] = 0;
		}
		if(this.top_left[0] + this.block[0].length >= 10){
			this.top_left[0] = 10 - this.block[0].length;
		}
		if(this.block_collision(this.block)){
			this.top_left[0] -= dir;
		}
	}

	this.move_down = function(){
		this.top_left[1] += 1;
		if(this.block_collision(this.block)){
			this.top_left[1] -= 1;
			block = new Block(Math.floor(Math.random()*7));
			blocks.push(block);
		} else{
			if(this.top_left[1] + this.block.length > 20){
				this.top_left[1] = 20 - this.block.length;
				block = new Block(Math.floor(Math.random()*7));
				blocks.push(block);
			}
		}
	}

	this.drop = function(){
		while(this.top_left[1] + this.block.length < 20){
			this.top_left[1] += 1;
			if(this.block_collision(this.block)){
				this.top_left[1] -= 1;
				block = new Block(Math.floor(Math.random()*7));
				blocks.push(block);
				return;
			}
		}
		block = new Block(Math.floor(Math.random()*7));
		blocks.push(block);
	}

	// Return true if the block is in collision with any other block.
	this.block_collision = function(my_block){
		// Check all but self in blocks.
		for(var i = 0; i < blocks.length-1; i++){
			var potential_collide = false;
			// If left side is to the left of other blocks right side and right side is to the right of other blocks right side.
			if(this.top_left[0] < blocks[i].top_left[0]+blocks[i].block[0].length && this.top_left[0]+my_block[0].length > blocks[i].top_left[0]){
				// Same for height
				if(this.top_left[1] < blocks[i].top_left[1]+blocks[i].block.length && this.top_left[1]+my_block.length > blocks[i].top_left[1]){
					potential_collide = true;
				}
			}
			if(potential_collide == true){
				// For all in current block.
				for(var j = 0; j < my_block.length; j++){
					for(var k = 0; k < my_block[j].length; k++){
						if(my_block[j][k] == 0){
							continue;
						}
						var posX = this.top_left[0] + k;
						var posY = this.top_left[1] + j;
							for(var l = 0; l < blocks[i].block.length; l++){
								for(var m = 0; m < blocks[i].block[l].length; m++){
									if(blocks[i].block[l][m] == 0){
										continue;
									}
									var posX2 = blocks[i].top_left[0] + m;
									var posY2 = blocks[i].top_left[1] + l;
									if(posX == posX2 && posY == posY2){
										return true;
									}
								}
							}
					}
				}
			}
		}
		return false;
	}

	this.rotate = function(){
		var new_block = [];
		for(var i = 0; i < this.block[0].length; i++){
			new_block[i] = [];
			for(var j = this.block.length-1; j >= 0; j--){
				new_block[i].push(this.block[j][i]);
			}
		}
		if(!this.block_collision(new_block)){
			this.block = new_block;
		}
	}

	// Check if we have a completed row.
	this.tetris = function(){
		return false;
	}

	this.update = function(){
		if(this.block_collision(this.block)){
			alert("GAME OVER!");
			gameOver = true;
			blocks = [];
			gameOver = false;
		}
		if(this.frame == 3){
			this.move_down();
			this.frame = 0;
		}
		this.frame++;
	}

	this.render = function(){
		for(var i in this.block){
			for(var j in this.block[i]){
				if(this.block[i][j] == 1){
					stroke(0);
					fill(color(this.color));
					rect(this.top_left[0]*10 + j*10, this.top_left[1]*10 + i*10, 10, 10);
				}
			}
		}
	}
}

function keyPressed(){
	switch(keyCode){
		case UP_ARROW:
			block.rotate();
			break;
		case 32: // SPACE
			block.drop();
			break;
	}
}
