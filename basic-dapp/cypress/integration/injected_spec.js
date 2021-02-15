describe('dappeteer', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      /*
      console.log('hello window!', win)
      Object.defineProperty(win, 'ethereum', {
        get: () => {
          isMetaMask: true
        },
        isMetaMask: true
      })
      */
     
      const currentProvider = {
        isMetaMask: true,
        networkVersion: "30",
        chainId: "0x1e",
        selectedAddress: "0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9",
        // getAccounts: function() { return Promise.resolve([ this.selectedAddress ]) },
        request: function(props) {
          switch(props.method) {
            case 'eth_requestAccounts': return this
            case 'eth_accounts': return Promise.resolve([ this.selectedAddress ]);
            case 'eth_chainId': return this.chainId
            default: console.log('resquesting missing method', props.method)
          }
        },
        on: function(props) {
          console.log('registering event:', props)
        },
        rpcRequest: function(props) {
          console.log('rpcRequest', props)
        }
      }

      win.ethereum = currentProvider

      // win.ethereum = {
        /*
      win.web3 = {
        currentProvider: {
          getAccounts: () => Promise.resolve(['0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9']),
          isMetaMask: true,
          networkVersion: "30",
          chainId: "0x1e",
          handleConnect: () => {
            console.log('connecting')
            return this;
          },
          request: (props) => {
            console.log('requesting', props)
            switch(props.method) {
              case 'eth_accounts': {
                console.log('hello', this)
                this.getAccounts().then(accounts => {
                  console.log('wait', accounts)
                  return accounts
                })
              }
              case 'eth_chainId': return this.chainId
            }
          },
          on: (props) => {
            console.log('on', props)
          }
        }
      }
      */
    })
  })

  it('shows MetaMask', () => {

    cy.visit('/')
    cy.contains('Connect with rLogin').click()
    cy.contains('MetaMask').click()
    cy.get('.response').should('have.text', 'Connected')

  })
})
