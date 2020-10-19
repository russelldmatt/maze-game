// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Videos
// https://youtu.be/HyK_Q5rrcr4
// https://youtu.be/D8UgRyRnvXU
// https://youtu.be/8Ju_uxJ9v44
// https://youtu.be/_p5IH0L63wo

// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm

let cols, rows;
let w = 100;
let grid = [];
let current;
let stack = [];
let p_maze_done = false;

function preload() {
  hurray = loadSound("hurray.wav");
}

function setupMaze() {
  grid = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  grid[grid.length - 1].target = true;

  current = grid[0];
}

function setup() {
  createCanvas(600, 600);
  cols = floor(width / w);
  rows = floor(height / w);
  setupMaze();
}

function draw_build_maze() {
  background(51);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  // STEP 1
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    // STEP 2
    stack.push(current);

    // STEP 3
    removeWalls(current, next);

    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    p_maze_done = true;
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

let p_setup_game = false;

function setup_game() {
  for (let cell of grid) {
    cell.visited = false;
  }
  grid[0].visited = true;
}

function draw_play_game() {
  background(51);
  current.highlight();
  for (let cell of grid) {
    cell.show();
  }
}

function won_game() {
  console.log("yay you won!");
  hurray.play();
  setTimeout(() => hurray.stop(), 3000);
  setTimeout(() => {
    setupMaze();
    p_maze_done = false;
  }, 4500);
}

function draw() {
  if (!p_maze_done) {
    draw_build_maze();
  } else {
    if (!p_setup_game) {
      setup_game();
      p_setup_game = true;
    }
    draw_play_game();
  }
}

function mouseClicked() {
  let row = int(mouseY / w);
  let col = int(mouseX / w);
  cell = grid[row * cols + col];
  let connectedNeighbors = cell.connectedNeighbors();
  for (let x of connectedNeighbors) {
    if (x.visited) cell.visited = true;
  }
  if (cell.visited && cell.target) {
    won_game();
  }
}
