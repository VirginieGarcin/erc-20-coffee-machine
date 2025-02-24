//SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external;
}

contract CmtTokenSale {
    uint public tokenPriceInWei = 250;
    address owner;

    IERC20 token;

    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }

    function setTokenPriceInWei(uint _price) public {
        require(msg.sender == owner, "Only owner can do this");
        tokenPriceInWei = _price;
    }

    function purchase() public payable {
        require(msg.value >= tokenPriceInWei, "Not enough money sent");
        uint tokensToTransfer = msg.value / tokenPriceInWei;
        uint remainder = msg.value - tokensToTransfer * tokenPriceInWei;
        token.transferFrom(owner, msg.sender, tokensToTransfer);
        payable(msg.sender).transfer(remainder); //send the rest back

    }
}