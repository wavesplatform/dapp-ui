/** @jsx jsx  **/
import React from "react";
import { SearchIcn } from "@src/assets/icons/SearchIcn";
import { css, jsx, SerializedStyles } from "@emotion/core";
import styled from "@emotion/styled";

const _Input = styled.input`
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
    defaultValue?: string
}

interface IState {
    value: string
}

export default class Input extends React.Component<IProps, IState> {

    state = {value: this.props.defaultValue || ''};

    handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && this.props.onSubmit) {
            this.props.onSubmit(this.state.value)
        }
    };

    handleChangeValue = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => this.setState({value});

    render() {
        const {withSearchIcon, onSubmit} = this.props;
        const {value} = this.state;
        return <div css={styles.root}>
            <_Input
                css={[withSearchIcon && onSubmit && styles.withSearchIconStyle]}
                onKeyPress={this.handleKeyPress}
                value={value}
                onChange={this.handleChangeValue}
            />
            {withSearchIcon && onSubmit && <SearchIcn onClick={() => onSubmit(value)}/>}
        </div>;
    }
}
