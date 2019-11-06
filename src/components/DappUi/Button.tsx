import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import { fonts } from "@src/styles";

interface IProps {
    onClick?: () => void
    disabled?: boolean
    children?: any
}

const Root = styled.button`
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
`

const Button: FunctionComponent<IProps> = ({onClick, disabled, children}) =>
    <Root onClick={onClick} disabled={disabled}>{children}</Root>;

export default Button
