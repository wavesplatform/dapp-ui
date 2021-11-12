export type ICallableArgumentType = 'Int' | 'String' | 'ByteVector' | 'Boolean'

export type TCallableFuncArgumentsArray = { name: string, type: ICallableArgumentType }[]
export type TCallableFuncArgumentsRecord = Record<string, ICallableArgumentType>
export type TCallableFuncArguments = TCallableFuncArgumentsArray | TCallableFuncArgumentsRecord 

export type ICallableFuncTypesArray = Record<string, TCallableFuncArgumentsArray>
