const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); 
const compiled = require('../compile');
const web3 = new Web3(ganache.provider());


let fetchedAccounts;
let inbox;

beforeEach( async () => {
    //Getting all ganache accounts
    fetchedAccounts = await web3.eth.getAccounts();
    
    inbox = await new web3.eth.Contract(compiled['abi'])
        .deploy({ data: compiled.evm.bytecode.object, arguments: ['Hello World!'] })
        .send({from: fetchedAccounts[0], gas: '1000000'});
});

describe('Inbox', () => {
    it('deploys a contract' , () => {
        //console.log(fetchedAccounts);
        console.log(inbox);
    });
});