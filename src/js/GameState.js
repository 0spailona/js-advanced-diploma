import Character from "./Character";

export default class GameState {
  #state = {};

  static teamToArray(team) {
    console.log('team', team)
    let arr = [];
    for (const character of team) {
      //arr.push(Character.createSimpleObject(character.character.type, character.character.level, character.character.health, character.position));
    }
    return arr
  }

  static from(playerFirst, playerSecond, currentPlayer, gameLevel, maxPoints) {
    // TODO: create object
    console.log('playerFirst GAmeState', playerFirst)
    console.log('playerSecond GameState', playerSecond)
//if(!playerFirst || playerFirst.length)
    //const playerFirstOwnTeam = playerFirst.ownTeam.length === 0 ? undefined : GameState.teamToArray(playerFirst.ownTeam);
    //const playerSecondOwnTeam = !playerSecond ? undefined : GameState.teamToArray(playerSecond.ownTeam);
    return {
      gameSavingData: {
        playerFirst: !playerFirst ? undefined : {
          ownTeam: playerFirst.ownTeam.map(x => ({position: x.position, character: x.character.createSimpleObject()})),
          points: playerFirst.points
        },
        playerSecond:!playerSecond ? undefined : {
          ownTeam: playerSecond.ownTeam.map(x => ({position: x.position, character: x.character.createSimpleObject()})),
          points: playerSecond.points
        },
        currentPlayer: currentPlayer,
        gameLevel: gameLevel
      },
      globalData: {
        maxPoints: maxPoints
      }
    }

  }
}
