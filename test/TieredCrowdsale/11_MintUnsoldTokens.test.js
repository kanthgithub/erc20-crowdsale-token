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
    const value = ether(0.3);

    const expectedTokenAmount = value.mul(rate);

    beforeEach(async function () {

        await global.setupContracts(this, accounts);

        await this.crowdsale.setState(8);
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('Mint unsold tokens', function () {

        it('should mint all crowdsale tokens to airdrop wallet', async function () {
            const currentTokens = await this.token.balanceOf(await this.crowdsale.airdropWallet());
            const remainingTokens = (await this.crowdsale.tokenCap()).sub(await this.crowdsale.tokensRaised());

            await this.crowdsale.setState(10);
            
            const updatedTokens = await this.token.balanceOf(await this.crowdsale.airdropWallet());
            const expectedTokens = currentTokens.add(remainingTokens);
            await updatedTokens.should.bignumber.equal(expectedTokens);
        });

        it('should mint unsold tokens to airdrop wallet', async function () {
            const currentTokens = await this.token.balanceOf(await this.crowdsale.airdropWallet());
            const buyValue = ether(1000);

            tierBonusRate = await this.crowdsale.getCurrentTierRatePercentage();
            tierHardcap = await this.crowdsale.getCurrentTierHardcap();
            tokensPrePurchase = await this.crowdsale.tokensRaised();

            purchaseTarget = tierHardcap.minus(tokensPrePurchase).div(2);
            purchasePrice = purchaseTarget.div(rate).div(tierBonusRate).mul(100);
            await this.crowdsale.buyTokens(this.account1, { value: purchasePrice, from: this.account1 }).should.be.fulfilled;
            tokensPostPurchase = await this.crowdsale.tokensRaised();
            await this.crowdsale.setState(10);

            const cap = await this.crowdsale.tokenCap();
            const raised = await this.crowdsale.tokensRaised();
            const remainingTokens = (cap).sub(raised);
            const updatedTokens = await this.token.balanceOf(await this.crowdsale.airdropWallet());
            const expectedTokens = currentTokens.add(remainingTokens);

            await updatedTokens.should.bignumber.equal(expectedTokens);
        });

    });

});