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
    
    inbox = await new web3.eth.Contract(compiled['abi'])    //Teaches Web3 about what methods an Inbox contract has
        .deploy({ data: compiled.evm.bytecode.object, arguments: ['Hello World!'] })    //Tells web3 that we want to deploy a new copy of this contract
        .send({from: fetchedAccounts[0], gas: '1000000'});  //Instructs web3 to send out a transaction that creates this contract.
});

describe('Inbox', () => {
    it('deploys a contract' , () => {
        assert.ok(inbox.options.address);
    });

    it('has default message', async () => {
        message = await inbox.methods.message().call();
        assert.equal(message, 'Hello World!');
    });

    it('changes message', async () => {
        const transactionHash = await inbox.methods.setMessage('We\'re running on Ethereum Blockchain').send({from: fetchedAccounts[0]});
        message = await inbox.methods.message().call();
        assert.equal(message, 'We\'re running on Ethereum Blockchain');
    });
});