import {calcTileType} from "../utils";

const list = [
  [0, 'top-left', 8],
  [15, 'right', 8],
  [16, 'left', 8],
  [6, 'top-right', 7],
  [63, 'bottom-right', 8],
  [56, 'bottom-left', 8],
  [46, 'bottom', 7],
  [29, 'center', 8],
  [2, 'top', 4]
];
const handler = test.each(list);

handler('should return correct location for %i', (index, loc, boardSize) => {
  const result = calcTileType(index, boardSize);
  expect(result).toBe(loc)
})
