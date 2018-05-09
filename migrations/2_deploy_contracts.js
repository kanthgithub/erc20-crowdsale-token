const config = require("config");

const LittlePhilCrowdsale = artifacts.require("./LittlePhilCrowdsale.sol");
const LittlePhilCoin = artifacts.require("./LittlePhilCoin.sol");

module.exports = function(deployer) {
    const rate = new web3.BigNumber(1000);
    const wallet = config.get("MULTISIG_WALLET"); // receiver multisig wallet for Eth
    const goal = config.get("MINIMUM_GOAL_WEI"); //amount in wei
    const cap = config.get("CROWDSALE_HARDCAP_WEI"); //amount in wei

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
            goal,
            cap
        );
    });
};
