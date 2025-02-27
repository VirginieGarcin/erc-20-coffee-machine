//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IERC20 {
    // Define here the methods form our token that we will need to call in this contract
    function transferFrom(address from, address to, uint amount) external;
}

contract CmtTokenSale {
    uint public tokenPriceInWei = 2.5 ether; // Set initial token price
    address owner;

    IERC20 token;

    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender; // The creator of the contract is the owner
    }

    // We allow the contract owner (and only him!) to update the token price
    function setTokenPriceInWei(uint _price) public {
        require(msg.sender == owner, "Only owner can do this");
        tokenPriceInWei = _price;
    }

    // This function receive money (eth) and
    function purchase() public payable {
        require(msg.value >= tokenPriceInWei, "Not enough money sent");

        uint tokensToTransfer = msg.value / tokenPriceInWei;
        uint remainder = msg.value - tokensToTransfer * tokenPriceInWei;

        // Give token to the buyer
        token.transferFrom(owner, msg.sender, tokensToTransfer);

        if (remainder > 0) {
            payable(msg.sender).transfer(remainder); // give back any change to the buyer
        }

        payable(owner).transfer(msg.value - remainder); // Transfer the ethers to the owner
    }
}