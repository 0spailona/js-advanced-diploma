import playersTypes from "./PlayersTypes";
import Player from "../Player";
import {calcTargetPossible} from "../utils";
import selectedColors from "../selectedColors";
import {generatorRandomNumber} from "../generators";
import cursors from "../cursors";
import {calcPossibleSteps} from "../utils";

export default class ComputerPlayer extends Player {
  constructor(gamePlayerWrapper) {
    super(playersTypes.computer)

    this.gamePlay = gamePlayerWrapper;
  }

  move(playerTeam, enemyTeam) {
    this.cleanupSelection();
    this.computerTeam = playerTeam;
    this.enemyTeam = enemyTeam;
    this.allPositions = [...this.computerTeam, ...this.enemyTeam];
   // console.log('computer move')

    this.computerActions()
  }

  computerActions() {
    let from;
    let to;
    //Check is attack possible
    const arrCouplesForAttack = this.isAttack();

    if (arrCouplesForAttack.length > 0) {
      if (arrCouplesForAttack.length > 1) {
        const coupleForAttack = this.changeTarget(arrCouplesForAttack);
        from = coupleForAttack.charIndex;
        to = coupleForAttack.targetIndex;

      } else {
        from = arrCouplesForAttack[0].ownCharacter.position;
        to = arrCouplesForAttack[0].enemyCharacter.position;
      }
      // For beauty
      /* this.selectedCharacterPosition = from;
       this.selectedCell = to;
       this.gamePlay.selectCell(this.selectedCharacterPosition, selectedColors.playerCharacterSelected)
       this.gamePlay.selectCell(this.selectedCell, selectedColors.targetForAttack)
       //this.cleanupSelection()*/
      this.gamePlay.makeMove(from, to)
      return
    }

    // Check is under attack
    /*const arrCouplesForEscape = this.isUnderAttack();
    if (arrCouplesForEscape.length > 0) {
      if(arrCouplesForEscape.length > 1){
        console.log('need choose character')
      } else {
        from = arrCouplesForEscape[0].ownCharacter.position;
        to = ''
      }
      console.log('Escape', arrCouplesForEscape)
      return;
    }*/
    this.findPossibleStep();
    // Choose Step
    const character = this.arrPossibleSteps[generatorRandomNumber(0, this.arrPossibleSteps.length - 1)];
    from = character.ownCharacter.position;
    //console.log(character.possibleSteps)
    to = character.possibleSteps[generatorRandomNumber(0, character.possibleSteps.length - 1)];
    //console.log('makeMove', from, to)
    /*this.selectedCharacterPosition = from;
    this.selectedCell = to;
    this.gamePlay.selectCell(this.selectedCharacterPosition, selectedColors.playerCharacterSelected)
    this.gamePlay.selectCell(this.selectedCell, selectedColors.cellForStep)*/
    this.cleanupSelection()
    this.gamePlay.makeMove(from, to)
  }

  changeTarget(arrCouplesForAttack) {
    //console.log('need change target')
    let arrInfo = [];
    let maxDamage = 0;
    for (const coupleForAttack of arrCouplesForAttack) {
      const damage = Math.max(coupleForAttack.ownCharacter.character.character.attack - coupleForAttack.enemyCharacter.character.character.defence, coupleForAttack.ownCharacter.character.character.attack * 0.1)

      const info = {
        charIndex: coupleForAttack.ownCharacter.position,
        targetIndex: coupleForAttack.enemyCharacter.position,
        damage
      }
      const newHealthTarget = coupleForAttack.enemyCharacter.character.character.health - damage;
      if (newHealthTarget <= 0) {
        return info
      }
      arrInfo.push(info);
      maxDamage = maxDamage > damage ? maxDamage : damage;
    }
    arrInfo = arrInfo.filter(x => x.damage === maxDamage);
    return arrInfo[generatorRandomNumber(0, arrInfo.length - 1)]
  }

  isAttack() {
    let arrCouplesForAttack = [];
    for (const ownChar of this.computerTeam) {
      const ownCharIndex = ownChar.position;
      for (const enemyChar of this.enemyTeam) {
        const enemyCharIndex = enemyChar.position;
        if (calcTargetPossible(ownCharIndex, enemyCharIndex, ownChar.character.maxStep, this.gamePlay.boardSize)) {
          arrCouplesForAttack.push(this.createCouple(ownCharIndex, enemyCharIndex))
        }
      }
    }
    return arrCouplesForAttack
  }

  isUnderAttack() {
    let arrCharsUnderAttack = [];
    for (const enemyChar of this.enemyTeam) {
      const enemyCharIndex = enemyChar.position;
      for (const ownChar of this.computerTeam) {
        const onwCharIndex = ownChar.position;
        if (calcTargetPossible(enemyCharIndex, onwCharIndex, enemyCharIndex.character.maxStep, this.gamePlay.boardSize)) {
          arrCharsUnderAttack.push(this.createCouple())
        }
      }
    }
   // console.log('under attack', arrCharsUnderAttack)
    return arrCharsUnderAttack
  }

  isSafePositions(index) {
    let arrSafePositions = [];
    for (const enemyChar of this.enemyTeam) {
      const enemyCharIndex = enemyChar.position;
      if (!calcTargetPossible(enemyCharIndex, index, enemyChar.character.maxStep, this.gamePlay.boardSize)) {
        arrSafePositions.push(index)
      }
    }
    return arrSafePositions
  }


  findPossibleStep() {
    this.arrPossibleSteps = [];
    let arrOwnPositions = [];
    for (const ownChar of this.computerTeam) {
      arrOwnPositions.push(ownChar.position);
    }
    for (const owmChar of this.computerTeam) {
      const possibleSteps = calcPossibleSteps(owmChar.position, owmChar.character.maxStep, this.gamePlay.boardSize, arrOwnPositions);

      this.arrPossibleSteps.push({
        ownCharacter: owmChar,
        possibleSteps: possibleSteps
      })
     // console.log('possible', possibleSteps, owmChar.position)
    }
  }

  createCouple(ownCharIndex, enemyCharIndex) {
    return {
      ownCharacter: {
        character: this.computerTeam.find(x => x.position === ownCharIndex),
        position: ownCharIndex
      },
      enemyCharacter: {
        character: this.enemyTeam.find(x => x.position === enemyCharIndex),
        position: enemyCharIndex
      }
    }
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
