const global = require('./utils/global');
const ether = require('./utils/ether');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('WhitelistedCrowdsale', function (accounts) {
  const value = new web3.BigNumber(web3.toWei(3000000000000000, 'wei'));

  let authorized;
  let unauthorized;

  describe('single user whitelisting', function () {

      beforeEach(async function () {
          await global.setupContracts(this, accounts);

          wallet = this.wallet;
          authorized = this.account1;
          unauthorized = this.account2;

          await this.crowdsale.setState(1);
          await this.crowdsale.addToWhitelist(authorized);
      });

    describe('accepting payments', function () {

      it('should accept payments to whitelisted (from whichever buyers)', async function () {
        await this.crowdsale.buyTokens(authorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.buyTokens(authorized, { value: value, from: unauthorized }).should.be.fulfilled;
      });

      it('should reject payments to not whitelisted (from whichever buyers)', async function () {
        await this.crowdsale.send(value).should.be.rejected;
        await this.crowdsale.buyTokens(unauthorized, { value: value, from: unauthorized }).should.be.rejected;
        await this.crowdsale.buyTokens(unauthorized, { value: value, from: authorized }).should.be.rejected;
      });

      it('should reject payments to addresses removed from whitelist', async function () {
        await this.crowdsale.removeFromWhitelist(authorized);
        await this.crowdsale.buyTokens(authorized, { value: value, from: authorized }).should.be.rejected;
      });

    });

    describe('reporting whitelisted', function () {
      it('should correctly report whitelisted addresses', async function () {
        let isAuthorized = await this.crowdsale.whitelist(authorized);
        isAuthorized.should.equal(true);
        let isntAuthorized = await this.crowdsale.whitelist(unauthorized);
        isntAuthorized.should.equal(false);
      });
    });

  });

  describe('many user whitelisting', function () {
    beforeEach(async function () {
      await global.setupContracts(this, accounts);

      wallet = this.wallet;
      authorized = this.account1;
      unauthorized = this.account2;

      await this.crowdsale.setState(1);      
      await this.crowdsale.addToWhitelist(authorized);
    });

    describe('accepting payments', function () {

      it('should accept payments to whitelisted (from whichever buyers)', async function () {
        await this.crowdsale.buyTokens(authorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.buyTokens(authorized, { value: value, from: unauthorized }).should.be.fulfilled;
      });

      it('should reject payments to not whitelisted (with whichever buyers)', async function () {
        await this.crowdsale.send(value).should.be.rejected;
        await this.crowdsale.buyTokens(unauthorized, { value: value, from: unauthorized }).should.be.rejected;
        await this.crowdsale.buyTokens(unauthorized, { value: value, from: authorized }).should.be.rejected;
      });

      it('should reject payments to addresses removed from whitelist', async function () {
        await this.crowdsale.addToWhitelist(unauthorized);
        await this.crowdsale.removeFromWhitelist(unauthorized);
        await this.crowdsale.buyTokens(authorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.buyTokens(unauthorized, { value: value, from: authorized }).should.be.rejected;
      });

    });

    describe('reporting whitelisted', function () {
      it('should correctly report whitelisted addresses', async function () {
        let isAuthorized = await this.crowdsale.whitelist(authorized);
        isAuthorized.should.equal(true);
        let isntAuthorized = await this.crowdsale.whitelist(unauthorized);
        isntAuthorized.should.equal(false);
      });
    });

  });

});
