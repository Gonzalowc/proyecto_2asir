const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url = require('url')

function createWindow(){
    win = new BrowserWindow({widht: 800, height: 600})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))
}

app.on('ready', createWindow)