/**
 * File for anything that needs to be shared between multiple test suits
 */

const config = require("config");

const BigNumber = web3.BigNumber;

const LittlePhilCoin = artifacts.require("LittlePhilCoin.sol");
const LittlePhilCrowdsale = artifacts.require("LittlePhilCrowdsale.sol");

/**
 * Setups the contracts within the given closure
 * @param _this - The closure to
 * @param accounts
 */
const setupContracts = async (_this, accounts) => {

    const [_, wallet, companyWallet, teamWallet, projectWallet, advisorWallet, bountyWallet, airdropWallet, account1, account2] = accounts;
    const rate = new BigNumber(config.get('RATE'));

    // Assign wallets to closure
    _this._ = _;
    _this.wallet = wallet;
    _this.companyWallet = companyWallet;
    _this.teamWallet = teamWallet;
    _this.projectWallet = projectWallet;
    _this.advisorWallet = advisorWallet;
    _this.bountyWallet = bountyWallet;
    _this.airdropWallet = airdropWallet;
    _this.account1 = account1;
    _this.account2 = account2;

    _this.rate = rate;

    _this.token = await LittlePhilCoin.new();
    _this.crowdsale = await LittlePhilCrowdsale.new(
        rate,
        wallet,
        [companyWallet, teamWallet, projectWallet, advisorWallet, bountyWallet, airdropWallet],
        _this.token.address
    );
    await _this.token.transferOwnership(_this.crowdsale.address);
    await _this.crowdsale.setupInitialState();

};

module.exports.setupContracts = setupContracts;