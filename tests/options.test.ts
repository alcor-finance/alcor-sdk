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
});
