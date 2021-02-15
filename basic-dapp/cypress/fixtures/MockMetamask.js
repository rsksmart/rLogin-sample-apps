export const currentProvider = (selectedAddress, networkVersion) => {
  
  const provider = {
    isMetaMask: true,
    networkVersion,
    chainId: `0x${((0xFF + networkVersion +1) & 0x0FF).toString(16)}`,
    selectedAddress,

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

  console.log('🦄 Provider ', provider)
  return provider;
}
