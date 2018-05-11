pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "./inheritable/InitialSupplyCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "./inheritable/TieredCrowdsale.sol";

contract LittlePhilCrowdsale is MintedCrowdsale, TieredCrowdsale, InitialSupplyCrowdsale, WhitelistedCrowdsale {

    /**
    * Event for rate-change logging
    * @param rate the new ETH-to_LPC exchange rate
    */
    event NewRate(uint256 rate);

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

    /**
     * @dev sets (updates) the ETH-to-LPC exchange rate
     * @param _rate ate that will applied to ETH to derive how many LPC to mint
     * does not affect, nor influenced by the bonus rates based on the current tier.
     */
    function setRate(uint256 _rate) public onlyOwner {
        require(_rate > 0);
        rate = _rate;
        emit NewRate(_rate);
    }

}