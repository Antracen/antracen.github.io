var series;

function setup() {
    createCanvas(1000, 700);
    noFill();
    b_n = [];
    for (var i = 1; i <= 20; i++) {
        if (i % 2 == 0) b_n.push(0);
        else b_n.push(350 / (PI * i));
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
        let mid_x = 200;
        let mid_y = canvas.height / 2;
        let val = 0;
        let b_tot = 0;
        let pos_y = canvas.height / 2;
        for (let n = 1; n <= b_n.length; n++) {
            val += b_n[n - 1] * sin(n * PI * this.x / this.L);
            ellipse(mid_x, mid_y, abs(2 * b_n[n - 1]), abs(2 * b_n[n - 1]));
            line(mid_x, mid_y, mid_x + b_n[n - 1] * cos(n * PI * this.x / this.L), mid_y + b_n[n - 1] * sin(n * PI * this.x / this.L));
            mid_x += b_n[n - 1] * cos(n * PI * this.x / this.L);
            mid_y += b_n[n - 1] * sin(n * PI * this.x / this.L);
        }
        stroke("red");
        line(this.x, canvas.height / 2 + val, mid_x, mid_y);
        stroke("black");
        this.points.push([this.x, canvas.height / 2 + val]);
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
