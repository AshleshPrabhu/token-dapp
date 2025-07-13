// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/Token.sol";

contract Deploy is Script {
    function run() external returns (MyToken) {
        uint256 pk = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(pk);

        MyToken token = new MyToken("MyToken", "MTK");

        vm.stopBroadcast();
        return token;
    }
}
