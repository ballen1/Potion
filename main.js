'use strict';

const {app, BrowserWindow} = require('electron')

let win;

app.on('ready', () => {
    win = new BrowserWindow({width: 800, height: 600});

    win.loadFile('index.html');

    win.on('close', () => {
        win = null;
    });
});