// KONTROLLER: 
// j/f styr toppen
// i/k styr höger
// e/d styr vänster
// g/h styr framsidan
// v/n styr botten
// Sätt pretty = true för att få en snygg kub

var bg_color = "#ffffff"; //"#ffede2";
var pretty = false;
var faces = [];
var blocks = [];
var animate = [-1, -1];
var cube;
var draw_change = true;

function setup() {

  for (var i = 0; i < 9 * 3; i++) {
    blocks.push([]);
  }

  createCanvas(800, 800, WEBGL);
  faces.push(new Face("#0000ff", "BACK"));
  faces.push(new Face("#ff9000", "LEFT"));
  faces.push(new Face("#ff0000", "RIGHT"));
  faces.push(new Face("#ffff00", "BOTTOM"));
  faces.push(new Face("#ffffff", "TOP"));
  faces.push(new Face("#00ff00", "FRONT"));
  for (var f of faces) {
    f.m_translateX(-faces[0].sq_size * 3 * 0.5);
    f.m_translateY(-faces[0].sq_size * 3 * 0.5);
    f.m_translateZ(faces[0].sq_size * 3 * 0.5);
    f.m_rotateX(-PI / 4);
  }

  cube = new Cube();
  cube.turns.push("init");
  cube.turns.push("init");
	
}

function helpme() {
	console.log("hello");
	alert("hello");
}

class Cube {

  constructor() {
    this.turns = [];
    this.turning = "none";
    this.turntick = 0;
  }

  update() {
    if (this.turning == "none" && this.turns.length > 0) {
      this.turning = this.turns.shift();
    }

    if (this.turning == "U") {
      for (var i = 0; i < 9; i++) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateY(-PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_0 = blocks[0];
        var blocks_backup_1 = blocks[1];
        var blocks_backup_2 = blocks[2];
        var blocks_backup_3 = blocks[3];
        var blocks_backup_4 = blocks[4];
        var blocks_backup_5 = blocks[5];
        var blocks_backup_6 = blocks[6];
        var blocks_backup_7 = blocks[7];
        var blocks_backup_8 = blocks[8];
        blocks[0] = blocks_backup_2;
        blocks[1] = blocks_backup_5;
        blocks[2] = blocks_backup_8;
        blocks[3] = blocks_backup_1;
        blocks[4] = blocks_backup_4;
        blocks[5] = blocks_backup_7;
        blocks[6] = blocks_backup_0;
        blocks[7] = blocks_backup_3;
        blocks[8] = blocks_backup_6;
      }
    } else if (this.turning == "U'") {
      for (var i = 0; i < 9; i++) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateY(PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_0 = blocks[0];
        var blocks_backup_1 = blocks[1];
        var blocks_backup_2 = blocks[2];
        var blocks_backup_3 = blocks[3];
        var blocks_backup_4 = blocks[4];
        var blocks_backup_5 = blocks[5];
        var blocks_backup_6 = blocks[6];
        var blocks_backup_7 = blocks[7];
        var blocks_backup_8 = blocks[8];
        blocks[2] = blocks_backup_0;
        blocks[5] = blocks_backup_1;
        blocks[8] = blocks_backup_2;
        blocks[1] = blocks_backup_3;
        blocks[4] = blocks_backup_4;
        blocks[7] = blocks_backup_5;
        blocks[0] = blocks_backup_6;
        blocks[3] = blocks_backup_7;
        blocks[6] = blocks_backup_8;
      }
    } else if (this.turning == "R") {
      var right_blocks = [2, 5, 8, 11, 14, 17, 20, 23, 26];
      for (var i of right_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateX(PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_2 = blocks[2];
        var blocks_backup_5 = blocks[5];
        var blocks_backup_8 = blocks[8];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_14 = blocks[14];
        var blocks_backup_17 = blocks[17];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_26 = blocks[26];
        blocks[2] = blocks_backup_20;
        blocks[5] = blocks_backup_11;
        blocks[8] = blocks_backup_2;
        blocks[11] = blocks_backup_23;
        blocks[14] = blocks_backup_14;
        blocks[17] = blocks_backup_5;
        blocks[20] = blocks_backup_26;
        blocks[23] = blocks_backup_17;
        blocks[26] = blocks_backup_8;
      }
    } else if (this.turning == "R'") {
      var right_blocks = [2, 5, 8, 11, 14, 17, 20, 23, 26];
      for (var i of right_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateX(-PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_2 = blocks[2];
        var blocks_backup_5 = blocks[5];
        var blocks_backup_8 = blocks[8];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_14 = blocks[14];
        var blocks_backup_17 = blocks[17];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_26 = blocks[26];
        blocks[20] = blocks_backup_2;
        blocks[11] = blocks_backup_5;
        blocks[2] = blocks_backup_8;
        blocks[23] = blocks_backup_11;
        blocks[14] = blocks_backup_14;
        blocks[5] = blocks_backup_17;
        blocks[26] = blocks_backup_20;
        blocks[17] = blocks_backup_23;
        blocks[8] = blocks_backup_26;
      }
    } else if (this.turning == "F") {
      var front_blocks = [0, 1, 2, 9, 10, 11, 18, 19, 20];
      for (var i of front_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateZ(PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_0 = blocks[0];
        var blocks_backup_1 = blocks[1];
        var blocks_backup_2 = blocks[2];
        var blocks_backup_9 = blocks[9];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        blocks[0] = blocks_backup_18;
        blocks[1] = blocks_backup_9;
        blocks[2] = blocks_backup_0;
        blocks[9] = blocks_backup_19;
        blocks[10] = blocks_backup_10;
        blocks[11] = blocks_backup_1;
        blocks[18] = blocks_backup_20;
        blocks[19] = blocks_backup_11;
        blocks[20] = blocks_backup_2;
      }
    } else if (this.turning == "F'") {
      var front_blocks = [0, 1, 2, 9, 10, 11, 18, 19, 20];
      for (var i of front_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateZ(-PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_0 = blocks[0];
        var blocks_backup_1 = blocks[1];
        var blocks_backup_2 = blocks[2];
        var blocks_backup_9 = blocks[9];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        blocks[18] = blocks_backup_0;
        blocks[9] = blocks_backup_1;
        blocks[0] = blocks_backup_2;
        blocks[19] = blocks_backup_9;
        blocks[10] = blocks_backup_10;
        blocks[1] = blocks_backup_11;
        blocks[20] = blocks_backup_18;
        blocks[11] = blocks_backup_19;
        blocks[2] = blocks_backup_20;
      }
    } else if (this.turning == "L") {
      var left_blocks = [0, 3, 6, 9, 12, 15, 18, 21, 24];
      for (var i of left_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateX(-PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_0 = blocks[0];
        var blocks_backup_3 = blocks[3];
        var blocks_backup_6 = blocks[6];
        var blocks_backup_9 = blocks[9];
        var blocks_backup_12 = blocks[12];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_18 = blocks[18];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_24 = blocks[24];
        blocks[0] = blocks_backup_6;
        blocks[3] = blocks_backup_15;
        blocks[6] = blocks_backup_24;
        blocks[9] = blocks_backup_3;
        blocks[12] = blocks_backup_12;
        blocks[15] = blocks_backup_21;
        blocks[18] = blocks_backup_0;
        blocks[21] = blocks_backup_9;
        blocks[24] = blocks_backup_18;
      }
    } else if (this.turning == "L'") {
      var left_blocks = [0, 3, 6, 9, 12, 15, 18, 21, 24];
      for (var i of left_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateX(PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_0 = blocks[0];
        var blocks_backup_3 = blocks[3];
        var blocks_backup_6 = blocks[6];
        var blocks_backup_9 = blocks[9];
        var blocks_backup_12 = blocks[12];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_18 = blocks[18];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_24 = blocks[24];
        blocks[6] = blocks_backup_0;
        blocks[15] = blocks_backup_3;
        blocks[24] = blocks_backup_6;
        blocks[3] = blocks_backup_9;
        blocks[12] = blocks_backup_12;
        blocks[21] = blocks_backup_15;
        blocks[0] = blocks_backup_18;
        blocks[9] = blocks_backup_21;
        blocks[18] = blocks_backup_24;
      }
    } else if (this.turning == "D") {
      var down_blocks = [18, 19, 20, 21, 22, 23, 24, 25, 26];
      for (var i of down_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateY(PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[18] = blocks_backup_24;
        blocks[19] = blocks_backup_21;
        blocks[20] = blocks_backup_18;
        blocks[21] = blocks_backup_25;
        blocks[22] = blocks_backup_22;
        blocks[23] = blocks_backup_19;
        blocks[24] = blocks_backup_26;
        blocks[25] = blocks_backup_23;
        blocks[26] = blocks_backup_20;
      }
    } else if (this.turning == "D'") {
      var down_blocks = [18, 19, 20, 21, 22, 23, 24, 25, 26];
      for (var i of down_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateY(-PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[24] = blocks_backup_18;
        blocks[21] = blocks_backup_19;
        blocks[18] = blocks_backup_20;
        blocks[25] = blocks_backup_21;
        blocks[22] = blocks_backup_22;
        blocks[19] = blocks_backup_23;
        blocks[26] = blocks_backup_24;
        blocks[23] = blocks_backup_25;
        blocks[20] = blocks_backup_26;
      }
    } else if (this.turning == "B") {
      var back_blocks = [6,7,8,15,16,17,24,25,26];
      for (var i of back_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateZ(-PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_6 = blocks[6];
        var blocks_backup_7 = blocks[7];
        var blocks_backup_8 = blocks[8];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_17 = blocks[17];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[6] = blocks_backup_8;
        blocks[7] = blocks_backup_17;
        blocks[8] = blocks_backup_26;
        blocks[15] = blocks_backup_7;
        blocks[16] = blocks_backup_16;
        blocks[17] = blocks_backup_25;
        blocks[24] = blocks_backup_6;
        blocks[25] = blocks_backup_15;
        blocks[26] = blocks_backup_24;
      }
    } else if (this.turning == "B'") {
      var back_blocks = [6,7,8,15,16,17,24,25,26];
      for (var i of back_blocks) {
        for (var m_sq of blocks[i]) {
          m_sq.rotateX(PI / 4);
          m_sq.rotateZ(PI / 20);
          m_sq.rotateX(-PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_6 = blocks[6];
        var blocks_backup_7 = blocks[7];
        var blocks_backup_8 = blocks[8];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_17 = blocks[17];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[8] = blocks_backup_6;
        blocks[17] = blocks_backup_7;
        blocks[26] = blocks_backup_8;
        blocks[7] = blocks_backup_15;
        blocks[16] = blocks_backup_16;
        blocks[25] = blocks_backup_17;
        blocks[6] = blocks_backup_24;
        blocks[15] = blocks_backup_25;
        blocks[24] = blocks_backup_26;
      }
    } else if (this.turning == "init") {
      draw_change = true;
      this.turning = "none";
    }
  }


}

class Face {

  constructor(m_color, m_type) {

    this.m_color = m_color;
    this.m_type = m_type;
    this.sq_size = 100;
    this.spacing = 8;
    this.squares = [];
    if (pretty) this.spacing = 1;

    if (this.m_type == "TOP") this.m_blocks = [0, 3, 6, 1, 4, 7, 2, 5, 8];
    else if (this.m_type == "FRONT") this.m_blocks = [0, 9, 18, 1, 10, 19, 2, 11, 20];
    else if (this.m_type == "LEFT") this.m_blocks = [0, 9, 18, 3, 12, 21, 6, 15, 24];
    else if (this.m_type == "BACK") this.m_blocks = [6, 15, 24, 7, 16, 25, 8, 17, 26];
    else if (this.m_type == "RIGHT") this.m_blocks = [2, 11, 20, 5, 14, 23, 8, 17, 26];
    else if (this.m_type == "BOTTOM") this.m_blocks = [18, 21, 24, 19, 22, 25, 20, 23, 26];


    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var m_sq = new Square([i * this.sq_size + this.spacing, j * this.sq_size + this.spacing, 0], [i * this.sq_size + this.sq_size - this.spacing, j * this.sq_size + this.spacing, 0], [i * this.sq_size + this.sq_size - this.spacing, j * this.sq_size + this.sq_size - this.spacing, 0], [i * this.sq_size + this.spacing, j * this.sq_size + this.sq_size - this.spacing, 0]);
        this.squares.push(m_sq);
        blocks[this.m_blocks[i * 3 + j]].push(m_sq);
      }
    }
    if (this.m_type == "LEFT") {
      this.m_rotateY(PI / 2);
    } else if (this.m_type == "RIGHT") {
      this.m_rotateY(PI / 2);
      this.m_translateX(3 * this.sq_size);
    } else if (this.m_type == "BACK") {
      this.m_translateZ(-3 * this.sq_size);
    } else if (this.m_type == "TOP") {
      this.m_rotateX(-PI / 2);
    } else if (this.m_type == "BOTTOM") {
      this.m_rotateX(-PI / 2);
      this.m_translateY(3 * this.sq_size);
    }
  }

  m_translateX(steps) {
    for (var m_sq of this.squares) m_sq.translateX(steps);
  }
  m_translateY(steps) {
    for (var m_sq of this.squares) m_sq.translateY(steps);
  }

  m_translateZ(steps) {
    for (var m_sq of this.squares) m_sq.translateZ(steps);
  }

  m_rotateX(theta) {
    for (var m_sq of this.squares) m_sq.rotateX(theta);
  }

  m_rotateY(theta) {
    for (var m_sq of this.squares) m_sq.rotateY(theta);
  }

  m_rotateZ(theta) {
    for (var m_sq of this.squares) m_sq.rotateZ(theta);
  }

  render() {
    for (var m_sq of this.squares) m_sq.render(this.m_color);
  }
}

class Square {

  constructor(a, b, c, d) {
    this.points = [a, b, c, d];
  }

  translateX(steps) {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i][0] += steps;
    }
  }

  translateY(steps) {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i][1] += steps;
    }
  }

  translateZ(steps) {
    for (var i = 0; i < this.points.length; i++) {
      this.points[i][2] += steps;
    }
  }

  rotateX(theta) {
    for (var i = 0; i < this.points.length; i++) {
      var m_point = this.points[i];
      var new_x = m_point[0];
      var new_y = cos(theta) * m_point[1] - sin(theta) * m_point[2];
      var new_z = sin(theta) * m_point[1] + cos(theta) * m_point[2];
      m_point[0] = new_x;
      m_point[1] = new_y;
      m_point[2] = new_z;
    }
  }


  rotateY(theta) {
    for (var i = 0; i < this.points.length; i++) {
      var m_point = this.points[i];
      var new_x = cos(theta) * m_point[0] + sin(theta) * m_point[2];
      var new_y = m_point[1];
      var new_z = -sin(theta) * m_point[0] + cos(theta) * m_point[2];
      m_point[0] = new_x;
      m_point[1] = new_y;
      m_point[2] = new_z;
    }
  }

  rotateZ(theta) {
    for (var i = 0; i < this.points.length; i++) {
      var m_point = this.points[i];
      var new_x = cos(theta) * m_point[0] - sin(theta) * m_point[1];
      var new_y = sin(theta) * m_point[0] + cos(theta) * m_point[1];
      var new_z = m_point[2];
      m_point[0] = new_x;
      m_point[1] = new_y;
      m_point[2] = new_z;
    }
  }

  render(m_color) {
    fill(m_color);
    smooth();
    var shift_offset = 0;
    var offset = faces[0].sq_size * 3;
    var scaler = 0.0005;

    beginShape();
    vertex(this.points[0][0], this.points[0][1], this.points[0][2]);
    vertex(this.points[1][0], this.points[1][1], this.points[1][2]);
    vertex(this.points[2][0], this.points[2][1], this.points[2][2]);
    vertex(this.points[3][0], this.points[3][1], this.points[3][2]);
    endShape(CLOSE);
  }
}

function draw() {

  cube.update();
  if (draw_change) {
    background(bg_color);
    for (var f of faces) f.render();
  }
  draw_change = false;
}

function keyPressed() {
  if (keyCode == 70) { // F
    cube.turns.push("U'");
  } else if (keyCode == 74) { // J
    cube.turns.push("U");
  } else if (keyCode == 73) { // I
    cube.turns.push("R");
  } else if (keyCode == 75) { // K 
    cube.turns.push("R'");
  } else if (keyCode == 71) { // G
    cube.turns.push("F'");
  } else if (keyCode == 72) { // H 
    cube.turns.push("F");
  } else if (keyCode == 68) { // D 
    cube.turns.push("L");
  } else if (keyCode == 69) { // E 
    cube.turns.push("L'");
  } else if (keyCode == 86) { // V
    cube.turns.push("D'");
  } else if (keyCode == 78) { // N
    cube.turns.push("D");
  } else if (keyCode == 79) { // O
    cube.turns.push("B'");
  } else if (keyCode == 87) { // W
    cube.turns.push("B");
  }

  //y/b (89/66) camera a/ö (65/192) camera u/m (85/77) M
}
