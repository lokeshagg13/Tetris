let swapBlocks = (blocks, i, j) => {
  let tempIndex = blocks[i].index;
  blocks[i].index = blocks[j].index;
  blocks[j].index = tempIndex;

  let tempY = blocks[i].y;
  blocks[i].y = blocks[j].y;
  blocks[j].y = tempY;

  let tempHeight = blocks[i].height;
  blocks[i].height = blocks[j].height;
  blocks[j].height = tempHeight;

  return blocks;
};

let copyBlocks = (blocks, i, j) => {
  // copy block at jth position at the ith position
  blocks[i].index = blocks[j].index;
  blocks[i].y = blocks[j].y;
  blocks[i].height = blocks[j].height;
  return blocks;
};

let bubbleSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;
  let swapped = false;
  for (let i = 0; i < numBlocks; i++) {
    swapped = false;
    for (let j = 0; j < numBlocks - 1; j++) {
      // Swap if the element found is greater than the next element
      if (blocks[j].index > blocks[j + 1].index) {
        blocks = swapBlocks(blocks, j, j + 1);
        swapped = true;
      }
      let newBlocks = _.cloneDeep(blocks);
      let newBlockSet = new BlockSet(
        numBlocks,
        newBlocks,
        blockWidth,
        blockUnitHeight,
        blockOffset
      );
      compareSequences.push([j, j + 1]);
      sortSequences.push(newBlockSet);
    }

    if (!swapped) break;
  }
  return { sortSequences, compareSequences };
};

let selectionSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;

  for (let i = 0; i < numBlocks - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < numBlocks; j++) {
      // Find the index of the minimum element in the unsorted part of the array
      if (blocks[j].index < blocks[minIndex].index) {
        minIndex = j;
      }

      let newBlocks = _.cloneDeep(blocks);
      let newBlockSet = new BlockSet(
        numBlocks,
        newBlocks,
        blockWidth,
        blockUnitHeight,
        blockOffset
      );
      sortSequences.push(newBlockSet);
      compareSequences.push([j, minIndex]);
    }

    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      blocks = swapBlocks(blocks, i, minIndex);
    }

    let newBlocks = _.cloneDeep(blocks);
    let newBlockSet = new BlockSet(
      numBlocks,
      newBlocks,
      blockWidth,
      blockUnitHeight,
      blockOffset
    );
    sortSequences.push(newBlockSet);
    compareSequences.push([i, minIndex]);
  }

  return { sortSequences, compareSequences };
};

let insertionSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;

  for (let i = 1; i < numBlocks; i++) {
    let keyIndex = blocks[i].index;
    let keyBlock = _.cloneDeep(blocks[i]);
    let j = i - 1;

    // Move elements greater than key to one position ahead of their current position
    while (j >= 0 && blocks[j].index > keyIndex) {
      blocks = copyBlocks(blocks, j + 1, j);

      let newBlocks = _.cloneDeep(blocks);
      let newBlockSet = new BlockSet(
        numBlocks,
        newBlocks,
        blockWidth,
        blockUnitHeight,
        blockOffset
      );
      compareSequences.push([j + 1, j]);
      sortSequences.push(newBlockSet);
      j--;
    }

    blocks[j + 1].index = keyBlock.index;
    blocks[j + 1].height = keyBlock.height;
    blocks[j + 1].y = keyBlock.y;

    let newBlocks = _.cloneDeep(blocks);
    let newBlockSet = new BlockSet(
      numBlocks,
      newBlocks,
      blockWidth,
      blockUnitHeight,
      blockOffset
    );
    compareSequences.push([j + 1, i]);
    sortSequences.push(newBlockSet);
  }

  return { sortSequences, compareSequences };
};

let mergeSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;

  // Function to merge two sorted arrays
  function merge(left, right) {
    let mergedArray = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].index < right[rightIndex].index) {
        mergedArray.push(left[leftIndex]);
        leftIndex++;
      } else {
        mergedArray.push(right[rightIndex]);
        rightIndex++;
      }
    }

    // Append the remaining elements from both arrays
    return mergedArray.concat(left.slice(leftIndex), right.slice(rightIndex));
  }

  // Iterative merge sort
  for (let size = 1; size < numBlocks; size *= 2) {
    for (let leftStart = 0; leftStart < numBlocks - 1; leftStart += 2 * size) {
      let leftEnd = Math.min(leftStart + size - 1, numBlocks - 1);
      let rightStart = leftEnd + 1;
      let rightEnd = Math.min(rightStart + size - 1, numBlocks - 1);

      let leftArray = blocks.slice(leftStart, leftEnd + 1);
      let rightArray = blocks.slice(rightStart, rightEnd + 1);

      let mergedArray = _.cloneDeep(merge(leftArray, rightArray));

      let compareSequence = [];
      // Update the original array with the merged values
      for (let i = 0; i < mergedArray.length; i++) {
        compareSequence.push(leftStart + i);
        blocks[leftStart + i].index = mergedArray[i].index;
        blocks[leftStart + i].y = mergedArray[i].y;
        blocks[leftStart + i].height = mergedArray[i].height;
      }

      let newBlocks = _.cloneDeep(blocks);
      let newBlockSet = new BlockSet(
        numBlocks,
        newBlocks,
        blockWidth,
        blockUnitHeight,
        blockOffset
      );
      sortSequences.push(newBlockSet);
      compareSequences.push(compareSequence);
    }
  }

  return { sortSequences, compareSequences };
};

let quickSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;

  // Function to partition the array and return the pivot index
  function partition(low, high) {
    let pivot = blocks[high].index;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (blocks[j].index <= pivot) {
        i++;
        // Swap blocks[i] and blocks[j]
        blocks = swapBlocks(blocks, i, j);

        let compareSequence = [i, j, high];
        compareSequences.push(compareSequence);
        let newBlocks = _.cloneDeep(blocks);
        let newBlockSet = new BlockSet(
          numBlocks,
          newBlocks,
          blockWidth,
          blockUnitHeight,
          blockOffset
        );
        sortSequences.push(newBlockSet);
      }
    }

    // Swap blocks[i+1] and blocks[high] (put the pivot in the correct position)
    blocks = swapBlocks(blocks, i + 1, high);
    let compareSequence = [i + 1, high, high];
    compareSequences.push(compareSequence);
    let newBlocks = _.cloneDeep(blocks);
    let newBlockSet = new BlockSet(
      numBlocks,
      newBlocks,
      blockWidth,
      blockUnitHeight,
      blockOffset
    );
    sortSequences.push(newBlockSet);

    return i + 1;
  }

  // Create an array to simulate the call stack for non-recursive quicksort
  let stack = [];
  stack.push(0);
  stack.push(numBlocks - 1);

  while (stack.length > 0) {
    let high = stack.pop();
    let low = stack.pop();

    if (low < high) {
      // Find pivot such that elements on the left are smaller and elements on the right are larger
      let pivotIndex = partition(low, high);

      // Push subarrays to the stack
      if (pivotIndex - 1 > low) {
        stack.push(low);
        stack.push(pivotIndex - 1);
      }

      if (pivotIndex + 1 < high) {
        stack.push(pivotIndex + 1);
        stack.push(high);
      }
    }
  }

  return { sortSequences, compareSequences };
};

let heapSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;

  // Function to perform heapify operation
  function heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    // Compare with left child
    if (left < n && blocks[left].index > blocks[largest].index) {
      largest = left;
    }

    // Compare with right child
    if (right < n && blocks[right].index > blocks[largest].index) {
      largest = right;
    }

    if (largest !== i) {
      // Swap blocks[i] and blocks[largest]
      blocks = swapBlocks(blocks, i, largest);

      let compareSequence = [i, largest];
      compareSequences.push(compareSequence);
      let newBlocks = _.cloneDeep(blocks);
      let newBlockSet = new BlockSet(
        numBlocks,
        newBlocks,
        blockWidth,
        blockUnitHeight,
        blockOffset
      );
      sortSequences.push(newBlockSet);

      // Recursively heapify the affected subtree
      heapify(n, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(numBlocks / 2) - 1; i >= 0; i--) {
    heapify(numBlocks, i);
  }

  // Extract elements from the heap
  for (let i = numBlocks - 1; i > 0; i--) {
    // Swap blocks[0] and blocks[i]
    blocks = swapBlocks(blocks, 0, i);

    let compareSequence = [0, i];
    compareSequences.push(compareSequence);
    let newBlocks = _.cloneDeep(blocks);
    let newBlockSet = new BlockSet(
      numBlocks,
      newBlocks,
      blockWidth,
      blockUnitHeight,
      blockOffset
    );
    sortSequences.push(newBlockSet);

    // Heapify the reduced heap
    heapify(i, 0);
  }

  return { sortSequences, compareSequences };
};

let shellSort = (blockSet) => {
  let sortSequences = [];
  let compareSequences = [];
  let { numBlocks, blocks, blockWidth, blockUnitHeight, blockOffset } =
    blockSet;

  // Start with a large gap and reduce it
  for (
    let gap = Math.floor(numBlocks / 2);
    gap > 0;
    gap = Math.floor(gap / 2)
  ) {
    // Perform insertion sort with the current gap
    for (let i = gap; i < numBlocks; i++) {
      let temp = _.cloneDeep(blocks[i]);
      let j = i;

      // Compare and move elements with the current gap
      while (j >= gap && blocks[j - gap].index > temp.index) {
        blocks = copyBlocks(blocks, j, j - gap);

        let newBlocks = _.cloneDeep(blocks);
        let newBlockSet = new BlockSet(
          numBlocks,
          newBlocks,
          blockWidth,
          blockUnitHeight,
          blockOffset
        );
        sortSequences.push(newBlockSet);
        compareSequences.push([j, j - gap]);
        j -= gap;
      }

      blocks[j].index = temp.index;
      blocks[j].y = temp.y;
      blocks[j].height = temp.height;
      let newBlocks = _.cloneDeep(blocks);
      let newBlockSet = new BlockSet(
        numBlocks,
        newBlocks,
        blockWidth,
        blockUnitHeight,
        blockOffset
      );
      sortSequences.push(newBlockSet);
      compareSequences.push([j, i]);
    }
  }

  return { sortSequences, compareSequences };
};
