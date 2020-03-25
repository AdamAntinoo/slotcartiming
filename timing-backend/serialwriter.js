// - D E P E N D E N C I E S
// require("dotenv").config()
// const server = require('http').createServer()
// const io = require('socket.io')(server)
// const app = { locals: {} }
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const laneDecodeTable = [
    { laneCode: "80", laneNumber: 1 },
    { laneCode: "40", laneNumber: 2 },
    { laneCode: "20", laneNumber: 3 },
    { laneCode: "10", laneNumber: 4 },
    { laneCode: "08", laneNumber: 5 },
    { laneCode: "04", laneNumber: 6 },
    { laneCode: "02", laneNumber: 7 },
    { laneCode: "01", laneNumber: 8 }
];

const portName = '/dev/pts/3'
const port = new SerialPort(portName, { baudRate: 9600 })
console.log('Writing data to device: ' + portName)
// - WRITE DUMMY DTA TO SERIAL PORT
let counter = 0;
setInterval(function () {
    let data = generateData()
    port.write(data + '\n')
    console.log('Test data:' + data)
}, 3000);

function generateData() {
    let lane = Math.floor(getRandomArbitrary(1, 9));
    let laneCode = encodeLane(lane)
    let seconds = getRandomArbitrary(12, 18);
    let fraction = (seconds - Math.floor(seconds)) * 100;
    return 'E0-22-15-03-00-04-4C-1B-00-00-' + laneCode + '-00-11-00-00-' +
        ("00" + Math.floor(seconds)).slice(-2) + '-' +
        ("00" + Math.floor(fraction)).slice(-2) + '-00-38-00-EB-00'
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function encodeLane(lane) {
    for (let i = 0; i < laneDecodeTable.length; i++) {
        if (laneDecodeTable[i].laneNumber == lane)
            return laneDecodeTable[i].laneCode;
    }
}

// DS-300 Serial data record definition
// 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22
// E0-22-15-03-00-04-4C-1B-00-00-20-00-11-00-00-12-40-10-38-00-EB-00
// |        |           |     |  |  |  |  |           |
// Start byte           |     A9H - Fast lap          |
//          |           |        |  |  |  |           |
//          DS model type        |  Lap count:100 laps|
//                      |        |     Lap count      |
//                      Type of record (Timing data)  |
//                               |        |           |
//                               Lane number          |
//                                        |           v
//                                        Hours - Minutes - Seconds - Tenth/Hundreth - Thousandth - Tenth of Thousandth
