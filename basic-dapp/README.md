<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>rlogin-sample-apps</code></h3>
<p align="middle">
  Basic Decentralized Application
</p>

This sample React application shows the basic implementation of rLogin. It allows a user to sign in to your app using their browser wallet or WalletConnect. The web3 provider is saved in the state so the dapp can interact with it. Examples of this interaction are signing messsages using `personal_sign` and sending a transaction with `eth_sendTransaction`. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and adds the following dependecies to implement rLogin and WalletConnect

  - [rLogin](https://github.com/rsksmart/rlogin)
  - [WalletConnect Web3 Provider](https://github.com/WalletConnect/walletconnect-monorepo/tree/next/packages/providers/web3-provider) - Used for WalletConnect. This is optional if you don't wish to support WalletConnect.
  - [ethjs-query](https://github.com/ethjs/ethjs-query) - Used to query the Ethereum RPC layer. However, you could also use ether.js, or web3.js, if you'd prefer.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
