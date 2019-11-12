import { action, autorun, computed, observable, set } from 'mobx';
import { SubStore } from './SubStore';
import { checkSlash, getCurrentBrowser } from '@utils';
import { base58Decode } from '@waves/ts-lib-crypto'

interface IWavesKeeperAccount {
    address: string
    name: string
    network: string
    networkCode: string
    publicKey: string
    type: string
    balance: {
        available: string
        leasedOut: string
        network: string
    }
}

export interface INetwork {
    code: string,
    server: string,
    matcher?: string
}

interface IKeeperError {
    code: string
    data: any
    message: string
}

export interface IAsset {
    assetId: string
    name: string
    decimals: number
}

class AccountStore extends SubStore {
    @observable applicationNetwork: string = 'custom';
    @observable wavesKeeperAccount?: IWavesKeeperAccount;

    @observable isWavesKeeperInitialized: boolean = false;
    @observable isWavesKeeperInstalled: boolean = false;

    @observable isApplicationAuthorizedInWavesKeeper: boolean = false;

    @observable network: INetwork | null = null;
    @observable assets: { [name: string]: IAsset } = {'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8}};

    @computed
    get isBrowserSupportsWavesKeeper(): boolean {
        const browser = getCurrentBrowser();
        return ['chrome', 'firefox', 'opera', 'edge'].includes(browser);
    }


    @action
    async updateAccountAssets(publicState: any) {
        if (!publicState || !publicState.network || !publicState.account) return;
        const server = publicState.network.server;
        const path = `${checkSlash(server)}assets/balance/${publicState.account.address}`;
        const resp = await fetch(path);
        const assets: { balances: { assetId: string, issueTransaction: { name: string, decimals: number } }[] } = await (resp).json();
        if ('balances' in assets) {

            this.assets = {
                'WAVES': {name: 'WAVES', assetId: 'WAVES', decimals: 8},
                ...assets.balances.reduce((acc, {assetId, issueTransaction: {name, decimals}}) =>
                    ({...acc, [assetId]: {assetId, name, decimals}}), {})
            };
        }
    }

    @action
    updateWavesKeeperAccount = (account: IWavesKeeperAccount) => {
        this.wavesKeeperAccount && set(this.wavesKeeperAccount, {
            ...account
        });
    };

    @action
    resetWavesKeeperAccount = () => {
        this.wavesKeeperAccount = undefined;
    };

    @action
    async updateWavesKeeper(publicState: any) {
        this.updateNetwork(publicState);
        this.updateAccountAssets(publicState);
        if (this.wavesKeeperAccount) {
            publicState.account
                ? this.updateWavesKeeperAccount(publicState.account)
                : this.resetWavesKeeperAccount();
        } else {
            this.wavesKeeperAccount = publicState.account;
        }
    }

    @action
    updateNetwork = (publicState: any) => {
        if (publicState.network && publicState.network !== this.network) {
            this.network = publicState.network;
        }
    };

    setupWavesKeeper = () => {
        let attemptsCount = 0;

        autorun(
            (reaction) => {
                if (attemptsCount === 2) {
                    reaction.dispose();
                    console.error('keeper is not installed');
                    this.rootStore.notificationStore.notify('keeper is not installed', {
                        type: 'warning',
                        link: "https://wavesplatform.com/technology/keeper",
                        linkTitle: 'install waves keeper'
                    });
                } else if (window['WavesKeeper']) {
                    reaction.dispose();
                    this.isWavesKeeperInstalled = true;
                } else {
                    attemptsCount += 1;
                }
            },
            {scheduler: run => setInterval(run, 1000)}
        );
    };

    @action
    setupSynchronizationWithWavesKeeper = () => {
        window['WavesKeeper'].initialPromise
            .then((keeperApi: any) => {
                this.isWavesKeeperInitialized = true;
                return keeperApi;
            })
            .then((keeperApi: { publicState: () => void; }) => keeperApi.publicState())
            .then((publicState: any) => {
                this.isApplicationAuthorizedInWavesKeeper = true;
                this.updateWavesKeeper(publicState).catch(e => {
                    this.rootStore.notificationStore.notify(e, {type: 'error'});
                    console.error(e);
                });
                this.subscribeToWavesKeeperUpdate();
            })
            .catch((error: IKeeperError) => {
                if (error.code === '14') {
                    this.isApplicationAuthorizedInWavesKeeper = true;
                    this.subscribeToWavesKeeperUpdate();
                } else {
                    this.isApplicationAuthorizedInWavesKeeper = false;
                }
            });
    };

    login = async () => {
        const resp = window['WavesKeeper'].publicState();
        const publicState = await resp;
        if (publicState.account && publicState.account.address) {
        }
        return resp;
    };

    subscribeToWavesKeeperUpdate() {
        window['WavesKeeper'].on('update', async (publicState: any) => {
            this.updateWavesKeeper(publicState).catch(e => {
                this.rootStore.notificationStore.notify(e, {type: 'error'});
                console.error(e);
            });
        });
    }

    getNetworkByAddress = (address: string): INetwork | null => {
        try {
            switch (String.fromCharCode(base58Decode(address)[1])) {
                case 'T':
                    return {server: 'https://nodes-testnet.wavesnodes.com', code: 'T'};
                case 'S':
                    return {server: 'https://nodes-stagenet.wavesnodes.com', code: 'S'};
                case 'W':
                    return {server: 'https://nodes.wavesplatform.com', code: 'W'};
            }

        } catch (e) {
            this.rootStore.notificationStore.notify(e.message, {type: 'error'})
        }
        return null
    }

}

export default AccountStore;
