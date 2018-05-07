pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract LittlePhilCoin is MintableToken {
    string public name = "Little Phil Coin";
    string public symbol = "LPC";
    uint8 public decimals = 18;
}