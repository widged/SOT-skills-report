var ElectronApp = require('../vendor/electron_boilerplate/electron_app');

ElectronApp.load(
  'file://' + __dirname + '/index.html',
  '../vendor/react-devtools'
);