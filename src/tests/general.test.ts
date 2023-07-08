import { baseWeb3 } from '../utils/web3';
import { getReferenceStablecoin } from '../utils/priceHelper';

describe("General Testing", () => {
    test("Checks if RPC works fine, ZERO_ADDRESS have balance > 0", async () => {
        const web3Client = baseWeb3();
        const ZERO_ADDR = "0x0000000000000000000000000000000000000000"
        expect(Number(await web3Client.eth.getBalance(ZERO_ADDR))).toBeGreaterThan(0);
    });

    test("Checks if REFERENCE_STABLECOIN is set and address is valid", async () => {
        const refStablecoin = getReferenceStablecoin();
        expect(refStablecoin.length).toEqual(42);
        expect(refStablecoin.toLowerCase().startsWith("0x")).toEqual(true);
    });
});