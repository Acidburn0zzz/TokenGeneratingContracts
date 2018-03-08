const generalSettings = require('../config/general-settings');
const addressConfig = require('../config/address-config');
const gasConfig = require('../config/gas-config');
const utils = require('../utils/utils');
const crowdsaleConfig = require('../config/crowdsale-config');

const web3 = utils.getWeb3(generalSettings.rpcHost);

// Instantiate crowdsale by crowdsale contract address
var CrowdsaleInstance = utils.getCrowdsaleContract(
  web3,
  addressConfig.crowdsaleAddress
);

const txHash = CrowdsaleInstance.setMinimumContribution(
  utils.convertEthToWei(crowdsaleConfig.minimumContribution),
  {
    from: addressConfig.ownerAddress,
    gas: gasConfig.methodGas,
  }
)

console.log(`txHash: ${txHash}`);
