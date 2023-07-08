import { REFERENCE_STABLECOIN } from '../constants';

// Check if the given address is the reference stablecoin
export const isReferenceStablecoin = (address: string) => {
    if(address.toLowerCase() == REFERENCE_STABLECOIN.toLowerCase()) {
        return true;
    }
    return false;
}

// Get the reference stablecoin address
export const getReferenceStablecoin = () => {
    return REFERENCE_STABLECOIN;
}