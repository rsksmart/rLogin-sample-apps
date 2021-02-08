import React, { useState } from 'react'
import RLogin from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Eth from 'ethjs-query'
import './App.css';

// Create a new rLogin instance with your custom providerOptions outside of the 
// component.
const rLogin = new RLogin({
  cacheProvider: true,
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
  supportedChains: [30, 31]
})

const App = () => {
  const [web3Provider, setWeb3Provider] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // wallet info:
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)

  const handleLogin = () => {
    console.log('loggin in!')
    rLogin.connect()
      .then(provider => {
        // Use ethQuery to get the user's account and the chainId
        const ethQuery = new Eth(provider)
        ethQuery.accounts().then(accounts => setAccount(accounts[0]))
        ethQuery.net_version().then(id => setChainId(id))

        // listen to change events and log out if any of them happen
        provider.on('accountsChanged', () => handleLogOut(provider))
        provider.on('chainChanged', () => handleLogOut(provider))
        provider.on('disconnect', () => handleLogOut(provider))

        //finally, set web3Provider with useState
        setWeb3Provider(provider)
      })
      .catch(err => setErrorMessage(err.message || 'Unknown Error'))
  }

  // handle logging out
  const handleLogOut = (provider) => {
    // if WalletConnect
    if (provider.wc) {
      // Send the disconnect() function to the wallet to close the connection, and 
      // remove the localStorage item 'walletconnect' that it saved:
      provider.disconnect()
    }

    // clear the cachedProvider from localStorage    
    rLogin.clearCachedProvider()

    // remove EIP 1193 listeners
    provider.removeAllListeners()

    setWeb3Provider(null)

    // reset the useState responses (sample app specific):
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
        <button onClick={handleLogin} disabled={web3Provider}>Login!</button>
        <button onClick={() => handleLogOut(web3Provider)} disabled={!web3Provider}>Logout</button>
        <div className="response">
          {web3Provider && <>Connected</>}
          {errorMessage && errorMessage}
        </div>
      </section>

      {web3Provider && (
        <div className="loggedIn">
          <section id="usersInfo">
            <h2>Wallet:</h2>
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
