pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";

contract LittlePhilCoin is MintableToken, PausableToken {
    string public name = "Little Phil Coin";
    string public symbol = "LPC";
    uint8 public decimals = 18;
}