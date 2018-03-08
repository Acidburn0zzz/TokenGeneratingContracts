const generalSettings = require('../config/general-settings');
const addressConfig = require('../config/address-config');
const whitelistConfig = require('../config/whitelist-config');
const gasConfig = require('../config/gas-config');

const utils = require('../utils/utils');

const web3 = utils.getWeb3(generalSettings.rpcHost);

// instantiate by address
var crowdsaleInstance = utils.getCrowdsaleContract(
  web3,
  addressConfig.crowdsaleAddress
);

const limit = web3.toWei( whitelistConfig.limitByEth, 'ether');

const count = Math.floor(whitelistConfig.accountsToWhitelist.length / whitelistConfig.batchSize);

for(var i = 0; i < count; i++) {
  var accounts = whitelistConfig.accountsToWhitelist.slice(
  					i * whitelistConfig.batchSize, 
					i * whitelistConfig.batchSize + whitelistConfig.batchSize);

  submitSetLimitTrans(accounts, limit);
  console.log("===============================================");
}

var accounts = whitelistConfig.accountsToWhitelist.slice(
				count * whitelistConfig.batchSize, 
				whitelistConfig.accountsToWhitelist.length);

submitSetLimitTrans(accounts, limit);

function submitSetLimitTrans(accounts, limit) {

  for (var i = 0, len =accounts.length; i < len; i++) {
    console.log(accounts[i]);
  }

  console.log("limit: " + limit);

  // white list a given accounts
  const txHash = crowdsaleInstance.setLimit(
    accounts,
    limit,
    {
      gas: gasConfig.methodGas,
      from: addressConfig.whitelistAgentAddress,
    }
  );
  
  console.log(`txHash: ${txHash}`);
}




