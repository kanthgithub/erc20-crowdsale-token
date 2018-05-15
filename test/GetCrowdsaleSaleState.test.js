const global = require('./utils/global');
const config = require("config");

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('TieredCrowdsale', function (accounts) {
    let owner;
    let crowdsale;

    beforeEach(async function () {
        await global.setupContracts(this, accounts);

        crowdsale = this.crowdsale;
        owner = this._;
      });
    
    describe('State', () => {

        it('is \'Initial\' when first deployed', async () => {
            assert.equal(await crowdsale.getState(), "Initial");
        });

        it('is \'Initial\' when state is set to 0', async () => {
            await crowdsale.setState(0);
            assert.equal(await crowdsale.getState(), "Initial");
        });

        it('is \'PrivateSale\' when state is set to 1', async () => {
            await crowdsale.setState(1);
            assert.equal(await crowdsale.getState(), "PrivateSale");
        });

        it('is \'FinalisedPrivateSale\' when state is set to 2', async () => {
            await crowdsale.setState(2);
            assert.equal(await crowdsale.getState(), "FinalisedPrivateSale");
        });

        it('is \'PreSale\' when state is set to 3', async () => {
            await crowdsale.setState(3);
            assert.equal(await crowdsale.getState(), "PreSale");
        });

        it('is \'FinalisedPreSale\' when state is set to 4', async () => {
            await crowdsale.setState(4);
            assert.equal(await crowdsale.getState(), "FinalisedPreSale");
        });

        it('is \'PublicSaleTier1\' when state is set to 5', async () => {
            await crowdsale.setState(5);
            assert.equal(await crowdsale.getState(), "PublicSaleTier1");
        });

        it('is \'PublicSaleTier2\' when state is set to 6', async () => {
            await crowdsale.setState(6);
            assert.equal(await crowdsale.getState(), "PublicSaleTier2");
        });

        it('is \'PublicSaleTier3\' when state is set to 7', async () => {
            await crowdsale.setState(7);
            assert.equal(await crowdsale.getState(), "PublicSaleTier3");
        });

        it('is \'PublicSaleTier4\' when state is set to 8', async () => {
            await crowdsale.setState(8);
            assert.equal(await crowdsale.getState(), "PublicSaleTier4");
        });

        it('is \'FinalisedPublicSale\' when state is set to 9', async () => {
            await crowdsale.setState(9);
            assert.equal(await crowdsale.getState(), "FinalisedPublicSale");
        });

        it('is \'Closed\' when state is set to 10', async () => {
            await crowdsale.setState(10);
            assert.equal(await crowdsale.getState(), "Closed");
        });

    });

    describe('State should not be allowed outside enum values', () => {

        beforeEach(async function () {
            await global.setupContracts(this, accounts);
        });

        it('not 11', async function () {
            await this.crowdsale.setState(11).should.be.rejectedWith('invalid opcode');
        });
    
        it('not -1', async function () {
            await this.crowdsale.setState(-1).should.be.rejectedWith('invalid opcode');
        });

    });

});

