// initialization
let canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

var running = false;
var UPDATE_INTERVAL = 100; // time between updates in ms
var CELL_SIZE = 10; // 10x10px cell size
// game grid size
var WIDTH = 100;
var HEIGHT = 50;
var CANVAS_WIDTH = CELL_SIZE * WIDTH;
var CANVAS_HEIGHT = CELL_SIZE * HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
var BACKGROUND_COLOR="#ffffff";
var CELL_COLOR="#427df4";

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

  // paint to canvas
  paint();

  if (running === true) {
    setTimeout(update, UPDATE_INTERVAL);
  }
}

function paint() {
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = CELL_COLOR;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 1) {
        ctx.fillRect(CELL_SIZE*j, CELL_SIZE*i, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function startGame() {
  running = true;
  setTimeout(update, UPDATE_INTERVAL);
}

function stopGame() {
  running = false;
}
