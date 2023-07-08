import Web3 from 'web3';
import { chainClients } from './web3Helpers';

// Function to create a base Web3 client
export const baseWeb3 = (): Web3 => {
  return chainClients.baseClient();
};