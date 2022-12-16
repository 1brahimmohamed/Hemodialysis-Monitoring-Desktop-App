// -----------------------  Variables Declarations   ----------------------- //

let temperatureCardValue = document.getElementById('temp')
let phCardValue = document.getElementById('ph')
let flowRateCardValue = document.getElementById('flowrate')
let speedCardValue = document.getElementById('speed')

// -----------------------  get the data from the serial port (Server)  ----------------------- //

// Variable to store the response

let responseTemp = 0,
    responseDistance = 0;
function getArduinoData(){
    // Make the request
    $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:9000',
        body: null,
        dataType: 'json',
        async: false,
        success: function (res, status, xhr) {
            responseTemp = parseFloat(res.body.temperature)
            responseDistance = parseFloat(res.body.distance)
        }
    });

    // Update the card values
    temperatureCardValue.innerHTML = responseTemp + " °C"
    phCardValue.innerHTML =  responseDistance + " m"
    // flowRateCardValue.innerHTML = (Math.round(((3/2)*(7/5)*(response/20))*100)/100).toString() + " m/s"
    // speedCardValue.innerHTML = (Math.round(((7/4)*(3/5)*(response/20))*100)/100).toString() + " m/s"
}

// Function that executes getArduinoData function every 1 second
setInterval(function () {
    getArduinoData()
}, 150);


// ----------------------- Ploting Values ----------------------- //

function getData() {
    return responseDistance;
}

let data = [{
    y: [getData()],
    mode: "lines",
    type: "scatter",
}]

let config = {
    responsive: true,
    editable: false,
    displaylogo: false,
    displayModeBar: false
};

let layout = {
    xaxis: {
        showgrid: false
    }
};

Plotly.newPlot(
    'chartjs-dashboard-line',
    data,
    layout,
    config
);

let cnt = 0;

setInterval(function(){

    Plotly.extendTraces('chartjs-dashboard-line',{ y:[[getData()]]}, [0]);
    cnt++;
    if(cnt > 20) {
        Plotly.relayout('chartjs-dashboard-line',{
            xaxis:{
                range: [cnt-20, cnt],
                showgrid: false
            },
        });
    }
},150);