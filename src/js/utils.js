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



function getCoordinates(index, boardSize) {
  const x = index % boardSize;
  const y = Math.trunc(index / boardSize);

  return {x, y}
}

function getCellIndex(row, col, boardSize) {
  return row * boardSize + col
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
