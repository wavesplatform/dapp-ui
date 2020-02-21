/** @jsx jsx */
import React from 'react';
import Wifi from '@src/assets/icons/Wifi';
import Avatar from '@components/Avatar';
import styled from '@emotion/styled';
import { fonts } from '@src/styles';
import { css, jsx } from '@emotion/core';
import { inject, observer } from 'mobx-react';
import { AccountStore } from '@stores/index';
// import SignBtn from '@components/SignBtn';
import HistoryStore from '@stores/HistoryStore';
import copyToClipboard from 'copy-to-clipboard';
import NotificationStore from '@stores/NotificationStore';

const Root = styled.div`
display: flex;
margin-left: 30px;
height: 34px;
justify-content: flex-end;
align-items: center;
`;

const AccountDescription = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
height: 100%;
@media(max-width: 1000px){
  display: none;
}
`;

const Wrapper = styled.div`
width: 70%;
padding-right: 10%;
display: flex;
justify-content: flex-end;

@media(max-width: 768px){
  flex: 1
}
`;

interface IProps {
    accountStore?: AccountStore
    historyStore?: HistoryStore
    notificationStore?: NotificationStore
}

const ErrorText = styled.div`
color: #EF7362
`;

const AccountDetailWrapper = styled.div`
${fonts.descriptionFont};
display: flex;
justify-content: flex-end; 
align-items: center;
`;

@inject('accountStore', 'historyStore', 'notificationStore')
@observer
export default class Account extends React.Component<IProps> {
    handleExit = () => window.location.reload();

    handleCopy = () => {
        if (this.props.accountStore!.address && copyToClipboard(this.props.accountStore!.address)) {
            this.props.notificationStore!.notify('Copied!', {type: 'success'});
        }
    };

    handleOpenLoginDialog = () => this.props.notificationStore!.isOpenLoginDialog = true;


    render() {
        const {address, network} = this.props.accountStore!;
        const pathname = this.props.historyStore!.currentPath;//window.location.pathname.replace('/', '');
        const networkByAddress = this.props.accountStore!.getNetworkByAddress(pathname);

        const isInvalidServer = networkByAddress && network && networkByAddress.code !== network.code;


        return <Wrapper>{
            address && network
                ? <Root>
                    <AccountDescription>
                        <div css={fonts.addressFont}>
                            {centerEllipsis(address)}
                            <Copy onClick={this.handleCopy}/>
                        </div>
                        <AccountDetailWrapper>
                            <Wifi style={css`margin: 0  8px 0 0 `}/>
                            {getNetwork(network.code)}
                            {isInvalidServer && <ErrorText>&nbsp;invalid network</ErrorText>}
                        </AccountDetailWrapper>
                    </AccountDescription>
                    <Avatar address={address}/>
                    <Logout onClick={this.handleExit}/>
                </Root>
                : <div onClick={this.handleOpenLoginDialog}
                       css={css`cursor: pointer; white-space: nowrap;padding-left: 10px;`}>
                    Sign in
                </div>
        }</Wrapper>;


    }
}

function centerEllipsis(str: string, symbols = 16) {
    if (str.length <= symbols) return str;
    return `${str.slice(0, symbols / 2)}...${str.slice(-symbols / 2)}`;
}

const getNetwork = (url: string) => {
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

const Logout = ({onClick}: { onClick?: () => void }) => <svg css={css`margin-left: 14px;cursor: pointer;`} onClick={onClick} width="14"
                                                             height="14" viewBox="0 0 14 14" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
        <path
            d="M6.97676 12.814H1.74418C1.42324 12.814 1.16279 12.5535 1.16279 12.2326V1.76746C1.16279 1.44652 1.42327 1.18607 1.74418 1.18607H6.97676C7.29827 1.18607 7.55814 0.9262 7.55814 0.604692C7.55814 0.283184 7.29827 0.0232544 6.97676 0.0232544H1.74418C0.782551 0.0232544 0 0.805833 0 1.76746V12.2326C0 13.1942 0.782551 13.9767 1.74418 13.9767H6.97676C7.29827 13.9767 7.55814 13.7169 7.55814 13.3954C7.55814 13.0739 7.29827 12.814 6.97676 12.814Z"
            fill="#9BA6B1"/>
        <path
            d="M13.8269 6.58603L10.2921 3.09765C10.0641 2.87206 9.69555 2.87499 9.46996 3.10347C9.24438 3.33196 9.2467 3.69998 9.47579 3.92556L12.0019 6.41857H5.23275C4.91124 6.41857 4.65137 6.67845 4.65137 6.99996C4.65137 7.32146 4.91124 7.58137 5.23275 7.58137H12.0019L9.47579 10.0744C9.24673 10.3 9.24498 10.668 9.46996 10.8965C9.5839 11.0116 9.73391 11.0697 9.88392 11.0697C10.0316 11.0697 10.1793 11.0139 10.2921 10.9023L13.8269 7.41389C13.9374 7.30459 14.0002 7.15573 14.0002 6.99993C14.0002 6.84418 13.938 6.69592 13.8269 6.58603Z"
            fill="#9BA6B1"/>
    </g>
    <defs>
        <clipPath id="clip0">
            <rect width="14" height="14" fill="white"/>
        </clipPath>
    </defs>
</svg>;

const Copy = ({onClick}: { onClick?: () => void }) => <svg css={css`margin-left: 8px;cursor: pointer;`} onClick={onClick} width="14"
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


