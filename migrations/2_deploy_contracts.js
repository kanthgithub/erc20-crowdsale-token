const config = require("config");

const LittlePhilCrowdsale = artifacts.require("./LittlePhilCrowdsale.sol");
const LittlePhilCoin = artifacts.require("./LittlePhilCoin.sol");

module.exports = function(deployer) {
    const rate = new web3.BigNumber(1000);
    const wallet = config.get("MULTISIG_WALLET"); // receiver multisig wallet for Eth
    const cap = config.get("CROWDSALE_HARDCAP_WEI");

    return deployer
        .then(() => {
            return deployer.deploy(LittlePhilCoin);
        })
        .then(() => {
            return deployer.deploy(
            LittlePhilCrowdsale,
            rate,
            wallet,
            LittlePhilCoin.address,
            cap
        );
    });
};
