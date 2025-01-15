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

export type BuyOptionParams = {
    option: Pick<Option, 'expiration' | 'optionType' | 'strikePrice' | 'buyPrice'>;
    contractsAmount: number;
    paymentToken?: string;
};

export type SellOptionParams = {
    option: Pick<Option, 'expiration' | 'optionType' | 'strikePrice' | 'sellPrice'>;
    contractsAmount: number;
    paymentToken?: string;
};

export type Position = Pool & {
    pnlValue: number;
    markPrice: number;
    contracts: number;
    status: string;
};
