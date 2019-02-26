let map;
let player;

function setup() {
  	createCanvas(500,500);
	map = new Map();
    player = new Player();
}

class Map {
    
    constructor() {
    	this.a = 100;
        this.b = 0.008;
        this.c = 250;
    }
    
    getValue(x) {
    	return this.a*sin(this.b*x) - this.c;
    }
    
    getSlope(x) {
    	return this.a*this.b*cos(this.b*x);
    }
    
    getSlopeSlope(x) {
    	return -this.a*this.b*this.b*sin(this.b*x);
    }
    
	render() {
        let scaler = 1 - player.y*0.9/800;
        if(scaler > 1) scaler = 1;
        if(scaler < 0.3) scaler = 0.3;
        scale(scaler);
        for(let i = 1; i < 1500; i++) {
            stroke("#7cf473");
        	line(i, 500-this.getValue(i + player.x - player.drawX) + player.y - player.drawY, i, 99999);
        }
    }
}

class Player {
	
    constructor() {
        this.drawX = 50; // Where on screen to draw player x position
        this.drawY = 250;
        this.x = 150;
        this.y = 250;
        this.velX = 2;
        this.velY = 0;
        this.oldSlopeSlope = 0;
        this.grounded = 0;
    }
    
    move() {
        if(this.velY > 25) this.velY = 25;
        this.x += this.velX;
        if(this.velX < 2) this.velX = 2;
        if(this.velX > 15) this.velX = 15;
        this.acc = -0.3;
        if(keyIsDown(90)) this.acc = -2;
        if(!this.grounded) {
            this.velY += this.acc;
            this.y += this.velY;
            if(this.y < map.getValue(this.x)) {
                this.grounded = true;
                if(map.getSlope(this.x) > 0) {
                    this.velX = 2;
                } else{
                	this.velX += 0.8*this.velY*map.getSlope(this.x);
                }
            }
            if(this.velY > 40) this.velY = 40;
            if(this.velY < -15) this.velY = -15;
        }
    	if(this.grounded) {
            this.grounded = 1;
            this.velX += 0.5*this.acc*map.getSlope(this.x);
            if(this.velX < 2) this.velX = 2;
            this.y = map.getValue(this.x);
            if(this.oldSlopeSlope >= 0 && map.getSlopeSlope(this.x) < 0 && this.velX > 10) {
                this.velY = 1.7*this.velX;
                this.grounded = false;
            }
        }
        this.oldSlopeSlope = map.getSlopeSlope(this.x);
    }
    
    render() {
        stroke("black");
        fill("#c9c934");
    	ellipse(this.drawX, this.drawY, 25, 20);
        fill("white");
        ellipse(this.drawX + 9, this.drawY - 5, 10, 10);
		fill("black");
        ellipse(this.drawX + 9, this.drawY - 5, 5, 5);
        fill("red");
        stroke("red");
		rect(this.drawX + 3, this.drawY + 3, 10, 1);
        stroke("black");
        fill("#c9c934");
        triangle(this.drawX, this.drawY - 5, this.drawX, this.drawY + 5, this.drawX - 15, this.drawY + 2);
    }
}

function draw() {
    background("#4c9fff");
    map.render();
    player.move();
    player.render();
}
