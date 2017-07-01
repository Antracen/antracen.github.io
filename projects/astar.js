// TODO

var level;
var pathfinder;
var numClicks;
var canvasWidth;
var canvasHeight;
var pixelsX;
var pixelsY;

var wallType = {
	EMPTY: 0,
	WALL: 1
}

function setup(){
	alert("First click on grid sets starting point. Second sets goal. After that you can place walls with mouse or by pressing \"R\" to place randomly. Then press space to start pathfinder. n to reset");
	numClicks = 0;
	// Make canvas.
	canvasWidth = 500;
	canvasHeight = 500;
	createCanvas(canvasWidth, canvasHeight);
	// Make level.
	pixelsX = 50;
	pixelsY = 50
	level = new Level(pixelsX,pixelsY);
	level.initializeLevel();
	level.render();
}

function Level(pixelsX, pixelsY){
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.pixelsX = pixelsX;
	this.pixelsY = pixelsY;
	this.pixelSizeX = floor(this.canvasWidth/this.pixelsX);
	this.pixelSizeY = floor(this.canvasHeight/this.pixelsY);
	this.start = -1;
	this.end = -1;
	this.level = []; // Keeps values [Walltype, eucledian distance to end].
	this.transitions = {}; // transitions = {x: [places you can go from x]}.

	// Get X coordinate of place in level.
	this.getX = function(gridValue){
		return gridValue % this.pixelsX;
	}

	// Get Y coordinate of place in level.
	this.getY = function(gridValue){
		return floor(gridValue/this.pixelsX);
	}

	// Fill level[] with values.
	this.initializeLevel = function(){
		for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
			var y = this.getY(i);
			var x = this.getX(i);
			var endY = this.getY(this.end);
			var endX = this.getX(this.end);
			// h-value is distance to the end calculated with Pythagorean theorem.
			var hValue = sqrt((x-endX)*(x-endX)+(y-endY)*(y-endY));
			this.level.push([wallType.EMPTY, hValue]);
		}
	}

	this.addWall = function(pos){
		// Do not add walls on start or end.
		if(!(pos == this.start) && !(pos == this.end)){
			this.level[pos][0] -= 1;
		}
	}

	// Scatter walls randomly across level.
	this.addWallsRandom = function(){
		// Higher density = less walls are placed.
		var density = 5;
		for(var i = 0; i < this.level.length/density; i++){
			var randomPos = floor(random(this.pixelsX*this.pixelsY));
			this.addWall(randomPos);
		}
	}
	
	this.resetWalls = function(){
		for(var i = 0; i < this.level.length; i++){
			this.level[i] = wallType.empty;
		}
	}

	// Add transition from first argument to all others.
	this.addTransition = function(){
		if(arguments.length > 0){
			var from = arguments[0];
			if(this.level[from][1] == wallType.WALL){
				return;
			}
			this.transitions[from] = [];
			for(var i = 1; i < arguments.length; i++) {
				var to = arguments[i];
				if(this.level[to][0] != wallType.WALL){
					this.transitions[from].push(to);
				}
			}
		}
	}

	// For every level position add which level positions are reachable.
	this.addTransitions = function(){
		// CENTER PIECES - up down left right transitions
		// FOR EVERY COLUMN EXCEPT EDGES
		for(var i = 1; i < this.pixelsX-1; i++){
			// FOR EVERY ROW EXCEPT EDGES
			for(var j = 1; j < this.pixelsY-1; j++){
				var pos = i+j*this.pixelsX;
				var up = pos-this.pixelsX;
				var down = pos+this.pixelsX;
				var left = pos-1;
				var right = pos+1;
				this.addTransition(pos, up, down, left, right);
			}
		}

		// TOP EDGES - left right down transitions
		// FOR EVERY COLUMN EXCEPT CORNERS
		for(var i = 1; i < this.pixelsX-1; i++){
			// FOR FIRST ROW
			var j = 0;
			var pos = i + j*this.pixelsX;
			var down = pos+this.pixelsX;
			var left = pos-1;
			var right = pos+1;
			this.addTransition(pos, down, left, right);
		}
		// BOTTOM EDGES - left right up transitions
		for(var i = 1; i < this.pixelsX-1; i++){
			// For last row
			var j = this.pixelsY-1;
			var pos = i + j*this.pixelsX;
			var up = pos-this.pixelsX;
			var left = pos-1;
			var right = pos+1;
			this.addTransition(pos, up, left, right);
		}
		// LEFT EDGE - add up down right transitions
		// FOR FIRST COLUMN
		var i = 0;
		// FOR ALL ROWS EXCEPT CORNERS
		for(var j = 1; j < this.pixelsY-1; j++){
			var pos = i + j*this.pixelsX;
			var up = pos-this.pixelsX;
			var down = pos+this.pixelsX;
			var right = pos+1;
			this.addTransition(pos, up, down, right);
		}
		// RIGHT EDGE - add up down left transitions
		// FOR LAST COLUMN
		var i = this.pixelsX-1;
		// FOR ALL ROWS EXCEPT CORNERS
		for(var j = 1; j < this.pixelsY-1; j++){
			var pos = i + j*this.pixelsX;
			var up = pos-this.pixelsX;
			var down = pos+this.pixelsX;
			var left = pos-1;
			this.addTransition(pos, up, down, left);
		}
		// CORNERS
		// TOP LEFT
		var pos = 0;
		var down = pos + this.pixelsX;
		var right = pos+1;
		this.addTransition(pos, down, right);
		// BOTTOM LEFT
		var pos = 0+(this.pixelsY-1)*this.pixelsX;
		var up = pos - this.pixelsX;
		var right = pos+1;
		this.addTransition(pos, up, right);
		// TOP RIGHT
		var pos = this.pixelsX-1;
		var down = pos+this.pixelsX;
		var left = pos-1;
		this.addTransition(pos, down, left);
		// BOTTOM RIGHT
		var pos = this.pixelsX-1 + (this.pixelsY-1)*this.pixelsX;
		var up = pos-this.pixelsX;
		var left = pos-1;
		this.addTransition(pos, up, left);
	}

	// Draw a level rectangle.
	this.drawRect = function(position, squareColor){
		fill(color(squareColor));
		var x = this.getX(position);
		var y = this.getY(position);
		rect(x * this.pixelSizeX, y * this.pixelSizeY, this.pixelSizeX-1, this.pixelSizeY-1);
	}

	this.render = function(){
		var squareColor = "";
		for(var i = 0; i < this.level.length; i++){
			switch(this.level[i][0]){
				case wallType.EMPTY:
					squareColor = "white";
					break;
				case wallType.WALL:
					squareColor = "black";
					break;
			}
			if(i == this.start){
				squareColor = "green";
			} else if(i == this.end){
				squareColor = "red";
			}
			this.drawRect(i, squareColor);
		}
	}
}

function PathFinder(){
	this.solution = []; // solution = [grids making up the shortest path to level.end]
	this.closedSet = new Set(); // Evaluated level squares.
	this.openSet = new Set(); // Squares not yet evaluated.
	this.openSet.add(level.start); // start is to be evaluated.
	this.cameFrom = {}; // For each node, how did you get to that node?
	this.gScore = {}; // Cost to go from start to this node.
	this.gScore[level.start] = 0;
	this.fScore = {}; // f-score = g-score + h-score. Cost to go to node + estimated cost to go to level.end.
	this.fScore[level.start] = level.level[level.start][2];

	// Choose the value in openset with smallest f-score.
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

	// Find shortest path from level.start to level.end
	// Path will be stored in this.solution
	this.findPath = function(){
		// While there are nodes to be evaluated.
		while(this.openSet.length != 0){
			// Evaluate the node which has the smallest f-value.
			var current = this.minimizeF();
			if(current == level.end){
				// We are finished.
				this.makeSolution();
				return;
			}
			// Current is no longer in the to be evaluated. It is instead placed in the closed set (nodes evaluated).
			this.openSet.delete(current);
			this.closedSet.add(current);
			// For each neighbor of current.
			for(var i = 0; i < level.transitions[current].length; i++){
				var neighbor = level.transitions[current][i];
				if(this.closedSet.has(neighbor)){
					// Don't evaluate anything twice.
					continue;
				}
				if(!(this.openSet.has(neighbor))){
					// Add not evaluated nodes into the "to be evaluated" closed set.
					this.openSet.add(neighbor);
				}
				// The cost of getting from current to next is current cost+1.
				var gScore = this.gScore[current]+1;
				if(gScore >= this.gScore[neighbor]){
					// We found a way to a node which is inefficient and therefore not interesting.
					continue;
				}
				// We found a fast way to a node. Go to the node. Note where we came from. Note score. Note fscore.
				this.cameFrom[neighbor] = current;
				this.gScore[neighbor] = gScore;
				this.fScore[neighbor] = this.gScore[neighbor] + level.level[neighbor][1];
			}
		}
	}

	// Create solution array.
	this.makeSolution = function(){
		// We are at end. From which position did we come? Go backwards until we are at start.
		var current = level.end;
		this.solution.push(current);
		while(current in this.cameFrom){
			current = this.cameFrom[current];
			this.solution.push(current);
		}
	}

	// Render player path
	this.render = function(){
		for(var i = 0; i < this.solution.length; i++){
			level.drawRect(this.solution[i], "green");
		}
	}
}

function getPos(mx, my){
	if(mx < 0 || my < 0 || mx >= level.canvasWidth || my >= level.canvasHeight){
		return -1;
	}
	var x = floor(map(mx, 0, level.canvasWidth, 0, level.pixelsX));
	var y = floor(map(my, 0, level.canvasHeight, 0, level.pixelsY));
	return(x + y*level.pixelsX);
}

function mousePressed(){
	var position = getPos(mouseX, mouseY);
	if(position != -1){
		numClicks++;
		if(numClicks == 1){
			level.start = position;
			level.render();
		} else if(numClicks == 2){
			level.end = position;
			level.render;
		} else{
			level.addWall(position);
			level.render();
		}
	}
}

function mouseDragged() {
	if(numClicks > 2){
		var position = getPos(mouseX, mouseY);
		if(position != -1){
			level.addWall(position);
			level.render();
		}
	}
}

function keyPressed(){
	if(keyCode == 32 && numClicks >= 2){
		// Add to level available transitions from each spot on grid (which way you can move from a given position).
		level.addTransitions();
		// Make pathfinder.
		pathfinder = new PathFinder();
		// Find and render path.
		console.log("FINDING PATH");
		pathfinder.findPath();
		pathfinder.render();
	}
	if(keyCode == 82 && numClicks >= 2){
		console.log("ADD RANDOM");
		level.addWallsRandom();
		level.render();
	}
	if(keyCode == 78){
		level = new Level(pixelsX,pixelsY);
		level.initializeLevel();
		level.render();
		numClicks = 0;
		pathfinder = null;
	}
}
