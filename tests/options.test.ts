import AlcorSDK from "../app";

const { PRIVATE_KEY, ALCHEMY_API_KEY, CHAIN } = process.env;

describe('AlcorSDK', () => {
    let sdk: AlcorSDK;

    beforeAll(() => {
        if (!PRIVATE_KEY || !ALCHEMY_API_KEY || !CHAIN) {
            throw new Error('Environment variables missing');
        }
        sdk = new AlcorSDK(PRIVATE_KEY, ALCHEMY_API_KEY, CHAIN);
    });

    test('get options', async () => {
        const result = await sdk.getOptions();

        expect(result).toBeDefined();
    });

    test('buy option', async () => {
        const result = await sdk.tradeOption({
            paymentToken: 'weth',
            optionExpiration: 1728593240,
            optionType: 'call',
            strikePrice: 2850,
            action: 'buy',
            contractsAmount: 0.0001,
            price: 101.15
        });

        expect(result).toBeDefined();
    }, 20000);

    test('provide liquidity', async () => {
        const result = await sdk.provideLiquidity({
            minPrice: 90.24,
            maxPrice: 99.74,
            amount: 0.001,
            option: {
                price: 94.98,
                expiry: 1728593240,
                strike: 2950,
                isCall: true
            }
        });

        expect(result).toBeDefined();
    }, 20000);
});
