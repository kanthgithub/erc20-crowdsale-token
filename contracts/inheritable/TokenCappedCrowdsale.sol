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

    // Amount of LPC raised
    uint256 public tokensRaised = 0;
    
    // event for manual refund of cap overflow
    event CapOverflow(address indexed sender, uint256 weiAmount, uint256 receivedTokens, uint256 date);

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
        super._updatePurchasingState(_beneficiary, _weiAmount);
        uint256 purchasedTokens = _getTokenAmount(_weiAmount);
        tokensRaised = tokensRaised.add(purchasedTokens);

        if(capReached()) {
            // manual process unused eth amount to sender
            emit CapOverflow(_beneficiary, _weiAmount, purchasedTokens, now);
        }
    }

}