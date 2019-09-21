import React, { useEffect, useRef, useState } from 'react';

/* Constants */
import {
  FOOD_SPAWN_PROBABILITY,
  FOOD_WIDTH,
  FOOD_HEIGHT,
  CREATURE_WIDTH,
  CREATURE_HEIGHT,
  WORLD_CANVAS_WIDTH,
  WORLD_CANVAS_HEIGHT,
  DEFAULT_INITIAL_CREATURES
} from '../constants/Constants';

/* Utils */
import { Timestamp, Food, Creature, Position } from '../constants/Classes';
import { doesOccurWithProbability, getRandomPosition, generateUniqueId, isInRectangleWithBottomRight } from '../utils/UtilFunctions';
import { updateCreaturePositons } from '../utils/CreatureLogic';
import { useInterval } from '../utils/Hooks';

/* Child Components */
import CanvasFood from './CanvasFood';
import CanvasCreature from './CanvasCreature';
import ControlPanel from './ControlPanel';
import CreatureInfo from './CreatureInfo';
import Typography from '@material-ui/core/Typography';

/* Styled Components */
import { CanvasWrapper, MainCanvas, ColumnWrapper } from '../styles/WorldCanvas';

const WorldCanvas = () => {
  /* ------------------ */
  /* Refs               */
  /* ------------------ */
  const canvasDom = useRef(null);

  const foods = useRef({});
  const creatures = useRef({});

  /* ------------------ */
  /* State              */
  /* ------------------ */

  const [ creaturesToSpawn, setCreaturesToSpawn ] = useState(DEFAULT_INITIAL_CREATURES);

  const [canvasContext, setCanvasContext] = useState(null);
  const [lastTimestampProcessed, setLastTimestampProcessed] = useState(null);
  const [timestamp, setTimestamp] = useState(new Timestamp());
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [simulationPaused, setSimulationPaused] = useState(false);

  // Debug stuff for creatures
  const [showVisionCircles, setShowVisionCircles] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [creatureInfoId, setCreatureInfoId] = useState(null);

  /* ------------------ */
  /* Effects            */
  /* ------------------ */

  // sets canvas context onload
  useEffect(() => {
    setCanvasContext(canvasDom.current.getContext('2d'));
  }, []);

  // sets loop for incrementing the simulation time
  useInterval(() => {
    setTimestamp(timestamp.incBySec(1));
  }, simulationPaused ? null : 1000 * 1000 / simulationSpeed);

  // decides if a new food drops when the timestamp changes and adds it if it does
  useEffect(() => {
    if (!canvasContext) { return; }
    if (doesOccurWithProbability(FOOD_SPAWN_PROBABILITY)) {
      const width = canvasContext.canvas.clientHeight - FOOD_WIDTH;
      const height = canvasContext.canvas.clientHeight - FOOD_HEIGHT;
      const id = generateUniqueId();
      foods.current[id] = new Food(id, getRandomPosition(0, width, 0, height));
    }
  }, [timestamp]);

  // Listens for clicks on canvas to decide whether or not to display debug
  const handleClickScreen = event => {
    if (!creatures || !creatures.current) { return; }
    const positionClicked = new Position(event.offsetX, event.offsetY);
    for (const id in creatures.current) {
      const creature = creatures.current[id];
      if (
        isInRectangleWithBottomRight(
          positionClicked,
          creature.position,
          CREATURE_WIDTH,
          CREATURE_HEIGHT
        )
      ) {
        if (id === creatureInfoId) {
          setCreatureInfoId(null);
          return;
        }
        setCreatureInfoId(id);
        return;
      }
    }
    setCreatureInfoId(null);
  };

  useEffect(() => {
    canvasDom.current.addEventListener('click', handleClickScreen);
    return () => canvasDom.current.removeEventListener('click', handleClickScreen);
  }, []);

  /* ------------------ */
  /* Rendering          */
  /* ------------------ */

  const renderFood = () => {
    Object.keys(foods.current).forEach(id => {
      CanvasFood(canvasContext, foods.current[id]);
    });
  };

  const updateCreaturesObject = () => {
    const width = canvasContext.canvas.clientHeight - CREATURE_WIDTH;
    const height = canvasContext.canvas.clientHeight - CREATURE_HEIGHT;
    updateCreaturePositons(creatures.current, foods.current, 0, width, 0, height);
  };

  const renderCreatures = () => {
    Object.keys(creatures.current).forEach(id => {
      CanvasCreature({
        context: canvasContext,
        creature: creatures.current[id],
        showVisionCircle: showVisionCircles,
        showDirection: showDirections,
        isSelected: id === creatureInfoId,
      });
    });
  };

  const renderObjects = () => {
    if (!canvasContext) { return null; }

    canvasContext.clearRect(0, 0, canvasDom.current.width, canvasDom.current.height);
    // Only recalculate objects if the simulation has advanced
    if (
      lastTimestampProcessed === null ||
      timestamp.totalSeconds !== lastTimestampProcessed.totalSeconds
    ) {
      updateCreaturesObject();
      setLastTimestampProcessed(timestamp);
    }
    renderFood();
    renderCreatures();
  };

  /* ------------------ */
  /* Handlers           */
  /* ------------------ */

  const handleSpawnCreatures = () => {
    for (let i = 0; i < creaturesToSpawn; i++) {
      const width = canvasContext.canvas.clientHeight - CREATURE_WIDTH;
      const height = canvasContext.canvas.clientHeight - CREATURE_HEIGHT;
      const id = generateUniqueId();
      creatures.current[id] = new Creature({
        id,
        position: getRandomPosition(0, width, 0, height),
      });
    }
  };

  /* ------------------ */
  /* Getters            */
  /* ------------------ */

  const getShowCreature = () => {
    if (!creatures || !creatures.current || !creatureInfoId) { return null; }
    return creatures.current[creatureInfoId];
  };

  /* ------------------ */
  /* Component          */
  /* ------------------ */

  return (
    <CanvasWrapper>
      <ColumnWrapper>
        <Typography>{timestamp.stringOut}</Typography>
        <Typography>{`Simulation Speed: ${simulationPaused ? 'Paused' : `${simulationSpeed / 1000} sim. sec / IRL sec`}`}</Typography>
        <ControlPanel
          simulationSpeed={Math.floor(simulationSpeed / 1000)}
          creaturesToSpawn={creaturesToSpawn}
          showVisionCircles={showVisionCircles}
          showDirection={showDirections}
          handleSpeedUpdate={val => setSimulationSpeed(val * 1000)}
          handleClickPause={() => setSimulationPaused(!simulationPaused)}
          handleUpdateCreaturesToSpawn={val => setCreaturesToSpawn(val)}
          handleClickSpawnCreatures={() => handleSpawnCreatures()}
          handleClickShowVisionCircles={() => setShowVisionCircles(!showVisionCircles)}
          handleClickShowDirections={() => setShowDirections(!showDirections)}
        />
        <MainCanvas ref={canvasDom} width={WORLD_CANVAS_WIDTH} height={WORLD_CANVAS_HEIGHT} />
        {renderObjects()}
      </ColumnWrapper>
      <ColumnWrapper>
        <CreatureInfo creature={getShowCreature()} />
      </ColumnWrapper>
    </CanvasWrapper>
  );
};

export default WorldCanvas;
