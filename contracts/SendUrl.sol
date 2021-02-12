// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// This is an example of a cloud-based code submission 

// The hunter can submit a link to e.g. a GitHub page, this will be saved with the user adress in linkMapping.
// Each submission will be given an Id. 
// The owner can accept a submission by specifying the Id of the submission in the acceptResult() function.

contract SendLink {
    bool solved;    // Boolean to denote if contract is solved.
    address payable owner;  // Owner of the contract, first this is the sponser.
    uint expiry;        // Get the time when the contract expires.
    
    constructor() public payable {      // Constructor to initialise values.
        solved = false;         //  Boolean value to indicate if contract is already solved.
        owner = msg.sender;     //  Set the owner of the contract to the creator of the contract.
        expiry = 1612569800;    //  Unix timestamp of the moment of expiry. 
    }
    
    struct LinkTemplate {
        address payable userAddress;     // Save address hunter.
        string url;                      // Save Url.
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
    
    uint256 linkId = 0;
    mapping (uint => LinkTemplate) public linkMapping;
 
    // Owner can accept the submission at the specified location ID. 
    function acceptResult(uint resultId) public payable {
        require(msg.sender == owner);                   // Only the owner can accept the result.
        solved = true;                                  // Set solved to true.
        owner = linkMapping[resultId].userAddress;      // Set the ownership to the hunter.
        owner.transfer(address(this).balance);          // Transfer the bounty to the hunter.
    }
    
    // Add a link to linkMapping.
    function addLink(string memory url) public returns (uint) {
        require(solved == false);               // Can only add a link if contract not solved.
        linkId++;                               // Increment link id.
        linkMapping[linkId] = LinkTemplate(msg.sender, url);    // Save the address and url.
        return linkId;
    }
    
    // Refund method to claim the value of the contract after expiry.
    function refund() public {
        require(msg.sender == owner && block.timestamp >= expiry, "Contract is not expired yet");   // The sender must own the contract and the contract must be expired.
        selfdestruct(owner);    // Let the contract selfdestruct and move the value to the owner.
    }
}
