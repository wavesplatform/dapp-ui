import React from "react";
import styled from "@emotion/styled";
import attach from './attach.svg'
import attachActive from './attachActive.svg'

const Attach = styled.button`
background: url(${attach});
width: 158px;
height: 36px;
border: none;
outline: none;
cursor: pointer;
:hover{
background: url(${attachActive});
}
:disabled{
background: url(${attach});
cursor: not-allowed;
}
`;

export default Attach
