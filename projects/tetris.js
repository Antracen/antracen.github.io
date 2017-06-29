var block;
var level;
var gameOver;

function setup(){
	createCanvas(100,200); // Pixels 10*10
	block = new Block();
	level = new Level();
	gameOver = false;
	frameRate(15);
}

function draw(){
	if(!gameOver){
		block.update();
		level.update();
		level.render();
		block.render();
		check_keys();
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
	this.level = [];
	for(var i = 0; i < 20; i++){
		this.level[i] = [];
		for(var j = 0; j < 10; j++){
			this.level[i].push([0, "black"]);
		}
	}

	this.check_tetris = function(){
		for(var i = 0; i < 20; i++){
			var tetris = true;
			for(var j = 0; j < 10; j++){
				if(this.level[i][j][0] == 0){
					tetris = false;
					break;
				}
			}
			if(tetris == true){
				return i;
			}
		}
		return -1;
	}

	this.break_row = function(row){
		this.level.splice(row, 1);
		var empty_row = [];
		for(var i = 0; i < 10; i++){
			empty_row.push([0, "black"]);
		}
		this.level.unshift(empty_row);
	}

	this.update = function(){
		var check_tetris = this.check_tetris();
		if(check_tetris != -1){
			this.break_row(check_tetris);
		}
	}

	this.render = function(){
		for(var i = 0; i < this.level.length; i++){
			for(var j = 0; j < this.level[i].length; j++){
				fill(color((this.level[i][j])[1]));
				rect(j*10, i*10, 10, 10);
			}
		}
	}
}

function Block(type){
	this.frame = 0;
	this.type = type;
	this.block;
	this.color;
	this.top_left = [4, 0];
	this.type = Math.floor(Math.random()*7);
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
	
	if(this.collision() == true){
		alert("GAME OVER");
		gameOver = true;
	}

	this.move_X = function(dir){
		this.top_left[0] += dir;
		if(this.collision()){
			this.top_left[0] -= dir;
		}
	}

	this.move_down = function(){
		this.top_left[1] += 1;
		if(this.collision()){
			this.top_left[1] -= 1;
			this.new_block();
		}
	}

	this.drop = function(){
		this.top_left[1] += 1;
		if(this.collision()){
			this.top_left[1] -= 1;
			this.new_block();
			return;
		}
		this.drop();
	}

	this.collision = function(){
		if(this.top_left[0] < 0){
			return true;
		}
		if(this.top_left[0] + this.block[0].length > 10){
			return true;
		}
		if(this.top_left[1] + this.block.length > 20){
			return true;
		}

		var block_coords = [];
		for(var i = 0; i < this.block.length; i++){
			for(var j = 0; j < this.block[i].length; j++){
				if(this.block[i][j] == 0){
					continue;
				}
				block_coords.push([this.top_left[0]+j, this.top_left[1]+i]);
			}
		}
		var other_coords = [];
		for(var i = 0; i < 20; i++){
			for(var j = 0; j < 10; j++){
				if(level.level[i][j][0] == 1){
					other_coords.push([j, i]);
				}
			}
		}
		for(var i = 0; i < block_coords.length; i++){
			for(var j = 0; j < other_coords.length; j++){
				if(block_coords[i][0] == other_coords[j][0] && block_coords[i][1] == other_coords[j][1]){
					return true;
				}
			}
		}
		return false;
	}

	this.new_block = function(){
		// Add block to level and delete block.
		for(var i = 0; i < this.block.length; i++){
			for(var j = 0; j < this.block[i].length; j++){
				if(this.block[i][j] == 0){
					continue;
				}
				level.level[this.top_left[1]+i][this.top_left[0]+j][0] = 1;
				level.level[this.top_left[1]+i][this.top_left[0]+j][1] = this.color;
			}
		}
		block = new Block();
	}

	this.rotate = function(){
		var new_block = [];
		for(var i = 0; i < this.block[0].length; i++){
			new_block[i] = [];
			for(var j = this.block.length-1; j >= 0; j--){
				new_block[i].push(this.block[j][i]);
			}
		}
		var old_block = this.block;
		this.block = new_block;
		if(this.collision()){
			this.block = old_block;
		}
	}

	this.update = function(){
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
