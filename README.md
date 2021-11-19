# Chainlink Hackathon Scavenger Hunt

<br/>
<p align="center">
<a href="https://chain.link" target="_blank">
<img src="./img/LinkEgg%20NFTs/NFT-0.png" width="225" alt="LinkEgg 0">
<img src="./img/LinkEgg%20NFTs/NFT-1.png" width="225" alt="LinkEgg 1">
<img src="./img/LinkEgg%20NFTs/NFT-2.png" width="225" alt="LinkEgg 2">
<img src="./img/LinkEgg%20NFTs/NFT-3.png" width="225" alt="LinkEgg 3">
<img src="./img/LinkEgg%20NFTs/NFT-4.png" width="225" alt="LinkEgg 4">
</a>
</p>
<br/>

# About

`0xAc7E321ba4D4821Fa2259A166eF17044a7F2d521`


This repo is created for the Fall Chainlink Hackahton 2021. 

There are 5 NFTs to be won here. 

NFT 0: Can be won by calling `attemptPassword` with the correct password. It has been revealed already. 

NFT 1: Can be won by calling `attemptPassword` with the correct password. It has been revealed already. 

NFT 2: Can be won by calling `attemptPassword` with the correct password. The hint is on chain, and also here: "5468697320776173206465706c6f7965642073706f6f6b696c792e203078666264394437343334333735373836413839324241666431386532466330333445323346334432372e20"

NFT 3: Read the contract to learn how to win this NFT. 

NFT 4: Read the contract to learn how to win this NFT. 

# Quickstart
 ## Requirements

- [nodejs](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/) or [YARN](https://yarnpkg.com/)

## Installation

```sh
git clone https://github.com/PatrickAlphaC/decentralized-raffle.git
cd decentralized-raffle
yarn
```
### Deploy contracts

```sh
npx hardhat deploy
```

### Deploy and start a local node

```sh
npx hardhat node
```

### Deploy to Rinkeby

To deploy to a testnet or a live network, you need the following environment variables:

1. RINKEBY_RPC_URL=https://eth-rinkeby.alchemyapi.io/v2/<YOUR ALCHEMY KEY>
2. PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1

Your `RINKEBY_RPC_URL` is the URL of your blockchain node, for example, from [alchemy](https://www.alchemy.com/).

Your `PRIVATE_KEY` is the private key of your metamask or cryptowallet. Make sure it starts with `0x`. You might have to add `0x` if you're pulling the key from something like metamask. 

You can set them in a file named `.env`. You can follow the example of `.env.example` of what the contents of that file will look like. 

You'll also need testnet ETH and testnet LINK. You can [find both here.](https://faucets.chain.link/)

Once you do so, you can run:

```
npx hardhat deploy --network rinkeby
```

Then, attempt a password
``` 
npx hardhat run scripts/attemptPassword.ts --network rinkeby
```
