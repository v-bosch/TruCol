// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";

// Example contract of a TestContract.
contract TestContract is VRFConsumerBase {

    bool solved;                // Boolean to denote if contract is solved.
    address payable owner;      // Owner of the contract, first this is the sponser.
    address payable hunter;     // Hunter of the contract.
    uint expiry;                // Get the time when the contract expires.
    bytes32 internal keyHash;   
    uint256 internal fee;
    bytes32 public reqId;
    uint256 public seed;
    uint256 public randomNumber;
    TemplateSolveContract solver = TemplateSolveContract(msg.sender);

    constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint _expiry, uint256 _seed
    ) VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link  // LINK Token
        ) public payable {      // Constructor to initialise values.
        solved = false;         //  Boolean value to indicate if contract is already solved.
        owner = msg.sender;     //  Set the owner of the contract to the creator of the contract.
        expiry = _expiry;       //  Unix timestamp of the moment of expiry. 
        seed = _seed;           // User provided seed for the oracle.
        keyHash = _keyHash;     // keyHash of the VRF Coordinator
        fee = 0.1 * 10 ** 18;   // 0.1 LINK (price to get a random number from the oreacle)
    }


    function test(address payable _hunter) public payable {
        solver = TemplateSolveContract(msg.sender); // The message sender is the contract activating the test function.
        hunter = _hunter;                           // Set the hunter.
        getRandomNumber(20);                        // Generate the random number.
    }
    
    function validate() internal {
        uint256 x = randomNumber % 100000;              // Make sure the random number squared is not too big.
        uint256 y = x ** 2;                             // Calculate the input for the function.
        require(x == solver.main(y), "Wrong output");   // Require the output of the main function to be y.
        solved = true;                                  // Set solved to true.
        owner = hunter;                                 // Set the ownership to the hunter.
        owner.transfer(address(this).balance);          // Transfer the bounty to the hunter.
    }

    
    // Request a random number from the chainlink oracle.
    function getRandomNumber(uint256 userProvidedSeed) internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee, userProvidedSeed);
    }
    
    
    // Callback function used by the VRF coordinator.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomNumber = randomness;                      // Set the random number.
        reqId = requestId;                              // Set the requestId.
        validate();                                     // Call the validation function.
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
    
    // Getter function for the LINK balance of the contract.
    function getLinkBalance() public view returns (uint) {
        return LINK.balanceOf(address(this));
    }
    
    // Refund method to claim the value of the contract after expiry.
    function refund() public  {
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

