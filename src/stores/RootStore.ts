import { AccountStore, DappStore, NotificationStore,  HistoryStore, MetaStore} from './index';

class RootStore {
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;
    public historyStore: HistoryStore;
    public metaStore: MetaStore;

    constructor() {
        this.accountStore = new AccountStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
        this.historyStore = new HistoryStore(this);
        this.metaStore = new MetaStore(this);
    }
}

export { RootStore };
