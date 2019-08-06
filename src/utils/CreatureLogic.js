
// Mutates creatures object based off genes
export const updateCreaturePositons = (creatures, foods, xmin, xmax, ymin, ymax) => {
  const creatureIds = creatures ? Object.keys(creatures) : [];
  creatureIds.forEach(id => {
    const creature = creatures[id];
    // If creature is not wandering, this decides if the creature will start pursuing something
    creature.scanSurroundingsAndUpdateState(creatures, foods);
    // Detects if the creature is on any food, and mutates the foods object accordingly
    creature.consumeFoods(foods);
    // This decides if the creature is bored with its current activity and sets the new position accordingly
    creature.changePosition(creature.nextPosition(creatures, foods, xmin, xmax, ymin, ymax));
    // Did the creature run out of energy?
    if (creature.isDead) {
      delete creatures[id];
    }
  });
};
