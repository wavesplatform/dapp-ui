/** @jsx jsx */
import {inject, observer} from 'mobx-react';
import React from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { fonts } from '@src/styles';
import { LoginType } from '@src/interface';
import { jsx } from '@emotion/core';
import { AccountStore } from '@stores/index';
import HistoryStore from '@stores/HistoryStore';
import NotificationStore from '@stores/NotificationStore';
import SignerStore from '@stores/SignerStore';
import { Avatar, AccountDetails, Address, Copy,  SignIn } from '@components';

import { EAddressType } from './interface';
import { addressByType } from './helpers';
import { SwitchAddress } from './SwitchAddress';
import {
    AccountDescription,
    Body,
    Wrapper,
    Settings
} from './Styled';
import {ReactComponent as SettingsIcon} from '@src/assets/icons/settings.svg';
import SettingsModal from "@components/SettingsModal";

interface IProps {
    accountStore?: AccountStore;
    historyStore?: HistoryStore;
    signerStore?: SignerStore;
    notificationStore?: NotificationStore;
}

interface IState {
    addressType: EAddressType,
    isModalOpen: boolean
}

@inject('accountStore', 'historyStore', 'notificationStore', 'signerStore')
@observer
export default class AccountDesktop extends React.Component<IProps, IState> {
    // handleExit = () => window.location.reload();
    constructor(props: IProps) {
        super(props);

        this.state = {
            addressType: EAddressType.WAVES,
            isModalOpen: false
        };
    }

    handleCopy = () => {
        if (!this.props.accountStore!.address) {
            return;
        }

        const address = this.addressByType();

        if (copyToClipboard(address)) {
            this.props.notificationStore!.notify('Copied!', {type: 'success'});
        }
    };

    handleOpenLoginDialog = () => this.props.notificationStore!.isOpenLoginDialog = true;

    handleSwitchAddressType = () => {
        const addressType = this.state.addressType;

        this.setState({
            addressType: addressType === EAddressType.WAVES ? EAddressType.ETHEREUM : EAddressType.WAVES
        });
    }
    handleOpenModal = () => this.setState({isModalOpen: true})
    handleCloseModal = () => this.setState({isModalOpen: false})

    render() {
        const props = this.props;

        const {address, network} = props.accountStore!;
        const pathname = props.historyStore!.currentPath;
        const networkByAddress = props.accountStore!.getNetworkByAddress(pathname);

        const isInvalidServer = networkByAddress && network && networkByAddress.code !== network.code;

        return <Wrapper>{
            address && network
                ? <Body>
                    <Settings onClick={this.handleOpenModal}>
                        <SettingsIcon/>
                    </Settings>
                    {this.state.isModalOpen
                        ? <SettingsModal handleClose={this.handleCloseModal}/>
                        : null}
                    <AccountDescription>
                        <div css={fonts.addressFont}>
                            {this.switchAddressButton()}&nbsp;&nbsp;
                            <Address address={this.addressByType()}/>
                            <Copy onClick={this.handleCopy}/>
                        </div>
                        <AccountDetails network={network} isInvalidServer={isInvalidServer}/>
                    </AccountDescription>
                    <Avatar address={address}/>
                </Body>
                : <SignIn onClick={this.handleOpenLoginDialog}>
                    Sign in
                </SignIn>
        }</Wrapper>;
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
