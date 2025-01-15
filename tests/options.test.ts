import AlcorSDK from "../src/app";

const { PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;

describe('Options', () => {
    let sdk: AlcorSDK;

    beforeAll(() => {
        if (!PRIVATE_KEY || !ALCHEMY_API_KEY) {
            throw new Error('Environment variables missing');
        }
        sdk = new AlcorSDK(PRIVATE_KEY, ALCHEMY_API_KEY);
    });

    test('get options', async () => {
        const result = await sdk.options.getOptions();
        expect(result).toBeDefined();
    }, 20000);

    test('get positions', async () => {
        const result = await sdk.options.getPositions();
        expect(result).toBeDefined();
    }, 20000);

    test('buy option', async () => {
        const options = await sdk.options.getOptions();
        const option = options[0];
        const oldPosition = option.contracts;
        const result = await sdk.options.buy({
            option,
            contractsAmount: 0.0001
        });
        const updatedPosition = await sdk.options.getPosition(option);

        expect(updatedPosition).toBeGreaterThan(oldPosition);
        expect(result).toBeDefined();
    }, 20000);
});
