var level;
var difficulty = 3;
var ai;

// INTIALIZE
function setup(){
	createCanvas(800, 800);
	level = new Level(4);
}

// LEVEL OBJECT HOLDS INFORMATION ABOUT BOARD AND A RENDERER
class Level {

	constructor(size) {
		this.size = size;

		this.empty_grids = size*size;

		this.state = new Array(size);
		for(var i = 0; i < size; i++) {
			this.state[i] = new Array(size);
			for(var j = 0; j < size; j++) {
				this.state[i][j] = 0;
			}
		}

		this.render();		
	}

	render() {
		background(0);
		stroke("red");
		for(var i = 1; i < this.size; i++) {
			line(0, i*canvas.height/this.size, canvas.width, i*canvas.height/this.size);
			line(i*canvas.width/this.size, 0, i*canvas.width/this.size, canvas.height);
		}
	}
}

// DRAW AN X OR AN O AT (i,j)
function draw_shape(shape, i, j) {
	if(shape == 'O') {
		fill(0);
		ellipse((j+0.5) * canvas.width/level.size, (i+0.5) * canvas.height/level.size, canvas.width/level.size, canvas.height/level.size);
	} else if(shape == 'X') {
		line(j * canvas.width/level.size, i * canvas.height/level.size, (j+1) * canvas.width/level.size, (i+1) * canvas.height/level.size);
		line(j * canvas.width/level.size, (i+1) * canvas.height/level.size, (j+1) * canvas.height/level.size, i * canvas.width/level.size);
	}
}

// MAKE A MOVE
function AI_move() {
	var sum = -Infinity;
	var bestMove;
	for(var i = 0; i < level.size; i++) {
		for(var j = 0; j < level.size; j++) {
			if(level.state[i][j] == 0) {
				var move_value = minimax(i, j, difficulty, 'O');
				level.empty_grids++;
				level.state[i][j] = 0;
				if(move_value > sum) {
					sum = move_value;
					bestMove = [i,j];
				}
			}
		}
	}
	level.state[bestMove[0]][bestMove[1]] = 'O';
	level.empty_grids--;
	draw_shape('O', bestMove[0], bestMove[1]);
}

// MINIMAX USED TO MAKE OPTIMAL AI MOVE i,j
function minimax(i, j, depth, player) {
	level.state[i][j] = player;
	level.empty_grids--;

	var winInfo = endState();

	var empty = 0;
	for(var i = 0; i < level.size; i++)
	for(var j = 0; j < level.size; j++)
		if(level.state[i][j] == 0) empty++;

	if(depth == 0 || level.empty_grids == 0 || winInfo != 0) return winInfo;

	if(player == 'O') {
		// Choose optimal value for player X
		var optVal = Infinity;

		for(var i = 0; i < level.size; i++) {
			for(var j = 0; j < level.size; j++) {
				if(level.state[i][j] == 0){
					var minimaxSum = minimax(i, j, depth-1, 'X');
					level.state[i][j] = 0;
					level.empty_grids++;
					optVal = (minimaxSum < optVal) ? minimaxSum : optVal;
				}
			}
		}
		return optVal;	
	}
	else {
		// Choose optimal value for player X
		var optVal = -Infinity;

		for(var i = 0; i < level.size; i++) {
			for(var j = 0; j < level.size; j++) {
				if(level.state[i][j] == 0) {
					var minimaxSum = minimax(i, j, depth-1, 'O');
					level.state[i][j] = 0;
					level.empty_grids++;
					optVal = (minimaxSum > optVal) ? minimaxSum : optVal;
				}
			}
		}
		return optVal;	
	}
}

// CHECK IF SOMEONE WON
function endState(){

	// Row wins
	X_row = [];
	O_row = [];
	X_col = [];
	O_col = [];
	for(var k = 0; k < level.size; k++) {
		X_row.push(0);
		X_col.push(0);
		O_row.push(0);
		O_col.push(0);
	}
	for(var i = 0; i < level.size; i++) {
		for(var j = 0; j < level.size; j++) {
			if(level.state[i][j] == 'X') {
				X_row[i]++;
				X_col[j]++;
			}
			else if(level.state[i][j] == 'O') {
				O_row[i]++;
				O_col[j]++;
			}
		}
	}
	for(var k = 0; k < level.size; k++) {
		if(X_row[k] == level.size || X_col[k] == level.size) return -1;
		if(O_row[k] == level.size || O_col[k] == level.size) return 1;
	}

	// Diagonal win
	X_diag = [0,0];
	O_diag = [0,0];
	for(var k = 0; k < level.size; k++) {
		if(level.state[k][k] == 'X') X_diag[0]++;
		else if(level.state[k][k] == 'O') O_diag[0]++;

		if(level.state[level.size-k-1][k] == 'X') X_diag[1]++;
		else if(level.state[level.size-k-1][k] == 'O') O_diag[1]++;
	}
	if(X_diag[0] == level.size || X_diag[1] == level.size) return -1;
	if(O_diag[0] == level.size || O_diag[1] == level.size) return 1;

	return 0;
}

// PUT AN X AT MOUSE PRESS (mx,my) AND LET AI MAKE A MOVE
function makeMove(mx, my) {

	if(endState() != 0 || level.empty_grids == 0) return;

	j = floor(mx/(canvas.width/level.size));
	i = floor(my/(canvas.height/level.size));

	if(j >= 0 && j < level.size && i >= 0 && i < level.size && level.state[i][j] == 0) {
		level.state[i][j] = 'X';
		draw_shape('X', i, j);
		level.empty_grids--;
		if(endState() != 0 || level.empty_grids == 0) return;
		AI_move();
	}
}

// EVERY TIME WE PRESS MOUSE, MAKE A MOVE
function mousePressed() {
	makeMove(mouseX, mouseY);
}

function keyPressed(){
	// CHANGE DIFFICULTY
	if(keyCode >= 48 && keyCode <= 53){
		difficulty = keyCode - 48;
		document.getElementById("currDiff").innerHTML = "Current difficulty: " + difficulty;
	}
}
