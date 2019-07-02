import styled from 'styled-components';
import { FlexCenterRow } from '../constants/Mixins';
import { Background1 } from '../constants/Theme';

export const ControlPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  padding: 5px;
  background-color: ${Background1};
`;

export const ControlPanelRowWrapper = styled.div`
  display: flex;
  :not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const SliderWrapper = styled.div`
  ${FlexCenterRow};
  width: 300px;
`;

export const ButtonWrapper = styled.div`
  ${FlexCenterRow};
  width: 100px;
`;

export const InputWrapper = styled.div`
  ${FlexCenterRow};
  width: 100px;
`;
