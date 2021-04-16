const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const compiled = require('../compile');

const web3 = new Web3(ganache.provider());

let lottery;
let accounts;

console.log(compiled['abi']);

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(compiled['abi'])
        .deploy({ data: compiled.evm.bytecode.object })
        .send({from: accounts[0] , gas: '1000000'});
});

describe('Lottery Contract' , async () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.1', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.1', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.1', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[1], players[0]);
        assert.strictEqual(accounts[2], players[1]);
        assert.strictEqual(accounts[3], players[2]);
        assert.strictEqual(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0,
            });
            assert(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('only manager can call pickWinner' , async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch(err) {
            assert.ok(err);
        }
    });

    it('send money to winner and resets lottery' , async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2' , 'ether')
        });

        const initalBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initalBalance;
        console.log(difference);    
        assert(difference > web3.utils.toWei('1.8' , 'ether'));
    });
});