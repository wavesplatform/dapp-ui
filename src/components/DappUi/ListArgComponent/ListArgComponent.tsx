import React from 'react'
import {convertListTypes, IArgumentInput} from "@components/DappUi/Card";
import {centerEllipsis} from "@components/Home/Account";
import {ArgumentInput} from "@components/DappUi/ArgumentInput";
import {css} from "@emotion/core";
import {ReactComponent as AttachIcon} from "@src/assets/icons/Attach/attach-icon.svg";
import {ICallableArgumentType} from "@stores/MetaStore";
import Close from "@src/assets/icons/Close";

import {
    Root,
    Wrapper,
    Item,
    ArgumentTitle,
    ArgumentTitleVarName,
    ArgumentTitleVarType,
    WrapperInput,
} from './Styled';

interface IProps {
    type: string;
    argName: string;
    values: IArgumentInput[];
    setValue: (value: IArgumentInput[]) => void;
    setByteVectorType: (name: string, byteVectorType: 'base58' | 'base64', index?: number) => void;
    setUnionSubType: (name: string, uniontSubType: string, index?: number) => void;
}

export const ListArgComponent: React.FC<IProps> = (props) => {
    const initialValueType = convertListTypes(props.type).length === 1 ? convertListTypes(props.type)[0] : props.type
    const initialValue = {type: initialValueType, value: ''} as IArgumentInput
    const {values, setValue, argName} = props

    const handleAddArgument = () => setValue([...values, initialValue])

    const handleDeleteArgument = (index: number) => {
        values.splice(index, 1)
        setValue([...values])
    }

    const handleChangeValue = (name: string, type: ICallableArgumentType | string, value?: string, index?: number) => {
        values[index!] = {...values[index!], value: value}
        setValue([...values]);
    };

    const handleChangeType = (name: string, type: ICallableArgumentType | string, index?: number) => {
        values[index!] = {...values[index!], type: (type as ICallableArgumentType)}
        setValue([...values]);
    };

    return <Root>
        <ArgumentTitle>
            <ArgumentTitleVarName title={props.argName}>{centerEllipsis(props.argName, 7)}:</ArgumentTitleVarName>
            &nbsp;
        </ArgumentTitle>
        <Wrapper>
            {values.map((item, index) => {
                const type = item.type
                const value = item.value
                const byteVectorType = item.byteVectorType
                const unionSubType = item.type.split('|')[0];

                return <Item key={Math.random()}>
                    <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
                    <WrapperInput>
                        <ArgumentInput
                            css={css`flex:5`}
                            value={value}
                            name={argName}
                            index={index}
                            type={type}
                            byteVectorType={byteVectorType}
                            unionSubType={unionSubType}
                            onChange={handleChangeValue}
                            onChangeType={handleChangeType}
                            onChangeByteVectorType={props.setByteVectorType}
                            onChangeUnionSubType={props.setUnionSubType}
                        />
                        {values.length > 1
                            ? <Close style={{marginLeft: "10px", cursor: "pointer"}}
                                     onClick={() => handleDeleteArgument(index)}/>
                            : null}
                        <AttachIcon style={{marginLeft: "10px", cursor: "pointer", minWidth: "36px"}}
                                    onClick={handleAddArgument}/>
                    </WrapperInput>
                </Item>
            })}
        </Wrapper>
    </Root>
}
