type OptionType = 'call' | 'put';

export type Pool = {
    optionType: OptionType;
    expiration: number;
    strikePrice: number;
    TVL: number;
    optionPrice: number;
};

export type Option = Pool & {
    breakEven: number;
    leverage: number;
    buyPrice: number;
    sellPrice: number;
    maxLoss: number;
    impliedVol: number;
    delta: number;
    vega: number;
    contracts: number;
};

export type TradeOptionParams = Pick<Option, 'expiration' | 'optionType' | 'strikePrice'> & {
    paymentToken: string;
    action: 'buy' | 'sell';
    contractsAmount: number;
    price: number;
};

export type TradeComboOptionParams = Pick<Option, 'expiration' | 'optionType'> & {
    paymentToken: string;
    action: 'buy' | 'sell';
    contractsAmount: number;
    price: number;
    strikePriceLow: number;
    strikePriceHigh: number;
};

export type ProvideLiquidityParams = {
    minPrice: number;
    maxPrice: number;
    amount: number;
    option: Pick<Option, 'optionType' | 'expiration' | 'strikePrice' | 'optionPrice'>;
};

export type Position = Pool & {
    pnlValue: number;
    markPrice: number;
    contracts: number;
    status: string;
};

export type ComboPosition = Omit<Position, 'strikePrice' | 'TVL' | 'optionPrice'> & {
    strikePriceLow: number;
    strikePriceHigh: number;
    optionPriceLow: number;
    optionPriceHigh: number;
};
