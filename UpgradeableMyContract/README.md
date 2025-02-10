# Upgradable MyContract with Diamond Pattern 

This is an upgradable implementation of the MyContract using the Diamond Pattern (EIP 2535). 
It uses Mudgen's diamond https://github.com/mudgen/diamond-3-hardhat  library. 

## Installation

1. Clone this repo:
```console
    unzip UpgradeableMyContract.zip 
```

2. Install NPM packages:
```console
    cd UpgradeableMyContract
    npm install
```

## Deployment

```console
    npx hardhat run scripts/deploy.js
```

## Run the tests:
```console
    npx hardhat test
```

## Further Information on the Diamond Pattern

1. [Introduction to the Diamond Standard, EIP-2535 Diamonds](https://eip2535diamonds.substack.com/p/introduction-to-the-diamond-standard)
2. [EIP-2535 Diamonds](https://github.com/ethereum/EIPs/issues/2535)
3. [Understanding Diamonds on Ethereum](https://dev.to/mudgen/understanding-diamonds-on-ethereum-1fb)
4. [Mudgen Diamond-3 Hardhat Implemention](https://github.com/mudgen/diamond-3-hardhat/tree/main)
