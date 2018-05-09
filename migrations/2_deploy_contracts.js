const LittlePhilCrowdsale = artifacts.require("./LittlePhilCrowdsale.sol");
const LittlePhilCoin = artifacts.require("./LittlePhilCoin.sol");

module.exports = function(deployer) {
  const rate = new web3.BigNumber(1000);
  const wallet = "0xe35FEf8d3E0BDBe34318aAf2611e40ACc29FaAB6"; // receiver multisig wallet for Eth

  return deployer
    .then(() => {
      return deployer.deploy(LittlePhilCoin);
    })
    .then(() => {
      return deployer.deploy(
        LittlePhilCrowdsale,
        rate,
        wallet,
        [
          "0x1237f06879194c9aff04f4763Dc9234Fd92D3959",
          "0x1237f06879194c9aff04f4763Dc9234Fd92D3959",
          "0x1237f06879194c9aff04f4763Dc9234Fd92D3959",
          "0x1237f06879194c9aff04f4763Dc9234Fd92D3959",
          "0x1237f06879194c9aff04f4763Dc9234Fd92D3959",
          "0x1237f06879194c9aff04f4763Dc9234Fd92D3959"
        ],
        LittlePhilCoin.address,
      );
    });
};
