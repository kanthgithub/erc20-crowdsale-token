pragma solidity ^0.4.21;

import "../LittlePhilCoin.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract InitialSupplyCrowdsale is Crowdsale, Ownable {

    using SafeMath for uint256;

    uint256 public constant decimals = 18;

    // Wallet properties
    address public companyWallet;
    address public teamWallet;
    address public projectWallet;
    address public advisorWallet;
    address public bountyWallet;
    address public airdropWallet;

    // Team locked tokens
    TokenTimelock public teamTimeLock1;
    TokenTimelock public teamTimeLock2;

    // Reserved tokens
    uint256 public constant companyTokens    = 150000000 * (10 ** decimals);
    uint256 public constant teamTokens       = 150000000 * (10 ** decimals);
    uint256 public constant projectTokens    = 150000000 * (10 ** decimals);
    uint256 public constant advisorTokens    = 100000000 * (10 ** decimals);
    uint256 public constant bountyTokens     =  30000000 * (10 ** decimals);
    uint256 public constant airdropTokens    =  20000000 * (10 ** decimals);

    bool private isInitialised = false;

    constructor(
        address[6] _wallets
    ) public {
        address _companyWallet  = _wallets[0];
        address _teamWallet     = _wallets[1];
        address _projectWallet  = _wallets[2];
        address _advisorWallet  = _wallets[3];
        address _bountyWallet   = _wallets[4];
        address _airdropWallet  = _wallets[5];

        require(_companyWallet != address(0));
        require(_teamWallet != address(0));
        require(_projectWallet != address(0));
        require(_advisorWallet != address(0));
        require(_bountyWallet != address(0));
        require(_airdropWallet != address(0));

        // Set reserved wallets
        companyWallet = _companyWallet;
        teamWallet = _teamWallet;
        projectWallet = _projectWallet;
        advisorWallet = _advisorWallet;
        bountyWallet = _bountyWallet;
        airdropWallet = _airdropWallet;

        // Lock team tokens in wallet over time periods
        teamTimeLock1 = new TokenTimelock(token, teamWallet, uint64(now + 182 days));
        teamTimeLock2 = new TokenTimelock(token, teamWallet, uint64(now + 365 days));
    }

    /**
     * Function
     */
    function setupInitialSupply() internal onlyOwner {
        require(isInitialised == false);
        uint256 teamTokensSplit = teamTokens.mul(50).div(100);

        // Distribute tokens to reserved wallets
        _deliverTokens(companyWallet, companyTokens);
        _deliverTokens(projectWallet, projectTokens);
        _deliverTokens(advisorWallet, advisorTokens);
        _deliverTokens(bountyWallet, bountyTokens);
        _deliverTokens(airdropWallet, airdropTokens);
        _deliverTokens(address(teamTimeLock1), teamTokensSplit);
        _deliverTokens(address(teamTimeLock2), teamTokensSplit);

        isInitialised = true;
    }

}