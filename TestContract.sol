// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract TestContract {

    backupSolveContract solver;
    bool solved;

    constructor() {
        solved = false;
    }

    function test() public {
        solver = backupSolveContract(msg.sender);
        uint x = 100;
        uint y = 10;
        require(y == solver.main(x), "Wrong output");
        solved = true;
    }

    function getSolved() public view returns (bool){
        return solved;
    }

}



abstract contract backupSolveContract {
    function main(uint x) virtual public returns (uint);
}

