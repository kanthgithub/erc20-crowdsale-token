pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "./inheritable/InitialSupplyCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract LittlePhilCrowdsale is MintedCrowdsale, WhitelistedCrowdsale, CappedCrowdsale, InitialSupplyCrowdsale {

    // Constructor
    constructor(
        uint256 _rate,
        address _fundsWallet,
        address[6] _supplyWallets,
        LittlePhilCoin _token,
        uint256 _cap
    ) public
        Crowdsale(_rate, _fundsWallet, _token)
        CappedCrowdsale(_cap)
        InitialSupplyCrowdsale(_supplyWallets) {}

    // Sets up the initial balances
    // This must be called after ownership of the token is transferred to the crowdsale
    function setupInitialState() external onlyOwner {
        setupInitialSupply();
    }

    // Ownership management
    function transferOwnership(address _newOwner) public onlyOwner {
        require(msg.sender == owner); // Only the owner of the crowdsale contract should be able to call this function.

        // I assume the crowdsale contract holds a reference to the token contract.
        LittlePhilCoin(token).transferOwnership(_newOwner);
    }
}