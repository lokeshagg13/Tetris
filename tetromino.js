class Tetromino {
  constructor(startX, startY, blockPositions, color, direction) {
    this.startX = startX;
    this.startY = startY;
    this.blockPositions = blockPositions;
    this.color = color;
    this.direction = direction;
  }

  moveTetromino(direction) {
    this.direction = direction;
    if (direction === DIRECTION.LEFT) {
      this.startX -= 1;
    } else if (direction === DIRECTION.RIGHT) {
      this.startX += 1;
    } else if (direction === DIRECTION.DOWN) {
      this.startY += 1;
    }
  }
}
