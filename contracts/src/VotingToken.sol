// VotingToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/token/ERC20/ERC20.sol";

contract VotingToken is ERC20 {
    constructor() ERC20("Voting Token", "VTK") {}

    function mint() external {
        _mint(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 10);
    }

    /// @notice Burns tokens from a specific address
    /// @param account Address of the token holder
    /// @param amount Number of tokens to burn
    function burnFrom(address account, uint256 amount) external {
        _burn(account, amount);
    }
}

//contract address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0