export type ProvideLiquidityParams = {
    amount: number;
};

export type LpPosition = {
    liquidityAmount: number;
    premiumsPaid: number;
    optionsBought: number;
    currentAmount: number;
    depositAmount: number;
    feesAmount: number;
};
