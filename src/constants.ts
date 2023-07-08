import { FACTORY_ADDRESS, ChainId, JOE_ADDRESS } from '@traderjoe-xyz/sdk';
import { LB_FACTORY_ADDRESS, LB_FACTORY_V21_ADDRESS } from '@traderjoe-xyz/sdk-v2';

// API Parameters
const PORT = process.env.PORT || 3000; // Port number for the server
const CHAIN_ID = ChainId.AVALANCHE; // Chain ID for AVAX C-CHAIN
const RPC = process.env.RPC || 'https://rpc.ankr.com/avalanche';
const MULTICALL_CONTRACT = process.env.MULTICALL_CONTRACT || '0x6FfF95AC47b586bDDEea244b3c2fe9c4B07b9F76'; // Multicall contract address
const REFERENCE_STABLECOIN = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'; // Reference stablecoin address for liquidity calculation (USDC on AVAX)
const CACHE_EXPIRATION_TIME = process.env.CACHE_EXPIRATION_TIME || 2; // Cache expiration time in seconds (default: 2s - AVAX C-Chain Avg Block Time: 2s)
const RATE_LIMIT_REQUESTS = process.env.RATE_LIMIT_REQUESTS || 10000; // Maximum number of requests allowed within the rate limit period (default: 10,000)
const RATE_LIMIT_PERIOD = process.env.RATE_LIMIT_PERIOD || 60000; // Rate limit period in milliseconds (default: 1 minute)
const MIN_LIQUIDITY = process.env.MIN_LIQUIDITY || 10; // Minimum liquidity threshold for triggering low liquidity errors (default: $10)

// Joe Contracts
const JOE_FACTORY_V1 = process.env.JOE_FACTORY_V1 || FACTORY_ADDRESS[CHAIN_ID]; // Joe Factory V1 contract address
const JOE_FACTORY_V2 = process.env.JOE_FACTORY_V2 || LB_FACTORY_ADDRESS[CHAIN_ID]; // Joe Factory V2 contract address
const JOE_FACTORY_V2_1 = process.env.JOE_FACTORY_V2_1 || LB_FACTORY_V21_ADDRESS[CHAIN_ID]; // Joe Factory V2.1 contract address
const JOE_TOKEN = process.env.JOE_TOKEN || JOE_ADDRESS[CHAIN_ID]; // Joe token contract address

// Bin Constants
const SCALE_OFFSET = process.env.SCALE_OFFSET || 128; // Scale offset value
const SCALE = process.env.SCALE || (1 << (SCALE_OFFSET as number)); // Scale value
const BASIS_POINT_MAX = process.env.BASIS_POINT_MAX || 10_000; // Maximum basis point value
const REAL_ID_SHIFT = process.env.REAL_ID_SHIFT || (1 << 23); // Real ID shift value
const PRECISION = process.env.PRECISION || 1e18; // Precision value

// Exporting variables for external use
export {
  PORT,
  RPC,
  CHAIN_ID,

  JOE_FACTORY_V1,
  JOE_FACTORY_V2,
  JOE_FACTORY_V2_1,
  MULTICALL_CONTRACT,
  REFERENCE_STABLECOIN,
  SCALE_OFFSET,
  SCALE,
  BASIS_POINT_MAX,
  REAL_ID_SHIFT,
  PRECISION,
  JOE_TOKEN,

  CACHE_EXPIRATION_TIME,
  RATE_LIMIT_REQUESTS,
  RATE_LIMIT_PERIOD,
  MIN_LIQUIDITY,
};
