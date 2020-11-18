import React from 'react'
import {IArgumentInput} from "@components/DappUi/Card";
import {centerEllipsis} from "@components/Home/Account";
import {ArgumentInput} from "@components/DappUi/ArgumentInput";
import {css} from "@emotion/core";
import {ReactComponent as AttachIcon} from "@src/assets/icons/Attach/attach-icon.svg";
import styled from "@emotion/styled";
import {fonts} from "@src/styles";
import {ICallableArgumentType} from "@stores/MetaStore";
import Close from "@src/assets/icons/Close";

interface IProps {
    type: string,
    argName: string,
    values: IArgumentInput[],
    setValue: (value: IArgumentInput[]) => void,
    setByteVectorType: (name: string, byteVectorType: 'base58' | 'base64') => void
}

export const ListArgComponent: React.FC<IProps> = (props) => {
    const initialValue = {type: props.type, value: ''} as IArgumentInput
    const {values, setValue, type, argName} = props

    const handleAddArgument = () => setValue([...values, initialValue])

    const handleDeleteArgument = (index: number) => {
        values.splice(index, 1)
        setValue([...values])
    }

    const handleChangeValue = (name: string, type: ICallableArgumentType | string, value?: string, index?: number) => {
        values[index] = {...values[index], value: value}
        setValue([...values]);
    };

    const handleChangeType = (name: string, type: ICallableArgumentType | string) => {
        const index = +name
        values[index] = {...values[index], type: (type as ICallableArgumentType)}
        setValue([...values]);
    };

    return <Root>
        <ArgumentTitle>
            <ArgumentTitleVarName>{centerEllipsis(props.argName, 7)}:</ArgumentTitleVarName>
            &nbsp;
        </ArgumentTitle>
        <Wrapper>
            {values.map((item, index) => {
                const type = item.type
                const value = item.value
                return <Item key={Math.random()}>
                    <ArgumentTitle>
                        <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
                    </ArgumentTitle>
                    <ArgumentInput
                        css={css`flex:5`}
                        value={value}
                        name={argName}
                        index={index}
                        type={type}
                        onChange={handleChangeValue}
                        onChangeType={handleChangeType}
                        onChangeByteVectorType={props.setByteVectorType}
                    />
                    {values.length > 1
                        ? <Close style={{marginLeft: "10px", cursor: "pointer"}}
                                 onClick={() => handleDeleteArgument(index)}/>
                        : null}
                    <AttachIcon style={{marginLeft: "10px", cursor: "pointer"}}
                                onClick={() => handleAddArgument()}/>
                </Item>
            })}
        </Wrapper>
    </Root>
}
const Root = styled.div`
width: 100%;
display: flex;
align-items: flex-start;
`

const Wrapper = styled.div`
flex: 5;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-end;
`

const Item = styled.div`
width: 100%;
display: flex;
justify-content: flex-end;
align-items: center;
margin-bottom: 10px;
`
const ArgumentTitle = styled.div`
flex: 0.5;
height: 40px;
display: flex;
margin-right: 20px;
align-items: center;
//justify-content: flex-end;
//min-width: 100px;
max-width: 150px;
`;

const ArgumentTitleVarName = styled.div`
${fonts.callableFuncArgFont};
 font-weight: bold;
`;

const ArgumentTitleVarType = styled.div`
flex: 1;
${fonts.callableFuncArgFont}`;
