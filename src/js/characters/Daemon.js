import Character from '../Character';
import {CharacterType} from "./CharacterType";

export default class Daemon extends Character {
    constructor(level) {
        super(level, CharacterType.Daemon);
    }
}
