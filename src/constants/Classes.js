import { isUndefined, isEmpty } from 'lodash';
import {
  generateUniqueId,
  selectOutcomeWithProbabilities,
  getRandomValueInRange,
  arctan,
  getNewPosition,
  doesOccurWithProbability,
  getFoodsInProximity,
  getCreaturesInProximity
} from '../utils/UtilFunctions';
import {
  randomizeSpeed,
  randomizeStrength,
  randomizeBoredomFood,
  randomizeBoredomMate,
  randomizeEnergyLostToChild,
  randomizeEnergyLostToCombat,
  randomizeLikelihoodPursueFood,
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

  distanceTo(position2) {
    const dx = Math.abs(position2.x - this._x);
    const dy = Math.abs(position2.y - this._y);
    return Math.sqrt(dx * dx + dy * dy);
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
  likelihoodPursueFood,
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
    this._likelihoodPursueFood = isUndefined(paramObj.likelihoodPursueFood) ? randomizeLikelihoodPursueFood() : paramObj.likelihoodPursueFood;
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
    this._idOfFood = null;
    this._locationOfFood = null;
  }

  get position() { return this._position; }

  get genes() {
    return {
      'id': {
        displayName: 'Id',
        value: this._id,
      },
      'speed': {
        displayName: 'Speed',
        value: this._speed,
      },
      'strength': {
        displayName: 'Strength',
        value: this._strength,
      },
      'boredomFood': {
        displayName: 'Boredom food',
        value: this._boredomFood,
      },
      'boredomMate': {
        displayName: 'Boredom mate',
        value: this._boredomMate,
      },
      'energyLostToChild': {
        displayName: 'Energy lost to child',
        value: this._energyLostToChild,
      },
      'energyLostToCombat': {
        displayName: 'Energy lost to combat',
        value: this._energyLostToCombat,
      },
      'likelihoodPursueFood': {
        displayName: 'Likelihood pursue food',
        value: this._likelihoodPursueFood,
      },
      'matingAgreeableness': {
        displayName: 'Mating agreeableness',
        value: this._matingAgreeableness,
      },
      'likelihoodTurnRight': {
        displayName: 'Likelihood turn right',
        value: this._likelihoodTurnRight,
      },
      'likelihoodTurnLeft': {
        displayName: 'Likelihood turn left',
        value: this._likelihoodTurnLeft,
      },
      'angleTurn': {
        displayName: 'Angle turn',
        value: this._angleTurn,
      },
      'variationAngleTurn': {
        displayName: 'Variation angle turn',
        value: this._variationAngleTurn,
      },
    };
  }

  get status() {
    return {
      'positionX': {
        displayName: 'Position X',
        value: this._position.x,
      },
      'positionY': {
        displayName: 'Position Y',
        value: this._position.y,
      },
      'direction': {
        displayName: 'Direction',
        value: this._direction,
      },
      'energy': {
        displayName: 'Energy',
        value: this._energy,
      },
      'isSeekingMate': {
        displayName: 'Is seeking mate',
        value: this._isSeekingMate,
      },
      'idOfMate': {
        displayName: 'Id of mate',
        value: this._idOfMate,
      },
      'isSeekingFood': {
        displayName: 'Is seeking food',
        value: this._isSeekingFood,
      },
      'idOfFood': {
        displayName: 'Id of food',
        value: this._idOfFood,
      },
      'locationOfFood': {
        displayName: 'Location of food',
        value: this._locationOfFood,
      },
    };
  }

  changePosition(position) {
    if (position.x === this._position.x && position.y === this._position.y) {
      return;
    }
    this._position = position;
  }

  changeEnergy(energy) {
    this._energy = energy;
  }

  // Computes and returns the next position of the creature given other creatures,
  // food, and boundaries for movement. Computes based off current creature state
  // (i.e. does NOT perform proximity check). Does NOT mutate the creature object
  // in case the caller wishes to perform additional sanity checks on the movement.
  nextPosition(creatures, foods, xmin, xmax, ymin, ymax) {
    /* ------------------ */
    /* Mate Pursuit       */
    /* ------------------ */
    if (this._isSeekingMate) {
      // TODO
      return this._position;
    }

    /* ------------------ */
    /* Combat Pursuit     */
    /* ------------------ */
    if (this._isSeekingMate) {
      // TODO
      return this._position;
    }

    /* ------------------ */
    /* Food Pursuit       */
    /* ------------------ */
    if (
      !this._idOfFood || // missing food ID
      !this._locationOfFood || // missing food location
      !foods[this._idOfFood] || // food is gone from foods object
      doesOccurWithProbability(this._boredomFood) // bored looking for food?
    ) {
      this._isSeekingFood = false;
    }
    if (this._isSeekingFood) {
      this._direction = arctan(this._locationOfFood.y, this._locationOfFood.x);
      return getNewPosition(
        this._position,
        this._speed,
        this._direction,
        xmin, xmax, ymin, ymax
      );
    }

    /* ------------------ */
    /* Wandering          */
    /* ------------------ */
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

    return getNewPosition(
      this._position,
      this._speed,
      this._direction,
      xmin, xmax, ymin, ymax
    );
  }

  scanSurroundingsAndUpdateState(creatures, foods) {
    let nearbyFoods = getFoodsInProximity(this._position, foods);
    let nearbyCreatures = getCreaturesInProximity(this._position, foods);

    if (isEmpty(nearbyFoods) && isEmpty(nearbyCreatures)) { return; }
    if (isEmpty(nearbyFoods)) {
      // TODO: case with only creatures nearby
      return;
    }
    if (isEmpty(nearbyCreatures)) {
      if (doesOccurWithProbability(this._likelihoodPursueFood)) {
        this._isSeekingFood = true;
      } else {
        this._isSeekingFood = false;
      }
    }
    // TODO: case with both creatues and food nearby
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
      (this.likelihoodPursueFood + mate.likelihoodPursueFood) / 2,
      (this.matingAgreeableness + mate.matingAgreeableness) / 2,
      (this.likelihoodTurnRight + mate.likelihoodTurnRight) / 2,
      (this.likelihoodTurnLeft + mate.likelihoodTurnLeft) / 2,
      (this.angleTurn + mate.angleTurn) / 2,
      (this.variationAngleTurn + mate.variationAngleTurn) / 2
    );
  }
};
