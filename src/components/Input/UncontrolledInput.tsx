/** @jsx jsx  **/
import React from "react";
import { SearchIcn } from "@src/assets/icons/SearchIcn";
import { css, jsx } from "@emotion/core";
import Input from './index'

interface IProps {
    withSearchIcon?: boolean
    onSubmit?: (value: string) => void
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    css?: any
    disabled?: boolean

}

export const styles = {
    root: css`display: flex; width: 100%`,
    withSearchIconStyle: css`border-radius: 4px 0  0 4px;`
};

interface IState {
    value: string
}

export default class UncontrolledInput extends React.Component<IProps, IState> {

    state = {value: this.props.defaultValue || ''};

    handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && this.props.onSubmit) {
            this.props.onSubmit(this.state.value)
        }
    };

    handleChangeValue = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => this.setState({value});

    render() {
        const {withSearchIcon, onSubmit, css} = this.props;
        const {value} = this.state;
        return <div css={[styles.root, css]}>
             <Input
                    css={[withSearchIcon && onSubmit && styles.withSearchIconStyle]}
                    onKeyPress={this.handleKeyPress}
                    value={value}
                    onChange={this.handleChangeValue}
                />
            {withSearchIcon && onSubmit && <SearchIcn onClick={() => onSubmit(value)}/>}
        </div>;
    }
}
