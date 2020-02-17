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

// pusher.trigger('my-channel', 'my-event', {
//     "message": "hello world"
// });

// - L I S T E N
app.listen(process.env.PORT || app.locals.port || 3100, function() {
    console.log("Node Express server for " + app.locals.appname +
        " listening on port [" + app.locals.port + "]");
});