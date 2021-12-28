/** @jsx jsx **/
import { ICallableArgumentType, TCallableFuncArgumentsArray } from "@src/interface";

import DappStore from "@stores/DappStore";
import AccountStore from '@stores/AccountStore';
import {InvokeScriptTransaction, SignedTransaction} from "@waves/ts-types";

export interface IArgument {
    type: ICallableArgumentType,
    value: string | undefined | IArgumentInput[]
    byteVectorType?: 'base58' | 'base64'
}

export interface IArgumentInput {
    type: ICallableArgumentType,
    value: string | undefined
    byteVectorType?: 'base58' | 'base64'
}

export interface IInjectedProps {
    dappStore?: DappStore
    accountStore?: AccountStore
}

export interface IProps extends IInjectedProps {
    funcName: string
    funcArgs: TCallableFuncArgumentsArray
    address: string
    key?: string
}

export interface IState {
    args: { [name: string]: IArgument }
    payments: { assetId: string, tokens: string }[]
    address: string | null
    isJsonModalOpen: boolean
    transactionData: undefined | SignedTransaction<InvokeScriptTransaction>
}
