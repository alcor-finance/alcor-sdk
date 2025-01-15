import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';
import { LpPosition, ProvideLiquidityParams, Option } from '../types';
import { SdkModule } from './sdk';

export class LiquidityModule extends SdkModule {
    constructor(provider: Provider, signer: Signer, chain: string) {
        super(provider, signer, chain);
    }

    public async getPools(expiration?: number): Promise<Option[]> {
        const result = await this.fetch(
            '/pools',
            { method: 'GET' },
            expiration ? `&expiration=${expiration}` : ''
        );

        return result.pools;
    }

    public async getPositions(): Promise<LpPosition[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/liquidity/positions',
            { method: 'GET' },
            `&address=${address}`
        );

        return result.positions;
    }

    public async provideLiquidity(params: ProvideLiquidityParams): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/liquidity/provide', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });
        const calls = result.calls as TransactionRequest[];
        const receipts = await this.executeCalls(calls);

        return receipts;
    }
} 
