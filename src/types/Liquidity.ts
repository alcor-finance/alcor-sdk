/** Parameters for providing liquidity to the protocol */
export type ProvideLiquidityParams = {
    /** Amount of tokens to provide as liquidity */
    amount: number;
};

/** Represents a liquidity provider position */
export type LpPosition = {
    /** Total amount of liquidity provided */
    liquidityAmount: number;
    /** Total amount of premiums paid for options in ETH */
    premiumsPaid: number;
    /** Number of options bought */
    optionsBought: number;
    /** Current amount of liquidity position in ETH */
    currentAmount: number;
    /** Deposit amount in ETH */
    depositAmount: number;
    /** Total fees earned from the position in ETH */
    feesAmount: number;
};
