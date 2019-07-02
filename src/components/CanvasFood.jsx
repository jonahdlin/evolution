import { FOOD_WIDTH, FOOD_HEIGHT } from '../constants/Constants';

const CanvasFood = (context, food) => {
  context.fillStyle = 'red';
  context.fillRect(food.x, food.y, FOOD_WIDTH, FOOD_HEIGHT);
};

export default CanvasFood;
