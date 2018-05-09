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

contract('LittlePhilCrowdsale as MintedCrowdsale', (accounts) => {
    const [_, wallet, supplierWallet, teamWallet, projectWallet, advisorWallet, bountyWallet, airdropWallet, account1, account2] = accounts;
    const rate = new BigNumber(1000);
    const value = ether(12);

    const expectedTokenAmount = rate.mul(value);

    beforeEach(async function () {
        this.token = await LittlePhilCoin.new();
        this.crowdsale = await LittlePhilCrowdsale.new(
            rate,
            wallet,
            [supplierWallet, teamWallet, projectWallet, advisorWallet, bountyWallet, airdropWallet],
            this.token.address
        );
        await this.token.transferOwnership(this.crowdsale.address);
        await this.crowdsale.setupInitialSupply();

        await this.crowdsale.addToWhitelist(_);
        await this.crowdsale.addToWhitelist(account1);
        await this.crowdsale.addToWhitelist(account2);
    });

    describe('accepting payments', function () {
        it('should be token owner', async function () {
            const owner = await this.token.owner();
            owner.should.equal(this.crowdsale.address);
        });

        it('should accept payments', async function () {
            await this.crowdsale.send(value).should.be.fulfilled;
            await this.crowdsale.buyTokens(account1, { value: value, from: account1 }).should.be.fulfilled;
        });
    });

    describe('high-level purchase', function () {
        it('should log purchase', async function () {
            const { logs } = await this.crowdsale.sendTransaction({ value: value, from: account1 });
            const event = logs.find(e => e.event === 'TokenPurchase');
            should.exist(event);
            event.args.purchaser.should.equal(account1);
            event.args.beneficiary.should.equal(account1);
            event.args.value.should.be.bignumber.equal(value);
            event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should assign tokens to sender', async function () {
            await this.crowdsale.sendTransaction({ value: value, from: account1 });
            let balance = await this.token.balanceOf(account1);
            balance.should.be.bignumber.equal(expectedTokenAmount);
        });

        it('should forward funds to wallet', async function () {
            const pre = web3.eth.getBalance(wallet);
            await this.crowdsale.sendTransaction({ value, from: account1 });
            const post = web3.eth.getBalance(wallet);
            post.minus(pre).should.be.bignumber.equal(value);
        });
    });

});