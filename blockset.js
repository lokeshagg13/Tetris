class BlockSet {
  static generateRandomPermutation(N) {
    const permutation = Array.from({ length: N }, (_, index) => index + 1);
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at indices i and j
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    return permutation;
  }

  constructor(
    numBlocks = 0,
    blocks = undefined,
    blockWidth = 20,
    blockUnitHeight = 20,
    blockOffset = 0
  ) {
    this.numBlocks = numBlocks;
    this.blockWidth = blockWidth;
    this.blockUnitHeight = blockUnitHeight;
    this.blockOffset = blockOffset;
    this.blocks = [];

    if (blocks) {
      this.blocks = blocks;
    }
  }

  createNewBlocks(canvasHeight = 500) {
    let randomPerm = BlockSet.generateRandomPermutation(this.numBlocks);
    for (let i = 0; i < this.numBlocks; i += 1) {
      let index = randomPerm[i];
      let block = new Block(
        i * this.blockWidth + this.blockOffset,
        canvasHeight - index * this.blockUnitHeight,
        this.blockWidth,
        index * this.blockUnitHeight,
        index
      );
      this.blocks.push(block);
    }
  }

  drawBlocks(blockColors = []) {
    for (let i = 0; i < numBlocks; i += 1) {
      let blockColor;
      if (blockColors.length === 0 || blockColors.length < this.numBlocks) {
        blockColor = "white";
      } else blockColor = blockColors[i];

      this.blocks[i].draw(blockColor);
    }
  }

  printBlocks() {
    let blockStr = [];
    for (let i = 0; i < numBlocks; i += 1) {
      blockStr.push("" + this.blocks[i].index);
    }
    console.log(blockStr.join(", "));
  }
}
