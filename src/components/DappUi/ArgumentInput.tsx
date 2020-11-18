import React, {useState} from 'react';
import {b58strTob64Str} from '@stores/DappStore';
import {ICallableArgumentType} from '@stores/MetaStore';

import Input from '@components/Input';
import Select from '@components/Select';
import {css} from '@emotion/core';
import {Option} from 'rc-select';
import NotificationStore from '@stores/NotificationStore';
import {inject, observer} from 'mobx-react';
import InputNumber from '@components/Input/InputNumber';
import Radio from "@components/Input/Radio";
import styled from "@emotion/styled";
import {convertListTypes} from "@components/DappUi/Card";

interface IArgumentInputProps {
    name: string
    type: string
    onChange: (name: string, type: ICallableArgumentType | string, value?: string) => void
    onChangeByteVectorType: (name: string, byteVectorType: 'base58' | 'base64') => void
    value?: string
    css?: any
    notificationStore?: NotificationStore
}

const RadioSet = styled.div`
width: 100%;
display: flex;
margin: 0 -15px;
& > * {
  margin: 0 15px;
}
`

export const ArgumentInput: React.FC<IArgumentInputProps> = inject('notificationStore')(observer((props) => {
    let {type, value, css: style} = props;
    if (type.startsWith('List')) type = 'List';
    const listsTypes = convertListTypes(type);
    const [byteVectorType, setByteVectorType] = useState('base58')
    const [selectedInputType, setSelectedInputType] = useState(listsTypes.length > 1 ? 'String' : props.type)

    const handleChangeByteVectorType = (byteVectorType: string) => {
        if (byteVectorType !== 'base58' && byteVectorType !== 'base64') return;
        setByteVectorType(byteVectorType);
        props.onChangeByteVectorType(props.name, byteVectorType);
    };

    const handleChange = (value?: string) => {
        console.log(value)
        props.onChange(props.name, selectedInputType, value);
    }

    const validateByteVector = (e: any) => {
        if (byteVectorType === 'base58') {
            try {
                b58strTob64Str(e.target.value);
            } catch (e) {
                props.notificationStore!.notify(e, {type: 'error'});
            }
        }
    };

    const inputSwitcher = (type: string): React.ReactElement => {
        if (type.startsWith('List')) type = 'List';
        const listsTypes = convertListTypes(type);

        if (type === 'Boolean') return <RadioSet css={style}>
            <Radio value="true" state={value} onChange={handleChange} label="True"/>
            <Radio value="false" state={value} onChange={handleChange} label="False"/>
        </RadioSet>;

        else if (type === 'ByteVector') return <>
            <Select
                value={byteVectorType}
                onChange={handleChangeByteVectorType}
                css={[style, css`margin-right: 8px; max-width: 90px`]}
            >
                <Option value="base58">base58</Option>
                <Option value="base64">base64</Option>
            </Select>
            <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                onBlur={validateByteVector}
                value={value} css={style} spellCheck={false}
            />
        </>;

        else if (type === 'Int') return <InputNumber
            value={value}
            spellCheck={false}
            onChange={(e: string) => handleChange(!isNaN(+e) ? e : '0')}
        />;

        else if (type === 'String') return <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
            value={value} css={style} spellCheck={false}
        />;

        else if (type.startsWith('List')) return <>
            {console.log('listsTypes', listsTypes)}
            <Select
                value={selectedInputType}
                onChange={setSelectedInputType}
                css={[style, css`margin-right: 8px; max-width: 90px`]}
            >
                {listsTypes.map(type => <Option value={type}>{type}</Option>)}
            </Select>
            {/*{inputSwitcher(selectedInputType)}*/}
        </>

        else return <Input css={style} disabled/>;
    }

    // let {type, value, css: style} = this.props;
    // const {byteVectorType} = this.state;
    // if (type.startsWith('List')) type = 'List';
    // const listsTypes = convertListTypes(type)
    console.log(props.name)
    console.log(type)
    console.log(selectedInputType)
    console.log(listsTypes)
    return inputSwitcher(type)
}))
