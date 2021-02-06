// This file can be used to deploy an ethereum contract to a local ethereum blockchain.
// The following tutorial was used:
// https://hackernoon.com/how-to-set-up-your-own-ethereum-development-environment-a-step-by-step-guide-j5kp3b55
const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

// Get needed bytecode and abi for the contract from a local file, these files should be created after compiling the solidity files.
const bytecode = fs.readFileSync('./build/TestContract.bin');
const abi = JSON.parse(fs.readFileSync('./build/TestContract.abi'));

(async function () {
  // Set the owner of the contract.
  const ganacheAccounts = await web3.eth.getAccounts();
  const myWalletAddress = ganacheAccounts[0];

  // Initialise the contract with the abi.
  const myContract = new web3.eth.Contract(abi);

  // Deploy the contract.
  myContract.deploy({
    data: bytecode.toString(),
  }).send({
    from: myWalletAddress,
    gas: 5000000
  }).then((deployment) => {
    console.log('FirstContract was successfully deployed!');
    console.log('FirstContract can be interfaced with at this address:');
    console.log(deployment.options.address);
  }).catch((err) => {
    console.error(err);
  });
})();