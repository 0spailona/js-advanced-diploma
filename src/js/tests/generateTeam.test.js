import {generateTeam} from "../generators";
import Bowman from "../characters/Bowman";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";
import Vampire from "../characters/Vampire";
import Undead from "../characters/Undead";
import Daemon from "../characters/Daemon";

const dataForTests = [
  [[Bowman, Swordsman, Magician], 4, 2],
  [[Vampire, Undead, Daemon], 3, 3]
]

const handlerForCheckCount = test.each(dataForTests);

handlerForCheckCount('Should generate team with correct count of members', (allowedTypes, maxLevel, characterCount) => {
  const team = generateTeam(allowedTypes, maxLevel, characterCount);
  expect(team.members.length).toBe(characterCount);
})

const handlerForCheckLevel = test.each(dataForTests);

handlerForCheckLevel('Should generate team with members.level <= maxLevel', (allowedTypes, maxLevel, characterCount) => {
  const team = generateTeam(allowedTypes, maxLevel, characterCount);
  for (const member of team.members) {
    expect(member.level <= maxLevel).toBe(true);
  }
})
