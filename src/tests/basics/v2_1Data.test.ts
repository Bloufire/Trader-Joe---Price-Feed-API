import { fetchData, getPrice } from "../../data/priceDataV2_1_multicall";
import { getReferenceStablecoin } from "../../utils/priceHelper";
import { CACHE_EXPIRATION_TIME, JOE_TOKEN } from '../../constants';
import { getCache } from "../../utils/cache";

// Test suite for v2.1 Data Testing
describe("v2.1 Data Testing", () => {
    const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

    // Test case for Pair existence Checks
    test("Pair existence Checks", async () => {
        // Case 1 - Pair with ZERO_ADDRESS cannot exists
        expect(await getPrice(getReferenceStablecoin(), ZERO_ADDR, "10", false)).toEqual(undefined);
        // Case 2 - Pair REFERENCE_STABLECOIN/JOE must exists
        expect(await getPrice(getReferenceStablecoin(), JOE_TOKEN, "25", false)).toBeGreaterThan(0);
    });

    // Test case for Cache Checks
    test("Cache Checks", async () => {
        const cacheKey = `single_v2_1:${getReferenceStablecoin()}_${JOE_TOKEN}_${25}`;
        
        // Case 1 - Cache must be empty
        expect(getCache(cacheKey)).toBe(undefined);

        // Fetch Price for REFERENCE_STABLECOIN / JOE / 25 pair, this will store price in cache
        await fetchData(getReferenceStablecoin(), JOE_TOKEN, "25", false);
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