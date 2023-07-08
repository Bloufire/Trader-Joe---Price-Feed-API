import { Token } from './token';
/**
 * Represents the native currency of the chain on which it resides, e.g. ETH, AVAX
 */
export declare class NativeCurrency {
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    readonly isNative: true;
    readonly isToken: false;
    readonly chainId: number;
    /**
     * Constructs an instance of the base class `NativeCurrency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    constructor(chainId: number, decimals: number, symbol?: string, name?: string);
    equals(other: NativeCurrency): boolean;
}
export declare class CNATIVE extends NativeCurrency {
    constructor(chainId: number);
    equals(other: NativeCurrency): boolean;
    private static _etherCache;
    static onChain(chainId: number): CNATIVE;
}
/**
 * for backward compatibility
 */
declare const CAVAX: CNATIVE;
export { CAVAX };
/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export type Currency = NativeCurrency | Token;
