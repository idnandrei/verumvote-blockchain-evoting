// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "lib/forge-std/src/Script.sol";
import {VotingSystem} from "../src/Voting.sol";
import {VotingToken} from "../src/VotingToken.sol";
import {MerkleAirdrop} from "../src/MerkleAirdrop.sol";
import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {stdJson} from "forge-std/StdJson.sol";

contract DeployVoting is Script {
    using stdJson for string;
    
    function run() public {
        vm.startBroadcast();
        
        bytes32 s_merkleRoot = 0xc6125fc07bef2ffb32292bbbf5010e3d1b104d1c507d4315c3c65d7230a4ff0c;
        
        // Deploy contracts
        VotingToken token = new VotingToken();
        console2.log("VotingToken deployed to:", address(token));

        MerkleAirdrop airdrop = new MerkleAirdrop(s_merkleRoot, IERC20(address(token)));
        console2.log("MerkleAirdrop deployed to:", address(airdrop));


        VotingSystem voting = new VotingSystem();
        console2.log("VotingSystem deployed to:", address(voting));

        vm.stopBroadcast();
    }
}
