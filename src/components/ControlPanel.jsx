import React from 'react';

/* Child Components */
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

/* Styled Components */
import {
  ControlPanelWrapper,
  ControlPanelRowWrapper,
  SliderWrapper,
  ButtonWrapper,
  InputWrapper
} from '../styles/ControlPanel';
import { SIMULATION_SPEED_SLIDER_MIN, SIMULATION_SPEED_SLIDER_MAX } from '../constants/Constants';

const ControlPanel = ({
  creaturesToSpawn,
  simulationSpeed,
  showVisionCircles,
  showDirections,
  handleSpeedUpdate,
  handleClickPause,
  handleUpdateCreaturesToSpawn,
  handleClickSpawnCreatures,
  handleClickShowVisionCircles,
  handleClickShowDirections,
}) => {
  const onChangeSpeed = (event, value) => {
    handleSpeedUpdate(value);
  };

  const onChangeCreaturesToSpawn = event => {
    handleUpdateCreaturesToSpawn(event.target.value);
  };

  return (
    <ControlPanelWrapper>
      <ControlPanelRowWrapper>
        <ButtonWrapper>
          <Button onClick={handleClickPause}>Pause</Button>
        </ButtonWrapper>
        <SliderWrapper>
          <Slider
            min={SIMULATION_SPEED_SLIDER_MIN}
            max={SIMULATION_SPEED_SLIDER_MAX}
            value={simulationSpeed}
            onChange={onChangeSpeed}
          />
        </SliderWrapper>
      </ControlPanelRowWrapper>
      <ControlPanelRowWrapper>
        <ButtonWrapper>
          <Button
            onClick={handleClickSpawnCreatures}
          >Spawn</Button>
        </ButtonWrapper>
        <InputWrapper>
          <Input
            value={creaturesToSpawn}
            onChange={onChangeCreaturesToSpawn}
          />
        </InputWrapper>
      </ControlPanelRowWrapper>
      <ControlPanelRowWrapper>
        <Typography>
          Show Vision Radius
        </Typography>
        <Checkbox checked={showVisionCircles} onChange={handleClickShowVisionCircles} />
      </ControlPanelRowWrapper>
      <ControlPanelRowWrapper>
        <Typography>
          Show Directions
        </Typography>
        <Checkbox checked={showDirections} onChange={handleClickShowDirections} />
      </ControlPanelRowWrapper>
    </ControlPanelWrapper>
  );
};

export default ControlPanel;
