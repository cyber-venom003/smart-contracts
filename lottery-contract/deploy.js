const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const compiled = require('./compile');

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: 'thunder speed female month engine cherry relief apart lab waste cargo pool'
    },
    providerOrUrl: "https://rinkeby.infura.io/v3/1eff4853260f466f8ba787eb62920d96"
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account ', accounts[0]);

    const deploymentResult = await new web3.eth.Contract(compiled['abi'])
            .deploy({ data: compiled.evm.bytecode.object, arguments: ['Inbox Contract deployed to Rinkeby Network!']})
            .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to ', deploymentResult.options.address);
}

deploy();   

//Above contract is already deployed at 0x66887a93eb0e3fcdff0272F21e26552b01AF50a4