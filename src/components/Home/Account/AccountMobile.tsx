import { inject, observer } from 'mobx-react';
import React from 'react';
import { fonts } from '@src/styles';
import Avatar from '@components/Avatar';
import styled from '@emotion/styled';
import { AccountStore } from '@stores/index';
import HistoryStore from '@stores/HistoryStore';
import NotificationStore from '@stores/NotificationStore';
import Modal from '@components/Modal';
import { Collapse } from 'react-collapse';
import { AccountDetails, SignIn } from '@components/Home/Account/index';

const Root = styled.div`
display: flex;
margin-left: 30px;
height: 34px;
justify-content: flex-end;
align-items: center;
`;

// const AccountDescription = styled.div`
// display: flex;
// flex-direction: column;
// justify-content: space-between;
// height: 100%;
// @media(max-width: 1000px){
//   display: none;
// }
// `;

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

const Body = styled.div`
display: flex;
align-items: flex-end;
flex-direction: column;
padding: 0 10%;
width: 80%;
margin-top: -73px;
& > * {
margin: 8px 0;
}

`;

const Address = styled.div`
${fonts.addressFont};
justify-content: flex-end;
`;

const AvatarWrapper = styled.div`width: 46px`;

@inject('accountStore', 'historyStore', 'notificationStore')
@observer
export default class AccountMobile extends React.Component<IProps> {
    handleOpenLoginDialog = () => this.props.notificationStore!.isOpenLoginDialog = true;
    handleOpenAccountDialog = () => this.props.notificationStore!.isOpenMobileAccount = true;
    handleCloseAccountDialog = () => this.props.notificationStore!.isOpenMobileAccount = false;

    render() {
        const {address, network} = this.props.accountStore!;
        const pathname = this.props.historyStore!.currentPath;
        const networkByAddress = this.props.accountStore!.getNetworkByAddress(pathname);
        const isInvalidServer = networkByAddress && network && networkByAddress.code !== network.code;
        return <Wrapper>{
            address && network

                ? <>
                    <Avatar address={address} onClick={this.handleOpenAccountDialog}/>
                    <Collapse isOpened={this.props.notificationStore!.isOpenMobileAccount}>
                        <Modal handleClose={this.handleCloseAccountDialog}>
                            <Body>
                                <AvatarWrapper><Avatar address={address}/></AvatarWrapper>
                                <Address>{address}</Address>
                                <AccountDetails network={network} isInvalidServer={isInvalidServer}/>
                            </Body>
                        </Modal>
                    </Collapse>
                </>
                : <SignIn onClick={this.handleOpenLoginDialog}>
                    Sign in
                </SignIn>
        }</Wrapper>;


    }
}
