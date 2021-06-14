<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>rlogin-sample-apps</code></h3>
<p align="middle">
  Permissioned Application
</p>

This application asks the user for a Name declarative detial and an Email Credential from their DataVault before signing in. After signing in, the DataVault is available and the user can read data. 

To get the email credential, use the [Email VC Issuer](https://rsksmart.github.io/email-vc-issuer/). To set your name, log on to the [RIF Identity Manager](https://rsksmart.github.io/rif-identity-manager/), click on the pencil icon at the top and set the "Name" field.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and adds the following dependecies to implement rLogin and WalletConnect

  - [rLogin](https://github.com/rsksmart/rlogin)
  - [WalletConnect Web3 Provider](https://github.com/WalletConnect/walletconnect-monorepo/tree/next/packages/providers/web3-provider) - Used for WalletConnect. This is optional if you don't wish to support WalletConnect.
  - [ethjs-query](https://github.com/ethjs/ethjs-query) - Used to query the Ethereum RPC layer. However, you could also use ether.js, or web3.js, if you'd prefer.

## Install:

Installs the backend dependecies and then the React frontent dependecies.

```
yarn setup
```

## Backend (server) Available Scripts

In the `backend` directory, you can run:

### `node index.js`

Starts the server used to authenticate or signup users.

## Front End Available Scripts

In the `frontend-app` directory, you can run:

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

### `yarn cypress`

This repo uses cypress for e2e testing with a mock provider located here `/cypress/fixtures/MockProvider.js`. To run the test suite, first start an instance of the sample app at localhost:3000 with `yarn start`. Then in a different window, run `yarn cypress`.

### Run backend with Docker

```
docker build -t rlogin-sample-back .
docker run -dp 3007:3007 rlogin-sample-back
```
