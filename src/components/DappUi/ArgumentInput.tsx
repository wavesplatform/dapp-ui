import React from 'react';
import { b58strTob64Str, ICallableArgumentType } from '@stores/DappStore';
import Input from '@components/Input';
import Select from '@components/Select';
import { css } from '@emotion/core';
import { Option } from 'rc-select';
import NotificationStore from '@stores/NotificationStore';
import { inject, observer } from 'mobx-react';

interface IArgumentInputProps {
    name: string
    type: ICallableArgumentType
    onChange: (name: string, type: ICallableArgumentType, value?: string) => void
    onChangeByteVectorType: (name: string, byteVectorType: 'base58' | 'base64') => void
    value?: string
    css?: any

    notificationStore?: NotificationStore

}

interface IArgumentInputState {
    byteVectorType: 'base58' | 'base64'
}

@inject('notificationStore')
@observer
export default class ArgumentInput extends React.Component<IArgumentInputProps, IArgumentInputState> {

    state: IArgumentInputState = {byteVectorType: 'base58'};

    handleChangeByteVectorType = (byteVectorType: string) => {
        if (byteVectorType !== 'base58' && byteVectorType !== 'base64') return;
        this.setState({byteVectorType});
        this.props.onChangeByteVectorType(this.props.name, byteVectorType);
    };

    handleChange = (value?: string) =>
        this.props.onChange(this.props.name, this.props.type, value);

    validateByteVector = (e: any) => {
        if (this.state.byteVectorType === 'base58') {
            try {
                b58strTob64Str(e.target.value);
            } catch (e) {
                this.props.notificationStore!.notify(e, {type: 'error'});
            }
        }
    };

    render() {
        const {type, value, css: style} = this.props;
        const {byteVectorType} = this.state;
        switch (type) {
            case 'Boolean':
                return <Select css={style} onChange={this.handleChange} value={value}>
                    <Option value="false">false</Option>
                    <Option value="true">true</Option>
                </Select>;

            case 'ByteVector':
                return <>
                    <Select
                        value={byteVectorType}
                        onChange={this.handleChangeByteVectorType}
                        css={[style, css`margin-right: 8px`]}
                    >
                        <Option value="base58">base58</Option>
                        <Option value="base64">base64</Option>
                    </Select>
                    <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e.target.value)}
                        onBlur={this.validateByteVector}
                        value={value} css={style} spellCheck={false}
                    />
                </>;

            case 'Int':
                return <Input
                    type="number"
                    value={value}
                    css={style}
                    spellCheck={false}
                    onChange={({target: {value: v}}: React.ChangeEvent<HTMLInputElement>) =>
                        this.handleChange(!isNaN(+v) ? String(v) : undefined)
                    }
                />;

            case 'String':
                return <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e.target.value)}
                    value={value} css={style} spellCheck={false}
                />;
            default:
                return <Input css={style} disabled/>;
        }
    }
}

