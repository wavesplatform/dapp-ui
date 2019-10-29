import React from "react";
import styled from "@emotion/styled";
import { fonts } from "@src/styles";
import Button from "@components/DappUi/Button";


const Root = styled.div`
background: white;
box-shadow: 0px 5px 16px rgba(134, 142, 164, 0.05);
border-radius: 4px;
margin-bottom: 10px;
padding: 30px 40px;
display: flex;
flex-direction: column;
justify-content: flex-end;
`;

const Header = styled.div`
border-bottom: 1px solid #EBEDF2;
padding-bottom: 20px;
display: flex;
justify-content: space-between;
`;
const Title = styled.div`${fonts.cardTitleFont}`;

interface IProps {
    title: string
    onCall: () => void
    isInvalid?: boolean
}


export default class Card extends React.Component<IProps> {
    render() {
        const {title, onCall, isInvalid} = this.props;
        return <Root>
            <Header>
                <Title>{title}</Title>
                <Button onClick={onCall} disabled={isInvalid}>{title}</Button>
            </Header>
        </Root>
    }
}
