import Web3 from 'web3';

import {
    RPC,
} from '../constants';

export const chainClients = {
    baseClient: () => new Web3(new Web3.providers.HttpProvider(RPC)),
};