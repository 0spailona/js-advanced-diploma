import {characterGenerator} from "../generators";
import Bowman from "../characters/Bowman";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";
import Vampire from "../characters/Vampire";
import Undead from "../characters/Undead";
import Daemon from "../characters/Daemon";
import {CharacterType} from "../characters/CharacterType";

const listAllowedTypes = [
  [[CharacterType.Bowman, CharacterType.Swordsman, CharacterType.Magician], [Bowman, Swordsman, Magician], 2],
  [[CharacterType.Vampire, CharacterType.Undead, CharacterType.Daemon], [Vampire, Undead, Daemon], 3]
]
const handler = test.each(listAllowedTypes);
for (let n = 0; n <= 100; n++) {
  handler('Should generate n characters with types from %s', (allowedTypesString, allowedTypes, maxLevel) => {
    const character = characterGenerator(allowedTypes, maxLevel);
    const result = allowedTypesString.find(x => x === character.type);
    expect(character.type).toBe(result);
  })
}
