import Character from "../Character";
import Bowman from "../characters/Bowman";
import Magician from "../characters/Magician";
import Daemon from "../characters/Daemon";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";
import {CharacterType} from "../characters/CharacterType";


const listForCheckCreateObject = [
  [Daemon, CharacterType.Daemon],
  [Magician, CharacterType.Magician],
  [Swordsman, CharacterType.Swordsman],
  [Bowman, CharacterType.Bowman],
  [Undead, CharacterType.Undead],
  [Vampire, CharacterType.Vampire],
];

const handlerForCreateObject = test.each(listForCheckCreateObject);

handlerForCreateObject('Should return correct object from %s', (TypeCharacter, typeInString) => {
  const level = 1;
  const health = 100;
  const char = new TypeCharacter(level);
  const result = {type: typeInString, level: level, health: health}
  expect(char.createSimpleObject()).toEqual(result)
})

const newCharacterList = [
  [Daemon],
  [Magician],
  [Swordsman],
  [Bowman],
  [Undead],
  [Vampire],
];
const handlerForHealthTest = test.each(newCharacterList);

handlerForHealthTest('Should get correct health for new %s', (TypeCharacter) => {
  const char = new TypeCharacter(1);
  expect(char.health).toBe(100)
})

const listForAttack = [
  [Daemon, 10],
  [Magician, 10],
  [Swordsman, 40],
  [Bowman, 25],
  [Undead, 40],
  [Vampire, 25],
];

const handlerForAttackTest = test.each(listForAttack);

handlerForAttackTest('Should get correct attack for new %s', (TypeCharacter, expected) => {
  const char = new TypeCharacter(1);
  expect(char.attack).toBe(expected)
})


const listForDefence = [
  [Daemon, 10],
  [Magician, 40],
  [Swordsman, 10],
  [Bowman, 25],
  [Undead, 10],
  [Vampire, 25],
];

const handlerForDefenceTest = test.each(listForDefence);

handlerForDefenceTest('Should get correct defence for new %s', (TypeCharacter, expected) => {
  const char = new TypeCharacter(1);
  expect(char.defence).toBe(expected)
})

const listForHighLevel = [
  [Daemon, 10, 10, 2],
  [Magician, 10, 40, 3],
  [Swordsman, 40, 10, 2],
  [Bowman, 25, 25, 2],
  [Undead, 40, 10, 3],
  [Vampire, 25, 25, 4],
];

const handlerForHighLevelTest = test.each(listForHighLevel);

handlerForHighLevelTest('Should get correct data for new character with level > 1', (TypeCharacter, startAttack, startDefence, level) => {
  const health = 100;
  const char = new TypeCharacter(level);
  let n = 1;
  let newAttack = 0;
  let attack = startAttack;
  let newDefence = 0;
  let defence = startDefence;
  while (n < level) {
    n++;
    newAttack = Math.max(attack, attack * (80 + health) / 100);
    attack = newAttack;
    newDefence = Math.max(defence, defence * (80 + health) / 100);
    defence = newDefence;
  }

  const result = {newAttack,newDefence};
  expect({newAttack:char.attack, newDefence:char.defence}).toEqual(result)
})

test('Should be error, if new character has not level', () => {
  //const char =
  expect(() => new Character(1)).toThrow('Вы не можете создать персонажа без типа');
})

test('Should be error, if new character has not level', () => {
  expect(() => new Daemon()).toThrow('Вы не можете создать персонажа без уровня')
})

test('Should be error, if character type is unknown', () => {
  class Human extends Character {
    constructor(level) {
      super(level, 'human');
    }
  }

  expect(() => new Human(1)).toThrow('Нет такого персонажа - human')
})



