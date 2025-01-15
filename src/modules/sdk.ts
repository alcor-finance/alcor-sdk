import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';

export abstract class SdkModule {
    protected provider: Provider;
    protected signer: Signer;

    constructor(provider: Provider, signer: Signer) {
        this.provider = provider;
        this.signer = signer;
    }

    protected async fetch(url: string, options: RequestInit, args = '') {
        const response = await fetch(`${process.env.API_URL}${url}?${args}`, {
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

    protected async executeCall(call: TransactionRequest): Promise<TransactionReceipt | null> {
        const tx = await this.signer.sendTransaction(call);
        const receipt = await tx.wait();
        return receipt;
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