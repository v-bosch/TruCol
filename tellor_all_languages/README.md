# Trucol Adaptation of Teller Sample Project
This is a modification of the Tellor Sample Project repository to realise two functionalities using the Tellor Oracle system:
0. Read out the (Travis) CI pass flag from a repository branch, e.g. from here: https://travis-ci.com/v-bosch/TruCol.svg?branch=main&amp
1. Read out the content of a list of files in a repository branch. E.g. from here: https://github.com/jfrog/jfrog-docker-repo-simple-example

To do this, first custom instructions to run in Ubuntu from the TruCol repository are included. These are followed by the description of an approach to realise these functionalities. The original readme of the unmodified source repository of this code is [here](https://github.com/tellor-io/sampleUsingTellor) and [this](https://docs.tellor.io/tellor/) is the documentation.


## TruCol Installation Instructions
0. Open Terminal, go to the root of the TruCol directory.
1. Browse into this directory:
```
cd oracles/sampleUsingTellor
```
2. Install npm on device
```
sudo apt install npm
```
3. Install the requirements for sampleUsingTellor:
```
npm install
```
4. You can run tests on the tellor contract on some network using:
```
npm test
```
5. Normally you could simulate your own local Tellor oracle network using the tellor playground, and then migrate your solidity contracts to interact over there in the tellor playground. Looking at the test files, this is already automated (and isn't required manually anymore).
