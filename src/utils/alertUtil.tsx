import React from 'react';
import styled from '@emotion/styled';
import { ErrorIcn, InfoIcn, SuccessIcn, WarningIcn } from '@src/assets/icons/AlertIcons/AlertIcon';
import { fonts } from '@src/styles';
import { TNotifyOptions } from '@stores/NotificationStore';

const Root = styled.div`
padding: 25px 20px;
display: flex;
flex-direction: column;
width: 410px;
height:fit-content;
@media(max-width: 768px){
  width: 300px;
}
`;

const Body = styled.div`
display: flex;
${fonts.alertBodyFont};
align-items: flex-start;
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
padding-right: 4px;
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
                {title && <Title>{title}</Title>}
                {content}
                {link && <Link target="_blank" href={link}>{linkTitle || link}</Link>}
            </Content>
        </Body>
    </Root>;
};

const Icon: React.FunctionComponent<{ type: 'error' | 'info' | 'warning' | 'success' }> = ({type}) => {
    let icon = null;
    const Root = styled.div`margin-right: 16px; flex: 1`;
    switch (type) {
        case 'error':
            icon = <ErrorIcn/>;
            break;
        case 'success':
            icon = <SuccessIcn/>;
            break;
        case 'info':
            icon = <InfoIcn/>;
            break;
        case 'warning':
            icon = <WarningIcn/>;
            break;
    }
    return <Root>{icon}</Root>;
};

export const closeAlertIcon =<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.8773 10.6071L5.85347 15.6309L6.56058 16.338L11.5844 11.3142L16.4594 16.1891L17.1665 15.482L12.2915 10.6071L17.1672 5.73139L16.4601 5.02428L11.5844 9.89995L6.55988 4.87542L5.85278 5.58253L10.8773 10.6071Z" fill="#A3ACC4"/>
    </svg>
;


export default getAlert;
