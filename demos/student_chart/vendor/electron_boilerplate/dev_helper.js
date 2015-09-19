'use strict';

var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');

module.exports.setDevMenu = function () {
    var devMenu = Menu.buildFromTemplate([
        {
            label: 'Electron',
            submenu: [{
        label: 'About Electron',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            submenu: []
          }]
        },
        {
            label: 'Development',
            submenu: [{
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function () {
                    BrowserWindow.getFocusedWindow().reloadIgnoringCache();
                }
            },{
                label: 'Toggle DevTools',
                accelerator: 'Alt+CmdOrCtrl+I',
                click: function () {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }
            },{
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: function () {
                    app.quit();
                }
            }]
        }, {
            label: 'Edit',
            submenu: [
              {
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:'
              },
              {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
              },
              {
                type: 'separator'
              },
              {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:'
              },
              {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:'
             }]
        }
    ]);
    Menu.setApplicationMenu(devMenu);
};
