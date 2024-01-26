import playersTypes from "./PlayersTypes";
import Player from "../Player";

export default class ComputerPlayer extends Player{
  constructor() {
    super(playersTypes.computer)
  }
}
