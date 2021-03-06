'use strict';

const {app, BrowserWindow} = require('electron')

let win;

app.on('ready', () => {
    win = new BrowserWindow({width: 1480, height: 920});

    win.loadFile('./source/index.html');

    if (process.argv.indexOf('--dev') > -1) {
        win.webContents.openDevTools();
    }

    win.on('close', () => {
        win = null;
    });
});