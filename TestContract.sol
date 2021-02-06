// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// Example contract of a TestContract.
contract TestContract {

    bool solved;    // Boolean to denote if contract is solved.
    address payable owner;  // Owner of the contract, first this is the sponser.
    uint expiry;        // Get the time when the contract expires.

    constructor() payable {      // Constructor to initialise values.
        solved = false;         //  Boolean value to indicate if contract is already solved.
        owner = msg.sender;     //  Set the owner of the contract to the creator of the contract.
        expiry = 1612569800;    //  Unix timestamp of the moment of expiry. 
    }

    function test(address payable hunter) public payable {
        TemplateSolveContract solver = TemplateSolveContract(msg.sender); // The message sender is the contract activating the test function.
        uint x = 100;                                   // Sample input.
        uint16 y = 10;                                  // Sample expected output.
        require(y == solver.main(x), "Wrong output");   // Require the output of the main function to be y.
        solved = true;                                  // Set solved to true.
        owner = hunter;                                 // Set the ownership to the hunter.
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
    
    // Refund method to claim the value of the contract after expiry.
    function refund() public {
        require(solved == false, "Only an unsolved contract can be refunded");      // Make sure the contract is not resolved yet.
        require(msg.sender == owner, "Only the owner can call for a refund");       // Make sure the caller of the refund function is the solver of the contract.
        require(block.timestamp >= expiry, "Contract is not expired yet");          // Make sure the contract is expired, only expired contracts can be refunded.
        selfdestruct(owner);    // Let the contract selfdestruct and move the value to the owner.
    }

}

// TemplateSolveContract so the TestContract knows the structure of the SolveContract.
abstract contract TemplateSolveContract {
    function main(uint x) virtual public returns (uint);
}