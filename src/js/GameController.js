import themes from "./themes";
import generateTeam from "./generators";
import {generatorRandomNumber} from "./generators";
import {CharacterType} from "./characters/CharacterType";
import cursors from "./cursors";
import selectedColors from "./selectedColors";
import {calcTargetPossible} from "./utils";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.allPositions = [];
    this.teamPlayerPositions = [];
    this.teamComputerPositions = [];
  }

  init() {
    if (this._initCalled) {
      throw new Error("Init should be called only once");
    }

    this._initCalled = true;

    // TODO: add event listeners to gamePlay events

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.playerMotion = true;

    this.gamePlay.drawUi(themes.prairie);
    const characterCount = 2;
    const teamPlayer = generateTeam([Bowman, Swordsman, Magician], 2, characterCount);
    const teamComputer = generateTeam([Vampire, Undead, Daemon], 2, characterCount);

    let arrPositionsPlayer = [];
    let arrPositionsComputer = [];
    const boardSize = this.gamePlay.boardSize;
    for (let i = 0; i < boardSize ** 2; i++) {
      if (i % boardSize === 0) {
        arrPositionsPlayer.push(i);
        arrPositionsPlayer.push(i + 1);
      } else if ((i + 1) % boardSize === 0) {
        arrPositionsComputer.push(i);
        arrPositionsComputer.push(i - 1);
      }
    }

    function pushAllPositions(characterCount, arrPositions, team) {
      let randomPositions = new Set;
      let teamIdMember = 0;
      let positions = [];
      while (randomPositions.size !== characterCount) {
        const newPosition = arrPositions[generatorRandomNumber(0, arrPositions.length - 1)];
        if (!randomPositions.has(newPosition)) {
          randomPositions.add(newPosition);
          positions.push(new PositionedCharacter(team.members[teamIdMember], newPosition));
          teamIdMember++;
        }
      }
      return positions
    }

    let wrpPushAllPositions = pushAllPositions.bind(this);
    this.teamPlayerPositions = wrpPushAllPositions(characterCount, arrPositionsPlayer, teamPlayer);
    this.teamComputerPositions = wrpPushAllPositions(characterCount, arrPositionsComputer, teamComputer);
    this.allPositions = this.teamPlayerPositions.concat(this.teamComputerPositions);
    this.gamePlay.redrawPositions(this.allPositions);

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click

    let character = this.allPositions.find(positionedCharacter => positionedCharacter.position === index);
    if (!character) {
      // Moving character
      if (this.selectedCell && this.selectedCharacter) {
        this.movingCharacter(index)
      }
      return
    }

    // Deselect character after double click
    if (this.selectedCharacter?.position === index) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.selectedCharacter = undefined;
      return
    }
    // Select character after one click
    if (this.teamPlayerPositions.find(x => x.position === index)) {
      this.selectedCharacter = character;
      this.gamePlay.selectCell(index, selectedColors.playerCharacterSelected);
      return
    }

    // Attack
    const targetCharacter = this.teamComputerPositions.find(x => x.position === index);
    if (targetCharacter) {
      if (this.selectedCharacter && this.selectedCell === index){
        this.countingDamage(index, targetCharacter);
      }
      else {
        GamePlay.showError('Это не ваш персонаж! Выберете другого персонажа.');
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter

    let character = this.allPositions.find(x => x.position === index);
    if (!character) {

      // Select cell, if character can move to cell
      if (this.selectedCharacter) {
        this.showPossibleSteps(index, cursors.pointer, selectedColors.cellForStep)
      }
      return
    }

    // Show tooltip
    this.showInfo(character.character, index)

    // Select cell and change cursor, if character can attack
    if (this.selectedCharacter && this.teamComputerPositions.find(x => x.position === index)) {
      this.showPossibleSteps(index, cursors.crosshair, selectedColors.targetForAttack)
      return;
    }
    // Change cursor, if player can choose this character
    if (this.teamPlayerPositions.find(x => x.position === index)) {
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }
    // Change cursor, if player cannot choose or attack this character
    if (this.teamComputerPositions.find(x => x.position === index)) {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index)
    this.gamePlay.setCursor(cursors.auto)
    if (this.selectedCharacter?.position !== index) {
      this.selectedCell = undefined;
      this.gamePlay.deselectCell(index)
    }
  }

  showInfo(character, index) {
    const message = `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
    this.gamePlay.showCellTooltip(message, index)
  }

  showPossibleSteps(index, cursor, color) {
    if (calcTargetPossible(this.selectedCharacter.position, index, this.selectedCharacter.character.maxStep, this.gamePlay.boardSize)) {
      this.gamePlay.setCursor(cursor);
      this.gamePlay.selectCell(index, color);
      this.selectedCell = index;
    }
  }

  moveTransition() {
    this.selectedCharacter = undefined;
    this.selectedCell = undefined;
    this.gamePlay.redrawPositions(this.allPositions);
  }

  countingDamage(index, targetCharacter) {
      const damage = Math.max(this.selectedCharacter.character.attack - targetCharacter.character.defence, this.selectedCharacter.character.attack * 0.1);

      (async function () {
        this.gamePlay.deselectCell(this.selectedCell);
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        await this.gamePlay.showDamage(index, damage);
        targetCharacter.character.health = targetCharacter.character.health - damage;
        this.moveTransition()
      }).bind(this)()
  }

  movingCharacter(index) {
    this.gamePlay.deselectCell(this.selectedCharacter.position);
    this.gamePlay.deselectCell(this.selectedCell);
    let movingCharacter = this.allPositions.find(x => x.position === this.selectedCharacter.position);
    movingCharacter.position = index;
    this.moveTransition()
  }
}

