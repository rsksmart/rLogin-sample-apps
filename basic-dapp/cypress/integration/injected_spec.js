import { MockProvider } from '@rsksmart/mock-web3-provider'

describe('basic app e2e testing', () => {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      win.ethereum = new MockProvider({
        address,
        privateKey,
        networkVersion: 31,
        debug: true
      })
    })

    cy.visit('/')
    cy.contains('Connect with rLogin').click()
    cy.contains('MetaMask').click()
    cy.contains('Confirm').click()
  })

  it('shows MetaMask with address and chainId', () => {
    cy.get('.response').should('have.text', 'Connected')

    cy.get('li.address').should('have.text', `Address: ${address}`)
    cy.get('li.chainId').should('have.text', 'ChainId: 31')
  })

  it('signs messages', () => {
    const personalSignResponse = '0xbb14d14dba17f231efd1680c3e150a175ba894183ef6019f4a3100fe0d17938246fcc5656a8fa76ed11c00ffd6944ed08bca23880e39a1a384d3a33e04aaf38e1c'
    cy.get('button.sign').click()
    cy.get('#signData .response').should('have.text', personalSignResponse)

    cy.get('button.signWeb3').click()
    cy.get('#signData .response').should('have.text', personalSignResponse)

    cy.get('button.signEthers').click()
    cy.get('#signData .response').should('have.text', personalSignResponse)
  })

  it('trys to send a transaction', () => {
    cy.get('#sendToInput').type(address)
    cy.get('button.send').click()
    cy.get('#sendTrancation .response').should('have.text', '[ERROR]: This service can not send transactions.')
  })

  it('signs out', () => {
    cy.get('#logout').click()
    cy.get('#login .response').should('have.text', 'Logged Out')
  })
})
