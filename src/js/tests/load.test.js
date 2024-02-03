import GameStateService from "../GameStateService";
import {CharacterType} from "../characters/CharacterType";
import GameController from "../GameController";
import GamePlay from "../GamePlay";

jest.mock('../GameStateService');
jest.mock('../GamePlay');

beforeEach(() => {
  jest.resetAllMocks();
});
describe('null', () => {
  test('Action if load state == null', () => {
    const storage = null;
    const gameStateService = new GameStateService(storage);
    gameStateService.load.mockReturnValue(storage);
    const gamePlay = new GamePlay();
    const gameCtrl = new GameController(gamePlay, gameStateService);
    gameCtrl.init();
    gameCtrl.onLoadGameClick();
    expect(GamePlay.showMessage).toHaveBeenCalled();
  })

})

describe('no null', () => {
  const list = [
    [[{position: 3, character: {type: CharacterType.Magician, health: 10, level: 3}},
      {position: 2, character: {type: CharacterType.Swordsman, health: 40, level: 2}}],
      [{position: 27, character: {type: CharacterType.Daemon, health: 10, level: 2}}],
      0, 3, 0, 10, 'first'],

    [[{position: 7, character: {type: CharacterType.Swordsman, health: 40, level: 2}}],
      [{position: 18, character: {type: CharacterType.Undead, health: 40, level: 3}},
        {position: 48, character: {type: CharacterType.Vampire, health: 25, level: 4}}],
      3, 1, 3, 11, 'first'],

    [[{position: 34, character: {type: CharacterType.Bowman, health: 25, level: 2}}],
      [{position: 22, character: {type: CharacterType.Vampire, health: 25, level: 4}}],
      2, 1, 2, 2, 'first'],
  ];

  const handler = test.each(list)

  handler('Should use state', (ownTeamFirst, ownTeamSecond, playerFirstPoints, playerSecondPoints, gameLevel, maxPoints, current) => {
    const state = {
      gameSavingData: {
        playerFirst: {
          ownTeam: ownTeamFirst,
          points: playerFirstPoints
        },
        playerSecond: {
          ownTeam: ownTeamSecond,
          points: playerSecondPoints
        },
        currentPlayer: current,
        gameLevel: gameLevel
      },
      globalData: {
        maxPoints: maxPoints
      }
    }

    const gameStateService = new GameStateService(state);
    gameStateService.load.mockReturnValue(state);
    const gamePlay = new GamePlay();
    const gameCtrl = new GameController(gamePlay, gameStateService);
    gameCtrl.init();

    gameCtrl.onLoadGameClick();
    //console.log(gameCtrl.loadState())
    //console.log(state.gameSavingData.playerFirst.ownTeam);

    //expect(gameCtrl.startGame).toHaveBeenCalled();

    // expect(gameCtrl.loadGame).toHaveBeenCalled();

    expect(gameCtrl.playerFirst.ownTeam).toEqual(gameCtrl.createTeamFromLoad(state.gameSavingData.playerFirst.ownTeam));
    expect(gameCtrl.playerSecond.ownTeam).toEqual(gameCtrl.createTeamFromLoad(state.gameSavingData.playerSecond.ownTeam));
    expect(gameCtrl.playerFirst.points).toBe(state.gameSavingData.playerFirst.points);
    expect(gameCtrl.playerSecond.points).toBe(state.gameSavingData.playerSecond.points);
  })
})


