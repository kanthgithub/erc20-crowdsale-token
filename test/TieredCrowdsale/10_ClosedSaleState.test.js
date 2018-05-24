/**
 * Testing each tier for investment amount in wei and returned LPC, based off state rate
 */
const global = require('../utils/global');
const ether = require('../utils/ether');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('TieredCrowdsale', (accounts) => {
    const rate = new BigNumber(1000);
    const value = ether(0.3);

    const expectedTokenAmount = value.mul(rate);

    beforeEach(async function () {

        await global.setupContracts(this, accounts);

        await this.crowdsale.setState(10);
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('Closed SaleState', function () {

        it('should return correct integer value for cap values', async function () {
            const cap = await this.crowdsale.getCurrentTierHardcap();
            const expectedCap = new BigNumber(400000000 * 10 ** 18);

            cap.should.bignumber.equal(expectedCap);
        });

        it('should not accept transactions', async function () {
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejectedWith('revert');
        });

        it('should not return LPC', async function () {
            const startBal = await this.token.balanceOf(this.account1);
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejectedWith('revert');
            (await this.token.balanceOf(this.account1)).should.bignumber.equal(startBal);
        });

        it('should not receive ETH in multisig wallet', async function () {
            const startBal = await web3.eth.getBalance(this.wallet);
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejectedWith('revert');
            (await web3.eth.getBalance(this.wallet)).should.bignumber.equal(startBal);
        });

    });

});