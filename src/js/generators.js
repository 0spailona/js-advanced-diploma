import Team from "./Team";
import {CharacterType} from "./characters/CharacterType";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    let a = allowedTypes[generatorRandomNumber(0, allowedTypes.length)];
    let b = generatorRandomNumber(1, maxLevel + 1);
    yield new a(b);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = new Team;
  let counter = characterCount;

  for (let member of characterGenerator(allowedTypes, maxLevel)) {
    team.members.push(member);
    counter--;
    if (counter === 0) {
      break
    }
  }
  return team;
}

export function generatorRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function characterFactoryByType(type, health, level) {
  //console.log('type',type)
  let character;
  switch (type) {
    case CharacterType.Bowman:
      character = new Bowman(level);
      break;
    case CharacterType.Swordsman:
      character = new Swordsman(level);
      break;
    case CharacterType.Magician:
      character = new Magician(level);
      break;
    case CharacterType.Daemon:
      character = new Daemon(level);
      break;
    case CharacterType.Vampire:
      character = new Vampire(level);
      break;
    case CharacterType.Undead:
      character = new Undead(level);
      break;
    default:
      throw new Error(`Нет такого ${type} персонажа`)
  }
  character.health = health;
  return character;
}
