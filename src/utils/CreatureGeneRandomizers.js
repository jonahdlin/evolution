import {
  SPEED_MIN,
  SPEED_MAX,
  STRENGTH_MIN,
  STRENGTH_MAX,
  BOREDOM_FOOD_MIN,
  BOREDOM_FOOD_MAX,
  BOREDOM_MATE_MIN,
  BOREDOM_MATE_MAX,
  ENERGY_LOST_TO_CHILD_MIN,
  ENERGY_LOST_TO_CHILD_MAX,
  ENERGY_LOST_TO_COMBAT_MIN,
  ENERGY_LOST_TO_COMBAT_MAX,
  FOOD_MATE_PREFERENCE_MIN,
  FOOD_MATE_PREFERENCE_MAX,
  MATING_AGREEABLENESS_MIN,
  MATING_AGREEABLENESS_MAX,
  ANGLE_TURN_MIN,
  ANGLE_TURN_MAX,
  VARIATION_ANGLE_TURN_MIN,
  VARIATION_ANGLE_TURN_MAX,
} from '../constants/Constants';
import { getRandomValueInRange } from './UtilFunctions';

export const randomizeSpeed = () => {
  return getRandomValueInRange(SPEED_MIN, SPEED_MAX);
};

export const randomizeStrength = () => {
  return getRandomValueInRange(STRENGTH_MIN, STRENGTH_MAX);
};

export const randomizeBoredomFood = () => {
  return getRandomValueInRange(BOREDOM_FOOD_MIN, BOREDOM_FOOD_MAX);
};

export const randomizeBoredomMate = () => {
  return getRandomValueInRange(BOREDOM_MATE_MIN, BOREDOM_MATE_MAX);
};

export const randomizeEnergyLostToChild = () => {
  return getRandomValueInRange(ENERGY_LOST_TO_CHILD_MIN, ENERGY_LOST_TO_CHILD_MAX);
};

export const randomizeEnergyLostToCombat = () => {
  return getRandomValueInRange(ENERGY_LOST_TO_COMBAT_MIN, ENERGY_LOST_TO_COMBAT_MAX);
};

export const randomizeLikelihoodPursueFood = () => {
  return getRandomValueInRange(FOOD_MATE_PREFERENCE_MIN, FOOD_MATE_PREFERENCE_MAX);
};

export const randomizeMatingAgreeableness = () => {
  return getRandomValueInRange(MATING_AGREEABLENESS_MIN, MATING_AGREEABLENESS_MAX);
};

export const randomizeLikelihoodTurnRight = (likelihoodTurnLeft) => {
  return getRandomValueInRange(0, 1 - likelihoodTurnLeft);
};

export const randomizeLikelihoodTurnLeft = (likelihoodTurnRight) => {
  return getRandomValueInRange(0, 1 - likelihoodTurnRight);
};

/* returns an object of the form
{
  left: prob1,
  right: prob2,
}
where 0 <= prob1 + prob 2 <= 1
*/
export const randomizeTurnLikelihoods = () => {
  let leftProbUnfixed = Math.random();
  let rightProbUnfixed = Math.random();
  let centerProbUnfixed = Math.random();

  const corrector = 1 / (leftProbUnfixed + rightProbUnfixed + centerProbUnfixed);
  return {
    left: leftProbUnfixed * corrector,
    right: rightProbUnfixed * corrector,
  };
};

export const randomizeAngleTurn = () => {
  return getRandomValueInRange(ANGLE_TURN_MIN, ANGLE_TURN_MAX);
};

export const randomizeVariationAngleTurn = () => {
  return getRandomValueInRange(VARIATION_ANGLE_TURN_MIN, VARIATION_ANGLE_TURN_MAX);
};

export const randomizeDirection = () => {
  return getRandomValueInRange(0, 2 * Math.PI);
};
