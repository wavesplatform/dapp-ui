import { AccountStore, DappStore, SettingsStore, NotificationStore } from './index';

class RootStore {
    public accountStore: AccountStore;
    public settingsStore: SettingsStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;

    constructor(initState?: any) {
        if (initState == null) {
            initState = {};
        }
        this.settingsStore = new SettingsStore(this, initState.settingsStore);
        this.accountStore = new AccountStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
    }

    serialize = () => ({
        settingsStore: this.settingsStore.serialize(),
    })
}

export { RootStore };
