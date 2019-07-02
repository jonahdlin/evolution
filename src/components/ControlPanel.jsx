import React from 'react';

/* Child Components */
import Slider from '@material-ui/lab/Slider';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

/* Styled Components */
import {
  ControlPanelWrapper,
  ControlPanelRowWrapper,
  SliderWrapper,
  ButtonWrapper,
  InputWrapper
} from '../styles/ControlPanel';

const ControlPanel = ({
  initialCreatures,
  simulationSpeed,
  hasSpawnedCreatures,
  handleSpeedUpdate,
  handleClickPause,
  handleUpdateInitialCreature,
  handleClickSpawnCreatures,
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
            min={1}
            max={500}
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
    </ControlPanelWrapper>
  );
};

export default ControlPanel;
