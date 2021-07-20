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
      accounts: [process.env.REACT_APP_PRIV_KEY]
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
