const global = require('./utils/global');
const ether = require('./utils/ether');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LittlePhilCoin as PausableToken', (accounts) => {
    // const rate = new BigNumber(1000);
    const value = ether(10);
    const transferValue = ether(5);

    //
    // const expectedTokenAmount = rate.mul(value);

    beforeEach(async function () {
        await global.setupContracts(this, accounts);

        // TODO - Uncomment this when the TieredCrowdsale is implemented
        // await this.crowdsale.setState(1);

        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

        await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 });
        await this.crowdsale.buyTokens(this.account2, { value: value, from: this.account2 });
    });

    describe('when token is paused', async function () {

        it('should deny transactions', async function () {
            await this.token.transfer(this.account2, transferValue, { from: this.account1 }).should.be.rejected;
        });

        it('should allow purchases', async function () {
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.fulfilled;
        });

    });

    describe('when token is unpaused', async function () {

        beforeEach(async function () {
            await this.crowdsale.transferOwnership(this._);
            await this.token.unpause();
        });

        it('should allow transactions', async function () {
            await this.token.transfer(this.account2, transferValue, { from: this.account1 }).should.be.fulfilled;
        });

        it('should deny purchases', async function () {
            // Should reject because the crowdsale is no longer the owner so it can't mint any more tokens
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejected;
        });

    });

});