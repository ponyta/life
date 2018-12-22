// initialization
let canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

// undefined if not running, otherwise is some object
var running = undefined;
var UPDATE_INTERVAL = 100; // time between updates in ms
var CELL_SIZE = 10; // 10x10px cell size
// game grid size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var WIDTH = Math.floor(canvas.width/CELL_SIZE);
var HEIGHT = Math.floor(canvas.height/CELL_SIZE);
var BACKGROUND_COLOR="#681b3c";
var CELL_COLOR="#baab23";

// 2d array containing cells
// 0 is dead, 1 is alive
var grid = initGrid();
randomize();

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function randomize() {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(WIDTH);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = Math.round(Math.random());
    }
  }
  paint();
}

function cleanGame() {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(WIDTH);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = 0;
    }
  }
  paint();
}

function initGrid() {
  let arr = new Array(HEIGHT);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(WIDTH);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
};

// Implements the "Rules of Life". Change this if you want to try a different
// set of rules (for ex. Night and Day).
//
// Returns 1 if this cell should be alive, 0 otherwise.
// state is the current state of the cell.
// neighboursAlive is the number of neighbouring cells that are also alive.
function isAlive(state, neighboursAlive) {
  if (state === 0 && neighboursAlive === 3) {
    return 1;
  } else if (state === 1 && (neighboursAlive === 2 || neighboursAlive === 3)) {
    return 1;
  }
  return 0;
}

// Counts the number of alive neighbours around grid[row][col].
//
// Change this if you want to implement grid-wrapping, or what counts as a
// neighbour.
function numAliveNeighbours(row, col) {
  let numAlive = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let checkRow = row+i;
      let checkCol = col+j;
      if (!(checkRow === row && checkCol == col)) { // don't count myself
        // wrap around the grid boundaries
        if (checkRow === -1) {
          checkRow = HEIGHT-1;
        } else if (checkRow === HEIGHT) {
          checkRow = 0;
        }
        if (checkCol === -1) {
          checkCol = WIDTH-1;
        } else if (checkCol === WIDTH) {
          checkCol = 0;
        }
        //if (checkRow >= 0 && checkRow < HEIGHT && checkCol >= 0 && checkCol < WIDTH) {
        numAlive += grid[checkRow][checkCol];
        //}
      }
    }
  }
  return numAlive;
}

function update() {
  // calculate new grid
  let new_grid = initGrid();
  for (let i = 0; i < new_grid.length; i++) {
    for (let j = 0; j < new_grid[i].length; j++) {
      new_grid[i][j] = isAlive(grid[i][j], numAliveNeighbours(i, j));
    }
  }
  grid = new_grid;

  // paint to canvas and set next timeout
  paint();
}

function paint() {
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = CELL_COLOR;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 1) {
        ctx.fillRect(CELL_SIZE*j, CELL_SIZE*i, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

// Starts or stops the game (toggles running)
function toggleRun() {
  let icon = document.getElementById('start-pause-icon');
  if (running === undefined) {
    icon.setAttribute('data-feather', 'pause');
    running = setInterval(update, UPDATE_INTERVAL);
  } else {
    icon.setAttribute('data-feather', 'play');
    clearInterval(running);
    running = undefined;
  }
  feather.replace();
}

// Puts a random glider in somewhere
function glider() {
  let start_row = getRandomInt(HEIGHT-5) + 2;
  let start_col = getRandomInt(WIDTH-5) + 3;
  let glider = [[start_row, start_col],
    [start_row+1, start_col+1],
    [start_row+1, start_col+2],
    [start_row, start_col+2],
    [start_row-1, start_col+2]];
  for (i in glider) {
    let coords = glider[i];
    grid[coords[0]][coords[1]] = 1;
  }
  paint();
}

// Puts a random glider gun in somewhere
function gun() {
  let gun = [
    // first square
    [5, 1],
    [5, 2],
    [6, 1],
    [6, 2],
    // C shape
    [3, 13],
    [3, 14],
    [4, 12],
    [5, 11],
    [6, 11],
    [7, 11],
    [8, 12],
    [9, 13],
    [9, 14],
    // arrow shape
    [6, 15],
    [4, 16],
    [8, 16],
    [5, 17],
    [6, 17],
    [7, 17],
    [6, 18],
    // "frog" shape
    [3, 21],
    [4, 21],
    [5, 21],
    [3, 22],
    [4, 22],
    [5, 22],
    [2, 23],
    [6, 23],
    [1, 25],
    [2, 25],
    [6, 25],
    [7, 25],
    // second square
    [3, 35],
    [4, 35],
    [3, 36],
    [4, 36],
  ];

  let start_row = getRandomInt(HEIGHT-10) + 1;
  let start_col = getRandomInt(WIDTH-43) + 1;
  for (i in gun) {
    let coords = gun[i]
    grid[start_row + coords[0]][start_col + coords[1]] = 1;
  }
  paint();
}
