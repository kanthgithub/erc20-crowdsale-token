require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      gas: 6500000,
      network_id: "5777"
    },
    ropsten: {
      provider: new HDWalletProvider(
        process.env.MNENOMIC,
        "https://ropsten.infura.io/" + process.env.INFURA_API_KEY
      ),
      network_id: 3,
      gas: 4500000
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x5e611e34CfB6Fd0a6f6f0c61038E80465a5B9Fea", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 6712390 // Gas limit used for deploys
    },
    rinkebyInfura: {
      provider: new HDWalletProvider(
        process.env.MNENOMIC,
        "https://rinkeby.infura.io/" + process.env.INFURA_API_KEY
      ),
      network_id: 4,
      gas: 4500000
    }
  }
};
