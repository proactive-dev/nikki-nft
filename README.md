# Nikki NFT Project

## How to use Hardhat and smart contracts
### Install hardhat, and setup hardhat project
```
npx hardhat
vi hardhat.config.js
```

### Edit main contract
```
vi ./contracts/NikkiNFT.sol
```

### Compile contract
```
npx hardhat compile
```

### Run hardhat node (or run Ganache) to deploy contract to test
```
npx hardhat node
```

### Create deploy script and deploy contract
```
vi ./scripts/deploy.js
npx hardhat run --network local scripts/deploy.js
```

## How to run project
### Install packages
```
npm install
```

### Configure environment variables
```
vi .env
```

### How to run web project in local
```
npm run start
```

### How to deploy project to production
```
npm run build
```
