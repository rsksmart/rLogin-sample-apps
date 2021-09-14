const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const didAuth = require('@rsksmart/express-did-auth')
const { SimpleSigner } = require('did-jwt')

// This private key must not be used in production. This is just a sample application.
// Never use harcoded private keys in your project.
const privateKey = '72e7d4571572838d3e0fe7ab18ea84d183beaf3f92d6c8add8193b53c1a542a2'
const serviceDid = 'did:ethr:rsk:0x45eDF63532b4dD5ee131e0530e9FB12f7DA1915c'
const serviceSigner = SimpleSigner(privateKey)
const challengeSecret = 'secret-pass'
const serviceUrl = 'https://data-vault-sample-backend.rlogin.identity.rifos.org'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/__health', (req, res) => {
  res.status(200).end('OK')
})

// We expect to have a name and an email credential here. You could also 
// check the DID matches a list or DIDs if this was signingIn.
const signupBusinessLogic = (payload) => {
  console.log(payload);

  if (!payload.sd.credentials.Email) { throw new Error('The Email is required.') }
  if (!payload.sd.claims.Name) { throw new Error('The Name is required.') }

  // return true is an email credential and name declarative detail is provided
  return true
}

const authMiddleware = didAuth.default({
  serviceDid,
  serviceSigner,
  serviceUrl,
  challengeSecret,
  requiredCredentials: ['Email'],
  requiredClaims: ['Name'],
  signupBusinessLogic
})(app)

app.use(authMiddleware)

const port = 3007

app.listen(port, () => console.log(`Backend started at http://localhost:${port}`))
