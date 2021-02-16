// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require("electron");
const { performance } = require("perf_hooks");
const WebSocket = require("ws");

let id = 0;

const ws = new WebSocket("ws://localhost:1337");

setInterval(() => {
  ipcRenderer.send("PING", {
    id: id++,
    timeOrigin: performance.timeOrigin,
    timeSent: performance.now()
  });

  ws.send(JSON.stringify({
    id: id++,
    timeOrigin: performance.timeOrigin,
    timeSent: performance.now()
  }));
}, 100);
