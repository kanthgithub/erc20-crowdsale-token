const global = require('./utils/global');
const assertRevert = require('./utils/assertRevert.js');
const ether = require('./utils/ether');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('Token is pausable', function (accounts) {
  let crowdsale;
  let token;
  const owner = accounts[0];
  const anotherAccount = accounts[1];
  const recipient = accounts[2];
  const value = new web3.BigNumber(web3.toWei(200000000000000000, 'wei'));

  beforeEach(async function () {
    await global.setupContracts(this, accounts);
    crowdsale = this.crowdsale;
    token = this.token;

    await crowdsale.setState(1);

    await crowdsale.addToWhitelist(owner);
    await crowdsale.addToWhitelist(anotherAccount);
    await crowdsale.addToWhitelist(recipient);

    await crowdsale.sendTransaction({ value: value, from: owner });
    await crowdsale.transferTokenOwnership(this._);

    await this.token.unpause({ from:owner });

  });

  describe('pause', function () {
    describe('when the sender is the token owner', function () {
      const from = owner;

      describe('when the token is unpaused', function () {
        it('pauses the token', async function () {
          await token.pause({ from });

          const paused = await token.paused();
          assert.equal(paused, true);
        });

        it('emits a Pause event', async function () {
          const { logs } = await token.pause({ from });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Pause');
        });
      });

      describe('when the token is paused', function () {
        beforeEach(async function () {
          await token.pause({ from });
        });

        it('reverts', async function () {
          await assertRevert(token.pause({ from }));
        });
      });
    });

    describe('when the sender is not the token owner', function () {
      const from = anotherAccount;

      it('reverts', async function () {
        await assertRevert(token.pause({ from }));
      });
    });
  });

  describe('unpause', function () {
    describe('when the sender is the token owner', function () {
      const from = owner;

      describe('when the token is paused', function () {
        beforeEach(async function () {
          await token.pause({ from });
        });

        it('unpauses the token', async function () {
          await token.unpause({ from });

          const paused = await token.paused();
          assert.equal(paused, false);
        });

        it('emits an Unpause event', async function () {
          const { logs } = await token.unpause({ from });

          assert.equal(logs.length, 1);
          assert.equal(logs[0].event, 'Unpause');
        });
      });

      describe('when the token is unpaused', function () {
        it('reverts', async function () {
          await assertRevert(token.unpause({ from }));
        });
      });
    });

    describe('when the sender is not the token owner', function () {
      const from = anotherAccount;

      it('reverts', async function () {
        await assertRevert(token.unpause({ from }));
      });
    });
  });

  describe('pausable token', function () {
    const from = owner;

    describe('paused', function () {
      it('is not paused by default', async function () {
        const paused = await token.paused({ from });

        assert.equal(paused, false);
      });

      it('is paused after being paused', async function () {
        await token.pause({ from });
        const paused = await token.paused({ from });

        assert.equal(paused, true);
      });

      it('is not paused after being paused and then unpaused', async function () {
        await token.pause({ from });
        await token.unpause({ from });
        const paused = await token.paused();

        assert.equal(paused, false);
      });
    });

    describe('transfer', function () {
      it('allows to transfer when unpaused', async function () {
        const initialOwnerBalance = await token.balanceOf(owner);
        const initialRecipientBalance = await token.balanceOf(recipient);

        await token.transfer(recipient, 100, { from: owner });

        const senderBalance = await token.balanceOf(owner);
        senderBalance.should.bignumber.equal(initialOwnerBalance.minus(100));

        const recipientBalance = await token.balanceOf(recipient);
        recipientBalance.should.bignumber.equal(initialRecipientBalance.plus(100));
      });

      it('allows to transfer when paused and then unpaused', async function () {
        await token.pause({ from: owner });
        await token.unpause({ from: owner });

        const initialOwnerBalance = await token.balanceOf(owner);
        const initialRecipientBalance = await token.balanceOf(recipient);

        await token.transfer(recipient, 100, { from: owner });

        const senderBalance = await token.balanceOf(owner);
        senderBalance.should.bignumber.equal(initialOwnerBalance.minus(100));

        const recipientBalance = await token.balanceOf(recipient);
        recipientBalance.should.bignumber.equal(initialRecipientBalance.plus(100));
      });

      it('reverts when trying to transfer when paused', async function () {
        await token.pause({ from: owner });

        await assertRevert(token.transfer(recipient, 100, { from: owner }));
      });
    });

    describe('approve', function () {
      it('allows to approve when unpaused', async function () {
        await token.approve(anotherAccount, 40, { from: owner });

        const allowance = await token.allowance(owner, anotherAccount);
        assert.equal(allowance, 40);
      });

      it('allows to transfer when paused and then unpaused', async function () {
        await token.pause({ from: owner });
        await token.unpause({ from: owner });

        await token.approve(anotherAccount, 40, { from: owner });

        const allowance = await token.allowance(owner, anotherAccount);
        assert.equal(allowance, 40);
      });

      it('reverts when trying to transfer when paused', async function () {
        await token.pause({ from: owner });

        await assertRevert(token.approve(anotherAccount, 40, { from: owner }));
      });
    });

    describe('transfer from', function () {
      beforeEach(async function () {
        await token.approve(anotherAccount, 50, { from: owner });
      });

      it('allows to transfer from when unpaused', async function () {
        const initialOwnerBalance = await token.balanceOf(owner);
        const initialRecipientBalance = await token.balanceOf(recipient);

        await token.transferFrom(owner, recipient, 40, { from: anotherAccount });

        const senderBalance = await token.balanceOf(owner);
        // assert.equal(senderBalance, 60);
        senderBalance.should.bignumber.equal(initialOwnerBalance.minus(40));

        const recipientBalance = await token.balanceOf(recipient);
        // assert.equal(recipientBalance, 40);
        recipientBalance.should.bignumber.equal(initialRecipientBalance.plus(40));

      });

      it('allows to transfer when paused and then unpaused', async function () {
        await token.pause({ from: owner });
        await token.unpause({ from: owner });

        const initialOwnerBalance = await token.balanceOf(owner);
        const initialRecipientBalance = await token.balanceOf(recipient);

        await token.transferFrom(owner, recipient, 40, { from: anotherAccount });

        const senderBalance = await token.balanceOf(owner);
        // assert.equal(senderBalance, 60);
        senderBalance.should.bignumber.equal(initialOwnerBalance.minus(40));


        const recipientBalance = await token.balanceOf(recipient);
        // assert.equal(recipientBalance, 40);
        recipientBalance.should.bignumber.equal(initialRecipientBalance.plus(40));
      });

      it('reverts when trying to transfer from when paused', async function () {
        await token.pause({ from: owner });

        await assertRevert(token.transferFrom(owner, recipient, 40, { from: anotherAccount }));
      });
    });

    describe('decrease approval', function () {
      beforeEach(async function () {
        await token.approve(anotherAccount, 100, { from: owner });
      });

      it('allows to decrease approval when unpaused', async function () {
        await token.decreaseApproval(anotherAccount, 40, { from: owner });

        const allowance = await token.allowance(owner, anotherAccount);
        assert.equal(allowance, 60);
      });

      it('allows to decrease approval when paused and then unpaused', async function () {
        await token.pause({ from: owner });
        await token.unpause({ from: owner });

        await token.decreaseApproval(anotherAccount, 40, { from: owner });

        const allowance = await token.allowance(owner, anotherAccount);
        assert.equal(allowance, 60);
      });

      it('reverts when trying to transfer when paused', async function () {
        await token.pause({ from: owner });

        await assertRevert(token.decreaseApproval(anotherAccount, 40, { from: owner }));
      });
    });

    describe('increase approval', function () {
      beforeEach(async function () {
        await token.approve(anotherAccount, 100, { from: owner });
      });

      it('allows to increase approval when unpaused', async function () {
        await token.increaseApproval(anotherAccount, 40, { from: owner });

        const allowance = await token.allowance(owner, anotherAccount);
        assert.equal(allowance, 140);
      });

      it('allows to increase approval when paused and then unpaused', async function () {
        await token.pause({ from: owner });
        await token.unpause({ from: owner });

        await token.increaseApproval(anotherAccount, 40, { from: owner });

        const allowance = await token.allowance(owner, anotherAccount);
        assert.equal(allowance, 140);
      });

      it('reverts when trying to increase approval when paused', async function () {
        await token.pause({ from: owner });

        await assertRevert(token.increaseApproval(anotherAccount, 40, { from: owner }));
      });
    });
  });
});
