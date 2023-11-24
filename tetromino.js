class Tetromino {
  constructor(startX, startY, blockPositions, color, direction) {
    this.startX = startX;
    this.startY = startY;
    this.blockPositions = blockPositions;
    this.color = color;
    this.direction = direction;
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
}
