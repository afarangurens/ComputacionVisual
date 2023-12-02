let myModel;
let cols, rows;
let grid;
let nextGrid;
let da = 1.0;
let db = 0.5;
let feed = 0.055;
let kill = 0.062;
let dt = 1.0;

function preload() {
  myModel = loadModel('AllAnimals(notOne1Point).obj', true);
}

function setup() {
  createCanvas(600, 600, WEBGL);

  cols = 100;
  rows = 100;

  grid = new Array(cols).fill(null).map(() => new Array(rows).fill(1));
  nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

  // Add buttons and sliders here for personalized texture
  createButton('Increase da').mousePressed(() => { da += 0.1; });
  createButton('Decrease da').mousePressed(() => { da -= 0.1; });
  // Add sliders for other parameters...

}

function draw() {
  background(255);

  // Update reaction-diffusion model
  updateReactionDiffusion();

  // Set isometric view
  camera(10, -100, 200, 0, 50, 0, 0, 1, 0);

  // Apply rotation to the model
  rotateX(PI);
  rotateY(PI);

  // Apply texture to the model
  let textureImg = createTexture();
  texture(textureImg);
  model(myModel);
}

function updateReactionDiffusion() {
  // Create temporary array to store the next state
  let nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

  // Loop through each cell in the grid
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      // Get current concentrations
      let a = grid[i][j];
      let b = 1 - grid[i][j];

      // Calculate Laplacian values
      let laplaceA = laplaceAValue(i, j);
      let laplaceB = laplaceBValue(i, j);

      // Apply reaction-diffusion equations
      let reaction = a * b * b;
      let diffusionA = da * laplaceA;
      let diffusionB = db * laplaceB;

      // Update concentrations in the next grid
      nextGrid[i][j] = a + (diffusionA - reaction + feed * (1 - a)) * dt;
      nextGrid[i][j] = constrain(nextGrid[i][j], 0, 1);
    }
  }

  // Swap grids
  grid = nextGrid;
}

function laplaceAValue(x, y) {
  let sumA = 0;
  sumA += grid[x][y] * -1;
  sumA += grid[x + 1][y] * 0.2;
  sumA += grid[x - 1][y] * 0.2;
  sumA += grid[x][y + 1] * 0.2;
  sumA += grid[x][y - 1] * 0.2;
  sumA += grid[x + 1][y + 1] * 0.05;
  sumA += grid[x - 1][y - 1] * 0.05;
  sumA += grid[x - 1][y + 1] * 0.05;
  sumA += grid[x + 1][y - 1] * 0.05;
  return sumA;
}

function laplaceBValue(x, y) {
  let sumB = 0;
  sumB += grid[x][y] * -1;
  sumB += grid[x + 1][y] * 0.2;
  sumB += grid[x - 1][y] * 0.2;
  sumB += grid[x][y + 1] * 0.2;
  sumB += grid[x][y - 1] * 0.2;
  sumB += grid[x + 1][y + 1] * 0.05;
  sumB += grid[x - 1][y - 1] * 0.05;
  sumB += grid[x - 1][y + 1] * 0.05;
  sumB += grid[x + 1][y - 1] * 0.05;
  return sumB;
}

function createTexture() {
  let img = createImage(cols, rows);
  img.loadPixels();
  // Set pixel colors based on concentrations
  // You may use a colormap or grayscale
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let val = floor(grid[i][j] * 255);
      img.set(i, j, color(val, val, val));
    }
  }
  img.updatePixels();
  return img;
}
