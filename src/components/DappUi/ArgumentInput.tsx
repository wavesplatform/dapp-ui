import React from "react";
import { ICallableArgumentType } from "@stores/DappStore";

interface IArgumentInputProps {
    name: string
    type: ICallableArgumentType
    onChange: (name: string, type: ICallableArgumentType, value?: string) => void
    value?: string
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
        const {type, value} = this.props;
        const {byteVectorType} = this.state;
        switch (type) {
            case "Boolean":
                return <select></select>
                // <Select className={styles.argumentFieldInput} onChange={this.handleChange} value={value}>
                //     <Select.Option value="true">true</Select.Option>
                //     <Select.Option value="false">false</Select.Option>
                // </Select>;
            case "ByteVector":
                return <select></select>
            {/*<div className={styles.byteVectorField}>*/}
                {/*    <Select*/}
                        // className={styles.byteVectorSwitch}
                        // value={byteVectorType}
                        // onChange={this.handleChangeByteVectorType}
                    // >
                        {/*<Select.Option value="base58">base58</Select.Option>*/}
                        {/*<Select.Option value="base64">base64</Select.Option>*/}
                    // </Select>
                    {/*<Input*/}
                        // className={styles.byteVectorInput}
                        // onChange={(e) => this.handleChange(e.target.value)}
                        // value={value}
                    // />
                // </div>;
            case "Int":
                return <input type="text"/>
                {/*<InputNumber*/}
                    // min={0}
                    // type="number"
                    // value={value ? +value : undefined}
                    // className={styles.argumentFieldInput}
                    // onChange={(v) => this.handleChange(v && !isNaN(v) ? String(v) : undefined)}
                // />;
            case "String":
                return <input type="text"/>
            {/*<Input*/}
                    // onChange={(e) => this.handleChange(e.target.value)}
                    // className={styles.argumentFieldInput}
                    // value={value}
                // />;
            default:
                return<input type="text"/>
                    // <Input className={styles.argumentFieldInput} disabled/>;
        }
    }
}

