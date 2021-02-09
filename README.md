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
<<<<<<< HEAD
<<<<<<< HEAD
- Click on the TestContract and try to get the refund, when it is past your timestamp it should selfdestruct otherwise it should not work

Note that only the owner of the contract (which is the person who either created or solved the contract) can activate the refund function.
=======
- Click on the TestContract and try to get the refund, when it is past your timestamp it should selfdestruct otherwise it should not work, 

note that only the owner of the contract (which is the person who either created or solved the contract) can activate the refund function
>>>>>>> Update readme with instructions
=======
- Click on the TestContract and try to get the refund, when it is past your timestamp it should selfdestruct otherwise it should not work

Note that only the owner of the contract (which is the person who either created or solved the contract) can activate the refund function.
>>>>>>> 84a9ee6d5ca7b43539356ea3e1b56349baada965
