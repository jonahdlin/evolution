import { CREATURE_WIDTH, CREATURE_HEIGHT } from '../constants/Constants';

const CanvasCreature = (context, creature) => {
  context.fillStyle = 'blue';
  context.fillRect(creature.position.x, creature.position.y, CREATURE_WIDTH, CREATURE_HEIGHT);
};

export default CanvasCreature;
