import React from "react";
import styled from "@emotion/styled";


const Root = styled.div`
//position: absolute; top: 0; left: 0; right:0; bottom:0;
//background-color: rgba(205, 211, 226, 0.8); 
//display: flex;
z-index: 3;
//height: 100vh;
`

const Content = styled.div`
background: white;
height: max-content;
position:relative;
width: 100%;
padding-bottom: 40px;
`

const ExitBtnRoot = styled.div`
height: 100px;
width: 32px;
display: flex;
align-items: center;
padding-left: 10%;
outline: none;
z-index: 3;
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

export default class Modal extends React.Component<IProps> {

    render() {
        return <Root>
            <Content>
                <ExitBtn onClick={this.props.handleClose}/>
                {this.props.children}
            </Content>
        </Root>
    }
}
