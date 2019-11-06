import React from 'react';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/AccountStore';
import NotificationStore from "@stores/NotificationStore";

interface IProps {
    children: React.ReactNode
    className?: string
    accountStore?: AccountStore
    notificationStore?: NotificationStore
}

@inject('accountStore', 'notificationStore')
@observer
export default class SignBtn extends React.Component <IProps> {
    handleSign = () => {
        const accountStore = this.props.accountStore!;
        if (accountStore!.isWavesKeeperInstalled && !accountStore!.isWavesKeeperInitialized) {
            accountStore!.setupSynchronizationWithWavesKeeper();
        }

        accountStore.login().catch(e => this.props.notificationStore!.notify(e.message, {type: 'error'}));
    };

    render(): React.ReactNode {
        return <div onClick={this.handleSign}>{this.props.children}</div>;
    }

}
