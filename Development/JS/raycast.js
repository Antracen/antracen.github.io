// TODO:
//    Separate X Y wall collision
let walls;

let moved = true;
let cnv_height = 500;
let cnv_width = 500;

let ray_start = [500, 980];
let angle = -1.5; // Player angle
let max_distance;

let minimap;
let map_width;
let map_height;

function setup() {
  let cnv = createCanvas(cnv_width, cnv_height);
  cnv.parent("canvascontainer");
  minimap = createGraphics(140, 140);
  frameRate(30);

  map_width = 1000;
  map_height = 2000;

  walls = [
    [0, 0, map_width, 0, [70, 70, 70]],
    [0, 0, 0, map_height, [70, 70, 70]],
    [map_width, 0, map_width, map_height, [70, 70, 70]],
    [0, map_height, map_width, map_height, [70, 70, 70]],
    [100, 100, 150, 100, [180, 0, 0]],
    [100, 100, 100, 150, [180, 0, 0]],
    [150, 100, 150, 150, [180, 0, 0]],
    [100, 150, 150, 150, [180, 0, 0]],
    [300, 100, 550, 100, [0, 180, 0]],
    [300, 100, 300, 450, [0, 180, 0]],
    [550, 100, 550, 450, [0, 180, 0]],
    [300, 450, 380, 450, [0, 180, 0]],
    [480, 450, 550, 450, [0, 180, 0]],
    [700, 200, 750, 200, [0, 0, 250]],
    [700, 200, 750, 250, [0, 0, 250]],
    [750, 200, 750, 250, [0, 0, 250]],
    [150, 1700, 850, 1700, [240, 90, 100]],
  ];

  max_distance = sqrt(pow(cnv_width, 2) + pow(cnv_height * 0.5, 2));

  canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock;

  canvas.addEventListener('click', canvas.requestPointerLock);
  document.addEventListener('pointerlockchange', mouseLock, false);
}

function mouseLock() {
  if (document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", mouseMover, false);
  } else {
    document.removeEventListener("mousemove", mouseMover, false);
  }
}

function mouseMover(e) {
  angle += 0.003 * e.movementX;
  moved = true;
}

function draw() {

  // dx and dy state how much player should move
  let dx = 0;
  let dy = 0;

  // CHECK KEYS
  if (keyIsDown(87)) {
    dx += cos(angle) * 5;
    dy += sin(angle) * 5;
    moved = true;
  } else if (keyIsDown(83)) {
    dx -= cos(angle) * 5;
    dy -= sin(angle) * 5;
    moved = true;
  }
  if (keyIsDown(65)) {
    dx += cos(angle - PI / 2) * 5;
    dy += sin(angle - PI / 2) * 5;
    moved = true;
  } else if (keyIsDown(68)) {
    dx -= cos(angle - PI / 2) * 5;
    dy -= sin(angle - PI / 2) * 5;
    moved = true;
  }
  if (keyIsDown(LEFT_ARROW)) {
    angle -= 0.05;
    moved = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    angle += 0.05;
    moved = true;
  }

  // Look for wall collisions in player path
  if (dx != 0 || dy != 0) {
    let k_min = -1;
    for (let wall of walls) {
      let p0 = [wall[0], wall[1]];
      let d0 = [wall[2] - wall[0], wall[3] - wall[1]];
      let p1 = ray_start;
      let d1 = [dx, dy];
      let k = lineIntersect(p0, d0, p1, d1);
      if (k[1] > 0 && k[0] >= 0 && k[0] <= 1) {
        if (k_min == -1) {
          k_min = k[1];
        } else k_min = min(k[1], k_min);
      }
    }

    // Will the closest collision hinder our path?
    if (k_min <= 1) {
      dx = 0;
      dy = 0;
    }
    // Move the player
    ray_start[0] += dx;
    ray_start[1] += dy;
  }

  if (moved) {
    let minimap_scaler_x = (minimap.width - 1) / map_width;
    let minimap_scaler_y = (minimap.height - 1) / map_height;
    background(220);
    noStroke();
    fill("rgb(170, 203, 255)");
    rect(0, 0, cnv_width, cnv_height / 2);
    fill("rgb(99, 65, 14)");
    rect(0, cnv_height / 2, cnv_width, cnv_height);
    minimap.background(200);
    minimap.strokeWeight(1);
    minimap.stroke(0);
    minimap.ellipse(minimap_scaler_x * ray_start[0], minimap_scaler_y * ray_start[1], minimap_scaler_x * 3, minimap_scaler_y * 3);


    for (let wall of walls) {
      minimap.stroke(wall[4]);
      minimap.line(minimap_scaler_x * wall[0], minimap_scaler_y * wall[1], minimap_scaler_x * wall[2], minimap_scaler_y * wall[3]);
    }

    let FOV = PI / 2.5;
    let i = 0;
    //175
    let num_rays = 250; // How many rays per side of middle ray

    for (let i = 0; i < num_rays; i++) {
      a = -FOV / 2 + i * FOV / (num_rays - 1);
      let p1 = ray_start;
      let d1 = [10 * cos(angle + a), 10 * sin(angle + a)];
      let k_min = -1;
      let color_min = "";
      for (let wall of walls) {
        let p0 = [wall[0], wall[1]];
        let d0 = [wall[2] - wall[0], wall[3] - wall[1]];
        let k = lineIntersect(p0, d0, p1, d1);
        if (k[1] > 0 && k[0] >= 0 && k[0] <= 1) {
          if (k_min == -1) {
            k_min = k[1];
            color_min = wall[4];
          } else if (k[1] < k_min) {
            k_min = k[1];
            color_min = wall[4];
          }
        }
      }
      minimap.stroke("rgba(200,0,0,0.2)");
      minimap.line(minimap_scaler_x * p1[0], minimap_scaler_y * p1[1], minimap_scaler_x * (p1[0] + k_min * d1[0]), minimap_scaler_y * (p1[1] + k_min * d1[1]));
      let distance = sqrt(pow(d1[0], 2) + pow(d1[1], 2)) * k_min;
      let wall_height = (cnv_height / distance) * 180;
      // Shade function was derived through regression
      let shade = 1 - 0.002 * distance + 0.00000127 * distance * distance;
      shade = max(shade, 0.2);
      noStroke();
      fill(color_min.map(x => x * shade));
      rect(i * cnv_width / num_rays, 0.5 * cnv_height - 0.5 * wall_height, cnv_width / num_rays, wall_height);
    }
    image(minimap, 10, 10);
  }
  moved = false;
}

function lineIntersect(p0, d0, p1, d1) {
  // p0 + k0*d0 = p1 + k1*d1
  // Matrix inversion yields:
  let k0 = 1 / (d0[1] * d1[0] - d0[0] * d1[1]) * (-d1[1] * (p1[0] - p0[0]) + d1[0] * (p1[1] - p0[1]));
  let k1 = 1 / (d0[1] * d1[0] - d0[0] * d1[1]) * (-d0[1] * (p1[0] - p0[0]) + d0[0] * (p1[1] - p0[1]));
  return [k0, k1];
}
