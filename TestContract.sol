// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract TestContract {

    templateSolveContract solver;
    bool solved;
    address owner;

    constructor() {
        solved = false;
        owner = msg.sender;
    }

    function test(address hunter) public {
        solver = templateSolveContract(msg.sender);
        uint x = 100;
        uint y = 10;
        require(y == solver.main(x), "Wrong output");
        solved = true;
        owner = hunter;
    }

    function getSolved() public view returns (bool){
        return solved;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }

}

abstract contract templateSolveContract {
    function main(uint x) virtual public returns (uint);
}