/** @jsx jsx */
import React from "react";
import { css, jsx } from '@emotion/core';

export const iconStyle = css`
width: 32px;
display: none;
cursor: pointer;
@media(max-width: 768px){
  display: flex;
}
`;

interface IProps  {
    onClick?: () => void
}

const MenuIcon:React.FunctionComponent<IProps> = ({onClick}) => <svg css={iconStyle} onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="7" width="24" height="3" rx="1.5" fill="black"/>
        <rect x="4" y="15" width="20" height="3" rx="1.5" fill="black"/>
        <rect x="4" y="23" width="24" height="3" rx="1.5" fill="black"/>
    </svg>
export default MenuIcon
