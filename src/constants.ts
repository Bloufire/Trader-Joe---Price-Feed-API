import { FACTORY_ADDRESS, ChainId, JOE_ADDRESS } from '@traderjoe-xyz/sdk';
import { LB_FACTORY_ADDRESS, LB_FACTORY_V21_ADDRESS } from '@traderjoe-xyz/sdk-v2';

// API Parameters
const PORT = process.env.PORT || 3000;
const CHAIN_ID = ChainId.AVALANCHE; 
const RPC = process.env.RPC || 'https://avalanche.blockpi.network/v1/rpc/public';
const MULTICALL_CONTRACT = process.env.MULTICALL_CONTRACT || '0x6FfF95AC47b586bDDEea244b3c2fe9c4B07b9F76';
const REFERENCE_STABLECOIN = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'; // USDC on AVAX
const CACHE_EXPIRATION_TIME = process.env.CACHE_EXPIRATION_TIME || 2; // Avg Block Time AVAX C-Chain : 2s 
const RATE_LIMIT_REQUESTS = process.env.RATE_LIMIT_REQUESTS || 10000; // Rate Limit requests : 10 max / period 
const RATE_LIMIT_PERIOD = process.env.RATE_LIMIT_PERIOD || 60000; // Rate limit period : 1min
const MIN_LIQUIDITY = process.env.MIN_LIQUIDITY || 10; // Trigger for low liquidity errors : 10$

// Joe Contracts
const JOE_FACTORY_V1 = process.env.JOE_FACTORY_V1 || FACTORY_ADDRESS[CHAIN_ID];
const JOE_FACTORY_V2 = process.env.JOE_FACTORY_V2 || LB_FACTORY_ADDRESS[CHAIN_ID];
const JOE_FACTORY_V2_1 = process.env.JOE_FACTORY_V2_1 || LB_FACTORY_V21_ADDRESS[CHAIN_ID];
const JOE_TOKEN = process.env.JOE_TOKEN || JOE_ADDRESS[CHAIN_ID];

// Bin Constants
const SCALE_OFFSET = process.env.SCALE_OFFSET || 128;
const SCALE = process.env.SCALE || (1 << (SCALE_OFFSET as number));
const BASIS_POINT_MAX = process.env.BASIS_POINT_MAX || 10_000;
const REAL_ID_SHIFT = process.env.REAL_ID_SHIFT || (1 << 23);
const PRECISION = process.env.PRECISION || 1e18;

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
