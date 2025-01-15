# Alcor SDK

TypeScript SDK for interacting with Alcor options protocol.

## Quick Start

```typescript
import { AlcorSDK } from 'alcor-sdk';

// Initialize the SDK
const sdk = new AlcorSDK(
    'YOUR_PRIVATE_KEY',
    'YOUR_RPC_URL' // e.g. https://mainnet.infura.io/v3/YOUR-PROJECT-ID
);

// Example: Get all available options
const options = await sdk.options.getOptions();

// Example: Buy option
await sdk.options.buy({
    option: options[0],
    contractsAmount: 0.1
});

// Example: Sell option
await sdk.options.sell({
    option: {
      expiration: 1234567890,
      strikePrice: 3000,
      optionType: 'call'
    },
    contractsAmount: 0.1,
    paymentToken: 'weth'
});
```

## Modules

### Options

```typescript
// Get all available options
const options = await sdk.options.getOptions();

// Get options for specific expiration
const options = await sdk.options.getOptions(1234567890);

// Get your positions
const positions = await sdk.options.getPositions();

// Buy options
await sdk.options.buy({
    option: options[0],
    contractsAmount: 1
});

// Sell options
await sdk.options.sell({
    option: {
        expiration: 1735290000,
        strikePrice: 3000,
        optionType: 'call'
    },
    contractsAmount: 1
});
```

### Liquidity

```typescript
// Get available pools
const pools = await sdk.liquidity.getPools();

// Get your LP position
const position = await sdk.liquidity.getPosition();

// Provide liquidity
await sdk.liquidity.provide({
    expiration: 1234567890,
    amount: 0.1 // 0.1 ETH
});

// Collect fees
await sdk.liquidity.collectFees();

// Remove provided liquidity
await sdk.liquidity.remove();
```

### Combo

Coming soon
