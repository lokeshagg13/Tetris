let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");
canvas.width = 936;
canvas.height = 600;

canvasContext.scale(2, 2);

// Game board geometry
let gBPixelHeight = 229;
let gBPixelWidth = 143;
let blockSize = 11; // Square block with width = height = size
let xOffset = 11;
let yOffset = 9;

// Game logic geometry
let gBArrayHeight = 20;
let gBArrayWidth = 12;

let coordinateArray = [...Array(gBArrayHeight)].map((e) =>
  Array(gBArrayWidth).fill(0)
);

let gameBoardArray = [...Array(gBArrayHeight)].map((e) =>
  Array(gBArrayWidth).fill(0)
);

const DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const CANVAS_COLOR = "white";
const COLORS = ["purple", "cyan", "blue", "yellow", "orange", "green", "red"];

// Initial Start position of the tetromino
let initialStartX = 4;
let initialStartY = 0;
let currentTetromino;

let createCoordinateArray = () => {
  let i = 0;
  let j = 0;
  for (let y = yOffset; y < gBPixelHeight; y += blockSize) {
    for (let x = xOffset; x < gBPixelWidth; x += blockSize) {
      coordinateArray[i][j] = new Coordinate(x, y);
      j += 1;
    }
    i += 1;
    j = 0;
  }
};

let setupCanvas = () => {
  canvasContext.fillStyle = CANVAS_COLOR;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  canvasContext.strokeStyle = "black";
  canvasContext.strokeRect(
    xOffset - 1,
    yOffset - 3,
    gBPixelWidth - blockSize,
    gBPixelHeight - blockSize + 5
  );
  createCoordinateArray();

  document.addEventListener("keydown", handleKeyPress);
  createTetromino();
  drawTetromino();
};

let handleKeyPress = (key) => {
  if (key.keyCode === 65 || key.keyCode === 37) {
    deleteTetromino();
    currentTetromino.moveTetromino(DIRECTION.LEFT);
    drawTetromino();
  } else if (key.keyCode === 68 || key.keyCode === 39) {
    deleteTetromino();
    currentTetromino.moveTetromino(DIRECTION.RIGHT);
    drawTetromino();
  } else if (key.keyCode === 83 || key.keyCode === 40) {
    deleteTetromino();
    currentTetromino.moveTetromino(DIRECTION.DOWN);
    drawTetromino();
  }
};

let drawTetromino = () => {
  for (let i = 0; i < currentTetromino.blockPositions.length; i++) {
    let x = currentTetromino.blockPositions[i][0] + currentTetromino.startX;
    let y = currentTetromino.blockPositions[i][1] + currentTetromino.startY;
    gameBoardArray[x][y] = 1;
    let coordX = coordinateArray[y][x].x;
    let coordY = coordinateArray[y][x].y;
    console.log(coordX, coordY);
    canvasContext.fillStyle = currentTetromino.color;
    canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);
  }
};

let deleteTetromino = () => {
  for (let i = 0; i < currentTetromino.blockPositions.length; i++) {
    let x = currentTetromino.blockPositions[i][0] + currentTetromino.startX;
    let y = currentTetromino.blockPositions[i][1] + currentTetromino.startY;
    gameBoardArray[x][y] = 0;
    let coordX = coordinateArray[y][x].x;
    let coordY = coordinateArray[y][x].y;
    console.log(coordX, coordY);
    canvasContext.fillStyle = CANVAS_COLOR;
    canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);
  }
};

let createTetromino = () => {
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  let randomColor = Math.floor(Math.random() * COLORS.length);
  currentTetromino = new Tetromino(
    initialStartX,
    initialStartY,
    tetrominos[randomTetromino],
    COLORS[randomColor],
    DIRECTION.DOWN
  );
};

document.addEventListener("DOMContentLoaded", setupCanvas);
