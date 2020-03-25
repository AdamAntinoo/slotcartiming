// - D E P E N D E N C I E S
// require("dotenv").config()
// const server = require('http').createServer()
// const io = require('socket.io')(server)
// const app = { locals: {} }
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

// const app = express();
const portName = '/dev/pts/1'
const port = new SerialPort(portName, { baudRate: 9600 })
console.log('Writing data to device: ' + portName)
// - WRITE DUMMY DTA TO SERIAL PORT
let counter = 0;
setInterval(function () {
    port.write('Test data:' + counter + '\n')
    console.log('Test data:' + counter + '\n')
}, 3000);
