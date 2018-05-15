const global = require('./utils/global');
const assertRevert = require('./utils/assertRevert.js');
const ether = require('./utils/ether');

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('CappedToken', (accounts) => {
    const value = ether(12);
    const owner = accounts[0];

    beforeEach(async function () {
        await global.setupContracts(this, accounts);
        
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('Token should not mint after crowdsale', function () {

        it('should reject minting after crowdsale', async function () {
            await this.crowdsale.setState(1);
            await this.crowdsale.setState(10);
            await this.crowdsale.transferTokenOwnership(owner);
            await this.token.mint(this.account1, value, { from: owner }).should.be.rejected;
        });
    });

});