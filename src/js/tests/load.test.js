/*import GameStateService from "../GameStateService";
import {CharacterType} from "../characters/CharacterType";
import GameController from "../GameController";


//jest.mock(GameStateService);
//jest.mock(GamePlay)

beforeEach(() => {
  jest.resetAllMocks();
});

const list = [
  [[{type: CharacterType.Magician, health: 10, level: 3}, {type: CharacterType.Swordsman, health: 40, level: 2}],
    [{type: CharacterType.Daemon, health: 10, level: 2}], 0, 3, 0, 10, 'first'],
  [[{type: CharacterType.Swordsman, health: 40, level: 2}],
    [{type: CharacterType.Undead, health: 40, level: 3}, {
      type: CharacterType.Vampire,
      health: 25,
      level: 4
    }], 3, 1, 3, 11, 'second'],
  [[{type: CharacterType.Bowman, health: 25, level: 2}], [{
    type: CharacterType.Vampire,
    health: 25,
    level: 4
  }], 2, 1, 2, 2, 'first'],
];

const handler = test.each(list)

handler('Should use state', (ownTeamFirst, ownTeamSecond, playerFirstPoints, playerSecondPoints, gameLevel, maxPoints, current) => {



  const stateService = {
    load: () => {
      console.log("load called");
      return {
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
    },
  };



  const gameCtrl = new GameController(gamePlayMockInstance, new GameStateService());
  gameCtrl.init();
  gameCtrl.onLoadGameClick();
  const state = gameCtrl.stateService.load();
  expect(gameCtrl.startGame).toHaveBeenCalled();
  expect(gameCtrl.loadGame).toHaveBeenCalled();
  expect(gameCtrl.playerFirst.ownTeam).toEqual(gameCtrl.createTeamFromLoad(state.gameSavingData.playerFirst.ownTeam));
  expect(gameCtrl.playerSecond.ownTeam).toEqual(gameCtrl.createTeamFromLoad(state.gameSavingData.playerSecond.ownTeam));
  expect(gameCtrl.playerFirst.points).toBe(state.gameSavingData.playerFirst.points);
  expect(gameCtrl.playerSecond.points).toBe(state.gameSavingData.playerSecond.points);
})

/*test('Action if load state == null', () => {
  GameStateService.load.mock(null);
  GamePlay.mock.showMessage()
})*/
