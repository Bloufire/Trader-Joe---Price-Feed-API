import Web3 from 'web3';
import { chainClients } from './web3Helpers';

export const baseWeb3 = (): Web3 => {
  return chainClients.baseClient();
};