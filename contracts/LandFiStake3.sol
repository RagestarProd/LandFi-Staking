// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LandFiStaking is Ownable(msg.sender), ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Status { Pending, Running, Paused, Complete }

    // Immutable config
    IERC20 public immutable landFiToken;
    IERC20 public immutable rewardToken;
    address public immutable teamWallet;
    uint256 public immutable buyDuration;
    uint256 public immutable stakeDuration;
    uint256 public immutable minStake;
    uint256 public immutable maxStake;
    uint256 public immutable maxTotalStake;
    uint256 public immutable rewardTotal;

    // State
    bool public launchStaking = false;
    uint256 public launchTime;
    Status public stakingStatus = Status.Pending;
    uint256 public totalStaked;

    mapping(address => uint256) public userStakes;
    address[] public stakedList;

    // --- Events ---
    event Stake(address indexed user, uint256 amount);
    event Launch(uint256 launchTime);
    event Complete(uint256 completeTime);
    event RewardDistributed(address indexed user, uint256 stake, uint256 reward);
    event Terminated(address indexed user, uint256 amount);
    event TerminatedSingle(address indexed user, uint256 amount);

    modifier onlyRunning() {
        require(stakingStatus == Status.Running, "Staking not active");
        _;
    }

    constructor(
        address _landFiToken,
        address _rewardToken,
        address _teamWallet,
        uint256 _buyDuration,
        uint256 _stakeDuration,
        uint256 _minStake,
        uint256 _maxStake,
        uint256 _maxTotalStake,
        uint256 _rewardTotal
    ) {
        require(_landFiToken != address(0), "Invalid stake token");
        require(_rewardToken != address(0), "Invalid reward token");
        require(_teamWallet != address(0), "Invalid team wallet");

        landFiToken = IERC20(_landFiToken);
        rewardToken = IERC20(_rewardToken);
        teamWallet = _teamWallet;

        buyDuration = _buyDuration;
        stakeDuration = _stakeDuration;
        minStake = _minStake;
        maxStake = _maxStake;
        maxTotalStake = _maxTotalStake;
        rewardTotal = _rewardTotal;
    }

    // --- Lifecycle ---
    function launch() external onlyOwner {
        require(!launchStaking, "Already launched");
        launchStaking = true;
        launchTime = block.timestamp;
        stakingStatus = Status.Running;
        emit Launch(launchTime);
    }

    function pause() external onlyOwner {
        stakingStatus = Status.Paused;
    }

    function unpause() external onlyOwner {
        stakingStatus = Status.Running;
    }

    function completeStaking() external onlyOwner {
        require(block.timestamp > launchTime + buyDuration + stakeDuration, "Stake not ended");
        stakingStatus = Status.Complete;
        emit Complete(block.timestamp);
    }

    // --- Stake ---
    function stake(uint256 amount) external nonReentrant onlyRunning {
        require(launchStaking, "Staking not live");
        require(block.timestamp <= launchTime + buyDuration, "Buy period over");
        require(amount >= minStake, "Below min stake");
        require(userStakes[msg.sender] + amount <= maxStake, "Exceeds max stake");
        require(totalStaked + amount <= maxTotalStake, "Exceeds total pool");

        if (userStakes[msg.sender] == 0) {
            stakedList.push(msg.sender);
        }

        landFiToken.safeTransferFrom(msg.sender, address(this), amount);
        userStakes[msg.sender] += amount;
        totalStaked += amount;

        emit Stake(msg.sender, amount);
    }

    // --- Reward Distribution ---
    function distributeRewards() external onlyOwner nonReentrant {
        require(stakingStatus == Status.Complete, "Staking not complete");

        for (uint256 i = 0; i < stakedList.length; i++) {
            address user = stakedList[i];
            uint256 userStake = userStakes[user];
            if (userStake == 0) continue;

            uint256 reward = (userStake * rewardTotal) / totalStaked;

            landFiToken.safeTransfer(user, userStake);
            rewardToken.safeTransfer(user, reward);
            userStakes[user] = 0;

            emit RewardDistributed(user, userStake, reward);
        }

        // Send any leftover reward tokens to teamWallet
        uint256 leftover = rewardToken.balanceOf(address(this));
        if (leftover > 0) {
            rewardToken.safeTransfer(teamWallet, leftover);
        }
    }

    // --- Termination ---
    function terminateAll() external onlyOwner nonReentrant {
        for (uint256 i = 0; i < stakedList.length; i++) {
            address user = stakedList[i];
            uint256 amt = userStakes[user];
            if (amt > 0) {
                landFiToken.safeTransfer(user, amt);
                userStakes[user] = 0;
                emit Terminated(user, amt);
            }
        }
        stakingStatus = Status.Complete;
    }

    function terminateSingle(address user) external onlyOwner nonReentrant {
        uint256 amt = userStakes[user];
        require(amt > 0, "Nothing to terminate");
        landFiToken.safeTransfer(user, amt);
        userStakes[user] = 0;
        emit TerminatedSingle(user, amt);
    }

    // --- Getters ---
    function getStakedUsers() external view returns (address[] memory) {
        return stakedList;
    }

    function getStakingStatus() external view returns (Status) {
        return stakingStatus;
    }

    function previewReward(uint256 amount) external view returns (uint256 reward) {
        if (totalStaked == 0 || amount == 0) return 0;
        reward = (amount * rewardTotal) / totalStaked;
    }
}
