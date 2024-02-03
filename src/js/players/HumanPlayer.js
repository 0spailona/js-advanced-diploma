import playersTypes from "./PlayersTypes";
import Player from "../Player";
import selectedColors from "../selectedColors";
import GamePlay from "../GamePlay";
import cursors from "../cursors";
import {calcTargetPossible} from "../utils";

export default class HumanPlayer extends Player {
  constructor(gamePlayerWrapper) {
    super(playersTypes.human,gamePlayerWrapper)
    this.gamePlay = gamePlayerWrapper;
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.selectedCell = null;
  }

  move(playerTeam, enemyTeam) {
    this.cleanupSelection();
    this.playerTeam = playerTeam;
    this.enemyTeam = enemyTeam;
    this.allPositions = [...this.playerTeam, ...this.enemyTeam];
  }

  cleanupSelection() {
    if (this.selectedCharacter) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.selectedCharacter = null;
      this.gamePlay.setCursor(cursors.auto)
    }

    if (this.selectedCell != null) {
      this.gamePlay.deselectCell(this.selectedCell);
      this.selectedCell = null;
      this.gamePlay.setCursor(cursors.auto)
    }

  }

  onCellClick(index) {

    let character = this.allPositions.find(positionedCharacter => positionedCharacter.position === index);
    if (!character) {
      // Moving character
      if (this.selectedCell != null && this.selectedCharacter) {
        const from = this.selectedCharacter.position;
        const to = this.selectedCell;
        this.cleanupSelection();
        this.gamePlay.makeMove(from, to);
      }
      return
    }

    // Deselect character after double click
    if (this.selectedCharacter && this.selectedCharacter.position === index) {
      this.cleanupSelection();
      return
    }
    // Select character after one click. Change selectCharacter

    if (this.playerTeam.find(x => x.position === index)) {
      if (this.selectedCharacter) {
        this.gamePlay.deselectCell(this.selectedCharacter.position);
      }
      this.selectedCharacter = character;
      this.gamePlay.selectCell(index, selectedColors.playerCharacterSelected);
      return
    }

    // Attack and error trying to change enemy character without attack

    const targetCharacter = this.enemyTeam.find(x => x.position === index);
    if (targetCharacter) {
      if ((this.selectedCharacter && this.selectedCell === index) &&
        (calcTargetPossible(this.selectedCharacter.position, index, this.selectedCharacter.character.attackRange, this.gamePlay.boardSize))) {
        const from = this.selectedCharacter.position;
        const to = this.selectedCell;
        this.cleanupSelection();
        this.gamePlay.makeMove(from, to);
      } else {
        GamePlay.showError('Это не ваш персонаж! Выберете другого персонажа.');
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.setCursor(cursors.auto)
    if (!this.selectedCharacter || this.selectedCharacter.position !== index) {
      this.selectedCell = undefined;
      this.gamePlay.deselectCell(index)
    }
  }

  onCellEnter(index) {
    let character = this.allPositions.find(x => x.position === index);
    if (!character) {

      // Select cell, if character can move to cell
      if (this.selectedCharacter) {
        this.showPossibleSteps(index, cursors.pointer, selectedColors.cellForStep, this.selectedCharacter.character.maxStep)
      }
      return
    }
    // Select cell and change cursor, if character can attack
    if (this.selectedCharacter && this.enemyTeam.find(x => x.position === index)) {
      this.showPossibleSteps(index, cursors.crosshair, selectedColors.targetForAttack, this.selectedCharacter.character.attackRange)
      return;
    }
    // Change cursor, if player can choose this character
    if (this.playerTeam.find(x => x.position === index)) {
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }
    // Change cursor, if player cannot choose or attack this character
    if (this.enemyTeam.find(x => x.position === index)) {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  showPossibleSteps(index, cursor, color, maxDistance) {
    if (calcTargetPossible(this.selectedCharacter.position, index, maxDistance, this.gamePlay.boardSize)) {
      this.gamePlay.setCursor(cursor);
      this.gamePlay.selectCell(index, color);
      this.selectedCell = index;
    }
  }
}
