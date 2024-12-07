// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "lib/forge-std/src/Script.sol";
import {VoteRecordSystem} from "../src/Voting.sol";
import {VotingToken} from "../src/VotingToken.sol";
import {MerkleAirdrop} from "../src/MerkleAirdrop.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {stdJson} from "forge-std/StdJson.sol";

contract DeployVoting is Script {
    using stdJson for string;
    
    function run() public {
        vm.startBroadcast();
        
        bytes32 s_merkleRoot = 0x57da7ad418726d01685c32c1e738eeef4e863577f557e4fc318f5741173df5db;
        
        // Deploy contracts
        VotingToken token = new VotingToken();
        console2.log("VotingToken deployed to:", address(token));

        MerkleAirdrop airdrop = new MerkleAirdrop(s_merkleRoot, IERC20(address(token)));
        console2.log("MerkleAirdrop deployed to:", address(airdrop));


        VoteRecordSystem voting = new VoteRecordSystem();
        console2.log("VoteRecordSystem deployed to:", address(voting));

        vm.stopBroadcast();
    }
}
