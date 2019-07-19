
// Mutates creatures object based off genes
export const updateCreaturePositons = (creatures, foods, xmin, xmax, ymin, ymax) => {
  const creatureIds = creatures ? Object.keys(creatures) : [];
  creatureIds.forEach(id => {
    const creature = creatures[id];
    creature.scanSurroundingsAndUpdateState(creatures, foods);
    creature.changePosition(creature.nextPosition(creatures, foods, xmin, xmax, ymin, ymax));
  });
};
