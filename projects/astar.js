var level;
var pathfinder;
var move;

var wallType = {
	EMPTY: 0,
	WALL: 1
}

function setup(){
	createCanvas(500,500);
	level = new Level(50,50);
	level.addWallsRandom();
	pathfinder = new PathFinder();
	frameRate(100);
}

function draw(){
	level.render();
	if(pathfinder.findPath()){
		noLoop();
	}
}

function Level(sizeX, sizeY){
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.pixelSizeX = floor(canvas.width/this.sizeX);
	this.pixelSizeY = floor(canvas.height/this.sizeY);
	this.start = [0,0];
	this.end = [this.sizeX-1, this.sizeY-1];

	this.level = [];
	for(var row = 0; row < this.sizeX; row++){
		this.column = [];
		for(var column = 0; column < this.sizeY; column++){
			this.column.push(wallType.EMPTY);
		}
		this.level.push(this.column);
	}

	this.addWallsRandom = function(){
		for(var i = 0; i < this.sizeX*this.sizeY/5; i++){
			var randomX = floor(random(this.sizeX));
			var randomY = floor(random(this.sizeY));
			if(!(randomY == 0 && randomX == 0) && !(randomY == this.sizeY-1 && randomX == this.sizeX-1)){
				this.level[randomX][randomY] = wallType.WALL;
			}
		}
	}

	this.render = function(){
		for(var x = 0; x < this.level.length; x++){
			for(var y = 0; y < this.level[x].length; y++){
				switch(this.level[x][y]){
					case wallType.EMPTY:
						fill(255);
						break;
					case wallType.WALL:
						fill(0);
						break;
				}
				rect(x * this.pixelSizeX, y * this.pixelSizeY, this.pixelSizeX-1, this.pixelSizeY-1);
			}
		}
	}
}

function PathFinder(){
	this.path = [[0,0]];
	this.visited = [];
	this.failed = [];

	this.render = function(){
		for(var i = 0; i < this.path.length; i++){
			fill(color("green"));
			rect(this.path[i][0] * level.pixelSizeX, this.path[i][1] * level.pixelSizeY, level.pixelSizeX, level.pixelSizeY);
		}
	}

	// Check if position is in this.visited and therefore should not be visited again.
	this.already_visited = function(position){
		for(var i = 0; i < this.visited.length; i++){
			if(position[0] == this.visited[i][0] && position[1] == this.visited[i][1]){
				return true;
			}
		}
		return false;
	}

	// Check if position is in this.failed and therefore should not be visited again.
	this.already_failed = function(position){
		for(var i = 0; i < this.failed.length; i++){
			if(position[0] == this.failed[i][0] && position[1] == this.failed[i][1]){
				return true;
			}
		}
		return false;
	}

	this.findPath = function(){
		this.render();
		if(this.path[this.path.length-1][0] == level.end[0] && this.path[this.path.length-1][1] == level.end[1]){
			return true;
		}
		var availableDirections = [];
		var newPos;
		// North
		newPos = [this.path[this.path.length-1][0], this.path[this.path.length-1][1]-1];
		if(newPos[1] > 0 && !this.already_visited(newPos) && !this.already_failed(newPos)){
			if(level.level[newPos[0]][newPos[1]] == wallType.EMPTY){
				availableDirections.push(newPos);
			}
		}
		// South
		newPos = [this.path[this.path.length-1][0], this.path[this.path.length-1][1]+1];
		if(newPos[1] < level.level[0].length && !this.already_visited(newPos) && !this.already_failed(newPos)){
			if(level.level[newPos[0]][newPos[1]] == wallType.EMPTY){
				availableDirections.push(newPos);
			}
		}
		// West
		newPos = [this.path[this.path.length-1][0]-1, this.path[this.path.length-1][1]];
		if(newPos[0] > 0 && !this.already_visited(newPos) && !this.already_failed(newPos)){
			if(level.level[newPos[0]][newPos[1]] == wallType.EMPTY){
				availableDirections.push(newPos);
			}
		}
		// East
		newPos = [this.path[this.path.length-1][0]+1, this.path[this.path.length-1][1]];
		if(newPos[0] < level.level.length && !this.already_visited(newPos) && !this.already_failed(newPos)){
			if(level.level[newPos[0]][newPos[1]] == wallType.EMPTY){
				availableDirections.push(newPos);
			}
		}

		if(availableDirections.length == 0){
			console.log("STUCK");
			this.failed.push(this.path[this.path.length-1]);
			this.path.pop();
			this.visited.pop();
			return false;
		}

		// Pick from available directions.
		var minCost = Infinity;
		var minDir = [];
		for(var i = 0; i < availableDirections.length; i++){
			// Pythagoras theorem.
			var cost = sqrt((availableDirections[i][0] - level.end[0])*(availableDirections[i][0] - level.end[0]) + (availableDirections[i][1] - level.end[1])*(availableDirections[i][1] - level.end[1]));
			if(cost < minCost){
				minCost = cost;
				minDir = availableDirections[i];
			}
		}
		this.path.push(minDir);
		this.visited.push(minDir);
		return false;
	}
}
