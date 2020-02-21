import { RootStore } from '@stores';
import { SubStore } from './SubStore';
import Signer from '@waves/signer';
import Provider from '@waves.exchange/provider-web';
import { action, observable } from 'mobx';
import { INetwork } from '@stores/KeeperStore';
import { getExplorerLink } from '@utils/index';

class SignerStore extends SubStore {

    signer: Signer;

    @observable isApplicationAuthorizedInWavesExchange = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
        const pathname = this.rootStore.historyStore!.currentPath;
        const networkByAddress = this.rootStore.accountStore!.getNetworkByAddress(pathname);
        const NODE_URL = networkByAddress ? networkByAddress.server : 'https://nodes.wavesnodes.com';
        this.signer = new Signer({NODE_URL});
        this.signer.setProvider(new Provider());
    }

    login = async () => {
        const account = await this.signer.login();
        if ('address' in account) {
            const byte = await this.signer.getNetworkByte();
            this.rootStore.accountStore.network = this.getNetworkByCharCode(byte);
            this.isApplicationAuthorizedInWavesExchange = true;
            this.rootStore.accountStore.loginType = 'exchange';
            this.rootStore.accountStore.address = account.address;
        }
    };

    @action
    async sendTx({data: tx}: any, opts: { notStopWait?: boolean } = {}) {
        if ('payment' in tx) {
            tx.payment = tx.payment.map(({tokens: amount, assetId}: any) => ({amount: +amount * 1e8, assetId}));
        }
        if ('fee' in tx) {
            delete tx.feeAssetId;
            tx.fee = +this.rootStore.accountStore.fee * 1e8;
        }

        try {
            const transaction = await this.signer.invoke(tx).broadcast();
            const id = (transaction as any).id || '';
            const {network} = this.rootStore.accountStore;
            const link = network ? getExplorerLink(network!.code, id, 'tx') : undefined;
            console.dir(transaction);
            this.rootStore.notificationStore
                .notify(`Transaction sent: ${id}\n`,
                    {type: 'success', link, linkTitle: 'View transaction'});

        } catch (err) {
            console.error(err);
            this.rootStore.notificationStore.notify((typeof err === 'string' ? err : err.message), {type: 'error'})
        }
    }

    getNetworkByCharCode = (byte: number): INetwork | null => {
        try {
            switch (byte) {
                case 84:
                    return {server: 'https://nodes-testnet.wavesnodes.com', code: 'T'};
                case 83:
                    return {server: 'https://nodes-stagenet.wavesnodes.com', code: 'S'};
                case 87:
                    return {server: 'https://nodes.wavesnodes.com', code: 'W'};
            }

        } catch (e) {
            this.rootStore.notificationStore.notify(e.message, {type: 'error'});
        }
        return null;
    };

}

export default SignerStore;
