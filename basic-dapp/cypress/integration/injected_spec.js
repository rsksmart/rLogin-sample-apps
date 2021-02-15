import { currentProvider } from '../fixtures/MockProvider';

describe('dappeteer', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      win.ethereum = currentProvider('0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9', 30, true)
    })

    cy.visit('/')
    cy.contains('Connect with rLogin').click()
    cy.contains('MetaMask').click()
  })

  it('shows MetaMask with address and chainId', () => {
    cy.get('.response').should('have.text', 'Connected')

    cy.get('li.address').should('have.text', 'Address: 0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9')
    cy.get('li.chainId').should('have.text', 'ChainId: 30')
  })

  it('signs messages', () => {
    cy.get('button.sign').click()
    cy.get('#signData .response').should('have.text', '0xhehehehe')
  })

  it('trys to send a transaction', () => {
    cy.get('#sendToInput').type('0x332c22e9c7F02e092b18C6cc4D9Bfd46d36Dd7D9')
    cy.get('button.send').click()
    cy.get('#sendTrancation .response').should('have.text', '[ERROR]: This service can not send transactions.')
  })

  it('signs out', () => {
    cy.get('#logout').click()
    cy.get('#login .response').should('have.text', 'Logged Out')
  })
})
