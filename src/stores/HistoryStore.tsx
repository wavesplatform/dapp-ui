import { SubStore } from '@stores/SubStore';
import { createBrowserHistory } from "history";
import { RootStore } from "@stores/RootStore";
import { computed, observable } from "mobx";


class HistoryStore extends SubStore {

    public history = createBrowserHistory();

    private pathname = window.location.pathname;

    @computed
    get currentPath() {
        return this.pathname.replace('/', '')
    }

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.history.listen((location) => {
            this.pathname = location.pathname
        });
    }

}

export default HistoryStore;
