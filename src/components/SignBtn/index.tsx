import React from 'react';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/AccountStore';

interface IProps {
    children: React.ReactNode
    className?: string
    accountStore?: AccountStore
}

@inject('accountStore')
@observer
export default class SignBtn extends React.Component <IProps> {
    handleSign = () => {
        const accountStore = this.props.accountStore!;
        if (accountStore!.isWavesKeeperInstalled && !accountStore!.isWavesKeeperInitialized) {
            accountStore!.setupSynchronizationWithWavesKeeper();
        }
        accountStore.login().catch(e => alert(e.message));
    };

    render(): React.ReactNode {
        return <div onClick={this.handleSign}>{this.props.children}</div>;
    }

}
