import {CharacterType} from "./characters/CharacterType";

/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type ) {
    if (!level){
      throw new Error('Вы не можете создать персонажа без уровня')
    }
    this.level = level;
    /*this.attack = 0;
    this.defence = 0;*/
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"

    if (new.target.name === 'Character'){
      throw new Error ('Вы не можете создать персонажа без типа')
    }
    switch (this.type) {
      case CharacterType.Bowman:
        this.attack = 25;
        this.defence = 25;
        this.maxStep = 2;

        break;
      case CharacterType.Swordsman:
        this.attack = 40;
        this.defence = 10;
        this.maxStep = 4;
        break;
      case CharacterType.Magician:
        this.attack = 10;
        this.defence = 40;
        this.maxStep = 1;
        break;
      case CharacterType.Daemon:
        this.attack = 10;
        this.defence = 10;
        this.maxStep = 1;
        break;
      case CharacterType.Vampire:
        this.attack = 25;
        this.defence = 25;
        this.maxStep = 2;
        break;
      case CharacterType.Undead:
        this.attack = 40;
        this.defence = 10;
        this.maxStep = 4;
        break;
    }
  }
}
