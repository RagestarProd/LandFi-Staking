// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract LandFiStakingWithRewards is Ownable(msg.sender), ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable landFiToken;   // Token users stake
    IERC20 public immutable rewardToken;   // Token users receive as reward

    uint8 public immutable landFiDecimals;
    uint8 public immutable rewardDecimals;

    mapping(address => uint256) public stakes;
    mapping(address => uint256) public depositTimestamps;

    uint256 public stakeDuration;  // Lockup period in seconds
    uint256 public maxStake;
    uint256 public minStake;
    bool public fullUnlock;

    /// @notice Emitted when a user stakes tokens
    event Staked(address indexed user, uint256 amount, uint256 timestamp);

    /// @notice Emitted when a user withdraws staked tokens and rewards
    event Withdrawn(address indexed user, uint256 amount, uint256 reward, uint256 timestamp);

    constructor(
        address _landFiToken,
        address _rewardToken,
        uint256 _stakeDuration,
        uint256 _maxStake,
        uint256 _minStake
    ) {
        require(_landFiToken != address(0), "LandFi token zero address");
        require(_rewardToken != address(0), "Reward token zero address");
        require(_stakeDuration > 0, "Stake duration must be > 0");
        require(_maxStake > 0, "Max stake must be > 0");
        require(_minStake > 0 && _minStake <= _maxStake, "Invalid min stake");

        landFiToken = IERC20(_landFiToken);
        rewardToken = IERC20(_rewardToken);

        landFiDecimals = _getDecimals(_landFiToken);
        rewardDecimals = _getDecimals(_rewardToken);

        stakeDuration = _stakeDuration;
        maxStake = _maxStake;
        minStake = _minStake;
        fullUnlock = false;
    }

    // Internal helper to get decimals from token contract
    function _getDecimals(address token) internal view returns (uint8) {
        (bool success, bytes memory data) = token.staticcall(
            abi.encodeWithSignature("decimals()")
        );
        require(success && data.length == 32, "Failed to get decimals");
        return abi.decode(data, (uint8));
    }

    // Admin functions
    function changeStakeDuration(uint256 _newDuration) external onlyOwner {
        require(_newDuration > 0, "Stake duration must be > 0");
        stakeDuration = _newDuration;
    }

    function changeMaxStake(uint256 _maxStake) external onlyOwner {
        require(_maxStake > 0, "Max stake must be > 0");
        maxStake = _maxStake;
    }

    function changeMinStake(uint256 _minStake) external onlyOwner {
        require(_minStake > 0 && _minStake <= maxStake, "Invalid min stake");
        minStake = _minStake;
    }

    function changeFullUnlock(bool _fullUnlock) external onlyOwner {
        fullUnlock = _fullUnlock;
    }

    // Stake LandFi tokens
    function stake(uint256 amount) external nonReentrant {
        address user = msg.sender;
        require(stakes[user] == 0, "Already staking");
        require(amount >= minStake, "Amount below minStake");
        require(amount <= maxStake, "Amount exceeds maxStake");
        require(!fullUnlock, "Staking locked");

        stakes[user] = amount;
        depositTimestamps[user] = block.timestamp;

        landFiToken.safeTransferFrom(user, address(this), amount);

        emit Staked(user, amount, block.timestamp);
    }

    // Calculate reward based on stake amount with decimals normalization
    // Example: 5% reward based on USD value approximation
    function calculateReward(address user) public view returns (uint256) {
        uint256 amount = stakes[user];
        if (amount == 0) return 0;

        // Normalize staked amount to 18 decimals
        uint256 normalizedStake = _normalizeDecimals(amount, landFiDecimals, 18);

        // Calculate 5% reward of normalized stake (adjust this logic as needed)
        uint256 rewardNormalized = (normalizedStake * 5) / 100;

        // Convert reward back to reward token decimals
        uint256 rewardAmount = _normalizeDecimals(rewardNormalized, 18, rewardDecimals);
        return rewardAmount;
    }

    // Withdraw staked tokens + rewards
    function withdraw() external nonReentrant {
        address user = msg.sender;
        uint256 amount = stakes[user];
        require(amount > 0, "No stake found");
        require(fullUnlock || block.timestamp >= depositTimestamps[user] + stakeDuration, "Stake locked");

        uint256 rewardAmount = calculateReward(user);

        stakes[user] = 0;
        depositTimestamps[user] = 0;

        landFiToken.safeTransfer(user, amount);

        if (rewardAmount > 0) {
            require(rewardToken.balanceOf(address(this)) >= rewardAmount, "Insufficient reward balance");
            rewardToken.safeTransfer(user, rewardAmount);
        }

        emit Withdrawn(user, amount, rewardAmount, block.timestamp);
    }

    // View functions
    function balanceOf(address user) external view returns (uint256) {
        return stakes[user];
    }

    function stakeUnlockTime(address user) external view returns (uint256) {
        return depositTimestamps[user] + stakeDuration;
    }

    // Internal helper: normalize decimals between tokens
    // fromDecimals -> toDecimals conversion
    function _normalizeDecimals(
        uint256 amount,
        uint8 fromDecimals,
        uint8 toDecimals
    ) internal pure returns (uint256) {
        if (fromDecimals == toDecimals) {
            return amount;
        } else if (fromDecimals > toDecimals) {
            return amount / (10**(fromDecimals - toDecimals));
        } else {
            return amount * (10**(toDecimals - fromDecimals));
        }
    }
}
