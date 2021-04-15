const solc = require('solc');
const fs = require('fs');
const path = require('path');

const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath , 'utf8');

var input = {
    language: 'Solidity',
    sources: {
      'Lottery.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts['Lottery.sol']['Lottery'];