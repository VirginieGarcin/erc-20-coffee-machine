// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CoffeeMachineToken is ERC20, Ownable {

    // This event will be emitted when some token holder uses a token to get a coffee
    event CoffeeBought(address indexed buyer);

    constructor()
    ERC20("CoffeeMachineToken", "CMT") // Name and symbol of our token
    Ownable(msg.sender)
    {
        _mint(msg.sender, 5000); // Initial supply of 5000 token owned by the coffee machine owner (contract owner)
    }

    function decimals() public view virtual override returns (uint8){
        return 0; // No decimal because it doesn't make sense to use fractions of token at the coffee machine
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount); // We allow the owner to mint more token
    }

    // Function that will be called when a token hodler uses a token to get a coffee
    function useOneTokenToGetACoffee() public {
        transfer(owner(), 1); // We send back the token to the coffee machine owner
        emit CoffeeBought(msg.sender); // We emit the event that the token holder bought a coffee
    }
}
