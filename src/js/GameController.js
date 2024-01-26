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
import generateTeam, {generatorRandomNumber} from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import ComputerPlayer from "./players/ComputerPlayer";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerFirst = {};
    this.playerSecond = {};
    this.currentPlayer = undefined;
    this.maxGameLevel = 2;
  }

  init() {
    if (this._initCalled) {
      throw new Error("Init should be called only once");
    }
    this._initCalled = true;
    //this.gameLevel = 1;
    this.startGame(1)
  }

  startGame(gameLevel) {
    // TODO: add event listeners to gamePlay events

    this.gameLevel = gameLevel;

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClickOnField.bind(this));
    this.gamePlay.addNewGameListener(this.onCellClickOnNewGame.bind(this));


    //this.gamePlay.addNewGameListener(this.onCellEnter.bind(this))
    //this.gamePlay.addNewGameListener(this.onCellClick.bind(this));


    // Draw empty field
    this.gamePlay.drawUi(themes[(gameLevel - 1) % themes.length]);

    // Possible type of characters for each team
    const possibleTypesFirstTeam = [Bowman, Swordsman, Magician];
    const possibleTypesSecondTeam = [Vampire, Undead, Daemon];
    this.possibleColumns = 2;

    this.characterCountInTeam = gameLevel + 1;
    this.maxLevel = gameLevel;

    const axisOffsetFirst = 0;
    const axisOffsetSecond = this.gamePlay.boardSize - this.possibleColumns;

    if (!this.currentPlayer) {
      const playerFirstGamePlay = new GamePlayWrapper(this.gamePlay, () => this.currentPlayer === this.playerFirst, this.doMove.bind(this));
      this.playerFirst = {player: new HumanPlayer(playerFirstGamePlay)};
      const playerSecondGamePlay = new GamePlayWrapper(this.gamePlay, () => this.currentPlayer === this.playerSecond, this.doMove.bind(this));
      this.playerSecond = {player: new HumanPlayer(playerSecondGamePlay)};
      this.currentPlayer = this.playerFirst;
    }

    this.playerFirst.ownTeam = this.initTeam(this.playerFirst.ownTeam, possibleTypesFirstTeam, axisOffsetFirst, this.playerFirst.enemyTeam);
    this.playerSecond.ownTeam = this.initTeam(this.playerSecond.ownTeam, possibleTypesSecondTeam, axisOffsetSecond, this.playerSecond.enemyTeam);

    this.playerFirst.enemyTeam = this.playerSecond.ownTeam;
    this.playerSecond.enemyTeam = this.playerFirst.ownTeam;


    // Draw teams in start positions
    this.redraw();
    this.currentPlayer.player.move(this.currentPlayer.ownTeam, this.currentPlayer.enemyTeam);
    console.log('current', this.currentPlayer)

    // TODO: load saved stated from stateService
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

  onCellClickOnNewGame(){
    console.log('new game')
    this.gameLevel = 1;
    this.currentPlayer = undefined;
    this.playerFirst = undefined;
    this.playerSecond = undefined;
    this.startGame(this.gameLevel)
  }
  onCellClickOnField(index) {
    // TODO: react to click
    if (!this.currentPlayer && index) {
      console.log('block')
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    let character = this.findCharacter(index);
    if (character) {
      // Show tooltip
      character = character.character
      const message = `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
      this.gamePlay.showCellTooltip(message, index)
    }
    if (index === null) {
      console.log(event.target)
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }


  /*computerActions() {
    // If attack is possible
    let indexForAttack = undefined;
    let arrForTarget = [];
    for (const selected of this.playerSecondTeam) {
      const charIndex = selected.position;
      for (const target of this.playerFirstTeam) {
        const cellIndex = target.position;
        if (calcTargetPossible(charIndex, cellIndex, selected.character.maxStep, this.gamePlay.boardSize)) {
          arrForTarget.push(cellIndex);
          this.selectedCharacter = selected;
          this.selectedCell = cellIndex;
          this.gamePlay.selectCell(this.selectedCell, selectedColors.targetForAttack)
        }
      }
    }
    if (arrForTarget.length > 0) {
      indexForAttack = arrForTarget.length > 2 ? arrForTarget[generatorRandomNumber(0, arrForTarget.length - 1)] : arrForTarget[0];
      const targetCharacter = this.playerFirstTeam.find(x => x.position === indexForAttack);
      this.countingDamage(indexForAttack, targetCharacter)
    }
  }*/

  levelUp() {
    for (let character of this.currentPlayer.ownTeam) {
      character = character.character
      character.attack = Math.max(character.attack, character.attack * (80 + character.health) / 100);
      character.health += 80;
      character.health = character.health <= 100 ? character.health : 100;
    }
    this.gameLevel++;
    if (this.gameLevel > this.maxGameLevel) {
      this.currentPlayer = undefined;
    } else {
      this.startGame(this.gameLevel)
    }


  }

  killCharacter(targetCharacter) {

    const charIndexEnemy = this.currentPlayer.enemyTeam.indexOf(targetCharacter)
    this.currentPlayer.enemyTeam.splice(charIndexEnemy, 1)

  }

  attackCharacter(indexFrom, indexTo) {
    const ownCharacter = this.currentPlayer.ownTeam.find(x => x.position === indexFrom);
    const targetCharacter = this.currentPlayer.enemyTeam.find(x => x.position === indexTo);
    const damage = Math.max(ownCharacter.character.attack - targetCharacter.character.defence, ownCharacter.character.attack * 0.1);

    this.gamePlay.deselectCell(indexTo);
    this.gamePlay.deselectCell(indexFrom);

    (async () => {
      await this.gamePlay.showDamage(indexTo, damage);
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
    const character = this.currentPlayer.ownTeam.find(x => x.position === indexFrom)

    if (!character) {
      return
    }

    if (!calcTargetPossible(indexFrom, indexTo, character.character.maxStep, this.gamePlay.boardSize)) {
      return;
    } else {
      if (!this.currentPlayer.enemyTeam.find(x => x.position === indexTo)) {
        //move character
        this.moveCharacter(indexFrom, indexTo)
      } else {
        // Attack
        this.attackCharacter(indexFrom, indexTo);

      }
    }

    setTimeout(this.afterMove.bind(this), 10);
  }

  afterMove() {
    if (this.currentPlayer.enemyTeam.length === 0 || this.currentPlayer.ownTeam.length === 0) {
      this.levelUp()
    } else {
      this.currentPlayer = this.currentPlayer === this.playerFirst ? this.playerSecond : this.playerFirst;
      this.currentPlayer.player.move(this.currentPlayer.ownTeam, this.currentPlayer.enemyTeam)
    }
  }
}

