pragma solidity ^0.4.21;

import "./TokenCappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title TieredCrowdsale
 * @dev Extension of Crowdsale contract that decreases the number of LPC tokens purchases dependent on the current number of tokens sold.
 */
contract TieredCrowdsale is TokenCappedCrowdsale, Ownable {

    using SafeMath for uint256;

    /**
    SalesState enum for use in state machine to manage sales rates
    */
    enum SaleState { 
        Initial,              // All contract initialization calls
        PrivateSale,          // Private sale for industy and closed group investors
        FinalisedPrivateSale, // Close private sale
        PreSale,              // Pre sale ICO (40% bonus LPC hard-capped at 180 million tokens)
        FinalisedPreSale,     // Close presale
        PublicSaleTier1,      // Tier 1 ICO public sale (30% bonus LPC capped at 85 million tokens)
        PublicSaleTier2,      // Tier 2 ICO public sale (20% bonus LPC capped at 65 million tokens)
        PublicSaleTier3,      // Tier 3 ICO public sale (10% bonus LPC capped at 45 million tokens)
        PublicSaleTier4,      // Tier 4 ICO public sale (standard rate capped at 25 million tokens)
        FinalisedPublicSale,  // Close public sale
        Closed                // ICO has finished, all tokens must have been claimed
    }
    SaleState public state = SaleState.Initial;

    struct TierConfig {
        string stateName;
        uint256 tierRatePercentage;
        uint256 hardCap;
    }

    mapping(bytes32 => TierConfig) private tierConfigs;

    /**
    * checks the state when validating a purchase
    */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(
            state == SaleState.PrivateSale ||
            state == SaleState.PreSale ||
            state == SaleState.PublicSaleTier1 || 
            state == SaleState.PublicSaleTier2 || 
            state == SaleState.PublicSaleTier3 || 
            state == SaleState.PublicSaleTier4
        );
    }

    /**
    * @dev Constructor
    * Caveat emptor: this base contract is intended for inheritance by the Little Phil crowdsale only
    */
    constructor() public {
        // setup the map of bonus-rates for each SaleState tier
        createSalesTierConfigMap();
    }

    /**
    * @dev Overrides parent method taking into account variable rate (as a percentage).
    * @param _weiAmount The value in wei to be converted into tokens
    * @return The number of tokens _weiAmount wei will buy at present time.
    */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 currentTierRate = getCurrentTierRatePercentage();
        
        uint256 requestedTokenAmount = _weiAmount.mul(rate).mul(currentTierRate).div(100);

        uint256 remainingTokens = tokenCap.sub(tokensRaised);

        // return number of LPC to provide
        if(requestedTokenAmount > remainingTokens ) {
            return remainingTokens;
        }
    
        return requestedTokenAmount;
    }

    /**
    * @dev setup the map of bonus-rates (as a percentage) and total hardCap for each SaleState tier
    * to be called by the constructor.
    */
    function createSalesTierConfigMap() private {

        tierConfigs [keccak256(SaleState.Initial)] = TierConfig({
            stateName: "Initial",
            tierRatePercentage:0,
            hardCap: 0 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.PrivateSale)] = TierConfig({
            stateName: "PrivateSale",
            tierRatePercentage:100,
            hardCap: 400000000 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.FinalisedPrivateSale)] = TierConfig({
            stateName: "FinalisedPrivateSale",
            tierRatePercentage:0,
            hardCap: 0 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.PreSale)] = TierConfig({
            stateName: "PreSale",
            tierRatePercentage:140,
            hardCap: 180000000 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.FinalisedPreSale)] = TierConfig({
            stateName: "FinalisedPreSale",
            tierRatePercentage:0,
            hardCap: 0 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.PublicSaleTier1)] = TierConfig({
            stateName: "PublicSaleTier1",
            tierRatePercentage:130,
            hardCap: 265000000 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.PublicSaleTier2)] = TierConfig({
            stateName: "PublicSaleTier2",
            tierRatePercentage:120,
            hardCap: 330000000 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.PublicSaleTier3)] = TierConfig({
            stateName: "PublicSaleTier3",
            tierRatePercentage:110,
            hardCap: 375000000 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.PublicSaleTier4)] = TierConfig({
            stateName: "PublicSaleTier4",
            tierRatePercentage:100,
            hardCap: 400000000 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.FinalisedPublicSale)] = TierConfig({
            stateName: "FinalisedPublicSale",
            tierRatePercentage:0,
            hardCap: 0 * (10 ** 18)
        });
        tierConfigs [keccak256(SaleState.Closed)] = TierConfig({
            stateName: "Closed",
            tierRatePercentage:0,
            hardCap: 400000000 * (10 ** 18)
        });
        
    }

    /**
    * @dev get the current bonus-rate for the current SaleState
    * @return the current rate as a percentage (e.g. 140 = 140% bonus)
    */
    function getCurrentTierRatePercentage() public view returns (uint256) {
        return tierConfigs[keccak256(state)].tierRatePercentage;
    }

    /**
    * @dev get the current hardCap for the current SaleState
    * @return the current hardCap
    */
    function getCurrentTierHardcap() public view returns (uint256) {
        return tierConfigs[keccak256(state)].hardCap;
    }

    /**
    * @dev only allow the owner to modify the current SaleState
    */
    function setState(uint256 _state) onlyOwner public {
        state = SaleState(_state);

        // update cap when state changes
        tokenCap = getCurrentTierHardcap();

        if(state == SaleState.Closed) {
            crowdsaleClosed();
        }
    }

    function getState() public view returns (string) {
        return tierConfigs[keccak256(state)].stateName;
    }

    /**
    * @dev only allow onwer to modify the current SaleState
    */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
        super._updatePurchasingState(_beneficiary, _weiAmount);

        if(capReached()) {
            if(state == SaleState.PrivateSale) {
                state = SaleState.FinalisedPrivateSale;
                tokenCap = getCurrentTierHardcap();
            }
            else if(state == SaleState.PreSale) {
                state = SaleState.FinalisedPreSale;
                tokenCap = getCurrentTierHardcap();
            }
            else if(state == SaleState.PublicSaleTier1) {
                state = SaleState.PublicSaleTier2;
                tokenCap = getCurrentTierHardcap();
            }
            else if(state == SaleState.PublicSaleTier2) {
                state = SaleState.PublicSaleTier3;
                tokenCap = getCurrentTierHardcap();
            }
            else if(state == SaleState.PublicSaleTier3) {
                state = SaleState.PublicSaleTier4;
                tokenCap = getCurrentTierHardcap();
            }
            else if(state == SaleState.PublicSaleTier4) {
                state = SaleState.FinalisedPublicSale;
                tokenCap = getCurrentTierHardcap();
            }

        }

    }

    /**
     * Override for extensions that require an internal notification when the crowdsale has closed
     */
    function crowdsaleClosed () internal {
        // optional override
    }

}
