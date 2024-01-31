import {calcTargetPossible} from "../utils";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Bowman from "../characters/Bowman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";

const listForMove = [
  [Daemon, 26, 27, true],
  [Magician, 35, 59, false],
  [Swordsman, 55, 56, false],
  [Bowman, 0, 24, false],
  [Undead, 28, 55, true],
  [Vampire, 7, 5, true],
];

const handlerForPossibleMove = test.each(listForMove);
handlerForPossibleMove('Should return correct possible for moving', (TypeCharacter, from, to, expected) => {
  const boardSize = 8;
  const char = new TypeCharacter(1);
  expect(calcTargetPossible(from, to, char.maxStep, boardSize)).toBe(expected)
})

const listForAttack = [
  [Daemon, 26, 27, true],
  [Magician, 35, 59, true],
  [Swordsman, 55, 56, false],
  [Bowman, 0, 16, true],
  [Undead, 28, 55, false],
  [Vampire, 7, 5, true],
];

const handlerForPossibleAttack = test.each(listForAttack);
handlerForPossibleAttack('Should return correct possible for moving', (TypeCharacter, from, to, expected) => {
  const boardSize = 8;
  const char = new TypeCharacter(1);
  expect(calcTargetPossible(from, to, char.attackRange, boardSize)).toBe(expected)
})
