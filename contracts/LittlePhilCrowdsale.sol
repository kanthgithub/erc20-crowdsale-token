pragma solidity ^0.4.21;

import "./LittlePhilCoin.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

contract LittlePhilCrowdsale is MintedCrowdsale { 
    constructor(uint256 _rate, address _wallet, MintableToken _token) 
    public 
        Crowdsale(_rate, _wallet, _token) {
        
    }
}