var grid;
var players;

function setup(){
		// Canvas
		createCanvas(600, 600);
		// Objects
		grid = new Grid("black");
		players = new PlayerObject();
}

function Grid(color){
	this.color = color;
	this.render();
}
Grid.prototype.render = function(){
	background(this.color);
	stroke(255);
	rect(198, 0, 3, 599);
	rect(399, 0, 3, 599);
	rect(0, 198, 599, 3);
	rect(0, 399, 599, 3);
}

function PlayerObject(){
	this.player = 1;
	// O = -1, nothing = 0, X = 1
	this.players = [0,0,0,0,0,0,0,0,0];
	this.render();
}
PlayerObject.prototype.AI = function(){
	if(this.player == -1){
		var bestPos = bestMove();
		this.players[bestPos] = -1;
		this.player = 1;
		return;
	}
}
PlayerObject.prototype.render = function(){
	for(var i = 0; i < 9; i++){
		if(this.players[i] != 0){
			x = i % 3;
			y = Math.floor(i / 3);
			this.draw(this.players[i], x, y)
		}
	}
}
PlayerObject.prototype.draw = function(shape, x, y){
	if(shape == -1){
		strokeWeight(3);
		fill(0);
		ellipse(100 + x * 200, 100 + y * 200, 160, 160);
	} else if(shape == 1){
		strokeWeight(3);
		fill(0);
		line(10 + x * 200, 10 + y * 200, 188 + x * 200, 188 + y * 200);
		line(10 + x * 200, 188 + y * 200, 188 + x * 200, 10 + y * 200);
	}
}

function bestMove(){
	var sum = -Infinity;
	var bestMove = 0;
	for(var i = 0; i < 9; i++){
		if(players.players[i] == 0){
			var minimaxsum = minimax(i);
			players.players[i] = 0;
			players.player *= -1;
			if(minimaxsum > sum){
				sum = minimaxsum;
				bestMove = i;
			}
		}
	}
	players.player = 1;
	return bestMove;
}

// Calculate the sum of all possible outcomes of this move.
function minimax(placement){

	players.players[placement] = players.player;
	players.player *= -1;

	if(checkWin()){
		return endState();
	}

	if(players.player == -1){
		// Choose the move which has the maximum value.
		var maxSum = -Infinity;

		for(var  i = 0; i < 9; i++){
			if(players.players[i] == 0){
				var minimaxSum = minimax(i);
				players.players[i] = 0;
				players.player *= -1;
				maxSum = Math.max(maxSum, minimaxSum);
			}
		}
		return maxSum;
		
	} else{
		// Choose minimum value
		var minSum = Infinity;

		for(var  i = 0; i < 9; i++){
			if(players.players[i] == 0){
				var minimaxSum = minimax(i);
				players.players[i] = 0;
				players.player *= -1;
				minSum = Math.min(minSum, minimaxSum);
			}
		}
		return minSum;
	}
}

function endState(){

	// Check if someone won.
	
	// Horizontal win X
	if(players.players[0] == 1 && players.players[1] == 1 && players.players[2] == 1 || players.players[3] == 1 && players.players[4] == 1 && players.players[5] == 1 || players.players[6] == 1 && players.players[7] == 1 && players.players[8] == 1){
		return -10;
	}

	// Horizontal win 0
	if(players.players[0] == -1 && players.players[1] == -1 && players.players[2] == -1 || players.players[3] == -1 && players.players[4] == -1 && players.players[5] == -1 || players.players[6] == -1 && players.players[7] == -1 && players.players[8] == -1){
		return 10;
	}

	// Vertical win X
	if(players.players[0] == 1 && players.players[3] == 1 && players.players[6] == 1 || players.players[1] == 1 && players.players[4] == 1 && players.players[7] == 1 || players.players[2] == 1 && players.players[5] == 1 && players.players[8] == 1){
		return -10;
	}

	// Vertical win O
	if(players.players[0] == -1 && players.players[3] == -1 && players.players[6] == -1 || players.players[1] == -1 && players.players[4] == -1 && players.players[7] == -1 || players.players[2] == -1 && players.players[5] == -1 && players.players[8] == -1){
		return 10;
	}

	// Diagonal win X
	if(players.players[0] == 1 && players.players[4] == 1 && players.players[8] == 1 || players.players[2] == 1 && players.players[4] == 1 && players.players[6] == 1){
		return -10;
	}
	
	// Diagonal win 0
	if(players.players[0] == -1 && players.players[4] == -1 && players.players[8] == -1 || players.players[2] == -1 && players.players[4] == -1 && players.players[6] == -1){
		return 10;
	}
	
	return 0;

}

function checkWin(){
	if(endState() != 0){
		return true;
	}
	// Tie
	var empty = 0;
	for(var i = 0; i < 9; i++){
		if(players.players[i] == 0){
			empty++;
		}
	}
	
	if(empty == 0){
		return true;
	}
}

function drawGrid(x, y){
	if(players.player != 1){
		return;
	}
	xx = -1;
	yy = -1;
	
	if(x > 10 && x < 188){
		xx = 0;
	} else if(x > 208 && x < 386){
		xx = 1;
	} else if(x > 406 && x < 584){
		xx = 2;
	}
	
	if(y > 10 && y < 188){
		yy = 0;
	} else if(y > 208 && y < 386){
		yy = 1;
	} else if(y > 406 && y < 584){
		yy = 2;
	}
	
	
	if(xx != -1 && yy != -1){
		gridNum = yy*3 + xx;
		if(players.players[gridNum] == 0){
			players.players[gridNum] = players.player;
			players.player *= -1;
		}
	}
}

function mousePressed(){
	if(checkWin()){
		return;
	}
	drawGrid(mouseX, mouseY);
	grid.render();
	if(checkWin()){
		players.render();
		return;
	}
	players.AI();
	players.render();
	return false;
}
