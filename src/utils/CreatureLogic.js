
// Mutates creatures object based off genes
export const updateCreaturePositons = (creatures, foods, xmin, xmax, ymin, ymax) => {
  const creatureIds = creatures ? Object.keys(creatures) : [];
  const foodIds = foods ? Object.keys(foods) : [];
  creatureIds.forEach(id => {
    creatures[id].changePosition(creatures[id].nextPosition(creatures, foods, xmin, xmax, ymin, ymax));
  });
};
