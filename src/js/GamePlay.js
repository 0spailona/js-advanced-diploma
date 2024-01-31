import {calcHealthLevel, calcTileType} from './utils';
//import selectedColors from "./selectedColors";

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];

    this.startGameListener = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button class="btn" data-id="action-restart">New Game</button>
        <button class="btn" data-id="action-save">Save Game</button>
        <button class="btn" data-id="action-load">Load Game</button>
        
      </div>
      <div class="board-container">
        <div class="board" data-id="board" style="grid-template-columns: repeat(${this.boardSize}, 1fr);"></div>
      </div>
      
       <div class="info info-and-settings-wrp" style="width: calc(var(--cell-size) * ${this.boardSize});">
          <span class="info-and-settings current-player">Активная команда: ${this.activeTeam}</span>
          <span class="info-and-settings high-score">High score: ${this.highScore}</span>
       </div>
       
       <div class="settings-new-game info-and-settings-wrp" style="width: calc(var(--cell-size) * ${this.boardSize});">
          <div class=" info-and-settings  team team-humans">
             <label>
                Тип игрока команды людей
             </label>
             <select id="player-first">
               <option value="human" selected>Человек</option>
               <option value="computer">Компьютер</option>
             </select>
          </div>
          <div class="info-and-settings team team-undead"
            <label>
              Тип игрока команды нежити
            </label>
            <select id="player-second">
              <option value="computer" selected>Компьютер</option>
              <option value="human">Человек</option>
            </select>
          </div>
            <button data-id="start-game" class="info-and-settings  btn" style="width: 20%">Start game</button>
          </div>
          
          <div class="game-over info-and-settings-wrp" style="width: calc(var(--cell-size) * ${this.boardSize});">
            <span class="info-and-settings show-end">Game Over</span>
            <span class="info-and-settings winner-player"></span>
        </div>
     
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.startGameEl = this.container.querySelector('.settings-new-game');
    this.startGameBtnEl = this.container.querySelector('[data-id=start-game]');
    this.gameInfoEl = this.container.querySelector('.info');
    this.playerFirstEl = document.getElementById('player-first');
    this.playerSecondEl = document.getElementById('player-second');
    this.gameOverInfoEl = this.container.querySelector('.game-over');

    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));


    //this.highScoreEl = this.container.querySelector('.high-score');
    //console.log(this.highScoreEl.textContent)

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  addStartNewGameListener(callback) {
    this.startGameListener.push(callback)
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }

  onStartGameClick(event) {
    event.preventDefault();
    this.startGameListener.forEach(o => o.call(null));
  }

  static showError(message) {
    console.log('alert', message)
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color) {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter(o => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(cell.querySelector('span.damage'));
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  showHighScore(maxPoints) {
    this.highScore = maxPoints;
  }

  showActiveTeam(string) {
    this.activeTeam = string;
  }

  showChoosePlayerType() {
    this.startGameEl.style.display = 'flex';
    this.gameOverInfoEl.style.display = 'none';
    this.gameInfoEl.style.display = 'none';
    this.startGameBtnEl.addEventListener('click', event => this.onStartGameClick(event));
  }

  getPlayerType() {
    return {playerFirst: this.playerFirstEl.value, playerSecond: this.playerSecondEl.value}
  }

  showGameOver(string) {
    console.log(string)
    this.gameInfoEl.style.display = 'none';
    this.gameOverInfoEl.style.display = 'flex';
    this.gameOverInfoEl.querySelector('.winner-player').innerText = `Победила команда: ${string}`

  }
}
