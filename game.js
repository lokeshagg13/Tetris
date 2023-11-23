const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

let createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const fps = 30;
let numBlocks = 0;
let blocks = [];

let createBlocks = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  numBlocks = parseInt(document.getElementById("numOfBlocks").value);
  if (numBlocks < 5) {
    document.getElementById("numOfBlocks").value = 5;
    numBlocks = 5;
  } else if (numBlocks > 100) {
    document.getElementById("numOfBlocks").value = 100;
    numBlocks = 100;
  }
  let blockOffset = 0;
  let blockWidth = canvasWidth / numBlocks - blockOffset;
  let blockUnitHeight = canvasHeight / numBlocks;
  blocks = new BlockSet(
    numBlocks,
    [],
    blockWidth,
    blockUnitHeight,
    blockOffset
  );
  blocks.createNewBlocks(canvasHeight, "white");
  blocks.drawBlocks();
};

let createColorArray = (
  numblocks,
  markedIndexArray,
  highlightPivot = false
) => {
  const colorArray = Array.from({ length: numblocks }, (_, index) => {
    return markedIndexArray.includes(index) ? "#FFBF00" : "yellow";
  });
  console.log(markedIndexArray.slice(-1)[0]);
  if (highlightPivot) colorArray[markedIndexArray.slice(-1)[0]] = "blue";
  return colorArray;
};

let getSelectedSortAlgorithm = () => {
  let radioButtons =
    document.getElementById("sortingForm").elements["sortingAlgorithm"];

  // Iterate through radio buttons to find the checked one
  let checkedRadioButton;
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      checkedRadioButton = radioButtons[i];
      break;
    }
  }

  return checkedRadioButton.value;
};

let sort = (event) => {
  event.preventDefault();
  blocks.printBlocks();

  let highlightPivot = false; // for quick sort, the last element of each
  // compare sequence would be a pivot index (marked blue)

  let sortAlgorithm = getSelectedSortAlgorithm();
  if (["quick", "heap"].includes(sortAlgorithm)) highlightPivot = true;

  let sortResult;

  switch (sortAlgorithm) {
    case "bubble":
      sortResult = bubbleSort(blocks);
      break;
    case "selection":
      sortResult = selectionSort(blocks);
      break;
    case "insertion":
      sortResult = insertionSort(blocks);
      break;
    case "merge":
      sortResult = mergeSort(blocks);
      break;
    case "quick":
      sortResult = quickSort(blocks);
      break;
    case "heap":
      sortResult = heapSort(blocks);
      break;
    case "shell":
      sortResult = shellSort(blocks);
      break;
    default:
      sortResult = bubbleSort(blocks);
  }

  let { sortSequences, compareSequences } = sortResult;

  console.log(sortSequences.length);
  console.log(compareSequences);
  let sortInterval = setInterval(() => {
    if (sortSequences.length > 0) {
      let nextBlockSet = sortSequences.shift();
      let nextCompareSet = compareSequences.shift();
      let colorArray = createColorArray(
        numBlocks,
        nextCompareSet,
        highlightPivot
      );
      nextBlockSet.printBlocks();
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      nextBlockSet.drawBlocks(colorArray);
    } else {
      clearInterval(sortInterval);
    }
  }, 10000 / sortSequences.length);

  // 120 for bubble
  // 200 for insertion
};
