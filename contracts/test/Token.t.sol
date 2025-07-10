// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MyToken} from "../src/Token.sol";

contract TokenTest is Test {
    MyToken public t;

    function setUp() public {
        t = new MyToken("Ash Token","Ash");
    }

    function testMintAndBurn() public{
        t.mint(address(1),100);
        assert(t.balanceOf(address(1))==100);
        vm.prank(address(1));
        t.burn(50);
        assert(t.balanceOf(address(1))==50);
    }
}
