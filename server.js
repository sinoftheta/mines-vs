// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const cors = require('cors');
const { ExpressPeerServer } = require("peer");

const app = express();
app.use(cors());

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const port = process.env.VUE_APP_PORT || 8081;

/*
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public")); // uncommenting this can cause break
*/

// listen for requests
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


// peerjs server
const peerServer = ExpressPeerServer(listener, {
  debug: process.env.VUE_APP_PEER_DEBUG_LEVEL,
  path: '/',
  ssl: {},
});

app.use('/', peerServer);
