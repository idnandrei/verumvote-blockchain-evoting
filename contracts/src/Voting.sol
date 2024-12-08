// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "./VotingToken.sol";


contract VotingSystem is Ownable, Pausable, ReentrancyGuard {

    // Structs
    struct Vote {
        address voter;
        string ipfsCid;
        string verificationHash;
        uint256 timestamp;
    }

    // State variables
    uint256 public startTime;
    uint256 public endTime;
    bool public isInitialized;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => Vote) public votes;
    uint256 public totalVotes;
    IERC20 public votingToken;
    uint256 public requiredTokens;
    
    // Events
    event VoteCast(
        address indexed voter,
        string ipfsCid,
        string verificationHash
    );

    event VotingPeriodForceEnded(
        uint256 originalEndTime,
        uint256 forcedEndTime
    );

    event VoteVerified(
        uint256 voteIndex,
        bool verified
    );

    // Modifiers
    modifier onlyDuringVotingPeriod() {
    require(isInitialized, "Voting period is not initialized");
    require(
        block.timestamp >= startTime && block.timestamp <= endTime,
        "Not within the voting period"
    );
    _;
}


    modifier hasNotVotedYet() {
        require(!hasVoted[msg.sender], "Already voted");
        _;
    }

    // Constructor
    // Modified constructor
    constructor() Ownable(msg.sender) {
        isInitialized = false;
    }

    /// @notice Initializes the voting period
    /// @param _startTime Start timestamp of the voting period
    /// @param duration Duration of the voting period in seconds
    /// @param _votingToken Address of the token required for voting
    /// @param _requiredTokens Amount of tokens required to vote
    function initializeVotingPeriod(
        uint256 _startTime,
        uint256 duration,
        address _votingToken,
        uint256 _requiredTokens
     ) external payable onlyOwner {
        require(!isInitialized, "Voting period not available");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(duration > 0, "Duration must be positive");
        require(_votingToken != address(0), "Invalid token address");
        require(_requiredTokens > 0, "Required tokens must be positive");

        startTime = _startTime;
        endTime = _startTime + duration;
        votingToken = IERC20(_votingToken);
        requiredTokens = _requiredTokens;
        isInitialized = true;
    }

        function getCurrentTimeBlock() public view returns (uint256){
            return block.timestamp;
        }   


    function castVote(
    string calldata ipfsCid,
    string calldata verificationHash
) 
    external
    nonReentrant
    whenNotPaused
    onlyDuringVotingPeriod
    hasNotVotedYet
{
    // Check token balance
    require(
        votingToken.balanceOf(msg.sender) >= requiredTokens,
        "Insufficient voting tokens"
    );

    // Burn tokens
    VotingToken(address(votingToken)).burnFrom(msg.sender, requiredTokens);

    // Record vote
    uint256 voteIndex = totalVotes;
    votes[voteIndex] = Vote({
        voter: msg.sender,
        ipfsCid: ipfsCid,
        verificationHash: verificationHash,
        timestamp: block.timestamp
    });

    hasVoted[msg.sender] = true;
    totalVotes++;

    emit VoteCast(msg.sender, ipfsCid, verificationHash);
}




    function closeVotingPeriod() external onlyOwner {
        require(isInitialized, "Voting period doesn't exist");
        require(block.timestamp > endTime, "Voting period not ended");
        isInitialized = false;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function forceEndVotingPeriod() external onlyOwner {
        require(isInitialized, "Voting period doesn't exist");
        uint256 originalEnd = endTime;
        endTime = block.timestamp;
        isInitialized = false;
        emit VotingPeriodForceEnded(originalEnd, endTime);
    }

    // function verifyVote(
    //     uint256 voteIndex,
    //     string calldata hash
    // ) external {
    //     require(voteIndex < totalVotes, "Invalid vote index");
        
    //     Vote storage vote = votes[voteIndex];
    //     bool isVerified = keccak256(abi.encodePacked(hash)) == 
    //                      keccak256(abi.encodePacked(vote.verificationHash));
        
    //     vote.isVerified = isVerified;
    //     emit VoteVerified(voteIndex, isVerified);
    // }

}