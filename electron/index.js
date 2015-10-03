var ElectronApp = require('./lib/electron_boilerplate/electron_app');

ElectronApp.load(
  'file://' + __dirname + '/index.html',
  './lib/react-devtools'
);