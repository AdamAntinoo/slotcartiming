require("dotenv").config();
const cors = require("cors");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// Load the middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// - S E R V E R   C O N F I G U R A T I O N
app.locals.appname = `${process.env.APPLICATION_NAME}`;
app.locals.version = `${process.env.APPLICATION_VERSION}`;
app.locals.port = `${process.env.PORT}`;

// Create the Pusher client
const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});

// - L I S T E N
app.listen(process.env.PORT || app.locals.port || 3100, function() {
    console.log("Node Express server for " + app.locals.appname +
        " listening on port [" + app.locals.port + "]");
});
startTimer();

const DS_EVENT_CHANNEL_NAME = 'ds-events-channel';
const DS_EVENT_NAME = 'my-event';

// - M O C K   T I M I N G
function startTimer() {
    // Simulate DS timing data
    timerId = setInterval(() => {
        // Decode the DS timing binary data and then push this to the front end clients.
        let dsBinaryData = 'E0-22-15-03-00-04-4C-1B-00-00-20-00-11-00-00-12-40-10-38-00-EB-00';
        // Push to the channel
        pusher.trigger(DS_EVENT_CHANNEL_NAME, DS_EVENT_NAME, decodeDSTimingData(dsBinaryData));
        console.log('>>> Pushing event data: ' + JSON.stringify(decodeDSTimingData(dsBinaryData)));
    }, 1000);
}

function decodeDSTimingData(binaryData) {
    return {
        "transmissionSequence": 1,
        "dsModel": "DS300",
        "typeOfDSRecord": 0,
        "dsFunctionType": 0,
        "laneNumber": 3,
        "numberOfLaps": 8,
        "timingData": {
            "hours": 0,
            "minutes": 0,
            "seconds": 12,
            "fraction": 8652
        }
    }
}