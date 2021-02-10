# TruCol
TruCol aims at building a decentralized, trust-less platform for test-driven programming development.



TestContract consists of a square root problem and the SolveContract is able to solve the problem.

Test:
- Open both contracts in https://remix.ethereum.org
- Compile (ctrl+s) and select the TestContract (Not the template!),  deploy it (optionally add a value to it)
- Copy the contract address of the TestContract
- Compile and select the SolveContract (Not the template!), paste the copied address in the deploy field and deploy it
- Finally, click on the SolveContract and click on the 'solve' function
- Now the funds should be transferred to the owner of the solvecontract

TestRefund:
- Change the expiry value in the contract to a future experidate (unix timestamp)
- Compile and select the TestContract, deploy it with a value
- Click on the TestContract and try to get the refund, when it is past your timestamp it should selfdestruct otherwise it should not work

Note that only the owner of the contract (which is the person who either created or solved the contract) can activate the refund function.

## Truffle Testing
The solidity contracts can be tested with Truffle. Documentation is [here](https://www.trufflesuite.com/docs/truffle/getting-started/installation), video instructions is [here](https://www.youtube.com/watch?v=2fSPn0-8ORs) (starts at 1:34).
 

### Installation Linux
1. install npm on device
```
sudo apt install npm
```
2. Install truffle
```
sudo npm install -g truffle
```
3. Go into root folder and create a folder (chose to name it `metacoin`) put an example truffle test setup in there.
```
mkdir metacoin
```
4. Go into example folder and create the example truffle project.
```
cd metacoin
truffle unbox metacoinx
```
5. Run truffle test to verify it works
```
truffle test
```
