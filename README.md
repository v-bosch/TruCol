# TruCol [![Solidity version](https://img.shields.io/badge/Solidity-v0.8.1-ff69b4.svg?maxAge=3600)](https://solidity.readthedocs.io/en/v0.8.1/installing-solidity.html) [![node version](https://img.shields.io/badge/node.js-%3E=_v10-green.svg)](http://nodejs.org/download/)  [![License: GPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0) [![Build Status](https://travis-ci.com/v-bosch/TruCol.svg?branch=main)](https://travis-ci.com/v-bosch/TruCol)

TruCol aims at building a decentralized, trust-less platform for test-driven programming development.

## Description

Suppose Alice wants some well-defined challenge, e.g. solve an `nxn` Sudoku, to be solved and writes a set of unit tests that check any solution using random inputs. Instead of creating the solution, Alice publishes the unit tests in a smart contract and sets a bounty for any other smart contract that solves it. Bob the bounty hunter can then see the contract and write a solution in a smartcontract and get the reward. This repository presents the protocol to do this completeley trustless and decentralised without taking any fees, increasing market efficiency.

![1](./FAQ/concept.png)

## What's new?

 - By providing a protocol instead of a service, we empower the users financially whilst increasing their autonomy by removing the need to rely on an over-arching bounty platform that takes money from the work of users. 
 - Sharing a completely open and deterministic payout protocol, removes bias from "the hiring process"*.
 - Presenting a protocol instead of a service makes the free market for test driven development (significantly more) resilient against takedowns.

## Weaknesses
0. Currently the fully trustless decentralised version of the protocol is only implemented in Solididty to Solidity. This is  a significant constraint on the adoptability as most test-driven development happens in other languages like Python/C etc. [Issue 5](https://github.com/v-bosch/TruCol/issues/5) describes how the protocol can be expanded to facilitate other languages
1. The costs of evaluating unit tests and solutions on chain can be significant. Scalability in costs through expansion of the chain of trust and/or allowing users to reduce decentralisation might allow users to make their own decision on "safety/costs".
2. *The bias in "the hiring process" is only removed for test driven development jobs.
3. *The bias in "the hiring process" is still present based on the language that sponsors write their code in. Additionally, bounty hunters and sponsors still require access to the internet to enter this free market.

## Content

 - This repository contains three pairs of solidity contracts of which two pairs are a proof of concept of the protocol. The third set/pair of contracts is the `metacoin` Truffle unit testing example that shows how to write unit tests for solidity contracts. 
 - Additionally a website is written in NodeJS that makes writing their bounty contracts and solidity unit tests as simple as possible.


## Usage

## FAQ


## Manual Testing
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
