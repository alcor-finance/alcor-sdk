import 'dotenv/config'
import { Provider, Signer, TransactionReceipt, TransactionRequest, ethers } from 'ethers';
import { Option, TradeOptionParams } from './types';

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

    public async getOptions(): Promise<Option[]> {
        return this.fetch('/options', {
            method: 'GET'
        });
    }

    public async tradeOption(params: TradeOptionParams): Promise<TransactionRequest[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/trade-option', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });
        const calls = result.calls as TransactionRequest[];

        const txs: TransactionReceipt[] = [];
        for (const call of calls) {
            const staticCall = await this.provider.call({ ...call, from: address });
            if (staticCall) {
                const tx = await this.signer.sendTransaction(call);
                const receipt = await tx.wait();
                if (receipt) {
                    txs.push(receipt);
                } else {
                    break;
                }
            }
        }

        return txs;
    }
}

export default AlcorSDK;
