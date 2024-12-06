// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "lib/forge-std/src/Script.sol";
import {VoteRecordSystem} from "../src/Voting.sol";
import {VotingToken} from "../src/VotingToken.sol";
import {MerkleAirdrop} from "../src/MerkleAirdrop.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {stdJson} from "forge-std/StdJson.sol";

contract DeployVoting is Script {
    using stdJson for string;
    
    function run() public {
        vm.startBroadcast();
        
        bytes32 s_merkleRoot = 0xfe7b26aa31cd1815d6d1417ba1293e8b36b9ec1be50222631d93e75a849f85bf;
        
        // Deploy contracts
        VotingToken token = new VotingToken();
        console2.log("VotingToken deployed to:", address(token));

        MerkleAirdrop airdrop = new MerkleAirdrop(s_merkleRoot, IERC20(address(token)));
        console2.log("MerkleAirdrop deployed to:", address(airdrop));

        // Read and parse JSON file
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/script/target/output.json");
        string memory json = vm.readFile(path);

        // Create arrays for addresses and proofs
        address[] memory addresses = new address[](5);
        bytes32[][] memory proofs = new bytes32[][](5);

        // Parse JSON data
        bytes memory rawAddresses = json.parseRaw("$..inputs[0]");
        addresses = abi.decode(rawAddresses, (address[]));

        bytes memory rawProofs = json.parseRaw("$..proof");
        proofs = abi.decode(rawProofs, (bytes32[][]));

        // Only mint tokens to the airdrop contract
        token.mint(address(airdrop), 10); // Since FIXED_AMOUNT is 1

        // Add balance check
        console2.log("Airdrop contract balance:", token.balanceOf(address(airdrop)));

        // Call instantAirdrop
        airdrop.instantAirdrop(addresses, proofs);

        // Check balances after airdrop
        for(uint i = 0; i < addresses.length; i++) {
            console2.log("Address", addresses[i], "balance:", token.balanceOf(addresses[i]));
        }

        console2.log("Airdrop contract balance:", token.balanceOf(address(airdrop)));

        VoteRecordSystem voting = new VoteRecordSystem();
        console2.log("VoteRecordSystem deployed to:", address(voting));

        vm.stopBroadcast();
    }
}
