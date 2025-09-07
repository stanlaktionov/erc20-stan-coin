pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StanCoin is ERC20 {
    constructor() ERC20("StanCoin", "STAN") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}