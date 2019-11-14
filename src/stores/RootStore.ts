import { AccountStore, DappStore, NotificationStore } from './index';

class RootStore {
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;

    constructor() {
        this.accountStore = new AccountStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
    }
}

export { RootStore };
