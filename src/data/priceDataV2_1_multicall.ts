import ERC20_ABI from '../abis/erc20.json';
import { getReferenceStablecoin, isReferenceStablecoin } from '../utils/priceHelper';
import { getContract } from '../utils/contractHelper';
import { JOE_FACTORY_V2_1 as JOE_FACTORY, MIN_LIQUIDITY, MULTICALL_CONTRACT } from '../constants';
import { baseWeb3 } from '../utils/web3';
import { getCache, setCache } from '../utils/cache';
import { Bin, LBFactoryV21ABI, LBPairV21ABI } from '@traderjoe-xyz/sdk-v2';
import { ContractError } from '../errors/customCodes';
import { MultiCall } from 'eth-multicall';

export const getLiquidity = async (pairAddress: string, base: string, base_asset_decimals: number, quote: string, quote_asset_decimals: number, bin_step: string, activeBinId: number) => {
    // Get liquidity amounts for this bin
    const pairContract = getContract(LBPairV21ABI, pairAddress, baseWeb3());
    const liquidity_data = await pairContract.methods.getBin(activeBinId).call();
    const baseBal = liquidity_data[0] / (10**base_asset_decimals);
    const quoteBal = liquidity_data[1] / (10**quote_asset_decimals);
    const binPrice = Bin.getPriceFromId(activeBinId, bin_step as unknown as number);
    const pairPrice = binPrice * 10**(base_asset_decimals - quote_asset_decimals);
    if(isReferenceStablecoin(base)) {
        // Liquidity = BaseBal + QuoteBal * unit price
        return baseBal + (quoteBal * (1/pairPrice));
    }
    else if(isReferenceStablecoin(quote)) {
        // Liquidity = QuoteBal + BaseBal * unit price
        return quoteBal + (baseBal * pairPrice);
    }
    else{
        // Check for pair REFERENCE_STABLECOIN / base 
        // Looking for bin_step, which can differ from the one used for the pair
        const joeFactory = getContract(LBFactoryV21ABI, JOE_FACTORY, baseWeb3());    
        const baseLBInformations = await joeFactory.methods.getAllLBPairs(getReferenceStablecoin(), base).call();
        let stablePair_binStep = bin_step;
        for(let baseLBInfo of baseLBInformations) {
            // Check for a pair where "createdByOwner = true"
            if(baseLBInfo[2] == true) {
                // Use this bin_step for liquidity calculation
                stablePair_binStep = baseLBInfo[0];
            }
        }
        const basePrice = await fetchData(getReferenceStablecoin(), base, stablePair_binStep, false);
        if(basePrice) {
            // If Price is found, liquidity = baseBal + (quoteBal => baseBal) * Price
            return (baseBal + (quoteBal * (1/pairPrice)) ) * (basePrice as number);
        }
        else {
            // Check for pair REFERENCE_STABLECOIN / quote
            const quoteLBInformations = await joeFactory.methods.getAllLBPairs(getReferenceStablecoin(), quote).call();
            for(let quoteLBInfo of quoteLBInformations) {
                // Check for a pair where "createdByOwner = true"
                if(quoteLBInfo[2] == true) {
                    // Use this bin_step for liquidity calculation
                    stablePair_binStep = quoteLBInfo[0];
                }
            }
            const quotePrice = await fetchData(getReferenceStablecoin(), quote, stablePair_binStep, false);
            if(quotePrice) {
                // If Price is found, liquidity = baseBal + (quoteBal => baseBal) * Price
                return (quoteBal + (baseBal * pairPrice) ) * (quotePrice as number);
            }
            else {
                throw new ContractError(`Can't estimate liquidity in $ for ${base} / ${quote} / ${bin_step} pair`, 500);
            }
        }
    }
}

export const getPrice = async (base_asset: string, quote_asset: string, bin_step: string, checkLiquidity: boolean) => {
    // Get Pair from Joe Factory
    const joeFactory = getContract(LBFactoryV21ABI, JOE_FACTORY, baseWeb3());    
    const lbInformations = await joeFactory.methods.getLBPairInformation(base_asset, quote_asset, bin_step).call();
    const pairAddress = lbInformations[1];

    // Check if pool exists for this pair
    if(pairAddress == "0x0000000000000000000000000000000000000000") {
      return undefined;
    }

    const multicall = new MultiCall(baseWeb3() as any, MULTICALL_CONTRACT);

    // Get tokenX and tokenY
    const pairContract = getContract(LBPairV21ABI, pairAddress, baseWeb3());
    const tokenXCalls = [
        { tokenX: pairContract.methods.getTokenX() },
    ];
    const tokenYCalls = [
        { tokenY: pairContract.methods.getTokenY() },
    ];
    const getActiveIdCalls = [
        { activeId: pairContract.methods.getActiveId() },
    ];
    const assets_multicall = await multicall.all([tokenXCalls, tokenYCalls, getActiveIdCalls]);
    const tokenX = assets_multicall[0][0].tokenX;
    const tokenY = assets_multicall[1][0].tokenY;
    const activeBinId = assets_multicall[2][0].activeId as number;
  
    // Get decimals data for tokens
    const baseAssetContract = getContract(ERC20_ABI, tokenX, baseWeb3());    
    const quoteAssetContract = getContract(ERC20_ABI, tokenY, baseWeb3());  
    const decimalCalls = [
        { decimals: baseAssetContract.methods.decimals() },
        { decimals: quoteAssetContract.methods.decimals() },
    ];
    const assets_data_multicall = await multicall.all([decimalCalls]);
    const baseDecimals = assets_data_multicall[0][0].decimals as number;
    const quoteDecimals = assets_data_multicall[0][1].decimals as number;
  
    // Price = binPrice * 10^(10^base_asset_decimals - 10^quote_asset_decimals)
    const binPrice = Bin.getPriceFromId(activeBinId, bin_step as unknown as number);
    const price = binPrice * 10**(baseDecimals - quoteDecimals);

    if(checkLiquidity) {
        const liquidities_data = await Promise.all([
            // Get 5+ Bin Liquidities ($)
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId + 1),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId + 2),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId + 3),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId + 4),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId + 5),
            // Get 5- Bin Liquidities ($)
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId - 1),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId - 2),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId - 3),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId - 4),
            getLiquidity(pairAddress, tokenX, baseDecimals, tokenY, quoteDecimals, bin_step, +activeBinId - 5),
        ]);
        let validLiquidity = false;
        for (let liqData of liquidities_data) {
            if(liqData >= (MIN_LIQUIDITY as number)){
                validLiquidity = true;
            }
        }
        if(!validLiquidity) {
            throw new ContractError(`Low liquidity for ${base_asset} / ${quote_asset} / ${bin_step} pair. Min_Liquidity is : ${(MIN_LIQUIDITY as number)}$ for one bin in +/-5 bins around the current one.`, 500);
        }
    }

    return price;   
}

export const fetchData = async (base_asset: string, quote_asset: string, bin_step: string, checkLiquidity: boolean = true) => {
    const cacheKey = `single_v2_1:${base_asset}_${quote_asset}`;
    const invertedCacheKey = `single_v2_1:${quote_asset}_${base_asset}`;

    // Check if price X / Y is already in cache
    const cachedPrice = getCache(cacheKey);
    if (cachedPrice) {
        return cachedPrice;
    }

    // Get Price and checks for MIN_LIQUIDITY
    const price = await getPrice(base_asset, quote_asset, bin_step, checkLiquidity);
    if(!price) {
        return undefined;
    }

    // Store the price in cache for future use
    setCache(cacheKey, price as number);
    setCache(invertedCacheKey, 1/(price as number));

    return price;    
}