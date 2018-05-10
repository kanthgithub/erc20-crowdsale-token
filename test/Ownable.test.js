const global = require('./utils/global');
const assertRevert = require('./utils/assertRevert.js');


contract('Crowdsale is Ownable', function (accounts) {
    let crowdsale;

    beforeEach(async function () {
        await global.setupContracts(this, accounts);

        crowdsale = this.crowdsale;
        token = this.token;
    });

    it('should have an owner', async function () {
        let owner = await crowdsale.owner();
        assert.isTrue(owner !== 0);
    });

    it('changes owner after transfer', async function () {
        let other = accounts[1];
        await crowdsale.transferOwnership(other);
        let owner = await crowdsale.owner();
    
        assert.isTrue(owner === other);
    });

    it('should prevent non-owners from transfering', async function () {
        const other = accounts[2];
        const owner = await crowdsale.owner.call();
        assert.isTrue(owner !== other);
        await assertRevert(crowdsale.transferOwnership(other, { from: other }));
    });

    it('should guard ownership against stuck state', async function () {
        let originalOwner = await crowdsale.owner();
        await assertRevert(crowdsale.transferOwnership(null, { from: originalOwner }));
    });

    describe('should manage ownership of token', function () {

        it('should transfer ownership to new owner', async function() {
            let nextOwner = accounts[1];
            await crowdsale.transferTokenOwnership(nextOwner);
            let newOwner = await token.owner();
        
            assert.isTrue(nextOwner === newOwner);
            assert.isFalse(newOwner === this._);
        });
    });

});


contract('Token is Ownable', function (accounts) {
    let crowdsale;
    let token;

    beforeEach(async function () {
        await global.setupContracts(this, accounts);

        crowdsale = this.crowdsale;
        token = this.token;

        // have the crowdsale transfer ownership BACK to 'this._' for testing purposes
        await crowdsale.transferTokenOwnership(this._);
    });

    it('should have an owner', async function () {
        let owner = await token.owner();
        assert.isTrue(owner !== 0);
    });

    it('changes owner after transfer', async function () {
        let other = accounts[1];
        await token.transferOwnership(other);
        let owner = await token.owner();
    
        assert.isTrue(owner === other);
      });

    it('should prevent non-owners from transfering', async function () {
        const other = accounts[2];
        const owner = await token.owner.call();
        assert.isTrue(owner !== other);
        await assertRevert(token.transferOwnership(other, { from: other }));
    });

    it('should guard ownership against stuck state', async function () {
        let originalOwner = await token.owner();
        await assertRevert(token.transferOwnership(null, { from: originalOwner }));
    });

    
});


