import { Position, Option } from "./";

/** Parameters for trading combo options */
export type TradeComboOptionParams = Pick<Option, 'expiration' | 'optionType'> & {
    /** Address of the token used for payment */
    paymentToken: string;
    /** Trading action - whether to buy or sell the combo option */
    action: 'buy' | 'sell';
    /** Number of contracts to trade */
    contractsAmount: number;
    /** Price per contract in USD */
    price: number;
    /** Lower strike price of the combo option */
    strikePriceLow: number;
    /** Higher strike price of the combo option */
    strikePriceHigh: number;
};

/** Represents a position in a combo option */
export type ComboPosition = Omit<Position, 'strikePrice' | 'TVL' | 'optionPrice'> & {
    /** Lower strike price of the combo position */
    strikePriceLow: number;
    /** Higher strike price of the combo position */
    strikePriceHigh: number;
    /** Option price at the lower strike */
    optionPriceLow: number;
    /** Option price at the higher strike */
    optionPriceHigh: number;
};
