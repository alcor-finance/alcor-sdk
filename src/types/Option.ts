/** Type of option - either call or put */
type OptionType = 'call' | 'put';

/** Key parameters that uniquely identify an option pool */
export type OptionPoolKey = {
    /** Type of the option (call/put) */
    optionType: OptionType;
    /** Timestamp of option expiration (seconds) */
    expiration: number;
    /** Strike price of the option in USD */
    strikePrice: number;
};

/** Represents an option pool with its key metrics */
export type Pool = OptionPoolKey & {
    /** Total Value Locked in the pool */
    TVL: number;
    /** Current price of the option */
    optionPrice: number;
};

/** Comprehensive option data including Greeks and pricing information */
export type Option = Pool & {
    /** Break-even price of the option for ETH */
    breakEven: number;
    /** Leverage ratio */
    leverage: number;
    /** Current buy price in USD */
    buyPrice: number;
    /** Current sell price in USD */
    sellPrice: number;
    /** Maximum possible loss */
    maxLoss: number;
    /** Implied volatility */
    impliedVol: number;
    /** Delta - rate of change in option price relative to underlying */
    delta: number;
    /** Vega - sensitivity to volatility changes */
    vega: number;
    /** Number of contracts */
    contracts: number;
};

/** Parameters for trading options */
export type TradeOptionParams = OptionPoolKey & {
    /** Address of the token used for payment */
    paymentToken: string;
    /** Trading action - whether to buy or sell */
    action: 'buy' | 'sell';
    /** Number of contracts to trade */
    contractsAmount: number;
    /** Price per contract in USD */
    price: number;
};

/** Parameters for buying options */
export type BuyOptionParams = {
    /** Option specifications including buy price */
    option: OptionPoolKey & Pick<Option, 'buyPrice'>;
    /** Number of contracts to buy */
    contractsAmount: number;
    /** Optional payment token address */
    paymentToken?: string;
};

/** Parameters for selling options */
export type SellOptionParams = {
    /** Option specifications including sell price */
    option: OptionPoolKey & Pick<Option, 'sellPrice'>;
    /** Number of contracts to sell */
    contractsAmount: number;
    /** Optional payment token address */
    paymentToken?: string;
};

/** Represents an option position */
export type Position = Pool & {
    /** Current profit/loss value in USD */
    pnlValue: number;
    /** Current market price in USD */
    markPrice: number;
    /** Number of contracts in the position */
    contracts: number;
    /** Current status of the position */
    status: string;
};
