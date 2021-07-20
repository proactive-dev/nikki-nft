/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require('dotenv').config()

module.exports = {
  defaultNetwork: "private",
  networks: {
    hardhat: {
    },
    local: {
      url: 'http://localhost:7545',
      accounts: ['562aa56f8a7cae4d1343e9e96c9d7c2b6276641c1817888081bc8e42e1d14e50']
    },
    private: {
      url: process.env.REACT_APP_RPC_PROVIDER,
      chainId: parseInt(process.env.REACT_APP_NETWORK_ID),
      accounts: [process.env.REACT_APP_PRIV_KEY]
    }
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    disambiguatePaths: true
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./src/artifacts"
  }
}
