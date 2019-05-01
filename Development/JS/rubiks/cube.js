/*
 *  The Cube class handles the turning of the cube.
 */

class Cube {

    constructor() {
        this.fast_turn = false;
        this.turns = [];
        this.turning = "none";
        this.turntick = 0;
        this.turn_size = 6; // How many frames it takes for a move to render
    }

    scramble() {
        var turn_values = ["R","U","F","L","D","B"];
        for(var i = 0; i < 60; i++) {
            var random_turn = int(random(0, turn_values.length));
			var degree = int(random(1,3));
			for(var j = 0; j < degree; j++) {
				cube.turns.push(turn_values[random_turn]);
			}
        }
    }
  
    update() {
        if(this.turns.length > 0) {
            if(this.turning == "none") this.turning = this.turns.shift();
        }
  
        if(this.turning == "init") {
            draw_change = true;
            this.turning = "none";
        }
        else if(this.turning != "none") {
            // old_blocks are the blocks which are part of the turning layer
            // new_blocks states which block will be in the turning layer after turn
            // Example:
            //    old_blocks = [2,5,8,11,14,17,20,23,26];
            //    new_blocks = [20,11,2,23,14,5,26,17,8];
            //    Where the block "2" is now, the block "20" will be after the turn
            var old_blocks, new_blocks;
            if(this.turning == "R") {
                old_blocks = [2,5,8,11,14,17,20,23,26];
                new_blocks = [20,11,2,23,14,5,26,17,8];
            }
            else if(this.turning == "R'") {
                old_blocks = [20,11,2,23,14,5,26,17,8];
                new_blocks = [2,5,8,11,14,17,20,23,26];
            }
            else if(this.turning == "F") {
                old_blocks = [0,1,2,9,10,11,18,19,20];
                new_blocks = [18,9,0,19,10,1,20,11,2];
            }
            else if(this.turning == "F'") {
                old_blocks = [18,9,0,19,10,1,20,11,2];
                new_blocks = [0,1,2,9,10,11,18,19,20];
            }
            else if(this.turning == "U") {
                old_blocks = [0,1,2,3,4,5,6,7,8];
                new_blocks = [2,5,8,1,4,7,0,3,6];
            }
            else if(this.turning == "U'") {
                old_blocks = [2,5,8,1,4,7,0,3,6];
                new_blocks = [0,1,2,3,4,5,6,7,8];
            }
            else if(this.turning == "L") {
                old_blocks = [0,3,6,9,12,15,18,21,24];
                new_blocks = [6,15,24,3,12,21,0,9,18];
            }
            else if(this.turning == "L'") {
                old_blocks = [6,15,24,3,12,21,0,9,18];
                new_blocks = [0,3,6,9,12,15,18,21,24];
            }
            else if(this.turning == "D") {
                old_blocks = [18,19,20,21,22,23,24,25,26];
                new_blocks = [24,21,18,25,22,19,26,23,20];
            }
            else if(this.turning == "D'") {
                old_blocks = [24,21,18,25,22,19,26,23,20];
                new_blocks = [18,19,20,21,22,23,24,25,26];
            }
            else if(this.turning == "B") {
                old_blocks = [6,7,8,15,16,17,24,25,26];
                new_blocks = [8,17,26,7,16,25,6,15,24];
            }
            else if(this.turning == "B'") {
                old_blocks = [8,17,26,7,16,25,6,15,24];
                new_blocks = [6,7,8,15,16,17,24,25,26];
            }
            else if(this.turning == "M") {
                old_blocks = [19,10,1,22,13,4,25,16,7];
                new_blocks = [1,4,7,10,13,16,19,22,25];
            }
            else if(this.turning == "M'") {
                old_blocks = [1,4,7,10,13,16,19,22,25];
                new_blocks = [19,10,1,22,13,4,25,16,7];
            }
            else if(this.turning == "X") {
                old_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
                new_blocks = [18,19,20,9,10,11,0,1,2,21,22,23,12,13,14,3,4,5,24,25,26,15,16,17,6,7,8];
            }
            else if(this.turning == "X'") {
                old_blocks = [18,19,20,9,10,11,0,1,2,21,22,23,12,13,14,3,4,5,24,25,26,15,16,17,6,7,8];
                new_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
            }
            else if(this.turning == "Y") {
                old_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
                new_blocks = [2,5,8,1,4,7,0,3,6,11,14,17,10,13,16,9,12,15,20,23,26,19,22,25,18,21,24];
            }
            else if(this.turning == "Y'") {
                old_blocks = [2,5,8,1,4,7,0,3,6,11,14,17,10,13,16,9,12,15,20,23,26,19,22,25,18,21,24];
                new_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
            }
  
            for(var i of old_blocks) {
                for(var m_sq of blocks[i]) {
                    rotate_square('X', m_sq.points, PI / 4);
                    if(this.turning == "R") rotate_square('X', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "R'") rotate_square('X', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "F") rotate_square('Z', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "F'") rotate_square('Z', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "U") rotate_square('Y', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "U'") rotate_square('Y', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "L") rotate_square('X', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "L'") rotate_square('X', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "D") rotate_square('Y', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "D'") rotate_square('Y', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "B") rotate_square('Z', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "B'") rotate_square('Z', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "M") rotate_square('X', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "M'") rotate_square('X', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "X") rotate_square('X', m_sq.points, HALF_PI/this.turn_size);
                    else if(this.turning == "X'") rotate_square('X', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "Y") rotate_square('Y', m_sq.points, -HALF_PI/this.turn_size);
                    else if(this.turning == "Y'") rotate_square('Y', m_sq.points, HALF_PI/this.turn_size);
                    rotate_square('X', m_sq.points, -PI / 4);
                    draw_change = true;
                }
            }

            this.turntick++;
            if(this.turntick > this.turn_size - 1) {
                this.turntick = 0;
                this.turning = "none";
                var blocks_backup = blocks.slice();
                for(var i = 0; i < old_blocks.length; i++) {
                    blocks[old_blocks[i]] = blocks_backup[new_blocks[i]];
                }
            }
        }
    }
}
