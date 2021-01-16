# Travel-Trustpay

This is an escrow like service for the travel industry. When customers deposit money, the equivalent amount is minted in Flight Tokens.

Each Flight Token represent $1 AUD so that amoount of ETH is then sent to the smart contract to be stored.

The customer can then redeem and withdraw their money if they change their mind within the deadline times.

# How to set up

Clone this repo and then type npm install in your CLI to install the dependancies.

Next, you'll need to set up the environmental variables and your secret in .secret and .env

Copy and paste your Metamask wallet seed phrase in .secret

In your .env, it should look like this:
INFURA_URL=https://rinkeby.infura.io/v3/YOUR_KEY
INFURA_SECRET=YOUR SECRET

The contracts are deployed on the Rinkeby Network.

In Truffle config, set up rinkeby configuration under the "networks object"

rinkeby: {
provider: () => new HDWalletProvider(mnemonic, process.env.INFURA_URL),
network_id: 4, // Rinkeby's id
gas: 3100000,  
 confirmations: 2, // # of confs to wait between deployments. (default: 0)
timeoutBlocks: 200, // # of blocks before a deployment times out (minimum/default: 50)
skipDryRun: true // Skip dry run before migrations? (default: false for public nets )
},

# Spin Up Local Server

Once dependencies are installed, typed npm start in CLI to run a local web server. You should be able to interact with the smart contract..
