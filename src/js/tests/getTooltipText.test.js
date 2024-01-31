import {getTooltipText} from "../utils";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Bowman from "../characters/Bowman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";

const listCharacters = [
  [Daemon, 10, 10],
  [Magician, 10, 40],
  [Swordsman, 40, 10],
  [Bowman, 25, 25],
  [Undead, 40, 10],
  [Vampire, 25, 25],
]

const handler = test.each(listCharacters);

handler('Should return correct message', (TypeCharacter, attack, defence) => {
  const level = 1;
  const health = 100;
  const char = new TypeCharacter(level);

  const result = `\u{1F396} ${level} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`;
  const message = getTooltipText(char);
  expect(message).toBe(result)
})
