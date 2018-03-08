module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 3, // Ropsten network id
      from: "0xa30109d16db929bb45e08db7127d92a5f5114472", //account for deoployment
      gas: 4000000
    }   
  }
};
