import { Position, Option } from "./";

export type TradeComboOptionParams = Pick<Option, 'expiration' | 'optionType'> & {
    paymentToken: string;
    action: 'buy' | 'sell';
    contractsAmount: number;
    price: number;
    strikePriceLow: number;
    strikePriceHigh: number;
};

export type ComboPosition = Omit<Position, 'strikePrice' | 'TVL' | 'optionPrice'> & {
    strikePriceLow: number;
    strikePriceHigh: number;
    optionPriceLow: number;
    optionPriceHigh: number;
};
