import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';
import {
    BuyOptionParams,
    Option,
    OptionPoolKey,
    Position,
    SellOptionParams,
    TradeOptionParams
} from '../types';
import { SdkModule } from './sdk';

/**
 * Module for managing option trading operations.
 * Handles buying, selling, and managing option positions.
 */
export class OptionsModule extends SdkModule {
    /** @internal */
    constructor(provider: Provider, signer: Signer) {
        super(provider, signer);
    }

    /**
     * Retrieves all available option expiration timestamps.
     * @returns Promise resolving to an array of expiration timestamps
     */
    public async getAvailableExpirations(): Promise<number[]> {
        const result = await this.fetch('/expirations', { method: 'GET' });
        return result.expirations;
    }

    /**
     * Retrieves available options for trading.
     * @param expiration - Optional timestamp to filter options by expiration
     * @returns Promise resolving to an array of available options
     */
    public async getOptions(expiration?: number): Promise<Option[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/options',
            { method: 'GET' },
            `&address=${address}` + (expiration ? `&expiration=${expiration}` : '')
        );

        return result.options;
    }

    /**
     * Retrieves all option positions for the connected wallet address.
     * @param expiration - Optional timestamp to filter positions by expiration
     * @returns Promise resolving to an array of option positions
     */
    public async getPositions(expiration?: number): Promise<Position[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/options/positions',
            { method: 'GET' },
            `&address=${address}` + (expiration ? `&expiration=${expiration}` : '')
        );

        return result.positions;
    }

    /**
     * Retrieves the number of contracts held for a specific option.
     * @param option - The option pool key identifying the specific option
     * @returns Promise resolving to the number of contracts held
     */
    public async getPosition(option: OptionPoolKey): Promise<number> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/options/position',
            { method: 'GET' },
            `&address=${address}&expiration=${option.expiration}&strike=${option.strikePrice}&optionType=${option.optionType}`
        );

        return result.contracts;
    }

    /**
     * Executes a generic option trade (buy or sell).
     * @param params - Parameters for the option trade
     * @returns Promise resolving to an array of transaction receipts
     */
    public async trade(params: TradeOptionParams): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/options/trade', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });

        const calls = result.calls as TransactionRequest[];
        const receipts = await this.executeCalls(calls);
        return receipts;
    }

    /**
     * Buys options with specified parameters.
     * @param params - Parameters for buying options
     * @returns Promise resolving to an array of transaction receipts
     */
    public async buy(params: BuyOptionParams): Promise<TransactionReceipt[]> {
        const { option, contractsAmount, paymentToken } = params;
        return this.trade({
            ...option,
            paymentToken: paymentToken ?? 'weth',
            action: 'buy',
            contractsAmount,
            price: option.buyPrice
        });
    }

    /**
     * Sells options with specified parameters.
     * @param params - Parameters for selling options
     * @returns Promise resolving to an array of transaction receipts
     */
    public async sell(params: SellOptionParams): Promise<TransactionReceipt[]> {
        const { option, contractsAmount, paymentToken } = params;
        return this.trade({
            ...option,
            paymentToken: paymentToken ?? 'weth',
            action: 'sell',
            contractsAmount,
            price: option.sellPrice
        });
    }
}
