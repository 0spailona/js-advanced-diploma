import Character from '../Character';
import {CharacterType} from "./CharacterType";

export default class Vampire extends Character {
    constructor(level) {
        super(level, CharacterType.Vampire);
    }
}
