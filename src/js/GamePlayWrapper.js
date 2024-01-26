
export default class GamePlayWrapper {
  #gamePlay;
  #isActiveFn;
  #doMoveFn;

  constructor(gamePlay, isActiveFn, doMoveFn) {
    this.#gamePlay = gamePlay;
    this.#isActiveFn = isActiveFn;
    this.#doMoveFn = doMoveFn;
  }

  get boardSize() {
    return this.#gamePlay.boardSize;
  }

  get active() {
    return this.#isActiveFn();
  }

  addCellEnterListener(callback) {
    this.#gamePlay.addCellEnterListener((function(index) { if (this.active) { callback(index); } }).bind(this));
  }

  addCellLeaveListener(callback) {
    this.#gamePlay.addCellLeaveListener((function(index) { if (this.active) { callback(index); } }).bind(this));
  }

  addCellClickListener(callback) {
    this.#gamePlay.addCellClickListener((function(index) { if (this.active) { callback(index); } }).bind(this));
  }

  selectCell(index, color) {
    if (this.active) {
      this.#gamePlay.selectCell(index, color);
    }
  }

  deselectCell(index) {
    if(this.active) {
      this.#gamePlay.deselectCell(index);
    }
  }

  setCursor(cursor) {
    if(this.active) {
      this.#gamePlay.setCursor(cursor);
    }
  }

  makeMove(indexFrom, indexTo){
    if (this.active) {
      this.#doMoveFn(indexFrom, indexTo);
    }
  }

}
