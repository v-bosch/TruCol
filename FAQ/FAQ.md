# Frequently Asked Questions (FAQ)
0.a So what happens if someone wants to ask "can you make my website look good" as a task?
0.b Such problems are currently not well suited to be solved for the presented protocol. Currently only well defined tasks are possible. With well defined we mean tasks that have a determinisitic and verifiable answer for any given input. The most optimal usecase for this protocol currently consists of problems in NP. This is because there oftern are polynomial time approximations (referred to as heuristics) for non-polynomial problems. A typical bounty could be: "Solve a TSP instance (that has a certain property, e.g. for fully connected networks in O(n^1.27) time). This could then be enforced by limiting the maximum allowed gas that the solution of the bounty contract is allowed to consume whilst still getting the bonus. (Or more harshly, gas costs could subtract from the bounty, untill no bounty is awarded if the solution requires too much computational budget/gas). 

1.a But isn't it increadibly costly to solve TSP/NP-problems in solidity on the blockchain?
1.b Yes. To minimise costs, a part of the randomly generated number could be used to generate a random input size in a constrained range, e.g. `5<n<40`, next the remainder of the VFR number could be used to initialise random edgeweights of a graph. This strategy could be used to make a solution space that is large enough to not be hard-codable (e.g. through variety of graph edge connection patterns) whilst still limiting the computational costs.

2.a Is it possible to make this evaluation a bit cheaper?
2.b Yes, in special cases, where the sponsor already has a solution to a problem, but wants an even more efficient solution (with a lower time complexity). This protocol is referred to as: *Direct Hash Verification*. (For more details, see below)



## Direct Hash Verification

## Direct Hash Verification - Solidity Only
Suppose: 

1. The sponsor wants the bounty hunter to solve a graph problem in NP.
2. The sponsor has a solution that works well = complexity of 1.27*n^2 for graphs that have a maximum tree width of 25 (nodes/branches). 
3. The sponsor also has a/(the same) method that has complexity of 24254245*n^5 for graphs that do not satisfy the tree width criteria.
3. However, the employer/sponsor would like to have a more generalized version that works well for all graphs without cherry-picking graphs that have a nice tree width<=25. 
4. Suppose the sponsor has a production environment where this algorithm is ran every day a few thousand times on very large problem instances, then it would be worth quite some money to make it run quicker.

Then the sponsor could compute what the smart contract evaluation costs must be if the bounty-hunter submits a solution that:
1. Solves a non-cherry-picked/difficult task in complexity 1.27*n^2 time. (e.g. $5+$5+$10 = $20,- for all 3 tasks)
2.  Solves the task in 24254245*n^5 time. (e.g. $5+$5+$90 = $100,- for all three tasks)
    
Next, the sponsor could write out a contract that:
1. Only pays out the bounty if the runtime costs of the solution smart contract of the bounty hunter was equal to- or below $20,-.
2. Or just set a bounty that is less than $20,- such that the bounty hunter will not even try to submit a solution if it costs more to run its solution than that the bounty hunter earns.
3. To prevent the bounty hunter from hardcoding the input/output relation and uploading gibberish just to get the bounty without providing a generalized solution, the sponsor has to hide the input values until the bounty hunter uploads a solution that asks to be evaluated.
   3.1 The secret could be hidden in a (set of) Chainlink node(s). This is possible, the mechanism is called "Chainlink Commit Reveal" [See p9](https://link.smartcontract.com/whitepaper).
   3.2 If the smart contract of the bounty hunter requests evaluation, the secret should be published E.g. smart contract of the bounty hunter asks the nodes to return the secret and passes this as input to the smart contract of the bounty hunter. 
4. The bounty hunter solution then computes the answers, and submits them to the smart contract of the employer.
5. The smart contract of the sponsor hashes the solution and verifies if they are the same as the hash codes published by the sponsor.
   5.1 If they are, the bounty hunter gets paid.
   5.2 If they are not, the sponsor must prove that the sponsor did not simply put in false hash codes to prevent paying the bounty. 
   5.3 Therefore the computationally expensive method of the sponsor (24254245*n^5 time) should be included to prove that they do result in the correct hashes.  This computation must be paid for (in advance) by the bounty hunter. It is a form of staking where the bounty hunter says "I bet x dollars that my answers yield the right result".
   5.4 If the expensive method results in the correct hashes, the smart contract of the sponsor is terminated without paying the bounty. (The sponsor must upload a new secret to Chainlink)
  5.5 If the expensive method results in the incorrect hashes, the sponsor put up false hashes, and the bounty (+computation for doing the last check) are paid out to the bounty hunter.


This guarantees the solution that is submitted by the bounty hunter is an improvement/new knowledge for the employer/sponsor.

To prevent the bounty hunter from hardcoding the hash codes directly based on the inputs, the input could be hidden somewhere, e.g. in an Oracle. and only publish it once the bounty hunter requests evaluation. Visualised in p9 of [this whitepaper](https://link.smartcontract.com/whitepaper). The value of this secret should be a bounded secret to prevent the bounty hunter from getting too much costs. The contract by the sponsor could be  terminated if the bounty does not solve the contract).
