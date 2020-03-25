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
console.log('Reading data from device: ' + portName)
// - WRITE TO CONSOLE SERIAL DATA
const parser = new Readline()
port.pipe(parser)

parser.on('data: ', line => console.log(`> ${line}`))
