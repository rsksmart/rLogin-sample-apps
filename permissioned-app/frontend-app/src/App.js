import React, { useState } from 'react'
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Portis from '@portis/web3'
import { trezorProviderOptions } from '@rsksmart/rlogin-trezor-provider'
import { ledgerProviderOptions } from '@rsksmart/rlogin-ledger-provider'
import Eth from 'ethjs-query'
import * as RIFDataVault from '@rsksmart/ipfs-cpinner-client'
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
    },
    portis: {
      package: Portis,
      options: {
        id: "a0f421c6-844b-4064-85be-3983ee0d1e65",
        network: {
          nodeUrl: 'https://public-node.testnet.rsk.co',
          chainId: 31,
        }
      }
    },
    'custom-ledger': {
      ...ledgerProviderOptions,
      options: {
        rpcUrl: 'https://public-node.testnet.rsk.co',
        chainId: 31,
        debug: true
      }
   },
   'custom-trezor': {
     ...trezorProviderOptions,
     options: {
       rpcUrl: 'https://public-node.testnet.rsk.co',
       chainId: 31,
       debug: true
     }
    }
  },
  supportedChains: [30, 31],
  backendUrl: 'https://data-vault-sample-backend.rlogin.identity.rifos.org',
  dataVaultOptions: {
    package: RIFDataVault,
    serviceUrl: 'https://data-vault.identity.rifos.org',
  }
})

const App = () => {
  // response from connecting to a provider with rLogin:
  const [rLoginResponse, setRLoginResponse] = useState(null)

  // wallet info:
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)

  // dataVault - simple storage for keys and content, and loading boolean
  const [dataVaultContent, setDataVaultContent] = useState([])
  const [dataVaultLoading, setDataVaultLoading] = useState(false)

  const handleLogin = () => {
    rLogin.connect()
      .then(response => {
        const provider = response.provider

        // Use ethQuery to get the user's account and the chainId
        const ethQuery = new Eth(provider)
        ethQuery.accounts().then(accounts => setAccount(accounts[0]))
        ethQuery.net_version().then(id => setChainId(id))

        // listen to change events and log out if any of them happen, passing
        // the rLogin response to the logout function as it has not been saved
        // into useState yet.
        provider.on('accountsChanged', () => handleLogOut(response))
        provider.on('chainChanged', () => handleLogOut(response))
        provider.on('disconnect', () => handleLogOut(response))

        // finally, set setRLoginResponse with useState
        // when the JS is compiled this variable is set after the promise is
        // resolved which is why it is at the very end.
        setRLoginResponse(response)
      })
      .catch(err => console.log('error!', err))
  }

  /**
   * Get the user's keys from the dataVault, then convert the array response
   * into a simple object of { key: 'TheKey', content: [] } to be used with
   * the getDataVaultContent method below
   */
  const getDataVaultKeys = () => {
    setDataVaultLoading(true)
    rLoginResponse.dataVault.getKeys()
      .then(keys => {
        let keyArray = []
        keys.map(key => keyArray.push({key, content: [] }))
        setDataVaultContent(keyArray)
      })
      .finally(() => setDataVaultLoading(false))
  }

  /**
   * Get DataVaultContent
   * Given a key, return the content that is saved under that key
   * @param {string} key
   */
  const getDataVaultContent = (key) => {
    setDataVaultLoading(true)
    rLoginResponse.dataVault.get({ key })
      .then(content => {
        const newContentState = dataVaultContent.map(item => item.key === key ? { key, content: content} : item)
        setDataVaultContent(newContentState)
      })
      .finally(() => setDataVaultLoading(false))
  }

  // handle logging out
  const handleLogOut = (response) => {
    // remove EIP 1193 listeners that were set above
    response.provider.removeAllListeners()

    // send the disconnect method
    response.disconnect()

    // reset the useState responses (sample app specific):
    setRLoginResponse(null)
    setAccount(null)
    setChainId(null)
    setDataVaultContent([])
  }

  return (
    <div className="App">
      <header className="App-header">
        rLogin Sample App - Permissioned App
      </header>

      <section id="connect">
        <h2>Start here!</h2>
        <p>This service requires a declarative detail "NAME" and an Email credential saved into your datavault. To get the email credential, use the <a href="https://rsksmart.github.io/email-vc-issuer" target="_blank" rel="noreferrer">Email VC Issuer</a>. To set your name, log on to the <a href="https://rsksmart.github.io/rif-identity-manager/" target="_blank" rel="noreferrer">RIF Identity Manager</a>, click on the pencil icon at the top and set the "Name" field.</p>
        <RLoginButton onClick={handleLogin} disabled={rLoginResponse}>Login with rLogin</RLoginButton>
        <button onClick={() => handleLogOut(rLoginResponse)} disabled={!rLoginResponse}>Logout</button>
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

          <section className="dataVault">
            <h2>DataVault</h2>
            <p>Since we connected to the DataVault when logging in, it is returned as a parameter in the rLogin response.</p>
            <button onClick={getDataVaultKeys} disabled={dataVaultContent.length !== 0}>Get DV keys</button>
            {dataVaultLoading && <p>Loading...</p>}

            <table>
              <thead>
                <tr>
                  <td width="25%">Key</td>
                  <td>Content</td>
                  <td width="25%">Actions</td>
                </tr>
              </thead>
              {dataVaultContent && dataVaultContent.map(dataVaultItem => (
                <tr key={dataVaultItem.key}>
                  <td>{dataVaultItem.key}</td>
                  <td>
                    {dataVaultItem.content.map(content => <p key={content.content}>{content.content}</p>)}
                  </td>
                  <td>
                    {dataVaultItem.content.length === 0 && (
                      <button
                        onClick={() => getDataVaultContent(dataVaultItem.key)}
                        disabled={dataVaultLoading}
                      >Get Content</button>
                    )}
                  </td>
                </tr>
              ))}
            </table>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
