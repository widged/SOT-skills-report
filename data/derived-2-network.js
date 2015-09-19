#!/usr/bin/env babel-node

/* jshint esnext: true */

import fs from 'fs';

var sep = '\t';

var levelIn = [ 'Paid' ]; // [ 'Academic', 'Interested', 'Paid', 'Practical' ];
var categoryIn = [ 'Design' ]; // 
var skills = getNodes('derived/skills.tsv', sep, function([category, type, skill, level, count, user_ids], map) {
	if(levelIn.indexOf(level) === -1) { return; } 
//	if(categoryIn.indexOf(category) === -1) { return; } 
	return Object.assign({category, type, skill, level, user_id: user_ids.split(/\s+/)});
}); 

function nextId(list) {
	return (list.length + 1).toString();
}

function addNode(nodes, maps, type, label, assign) {
	var id = nextId(nodes);
	if(!maps.hasOwnProperty(type))  { maps[type] = {}; }
	if(!maps[type].hasOwnProperty(label)) { 
		maps[type][label] = id; 
		nodes.push(Object.assign(assign, {id: id, label: label }));
	}
}

function addEdge(edges, maps, [typeFrom, labelFrom], [typeTo, labelTo]) {
	edges.push({
		id: nextId(edges), 
		from: maps[typeFrom][labelFrom],
		to: maps[typeTo][labelTo]
	});
}



var {nodes, edges} = skills.reduce(({nodes, edges, maps}, {category, type, skill, level, user_id}, i) => {
	addNode(nodes, maps, 'skill', skill, {group: 0});
	addNode(nodes, maps, 'type', type, {group: 1});
	addNode(nodes, maps, 'category', category, {group: 2});
	addEdge(edges, maps, ['skill', skill], ['category', category]);
	addEdge(edges, maps, ['skill', skill], ['type', type]);
	user_id.forEach((d) => {
		addNode(nodes, maps, 'user_id', d, {group: 3});
		addEdge(edges, maps, ['skill', skill], ['user_id', d]);
	});

	return {nodes, edges, maps};
}, {nodes: [], edges: [], maps: {}});


fs.writeFileSync('network/nodes.jsonp', 'var jsonp_nodes = ' + JSON.stringify(nodes, null, 2));
fs.writeFileSync('network/edges.jsonp', 'var jsonp_edges = ' + JSON.stringify(edges, null, 2));

/*
	if(d.type === 'user_id') {  userMap[d.label] = nodeId; }
	if(d.type === 'skill' && d.user_id) {
		d.user_id.forEach((u, i) => {
			edges.push({
				id: (edges.length+1).toString(), 
				from: (userMap[u.toString()]).toString(), 
				to: nodeId
			});
		});
	}

*/

function getNodes(file, sep, lineFn) {
	var content = fs.readFileSync(file, 'utf8');
	var lines  = content.split('\n');
	var first = lines.shift();
	var cols = first.split(sep);
	return lines.reduce((acc, d) => {
		var o;
		if(typeof lineFn === 'function') { o = lineFn(d.split(sep)); }
		if(o !== undefined) { acc.push(o); }
		return acc;
	}, []);
}

