import React, { useEffect, useRef, useState } from 'react';

/* Constants */
import {
  FOOD_SPAWN_PROBABILITY,
  FOOD_WIDTH,
  FOOD_HEIGHT,
  CREATURE_WIDTH,
  CREATURE_HEIGHT,
  WORLD_CANVAS_WIDTH,
  WORLD_CANVAS_HEIGHT
} from '../constants/Constants';

/* Utils */
import { Timestamp, Food, Creature } from '../constants/Classes';
import { doesOccurWithProbability, getRandomPosition, generateUniqueId } from '../utils/UtilFunctions';
import { updateCreaturePositons } from '../utils/CreatureLogic';
import { useInterval } from '../utils/Hooks';

/* Child Components */
import CanvasFood from './CanvasFood';
import CanvasCreature from './CanvasCreature';
import ControlPanel from './ControlPanel';
import Typography from '@material-ui/core/Typography';

/* Styled Components */
import { CanvasWrapper, MainCanvas } from '../styles/WorldCanvas';

const WorldCanvas = () => {
  const canvasDom = useRef(null);
  const foods = useRef({});
  const creatures = useRef({});

  const [ initialCreatures, setInitialCreatures ] = useState(40);
  // can only initiate creatures once for now
  const [ hasSpawnedInitialCreatures, setHasSpawnedInitialCreatures ] = useState(false);

  const [canvasContext, setCanvasContext] = useState(null);
  const [timestamp, setTimestamp] = useState(new Timestamp());
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [simulationPaused, setSimulationPaused] = useState(false);

  useEffect(() => {
    setCanvasContext(canvasDom.current.getContext('2d'));
  }, []);

  useInterval(() => {
    setTimestamp(timestamp.incBySec(1));
  }, simulationPaused ? null : 1000 * 1000 / simulationSpeed);

  useEffect(() => {
    if (!canvasContext) { return; }
    // randomize food drops
    if (doesOccurWithProbability(FOOD_SPAWN_PROBABILITY)) {
      const width = canvasContext.canvas.clientHeight - FOOD_WIDTH;
      const height = canvasContext.canvas.clientHeight - FOOD_HEIGHT;
      const id = generateUniqueId();
      foods.current[id] = new Food(id, getRandomPosition(0, width, 0, height));
    }
  }, [timestamp]);

  const handleSetInitialCreatures = () => {
    if (hasSpawnedInitialCreatures) { return; }
    for (let i = 0; i < initialCreatures; i++) {
      const width = canvasContext.canvas.clientHeight - CREATURE_WIDTH;
      const height = canvasContext.canvas.clientHeight - CREATURE_HEIGHT;
      const id = generateUniqueId();
      creatures.current[id] = new Creature({
        id,
        position: getRandomPosition(0, width, 0, height),
      });
    }
    setHasSpawnedInitialCreatures(true);
  };

  const renderFood = () => {
    Object.keys(foods.current).forEach(id => {
      CanvasFood(canvasContext, foods.current[id]);
    });
  };

  const renderCreatures = () => {
    const width = canvasContext.canvas.clientHeight - CREATURE_WIDTH;
    const height = canvasContext.canvas.clientHeight - CREATURE_HEIGHT;
    updateCreaturePositons(creatures.current, foods.current, 0, width, 0, height);
    Object.keys(creatures.current).forEach(id => {
      CanvasCreature(canvasContext, creatures.current[id]);
    });
  };

  const renderObjects = () => {
    if (!canvasContext) { return null; }
    canvasContext.clearRect(0, 0, canvasDom.current.width, canvasDom.current.height);
    renderFood();
    renderCreatures();
  };

  return (
    <CanvasWrapper>
      <Typography>{timestamp.stringOut}</Typography>
      <Typography>{`Simulation Speed: ${simulationPaused ? 'Paused' : `${simulationSpeed / 1000} sim. sec / IRL sec`}`}</Typography>
      <ControlPanel
        initialCreatures={initialCreatures}
        simulationSpeed={Math.floor(simulationSpeed / 1000)}
        hasSpawnedCreatures={hasSpawnedInitialCreatures}
        handleSpeedUpdate={val => setSimulationSpeed(val * 1000)}
        handleClickPause={() => setSimulationPaused(!simulationPaused)}
        handleUpdateInitialCreature={val => setInitialCreatures(val)}
        handleClickSpawnCreatures={() => handleSetInitialCreatures()}
      />
      <MainCanvas ref={canvasDom} width={WORLD_CANVAS_WIDTH} height={WORLD_CANVAS_HEIGHT} />
      {renderObjects()}
    </CanvasWrapper>
  );
};

export default WorldCanvas;
