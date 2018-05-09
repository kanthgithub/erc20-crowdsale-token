pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract LittlePhilCrowdsale is MintedCrowdsale, WhitelistedCrowdsale, CappedCrowdsale, RefundableCrowdsale { 
    
    // Constructor
    constructor(uint256 _rate, address _wallet, MintableToken _token)
    Crowdsale(_rate, _wallet, _token) CappedCrowdsale(_cap) RefundableCrowdsale(_goal) public {
        // Goal 5000 ETH (5000000000000000000000) Cap 26527.206 ETH (26527206000000000000000)
        require(_goal <= _cap);
    }


    // Ownership management
    function transferOwnership(address _newOwner) public onlyOwner {
        require(msg.sender == owner); // Only the owner of the crowdsale contract should be able to call this function.

        // I assume the crowdsale contract holds a reference to the token contract.
        LittlePhilCoin(token).transferOwnership(_newOwner);

    }
}