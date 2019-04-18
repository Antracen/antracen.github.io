var cube_points;
var cube_colors;
// Which cubies are in which positions on the cube
var cubie_positions;
var angle;
var turn_values;
var draw_update;
var turns_performed;
var current_turn;
var current_turn_ticks;

function setup() {

	var cs = 70; // cubie size
	var o = 3; // offset

	cube_points = [
		// TOP LAYER (9 cubies)
		[[-1.5*cs-o,-1.5*cs-o,1.5*cs+o],	[-0.5*cs-o,-1.5*cs-o,1.5*cs+o],		[-0.5*cs-o,-0.5*cs-o,1.5*cs+o],[-1.5*cs-o,-0.5*cs-o,1.5*cs+o],[-1.5*cs-o,-1.5*cs-o,0.5*cs+o],[-0.5*cs-o,-1.5*cs-o,0.5*cs+o],[-0.5*cs-o,-0.5*cs-o,0.5*cs+o],[-1.5*cs-o,-0.5*cs-o,0.5*cs+o]],
		[[-0.5*cs,-1.5*cs-o,1.5*cs+o],		[0.5*cs,-1.5*cs-o,1.5*cs+o],		[0.5*cs,-0.5*cs-o,1.5*cs+o],[-0.5*cs,-0.5*cs-o,1.5*cs+o],[-0.5*cs,-1.5*cs-o,0.5*cs+o],[0.5*cs,-1.5*cs-o,0.5*cs+o],[0.5*cs,-0.5*cs-o,0.5*cs+o],[-0.5*cs,-0.5*cs-o,0.5*cs+o]],
		[[0.5*cs+o,-1.5*cs-o,1.5*cs+o],		[1.5*cs+o,-1.5*cs-o,1.5*cs+o],		[1.5*cs+o,-0.5*cs-o,1.5*cs+o],[0.5*cs+o,-0.5*cs-o,1.5*cs+o],[0.5*cs+o,-1.5*cs-o,0.5*cs+o],[1.5*cs+o,-1.5*cs-o,0.5*cs+o],[1.5*cs+o,-0.5*cs-o,0.5*cs+o],[0.5*cs+o,-0.5*cs-o,0.5*cs+o]],
		[[-1.5*cs-o,-1.5*cs-o,0.5*cs],		[-0.5*cs-o,-1.5*cs-o,0.5*cs],		[-0.5*cs-o,-0.5*cs-o,0.5*cs],[-1.5*cs-o,-0.5*cs-o,0.5*cs],[-1.5*cs-o,-1.5*cs-o,-0.5*cs],[-0.5*cs-o,-1.5*cs-o,-0.5*cs],[-0.5*cs-o,-0.5*cs-o,-0.5*cs],[-1.5*cs-o,-0.5*cs-o,-0.5*cs]],
		[[-0.5*cs,-1.5*cs-o,0.5*cs],		[0.5*cs,-1.5*cs-o,0.5*cs],			[0.5*cs,-0.5*cs-o,0.5*cs],[-0.5*cs,-0.5*cs-o,0.5*cs],[-0.5*cs,-1.5*cs-o,-0.5*cs],[0.5*cs,-1.5*cs-o,-0.5*cs],[0.5*cs,-0.5*cs-o,-0.5*cs],[-0.5*cs,-0.5*cs-o,-0.5*cs]],
		[[0.5*cs+o,-1.5*cs-o,0.5*cs],		[1.5*cs+o,-1.5*cs-o,0.5*cs],		[1.5*cs+o,-0.5*cs-o,0.5*cs],[0.5*cs+o,-0.5*cs-o,0.5*cs],[0.5*cs+o,-1.5*cs-o,-0.5*cs],[1.5*cs+o,-1.5*cs-o,-0.5*cs],[1.5*cs+o,-0.5*cs-o,-0.5*cs],[0.5*cs+o,-0.5*cs-o,-0.5*cs]],
		[[-1.5*cs-o,-1.5*cs-o,-0.5*cs-o],	[-0.5*cs-o,-1.5*cs-o,-0.5*cs-o],	[-0.5*cs-o,-0.5*cs-o,-0.5*cs-o],[-1.5*cs-o,-0.5*cs-o,-0.5*cs-o],[-1.5*cs-o,-1.5*cs-o,-1.5*cs-o],[-0.5*cs-o,-1.5*cs-o,-1.5*cs-o],[-0.5*cs-o,-0.5*cs-o,-1.5*cs-o],[-1.5*cs-o,-0.5*cs-o,-1.5*cs-o]],
		[[-0.5*cs,-1.5*cs-o,-0.5*cs-o],		[0.5*cs,-1.5*cs-o,-0.5*cs-o],		[0.5*cs,-0.5*cs-o,-0.5*cs-o],[-0.5*cs,-0.5*cs-o,-0.5*cs-o],[-0.5*cs,-1.5*cs-o,-1.5*cs-o],[0.5*cs,-1.5*cs-o,-1.5*cs-o],[0.5*cs,-0.5*cs-o,-1.5*cs-o],[-0.5*cs,-0.5*cs-o,-1.5*cs-o]],
		[[0.5*cs+o,-1.5*cs-o,-0.5*cs-o],	[1.5*cs+o,-1.5*cs-o,-0.5*cs-o],		[1.5*cs+o,-0.5*cs-o,-0.5*cs-o],[0.5*cs+o,-0.5*cs-o,-0.5*cs-o],[0.5*cs+o,-1.5*cs-o,-1.5*cs-o],[1.5*cs+o,-1.5*cs-o,-1.5*cs-o],[1.5*cs+o,-0.5*cs-o,-1.5*cs-o],[0.5*cs+o,-0.5*cs-o,-1.5*cs-o]],
		// MIDDLE LAYER (9 cubies)
		[[-1.5*cs-o,-0.5*cs,1.5*cs+o],[-0.5*cs-o,-0.5*cs,1.5*cs+o],[-0.5*cs-o,0.5*cs,1.5*cs+o],[-1.5*cs-o,0.5*cs,1.5*cs+o],[-1.5*cs-o,-0.5*cs,0.5*cs+o],[-0.5*cs-o,-0.5*cs,0.5*cs+o],[-0.5*cs-o,0.5*cs,0.5*cs+o],[-1.5*cs-o,0.5*cs,0.5*cs+o]],
		[[-0.5*cs,-0.5*cs,1.5*cs+o],[0.5*cs,-0.5*cs,1.5*cs+o],[0.5*cs,0.5*cs,1.5*cs+o],[-0.5*cs,0.5*cs,1.5*cs+o],[-0.5*cs,-0.5*cs,0.5*cs+o],[0.5*cs,-0.5*cs,0.5*cs+o],[0.5*cs,0.5*cs,0.5*cs+o],[-0.5*cs,0.5*cs,0.5*cs+o]],
		[[0.5*cs+o,-0.5*cs,1.5*cs+o],[1.5*cs+o,-0.5*cs,1.5*cs+o],[1.5*cs+o,0.5*cs,1.5*cs+o],[0.5*cs+o,0.5*cs,1.5*cs+o],[0.5*cs+o,-0.5*cs,0.5*cs+o],[1.5*cs+o,-0.5*cs,0.5*cs+o],[1.5*cs+o,0.5*cs,0.5*cs+o],[0.5*cs+o,0.5*cs,0.5*cs+o]],
		[[-1.5*cs-o,-0.5*cs,0.5*cs],[-0.5*cs-o,-0.5*cs,0.5*cs],[-0.5*cs-o,0.5*cs,0.5*cs],[-1.5*cs-o,0.5*cs,0.5*cs],[-1.5*cs-o,-0.5*cs,-0.5*cs],[-0.5*cs-o,-0.5*cs,-0.5*cs],[-0.5*cs-o,0.5*cs,-0.5*cs],[-1.5*cs-o,0.5*cs,-0.5*cs]],
		[[-0.5*cs,-0.5*cs,0.5*cs],[0.5*cs,-0.5*cs,0.5*cs],[0.5*cs,0.5*cs,0.5*cs],[-0.5*cs,0.5*cs,0.5*cs],[-0.5*cs,-0.5*cs,-0.5*cs],[0.5*cs,-0.5*cs,-0.5*cs],[0.5*cs,0.5*cs,-0.5*cs],[-0.5*cs,0.5*cs,-0.5*cs]],
		[[0.5*cs+o,-0.5*cs,0.5*cs],[1.5*cs+o,-0.5*cs,0.5*cs],[1.5*cs+o,0.5*cs,0.5*cs],[0.5*cs+o,0.5*cs,0.5*cs],[0.5*cs+o,-0.5*cs,-0.5*cs],[1.5*cs+o,-0.5*cs,-0.5*cs],[1.5*cs+o,0.5*cs,-0.5*cs],[0.5*cs+o,0.5*cs,-0.5*cs]],
		[[-1.5*cs-o,-0.5*cs,-0.5*cs-o],[-0.5*cs-o,-0.5*cs,-0.5*cs-o],[-0.5*cs-o,0.5*cs,-0.5*cs-o],[-1.5*cs-o,0.5*cs,-0.5*cs-o],[-1.5*cs-o,-0.5*cs,-1.5*cs-o],[-0.5*cs-o,-0.5*cs,-1.5*cs-o],[-0.5*cs-o,0.5*cs,-1.5*cs-o],[-1.5*cs-o,0.5*cs,-1.5*cs-o]],
		[[-0.5*cs,-0.5*cs,-0.5*cs-o],[0.5*cs,-0.5*cs,-0.5*cs-o],[0.5*cs,0.5*cs,-0.5*cs-o],[-0.5*cs,0.5*cs,-0.5*cs-o],[-0.5*cs,-0.5*cs,-1.5*cs-o],[0.5*cs,-0.5*cs,-1.5*cs-o],[0.5*cs,0.5*cs,-1.5*cs-o],[-0.5*cs,0.5*cs,-1.5*cs-o]],
		[[0.5*cs+o,-0.5*cs,-0.5*cs-o],[1.5*cs+o,-0.5*cs,-0.5*cs-o],[1.5*cs+o,0.5*cs,-0.5*cs-o],[0.5*cs+o,0.5*cs,-0.5*cs-o],[0.5*cs+o,-0.5*cs,-1.5*cs-o],[1.5*cs+o,-0.5*cs,-1.5*cs-o],[1.5*cs+o,0.5*cs,-1.5*cs-o],[0.5*cs+o,0.5*cs,-1.5*cs-o]],
		// BOTTOM LAYER (9 cubies)
		[[-1.5*cs-o,0.5*cs+o,1.5*cs+o],[-0.5*cs-o,0.5*cs+o,1.5*cs+o],[-0.5*cs-o,1.5*cs+o,1.5*cs+o],[-1.5*cs-o,1.5*cs+o,1.5*cs+o],[-1.5*cs-o,0.5*cs+o,0.5*cs+o],[-0.5*cs-o,0.5*cs+o,0.5*cs+o],[-0.5*cs-o,1.5*cs+o,0.5*cs+o],[-1.5*cs-o,1.5*cs+o,0.5*cs+o]],
		[[-0.5*cs,0.5*cs+o,1.5*cs+o],[0.5*cs,0.5*cs+o,1.5*cs+o],[0.5*cs,1.5*cs+o,1.5*cs+o],[-0.5*cs,1.5*cs+o,1.5*cs+o],[-0.5*cs,0.5*cs+o,0.5*cs+o],[0.5*cs,0.5*cs+o,0.5*cs+o],[0.5*cs,1.5*cs+o,0.5*cs+o],[-0.5*cs,1.5*cs+o,0.5*cs+o]],
		[[0.5*cs+o,0.5*cs+o,1.5*cs+o],[1.5*cs+o,0.5*cs+o,1.5*cs+o],[1.5*cs+o,1.5*cs+o,1.5*cs+o],[0.5*cs+o,1.5*cs+o,1.5*cs+o],[0.5*cs+o,0.5*cs+o,0.5*cs+o],[1.5*cs+o,0.5*cs+o,0.5*cs+o],[1.5*cs+o,1.5*cs+o,0.5*cs+o],[0.5*cs+o,1.5*cs+o,0.5*cs+o]],
		[[-1.5*cs-o,0.5*cs+o,0.5*cs],[-0.5*cs-o,0.5*cs+o,0.5*cs],[-0.5*cs-o,1.5*cs+o,0.5*cs],[-1.5*cs-o,1.5*cs+o,0.5*cs],[-1.5*cs-o,0.5*cs+o,-0.5*cs],[-0.5*cs-o,0.5*cs+o,-0.5*cs],[-0.5*cs-o,1.5*cs+o,-0.5*cs],[-1.5*cs-o,1.5*cs+o,-0.5*cs]],
		[[-0.5*cs,0.5*cs+o,0.5*cs],[0.5*cs,0.5*cs+o,0.5*cs],[0.5*cs,1.5*cs+o,0.5*cs],[-0.5*cs,1.5*cs+o,0.5*cs],[-0.5*cs,0.5*cs+o,-0.5*cs],[0.5*cs,0.5*cs+o,-0.5*cs],[0.5*cs,1.5*cs+o,-0.5*cs],[-0.5*cs,1.5*cs+o,-0.5*cs]],
		[[0.5*cs+o,0.5*cs+o,0.5*cs],[1.5*cs+o,0.5*cs+o,0.5*cs],[1.5*cs+o,1.5*cs+o,0.5*cs],[0.5*cs+o,1.5*cs+o,0.5*cs],[0.5*cs+o,0.5*cs+o,-0.5*cs],[1.5*cs+o,0.5*cs+o,-0.5*cs],[1.5*cs+o,1.5*cs+o,-0.5*cs],[0.5*cs+o,1.5*cs+o,-0.5*cs]],
		[[-1.5*cs-o,0.5*cs+o,-0.5*cs-o],[-0.5*cs-o,0.5*cs+o,-0.5*cs-o],[-0.5*cs-o,1.5*cs+o,-0.5*cs-o],[-1.5*cs-o,1.5*cs+o,-0.5*cs-o],[-1.5*cs-o,0.5*cs+o,-1.5*cs-o],[-0.5*cs-o,0.5*cs+o,-1.5*cs-o],[-0.5*cs-o,1.5*cs+o,-1.5*cs-o],[-1.5*cs-o,1.5*cs+o,-1.5*cs-o]],
		[[-0.5*cs,0.5*cs+o,-0.5*cs-o],[0.5*cs,0.5*cs+o,-0.5*cs-o],[0.5*cs,1.5*cs+o,-0.5*cs-o],[-0.5*cs,1.5*cs+o,-0.5*cs-o],[-0.5*cs,0.5*cs+o,-1.5*cs-o],[0.5*cs,0.5*cs+o,-1.5*cs-o],[0.5*cs,1.5*cs+o,-1.5*cs-o],[-0.5*cs,1.5*cs+o,-1.5*cs-o]],
		[[0.5*cs+o,0.5*cs+o,-0.5*cs-o],[1.5*cs+o,0.5*cs+o,-0.5*cs-o],[1.5*cs+o,1.5*cs+o,-0.5*cs-o],[0.5*cs+o,1.5*cs+o,-0.5*cs-o],[0.5*cs+o,0.5*cs+o,-1.5*cs-o],[1.5*cs+o,0.5*cs+o,-1.5*cs-o],[1.5*cs+o,1.5*cs+o,-1.5*cs-o],[0.5*cs+o,1.5*cs+o,-1.5*cs-o]],
	];

	//	FRONT		BACK		RIGHT		LEFT		TOP		BOTTOM
	cube_colors = [
		// TOP LAYER
		["#159100", "#000000", "#000000", "#FFA500", "#ffffff", "#000000"],
		["#159100", "#000000", "#000000", "#000000", "#ffffff", "#000000"],
		["#159100", "#000000", "#ff0000", "#000000", "#ffffff", "#000000"],
		["#000000", "#000000", "#000000", "#FFA500", "#ffffff", "#000000"],
		["#000000", "#000000", "#000000", "#000000", "#ffffff", "#000000"],
		["#000000", "#000000", "#ff0000", "#000000", "#ffffff", "#000000"],
		["#000000", "#0000ff", "#000000", "#FFA500", "#ffffff", "#000000"],
		["#000000", "#0000ff", "#000000", "#000000", "#ffffff", "#000000"],
		["#000000", "#0000ff", "#ff0000", "#000000", "#ffffff", "#000000"],
		// MIDDLE LAYER
		["#159100", "#000000", "#000000", "#FFA500", "#000000", "#000000"],
		["#159100", "#000000", "#000000", "#000000", "#000000", "#000000"],
		["#159100", "#000000", "#ff0000", "#000000", "#000000", "#000000"],
		["#000000", "#000000", "#000000", "#FFA500", "#000000", "#000000"],
		["#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
		["#000000", "#000000", "#ff0000", "#000000", "#000000", "#000000"],
		["#000000", "#0000ff", "#000000", "#FFA500", "#000000", "#000000"],
		["#000000", "#0000ff", "#000000", "#000000", "#000000", "#000000"],
		["#000000", "#0000ff", "#ff0000", "#000000", "#000000", "#000000"],
		// BOTTOM LAYER
		["#159100", "#000000", "#000000", "#FFA500", "#000000", "#FFFF00"],
		["#159100", "#000000", "#000000", "#000000", "#000000", "#FFFF00"],
		["#159100", "#000000", "#ff0000", "#000000", "#000000", "#FFFF00"],
		["#000000", "#000000", "#000000", "#FFA500", "#000000", "#FFFF00"],
		["#000000", "#000000", "#000000", "#000000", "#000000", "#FFFF00"],
		["#000000", "#000000", "#ff0000", "#000000", "#000000", "#FFFF00"],
		["#000000", "#0000ff", "#000000", "#FFA500", "#000000", "#FFFF00"],
		["#000000", "#0000ff", "#000000", "#000000", "#000000", "#FFFF00"],
		["#000000", "#0000ff", "#ff0000", "#000000", "#000000", "#FFFF00"],
	];

	cubie_positions= [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];

	angle = HALF_PI;
	turn_values = [
		['Y', -1, [0,1,2,3,4,5,6,7,8],       	[[1,3,7,5]], 		[[0,6,8,2]]], 	// U
		['Y',  1, [0,1,2,3,4,5,6,7,8],       	[[1,5,7,3]], 		[[0,2,8,6]]], 	// U'
		['X',  1, [2,5,8,11,14,17,20,23,26], 	[[5,17,23,11]], 	[[2,8,26,20]]], 	// R
		['X', -1, [2,5,8,11,14,17,20,23,26], 	[[5,11,23,17]], 	[[2,20,26,8]]], 	// R'
		['X', -1, [0,3,6,9,12,15,18,21,24],  	[[3,9,21,15]], 		[[0,18,24,6]]], 	// L
		['X',  1, [0,3,6,9,12,15,18,21,24],  	[[3,15,21,9]], 		[[0,6,24,18]]], 	// L'
		['Z',  1, [0,1,2,9,10,11,18,19,20],  	[[1,11,19,9]], 		[[0,2,20,18]]], 	// F
		['Z', -1, [0,1,2,9,10,11,18,19,20],  	[[1,9,19,11]], 		[[0,18,20,2]]], 	// F'
		['Y',  1, [18,19,20,21,22,23,24,25,26], [[19,23,25,21]], 	[[18,20,26,24]]], // D
		['Y', -1, [18,19,20,21,22,23,24,25,26], [[19,21,25,23]], 	[[18,24,26,20]]], // D'
		['Z', -1, [6,7,8,15,16,17,24,25,26], 	[[7,15,25,17]], 	[[8,6,24,26]]], 	// B
		['Z',  1, [6,7,8,15,16,17,24,25,26], 	[[7,17,25,15]], 	[[8,26,24,6]]], 	// B'
		// Rotations
		['Y',  -1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], [[1,3,7,5],[9,15,17,11],[19,21,25,23],[10,12,16,14]], [[0,6,8,2],[18,24,26,20]]], // Y
		['Y', 	1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], [[1,5,7,3],[9,11,17,15],[19,23,25,21],[10,14,16,12]], [[0,2,8,6],[18,20,26,24]]], // Y'
		['X',  -1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], [[3,9,21,15],[1,19,25,7],[5,11,23,17],[4,10,22,16]], [[0,18,24,6],[2,20,26,8]]], // X
		['X',   1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26], [[3,15,21,9],[1,7,25,19],[5,17,23,11],[4,16,22,10]], [[0,6,24,18],[2,8,26,20]]], // X'
		// Slice moves
		['X',  1, [1,4,7,10,13,16,19,22,25], 	[[1,7,25,19],[4,16,22,10]], 	[]], 	// M'
		['X', -1, [1,4,7,10,13,16,19,22,25], 	[[1,19,25,7],[4,10,22,16]], 	[]], 	// M
	];

	turns_performed = [];
	current_turn = "None";
	current_turn_ticks = 0;

	createCanvas(500, 500, WEBGL);
	draw_update = true;
}

function draw() {
	update_cube();
	rotateX(-PI/4);
	if(draw_update){
		draw_cube();
	}
	draw_update = false;
}

function draw_cube() {
	background("#DDDDDD");
	for(var i = 0; i < 27; i++) {
		draw_square([0,1,2,3], cube_colors[i][0], i); // FRONT
		draw_square([4,5,6,7], cube_colors[i][1], i); // BACK
		draw_square([1,5,6,2], cube_colors[i][2], i); // RIGHT
		draw_square([4,0,3,7], cube_colors[i][3], i); // LEFT
		draw_square([4,5,1,0], cube_colors[i][4], i); // TOP
		draw_square([3,2,6,7], cube_colors[i][5], i); // BOTTOM
	}
}

function draw_square(V, sq_color, i) {
	beginShape();
	fill(sq_color);
	vertex(cube_points[i][V[0]][0], cube_points[i][V[0]][1], cube_points[i][V[0]][2]);
	vertex(cube_points[i][V[1]][0], cube_points[i][V[1]][1], cube_points[i][V[1]][2]);
	vertex(cube_points[i][V[2]][0], cube_points[i][V[2]][1], cube_points[i][V[2]][2]);
	vertex(cube_points[i][V[3]][0], cube_points[i][V[3]][1], cube_points[i][V[3]][2]);
	endShape();
}

function update_cube() {

	if(current_turn == "None") {
		if(turns_performed.length > 0) {
			current_turn = turns_performed.shift();
		} else {
			return;
		}
	}

	var dir = current_turn;
	var face_num, axis, theta;

	var ticks_per_turn = 8;

	axis = turn_values[dir][0];
	theta = turn_values[dir][1] * PI/(2*ticks_per_turn);
	face_cubies = turn_values[dir][2];
	edge_cycle = turn_values[dir][3];
	corner_cycle = turn_values[dir][4];

	// Matrix transformations
	for(var i = 0; i < face_cubies.length; i++) {
		var face_points = cube_points[cubie_positions[face_cubies[i]]];
		for(var j = 0; j < 8; j++) {
			var point = face_points[j];
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
	draw_update = true;

	current_turn_ticks++;

	// Update cubie positions when the turn is finished
	if(current_turn_ticks == ticks_per_turn) {
		for(var i = 0; i < edge_cycle.length; i++) {
			var last_edge = cubie_positions[edge_cycle[i][3]];
			for(var j = 3; j > 0; j--) {
				cubie_positions[edge_cycle[i][j]] = cubie_positions[edge_cycle[i][j-1]];
			}
			cubie_positions[edge_cycle[i][0]] = last_edge;
		}
		for(var i = 0; i < corner_cycle.length; i++) {
			var last_corner = cubie_positions[corner_cycle[i][3]];
			for(var j = 3; j > 0; j--) {
				cubie_positions[corner_cycle[i][j]] = cubie_positions[corner_cycle[i][j-1]];
			}
			cubie_positions[corner_cycle[i][0]] = last_corner;
		}
		current_turn = "None";
		current_turn_ticks = 0;
	}
}

function keyPressed() {
	turn_code = 0;
         if(keyCode == 74)      turn_code = 0; // J == U
    else if(keyCode == 70)   	turn_code = 1; // F == U'
    else if(keyCode == 73)   	turn_code = 2; // I == R
	else if(keyCode == 75)   	turn_code = 3; // K == R'
	else if(keyCode == 68)   	turn_code = 4; // D == L
    else if(keyCode == 69)   	turn_code = 5; // E == L'
    else if(keyCode == 72)   	turn_code = 6; // H == F
    else if(keyCode == 71)   	turn_code = 7; // G == F'
    else if(keyCode == 78)   	turn_code = 8; // N == D
    else if(keyCode == 86)   	turn_code = 9; // V == D'
    else if(keyCode == 87)   	turn_code = 10; // O == B'
	else if(keyCode == 79)   	turn_code = 11; // W == B
	else if(keyCode == 192)		turn_code = 12; // Ö = Y
	else if(keyCode == 65)		turn_code = 13; // A = Y'
	else if(keyCode == 66)		turn_code = 14; // B = X'
	else if(keyCode == 89)		turn_code = 15;	// Y = X
	else if(keyCode == 85)		turn_code = 16;	// U = M'
	else if(keyCode == 77)		turn_code = 17;	// M = M
	else if(keyCode == 32) {
		for(var i = 0; i < 60; i++) {
			turns_performed.push(floor(random(18)));
		}
		return;
	}
	else return;
	turns_performed.push(turn_code);
}
