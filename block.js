class Block {
  constructor(x, y, width, height, index) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.index = index;
  }

  draw(color) {
    canvasContext.save();
    canvasContext.fillStyle = color;
    canvasContext.fillRect(this.x, this.y, this.width, this.height);
  }
}
