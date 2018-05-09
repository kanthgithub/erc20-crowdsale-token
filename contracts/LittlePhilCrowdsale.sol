pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "./inheritable/InitialSupplyCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";

contract LittlePhilCrowdsale is MintedCrowdsale, WhitelistedCrowdsale, InitialSupplyCrowdsale {

    constructor(
        uint256 _rate,
        address _fundsWallet,
        address[6] _supplyWallets,
        LittlePhilCoin _token
    ) public
        Crowdsale(_rate, _fundsWallet, _token)
        InitialSupplyCrowdsale(_supplyWallets) {}

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