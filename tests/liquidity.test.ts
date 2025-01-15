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

        const lpPosition = await sdk.liquidity.getPosition();
        expect(lpPosition).toBeDefined();
    }, 60000);

    test('collect fees', async () => {
        const result = await sdk.liquidity.collectFees();
        expect(result).toBeDefined();

        const position = await sdk.liquidity.getPosition();
        expect(position).toBeDefined();
        expect(position.feesAmount).toBeLessThan(1e-12);
    }, 60000);
});
