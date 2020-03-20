/** @jsx jsx*/
import React from "react";
import styled from "@emotion/styled";
import {css, jsx} from "@emotion/core";

const Root = styled.div`
display: flex;
align-items: center;
`

const RadioWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
position:relative;
`

const Body = styled.div`
width: 14px;
height: 14px;
border-radius: 50%;
border: 1px solid #CDD3E2;
cursor: pointer;
`

const SelectedDot = styled.div`
position: absolute;
cursor: pointer;
background-color: #5A8AFF;
border-radius: 50%;
width: 8px;
height: 8px;
`

interface IProps {
    state?: string
    onChange: (v?: string) => void
    value: 'true' | 'false'
    label?: string
}

const Label = styled.div`
font-family: Roboto;
font-size: 14px;
line-height: 16px;
color: #6F7582;
padding-left: 10px;
`

const Radio: React.FunctionComponent<IProps> = ({state, onChange, value, label}) => {
    return <Root>
        <RadioWrapper>
            <Body onClick={() => onChange(value)} css={state === value && css`border-color: #5A8AFF`}/>
            {state === value && <SelectedDot/>}
        </RadioWrapper>
        <Label>{label}</Label>
    </Root>
}

export default Radio
