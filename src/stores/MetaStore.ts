import { action, autorun, observable } from "mobx";

import { SubStore } from '@stores/SubStore';
import { RootStore } from "@stores/RootStore";

import { checkSlash } from '@utils'

import {
    TCallableFuncArguments,
    TCallableFuncArgumentsArray,
    ICallableFuncTypesArray,
    TCallableFuncArgumentsRecord,
} from '@src/interface'

export interface IScriptInfoMeta<TArguments extends TCallableFuncArguments> {
    version: string
    isArrayArguments?: boolean
    callableFuncTypes: Record<string, TArguments>
}

export const isArrayArguments = (scriptInfoMeta: IScriptInfoMeta<TCallableFuncArguments>): scriptInfoMeta is IScriptInfoMeta<TCallableFuncArgumentsArray> => 
    !!scriptInfoMeta.isArrayArguments

export const isRecordArguments = (scriptInfoMeta: IScriptInfoMeta<TCallableFuncArguments>): scriptInfoMeta is IScriptInfoMeta<TCallableFuncArgumentsRecord> => 
    !scriptInfoMeta.isArrayArguments

export interface IScriptInfoMetaRes {
    address: string
    meta: IScriptInfoMeta<TCallableFuncArguments>
}
    
class MetaStore extends SubStore {

    @observable meta: IScriptInfoMeta<TCallableFuncArgumentsArray> | undefined = undefined;
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
                if (!('meta' in res)) {
                    this.isFailed = true;
                } else if (!('callableFuncTypes' in res.meta)) {
                    this.isFailed = true;
                    this.invalidMeta = true;
                } else {
                    if (isArrayArguments(res.meta) ) {
                        this.meta = res.meta;
                    }

                    if (isRecordArguments(res.meta)) {
                        const callableFuncTypes = convertFuncArgumentsRecordToArray(res.meta.callableFuncTypes)

                        this.meta = {
                            ...res.meta,
                            callableFuncTypes
                        };
                    }

                    this.isFailed = false;
                    this.invalidMeta = false;
                }
            }).catch(() => {
                this.isFailed = true
            });
        }else {
            this.isFailed = true;
            this.invalidMeta = true;
        }
    }

}

async function getDappMeta(address: string, server: string): Promise<IScriptInfoMetaRes> {
    //todo handle error
    const path = `${checkSlash(server)}addresses/scriptInfo/${address}/meta`;
    const resp = await fetch(path);
    return await (resp).json();
};

function convertFuncArgumentsRecordToArray(callableFuncTypes: Record<string, TCallableFuncArguments>) {
    return Object.entries(callableFuncTypes)
        .reduce((acc, [funcName, args]) => {
            return {
                ...acc,
                // [funcName]: Object.entries(args).reduce((acc, [name, type]) => {
                [funcName]: Object.values(args).reduce((acc, { name, type }) => {
                    return ([
                        ...acc,
                        { name, type }
                    ])
                }, [] as TCallableFuncArgumentsArray)
            };
        }, {} as ICallableFuncTypesArray)
}

export default MetaStore;
