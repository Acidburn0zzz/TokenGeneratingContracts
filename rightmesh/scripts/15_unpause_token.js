const generalSettings = require('../config/general-settings');
const addressConfig = require('../config/address-config');
const gasConfig = require('../config/gas-config');
const utils = require('../utils/utils');

const web3 = utils.getWeb3(generalSettings.rpcHost);

// Instantiate token by token contract address
var TokenInstance = utils.getTokenContract(
  web3,
  addressConfig.tokenAddress
);

// Call unpause on the token contract
const txHash = TokenInstance.unpause(
  {
    gas: gasConfig.methodGas,
    from: addressConfig.ownerAddress,
  }
);

console.log(`txHash: ${txHash}`);
