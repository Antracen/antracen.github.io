var level;
var pathfinder;
var move;

var wallType = {
	EMPTY: 0,
	WALL: 1
}

var direction = {
	UP: 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3
}

function setup(){
	var canvasWidth = 500;
	var canvasHeight = 500;
	createCanvas(canvasWidth, canvasHeight);
	level = new Level(50,50,canvasWidth,canvasHeight);
	level.initializeLevel();
	level.addWallsRandom();
	level.render();
	level.addTransitions();
	pathfinder = new PathFinder();
	pathfinder.findPath();
	pathfinder.render();
}

function Level(sizeX, sizeY, canvasWidth, canvasHeight){
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.pixelSizeX = floor(canvasWidth/this.sizeX);
	this.pixelSizeY = floor(canvasHeight/this.sizeY);
	this.start = 0;
	this.end = this.sizeX*this.sizeY-1;
	this.level = [];
	this.transitions = {};

	this.initializeLevel = function(){
		for(var i = 0; i < this.sizeX*this.sizeY; i++){
			var y = floor(i/this.sizeX);
			var x = i % this.sizeX;
			var endY = floor(this.end/this.sizeX);
			var endX = this.end % this.sizeX;
			// hValue is pythagoras theorem to end.
			var hValue = sqrt((x-endX)*(x-endX) + (y-endY)*(y-endY));
			this.level.push([wallType.EMPTY, hValue]);
		}
	}

	this.addWallsRandom = function(){
		for(var i = 0; i < this.level.length/5; i++){
			var randomPos = floor(random(this.sizeX*this.sizeY));
			if(!(randomPos == 0) && !(randomPos == this.sizeY*this.sizeX-1)){
				this.level[randomPos][0] = wallType.WALL;
			}
		}
	}

	this.addTransitions = function(){
		// CENTER PIECES - up down left right transitions
		// FOR EVERY COLUMN EXCEPT EDGES
		for(var i = 1; i < this.sizeX-1; i++){
			// FOR EVERY ROW EXCEPT EDGES
			for(var j = 1; j < this.sizeY-1; j++){
				var pos = i+j*this.sizeX;
				
				this.transitions[pos] = [];
				var up = pos-this.sizeX;
				var down = pos+this.sizeX;
				var left = pos-1;
				var right = pos+1;
				if(this.level[up][0] != wallType.WALL){
					this.transitions[pos].push(up);
				}
				if(this.level[down][0] != wallType.WALL){
					this.transitions[pos].push(down);
				}
				if(this.level[left][0] != wallType.WALL){
					this.transitions[pos].push(left);
				}
				if(this.level[right][0] != wallType.WALL){
					this.transitions[pos].push(right);
				}
			}
		}

		// TOP EDGES - left right down transitions
		// FOR EVERY COLUMN EXCEPT CORNERS
		for(var i = 1; i < this.sizeX-1; i++){
			// FOR FIRST ROW
			var j = 0;
			var pos = i + j*this.sizeX;
			
			this.transitions[pos] = [];
			var down = pos+this.sizeX;
			var left = pos-1;
			var right = pos+1;
			if(this.level[down][0] != wallType.WALL){
				this.transitions[pos].push(down);
			}
			if(this.level[left][0] != wallType.WALL){
				this.transitions[pos].push(left);
			}
			if(this.level[right][0] != wallType.WALL){
				this.transitions[pos].push(right);
			}
		}
		// BOTTOM EDGES - left right up transitions
		for(var i = 1; i < this.sizeX-1; i++){
			// For last row
			var j = this.sizeY-1;
			var pos = i + j*this.sizeX;
			
			this.transitions[pos] = [];
			var up = pos-this.sizeX;
			var left = pos-1;
			var right = pos+1;
			if(this.level[up][0] != wallType.WALL){
				this.transitions[pos].push(up);
			}
			if(this.level[left][0] != wallType.WALL){
				this.transitions[pos].push(left);
			}
			if(this.level[right][0] != wallType.WALL){
				this.transitions[pos].push(right);
			}
		}
		// LEFT EDGE - add up down right transitions
		// FOR FIRST COLUMN
		var i = 0;
		// FOR ALL ROWS EXCEPT CORNERS
		for(var j = 1; j < this.sizeY-1; j++){
			var pos = i + j*this.sizeX;
			
			this.transitions[pos] = [];
			var up = pos-this.sizeX;
			var down = pos+this.sizeX;
			var right = pos+1;
			if(this.level[up][0] != wallType.WALL){
				this.transitions[pos].push(up);
			}
			if(this.level[down][0] != wallType.WALL){
				this.transitions[pos].push(down);
			}
			if(this.level[right][0] != wallType.WALL){
				this.transitions[pos].push(right);
			}
		}
		// RIGHT EDGE - add up down left transitions
		// FOR LAST COLUMN
		var i = this.sizeX-1;
		// FOR ALL ROWS EXCEPT CORNERS
		for(var j = 1; j < this.sizeY-1; j++){
			var pos = i + j*this.sizeX;
			
			this.transitions[pos] = [];
			var up = pos-this.sizeX;
			var down = pos+this.sizeX;
			var left = pos-1;
			if(this.level[up][0] != wallType.WALL){
				this.transitions[pos].push(up);
			}
			if(this.level[down][0] != wallType.WALL){
				this.transitions[pos].push(down);
			}
			if(this.level[left][0] != wallType.WALL){
				this.transitions[pos].push(left);
			}
		}
		// CORNERS
		// TOP LEFT
		var pos = 0;
		
		this.transitions[pos] = [];
		var right = pos+1;
		var down = pos + this.sizeX;
		if(this.level[right][0] != wallType.WALL){
			this.transitions[pos].push(right);
		}
		if(this.level[down][0] != wallType.WALL){
			this.transitions[pos].push(down);
		}
		// BOTTOM LEFT
		var pos = 0+(this.sizeY-1)*this.sizeX;
		
		this.transitions[pos] = [];
		var right = pos+1;
		var up = pos - this.sizeX;
		if(this.level[right][0] != wallType.WALL){
			this.transitions[pos].push(right);
		}
		if(this.level[up][0] != wallType.WALL){
			this.transitions[pos].push(up);
		}
		// TOP RIGHT
		var pos = this.sizeX-1;
		
		this.transitions[pos] = [];
		var left = pos-1;
		var down = pos+this.sizeX;
		if(this.level[left][0] != wallType.WALL){
			this.transitions[pos].push(left);
		}
		if(this.level[down][0] != wallType.WALL){
			this.transitions[pos].push(down);
		}
		// BOTTOM RIGHT
		var pos = this.sizeX-1 + (this.sizeY-1)*this.sizeX;
		
		this.transitions[pos] = [];
		var left = pos-1;
		var up = pos-this.sizeX;
		if(this.level[left][0] != wallType.WALL){
			this.transitions[pos].push(left);
		}
		if(this.level[up][0] != wallType.WALL){
			this.transitions[pos].push(up);
		}

	}

	this.renderPos = function(i){
		var x = i % this.sizeX;
		var y = floor(i/this.sizeX);
		fill(color("green"));
		rect(x * this.pixelSizeX, y * this.pixelSizeY, this.pixelSizeX-1, this.pixelSizeY-1);
	}

	this.render = function(){
		for(var i = 0; i < this.level.length; i++){
			switch(this.level[i][0]){
				case wallType.EMPTY:
					fill(255);
					break;
				case wallType.WALL:
					fill(0);
					break;
			}
			var x = i % this.sizeX;
			var y = floor(i/this.sizeX);
			rect(x * this.pixelSizeX, y * this.pixelSizeY, this.pixelSizeX-1, this.pixelSizeY-1);
		}
	}
}

function PathFinder(){

	this.solution = [];
	this.closedSet = new Set();
	this.openSet = new Set();
	this.openSet.add(level.start);
	this.cameFrom = {};
	this.gScore = {};
	this.gScore[level.start] = 0;
	this.fScore = {};
	this.fScore[level.start] = level.level[level.start][2];

	this.render = function(){
		for(var i = 0; i < this.solution.length; i++){
			fill(color("green"));
			var y = floor(this.solution[i] / level.sizeX);
			var x = this.solution[i] % level.sizeX;
			rect(x * level.pixelSizeX, y * level.pixelSizeY, level.pixelSizeX, level.pixelSizeY);
		}
	}

	// Choose the value in openset with smallest fScore.
	this.minimizeF = function(){
		var minF = Infinity;
		var ret = 0;
		for(let node of this.openSet){
			var fScore = this.fScore[node];
			if(fScore < minF){
				minF = fScore;
				ret = node;
			}
		}
		return ret;
	}

	this.findPath = function(){
		while(this.openSet.length != 0){
			var current = this.minimizeF();
			if(current == level.end){
				this.makeSolution();
				return;
			}
			this.openSet.delete(current);
			this.closedSet.add(current);
			// For each neighbor.
			for(var i = 0; i < level.transitions[current].length; i++){
				if(this.closedSet.has(level.transitions[current][i])){
					continue;
				}
				if(!(this.openSet.has(level.transitions[current][i]))){
					this.openSet.add(level.transitions[current][i]);
				}
				var gScore = this.gScore[current]+1;
				if(gScore >= this.gScore[level.transitions[current][i]]){
					continue;
				}
				this.cameFrom[level.transitions[current][i]] = current;
				this.gScore[level.transitions[current][i]] = gScore;
				this.fScore[level.transitions[current][i]] = this.gScore[level.transitions[current][i]] + level.level[level.transitions[current][i]][1];
			}
		}
	}

	this.makeSolution = function(){
		var current = level.end;
		this.solution.push(current);
		while(current in this.cameFrom){
			current = this.cameFrom[current];
			this.solution.push(current);
		}
	}
}
