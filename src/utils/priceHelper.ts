import { REFERENCE_STABLECOIN } from '../constants';

export const isReferenceStablecoin = (address: string) => {
    if(address.toLowerCase() == REFERENCE_STABLECOIN.toLowerCase()) {
        return true;
    }
    return false;
}

export const getReferenceStablecoin = () => {
    return REFERENCE_STABLECOIN;
}