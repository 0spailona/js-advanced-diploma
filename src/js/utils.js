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

export function calcStepPossible(indexChar,indexCell,maxStep,boardSize) {
  if(indexCell === indexChar){
    return false
  }
  //const boardSize = 5;
  // vertical
  const a = indexCell % boardSize;
  const b = indexChar % boardSize;
  if ((a === b) && (((indexCell - a) / boardSize - (indexChar - b) / boardSize) <= maxStep)) {
    return true
  }
  // horizontal
  const abc = Math.abs(indexCell - indexChar);
  // find leftBoard
  let c = indexChar;
  while (c % boardSize !== 0) {
    c--;
  }
  let d = indexCell;
  while (d % boardSize !== 0) {
    d--;
  }
  if (c === d) {
    return true
  }

  // diagonal
  function isDiagonal(indexMax, indexMin, difference) {
    let max = indexMax;
    while (max > indexMin) {
      max = max - difference;
    }
    return max === indexMin;
  }

  const maxIndex = Math.max(indexCell, indexChar);
  const minIndex = Math.min(indexCell, indexChar);

  if ((abc % (boardSize + 1) === 0) || (abc % (boardSize - 1) === 0)) {
    if (abc / (boardSize + 1) <= maxStep) {
      if (isDiagonal(maxIndex, minIndex, boardSize + 1)) {
        return true
      }
    }
    if (abc / (boardSize - 1) <= maxStep) {
      if (isDiagonal(maxIndex, minIndex, boardSize - 1)) {
        return true
      }
    }
  }
  return false
}
