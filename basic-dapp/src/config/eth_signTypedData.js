const domain = {
  name: 'BasicDapp',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

const types = {
  "EIP712Domain": [
    {
      "name": "name",
      "type": "string"
    },
    {
      "name": "version",
      "type": "string"
    },
    {
      "name": "chainId",
      "type": "uint256"
    },
    {
      "name": "verifyingContract",
      "type": "address"
    }
  ],
  "Person": [
    {
      "name": "name",
      "type": "string"
    },
    {
      "name": "wallet",
      "type": "address"
    }
  ],
  "Mail": [
    {
      "name": "from",
      "type": "Person"
    },
    {
      "name": "to",
      "type": "Person"
    },
    {
      "name": "contents",
      "type": "string"
    }
  ]
};

const value = {
  from: {
    name: 'Alice',
    wallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  },
  to: {
    name: 'Bob',
    wallet: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
  },
  contents: 'Hello, Bob!'
};

export const eth_signTypedData = { domain, message: value, types, primaryType: "Mail" };
