var level;
var pathfinder;
var canvasWidth;
var canvasHeight;
var clickSelector;
var drawBuffer = [];

function setup(){

	// CREATE CANVAS 
	canvasWidth = 500;
	canvasHeight = 500;
	var cnv = createCanvas(canvasWidth, canvasHeight);
	cnv.parent("canvascontainer");
	frameRate(50);
	
	// CREATE LEVEL AND RENDER IT ON THE CANVAS
	level = new Level(30,30);
	level.render();

	// CREATE A PATHFINDER
	pathfinder = new PathFinder();
	
	// CREATE BUTTONS AND DROPDOWN MENUS
	var startButton = createButton("Find path");
	startButton.position(10,canvasHeight+40);
	startButton.mousePressed(startPathfinding);
	
	var resetButton = createButton("Reset");
	resetButton.position(85,canvasHeight+ 40);
	resetButton.mousePressed(() => level.resetPathfinder());
	
	clickSelector = createSelect();
	clickSelector.position(140,canvasHeight+40);
	clickSelector.option("Place wall");
	clickSelector.option("Eraser");
	clickSelector.option("Place start");
	clickSelector.option("Place goal");

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
class Level {

	constructor(pixelsX, pixelsY) {
		this.pixelsX = pixelsX;
		this.pixelsY = pixelsY;
		this.pixelSizeX = floor(canvasWidth/this.pixelsX)-1;
		this.pixelSizeY = floor(canvasHeight/this.pixelsY)-1;
		this.start = 0;
		this.goal = this.pixelsX*this.pixelsY - 1;
		this.costToGoal = [];
		// level is an array where level[i] denotes the type of grid point i 
		// and the manhattan distance to the goal.
		this.level = [];
		// Fill level[] with empty squares.
		for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
			this.level[i] = 0;
		}
	}

	// Get array position corresponding to XY coordinates.
	posFromXY(x, y) {return x + y*this.pixelsX;}

	// Get XY coordinates of an array position.
	posToXY(pos) {return [pos % this.pixelsX, floor(pos / this.pixelsX)];}

	// Calculates all Manhattan distances.
	fillToGoalCosts() {
		for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
			var xy = this.posToXY(i);
			var goalXY = this.posToXY(this.goal);
			this.costToGoal[i] = abs(xy[0]-goalXY[0]) + abs(xy[1]-goalXY[1]);
		}
	}

	// Change square into wall or empty.
	changeSquare(pos, type) {
		this.level[pos] = type;
		if(this.start == pos) this.start = -1;
		else if(this.goal == pos) this.goal = -1;
		this.render();
	}
	
	resetPathfinder() {
		drawBuffer = [];
		// Remove all walls.
		for(var i = 0; i < this.level.length; i++){
			this.level[i] = 0;
			this.costToGoal[i] = 0;
		}
		this.start = 0;
		this.goal = this.pixelsX*this.pixelsY - 1;
		this.render();
	}

	// Draw a rectangle on canvas of a level square.
	drawRect(position, squareColor) {
		fill(color(squareColor));
		var x = (position % this.pixelsX) * this.pixelSizeX;
		var y = floor(position / this.pixelsX) * this.pixelSizeY;
		rect(x, y, this.pixelSizeX, this.pixelSizeY);
	}

	render() {
		var squareColor = "";
		for(var i = 0; i < this.pixelsX*this.pixelsY; i++){
			switch(this.level[i]){
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
class PathFinder {

	constructor() {
		this.init = false;
	}

	// Chooses the value in notEvaluated with smallest
	// cost from start to node + manhattan distance to end.
	minimizeCost(){
		var minCost = Infinity;
		var ret = 0;
		for(let node of this.notEvaluated){
			var cost = this.goToCost[node] + level.costToGoal[node];
			if(cost <= minCost){
				minCost = cost;
				ret = node;
			}
		}
		return ret;
	}

	// Evaluate the path from current to neighbour
	// Has it been visited, and if so is the new path
	// faster than the old one?
	evaluate(current, neighbour) {
		if(this.evaluated[neighbour]) return;
		if(!(this.notEvaluated.has(neighbour))){
			this.notEvaluated.add(neighbour);
			if(neighbour != level.goal) drawBuffer.push([neighbour, "#ff9696"]);
		}
		// If we already have a better way to neighbour, return.
		if(this.goToCost[current]+1 >= this.goToCost[neighbour]) return;
		
		// We found a fast way to a neighbour. 
		this.parent[neighbour] = current;
		this.goToCost[neighbour] = this.goToCost[current]+1;
	}

	findPath() {
		// Initialize everything
		this.evaluated = [];
		this.notEvaluated = new Set();
		this.notEvaluated.add(level.start);
		this.parent = {}; // For each node, what was the previous node?
		this.goToCost = {}; // Cost to go from start to this node.
		this.goToCost[level.start] = 0;
		level.fillToGoalCosts();
		this.init = true;
	
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

			if(currentXY[0]-1 >= 0){
				if(level.level[current-1] != 1){
					this.evaluate(current, current-1);
				}
			}
			if(currentXY[0]+1 < level.pixelsX){
				if(level.level[current+1] != 1){
					this.evaluate(current, current+1);
				}
			}
			if(currentXY[1]-1 >= 0){
				if(level.level[current-level.pixelsX] != 1){
					this.evaluate(current, current-level.pixelsX);
				}
			}
			if(currentXY[1]+1 < level.pixelsY){
				if(level.level[current+level.pixelsX] != 1){
					this.evaluate(current, current+level.pixelsX);
				}
			}
		}
		return false;
	}

	// Draw a green line between start and goal
	renderSolution() {
		// We are at end. From which position did we come? 
		// Go backwards until we are at start.
		var current = this.parent[level.goal];
		while(current != level.start){
			drawBuffer.push([current, "#c5ff7f"]);
			current = this.parent[current];
		}
	}
}

// Decides what to do with level based on a click at pixel (mx,my) on canvas
function handleClick(mx, my){
	
	// See which gridpoint was clicked
	clickX = floor(mx / level.pixelSizeX);
	clickY = floor(my / level.pixelSizeY);

	// Make sure the click was on the canvas
	if(clickX < 0 || clickX >= level.pixelsX) return;
	if(clickY < 0 || clickY >= level.pixelsY) return;
	
	// Determine which level point was clicked.
	var clickPos = level.posFromXY(clickX, clickY);

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

function mousePressed() {
	handleClick(mouseX, mouseY);
}

function mouseDragged() {
	handleClick(mouseX, mouseY);
}

function startPathfinding(){
	if(level.start != -1 && level.goal != -1){
		pathfinder.findPath()
	}
	else alert("Error: Must place start and goal to pathfind.");
}
