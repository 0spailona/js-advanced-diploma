import Character from '../Character';
import {CharacterType} from "./CharacterType";

export default class Swordsman extends Character {
    constructor(level) {
        super(level, CharacterType.Swordsman);
    }
}
