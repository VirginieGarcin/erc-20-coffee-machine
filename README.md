# ERC-20 Coffee Machine

This dApp is meant to illustrate the use
of an ERC-20 token, taking a real life
example of a token usage (a coffee machine).

We deploy create the contract, deploy it and
interact with it using a Web3 app.

We also listen to blockchain events.

## Demo

You can see a demo of the working project here:

<object width="425" height="350">
  <param name="movie" value="https://www.youtube.com/embed/Bxyrov0gTMg?si=CNZanRSg3sjKrBNocc_load_policy=1&cc_lang_pref=en" />
  <param name="wmode" value="transparent" />
  <embed src="https://www.youtube.com/embed/Bxyrov0gTMg?si=CNZanRSg3sjKrBNocc_load_policy=1&cc_lang_pref=en"
         type="application/x-shockwave-flash"
         wmode="transparent" width="425" height="350" />
</object>

## Installation

### Smart contract

There are 2 smarts contracts, in the `smart-contracts` folder:

- `CmtToken.sol`: Contract for the ERC-20 `CoffeeMachineToken`
- `CmtTokenSale.col`: Contract for buying Coffee Machine tokens

You can deploy those contrats youself (using Remix),
either on a testnet chain (like Sepolia),
or on a local HardHat chain.
Then you need to update the contact addresses
in `front/app/page.tsx`

```js
const tokenContractAddress = '0x...'
const saleContractAddress = '0x...'
```

Alternatively you can use the ones that are
already deployed on Sepolia network (already the case in the code).

#### Using HardHat

Installation:

```bash
mkdir hardhat 
cd hardhat
yarn init -y
yarn add --dev hardhat
yarn hardhat
```

Running:
`yarn hardhat node`

This will run your local testnet on ` http://localhost:8545`
with chain id `31337`. You can then import
this local network into metamask.

### Front

Once the contracts are deployed and their addresses
are updated, you can run the code of the front-end:

```bash
cd front
npm install
npm run dev
```

Then go to `http://localhost:3000` and start buying
token and using them to get coffees!

### Notes

This is a proof of concept, this is not meant
to be used in production.
Some important things (like the tests) are missing.
