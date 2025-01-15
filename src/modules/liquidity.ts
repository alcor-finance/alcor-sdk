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
            '/lp-positions',
            { method: 'GET' },
            `&address=${address}`
        );

        return result.positions;
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