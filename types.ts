export type Option = {
    id: number;
    optionType: 'call' | 'put';
    strikePrice: number;
    humanReadableExpiration: string;
    optionExpiration: number;
    TVL: number;
    leverage: number;
    buyPrice: number;
    sellPrice: number;
    maxLoss: number;
    impliedVol: number;
    delta: number;
    vega: number;
    optionPrice: number;
};

export type TradeOptionParams = Pick<Option, 'optionExpiration' | 'optionType' | 'strikePrice'> & {
    paymentToken: string;
    action: 'buy' | 'sell';
    contractsAmount: number;
    price: number;
};
