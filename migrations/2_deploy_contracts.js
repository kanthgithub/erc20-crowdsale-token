const LittlePhilCrowdsale = artifacts.require("./LittlePhilCrowdsale.sol");
const LittlePhilCoin = artifacts.require("./LittlePhilCoin.sol");

module.exports = function(deployer) {
  const rate = new web3.BigNumber(1000);
  const wallet = "0x5e611e34cfb6fd0a6f6f0c61038e80465a5b9fea";

  return deployer
    .then(() => {
      return deployer.deploy(LittlePhilCoin);
    })
    .then(() => {
      return deployer.deploy(
        LittlePhilCrowdsale,
        rate,
        wallet,
        LittlePhilCoin.address
      );
    });
};
