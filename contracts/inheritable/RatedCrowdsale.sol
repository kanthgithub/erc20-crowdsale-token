pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title IncreasingPriceCrowdsale
 * @dev Extension of Crowdsale contract that decreases the number of LPC tokens purchases dependent on the current number of tokens sold.
 */
contract RatedCrowdsale is Ownable {
    using SafeMath for uint256;

    uint256 public initialRate;
    uint256 public finalRate;

    /**
    SalesState enum for use in state machine to manage sales rates
    */
    enum SaleState { 
      Initial,             // All contract initialization calls
      PreSale,             // Private sale for seed and pre ICO (40% bonus LPC capped at 180 million tokens)
      FinalisedPreSale,    // Close presale
      PublicSaleTier1,     // Tier 1 ICO public sale (30% bonus LPC capped at 90 million tokens)
      PublicSaleTier2,     // Tier 1 ICO public sale (20% bonus LPC capped at 70 million tokens)
      PublicSaleTier3,     // Tier 1 ICO public sale (10% bonus LPC capped at 50 million tokens)
      PublicSaleTier4,     // Tier 1 ICO public sale (standard rate capped at 30 million tokens)
      FinalisedPublicSale, // Close public sale
      Closed               // ICO has finished, all tokens must have been claimed
    }
    SaleState public state = SaleState.Initial;
    mapping(bytes32 => uint256) private tierRate; // Map of bonus-rates for each SaleState tier

    /**
    * @dev Constructor
    * Caveat emptor: this base contract is intended for inheritance by the Little Phil crowdsale only
    */
    function RatedCrowdsale() public {

    // setup the map of bonus-rates for each SaleState tier
        createTierRateMap();
    }

    /**
    * @dev Overrides parent method taking into account variable rate (as a percentage).
    * @param _weiAmount The value in wei to be converted into tokens
    * @return The number of tokens _weiAmount wei will buy at present time.
    */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 currentRate = getCurrentTierRate();
        return currentRate.mul(_weiAmount).div(100);
    }

    /**
    * @dev setup the map of bonus-rates (as a percentage) for each SaleState tier
    * to be called by the constructor.
    */
    function createTierRateMap () private {
        tierRate [keccak256(SaleState.Initial)] = 140;
        tierRate [keccak256(SaleState.PreSale)] = 140;
        tierRate [keccak256(SaleState.FinalisedPreSale)] = 0;
        tierRate [keccak256(SaleState.PublicSaleTier1)] = 130;
        tierRate [keccak256(SaleState.PublicSaleTier2)] = 120;
        tierRate [keccak256(SaleState.PublicSaleTier3)] = 110;
        tierRate [keccak256(SaleState.PublicSaleTier4)] = 100;
        tierRate [keccak256(SaleState.FinalisedPublicSale)] = 140;
        tierRate [keccak256(SaleState.Closed)] = 0;
    }

    /**
    * @dev get the current bonus-rate for the current SaleState
    * @return the current rate as a percentage (e.g. 140 = 140% bonus)
    */
    function getCurrentTierRate() public view returns (uint256 rate) {
        return tierRate[keccak256(state)];
    }

    /**
    * @dev only allow the owner to modify the current SaleState
    */
    function setState(SaleState _state) onlyOwner public {
        state = _state;
    }


}
