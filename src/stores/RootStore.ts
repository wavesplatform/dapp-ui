import { AccountStore, DappStore, NotificationStore,  HistoryStore, MetaStore} from './index';
import KeeperStore from '@stores/KeeperStore';
import SignerStore from '@stores/SignerStore';
import {SettingsStore} from "@stores/SettingsStore";

class RootStore {
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;
    public historyStore: HistoryStore;
    public metaStore: MetaStore;
    public keeperStore: KeeperStore;
    public signerStore: SignerStore;
    public settingsStore: SettingsStore;

    constructor() {
        this.accountStore = new AccountStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
        this.historyStore = new HistoryStore(this);
        this.metaStore = new MetaStore(this);
        this.keeperStore = new KeeperStore(this)
        this.signerStore = new SignerStore(this)
        this.settingsStore = new SettingsStore(this)
    }
}

export { RootStore };
