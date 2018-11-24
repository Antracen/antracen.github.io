// TODO: More efficient data structures.
// This pathfinder goes from start to goal using the A* algorithm.
var level;
var pathfinder;
var canvasWidth;
var canvasHeight;
var clickSelector;
var drawBuffer = [];

function setup(){
	canvasWidth = 600;
	canvasHeight = 600;
	createCanvas(canvasWidth, canvasHeight);
	
	level = new Level(30,30);
	level.render();

	pathfinder = new PathFinder();
	
	var startButton = createButton("Find path");
	startButton.position(10,canvasHeight+160);
	startButton.mousePressed(startPathfinding);
	
	var resetButton = createButton("Reset");
	resetButton.position(85,canvasHeight+160);
	resetButton.mousePressed(() => level.resetPathfinder());
	
	clickSelector = createSelect();
	clickSelector.position(140,canvasHeight+160);
	clickSelector.option("Place wall");
	clickSelector.option("Eraser");
	clickSelector.option("Place start");
	clickSelector.option("Place goal");
	frameRate(30);
}

function draw() {
	if(drawBuffer.length > 0) {
		var instruction = drawBuffer.shift();
		level.drawRect(instruction[0], instruction[1]);
	}
}

// The level is represented as an array containing information about
// level squares. A square is a 2d array. First element is 0 if square
// is empty, 1 if it is a wall. Second element contains Manhattan distance
// from square to goal.
function Level(pixelsX, pixelsY){
	this.pixelsX = pixelsX;
	this.pixelsY = pixelsY;
	this.pixelSizeX = floor(canvasWidth/this.pixelsX)-1;
	this.pixelSizeY = floor(canvasHeight/this.pixelsY)-1;
	this.start = -1;
	this.goal = -1;
	this.level = [];

	// Fill level[] with empty squares.
	for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
		this.level[i] = [0, -1];
	}

	// Get array position corresponding to XY coordinates.
	this.posFromXY = function(x, y){
		return x + y*this.pixelsX;
	}

	// Get XY coordinates of an array position.
	this.posToXY = function(pos){
		return [pos % this.pixelsX, floor(pos / this.pixelsX)];
	}

	// Calculates all Manhattan distances.
	this.fillToGoalCosts = function(){
		for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
			var xy = this.posToXY(i);
			var goalXY = this.posToXY(this.goal);
			this.level[i][1] = abs(xy[0]-goalXY[0]) + abs(xy[1]-goalXY[1]);
		}
	}

	// Change square into wall or empty.
	this.changeSquare = function(pos, type){
		this.level[pos][0] = type;
		if(this.start == pos) this.start = -1;
		else if(this.goal == pos) this.goal = -1;
		this.render();
	}
	
	this.resetPathfinder = function(){
		// Remove all walls.
		for(var i = 0; i < this.level.length; i++){
			this.level[i][0] = 0;
			this.level[i][1] = 0;
		}
		this.start = -1;
		this.goal = -1;
		this.render();
	}

	// Draw a rectangle on canvas of a level square.
	this.drawRect = function(position, squareColor){
		fill(color(squareColor));
		var x = (position % this.pixelsX) * this.pixelSizeX;
		var y = floor(position / this.pixelsX) * this.pixelSizeY;
		rect(x, y, this.pixelSizeX, this.pixelSizeY);
	}

	this.render = function(){
		var squareColor = "";
		for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
			switch(this.level[i][0]){
				case 0:
					squareColor = "white";
					break;
				case 1:
					squareColor = "black";
					break;
			}
			this.drawRect(i, squareColor);
		}
		this.drawRect(this.start, "green");
		this.drawRect(this.goal, "red");
	}
}

// Finds path from start to goal and renders it on canvas.
function PathFinder(){

	this.init = false;

	// Chooses the value in notEvaluated with smallest
	// cost from start to node + manhattan distance to end.
	this.minimizeCost = function(){
		var minCost = Infinity;
		var ret = 0;
		for(let node of this.notEvaluated){
			var cost = this.goToCost[node] + level.level[node][1];
			if(cost <= minCost){
				minCost = cost;
				ret = node;
			}
		}
		return ret;
	}

	this.findPath = function() {
		this.findPathInit();
		return this.findPathStep();
	}

	this.findPathInit = function() {
		this.evaluated = [];
		this.notEvaluated = new Set();
		this.notEvaluated.add(level.start);
		this.parent = {}; // For each node, what was the previous node?
		this.goToCost = {}; // Cost to go from start to this node.
		this.goToCost[level.start] = 0;
		level.fillToGoalCosts();
		this.init = true;
	}

	this.findPathStep = function(){
		while(this.notEvaluated.size != 0) {
			// Evaluate the node which has the smallest cost.
			var current = this.minimizeCost();
			if(current != level.start && current != level.goal) {
				drawBuffer.push([current, "#7fb0ff"]);
			}
			if(current == level.goal){
				// We are finished.
				this.renderSolution();
				return true;
			}
			this.notEvaluated.delete(current);
			this.evaluated[current] = true;

			var currentXY = level.posToXY(current);
			var neighbours = [];

			if(currentXY[0]-1 >= 0){
				if(level.level[current-1][0] != 1){
					neighbours.push(current-1);
				}
			}
			if(currentXY[0]+1 < level.pixelsX){
				if(level.level[current+1][0] != 1){
					neighbours.push(current+1);
				}
			}
			if(currentXY[1]-1 >= 0){
				if(level.level[current-level.pixelsX][0] != 1){
					neighbours.push(current-level.pixelsX);
				}
			}
			if(currentXY[1]+1 < level.pixelsY){
				if(level.level[current+level.pixelsX][0] != 1){
					neighbours.push(current+level.pixelsX);
				}
			}

			for(var neighbour of neighbours){
				if(this.evaluated[neighbour]) continue;
				if(!(this.notEvaluated.has(neighbour))){
					this.notEvaluated.add(neighbour);
					if(neighbour != level.goal) drawBuffer.push([neighbour, "#ff9696"]);
				}
				if(this.goToCost[current]+1 >= this.goToCost[neighbour]){
					continue; // We already have a better way to neighbour.
				}
				// We found a fast way to a neighbour. Go to the square. 
				this.parent[neighbour] = current;
				this.goToCost[neighbour] = this.goToCost[current]+1;
			}
		}
		return false;
	}

	this.renderSolution = function(){
		// We are at end. From which position did we come? 
		// Go backwards until we are at start.
		var current = this.parent[level.goal];
		while(current != level.start){
			drawBuffer.push([current, "#c5ff7f"]);
			current = this.parent[current];
		}
	}
}

function handleClick(mx, my){
	clickX = floor(mx / level.pixelSizeX);
	clickY = floor(my / level.pixelSizeY);
	if(clickX < 0 || clickX >= level.pixelsX) return;
	if(clickY < 0 || clickY >= level.pixelsY) return;
	var clickPos = level.posFromXY(clickX, clickY);
	var wall = "";
	switch(clickSelector.value()){
		case "Place wall":
			level.changeSquare(clickPos, 1);
			break;
		case "Eraser":
			level.changeSquare(clickPos, 0);
			break;
		case "Place start":
			level.changeSquare(clickPos, 0);
			level.start = clickPos;
			level.render();
			break;			
		case "Place goal":
			level.changeSquare(clickPos, 0);
			level.goal = clickPos;
			level.render();
			break;			
	}
}

function mousePressed(){
	handleClick(mouseX, mouseY);
}

function mouseDragged() {
	handleClick(mouseX, mouseY);
}

function startPathfinding(){
	if(level.start != -1 && level.goal != -1){
		if(!pathfinder.findPath()) alert("No path found");
	}
	else alert("Error: Must place start and goal to pathfind.");
}