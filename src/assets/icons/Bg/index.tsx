/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core'
import React from "react";
import bg from './bg.svg'

interface IProps {
    css?: SerializedStyles
    children?: any
}

export const Bg: React.FunctionComponent<IProps> = (props) =>
    <div css={css`background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);height: 100%;width: 100%`}>
        <div css={[props.css, css`background: url(${bg}); height: 100%;width: 100%;background-size: cover;`]}>
            {props.children}
        </div>
    </div>;


