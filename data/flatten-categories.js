#!/usr/bin/env babel-node

/* jshint esnext: true */

import categories from './derived/categories.json';

function itemAdder(acc, category, type) {
	return function(d) {
		acc.push({skill: d, type, category});
	};
}

var flat = categories.reduce((acc, {category, skills, tools}, i) => { 
	if(i === 0) { acc = []; }
	skills.forEach(itemAdder(acc, category, 'skill'));
	tools.forEach(itemAdder(acc, category, 'tool'));
	return acc;
}, null);

console.log(flat);
