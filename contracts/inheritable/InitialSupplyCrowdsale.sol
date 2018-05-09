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
    address public supplierWallet;
    address public teamWallet;
    address public projectWallet;
    address public advisorWallet;
    address public bountyWallet;
    address public airdropWallet;

    // Team locked tokens
    TokenTimelock public teamTimeLock1;
    TokenTimelock public teamTimeLock2;

    // Reserved tokens
    uint256 public constant supplierTokens   = 400000000 * (10 ** decimals);
    uint256 public constant littlePhilTokens = 150000000 * (10 ** decimals);
    uint256 public constant teamTokens       = 150000000 * (10 ** decimals);
    uint256 public constant projectTokens    = 150000000 * (10 ** decimals);
    uint256 public constant advisorTokens    = 100000000 * (10 ** decimals);
    uint256 public constant bountyTokens     =  30000000 * (10 ** decimals);
    uint256 public constant airdropTokens    =  20000000 * (10 ** decimals);

    event Test(address purchaser, uint256 value);

    constructor(
        address[6] _supplyWallets
    ) public {
        address _supplierWallet = _supplyWallets[0];
        address _teamWallet     = _supplyWallets[1];
        address _projectWallet  = _supplyWallets[2];
        address _advisorWallet  = _supplyWallets[3];
        address _bountyWallet   = _supplyWallets[4];
        address _airdropWallet  = _supplyWallets[5];

        require(_supplierWallet != address(0));
        require(_teamWallet != address(0));
        require(_projectWallet != address(0));
        require(_advisorWallet != address(0));
        require(_bountyWallet != address(0));
        require(_airdropWallet != address(0));

        // Set reserved wallets
        supplierWallet = _supplierWallet;
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
    function setupInitialSupply() public {
        uint256 teamTokensSplit = teamTokens.mul(50).div(100);

        // Distribute tokens to reserved wallets
        _deliverTokens(supplierWallet, supplierTokens);
        _deliverTokens(projectWallet, projectTokens);
        _deliverTokens(advisorWallet, advisorTokens);
        _deliverTokens(bountyWallet, bountyTokens);
        _deliverTokens(airdropWallet, airdropTokens);
        _deliverTokens(address(teamTimeLock1), teamTokensSplit);
        _deliverTokens(address(teamTimeLock2), teamTokensSplit);
    }

}