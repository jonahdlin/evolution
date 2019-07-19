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
  initialCreatures,
  simulationSpeed,
  hasSpawnedCreatures,
  showVisionCircles,
  handleSpeedUpdate,
  handleClickPause,
  handleUpdateInitialCreature,
  handleClickSpawnCreatures,
  handleClickShowVisionCircles,
}) => {
  const onChangeSpeed = (event, value) => {
    handleSpeedUpdate(value);
  };

  const onChangeInitialCreatures = event => {
    handleUpdateInitialCreature(event.target.value);
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
            disabled={hasSpawnedCreatures}
          >Spawn</Button>
        </ButtonWrapper>
        <InputWrapper>
          <Input
            disabled={hasSpawnedCreatures}
            value={initialCreatures}
            onChange={onChangeInitialCreatures}
          />
        </InputWrapper>
      </ControlPanelRowWrapper>
      <ControlPanelRowWrapper>
        <Typography>
          Show Vision Radius
        </Typography>
        <Checkbox checked={showVisionCircles} onChange={handleClickShowVisionCircles} />
      </ControlPanelRowWrapper>
    </ControlPanelWrapper>
  );
};

export default ControlPanel;
