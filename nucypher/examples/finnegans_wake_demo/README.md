# Ursula exchange example over live network

This illustrates Alice sharing data with Bob over the NuCypher network using proxy re-encryption,
without revealing private keys to intermediary entities.

1. Alice sets a Policy on the NuCypher network (2/3) and grants access to Bob
2. Label and Alice's public key provided to Bob
4. Bob joins the policy by Label and Alice's public key
5. Enrico created for the policy 
6. Each plaintext message gets encapsulated through the Enrico to messageKit
5. Bob receives and reconstructs the Enrico from Policy public key and Enrico public key
6. Bob retrieves the original message from Enrico and MessageKit


## Installation instructions 
The installation instructions are split between first run and consequitve runs. Additionally, the instructions are given to reproduce the
documentation example. Another instruction set is included to run the modified example.

### first run
0. First download this repository and set up its environment
Used to be from nucypher: `git clone https://github.com/nucypher/nucypher.git` but now it is 
```
git clone https://github.com/v-bosch/TruCol
cd nucypher
```
Then set up the virtual environment:
```
python -m venv nucypher-venv
source nucypher-venv/bin/activate
cd nucypher
pip install -e .
```
1. Then ensure a folder exists, in preparation of the next step.
```
mkdir ~/.cache/nucypher
```
2. Then open a terminal and browse to the `root directroy of this repository/nucypher`.
3. In that terminal, rup a group of NuCypher oracles called Urselas:
```
python examples/run_demo_ursula_fleet.py
```
4. Open a new terminal and browse to the `root dir of this git/nucypher`, and (optionally download an example text with this script:)
```
./examples/finnegans_wake_demo/download_finnegans_wake.sh
```
5. activate the previously created environment for nucypher:
```
source nucypher-venv/bin/activate
```
6. Run the example over a live network:
```
python examples/finnegans_wake_demo/finnegans-wake-demo.py
```

### Consequtive runs
Do steps 4 to 6 to reproduce the results after the inital first run.

### Modified run
First do steps 0 to 3, and 5 once (to setup NuCypher). 
4. Create a custom secret and store it locally in a text file:
```
echo "Some secret text." > personal_secret_text_file.txt 
```
5. Modify the NuCypher python code in line 37-ish of `finnegans-wake-demo_mod.py` to read out the personal secret, to:
```
BOOK_PATH = os.path.join('.', 'personal_secret_text_file.txt')
```
6. Let Alice set the policies upload the secret etc. (run script) with:
```
python examples/finnegans_wake_demo/finnegans-wake-demo_mod.py
```

## Set Policy with Bob as smart contract
To ensure sponsor smart contract Bob, and Bob alone is able to retrieve the secret from the Ursela oracles of NuCypher, the policy that is set by Alice needs to be modified w.r.t. the given finnegans-wake-demo. Below are the steps described to do so.


## Let smart contract Bob get the secret input
After the sponsor smart contract Bob has been given access by the sponsor(Alice), the sponsor smart contract Bob should retrieve the secret. Below are the steps described to do so.
