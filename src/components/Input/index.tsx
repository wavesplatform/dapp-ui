/** @jsx jsx  **/
import React, { FocusEventHandler } from "react";
import { SearchIcn } from "@src/assets/icons/SearchIcn";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const Root = styled.input`
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
    withSearchIconStyle: css`border-radius: 4px 0  0 4px;`
};

interface IProps {
    withSearchIcon?: boolean
    onSubmit?: (value: string) => void
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
    defaultValue?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    css?: any
    min?: number
    step?: number
    type?: 'number'
    uncontrolled?: boolean
    disabled?: boolean

}

interface IState {
    value: string
}

export default class Input extends React.Component<IProps, IState> {

    state = {value:  this.props.defaultValue || ''};

    handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && this.props.onSubmit) {
            this.props.onSubmit(this.state.value)
        }
    };

    handleChangeValue = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => this.setState({value});

    render() {
        const {withSearchIcon, onSubmit, css, uncontrolled, ...others} = this.props;
        const {value} = this.state;
        return <div css={[styles.root, css]}>
            {uncontrolled ? <Root
                    css={[withSearchIcon && onSubmit && styles.withSearchIconStyle]}
                    onKeyPress={this.handleKeyPress}
                    value={value}
                    onChange={this.handleChangeValue}
                />
                : <Root css={[withSearchIcon && onSubmit && styles.withSearchIconStyle]}{...others}/>
            }
            {withSearchIcon && onSubmit && <SearchIcn onClick={() => onSubmit(value)}/>}
        </div>;
    }
}
