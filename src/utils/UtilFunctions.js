import { Position } from '../constants/Classes';
import { SIGHT_RADIUS, CREATURE_WIDTH, CREATURE_HEIGHT, FOOD_WIDTH, FOOD_HEIGHT } from '../constants/Constants';

export const doesOccurWithProbability = probability => {
  return Math.random() <= probability;
};

/* takes an object of the form:
{
  outcome1: probability1,
  outcome2: probability2,
  ...
}
e.g.
{
  'out1': 0.25,
  'out2': 0.1,
  'out3': 0.65,
}
assumes probabilities add up to 1, else undefined behaviour
returns the key of the outcome selected
*/
export const selectOutcomeWithProbabilities = probObj => {
  const probObjKeys = Object.keys(probObj);
  const probabilityArray = probObjKeys.reduce((acc, key, index) => {
    if (index === probObjKeys.length - 1) { return acc; }
    const nextKey = probObjKeys[index + 1];
    if (index === 0) {
      return acc.concat([[key, 0], [nextKey, probObj[key]]]);
    }
    const lastStep = acc[acc.length - 1][1];
    return acc.concat([[nextKey, lastStep + probObj[key]]]);
  }, []);
  const selector = Math.random();
  // Could be done with binary search, but I'm lazy and inputs aren't too big
  for (let i = 0; i < probabilityArray.length; i++) {
    if (i === probabilityArray.length - 1) {
      return probabilityArray[i][0];
    }
    if (selector >= probabilityArray[i][1] && selector < probabilityArray[i + 1][1]) {
      return probabilityArray[i][0];
    }
  }
};

export const getRandomValueInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomPosition = (xmin, xmax, ymin, ymax) => {
  return new Position(
    getRandomValueInRange(xmin, xmax),
    getRandomValueInRange(ymin, ymax)
  );
};

// is p2 within r of p1
export const isInRadiusOfPosition = (p1, p2, r) => p1.distanceTo(p2) <= r;

// is p within the rectangle with bottom right corner at pRect, and width
// and height wRect, hRect
export const isInRectangleWithBottomRight = (p, pRect, wRect, hRect) => {
  return (
    p.x >= pRect.x &&
    p.x <= pRect.x + wRect &&
    p.y >= pRect.y &&
    p.y <= pRect.y + hRect
  );
};

// returns true if the rectangle with origin at p1 and width and height w1 and h1
// intersects with the rectangle with origin at p2 and width and height w2 and h2
export const doRectanglesIntersect = (p1, w1, h1, p2, w2, h2) => {
  return (
    isInRectangleWithBottomRight(p2, p1, w1, h1) ||
    isInRectangleWithBottomRight(new Position(p2.x, p2.y + h2), p1, w1, h1) ||
    isInRectangleWithBottomRight(new Position(p2.x + w2, p2.y), p1, w1, h1) ||
    isInRectangleWithBottomRight(new Position(p2.x + w2, p2.y + h2), p1, w1, h1) ||
    isInRectangleWithBottomRight(p1, p2, w2, h2)
  );
};

// Taken from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Taken from https://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (value, decimals) => {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
};

/*
Computes the precise arctan of the angle subtended by the
"adjacent" length line and opposite the "opposite" length line.
/Returns a value in the range [0, 2 * Math.PI)
*/
export const arctan = (opposite, adjacent) => {
  // Special case where adjacent is 0
  if (adjacent === 0) {
    return opposite >= 0 ? 0 : Math.PI;
  }
  // Special case where opposite is 0
  if (opposite === 0) {
    return adjacent > 0 ? Math.PI / 2 : 3 * Math.PI / 2;
  }
  // Quadrant 1
  if (opposite > 0 && adjacent > 0) {
    return Math.atan(opposite / adjacent);
  }
  // Quadrant 2
  if (opposite < 0 && adjacent > 0) {
    return Math.PI - Math.atan((-opposite) / adjacent);
  }
  // Quadrant 3
  if (opposite < 0 && adjacent < 0) {
    return Math.PI + Math.atan(opposite / adjacent);
  }
  // Quadrant 4
  return 2 * Math.PI - Math.atan(opposite / (-adjacent));
};

/*
See below for descriptions of parameters
*/
export const getNewPosition = (
  currentPosition,
  distance, // the amount to advance in the direction
  direction, // the direction of motion
  xmin, xmax, ymin, ymax // limiters on movement
) => {
  const xAdvance = distance * Math.cos(direction);
  const yAdvance = distance * Math.sin(direction);
  const newX = Math.min(Math.max(currentPosition.x + xAdvance, xmin), xmax);
  const newY = Math.min(Math.max(currentPosition.y + yAdvance, ymin), ymax);
  return new Position(newX, newY);
};

/*
returns object in the form of
{
  id: FoodObject,
  ...
}
for all foods within the SIGHT_RADIUS of p
*/
export const getFoodsInProximity = (p, foods) => {
  const nearbyFoods = {};
  for (let foodId in foods) {
    const currFood = foods[foodId];
    if (isInRadiusOfPosition(p, currFood.position, SIGHT_RADIUS)) {
      nearbyFoods[currFood.id] = currFood;
    }
  }
  return nearbyFoods;
};

/*
returns object in the form of
{
  id: CreatureObject,
  ...
}
for all creatures within the SIGHT_RADIUS of p
*/
export const getCreaturesInProximity = creatures => {
  return {}; // TODO
};

/*
returns array of the form [foodId1, foodId2, etc.] for all foods
intersecting a creature at position p
*/
export const getIntersectingFoods = (p, foods) => {
  const intersectingFoods = [];
  for (let foodId in foods) {
    const currFood = foods[foodId];
    if (
      doRectanglesIntersect(
        p,
        CREATURE_WIDTH,
        CREATURE_HEIGHT,
        currFood.position,
        FOOD_WIDTH,
        FOOD_HEIGHT,
      )
    ) {
      intersectingFoods.push(currFood.id);
    }
  }
  return intersectingFoods;
};
