var CONTRACT_ADDRESS = "0xd5C99E22bEa16c1D4e897945658df7E76C427fD8";

var caver;
var currentWallet;

async function connectWallet() {
    let accounts = await window.klaytn.enable();
    currentWallet = accounts[0];
    $('#walletAddress').html(currentWallet);
    getScope2ReportForLast6Months();
}

async function upsertReport() {

    caver = new Caver(window.klaytn);

    let contract = new caver.klay.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    let currentYear = parseInt(getCurrentYear());
    let scopeId = parseInt($('#modalScopeId').html());
    let scopeType = parseInt($('#modalScopeType').html());
    let month = parseInt($('#modalMonthId').html());
    let emissionFactor = $('#emissionFactor').html();

    let activityInput = $('#activityInput').val();
    let activityOffsetInput = $('#activityOffsetInput').val();
    
    if(activityInput == "") {
        activityInput = 0;
    }
    if(activityOffsetInput == "") {
        activityOffsetInput = 0;
    }

    activityInput = parseFloat(activityInput) * parseFloat(emissionFactor);
    activityOffsetInput = parseFloat(activityOffsetInput) * parseFloat(emissionFactor);

    activityInput = parseInt(activityInput);
    activityOffsetInput = parseInt(activityOffsetInput);

    let txn = await contract.methods.upsertReport(currentYear, scopeId, scopeType, month, activityInput, activityOffsetInput)
        .send({ from : currentWallet, gas: 15000000 });
    
    $('#modalTxnHash').html(`<a target="_blank" href="https://baobab.klaytnfinder.io/tx/${txn.transactionHash}">Transaction Hash : ${txn.transactionHash}</a>`);
    

    getScope2ReportForLast6Months();
}

async function getScope2ReportForLast6Months() {
    let contract = new caver.klay.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    let currentYear = parseInt(getCurrentYear());
    let scopeId = parseInt($('#modalScopeId').html() ? $('#modalScopeId').html(): 2);
    let scopeType = parseInt($('#modalScopeType').html() ? $('#modalScopeType').html(): 3);

    let key = currentYear+"_"+scopeId+"_"+scopeType;
    
    let offsets = 0;
    let total = 0;

    let chartData = [0, 0, 0, 0, 0, 0];
    for(let i=7; i<=12; i++) {
        const response = await contract.methods.monthlyEmissions(key, i).call();
        total += response.emissionData/1000;
        offsets += response.emissionOffsetData/1000;
        if(response.emissionData != 0) {
            emissionData[scopeType-1].months[i] = response.emissionData/1000;
        }
        let netEmission = (response.emissionData - response.emissionOffsetData)/1000;
        chartData.push(netEmission);
    }
    emissionData[scopeType-1].total = parseFloat(total).toFixed(2);
    emissionData[scopeType-1].offsets = parseFloat(offsets).toFixed(2);
    emissionData[scopeType-1].net = parseFloat(total-offsets).toFixed(2);

	$('#totalEmissions').html(emissionData[scopeType-1].total)
	$('#netEmissions').html(emissionData[scopeType-1].net)
    
    renderEmissionData();
    renderChart(chartData);
}

var CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "monthlyEmissions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "emissionData",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "emissionOffsetData",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "year",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "scopeId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "scopeType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "month",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "emissionData",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "emissionOffsetData",
				"type": "uint256"
			}
		],
		"name": "upsertReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];