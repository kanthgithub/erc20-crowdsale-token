pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title IncreasingPriceCrowdsale
 * @dev Extension of Crowdsale contract that decreases the number of LPC tokens purchases dependent on the current number of tokens sold.
 */
contract RatedCrowdsale is Ownable {
    using SafeMath for uint256;

    // Amount of LPC delivered
    uint256 private lpcRaised;

    /**
    SalesState enum for use in state machine to manage sales rates
    */
    enum SaleState { 
      Initial,             // All contract initialization calls
      PreSale,             // Private sale for seed and pre ICO (40% bonus LPC hard-capped at 180 million tokens)
      FinalisedPreSale,    // Close presale
      PublicSaleTier1,     // Tier 1 ICO public sale (30% bonus LPC capped at 90 million tokens)
      PublicSaleTier2,     // Tier 2 ICO public sale (20% bonus LPC capped at 70 million tokens)
      PublicSaleTier3,     // Tier 3 ICO public sale (10% bonus LPC capped at 50 million tokens)
      PublicSaleTier4,     // Tier 4 ICO public sale (standard rate capped at 30 million tokens)
      FinalisedPublicSale, // Close public sale
      Closed               // ICO has finished, all tokens must have been claimed
    }
    SaleState public state = SaleState.Initial;

    struct tierConfig {
        bytes32 tierRate;
        uint256 hardCap;
    }

    mapping(bytes32 => tierConfig) private SalesTierConfig;
    // mapping(bytes32 => uint256) private tierRate; // Map of bonus-rates for each SaleState tier

    /**
    * @dev Constructor
    * Caveat emptor: this base contract is intended for inheritance by the Little Phil crowdsale only
    */
    function RatedCrowdsale() public {

    // setup the map of bonus-rates for each SaleState tier
        createSalesTierConfigMap();
    }

    /**
    * @dev Overrides parent method taking into account variable rate (as a percentage).
    * @param _weiAmount The value in wei to be converted into tokens
    * @return The number of tokens _weiAmount wei will buy at present time.
    */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 currentTierRate = getCurrentTierRate();
        uint256 hardcap = uint256(180000);

        uint256 weiRefund = 0;
        uint256 lpcFromWei = _weiAmount.mul(rate).mul(getCurrentTierRate()).div(10 ** decimals.add(2));

        if (lpcFromWei.add(lpcRaised) > hardcap) {
            // jump to next tier
            // give a partial refund
            weiRefund = lpcFromWei.add(currentTotal).sub(hardcap).mul(10 ** decimals.add(2)).div(rate).div(tierRate);
        }
        
        // return number of LPC to provide


        return currentTierRate.mul(_weiAmount).div(100);
    }

    /**
    * @dev setup the map of bonus-rates (as a percentage) and total hardcap for each SaleState tier
    * to be called by the constructor.
    */
    function createSalesTierConfigMap() private {
        SalesTierConfig [keccak256(SaleState.Initial)] = tierConfig({tierRate:0, hardcap: 0});
        SalesTierConfig [keccak256(SaleState.PreSale)] = tierConfig({tierRate:140, hardcap: 180000000});
        SalesTierConfig [keccak256(SaleState.FinalisedPreSale)] = tierConfig({tierRate:0, hardcap: 180000000});
        SalesTierConfig [keccak256(SaleState.PublicSaleTier1)] = tierConfig({tierRate:130, hardcap: 270000000});
        SalesTierConfig [keccak256(SaleState.PublicSaleTier2)] = tierConfig({tierRate:120, hardcap: 340000000});
        SalesTierConfig [keccak256(SaleState.PublicSaleTier3)] = tierConfig({tierRate:110, hardcap: 390000000});
        SalesTierConfig [keccak256(SaleState.PublicSaleTier4)] = tierConfig({tierRate:100, hardcap: 420000000});
        SalesTierConfig [keccak256(SaleState.FinalisedPublicSale)] = tierConfig({tierRate:0, hardcap: 420000000});
        SalesTierConfig [keccak256(SaleState.Closed)] = tierConfig({tierRate:0, hardcap: 420000000});
    }

    /**
    * @dev get the current bonus-rate for the current SaleState
    * @return the current rate as a percentage (e.g. 140 = 140% bonus)
    */
    function getCurrentTierRate() public view returns (uint256) {
        return SalesTierConfig[keccak256(state)].tierRate;
    }

    /**
    * @dev get the current hardcap for the current SaleState
    * @return the current hardcap
    */
    function getCurrentTierHardcap() public view returns (uint256) {
        return SalesTierConfig[keccak256(state)].hardcap;
    }

    /**
    * @dev only allow the owner to modify the current SaleState
    */
    function setState(SaleState _state) onlyOwner public {
        state = _state;
    }


}
