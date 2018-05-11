const config = require('config');

// Get config variables
const ownerWallet = config.get('OWNER_WALLET');

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 6500000,
      network_id: "*"
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: ownerWallet, // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 6712390 // Gas limit used for deploys
    }
  }
};
