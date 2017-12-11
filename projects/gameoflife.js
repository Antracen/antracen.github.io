var level;

function setup(){
	var xSize = 500;
	var ySize = 500;
	var pixelsX = 50;
	var pixelsY = 50;
	createCanvas(xSize, ySize);
	level = new Level(xSize, ySize, pixelsX, pixelsY);
	level.populate();
	frameRate(5);
}

function draw(){
	level.render();
	level.update();
}

function Level(xSize, ySize, pixelsX, pixelsY){
	this.xSize = xSize;
	this.ySize = ySize;
	this.pixelsX = pixelsX;
	this.pixelsY = pixelsY;

	this.pixelSizeX = this.xSize / this.pixelsX;
	this.pixelSizeY = this.ySize / this.pixelsY;
	
	this.currentGrid = 0;
	this.grids = [[],[]];

	for(var i = 0; i < pixelsY; i++){
		var row = [];
		for(var j = 0; j < pixelsX; j++){
			row.push(0);
		}
		this.grids[0].push(row);
		this.grids[1].push(row);
	}
	
	this.populate = function(){
		for(var i = 0; i < this.pixelsY; i++){
			for(var j = 0; j < this.pixelsX; j++){
				var randomNum = random(100);
				if(randomNum < 10) this.grids[this.currentGrid][i][j] = 1;
			}
		}
	}
	
	this.render = function(){
		stroke('white');
		for(var i = 0; i < this.pixelsY; i++){
			for(var j = 0; j < this.pixelsX; j++){
				if(this.grids[this.currentGrid][i][j] == 0){
					fill('white');
					rect(j*this.pixelSizeX, i*this.pixelSizeY, this.pixelSizeX, this.pixelSizeY);
				}
				else{
					fill('black');
					rect(j*this.pixelSizeX, i*this.pixelSizeY, this.pixelSizeX, this.pixelSizeY);
				}
			}
		}
	}

	this.countNeighbours = function(i, j){
		
		var neighbours = 0;

		// Above
		if(i-1 >= 0){
			if(this.grids[this.currentGrid][i-1][j] == 1) neighbours++;
			// Above, left
			if(j-1 >= 0 && this.grids[this.currentGrid][i-1][j-1] == 1){
				neighbours++;
			}
			// Above, right
			if(j+1 < this.pixelsX && this.grids[this.currentGrid][i-1][j+1] == 1){
				neighbours++;
			}
		}
		// Below
		if(i+1 < this.pixelsY){
			if(this.grids[this.currentGrid][i+1][j] == 1) neighbours++;
			// Below, left
			if(j-1 >= 0 && this.grids[this.currentGrid][i+1][j-1] == 1){
				neighbours++;
			}
			// Below, right
			if(j+1 < this.pixelsX && this.grids[this.currentGrid][i+1][j+1] == 1){
				neighbours++;
			}
		}
		// Left
		if(j-1 >= 0 && this.grids[this.currentGrid][i][j-1] == 1){
			neighbours++;
		}
		// Right
		if(j+1 < this.pixelsX && this.grids[this.currentGrid][i][j+1] == 1){
			neighbours++;
		}

		return neighbours;

	}
	
	this.update = function(){

		for(var i = 0; i < this.pixelsY; i++){
			for(var j = 0; j < this.pixelsX; j++){

				var neighbours = this.countNeighbours(i,j);

				// CELL
				if(this.grids[this.currentGrid][i][j] == 1){

					// If less than 2 or more than 3 neighbours then cell dies.
					if(neighbours < 2 || neighbours > 3) this.grids[1-this.currentGrid][i][j] = 0;

				}
				// NO CELL
				else{

					// If exactly three neighbours then cell is born.
					if(neighbours == 3) this.grids[1-this.currentGrid][i][j] = 1;

				}

			}
		}
		this.currentGrid = 1 - this.currentGrid;

	}
}
