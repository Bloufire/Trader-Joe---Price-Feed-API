import { baseWeb3 } from '../../utils/web3';
import { getReferenceStablecoin } from '../../utils/priceHelper';

// Test suite for general testing
describe("General Testing", () => {
    // Test case to check if RPC works fine and ZERO_ADDRESS has balance greater than 0
    test("Checks if RPC works fine, ZERO_ADDRESS have balance > 0", async () => {
        const web3Client = baseWeb3();
        const ZERO_ADDR = "0x0000000000000000000000000000000000000000"

        // Retrieving the balance of ZERO_ADDRESS
        expect(Number(await web3Client.eth.getBalance(ZERO_ADDR))).toBeGreaterThan(0);
    });

    // Test case to check if REFERENCE_STABLECOIN is set and address is valid
    test("Checks if REFERENCE_STABLECOIN is set and address is valid", async () => {
        const refStablecoin = getReferenceStablecoin();
        
        // Checking the length of the reference stablecoin address
        expect(refStablecoin.length).toEqual(42);
        // Checking if the reference stablecoin address starts with "0x"
        expect(refStablecoin.toLowerCase().startsWith("0x")).toEqual(true);
    });
});