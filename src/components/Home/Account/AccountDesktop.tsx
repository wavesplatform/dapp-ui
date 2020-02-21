/** @jsx jsx */
import { inject, observer } from 'mobx-react';
import React from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { fonts } from '@src/styles';
import Wifi from '@src/assets/icons/Wifi';
import { css, jsx } from '@emotion/core';
import Avatar from '@components/Avatar';
import styled from '@emotion/styled';
import { AccountStore } from '@stores/index';
import HistoryStore from '@stores/HistoryStore';
import NotificationStore from '@stores/NotificationStore';
import { AccountDetails, centerEllipsis, Copy, getNetwork, SignIn } from '@components/Home/Account/index';

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
//@media(max-width: 1000px){
//  display: none;
//}
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



@inject('accountStore', 'historyStore', 'notificationStore')
@observer
export default class AccountDesktop extends React.Component<IProps> {
    handleExit = () => window.location.reload();

    handleCopy = () => {
        if (this.props.accountStore!.address && copyToClipboard(this.props.accountStore!.address)) {
            this.props.notificationStore!.notify('Copied!', {type: 'success'});
        }
    };

    handleOpenLoginDialog = () => this.props.notificationStore!.isOpenLoginDialog = true;


    render() {
        const {address, network} = this.props.accountStore!;
        const pathname = this.props.historyStore!.currentPath;
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
                        <AccountDetails network={network} isInvalidServer={isInvalidServer}/>
                    </AccountDescription>
                    <Avatar address={address}/>
                </Root>
                : <SignIn onClick={this.handleOpenLoginDialog}>
                    Sign in
                </SignIn>
        }</Wrapper>;


    }
}
