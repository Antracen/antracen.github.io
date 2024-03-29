var series;

function setup() {
    var cnv = createCanvas(500, 500);
	cnv.parent("canvascontainer");
    noFill();
    b_n = [];
    for (var i = 1; i <= 20; i++) {
        if (i % 2 == 0) b_n.push(0);
        else b_n.push(150 / (PI * i));
    }

    series = new Series(b_n, 100);
}

class Series {
    constructor(b_n, L) {
        this.b_n = b_n;
        this.L = L
        this.x = 400;
        this.points = [];
    }

    render() {
        let mid_x = 100;
        let mid_y = 250;
        let val = 0;
        let b_tot = 0;
        for (let n = 1; n <= b_n.length; n++) {
            val += b_n[n - 1] * sin(n * PI * this.x / this.L);
            ellipse(mid_x, mid_y, abs(2 * b_n[n - 1]), abs(2 * b_n[n - 1]));
            line(mid_x, mid_y, mid_x + b_n[n - 1] * cos(n * PI * this.x / this.L), mid_y + b_n[n - 1] * sin(n * PI * this.x / this.L));
            mid_x += b_n[n - 1] * cos(n * PI * this.x / this.L);
            mid_y += b_n[n - 1] * sin(n * PI * this.x / this.L);
        }
        stroke("red");
        line(0.5*this.x, 500 / 2 + val, mid_x, mid_y);
        stroke("black");
        this.points.push([0.5*this.x, 500 / 2 + val]);
        let old_point = this.points[0];
        for (let p of this.points) {
            line(old_point[0], old_point[1], p[0], p[1]);
            old_point = p;
        }
    }
}

function draw() {
    if (series.x < 1000) {
        background(255);
        series.x += 0.5;
        series.render();
    }
}
