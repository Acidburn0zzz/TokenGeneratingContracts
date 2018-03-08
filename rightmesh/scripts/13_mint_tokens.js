const generalSettings = require('../config/general-settings');
const addressConfig = require('../config/address-config');
const mintingConfig = require('../config/minting-config');
const gasConfig = require('../config/gas-config');
const utils = require('../utils/utils');

const web3 = utils.getWeb3(generalSettings.rpcHost);

// Instantiate token by token contract address
var TokenInstance = utils.getTokenContract(
  web3,
  addressConfig.tokenAddress
);

mintingConfig.forEach(m => {
  const address = m.address;
  const tokenAmountWei = utils.convertEthToWei(m.tokenAmountETH);
  const txHash = TokenInstance.mint(
    address,
    tokenAmountWei,
    {
      from: addressConfig.ownerAddress,
      gas: gasConfig.methodGas,
    }
  );
  console.log(`${tokenAmountWei} tokens minted for ${address} in ${txHash}`)
});
