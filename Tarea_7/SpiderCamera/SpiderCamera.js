let city = [];
let splinePoints = [];
let camX, camY, camZ;
let camFollow = 1;
let camSpeed = 0.7;
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
  for (let i = 0; i < points.length - 1; i++) {
    let p0 = points[i];
    let p1 = points[i + 1];
    let t0 = createVector(1, 0, 0);
    let t1 = createVector(1, 0, 0);

    for (let t = 0; t <= 1; t += 0.01) {
      let t2 = t * t;
      let t3 = t2 * t;
      let a = 2 * t3 - 3 * t2 + 1;
      let b = t3 - 2 * t2 + t;
      let c = -2 * t3 + 3 * t2;
      let d = t3 - t2;

      let x = a * p0.x + b * t0.x + c * p1.x + d * t1.x;
      let y = a * p0.y + b * t0.y + c * p1.y + d * t1.y;
      let z = a * p0.z + b * t0.z + c * p1.z + d * t1.z;

      result.push(createVector(x, y, z));
    }
  }
  return result;
}
