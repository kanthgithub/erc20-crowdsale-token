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
    const value = ether(12);

    const expectedTokenAmount = value.mul(rate);

    beforeEach(async function () {

        await global.setupContracts(this, accounts);

        await this.crowdsale.setState(9);
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('Finalised Presale SaleState', function () {

        it('should return correct LPC amount', async function () {
            const expectedValue = new BigNumber(0);

            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejected;
            (await this.token.balanceOf(this.account1)).should.bignumber.equal(expectedValue);
        });

        it('should receive eth in multisig wallet', async function () {
            const startBal = await web3.eth.getBalance(this.wallet);

            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejected;

            const endBal = await web3.eth.getBalance(this.wallet);
            startBal.should.bignumber.equal(endBal);
        });

        it('should stop minting when cap is reached', async function () {
            await this.crowdsale.capReached().should.eventually.equal(true);
        });

        it('should accept transactions based on state', async function () {
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.rejected;
        });

        it("should auto switch between ICO states", async function () {
            const currentState = await this.crowdsale.state();

            await this.crowdsale.setState(10);

            const updatedState = await this.crowdsale.state();
            const expectedState = currentState.add(1);

            expectedState.should.bignumber.equal(updatedState);
        });

        it('should return correct integer value for cap values', async function () {
            const cap = await this.crowdsale.getCurrentTierHardcap();
            const expectedCap = new BigNumber(0);

            cap.should.bignumber.equal(expectedCap);
        });

    });

});