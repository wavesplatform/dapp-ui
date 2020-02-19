import { computed, observable } from 'mobx';
import { SubStore } from './SubStore';
import { base58Decode } from '@waves/ts-lib-crypto';
import { IAsset, INetwork } from '@stores/KeeperStore';

class AccountStore extends SubStore {
    @observable assets: { [name: string]: IAsset } = {'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8}};
    @observable scripted = false;
    @observable network: INetwork | null = null;
    @observable address: string | null = null;
    @observable loginType: 'keeper' | 'exchange' | null = null;

    @computed get isAuthorized() {
        return this.rootStore.keeperStore.isApplicationAuthorizedInWavesKeeper ||
            this.rootStore.signerStore.isApplicationAuthorizedInWavesExchange;
    }

    @computed get fee() {
        return this.scripted ? '0.009' : '0.005';
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
