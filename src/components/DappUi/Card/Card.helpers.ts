import { ICallableArgumentType } from "@src/interface";
import { IArgumentInput } from './Card.interface';

export const convertListTypes = (listType: string) => {
    const inputTypes = [];

    if (listType.includes('Int')) {
        inputTypes.push('Int')
    }
    if (listType.includes('String')) {
        inputTypes.push('String')
    }
    if (listType.includes('Boolean')) {
        inputTypes.push('Boolean')
    }
    if (listType.includes('ByteVector')) {
        inputTypes.push('ByteVector')
    }
    return inputTypes
}

export const defaultValue = (type: ICallableArgumentType) => {
    if (type.startsWith('List')) {
        const listTypes = convertListTypes(type)
        if (listTypes.length === 1) type = listTypes[0] as ICallableArgumentType
        return [{type: type, value: ''}];
    } else return type === 'String' || type === 'ByteVector' ? '' : undefined
};

export const isValidBase64 = (str: string) => /^[A-Za-z0-9+/=]+/g.test(str) || str.length === 0
export const isValidBase58 = (str: string) => (/^[A-Za-z1-9=]+/g.test(str) && !/[O0Il+/]/g.test(str)) || str.length === 0

export const isValidArg = (arg: IArgumentInput) => {
    const { value, type, byteVectorType } = arg;

    if (value === '') {
        return !(type === 'String' || type === 'ByteVector');
    } else if (type === 'ByteVector' && value !== undefined) {
        return !(byteVectorType === 'base58' ? isValidBase58(value as string) : isValidBase64(value as string))
    } else {
        return value === undefined;
    }
}
