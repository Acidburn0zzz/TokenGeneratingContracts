const Web3 = require('web3');
const fs = require("fs");
const config = require('../config/general-settings');

const getWeb3 = rpcHost => new Web3(new Web3.providers.HttpProvider(rpcHost));
const web3 = getWeb3(config.rpcHost);

const convertEthToWei = n => new web3.BigNumber(web3.toWei(n, 'ether'));

const latestTime = () => {
  // truffle version 4.0.x still depends on web3 version 0.2x.x
  // please refer to https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetblock
  // for web 3 documentation
  return web3.eth.getBlock('latest').timestamp;
}

const duration = {
  seconds: val => val,
  minutes: val => val * duration.seconds(60),
  hours: val => val * duration.minutes(60),
  days: val => val * duration.hours(24),
  weeks: val => val * duration.days(7),
  years: val => val * duration.days(365),
};

const getJson = file => {
  const contents = fs.readFileSync(file);
  return JSON.parse(contents);
}

const crowdsaleJsonFile = '../build/contracts/MeshCrowdsale.json';
const tokenJsonFile = '../build/contracts/MeshToken.json';
const timelockJsonFile = '../build/contracts/Timelock.json';

const getCrowdsaleContract = (_web3, contractAddress) => {
  const jsonContent = getJson(crowdsaleJsonFile);
  const Crowdsale = _web3.eth.contract(jsonContent.abi);
  return Crowdsale.at(contractAddress);
}

const getTokenContract = (_web3, contractAddress) => {
  const jsonContent = getJson(tokenJsonFile);
  const Token = _web3.eth.contract(jsonContent.abi);
  return Token.at(contractAddress);
}

const getTimelockContract = (_web3, contractAddress) => {
  const jsonContent = getJson(timelockJsonFile);
  const Timelock = _web3.eth.contract(jsonContent.abi);
  return Timelock.at(contractAddress);
}

module.exports = {
  convertEthToWei,
  latestTime,
  duration,
  getWeb3,
  getCrowdsaleContract,
  getTokenContract,
  getTimelockContract,
}
