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
    strikePrice1: number;
    strikePrice2: number;
};

export type ProvideLiquidityParams = {
    minPrice: number;
    maxPrice: number;
    amount: number;
    option: Pick<Option, 'optionType' | 'expiration' | 'strikePrice' | 'optionPrice'>;
};
