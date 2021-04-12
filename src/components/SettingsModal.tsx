import React, {useState} from "react";
import styled from "@emotion/styled";


const Root = styled.div`
height: 100vh;
width: 100vw;
position: fixed; 
top: 0; 
left: 0; 
right:0; 
bottom:0;
background-color: rgba(205, 211, 226, 0.8); 
display: flex;
align-items: center;
justify-content: center;
z-index: 3;
`

const Content = styled.div`
display: flex;
flex-direction: column;
background: white;
height: max-content;
position:relative;
width: 100%;
max-width: 672px;
max-height: 244px;
border-radius: 4px;
`

const Title = styled.div`
display: flex;
font-size: 18px;
justify-content: space-between;
background: #F8F9FB;
padding: 25px 35px;
`

const Body = styled.div`
display: flex;
flex-direction: column;
padding: 25px 35px;
`

const ExitBtnRoot = styled.div`
width: 32px;
height: 32px;
display: flex;
align-items: center;
padding-left: 10%;
outline: none;
z-index: 3;
`

const SettingItem = styled.div`
display: flex;
cursor: pointer;
`

const Checkbox = styled.input`
width: 18px;
height: 18px;
margin-right: 7px;
`

const SaveButton = styled.div`
margin: 30px;
padding: 15px 25px;
background: #1F5AF6;
border-radius: 6px;
align-items: center;
text-align: center;
color: #F8F9FB;
width: max-content;
align-self: end;
`

const ExitBtn: React.FunctionComponent<{ onClick: () => void }> = ({onClick}) => <ExitBtnRoot>
    <div style={{cursor: 'pointer'}}>
        <svg onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <rect x="6.4541" y="22.9705" width="24" height="3" rx="1.5" transform="rotate(-45 6.4541 22.9705)"
                  fill="black"/>
            <rect x="8.5752" y="6" width="24" height="3" rx="1.5" transform="rotate(45 8.5752 6)" fill="black"/>
        </svg>
    </div>
</ExitBtnRoot>

interface IProps {
    handleClose: () => void
}

export const SettingsModal: React.FC<IProps> = (props) => {

    const jsonSettingsFromStorage = localStorage.getItem('jsonSettings') === 'true'
    const [jsonSetting, setJsonSetting] = useState(jsonSettingsFromStorage as boolean)

    const handleJsonSettings = () => {
        setJsonSetting(!jsonSetting)
    }

    const saveAndApply = () => {
        localStorage.setItem('jsonSettings', jsonSetting!.toString())
        props.handleClose()
    }

    return <Root>
        <Content>
            <Title>
                Settings
                <ExitBtn onClick={props.handleClose}/>
            </Title>
            <Body>
                <SettingItem onClick={handleJsonSettings}>
                    <Checkbox type={'checkbox'} checked={jsonSetting} onChange={handleJsonSettings}/>
                    Show JSON transaction receipt button
                </SettingItem>
            </Body>
            <SaveButton onClick={saveAndApply}>
                Save and apply
            </SaveButton>
        </Content>
    </Root>
}
