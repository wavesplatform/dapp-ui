import styled from '@emotion/styled';
import { fonts } from '@src/styles';

const Button = styled.button`
background: #7CA1FD;
border-radius: 4px;
width: 150px;
height: 40px;
color: white;
outline: none;
cursor: pointer;
border: none;
${fonts.buttonFont}
:disabled{
background: #CDD3E2;
cursor: not-allowed;
}
`;

export default Button;
