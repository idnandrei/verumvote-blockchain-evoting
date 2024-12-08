// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console2} from "lib/forge-std/src/Script.sol";
import {VotingToken} from "../src/VotingToken.sol";
import {MerkleAirdrop} from "../src/MerkleAirdrop.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {stdJson} from "forge-std/StdJson.sol";

contract AirdropTokens is Script {
    using stdJson for string;
    
    function run() public {
        vm.startBroadcast();
        
        // You'll need to replace these with your deployed contract addresses
        address tokenAddress = address(0x2F109fE0f94Fe098FE22Ed3958eBEb55f7809247); // Replace with your deployed VotingToken address
        address airdropAddress = address(0xb30619A5739BCF085D4d77b2f6DE5788d067fF2f); // Replace with your deployed MerkleAirdrop address
        
        VotingToken token = VotingToken(tokenAddress);
        MerkleAirdrop airdrop = MerkleAirdrop(airdropAddress);

     // Read and parse JSON file
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/script/target/output.json");
        string memory json = vm.readFile(path);

        // Create arrays for addresses and proofs
        address[] memory addresses = new address[](8);
        bytes32[][] memory proofs = new bytes32[][](8);


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

        vm.stopBroadcast();
    }
} 