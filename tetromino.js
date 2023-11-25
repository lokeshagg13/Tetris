class Tetromino {
  constructor(tetrominoShape, startX, startY, color, direction) {
    this.blockPositions = tetrominoShape.blockPositions;
    this.startX = startX;
    this.startY = startY;
    this.color = color;
    this.direction = direction;
    this.shape = tetrominoShape.name;
    this.lastSquareX = tetrominoShape.lastSquareX;
  }

  changeDirection(direction) {
    this.direction = direction;
  }

  moveTetromino() {
    if (this.direction === DIRECTION.LEFT) {
      this.startX -= 1;
    } else if (this.direction === DIRECTION.RIGHT) {
      this.startX += 1;
    } else if (this.direction === DIRECTION.DOWN) {
      this.startY += 1;
    }
  }

  rotateTetromino(clockwise = true) {
    let newRotation = [];
    for (let i = 0; i < this.blockPositions.length; i++) {
      let x = this.blockPositions[i][0];
      let y = this.blockPositions[i][1];
      let newX, newY;
      if (clockwise) {
        newX = this.lastSquareX - y;
        newY = x;
      } else {
        newX = y;
        newY = this.lastSquareX - x;
      }
      newRotation.push([newX, newY]);
    }
    this.blockPositions = _.cloneDeep(newRotation);
  }
}
