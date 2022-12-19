// -----------------------  Variables Declarations   ----------------------- //

// HTML Paramters Value
let temperatureCardValue = document.getElementById('temp'),
    phCardValue = document.getElementById('ph'),
    bloodFlowRateCardValue = document.getElementById('flow-rate'),
    levelCardValue = document.getElementById('level'),
    pressureCardValue = document.getElementById('pressure'),
    HCO3CardValue = document.getElementById('hco3-conc'),
    leakageCardValue = document.getElementById('leak'),
    dialsateFlowRateCardValue = document.getElementById('dFlowRate')

// Card of Dialsyate Level Settings
let cardOfLevel = document.getElementById('levelCard'),
    levelCardTitle = document.getElementById('levelCardTitle'),
    backgroundColor = cardOfLevel.style.backgroundColor,
    defaultColor  = levelCardTitle.style.color

// audio file to be played
let audio = new Audio('../assets/mixkit-facility-alarm-908.mp3')

// error message vars
let error,
    errorCount = 0;

// Parameters data ranges
let pressureData = [100,200,300,400],
    bloodFlowRateData = [200,250,300,350,400,450],
    dialsateFlowRateData = [500,600,700,800],
    phData = [7.3,7.34,7.4,7.44],
    changeTimeCounter = 0;

// At the application start up -> error = false
window.onload = __ => {
    error = false
}

// -----------------------  get the data from the serial port (Server)  ----------------------- //

// Variables to store the response data
let responseTemp = 0,
    responseDistance = 0;

function getArduinoData() {
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

    // Update the measured parameters card values
    temperatureCardValue.innerHTML = responseTemp + " °C"
    levelCardValue.innerHTML = responseDistance + " cm"

    // Update other card values sync with time
    if (changeTimeCounter === 20){
        phCardValue.innerHTML = (phData[getRandomInt(phData.length)]).toString()
        dialsateFlowRateCardValue.innerHTML = dialsateFlowRateData[getRandomInt(dialsateFlowRateData.length)] + " mL/s"
        bloodFlowRateCardValue.innerHTML = bloodFlowRateData[getRandomInt(bloodFlowRateData.length)] + " mL/s"
        pressureCardValue.innerHTML = pressureData[getRandomInt(pressureData.length)] + " mmHg"
        changeTimeCounter = 0
    }

    changeTimeCounter++
}

function rePlotData(){
    Plotly.extendTraces('chartjs-dashboard-line', {y: [[getData()]]}, [0]);
    cnt++;
    if (cnt > 20) {
        Plotly.relayout('chartjs-dashboard-line', {
            xaxis: {
                range: [cnt - 20, cnt],
                showgrid: false
            },
        });
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Function that executes getArduinoData function every 1 second
setInterval(function () {
    getArduinoData()
    rePlotData()

    error = responseDistance > 60;

    if (error) {
        if (errorCount === 0){
            Swal.fire({
                icon: 'warning',
                text: 'Dialysate need to be refiled',
            })
            errorCount = 1
        }

        if (backgroundColor === 'white') {
            cardOfLevel.style.backgroundColor = 'red'
            backgroundColor = 'red'
            levelCardValue.style.color = 'white'
            levelCardTitle.style.color = 'white'
        } else {
            cardOfLevel.style.backgroundColor = 'white'
            backgroundColor = 'white'
            levelCardValue.style.color = 'black'
            levelCardTitle.style.color = 'black'
        }

        audio.play();
        audio.loop = true;
        sleep(450)
    }

}, 150);


// ----------------------- Ploting Values ----------------------- //

function getData() {
    // return Math.random()
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


