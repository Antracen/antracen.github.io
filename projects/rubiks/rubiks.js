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

function keyPressed() {
    var turn = "none";

    if (keyCode == 74) turn = "U"; // J
    else if(keyCode == 70) turn = "U'"; // F
    else if(keyCode == 73) turn = "R"; // I
    else if(keyCode == 75) turn = "R'"; // K 
    else if(keyCode == 72) turn = "F"; // H 
    else if(keyCode == 71) turn = "F'"; // G
    else if(keyCode == 68) turn = "L"; // D 
    else if(keyCode == 69) turn = "L'"; // E
    else if(keyCode == 78) turn = "D"; // N 
    else if(keyCode == 86) turn = "D'"; // V
    else if(keyCode == 87) turn = "B"; // W
    else if(keyCode == 79) turn = "B'"; // O
    else if(keyCode == 89) turn = "X"; // Y
    else if(keyCode == 66) turn = "X'"; // B
    else if (keyCode == 192) turn = "Y"; // Ö
    else if(keyCode == 65) turn = "Y'"; // A
    else if (keyCode == 77) turn = "M"; // M
    else if (keyCode == 85) turn = "M'"; // U

    cube.turns.push(turn);
}
