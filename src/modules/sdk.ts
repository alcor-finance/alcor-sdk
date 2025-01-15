import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';

export abstract class SdkModule {
    protected provider: Provider;
    protected signer: Signer;
    protected chain: string;

    constructor(provider: Provider, signer: Signer, chain: string) {
        this.provider = provider;
        this.signer = signer;
        this.chain = chain;
    }

    protected async fetch(url: string, options: RequestInit, args = '') {
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

    protected async executeCalls(calls: TransactionRequest[]): Promise<TransactionReceipt[]> {
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
} 