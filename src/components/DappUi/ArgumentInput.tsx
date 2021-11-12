import React, {useState} from 'react';
import {Option} from 'rc-select';
import {inject, observer} from 'mobx-react';
import {debounce} from "debounce";

import styled from "@emotion/styled";
import {css} from '@emotion/core';

import NotificationStore from '@stores/NotificationStore';
import {b58strTob64Str} from '@stores/DappStore';

import { ICallableArgumentType } from '@src/interface';
import Input from '@components/Input';
import Select from '@components/Select';
import InputNumber from '@components/Input/InputNumber';
import Radio from "@components/Input/Radio";
import {convertListTypes} from "@components/DappUi/Card";

import { isList, isUnion } from './helpers';

interface IArgumentInputProps {
    name: string;
    type: string;
    onChange: (name: string, type: ICallableArgumentType | string, value?: string, index?: number) => void;
    onChangeType?: (name: string, type: ICallableArgumentType | string, index?: number) => void;
    onChangeByteVectorType: (name: string, byteVectorType: 'base58' | 'base64', index?: number) => void;
    onChangeUnionSubType: (name: string, unionSubType: string, index?: number) => void;
    index?: number;
    value?: string;
    css?: any;
    notificationStore?: NotificationStore;
    byteVectorType?: string | undefined;
    unionSubType?: string | undefined;
}

const RadioSet = styled.div`
width: 100%;
display: flex;
margin: 0 -15px;
& > * {
  margin: 0 15px;
}
`;

const Wrapper = styled.div`
flex: 1;
display: flex;
`;


export const ArgumentInput: React.FC<IArgumentInputProps> = inject('notificationStore')(observer((props) => {
    let {type, value, css: style, index, name} = props;
    const [byteVectorType, setByteVectorType] = useState('');
    const [unionSubType, setUnionSubType] = useState('');
    let inputValue = value
    const setInputValue = (value: string | undefined) => inputValue = value

    const handleChangeByteVectorType = (byteVectorType: string) => {
        if (byteVectorType !== 'base58' && byteVectorType !== 'base64') return;
        setByteVectorType(byteVectorType);
        props.onChangeByteVectorType(props.name, byteVectorType, index);
    };

    const handleChangeUnionSubType = (unionSubType: string) => {
        setUnionSubType(unionSubType);
        props.onChangeUnionSubType(props.name, unionSubType, index);
    };

    const debouncedHandleChange = debounce((value?: string) => {
        setInputValue(value)
        props.onChange(name, type, inputValue, index)
    }, 700)

    const handleChange = (value?: string) => {
        setInputValue(value)
        props.onChange(name, type, inputValue, index);
    }

    const validateByteVector = () => {
        if (byteVectorType === 'base58') {
            try {
                b58strTob64Str(value);
            } catch (e) {
                props.notificationStore!.notify(e, {type: 'error'});
            }
        }
    };

    const singleInputSwitcher = (type: string): React.ReactElement => {
        if (type === 'Boolean') {
            return (
                <RadioSet css={style}>
                    <Radio value="true" state={value} onChange={handleChange} label="True"/>
                    <Radio value="false" state={value} onChange={handleChange} label="False"/>
                </RadioSet>
            );
        } else if (type === 'ByteVector') {
            return  (
                <Wrapper>
                    <Select
                        value={props.byteVectorType || byteVectorType}
                        onChange={handleChangeByteVectorType}
                        css={[style, css`margin-right: 8px; max-width: 90px`]}
                    >
                        <Option value="base58" key={'base58'}>base58</Option>
                        <Option value="base64" key={'base64'}>base64</Option>
                    </Select>
                    <Input
                        defaultValue={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedHandleChange(e.target.value)}
                        onBlur={validateByteVector}
                        css={style} spellCheck={false}
                    />
                </Wrapper>
            );
        } else if (type === 'Int') {
            return (
                <InputNumber
                    defaultValue={inputValue}
                    spellCheck={false}
                    onChange={(e: string) => debouncedHandleChange(!isNaN(+e) ? e : '0')}
                />
            );
        } else if (type === 'String') {
            return (
                <Input
                    defaultValue={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedHandleChange(e.target.value)}
                    css={style} spellCheck={false}
                />
            );
        } else if(isUnion(type)) {
            const list = type.split('|');

            return  (
                <Wrapper>
                    <Select
                        value={props.unionSubType || unionSubType}
                        onChange={handleChangeUnionSubType}
                        css={[style, css`margin-right: 8px; max-width: 90px`]}
                    >
                        {list.map((item) => <Option value={item} key={item}>{item}</Option>)}
                    </Select>
                    <Input
                        defaultValue={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => debouncedHandleChange(e.target.value)}
                        css={style} spellCheck={false}
                    />
                </Wrapper>
            );
        } else {
            return (<Input css={style} disabled/>);
        };
            
    }

    const inputSwitcher = (type: string): React.ReactElement => {
        if (isList(type)) {
            const listsTypes = convertListTypes(type);
            return <Wrapper>
                {listsTypes.length > 1
                    ? <Select
                        value={undefined}
                        onChange={(selectedType) => {
                            props.onChangeType!(name, selectedType, index)
                        }}
                        css={[style, css`margin-right: 8px; max-width: 100px`]}
                    >
                        {listsTypes.map(type => <Option value={type} key={type}>{type}</Option>)}
                    </Select>
                    : null}
                {singleInputSwitcher(listsTypes.length > 1 ? type : listsTypes[0])}
            </Wrapper>
        } else return singleInputSwitcher(type);
    }

    return inputSwitcher(type)
}));
