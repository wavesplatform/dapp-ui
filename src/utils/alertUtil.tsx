import React from "react";
import styled from "@emotion/styled";
import {ErrorIcn, InfoIcn, SuccessIcn, WarningIcn} from "@src/assets/icons/AlertIcons/AlertIcon";
import {fonts} from "@src/styles";
import {TNotifyOptions} from "@stores/NotificationStore";

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

export const closeAlertIcon = <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.5778 17.2642L8.87388 24.9682L9.58099 25.6753L17.2849 17.9714L25.137 25.8235L25.8441 25.1164L17.992 17.2642L25.8444 9.41182L25.1373 8.70472L17.2849 16.5571L9.58068 8.85291L8.87357 9.56002L16.5778 17.2642Z" fill="#CDD3E2"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M8.16677 24.9682L15.8707 17.2643L8.16647 9.5601L9.58068 8.14588L17.2849 15.8501L25.1373 7.99769L26.5515 9.4119L18.6991 17.2643L26.5512 25.1164L25.137 26.5307L17.2849 18.6785L9.58099 26.3825L8.16677 24.9682ZM17.2849 17.9714L25.137 25.8236L25.8441 25.1164L17.992 17.2643L25.8444 9.4119L25.1373 8.70479L17.2849 16.5572L9.58068 8.85299L8.87357 9.5601L16.5778 17.2643L8.87388 24.9682L9.58099 25.6754L17.2849 17.9714Z" fill="#CDD3E2"/>
</svg>




export default getAlert
