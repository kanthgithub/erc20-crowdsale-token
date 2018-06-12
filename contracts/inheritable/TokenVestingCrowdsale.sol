pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenVesting.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenVestingCrowdsale is Crowdsale {

    uint256 public constant VESTING_DURATION = 182 days;

    function addBeneficiaryVestor(
            beneficiaryWallet, 
            tokenAmount, 
            vestingEpocStart, 
            cliffInSeconds, 
            vestingEpocEnd
        ) external ownerOnly {
        TokenVesting newVault = new TokenVesting(
            beneficiaryWallet, 
            vestingEpocStart, 
            cliffInSeconds, 
            vestingEpocEnd, 
            false
        );
        token.mint(address(newVault), TOKEN_AMOUNT);
    }

    function releaseVestingTokens(vaultAddress) external ownerOnly {
        TokenVesting(vaultAddress).release(token);
    }

}