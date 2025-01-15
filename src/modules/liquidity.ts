import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';
import { LpPosition, ProvideLiquidityParams, Option } from '../types';
import { SdkModule } from './sdk';

export class LiquidityModule extends SdkModule {
    constructor(provider: Provider, signer: Signer) {
        super(provider, signer);
    }

    public async getPools(expiration?: number): Promise<Option[]> {
        const result = await this.fetch(
            '/pools',
            { method: 'GET' },
            expiration ? `&expiration=${expiration}` : ''
        );

        return result.pools;
    }

    public async getPosition(): Promise<LpPosition | null> {
        try {
            const address = await this.signer.getAddress();
            const result = await this.fetch(
                '/liquidity/position',
                { method: 'GET' },
                `&address=${address
                }`
            );
            return result.position;
        } catch (error) {
            return null;
        }
    }

    public async provide(params: ProvideLiquidityParams): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/liquidity/provide', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });
        const calls = result.calls as TransactionRequest[];
        const receipts = await this.executeCalls(calls);

        return receipts;
    }

    public async collectFees(): Promise<TransactionReceipt | null> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/liquidity/collect-fees', {
            method: 'POST',
            body: JSON.stringify({ address })
        });

        const call = result.call as TransactionRequest;
        return this.executeCall(call);
    }

    public async remove(): Promise<TransactionReceipt | null> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/liquidity/remove', {
            method: 'POST',
            body: JSON.stringify({ address })
        });

        const call = result.call as TransactionRequest;
        return this.executeCall(call);
    }
} 
