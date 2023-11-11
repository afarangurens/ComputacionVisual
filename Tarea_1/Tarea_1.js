let w;
let columns;
let rows;
let board;
let isSimulating = false;
let simulationButton;
let infoContainer;
let generationCounter = 0;
let generationParagraph;
let remainingCellsParagraph;
let escudoImage; 
let selectedPatternText;
let canvas;

/**
 * Set up the initial canvas and the html elements contained in the view.
 */
function setup() {
  // Canvas setup
  canvas = createCanvas(920, 400);
  let canvasX = windowWidth / 2 - width / 2;
  let canvasY = windowHeight / 2 - height / 2;
  canvas.position(canvasX, canvasY);

  // Framerate to limit the simulation so it doesn't update as fast
  frameRate(5);
  w = 20;
  columns = floor(width / w);
  rows = floor(height / w);
  board = createEmptyGrid(columns, rows);

  // Reset grid button handlers
  let resetButton = createButton('Reset Grid');
  resetButton.mousePressed(resetGrid);
  resetButton.position(canvasX + 10, canvasY + height + 10);

  // Start Simulation button handlers
  simulationButton = createButton('Start Simulation');
  simulationButton.mousePressed(toggleSimulation);
  simulationButton.position(resetButton.x + resetButton.width + 10, canvasY + height + 10);

  // Container to act as a dashboard to display info about the lab
  infoContainer = createDiv('');
  infoContainer.position(canvasX + width + 10, canvasY);
  infoContainer.style('background-color', '#f0f0f0');
  infoContainer.style('padding', '20px');

  // Crest of the Universidad Nacional de Colombia
  escudoImage = createImg('escudo.png', 'escudo');
  escudoImage.size(200, 100); // Set the size of the image
  infoContainer.child(escudoImage);

  // Basic info about the lab
  infoContainer.child(createElement('h2', 'Conway\'s Game of Life'));
  infoContainer.child(createElement('p', 'AEA - Andrés Fernando Aranguren Silva'));

  // Paragraph element to update the number of the current generation
  generationParagraph = createP('Generation: ' + generationCounter);
  infoContainer.child(generationParagraph);

  // Paragraph element to update the remaining cells alive
  remainingCellsParagraph = createP('Remaining Cells: ' + countRemainingCells());
  infoContainer.child(remainingCellsParagraph);

  // List element to display key configurations
  keyConfigList = createDiv('Preloaded Configurations:<ul><li>Q: Glider</li><li>W: Blinker</li><li>E: Beacon</li><li>R: Pulsar</li><li>T: Centinal</li><li>Y: Space Invaders Face</li></ul>');
  infoContainer.child(keyConfigList);
}

/**
 * Draw function, called continuously to update the canvas.
 */
function draw() {
  background(255);
  displayGrid();

  if (isSimulating) {
    generate();
  }

   // Update the generation and remaining cells counter in the dashboard
   generationParagraph.html('Generation: ' + generationCounter);
   remainingCellsParagraph.html('Remaining Cells: ' + countRemainingCells());
}

/**
 * Handle mouse click events to toggle cell state.
 */
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / w);
  board[i][j] = 1 - board[i][j];
}

/**
 * Display the grid on the canvas.
 */
function displayGrid() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] === 1) {
        fill(0);
      } else {
        fill(255);
      }
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
}

/**
 * Create an empty grid with the specified number of columns and rows.
 * @param {number} cols - Number of columns in the grid.
 * @param {number} rows - Number of rows in the grid.
 * @returns {number[][]} - An empty 2D array representing the grid.
 */
function createEmptyGrid(cols, rows) {
  let grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows).fill(0);
  }
  return grid;
}

/**
 * Initialize the grid by setting all cells to 0.
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
    }
  }
}

/**
 * Reset the grid to its initial state and set generation counter to 0.
 */
function resetGrid() {
  init();
  generationCounter = 0;
}

/**
 * Toggle the simulation state when the button is pressed.
 */
function toggleSimulation() {
  isSimulating = !isSimulating;
  if (isSimulating) {
    simulationButton.html('Stop Simulation');
  } else {
    simulationButton.html('Start Simulation');
  }
}

/**
 * Apply the rules of Conway's Game of Life to generate the next generation.
 */
function generate() {
  let next = createEmptyGrid(columns, rows);
  let aliveCells = 0;

  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let neighbors = countNeighbors(x, y);

      if (board[x][y] === 1 && (neighbors < 2 || neighbors > 3)) {
        next[x][y] = 0;
      } else if (board[x][y] === 0 && neighbors === 3) {
        next[x][y] = 1;
        aliveCells = 1; // Set aliveCells to 1 if there's at least one alive cell
      } else {
        next[x][y] = board[x][y];
        if (board[x][y] === 1) {
          aliveCells = 1; // Set aliveCells to 1 if there's at least one alive cell
        }
      }
    }
  }

  board = next;
  generationCounter++;

  // Stop simulation if no longer alive cells
  if (aliveCells === 0) {
    isSimulating = false;
    simulationButton.html('Start Simulation');
  }
}

/**
 * Count the number of alive neighbors around a given cell.
 * @param {number} x - X-coordinate of the cell.
 * @param {number} y - Y-coordinate of the cell.
 * @returns {number} - Number of alive neighbors.
 */
function countNeighbors(x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      sum += board[x + i][y + j];
    }
  }
  sum -= board[x][y];
  return sum;
}

/**
 * Count the remaining alive cells on the board.
 * @returns {number} - Number of remaining alive cells.
 */
function countRemainingCells() {
  let count = 0;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] === 1) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Handle key press events to preload specific configurations.
 */
function keyTyped() {
  if (key === 'q') {
    preloadConfigurationGlider();
  } else if (key === 'w') {
    preloadConfigurationBlinker();
  } else if (key === 'e') {
    preloadConfigurationBeacon();
  } else if (key === 'r') {
    preloadConfigurationPulsar();
  } else if (key === 't') {
    preloadConfigurationCentinal();
  } else if (key === 'y') {
    preloadConfigurationSpaceInvadersFace();
  } 
}

/**
 * Preload the Glider configuration.
 */
function preloadConfigurationGlider() {
  resetGrid();
  let offsetX = floor(columns / 2) - 2;
  let offsetY = floor(rows / 2) - 1;
  board[offsetX + 1][offsetY] = 1;
  board[offsetX + 2][offsetY + 1] = 1;
  board[offsetX][offsetY + 2] = 1;
  board[offsetX + 1][offsetY + 2] = 1;
  board[offsetX + 2][offsetY + 2] = 1;
}

/**
 * Preload the Blinker configuration.
 */
function preloadConfigurationBlinker() {
  resetGrid();
  let offsetX = floor(columns / 2) - 1;
  let offsetY = floor(rows / 2) - 1;
  board[offsetX + 1][offsetY + 1] = 1;
  board[offsetX + 1][offsetY + 2] = 1;
  board[offsetX + 1][offsetY + 3] = 1;
}

/**
 * Preload the Beacon configuration.
 */
function preloadConfigurationBeacon() {
  resetGrid();
  let offsetX = floor(columns / 2) - 2;
  let offsetY = floor(rows / 2) - 2;
  board[offsetX + 1][offsetY + 1] = 1;
  board[offsetX + 2][offsetY + 1] = 1;
  board[offsetX + 1][offsetY + 2] = 1;
  board[offsetX + 4][offsetY + 3] = 1;
  board[offsetX + 3][offsetY + 4] = 1;
  board[offsetX + 4][offsetY + 4] = 1;
}

/**
 * Preload the Pulsar configuration.
 */
function preloadConfigurationPulsar() {
  resetGrid();
  let pulsarPattern = [
    [2, 0, 0, 1, 1, 1, 0, 0, 2],
    [2, 0, 4, 1, 0, 1, 4, 0, 2],
    [0, 4, 0, 1, 0, 1, 0, 4, 0],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 4, 0, 1, 0, 1, 0, 4, 0],
    [2, 0, 4, 1, 0, 1, 4, 0, 2],
    [2, 0, 0, 1, 1, 1, 0, 0, 2]
  ];

  let offsetX = floor(columns / 2) - floor(pulsarPattern.length / 2);
  let offsetY = floor(rows / 2) - floor(pulsarPattern[0].length / 2);

  for (let i = 0; i < pulsarPattern.length; i++) {
    for (let j = 0; j < pulsarPattern[i].length; j++) {
      board[i + offsetX][j + offsetY] = pulsarPattern[i][j];
    }
  }
}

/**
 * Preload the Centinal configuration.
 */
function preloadConfigurationCentinal() {
  resetGrid();
  let centinalPattern = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0]
  ];

  let offsetX = floor(columns / 2) - floor(centinalPattern.length / 2);
  let offsetY = floor(rows / 2) - floor(centinalPattern[0].length / 2);

  for (let i = 0; i < centinalPattern.length; i++) {
    for (let j = 0; j < centinalPattern[i].length; j++) {
      board[i + offsetX][j + offsetY] = centinalPattern[i][j];
    }
  }
}

/**
 * Preload a custom configuration (Space Invaders Face).
 */
function preloadConfigurationSpaceInvadersFace() {
  resetGrid();
  let customPattern = [
    [0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0]
  ];

  let offsetX = floor(columns / 2) - floor(customPattern.length / 2);
  let offsetY = floor(rows / 2) - floor(customPattern[0].length / 2);

  for (let i = 0; i < customPattern.length; i++) {
    for (let j = 0; j < customPattern[i].length; j++) {
      board[i + offsetX][j + offsetY] = customPattern[i][j];
    }
  }
}
