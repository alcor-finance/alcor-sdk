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

export class OptionsModule extends SdkModule {
    constructor(provider: Provider, signer: Signer, chain: string) {
        super(provider, signer, chain);
    }

    public async getAvailableExpirations(): Promise<number[]> {
        const result = await this.fetch('/expirations', { method: 'GET' });
        return result.expirations;
    }

    public async getOptions(expiration?: number): Promise<Option[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/options',
            { method: 'GET' },
            `&address=${address}` + (expiration ? `&expiration=${expiration}` : '')
        );

        return result.options;
    }

    public async getPositions(expiration?: number): Promise<Position[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/positions',
            { method: 'GET' },
            `&address=${address}` + (expiration ? `&expiration=${expiration}` : '')
        );

        return result.positions;
    }

    public async getPosition(option: OptionPoolKey): Promise<number> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/position',
            { method: 'GET' },
            `&address=${address}&expiration=${option.expiration}&strike=${option.strikePrice}&optionType=${option.optionType}`
        );

        return result.contracts;
    }

    public async tradeOption(params: TradeOptionParams): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/trade-option', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });

        const calls = result.calls as TransactionRequest[];
        const receipts = await this.executeCalls(calls);
        return receipts;
    }

    public async buyOption(params: BuyOptionParams): Promise<TransactionReceipt[]> {
        const { option, contractsAmount, paymentToken } = params;
        return this.tradeOption({
            ...option,
            paymentToken: paymentToken ?? 'weth',
            action: 'buy',
            contractsAmount,
            price: option.buyPrice
        });
    }

    public async sellOption(params: SellOptionParams): Promise<TransactionReceipt[]> {
        const { option, contractsAmount, paymentToken } = params;
        return this.tradeOption({
            ...option,
            paymentToken: paymentToken ?? 'weth',
            action: 'sell',
            contractsAmount,
            price: option.sellPrice
        });
    }
}
