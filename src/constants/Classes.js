import { isUndefined } from 'lodash';
import {
  generateUniqueId,
  selectOutcomeWithProbabilities,
  getRandomValueInRange
} from '../utils/UtilFunctions';
import {
  randomizeSpeed,
  randomizeStrength,
  randomizeBoredomFood,
  randomizeBoredomMate,
  randomizeEnergyLostToChild,
  randomizeEnergyLostToCombat,
  randomizeFoodMatePreference,
  randomizeMatingAgreeableness,
  randomizeLikelihoodTurnRight,
  randomizeLikelihoodTurnLeft,
  randomizeTurnLikelihoods,
  randomizeAngleTurn,
  randomizeVariationAngleTurn,
  randomizeDirection,
} from '../utils/CreatureGeneRandomizers';

export class Timestamp {
  constructor(second, minute, hour, day, year) {
    this._second = second || 0;
    this._minute = minute || 0;
    this._hour = hour || 0;
    this._day = day || 0;
    this._year = year || 0;
  }

  get second() { return this._second; }
  get minute() { return this._minute; }
  get hour() { return this._hour; }
  get day() { return this._day; }
  get year() { return this._year; }

  get s() { return this.second; }
  get m() { return this.minute; }
  get h() { return this.hour; }
  get d() { return this.day; }
  get y() { return this.year; }

  get totalSeconds() {
    return this._second +
      this._minute * 60 +
      this._hour * 60 * 60 +
      this._day * 24 * 60 * 60 +
      this._year * 365 * 24 * 60 * 60;
  }

  get stringOut() {
    return `second:\t${this._second}\nminute:\t${this._minute}\nhour:\t${this._hour}\nday:\t${this._day}\nyear:\t${this._year}`;
  }

  // non-mutating
  incrementBySeconds(secondsToIncrement) {
    let newSecond = (this._second + secondsToIncrement) % 60;
    let carryover = Math.floor((this._second + secondsToIncrement) / 60);

    let newMinute = (this._minute + carryover) % 60;
    carryover = Math.floor((this._minute + carryover) / 60);

    let newHour = (this._hour + carryover) % 60;
    carryover = Math.floor((this._hour + carryover) / 60);

    let newDay = (this._day + carryover) % 60;
    carryover = Math.floor((this._day + carryover) / 60);

    let newYear = (this._year + carryover) % 60;
    carryover = Math.floor((this._year + carryover) / 60);

    return new Timestamp(
      newSecond,
      newMinute,
      newHour,
      newDay,
      newYear
    );
  }

  incBySec(secondsToIncrement) {
    return this.incrementBySeconds(secondsToIncrement);
  }
};

export class Position {
  constructor(x, y) {
    this._x = x || 0;
    this._y = y || 0;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
};

export class Food {
  constructor(id, position) {
    this._id = id || generateUniqueId();
    this._position = position;
  }

  get id() { return this._id; }
  get x() { return this._position.x; }
  get y() { return this._position.y; }
  get position() { return this._position; }
};

export class CreatureCombatResult {
  constructor(
    winnerId,
    winnerEnergyLoss,
    loserId,
    loserEnergyLoss
  ) {
    this.winnerId = winnerId;
    this.winnerEnergyLoss = winnerEnergyLoss;
    this.loserId = loserId;
    this.loserEnergyLoss = loserEnergyLoss;
  }

  get winnerId() { return this.winnerId; }
  get winnerEnergyLoss() { return this.winnerEnergyLoss; }
  get loserId() { return this.loserId; }
  get loserEnergyLoss() { return this.loserEnergyLoss; }
};

/* Till I change to a better way, paramObj contains any of the following:

{
  id,
  speed,
  strength,
  boredomFood,
  boredomMate,
  energyLostToChild,
  energyLostToCombat,
  foodMatePreference,
  matingAgreeableness,
  likelihoodTurnRight,
  likelihoodTurnLeft,
  angleTurn,
  variationAngleTurn,
  position,
  direction,
  energy,
}

And values not provided will be randomized */
export class Creature {
  constructor(paramObj) {
    /* --- Identifiers --- */
    this._id = isUndefined(paramObj.id) ? generateUniqueId() : paramObj.id;

    /* --- Genes --- */
    this._speed = isUndefined(paramObj.speed) ? randomizeSpeed() : paramObj.speed;
    this._strength = isUndefined(paramObj.strength) ? randomizeStrength() : paramObj.strength;
    this._boredomFood = isUndefined(paramObj.boredomFood) ? randomizeBoredomFood() : paramObj.boredomFood;
    this._boredomMate = isUndefined(paramObj.boredomMate) ? randomizeBoredomMate() : paramObj.boredomMate;
    this._energyLostToChild = isUndefined(paramObj.energyLostToChild) ? randomizeEnergyLostToChild() : paramObj.energyLostToChild;
    this._energyLostToCombat = isUndefined(paramObj.energyLostToCombat) ? randomizeEnergyLostToCombat() : paramObj.energyLostToCombat;
    this._foodMatePreference = isUndefined(paramObj.foodMatePreference) ? randomizeFoodMatePreference() : paramObj.foodMatePreference;
    this._matingAgreeableness = isUndefined(paramObj.matingAgreeableness) ? randomizeMatingAgreeableness() : paramObj.matingAgreeableness;

    // turning likelihoods are probabilities that must add up to <= 1
    if (isUndefined(paramObj.likelihoodTurnRight) || isUndefined(paramObj.likelihoodTurnLeft)) {
      if (isUndefined(paramObj.likelihoodTurnRight) && isUndefined(paramObj.likelihoodTurnLeft)) {
        const randomizedLikelihoods = randomizeTurnLikelihoods();
        this._likelihoodTurnRight = randomizedLikelihoods.right;
        this._likelihoodTurnLeft = randomizedLikelihoods.left;
      } else if (isUndefined(paramObj.likelihoodTurnRight)) {
        this._likelihoodTurnRight = randomizeLikelihoodTurnRight(paramObj.likelihoodTurnLeft);
        this._likelihoodTurnLeft = paramObj.likelihoodTurnLeft;
      } else if (isUndefined(paramObj.likelihoodTurnLeft)) {
        this._likelihoodTurnRight = paramObj.likelihoodTurnRight;
        this._likelihoodTurnLeft = randomizeLikelihoodTurnLeft(paramObj.likelihoodTurnRight);
      }
    } else {
      this._likelihoodTurnRight = paramObj.likelihoodTurnRight;
      this._likelihoodTurnLeft = paramObj.likelihoodTurnLeft;
    }
    this._angleTurn = isUndefined(paramObj.angleTurn) ? randomizeAngleTurn() : paramObj.angleTurn;
    this._variationAngleTurn = isUndefined(paramObj.variationAngleTurn) ? randomizeVariationAngleTurn() : paramObj.variationAngleTurn;

    /* --- Status --- */
    this._position = isUndefined(paramObj.position) ? new Position(0, 0) : paramObj.position;
    this._direction = isUndefined(paramObj.direction) ? randomizeDirection() : paramObj.directions; // an angle in radian
    this._energy = isUndefined(paramObj.energy) ? 0 : paramObj.energy;

    this._isSeekingMate = false;
    this._idOfMate = null;
    this._isSeekingFood = false;
    this._locationOfFood = null;
  }

  get position() { return this._position; }

  changePosition(position) {
    if (position.x === this._position.x && position.y === this._position.y) {
      return;
    }
    this._position = position;
  }

  changeEnergy(energy) {
    this._energy = energy;
  }

  nextPosition(creatures, foods, xmin, xmax, ymin, ymax) {
    if (this._isSeekingMate) {
      // TODO
      return this._position;
    }
    if (this._isSeekingFood) {
      // TODO
      return this._position;
    }

    const likelihoodSelector = {
      'left': this._likelihoodTurnLeft,
      'right': this._likelihoodTurnRight,
      'center': 1 - (this._likelihoodTurnLeft + this._likelihoodTurnRight),
    };

    const selectedDirection = selectOutcomeWithProbabilities(likelihoodSelector);
    const directionModifier = getRandomValueInRange(
      this._angleTurn - this._variationAngleTurn,
      this._angleTurn + this._variationAngleTurn
    );
    switch (selectedDirection) {
      case 'left':
        this._direction = this._direction + directionModifier;
        break;
      case 'right':
        this._direction = this._direction - directionModifier;
        break;
      default:
        break;
    }

    const xAdvance = this._speed * Math.cos(this._direction);
    const yAdvance = this._speed * Math.sin(this._direction);
    const newX = Math.min(Math.max(this._position.x + xAdvance, xmin), xmax);
    const newY = Math.min(Math.max(this._position.y + yAdvance, ymin), ymax);
    return new Position(newX, newY);
  }

  // Tie goes to the target creature, not the opponent
  performCombat(opponent) {
    if (this.strength >= opponent.strength) {
      return new CreatureCombatResult(
        this.id,
        Math.max(this.energy - this.energyLostToCombat, 0),
        opponent.id,
        opponent.energy
      );
    }

    return new CreatureCombatResult(
      opponent.id,
      Math.max(opponent.energy - opponent.energyLostToCombat, 0),
      this.id,
      this.energy
    );
  }

  produceChild(mate) {
    this.energy = this.energy - this.energyLostToChild;
    return new Creature(
      (this.speed + mate.speed) / 2,
      (this.strength + mate.strength) / 2,
      (this.boredomFood + mate.boredomFood) / 2,
      (this.boredomMate + mate.boredomMate) / 2,
      (this.energyLostToChild + mate.energyLostToChild) / 2,
      (this.energyLostToCombat + mate.energyLostToCombat) / 2,
      (this.foodMatePreference + mate.foodMatePreference) / 2,
      (this.matingAgreeableness + mate.matingAgreeableness) / 2,
      (this.likelihoodTurnRight + mate.likelihoodTurnRight) / 2,
      (this.likelihoodTurnLeft + mate.likelihoodTurnLeft) / 2,
      (this.angleTurn + mate.angleTurn) / 2,
      (this.variationAngleTurn + mate.variationAngleTurn) / 2
    );
  }
};
