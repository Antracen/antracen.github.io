var grid;

function setup() {
	var canvas = createCanvas(500, 500);
    grid = new Grid();
    render_grid();
    grid.render();
}

class Square {
	constructor(value) {
    	this.value = value;
    }

	render(i, j) {
		switch(this.value) {
			case 2:
				this.color = "#FFC0F3";
				this.text_color = "#575757";
				this.offset = 0;
				break;
			case 4:
				this.color = "#CC00A2";
				this.text_color = "#ffffff";
				this.offset = 0;
                break;
			case 8:
				this.color = "#A0FF8F";
				this.text_color = "#ffffff";
				this.offset = 0;
				break;
			case 16:
				this.color = "#169700";
				this.text_color = "#ffffff";
				this.offset = -10;
				break;
			case 32:
				this.color = "#4FB2F1";
				this.text_color = "#ffffff";
				this.offset = -10;
				break;
			case 64:
				this.color = "#0068AA";
				this.text_color = "#ffffff";
				this.offset = -10;
				break;
			case 128:
				this.color = "#EF4153";
				this.text_color = "#ffffff";
				this.offset = -20;
				break;
			case 256:
				this.color = "#B40012";
				this.text_color = "#ffffff";
				this.offset = -20;
				break;
			case 512:
				this.color = "#FFB456";
				this.text_color = "#ffffff";
				this.offset = -20;
				break;
			case 1024:
				this.color = "#D07400";
				this.text_color = "#ffffff";
				this.offset = -32;
				break;
			case 2048:
				this.color = "#DBDB00";
				this.text_color = "#ffffff";
				this.offset = -32;
				break;
			case 4096:
				this.color = "#807F0E";
				this.text_color = "#ffffff";
				this.offset = -32;
				break;
			default:
				this.color = "#282800";
				this.text_color = "#ffffff";
				this.offset = -32;
				break;
		}
		fill(this.color);
    	rect(16 + j*121, 16 + i*121, 105, 105, 15);
        fill(this.text_color);
		//~ textFont("Helvetica");
        textSize(40);
        text(this.value, 16 + j*121 + 40 + this.offset, 16 + i*121 + 70)
	}
}

class Grid {
	constructor() {
        this.squares = [[0,0,0,0],
						[0,0,0,0],
						[0,0,0,0],
						[0,0,0,0]];

		this.spawn_square();
		this.spawn_square();
    }

	spawn_square() {
		var empty_squares = [];
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				if(this.squares[i][j] == 0) empty_squares.push([i,j]);
			}
		}
		var random_square = floor(random(0, empty_squares.length));
		var random_value = floor(random(0,10)) < 9 ? 2 : 4;
		
		this.squares[empty_squares[random_square][0]][empty_squares[random_square][1]] = new Square(random_value);
	}

	move_squares(squares) {
		var moved = false;
		for(var i = 2; i >= 0; i--) {
			if(this.squares[squares[i][0]][squares[i][1]] == 0) continue;
			if(this.squares[squares[i+1][0]][squares[i+1][1]] == 0) {
				this.squares[squares[i+1][0]][squares[i+1][1]] = this.squares[squares[i][0]][squares[i][1]];
				this.squares[squares[i][0]][squares[i][1]] = 0;
				moved = true;
			}
		}
		if(!moved) return false;
		else this.move_squares(squares);
		return true;
	}
    
	merge_squares(squares) {
		var merged = false;
		for(var i = 2; i >= 0; i--) {
			if(this.squares[squares[i][0]][squares[i][1]] == 0) continue;
			if(this.squares[squares[i+1][0]][squares[i+1][1]].value == this.squares[squares[i][0]][squares[i][1]].value) {
				this.squares[squares[i+1][0]][squares[i+1][1]].value *= 2;
				this.squares[squares[i][0]][squares[i][1]] = 0;
				merged = true;
			}
		}
		if(merged) this.move_squares(squares);
		return merged;
	}

    move(i, j) {
		var move_made = false;
		var squares;
    	if(i == 1) {
			for(var col = 0; col < 4; col++) {
				move_made = this.move_squares([[0,col], [1,col], [2,col], [3,col]]) || move_made;
				move_made = (this.merge_squares([[0,col], [1,col], [2,col], [3,col]]) || move_made);
			}
        }
        else if(i == -1) {
			for(var col = 0; col < 4; col++) {
				move_made = this.move_squares([[3,col], [2,col], [1,col], [0,col]]) || move_made;
				move_made = (this.merge_squares([[3,col], [2,col], [1,col], [0,col]]) || move_made);
			}
        }
        else if(j == 1) {
			for(var row = 0; row < 4; row++) {
				move_made = this.move_squares([[row,0], [row, 1], [row,2], [row,3]]) || move_made;
				move_made = (this.merge_squares([[row,0], [row, 1], [row,2], [row,3]]) || move_made);
			}
        }
        else if(j == -1) {
			for(var row = 0; row < 4; row++) {
				move_made = this.move_squares([[row,3], [row, 2], [row,1], [row,0]]) || move_made;
				move_made = (this.merge_squares([[row,3], [row, 2], [row,1], [row,0]]) || move_made);
			}
        }
		return move_made;
    }
    
    render() {
    	for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				if(this.squares[i][j] != 0) {
					this.squares[i][j].render(i, j);
				}
			}
        }
    }
}

function render_grid() {
	noStroke();
    fill("#484848");
    rect(0, 0, 500, 500, 8);
    fill("#6B6B6B");
	for(var i = 0; i < 4; i++) {
    	for(var j = 0; j < 4; j++) {
        	rect(16 + j*121, 16 + i*121, 105, 105, 15);
        }
    }
}

function keyPressed() {
	if(keyCode == DOWN_ARROW) {
    	if(!grid.move(1, 0)) return;
    }
    else if(keyCode == UP_ARROW) {
    	if(!grid.move(-1, 0)) return;
    }
	else if(keyCode == LEFT_ARROW) {
    	if(!grid.move(0, -1)) return;
    }
	else if(keyCode == RIGHT_ARROW) {
    	if(!grid.move(0, 1)) return;
    }
	else return;
	grid.spawn_square();
    render_grid();
    grid.render();
}
