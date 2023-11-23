const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let numBlocks = 0;
let blocks = [];
let sortInterval;

let enableAnimationMode = () => {
  let inputElements = [
    ...document.querySelectorAll(
      "input[type='radio'],input[type='submit'],select"
    ),
  ];
  inputElements.map((elem) => (elem.disabled = true));
};

let disableAnimationMode = () => {
  let inputElements = [
    ...document.querySelectorAll(
      "input[type='radio'],input[type='submit'],select"
    ),
  ];
  inputElements.map((elem) => (elem.disabled = false));
};

let resetHandler = () => {
  disableAnimationMode();
  if (sortInterval) clearInterval(sortInterval);
  createBlocks();
};

let createBlocks = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  numBlocks = parseInt(document.getElementById("numOfBlocks").value);
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

let getMillisecondsTime = (numBlocks, speed, sortAlgorithm, seqL) => {
  let mapping = {
    bubble: {
      s: [50000, 100000, 500000, 1000000, 5000000],
      m: [10000, 50000, 100000, 500000, 1000000],
      f: [5000, 10000, 1000, 1000, 1000],
    },
    selection: {
      s: [50000, 100000, 500000, 1000000, 5000000],
      m: [10000, 50000, 100000, 500000, 1000000],
      f: [5000, 10000, 1000, 1000, 1000],
    },
    insertion: {
      s: [50000, 100000, 500000, 1000000, 5000000],
      m: [10000, 50000, 100000, 500000, 1000000],
      f: [5000, 10000, 1000, 1000, 1000],
    },
    merge: {
      s: [25000, 25000, 25000, 25000, 25000],
      m: [10000, 10000, 10000, 10000, 10000],
      f: [5000, 5000, 5000, 5000, 5000],
    },
    quick: {
      s: [5000, 10000, 50000, 100000, 500000],
      m: [1000, 5000, 10000, 50000, 100000],
      f: [7500, 2500, 1000, 1000, 1000],
    },
    heap: {
      s: [50000, 100000, 500000, 1000000, 5000000],
      m: [10000, 50000, 100000, 500000, 1000000],
      f: [5000, 10000, 1000, 1000, 1000],
    },
    shell: {
      s: [50000, 100000, 500000, 1000000, 5000000],
      m: [10000, 50000, 100000, 500000, 1000000],
      f: [5000, 10000, 1000, 1000, 1000],
    },
  };
  let numBlocksIndex = [25, 50, 75, 100, 200].indexOf(numBlocks);
  let millisecondsTime = mapping[sortAlgorithm][speed][numBlocksIndex] / seqL;
  console.log(millisecondsTime);
  return millisecondsTime;
};

let toggleLoading = async (show = true) => {
  return new Promise((resolve) => {
    if (show) {
      document.getElementById("loading").style.display = "block";
    } else {
      document.getElementById("loading").style.display = "none";
    }
    // Assuming some delay for the loading state (adjust as needed)
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

let sort = async (event) => {
  event.preventDefault();
  enableAnimationMode();

  let highlightPivot = false; // for quick sort, the last element of each
  // compare sequence would be a pivot index (marked blue)

  let sortAlgorithm = getSelectedSortAlgorithm();
  if (["quick", "heap"].includes(sortAlgorithm)) highlightPivot = true;

  let speed = document.getElementById("speed").value;

  await toggleLoading(true);

  let sortResult;

  switch (sortAlgorithm) {
    case "bubble":
      sortResult = await bubbleSort(blocks);
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

  await toggleLoading(false);

  let millisecondsTime = getMillisecondsTime(
    numBlocks,
    speed,
    sortAlgorithm,
    sortSequences.length
  );
  sortInterval = setInterval(() => {
    if (sortSequences.length > 0) {
      let nextBlockSet = sortSequences.shift();
      let nextCompareSet = compareSequences.shift();
      let colorArray = createColorArray(
        numBlocks,
        nextCompareSet,
        highlightPivot
      );
      // nextBlockSet.printBlocks();
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      nextBlockSet.drawBlocks(colorArray);
    } else {
      clearInterval(sortInterval);
      // disableAnimationMode();
    }
  }, millisecondsTime);

  // 120 for bubble
  // 200 for insertion
};

createBlocks();
