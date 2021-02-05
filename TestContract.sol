// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// Example contract of a TestContract.
contract TestContract {

    bool solved;    // Boolean to denote if contract is solved.
    address payable owner;  // Owner of the contract, first this is the sponser.

    constructor() payable {      // Constructor to initialise values.
        solved = false;         
        owner = msg.sender;     //  Set the owner of the contract to the creator of the contract.
    }

    function test(address payable hunter) public payable {
        TemplateSolveContract solver = TemplateSolveContract(msg.sender); // The message sender is the contract activating the test function.
        uint x = 100;
        uint16 y = 10;
        require(y == solver.main(x), "Wrong output");   // Require the output of the main function to be y.
        solved = true;                                  // Set solved to true.
        owner = hunter;                                 // Set the owner to the solver.
        owner.transfer(address(this).balance);          // Transfer the bounty to the hunter.
    }

    // Getter function for the solved variable.
    function getSolved() public view returns (bool){   
        return solved;
    }
    
    // Getter function for the Ownership.
    function getOwner() public view returns (address) { 
        return owner;
    }
    
    // Getter function for the balance of the contract.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}

// TemplateSolveContract so the TestContract knows the structure of the solver.
abstract contract TemplateSolveContract {
    function main(uint x) virtual public returns (uint);
}




