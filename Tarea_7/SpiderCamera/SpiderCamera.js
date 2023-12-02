let city = [];
let splinePoints = [];
let camX, camY, camZ;
let camFollow = 1;
let camSpeed = 1;
let buildingTexture;

function preload() {
  buildingTexture = loadImage('textura.jpg');
  groundTexture = loadImage('textura_suelo.jpg');
  cloudsTexture = loadImage('clouds.png');
}

function setup() {
  createCanvas(800, 600, WEBGL);
  stroke(255);

  generateCity();
  initializeCamera();
}

function draw() {
  background(0);
  rotateX(PI);
  drawCity();
  drawSpline();
  updateCamera();
  drawSpline();
}

function generateCity() {
  for (let x = -200; x <= 200; x += 90) {
    for (let z = -200; z <= 200; z += 90) {
      let y = random(80, 200);  // Adjust the range for taller buildings
      let redComponent = floor(random(175, 231));
      let greenComponent = floor(random(72, 203));
      let blueComponent = floor(random(253, 252));

      let buildingColor = color(redComponent, greenComponent, blueComponent);
      city.push({ position: createVector(x, y / 2, z), height: y, color: buildingColor, size: createVector(40, y, 40) });
    }
  }
}

function initializeCamera() {
  let controlPoints = [
    createVector(-150, -10, -300),
    createVector(-150, -40, -125),
    createVector(80, -80, -100),
    createVector(250, -30, 2),
    createVector(250, -80, 100),
    createVector(150, -10, 150),
    createVector(0, -60, 150),
    createVector(-200, -30, 150),
    createVector(-300, -90, 50),
    createVector(-250, -60, -250),
  ];

  for (let i = 0; i < controlPoints.length; i++) {
    controlPoints[i].add(createVector(random(-20, 20), random(-100, 20), random(-20, 20)));
  }
  
  splinePoints = spline(controlPoints);
  let start = splinePoints[0];
  camX = start.x;
  camY = start.y;
  camZ = start.z;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  
}

function drawCity() {
  const commonStartingHeight = 0;
  push();
  translate(0, commonStartingHeight, 0);
  rotateX(PI / 2);
  texture(groundTexture);
  plane(600, 600); 
  let skySize = 600;
  texture(cloudsTexture);
  box(skySize, skySize, skySize);
  pop();

  for (let building of city) {
    push();
    translate(building.position.x, building.position.y, building.position.z);
    texture(buildingTexture);
    box(building.size.x, building.size.y, building.size.z);
    pop();
  }
  
}

function updateCamera() {
  if (camFollow < splinePoints.length - 1) {
    let p = splinePoints[floor(camFollow)];
    let nextPoint = splinePoints[floor(camFollow) + 1];

    let targetCamX = lerp(p.x, nextPoint.x, camFollow % 1);
    let targetCamY = lerp(p.y, nextPoint.y, camFollow % 1);
    let targetCamZ = lerp(p.z, nextPoint.z, camFollow % 1);

    let lookAtDirection = createVector(nextPoint.x - camX, nextPoint.y - camY, nextPoint.z - camZ).normalize();

    let lookAtX = camX + lookAtDirection.x * 10;
    let lookAtY = camY + lookAtDirection.y * 10;
    let lookAtZ = camZ + lookAtDirection.z * 10;
    camX = lerp(camX, targetCamX, 0.04);
    camY = lerp(camY, targetCamY, 0.04);
    camZ = lerp(camZ, targetCamZ, 0.04);

    camera(camX, camY, camZ, lookAtX, lookAtY, lookAtZ, 0, 1, 0);

    camFollow += camSpeed;
  } else {
    camFollow = 0;
  }
}

function drawSpline() {
  push();
  noFill();
  stroke(40, 240, 223);
  beginShape(LINES);
  for (let point of splinePoints) {
    vertex(point.x, point.y, point.z);
  }
  endShape();
  pop();
}

function spline(points) {
  let result = [];
  for (let i = 0; i < points.length; i++) {
    let p0 = points[(i - 1 + points.length) % points.length];
    let p1 = points[i];
    let p2 = points[(i + 1) % points.length];
    let p3 = points[(i + 2) % points.length];
    for (let t = 0; t < 1; t += 0.01) {
      let t2 = t * t;
      let t3 = t2 * t;
      let x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      let y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      let z = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3);
      result.push(createVector(x, y, z));
    }
  }
  return result;
}
