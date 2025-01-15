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
    
    test('provide & collect fees & remove liquidity', async () => {
        const result = await sdk.liquidity.provide({
            amount: 0.0031
        });

        expect(result).toBeDefined();

        let position = await sdk.liquidity.getPosition();
        expect(position).toBeDefined();

        const collectFeesResult = await sdk.liquidity.collectFees();
        expect(collectFeesResult).toBeDefined();

        position = await sdk.liquidity.getPosition();
        expect(position).toBeDefined();
        expect(position!.feesAmount).toBeLessThan(1e-12);

        const removeResult = await sdk.liquidity.remove();
        expect(removeResult).toBeDefined();

        position = await sdk.liquidity.getPosition();
        expect(position).toBeNull();
    }, 120000);
});
