import React from "react";
import styled from "@emotion/styled";
import { ErrorIcn, InfoIcn, SuccessIcn, WarningIcn } from "@src/assets/icons/AlertIcons/AlertIcon";
import { fonts } from "@src/styles";

const Root = styled.div`
padding: 18px 25px 16px 25px;
display: flex;
flex-direction: column;
 width: 400px;
  height: 120px;
`

const Body = styled.div`
display: flex;
${fonts.alertBodyFont};
`

const Title = styled.div`
${fonts.alertTitleFont};
padding-bottom: 4px;
`

const Content = styled.div`
flex:4;
`;

const getAlert = (content: string | JSX.Element, type: 'error' | 'info' | 'warning' | 'success', title: string) => {

    return <Root>
        <Body>
            <Icon type={type}/>

            <Content> <Title>{title}</Title>{content}</Content>
        </Body>
    </Root>
};

const Icon: React.FunctionComponent<{ type: 'error' | 'info' | 'warning' | 'success' }> = ({type}) => {
    let icon = null;
    const Root = styled.div`margin-right: 16px; flex: 1`
    switch (type) {
        case "error":
            icon = <ErrorIcn/>;
        case "success":
            icon = <SuccessIcn/>;
        case "info":
            icon = <InfoIcn/>;
        case "warning":
            icon = <WarningIcn/>;
    }
    return <Root>{icon}</Root>
}

export default getAlert
