var pretty;
var draw_change;
var bg_color;
var blocks;
var faces;
var sq_size;
var cube; // Note: 986 rows pre refactoring

function setup() {

  pretty = false; // pretty = true gives better looking cube
  var param = location.search;
  if(param == "?pretty=true") pretty = true;
	draw_change = true; // If true: draw to canvas
	bg_color = "#ffffff";
	blocks = []; // The cube has 26 blocks. 8 corners, 12 edges, 6 centers
	faces = []; // The cube has 6 sides. Right, left, top, bottom, back, front
	sq_size = 100; // The size of one square, including spacing

	var spacing = 8; // Transparent spacing on square sides

	for(var i = 0; i < 27; i++) blocks.push([]);

	createCanvas(800, 800, WEBGL);

	make_face("#0000ff", "BACK", spacing);
	make_face("#ff9000", "LEFT", spacing);
	make_face("#ff0000", "RIGHT", spacing);
	make_face("#ffff00", "BOTTOM", spacing);
	make_face("#ffffff", "TOP", spacing);
	make_face("#00ff00", "FRONT", spacing);

	// Put the cube in the center of the 3D-space and tilt it slightly
	for(var b of blocks) {
		for(var sq of b) {
			translate_square('X', sq.points, -sq_size * 3 * 0.5);
			translate_square('Y', sq.points, -sq_size * 3 * 0.5);
			translate_square('Z', sq.points, sq_size * 3 * 0.5);
			rotate_square('X', sq.points, -PI / 4);
		}
	}

	cube = new Cube();
	// I push two "init" into the turns, this will make the canvas update twice
	// WEBGL has some strange behaviour where it looks bad until I update the
	// canvas a couple of times
	cube.turns.push("init");
	cube.turns.push("init");
	
}

// Create all stickers for the given face and place them in 3D space
function make_face(sq_color, m_type, spacing) {

    var squares = [];
    if(pretty) spacing = 1;

	// m_blocks[i] says which block sticker 'i' of the current face belongs to
    if(m_type == "TOP") m_blocks = [0, 3, 6, 1, 4, 7, 2, 5, 8];
    else if(m_type == "FRONT") m_blocks = [0, 9, 18, 1, 10, 19, 2, 11, 20];
    else if(m_type == "LEFT") m_blocks = [0, 9, 18, 3, 12, 21, 6, 15, 24];
    else if(m_type == "BACK") m_blocks = [6, 15, 24, 7, 16, 25, 8, 17, 26];
    else if(m_type == "RIGHT") m_blocks = [2, 11, 20, 5, 14, 23, 8, 17, 26];
    else if(m_type == "BOTTOM") m_blocks = [18, 21, 24, 19, 22, 25, 20, 23, 26];

    for (var i = 0; i <3; i++) {
      for (var j = 0; j <3; j++) {
		var p1 = [i*sq_size + spacing, j*sq_size + spacing, 0];
		var p2 = [i*sq_size + sq_size - spacing, j*sq_size + spacing, 0];
		var p3 = [i*sq_size + sq_size - spacing, j*sq_size + sq_size - spacing, 0];
		var p4 = [i*sq_size + spacing, j*sq_size + sq_size - spacing, 0];
        var m_sq = new Square(p1, p2, p3, p4, sq_color);
        squares.push(m_sq);
		// i*3 + j will go from 0 to 8 throughout the iterations
        blocks[m_blocks[i*3 + j]].push(m_sq);
      }
    }

	// Position the faces in the 3D space
    if (m_type == "LEFT") {
      rotate_face('Y', squares, PI/2);
    } else if (m_type == "RIGHT") {
      rotate_face('Y', squares, PI / 2);
      translate_face('X', squares, 3 * sq_size);
    } else if (m_type == "BACK") {
      translate_face('Z', squares, -3 * sq_size);
    } else if (m_type == "TOP") {
      rotate_face('X', squares, -PI / 2);
    } else if (m_type == "BOTTOM") {
      rotate_face('X', squares, -PI / 2);
      translate_face('Y', squares, 3 * sq_size);
    }

}

// translate_face will move a face along the given axis
function translate_face(axis, squares, steps) {
	var trans_func;
	if(axis == 'X') trans_func = translate_square.bind(null, 'X');
	else if(axis == 'Y') trans_func = translate_square.bind(null, 'Y');
	else if(axis == 'Z') trans_func = translate_square.bind(null, 'Z');
	for (var m_sq of squares) trans_func(m_sq.points, steps);
}

function translate_square(axis, points, steps) {
	var j;
	if(axis == 'X') j = 0;
	else if(axis == 'Y') j = 1;
	else if(axis == 'Z') j = 2;
	for (var i = 0; i < points.length; i++) points[i][j] += steps;
}

// rotate_face will rotate a face along the given axis
function rotate_face(axis, squares, theta) {
	var rot_func;
	if(axis == 'X') rot_func = rotate_square.bind(null, 'X');
	else if(axis == 'Y') rot_func = rotate_square.bind(null, 'Y');
	else if(axis == 'Z') rot_func = rotate_square.bind(null, 'Z');
	for (var m_sq of squares) rot_func(m_sq.points, theta);
}

function rotate_square(axis, points, theta) {
	for(var point of points) {
		var new_x, new_y, new_z;
		if(axis == 'X') {
			new_x = point[0];
			new_y = cos(theta) * point[1] - sin(theta) * point[2];
			new_z = sin(theta) * point[1] + cos(theta) * point[2];
		}
		else if(axis == 'Y') {
			new_x = cos(theta) * point[0] + sin(theta) * point[2];
			new_y = point[1];
			new_z = -sin(theta) * point[0] + cos(theta) * point[2];
		}
		else if(axis == 'Z') {
			new_x = cos(theta) * point[0] - sin(theta) * point[1];
			new_y = sin(theta) * point[0] + cos(theta) * point[1];
			new_z = point[2];
		}
		point[0] = new_x;
		point[1] = new_y;
		point[2] = new_z;
	}
}

class Square {

  constructor(a, b, c, d, sq_color) {
    this.points = [a, b, c, d];
	this.sq_color = sq_color;
  }

  render() {
    fill(this.sq_color);
    smooth();
    var shift_offset = 0;
    var offset = sq_size * 3;
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
	for (var b of blocks) {
		for(var sq of b) {
			sq.render();
		}
	}
  }
  draw_change = false;
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
          rotate_square('X', m_sq.points, PI/4);
          rotate_square('Y', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI/4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Y', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Z', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Z', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Y', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Y', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Z', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Z', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
    } else if (this.turning == 'X') {
      var rot_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
      for (var i of rot_blocks) {
        for (var m_sq of blocks[i]) {
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
		var blocks_backup_9 = blocks[9];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_12 = blocks[12];
        var blocks_backup_13 = blocks[13];
        var blocks_backup_14 = blocks[14];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_17 = blocks[17];
		var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[0] = blocks_backup_18;
        blocks[1] = blocks_backup_19;
        blocks[2] = blocks_backup_20;
        blocks[3] = blocks_backup_9;
        blocks[4] = blocks_backup_10;
        blocks[5] = blocks_backup_11;
        blocks[6] = blocks_backup_0;
        blocks[7] = blocks_backup_1;
        blocks[8] = blocks_backup_2;
		blocks[9] = blocks_backup_21;
        blocks[10] = blocks_backup_22;
        blocks[11] = blocks_backup_23;
        blocks[12] = blocks_backup_12;
        blocks[13] = blocks_backup_13;
        blocks[14] = blocks_backup_14;
        blocks[15] = blocks_backup_3;
        blocks[16] = blocks_backup_4;
        blocks[17] = blocks_backup_5;
		blocks[18] = blocks_backup_24;
        blocks[19] = blocks_backup_25;
        blocks[20] = blocks_backup_26;
        blocks[21] = blocks_backup_15;
        blocks[22] = blocks_backup_16;
        blocks[23] = blocks_backup_17;
        blocks[24] = blocks_backup_6;
        blocks[25] = blocks_backup_7;
        blocks[26] = blocks_backup_8;
      }
    } else if (this.turning == "X'") {
      var rot_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
      for (var i of rot_blocks) {
        for (var m_sq of blocks[i]) {
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
		var blocks_backup_9 = blocks[9];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_12 = blocks[12];
        var blocks_backup_13 = blocks[13];
        var blocks_backup_14 = blocks[14];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_17 = blocks[17];
		var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[18] = blocks_backup_0;
        blocks[19] = blocks_backup_1;
        blocks[20] = blocks_backup_2;
        blocks[9] = blocks_backup_3;
        blocks[10] = blocks_backup_4;
        blocks[11] = blocks_backup_5;
        blocks[0] = blocks_backup_6;
        blocks[1] = blocks_backup_7;
        blocks[2] = blocks_backup_8;
		blocks[21] = blocks_backup_9;
        blocks[22] = blocks_backup_10;
        blocks[23] = blocks_backup_11;
        blocks[12] = blocks_backup_12;
        blocks[13] = blocks_backup_13;
        blocks[14] = blocks_backup_14;
        blocks[3] = blocks_backup_15;
        blocks[4] = blocks_backup_16;
        blocks[5] = blocks_backup_17;
		blocks[24] = blocks_backup_18;
        blocks[25] = blocks_backup_19;
        blocks[26] = blocks_backup_20;
        blocks[15] = blocks_backup_21;
        blocks[16] = blocks_backup_22;
        blocks[17] = blocks_backup_23;
        blocks[6] = blocks_backup_24;
        blocks[7] = blocks_backup_25;
        blocks[8] = blocks_backup_26;
      }
    } else if (this.turning == 'Y') {
      var rot_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
      for (var i of rot_blocks) {
        for (var m_sq of blocks[i]) {
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('Y', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
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
		var blocks_backup_9 = blocks[9];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_12 = blocks[12];
        var blocks_backup_13 = blocks[13];
        var blocks_backup_14 = blocks[14];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_17 = blocks[17];
		var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[0] = blocks_backup_2;
        blocks[1] = blocks_backup_5;
        blocks[2] = blocks_backup_8;
        blocks[3] = blocks_backup_1;
        blocks[4] = blocks_backup_4;
        blocks[5] = blocks_backup_7;
        blocks[6] = blocks_backup_0;
        blocks[7] = blocks_backup_3;
        blocks[8] = blocks_backup_6;
		blocks[9] = blocks_backup_11;
        blocks[10] = blocks_backup_14;
        blocks[11] = blocks_backup_17;
        blocks[12] = blocks_backup_10;
        blocks[13] = blocks_backup_13;
        blocks[14] = blocks_backup_16;
        blocks[15] = blocks_backup_9;
        blocks[16] = blocks_backup_12;
        blocks[17] = blocks_backup_15;
		blocks[18] = blocks_backup_20;
        blocks[19] = blocks_backup_23;
        blocks[20] = blocks_backup_26;
        blocks[21] = blocks_backup_19;
        blocks[22] = blocks_backup_22;
        blocks[23] = blocks_backup_25;
        blocks[24] = blocks_backup_18;
        blocks[25] = blocks_backup_21;
        blocks[26] = blocks_backup_24;
      }
    } else if (this.turning == "Y'") {
      var rot_blocks = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
      for (var i of rot_blocks) {
        for (var m_sq of blocks[i]) {
		  rotate_square('X', m_sq.points, PI / 4); rotate_square('Y', m_sq.points, PI / 20); 
		  rotate_square('X', m_sq.points, -PI / 4); draw_change = true;
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
		var blocks_backup_9 = blocks[9];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_11 = blocks[11];
        var blocks_backup_12 = blocks[12];
        var blocks_backup_13 = blocks[13];
        var blocks_backup_14 = blocks[14];
        var blocks_backup_15 = blocks[15];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_17 = blocks[17];
		var blocks_backup_18 = blocks[18];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_20 = blocks[20];
        var blocks_backup_21 = blocks[21];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_23 = blocks[23];
        var blocks_backup_24 = blocks[24];
        var blocks_backup_25 = blocks[25];
        var blocks_backup_26 = blocks[26];
        blocks[2] = blocks_backup_0;
        blocks[5] = blocks_backup_1;
        blocks[8] = blocks_backup_2;
        blocks[1] = blocks_backup_3;
        blocks[4] = blocks_backup_4;
        blocks[7] = blocks_backup_5;
        blocks[0] = blocks_backup_6;
        blocks[3] = blocks_backup_7;
        blocks[6] = blocks_backup_8;
		blocks[11] = blocks_backup_9;
        blocks[14] = blocks_backup_10;
        blocks[17] = blocks_backup_11;
        blocks[10] = blocks_backup_12;
        blocks[13] = blocks_backup_13;
        blocks[16] = blocks_backup_14;
        blocks[9] = blocks_backup_15;
        blocks[12] = blocks_backup_16;
        blocks[15] = blocks_backup_17;
		blocks[20] = blocks_backup_18;
        blocks[23] = blocks_backup_19;
        blocks[26] = blocks_backup_20;
        blocks[19] = blocks_backup_21;
        blocks[22] = blocks_backup_22;
        blocks[25] = blocks_backup_23;
        blocks[18] = blocks_backup_24;
        blocks[21] = blocks_backup_25;
        blocks[24] = blocks_backup_26;
      }
    } else if (this.turning == "M'") {
      var middle_blocks = [1,4,7,10,13,16,19,22,25];
      for (var i of middle_blocks) {
        for (var m_sq of blocks[i]) {
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_1 = blocks[1];
        var blocks_backup_4 = blocks[4];
        var blocks_backup_7 = blocks[7];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_13 = blocks[13];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_25 = blocks[25];
        blocks[1] = blocks_backup_19;
        blocks[4] = blocks_backup_10;
        blocks[7] = blocks_backup_1;
        blocks[10] = blocks_backup_22;
        blocks[13] = blocks_backup_13;
        blocks[16] = blocks_backup_4;
        blocks[19] = blocks_backup_25;
        blocks[22] = blocks_backup_16;
        blocks[25] = blocks_backup_7;
      }
    } else if (this.turning == "M") {
      var middle_blocks = [1,4,7,10,13,16,19,22,25];
      for (var i of middle_blocks) {
        for (var m_sq of blocks[i]) {
          rotate_square('X', m_sq.points, PI / 4);
          rotate_square('X', m_sq.points, -PI / 20);
          rotate_square('X', m_sq.points, -PI / 4);
          draw_change = true;
        }
      }
      this.turntick++;
      if (this.turntick > 9) {
        this.turntick = 0;
        this.turning = "none";
        var blocks_backup_1 = blocks[1];
        var blocks_backup_4 = blocks[4];
        var blocks_backup_7 = blocks[7];
        var blocks_backup_10 = blocks[10];
        var blocks_backup_13 = blocks[13];
        var blocks_backup_16 = blocks[16];
        var blocks_backup_19 = blocks[19];
        var blocks_backup_22 = blocks[22];
        var blocks_backup_25 = blocks[25];
        blocks[19] = blocks_backup_1;
        blocks[10] = blocks_backup_4;
        blocks[1] = blocks_backup_7;
        blocks[22] = blocks_backup_10;
        blocks[13] = blocks_backup_13;
        blocks[4] = blocks_backup_16;
        blocks[25] = blocks_backup_19;
        blocks[16] = blocks_backup_22;
        blocks[7] = blocks_backup_25;
      }
    } else if (this.turning == "init") {
      draw_change = true;
      this.turning = "none";
    }
  }

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
  } else if (keyCode == 89) { // Y
    cube.turns.push('X');
  } else if (keyCode == 66) { // B
    cube.turns.push("X'");
  } else if (keyCode == 65) { // A
    cube.turns.push("Y'");
  } else if (keyCode == 192) { // Ö
    cube.turns.push('Y');
  } else if (keyCode == 85) { // U
    cube.turns.push("M'");
  } else if (keyCode == 77) { // M
    cube.turns.push("M");
  }
}
