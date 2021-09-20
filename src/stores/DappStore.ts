import {SubStore} from './SubStore';
import {ICallableArgumentType} from './MetaStore';
import {IArgument, IArgumentInput} from '@components/DappUi/Card';
import {base58Decode, base64Encode} from '@waves/ts-lib-crypto';
import { ELoginType } from '@src/interface';

interface IKeeperTransactionDataCallArg {
    type: string,
    value: string | number | boolean | { type: string, value: string | number | boolean }[]
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


    private convertArgValue = (arg: IArgumentInput): (string | number | boolean) => {
        const {value, type, byteVectorType} = arg;
        if (value === undefined) {
            this.rootStore.notificationStore.notify('value is undefined', {type: 'error'});
            return '';
        }
        if (type === 'Boolean' && ['true', 'false'].includes(value)) return value === 'true';
        if (type === 'Int' && !isNaN(+value)) return +value;
        if (byteVectorType === 'base58') return `base64:${b58strTob64Str(value as string)}`;
        if (byteVectorType === 'base64') return `base64:${value}`;
        else return value;
    };

    private convertArgValueList = (value: IArgumentInput[]): IArgumentInput[] => value.map(item => {
        return {...item, type: convertArgType(item.type), value: this.convertArgValue(item)} as IArgumentInput;
    });

    private convertArgs = (args: IArgument[]): IKeeperTransactionDataCallArg[] =>
        args.filter(({value}) => value !== undefined || !(value as unknown as IArgumentInput[]).some(item => item.value === undefined))
            .map(arg => {
                const convertedValue = arg.type.startsWith('List')
                    ? this.convertArgValueList(arg.value as IArgumentInput[])
                    : this.convertArgValue(arg as IArgumentInput)
                return ({type: convertArgType(arg.type), value: convertedValue} as IKeeperTransactionDataCallArg)
            });

    callCallableFunction = (address: string, func: string, inArgs: IArgument[], payment: IKeeperTransactionPayment[]) => {
        const {accountStore} = this.rootStore;
        let args: IKeeperTransactionDataCallArg[] = [];
        try {
            args = this.convertArgs(inArgs);
        } catch (e) {
            console.error(e);
            this.rootStore.notificationStore.notify(e, {type: 'error'});
        }

        const transactionData: IKeeperTransactionData = {
            dApp: address,
            call: {
                function: func,
                args
            },
            fee: {tokens: this.rootStore.accountStore.fee, assetId: 'WAVES'},
            payment
        };

        const tx: IKeeperTransaction = {
            type: 16,
            data: transactionData
        };


        if (!accountStore.isAuthorized || !accountStore.loginType) {
            this.rootStore.notificationStore.notify('Application is not authorized', {type: 'warning'});
            return;
        }

        if (accountStore.loginType === ELoginType.KEEPER) {
            return this.rootStore.keeperStore.sendTx(tx)
        }

        if (accountStore.loginType === ELoginType.EXCHANGE) this.rootStore.signerStore.sendTx(tx)

    };
}


export function b58strTob64Str(str = ''): string {
    const error = 'incorrect base58';
    try {
        return base64Encode(base58Decode(str));
    } catch (e) {
        throw error;
    }
}

function convertArgType(type: ICallableArgumentType | string): string {
    if (type.startsWith('List')) return 'list';
    switch (type) {
        case 'Boolean':
            return 'boolean';
        case 'ByteVector':
            return 'binary';
        case 'Int':
            return 'integer';
        case 'String':
            return 'string';
    }
    return type;
};
export default DappStore;
