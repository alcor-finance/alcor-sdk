import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';
import { ComboPosition, TradeComboOptionParams } from '../types';
import { SdkModule } from './sdk';

/**
 * Module for handling combo option operations.
 * Combo options allow trading multiple options simultaneously in a single transaction.
 * @internal
 */
export class ComboModule extends SdkModule {
    /** @internal */
    constructor(provider: Provider, signer: Signer) {
        super(provider, signer);
    }

    /**
     * Retrieves all combo positions for the connected wallet address.
     * @returns Promise resolving to an array of combo positions
     */
    public async getPositions(): Promise<ComboPosition[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/combo-positions',
            { method: 'GET' },
            `&address=${address}`
        );

        return result.positions;
    }

    /**
     * Executes a combo option trade by combining multiple option operations.
     * @param params - Parameters for the combo option trade
     * @returns Promise resolving to an array of transaction receipts for each executed trade
     */
    public async trade(params: TradeComboOptionParams): Promise<TransactionReceipt[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch('/trade-combo-option', {
            method: 'POST',
            body: JSON.stringify({ ...params, address })
        });

        const calls = result.calls as TransactionRequest[];
        const receipts = await this.executeCalls(calls);
        return receipts;
    }
}
