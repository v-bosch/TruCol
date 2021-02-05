// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
contract SolveContract {

    backupTestContract testContract;

    
    function test(address testAddress) public {
        testContract = backupTestContract(testAddress);
        testContract.test();
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

abstract contract backupTestContract {
    function test() virtual public;
}