// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "lib/forge-std/src/Script.sol";
import {VoteRecordSystem} from "../src/Voting.sol";
import {VotingToken} from "../src/VotingToken.sol";


contract DeployVoting is Script {
    function run() public {
        vm.startBroadcast();

        // Deploy and mint tokens
        VotingToken token = new VotingToken();
        token.mint();
        console2.log("VotingToken deployed to:", address(token));

        // Deploy voting system
        VoteRecordSystem voting = new VoteRecordSystem();
        console2.log("VoteRecordSystem deployed to:", address(voting));

        vm.stopBroadcast();
    }
}
