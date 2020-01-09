import React from "react";
import styled from "@emotion/styled";
import { ErrorIcn, InfoIcn, SuccessIcn, WarningIcn } from "@src/assets/icons/AlertIcons/AlertIcon";
import { fonts } from "@src/styles";
import { TNotifyOptions } from "@stores/NotificationStore";

const Root = styled.div`
padding: 18px 25px 16px 25px;
display: flex;
flex-direction: column;
width: 400px;
height:fit-content;
@media(max-width: 768px){
  width: 300px;
}
`;

const Body = styled.div`
display: flex;
${fonts.alertBodyFont};
align-items: center;

`;

const Title = styled.div`
${fonts.alertTitleFont};
padding-bottom: 4px;
`;

const Content = styled.div`
display: flex;
flex-direction: column;
height: 100%;
flex:4;
word-wrap: break-word;
width: 80%;
`;

const Link = styled.a`
text-decoration: none;
color: #5A8AFF
`;

const getAlert = (content: string | JSX.Element, {type, title, link, linkTitle}: TNotifyOptions) => {
    if (!type) return null;
    return <Root>
        <Body>
            <Icon type={type}/>
            <Content>
                <Title>{title || type}</Title>
                {content}
                {link && <Link target="_blank" href={link}>{linkTitle || link}</Link>}
            </Content>
        </Body>
    </Root>
};

const Icon: React.FunctionComponent<{ type: 'error' | 'info' | 'warning' | 'success' }> = ({type}) => {
    let icon = null;
    const Root = styled.div`margin-right: 16px; flex: 1`;
    switch (type) {
        case "error":
            icon = <ErrorIcn/>;
            break;
        case "success":
            icon = <SuccessIcn/>;
            break;
        case "info":
            icon = <InfoIcn/>;
            break;
        case "warning":
            icon = <WarningIcn/>;
            break;
    }
    return <Root>{icon}</Root>
}

export default getAlert
