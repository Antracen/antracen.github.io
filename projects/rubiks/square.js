class Square {

    constructor(a, b, c, d, sq_color) {
        this.points = [a,b,c,d];
        this.sq_color = sq_color;
    }
  
    render() {
        fill(this.sq_color);
        smooth();
  
        beginShape();
        vertex(this.points[0][0], this.points[0][1], this.points[0][2]);
        vertex(this.points[1][0], this.points[1][1], this.points[1][2]);
        vertex(this.points[2][0], this.points[2][1], this.points[2][2]);
        vertex(this.points[3][0], this.points[3][1], this.points[3][2]);
        endShape(CLOSE);
    }
}