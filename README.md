<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>rlogin-sample-apps</code></h3>
<p align="middle">
  Sample Apps for rLogin
</p>

Examples on how to use [rLogin](https://github.com/rsksmart/rlogin) in an application.

- [basic-dapp](/rsksmart/rlogin-sample-apps/tree/main/basic-dapp) (at https://basic-sample.rlogin.identity.rifos.org/) - A basic application that interacts with the user's wallet. It has the following features:
  - Connecting to rLogin and returning a web3 provider and disconnect function.
  - Getting the account and chainId
  - Signing data using `personal_sign`
  - Sending transactions
- [permissioned app](/rsksmart/rlogin-sample-apps/tree/main/permissioned-app) (at https://data-vault-sample.rlogin.identity.rifos.org/) - A backend server application that requests a credential and declarative details from the user and a frontend for the user to interact with.
  - It connects to the user's DataVault, retrieves an Email Credential and the name declarative details. [See the readme](https://github.com/rsksmart/rlogin-sample-apps/tree/main/permissioned-app) for instructions on setting these.
