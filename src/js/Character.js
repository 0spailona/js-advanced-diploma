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
  constructor(level, type) {
    if (!level) {
      throw new Error('Вы не можете создать персонажа без уровня')
    }

    this.level = level;
    this.health = 100;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"

    if (new.target.name === 'Character') {
      throw new Error('Вы не можете создать персонажа без типа')
    }
    switch (this.type) {
      case CharacterType.Bowman:
        this.attack = 25;
        this.defence = 25;
        this.maxStep = 2;
        this.attackRange = 2;

        break;
      case CharacterType.Swordsman:
        this.attack = 40;
        this.defence = 10;
        this.maxStep = 4;
        this.attackRange = 1;
        break;
      case CharacterType.Magician:
        this.attack = 10;
        this.defence = 40;
        this.maxStep = 1;
        this.attackRange = 4;
        break;
      case CharacterType.Daemon:
        this.attack = 10;
        this.defence = 10;
        this.maxStep = 1;
        this.attackRange = 4;
        break;
      case CharacterType.Vampire:
        this.attack = 25;
        this.defence = 25;
        this.maxStep = 2;
        this.attackRange = 2;
        break;
      case CharacterType.Undead:
        this.attack = 40;
        this.defence = 10;
        this.maxStep = 4;
        this.attackRange = 1;
        break;
      default:
        throw new Error(`Нет такого персонажа - ${this.type}`);
    }
    if (this.level > 1) {
      let n = 1;
      while (n < this.level) {
        n++
        this.levelUp()
      }
    }
  }

  levelUp() {
    this.attack = Math.max(this.attack, this.attack * (80 + this.health) / 100);
    this.defence = Math.max(this.defence, this.defence * (80 + this.health) / 100);
  }

  createSimpleObject() {
    return {type: this.type, level: this.level, health: this.health}
  }
}
