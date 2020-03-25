// - D E P E N D E N C I E S
require("dotenv").config();
const server = require('http').createServer();
const app = { locals: {} };
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

// - R E A D E R   C O N F I G U R A T I O N
app.locals.appname = `${process.env.APPLICATION_NAME}`;
app.locals.version = `${process.env.APPLICATION_VERSION}`;
app.locals.portName = `${process.env.SERIAL_PORT_NAME}`;
const DS_EVENT_CHANNEL_NAME = 'ds-events-channel';
const DS_EVENT_NAME = 'ds-timing-data';
const DS_DELAY = 5000;

// - I N I T I A L I Z A T I O N
let timerId = null;
let sockets = new Set();
let timmingSequence = 0;
const port = new SerialPort(app.locals.portName, { baudRate: 9600 })
console.log('Reading data from device: ' + app.locals.portName)
const parser = new Readline()

// - L I S T E N
io.on('connection', socket => {
    // Add a new client connection to the list of sockets.
    sockets.add(socket);
    console.log(`> Socket ${socket.id} added`);
    if (!timerId) {
        startTimer();
    }

    socket.on('disconnect', () => {
        console.log(`> Deleting socket: ${socket.id}`);
        sockets.delete(socket);
        console.log(`> Remaining sockets: ${sockets.size}`);
    });
});
console.log("Node Express server for " + app.locals.appname +
    " listening on port [" + app.locals.port + "]");
server.listen(process.env.PORT || app.locals.port || 3100);

// - R E A D   L O O P
port.pipe(parser)
parser.on('data: ', line => {
    console.log(`> ${line}`)
    sendDataEvents(decodeDSTimingData(dsBinaryData));
})

function startTimer() {
    // Simulate DS timing data
    timerId = setInterval(() => {
        // Decode the DS timing binary data and then push this to the front end clients.
        let dsBinaryData = 'E0-22-15-03-00-04-4C-1B-00-00-20-00-11-00-00-12-40-10-38-00-EB-00';
        // Push to the channel
        // console.log('>>> Pushing event data: ' + JSON.stringify(decodeDSTimingData(dsBinaryData)));
        sendDataEvents(decodeDSTimingData(dsBinaryData));
    }, DS_DELAY);
}
function decodeDSTimingData(binaryData) {
    timmingSequence++;
    let lane = Math.floor(getRandomArbitrary(1, 9));
    let seconds = getRandomArbitrary(12, 18);
    let fraction = (seconds - Math.floor(seconds)) * 10000;
    let eventData = {
        "transmissionSequence": timmingSequence,
        "dsModel": "DS300",
        "typeOfDSRecord": 0,
        "dsFunctionType": 0,
        "laneNumber": lane,
        "numberOfLaps": 8,
        "timingData": {
            "hours": 0,
            "minutes": 0,
            "seconds": Math.floor(seconds),
            "fraction": Math.floor(fraction)
        }
    };
    return eventData;
}
function sendDataEvents(data) {
    let counter = 1;
    console.log(`Emitting value: ${JSON.stringify(data)}`);
    counter++;
    io.emit(DS_EVENT_NAME, data);
}
