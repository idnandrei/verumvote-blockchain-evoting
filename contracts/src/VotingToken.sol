// VotingToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/token/ERC20/ERC20.sol";

contract VotingToken is ERC20 {
    constructor() ERC20("Voting Token", "VTK") {}

    function mint() external {
        _mint(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 10);
        _mint(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, 10);
        _mint(0x90F79bf6EB2c4f870365E785982E1f101E93b906, 10);
        _mint(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, 10);
        _mint(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc, 10);
        _mint(0x976EA74026E726554dB657fA54763abd0C3a0aa9, 10);
        _mint(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955, 10);
        _mint(0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f, 10);
        _mint(0xa0Ee7A142d267C1f36714E4a8F75612F20a79720, 10);


    }

    /// @notice Burns tokens from a specific address
    /// @param account Address of the token holder
    /// @param amount Number of tokens to burn
    function burnFrom(address account, uint256 amount) external {
        _burn(account, amount);
    }
}

//contract address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0