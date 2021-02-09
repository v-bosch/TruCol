// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
pragma experimental ABIEncoderV2;

// This contract contains a solution to the N-queens problem that the "testNQUeens" bounty contract has presented. 

contract SolveNQueens {

    TemplateTestContract testContract;  // Create variable for the testContract which needs to be solved.
    address payable owner;      
    bool[][]board;              // Chessboard
    uint8 N;                    // Number of queens  

    constructor(address testAddress) payable {              
        testContract = TemplateTestContract(testAddress);   // Initialise the testContract variable.
        owner = msg.sender;                                 // Initialise the owner of the contract to be the creator of the contract.
        N = 4;
    }

     // Function to solve the problem specified in the testContract.
    function solve() public payable{
        testContract.test(owner);
    }

    function main(bool[][] memory unsolved_board) public returns (bool[][] memory solved_board) {
        (bool a, bool[][] memory solution) = solveNQ(x, N);
        return(solution);

    }

    // general solve function that is called by main, takes the empty board as input and returns whether there 
    // is a solution, and the solution itself. 

    function solveNQ(bool[][] memory board_in, uint8 col) public returns (bool, bool[][] memory) { 
        // If all queens are placed 
        if (board_in[0].length == N) 
            return (true, board_in); 
    
        for (uint8 i = 0; i < N; i++) { 
            // Check if the queen can be placed 
            if (isSafe(board_in, i, col)) { 
                // Place queen 
                board[i][col] = true; 
    
                // recur for the next column
                (bool a, bool[][] memory c) = solveNQ(board_in, col + 1);
                if (a)
                    return (true, c); 
    
                // no queen present, so set bool of this square to false
                board[i][col] = false; 
            } 
        } 
        // If the queen cannot be placed in any row in 
        //this colum col then return false 
        return (false, board_in); 
    }

    // function that checks the squares on the board, in order to find a safe position for the queen 
    function isSafe(bool[][] memory b, uint8 row, uint8 col) public view returns (bool) { 
        uint8 i = row;
        uint8 j = col; 
    
        // Check whether there is a queen in the row on left side 
        for (i = 0; i < col; i++) 
            if (b[row][i]) 
                return false; 
    
        // Check whether there is a queen in the upper diagonal on left side 
        for (i;i >= 0; i--) 
            for (j; j >= 0; j--) 
                if (b[i][j]) 
                    return false; 
        
        // Check whether there is a queen in the lower diagonal on left side 
        for (i; i < N; i++) 
            for (j; j >= 0; j--) 
                if (b[i][j]) 
                    return false; 
    
        return (true); 
    }     
}

// TemplateTestContract so the SolveContract knows the structure of the testContract.
contract TemplateTestContract is ITemplateTestContract {
    function test(address payable hunter) virtual external;
}
