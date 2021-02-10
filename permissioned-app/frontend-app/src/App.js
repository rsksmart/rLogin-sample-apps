import React, { useState } from 'react'
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Eth from 'ethjs-query'
import './App.css';

// Create a new rLogin instance with your custom providerOptions outside of the 
// component.
const rLogin = new RLogin({
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          30: 'https://public-node.rsk.co',
          31: 'https://public-node.testnet.rsk.co',
        }
      }
    }
  },
  supportedChains: [30, 31],
  backendUrl: 'http://localhost:3007'
})

const App = () => {
  // response from connecting to a provider with rLogin:
  const [rLoginResponse, setRLoginResponse] = useState(null)

  // wallet info:
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)

  const handleLogin = () => {
    rLogin.connect()
      .then(response => {
        // set a local variable for the response:
        const provider = response.provider

        // Use ethQuery to get the user's account and the chainId
        const ethQuery = new Eth(provider)
        ethQuery.accounts().then(accounts => setAccount(accounts[0]))
        ethQuery.net_version().then(id => setChainId(id))

        // listen to change events and log out if any of them happen
        provider.on('accountsChanged', () => handleLogOut(provider))
        provider.on('chainChanged', () => handleLogOut(provider))
        provider.on('disconnect', () => handleLogOut(provider))

        //finally, set web3Provider with useState
        setRLoginResponse(response)
      })
      .catch(err => console.log('error!', err))
  }

  // handle logging out
  const handleLogOut = () => {
    // remove EIP 1193 listeners that were set above
    rLoginResponse.provider.removeAllListeners()

    // send the disconnect method
    rLoginResponse.disconnect()

    // reset the useState responses (sample app specific):
    setRLoginResponse(null)
    setAccount(null)
    setChainId(null)
  }

  return (
    <div className="App">
      <header className="App-header">
        rLogin Sample App - Permissioned App
      </header>

      <section id="connect">
        <h2>Start here!</h2>
        <p>@todo: tell user prereqs to signing in. Email Cred, and DD name!</p>
        <RLoginButton onClick={handleLogin} disabled={rLoginResponse}>Login with rLogin</RLoginButton>
        <button onClick={handleLogOut} disabled={!rLoginResponse}>Logout</button>
        <div className="response">
          {rLoginResponse && <>Connected</>}
        </div>
      </section>

      {rLoginResponse && (
        <div className="loggedIn">
          <section id="usersInfo">
            <h2>Welcome!</h2>
            <ul>
              {account && <li><strong>Address: </strong>{account}</li>}
              {chainId && <li><strong>ChainId: </strong>{chainId}</li>}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
