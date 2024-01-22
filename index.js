const { Web3 } = require('web3');
const { axios } = require('axios');
require('./ethers.json');

const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("ethers.json"));

connect().then();

async function connect() {
    const httpProvider = new Web3.providers.HttpProvider('https://nd-014-886-824.p2pify.com/a627fab254b9e6ff07ace7b3bc4b32a0');
    const web3 = new Web3(httpProvider);

    const contract = new web3.eth.Contract(abi, bytecode);

    const account = '0xCa6d23eCf3034042c19F38f535cEE539BB258AB3';
    const privateKey = '23574c261b93f1686753e5905c1e606aaac4f00c6a21ee42dde5e486bf311e22';
    const stringToSave = 'Hello, World!';

    const saveStringTx = contract.methods.saveString(stringToSave);

    const encodedABI = saveStringTx.encodeABI();

    const transactionObject = {
        from: account,
        to: bytecode,
        value: '0',
        gasPrice: '100000000000',
        data: encodedABI,
    };
    transactionObject.gas = await web3.eth.estimateGas(transactionObject);

    web3.eth.accounts.signTransaction(transactionObject, privateKey)
        .then(signedTx => {
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        })
        .then(receipt => {
            console.log('Transaction receipt:', receipt);
        })
        .catch(error => {
            console.error('Error sending transaction:', error);
        });

    web3.eth.getNodeInfo()
        .then(console.log)
        .catch(console.error);

    contract.methods
        .getString()
        .call()
        .then(result => {
            console.log('Result of yourReadFunction:', result);
        })
        .catch(error => {
            console.error('Error calling yourReadFunction:', error);
        });
}
