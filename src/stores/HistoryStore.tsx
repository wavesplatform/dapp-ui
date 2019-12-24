import { SubStore } from '@stores/SubStore';
import { createBrowserHistory } from "history";
import { RootStore } from "@stores/RootStore";
import { computed, observable } from "mobx";


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

}

export default HistoryStore;
