// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract TestContract {

    templateSolveContract solver;
    bool solved;
    address payable owner;

    constructor() payable{
        solved = false;
        owner = msg.sender;
    }

    function test(address payable hunter) public payable {
        solver = templateSolveContract(msg.sender); // The message sender is the contract activating the test function
        uint x = 100;
        uint16 y = 10;
        require(y == solver.main(x), "Wrong output");
        solved = true;
        owner = hunter;
        owner.transfer(address(this).balance);
    }

    
    function getSolved() public view returns (bool){
        return solved;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}

abstract contract templateSolveContract {
    function main(uint x) virtual public returns (uint);
}

