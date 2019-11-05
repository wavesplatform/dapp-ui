import React from "react";
import { ICallableArgumentType } from "@stores/DappStore";
import Input from "@components/Input";
import Select from "@components/DappUi/Select";
import { css } from "@emotion/core";

interface IArgumentInputProps {
    name: string
    type: ICallableArgumentType
    onChange: (name: string, type: ICallableArgumentType, value?: string) => void
    value?: string
    css?: any
}

interface IArgumentInputState {
    byteVectorType: 'base58' | 'base64'
}


export default class ArgumentInput extends React.Component<IArgumentInputProps, IArgumentInputState> {

    state: IArgumentInputState = {byteVectorType: 'base58'};

    handleChangeByteVectorType = (byteVectorType: 'base58' | 'base64') => this.setState({byteVectorType});

    handleChange = (value?: string) =>
        this.props.onChange(this.props.name, this.props.type, value);

    render() {
        const {type, value, css: style} = this.props;
        const {byteVectorType} = this.state;
        switch (type) {
            case "Boolean":
            return <Select css={style} onChange={(e) => this.handleChange(e.target.value)} value={value}>
                <option/>
                <option value="false">false</option>
                <option value="true">true</option>
            </Select>;

            case "ByteVector":
                return <>
                    <Select
                        value={byteVectorType}
                        onChange={(e) => this.handleChangeByteVectorType(e.target.value as 'base58' | 'base64')}
                        css={[style, css`margin-right: 8px`]}
                    >
                        <option value="base58">base58</option>
                        <option value="base64">base64</option>
                    </Select>
                    <Input onChange={(e) => this.handleChange(e.target.value)} value={value} css={style}/>
                </>;

            case "Int":
                return <Input
                    min={0}
                    type="number"
                    value={value}
                    css={style}
                    onChange={({target: {value: v}}: React.ChangeEvent<HTMLInputElement>) =>
                        this.handleChange(!isNaN(+v) ? String(v) : undefined)
                    }
                />;

            case "String":
                return <Input onChange={(e) => this.handleChange(e.target.value)} value={value} css={style}/>;
            default:
                return <Input css={style} disabled/>;
        }
    }
}

