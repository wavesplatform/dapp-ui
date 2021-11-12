import { TCallableFuncArgumentsArray } from '@waves/node-api-js';

export type {
    ICallableFuncArgumentType as ICallableArgumentType,
    TCallableFuncArgumentsArray,
    TCallableFuncArgumentsRecord,
    TCallableFuncArguments,
} from '@waves/node-api-js';

export type ICallableFuncTypesArray = Record<string, TCallableFuncArgumentsArray>
