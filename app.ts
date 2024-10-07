import 'dotenv/config'
import { Provider, Signer, TransactionReceipt, TransactionRequest, ethers } from 'ethers';
import { Option, ProvideLiquidityParams, TradeComboOptionParams, TradeOptionParams } from './types';

class AlcorSDK {
    private chain: string;
    private signer: Signer;
    private provider: Provider;

    constructor(privateKey: string, alchemyAPIKey: string, chain: string) {
        this.chain = chain;
        const rpcProvider = {
            'sepolia': 'https://eth-sepolia.g.alchemy.com/v2/',
            'arbitrum': 'https://arb-mainnet.g.alchemy.com/v2/'
        };
        this.provider = new ethers.JsonRpcProvider(rpcProvider[chain] + alchemyAPIKey);
        this.signer = new ethers.Wallet(privateKey, this.provider);
    }

    private async fetch(url: string, options: RequestInit) {
        const response = await fetch(`${process.env.API_URL}${url}?chain=${this.chain}`, {
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

    public async getOptions(): Promise<Option[]> {
        return this.fetch('/options', {
            method: 'GET'
        });
    }

    public async getPools(): Promise<Option[]> {
        return this.fetch('/pools', {
            method: 'GET'
        });
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
