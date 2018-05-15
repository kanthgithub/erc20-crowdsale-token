const global = require('./utils/global');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('InitialSupplyCrowdsale', (accounts) => {

    beforeEach(async function () {
        await global.setupContracts(this, accounts);
    });

    describe('have correct initial balances', function () {

        it('project account has 150M balance', async function() {
            const expectedBalance = new BigNumber(150000000e+18);
            const address = await this.crowdsale.projectWallet();
            const balance = await this.token.balanceOf(address);
            const supplyCount = await this.crowdsale.projectTokens();
            balance.should.be.bignumber.equal(supplyCount);
            balance.should.be.bignumber.equal(expectedBalance);
        });

        it('advisor account has 100M balance', async function() {
            const expectedBalance = new BigNumber(100000000e+18);
            const address = await this.crowdsale.advisorWallet();
            const balance = await this.token.balanceOf(address);
            const supplyCount = await this.crowdsale.advisorTokens();
            balance.should.be.bignumber.equal(supplyCount);
            balance.should.be.bignumber.equal(expectedBalance);
        });

        it('bounty account has 30M balance', async function() {
            const expectedBalance = new BigNumber(30000000e+18);
            const address = await this.crowdsale.bountyWallet();
            const balance = await this.token.balanceOf(address);
            const supplyCount = await this.crowdsale.bountyTokens();
            balance.should.be.bignumber.equal(supplyCount);
            balance.should.be.bignumber.equal(expectedBalance);
        });

        it('airdrop account has 20M balance', async function() {
            const expectedBalance = new BigNumber(20000000e+18);
            const address = await this.crowdsale.airdropWallet();
            const balance = await this.token.balanceOf(address);
            const supplyCount = await this.crowdsale.airdropTokens();
            balance.should.be.bignumber.equal(supplyCount);
            balance.should.be.bignumber.equal(expectedBalance);
        });

        it('team account has zero balance', async function() {
            const expectedBalance = new BigNumber(0e+18);
            const address = await this.crowdsale.teamWallet();
            const balance = await this.token.balanceOf(address);
            balance.should.be.bignumber.equal(expectedBalance);
        });

    });

    describe('timelocks are holding correct balances', function () {

        it('team timelock1 has 75M balance', async function() {
            const expectedBalance = new BigNumber(75000000e+18);
            const address = await this.crowdsale.teamTimeLock1();
            const balance = await this.token.balanceOf(address);
            const supplyCount = await this.crowdsale.teamTokens() / 2;
            balance.should.be.bignumber.equal(supplyCount);
            balance.should.be.bignumber.equal(expectedBalance);
        });

        it('team timelock2 has 75M balance', async function() {
            const expectedBalance = new BigNumber(75000000e+18);
            const address = await this.crowdsale.teamTimeLock2();
            const balance = await this.token.balanceOf(address);
            const supplyCount = await this.crowdsale.teamTokens() / 2;
            balance.should.be.bignumber.equal(supplyCount);
            balance.should.be.bignumber.equal(expectedBalance);
        });


    });

    describe('check for calls to setupInitialSupply', function () {


        it('should reject calls to setupInitialSupply', async function() {

            try {
                await this.crowdsale.setupInitialSupply({from: accounts[1]});
            } catch(err) {
                expect(err.message).to.equal("this.crowdsale.setupInitialSupply is not a function");
            }
        });

        it('should fail on multiple calls to setupInitialState', async function () {
            await this.crowdsale.setupInitialState().should.be.rejectedWith('revert');
        });

    });

});