import { Pool, Option } from "./";

export type ProvideLiquidityParams = {
    minPrice: number;
    maxPrice: number;
    amount: number;
    option: Pick<Option, 'optionType' | 'expiration' | 'strikePrice' | 'optionPrice'>;
};

export type LpPosition = Pool & {
    optionsBought: number;
    premiumsPaid: number;
    deposited: number;
    unclaimedFees: number;
    currentStrike: number;
    currentExpiry: number;
    minPrice: number;
    maxPrice: number;
    tickLower: number;
    tickUpper: number;
};
