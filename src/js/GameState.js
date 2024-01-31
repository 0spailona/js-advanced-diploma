
export default class GameState {
  static from(playerFirst, playerSecond, currentPlayer, gameLevel, maxPoints) {
    // TODO: create object
    return {
      gameSavingData: {
        playerFirst: !playerFirst ? undefined : {
          ownTeam: playerFirst.ownTeam.map(x => ({position: x.position, character: x.character.createSimpleObject()})),
          points: playerFirst.points
        },
        playerSecond: !playerSecond ? undefined : {
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
