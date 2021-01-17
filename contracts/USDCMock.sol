pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDCMock is ERC20 {
    constructor() public ERC20("USDC", "US Dollar Coin") {}

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function checkAllow(address _spender) external view {
        allowance(msg.sender, _spender);
    }
}
