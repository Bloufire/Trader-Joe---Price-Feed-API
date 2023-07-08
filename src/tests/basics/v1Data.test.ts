import { fetchData, getLiquidity, getPrice } from "../../data/priceDataV1_multicall";
import { getReferenceStablecoin } from "../../utils/priceHelper";
import { CACHE_EXPIRATION_TIME, JOE_TOKEN } from '../../constants';
import { getCache } from "../../utils/cache";

// Test suite for v1 Data Testing
describe("v1 Data Testing", () => {
    const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

    // Test for Liquidity Checks
    test("Liquidity Checks", async () => {
        let balX = 1;
        let balY = 3;
        // Case 1 - X is Ref Stablecoin -> Liquidity = 2*balX
        expect(await getLiquidity(getReferenceStablecoin(), balX, ZERO_ADDR, balY)).toEqual(2);
        // Case 2 - Y is Ref Stablecoin -> Liquidity = 2*balY
        expect(await getLiquidity(ZERO_ADDR, balX, getReferenceStablecoin(), balY)).toEqual(6);
    });

    // Test for Pair existence Checks
    test("Pair existance Checks", async () => {
        // Case 1 - Pair with ZERO_ADDRESS cannot exists
        expect(await getPrice(getReferenceStablecoin(), ZERO_ADDR, false)).toEqual(undefined);
        // Case 2 - Pair REFERENCE_STABLECOIN/JOE must exists
        expect(await getPrice(getReferenceStablecoin(), JOE_TOKEN, false)).toBeGreaterThan(0);
    });

    // Test for Cache Checks
    test("Cache Checks", async () => {
        const cacheKey = `single_v1:${getReferenceStablecoin()}_${JOE_TOKEN}`;
        
        // Case 1 - Cache must be empty
        expect(getCache(cacheKey)).toBe(undefined);

        // Fetch Price for REFERENCE_STABLECOIN / JOE pair, this will store price in cache
        await fetchData(getReferenceStablecoin(), JOE_TOKEN, false);
        // Case 2 - Cache must return price greater than 0
        expect(getCache(cacheKey)).toBeGreaterThan(0);

        // Wait for CACHE EXPIRATION
        await delay((+CACHE_EXPIRATION_TIME + 1) * 1000);

        // Case 3 - Pair with ZERO_ADDRESS cannot exists
        expect(getCache(cacheKey)).toBe(undefined);
    });
});

// Function to delay execution for a specified amount of time
function delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}