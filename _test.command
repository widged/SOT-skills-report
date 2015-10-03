#!/bin/bash
cd "$(dirname "$0")"
mocha --compilers js:babel/register ./test/*.spec.js ./src/**/*.spec.js