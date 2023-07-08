import Web3 from "web3";
import Contract from "web3-eth-contract";

export const getContract = (abi: any, address: string, provider: Web3) => {
  let contract = new provider.eth.Contract(abi, address);
  return contract;
};

export const getContractNoProvider = (abi: any, address: string) => {
  let contract = new Contract(abi, address);
  return contract;
};