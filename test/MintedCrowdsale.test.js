/**
 * Tests to check that changes to the LittlePhilCrowdsale still pass the tests from the open zeppelin framework.
 * This test is taken directly from the open zeppelin test but modified to use the LittlePhilCrowdsale contract.
 */
const ether = require('./helpers/ether');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const LittlePhilCoin = artifacts.require("LittlePhilCoin.sol");
const LittlePhilCrowdsale = artifacts.require("LittlePhilCrowdsale.sol");

contract('LittlePhilCrowdsale as MintedCrowdsale', ([_, wallet, investor, purchaser]) => {
    const rate = new BigNumber(1000);
    const value = ether(12);

    let expectedTokenAmount;

    beforeEach(async function () {
        this.token = await LittlePhilCoin.new();
        this.crowdsale = await LittlePhilCrowdsale.new(rate, wallet, this.token.address);
        await this.token.transferOwnership(this.crowdsale.address);
        await this.crowdsale.setState(1);
        await this.crowdsale.addToWhitelist(_);
        await this.crowdsale.addToWhitelist(investor);
        await this.crowdsale.addToWhitelist(purchaser);

        expectedTokenAmount = rate.mul(value).mul(await this.crowdsale.getCurrentTierRatePercentage()).div(100);
    });

    describe('accepting payments', function () {
        it('should be token owner', async function () {
            const owner = await this.token.owner();
            owner.should.equal(this.crowdsale.address);
        });

        it('should accept payments', async function () {
            await this.crowdsale.send(value).should.be.fulfilled;
            await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
        });
    });

    describe('high-level purchase', function () {
        it('should log purchase', async function () {
            const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
            const event = logs.find(e => e.event === 'TokenPurchase');
            should.exist(event);
            event.args.purchaser.should.equal(investor);
            event.args.beneficiary.should.equal(investor);
            event.args.value.should.be.bignumber.equal(value);
            event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should assign tokens to sender', async function () {
            await this.crowdsale.sendTransaction({ value: value, from: investor });
            let balance = await this.token.balanceOf(investor);
            balance.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should forward funds to wallet', async function () {
            const pre = web3.eth.getBalance(wallet);
            await this.crowdsale.sendTransaction({ value, from: investor });
            const post = web3.eth.getBalance(wallet);
            post.minus(pre).should.be.bignumber.equal(value);
        });
    });

    // it('should insert an item', async () => {
    //     assert.true(true);
    //     // const crowdsaleInstance = LittlePhilCrowdsale.new({
    //     //     from: accounts[0]
    //     // });
    //     //
    //     // const result = await crowdsaleInstance.insert.call(1, 1234, {from: accounts[0]});
    //     // assert.equal(result, 1);
    // });
});