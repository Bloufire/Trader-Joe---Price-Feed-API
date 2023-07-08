# Trader Joe - Price Feed API - by BlouFire

Price Feed API for [TraderJoe](https://traderjoexyz.com/) supporting v1, v2 & v2_1 pairs.

---

## How to run

```
npm install
npm run test 
npm start
```

Use Swagger-UI to test different endpoints :
http://localhost:3000/docs

Default environment is AVAX C-Chain
Customizable environment vars:

- CHAIN_ID - If you want to check prices for Arbitrum or BSC. If so, don't forget to update RPC & REFERENCE_STABLECOIN too.
- RPC - If you want to use a custom RPC. Default is 'https://rpc.ankr.com/avalanche'.
- MULTICALL_CONTRACT - Address of a multicall contract. Default is '0x6FfF95AC47b586bDDEea244b3c2fe9c4B07b9F76' (AVAX C-Chain)
- REFERENCE_STABLECOIN - Used to handle low liquidities issues. Default is '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e' (USDC on AVAX C-Chain).
- CACHE_EXPIRATION_TIME - Default cache expiration is 2s (Avg Blocktime for AVAX C-Chain is 2s).
- RATE_LIMIT_REQUESTS - Default is 10 requests / period.
- RATE_LIMIT_PERIOD - Default is 60s.
- MIN_LIQUIDITY - Default is 10$ (for v2 / v2.1), for v1 this value needs to be 10x higher

---

## Specification

### Implementation logic

- Calculates price correctly
- Returns price as X/Y or Y/X
- If there’s no pool for tokenX and tokenY, it returns an error
- Should handle V1, V2 and V2.1 pairs
- Handles low liquidity situations
  - Low liquidity is defined by <$10 of liquidity in each bin in the +/- 5 bins around active bin

### API design

- Uses REST principles
- Should be fetching price directly from the pair contract (or using a multicall contract)
- Should have endpoints to fetch a single pair’s price as well as batch call multiple pairs’ prices
- It should follow this naming convention for a single pair’s price:
  - V1 - GET /v1/prices/base_asset/quote_asset
  - V2 - GET /v2/prices/base_asset/quote_asset/bin_step
  - V2.1 - GET /v2_1/prices/base_asset/quote_asset/bin_step
- It should follow this naming convention for batch fetching multiple pairs:
  - V1 - POST /v1/batch-prices
  - V2 - POST /v2/batch-prices
  - V2.1 - POST /v2_1/batch-prices
  - With a JSON payload that includes addresses of all the pairs it wants to fetch
- Error handling (e.g. HTTP errors, RPC errors, contract errors)
- Performance (e.g. caching, rate-limiting, etc.)
  - Please do not use any persistent databases or data stores; using memory will suffice
  - How might caching strategy differ from chain to chain?

### Tests

- Unit tests
- Integration/end-to-end tests
- Load tests for performance
  - This can be done by writing a script to hit the API locally and reporting the throughput and latency
  - E.g. p99 response time, no. requests per second