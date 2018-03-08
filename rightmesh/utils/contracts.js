const fs = require("fs");

const getJson = file => {
  const contents = fs.readFileSync(file);
  return JSON.parse(contents);
}

const crowdsaleJsonFile = '../build/contracts/MeshCrowdsale.json';
const tokenJsonFile = '../build/contracts/MeshToken.json';

const getCrowdsaleABI = () => {
  return getJson(crowdsaleJsonFile).abi;
}

const getCrowdsaleBytecode = () => {
  return getJson(crowdsaleJsonFile).bytecode;
}


const getTokenABI = () => {
  return getJson(tokenJsonFile).abi;
}

const getTokenBytecode= () => {
  return getJson(tokenJsonFile).bytecode;
}


module.exports = {
  getCrowdsaleABI,
  getCrowdsaleBytecode,
  getTokenABI,
  getTokenBytecode,
}
