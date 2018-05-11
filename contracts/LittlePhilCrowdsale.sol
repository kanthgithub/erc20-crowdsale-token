pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "./inheritable/InitialSupplyCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "./inheritable/TieredCrowdsale.sol";

contract LittlePhilCrowdsale is MintedCrowdsale, TieredCrowdsale, InitialSupplyCrowdsale, WhitelistedCrowdsale { 

    // Constructor
    constructor(
        uint256 _rate,
        address _fundsWallet,
        address[6] _supplyWallets,
        LittlePhilCoin _token
    ) public
    Crowdsale(_rate, _fundsWallet, _token)
    InitialSupplyCrowdsale(_supplyWallets) {}

    // Sets up the initial balances
    // This must be called after ownership of the token is transferred to the crowdsale
    function setupInitialState() external onlyOwner {
        setupInitialSupply();
    }

    // Ownership management
    function transferTokenOwnership(address _newOwner) public onlyOwner {
        // I assume the crowdsale contract holds a reference to the token contract.
        LittlePhilCoin(token).transferOwnership(_newOwner);
    }

    // Called at the end of the crowdsale when it is eneded
    function crowdsaleClosed () internal {
        unit256 remainingTokens = tokenCap.sub(tokensRaised);
        _deliverTokens(airdropWallet, remainingTokens);
    }

}