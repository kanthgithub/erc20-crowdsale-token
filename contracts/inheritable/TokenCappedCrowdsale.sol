pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";


/**
 * @title TokenCappedCrowdsale
 * @dev Crowdsale with a limit for total minted tokens.
 */
contract TokenCappedCrowdsale is Crowdsale {
    using SafeMath for uint256;

    uint256 public tokenCap = 0;

    // Amount of wei raised
    uint256 public tokensRaised = 0;

    /**
     * Checks whether the tokenCap has been reached. 
     * @return Whether the tokenCap was reached
     */
    function capReached() public view returns (bool) {
        return tokensRaised >= tokenCap;
    }

    /**
     * Accumulate the purchased tokens to the total raised
     */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
        tokensRaised = tokensRaised.add(_getTokenAmount(_weiAmount));
    }

}