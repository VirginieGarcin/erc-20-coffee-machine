// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CoffeeMachineToken is ERC20, ERC20Burnable, Ownable {

    event CoffeeBought(address indexed receiver, address indexed buyer);

    constructor()
    ERC20("CoffeeMachineToken", "CMT")
    Ownable(msg.sender)
    {
        _mint(msg.sender, 5000); // = 5000 token
    }

    function decimals() public view virtual override returns (uint8){
        return 0;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function useOneTokenToGetACoffee(address account) public {
        _spendAllowance(account, msg.sender, 1);
        _burn(msg.sender, 1);
        emit CoffeeBought(msg.sender, account);
    }
}
