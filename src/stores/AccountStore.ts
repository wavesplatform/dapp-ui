import {action, autorun, computed, observable} from 'mobx';
import {SubStore} from './SubStore';
import {base58Decode} from '@waves/ts-lib-crypto';
import {IAsset, INetwork} from '@stores/KeeperStore';
import {checkSlash} from '@utils/index';
import {RootStore} from '@stores/RootStore';
import axios from 'axios';

class AccountStore extends SubStore {
    @observable assets: { [name: string]: IAsset } = {'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8}};
    @observable scripted = false;
    @observable network: INetwork | null = null;
    @observable address: string | null = null;
    @observable loginType: 'keeper' | 'exchange' | null = null;

    constructor(rootStore: RootStore) {
        super(rootStore);
        autorun(async () => this.address && await this.updateAccountAssets(this.address));
    }

    @computed get isAuthorized() {
        return this.rootStore.keeperStore.isApplicationAuthorizedInWavesKeeper ||
            this.rootStore.signerStore.isApplicationAuthorizedInWavesExchange;
    }

    @computed get fee() {
        return this.scripted ? '0.009' : '0.005';
    }

    @action
    async updateAccountAssets(address: string) {
        if (!this.network) return;
        const server = this.network.server;
        const path = `${checkSlash(server)}assets/balance/${address}`;
        const resp = await fetch(path);
        const data = (await (resp).json());

        const nftResp = await fetch(`${checkSlash(server)}assets/nft/${address}/limit/1000`);
        const nft: { 'originTransactionId': 'string', 'name': 'string', 'decimals': 0 }[] = (await (nftResp).json());

        const assets: { balances: { assetId: string, issueTransaction: { name: string, decimals: number } }[] } = data;
        assets.balances = [
            ...assets.balances,
            ...nft.map(({originTransactionId, name, decimals}) => ({
                assetId: originTransactionId,
                issueTransaction: {name, decimals}
            }))
        ];

        const ids: any = assets.balances.filter(balance => balance.issueTransaction === null).map(x => x.assetId);
        (await axios.post('/assets/details', {ids}, {baseURL: `${checkSlash(server)}`})).data.map((assetDetails: any) => {
            assets.balances.filter(x => x.assetId === assetDetails.assetId).map(x => {
                x.issueTransaction = {
                    name: assetDetails.name,
                    decimals: assetDetails.decimals
                }

                if ('balances' in assets && !assets.balances.some(x => x.issueTransaction === null)) {
                    this.assets = {
                        'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8},
                        ...assets.balances.reduce((acc, {assetId, issueTransaction: {name, decimals}}) =>
                            ({...acc, [assetId]: {assetId, name, decimals}}), {}),
                    }
                }
            })
        })
    }

    getNetworkByAddress = (address: string): INetwork | null => {
        const byte = String.fromCharCode(base58Decode(address)[1])

        try {
            switch (byte) {
                case 'T':
                    return networks.testnet;
                case 'S':
                    return networks.stagenet;
                case 'W':
                    return networks.mainnet;
                case 'D':
                    return networks.devnet;
                case 'R':
                    return networks.private;
            }

        } catch (e) {
            this.rootStore.notificationStore.notify(e.message, {type: 'error'});
        }
        return null;
    };

}

export const networks = {
    'testnet': {
        server: 'https://nodes-testnet.wavesnodes.com',
        code: 'T',
        clientOrigin: 'https://testnet.waves.exchange/signer/'
    },
    'stagenet': {
        server: 'https://nodes-stagenet.wavesnodes.com',
        code: 'S',
        clientOrigin: 'https://stagenet.waves.exchange/signer/'
    },
    'mainnet': {
        server: 'https://nodes.wavesnodes.com',
        code: 'W',
        clientOrigin: 'https://waves.exchange/signer/'
    },
    'devnet': {server: 'https://devnet1-htz-nbg1-1.wavesnodes.com', code: 'D'},
    'private': {server: 'http://localhost:6869', code: 'R'}
}

export default AccountStore;
