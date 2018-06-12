pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenVesting.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenVestingCrowdsale is Crowdsale, Ownerable {

    function addBeneficiaryVestor(
            address beneficiaryWallet, 
            uint256 tokenAmount, 
            uint256 vestingEpocStart, 
            uint256 cliffInSeconds, 
            uint256 vestingEpocEnd
        ) external ownerOnly {
        TokenVesting newVault = new TokenVesting(
            beneficiaryWallet, 
            vestingEpocStart, 
            cliffInSeconds, 
            vestingEpocEnd, 
            false
        );
        token.mint(address(newVault), tokenAmount);
    }

    function releaseVestingTokens(vaultAddress) external onlyOwner {
        TokenVesting(vaultAddress).release(token);
    }

}