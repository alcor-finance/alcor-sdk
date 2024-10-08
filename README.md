# AlcorSDK

AlcorSDK is a TypeScript library for interacting with the Alcor options trading platform.

## Usage

```typescript
import AlcorSDK from 'alcor-sdk';

const sdk = new AlcorSDK(privateKey, alchemyAPIKey, chain);
```

Replace `privateKey`, `alchemyAPIKey`, and `chain` with your actual values.

## Key Features

### Fetch Data

```typescript
// Get available expirations
const expirations = await sdk.getExpirations();

// Get options (optionally filtered by expiration)
const options = await sdk.getOptions(expiration);

// Get pools (optionally filtered by expiration)
const pools = await sdk.getPools(expiration);

// Get user positions
const optionPositions = await sdk.getOptionPositions();
const comboPositions = await sdk.getComboPositions();
const lpPositions = await sdk.getLpPositions();
```

### Trade Options

```typescript
// Trade a single option
const receipt = await sdk.tradeOption({
  paymentToken: 'weth',
  expiration: 1728593240,
  optionType: 'call',
  strikePrice: 2850,
  action: 'buy',
  contractsAmount: 0.0001,
  price: 101.15
});

// Trade a combo option
const receipt = await sdk.tradeComboOption({
  paymentToken: 'weth',
  expiration: 1728593240,
  optionType: 'call',
  strikePriceLow: 2850,
  strikePriceHigh: 2950,
  action: 'buy',
  contractsAmount: 0.001,
  price: 8.359
});
```

### Provide Liquidity

```typescript
const receipt = await sdk.provideLiquidity({
  minPrice: 90.24,
  maxPrice: 99.74,
  amount: 0.001,
  option: {
    optionPrice: 94.98,
    expiration: 1728593240,
    strikePrice: 2950,
    optionType: 'call'
  }
});
```

## Error Handling

All methods may throw errors. It's recommended to use try-catch blocks when calling SDK methods.

```typescript
try {
  const options = await sdk.getOptions();
} catch (error) {
  console.error('Error fetching options:', error.message);
}
```

For more detailed information on types and parameters, refer to the `types.ts` file in the SDK.
