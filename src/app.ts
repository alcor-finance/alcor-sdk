import 'dotenv/config'
import { ethers } from 'ethers';
import { OptionsModule } from './modules/options';
import { ComboModule } from './modules/combo';
import { LiquidityModule } from './modules/liquidity';

class AlcorSDK {
    public readonly options: OptionsModule;
    public readonly combo: ComboModule;
    public readonly liquidity: LiquidityModule;
    private chain: 'arbitrum';

    constructor(privateKey: string, alchemyAPIKey: string) {
        this.chain = 'arbitrum';
        const rpcProvider = {
            'arbitrum': 'https://arb-mainnet.g.alchemy.com/v2/'
        };
        const provider = new ethers.JsonRpcProvider(rpcProvider[this.chain] + alchemyAPIKey);
        const signer = new ethers.Wallet(privateKey, provider);

        this.options = new OptionsModule(provider, signer, this.chain);
        this.combo = new ComboModule(provider, signer, this.chain);
        this.liquidity = new LiquidityModule(provider, signer, this.chain);
    }
}

export default AlcorSDK;
