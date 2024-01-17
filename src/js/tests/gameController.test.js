import GameController from "../GameController";
//import GameStateService from './GameStateService';
import GamePlay from "../GamePlay";
//import {generatorRandomNumber} from "./generators";

//import Bowman from "./characters/Bowman";
//import Swordsman from "./characters/Swordsman";
//import Magician from "./characters/Magician";
//import Vampire from "./characters/Vampire";
//import Undead from "./characters/Undead";
//import Daemon from "./characters/Daemon";
//import PositionedCharacter from "./PositionedCharacter";

test('Tooltip should get correct data', () => {
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  //const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, null);
  gameCtrl.init();

  const character = gameCtrl.allPositions[0].character;
  const correct = `\u{1F396} ${character.level} \u{2694} ${character.attack} \u{1F6E1} ${character.defence} \u{2764} ${character.health}`
  const index = gameCtrl.allPositions[0].position;
  const tooltip = gamePlay.cells[index].title;
  gameCtrl.onCellEnter(index);
  expect(tooltip).toBe(correct)
})
