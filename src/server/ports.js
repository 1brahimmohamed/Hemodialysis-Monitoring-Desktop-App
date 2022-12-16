const {SerialPort} = require('serialport')
const {ReadlineParser} = require('@serialport/parser-readline')
const express = require('express')
const cors = require('cors')

// Create the application
const app = express()
const portNum = 9000

// app.use('/', express.static('public'));
//  CORS Security
app.use(cors())

let arduinoData = 0;

// -----------------  Server End Points ----------------- //
app.post('/', (req, res) => {
    res.send({"update": arduinoData})
});


app.listen(portNum, () => {
    console.log(`Listening at http://localhost:${portNum}`)
})


// -----------------  Arduino Connection Setup ----------------- //

// Create a port
const port = new SerialPort({
    path: 'COM9',
    baudRate: 9600,
})

const parser = new ReadlineParser()
port.pipe(parser)

port.on('open', function () {
    console.log('Connected Successfully')
})

// Switches the port into "flowing mode"
parser.on('data', function (serialPortData) {
    arduinoData = serialPortData
    console.log(serialPortData)
})
