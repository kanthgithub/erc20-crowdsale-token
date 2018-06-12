pragma solidity ^0.4.21;

import "../LittlePhilCoin.sol";
import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenVesting.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenVestingCrowdsale is Crowdsale, Ownable {

    function addBeneficiaryVestor(
            address beneficiaryWallet, 
            uint256 tokenAmount, 
            uint256 vestingEpocStart, 
            uint256 cliffInSeconds, 
            uint256 vestingEpocEnd
        ) external onlyOwner {
        TokenVesting newVault = new TokenVesting(
            beneficiaryWallet, 
            vestingEpocStart, 
            cliffInSeconds, 
            vestingEpocEnd, 
            false
        );
        LittlePhilCoin(token).mint(address(newVault), tokenAmount);
    }

    function releaseVestingTokens(address vaultAddress) external onlyOwner {
        TokenVesting(vaultAddress).release(token);
    }

}