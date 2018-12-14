class Cube {

    constructor() {
      this.turns = [];
      this.turning = "none";
      this.turntick = 0;
    }

    scramble() {
      var turn_values = ["R","U","F","L","D","M","B","X","Y"];
      for(var i = 0; i < 50; i++) {
        var random_turn = int(random(0, turn_values.length));
        cube.turns.push(turn_values[random_turn]);
      }
    }
  
    update() {
      if (this.turning == "none" && this.turns.length > 0) {
        this.turning = this.turns.shift();
      }
  
      if(this.turning == "init") {
        draw_change = true;
        this.turning = "none";
      }
      else if(this.turning != "none") {
        var old_blocks, new_blocks;
        if(this.turning == "R") {
          old_blocks = [2, 5, 8, 11, 14, 17, 20, 23, 26];
          new_blocks = [20,11,2,23,14,5,26,17,8];
        }
        else if(this.turning == "R'") {
          old_blocks = [20,11,2,23,14,5,26,17,8];
          new_blocks = [2, 5, 8, 11, 14, 17, 20, 23, 26];
        }
        else if(this.turning == "F") {
          old_blocks = [0, 1, 2, 9, 10, 11, 18, 19, 20];
          new_blocks = [18,9,0,19,10,1,20,11,2];
        }
        else if(this.turning == "F'") {
          old_blocks = [18,9,0,19,10,1,20,11,2];
          new_blocks = [0, 1, 2, 9, 10, 11, 18, 19, 20];
        }
        else if(this.turning == "U") {
          old_blocks = [0,1,2,3,4,5,6,7,8];
          new_blocks = [2,5,8,1,4,7,0,3,6];
        }
        else if(this.turning == "U'") {
          old_blocks = new_blocks = [2,5,8,1,4,7,0,3,6];
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
  
        for (var i of old_blocks) {
          for (var m_sq of blocks[i]) {
            rotate_square('X', m_sq.points, PI / 4);
            if(this.turning == "R") rotate_square('X', m_sq.points, PI/20);
            else if(this.turning == "R'") rotate_square('X', m_sq.points, -PI/20);
            else if(this.turning == "F") rotate_square('Z', m_sq.points, PI/20);
            else if(this.turning == "F'") rotate_square('Z', m_sq.points, -PI/20);
            else if(this.turning == "U") rotate_square('Y', m_sq.points, -PI/20);
            else if(this.turning == "U'") rotate_square('Y', m_sq.points, PI/20);
            else if(this.turning == "L") rotate_square('X', m_sq.points, -PI/20);
            else if(this.turning == "L'") rotate_square('X', m_sq.points, PI/20);
            else if(this.turning == "D") rotate_square('Y', m_sq.points, PI/20);
            else if(this.turning == "D'") rotate_square('Y', m_sq.points, -PI/20);
            else if(this.turning == "B") rotate_square('Z', m_sq.points, -PI/20);
            else if(this.turning == "B'") rotate_square('Z', m_sq.points, PI/20);
            else if(this.turning == "M") rotate_square('X', m_sq.points, -PI/20);
            else if(this.turning == "M'") rotate_square('X', m_sq.points, PI/20);
            else if(this.turning == "X") rotate_square('X', m_sq.points, PI/20);
            else if(this.turning == "X'") rotate_square('X', m_sq.points, -PI/20);
            else if(this.turning == "Y") rotate_square('Y', m_sq.points, -PI/20);
            else if(this.turning == "Y'") rotate_square('Y', m_sq.points, PI/20);
            rotate_square('X', m_sq.points, -PI / 4);
            draw_change = true;
          }
        }
        this.turntick++;
        if (this.turntick > 9) {
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