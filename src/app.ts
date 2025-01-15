import 'dotenv/config'
import { Provider, Signer, TransactionReceipt, TransactionRequest, ethers } from 'ethers';
import {
    BuyOptionParams,
    ComboPosition,
    LpPosition,
    Option,
    Position,
    ProvideLiquidityParams,
    SellOptionParams,
    TradeComboOptionParams,
    TradeOptionParams
} from './types';

class AlcorSDK {
    private chain: 'arbitrum';
    private signer: Signer;
    private provider: Provider;

    constructor(privateKey: string, alchemyAPIKey: string) {
        this.chain = 'arbitrum';
        const rpcProvider = {
            'arbitrum': 'https://arb-mainnet.g.alchemy.com/v2/'
        };
        this.provider = new ethers.JsonRpcProvider(rpcProvider[this.chain] + alchemyAPIKey);
        this.signer = new ethers.Wallet(privateKey, this.provider);
        this.signer.getAddress().then(console.log);
    }

    private async fetch(url: string, options: RequestInit, args = '') {
        const response = await fetch(`${process.env.API_URL}${url}?chain=${this.chain}${args}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        return result;
    }

    private async executeCalls(calls: TransactionRequest[]): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const receipts: TransactionReceipt[] = [];
        for (const call of calls) {
            const staticCall = await this.provider.call({ ...call, from: address });
            if (staticCall) {
                const tx = await this.signer.sendTransaction(call);
                const receipt = await tx.wait();
                if (receipt) {
                    receipts.push(receipt);
                } else {
                    break;
                }
            }
        }

        return receipts;
    }

    public async getExpirations(): Promise<number[]> {
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

    public async getPools(expiration?: number): Promise<Option[]> {
        const result = await this.fetch(
            '/pools',
            { method: 'GET' },
            expiration ? `&expiration=${expiration}` : ''
        );

        return result.pools;
    }

    public async getOptionPositions(expiration?: number): Promise<Position[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/positions',
            { method: 'GET' },
            `&address=${address}` + (expiration ? `&expiration=${expiration}` : '')
        );

        return result.positions;
    }

    public async getComboPositions(): Promise<ComboPosition[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/combo-positions',
            { method: 'GET' },
            `&address=${address}`
        );

        return result.positions;
    }

    public async getLpPositions(): Promise<LpPosition[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/lp-positions',
            { method: 'GET' },
            `&address=${address}`
        );

        return result.positions;
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

    public async tradeComboOption(params: TradeComboOptionParams): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/trade-combo-option', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });

        const calls = result.calls as TransactionRequest[];
        const receipts = await this.executeCalls(calls);
        return receipts;
    }

    public async provideLiquidity(params: ProvideLiquidityParams): Promise<TransactionReceipt | null> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/provide-liquidity', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });
        const call = result.call as TransactionRequest;

        const staticCall = await this.provider.call({ ...call, from: address });
        const tx = await this.signer.sendTransaction(call);
        const receipt = await tx.wait();

        return receipt;
    }
}

export default AlcorSDK;
