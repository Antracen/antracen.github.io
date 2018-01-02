// TODO REFACTORING + SPRITES
var xSize = 500;
var ySize = 500;
var started = false;
var placingPlayer = false;
var level;
var player;
var colorPicker;

function setup(){
	var canvasY = 250;
	var canvas = createCanvas(xSize, ySize).position(20,canvasY);
	frameRate(30);
	level = new Level(50,50);
	player = new Player();
	var startButton = createButton("Start game");
	startButton.position(xSize+40, canvasY);
	startButton.mousePressed(startGame);
	colorPicker = createInput(0,"color");
	colorPicker.position(xSize+40, canvasY+30);
}

function Level(gridSizeX, gridSizeY){
	this.gridSizeX = gridSizeX;
	this.gridSizeY = gridSizeY;
	this.gridWidth = xSize/gridSizeX;
	this.gridHeight = ySize/gridSizeY;

	// INITIALIZE WALL GRID
	this.walls = [];
	for(var i = 0; i < this.gridSizeY; i++){
		var row = [];
		for(var j = 0; j < this.gridSizeX; j++) row.push(0);
		this.walls.push(row);
	}
	// PLACE OUTER WALLS
	for(var i = 0; i < this.gridSizeX; i++){
		this.walls[0][i] = 'black';
		this.walls[this.gridSizeY-1][i] = 'black';
	}
	for(var i = 0; i < this.gridSizeY; i++){
		this.walls[i][0] = 'black';
		this.walls[i][this.gridSizeX-1] = 'black';
	}
	
	// RAYCASTING
	this.shootRay = function(rayX, rayY, rayAngle){
		while(true){
			var distToNextPoint = Infinity;
			var wallX;
			var wallY;
			var originalX = rayX;
			var originalY = rayY;
			if(cos(rayAngle) != 0){
				var nextX = (cos(rayAngle) > 0) ? floor(originalX+1) : ceil(originalX-1);
				var nextWallX = (cos(rayAngle) > 0) ? nextX : nextX - 1;
				var distToNextX = nextX - originalX;
				var nextY = originalY + distToNextX * tan(rayAngle);
				var distToNextY = nextY - originalY;
				distToNextPoint = distToNextX*distToNextX + distToNextY*distToNextY;
				rayX = nextX;
				rayY = nextY;
				wallX = nextWallX;
				wallY = floor(rayY);
			}
			if(sin(rayAngle) != 0){
				var nextY = (sin(rayAngle) > 0) ? floor(originalY+1) : ceil(originalY-1);
				var nextWallY = (sin(rayAngle) > 0) ? nextY : nextY - 1;
				var distToNextY = nextY - originalY;
				var nextX = originalX + distToNextY / tan(rayAngle);
				var distToNextX = nextX - originalX;
				if(distToNextX*distToNextX + distToNextY*distToNextY < distToNextPoint){
					if(nextX >= 0 && nextY >= 0 && nextX < this.gridSizeX && nextY < this.gridSizeY){
						rayX = nextX;
						rayY = nextY;
						wallX = floor(rayX);
						wallY = nextWallY;
					}
				}
			}
			// Only cast rays within a certain range.
			if(pow(player.x-rayX, 2) + pow(player.y-rayY, 2) > (pow(this.gridSizeX, 2) + pow(this.gridSizeY, 2))) return -1;
			// Only look for walls within playing grid.
			if(rayX < 0 || rayY < 0 || rayX >= this.gridSizeX || rayY >= this.gridSizeY) return -1;
			if(wallX < 0 || wallY < 0 || wallX >= this.gridSizeX || wallY >= this.gridSizeY) return -1;
			// If wall found, return distance.
			if(this.walls[wallY][wallX] != 0){
				return [sqrt(pow(player.x-rayX, 2) + pow(player.y-rayY, 2)), this.walls[wallY][wallX]];
			}
		}
		return -1;
	}
}

function Player(){
	this.x = 2;
	this.y = 2;
	this.angle = PI/2;
	this.FOV = PI/2;
	
	// Shoot a ray for every vertical pixel. 
	// Draw line with height based on ray distance to a wall.
	this.shootRays = function(){
		for(var i = 0; i < xSize; i++){
			var eyeAngle = fixAngle(this.FOV/2 - this.FOV*(i/xSize)); // Angle from players eye.
			var rayAngle = fixAngle(this.angle + eyeAngle); // Total angle of ray.
			var wallPos = level.shootRay(this.x, this.y, rayAngle);
			if(wallPos != -1){
				var distance = wallPos[0]*cos(eyeAngle); // Vertical distance to wall.
				var height = ySize/distance;
				stroke(wallPos[1]);
				line(i,ySize/2 - height/2, i, ySize/2 + height/2);
			}
		}
	}
	
	this.moveY = function(direction){
		var speed = direction*0.4;
		var newY = player.y + speed*sin(player.angle);
		var newX = player.x + speed*cos(player.angle);
		var colY = floor(newY + speed*sin(player.angle));
		var colX = floor(newX + speed*cos(player.angle));
		if(colY >= 0 && colX >= 0 && colY < level.gridSizeY && colX < level.gridSizeX && level.walls[colY][colX] == 0){
			player.y = newY;
			player.x = newX;
		}
	}
}

// DRAW EVERYTHING
function draw(){
	// If game not started, draw current state of level editor.
	if(!started){
		background(200);
		for(var i = 0; i < level.gridSizeY; i++){
			for(var j = 0; j < level.gridSizeX; j++){
				if(level.walls[i][j] != 0) fill(level.walls[i][j]);
				else fill(200);
				rect(level.gridWidth*j,500-level.gridHeight-level.gridHeight*i,level.gridWidth,level.gridHeight);
			}
		}
		return;
	}
	if(keyIsDown(87)) player.moveY(1);
	else if(keyIsDown(83)) player.moveY(-1);
	if(keyIsDown(65)){ // MOVE LEFT
		player.angle = fixAngle(player.angle + PI*0.5); // TURN 90 DEGREES LEFT
		player.moveY(1); // MOVE FORWARD
		player.angle = fixAngle(player.angle - PI*0.5); // TURN 90 DEGREES RIGHT
	}
	else if(keyIsDown(68)){
		player.angle = fixAngle(player.angle - PI*0.5);
		player.moveY(1);
		player.angle = fixAngle(player.angle + PI*0.5);
	}
	if(keyIsDown(LEFT_ARROW)) player.angle = fixAngle(player.angle + 0.07);
	else if(keyIsDown(RIGHT_ARROW)) player.angle = fixAngle(player.angle - 0.07)
	
	fill('#00ceff'); // SKY
	rect(0,0,xSize,ySize/2);
	fill('#00cc22'); // GROUND
	rect(0,ySize/2,xSize,ySize/2);
	player.shootRays();
}

function startGame(){
	if(!started){
		alert("Press where you want to place player!");
		placingPlayer = true;
	}
}

function mousePressed(){
	if(!started){
		var x = floor(mouseX/level.gridWidth);
		var y = floor(level.gridSizeY - mouseY/level.gridHeight);
		if(placingPlayer){
			if(x >= 0 && y >= 0 && x < level.gridSizeX && y < level.gridSizeY && level.walls[y][x] == 0){
				player.x = x;
				player.y = y;
				started = true;
				return;
			}
		}
		if(x >= 0 && y >= 0 && x < level.gridSizeX && y < level.gridSizeY) level.walls[y][x] = colorPicker.value();
	}
}

// Make it so an angle is between 0 and 2*PI. Maybe unnecessary
function fixAngle(angle){
	while(angle < 0) angle += 2*PI;
	while(angle >= 2*PI) angle -= 2*PI;
	return angle;
}
