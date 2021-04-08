import {SubStore} from '@stores/SubStore';
import {action, autorun, observable, set} from 'mobx';
import {nodeInteraction, waitForTx} from '@waves/waves-transactions';
import {RootStore} from '@stores/RootStore';
import {getCurrentBrowser, getExplorerLink} from '@utils/index';

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
    clientOrigin?: string
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


class KeeperStore extends SubStore {

    constructor(rootStore: RootStore) {
        super(rootStore);
        if (this.isBrowserSupportsWavesKeeper) {
            this.setupWavesKeeper();
        }
        else {
            this.rootStore.notificationStore!.notify('you use unsupported browser', {
                type: 'warning',
                link: "https://docs.waves.tech/en/ecosystem/waves-keeper",
                linkTitle: 'more'
            });
        }
    }

    @observable wavesKeeperAccount?: IWavesKeeperAccount;

    @observable isWavesKeeperInitialized: boolean = false;
    @observable isWavesKeeperInstalled: boolean = false;

    @observable isApplicationAuthorizedInWavesKeeper: boolean = false;

    @action
    login = async () => {
        const resp = window['WavesKeeper'].publicState();
        const publicState = await resp;
        if (publicState.account && publicState.account.address) {
            this.updateNetwork(publicState)
            this.rootStore.accountStore.address = publicState.account.address;
            this.rootStore.accountStore.loginType = 'keeper';

        }
        return resp;
    };


    @action
    updateWavesKeeperAccount = async (publicState: any) => {
        this.rootStore.accountStore.scripted = (await nodeInteraction.scriptInfo(publicState.account.address, publicState.network.server)).script != null;
        const scripted = (await nodeInteraction.scriptInfo(publicState.account.address, publicState.network.server)).script;
        console.log('scripted', scripted)
        this.wavesKeeperAccount && set(this.wavesKeeperAccount, {
            ...publicState.account
        });
    };

    @action
    resetWavesKeeperAccount = () => {
        this.wavesKeeperAccount = undefined;
    };

    @action
    async updateWavesKeeper(publicState: any) {
        this.updateNetwork(publicState);

        if (publicState.account)
            this.rootStore.accountStore.address = publicState.account.address;

        if (this.wavesKeeperAccount) {
            publicState.account
                ? this.updateWavesKeeperAccount(publicState)
                : this.resetWavesKeeperAccount();
        } else {
            this.wavesKeeperAccount = publicState.account;
        }
    }

    @action logout() {

    }

    @action
    updateNetwork = (publicState: any) => {
        if (publicState.network && publicState.network !== this.rootStore.accountStore.network) {
            this.rootStore.accountStore.network = publicState.network;
        }
    };

    setupWavesKeeper = () => {
        let attemptsCount = 0;

        autorun(
            (reaction) => {
                if (attemptsCount === 2) {
                    reaction.dispose();
                    console.error('keeper is not installed');
                    // this.rootStore.notificationStore.notify('keeper is not installed', {
                    //     type: 'warning',
                    //     link: 'https://wavesplatform.com/technology/keeper',
                    //     linkTitle: 'install waves keeper'
                    // });
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


    subscribeToWavesKeeperUpdate() {
        window['WavesKeeper'].on('update', async (publicState: any) => {
            this.updateWavesKeeper(publicState).catch(e => {
                this.rootStore.notificationStore.notify(e, {type: 'error'});
                console.error(e);
            });
        });
    }


    sendTx = (tx: any) => window['WavesKeeper'].signAndPublishTransaction(tx).then(async (tx: any) => {
        const transaction = JSON.parse(tx);
        const {network} = this.rootStore.accountStore;
        const {notificationStore} = this.rootStore
        const link = network ? getExplorerLink(network!.code, transaction.id, 'tx') : undefined;
        console.dir(transaction);
        notificationStore.notify(`Transaction sent: ${transaction.id}\n`, {type: 'info'})

        const res = await waitForTx(transaction.id, {apiBase: network!.server}) as any

        const isFailed = res.applicationStatus && res.applicationStatus === 'script_execution_failed'

        notificationStore.notify(
            isFailed
                ? `Script execution failed`
                : `Success`, {type: isFailed ? 'error' : 'success', link, linkTitle: 'View transaction'}
        )
    }).catch((error: any) => {
        console.error(error);
        this.rootStore.notificationStore.notify(!!error.data ? error.data.toString() : error.data, {type: 'error', title: error.message});
    })

    get isBrowserSupportsWavesKeeper(): boolean {
        const browser = getCurrentBrowser();
        return ['chrome', 'firefox', 'opera', 'edge'].includes(browser);
    }


}


export default KeeperStore;
