//SPDX-License-Identifier: UNLICENSED

/*

	 _                    _ _____ _ 
	| |    __ _ _ __   __| |  ___(_)
	| |   / _` | '_ \ / _` | |_  | |
	| |__| (_| | | | | (_| |  _| | |
	|_____\__,_|_| |_|\__,_|_|   |_|
						                                                 
    Staking Contract v0.1

    This BEP-20 token staking contract is wirtten verbosely and in an
    easy to read manner for the purposes of clarity and understanding
    by the general public. We are happy to answer any questions or 
    concerns you may have on our social channels.

    Blockchain for the people!

    Website: LandFi.io
*/

pragma solidity ^0.8.4;
import "./access/Ownable.sol";
import "./utils/math/SafeMath.sol";
import "./utils/Address.sol";
import "./token/ERC20/utils/SafeERC20.sol";

contract LandFiToken {
    function transferFrom(address from, address to, uint256 value) public returns (bool) {}
}

contract LandFiStaking is Ownable {
    using Address for address;
    using SafeMath for uint256;
    address private constant burnAddress = 0x000000000000000000000000000000000000dEaD;

    // Max tokens allowed to be staked in 1 product by 1 wallet
    uint256 public maxStake;

    // The wallet for staked tokens
    address public stakeWallet;

    // The wallet for rewards tokens
    address public rewardWallet;

    // The address of LandFi token
    address public tokenAddress;
    
    // Min tokens allowed to be staked in 1 product by 1 wallet
    uint256 public minStake;
    
    // The current reward payouts due
    uint256 public rewardCountDue;
    
    // The reward payouts that have been sent
    uint256 public rewardCount;

    // The total amount of staked tokens
    uint256 public totalStaked;

    // The max allowed reward tokens to be given out (if higher than this new staking is disabled)
    uint256 public maxRewardDue;

    // Unlock all stakes and allow withdraw (no rewards)
    bool public fullUnlock;

    constructor() {
        rewardCountDue = 0;
        rewardCount = 0;
        totalStaked = 0;
        maxStake =     400000000000000000000; // 400B
        maxRewardDue = 500000000000000000000; // 500B
        minStake =     10000000000000000; // 10M
        stakeWallet = //TODO;
        rewardWallet = //TODO;
        tokenAddress = //TODO;
        fullUnlock = false;


		//TODO
		//TODO
		//TODO
    }

   
    function changeMaxRewardDue(uint256 newMaxRewardDue) public virtual onlyOwner {
        maxRewardDue = newMaxRewardDue;
    }
    function changeMaxStake(uint256 newMaxStake) public virtual onlyOwner {
        maxStake = newMaxStake;
    }
    function changeMinStake(uint256 newMinStake) public virtual onlyOwner {
        minStake = newMinStake;
    }

    function changeFullUnlock(bool newFullUnlock) public virtual onlyOwner {
        fullUnlock = newFullUnlock;
    }
    
    function balanceOf(address walletAddress) public view returns (uint256) {
        uint256 balance = box1Balance[walletAddress] + box2Balance[walletAddress] + box3Balance[walletAddress] + box4Balance[walletAddress];

        return balance;
    }

    function stakeUnlockTime(address walletAddress, uint256 boxNo) public view returns (uint256) {
        //TODO
    }

    function stakeAmount(address walletAddress, uint256 boxNo) public view returns (uint256) {
        //TODO
    }

    // Add stake
    function addStake(uint256 tokenAmount, uint256 boxNo) public {
        address from = msg.sender;        
        uint256 rewardAmount = 0;

        require(maxRewardDue >= rewardCount, "Staking on this contract has ended!");
        require(tokenAmount >= minStake, "Staked amount must be higher.");
        require(tokenAmount <= maxStake, "Staked amount must be lower.");
        require(fullUnlock == false, "Staking is currently in unlocked mode.");

        //TODO
		//TODO
		//TODO

        LandFiToken LandFiTokenI = LandFiToken(tokenAddress); // Connect to LandFi Token contract
        LandFiTokenI.transferFrom(from, stakeWallet, tokenAmount); // Send staked tokens from staker to stake wallet

        return;
    }

    // Remove stake
    function pullStake(uint256 boxNo) public {
        address from = msg.sender;        
        uint256 rewardAmount = 0;     
        uint256 tokenAmount = 0;

       //TODO
	   //TODO
	   //TODO
	   //TODO

        if (!fullUnlock) {
            rewardCount = rewardCount.add(rewardAmount);
            rewardCountDue = rewardCountDue.sub(rewardAmount);
        }
        
        totalStaked = totalStaked.sub(tokenAmount);

        LandFiToken LandFiTokenI = LandFiToken(tokenAddress); // Connect to LandFi Token contract
        LandFiTokenI.transferFrom(stakeWallet, from, tokenAmount); // Send staked tokens to staker from stake wallet

        if (!fullUnlock) {

			// Send REWARD tokens to staker from reward wallet
			LandFiTokenI.transferFrom(rewardWallet, from, rewardAmount); 
            
        }

        return;
    }

}