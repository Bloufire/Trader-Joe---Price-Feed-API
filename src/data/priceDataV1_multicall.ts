import FACTORY_ABI from '../abis/joe_factory_v1.json';
import ERC20_ABI from '../abis/erc20.json';
import { getReferenceStablecoin, isReferenceStablecoin } from '../utils/priceHelper';
import { getContract } from '../utils/contractHelper';
import { JOE_FACTORY_V1 as JOE_FACTORY, MIN_LIQUIDITY, MULTICALL_CONTRACT } from '../constants';
import { baseWeb3 } from '../utils/web3';
import { getCache, setCache } from '../utils/cache';
import { ContractError } from '../errors/customCodes';
import { MultiCall } from 'eth-multicall';

// Calculate liquidity for a given pair
export const getLiquidity = async (base: string, baseBal: number, quote: string, quoteBal: number) => {
    // If base is a reference stablecoin, return double the base balance
    if(isReferenceStablecoin(base)) {
        return baseBal * 2;
    }
    else if(isReferenceStablecoin(quote)) {
        // If quote is a reference stablecoin, return double the quote balance
        return quoteBal * 2;
    }
    else{
        // Check for pair REFERENCE_STABLECOIN / base 
        const basePrice = await fetchData(getReferenceStablecoin(), base, false);
        if(basePrice) {
            // If price is found, calculate liquidity as baseBal * Price * 2
            return baseBal * (basePrice as number) * 2;
        }
        else {
            // Check for pair REFERENCE_STABLECOIN / quote
            const quotePrice = await fetchData(getReferenceStablecoin(), quote, false);
            if(quotePrice) {
                // If price is found, calculate liquidity as quoteBal * Price * 2
                return quoteBal * quotePrice * 2;
            }
            else {
                // If no price is found for the pair, throw an error
                throw new ContractError(`Can't estimate liquidity in $ for ${base} / ${quote} pair`, 500);
            }
        }
    }
}

// Get the price of a given pair
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
            // If liquidity is below the minimum required, throw an error
            throw new ContractError(`Low liquidity (${liquidityAmount}$) for ${base_asset} / ${quote_asset} pair. Min_Liquidity is : ${(MIN_LIQUIDITY as number) * 10}$`, 500);
        }
    }
  
    // Price = (base_asset_balance / 10^base_asset_decimals) / (quote_asset_balance / 10^quote_asset_decimals)
    return baseBal / quoteBal;
}

// Fetch price data for a given pair
export const fetchData = async (base_asset: string, quote_asset: string, checkLiquidity: boolean = true) => {
    const cacheKey = `single_v1:${base_asset}_${quote_asset}`;
    const invertedCacheKey = `single_v1:${quote_asset}_${base_asset}`;

    // Check if price X / Y is already in cache
    const cachedPrice = getCache(cacheKey);
    if (cachedPrice) {
        // If price is cached, return it
        return cachedPrice;
    }

    // Get Price and check for MIN_LIQUIDITY
    const price = await getPrice(base_asset, quote_asset, checkLiquidity);
    if(!price) {
        return undefined;
    }

    // Store the price in cache for future use
    setCache(cacheKey, price);
    setCache(invertedCacheKey, 1/price);

    return price;
  }