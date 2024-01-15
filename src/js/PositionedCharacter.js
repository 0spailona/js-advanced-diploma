import Character from './Character';

export default class PositionedCharacter {
  constructor(character, position) {
    //console.log('PositionedCharacter', character);
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }
    //console.log('position', position)
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }
}
