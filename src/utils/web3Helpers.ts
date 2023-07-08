import Web3 from 'web3';

import {
    RPC,
} from '../constants';

export const chainClients = {
    // Define a function named 'baseClient' that returns a new instance of Web3
    baseClient: () => new Web3(new Web3.providers.HttpProvider(RPC)),
};