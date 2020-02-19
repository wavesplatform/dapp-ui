/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import wifi from './wifi.svg';

const Wifi: React.FunctionComponent<{ style?: any, onClick?: () => void }> = ({style, onClick}) =>
    <img onClick={onClick} css={style} src={wifi} alt="image"/>;


export default Wifi;

