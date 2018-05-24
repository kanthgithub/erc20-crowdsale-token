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

        await this.crowdsale.setState(3);
        await this.crowdsale.addToWhitelist(this._);
        await this.crowdsale.addToWhitelist(this.account1);
        await this.crowdsale.addToWhitelist(this.account2);

    });

    describe('PreSale State', function () {

        it('should return correct integer value for cap values', async function () {
            const cap = await this.crowdsale.getCurrentTierHardcap();
            const expectedCap = new BigNumber(180000000 * (10 ** 18));

            cap.should.bignumber.equal(expectedCap);
        });

        it('should accept transactions', async function () {
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.fulfilled;
        });

        it('should return correct LPC amount', async function () {
            const bonus = await this.crowdsale.getCurrentTierRatePercentage();
            const expectedValue = expectedTokenAmount.mul(bonus).div(100);
            
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.fulfilled;
            (await this.token.balanceOf(this.account1)).should.bignumber.equal(expectedValue);
        });

        it('should receive ETH in multisig wallet', async function () {
            const startBal = await web3.eth.getBalance(this.wallet);
            
            await this.crowdsale.buyTokens(this.account1, { value: value, from: this.account1 }).should.be.fulfilled;
            
            const endBal = await web3.eth.getBalance(this.wallet);
            endBal.should.bignumber.equal(startBal.add(value));
        });

        describe('when purchase exceeds tier hardcap', function () {

            const underCapPadding = new BigNumber("500000000000000000000");
            const weiToExceedCap = new BigNumber(1);
            let tierBonusRate;
            let tierHardcap;
            let tokensPrePurchase;
            let tokensPostPurchase;
            let tokensToCap;
            let purchaseTarget;
            let purchasePrice;
            let imprecisePurchasePrice;
            let purchaseToCap;

            beforeEach(async function () {

                tierBonusRate = await this.crowdsale.getCurrentTierRatePercentage();
                tierHardcap = await this.crowdsale.getCurrentTierHardcap();
                tokensPrePurchase = await this.crowdsale.tokensRaised();
    
                purchaseTarget = tierHardcap.minus(tokensPrePurchase).minus(underCapPadding);
                purchasePrice = purchaseTarget.div(rate).div(tierBonusRate).mul(100);
    
                imprecisePurchasePrice = new BigNumber(purchasePrice.toPrecision(24));
                await this.crowdsale.buyTokens(this.account1, { value: imprecisePurchasePrice, from: this.account1 });
                tokensPostPurchase = await this.crowdsale.tokensRaised();

                tokensToCap = tierHardcap.minus(tokensPostPurchase);
                
                purchaseToCap = new BigNumber(tokensToCap.div(rate).div(tierBonusRate).mul(100).toPrecision(18));
                purchaseExceedingCap = purchaseToCap.add(weiToExceedCap);

            });

            // it('should have correct test parameters', async function () {
            //     console.log("        ===> Tier bonus rate                      :                                 " + tierBonusRate);
            //     console.log("        ===> Tier hardcap                         : " + tierHardcap.toFormat(0));
            //     console.log("        ===> LPC raised before initial purcahse   :                                   " + tokensPrePurchase.toFormat(0));
            //     console.log("        ===> LPC purchase target                  : " + purchaseTarget.toFormat(0));
            //     console.log("        ===> Wei purchase price                   :     " + purchasePrice.toFormat(0));
            //     console.log("        ===> Imprecise purchase price             :     " + imprecisePurchasePrice.toFormat(0));
            //     console.log("        ===> LPC raised after initial purcahse:   : " + tokensPostPurchase.toFormat(0));
            //     console.log("        ===> LPC remaing before reaching hardcap  :         " + tokensToCap.toFormat(0));
            //     console.log("        ===> Wei purchase price for remaining LPC :             " + purchaseToCap.toFormat(0));
            //     console.log("        ===> Wei purchase price to exceed hardcap :             " + purchaseExceedingCap.toFormat(0));
            // });
            
            it('should emit a CapOverflow event', async function () {
                const {logs} = await this.crowdsale.buyTokens(this.account1, { value: purchaseExceedingCap, from: this.account1 });
                const event = logs.find(e => e.event == 'CapOverflow');
                should.exist(event);
            });

            it('expected LPC should be less than LPC received', async function () {
                const tokensPrePurchase = await this.crowdsale.tokensRaised();
                const {logs} = await this.crowdsale.buyTokens(this.account1, { value: purchaseExceedingCap, from: this.account1 });
                const event = logs.find(e => e.event == 'CapOverflow');
                const tokensPostPurchase = await this.crowdsale.tokensRaised();

                const expectedTokens = (purchaseExceedingCap).mul(rate).mul(tierBonusRate).div(100);
                const actualTokens = tokensPostPurchase.minus(tokensPrePurchase);
                actualTokens.should.be.bignumber.lessThan(expectedTokens);
            });

            it('should not have any tokens remaining for tier', async function () {
                await this.crowdsale.buyTokens(this.account1, { value: purchaseExceedingCap, from: this.account1 });
                tokensPostPurchase = await this.crowdsale.tokensRaised();
                const tokensToCap = tierHardcap.minus(tokensPostPurchase);
                tokensToCap.should.be.bignumber.equal(new BigNumber(0));
            });

            it('should emit correct CapOverflow event values', async function () {
                const tokensPrePurchase = await this.crowdsale.tokensRaised();
                const {logs} = await this.crowdsale.buyTokens(this.account1, { value: purchaseExceedingCap, from: this.account1 });
                const event = logs.find(e => e.event == 'CapOverflow');
                tokensPostPurchase = await this.crowdsale.tokensRaised();
                event.args.sender.should.be.equal(this.account1);
                event.args.weiAmount.should.be.bignumber.equal(purchaseExceedingCap);
                event.args.receivedTokens.should.be.bignumber.equal(tokensPostPurchase.minus(tokensPrePurchase));
                // check difference between actual timestamp and event timestamp is < 5 minutes
                // Note: this doesn't seem to work when tested on a remote test server.  Commented out.
                // const dateNow = new BigNumber(Date.now()).div(1000);
                // (event.args.date.minus(dateNow)).abs().should.be.bignumber.lessThan(300);
            });

            it('should stop minting', async function () {
                await this.crowdsale.buyTokens(this.account1, { value: purchaseExceedingCap, from: this.account1 });
                (await this.crowdsale.capReached()).should.equal(true);
            });

            it('should auto-switch to next ICO state', async function () {
                const currentState = await this.crowdsale.state();
                await this.crowdsale.buyTokens(this.account1, { value: purchaseExceedingCap, from: this.account1 });
                const updatedState = await this.crowdsale.state();
                const expectedState = currentState.add(1);
                expectedState.should.bignumber.equal(updatedState);
            });

        });

    });

});
