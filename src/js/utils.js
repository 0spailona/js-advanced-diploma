/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const fieldLength = boardSize ** 2;

  if (index === 0) {
    return 'top-left';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index < boardSize - 1) {
    return 'top';
  }
  if (index === fieldLength - 1) {
    return 'bottom-right';
  }
  if (index === fieldLength - boardSize) {
    return 'bottom-left';
  }
  if (index > fieldLength - boardSize) {
    return 'bottom';
  }
  if (index % boardSize === 0) {
    return 'left';
  }
  if ((index + 1) % boardSize === 0) {
    return 'right';
  }
  return 'center'
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}


export function getCoordinates(index, boardSize) {
  const x = index % boardSize;
  const y = Math.trunc(index / boardSize);

  return {x, y}
}

export function getCellIndex(x, y, boardSize) {
  return y * boardSize + x;
}

export function calcTargetPossible(charIndex, cellIndex, maxRange, boardSize) {
  if (cellIndex === charIndex) {
    return false
  }
  const charCoordinates = getCoordinates(charIndex, boardSize);
  const cellCoordinates = getCoordinates(cellIndex, boardSize);

  const absX = Math.abs(charCoordinates.x - cellCoordinates.x);
  const absY = Math.abs(charCoordinates.y - cellCoordinates.y);
  // vertical
  if (charCoordinates.x === cellCoordinates.x && absY <= maxRange) {
    return true
  }
  // horizontal
  if (charCoordinates.y === cellCoordinates.y && absX <= maxRange) {
    return true
  }
  // diagonal
  return absX === absY && absY <= maxRange;
}

function pushStepsArr(arr, charCoordinates, boardSize, changesX, changesY, maxRange) {
  let x = charCoordinates.x + changesX;
  let y = charCoordinates.y + changesY;

  while (Math.abs(x - charCoordinates.x) <= maxRange &&
         Math.abs(y - charCoordinates.y) <= maxRange &&
         x >= 0 && x < boardSize && y >= 0 && y < boardSize) {

    const index = getCellIndex(x, y, boardSize);

    if (!arr.includes(index)) {
      arr.push(index)
    }
    x = x + changesX;
    y = y + changesY;
  }
  return arr
}

export function calcPossibleSteps(charIndex, maxRange, boardSize, arrImpossibleIndex) {
  let arr = [];

  const charCoordinates = getCoordinates(charIndex, boardSize);

  pushStepsArr(arr, charCoordinates, boardSize, 1, 0, maxRange);
  pushStepsArr(arr, charCoordinates, boardSize, -1, 0, maxRange);
  pushStepsArr(arr, charCoordinates, boardSize, 0, -1, maxRange);
  pushStepsArr(arr, charCoordinates, boardSize, 0, 1, maxRange);

  pushStepsArr(arr, charCoordinates, boardSize, 1, 1, maxRange);
  pushStepsArr(arr, charCoordinates, boardSize, -1, -1, maxRange);
  pushStepsArr(arr, charCoordinates, charCoordinates, boardSize, 1, -1, maxRange);
  pushStepsArr(arr, charCoordinates, boardSize, -1, 1, maxRange);


  arr = arr.filter(i => !arrImpossibleIndex.includes(i));

  return arr
}

export function getTooltipText(character){
  return `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
}






