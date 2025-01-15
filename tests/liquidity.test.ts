import AlcorSDK from "../src/app";

const { PRIVATE_KEY, RPC_URL } = process.env;

describe('Liquidity', () => {
    let sdk: AlcorSDK;

    beforeAll(() => {
        if (!PRIVATE_KEY || !RPC_URL) {
            throw new Error('Environment variables missing');
        }
        sdk = new AlcorSDK(PRIVATE_KEY, RPC_URL);
    });
    
    test('provide liquidity', async () => {
        const result = await sdk.liquidity.provideLiquidity({
            amount: 0.0031
        });

        expect(result).toBeDefined();
    }, 60000);
});
