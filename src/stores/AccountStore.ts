import { action, autorun, computed, observable } from 'mobx';
import { SubStore } from './SubStore';
import { base58Decode } from '@waves/ts-lib-crypto';
import { IAsset, INetwork } from '@stores/KeeperStore';
import { checkSlash } from '@utils/index';
import { RootStore } from '@stores/RootStore';

class AccountStore extends SubStore {
    @observable assets: { [name: string]: IAsset } = {'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8}};
    @observable scripted = false;
    @observable network: INetwork | null = null;
    @observable address: string | null = null;
    @observable loginType: 'keeper' | 'exchange' | null = null;

    constructor(rootStore: RootStore){
        super(rootStore)

        autorun(async () => {
            console.log(this.address)
            if(this.address){
                await this.updateAccountAssets(this.address);
            }
        })
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
        if (!this.network ) return;
        const server = this.network.server;
        const path = `${checkSlash(server)}assets/balance/${address}`;
        const resp = await fetch(path);
        const data = (await (resp).json())
        const assets: { balances: { assetId: string, issueTransaction: { name: string, decimals: number } }[] } = data;
        if ('balances' in assets) {

            this.rootStore.accountStore.assets = {
                'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8},
                ...assets.balances.reduce((acc, {assetId, issueTransaction: {name, decimals}}) =>
                    ({...acc, [assetId]: {assetId, name, decimals}}), {})
            };
        }
    }

    getNetworkByAddress = (address: string): INetwork | null => {
        try {
            switch (String.fromCharCode(base58Decode(address)[1])) {
                case 'T':
                    return {server: 'https://nodes-testnet.wavesnodes.com', code: 'T'};
                case 'S':
                    return {server: 'https://nodes-stagenet.wavesnodes.com', code: 'S'};
                case 'W':
                    return {server: 'https://nodes.wavesnodes.com', code: 'W'};
                case 'D':
                    return {server: 'http://localhost:3000', code: 'D'};
                case 'R':
                    return {server: 'http://localhost:6869', code: 'R'};
            }

        } catch (e) {
            this.rootStore.notificationStore.notify(e.message, {type: 'error'});
        }
        return null;
    };

}

export default AccountStore;
