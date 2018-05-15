/**
 * Tests to check that changes to the LittlePhilCrowdsale still pass the tests from the open zeppelin framework.
 * This test is taken directly from the open zeppelin test but modified to use the LittlePhilCrowdsale contract.
 */
const global = require('./utils/global');
const ether = require('./utils/ether');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('LittlePhilCrowdsale as MintedCrowdsale', (accounts) => {
    const rate = new BigNumber(1000);
    const value = ether(12);

    const expectedTokenAmount = value.mul(rate);

    beforeEach(async function () {

        await global.setupContracts(this, accounts);

        await this.crowdsale.setState(1);
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('accepting payments', function () {
        it('should be token owner', async function () {
            const owner = await this.token.owner();
            owner.should.equal(this.crowdsale.address);
        });

        it('should accept payments', async function () {
            await this.crowdsale.send(value).should.be.fulfilled;
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.fulfilled;
        });
    });

    describe('high-level purchase', function () {
        it('should log purchase', async function () {
            const { logs } = await this.crowdsale.sendTransaction({ value: value, from: this.account1 });
            const event = logs.find(e => e.event === 'TokenPurchase');
            should.exist(event);
            event.args.purchaser.should.equal(this.account1);
            event.args.beneficiary.should.equal(this.account1);
            event.args.value.should.be.bignumber.equal(value);
            event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should assign tokens to sender', async function () {
            await this.crowdsale.sendTransaction({ value: value, from: this.account1 });
            let balance = await this.token.balanceOf(this.account1);
            balance.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should forward funds to wallet', async function () {
            const pre = web3.eth.getBalance(this.wallet);
            await this.crowdsale.sendTransaction({ value, from: this.account1 });
            const post = web3.eth.getBalance(this.wallet);
            post.minus(pre).should.be.bignumber.equal(value);
        });
    });

    describe('reject minting from non-owner', function () {
        it("should reject minting from non-owner", async function () {
            await this.token.mint(this.account1, value, { from: this.account2 }).should.be.rejected;
        });
    });

});