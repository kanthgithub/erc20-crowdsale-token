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

        await this.crowdsale.setState(8);
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('Mint unsold tokens', function () {

        it('should mint unsold tokens to airdrop wallet', async function () {
            const currentState = await this.crowdsale.state();
            const currentTokens = await this.token.balanceOf(await this.crowdsale.airdropWallet());

            await this.crowdsale.setState(10);
            const newState = this.crowdsale.state();
            const updatedTokens = await this.token.balanceOf(await this.crowdsale.airdropWallet());
            console.log(currentState, newState);
            console.log(currentTokens, updatedTokens);
        });

    });

});