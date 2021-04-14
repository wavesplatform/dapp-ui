import {RootStore} from '@stores';
import {SubStore} from './SubStore';
import {Signer} from '@waves/signer';
import {ProviderWeb} from "@waves.exchange/provider-web";
import {ProviderCloud} from "@waves.exchange/provider-cloud";
import {action, observable} from 'mobx';
import {INetwork} from '@stores/KeeperStore';
import {getExplorerLink} from '@utils';
import {networks} from "@stores/AccountStore";
import {waitForTx} from "@waves/waves-transactions";
import Decimal from 'decimal.js';

export enum LoginType {
    SEED,
    EMAIL
}

class SignerStore extends SubStore {

    signer?: any;

    @observable isApplicationAuthorizedInWavesExchange = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
    }

    initSignerWeb = async () => {
        const pathname = this.rootStore.historyStore!.currentPath;
        const networkByAddress = this.rootStore.accountStore!.getNetworkByAddress(pathname);
        const network = (networkByAddress != null) ? networkByAddress : networks.mainnet;
        if (network.clientOrigin) {
            this.signer = new Signer({NODE_URL: network.server});
            await this.signer.setProvider(new ProviderWeb(network.clientOrigin));
        } else {
            this.signer = undefined;
            this.rootStore.notificationStore.notify(
                `Unfortunately, Exchange does not support a ${network.server} network at this time. Sign in with Keeper.`,
                {type: 'error'}
            )
        }
    }

    initSignerCloud = async () => {
        const pathname = this.rootStore.historyStore!.currentPath;
        const networkByAddress = this.rootStore.accountStore!.getNetworkByAddress(pathname);
        const network = (networkByAddress != null) ? networkByAddress : networks.mainnet;
        if (network.clientOrigin) {
            this.signer = new Signer({NODE_URL: network.server});
            await this.signer.setProvider(new ProviderCloud());
        } else {
            this.signer = undefined;
            this.rootStore.notificationStore.notify(
                `Unfortunately, Exchange does not support a ${network.server} network at this time. Sign in with Keeper.`,
                {type: 'error'}
            )
        }
    }

    login = async (type: LoginType) => {
        if (type === LoginType.SEED) await this.initSignerWeb();
        if (type === LoginType.EMAIL) await this.initSignerCloud();

        console.log('type', type)
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

            tx.payment = tx.payment.map(({tokens: amount, assetId}: any) => {
                const decimals = this.rootStore.accountStore.assets[assetId].decimals
                return ({amount: new Decimal(10).pow(decimals).mul(+amount).toNumber(), assetId})
        }
            )
        }

        try {
            delete tx.fee;
            const transaction = await this.signer!.invoke(tx).broadcast() as any;
            const id = (transaction as any).id || '';
            const {accountStore: {network}, notificationStore} = this.rootStore;
            const link = network ? getExplorerLink(network!.code, id, 'tx') : undefined;
            notificationStore.notify(`Transaction sent: ${transaction.id}\n`, {type: 'info'})

            const res = await waitForTx(transaction.id, {apiBase: network!.server}) as any

            const isFailed = res.applicationStatus && res.applicationStatus === 'script_execution_failed'

            notificationStore.notify(
                isFailed
                    ? `Script execution failed`
                    : `Success`, {type: isFailed ? 'error' : 'success', link, linkTitle: 'View transaction'}
            )
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
