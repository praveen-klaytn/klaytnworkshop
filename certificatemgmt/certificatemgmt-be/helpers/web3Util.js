const Web3 = require('web3');
const RPC_URL = process.env.RPC_URL || "https://api.baobab.klaytn.net:8651";
const provider = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const CONTRACT_ABI = [{"inputs":[{"internalType":"string","name":"certifiedTo","type":"string"},{"internalType":"string","name":"rollNumber","type":"string"},{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"string","name":"certifiedBy","type":"string"},{"internalType":"string","name":"certificateHash","type":"string"},{"internalType":"bool","name":"isValid","type":"bool"}],"name":"registerCertificate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"certificateHash","type":"string"}],"name":"verifyCertificate","outputs":[{"internalType":"string","name":"certifiedTo","type":"string"},{"internalType":"string","name":"rollNumber","type":"string"},{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"string","name":"certifiedBy","type":"string"},{"internalType":"bool","name":"isValid","type":"bool"}],"stateMutability":"view","type":"function"}];
const GAS_LIMIT = 750000;

const service = {};

service.registerCertificate = async (certifiedTo, rollNumber, score, certifiedBy, certificateHash, isValid) => {
    console.log(process.env.ADMIN_PRIVATE_KEY);
    // registers by Admin
    const account = provider.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
    provider.eth.accounts.wallet.add(account);
    provider.eth.defaultAccount = account.address;

    const contract = new provider.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS)
    let gasPrice = await provider.eth.getGasPrice();
    console.log(certifiedTo, rollNumber, parseInt(score),  certifiedBy, certificateHash, isValid)
    console.log(account.address)
    let gasAmount = await contract.methods
        .registerCertificate(certifiedTo, rollNumber, parseInt(score), certifiedBy, certificateHash, isValid)
        .estimateGas({ from: account.address, gas: GAS_LIMIT })
    console.log(gasAmount);
    
    let tx = await contract.methods
        .registerCertificate(certifiedTo, rollNumber, parseInt(score),  certifiedBy, certificateHash, isValid)
        .send({ from: account.address, gas: gasAmount, gasPrice: gasPrice })
    console.log(tx)
    return tx.transactionHash;

}

service.verifyCertificate = async (certificateHash) => {
    // can call by any one
    const account = provider.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
    provider.eth.accounts.wallet.add(account);
    provider.eth.defaultAccount = account.address;

    const contract = new provider.eth.Contract(CONTRACT_ABI, process.env.CONTRACT_ADDRESS)
    // let gasPrice = await provider.eth.getGasPrice();
    let eventData = await contract.methods
        .verifyCertificate(certificateHash)
        .call({ from: account.address });
    return eventData;
}

module.exports = service;