/* jshint esnext: true */

var FN = {};
FN.load = function(url, reactdevtools) {

  var app = require('app');  // Module to control application life.
  var BrowserWindow = require('browser-window');  // Module to create native browser window.
  var devHelper = require('./dev_helper');


  // Report crashes to our server.
  require('crash-reporter').start();

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the javascript object is GCed.
  var mainWindow = null;

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
      app.quit();
  });

  // This method will be called when Electron has done everything
  // initialization and ready for creating browser windows.
  app.on('ready', function() {
    // Create the browser window.

    BrowserWindow.addDevToolsExtension(reactdevtools);
    mainWindow = new BrowserWindow({width: 1000, height: 800});

    // and load the index.html of the app.
    mainWindow.loadUrl(url);

    devHelper.setDevMenu();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  });    

}  
module.exports = FN;