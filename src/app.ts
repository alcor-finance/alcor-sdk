import 'dotenv/config'
import { ethers } from 'ethers';
import { OptionsModule } from './modules/options';
import { ComboModule } from './modules/combo';
import { LiquidityModule } from './modules/liquidity';

class AlcorSDK {
    public readonly options: OptionsModule;
    public readonly combo: ComboModule;
    public readonly liquidity: LiquidityModule;

    constructor(privateKey: string, rpc?: string) {
        const provider = new ethers.JsonRpcProvider(rpc);
        const signer = new ethers.Wallet(privateKey, provider);

        this.options = new OptionsModule(provider, signer);
        this.combo = new ComboModule(provider, signer);
        this.liquidity = new LiquidityModule(provider, signer);
    }
}

export default AlcorSDK;
