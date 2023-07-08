import { Request, Response } from 'express';
import { fetchData } from '../data/priceDataV2_multicall';
import { ContractError, HTTPError, RPCError } from '../errors/customCodes';

// Fetch price for a single pair
export const getSinglePairPrice = async (req: Request, res: Response) => {
  const { base_asset, quote_asset, bin_step } = req.params;

  try {
    // Get Price from v1
    const price = await fetchData(base_asset, quote_asset, bin_step);
    if(price) {
      res.json({ price });
    }
    else{
      throw new ContractError(`pair ${base_asset} / ${quote_asset} / ${bin_step} doesn't exist in JoeFactory v2`, 500);
    }
  }
  catch (error) {
    if(error instanceof ContractError) {
      res.status((error as ContractError).code).json({ error: { type: error.name, message: error.stack } });
    }
    else if(error instanceof RPCError) {
      res.status((error as RPCError).code).json({ error: { type: error.name, message: error.stack } });
    }
    else if(error instanceof HTTPError) {
      res.status((error as HTTPError).code).json({ error: { type: error.name, message: error.stack } });
    }
    else {
      res.status(500).json({ error: { type: 'Unknown', message: `Unknow error occured : ${error}` } });
    }
  }
};

// Fetch prices for multiple pairs (batch)
export const getBatchPrices = async (req: Request, res: Response) => {
  const { pairs } = req.body;

  // Prepare an object to store prices
  const prices: { [key: string]: number | undefined } = {};

  try {
    // Fetch prices for each pair in parallel
    await Promise.all(
      pairs.map(async (pair: { base_asset: string; quote_asset: string; bin_step: string }) => {
        const { base_asset, quote_asset, bin_step } = pair;

        // Get Price from v1
        const price = await fetchData(base_asset, quote_asset, bin_step);
        if(price) {
          prices[`${base_asset}_${quote_asset}_${bin_step}`] = price;
        }
        else {
          throw new ContractError(`pair ${base_asset} / ${quote_asset} / ${bin_step} doesn't exist in JoeFactory v2`, 500);
        }
        
      })
    );

    res.json(prices);
  } 
  catch (error) {
    if(error instanceof ContractError) {
      res.status((error as ContractError).code).json({ error: { type: error.name, message: error.stack } });
    }
    else if(error instanceof RPCError) {
      res.status((error as RPCError).code).json({ error: { type: error.name, message: error.stack } });
    }
    else if(error instanceof HTTPError) {
      res.status((error as HTTPError).code).json({ error: { type: error.name, message: error.stack } });
    }
    else {
      res.status(500).json({ error: { type: 'Unknown', message: `Unknow error occured : ${error}` } });
    }
  }
};

module.exports = {
  getSinglePairPrice,
  getBatchPrices,
};
