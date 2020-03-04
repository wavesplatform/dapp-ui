/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from "react";
import vector from './Vector.svg'
import vectorHov from './VectorHov.svg'
import styled from "@emotion/styled";

const rootStyle = css`
height: 40px;
display: flex; 
justify-content: center;
align-items: center;
background: #F4F6FA;
border-radius: 0 4px 4px 0;
padding-right: 18px;
cursor: pointer;
`;

const Image = styled.div`
background: url("${vector}") center no-repeat;
:hover{
  background: url("${vectorHov}") center no-repeat;
}
background-size: cover;
width: 24px;
height: 24px;
`;


interface IProps {
    onClick?: () => void
}

export const SearchIcn: React.FunctionComponent<IProps> = ({onClick}) =>
    <div css={rootStyle} onClick={onClick}>
        <Image/>
    </div>;


