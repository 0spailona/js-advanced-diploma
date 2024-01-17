import themes from "./themes";
import generateTeam from "./generators";
import {generatorRandomNumber} from "./generators";
import {CharacterType} from "./characters/CharacterType";
import cursors from "./cursors";
import selectedColors from "./selectedColors";
import {calcStepPossible} from "./utils";
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
    if(this.selectedCharacter){
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.selectedCharacter = undefined;
    }
    let character = this.allPositions.find(positionedCharacter => positionedCharacter.position === index);
    if (!character) {
      return
    }
    const positionCharacter = character.position;
    character = character.character;

    if (character.type === CharacterType.Daemon || character.type === CharacterType.Vampire || character.type === CharacterType.Undead) {
      GamePlay.showError('Это не ваш персонаж! Выберете другого персонажа.');
      return;
    }

    this.selectedCharacter = {character, position: positionCharacter};
    this.gamePlay.selectCell(index, selectedColors.playerCharacterSelected);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter

    let character = this.allPositions.find(positionedCharacter => positionedCharacter.position === index);
    if (!character) {
      if (!this.selectedCharacter) {
        return
      }

      if (calcStepPossible(this.selectedCharacter.position, index, this.selectedCharacter.character.maxStep, this.gamePlay.boardSize)) {
        this.cursor = cursors.pointer;
        this.gamePlay.setCursor(this.cursor);
        this.gamePlay.selectCell(index, selectedColors.cellForStep);
        this.selectedCellIndex = index;
        return;
      }
      return
    }

    character = character.character;
    const message = `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
    this.gamePlay.showCellTooltip(message, index)

    if (this.selectedCharacter) {
      if ((character.type === CharacterType.Swordsman ||
        character.type === CharacterType.Magician || character.type === CharacterType.Bowman)) {
        this.cursor = cursors.pointer;
        this.gamePlay.setCursor(this.cursor)
      }
    }

  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index)
    if (this.cursor === cursors.pointer) {
      this.cursor = cursors.auto;
      this.gamePlay.setCursor(this.cursor)
    }
    if (this.selectedCellIndex && this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index)
    }
  }
}
