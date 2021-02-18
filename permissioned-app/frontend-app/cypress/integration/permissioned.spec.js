import { ECANCELED } from 'constants';
import currentProvider from 'jesse-mock-web3-provider'

describe('permissioned e2e testing', () => {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      win.ethereum = currentProvider({
        address,
        privateKey,
        chainId: 31,
        debug: true
      })
    })
  })

  it('login into the datavault', () => {
    cy.visit('/')
    cy.contains('Login with rLogin').click()
    cy.contains('MetaMask').click()

    cy.wait(10000)
    // cy.pause()
    cy.get('.rlogin-header2').should('have.text', 'Would you like to give usaccess to info in your data vault?')
    cy.contains('Access Data Vault').click()

    cy.wait(10000)
    cy.get('.rlogin-header2').should('have.text', 'Select information to share')
    cy.get('label').eq(0).should('have.text', 'CI Testing').click()
    cy.get('label').eq(1).should('have.text', 'Email address: jesse@iovlabs.org (Verifiable Credential)').click()

    cy.contains('Confirm').click()
    cy.get('.rlogin-header2').should('have.text', 'Use this Identity?')
    cy.get('.rlogin-paragraph').eq(0).should('have.text', `did:ethr:rsk:testnet:0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d`)
    cy.get('.rlogin-paragraph').eq(1).should('have.text', 'Name: CI Testing')
    cy.get('.rlogin-paragraph').eq(2).should('have.text', 'Email address: jesse@iovlabs.org')

    cy.contains('Confirm Identity').click()
    cy.get('.response').should('have.text', 'Connected')
  })
})
