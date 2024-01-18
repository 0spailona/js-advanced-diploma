import Character from '../Character';
import {CharacterType} from "./CharacterType";

export default class Undead extends Character {
    constructor(level) {
        super(level, CharacterType.Undead);
    }
}
