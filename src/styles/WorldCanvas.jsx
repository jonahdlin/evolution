import styled from 'styled-components';
import { Grey1 } from '../constants/Theme';

export const CanvasWrapper = styled.div`
  margin: 25px;
  display: flex;
`;

export const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  :not(:last-child) {
    margin-right: 20px;
  }
`;

export const MainCanvas = styled.canvas`
  margin-top: 5px;
  border: 1px solid ${Grey1};
`;
