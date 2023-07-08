import FACTORY_ABI from '../abis/joe_factory_v1.json';
import ERC20_ABI from '../abis/erc20.json';
import { getReferenceStablecoin, isReferenceStablecoin } from '../utils/priceHelper';
import { getContract } from '../utils/contractHelper';
import { JOE_FACTORY_V1 as JOE_FACTORY, MIN_LIQUIDITY, MULTICALL_CONTRACT } from '../constants';
import { baseWeb3 } from '../utils/web3';
import { getCache, setCache } from '../utils/cache';
import { ContractError } from '../errors/customCodes';
import { MultiCall } from 'eth-multicall';

export const getLiquidity = async (base: string, baseBal: number, quote: string, quoteBal: number) => {
    if(isReferenceStablecoin(base)) {
        return baseBal * 2;
    }
    else if(isReferenceStablecoin(quote)) {
        return quoteBal * 2;
    }
    else{
        // Check for pair REFERENCE_STABLECOIN / base 
        const basePrice = await getPrice(getReferenceStablecoin(), base, false);
        if(basePrice) {
            // If Price is found, liquidity = baseBal * Price * 2
            return baseBal * (basePrice as number) * 2;
        }
        else {
            // Check for pair REFERENCE_STABLECOIN / quote
            const quotePrice = await getPrice(getReferenceStablecoin(), quote, false);
            if(quotePrice) {
                // If Price is found, liquidity = quoteBal * Price * 2
                return quoteBal * quotePrice * 2;
            }
            else {
                throw new ContractError(`Can't estimate liquidity in $ for ${base} / ${quote} pair`, 500);
            }
        }
    }
}

export const getPrice = async (base_asset: string, quote_asset: string, checkLiquidity: boolean) => {
    // Get Pair from Joe Factory
    const joeFactory = getContract(FACTORY_ABI, JOE_FACTORY, baseWeb3());    
    const pairAddress = await joeFactory.methods.getPair(base_asset, quote_asset).call();
  
    // Check if pool exists for this pair
    if(pairAddress == "0x0000000000000000000000000000000000000000") {
      return undefined;
    }
  
    const multicall = new MultiCall(baseWeb3() as any, MULTICALL_CONTRACT);

    const baseAssetContract = getContract(ERC20_ABI, base_asset, baseWeb3());    
    const quoteAssetContract = getContract(ERC20_ABI, quote_asset, baseWeb3());    
    const decimalCalls = [];
    const balanceCalls = [];
    decimalCalls.push(
        { decimals: baseAssetContract.methods.decimals() },
        { decimals: quoteAssetContract.methods.decimals() }
    ); 
    balanceCalls.push(
        { balance: baseAssetContract.methods.balanceOf(pairAddress) },
        { balance: quoteAssetContract.methods.balanceOf(pairAddress) },
    );
    const assets_data_multicall = await multicall.all([decimalCalls, balanceCalls]);

    const baseBal = (assets_data_multicall[1][0].balance / 10**assets_data_multicall[0][0].decimals);
    const quoteBal = (assets_data_multicall[1][1].balance / 10**assets_data_multicall[0][1].decimals);

    if(checkLiquidity) {
        const liquidityAmount = await getLiquidity(base_asset, baseBal, quote_asset, quoteBal) as number;
        if(liquidityAmount < (MIN_LIQUIDITY as number) * 10) {
            throw new ContractError(`Low liquidity (${liquidityAmount}$) for ${base_asset} / ${quote_asset} pair. Min_Liquidity is : ${(MIN_LIQUIDITY as number) * 10}$`, 500);
        }
    }
  
    // Price = (base_asset_balance / 10^base_asset_decimals) / (quote_asset_balance / 10^quote_asset_decimals)
    return baseBal / quoteBal;
}

export const fetchData = async (base_asset: string, quote_asset: string) => {
    const cacheKey = `single_v1:${base_asset}_${quote_asset}`;
    const invertedCacheKey = `single_v1:${quote_asset}_${base_asset}`;

    // Check if price X / Y is already in cache
    const cachedPrice = getCache(cacheKey);
    if (cachedPrice) {
        return cachedPrice;
    }

    // Get Price and checks for MIN_LIQUIDITY
    const price = await getPrice(base_asset, quote_asset, true);
    if(!price) {
        return undefined;
    }

    // Store the price in cache for future use
    setCache(cacheKey, price);
    setCache(invertedCacheKey, 1/price);

    return price;
  }