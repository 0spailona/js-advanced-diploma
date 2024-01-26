import Team from "./Team";

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
  while (true){
    let a = allowedTypes[generatorRandomNumber(0, allowedTypes.length)];
    let b = generatorRandomNumber(1,maxLevel + 1);
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
export default function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = new Team;
  let counter = characterCount;

  for (let member of characterGenerator(allowedTypes,maxLevel)){
    team.members.push(member);
    counter--;
    if(counter === 0){
      break
    }
  }
  return team;
}

export function generatorRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

