pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";


contract LittlePhilCrowdsale is MintedCrowdsale, WhitelistedCrowdsale, CappedCrowdsale { 
    
    // Constructor
    constructor(
        uint256 _rate, 
        address _wallet, 
        MintableToken _token,
        uint256 _cap
    )
    public
    Crowdsale(_rate, _wallet, _token) {}


    // Ownership management
    function transferOwnership(address _newOwner) public onlyOwner {
        require(msg.sender == owner); // Only the owner of the crowdsale contract should be able to call this function.

        // I assume the crowdsale contract holds a reference to the token contract.
        LittlePhilCoin(token).transferOwnership(_newOwner);

    }
}