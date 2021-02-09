// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
pragma experimental ABIEncoderV2;

// This contract sets out the bounty for a simple N-Queens problem (with N=4), to be solved by the "SolveNQueens" contract.

contract TestNQueens {

    bool[][]board;              // Chessboard
    uint8 N;                    // Number of queens  
    
    bool solved;                // Boolean to denote if contract is solved.
    address payable owner;      // Owner of the contract, first this is the sponser.
    uint expiry;                // Get the time when the contract expires.
    
    constructor() public payable {         // Constructor to initialise values.
            solved = false;         //  Boolean value to indicate if contract is already solved.
            owner = msg.sender;     //  Set the owner of the contract to the creator of the contract.
            expiry = 1612569800;    //  Unix timestamp of the moment of expiry. 
        }


    function test(address payable hunter) public payable {
        TemplateSolveContract solver = TemplateSolveContract(msg.sender);
        
        // Initialize the empty chessboard that needs to be solved
        board = [[ false, false, false, false ], 
        [ false, false, false, false ], 
        [false, false, false, false], 
        [ false, false, false, false]];
        
        require(checkQueens(solver.main(board)), "Wrong answer");
       
        solved = true;                                  // Set solved to true.
        owner = hunter;                                 // Set the ownership to the hunter.
        owner.transfer(address(this).balance);          // Transfer the bounty to the hunter.  
    }
    
     function checkQueens(bool[][] memory b) public view returns(bool correct) {
        uint8 queens;
        uint8 [] memory rowqueens;
        uint8 [] memory colqueens;
        // check for every square whether there is a queen (value is true), if there is, add one to the variables.
        for (uint8 i = 0; i < N; i++) { 
            for (uint8 j = 0; j < N; j++) {
                if (b[i][j] == true)
                    queens ++;
                    rowqueens[i] ++;
                    colqueens[j] ++;
                    // if there are more queens than specified, or there is more than 1 queen in a row/col, the solution is incorrect.
                    if (queens > N || rowqueens[i] > 1 || colqueens[j] > 1)
                        return false;
            }
        }
        return true;
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
        require(msg.sender == owner && block.timestamp >= expiry, "Contract is not expired yet");   // The sender must own the contract and the contract must be expired.
        selfdestruct(owner);    // Let the contract selfdestruct and move the value to the owner.
    }
}

// TemplateSolveContract so the TestContract knows the structure of the SolveContract.
contract TemplateSolveContract is ITemplateSolveContract {
    function main(bool[][] memory x) public returns (bool[][] memory);
}
