// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// Example contract of a TestContract.
contract SolveContract {

    TemplateTestContract testContract;  // Create variable for the testContract which needs to be solved.
    address payable owner;              // Create variable for the owner which solves the test contract.

    // Constructor to initialise the contract variables.
    constructor(address testAddress) public payable {              
        testContract = TemplateTestContract(testAddress);   // Initialise the testContract variable.
        owner = msg.sender;                                 // Initialise the owner of the contract to be the creator of the contract.
    }
    
    // Function to solve the testContract.
    function solve() public payable{
        testContract.test(owner);
    }

    // Example of the main function which solves the testContract.
    // Calculates the squre root function.
    function main(uint x) pure public returns(uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}

// TemplateTestContract so the SolveContract knows the structure of the testContract.
contract TemplateTestContract {
    function test(address payable hunter) public;
}
