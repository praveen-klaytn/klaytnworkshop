// https://docs.klaytn.foundation/content/dapp/rpc-service/public-en

const RPC_URL = 'https://public-en-baobab.klaytn.net';
const CHAIN_ID = "1001"; 

function renderChart(scope2Data) {
    Highcharts.chart('chart1', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'MT CO2e',
            align: 'left'
        },
        xAxis: {
            categories: ["Jan '23", "Feb '23", "Mar '24", "Apr '23", "May '23", "Jun '23", "Jul '23", "Aug '23", "Sep '24", "Oct '23", "Nov '23", "Dec '23"]
        },
        yAxis: {
            stackLabels: {
                enabled: true,
                align: 'center'
            },
            allowDecimals: false,
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
                'Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Scope 3',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            stack: 'co2e',
            legendIndex: 3,
            color: 'orange'
        }, {
            name: 'Scope 2',
            data: scope2Data,
            stack: 'co2e',
            legendIndex: 2,
            color: 'red'
        },
        {
            name: 'Scope 1',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            stack: 'co2e',
            legendIndex: 1,
            color: 'purple'
        }]
    });
}


function getCurrentYear() {
    return new Date().getFullYear();
}

var currentYear = getCurrentYear();

var years = [];
for(let i=0; i< 20; i++) {
    years.push(2030-i);
}

window.onload = () => {
    renderYears();
    renderEmissionData();
    let _scope2Data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    renderChart(_scope2Data);
}

function renderYears() {
    let content = '';
    for(let year of years) {
        if(year == currentYear) {
            content += `<a class="dropdown-item selectpicker" href="#">${year}</a>`;
        } else {
            content += `<a class="dropdown-item" href="#">${year}</a>`;
        }
    }
    document.getElementById('years').innerHTML = content;
    document.getElementById('selectedYear').innerHTML = currentYear;
}

var emissionData = [
    {
        type: 1,
        scope: 1,
        contributor: 'Stationary combustion',
        months: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: "",
            11: "",
            12: ""
        },
        total: "",
        offsets: "",
        net: ""
    },
    {
        type: 2,
        scope: 1,
        contributor: 'Mobile sources',
        months: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: "",
            11: "",
            12: ""
        },
        total: "",
        offsets: "",
        net: ""
    },
    {
        type: 3,
        scope: 2,
        contributor: 'Purchased electricity',
        months: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: "",
            11: "",
            12: ""
        },
        total: "",
        offsets: "",
        net: ""
    },
    {
        type: 4,
        scope: 2,
        contributor: 'Purchased steam, heat and cooling',
        months: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: "",
            11: "",
            12: ""
        },
        total: "",
        offsets: "",
        net: ""
    },
    {
        type: 5,
        scope: 3,
        contributor: 'Employee commuting',
        months: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: "",
            11: "",
            12: ""
        },
        total: "",
        offsets: "",
        net: ""
    },
    {
        type: 6,
        scope: 3,
        contributor: 'Commuting - Home office equipment',
        months: {
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
            6: "",
            7: "",
            8: "",
            9: "",
            10: "",
            11: "",
            12: ""
        },
        total: "",
        offsets: "",
        net: ""
    }
];

function renderEmissionData() {
    let content = '';
    for(let i=0; i<emissionData.length; i++) {
        content += '<tr>';
        content += `<td><div style="background: ${emissionData[i].scope == 1 ? 'purple': emissionData[i].scope == 2 ? 'red': 'orange'}">${emissionData[i].scope}</div></td>`;
        content += `<td>${emissionData[i].contributor}</td>`;
        for(let j=7; j<=12; j++) {
            content += `<td onclick="renderModal(${emissionData[i].scope}, ${emissionData[i].type}, ${j})" style="text-align: center; cursor: pointer;">
                ${emissionData[i].months[j] == "" ? '<span style="color: blue;">+</span>': emissionData[i].months[j] }
            </td>`;
        }
        content += `<td style="text-align: center;">
                ${emissionData[i].total == "" ? "0" : emissionData[i].total}
            </td>`;
        content += `<td onclick="alert('open modal')" style="text-align: center; cursor: pointer;" >
                ${emissionData[i].offsets == "" ? '<span style="color: blue;">+</span>' : emissionData[i].offsets}
            </td>`;
        content += `<td style="text-align: center;">
                ${emissionData[i].net == "" ? "0": emissionData[i].net}
            </td>`;
        content += '</tr>'
    }
    document.getElementById('emissionData').innerHTML = content;
}

function getMonthById(_id) {
    switch(_id) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sep";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
    }
}

function renderModal(scopeId, scopeType, month) {
    if(scopeId == 2) {
        $('#activityOutput').val('');
        $('#activityInput').val('');
        $('#activityOffsetInput').val('');
        $('#modalTxnHash').html('');
        
        let emissionFactor = 0.3712;
        $('#emissionFactor').html(emissionFactor);
        
        $('#modalTitle').html(emissionData[scopeType-1].contributor);
        $('#modalMonthTitle').html(getMonthById(month)+" "+currentYear);
        $('#modalMonthTitleDesc').html("Electricity your organization buy from a utility company or another supplier");

        $('#modalScopeId').html(scopeId);
        $('#modalScopeType').html(scopeType);
        $('#modalMonthId').html(month);
    }
    $('#myModal').modal();
}

function calculate() {
    let scopeId = $('#modalScopeId').html();
    if(scopeId == 2) {
        let emissionFactor = $('#emissionFactor').html();
        let activityInput = $('#activityInput').val();
        let activityOffsetInput = $('#activityOffsetInput').val();

        if(activityInput == "") {
            activityInput = 0;
        }
        if(activityOffsetInput == "") {
            activityOffsetInput = 0;
        }

        let ouput = ((parseFloat(activityInput) - parseFloat(activityOffsetInput)) * parseFloat(emissionFactor))/1000;
        $('#activityOutput').val(parseFloat(ouput).toFixed(4));
    }
}