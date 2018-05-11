const config = require("config");

const LittlePhilCrowdsale = artifacts.require("./LittlePhilCrowdsale.sol");
const LittlePhilCoin = artifacts.require("./LittlePhilCoin.sol");

module.exports = function(deployer) {
    const rate = new web3.BigNumber(config.get('RATE'));
    const wallet = config.get('MULTISIG_WALLET'); // receiver multisig wallet for Eth
    const supplierWallet = config.get('SUPPLIER_WALLET');
    const teamWallet = config.get('TEAM_WALLET');
    const projectWallet = config.get('PROJECT_WALLET');
    const advisorWallet = config.get('ADVISOR_WALLET');
    const bountyWallet = config.get('BOUNTY_WALLET');
    const airdropWallet = config.get('AIRDROP_WALLET');

  return deployer
    .then(() => {
      return deployer.deploy(LittlePhilCoin);
    })
    .then(() => {
      return deployer.deploy(
        LittlePhilCrowdsale,
        rate,
        wallet,
        [supplierWallet, teamWallet, projectWallet, advisorWallet, bountyWallet, airdropWallet],
        LittlePhilCoin.address
      );
    });
};
