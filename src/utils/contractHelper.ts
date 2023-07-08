import Web3 from "web3";
import Contract from "web3-eth-contract";

// Function to get a contract instance with a provider
export const getContract = (abi: any, address: string, provider: Web3) => {
  let contract = new provider.eth.Contract(abi, address); // Creating a new contract instance using the ABI and address with the specified provider
  return contract; // Returning the contract instance
};

// Function to get a contract instance without a provider
export const getContractNoProvider = (abi: any, address: string) => {
  let contract = new Contract(abi, address); // Creating a new contract instance using the ABI and address without a specific provider
  return contract; // Returning the contract instance
};