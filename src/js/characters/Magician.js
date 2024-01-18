import Character from '../Character';
import {CharacterType} from "./CharacterType";

export default class Magician extends Character {
    constructor(level) {
        super(level, CharacterType.Magician);
    }
}
