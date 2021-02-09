pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SolveNQueens.sol";

contract TestSolveNQueens{

  function testMain() public {
    //SolveNQueens solveNQueens = SolveNQueens(DeployedAddresses.MetaCoin());
	SolveNQueens solveNQueens = SolveNQueens(msg.sender);
	
	// Declare dimension as input dimension
	uint8 N = 4;
	
	// Initialise input board for solver function
	bool[4][4] memory input_board = [[ false, false, false, false ], 
	[ false, false, false, false ],
	[false, false, false, false],
	[ false, false, false, false]];
	
	// Specify expected output
	bool [4][4] memory expected_board = [[ false, true, false, false ], 
        [ false, false, false, false ], 
        [false, false, false, false], 
        [ false, false, false, false]];
			
	/// get the results from the function that is being tested
	bool [4][4] memory actual_result = solveNQueens.main(input_board);
	
	// get the first element from the two dimensional arrays
	//bool actual = actual_result[0][0];
	bool[4] memory actual_arr = actual_result[0];
	bool  actual = actual_arr[0];
	
	// unpack the expacted array in steps
	//bool expected = expected_board[0][0];
	bool[4] memory expected_arr = expected_board[0];
	bool  expected= expected_arr[0];
	
	// assert result equals expected result
	Assert.equal(actual, expected, "Owner should have 10000 MetaCoin initially");
  }
}
