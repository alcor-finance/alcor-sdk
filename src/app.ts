import { JsonRpcProvider, Wallet } from 'ethers';
import { ComboModule } from './modules/combo';
import { LiquidityModule } from './modules/liquidity';
import { OptionsModule } from './modules/options';

/**
 * Main SDK class for interacting with Alcor options protocol
 * @example
 * ```typescript
 * // Initialize the SDK
 * const sdk = new AlcorSDK('YOUR_PRIVATE_KEY', 'YOUR_RPC_URL');
 * 
 * // Get liquidity positions
 * const positions = await sdk.liquidity.getPositions();
 * 
 * // Buy options
 * await sdk.options.buy({
 *   option: {
 *     expiration: 1735290000,
 *     strikePrice: 2000,
 *     optionType: 'call'
 *   },
 *   contractsAmount: 1
 * });
 * ```
 */
export class AlcorSDK {
    /** Module for managing liquidity provision operations */
    public readonly liquidity: LiquidityModule;
    /** Module for managing option trading operations */
    public readonly options: OptionsModule;
    /** Module for handling combo option operations */
    public readonly combo: ComboModule;

    /**
     * Creates an instance of AlcorSDK.
     * @param privateKey - Ethereum private key for signing transactions
     * @param rpcUrl - Ethereum RPC URL (e.g. Infura, Alchemy)
     */
    constructor(privateKey: string, rpcUrl: string) {
        const provider = new JsonRpcProvider(rpcUrl);
        const signer = new Wallet(privateKey, provider);

        this.liquidity = new LiquidityModule(provider, signer);
        this.options = new OptionsModule(provider, signer);
        this.combo = new ComboModule(provider, signer);
    }
}

export * from './types';
