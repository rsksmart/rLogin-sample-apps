describe('dappeteer', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {

      const currentProvider = {
        isMetaMask: true,
        networkVersion: "30",
        chainId: "0x1e",
        selectedAddress: "0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9",

        request: function(props, cb) {
          switch(props.method) {
            case 'eth_accounts': return true
            case 'net_version': return true
            default: console.log('resquesting missing method', props.method)
          }
        },

        sendAsync: function(props, cb) {
          switch(props.method) {
            case 'eth_accounts':
              cb(null, { result: [ this.selectedAddress ] })
              break;
            case 'net_version': cb(null, { result: [ this.networkVersion ]})
              break;
            default: throw new(`Method '${props.method}' is not supported yet.`)
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
    })
  })

  it('shows MetaMask', () => {

    cy.visit('/')
    cy.contains('Connect with rLogin').click()
    cy.contains('MetaMask').click()
    cy.get('.response').should('have.text', 'Connected')

    // address:
    cy.get('li.address').should('have.text', 'Address: 0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9')
    cy.get('li.chainId').should('have.text', 'ChainId: 30')
  })
})
