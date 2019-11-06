/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from "react";
import { SerializedStyles } from "@emotion/core";
import logo from './logo.svg'
interface IProps {
    css?: SerializedStyles
}
export const Logo: React.FunctionComponent<IProps> = (props) =>
    <img css={[props.css]} src={logo} alt={'image'}/>;


