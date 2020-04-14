import { SubStore } from '@stores/SubStore';
import { createBrowserHistory } from "history";
import { RootStore } from "@stores/RootStore";
import { computed, observable } from "mobx";
import { base58Decode } from "@waves/ts-lib-crypto";
import { _hashChain } from "@waves/ts-lib-crypto/crypto/hashing";


class HistoryStore extends SubStore {
    @observable
    public history = createBrowserHistory();

    @observable
    private location: Location = window.location;

    @computed
    get currentPath() {
        return this.location.pathname.replace('/', '')
    }
    @computed
    get currentHash() {
        return this.location.hash.replace('#', '')
    }

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.history.listen((location) => {
            this.location = location as any
        });
    }

    handleSearch = (value: string) => {
        if (!isValidAddress(value)) {
            this.rootStore.notificationStore.notify('invalid address', {type: 'error'});
            return;
        }
        const network = this.rootStore.accountStore.getNetworkByAddress(value);
        if (network == null) {
            this.rootStore.notificationStore.notify('Cannot find network', {type: 'error'});
            return;
        }
        const history = this.history;
        history.push(value);
        this.rootStore.signerStore.initSigner()
    };

}

function isValidAddress(address: string): boolean {

    try {
        const addressBytes = base58Decode(address);
        return (
            addressBytes.length === 26 &&
            addressBytes[0] === 1 &&
            addressBytes.slice(-4).toString() === _hashChain(addressBytes.slice(0, 22)).slice(0, 4).toString()
        )
    } catch (e) {
        console.error(e)
    }
    return false
}


export default HistoryStore;
