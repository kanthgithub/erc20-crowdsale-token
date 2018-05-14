const global = require('./utils/global');
const config = require("config");

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Crowdsale', function (accounts) {
    let owner;

    beforeEach(async function () {
        await global.setupContracts(this, accounts);

        crowdsale = this.crowdsale;
        token = this.token;
        await crowdsale.setState(1);

        owner = this._;
        await crowdsale.addToWhitelist(owner);
        notOwner = accounts[1];
        await crowdsale.addToWhitelist(notOwner);
      });
    
    describe('Rate value', () => {

        it('has a default of ' + config.get('RATE'), async () => {
            const deployedRate = await crowdsale.rate();
            deployedRate.should.be.bignumber.equal(new web3.BigNumber(config.get('RATE')));
        });

        it('can only be changed by owner ', async () => {
            const newRate = 3;
            await crowdsale.setRate(newRate, {from: owner}).should.not.be.rejected;
        });


        it('cannot be changed by non-owner ', async () => {
            const newRate = 3;
            await crowdsale.setRate(newRate, {from: notOwner}).should.be.rejectedWith('revert');
        });

        describe('when changed', () => {

            it('should not be rejected', async () => {
                const newRate = 4;
                await crowdsale.setRate(newRate, {from: notOwner}).should.be.rejected;
            });

            it('is the new value', async () => {
                const newRate = 5;
                crowdsale.setRate(newRate);
                const deployedRate = await crowdsale.rate();
                deployedRate.should.be.bignumber.equal(newRate);
            });

            it('cannot be changed to 0', async () => {
                const newRate = 0;
                await crowdsale.setRate(newRate).should.be.rejectedWith('revert');
            });

            it('emits a NewRate event', async function () {
                const newRate = 6;
                const { logs } = await crowdsale.setRate(newRate);
                const event = logs.find(e => e.event === 'NewRate');
                should.exist(event);
                event.args.rate.should.be.bignumber.equal(newRate);
            });

            it('modifies the LPC sale rate', async () => {
                let expectedTokenAmount;
                let previousBalance;
                let balance;
                const initialRate = 7;
                const newRate = 8;
                const value = new web3.BigNumber(web3.toWei(200000000000000000, "wei"));

                previousBalance = await token.balanceOf(owner);
                await crowdsale.setRate(initialRate);
                expectedTokenAmount = value.mul(initialRate);
                await crowdsale.sendTransaction({ value: value, from: owner });
                balance = await token.balanceOf(owner);
                balance.should.be.bignumber.equal(expectedTokenAmount.add(previousBalance));

                previousBalance = await token.balanceOf(owner);
                await crowdsale.setRate(newRate);
                expectedTokenAmount = value.mul(newRate);
                await crowdsale.sendTransaction({ value: value, from: owner });
                balance = await token.balanceOf(owner);
                balance.should.be.bignumber.equal(expectedTokenAmount.add(previousBalance));

            });

        });        

    });

});

