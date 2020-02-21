/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import AccountDesktop from '@components/Home/Account/AccountDesktop';
import { useWindowDimensions } from '@utils/dimensions';
import AccountMobile from '@components/Home/Account/AccountMobile';
import styled from '@emotion/styled';
import Wifi from '@src/assets/icons/Wifi';
import { fonts } from '@src/styles';
import { INetwork } from '@stores/KeeperStore';

const Account: React.FC = () => {
    const {width} = useWindowDimensions();
    return width > 768 ? <AccountDesktop/> : <AccountMobile/>;
};

export default Account;


export function centerEllipsis(str: string, symbols = 16) {
    if (str.length <= symbols) return str;
    return `${str.slice(0, symbols / 2)}...${str.slice(-symbols / 2)}`;
}

export const getNetwork = (url: string) => {
    switch (url) {
        case 'T':
            return 'TestNet';
        case 'W':
            return 'MainNet';
        case 'S':
            return 'StageNet';
        default:
            return 'Custom';
    }
};

export const SignIn = styled.div`
cursor: pointer; white-space: nowrap;padding-left: 10px;
`;

const ErrorText = styled.div`
color: #EF7362;
white-space: nowrap;
`;

const AccountDetailWrapper = styled.div`
${fonts.descriptionFont};
display: flex;
justify-content: flex-end; 
align-items: center;
`;


export const AccountDetails: React.FC<{ network: INetwork, isInvalidServer: boolean | null }> =
    ({network: {code}, isInvalidServer}) =>
        <AccountDetailWrapper>
            <Wifi style={css`margin: 0  8px 0 0 `}/>
            {getNetwork(code)}
            {isInvalidServer && <ErrorText>&nbsp;invalid network</ErrorText>}
        </AccountDetailWrapper>;

export const Copy = ({onClick}: { onClick?: () => void }) => <svg css={css`margin-left: 8px;cursor: pointer;`}
                                                                  onClick={onClick} width="14"
                                                                  height="14" viewBox="0 0 14 14" fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
        <path d="M9.8637 0H2.22733C1.52413 0 0.95459 0.569536 0.95459 1.27274V9.18184H2.22733V1.27274H9.8637V0Z"
              fill="#9BA6B1"/>
        <path
            d="M12.773 3.54544H5.77298C5.06981 3.54544 4.50024 4.11498 4.50024 4.81818V12.7273C4.50024 13.4305 5.06978 14 5.77298 14H12.773C13.4762 14 14.0457 13.4305 14.0457 12.7273V4.81818C14.0457 4.11501 13.4762 3.54544 12.773 3.54544ZM12.773 12.7273H5.77298V4.81818H12.773V12.7273Z"
            fill="#9BA6B1"/>
    </g>
    <defs>
        <clipPath id="clip0">
            <rect width="14" height="14" fill="white"/>
        </clipPath>
    </defs>
</svg>;


