import { Provider, Signer, TransactionReceipt, TransactionRequest } from 'ethers';
import { ComboPosition, TradeComboOptionParams } from '../types';
import { SdkModule } from './sdk';

export class ComboModule extends SdkModule {
    constructor(provider: Provider, signer: Signer, chain: string) {
        super(provider, signer, chain);
    }

    public async getPositions(): Promise<ComboPosition[]> {
        const address = await this.signer.getAddress();
        const result = await this.fetch(
            '/combo-positions',
            { method: 'GET' },
            `&address=${address}`
        );

        return result.positions;
    }

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
