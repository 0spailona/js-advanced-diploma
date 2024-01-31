import themes from "./themes";
import {calcTargetPossible} from "./utils";
import GamePlayWrapper from "./GamePlayWrapper";
import playersTypes from "./players/PlayersTypes";
import HumanPlayer from "./players/HumanPlayer";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import {generateTeam, characterFactoryByType, generatorRandomNumber} from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import ComputerPlayer from "./players/ComputerPlayer";
import cursors from "./cursors";
import GameState from "./GameState";
import Team from "./Team";


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerFirst = {};
    this.playerSecond = {};
    this.currentPlayer = undefined;

  }

  init() {
    if (this._initCalled) {
      throw new Error("Init should be called only once");
    }
    this._initCalled = true;

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    this.gamePlay.addStartNewGameListener(this.onStartGameClick.bind(this));


    /*const playerFirstGamePlay = new GamePlayWrapper(this.gamePlay, () => this.currentPlayer === this.playerFirst, this.doMove.bind(this));
       this.playerFirst = {player: new HumanPlayer(playerFirstGamePlay), points: 0, nameTeam:'Герои'};
       console.log(this.playerFirst)
       const playerSecondGamePlay = new GamePlayWrapper(this.gamePlay, () => this.currentPlayer === this.playerSecond, this.doMove.bind(this));
       //this.playerSecond = {player: new HumanPlayer(playerSecondGamePlay), points: 0};
       this.playerSecond = {player: new ComputerPlayer(playerSecondGamePlay), points: 0, nameTeam:'Нежить'};*/
    this.initPlayers(null, null)
    this.initNewGame()
  }


  initNewGame() {

    this.currentPlayer = this.playerFirst;
    this.gamePlay.showActiveTeam(this.currentPlayer.nameTeam)
    //this.gameLevel = 1;
    this.maxGameLevel = 4;
    this.maxPoints = this.loadState()?.globalData.maxPoints || 0;
    //this.saveMaxPoints();
    //console.log(this.maxPoints)
    this.gamePlay.showHighScore(this.maxPoints)
    this.startGame(null, 1)
  }

  startGame(gameSavingData, gameLevel) {
    // TODO: add event listeners to gamePlay events
    if (!gameSavingData) {
      this.gameLevel = gameLevel;

      // Draw empty field
      this.gamePlay.drawUi(themes[(gameLevel - 1) % themes.length]);

      //this.gamePlay.showChoosePlayerType();

      // Possible type of characters for each team
      const possibleTypesFirstTeam = [Bowman, Swordsman, Magician];
      const possibleTypesSecondTeam = [Vampire, Undead, Daemon];
      this.possibleColumns = 2;

      this.characterCountInTeam = gameLevel + 1;
      this.maxLevel = gameLevel;

      const axisOffsetFirst = 0;
      const axisOffsetSecond = this.gamePlay.boardSize - this.possibleColumns;

      this.playerFirst.ownTeam = this.initTeam(this.playerFirst.ownTeam, possibleTypesFirstTeam, axisOffsetFirst, this.playerFirst.enemyTeam);
      this.playerSecond.ownTeam = this.initTeam(this.playerSecond.ownTeam, possibleTypesSecondTeam, axisOffsetSecond, this.playerSecond.enemyTeam);

      this.playerFirst.enemyTeam = this.playerSecond.ownTeam;
      this.playerSecond.enemyTeam = this.playerFirst.ownTeam;
    } else {
      console.log('state in start game', gameSavingData)
      this.loadGame(gameSavingData);
    }
    //console.log('first Owm',this.playerFirst.ownTeam);
    //console.log('second Own',this.playerSecond.ownTeam);
    // Draw teams in start positions
    this.redraw();
    //console.log('this current ownTeam', this.currentPlayer.ownTeam);
    //console.log('this current enemyTeam', this.currentPlayer.enemyTeam);
    //console.log('player', this.currentPlayer.player)
    this.currentPlayer.player.move(this.currentPlayer.ownTeam, this.currentPlayer.enemyTeam);
  }

  initPlayers(playerFirstType, playerSecondType) {
    const playerFirstGamePlay = new GamePlayWrapper(this.gamePlay, () => this.currentPlayer === this.playerFirst, this.doMove.bind(this));
    const playerSecondGamePlay = new GamePlayWrapper(this.gamePlay, () => this.currentPlayer === this.playerSecond, this.doMove.bind(this));
    if (!playerFirstType && !playerSecondType) {
      this.playerFirst = {player: new HumanPlayer(playerFirstGamePlay), points: 0, nameTeam: 'Герои'};
      this.playerSecond = {player: new ComputerPlayer(playerSecondGamePlay), points: 0, nameTeam: 'Нежить'};
      return
    }
    if (playerFirstType === 'human') {
      this.playerFirst = {player: new HumanPlayer(playerFirstGamePlay), points: 0, nameTeam: 'Герои'};
    } else {
      this.playerFirst = {player: new ComputerPlayer(playerFirstGamePlay), points: 0, nameTeam: 'Герои'};
    }

    if (playerSecondType === 'human') {
      this.playerSecond = {player: new HumanPlayer(playerSecondGamePlay), points: 0, nameTeam: 'Нежить'};
    } else {
      this.playerSecond = {player: new ComputerPlayer(playerSecondGamePlay), points: 0, nameTeam: 'Нежить'};
    }
  }

  initTeam(team, possibleTypes, axisOffset, enemyTeam) {
    team = team || [];
    enemyTeam = enemyTeam || [];
    const count = this.characterCountInTeam - team.length;
    const newMembers = generateTeam(possibleTypes, this.maxLevel, count).members;

    while (newMembers.length > 0) {
      let index = generatorRandomNumber(0, this.gamePlay.boardSize * this.possibleColumns - 1);
      index = Math.trunc(index / this.possibleColumns) * this.gamePlay.boardSize + index % this.possibleColumns + axisOffset;

      if (!team.find(x => x.position === index) && !enemyTeam.find(x => x.position === index)) {
        team.push(new PositionedCharacter(newMembers.shift(), index))
      }
    }
    return team;
  }


  redraw() {
    this.gamePlay.redrawPositions([...this.playerFirst.ownTeam, ...this.playerSecond.ownTeam]);
  }

  findCharacter(index) {
    return this.playerFirst.ownTeam.find(x => x.position === index) || this.playerSecond.ownTeam.find(x => x.position === index);
  }

  loadState() {
    let state;
    try {
      state = this.stateService.load();
    } catch (e) {
      console.log("Error loading state", e);
      state = null;
    }
    return state
  }

  saveMaxPoints() {
    let state = this.loadState();
    if (!state || !state.gameSavingData) {
      state = GameState.from(undefined, undefined, undefined, undefined, this.maxPoints);
      this.stateService.save(state);
      console.log('saveMaxPoints', this.maxPoints)
    } else {
      /*const newGameState = GameState.from(state.gameSavingData.playerFirst, state.gameSavingData.playerSecond,
        state.gameSavingData.currentPlayer, state.gameSavingData.gameLevel, this.maxPoints);
      this.stateService.save(newGameState)*/
      state.globalData.maxPoints = this.maxPoints;
      this.stateService.save(state)
    }
  }

  createTeamFromLoad(arr) {
    //console.log('arr from load',arr)
    return arr.map(x => new PositionedCharacter(characterFactoryByType(x.character.type, x.character.health, x.character.level), x.position))
    //return arr.map(x => ({character: characterFactoryByType(x.type, x.health, x.level), position: x.position}))
  }

  loadGame(gameSavingData) {
    this.gameLevel = gameSavingData.gameLevel;
    this.gamePlay.drawUi(themes[(this.gameLevel - 1) % themes.length]);

    this.playerFirst.ownTeam = this.createTeamFromLoad(gameSavingData.playerFirst.ownTeam);
    //console.log('gameSavingData loadGame', gameSavingData.playerFirst.ownTeam)
    //this.playerFirst.ownTeam.createTeamFromLoad(gameSavingData.playerFirst.ownTeam);
    //console.log('loadGame', this.playerFirst.ownTeam)
    this.playerSecond.ownTeam = this.createTeamFromLoad(gameSavingData.playerSecond.ownTeam);
    this.playerFirst.enemyTeam = this.playerSecond.ownTeam;
    this.playerSecond.enemyTeam = this.playerFirst.ownTeam;
    console.log('loadGame', this.playerFirst.ownTeam[0])
    this.currentPlayer = gameSavingData.currentPlayer === 'first' ? this.playerFirst : this.playerSecond;
    //console.log(this.currentPlayer)
  }

  onLoadGameClick() {
    let state;
    try {
      state = this.stateService.load();
    } catch (e) {
      state.gameSavingData = null;
    }
    //console.log('state', state)

    if (!state.gameSavingData) {
      alert('Нет ни одной сохраненной игры')
    } else {
      this.startGame(state.gameSavingData)
    }
  }

  onSaveGameClick() {
    //console.log(this.currentPlayer);
    console.log('player 1 OnSaveClick', this.playerFirst)
    const currentPlayer = this.currentPlayer === this.playerFirst ? 'first' : 'second';
    const gameState = GameState.from(this.playerFirst, this.playerSecond, currentPlayer, this.gameLevel, this.maxPoints);
    console.log('gameState', gameState)
    this.stateService.save(gameState)
  }

  onNewGameClick() {
    this.currentPlayer = undefined;
    this.gamePlay.showChoosePlayerType();
    //this.startGame(undefined, this.gameLevel)
  }

  onStartGameClick() {
    this.gameLevel = 1;
    this.playerFirst.ownTeam = undefined;
    this.playerSecond.ownTeam = undefined;
    this.playerSecond.points = 0;
    this.playerSecond.points = 0;
    console.log('onStartGameClick', this.playerFirst.player.type);
    const players = this.gamePlay.getPlayerType();
    console.log(players)
    if (this.playerFirst.player.type !== players.playerFirst || this.playerSecond.player.type !== players.playerSecond) {
      this.initPlayers(players.playerFirst, players.playerSecond)
    }

    this.initNewGame()
    //this.startGame(null, this.gameLevel)
  }

  onCellClick(index) {
    // TODO: react to click
    if (!this.currentPlayer && index) {
      return
    }
    if (this.currentPlayer.player.type === playersTypes.computer) {
      alert('Сейчас не ваш ход')
    }

  }

  gameOver(winnerTeam) {
    this.gamePlay.showGameOver(winnerTeam)
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (!this.currentPlayer) {
      return;
    }
    if (index && this.currentPlayer.player.type === playersTypes.computer) {
      return
    }
    let character = this.findCharacter(index);
    if (character) {
      // Show tooltip
      character = character.character
      const message = `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
      this.gamePlay.showCellTooltip(message, index)
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  levelUp() {
    for (let character of this.currentPlayer.ownTeam) {
      character = character.character
      character.attack = Math.max(character.attack, character.attack * (80 + character.health) / 100);
      character.health += 80;
      character.health = character.health <= 100 ? character.health : 100;
    }
    this.gameLevel++;
    if (this.gameLevel > this.maxGameLevel) {
      const winnerTeam = this.currentPlayer.nameTeam;
      console.log('gameOver', this.currentPlayer.nameTeam)
      this.currentPlayer = undefined;
      this.gameOver(winnerTeam);
    } else {
      this.startGame(null, this.gameLevel)
    }
  }

  killCharacter(targetCharacter) {
    const charIndexEnemy = this.currentPlayer.enemyTeam.indexOf(targetCharacter)
    this.currentPlayer.enemyTeam.splice(charIndexEnemy, 1);
    this.recalculationPoints()
  }

  recalculationPoints() {
    this.currentPlayer.points++;
    if (this.maxPoints < this.currentPlayer.points) {
      this.maxPoints = this.currentPlayer.points;
      this.saveMaxPoints()
    }
  }

  attackCharacter(indexFrom, indexTo) {
    const ownCharacter = this.currentPlayer.ownTeam.find(x => x.position === indexFrom);
    const targetCharacter = this.currentPlayer.enemyTeam.find(x => x.position === indexTo);
    const damage = Math.max(ownCharacter.character.attack - targetCharacter.character.defence, ownCharacter.character.attack * 0.1);

    this.gamePlay.deselectCell(indexTo);
    this.gamePlay.deselectCell(indexFrom);

    (async () => {
      await this.gamePlay.showDamage(indexTo, Math.round(damage));
      this.redraw();
    })();

    targetCharacter.character.health = targetCharacter.character.health - damage;
    if (targetCharacter.character.health <= 0) {
      this.killCharacter(targetCharacter);
    }
  }

  moveCharacter(indexFrom, indexTo) {
    let movingCharacter = this.currentPlayer.ownTeam.find(x => x.position === indexFrom);
    movingCharacter.position = indexTo;
    this.redraw();
  }

  doMove(indexFrom, indexTo) {
    // check player's move and do it
    //console.log('check')
    //console.log('gameController')
    const character = this.currentPlayer.ownTeam.find(x => x.position === indexFrom)
    //console.log(character)
//console.log()
    if (!character) {
      return
    }

    if (!calcTargetPossible(indexFrom, indexTo, character.character.maxStep, this.gamePlay.boardSize)) {
      //console.log('oops', indexTo, indexFrom)
      return;

    } else {
      if (!this.currentPlayer.enemyTeam.find(x => x.position === indexTo)) {
        //move character
        //console.log('gameController move', indexTo, indexFrom)
        this.moveCharacter(indexFrom, indexTo)
      } else {
        // Attack
        this.attackCharacter(indexFrom, indexTo);

      }
    }

    setTimeout(this.afterMove.bind(this), 100);
  }

  afterMove() {
    if (this.currentPlayer.enemyTeam.length === 0 || this.currentPlayer.ownTeam.length === 0) {
      if (this.playerFirst.player.type !== this.playerSecond.player.type && this.currentPlayer.player.type === playersTypes.computer) {
        const winnerTeam = this.currentPlayer.nameTeam;
        console.log('gameOver',this.currentPlayer.nameTeam)
        this.currentPlayer = undefined;
        this.gameOver(winnerTeam);
      } else {
        this.levelUp()
      }
    } else {
      this.currentPlayer = this.currentPlayer === this.playerFirst ? this.playerSecond : this.playerFirst;
      this.gamePlay.showActiveTeam(this.currentPlayer.nameTeam);
      this.currentPlayer.player.move(this.currentPlayer.ownTeam, this.currentPlayer.enemyTeam)
    }
  }
}

