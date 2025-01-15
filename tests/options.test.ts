import AlcorSDK from "../src/app";

const { PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

describe('AlcorSDK', () => {
    let sdk: AlcorSDK;

    beforeAll(() => {
        if (!PRIVATE_KEY || !ALCHEMY_API_KEY) {
            throw new Error('Environment variables missing');
        }
        sdk = new AlcorSDK(PRIVATE_KEY, ALCHEMY_API_KEY);
    });

    test('get options', async () => {
        const result = await sdk.getOptions();
        expect(result).toBeDefined();
    });

    test('get positions', async () => {
        const result = await sdk.getOptionPositions();
        expect(result).toBeDefined();
    });

    test('get combo positions', async () => {
        const result = await sdk.getComboPositions();
        expect(result).toBeDefined();
    });

    test('buy option', async () => {
        const result = await sdk.tradeOption({
            paymentToken: 'weth',
            expiration: 1728593240,
            optionType: 'call',
            strikePrice: 2850,
            action: 'buy',
            contractsAmount: 0.0001,
            price: 101.15
        });

        expect(result).toBeDefined();
    }, 20000);

    // test('provide liquidity', async () => {
    //     const result = await sdk.provideLiquidity({
    //         minPrice: 90.24,
    //         maxPrice: 99.74,
    //         amount: 0.001,
    //         option: {
    //             optionPrice: 94.98,
    //             expiration: 1728593240,
    //             strikePrice: 2950,
    //             optionType: 'call'
    //         }
    //     });

    //     expect(result).toBeDefined();
    // }, 20000);

    test('buy combo option', async () => {
        const result = await sdk.tradeComboOption({
            paymentToken: 'weth',
            expiration: 1728593240,
            optionType: 'call',
            strikePriceLow: 2850,
            strikePriceHigh: 2950,
            action: 'buy',
            contractsAmount: 0.001,
            price: 8.359
        });

        expect(result).toBeDefined();
    }, 20000);
});
