import { inject, observer } from 'mobx-react';
import React from 'react';

import { LoginType } from '@src/interface';
import { Avatar, AccountDetails, Modal, SignIn } from '@components';
import { AccountStore } from '@stores/index';
import HistoryStore from '@stores/HistoryStore';
import NotificationStore from '@stores/NotificationStore';
import SignerStore from '@stores/SignerStore';
import { Collapse } from 'react-collapse';

import { EAddressType } from './interface';
import { addressByType } from './helpers';
import { SwitchAddress } from './SwitchAddress';
import {
    AddressFont,
    AvatarWrapper,
    AddressContainer,
    BodyMobile,
    WrapperMobile,
} from './Styled';

interface IProps {
    accountStore?: AccountStore;
    historyStore?: HistoryStore;
    notificationStore?: NotificationStore;
    signerStore?: SignerStore;
}

interface IState {
    addressType: EAddressType
}

@inject('accountStore', 'historyStore', 'notificationStore', 'signerStore')
@observer
export default class AccountMobile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            addressType: EAddressType.WAVES
        };
    }

    handleOpenLoginDialog = () => this.props.notificationStore!.isOpenLoginDialog = true;
    handleOpenAccountDialog = () => this.props.notificationStore!.isOpenMobileAccount = true;
    handleCloseAccountDialog = () => this.props.notificationStore!.isOpenMobileAccount = false;

    handleSwitchAddressType = () => {
        const addressType = this.state.addressType;

        this.setState({
            addressType: addressType === EAddressType.WAVES ? EAddressType.ETHEREUM : EAddressType.WAVES
        });
    }

    render() {
        const {address, network} = this.props.accountStore!;
        const pathname = this.props.historyStore!.currentPath;
        const networkByAddress = this.props.accountStore!.getNetworkByAddress(pathname);
        const isInvalidServer = networkByAddress && network && networkByAddress.code !== network.code;

        return <WrapperMobile>{
            address && network

                ? <>
                    <Avatar address={address} onClick={this.handleOpenAccountDialog}/>
                    <Collapse isOpened={this.props.notificationStore!.isOpenMobileAccount}>
                        <Modal handleClose={this.handleCloseAccountDialog}>
                            <BodyMobile>
                                <AvatarWrapper><Avatar address={address}/></AvatarWrapper>
                                <AddressContainer>
                                    {this.switchAddressButton()}&nbsp;&nbsp;
                                    <AddressFont>{this.addressByType()}</AddressFont>
                                </AddressContainer>
                                <AccountDetails network={network} isInvalidServer={isInvalidServer}/>
                            </BodyMobile>
                        </Modal>
                    </Collapse>
                </>
                : <SignIn onClick={this.handleOpenLoginDialog}>
                    Sign in
                </SignIn>
        }</WrapperMobile>;
    }

    addressByType(): string {
        let address = this.props.accountStore!.address!;
        const addressType = this.state.addressType;

        return addressByType(address, addressType);
    }

    switchAddressButton() {
        const loginType = this.props.signerStore!.loginType;

        if (loginType !== LoginType.METAMASK) {
            return null;
        }

        return (
            <SwitchAddress type={this.state.addressType} onClick={this.handleSwitchAddressType} />
        )
    }
}
