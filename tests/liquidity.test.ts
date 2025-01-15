import AlcorSDK from "../src/app";

const { PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

describe('Liquidity', () => {
    let sdk: AlcorSDK;

    beforeAll(() => {
        if (!PRIVATE_KEY || !ALCHEMY_API_KEY) {
            throw new Error('Environment variables missing');
        }
        sdk = new AlcorSDK(PRIVATE_KEY, ALCHEMY_API_KEY);
    });

    test('provide liquidity', async () => {
        const result = await sdk.liquidity.provideLiquidity({
            amount: 0.0031
        });

        expect(result).toBeDefined();
    }, 60000);
});
