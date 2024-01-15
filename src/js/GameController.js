import themes from "./themes";
import generateTeam from "./generators";
import {generatorRandomNumber} from "./generators";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import PositionedCharacter from "./PositionedCharacter";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;

    this.allPositions = []
  }

  init() {
    this._initCalled && throw new Error("Init should be called only once");
    this._initCalled = true;

    // TODO: add event listeners to gamePlay events

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));


    this.gamePlay.drawUi(themes.prairie);
    const characterCount = 2;
    const teamA = generateTeam([Bowman, Swordsman, Magician], 2, characterCount);
    const teamB = generateTeam([Vampire, Undead, Daemon], 2, characterCount);

    let arrPositionsA = [];
    let arrPositionsB = [];
    const boardSize = this.gamePlay.boardSize;
    for (let i = 0; i < boardSize ** 2; i++) {
      if (i % boardSize === 0) {
        arrPositionsA.push(i);
        arrPositionsA.push(i + 1);
      } else if ((i + 1) % boardSize === 0) {
        arrPositionsB.push(i);
        arrPositionsB.push(i - 1);
      }
    }

    //let allPositions = [];

    let randomPositionsA = new Set;
    let teamAIdMember = 0;
    while (randomPositionsA.size !== characterCount) {
      const newPosition = arrPositionsA[generatorRandomNumber(0, arrPositionsA.length - 1)];
      if (!randomPositionsA.has(newPosition)) {
        randomPositionsA.add(newPosition);
        this.allPositions.push(new PositionedCharacter(teamA.members[teamAIdMember], newPosition));
        teamAIdMember++;
      }
      //randomPositionsA.add(arrPositionsA[generatorRandomNumber(0, arrPositionsA.length - 1)]);
    }

    let randomPositionsB = new Set;
    let teamBIdMember = 0;
    while (randomPositionsB.size !== characterCount) {
      const newPosition = arrPositionsB[generatorRandomNumber(0, arrPositionsB.length - 1)];
      if (!randomPositionsB.has(newPosition)) {
        randomPositionsB.add(newPosition);
        this.allPositions.push(new PositionedCharacter(teamB.members[teamBIdMember], newPosition));
        teamBIdMember++;
      }
    }
    this.gamePlay.redrawPositions(this.allPositions);

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.allPositions.includes(index)) {

    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    let character = this.allPositions.find(positionedCharacter => positionedCharacter.position === index);
    if (!character) {
      return
    }
    character = character.character;
    const message = `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
    this.gamePlay.showCellTooltip(message, index)
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
