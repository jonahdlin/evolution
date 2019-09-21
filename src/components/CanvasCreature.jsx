import {
  CREATURE_WIDTH,
  CREATURE_HEIGHT,
  SIGHT_RADIUS,
  CREATURE_DIRECTION_DEBUG_ARROW_LENGTH,
  CREATURE_DIRECTION_DEBUG_ARROW_TIP_RADIUS,
} from '../constants/Constants';

const CanvasCreature = ({
  context,
  creature,
  showVisionCircle,
  showDirection,
  isSelected,
}) => {
  context.fillStyle = isSelected ? 'purple' : 'blue';
  context.fillRect(creature.position.x, creature.position.y, CREATURE_WIDTH, CREATURE_HEIGHT);

  if (showVisionCircle) {
    context.beginPath();
    context.arc(creature.position.x, creature.position.y, SIGHT_RADIUS, 0, 2 * Math.PI);
    context.lineWidth = 0.5;
    context.stroke();
  }

  if (showDirection) {
    // Set up where the tip of the direction arrow goes
    const dir = creature.direction;
    const tipX = creature.position.x + Math.cos(dir) * CREATURE_DIRECTION_DEBUG_ARROW_LENGTH;
    const tipY = creature.position.y + Math.sin(dir) * CREATURE_DIRECTION_DEBUG_ARROW_LENGTH;

    // Draw line
    context.beginPath();
    context.moveTo(creature.position.x, creature.position.y);
    context.lineTo(tipX, tipY);
    context.lineWidth = 1;
    context.stroke();
    context.beginPath();

    // Draw line tip (currently a circle)
    context.beginPath();
    context.arc(tipX, tipY, CREATURE_DIRECTION_DEBUG_ARROW_TIP_RADIUS, 0, 2 * Math.PI);
    context.fillStyle = 'black';
    context.fill();
  }
};

export default CanvasCreature;
