# 'Summer of Tech' Skills Report Challenge

This github project was created to support and centralize the efforts of the group taking on the Skills Report challenge at the August  2015 [Wellington Data for Good](http://www.meetup.com/Hack-Miramar/events/224192543) meetup. 

[Group notes](https://docs.google.com/document/d/10ujvjJXDAXYKTz_-oU6z2l22B4H0dNfFn1DTSdHoe3c/edit?pli=1) on Google Docs.

Please ask [@widged](https://twitter.com/widged) for the sharing link if you are part of Wellington Data for Good and keen to contribute. 


## Install dependencies

    cd SOT-skills-report
    npm install

## Test

    cd SOT-skills-report
    npm run unittest

## Deploy (transpile to es5)

Babel and webpack are used for transpiling. Instructions on how to install webpack and babel can be found at: http://www.2ality.com/2015/04/webpack-es6.html

    cd SOT-skills-report
    webpack
    open dist/index.html