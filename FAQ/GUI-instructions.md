# Trucol GUI Instructions
To host the website(locally, or in the cloud), one could use the following instructions. This can be done by first installing docker, the node package manager (npm) and vs code and then running `npm start`. Detailed instructions are specified below.

## Install docker
Linux [detailed instructions](https://docs.docker.com/engine/install/ubuntu/):
1. Remove old versions:
```
sudo apt-get remove docker docker-engine docker.io containerd runc
```
2. Update 
```
sudo apt-get update
```
3. Install docker
```
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```
4. Get GPG key:
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
5. Verify fingerprint
```
sudo apt-key fingerprint 0EBFCD88
```
6. Install repository
```
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```
7. Install docker
```
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```
8. If docker hello doesnt work (cause no access) ([detailed instructions](https://docs.docker.com/engine/install/linux-postinstall/):
```
sudo groupadd docker
sudo usermod -aG docker $USER
```
9. Log out (and/or reboot).
10. Login and run:
```
docker run hello-world
```


## Install VScode and Run Project
1. To start developing, simply open VS code, 
2. Install the 'Remote - containers' extension (Linux:`Ctrl+Shift+X`). 
3. Open the project (`File>Open Folder>Browse to this directory` and select the root directory named `TruCol`).
4. After you open the project, there should be a popup prompting to reopen in container. If not, press (Ctrl+Shift+P and type+select: 1Reopen in Container`).
5. Next, wait until it is loaded (can take some minutes as it needs to download some things), and run:
```
npm start
```
6. That should be it, the gui/website should now be visible at https://localhost:3000

