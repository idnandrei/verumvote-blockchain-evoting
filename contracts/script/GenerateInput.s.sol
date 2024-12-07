// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "lib/forge-std/src/Script.sol";
import {stdJson} from "lib/forge-std/src/StdJson.sol";
import {console} from "lib/forge-std/src/console.sol";

// Merkle tree input file generator script
contract GenerateInput is Script {
    uint256 private constant AMOUNT = 1 * 10 ** 18;
    string[] types = new string[](2);
    uint256 count;
    string[] whitelist = new string[](8);
    string private constant  INPUT_PATH = "/script/target/input.json";
    
    function run() public {
        types[0] = "address";
        types[1] = "uint";
        whitelist[0] = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";//for local
        whitelist[1] = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";//for local
        whitelist[2] = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";//for local
        whitelist[3] = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";//for local
        whitelist[4] = "0x5b75568f202FFd0a9D945F44fcf7bC1d2A292D2E";//for testnet
        whitelist[5] = "0x467CabfDE020965447b68115427F2BC3dF09299B";//for testnet   
        whitelist[6] = "0x2a12ee179a323DDdE5217c425bf36EB84a0Be960";//for testnet
        whitelist[7] = "0x6CA6d1e2D5347Bfab1d91e883F1915560e09129D";//for testing
        count = whitelist.length;
        string memory input = _createJSON();
        // write to the output file the stringified output json tree dumpus 
        vm.writeFile(string.concat(vm.projectRoot(), INPUT_PATH), input);

        console.log("DONE: The output is found at %s", INPUT_PATH);
    }

    function _createJSON() internal view returns (string memory) {
        string memory countString = vm.toString(count); // convert count to string
        string memory amountString = vm.toString(AMOUNT); // convert amount to string
        string memory json = string.concat('{ "types": ["address", "uint"], "count":', countString, ',"values": {');
        for (uint256 i = 0; i < whitelist.length; i++) {
            if (i == whitelist.length - 1) {
                json = string.concat(json, '"', vm.toString(i), '"', ': { "0":', '"',whitelist[i],'"',', "1":', '"',amountString,'"', ' }');
            } else {
            json = string.concat(json, '"', vm.toString(i), '"', ': { "0":', '"',whitelist[i],'"',', "1":', '"',amountString,'"', ' },');
            }
        }
        json = string.concat(json, '} }');
        
        return json;
    }
}