import { Position } from '../constants/Classes';

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

// Taken from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
