import { SubStore } from '@stores/SubStore';
import { RootStore } from "@stores/RootStore";
import { action, autorun, observable } from "mobx";
import { checkSlash } from '@utils'
import { ICallableFuncTypes } from "@stores/DappStore";


export interface IMeta {
    callableFuncTypes?: ICallableFuncTypes
    version?: number
}


class MetaStore extends SubStore {

    @observable meta: IMeta | undefined = undefined;
    @observable isFailed: boolean | undefined = undefined;
    @observable invalidMeta: boolean | undefined = undefined;
    @observable server: string | undefined = undefined;
    @observable byte: string | undefined = undefined;

    constructor(rootStore: RootStore) {
        super(rootStore);

        autorun(() => {
            const pathname = this.rootStore.historyStore.currentPath;
            const network = this.rootStore.accountStore.network;
            if (!network || !network.server || !network.code) {
                const network = this.rootStore.accountStore!.getNetworkByAddress(pathname);
                if (network) this.byte = network.code;

            }
            if (!network || network.code !== this.byte) this.updateMeta();
        })

    }


    @action
    async updateMeta() {
        const pathname = this.rootStore.historyStore.currentPath;
        const network = this.rootStore.accountStore!.getNetworkByAddress(pathname);
        if (network) {
            this.server = network.server;
            this.byte = network.code;
            await getDappMeta(pathname, network.server).then(res => {
                // console.log(res)
                if (!('meta' in res)) {
                    this.isFailed = true;
                } else if (!('callableFuncTypes' in res.meta)) {
                    this.isFailed = true;
                    this.invalidMeta = true;
                } else {
                    this.meta = res.meta;
                    this.isFailed = false;
                    this.invalidMeta = false;
                }
            }).catch(() => {
                this.isFailed = true
            });
        }
        // console.log(this.meta)
        // console.log(this.isFailed)
        // console.log(this.invalidMeta)
        // console.log(this.server)
        // console.log(this.byte)
    }

}

async function getDappMeta(address: string, server: string) {
    //todo handle error
    const path = `${checkSlash(server)}addresses/scriptInfo/${address}/meta`;
    const resp = await fetch(path);
    return await (resp).json();
};


export default MetaStore;
