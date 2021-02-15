import React, { useState } from 'react'
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
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

function App() {
  const [rLoginResponse, setRLoginResponse] = useState(null)

  // wallet info:
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [connectResponse, setConnectResponse] = useState(null)

  // signing data:
  const [signDataInput, setSignDataInput] = useState('hello world!')
  const [signDataResponse, setSignDataResponse] = useState(null)

  // sending transactions:
  const [sendToInput, setSendToInput] = useState('')
  const [sendAmount, setSendAmount] = useState('100000')
  const [sendResponse, setSendResponse] = useState(null)

  // Use the rLogin instance to connect to the provider
  const handleLogin = () => {
    rLogin.connect()
      .then(response => {
        // set a local variable for the response:
        const provider = response.provider

        setConnectResponse('Connected')

        // Use ethQuery to get the user's account and the chainId
        const ethQuery = new Eth(provider)
        ethQuery.accounts().then(accounts => setAccount(accounts[0]))
        ethQuery.net_version().then(id => setChainId(id))

        // Listen to the events emitted by the wallet. If changing account, remove the listeners
        // below and connect again. If disconnect or change chains, then logout.
        provider.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            return handleLogOut(response)
          }
          provider.removeAllListeners()
          handleLogin()
        })
        provider.on('chainChanged', () => handleLogOut(response))
        provider.on('disconnect', () => handleLogOut(response))

        // finally, set the provider in local state to be used for signing and sending transactions
        setRLoginResponse(response)
      })
      // catch an error and if there is a message display it. Closing WalletConnect without a
      // connection will throw an error with no response, which is why we check:
      .catch(error => console.log('the error:', error))
      // .catch(err => err && err.message && setConnectResponse(`[ERROR]: ${err.message}`))
  }

  // Nifty Wallet handles requests to the provider differently than MetaMask & WalletConnect
  const providerRPC = (provider, args) => 
    provider.isNiftyWallet
      ? provider.send(args.method, args.params)   // for Nifty Wallet
      : provider.request(args)                    // for all others

  // Sign data
  const handleSignData = (value) => {
    setSignDataResponse('loading...')

    providerRPC(
      rLoginResponse.provider,
      {
        method: 'personal_sign',
        params: [ value, account ]
      }
    )
    .then(response => setSignDataResponse(response))
    .catch(error => setSignDataResponse(`[ERROR]: ${error.message}`))
  }

  // Send transaction
  const handleSendTransaction = (to, value) => {
    setSendResponse('loading...')

    providerRPC(
      rLoginResponse.provider,
      {
        method: 'eth_sendTransaction',
        params: [{ from: account, to, value }]
      }
    )
    .then(response => setSendResponse(response))
    .catch(error => setSendResponse(`[ERROR]: ${error.message}`))
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
    setConnectResponse(null)
    setSignDataResponse(null)
    setSendResponse(null)
  }

  return (
    <div className="App">
      <header className="App-header">
        rLogin Sample App - Basic dApp 
      </header>

      <section id="login">
        <h2>Start here</h2>
        <p>
          <RLoginButton onClick={handleLogin} disabled={rLoginResponse}>Connect with rLogin</RLoginButton>
          <button onClick={() => handleLogOut(rLoginResponse)} disabled={!rLoginResponse}>Logout</button>
        </p>
        <div className="response">{connectResponse}</div>
      </section>

      {rLoginResponse && (
        <div className="loggedIn">
          <section id="usersInfo">
            <h2>Wallet:</h2>
            <ul>
              {account && <li className="address"><strong>Address: </strong>{account}</li>}
              {chainId && <li className="chainId"><strong>ChainId: </strong>{chainId}</li>}
            </ul>
          </section>
          
          <section id="signData">
            <h2>Sign Data with personal_sign</h2>
            <p>
              <label htmlFor="dataInput">Value: </label>
              <input name="dataInput" type="text" value={signDataInput} onChange={evt => setSignDataInput(evt.target.value)} />
              <button className="sign" onClick={() => handleSignData(signDataInput)}>Sign Data</button>
            </p>
            
            <p>Signed Data Response:</p>
            <div className="response">{signDataResponse}</div>
          </section>

          <section id="sendTrancation">
            <h2>Send Transaction</h2>
            <p>
              <label htmlFor="sendToInput">Send to: </label>
              <input id="sendToInput" name="sendToInput" type="text" value={sendToInput} onChange={evt => setSendToInput(evt.target.value)} />
            </p>
            <p>
              <label htmlFor="sendAmount">Amount: </label>
              <input name="sendAmount" type="number" value={sendAmount} onChange={evt => setSendAmount(evt.target.value)} />
            </p>
            <p><button className="send" onClick={() => handleSendTransaction(sendToInput, sendAmount)}>Send Transaction</button></p>
            <p>Send Response:</p>
            <div className="response">{sendResponse}</div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
