import { currentProvider } from '../fixtures/MockMetamask';

describe('dappeteer', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {

      win.ethereum = currentProvider('0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9', 30)
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
