const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const compiledContractFile = path.resolve(__dirname, 'compiledContract.json');
const source = fs.readFileSync(inboxPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
      'Inbox.sol': {
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

// console.log(output.contracts['Inbox.sol']['Inbox'].abi);
//console.log(output.contracts['Inbox.sol']['Inbox'].evm.bytecode.object);
  
module.exports = output.contracts['Inbox.sol']['Inbox'];
