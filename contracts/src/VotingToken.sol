// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract VotingToken is ERC20, Ownable {
    constructor() ERC20("Voting Token", "VTK") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) onlyOwner external {
        _mint(to, amount);
    }


    function burnFrom(address account, uint256 amount) external {
        _burn(account, amount);
    }
}

//contract address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0