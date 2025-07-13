// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract MyToken is ERC20,Ownable{

    constructor(string memory _name,string memory _symbol) ERC20(_name,_symbol) Ownable(msg.sender) {
        _mint(msg.sender,1000000);
    }

    function mint(address _to, uint _amount) public onlyOwner{
        _mint(_to, _amount);
    }

    function burn(uint _amount) public {
        _burn(msg.sender, _amount);
    }
}