# TruCol
TruCol aims at building a decentralized, trust-less platform for test-driven programming development.



TestContract consists of a square root problem and the SolveContract is able to solve the problem.


Test:
- Open both contracts in https://remix.ethereum.org
- Compile (ctrl+s) and select the TestContract (Not the template!)
- Set the environment in remix to 'injected web3'
- Install metamask, and claim some test ether from a test network, Kovan for example
- Deploy the contract, use a test network like kovan for the vrfCoordinator and keyhash
- Copy the contract address of the TestContract
- Use metamask to put some test LINK on the testcontract
- Compile and select the SolveContract (Not the template!), paste the copied address in the deploy field and deploy it
- Finally, click on the SolveContract and click on the 'solve' function
- Now the funds should be transferred to the owner of the solvecontract

TestRefund:
- Change the expiry value in the contract to a future experidate (unix timestamp)
- Compile and select the TestContract, deploy it with a value
- Click on the TestContract and try to get the refund, when it is past your timestamp it should selfdestruct otherwise it should not work

Note that only the owner of the contract (which is the person who either created or solved the contract) can activate the refund function.
