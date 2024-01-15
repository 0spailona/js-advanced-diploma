import Character from "../Character";
import Bowman from "../characters/Bowman";
import Magician from "../characters/Magician";
import Daemon from "../characters/Daemon";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";


const newCharacterList = [
  [Daemon, 1],
  [Magician, 1],
  [Swordsman, 2],
  [Bowman, 3],
  [Undead, 3],
  [Vampire, 4],
];


const handlerForHealthTest = test.each(newCharacterList);

handlerForHealthTest('Should get correct health for new %s', (TypeCharacter, level) => {
  const char = new TypeCharacter(level);
  expect(char.health).toBe(50)
})

const listForAttack = [
  [Daemon, 1, 10],
  [Magician, 1, 10],
  [Swordsman, 2, 40],
  [Bowman, 3, 25],
  [Undead, 3, 40],
  [Vampire, 4, 25],
];

const handlerForAttackTest = test.each(listForAttack);

handlerForAttackTest('Should get correct health for new %s', (TypeCharacter, level, expected) => {
  const char = new TypeCharacter(level);
  expect(char.attack).toBe(expected)
})


const listForDefence = [
  [Daemon, 1, 10],
  [Magician, 1, 40],
  [Swordsman, 2, 10],
  [Bowman, 3, 25],
  [Undead, 3, 10],
  [Vampire, 4, 25],
];

const handlerForDefenceTest = test.each(listForDefence);

handlerForDefenceTest('Should get correct health for new %s', (TypeCharacter, level, expected) => {
  const char = new TypeCharacter(level);
  expect(char.defence).toBe(expected)
})

test('Should be error, if character type is unknown', () => {
  //const char =
  expect(() => new Character(1)).toThrow('Вы не можете создать персонажа без типа');
})

test('Should be error, if new character has not level', () => {
  expect(() => new Daemon()).toThrow('Вы не можете создать персонажа без уровня')
})
