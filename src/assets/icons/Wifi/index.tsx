/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from "react";
import wifi from './wifi.svg'
import styled from "@emotion/styled";

const Root = styled.img`margin-right: 8px;`;


export const Wifi: React.FunctionComponent = () =>
    <Root src={wifi} alt="image"/>;


