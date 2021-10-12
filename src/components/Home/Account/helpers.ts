import { wavesAddress2eth } from '@waves/node-api-js'

import { EAddressType } from './interface';

export const addressByType = (wavesAddres: string, type: EAddressType): string => {
    if (type === EAddressType.WAVES) {
        return wavesAddres;
    } else {
        return wavesAddress2eth(wavesAddres);
    }
}
