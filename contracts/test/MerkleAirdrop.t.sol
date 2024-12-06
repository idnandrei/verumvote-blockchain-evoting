// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {MerkleAirdrop} from "../src/MerkleAirdrop.sol";
import {VotingToken} from "../src/VotingToken.sol";
import {Test, console2} from "lib/forge-std/src/Test.sol";


contract MerkleAirdropTest is Test {
    MerkleAirdrop public airdrop;
    VotingToken public token;
    address public gasPayer;
    address public user;
    uint256 public userPrivKey;

    bytes32 merkleRoot = 0xfe7b26aa31cd1815d6d1417ba1293e8b36b9ec1be50222631d93e75a849f85bf;
    uint256 amountToCollect = 1;
    uint256 amountToSend = amountToCollect * 4;

    bytes32 proofOne = 0x0000000000000000000000000000000000000000000000000000000000000000;
    bytes32 proofTwo = 0x0000000000000000000000000000000000000000000000000000000000000000;
    bytes32 proofThree = 0xdba2743ca1209ee78d5853ca62a0a7cdaa30c5f2432648c1b266434f0cb08c52;
    bytes32[] public proof = [proofOne, proofTwo, proofThree];

    function setUp() public {
        token = new VotingToken();
        airdrop = new MerkleAirdrop(merkleRoot, token);
        token.mint(token.owner(), amountToSend);
        token.transfer(address(airdrop), amountToSend);
        (user, userPrivKey) = makeAddrAndKey("user");
    }

    function testUsersCanClaim() public {
       uint256 startingBalance = token.balanceOf(user);
       console2.log("startingBalance:", startingBalance);

       vm.prank(user);
       airdrop.claim(user, proof);
       uint256 endingBalance = token.balanceOf(user);
       console2.log("endingBalance:", endingBalance);
       assertEq(endingBalance - startingBalance, amountToCollect);
    }

    // function signMessage(uint256 privKey, address account) public view returns (uint8 v, bytes32 r, bytes32 s) {
    //     bytes32 hashedMessage = airdrop.getMessageHash(account, amountToCollect);
    //     (v, r, s) = vm.sign(privKey, hashedMessage);
    // }

    
}
