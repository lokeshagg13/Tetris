class TetrominoShape {
  constructor(name) {
    this.name = name;
    this.blockPositions = this.getDefaultBlockPositions();
    this.lastSquareX = this.getLastSquareX();
  }

  getDefaultBlockPositions() {
    switch (this.name) {
      case "T":
        return [
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ];
      case "I":
        return [
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
        ];
      case "J":
        return [
          [0, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ];
      case "SQ":
        return [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ];
      case "L":
        return [
          [2, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ];
      case "S":
        return [
          [1, 0],
          [2, 0],
          [0, 1],
          [1, 1],
        ];
      case "Z":
        return [
          [0, 0],
          [1, 0],
          [1, 1],
          [2, 1],
        ];
    }
  }

  getLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < this.blockPositions.length; i++) {
      let square = this.blockPositions[i];
      if (square[0] > lastX) lastX = square[0];
    }
    return lastX;
  }
}

let tetrominos = [];
let shapeNames = ["T", "I", "J", "SQ", "L", "S", "Z"];
// let shapeNames = ["T", "I"] // test
for (let i = 0; i < shapeNames.length; i++) {
  tetrominos.push(new TetrominoShape(shapeNames[i]));
}
