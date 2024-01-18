import Character from '../Character';
import {CharacterType} from "./CharacterType";

export default class Bowman extends Character {
    constructor(level) {
        super(level, CharacterType.Bowman);
    }
}
