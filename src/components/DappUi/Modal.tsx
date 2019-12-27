import React from "react";
import styled from "@emotion/styled";

const MenuWrapper = styled.div`
position: fixed;
top: 0;
left: 0;
height: 100px;
width: 32px;
display: none;
align-items: center;
margin-left: 20px;
z-index: 2;
outline: none;

@media(max-width: 768px){
  display: flex;
}
`;

const Root = styled.div`
position: fixed; top: 0; left: 0; right:0; bottom:0;
background-color: rgba(205, 211, 226, 0.8); 
display: flex;
z-index: 2;
`

const Content = styled.div`
background: white;
height: max-content;
width: 100%;
padding-bottom: 40px;
`

const ExitBtnRoot = styled.div`
height: 100px;
width: 32px;
display: flex;
align-items: center;
margin-left: 20px;
outline: none;
`

const ExitBtn: React.FunctionComponent<{ onClick: () => void }> = ({onClick}) => <ExitBtnRoot>
    <svg onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6.4541" y="22.9705" width="24" height="3" rx="1.5" transform="rotate(-45 6.4541 22.9705)"
              fill="black"/>
        <rect x="8.5752" y="6" width="24" height="3" rx="1.5" transform="rotate(45 8.5752 6)" fill="black"/>
    </svg>
</ExitBtnRoot>

interface IProps {
    btn: JSX.Element
}

export default class Modal extends React.Component<IProps, { open: boolean }> {

    state = {open: false};

    handleOpen = () => this.setState({open: true});

    handleClose = () => this.setState({open: false});

    render() {
        return <>
            <MenuWrapper>
                <div onClick={this.handleOpen}>{this.props.btn}</div>
            </MenuWrapper>
            {this.state.open && <Root>
                <Content>
                    <ExitBtn onClick={this.handleClose}/>
                    {this.props.children}
                </Content>
            </Root>}
        </>
    }

}
