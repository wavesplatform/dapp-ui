import {RootStore} from '@stores';
import {SubStore} from './SubStore';
import Signer from '@waves/signer';
import Provider from '@waves.exchange/provider-web';
import {action, observable} from 'mobx';
import {INetwork} from '@stores/KeeperStore';
import {getExplorerLink} from '@utils/index';
import {networks} from "@stores/AccountStore";

class SignerStore extends SubStore {

    signer?: any;

    @observable isApplicationAuthorizedInWavesExchange = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.initSigner()
    }

    initSigner = async () => {
        const pathname = this.rootStore.historyStore!.currentPath;
        const networkByAddress = this.rootStore.accountStore!.getNetworkByAddress(pathname);
        const network = (networkByAddress != null) ? networkByAddress : networks.mainnet;
        if (network.clientOrigin) {
            this.signer = new Signer({NODE_URL: network.server});
            await this.signer.setProvider(new Provider(network.clientOrigin));
        } else {
            this.signer = undefined;
            this.rootStore.notificationStore.notify(
                `Unfortunately, Exchange does not support a Stagenet network at this time. Sign in with Keeper.`,
                {type: 'error'}
            )
        }
    }

    login = async () => {
        const account = await this.signer!.login();
        if ('address' in account) {
            const byte = await this.signer!.getNetworkByte();
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
            const transaction = await this.signer!.invoke(tx).broadcast() as any;
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
                    return networks.testnet;
                case 83:
                    return networks.stagenet;
                case 87:
                    return networks.mainnet;
            }

        } catch (e) {
            this.rootStore.notificationStore.notify(e.message, {type: 'error'});
        }
        return null;
    };

}

export default SignerStore;
