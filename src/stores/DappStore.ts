import { SubStore } from './SubStore';
import { checkSlash } from '@utils'

export interface IArgumentInput {
    type: ICallableArgumentType,
    value: string | undefined
}


export type ICallableArgumentType =
    'Int' | 'String' | 'ByteVector' | 'Boolean'


export interface ICallableFuncArgument {
    [arg: string]: ICallableArgumentType
}

export interface ICallableFuncTypes {
    [func: string]: ICallableFuncArgument
}

export interface IMeta {
    callableFuncTypes: ICallableFuncTypes
}


interface IKeeperTransactionDataCallArg {
    type: string,
    value: string | number | boolean
}

interface IKeeperTransactionDataCall {
    function: string,
    args: IKeeperTransactionDataCallArg[]
}

interface IKeeperTransactionDataFee {
    tokens: string,
    assetId: string
}

interface IKeeperTransactionPayment {
    assetId: string,
    tokens: number
}

interface IKeeperTransactionData {
    dApp: string,
    call: IKeeperTransactionDataCall,
    payment: IKeeperTransactionPayment[]
    fee: IKeeperTransactionDataFee,
}

export interface IKeeperTransaction {
    type: number,
    data: IKeeperTransactionData
}

class DappStore extends SubStore {

    getDappMeta = async (address: string, server: string) => {
        const path = `${checkSlash(server)}addresses/scriptInfo/${address}/meta`;
        const resp = await fetch(path);
        return await (resp).json();
    };

    private convertArgValue = (type: ICallableArgumentType, value?: string): (string | number | boolean) => {
        if (value === undefined){
            this.rootStore.notificationStore.notify('value is undefined', {type: 'error'});
            return ''
        }
        if (type === 'Boolean' && ['true', 'false'].includes(value)) return value === 'true';
        if (type === 'Int' && !isNaN(+value)) return +value;
        else return value
    };

    private convertArgs = (args: IArgumentInput[]): IKeeperTransactionDataCallArg[] =>
        args.filter(({value}) => value !== undefined)
            .map(({type, value}) => ({type, value: this.convertArgValue(type, value)}));

    callCallableFunction = (address: string, func: string, args: IArgumentInput[], payment: IKeeperTransactionPayment[]) => {
        const {accountStore} = this.rootStore;
        const transactionData: IKeeperTransactionData = {
            dApp: address,
            call: {
                function: func,
                args: this.convertArgs(args)
            },
            fee: {tokens: '0.005', assetId: 'WAVES'},
            payment
        };

        const tx: IKeeperTransaction = {
            type: 16,
            data: transactionData
        };

        if (!accountStore.isApplicationAuthorizedInWavesKeeper) {
            this.rootStore.notificationStore.notify('Application is not authorized in WavesKeeper', {type: 'warning'});
            return
        }
        window['WavesKeeper'].signAndPublishTransaction(tx).then((tx: any) => {
            const transaction = JSON.parse(tx);
            const {network} = accountStore.wavesKeeperAccount!;
            console.log(transaction);
            this.rootStore.notificationStore
                .notify(`${accountStore.network!.server}\n do not forget to choose a network`,
                    {
                        type: 'info',
                        link: `https://wavesexplorer.com/${network === 'mainnet' ? '' : `${network}/`}tx/${transaction.id}`,
                        linkTitle: 'show in explorer'
                    })

        }).catch((error: any) => {
            console.error(error);
            this.rootStore.notificationStore.notify(error.data, {type: 'error', title: error.message});
        });
    };

}

export default DappStore;
