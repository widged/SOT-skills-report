#!/usr/bin/env babel-node

/* jshint esnext: true */

import LinesExporter from './LinesExporter.es6.js';
import categories from './derived/categories.json';
import fs from 'fs';

function itemAdder(acc, category, type) {
	return function(d) {
		acc.push([d, type, category]);
	};
}

var flat = categories.reduce((acc, {category, skills, tools}, i) => { 
	if(i === 0) { acc = []; }
	skills.forEach(itemAdder(acc, category, 'skill'));
	tools.forEach(itemAdder(acc, category, 'tool'));
	return acc;
}, null);

var exporter = new LinesExporter.getExporter('tsv');
var lines = exporter.dump(flat, 'skill,type,category'.split(','));
fs.writeFileSync(`derived/categories-flat.${lines.ext}`, lines.content);