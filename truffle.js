require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      gas: 6500000,
      network_id: "5777"
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: process.env.OWNER_WALLET, // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 6712390 // Gas limit used for deploys
    }
  }
};
