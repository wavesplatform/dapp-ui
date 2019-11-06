/** @jsx jsx  **/
import React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const _Select = styled.select`
outline: none;
border: none;
background: #F4F6FA;
border-radius: 4px;
height: 50px;
width: 100%;
padding: 0 10px;
font-family: Roboto;
font-size: 16px;
`;

const styles = {
    root: css`display: flex; width: 100%`,
};

interface IProps {
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    css?: any
    disabled?: boolean

}
interface IState {
}

export default class Select extends React.Component<IProps, IState> {

    render() {
        const { css, children, ...others} = this.props;
        return <div css={[styles.root, css]}>
            <_Select css={[css]} {...others}>
                {children}
            </_Select>
        </div>;
    }
}
