import icon from './close.svg';
import styled from "@emotion/styled";

const Close = styled.div`
  background: url(${icon});
  background-size: contain;
  min-width: 23px;
  height: 22px;
  cursor: pointer;
`;

export default Close;
