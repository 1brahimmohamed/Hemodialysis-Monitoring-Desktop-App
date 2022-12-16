// -----------------------  Variables Declarations   ----------- //

let temperatureCardValue = document.getElementById('temp')
let phCardValue = document.getElementById('ph')
let flowRateCardValue = document.getElementById('flowrate')
let speedCardValue = document.getElementById('speed')

// -----------------------  get the data from the serial port (Server)  ----------- //

function getArduinoData(){
    let response = 0
    $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:9000',
        body: null,
        dataType: 'json',
        async: false,
        success: function (res, status, xhr) {
            response = parseFloat(res.data)
        }
    });
    temperatureCardValue.innerHTML = response + " °C"
    phCardValue.innerHTML = (Math.round(((2)*(8/5)*(response/20))*100)/100).toString()
    flowRateCardValue.innerHTML = (Math.round(((3/2)*(7/5)*(response/20))*100)/100).toString() + " m/s"
    speedCardValue.innerHTML = (Math.round(((7/4)*(3/5)*(response/20))*100)/100).toString() + " m/s"


}

let arduinoDataInterval = setInterval(function () {
    getArduinoData()
}, 1000);