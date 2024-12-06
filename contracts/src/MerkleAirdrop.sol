// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";
import {EIP712} from "lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {SafeERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";


contract MerkleAirdrop is EIP712 {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20; // Prevent sending tokens to recipients who can’t receive

    error MerkleAirdrop__InvalidProof();
    error MerkleAirdrop__AlreadyClaimed();
    error MerkleAirdrop__InvalidSignature();

    IERC20 private immutable i_airdropToken;
    bytes32 private immutable i_merkleRoot;
    mapping(address => bool) private s_hasClaimed;
    uint256 public constant FIXED_AMOUNT = 1;


    bytes32 private constant MESSAGE_TYPEHASH = keccak256("AirdropClaim(address account,uint256 amount)");

    // define the message hash struct
    struct AirdropClaim {
        address account;
        uint256 amount;
    }

    event Claimed(address account, uint256 amount);
    event MerkleRootUpdated(bytes32 newMerkleRoot);

    constructor(bytes32 merkleRoot, IERC20 airdropToken) EIP712("Merkle Airdrop", "1.0.0") {
        i_merkleRoot = merkleRoot;
        i_airdropToken = airdropToken;
    }

    // claim the airdrop using a signature from the account owner
    function claim(
        address account,
        bytes32[] calldata merkleProof
    )
        external
    {
        if (s_hasClaimed[account]) {
            revert MerkleAirdrop__AlreadyClaimed();
        }

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(account, FIXED_AMOUNT))));

        if (!MerkleProof.verify(merkleProof, i_merkleRoot, leaf)) {
            revert MerkleAirdrop__InvalidProof();
        }

        s_hasClaimed[account] = true; // prevent users claiming more than once and draining the contract
        emit Claimed(account, FIXED_AMOUNT);
        // transfer the tokens
        i_airdropToken.safeTransfer(account, FIXED_AMOUNT);
    }

    // message we expect to have been signed
    function getMessageHash(address account, uint256 amount) public view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(abi.encode(MESSAGE_TYPEHASH, AirdropClaim({ account: account, amount: amount })))
        );
    }


    function getMerkleRoot() external view returns (bytes32) {
        return i_merkleRoot;
    }

    function getAirdropToken() external view returns (IERC20) {
        return i_airdropToken;
    }

    function instantAirdrop(
        address[] calldata accounts,
        bytes32[][] calldata merkleProofs
    ) external {
        require(accounts.length == merkleProofs.length, "Length mismatch");
        
        for (uint256 i = 0; i < accounts.length; i++) {
            // Skip if already claimed
            if (s_hasClaimed[accounts[i]]) {
                continue;
            }

            bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(accounts[i], FIXED_AMOUNT))));
            
            if (MerkleProof.verify(merkleProofs[i], i_merkleRoot, leaf)) {
                s_hasClaimed[accounts[i]] = true;
                emit Claimed(accounts[i], FIXED_AMOUNT);
                i_airdropToken.safeTransfer(accounts[i], FIXED_AMOUNT);
            }
        }
    }

   



    // function _isValidSignature(
    //     address signer,
    //     bytes32 digest,
    //     uint8 _v,
    //     bytes32 _r,
    //     bytes32 _s
    // )
    // internal view returns (bool) {
    //     bytes memory signature = abi.encode(_v, _r, _s);
    //     return SignatureChecker.isValidSignatureNow(signer, digest, signature);
    // }
}

