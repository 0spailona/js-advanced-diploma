export default class Player {
  constructor(type, gamePlay) {
    this.type = type;
    this.gamePlay = gamePlay;
  }

  move(playerTeam, enemyTeam) {
    this.cleanupSelection();
    this.computerTeam = playerTeam;
    this.enemyTeam = enemyTeam;
    this.allPositions = [...this.computerTeam, ...this.enemyTeam];
  }
  cleanupSelection() {
    if (this.selectedCharacterPosition) {
      this.gamePlay.deselectCell(this.selectedCharacterPosition);
      this.selectedCharacterPosition = null;
    }

    if (this.selectedCell != null) {
      this.gamePlay.deselectCell(this.selectedCell);
      this.selectedCell = null;
    }
    if (this.arrPossibleSteps) {
      this.arrPossibleSteps = []
    }
  }
}
