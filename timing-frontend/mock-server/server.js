// - D E P E N D E N C I E S
require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const bodyParser = require("body-parser");
const server = require('http').createServer();
const io = require('socket.io')(server);
const app = { locals: {} };
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// - S E R V E R   C O N F I G U R A T I O N
app.locals.appname = `${process.env.APPLICATION_NAME}`;
app.locals.version = `${process.env.APPLICATION_VERSION}`;
app.locals.port = `${process.env.PORT}`;

// Create the Pusher client
// const pusher = new Pusher({
//     appId: `${process.env.PUSHER_APP_ID}`,
//     key: `${process.env.PUSHER_API_KEY}`,
//     secret: `${process.env.PUSHER_API_SECRET}`,
//     cluster: `${process.env.PUSHER_APP_CLUSTER}`,
//     encrypted: true
// });
// - I N I T I A L I Z A T I O N
let timerId = null;
let sockets = new Set();
let timmingSequence = 0;

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


    // socket.emit('request'); // emit an event to the socket
    // io.emit('broadcast'); // emit an event to all connected sockets
    // socket.on('reply', () => { /* … */ }); // listen to the event
});
console.log("Node Express server for " + app.locals.appname +
    " listening on port [" + app.locals.port + "]");
server.listen(process.env.PORT || app.locals.port || 3100);


// app.listen(process.env.PORT || app.locals.port || 3100, function() {
// });
// startTimer();

const DS_EVENT_CHANNEL_NAME = 'ds-events-channel';
const DS_EVENT_NAME = 'ds-timing-data';
const DS_DELAY = 10000;

// - M O C K   T I M I N G
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
    // for (const s of sockets) {
    // console.log(`Emitting value: ${data} for client ${s.id}`);
    console.log(`Emitting value: ${JSON.stringify(data)}`);
    counter++;
    io.emit(DS_EVENT_NAME, JSON.stringify(data));
    // }
}

function random(limit, digits) {
    let rand = Math.floor(Math.random() * digits);
    return rand * digits / limit;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}