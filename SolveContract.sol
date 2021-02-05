// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
contract SolveContract {

    templateTestContract testContract;
    address payable owner;

    constructor(address testAddress) {
        testContract = templateTestContract(testAddress);
        owner = msg.sender;
    }
    
    function test() public payable{
        testContract.test(owner);
    }

    // Calculate the square route
    function main(uint x) pure public returns(uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}

abstract contract templateTestContract {
    function test(address payable hunter) virtual public;
}