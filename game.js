let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");
let confettiCanvas = document.getElementById("confettiCanvas");

canvas.width = 756;
canvas.height = 524;

canvasContext.scale(2, 2);

// Game board geometry
let gameBoardPositionTopLeft = [75, 9];
let gameBoardPositionBottomRight = [210, 240];
let gameBoardSize = [144, 243];
let blockSize = 12; // Square block with width = height = size

// Game logic geometry
let gBArrayHeight = 20;
let gBArrayWidth = 12;

// Info board geometry
let infoLabelColor = "black";
let infoLabelFont = "10px Arial";

let tetrisImageResolution = [1071, 859];
let tetrisLogoFileName = "tetris_logo.png";
let tetrisLogoPosition = [230, 8];
let tetrisLogoSize = [125, 75];
let tetrisLogo;

let scoreLabelPosition = [235, 98];
let scoreRectPosition = [235, 109];
let scoreRectSize = [100, 15];
let scoreTextPosition = [240, 120];

let levelLabelPosition = [235, 140];
let levelRectPosition = [235, 151];
let levelRectSize = [100, 15];
let levelTextPosition = [240, 163];

let controlsLabelPosition = [235, 185];
let controlsRectPosition = [235, 196];
let controlsRectSize = [100, 53];
let controlsTextFont = "8px Arial";
let controlsTextPosition = [
  [240, 205],
  [240, 215],
  [240, 225],
  [240, 235],
  [240, 245],
];

let gameOverTextPosition = [120, 110];
let pauseTextPosition = [130, 110];

// Game Constants
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

// Important Arrays
let coordinateArray = [...Array(gBArrayWidth)].map((e) =>
  Array(gBArrayHeight).fill(0)
);

let gameBoardArray = [...Array(gBArrayWidth)].map((e) =>
  Array(gBArrayHeight).fill(0)
);

let stoppedShapeArray = [...Array(gBArrayWidth)].map((e) =>
  Array(gBArrayHeight).fill(0)
);

// Game Rewards and Difficulty Levels
let levelSpeed = (level) => (level - 1) * 0.5 + 1;
let levelScore = (level) => (level - 1) * 20 + 50;
let level = 1;
let speed = levelSpeed(level);
let maxScore = levelScore(level);
let currentScore = 0;
let gameState = "Playing"; // "Playing" / "Game Over" / "Paused"

let currentTetromino;

let createCoordinateArray = () => {
  let i = 0;
  let j = 0;
  for (
    let y = gameBoardPositionTopLeft[1];
    y <= gameBoardPositionBottomRight[1];
    y += blockSize
  ) {
    for (
      let x = gameBoardPositionTopLeft[0];
      x <= gameBoardPositionBottomRight[0];
      x += blockSize
    ) {
      coordinateArray[i][j] = new Coordinate(x, y);
      i += 1;
    }
    j += 1;
    i = 0;
  }
};

let setupCanvas = () => {
  // Draw Whole Canvas
  canvasContext.fillStyle = CANVAS_COLOR;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Game Board
  canvasContext.strokeStyle = "black";
  canvasContext.strokeRect(
    gameBoardPositionTopLeft[0] - 1,
    gameBoardPositionTopLeft[1] - 3,
    gameBoardSize[0],
    gameBoardSize[1]
  );

  canvasContext.fillStyle = infoLabelColor;
  canvasContext.font = infoLabelFont;

  // Draw Information Board
  //   Draw Tetris Logo
  tetrisLogo = new Image(tetrisImageResolution[0], tetrisImageResolution[1]);
  tetrisLogo.onload = drawTetrisLogo;
  tetrisLogo.src = tetrisLogoFileName;

  // Draw Score Information
  canvasContext.fillText("SCORE", scoreLabelPosition[0], scoreLabelPosition[1]);
  canvasContext.strokeRect(
    scoreRectPosition[0],
    scoreRectPosition[1],
    scoreRectSize[0],
    scoreRectSize[1]
  );
  showScore();

  // Draw Level Information
  canvasContext.fillText("LEVEL", levelLabelPosition[0], levelLabelPosition[1]);
  canvasContext.strokeRect(
    levelRectPosition[0],
    levelRectPosition[1],
    levelRectSize[0],
    levelRectSize[1]
  );
  showLevel();

  // Draw Controls Information
  canvasContext.fillText(
    "CONTROLS",
    controlsLabelPosition[0],
    controlsLabelPosition[1]
  );
  canvasContext.strokeRect(
    controlsRectPosition[0],
    controlsRectPosition[1],
    controlsRectSize[0],
    controlsRectSize[1]
  );
  canvasContext.font = controlsTextFont;
  canvasContext.fillText(
    "A / ← : LEFT",
    controlsTextPosition[0][0],
    controlsTextPosition[0][1]
  );
  canvasContext.fillText(
    "D / → : RIGHT",
    controlsTextPosition[1][0],
    controlsTextPosition[1][1]
  );
  canvasContext.fillText(
    "S / ↓ : DOWN",
    controlsTextPosition[2][0],
    controlsTextPosition[2][1]
  );
  canvasContext.fillText(
    "Q / SPACE : CLKWISE",
    controlsTextPosition[3][0],
    controlsTextPosition[3][1]
  );
  canvasContext.fillText(
    "E : ANTICLKWISE",
    controlsTextPosition[4][0],
    controlsTextPosition[4][1]
  );

  createCoordinateArray();

  document.addEventListener("keydown", handleKeyPress);
  createNewTetromino();
  drawTetromino();
};

let handleKeyPress = (key) => {
  if (gameState != "Game Over") {
    if (key.keyCode === 65 || key.keyCode === 37) {
      currentTetromino.changeDirection(DIRECTION.LEFT);
      if (!hittingTheWalls() && !checkForHorizontalCollision()) {
        eraseTetromino();
        currentTetromino.moveTetromino();
        drawTetromino();
      }
    } else if (key.keyCode === 68 || key.keyCode === 39) {
      currentTetromino.changeDirection(DIRECTION.RIGHT);
      if (!hittingTheWalls() && !checkForHorizontalCollision()) {
        eraseTetromino();
        currentTetromino.moveTetromino();
        drawTetromino();
      }
    } else if (key.keyCode === 83 || key.keyCode === 40) {
      moveTetrominoDown();
    } else if (key.keyCode === 69 || key.keyCode === 32) {
      rotateAndDrawTetromino(true);
    } else if (key.keyCode === 81 || key.keyCode === 16) {
      rotateAndDrawTetromino(false);
    }
  }
};

let moveTetrominoDown = () => {
  currentTetromino.changeDirection(DIRECTION.DOWN);
  if (!checkForVerticalCollision()) {
    eraseTetromino();
    currentTetromino.moveTetromino();
    drawTetromino();
  }
};

window.setInterval(() => {
  if (gameState !== "Game Over" && gameState !== "Paused") {
    moveTetrominoDown();
  }
}, 1000 / speed);

let hittingTheWalls = () => {
  for (let i = 0; i < currentTetromino.blockPositions.length; i++) {
    let newX = currentTetromino.blockPositions[i][0] + currentTetromino.startX;
    if (newX <= 0 && currentTetromino.direction === DIRECTION.LEFT) {
      return true;
    } else if (
      newX >= gBArrayWidth - 1 &&
      currentTetromino.direction === DIRECTION.RIGHT
    ) {
      return true;
    }
  }
  return false;
};

let checkForVerticalCollision = () => {
  let tetrominoCopy = currentTetromino;
  let collision = false;
  for (let i = 0; i < tetrominoCopy.blockPositions.length; i += 1) {
    let square = tetrominoCopy.blockPositions[i];
    let x = square[0] + tetrominoCopy.startX;
    let y = square[1] + tetrominoCopy.startY;
    if (currentTetromino.direction === DIRECTION.DOWN) {
      y += 1;
    }
    if (gameBoardArray[x][y + 1] === 1) {
      if (typeof stoppedShapeArray[x][y + 1] === "string") {
        eraseTetromino();
        currentTetromino.moveTetromino(DIRECTION.DOWN);
        drawTetromino();
        collision = true;
        break;
      }
    }
    if (y >= 20) {
      collision = true;
      break;
    }
  }

  if (collision) {
    if (currentTetromino.startY <= 2) {
      gameState = "Game Over";
      document.getElementById("pause-btn").disabled = true;
      gameOverScreen();
    } else {
      for (let i = 0; i < tetrominoCopy.blockPositions.length; i += 1) {
        let square = tetrominoCopy.blockPositions[i];
        let x = square[0] + tetrominoCopy.startX;
        let y = square[1] + tetrominoCopy.startY;
        stoppedShapeArray[x][y] = tetrominoCopy.color;
      }
      checkForCompletedRows();
      createNewTetromino();
      drawTetromino();
    }
  }
  return collision;
};

let checkForHorizontalCollision = () => {
  let tetrominoCopy = currentTetromino;
  let collision = false;
  for (let i = 0; i < tetrominoCopy.blockPositions.length; i += 1) {
    let square = tetrominoCopy.blockPositions[i];
    let x = square[0] + tetrominoCopy.startX;
    let y = square[1] + tetrominoCopy.startY;

    if (currentTetromino.direction === DIRECTION.LEFT) {
      x--;
    } else if (currentTetromino.direction === DIRECTION.RIGHT) {
      x++;
    }
    let stoppedShapeVal = stoppedShapeArray[x][y];
    if (typeof stoppedShapeVal === "string") {
      collision = true;
      break;
    }
  }
  return collision;
};

let checkForCompletedRows = () => {
  let rowsToDelete = 0;
  let startOfDeletion = 0;
  for (let y = 0; y < gBArrayHeight; y++) {
    let completed = true;
    for (let x = 0; x < gBArrayWidth; x++) {
      let square = stoppedShapeArray[x][y];
      if (square == 0 || typeof square === "undefined") {
        completed = false;
        break;
      }
    }
    if (completed) {
      if (startOfDeletion === 0) startOfDeletion = y;
      rowsToDelete++;
      for (let i = 0; i < gBArrayWidth; i++) {
        stoppedShapeArray[i][y] = 0;
        gameBoardArray[i][y] = 0;
        let coordX = coordinateArray[i][y].x;
        let coordY = coordinateArray[i][y].y;
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);
      }
    }
  }

  if (rowsToDelete > 0) {
    currentScore += 10 * rowsToDelete;
    showScore();
    if (currentScore >= maxScore) {
      let carryScore = maxScore - currentScore;
      createConfetti();
      level += 1;
      showLevel();
      speed = levelSpeed(level);
      maxScore = levelScore(level);
      currentScore = carryScore;
      showScore();
    }
    moveAllRowsDown(rowsToDelete, startOfDeletion);
  }
};

let moveAllRowsDown = (rowsToDelete, startOfDeletion) => {
  for (let i = startOfDeletion - 1; i >= 0; i--) {
    for (let x = 0; x < gBArrayWidth; x++) {
      let y2 = i + rowsToDelete;
      let square = stoppedShapeArray[x][i];
      let nextSquare = stoppedShapeArray[x][y2];
      if (typeof square === "string") {
        nextSquare = square;
        gameBoardArray[x][y2] = 1;
        stoppedShapeArray[x][y2] = square;
        let coordX = coordinateArray[x][y2].x;
        let coordY = coordinateArray[x][y2].y;
        canvasContext.fillStyle = nextSquare;
        canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);

        square = 0;
        gameBoardArray[x][i] = 0;
        stoppedShapeArray[x][i] = 0;
        coordX = coordinateArray[x][i].x;
        coordY = coordinateArray[x][i].y;
        canvasContext.fillStyle = "white";
        canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);
      }
    }
  }
};

let drawTetromino = () => {
  for (let i = 0; i < currentTetromino.blockPositions.length; i++) {
    let x = currentTetromino.blockPositions[i][0] + currentTetromino.startX;
    let y = currentTetromino.blockPositions[i][1] + currentTetromino.startY;
    gameBoardArray[x][y] = 1;
    let coordX = coordinateArray[x][y].x;
    let coordY = coordinateArray[x][y].y;
    canvasContext.fillStyle = currentTetromino.color;
    canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);
  }
};

let eraseTetromino = () => {
  for (let i = 0; i < currentTetromino.blockPositions.length; i++) {
    let x = currentTetromino.blockPositions[i][0] + currentTetromino.startX;
    let y = currentTetromino.blockPositions[i][1] + currentTetromino.startY;
    gameBoardArray[x][y] = 0;
    let coordX = coordinateArray[x][y].x;
    let coordY = coordinateArray[x][y].y;
    canvasContext.fillStyle = CANVAS_COLOR;
    canvasContext.fillRect(coordX, coordY, blockSize - 2, blockSize - 2);
  }
};

let createNewTetromino = () => {
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  let randomColor = Math.floor(Math.random() * COLORS.length);
  currentTetromino = new Tetromino(
    tetrominos[randomTetromino],
    initialStartX,
    initialStartY,
    COLORS[randomColor],
    DIRECTION.DOWN
  );
};

let checkForOverdrawnBlocks = () => {
  for (let i = 0; i < currentTetromino.blockPositions.length; i++) {
    let x = currentTetromino.blockPositions[i][0] + currentTetromino.startX;
    let y = currentTetromino.blockPositions[i][1] + currentTetromino.startY;
    if (typeof stoppedShapeArray[x][y] === "string") return true;
  }
  return false;
};

let rotateAndDrawTetromino = (clockwise = true) => {
  let currentTetrominoBU = _.cloneDeep(currentTetromino);
  eraseTetromino();
  currentTetromino.rotateTetromino(clockwise);
  try {
    if (checkForOverdrawnBlocks()) throw new Error("OVERDRAWING");
    drawTetromino();
  } catch (e) {
    if (e instanceof TypeError || e.message === "OVERDRAWING") {
      // Draw outside of gameboard or on the current blocks
      currentTetromino = currentTetrominoBU;
      eraseTetromino();
      drawTetromino();
    }
  }
};

let showScore = () => {
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(
    scoreRectPosition[0],
    scoreRectPosition[1],
    scoreRectSize[0],
    scoreRectSize[1]
  );
  canvasContext.fillStyle = "black";
  canvasContext.fillText(
    currentScore.toString() + " / " + maxScore.toString(),
    scoreTextPosition[0],
    scoreTextPosition[1]
  );
};

let showLevel = () => {
  canvasContext.fillStyle = "white";
  canvasContext.fillRect(
    levelRectPosition[0],
    levelRectPosition[1],
    levelRectSize[0],
    levelRectSize[1]
  );
  canvasContext.fillStyle = "black";
  canvasContext.fillText(
    level.toString(),
    levelTextPosition[0],
    levelTextPosition[1]
  );
};

let drawTetrisLogo = () => {
  canvasContext.drawImage(
    tetrisLogo,
    tetrisLogoPosition[0],
    tetrisLogoPosition[1],
    tetrisLogoSize[0],
    tetrisLogoSize[1]
  );
};

let gameOverScreen = () => {
  canvasContext.fillStyle = "rgba(220,220,220,0.9)";
  canvasContext.fillRect(
    gameBoardPositionTopLeft[0],
    gameBoardPositionTopLeft[1] - 2,
    gameBoardSize[0] - 2,
    gameBoardSize[1] - 2
  );
  canvasContext.fillStyle = "black";
  canvasContext.fillText(
    "GAME OVER",
    gameOverTextPosition[0],
    gameOverTextPosition[1]
  );
};

let createConfetti = () => {
  const jsConfetti = new JSConfetti({ confettiCanvas });
  jsConfetti.addConfetti();
};

let pauseGame = () => {
  if (gameState === "Playing") {
    document.getElementById("pause-btn").innerText = "Resume";
    gameState = "Paused";
  } else if (gameState === "Paused") {
    document.getElementById("pause-btn").innerText = "Pause";
    gameState = "Playing";
  }
};

let restartGame = () => {
  document.getElementById("pause-btn").disabled = false;
  gameBoardArray = [...Array(gBArrayWidth)].map((e) =>
    Array(gBArrayHeight).fill(0)
  );

  stoppedShapeArray = [...Array(gBArrayWidth)].map((e) =>
    Array(gBArrayHeight).fill(0)
  );

  level = 1;
  speed = levelSpeed(level);
  maxScore = levelScore(level);
  currentScore = 0;
  gameState = "Playing";
  setupCanvas();
};

document.addEventListener("DOMContentLoaded", setupCanvas);
