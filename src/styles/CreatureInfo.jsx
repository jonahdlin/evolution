import styled from 'styled-components';
import { Background1 } from '../constants/Theme';

export const CreatureInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  padding: 5px;
  background-color: ${Background1};
`;

export const CreatureInfoPiece = styled.div`
  display: flex;
  justify-content: space-between;
`;
