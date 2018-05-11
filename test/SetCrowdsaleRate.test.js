const global = require('./utils/global');
const config = require("config");


const BigNumber = web3.BigNumber;

contract('Crowdsale Rate', function (accounts) {

    beforeEach(async function () {
        await global.setupContracts(this, accounts);
        crowdsale = this.crowdsale;
        token = this.token;
    
        // await crowdsale.addToWhitelist(owner);
        // await crowdsale.addToWhitelist(anotherAccount);
        // await crowdsale.addToWhitelist(recipient);
    
        // await crowdsale.sendTransaction({ value: value, from: owner });
        // await crowdsale.transferTokenOwnership(this._);
    
      });
    
    describe('has a default value of ' + config.get('RATE'), () => {

        it('something', async () => {
            const oldRate = await this.crowdsale.rate();
            console.log(oldRate);
        });

    });
    

});

