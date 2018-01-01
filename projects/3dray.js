// TODO REFACTORING + SPRITES

var xSize = 510;
var ySize = 510;
var level, player;

function setup(){
	var canvas = createCanvas(xSize, ySize);
	canvas.position(20, 250);
	level = new Level();
	player = new Player();
	frameRate(20);
}

function Level(){
	// INITIALIZE WALL GRID
	this.walls = [];
	for(var i = 0; i < 50; i++){
		var row = [];
		for(var j = 0; j < 50; j++) row.push(0);
		this.walls.push(row);
	}
	for(var i = 0; i < 50; i++){
		this.walls[0][i] = 'red';
		this.walls[49][i] = 'red';
		this.walls[i][0] = 'red';
		this.walls[i][49] = 'red';
	}
	for(var i = 5; i < 10; i++) for(var j = 5; j < 10; j++) this.walls[i][j] = 'pink';
	for(var i = 35; i < 40; i++) for(var j = 35; j < 40; j++) this.walls[i][j] = 'yellow';
	for(var i = 25; i < 30; i++) for(var j = 25; j < 30; j++) this.walls[i][j] = 'green';
	
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
					if(nextX >= 0 && nextY >= 0 && nextX < 50 && nextY < 50){
						rayX = nextX;
						rayY = nextY;
						wallX = floor(rayX);
						wallY = nextWallY;
					}
				}
			}
			// Only cast rays within a certain range.
			if(pow(player.x-rayX, 2) + pow(player.y-rayY, 2) > (50*50 + 50*50)) return -1;
			// Only look for walls within playing grid.
			if(rayX < 0 || rayY < 0 || rayX >= 50 || rayY >= 50) return -1;
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
	this.angle = PI/4;
	this.FOV = PI/2;
	
	this.shootRays = function(){
		for(var i = 0; i < xSize; i++){
			var eyeAngle = fixAngle(this.FOV/2 - this.FOV*(i/xSize));
			var rayAngle = fixAngle(this.angle + eyeAngle);
			var wallPos = level.shootRay(this.x, this.y, rayAngle);
			if(wallPos != -1){
				var distance = wallPos[0]*cos(eyeAngle);
				var height = ySize/distance;
				stroke(wallPos[1]);
				line(i,ySize/2 - height/2, i, ySize/2 + height/2);
			}
		}
	}
}

// DRAW EVERYTHING
function draw(){
	if(keyIsDown(UP_ARROW)){
		var newY = player.y + 0.4*sin(player.angle);
		var newX = player.x + 0.4*cos(player.angle);
		if(level.walls[floor(newY + 0.8*sin(player.angle))][floor(newX+ 0.8*cos(player.angle))] == 0){
			player.y = newY;
			player.x = newX;
		}
	} else if(keyIsDown(DOWN_ARROW)){
		var newY = player.y - 0.4*sin(player.angle);
		var newX = player.x - 0.4*cos(player.angle);
		if(level.walls[floor(newY)][floor(newX)] == 0){
			player.y = newY;
			player.x = newX;
		}
	}	
	if(keyIsDown(LEFT_ARROW)) player.angle = fixAngle(player.angle + 0.05);
	else if(keyIsDown(RIGHT_ARROW)) player.angle = fixAngle(player.angle - 0.05)

	fill('#00ceff');
	rect(0,0,xSize,ySize/2);
	fill('#b35d09');
	rect(0,ySize/2,xSize,ySize/2);
	player.shootRays();
}

// Make it so an angle is between 0 and 2*PI.
function fixAngle(angle){
	while(angle < 0) angle += 2*PI;
	while(angle >= 2*PI) angle -= 2*PI;
	return angle;
}
