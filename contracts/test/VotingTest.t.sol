// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// import {Test, console2} from "lib/forge-std/src/Test.sol";
// import {VoteRecordSystem} from "../src/Voting.sol";
// import {VotingToken} from "../src/VotingToken.sol";

// contract VotingInitializationTest is Test {
//     VoteRecordSystem public voting;
//     VotingToken public token;
//     address public owner;

//     event VotingPeriodInitialized(
//         uint256 startTime,
//         uint256 endTime,
//         address votingToken,
//         uint256 requiredTokens
//     );

//     function setUp() public {
//         owner = address(this);
//         token = new VotingToken();
//         voting = new VoteRecordSystem();
//         token.mint(); // Mint initial tokens
//     }

//     function test_SuccessfulInitialization() public {
//         uint256 startTime = block.timestamp + 60;
//         uint256 duration = 1 hours;
        
//         console2.log("Current timestamp:", block.timestamp);
//         console2.log("Start time:", startTime);
//         console2.log("Token address:", address(token));
        
//         vm.expectEmit(true, true, true, true);
//         emit VotingPeriodInitialized(
//             startTime,
//             startTime + duration,
//             address(token),
//             1
//         );

//         voting.initializeVotingPeriod(
//             startTime,
//             duration,
//             address(token),
//             1
//         );

//         assertTrue(voting.isInitialized());
//         assertEq(voting.startTime(), startTime);
//         assertEq(voting.endTime(), startTime + duration);
//         assertEq(address(voting.votingToken()), address(token));
//     }

// }