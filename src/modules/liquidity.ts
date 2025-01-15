import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';
import { LpPosition, ProvideLiquidityParams, Option } from '../types';
import { SdkModule } from './sdk';

/**
 * Module for managing liquidity provision operations in option pools.
 * Handles providing liquidity, collecting fees, and managing LP positions.
 */
export class LiquidityModule extends SdkModule {
    /** @internal */
    constructor(provider: Provider, signer: Signer) {
        super(provider, signer);
    }

    /**
     * Retrieves available liquidity pools.
     * @param expiration - Optional timestamp to filter pools by expiration
     * @returns Promise resolving to an array of option pools
     */
    public async getPools(expiration?: number): Promise<Option[]> {
        const result = await this.fetch(
            '/pools',
            { method: 'GET' },
            expiration ? `&expiration=${expiration}` : ''
        );

        return result.pools;
    }

    /**
     * Retrieves the current LP position for the connected wallet address.
     * @returns Promise resolving to the LP position or null if no position exists
     */
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

    /**
     * Provides liquidity to an option pool.
     * @param params - Parameters for providing liquidity
     * @returns Promise resolving to an array of transaction receipts
     */
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

    /**
     * Collects accumulated fees from LP positions.
     * @returns Promise resolving to the transaction receipt or null if no fees to collect
     */
    public async collectFees(): Promise<TransactionReceipt | null> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/liquidity/collect-fees', {
            method: 'POST',
            body: JSON.stringify({ address })
        });

        const call = result.call as TransactionRequest;
        return this.executeCall(call);
    }

    /**
     * Removes liquidity from the pool, withdrawing the LP position.
     * @returns Promise resolving to the transaction receipt or null if no position to remove
     */
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
