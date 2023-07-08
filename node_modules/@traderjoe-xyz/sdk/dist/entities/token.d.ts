import { ChainId } from '../constants';
import { Currency } from './currency';
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export declare class Token {
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    readonly isNative: false;
    readonly isToken: true;
    readonly chainId: number;
    /**
     * The contract address on the chain on which this token lives
     */
    readonly address: string;
    constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Token): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
}
/**
 * Compares two currencies for equality
 */
export declare function currencyEquals(currencyA: Currency, currencyB: Currency): boolean;
export declare const WNATIVE: {
    43113: Token;
    43114: Token;
    42161: Token;
    421613: Token;
    56: Token;
    97: Token;
};
export declare const WAVAX: {
    43113: Token;
    43114: Token;
    42161: Token;
    421613: Token;
    56: Token;
    97: Token;
};
