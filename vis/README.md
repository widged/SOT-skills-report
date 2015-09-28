The code needs to be transpiled to run into a traditional browser. The easiest way to manage this is with babel and webpack. 

If `babel` and `webpack` are not already installed globally on your machine, follow [these instructions](http://www.2ality.com/2015/04/webpack-es6.html)

Then, open a command line utility: 
    
    cd path/to/SOT-skills-report/vis
    webpack

This will convert `bundle.es6.js` and any code file that it imports to `dist/bundle.es5.js`. Once the conversion is done, navigate to `dist/index.html` in your browser.

All data files are in a jsonp format, so there is no requirement to run the file over a server. Simply double click on `dist/index.html` to open it in your browser.
