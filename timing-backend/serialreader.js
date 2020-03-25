// - D E P E N D E N C I E S
require("dotenv").config();
const server = require("http").createServer();
const io = require("socket.io")(server);
const app = { locals: {} };
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

// - R E A D E R   C O N F I G U R A T I O N
app.locals.appname = `${process.env.APPLICATION_NAME}`;
app.locals.version = `${process.env.APPLICATION_VERSION}`;
app.locals.portName = `${process.env.SERIAL_PORT_NAME}`;
app.locals.baudRate = `${process.env.SERIAL_PORT_BAUDRATE}`;
const DS_EVENT_CHANNEL_NAME = "ds-events-channel";
const DS_EVENT_NAME = "ds-timing-data";
const DS_DELAY = 5000;
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

// - I N I T I A L I Z A T I O N
let sockets = new Set();
let timmingSequence = 0;
const port = new SerialPort(app.locals.portName, {
  baudRate: parseInt(app.locals.baudRate)
});
console.log("Reading data from device: " + app.locals.portName);
const parser = port.pipe(new Readline({ delimiter: "\n" }));

// - L I S T E N
io.on("connection", socket => {
  // Add a new client connection to the list of sockets.
  sockets.add(socket);
  console.log(`> Socket ${socket.id} added`);
  socket.on("disconnect", () => {
    console.log(`> Deleting socket: ${socket.id}`);
    sockets.delete(socket);
    console.log(`> Remaining sockets: ${sockets.size}`);
  });
});
console.log(
  "Node Express server for " +
  app.locals.appname +
  " listening on port [" +
  process.env.PORT +
  "]"
);
server.listen(process.env.PORT || app.locals.port || 3100);

// - R E A D   L O O P
parser.on("data", data => {
  console.log(`> ${data}`);
  console.log("Processing data...");
  if (data.toLowerCase() === "exit") process.exit();
  sendDataEvents(decodeDSTimingData(data));
});

function decodeDSTimingData(binaryData) {
  timmingSequence++;
  let lane = decodeLane(binaryData);
  console.log("DEC> Detected lane: " + lane);
  let laps = decodeLapCount(binaryData);
  console.log("DEC> Detected laps: " + laps);
  let fraction = decodeSecondsFraction(binaryData);
  console.log("DEC> Detected fraction: " + fraction);
  let eventData = {
    transmissionSequence: timmingSequence,
    dsModel: decodeDSModel(binaryData),
    typeOfDSRecord: decodeRecordType(binaryData),
    laneNumber: lane,
    numberOfLaps: laps,
    timingData: {
      hours: decodeHour(binaryData),
      minutes: decodeMinutes(binaryData),
      seconds: decodeSeconds(binaryData),
      fraction: fraction
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
function decodeDSModel(binaryData) {
  let bytes = binaryData.split("-");
  if (bytes[3] === "02") return "DS-200";
  if (bytes[3] === "03") return "DS-300";
  return "NOT-RECONGNIZED-DS";
}
function decodeRecordType(binaryData) {
  let bytes = binaryData.split("-");
  if (bytes[7] === "1B") return "TIMING";
  else return "UNDEFINED";
}
function decodeLane(binaryData) {
  let bytes = binaryData.split("-");
  let laneCode = bytes[10];
  console.log("DEC> Detected lane code: " + laneCode);
  for (let i = 0; i < laneDecodeTable.length; i++) {
    if (laneDecodeTable[i].laneCode == laneCode)
      return laneDecodeTable[i].laneNumber;
  }
  return 0;
}
function decodeLapCount(binaryData) {
  let bytes = binaryData.split("-");
  return parseInt(bytes[11]) * 100 + parseInt(bytes[12]);
}
function decodeHour(binaryData) {
  let bytes = binaryData.split("-");
  return parseInt(bytes[13]);
}
function decodeMinutes(binaryData) {
  let bytes = binaryData.split("-");
  return parseInt(bytes[14]);
}
function decodeSeconds(binaryData) {
  let bytes = binaryData.split("-");
  return parseInt(bytes[15]);
}
function decodeSecondsFraction(binaryData) {
  let bytes = binaryData.split("-");
  return parseInt(bytes[16] + bytes[17]);
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
