/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from "react";
import vector from './Vector.svg'

const rootStyle = css`
height: 50px;
display: flex; 
justify-content: center;
background: #F4F6FA;
border-radius: 0 4px 4px 0;
padding-right: 18px;
cursor: pointer;
`;

interface IProps {
    onClick?: () => void
}

export const SearchIcn: React.FunctionComponent<IProps> = ({onClick}) =>
    <div css={rootStyle} onClick={onClick}>
        <img src={vector} alt={'image'}/>
    </div>;


