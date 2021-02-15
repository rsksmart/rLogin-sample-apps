export const currentProvider = (selectedAddress, networkVersion) => {
  
  const provider = {
    isMetaMask: true,
    networkVersion,
    chainId: `0x${((0xFF + networkVersion +1) & 0x0FF).toString(16)}`,
    selectedAddress,

    request: function(props, cb) {
      switch(props.method) {
        case 'eth_requestAccounts':
        case 'eth_accounts':
          return true
        case 'net_version':
        case 'eth_chainId':
          return true
        case 'personal_sign': {
          return Promise.resolve('0xhehehehe')
        }
        case 'eth_sendTransaction': {
          return Promise.reject(new Error('This service can not send transactions.'))
        }
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
        case 'personal_sign': {
          console.log('personal_signpersonal_signpersonal_signpersonal_signpersonal_sign')
        }
        default: console.log(`Method '${props.method}' is not supported yet.`)
      }
    },
    on: function(props) {
      console.log('registering event:', props)
    },
    rpcRequest: function(props) {
      console.log('rpcRequest', props)
    }
  }

  console.log('🦄 Provider ', provider)
  return provider;
}
