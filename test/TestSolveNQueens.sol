pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SolveNQueens.sol";

contract TestMetaCoin {

  function testInitialBalanceUsingDeployedContract() public {
    // MetaCoin meta = MetaCoin(DeployedAddresses.MetaCoin());
    SolveNQueens solveNQueens = SolveNQueens(DeployedAddresses.MetaCoin());
	
	// Declare dimension as input dimension
	uint8 N = 4;
	
	// Initialise input board for solver function
	//bool [][] memory input_board = [[ false, false, false, false ],
	//bool[] memory input_board = [[ false, false, false, false ], 
	//bool[][] storage input_board= new bool[][];
	bool[4][4] memory input_board = [[ false, false, false, false ], 
	[ false, false, false, false ],
	[false, false, false, false],
	[ false, false, false, false]];

	
	
	// Specify expected output
	bool [4][4] memory expected_board = [[ false, true, false, false ], 
        [ false, false, false, false ], 
        [false, false, false, false], 
        [ false, false, false, false]];
		
    Assert.equal(solveNQueens.solveNQ(input_board, N), expected_board, "Owner should have 10000 MetaCoin initially");
  }
}
