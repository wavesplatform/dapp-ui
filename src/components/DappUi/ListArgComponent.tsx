import React, {useState} from 'react'
import {IArgumentInput} from "@components/DappUi/Card";
import {centerEllipsis} from "@components/Home/Account";
import ArgumentInput from "@components/DappUi/ArgumentInput";
import {css} from "@emotion/core";
import {ReactComponent as AttachIcon} from "@src/assets/icons/Attach/attach-icon.svg";
import styled from "@emotion/styled";
import {fonts} from "@src/styles";
import {debounce} from "debounce";
import {ICallableArgumentType} from "@stores/MetaStore";

interface IProps {
    type: string,
    setValue: (value: IArgumentInput[]) => void
}

export const ListArgComponent: React.FC<IProps> = (props) => {
    const defaultValue = {type: 'String', value: ''}
    const [values, setValue] = useState({0: defaultValue})

    const handleAddArgument = () => setValue({...values, [Object.keys(values).length + 1]: defaultValue})
    const handleDeleteArgument = (i: number) => {
        // @ts-ignore
        delete values[i];
        setValue(values)
    }
    const handleChangeValue = (name: string, type: ICallableArgumentType | string, value?: string) => {
        setValue({...values, [name]: {type: type, value: value}});
    };


    const handleChangeByteVectorType = (name: string, byteVectorType: 'base58' | 'base64') =>
        setValue({...values, [name]: { byteVectorType}});

    return <>
        {Object.entries(values).map(item => {
            const name = item[0]
            const type = item[1].type
            const value = item[1].value
            return <><ArgumentTitle>
                {/*<ArgumentTitleVarName>{centerEllipsis(argName, 7)}:</ArgumentTitleVarName>*/}
                {/*&nbsp;*/}
                <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
            </ArgumentTitle>
                <ArgumentInput
                    css={css`flex:5`}
                    value={value}
                    name={name}
                    type={type}
                    onChange={handleChangeValue}
                    onChangeByteVectorType={handleChangeByteVectorType}
                />
                {/*<AttachIcon css={css`margin-left: 15px; cursor: pointer;`}*/}
                {/*            onClick={() => this.setState({args: args[argName].value!.push({type:})})}/>*/}
            </>

        })}
    </>
}

const ArgumentTitle = styled.div`
flex: 1;
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

const ArgumentTitleVarType = styled.div`${fonts.callableFuncArgFont}`;
