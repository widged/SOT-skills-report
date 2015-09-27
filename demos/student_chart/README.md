The code that can be reused across projects is in the components folder. 

The demo is in the usage folder. 

All code is written using a es6 syntax. 

It can run as is in an [electron environment](https://github.com/atom/electron). 

If `electron` is not already installed globally on your machine. 
    
    npm install -g electron-prebuilt

Then open a command line utility: 
    
    cd path/to/SOT-skills-report/demos/student_chart/usage/
    electron .

The code needs to be transpiled to run into a traditional browser. The easiest way to manage this is with babel and webpack. 

If `babel` and `webpack` are not already installed globally on your machine, follow [these instructions](http://www.2ality.com/2015/04/webpack-es6.html)

Then, open a command line utility: 
    
    cd path/to/SOT-skills-report/demos/student chart/
    webpack

This will convert `script.es6.js` and any code file that it imports to `es5-script.es5.js`. Once the conversion is done, navigate to `es5-index.html` in your browser.

Because the demo loads data, dynamically, it must run in a server environment. On OSX, double click on `_server.command`. Otherwise, read these tips on [Running Code over a server](https://github.com/widged/data-for-good/wiki/Coding-::-d3js).
