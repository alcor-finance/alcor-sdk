type OptionType = 'call' | 'put';

export type OptionPoolKey = {
    optionType: OptionType;
    expiration: number;
    strikePrice: number;
};

export type Pool = OptionPoolKey & {
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

export type TradeOptionParams = OptionPoolKey & {
    paymentToken: string;
    action: 'buy' | 'sell';
    contractsAmount: number;
    price: number;
};

export type BuyOptionParams = {
    option: OptionPoolKey & Pick<Option, 'buyPrice'>;
    contractsAmount: number;
    paymentToken?: string;
};

export type SellOptionParams = {
    option: OptionPoolKey & Pick<Option, 'sellPrice'>;
    contractsAmount: number;
    paymentToken?: string;
};

export type Position = Pool & {
    pnlValue: number;
    markPrice: number;
    contracts: number;
    status: string;
};
