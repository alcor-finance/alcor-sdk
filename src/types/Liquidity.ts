import { Pool } from "./";

export type ProvideLiquidityParams = {
    amount: number;
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
