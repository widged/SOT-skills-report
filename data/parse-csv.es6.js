#!/usr/bin/env babel-node

/* jshint esnext: true */

import DataParser from './SotCsvParser.es6.js';

DataParser.parse(DataParser.EXPORT_FORMAT.JSON);

