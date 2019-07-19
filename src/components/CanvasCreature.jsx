import { CREATURE_WIDTH, CREATURE_HEIGHT, SIGHT_RADIUS } from '../constants/Constants';

const CanvasCreature = ({
  context,
  creature,
  showVisionCircle
}) => {
  context.fillStyle = 'blue';
  context.fillRect(creature.position.x, creature.position.y, CREATURE_WIDTH, CREATURE_HEIGHT);

  if (showVisionCircle) {
    context.beginPath();
    context.arc(creature.position.x, creature.position.y, SIGHT_RADIUS, 0, 2 * Math.PI);
    context.lineWidth = 0.5;
    context.stroke();
  }
};

export default CanvasCreature;
