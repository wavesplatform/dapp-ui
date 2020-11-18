import React, {useState} from 'react'
import {IArgumentInput} from "@components/DappUi/Card";
import {centerEllipsis} from "@components/Home/Account";
import ArgumentInput from "@components/DappUi/ArgumentInput";
import {css, jsx} from "@emotion/core";
import {ReactComponent as AttachIcon} from "@src/assets/icons/Attach/attach-icon.svg";
import styled from "@emotion/styled";
import {fonts} from "@src/styles";
import {debounce} from "debounce";
import {ICallableArgumentType} from "@stores/MetaStore";
import Close from "@src/assets/icons/Close";

interface IProps {
    type: string,
    argName: string,
    setValue: (value: IArgumentInput[]) => void
}

export const ListArgComponent: React.FC<IProps> = (props) => {
    const defaultValue = {type: 'String', value: ''}
    const [values, setValue] = useState({0: defaultValue})

    const handleAddArgument = () => setValue({...values, [Object.keys(values).length + 1]: defaultValue})
    const handleDeleteArgument = (name: string) => {
        // @ts-ignore
        delete values[name];
        setValue(values)
    }
    const handleChangeValue = (name: string, type: ICallableArgumentType | string, value?: string) => {
        setValue({...values, [name]: {type: type, value: value}});
    };


    const handleChangeByteVectorType = (name: string, byteVectorType: 'base58' | 'base64') =>
        setValue({...values, [name]: {byteVectorType}});

    return <Root>
        <ArgumentTitle>
            <ArgumentTitleVarName>{centerEllipsis(props.argName, 7)}:</ArgumentTitleVarName>
            &nbsp;
        </ArgumentTitle>
        {console.log('render')}
        <Wrapper>
            {Object.entries(values).map(item => {
                const name = item[0]
                const type = item[1].type
                const value = item[1].value
                return <Item>
                    <ArgumentTitle>
                        <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
                    </ArgumentTitle>
                    {console.log('type', type)}
                    {console.log('value', value)}
                    <ArgumentInput
                        css={css`flex:5`}
                        value={value}
                        name={name}
                        type={type}
                        onChange={handleChangeValue}
                        onChangeByteVectorType={handleChangeByteVectorType}
                    />
                    {Object.keys(values).length > 1
                        ? <Close style={{marginLeft: "10px", cursor: "pointer"}}
                                 onClick={() => handleDeleteArgument(name)}/>
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
justify-content: flex-end;
min-width: 100px;
max-width: 150px;
`;

const ArgumentTitleVarName = styled.div`
${fonts.callableFuncArgFont};
 font-weight: bold;
`;

const ArgumentTitleVarType = styled.div`
flex: 1;
${fonts.callableFuncArgFont}`;
